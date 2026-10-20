import { useEffect, useRef } from 'react';
import { SIGNED_OUT_EVENT, useAuth } from '@/hooks/useAuth';
import {
  fetchGames,
  fetchReview,
  fetchStudyDays,
  fetchToeic,
  mergeGames,
  mergeReview,
  mergeStudy,
  mergeToeic,
  pruneReviewSessions,
  pushGames,
  pushReview,
  pushStudyDays,
  pushToeic,
  reviewRows,
} from '@/lib/cloudSync';
import {
  GAMES_CHANGED_EVENT,
  GAMES_SAVED_EVENT,
  clearGameProgress,
  loadGameProgress,
  saveGameProgress,
} from '@/lib/gameProgress';
import {
  TOEIC_CHANGED_EVENT,
  TOEIC_SAVED_EVENT,
  clearToeicProgress,
  loadToeicProgress,
  saveToeicProgress,
} from '@/lib/toeicProgress';
import { REVIEW_SAVED_EVENT, clearReview, loadReview, saveReview } from '@/lib/toeicReview';
import { clearStudy, getStudySnapshot, markTouchedDays, replaceStudyMap, takeTouchedDays } from '@/lib/studyTime';

/**
 * Đồng bộ streak (flex_study_days), tiến độ trò chơi (flex_games) và điểm TOEIC (flex_toeic) và dữ liệu ôn tập TOEIC (flex_toeic_review) lên Supabase khi đã đăng nhập.
 * - Đăng nhập: kéo bản cloud về, gộp với bản trên máy (không bên nào bị mất), rồi đẩy phần mới hơn lên.
 * - Sau đó: đẩy ngày học mỗi 30 giây / khi ẩn tab; đẩy tiến độ trò chơi 1,5 giây sau mỗi lần lưu.
 * - Chỉ đẩy sau khi đã gộp xong, để bản cũ trên máy không ghi đè bản mới trên cloud.
 */
export function useExtrasSync() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const ready = useRef(false);
  const lastGames = useRef<Record<string, string>>({});
  const lastToeic = useRef<Record<string, string>>({});
  const lastReview = useRef<Record<string, string>>({});

  // 1) Gộp khi đăng nhập
  useEffect(() => {
    ready.current = false;
    if (!userId) return;
    let cancelled = false;
    (async () => {
      try {
        const [cloudStudy, cloudGames, cloudToeic, cloudReview] = await Promise.all([fetchStudyDays(), fetchGames(), fetchToeic(), fetchReview()]);
        if (cancelled) return;
        const s = mergeStudy(getStudySnapshot(), cloudStudy);
        replaceStudyMap(s.merged, s.toPush);
        const g = mergeGames(loadGameProgress(), cloudGames);
        // Chủ đề nào cloud đã có đúng bản này thì không cần đẩy lại.
        lastGames.current = {};
        for (const k of Object.keys(g.merged)) {
          if (!g.toPush.includes(k)) lastGames.current[k] = JSON.stringify(g.merged[k]);
        }
        const t = mergeToeic(loadToeicProgress(), cloudToeic);
        lastToeic.current = {};
        for (const k of Object.keys(t.merged)) {
          if (!t.toPush.includes(k)) lastToeic.current[k] = JSON.stringify(t.merged[k]);
        }
        // Ôn tập: gộp từng câu; chỗ nào khác với cloud sẽ được đẩy lên ngay sau đó
        lastReview.current = {};
        for (const r of reviewRows(cloudReview)) lastReview.current[r.item_key] = JSON.stringify(r);
        const rv = mergeReview(loadReview(), cloudReview);
        ready.current = true;
        saveGameProgress(g.merged);
        window.dispatchEvent(new Event(GAMES_CHANGED_EVENT));
        saveToeicProgress(t.merged);
        window.dispatchEvent(new Event(TOEIC_CHANGED_EVENT));
        saveReview(rv);
        window.dispatchEvent(new Event(REVIEW_SAVED_EVENT));
      } catch {
        // Mất mạng: giữ dữ liệu trên máy, lần đăng nhập/mở app sau sẽ gộp lại.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // 2) Đẩy ngày học
  useEffect(() => {
    if (!userId) return;
    const flush = async () => {
      if (!ready.current) return;
      const days = takeTouchedDays();
      if (days.length === 0) return;
      try {
        await pushStudyDays(userId, getStudySnapshot(), days);
      } catch {
        markTouchedDays(days);
      }
    };
    const timer = window.setInterval(() => void flush(), 30_000);
    const onHide = () => document.visibilityState === 'hidden' && void flush();
    const onOnline = () => void flush();
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', onOnline);
    window.addEventListener('online', onOnline);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', onOnline);
      window.removeEventListener('online', onOnline);
      void flush();
    };
  }, [userId]);

  // 3) Đẩy tiến độ trò chơi
  useEffect(() => {
    if (!userId) return;
    let timer: number | undefined;
    const run = async () => {
      if (!ready.current) return;
      const cur = loadGameProgress();
      const changed = Object.keys(cur).filter((k) => JSON.stringify(cur[k]) !== lastGames.current[k]);
      if (changed.length === 0) return;
      try {
        await pushGames(userId, cur, changed);
        for (const k of changed) lastGames.current[k] = JSON.stringify(cur[k]);
      } catch {
        // Thử lại ở lần lưu sau hoặc khi có mạng.
      }
    };
    const onSaved = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => void run(), 1500);
    };
    const onOnline = () => void run();
    window.addEventListener(GAMES_SAVED_EVENT, onSaved);
    window.addEventListener('online', onOnline);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(GAMES_SAVED_EVENT, onSaved);
      window.removeEventListener('online', onOnline);
    };
  }, [userId]);

  // 3b) Đẩy điểm TOEIC
  useEffect(() => {
    if (!userId) return;
    let timer: number | undefined;
    const run = async () => {
      if (!ready.current) return;
      const cur = loadToeicProgress();
      const changed = Object.keys(cur).filter((k) => JSON.stringify(cur[k]) !== lastToeic.current[k]);
      if (changed.length === 0) return;
      try {
        await pushToeic(userId, cur, changed);
        for (const k of changed) lastToeic.current[k] = JSON.stringify(cur[k]);
      } catch {
        // Thử lại ở lần lưu sau hoặc khi có mạng.
      }
    };
    const onSaved = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => void run(), 1500);
    };
    const onOnline = () => void run();
    window.addEventListener(TOEIC_SAVED_EVENT, onSaved);
    window.addEventListener('online', onOnline);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(TOEIC_SAVED_EVENT, onSaved);
      window.removeEventListener('online', onOnline);
    };
  }, [userId]);

  // 3c) Đẩy dữ liệu ôn tập TOEIC
  useEffect(() => {
    if (!userId) return;
    let timer: number | undefined;
    const run = async () => {
      if (!ready.current) return;
      const store = loadReview();
      const rows = reviewRows(store);
      const changed = rows.filter((r) => JSON.stringify(r) !== lastReview.current[r.item_key]);
      if (changed.length === 0) return;
      try {
        await pushReview(userId, changed);
        for (const r of changed) lastReview.current[r.item_key] = JSON.stringify(r);
        // Đủ 10 lượt thì dọn các lượt cũ hơn trên cloud
        if (store.sessions.length >= 10) void pruneReviewSessions(store.sessions[store.sessions.length - 1].at).catch(() => undefined);
      } catch {
        // Thử lại ở lần lưu sau hoặc khi có mạng.
      }
    };
    const onSaved = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => void run(), 1500);
    };
    const onOnline = () => void run();
    window.addEventListener(REVIEW_SAVED_EVENT, onSaved);
    window.addEventListener('online', onOnline);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(REVIEW_SAVED_EVENT, onSaved);
      window.removeEventListener('online', onOnline);
    };
  }, [userId]);

  // 4) Đăng xuất: xóa dữ liệu học trên máy này (giống tiến độ SRS và dấu sao)
  useEffect(() => {
    const onSignedOut = () => {
      ready.current = false;
      lastGames.current = {};
      lastToeic.current = {};
      lastReview.current = {};
      clearStudy();
      clearGameProgress();
      clearToeicProgress();
      clearReview();
    };
    window.addEventListener(SIGNED_OUT_EVENT, onSignedOut);
    return () => window.removeEventListener(SIGNED_OUT_EVENT, onSignedOut);
  }, []);
}
