import type { PartKey, RawQ, ScriptLine, Unit } from './toeicData';
import type { SceneKey } from './toeicScenes';

/**
 * Bộ dựng cho các câu KHÓ (đơn vị đề có cờ `hard: true`).
 * Quy ước giống toeicData.ts: đáp án đúng đứng đầu, chương trình tự xáo trộn khi làm bài.
 * Mỗi câu có thêm `ww`: lời giải cho từng đáp án sai (cùng thứ tự `wrongs`), được gộp vào WHY_WRONG.
 */

/** Khóa: `${id đơn vị}:${vị trí câu}`. */
export const WW_HARD: Record<string, string[]> = {};

export interface HQ {
  prompt?: string;
  correct: string;
  wrongs: string[];
  ww: string[];
  why: string;
}

export const hq = (prompt: string | undefined, correct: string, wrongs: string[], ww: string[], why: string): HQ => ({
  prompt,
  correct,
  wrongs,
  ww,
  why,
});

export function hardUnit(
  id: string,
  part: PartKey,
  qs: HQ[],
  extra: { title?: string; passage?: string; scene?: SceneKey; lines?: ScriptLine[] } = {}
): Unit {
  qs.forEach((x, i) => {
    WW_HARD[`${id}:${i}`] = x.ww;
  });
  return {
    id,
    part,
    hard: true,
    ...extra,
    questions: qs.map(({ prompt, correct, wrongs, why }): RawQ => ({ prompt, correct, wrongs, why })),
  };
}

type T3 = [string, string, string];
type T2 = [string, string];

export const hardP1 = (n: number, scene: SceneKey, title: string, correct: string, wrongs: T3, ww: T3, why: string): Unit =>
  hardUnit(`p1-h${n}`, 'p1', [hq(undefined, correct, wrongs, ww, why)], { scene, title });

export const hardP2 = (n: number, question: string, correct: string, wrongs: T2, ww: T2, why: string): Unit =>
  hardUnit(`p2-h${n}`, 'p2', [hq(undefined, correct, wrongs, ww, why)], { lines: [{ text: question }] });

export const hardP5 = (n: number, sentence: string, correct: string, wrongs: T3, ww: T3, why: string): Unit =>
  hardUnit(`p5-h${n}`, 'p5', [hq(sentence, correct, wrongs, ww, why)]);
