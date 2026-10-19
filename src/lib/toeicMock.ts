import { TOEIC_UNITS, questionCount } from '@/data/toeicData';
import type { PartKey, Unit } from '@/data/toeicData';
import { shuffle } from '@/lib/dictItems';

/** Thứ tự các Part trong một đề: nghe trước, đọc sau. */
export const ORDER: PartKey[] = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'];
/** Đề thật: 200 câu trong 120 phút. */
export const MINUTES_PER_QUESTION = 0.6;

export interface MockConfig {
  parts: PartKey[];
  total: number;
  timer: boolean;
  minutes: number;
  /** true: chỉ chấm và hiện đáp án sau khi nộp bài (giống thi thật). */
  exam: boolean;
}

export const bankSize = (parts: PartKey[]) => parts.reduce((n, p) => n + questionCount(p), 0);
export const autoMinutes = (total: number) => Math.max(1, Math.round(total * MINUTES_PER_QUESTION));

/**
 * Chọn ngẫu nhiên các đơn vị (câu lẻ, đoạn, hội thoại) sao cho tổng số câu gần với `total` nhất.
 * Chia đều số câu cho từng Part đã chọn; Part nào thiếu đề thì phần dư chuyển cho Part khác.
 * Vì một đoạn đọc/nghe có 3 đến 4 câu hỏi nên số câu thực tế có thể ít hơn vài câu.
 */
export function buildCustomUnits(parts: PartKey[], total: number): Unit[] {
  const sel = ORDER.filter((p) => parts.includes(p));
  if (sel.length === 0) return [];
  const base = Math.floor(total / sel.length);
  let extra = total - base * sel.length;

  const pool: Partial<Record<PartKey, Unit[]>> = {};
  const taken: Partial<Record<PartKey, Unit[]>> = {};
  let used = 0;

  for (const p of sel) {
    const quota = base + (extra > 0 ? 1 : 0);
    if (extra > 0) extra -= 1;
    const shuffled = shuffle(TOEIC_UNITS[p]);
    const mine: Unit[] = [];
    const rest: Unit[] = [];
    let cum = 0;
    for (const u of shuffled) {
      if (cum + u.questions.length <= quota) {
        mine.push(u);
        cum += u.questions.length;
      } else rest.push(u);
    }
    taken[p] = mine;
    pool[p] = rest;
    used += cum;
  }

  // Vòng bổ sung: lấp phần còn thiếu bằng các đơn vị vừa với số câu còn lại
  let progressed = true;
  while (used < total && progressed) {
    progressed = false;
    for (const p of sel) {
      const rest = pool[p]!;
      const idx = rest.findIndex((u) => used + u.questions.length <= total);
      if (idx >= 0) {
        const [u] = rest.splice(idx, 1);
        taken[p]!.push(u);
        used += u.questions.length;
        progressed = true;
        if (used >= total) break;
      }
    }
  }

  let out = sel.flatMap((p) => taken[p]!);
  if (out.length === 0) out = [shuffle(TOEIC_UNITS[sel[0]])[0]]; // total quá nhỏ so với kích thước một đoạn
  return out;
}
