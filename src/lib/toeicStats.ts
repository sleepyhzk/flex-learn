import { questionCount } from '@/data/toeicData';
import type { PartKey } from '@/data/toeicData';
import { ORDER } from '@/lib/toeicMock';
import { UNIT_BY_ID, resolveLog } from '@/lib/toeicExplain';
import { loadReview } from '@/lib/toeicReview';
import type { AnswerLog } from '@/lib/toeicReview';

/**
 * Thống kê "đã làm bao nhiêu câu, đúng bao nhiêu %" cho từng Part, trên máy (localStorage).
 * Mỗi câu chỉ tính một lần (theo lần làm gần nhất): khóa `đơnVị:viTriCau` -> 1 nếu lần gần nhất đúng, 0 nếu sai.
 * Lần đầu chưa có dữ liệu thì lấy từ các lượt làm gần đây trong mục Ôn tập.
 */
const KEY = 'flex_toeic_stats_v1';
type Seen = Record<string, 0 | 1>;

function read(): Seen | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    return p && typeof p === 'object' ? (p as Seen) : null;
  } catch {
    return null;
  }
}

function write(s: Seen) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

function apply(seen: Seen, items: AnswerLog[]) {
  for (const it of items) {
    if (it.c < 0) continue; // bỏ trống thì chưa tính là đã làm
    const info = resolveLog(it);
    if (!info) continue;
    seen[`${it.u}:${it.q}`] = info.ok ? 1 : 0;
  }
}

export function loadSeen(): Seen {
  const stored = read();
  if (stored && Object.keys(stored).length > 0) return stored;
  const seen: Seen = {};
  for (const s of [...loadReview().sessions].reverse()) apply(seen, s.items);
  write(seen);
  return seen;
}

export function recordAnswers(items: AnswerLog[]) {
  const seen = loadSeen();
  apply(seen, items);
  write(seen);
}

export function clearToeicStats() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export interface PartStat {
  done: number;
  correct: number;
  total: number;
  /** Phần trăm đúng (0-100), null nếu chưa làm câu nào. */
  accuracy: number | null;
}

export type ToeicStats = Record<PartKey, PartStat>;

export function computeToeicStats(seen: Seen = loadSeen()): ToeicStats {
  const out = Object.fromEntries(ORDER.map((p) => [p, { done: 0, correct: 0, total: questionCount(p), accuracy: null }])) as ToeicStats;
  for (const [k, v] of Object.entries(seen)) {
    const unitId = k.slice(0, k.lastIndexOf(':'));
    const part = UNIT_BY_ID.get(unitId)?.part;
    if (!part) continue;
    out[part].done += 1;
    out[part].correct += v;
  }
  for (const p of ORDER) out[p].accuracy = out[p].done > 0 ? Math.round((out[p].correct / out[p].done) * 100) : null;
  return out;
}

export interface SkillStat {
  done: number;
  accuracy: number | null;
}

/** Gộp theo kỹ năng và ước tính điểm TOEIC (thang 10-990) từ độ chính xác. */
export function summarize(stats: ToeicStats) {
  const sum = (parts: PartKey[]): SkillStat => {
    const done = parts.reduce((n, p) => n + stats[p].done, 0);
    const correct = parts.reduce((n, p) => n + stats[p].correct, 0);
    return { done, accuracy: done > 0 ? Math.round((correct / done) * 100) : null };
  };
  const listening = sum(['p1', 'p2', 'p3', 'p4']);
  const reading = sum(['p5', 'p6', 'p7']);
  // Chỉ ước tính khi mỗi kỹ năng đã có tối thiểu 10 câu; mỗi phần quy về thang 5-495, làm tròn đến 5.
  const MIN = 10;
  let score: number | null = null;
  if (listening.accuracy !== null && reading.accuracy !== null && listening.done >= MIN && reading.done >= MIN) {
    const sec = (acc: number) => Math.round((5 + 490 * (acc / 100)) / 5) * 5;
    score = sec(listening.accuracy) + sec(reading.accuracy);
  }
  return { listening, reading, score };
}
