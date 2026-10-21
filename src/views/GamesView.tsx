import { useEffect, useMemo, useState } from 'react';
import { Gamepad2, ArrowLeft, BookOpen, Check, ChevronRight, Headphones, ListChecks, Link2, Puzzle, PlayCircle, Star } from 'lucide-react';
import { INITIAL_VOCAB } from '@/data/vocabData';
import { TOPICS, TOPIC_LABEL } from '@/data/vocabTopics';
import type { Topic } from '@/data/vocabTopics';
import { GROUP_LABEL, GROUP_ORDER } from '@/lib/topicUtils';
import type { VocabItem } from '@/lib/types';
import { GAMES_CHANGED_EVENT, loadGameProgress, saveGameProgress } from '@/lib/gameProgress';
import type { GameKey, GameProgress } from '@/lib/gameProgress';
import { LESSON_SIZE, chunk, sortForLearning } from './games/gameUtils';
import { PageHeader } from '@/components/PageHeader';
import { LearnLesson } from './games/LearnLesson';
import { QuizGame } from './games/QuizGame';
import { MatchGame } from './games/MatchGame';
import { ScrambleGame } from './games/ScrambleGame';

const TOPIC_EMOJI: Record<Topic, string> = {
  greet: '👋', time: '⏰', people: '👨‍👩‍👧', food: '🍜', shop: '🛍️', travel: '🚌', place: '📍', home: '🏠',
  health: '🩺', nature: '🌿', fun: '⚽', feel: '😊', verb: '🏃', grammar: '🔤', school: '🎓', general: '📦',
  office: '💼', biz: '📈', hr: '🤝', tech: '💻', cyber: '🔐', academic: '🧠', society: '🌍',
};

const GAMES: { key: GameKey; title: string; desc: string; tone: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'quiz', title: 'Trắc nghiệm nhanh', desc: '10 câu chọn nghĩa hoặc chọn từ', tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400', icon: ListChecks },
  { key: 'match', title: 'Ghép cặp', desc: 'Nối từ tiếng Anh với nghĩa', tone: 'bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-400', icon: Link2 },
  { key: 'listen', title: 'Nghe và chọn', desc: 'Nghe phát âm, chọn đúng từ', tone: 'bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400', icon: Headphones },
  { key: 'scramble', title: 'Xếp chữ', desc: 'Sắp xếp chữ cái thành từ', tone: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400', icon: Puzzle },
];

/** Màu nền ô biểu tượng chủ đề, xoay vòng theo thứ tự trong nhóm. */
const TILE_TONES = [
  'bg-indigo-50 dark:bg-indigo-950/50',
  'bg-pink-50 dark:bg-pink-950/50',
  'bg-emerald-50 dark:bg-emerald-950/50',
  'bg-cyan-50 dark:bg-cyan-950/50',
  'bg-lime-50 dark:bg-lime-950/50',
  'bg-blue-50 dark:bg-blue-950/50',
  'bg-yellow-50 dark:bg-yellow-950/50',
  'bg-orange-50 dark:bg-orange-950/50',
];

const CARD = 'border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900';
const CARD_HOVER = 'transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-400 hover:shadow-card-hover';

type Screen = 'hub' | 'lesson' | 'learn' | GameKey;
const LESSONS_SHOWN = 12;

/** Chia từ của một chủ đề thành các bài ~10 từ; bài cuối quá ngắn thì gộp vào bài trước. */
function makeLessons(words: VocabItem[]): VocabItem[][] {
  const lessons = chunk(words, LESSON_SIZE);
  if (lessons.length > 1 && lessons[lessons.length - 1].length < 4) {
    const last = lessons.pop()!;
    lessons[lessons.length - 1] = [...lessons[lessons.length - 1], ...last];
  }
  return lessons;
}

export function GamesView() {
  const [progress, setProgress] = useState<GameProgress>(loadGameProgress);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [screen, setScreen] = useState<Screen>('hub');
  const [lessonIdx, setLessonIdx] = useState(0);
  const [showAllLessons, setShowAllLessons] = useState(false);

  useEffect(() => {
    saveGameProgress(progress);
  }, [progress]);

  // Tiến độ vừa được gộp từ cloud (hoặc xóa khi đăng xuất): đọc lại từ máy.
  useEffect(() => {
    const reload = () => setProgress(loadGameProgress());
    window.addEventListener(GAMES_CHANGED_EVENT, reload);
    return () => window.removeEventListener(GAMES_CHANGED_EVENT, reload);
  }, []);

  // Từ và số bài của mọi chủ đề (tính một lần).
  const byTopic = useMemo(() => {
    const map = new Map<Topic, VocabItem[]>();
    for (const w of INITIAL_VOCAB) {
      const list = map.get(w.topic);
      if (list) list.push(w);
      else map.set(w.topic, [w]);
    }
    const out = new Map<Topic, { words: VocabItem[]; lessons: VocabItem[][] }>();
    for (const [t, list] of map) {
      const words = sortForLearning(list);
      out.set(t, { words, lessons: makeLessons(words) });
    }
    return out;
  }, []);

  // Sao tích lũy: mỗi bài được 1 sao khi học xong và thêm 1 sao khi có trò chơi đạt từ 80% trở lên.
  const stars = useMemo(() => {
    let got = 0;
    let max = 0;
    for (const [t, d] of byTopic) {
      max += d.lessons.length * 2;
      const p = progress[t];
      if (!p) continue;
      d.lessons.forEach((_, i) => {
        if (p.lessons.includes(i)) got += 1;
        const b = p.best[String(i)];
        if (b && Object.values(b).some((v) => (v ?? 0) >= 80)) got += 1;
      });
    }
    return { got, max };
  }, [byTopic, progress]);

  const data = topic ? byTopic.get(topic) : undefined;
  const lessonsDone = topic ? progress[topic]?.lessons ?? [] : [];

  const markLesson = (t: Topic, i: number) =>
    setProgress((p) => {
      const cur = p[t] ?? { lessons: [], best: {} };
      if (cur.lessons.includes(i)) return p;
      return { ...p, [t]: { ...cur, lessons: [...cur.lessons, i] } };
    });

  const saveBest = (t: Topic, lesson: number, game: GameKey, score: number, total: number) =>
    setProgress((p) => {
      const cur = p[t] ?? { lessons: [], best: {} };
      const lessonBest = cur.best[String(lesson)] ?? {};
      const pct = total > 0 ? Math.round((score / total) * 100) : 0;
      if ((lessonBest[game] ?? -1) >= pct) return p;
      return { ...p, [t]: { ...cur, best: { ...cur.best, [String(lesson)]: { ...lessonBest, [game]: pct } } } };
    });

  const openTopic = (t: Topic) => {
    setTopic(t);
    setScreen('hub');
    setShowAllLessons(false);
    window.scrollTo({ top: 0 });
  };

  // ---------------------------------------------------------------- chọn chủ đề
  if (!topic || !data) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 pb-6">
        <PageHeader
          icon={Gamepad2}
          title="Trò chơi từ vựng"
          description="Chọn một chủ đề: học từng bài 10 từ, rồi chơi các trò ghép thẻ, nghe và xếp chữ để ôn lại. Tiến độ trò chơi lưu trên máy này."
          aside={
            <div
              className="shrink-0 rounded-2xl border border-amber-200/70 bg-amber-50 px-4 py-2.5 text-center dark:border-amber-800/50 dark:bg-amber-950/40"
              title="Mỗi bài được 1 sao khi học xong và thêm 1 sao khi có trò chơi đạt từ 80% trở lên"
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">Sao tích lũy</p>
              <p className="mt-0.5 flex items-center justify-center gap-1.5 text-base font-extrabold tabular-nums text-amber-600 dark:text-amber-400">
                <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                {stars.got} <span className="text-xs font-semibold text-amber-600/70 dark:text-amber-400/70">/ {stars.max}</span>
              </p>
            </div>
          }
        />
        {GROUP_ORDER.map((g) => {
          const items = TOPICS.filter((t) => t.group === g && byTopic.has(t.key));
          if (items.length === 0) return null;
          return (
            <section key={g} aria-label={GROUP_LABEL[g]}>
              <h2 className="mb-3 px-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{GROUP_LABEL[g]}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((t, idx) => {
                  const d = byTopic.get(t.key)!;
                  const done = Math.min(progress[t.key]?.lessons.length ?? 0, d.lessons.length);
                  return (
                    <button
                      key={t.key}
                      onClick={() => openTopic(t.key)}
                      className={`group flex flex-col justify-between gap-3 rounded-2xl p-4 text-left ${CARD} ${CARD_HOVER}`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl transition-transform group-hover:scale-105 ${TILE_TONES[idx % TILE_TONES.length]}`}
                          aria-hidden="true"
                        >
                          {TOPIC_EMOJI[t.key]}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-primary-700 dark:text-white dark:group-hover:text-primary-300">{t.label}</span>
                          <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400">
                            {d.words.length} từ • {d.lessons.length} bài
                          </span>
                        </span>
                      </span>
                      <span className="block space-y-1.5">
                        <span
                          className="block h-1.5 overflow-hidden rounded-full bg-primary-100 dark:bg-slate-800"
                          role="progressbar"
                          aria-valuemin={0}
                          aria-valuemax={d.lessons.length}
                          aria-valuenow={done}
                          aria-label={`Đã học ${done} trên ${d.lessons.length} bài`}
                        >
                          <span className="block h-full rounded-full bg-primary-600 transition-all duration-500" style={{ width: `${(done / d.lessons.length) * 100}%` }} />
                        </span>
                        <span className="flex items-center justify-between text-[11px]">
                          <span className="font-medium tabular-nums text-slate-500 dark:text-slate-400">
                            Đã học {done}/{d.lessons.length} bài
                          </span>
                          <span className="flex items-center font-bold text-primary-700 transition-transform group-hover:translate-x-0.5 dark:text-primary-300">
                            Chơi <ChevronRight className="h-3 w-3" />
                          </span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  // ---------------------------------------------------------------- trong một chủ đề
  const label = TOPIC_LABEL[topic];
  const lesson = data.lessons[lessonIdx] ?? [];
  const lessonNo = lessonIdx + 1;
  const best = progress[topic]?.best[String(lessonIdx)] ?? {};
  const nextLesson = data.lessons.findIndex((_, i) => !lessonsDone.includes(i));

  const backLabel = screen === 'hub' ? 'Tất cả chủ đề' : screen === 'lesson' ? label : `Bài ${lessonNo}`;
  const header = (
    <button
      onClick={() => (screen === 'hub' ? setTopic(null) : screen === 'lesson' ? setScreen('hub') : setScreen('lesson'))}
      className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-white hover:text-primary-700 dark:text-slate-400 dark:hover:bg-slate-800"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      {backLabel}
    </button>
  );
  const toLesson = () => setScreen('lesson');
  const openLesson = (i: number) => {
    setLessonIdx(i);
    setScreen('lesson');
    window.scrollTo({ top: 0 });
  };
  const go = (s: Screen) => {
    setScreen(s);
    window.scrollTo({ top: 0 });
  };

  if (screen === 'learn') {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        {header}
        <LearnLesson
          key={lessonIdx}
          lessonNo={lessonNo}
          words={lesson}
          onComplete={() => markLesson(topic, lessonIdx)}
          onQuiz={() => go('quiz')}
          onExit={toLesson}
        />
      </div>
    );
  }
  if (screen !== 'hub' && screen !== 'lesson') {
    // Trò chơi chỉ dùng từ của bài đang chọn; đáp án nhiễu lấy từ cả chủ đề.
    const fin = (s: number, t: number) => saveBest(topic, lessonIdx, screen, s, t);
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        {header}
        {screen === 'quiz' && <QuizGame words={lesson} pool={data.words} mode="quiz" onExit={toLesson} onFinish={fin} />}
        {screen === 'listen' && <QuizGame words={lesson} pool={data.words} mode="listen" onExit={toLesson} onFinish={fin} />}
        {screen === 'match' && <MatchGame words={lesson} onExit={toLesson} onFinish={fin} />}
        {screen === 'scramble' && <ScrambleGame words={lesson} onExit={toLesson} onFinish={fin} />}
      </div>
    );
  }

  // ---------------------------------------------------------------- trang một bài
  if (screen === 'lesson') {
    const done = lessonsDone.includes(lessonIdx);
    return (
      <div className="mx-auto max-w-5xl space-y-6 pb-6">
        <div className="space-y-3">
          {header}
          <div className={`flex items-center gap-4 rounded-3xl p-5 sm:p-6 ${CARD}`}>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-2xl dark:bg-primary-950/80" aria-hidden="true">
              {TOPIC_EMOJI[topic]}
            </span>
            <div className="min-w-0">
              <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Bài {lessonNo}
                {done && <Check className="h-5 w-5 text-success-600 dark:text-success-400" aria-label="Đã học" />}
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-[13px]">
                {label} • {lesson.length} từ: {lesson.map((x) => x.word).join(', ')}
              </p>
            </div>
          </div>
        </div>

        <section aria-label="Học bài" className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4 ${CARD}`}>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-950/60 dark:text-primary-300">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Học {lesson.length} từ của bài</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Nghĩa, ví dụ, phát âm và hình minh họa</p>
            </div>
          </div>
          <button
            onClick={() => go('learn')}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-primary-600/20 transition-colors hover:bg-primary-700"
          >
            <PlayCircle className="h-4 w-4" />
            {done ? 'Học lại' : 'Bắt đầu học'}
          </button>
        </section>

        <section aria-label="Trò chơi ôn tập" className="space-y-3">
          <h2 className="px-1 text-base font-bold text-slate-900 dark:text-white">Chơi để ôn tập bài {lessonNo}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {GAMES.map(({ key, title, desc, tone, icon: Icon }) => (
              <button key={key} onClick={() => go(key)} className={`group flex items-center gap-3.5 rounded-2xl p-4 text-left ${CARD} ${CARD_HOVER}`}>
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-slate-900 dark:text-white">{title}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{desc}</span>
                </span>
                {best[key] !== undefined && (
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold tabular-nums text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    Cao nhất {best[key]}%
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ---------------------------------------------------------------- trang chủ đề: danh sách bài
  const shownLessons = showAllLessons ? data.lessons : data.lessons.slice(0, LESSONS_SHOWN);
  const doneCount = Math.min(lessonsDone.length, data.lessons.length);
  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-6">
      <div className="space-y-3">
        {header}
        <div className={`flex flex-col justify-between gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:p-6 ${CARD}`}>
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-2xl dark:bg-primary-950/80" aria-hidden="true">
              {TOPIC_EMOJI[topic]}
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{label}</h1>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-[13px]">
                {data.words.length} từ chia thành {data.lessons.length} bài, từ dễ đến khó. Đã học {doneCount}/{data.lessons.length} bài. Chọn một bài để học và chơi trò chơi ôn tập riêng cho bài đó.
              </p>
            </div>
          </div>
          <button
            onClick={() => openLesson(nextLesson >= 0 ? nextLesson : 0)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-primary-600/20 transition-colors hover:bg-primary-700"
          >
            <PlayCircle className="h-4 w-4" />
            {lessonsDone.length === 0 ? 'Bắt đầu bài 1' : nextLesson >= 0 ? `Vào bài ${nextLesson + 1}` : 'Vào lại bài 1'}
          </button>
        </div>
      </div>

      <section aria-label="Danh sách bài" className="space-y-3">
        <h2 className="px-1 text-base font-bold text-slate-900 dark:text-white">Chọn bài</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {shownLessons.map((l, i) => {
            const done = lessonsDone.includes(i);
            return (
              <button
                key={i}
                onClick={() => openLesson(i)}
                className={`rounded-2xl border p-3.5 text-left shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-400 hover:shadow-card-hover ${
                  done
                    ? 'border-success-200 bg-success-50 dark:border-success-900 dark:bg-success-950/30'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <span className="flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    Bài {i + 1}
                  </span>
                  {done && <Check className="h-4 w-4 text-success-600 dark:text-success-400" aria-label="Đã học" />}
                </span>
                <span className="mt-1 block truncate text-xs text-slate-500 dark:text-slate-400">{l.slice(0, 3).map((x) => x.word).join(', ')}...</span>
              </button>
            );
          })}
        </div>
        {data.lessons.length > LESSONS_SHOWN && (
          <button onClick={() => setShowAllLessons((v) => !v)} className="px-1 text-xs font-bold text-primary-700 hover:underline dark:text-primary-300">
            {showAllLessons ? 'Thu gọn danh sách bài' : `Hiện tất cả ${data.lessons.length} bài`}
          </button>
        )}
      </section>
    </div>
  );
}
