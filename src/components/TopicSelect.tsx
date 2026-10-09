import { TOPICS } from '@/data/vocabTopics';
import type { Topic, TopicGroup } from '@/data/vocabTopics';

export type TopicFilter = 'all' | Topic;

const GROUP_LABEL: Record<TopicGroup, string> = {
  daily: 'Giao tiếp hằng ngày',
  toeic: 'TOEIC & công việc',
  cyber: 'Chuyên ngành an ninh mạng',
};
const GROUP_ORDER: TopicGroup[] = ['daily', 'toeic', 'cyber'];

/** Ô chọn chủ đề từ vựng. counts = số từ của từng chủ đề trong danh sách đang xem; chủ đề hết từ thì ẩn. */
export function TopicSelect({
  value,
  onChange,
  counts,
  total,
}: {
  value: TopicFilter;
  onChange: (t: TopicFilter) => void;
  counts: Partial<Record<Topic, number>>;
  total: number;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
      <span className="font-medium">Chủ đề:</span>
      <select
        value={value}
        onChange={(e) => {
          onChange(e.target.value as TopicFilter);
          e.currentTarget.blur(); // trả phím tắt (Space, ←, →) về cho flashcard
        }}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      >
        <option value="all">Tất cả chủ đề ({total})</option>
        {GROUP_ORDER.map((g) => {
          const items = TOPICS.filter((t) => t.group === g && ((counts[t.key] ?? 0) > 0 || t.key === value));
          if (items.length === 0) return null;
          return (
            <optgroup key={g} label={GROUP_LABEL[g]}>
              {items.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label} ({counts[t.key] ?? 0})
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>
    </label>
  );
}

export function countByTopic(words: { topic: Topic }[]) {
  const counts: Partial<Record<Topic, number>> = {};
  for (const w of words) counts[w.topic] = (counts[w.topic] ?? 0) + 1;
  return counts;
}
