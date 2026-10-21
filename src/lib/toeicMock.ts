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

/** Tỉ lệ câu khó trong mỗi lượt làm (đề thật có khoảng một phần ba câu khó ở mỗi Part). */
export const HARD_SHARE = 0.3;

/** Số đơn vị khó cần lấy trong `n` đơn vị: ít nhất 1 nếu `n` >= 2, phần lẻ được làm tròn ngẫu nhiên để trung bình đúng tỉ lệ. */
function hardCount(n: number, available: number): number {
  const raw = n * HARD_SHARE;
  let h = Math.floor(raw);
  if (Math.random() < raw - h) h += 1;
  if (n >= 2) h = Math.max(1, h);
  return Math.min(h, available, n);
}

/**
 * Ghép đơn vị dễ và khó thành một dãy: các câu khó chen vào nửa sau (từ khoảng 40% trở đi), giống đề thật
 * càng về cuối càng khó, nhưng không dồn hết vào câu cuối cùng.
 */
export function arrange(easy: Unit[], hard: Unit[]): Unit[] {
  const out = [...easy];
  for (const h of shuffle(hard)) {
    const lo = out.length > 0 ? Math.max(1, Math.floor(out.length * 0.4)) : 0;
    const at = lo + Math.floor(Math.random() * (out.length - lo + 1));
    out.splice(at, 0, h);
  }
  return out;
}

/** Chọn `n` đơn vị của một Part cho một lượt luyện: có cả câu khó (khoảng 30%, tối thiểu 1 khi n >= 2). */
export function pickUnits(part: PartKey, n: number): Unit[] {
  const all = TOEIC_UNITS[part];
  const hard = shuffle(all.filter((u) => u.hard));
  const easy = shuffle(all.filter((u) => !u.hard));
  const h = hardCount(n, hard.length);
  return arrange(easy.slice(0, Math.max(0, n - h)), hard.slice(0, h));
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
  const takenEasy: Partial<Record<PartKey, Unit[]>> = {};
  const takenHard: Partial<Record<PartKey, Unit[]>> = {};
  let used = 0;

  for (const p of sel) {
    const quota = base + (extra > 0 ? 1 : 0);
    if (extra > 0) extra -= 1;
    const hardPool = shuffle(TOEIC_UNITS[p].filter((x) => x.hard));
    const avgLen = hardPool.length > 0 ? hardPool.reduce((n, x) => n + x.questions.length, 0) / hardPool.length : 1;
    // Số đơn vị khó mong muốn: đơn vị nhiều câu (đoạn nghe, đọc) được làm tròn ngẫu nhiên để trung bình vẫn đúng tỉ lệ;
    // chỉ bảo đảm có ít nhất một khi hạn mức đủ lớn để một đơn vị khó không chiếm quá nhiều.
    const wantRaw = (quota * HARD_SHARE) / avgLen;
    let wantUnits = Math.floor(wantRaw);
    if (Math.random() < wantRaw - wantUnits) wantUnits += 1;
    if (quota >= 3 * avgLen) wantUnits = Math.max(1, wantUnits);
    const mineEasy: Unit[] = [];
    const mineHard: Unit[] = [];
    const rest: Unit[] = [];
    let cum = 0;
    // Lấy các đơn vị khó trước, rồi mới lấp phần còn lại bằng đơn vị dễ
    for (const u of hardPool) {
      if (mineHard.length < wantUnits && cum + u.questions.length <= quota) {
        mineHard.push(u);
        cum += u.questions.length;
      } else rest.push(u);
    }
    for (const u of shuffle(TOEIC_UNITS[p].filter((x) => !x.hard))) {
      if (cum + u.questions.length <= quota) {
        mineEasy.push(u);
        cum += u.questions.length;
      } else rest.push(u);
    }
    takenEasy[p] = mineEasy;
    takenHard[p] = mineHard;
    pool[p] = rest;
    used += cum;
  }

  // Vòng bổ sung: lấp phần còn thiếu bằng các đơn vị vừa với số câu còn lại
  let progressed = true;
  while (used < total && progressed) {
    progressed = false;
    for (const p of sel) {
      const rest = pool[p]!;
      const fits = (u: Unit) => used + u.questions.length <= total;
      let idx = rest.findIndex((u) => !u.hard && fits(u));
      if (idx < 0) idx = rest.findIndex(fits);
      if (idx >= 0) {
        const [u] = rest.splice(idx, 1);
        (u.hard ? takenHard : takenEasy)[p]!.push(u);
        used += u.questions.length;
        progressed = true;
        if (used >= total) break;
      }
    }
  }

  let out = sel.flatMap((p) => arrange(takenEasy[p]!, takenHard[p]!));
  if (out.length === 0) out = [shuffle(TOEIC_UNITS[sel[0]])[0]]; // total quá nhỏ so với kích thước một đoạn
  return out;
}
