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
        <p className="text-base text-slate-700 dark:text-slate-300">Hôm nay</p>
        <h1 id="today" className="mt-1 font-display text-4xl font-extrabold tracking-tight text-ink dark:text-slate-100 sm:text-5xl">
          {headline}
        </h1>
        <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">{sub}</p>
        <button
          onClick={() => onNavigate('flashcards')}
          className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary-700 via-primary-600 to-[#a9705a] px-7 py-4 text-lg font-bold text-white shadow-[0_14px_28px_-12px_rgba(26,34,69,0.75),inset_0_1px_0_rgba(255,255,255,0.18)] transition hover:brightness-110 active:scale-[0.98]"
        >
          <Layers className="h-6 w-6" />
          {cta}
        </button>
      </section>

      <section
        aria-labelledby="progress"
        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_34px_-18px_rgba(110,75,40,0.5)] dark:border-slate-800 dark:bg-slate-900 sm:-mx-5"
      >
        <h2 id="progress" className="text-lg font-bold text-ink dark:text-slate-100">
          Tiến độ theo cấp
        </h2>
        <ul className="mt-4 space-y-4">
          {stats.levels.map(({ level, total, done }) => (
            <li key={level} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 text-base">
              <span className="text-slate-800 dark:text-slate-300">{LEVEL_LABEL[level]}</span>
              <div
                className="h-2.5 overflow-hidden rounded-full bg-primary-200/70 dark:bg-slate-800"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={done}
                aria-label={`Đã học ${done} trên ${total} từ cấp ${LEVEL_LABEL[level]}`}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-400 transition-[width] duration-500"
                  style={{ width: `${(done / total) * 100}%`, minWidth: done > 0 ? 8 : 0 }}
                />
              </div>
              <span className="tabular-nums text-slate-800 dark:text-slate-400">
                {done}/{total}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="practice">
        <h2 id="practice" className="text-xl font-bold text-ink dark:text-slate-100">
          Luyện thêm
        </h2>
        <ul className="mt-3 divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_34px_-18px_rgba(110,75,40,0.5)] dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {practice.map(({ key, title, desc, icon: Icon }) => (
            <li key={key}>
              <button
                onClick={() => onNavigate(key)}
                className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-primary-50 dark:hover:bg-slate-800/60"
              >
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold text-ink dark:text-slate-100">{title}</span>
                  <span className="block truncate text-[15px] text-slate-700 dark:text-slate-400">{desc}</span>
                </span>
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-500" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
