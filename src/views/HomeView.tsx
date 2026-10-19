import { useMemo } from 'react';
import { Layers, BookOpen, GraduationCap, Keyboard, Headphones, Mic, MessageCircle, ChevronRight, Gamepad2, ClipboardCheck, Flame, Check } from 'lucide-react';
import { INITIAL_VOCAB, LEVEL_LABEL, LEVEL_ORDER } from '@/data/vocabData';
import { useSrsProgress } from '@/hooks/useSrsProgress';
import { vocabKey } from '@/lib/vocabKey';
import { isDue } from '@/lib/srs';
import { useStudyStats } from '@/hooks/useStudyTime';
import { GOAL_SECONDS } from '@/lib/studyTime';
import type { ViewKey } from '@/components/Sidebar';

const practice: { key: ViewKey; title: string; desc: string; tone: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'games', title: 'Trò chơi theo chủ đề', desc: 'Học từng bài theo chủ đề, rồi chơi để ôn lại', tone: 'bg-[#d8eaf7] text-[#2b9fd0] dark:bg-sky-950/60 dark:text-sky-300', icon: Gamepad2 },
  { key: 'test', title: 'Kiểm tra TOEIC', desc: 'Luyện các Part nghe và đọc, có giải thích từng câu', tone: 'bg-[#f6e8c8] text-[#c98a12] dark:bg-yellow-950/60 dark:text-yellow-300', icon: ClipboardCheck },
  { key: 'lessons', title: 'Từ vựng và bài tập', desc: 'Xem từ theo cấp và chủ đề, làm trắc nghiệm', tone: 'bg-[#e4e0fb] text-[#7a5af0] dark:bg-violet-950/60 dark:text-violet-300', icon: GraduationCap },
  { key: 'conversation', title: 'Giao tiếp thường dùng', desc: 'Câu mẫu theo tình huống, có phát âm', tone: 'bg-[#d8ece4] text-[#2fb37a] dark:bg-emerald-950/60 dark:text-emerald-300', icon: MessageCircle },
  { key: 'spelling', title: 'Luyện chính tả', desc: 'Đọc nghĩa tiếng Việt, gõ lại từ tiếng Anh', tone: 'bg-[#f3e6da] text-[#e8913a] dark:bg-orange-950/60 dark:text-orange-300', icon: Keyboard },
  { key: 'dictation', title: 'Nghe chép', desc: 'Nghe phát âm, gõ lại từ hoặc câu', tone: 'bg-[#f3dfdf] text-[#e0626a] dark:bg-rose-950/60 dark:text-rose-300', icon: Headphones },
  { key: 'shadowing', title: 'Shadowing', desc: 'Nghe câu mẫu, nhại theo và thu âm giọng mình', tone: 'bg-[#dfdefc] text-[#6366f1] dark:bg-fuchsia-950/60 dark:text-fuchsia-300', icon: Mic },
  { key: 'dictionary', title: 'Tra cứu từ', desc: 'Tìm theo từ tiếng Anh hoặc nghĩa tiếng Việt', tone: 'bg-[#f2dae7] text-[#ec5fa0] dark:bg-amber-950/60 dark:text-amber-300', icon: BookOpen },
];

export function HomeView({ onNavigate }: { onNavigate: (view: ViewKey) => void }) {
  const { progressMap } = useSrsProgress();
  const study = useStudyStats();

  const stats = useMemo(() => {
    let due = 0;
    let learned = 0;
    for (const w of INITIAL_VOCAB) {
      const s = progressMap[vocabKey(w)];
      if (!s) continue;
      learned += 1;
      if (isDue(s.nextReview)) due += 1;
    }
    // Thuộc rồi = lần ôn gần nhất là "good" hoặc "easy"; chưa thuộc = "hard"; chưa học = chưa có tiến độ.
    const levels = LEVEL_ORDER.map((level) => {
      const words = INITIAL_VOCAB.filter((w) => w.level === level);
      let known = 0;
      let hard = 0;
      for (const w of words) {
        const st = progressMap[vocabKey(w)];
        if (!st) continue;
        if (st.lastQuality === 'hard') hard += 1;
        else known += 1;
      }
      return { level, total: words.length, known, hard, fresh: words.length - known - hard };
    }).filter((l) => l.total > 0);
    const totals = levels.reduce(
      (t, l) => ({ total: t.total + l.total, known: t.known + l.known, hard: t.hard + l.hard, fresh: t.fresh + l.fresh }),
      { total: 0, known: 0, hard: 0, fresh: 0 }
    );
    return { due, learned, fresh: INITIAL_VOCAB.length - learned, levels, totals };
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

  const goalMinutes = Math.round(GOAL_SECONDS / 60);
  const todayMinutes = Math.floor(study.todaySeconds / 60);
  const remainingMinutes = Math.max(1, Math.ceil((GOAL_SECONDS - study.todaySeconds) / 60));
  const streakMessage = study.todayMet
    ? 'Bạn đã đạt mục tiêu hôm nay. Quay lại ngày mai để giữ chuỗi nhé.'
    : study.streak > 0
    ? `Học thêm ${remainingMinutes} phút hôm nay để giữ chuỗi ${study.streak} ngày.`
    : `Học đủ ${goalMinutes} phút mỗi ngày để bắt đầu một chuỗi mới.`;

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
          className="lift mt-7 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary-700 via-primary-600 to-[#705ceb] dark:from-primary-600 dark:via-primary-600 dark:to-primary-500 px-7 py-4 text-lg font-bold text-white shadow-[0_14px_28px_-12px_rgba(26,34,69,0.75),inset_0_1px_0_rgba(255,255,255,0.18)] transition hover:brightness-110 active:scale-[0.98]"
        >
          <Layers className="h-6 w-6" />
          {cta}
        </button>
      </section>

      <section
        aria-labelledby="streak"
        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_34px_-18px_rgba(80,72,150,0.5)] dark:border-slate-800 dark:bg-slate-900 sm:-mx-5"
      >
        <div className="flex items-center gap-4">
          <span
            className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl ${
              study.streak > 0 ? 'bg-[#fde7d9] text-[#f08a3c] dark:bg-orange-950/50 dark:text-orange-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
            }`}
          >
            <Flame className="h-7 w-7" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="streak" className="text-lg font-bold text-ink dark:text-slate-100">
              Chuỗi học: {study.streak} ngày
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">{streakMessage}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400">Kỷ lục</p>
            <p className="text-xl font-bold tabular-nums text-ink dark:text-slate-100">{study.longest}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">Hôm nay</span>
            <span className="tabular-nums text-slate-700 dark:text-slate-300">
              {todayMinutes}/{goalMinutes} phút
              {study.todayMet && <Check className="ml-1 inline h-4 w-4 text-success-600 dark:text-success-400" aria-label="Đã đạt mục tiêu" />}
            </span>
          </div>
          <div
            className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-primary-200/80 dark:bg-slate-800"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={goalMinutes}
            aria-valuenow={Math.min(todayMinutes, goalMinutes)}
            aria-label="Thời gian học hôm nay"
          >
            <div
              className={`h-full rounded-full transition-[width] duration-500 ${study.todayMet ? 'bg-success-500' : 'bg-gradient-to-r from-primary-600 to-[#705ceb]'}`}
              style={{ width: `${Math.min(100, (study.todaySeconds / GOAL_SECONDS) * 100)}%`, minWidth: study.todaySeconds > 0 ? 8 : 0 }}
            />
          </div>
        </div>

        <ol className="mt-4 grid grid-cols-7 gap-2" aria-label="7 ngày gần nhất">
          {study.last7.map((d) => (
            <li key={d.key} className="flex flex-col items-center gap-1">
              <span className={`text-xs ${d.isToday ? 'font-bold text-ink dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>{d.label}</span>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold tabular-nums ${
                  d.met
                    ? 'bg-primary-600 text-white dark:bg-primary-500'
                    : d.seconds > 0
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300'
                    : 'border border-dashed border-slate-300 text-transparent dark:border-slate-700'
                } ${d.isToday ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900' : ''}`}
                title={`${d.key}: ${Math.floor(d.seconds / 60)} phút`}
              >
                {d.met ? <Check className="h-4 w-4" aria-label="Đạt mục tiêu" /> : d.seconds > 0 ? Math.floor(d.seconds / 60) : '0'}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Thời gian học được tính khi bạn làm bài ở các mục (không tính trang chủ) và tạm dừng nếu 1 phút không thao tác. Dữ liệu lưu trên máy này.
        </p>
      </section>

      <section
        aria-labelledby="progress"
        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_34px_-18px_rgba(80,72,150,0.5)] dark:border-slate-800 dark:bg-slate-900 sm:-mx-5"
      >
        <h2 id="progress" className="text-lg font-bold text-ink dark:text-slate-100">
          Tiến độ theo cấp
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Tổng {stats.totals.total} từ: <b className="text-success-600 dark:text-success-400">{stats.totals.known}</b> thuộc rồi ·{' '}
          <b className="text-[#e0626a] dark:text-error-400">{stats.totals.hard}</b> chưa thuộc · <b>{stats.totals.fresh}</b> chưa học
        </p>
        <ul className="mt-4 space-y-5">
          {stats.levels.map(({ level, total, known, hard, fresh }) => (
            <li key={level}>
              <div className="flex items-baseline justify-between text-base">
                <span className="font-semibold text-ink dark:text-slate-200">{LEVEL_LABEL[level]}</span>
                <span className="tabular-nums text-slate-700 dark:text-slate-400">
                  {known + hard}/{total} đã học
                </span>
              </div>
              <div
                className="mt-1.5 flex h-3 overflow-hidden rounded-full bg-primary-200/80 dark:bg-slate-800"
                role="img"
                aria-label={`Cấp ${LEVEL_LABEL[level]}: ${known} từ thuộc rồi, ${hard} từ chưa thuộc, ${fresh} từ chưa học`}
              >
                <div className="h-full bg-success-500 transition-[width] duration-500" style={{ width: `${(known / total) * 100}%`, minWidth: known > 0 ? 6 : 0 }} />
                <div className="h-full bg-[#f08a85] transition-[width] duration-500 dark:bg-error-500" style={{ width: `${(hard / total) * 100}%`, minWidth: hard > 0 ? 6 : 0 }} />
              </div>
              <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-slate-700 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-success-500" aria-hidden="true" />
                  Thuộc rồi <b className="tabular-nums text-ink dark:text-slate-200">{known}</b>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#f08a85] dark:bg-error-500" aria-hidden="true" />
                  Chưa thuộc <b className="tabular-nums text-ink dark:text-slate-200">{hard}</b>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary-200 dark:bg-slate-700" aria-hidden="true" />
                  Chưa học <b className="tabular-nums text-ink dark:text-slate-200">{fresh}</b>
                </span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="practice">
        <h2 id="practice" className="text-xl font-bold text-ink dark:text-slate-100">
          Luyện thêm
        </h2>
        <ul className="mt-3 space-y-3 px-1 pb-2">
          {practice.map(({ key, title, desc, tone, icon: Icon }) => (
            <li key={key}>
              <button
                onClick={() => onNavigate(key)}
                className="lift flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-[0_10px_26px_-18px_rgba(80,72,150,0.5)] hover:border-primary-400 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${tone}`}>
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
