import { LEVEL_ORDER } from '../data/vocabLevels.ts';
import { LEVEL_BY_ID, LEVEL_TOTALS, ORDER_RANGES, VOCAB_TOTAL } from '../data/vocabIndex.ts';
import { isDue } from './srs.ts';
import type { Level, SrsState } from './types';

/**
 * Tính số liệu từ vựng (đã thuộc / cần củng cố / chưa học, thẻ đến hạn) CHỈ từ bảng tra nhỏ trong data/vocabIndex.ts
 * và tiến độ đã lưu, không import kho từ vựng. Nhờ vậy trang chủ hiện số liệu ngay, còn kho từ vựng (hàng trăm kB)
 * được tải riêng sau đó. Khóa tiến độ có dạng `từ#id`; ở đây chỉ dùng phần id.
 */

export interface LevelStat {
  level: Level;
  total: number;
  /** Thuộc rồi: lần ôn gần nhất là "good" hoặc "easy". */
  known: number;
  /** Chưa thuộc / cần củng cố: lần ôn gần nhất là "hard". */
  hard: number;
  /** Chưa học: chưa có tiến độ. */
  fresh: number;
}

/** Lấy id từ khóa `từ#id`; null nếu khóa không đúng dạng. */
export function idOfKey(key: string): number | null {
  const i = key.lastIndexOf('#');
  if (i < 0) return null;
  const tail = key.slice(i + 1);
  return /^\d{1,5}$/.test(tail) ? Number(tail) : null;
}

/** Cấp của từ mang id này; null nếu không có từ nào như vậy trong kho. */
export function levelOfId(id: number): Level | null {
  const c = LEVEL_BY_ID[id];
  if (c === undefined || c === '-') return null;
  return LEVEL_ORDER[Number(c)] ?? null;
}

let orderCache: number[] | null = null;
let rankCache: Map<number, number> | null = null;

/** Các id theo thứ tự trong kho. */
export function vocabOrder(): number[] {
  if (!orderCache) {
    const out: number[] = [];
    for (const part of ORDER_RANGES.split(',')) {
      const [a, b] = part.split('-').map(Number);
      for (let id = a; id <= (b ?? a); id++) out.push(id);
    }
    orderCache = out;
  }
  return orderCache;
}

function rankOf(id: number): number {
  if (!rankCache) rankCache = new Map(vocabOrder().map((x, i) => [x, i]));
  return rankCache.get(id) ?? Number.MAX_SAFE_INTEGER;
}

export function computeVocabStats(progressMap: Record<string, SrsState>) {
  const byLevel = new Map<Level, LevelStat>(
    LEVEL_ORDER.map((level) => [level, { level, total: LEVEL_TOTALS[level] ?? 0, known: 0, hard: 0, fresh: 0 }])
  );
  const seen = new Set<number>();
  let due = 0;
  let learned = 0;
  let oldestDueId: number | null = null;
  let oldestDueDate = '';

  for (const [key, s] of Object.entries(progressMap)) {
    const id = idOfKey(key);
    if (id === null || seen.has(id)) continue;
    const level = levelOfId(id);
    if (!level) continue; // khóa của từ không còn trong kho
    seen.add(id);
    const ls = byLevel.get(level)!;
    learned += 1;
    if (s.lastQuality === 'hard') ls.hard += 1;
    else ls.known += 1;
    if (isDue(s.nextReview)) {
      due += 1;
      // Đến hạn cũ nhất; cùng ngày thì từ đứng trước trong kho.
      if (
        oldestDueId === null ||
        s.nextReview < oldestDueDate ||
        (s.nextReview === oldestDueDate && rankOf(id) < rankOf(oldestDueId))
      ) {
        oldestDueId = id;
        oldestDueDate = s.nextReview;
      }
    }
  }
  for (const ls of byLevel.values()) ls.fresh = ls.total - ls.known - ls.hard;

  let firstFreshId: number | null = null;
  if (oldestDueId === null && learned < VOCAB_TOTAL) {
    for (const id of vocabOrder()) {
      if (!seen.has(id)) {
        firstFreshId = id;
        break;
      }
    }
  }

  const levels = [...byLevel.values()].filter((l) => l.total > 0);
  const totals = levels.reduce(
    (t, l) => ({ total: t.total + l.total, known: t.known + l.known, hard: t.hard + l.hard, fresh: t.fresh + l.fresh }),
    { total: 0, known: 0, hard: 0, fresh: 0 }
  );
  return {
    due,
    learned,
    fresh: VOCAB_TOTAL - learned,
    levels,
    totals,
    /** Id của thẻ nên ôn tiếp: thẻ đến hạn cũ nhất, nếu không còn thì từ mới đầu tiên. */
    nextId: oldestDueId ?? firstFreshId,
  };
}
