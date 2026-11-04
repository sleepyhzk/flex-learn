import type { GrammarQuestion } from '../types.ts';

/**
 * Viết gọn một câu trắc nghiệm: mc(đề, đáp án đúng, [3 đáp án sai], giải thích đáp án đúng,
 * [lý do sai của từng đáp án sai, đúng thứ tự mảng đáp án sai]).
 */
export function mc(
  q: string,
  a: string,
  w: [string, string, string],
  e: string,
  why: [string, string, string]
): GrammarQuestion {
  return { q, a, w, e, why };
}
