/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { SrsState, ReviewQuality } from '@/lib/types';
import { applyReview } from '@/lib/srs';
import { migrateKeys } from '@/lib/vocabKey';
import { sanitizeSrs } from '@/lib/sanitize';
import { useAuth, SIGNED_OUT_EVENT } from '@/hooks/useAuth';
import {
  deleteAllProgress,
  fetchProgress,
  mergeProgress,
  pushProgress,
} from '@/lib/cloudSync';
import { CLOUD_PUSH_DELAY_MS, FLUSH_SYNC_EVENT } from '@/lib/syncEvents';

const STORAGE_KEY = 'flex_srs_progress_v1';

/**
 * Ghi localStorage trễ 0,5 giây kể từ lần đổi cuối. saveProgress phải biến cả bảng (tới ~5.600 thẻ)
 * thành chuỗi JSON rồi ghi xuống đĩa trên luồng chính; nếu ghi ngay mỗi lần chấm thẻ thì nó trùng
 * với hiệu ứng lật thẻ về mặt trước và gây giật. Chấm liên tục thì các lần ghi gộp thành một.
 */
const SAVE_DELAY_MS = 500;

type ProgressMap = Record<string, SrsState>;

interface SrsProgressContextValue {
  progressMap: ProgressMap;
  upsert: (word: string, quality: ReviewQuality) => void;
  reset: () => void;
}

function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return migrateKeys(sanitizeSrs(JSON.parse(raw)));
  } catch {
    return {};
  }
}

function saveProgress(map: ProgressMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

const SrsProgressContext = createContext<SrsProgressContextValue | null>(null);

/**
 * Giữ một bản tiến độ duy nhất cho cả app, để Trang chủ và Flashcard
 * luôn thấy cùng một dữ liệu (trước đây mỗi nơi gọi hook là một state riêng).
 *
 * Khi đã đăng nhập: gộp với bản trên Supabase (thẻ nào ôn gần nhất thì thắng),
 * rồi đẩy từng thẻ vừa chấm lên cloud. Chưa đăng nhập hoặc mất mạng: vẫn lưu localStorage.
 */
export function SrsProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [progressMap, setProgressMap] = useState<ProgressMap>(loadProgress);

  const progressRef = useRef(progressMap);
  progressRef.current = progressMap;
  const dirtyRef = useRef(new Set<string>());
  const timerRef = useRef<number | undefined>(undefined);

  // Có thay đổi chưa ghi xuống localStorage (đang chờ hết SAVE_DELAY_MS)
  const savePending = useRef(false);

  useEffect(() => {
    savePending.current = true;
    const id = window.setTimeout(() => {
      savePending.current = false;
      saveProgress(progressMap);
    }, SAVE_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [progressMap]);

  // Ẩn tab, đóng trang hoặc rời app: ghi ngay phần đang chờ để không mất thẻ vừa chấm.
  useEffect(() => {
    const saveNow = () => {
      if (!savePending.current) return;
      savePending.current = false;
      saveProgress(progressRef.current);
    };
    const onHide = () => document.visibilityState === 'hidden' && saveNow();
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', saveNow);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', saveNow);
      saveNow();
    };
  }, []);

  const flush = useCallback(async () => {
    window.clearTimeout(timerRef.current);
    timerRef.current = undefined;
    if (!userId || dirtyRef.current.size === 0) return;
    const keys = [...dirtyRef.current];
    dirtyRef.current.clear();
    try {
      await pushProgress(userId, progressRef.current, keys);
    } catch {
      keys.forEach((k) => dirtyRef.current.add(k)); // thử lại lần sau
    }
  }, [userId]);

  // Đăng nhập (hoặc khôi phục phiên): kéo bản cloud về và gộp.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    dirtyRef.current.clear();
    (async () => {
      try {
        const cloud = await fetchProgress();
        if (cancelled) return;
        const { merged, toPush } = mergeProgress(progressRef.current, cloud);
        setProgressMap((prev) => mergeProgress(prev, cloud).merged);
        await pushProgress(userId, merged, toPush);
      } catch {
        // Mất mạng: giữ dữ liệu trên máy, lần mở web sau sẽ gộp lại.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Đẩy ngay (không đợi hết thời gian gom) khi: có mạng lại, ẩn tab, đóng trang / tắt trình duyệt,
  // hoặc người dùng chuyển sang mục khác (App phát FLUSH_SYNC_EVENT).
  useEffect(() => {
    const now = () => void flush();
    const onHide = () => document.visibilityState === 'hidden' && void flush();
    window.addEventListener('online', now);
    window.addEventListener('pagehide', now);
    window.addEventListener(FLUSH_SYNC_EVENT, now);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.removeEventListener('online', now);
      window.removeEventListener('pagehide', now);
      window.removeEventListener(FLUSH_SYNC_EVENT, now);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [flush]);

  // Đăng xuất chủ động: xóa tiến độ trên máy này (dữ liệu vẫn còn trên tài khoản).
  useEffect(() => {
    const onSignedOut = () => {
      window.clearTimeout(timerRef.current);
      timerRef.current = undefined;
      dirtyRef.current.clear();
      setProgressMap({});
    };
    window.addEventListener(SIGNED_OUT_EVENT, onSignedOut);
    return () => window.removeEventListener(SIGNED_OUT_EVENT, onSignedOut);
  }, []);

  const upsert = useCallback(
    (word: string, quality: ReviewQuality) => {
      setProgressMap((prev) => ({
        ...prev,
        [word]: applyReview(prev[word] ?? null, quality),
      }));
      if (userId) {
        dirtyRef.current.add(word);
        // Hẹn đẩy sau tối đa CLOUD_PUSH_DELAY_MS kể từ thay đổi đầu tiên chưa đẩy (không reset ở các lần chấm sau),
        // để học liên tục cũng không bị hoãn vô hạn.
        if (timerRef.current === undefined) {
          timerRef.current = window.setTimeout(() => void flush(), CLOUD_PUSH_DELAY_MS);
        }
      }
    },
    [userId, flush]
  );

  const reset = useCallback(() => {
    setProgressMap({});
    dirtyRef.current.clear();
    if (userId) void deleteAllProgress(userId).catch(() => {});
  }, [userId]);

  const value = useMemo(
    () => ({ progressMap, upsert, reset }),
    [progressMap, upsert, reset]
  );

  return (
    <SrsProgressContext.Provider value={value}>
      {children}
    </SrsProgressContext.Provider>
  );
}

export function useSrsProgress(): SrsProgressContextValue {
  const ctx = useContext(SrsProgressContext);
  if (!ctx) {
    throw new Error('useSrsProgress phải được dùng bên trong <SrsProgressProvider>');
  }
  return ctx;
}
