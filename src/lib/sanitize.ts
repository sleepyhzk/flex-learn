import type { SrsState } from './types';
import type { StudyMap } from './studyTime';
import type { GameKey, GameProgress, TopicGameProgress } from './gameProgress';
import type { ToeicProgress, ToeicRecord } from './toeicProgress';
import type { ReviewStore, SessionLog, WrongEntry } from './toeicReview';

/**
 * Lọc dữ liệu đọc từ localStorage hoặc từ cloud: bỏ phần sai hình dạng thay vì để app bị lỗi trắng trang,
 * và không tin giờ ở tương lai (một mốc giờ năm 2099 sẽ thắng mọi lần gộp "bản mới hơn" mãi mãi).
 */

/** Cho phép lệch đồng hồ giữa các máy tối đa 5 phút (khớp với giới hạn trên server). */
export const MAX_SKEW_MS = 5 * 60_000;

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const num = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Giờ ISO hợp lệ, không ở tương lai quá 5 phút; không hợp lệ thì trả về undefined. */
export function safeIso(v: unknown): string | undefined {
  if (typeof v !== 'string' || v.length > 40) return undefined;
  const t = Date.parse(v);
  if (Number.isNaN(t)) return undefined;
  return new Date(Math.min(t, Date.now() + MAX_SKEW_MS)).toISOString();
}

/** JSON.stringify không phụ thuộc thứ tự khóa (jsonb của Postgres sắp lại khóa nên so sánh thường bị lệch). */
export function stable(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(stable).join(',')}]`;
  if (isObj(v)) {
    return `{${Object.keys(v)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stable(v[k])}`)
      .join(',')}}`;
  }
  return JSON.stringify(v) ?? 'null';
}

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function sanitizeSrs(raw: unknown): Record<string, SrsState> {
  const out: Record<string, SrsState> = {};
  if (!isObj(raw)) return out;
  for (const [k, s] of Object.entries(raw)) {
    if (!isObj(s) || k.length > 64) continue;
    const lastReviewed = safeIso(s.lastReviewed);
    const q = s.lastQuality;
    if (!lastReviewed || (q !== 'easy' && q !== 'good' && q !== 'hard')) continue;
    if (!num(s.easiness) || !num(s.interval) || !num(s.repetitions) || typeof s.nextReview !== 'string' || !DAY_RE.test(s.nextReview)) continue;
    out[k] = {
      easiness: clamp(s.easiness, 1.3, 5),
      interval: clamp(Math.round(s.interval), 0, 36500),
      repetitions: clamp(Math.round(s.repetitions), 0, 1000),
      nextReview: s.nextReview,
      lastQuality: q,
      lastReviewed,
    };
  }
  return out;
}

/** Số giây học mỗi ngày: ngày đúng định dạng, 0 đến 12 giờ. */
export function sanitizeStudy(raw: unknown): StudyMap {
  const out: StudyMap = {};
  if (!isObj(raw)) return out;
  for (const [day, sec] of Object.entries(raw)) {
    if (DAY_RE.test(day) && num(sec)) out[day] = clamp(Math.round(sec), 0, 43_200);
  }
  return out;
}

const GAME_KEYS: GameKey[] = ['quiz', 'listen', 'match', 'scramble', 'connect'];

export function sanitizeTopicGame(raw: unknown): TopicGameProgress | null {
  if (!isObj(raw)) return null;
  const lessons = Array.isArray(raw.lessons)
    ? [...new Set(raw.lessons.filter((n): n is number => Number.isInteger(n) && n >= 0 && n <= 999))].sort((a, b) => a - b).slice(0, 500)
    : [];
  const best: TopicGameProgress['best'] = {};
  if (isObj(raw.best)) {
    for (const [lesson, games] of Object.entries(raw.best)) {
      if (!/^\d{1,3}$/.test(lesson) || !isObj(games)) continue;
      const g: Partial<Record<GameKey, number>> = {};
      for (const k of GAME_KEYS) {
        const v = games[k];
        if (num(v)) g[k] = clamp(Math.round(v), 0, 100);
      }
      best[lesson] = g;
    }
  }
  return { lessons, best };
}

export function sanitizeGames(raw: unknown): GameProgress {
  const out: GameProgress = {};
  if (!isObj(raw)) return out;
  for (const [topic, d] of Object.entries(raw)) {
    const t = /^[a-z]{2,24}$/.test(topic) ? sanitizeTopicGame(d) : null;
    if (t) out[topic] = t;
  }
  return out;
}

export function sanitizeToeicRecord(raw: unknown): ToeicRecord | null {
  if (!isObj(raw) || !num(raw.best) || !num(raw.last) || !num(raw.attempts)) return null;
  const last = clamp(Math.round(raw.last), 0, 100);
  const best = Math.max(last, clamp(Math.round(raw.best), 0, 100));
  const at = safeIso(raw.at);
  return { best, last, attempts: clamp(Math.round(raw.attempts), 1, 100_000), ...(at ? { at } : {}) };
}

export function sanitizeToeic(raw: unknown): ToeicProgress {
  const out: ToeicProgress = {};
  if (!isObj(raw)) return out;
  for (const [k, v] of Object.entries(raw)) {
    const r = /^(p[1-7]|mix|custom)$/.test(k) ? sanitizeToeicRecord(v) : null;
    if (r) out[k] = r;
  }
  return out;
}

function sanitizeAnswer(raw: unknown) {
  if (!isObj(raw) || typeof raw.u !== 'string' || raw.u.length > 24 || !Number.isInteger(raw.q) || (raw.q as number) < 0) return null;
  if (!Array.isArray(raw.o) || raw.o.length === 0 || raw.o.length > 8 || !raw.o.every((x) => typeof x === 'string' && x.length < 600)) return null;
  if (!Number.isInteger(raw.c) || (raw.c as number) < -1 || (raw.c as number) >= raw.o.length) return null;
  return { u: raw.u, q: raw.q as number, o: raw.o as string[], c: raw.c as number };
}

export function sanitizeWrongEntry(raw: unknown): WrongEntry | null {
  const a = sanitizeAnswer(raw);
  const at = isObj(raw) ? safeIso(raw.at) : undefined;
  if (!a || !at) return null;
  const times = isObj(raw) && num(raw.times) ? clamp(Math.round(raw.times), 1, 100_000) : 1;
  return { ...a, at, times };
}

export function sanitizeSession(raw: unknown): SessionLog | null {
  if (!isObj(raw) || typeof raw.id !== 'string' || !/^[A-Za-z0-9]{4,32}$/.test(raw.id)) return null;
  const at = safeIso(raw.at);
  if (!at || typeof raw.key !== 'string' || typeof raw.title !== 'string' || !num(raw.correct) || !num(raw.total)) return null;
  const items = Array.isArray(raw.items) ? raw.items.slice(0, 500).map(sanitizeAnswer).filter((x) => x !== null) : [];
  const total = clamp(Math.round(raw.total), 0, 1000);
  return { id: raw.id, at, key: raw.key.slice(0, 20), title: raw.title.slice(0, 80), correct: clamp(Math.round(raw.correct), 0, total), total, items };
}

export function sanitizeReview(raw: unknown): ReviewStore {
  const out: ReviewStore = { sessions: [], wrong: {}, gone: {} };
  if (!isObj(raw)) return out;
  if (isObj(raw.wrong)) {
    for (const [k, v] of Object.entries(raw.wrong)) {
      const e = sanitizeWrongEntry(v);
      if (e) out.wrong[k] = e;
    }
  }
  if (isObj(raw.gone)) {
    for (const [k, v] of Object.entries(raw.gone)) {
      const at = safeIso(v);
      if (at) out.gone[k] = at;
    }
  }
  if (Array.isArray(raw.sessions)) out.sessions = raw.sessions.map(sanitizeSession).filter((x) => x !== null).slice(0, 10);
  return out;
}
