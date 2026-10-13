import { useMemo } from 'react';
import { Layers, BookOpen, GraduationCap, Keyboard, Headphones, Mic, MessageCircle, ChevronRight } from 'lucide-react';
import { INITIAL_VOCAB, LEVEL_LABEL, LEVEL_ORDER } from '@/data/vocabData';
import { useSrsProgress } from '@/hooks/useSrsProgress';
import { vocabKey } from '@/lib/vocabKey';
import { isDue } from '@/lib/srs';
import type { ViewKey } from '@/components/Sidebar';

const practice: { key: ViewKey; title: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'lessons', title: 'Từ vựng và bài tập', desc: 'Xem từ theo cấp và chủ đề, làm trắc nghiệm', icon: GraduationCap },
  { key: 'conversation', title: 'Giao tiếp thường dùng', desc: 'Câu mẫu theo tình huống, có phát âm', icon: MessageCircle },
  { key: 'spelling', title: 'Luyện chính tả', desc: 'Đọc nghĩa tiếng Việt, gõ lại từ tiếng Anh', icon: Keyboard },
  { key: 'dictation', title: 'Nghe chép', desc: 'Nghe phát âm, gõ lại từ hoặc câu', icon: Headphones },
  { key: 'shadowing', title: 'Shadowing', desc: 'Nghe câu mẫu, nhại theo và thu âm giọng mình', icon: Mic },
  { key: 'dictionary', title: 'Tra cứu từ', desc: 'Tìm theo từ tiếng Anh hoặc nghĩa tiếng Việt', icon: BookOpen },
];

export function HomeView({ onNavigate }: { onNavigate: (view: ViewKey) => void }) {
  const { progressMap } = useSrsProgress();

  const stats = useMemo(() => {
    let due = 0;
    let learned = 0;
    for (const w of INITIAL_VOCAB) {
      const s = progressMap[vocabKey(w)];
      if (!s) continue;
      learned += 1;
      if (isDue(s.nextReview)) due += 1;
    }
    const levels = LEVEL_ORDER.map((level) => {
      const words = INITIAL_VOCAB.filter((w) => w.level === level);
      const done = words.filter((w) => progressMap[vocabKey(w)]).length;
      return { level, total: words.length, done };
    }).filter((l) => l.total > 0);
    return { due, learned, fresh: INITIAL_VOCAB.length - learned, levels };
  }, [progressMap]);

  const headline =
    stats.learned === 0
      ? 'Bắt đầu với những từ đầu tiên'
      : stats.due > 0
      ? `${stats.due} thẻ cần ôn hôm nay`
      : 'Bạn đã ôn xong các thẻ đến hạn';
  const sub =
    stats.learned === 0
      ? `${INITIAL_VOCAB.length} từ đang chờ, học từng thẻ một.`
      : stats.due > 0
      ? `Ôn xong rồi học tiếp ${stats.fresh} từ mới.`
      : `Còn ${stats.fresh} từ mới nếu bạn muốn học thêm.`;
  const cta = stats.due > 0 || stats.learned === 0 ? 'Bắt đầu ôn' : 'Học từ mới';

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <section aria-labelledby="today">
        <p className="text-sm text-slate-500 dark:text-slate-400">Hôm nay</p>
        <h1 id="today" className="mt-1 font-display text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
          {headline}
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">{sub}</p>
        <button
          onClick={() => onNavigate('flashcards')}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-base font-semibold text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)] transition-colors hover:bg-primary-700"
        >
          <Layers className="h-5 w-5" />
          {cta}
        </button>
      </section>

      <section aria-labelledby="progress">
        <h2 id="progress" className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Tiến độ theo cấp
        </h2>
        <ul className="mt-4 space-y-3">
          {stats.levels.map(({ level, total, done }) => (
            <li key={level} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300">{LEVEL_LABEL[level]}</span>
              <div
                className="h-2 overflow-hidden rounded-full bg-primary-100 dark:bg-slate-800"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={done}
                aria-label={`Đã học ${done} trên ${total} từ cấp ${LEVEL_LABEL[level]}`}
              >
                <div className="h-full rounded-full bg-primary-600 transition-[width] duration-500" style={{ width: `${(done / total) * 100}%` }} />
              </div>
              <span className="tabular-nums text-slate-500 dark:text-slate-400">
                {done}/{total}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="practice">
        <h2 id="practice" className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Luyện thêm
        </h2>
        <ul className="mt-3 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {practice.map(({ key, title, desc, icon: Icon }) => (
            <li key={key}>
              <button
                onClick={() => onNavigate(key)}
                className="flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-300">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</span>
                  <span className="block truncate text-sm text-slate-500 dark:text-slate-400">{desc}</span>
                </span>
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-400" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
