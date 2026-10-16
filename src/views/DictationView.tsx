import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { CONVERSATION_LEVELS } from '@/data/conversationData';
import { Headphones, Check, X, ArrowRight, RotateCcw, Volume2, Trophy, Lightbulb, Eye } from 'lucide-react';
import { LEVEL_LABEL, LEVEL_ORDER } from '@/data/vocabData';
import { buildItems, shuffle } from '@/lib/dictItems';
import type { DictItem, Source } from '@/lib/dictItems';
import { TopicSelect, countByTopic } from '@/components/TopicSelect';
import type { TopicFilter } from '@/components/TopicSelect';
import { speakEnglish, isSpeechSupported } from '@/lib/speech';
import { isDictationCorrect, diffWords, maskWordCount, normalizeSentence } from '@/lib/spelling';
import { useStarred } from '@/hooks/useStarred';
import type { Level } from '@/lib/types';
import type { Topic } from '@/data/vocabTopics';

type LevelFilter = 'all' | Level | 'starred';
type AnswerState = 'idle' | 'correct' | 'wrong';
type Mode = 'full' | 'cloze';
type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTIES: { key: Difficulty; label: string; ratio: number }[] = [
  { key: 'easy', label: 'Dễ', ratio: 0.2 },
  { key: 'medium', label: 'Vừa', ratio: 0.4 },
  { key: 'hard', label: 'Khó', ratio: 0.65 },
];

/** Một từ trong câu đục lỗ: pre/post là dấu câu đứng trước/sau; core là từ cần điền nếu blank = true. */
interface ClozeToken {
  pre: string;
  core: string;
  post: string;
  blank: boolean;
}

/** Tách câu thành các từ và chọn ngẫu nhiên một số từ để đục lỗ (ít nhất 1, chừa lại ít nhất 1 từ nếu câu có từ 2 từ trở lên). */
function buildCloze(sentence: string, ratio: number): ClozeToken[] {
  const tokens: ClozeToken[] = sentence
    .split(/\s+/)
    .filter(Boolean)
    .map((raw) => {
      const m = raw.match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u);
      return { pre: m?.[1] ?? '', core: m?.[2] ?? raw, post: m?.[3] ?? '', blank: false };
    });
  const candidates = tokens.map((t, i) => (t.core ? i : -1)).filter((i) => i >= 0);
  const maxBlanks = candidates.length > 1 ? candidates.length - 1 : 1;
  const count = Math.min(maxBlanks, Math.max(1, Math.round(candidates.length * ratio)));
  for (const i of shuffle(candidates).slice(0, count)) tokens[i].blank = true;
  return tokens;
}

const SOURCES: { key: Source; label: string; desc: string }[] = [
  { key: 'word', label: 'Từ vựng', desc: 'Nghe một từ, gõ lại từ đó' },
  { key: 'example', label: 'Câu ví dụ', desc: 'Nghe câu ví dụ của từ, gõ lại cả câu' },
  { key: 'conversation', label: 'Câu giao tiếp', desc: 'Nghe câu giao tiếp thường dùng, gõ lại cả câu' },
];


/** Ô chọn gọn dạng danh sách thả xuống, dùng để gom các hàng nút thành một hàng. */
function MiniSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { key: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <select
      aria-label={label}
      title={label}
      value={value}
      onChange={(e) => {
        onChange(e.target.value as T);
        e.currentTarget.blur(); // trả phím tắt về cho bài tập
      }}
      className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-primary-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
    >
      {options.map((o) => (
        <option key={o.key} value={o.key}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** Nghe chép chính tả: nghe phát âm rồi gõ lại. Không phân biệt chữ hoa, chữ thường và dấu câu. */
export function DictationView() {
  const [mode, setMode] = useState<Mode>('full');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [fills, setFills] = useState<string[]>([]);
  const [source, setSource] = useState<Source>('word');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [topic, setTopic] = useState<TopicFilter>('all');
  const [input, setInput] = useState('');
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [showMeaning, setShowMeaning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [index, setIndex] = useState(0);
  const [seed, setSeed] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoNextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { starred } = useStarred();

  const allItems = useMemo(() => buildItems(source), [source]);

  const matchesLevel = useCallback(
    (it: DictItem) => {
      if (levelFilter === 'all') return true;
      if (levelFilter === 'starred') return !!it.starKey && starred.has(it.starKey);
      return it.level === levelFilter;
    },
    [levelFilter, starred]
  );

  const levelItems = useMemo(() => allItems.filter(matchesLevel), [allItems, matchesLevel]);
  const topicCounts = useMemo(
    () => countByTopic(levelItems.filter((it): it is DictItem & { topic: Topic } => !!it.topic)),
    [levelItems]
  );

  // `seed` đổi thì xáo lại thứ tự; chỉ giữ các mục khớp bộ lọc.
  const pool = useMemo(
    () => shuffle(levelItems.filter((it) => topic === 'all' || it.topic === topic)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [levelItems, topic, seed]
  );
  const current = pool.length > 0 ? pool[index % pool.length] : undefined;

  const cloze = useMemo(
    () => (mode === 'cloze' && current ? buildCloze(current.answer, DIFFICULTIES.find((d) => d.key === difficulty)!.ratio) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, difficulty, current?.key, index, seed]
  );
  const blankIdx = useMemo(() => cloze.map((t, i) => (t.blank ? i : -1)).filter((i) => i >= 0), [cloze]);

  const clearAutoNext = useCallback(() => {
    if (autoNextTimer.current) {
      clearTimeout(autoNextTimer.current);
      autoNextTimer.current = null;
    }
  }, []);
  useEffect(() => clearAutoNext, [clearAutoNext]);

  // Tự đọc khi sang mục mới.
  useEffect(() => {
    if (!current) return;
    const t = setTimeout(() => speakEnglish(current.speak), 250);
    return () => clearTimeout(t);
  }, [current]);

  const focusInput = () =>
    setTimeout(() => document.querySelector<HTMLInputElement>('[data-dict-input]:not([readonly])')?.focus(), 50);

  const next = useCallback(() => {
    clearAutoNext();
    setInput('');
    setFills([]);
    setAnswerState('idle');
    setShowMeaning(false);
    setShowHint(false);
    setIndex((i) => i + 1);
    focusInput();
  }, [clearAutoNext]);

  const check = useCallback(() => {
    if (answerState !== 'idle' || !current) return;
    const typedAny = mode === 'cloze' ? fills.some((f) => f?.trim()) : !!input.trim();
    if (!typedAny) return;
    const ok =
      mode === 'cloze'
        ? blankIdx.every((ti, k) => normalizeSentence(fills[k] ?? '') === normalizeSentence(cloze[ti].core))
        : isDictationCorrect(input, current.answer);
    setAnswerState(ok ? 'correct' : 'wrong');
    setCompleted((c) => c + 1);
    if (ok) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const ns = s + 1;
        setBestStreak((b) => Math.max(b, ns));
        return ns;
      });
      autoNextTimer.current = setTimeout(() => next(), 1400);
    } else {
      setStreak(0);
    }
  }, [input, fills, mode, cloze, blankIdx, answerState, current, next]);

  const skip = useCallback(() => {
    setStreak(0);
    next();
  }, [next]);

  const retry = useCallback(() => {
    setInput('');
    setFills([]);
    setAnswerState('idle');
    focusInput();
  }, []);

  const replay = useCallback(() => {
    if (current) speakEnglish(current.speak);
    document.querySelector<HTMLInputElement>('[data-dict-input]:not([readonly])')?.focus();
  }, [current]);

  const restart = useCallback(() => {
    clearAutoNext();
    setInput('');
    setFills([]);
    setAnswerState('idle');
    setShowMeaning(false);
    setShowHint(false);
    setIndex(0);
    setScore(0);
    setStreak(0);
    setCompleted(0);
    setSeed((x) => x + 1);
    focusInput();
  }, [clearAutoNext]);

  const switchMode = (m: Mode) => {
    setMode(m);
    if (m === 'cloze' && source === 'word') {
      setSource('example');
      setTopic('all');
    }
    restart();
  };
  const switchDifficulty = (d: Difficulty) => {
    setDifficulty(d);
    restart();
  };
  const switchSource = (s: Source) => {
    setSource(s);
    setTopic('all');
    if (s === 'conversation' && levelFilter !== 'all' && !CONVERSATION_LEVELS.includes(levelFilter as Level)) {
      setLevelFilter('all');
    }
    restart();
  };
  const switchLevel = (l: LevelFilter) => {
    setLevelFilter(l);
    restart();
  };
  const switchTopic = (t: TopicFilter) => {
    setTopic(t);
    restart();
  };

  // Enter: kiểm tra, hoặc sang mục tiếp theo sau khi đã có kết quả (nghe ở cấp cửa sổ, vì ô nhập bị khóa sau khi trả lời).
  // Enter khi ô còn trống: nghe lại.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.isComposing) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, select, a, textarea')) return;
      e.preventDefault();
      if (answerState !== 'idle') next();
      else if (!(mode === 'cloze' ? fills.some((f) => f?.trim()) : input.trim())) replay();
      else check();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [answerState, input, fills, mode, check, next, replay]);

  const levelTabs: { key: LevelFilter; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    ...(source === 'conversation' ? CONVERSATION_LEVELS : LEVEL_ORDER).map((l) => ({
      key: l as LevelFilter,
      label: LEVEL_LABEL[l],
    })),
    ...(source === 'conversation' ? [] : [{ key: 'starred' as LevelFilter, label: 'Đã đánh dấu' }]),
  ];

  const card = 'rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900';
  const ghostBtn =
    'inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700';

  const header = (
    <>
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          <Headphones className="h-6 w-6 text-primary-600" />
          Nghe chép
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Nghe phát âm rồi gõ lại những gì bạn nghe được. Không phân biệt chữ hoa, chữ thường và dấu câu.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <MiniSelect
            label="Kiểu bài"
            value={mode}
            onChange={switchMode}
            options={[
              { key: 'full', label: 'Gõ cả câu' },
              { key: 'cloze', label: 'Đục lỗ (điền chỗ trống)' },
            ]}
          />
          <MiniSelect
            label="Nguồn"
            value={source}
            onChange={switchSource}
            options={SOURCES.filter((s) => mode === 'full' || s.key !== 'word')}
          />
          {mode === 'cloze' && (
            <MiniSelect label="Độ khó" value={difficulty} onChange={switchDifficulty} options={DIFFICULTIES} />
          )}
          <div className="flex w-fit flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            {levelTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => switchLevel(tab.key)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  levelFilter === tab.key
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {source !== 'conversation' && (
          <TopicSelect value={topic} onChange={switchTopic} counts={topicCounts} total={levelItems.length} />
        )}
      </div>
    </>
  );

  if (!isSpeechSupported()) {
    return (
      <div className="space-y-6">
        {header}
        <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          Trình duyệt này không hỗ trợ phát âm nên không làm được bài nghe chép.
        </p>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="space-y-6">
        {header}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
          <Headphones className="mb-4 h-12 w-12 text-slate-300" />
          <p className="text-slate-500 dark:text-slate-400">Không có mục nào trong bộ lọc này.</p>
        </div>
      </div>
    );
  }

  const isSentence = source !== 'word';
  const diff = answerState === 'wrong' && isSentence && mode === 'full' ? diffWords(input, current.answer) : null;

  return (
    <div className="space-y-6">
      {header}

      <div className="grid grid-cols-3 gap-3">
        <div className={card}>
          <p className="text-xs text-slate-400">Điểm</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{score}</p>
        </div>
        <div className={card}>
          <p className="text-xs text-slate-400">Chuỗi đúng</p>
          <p className="flex items-center justify-center gap-1 text-2xl font-bold text-accent-600 dark:text-accent-400">
            {streak} {streak >= 3 && <Trophy className="h-5 w-5" />}
          </p>
        </div>
        <div className={card}>
          <p className="text-xs text-slate-400">Kỷ lục</p>
          <p className="text-2xl font-bold text-success-600 dark:text-success-400">{bestStreak}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-5">
          <button
            onClick={replay}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-primary-700 active:scale-95"
            aria-label="Nghe lại"
          >
            <Volume2 className="h-10 w-10" />
          </button>
          <p className="text-sm text-slate-500 dark:text-slate-400">Bấm để nghe lại</p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {mode === 'full' && (
              <button onClick={() => setShowHint(true)} disabled={showHint || answerState !== 'idle'} className={ghostBtn}>
                <Lightbulb className="h-4 w-4" />
                Gợi ý
              </button>
            )}
            <button
              onClick={() => setShowMeaning(true)}
              disabled={showMeaning || answerState !== 'idle'}
              className={ghostBtn}
            >
              <Eye className="h-4 w-4" />
              Xem nghĩa
            </button>
          </div>
          {showHint && mode === 'full' && (
            <p className="font-mono text-lg tracking-widest text-slate-400">
              {isSentence ? maskWordCount(current.answer) : current.answer.replace(/[\p{L}\p{N}]/gu, '_').split('').join(' ')}
              {!isSentence && current.ipa ? <span className="ml-3 font-ipa tracking-normal text-primary-600 dark:text-primary-400">{current.ipa}</span> : null}
            </p>
          )}
          {showMeaning && <p className="text-center text-lg text-slate-700 dark:text-slate-300">{current.meaning}</p>}

          <div className="w-full max-w-xl">
            {mode === 'cloze' ? (
              <div
                className={`rounded-xl border-2 px-5 py-6 transition-colors ${
                  answerState === 'correct'
                    ? 'border-success-400 bg-success-50 dark:border-success-600 dark:bg-success-900/30'
                    : answerState === 'wrong'
                    ? 'border-error-400 bg-error-50 dark:border-error-600 dark:bg-error-900/30'
                    : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800'
                }`}
              >
                <p className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-4 text-xl leading-relaxed text-slate-900 dark:text-slate-100">
                  {cloze.map((t, ti) => {
                    if (!t.blank) {
                      return (
                        <span key={ti}>
                          {t.pre}
                          {t.core}
                          {t.post}
                        </span>
                      );
                    }
                    const k = blankIdx.indexOf(ti);
                    const typed = fills[k] ?? '';
                    const ok = normalizeSentence(typed) === normalizeSentence(t.core);
                    const done = answerState !== 'idle';
                    return (
                      <span key={ti} className="inline-flex flex-col items-center">
                        <span className="inline-flex items-baseline">
                          {t.pre}
                          <input
                            data-dict-input
                            type="text"
                            value={typed}
                            readOnly={done}
                            autoFocus={k === 0}
                            autoCapitalize="off"
                            autoCorrect="off"
                            spellCheck={false}
                            size={Math.max(3, t.core.length + 1)}
                            onChange={(e) =>
                              setFills((f) => {
                                const c = [...f];
                                c[k] = e.target.value;
                                return c;
                              })
                            }
                            onKeyDown={(e) => {
                              const all = Array.from(document.querySelectorAll<HTMLInputElement>('[data-dict-input]'));
                              const at = all.indexOf(e.currentTarget);
                              if (e.key === ' ') {
                                e.preventDefault();
                                all[at + 1]?.focus();
                              } else if (e.key === 'Backspace' && !e.currentTarget.value) {
                                all[at - 1]?.focus();
                              }
                            }}
                            className={`min-w-0 border-b-2 bg-transparent px-1 text-center font-semibold outline-none ${
                              done
                                ? ok
                                  ? 'border-success-500 text-success-700 dark:text-success-300'
                                  : 'border-error-500 text-error-600 line-through dark:text-error-400'
                                : 'border-slate-400 text-primary-700 focus:border-primary-500 dark:border-slate-500 dark:text-primary-300'
                            }`}
                          />
                          {t.post}
                        </span>
                        {done && !ok && (
                          <span className="text-sm font-semibold text-success-600 dark:text-success-400">{t.core}</span>
                        )}
                      </span>
                    );
                  })}
                </p>
              </div>
            ) : (
            <div
              className={`relative rounded-xl border-2 transition-colors ${
                answerState === 'correct'
                  ? 'border-success-400 bg-success-50 dark:border-success-600 dark:bg-success-900/30'
                  : answerState === 'wrong'
                  ? 'border-error-400 bg-error-50 dark:border-error-600 dark:bg-error-900/30'
                  : 'border-slate-200 bg-slate-50 focus-within:border-primary-400 dark:border-slate-700 dark:bg-slate-800'
              }`}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                readOnly={answerState !== 'idle'}
                placeholder={isSentence ? 'Gõ câu bạn nghe được...' : 'Gõ từ bạn nghe được...'}
                autoFocus
                data-dict-input
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                className="w-full rounded-xl bg-transparent px-5 py-4 pr-14 text-lg text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
              />
              {answerState === 'correct' && <Check className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 text-success-600" />}
              {answerState === 'wrong' && <X className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 text-error-600" />}
            </div>
            )}
            {answerState !== 'idle' && (
              <div className="mt-3 space-y-2 rounded-xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">{answerState === 'wrong' ? 'Đáp án đúng:' : 'Chính xác:'}</p>
                <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                  {diff && mode === 'full'
                    ? diff.answer.map((t, k) => (
                        <span key={k} className={t.ok ? '' : 'rounded bg-error-100 px-1 text-error-700 dark:bg-error-900/50 dark:text-error-300'}>
                          {t.text}{' '}
                        </span>
                      ))
                    : current.answer}
                </p>
                {diff && mode === 'full' && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Bạn gõ:{' '}
                    {diff.typed.map((t, k) => (
                      <span key={k} className={t.ok ? '' : 'text-error-600 line-through dark:text-error-400'}>
                        {t.text}{' '}
                      </span>
                    ))}
                  </p>
                )}
                {current.ipa && <p className="font-ipa text-sm text-slate-500">{current.ipa}</p>}
                <p className="text-sm text-slate-500 dark:text-slate-400">{current.meaning}</p>
              </div>
            )}

            {answerState === 'idle' ? (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={check}
                  disabled={mode === 'cloze' ? !fills.some((f) => f?.trim()) : !input.trim()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  Kiểm tra
                </button>
                <button
                  onClick={skip}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Bỏ qua
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={next}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 dark:bg-slate-100 dark:text-slate-900"
                >
                  Tiếp theo
                  <ArrowRight className="h-4 w-4" />
                </button>
                {answerState === 'wrong' && (
                  <button
                    onClick={retry}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Gõ lại
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Đã làm: {completed} — Enter: kiểm tra / tiếp tục (ô trống: nghe lại)
          </p>
        </div>
      </div>
    </div>
  );
}
