import { GROUP_LABEL, GROUP_ORDER } from '@/lib/topicUtils';
import { TOPICS } from '@/data/vocabTopics';
import type { Topic } from '@/data/vocabTopics';

export type TopicFilter = 'all' | Topic;


/** Ô chọn chủ đề từ vựng. counts = số từ của từng chủ đề trong danh sách đang xem; chủ đề hết từ thì ẩn. */
export function TopicSelect({
  value,
  onChange,
  counts,
  total,
  compact = false,
}: {
  value: TopicFilter;
  onChange: (t: TopicFilter) => void;
  counts: Partial<Record<Topic, number>>;
  total: number;
  /** Gọn: ẩn chữ "Chủ đề:" (vẫn có cho trình đọc màn hình), ô chọn hẹp hơn, để xếp chung hàng với các nút lọc. */
  compact?: boolean;
}) {
  return (
    <label className="flex flex-shrink-0 items-center gap-2 text-sm text-slate-600 dark:text-slate-400" title="Chủ đề">
      <span className={compact ? 'sr-only' : 'font-medium'}>Chủ đề:</span>
      <select
        value={value}
        onChange={(e) => {
          onChange(e.target.value as TopicFilter);
          e.currentTarget.blur(); // trả phím tắt (Space, ←, →) về cho flashcard
        }}
        className={`rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-primary-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 ${
          compact ? 'max-w-[12rem] py-1.5 pl-3 pr-2 text-[13px] font-medium' : 'px-3 py-2 text-sm'
        }`}
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

