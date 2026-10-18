import type { Level, VocabItem } from '@/lib/types';
import { LEVEL_ORDER } from '@/data/vocabData';
import { shuffle } from '@/lib/dictItems';

export { shuffle };

/** Số từ trong một bài học. */
export const LESSON_SIZE = 10;

/** Dễ trước, khó sau: theo cấp rồi theo id. */
export function sortForLearning(list: VocabItem[]): VocabItem[] {
  const rank = (l: Level) => LEVEL_ORDER.indexOf(l);
  return [...list].sort((a, b) => rank(a.level) - rank(b.level) || a.id - b.id);
}

export function chunk<T>(list: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

export function pickN<T>(list: T[], n: number): T[] {
  return shuffle(list).slice(0, n);
}

/**
 * Tạo `count` phương án (gồm đáp án đúng, đã xáo). Đáp án nhiễu ưu tiên cùng loại từ,
 * không trùng nghĩa hoặc chữ với đáp án đúng để câu hỏi không bị mơ hồ.
 */
export function makeOptions(target: VocabItem, pool: VocabItem[], count = 4): VocabItem[] {
  const others = pool.filter((w) => w.id !== target.id);
  const ordered = [
    ...shuffle(others.filter((w) => w.pos === target.pos)),
    ...shuffle(others.filter((w) => w.pos !== target.pos)),
  ];
  const meanings = new Set([target.meaning]);
  const words = new Set([target.word.toLowerCase()]);
  const picked: VocabItem[] = [];
  for (const w of ordered) {
    if (picked.length >= count - 1) break;
    if (meanings.has(w.meaning) || words.has(w.word.toLowerCase())) continue;
    meanings.add(w.meaning);
    words.add(w.word.toLowerCase());
    picked.push(w);
  }
  return shuffle([target, ...picked]);
}
