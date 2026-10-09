import type { Level, Pos, VocabItem } from '@/lib/types';
import type { Topic } from '@/data/vocabTopics';

/**
 * Một dòng dữ liệu gọn: [id, word, pos, ipa, meaning, topic, example, exampleVi, speak?].
 * Viết dạng mảng cho ngắn; hàm rowsToItems đổi thành VocabItem đầy đủ.
 */
export type VocabRow = [number, string, Pos, string, string, Topic, string, string, string?];

export function rowsToItems(rows: VocabRow[], level: Level): VocabItem[] {
  return rows.map(([id, word, pos, ipa, meaning, topic, example, exampleVi, speak]) => ({
    id,
    word,
    pos,
    ipa,
    meaning,
    level,
    topic,
    example,
    exampleVi,
    ...(speak ? { speak } : {}),
  }));
}
