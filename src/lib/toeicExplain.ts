import { TOEIC_UNITS } from '@/data/toeicData';
import type { PartKey, Unit } from '@/data/toeicData';
import { WHY_WRONG } from '@/data/toeicWhyWrong';
import type { AnswerLog } from './toeicReview';

/** Tra đơn vị đề theo id (p5-12, p3-4...). */
export const UNIT_BY_ID: Map<string, Unit> = new Map(Object.values(TOEIC_UNITS).flat().map((u) => [u.id, u]));

export interface WrongNote {
  text: string;
  /** true: chưa có lời giải riêng, đang dùng câu chung theo dạng bài. */
  generic: boolean;
}

/** Lời giải chung, chỉ dùng khi một đáp án sai chưa có lời giải riêng. */
const GENERIC: Record<PartKey, string> = {
  p1: 'Không khớp với những gì thấy trong tranh (người, đồ vật hoặc hành động được nhắc tới không có hoặc khác với tranh).',
  p2: 'Không trả lời đúng điều được hỏi: có thể sai dạng câu hỏi, lặp từ trong câu hỏi hoặc có từ nghe giống nhưng khác nghĩa.',
  p3: 'Không khớp với nội dung hội thoại: chi tiết này không được nhắc đến hoặc bị nói ngược lại.',
  p4: 'Không khớp với nội dung bài nói: chi tiết này không được nhắc đến hoặc bị nói ngược lại.',
  p5: 'Không phù hợp về ngữ pháp (từ loại, thì, cấu trúc) hoặc không hợp nghĩa khi điền vào chỗ trống.',
  p6: 'Không phù hợp về ngữ pháp hoặc không hợp ngữ cảnh/ý của đoạn văn khi điền vào chỗ trống.',
  p7: 'Không khớp với thông tin trong bài: chi tiết này không được nêu hoặc bị hiểu sai.',
};

/**
 * Lời giải cho từng đáp án của một câu, theo đúng thứ tự `options` đang hiển thị.
 * Đáp án đúng trả về null (lời giải đúng nằm ở trường `why`).
 */
export function explainOptions(unit: Unit, qi: number, options: string[]): (WrongNote | null)[] {
  const r = unit.questions[qi];
  const custom = WHY_WRONG[`${unit.id}:${qi}`];
  return options.map((opt) => {
    if (opt === r.correct) return null;
    const wi = r.wrongs.indexOf(opt);
    const t = wi >= 0 ? custom?.[wi] : undefined;
    return t ? { text: t, generic: false } : { text: GENERIC[unit.part], generic: true };
  });
}

/** Các đoạn sẽ đọc to theo thứ tự (Part 1, 2, 3, 4); `options` là đáp án của câu đầu theo thứ tự hiển thị. */
export function speakTexts(unit: Unit, options: string[]): string[] | undefined {
  if (unit.part === 'p1') return [...options];
  if (unit.part === 'p2' && unit.lines) return [unit.lines[0].text, ...options];
  if (unit.lines) return unit.lines.map((l) => l.text);
  return undefined;
}

/** Câu có đáp án đúng khớp dữ liệu hiện tại không (đề có thể đã được sửa sau khi lưu). */
export function resolveLog(log: AnswerLog) {
  const unit = UNIT_BY_ID.get(log.u);
  const rq = unit?.questions[log.q];
  if (!unit || !rq) return null;
  const answer = log.o.indexOf(rq.correct);
  if (answer < 0) return null;
  const chosen = log.c >= 0 && log.c < log.o.length ? log.c : undefined;
  return { unit, rq, answer, chosen, ok: chosen === answer };
}
