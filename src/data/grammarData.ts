import type { GrammarLevel, GrammarPoint, GrammarQuestion } from './grammar/types.ts';
import { A1_GRAMMAR } from './grammar/a1.ts';
import { A2_GRAMMAR } from './grammar/a2.ts';
import { B1_GRAMMAR } from './grammar/b1.ts';
import { B2_GRAMMAR } from './grammar/b2.ts';
import { C1_GRAMMAR } from './grammar/c1.ts';
import { A1_EXERCISES } from './grammar/exercises/a1.ts';
import { A2_EXERCISES } from './grammar/exercises/a2.ts';
import { B1_EXERCISES } from './grammar/exercises/b1.ts';
import { B2_EXERCISES } from './grammar/exercises/b2.ts';
import { C1_EXERCISES } from './grammar/exercises/c1.ts';

export type { GrammarLevel, GrammarPoint, GrammarExample, GrammarQuestion } from './grammar/types.ts';

/** Các cấp có mục Ngữ pháp, theo thứ tự hiển thị. */
export const GRAMMAR_LEVELS: GrammarLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export const GRAMMAR_BY_LEVEL: Record<GrammarLevel, GrammarPoint[]> = {
  A1: A1_GRAMMAR,
  A2: A2_GRAMMAR,
  B1: B1_GRAMMAR,
  B2: B2_GRAMMAR,
  C1: C1_GRAMMAR,
};

export const GRAMMAR_TOTAL = GRAMMAR_LEVELS.reduce((n, l) => n + GRAMMAR_BY_LEVEL[l].length, 0);

/** Mô tả ngắn từng cấp, hiện dưới các tab. */
export const GRAMMAR_LEVEL_NOTE: Record<GrammarLevel, string> = {
  A1: 'Sơ cấp: câu đơn giản về bản thân, đồ vật và thói quen hằng ngày.',
  A2: 'Sơ cấp nâng cao: kể chuyện quá khứ, nói về kế hoạch, so sánh và đưa lời khuyên.',
  B1: 'Trung cấp: kể trải nghiệm, các thì hoàn thành, bị động, câu điều kiện và câu tường thuật.',
  B2: 'Trung cao cấp: câu phức, điều kiện nâng cao, từ nối và cụm động từ.',
  C1: 'Cao cấp: cấu trúc trang trọng, nhấn mạnh, rút gọn và văn phong học thuật.',
};

/** Bài tập trắc nghiệm của từng điểm ngữ pháp, khóa là id của điểm (xem src/data/grammar/exercises/). */
export const GRAMMAR_EXERCISES: Record<string, GrammarQuestion[]> = {
  ...A1_EXERCISES,
  ...A2_EXERCISES,
  ...B1_EXERCISES,
  ...B2_EXERCISES,
  ...C1_EXERCISES,
};
