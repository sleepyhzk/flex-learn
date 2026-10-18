import { useEffect, useMemo, useState } from 'react';
import { Gamepad2, ArrowLeft, BookOpen, Check, Headphones, ListChecks, Link2, Puzzle, PlayCircle } from 'lucide-react';
import { INITIAL_VOCAB } from '@/data/vocabData';
import { TOPICS, TOPIC_LABEL } from '@/data/vocabTopics';
import type { Topic } from '@/data/vocabTopics';
import { GROUP_LABEL, GROUP_ORDER } from '@/components/TopicSelect';
import type { VocabItem } from '@/lib/types';
import { GAMES_CHANGED_EVENT, loadGameProgress, saveGameProgress } from '@/lib/gameProgress';
import type { GameKey, GameProgress } from '@/lib/gameProgress';
import { LESSON_SIZE, chunk, sortForLearning } from './games/gameUtils';
import { LearnLesson } from './games/LearnLesson';
import { QuizGame } from './games/QuizGame';
import { MatchGame } from './games/MatchGame';
import { ScrambleGame } from './games/ScrambleGame';

const TOPIC_EMOJI: Record<Topic, string> = {
  greet: '👋', time: '⏰', people: '👨‍👩‍👧', food: '🍜', shop: '🛍️', travel: '🚌', place: '📍', home: '🏠',
  health: '🩺', nature: '🌿', fun: '⚽', feel: '😊', verb: '🏃', grammar: '🔤', school: '🎓', general: '📦',
  office: '💼', biz: '📈', hr: '🤝', tech: '💻', cyber: '🔐', academic: '🧠', society: '🌍',
};

const GAMES: { key: GameKey; title: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'quiz', title: 'Trắc nghiệm nhanh', desc: '10 câu chọn nghĩa hoặc chọn từ', icon: ListChecks },
  { key: 'match', title: 'Ghép cặp', desc: 'Nối từ tiếng Anh với nghĩa', icon: Link2 },
  { key: 'listen', title: 'Nghe và chọn', desc: 'Nghe phát âm, chọn đúng từ', icon: Headphones },
  { key: 'scramble', title: 'Xếp chữ', desc: 'Sắp xếp chữ cái thành từ', icon: Puzzle },
];

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
  const backToHub = () => setScreen('hub');

  // ---------------------------------------------------------------- chọn chủ đề
  if (!topic || !data) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            <Gamepad2 className="h-6 w-6 text-primary-600" />
            Trò chơi
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Chọn một chủ đề: học từng bài 10 từ, rồi chơi các trò để ôn lại. Tiến độ trò chơi lưu trên máy này.
          </p>
        </div>
        {GROUP_ORDER.map((g) => {
          const items = TOPICS.filter((t) => t.group === g && byTopic.has(t.key));
          if (items.length === 0) return null;
          return (
            <section key={g} aria-label={GROUP_LABEL[g]}>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{GROUP_LABEL[g]}</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((t) => {
                  const d = byTopic.get(t.key)!;
                  const done = Math.min(progress[t.key]?.lessons.length ?? 0, d.lessons.length);
                  return (
                    <button
                      key={t.key}
                      onClick={() => openTopic(t.key)}
                      className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_10px_26px_-18px_rgba(80,72,150,0.5)] lift hover:border-primary-400 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl leading-none" aria-hidden="true">{TOPIC_EMOJI[t.key]}</span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold leading-snug text-slate-900 dark:text-slate-100">{t.label}</p>
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {d.words.length} từ · {d.lessons.length} bài
                          </p>
                        </div>
                      </div>
                      <div
                        className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary-100 dark:bg-slate-800"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={d.lessons.length}
                        aria-valuenow={done}
                        aria-label={`Đã học ${done} trên ${d.lessons.length} bài`}
                      >
                        <div className="h-full rounded-full bg-primary-600" style={{ width: `${(done / d.lessons.length) * 100}%` }} />
                      </div>
                      <p className="mt-1.5 text-xs tabular-nums text-slate-500 dark:text-slate-400">Đã học {done}/{d.lessons.length} bài</p>
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
      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 hover:bg-primary-100/60 dark:text-slate-400 dark:hover:bg-slate-800"
    >
      <ArrowLeft className="h-4 w-4" />
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
      <div className="space-y-7">
        <div>
          {header}
          <h2 className="mt-2 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
            <span aria-hidden="true">{TOPIC_EMOJI[topic]}</span>
            Bài {lessonNo}
            {done && <Check className="h-5 w-5 text-success-600 dark:text-success-400" aria-label="Đã học" />}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {label} · {lesson.length} từ: {lesson.map((x) => x.word).join(', ')}
          </p>
        </div>

        <section aria-label="Học bài" className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">Học {lesson.length} từ của bài</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Nghĩa, ví dụ, phát âm và hình minh họa</p>
            </div>
          </div>
          <button onClick={() => go('learn')} className="inline-flex flex-shrink-0 items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
            <PlayCircle className="h-4 w-4" />
            {done ? 'Học lại' : 'Bắt đầu học'}
          </button>
        </section>

        <section aria-label="Trò chơi ôn tập" className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Chơi để ôn tập bài {lessonNo}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {GAMES.map(({ key, title, desc, icon: Icon }) => (
              <button
                key={key}
                onClick={() => go(key)}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_10px_26px_-18px_rgba(80,72,150,0.5)] lift hover:border-primary-400 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-slate-900 dark:text-slate-100">{title}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{desc}</span>
                </span>
                {best[key] !== undefined && (
                  <span className="flex-shrink-0 rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-accent-700 dark:bg-accent-950/40 dark:text-accent-400">
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
  return (
    <div className="space-y-6">
      <div>
        {header}
        <h2 className="mt-2 flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
          <span aria-hidden="true">{TOPIC_EMOJI[topic]}</span>
          {label}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {data.words.length} từ chia thành {data.lessons.length} bài, từ dễ đến khó. Đã học {Math.min(lessonsDone.length, data.lessons.length)}/{data.lessons.length} bài. Chọn một bài để học và chơi trò chơi ôn tập riêng cho bài đó.
        </p>
      </div>

      <section aria-label="Danh sách bài" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Chọn bài</h3>
          <button
            onClick={() => openLesson(nextLesson >= 0 ? nextLesson : 0)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            <PlayCircle className="h-4 w-4" />
            {lessonsDone.length === 0 ? 'Bắt đầu bài 1' : nextLesson >= 0 ? `Vào bài ${nextLesson + 1}` : 'Vào lại bài 1'}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {shownLessons.map((l, i) => {
            const done = lessonsDone.includes(i);
            return (
              <button
                key={i}
                onClick={() => openLesson(i)}
                className={`rounded-xl border px-3 py-3 text-left lift hover:border-primary-400 ${
                  done
                    ? 'border-success-200 bg-success-50 dark:border-success-900 dark:bg-success-950/30'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <span className="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    Bài {i + 1}
                  </span>
                  {done && <Check className="h-4 w-4 text-success-600 dark:text-success-400" />}
                </span>
                <span className="mt-1 block truncate text-xs text-slate-500 dark:text-slate-400">
                  {l.slice(0, 3).map((x) => x.word).join(', ')}...
                </span>
              </button>
            );
          })}
        </div>
        {data.lessons.length > LESSONS_SHOWN && (
          <button onClick={() => setShowAllLessons((v) => !v)} className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400">
            {showAllLessons ? 'Thu gọn danh sách bài' : `Hiện tất cả ${data.lessons.length} bài`}
          </button>
        )}
      </section>
    </div>
  );
}
