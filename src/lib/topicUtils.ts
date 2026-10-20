import type { Topic, TopicGroup } from '@/data/vocabTopics';

/** Nhãn và thứ tự nhóm chủ đề từ vựng (dùng chung cho ô chọn chủ đề và màn Trò chơi). */
export const GROUP_LABEL: Record<TopicGroup, string> = {
  daily: 'Giao tiếp hằng ngày',
  toeic: 'TOEIC & công việc',
  cyber: 'Chuyên ngành an ninh mạng',
  academic: 'Học thuật & nâng cao (B2)',
};
export const GROUP_ORDER: TopicGroup[] = ['daily', 'toeic', 'cyber', 'academic'];

/** Đếm số từ theo chủ đề. */
export function countByTopic(words: { topic: Topic }[]) {
  const counts: Partial<Record<Topic, number>> = {};
  for (const w of words) counts[w.topic] = (counts[w.topic] ?? 0) + 1;
  return counts;
}
