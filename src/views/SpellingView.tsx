import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Keyboard, Check, X, ArrowRight, RotateCcw, Volume2, Trophy, Lightbulb } from 'lucide-react';
import { INITIAL_VOCAB, LEVEL_LABEL, LEVEL_ORDER } from '@/data/vocabData';
import { TopicSelect } from '@/components/TopicSelect';
import { countByTopic } from '@/lib/topicUtils';
import type { TopicFilter } from '@/components/TopicSelect';
import { speakEnglish, isSpeechSupported } from '@/lib/speech';
import { vocabKey, speechText } from '@/lib/vocabKey';
import { isSpellingCorrect, maskWord } from '@/lib/spelling';
import { POS_LABEL } from '@/lib/pos';
import { useStarred } from '@/hooks/useStarred';
import type { VocabItem, Level } from '@/lib/types';

type LevelFilter = 'all' | Level | 'starred';
type AnswerState = 'idle' | 'correct' | 'wrong';

function shuffleArray(arr: VocabItem[]): VocabItem[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/** Luyện chính tả: xem nghĩa tiếng Việt, gõ lại từ tiếng Anh. */
export function SpellingView() {
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [topic, setTopic] = useState<TopicFilter>('all');
  const [input, setInput] = useState('');
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [queue, setQueue] = useState<VocabItem[]>(() => shuffleArray(INITIAL_VOCAB));
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoNextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { starred } = useStarred();

  const matchesLevel = useCallback(
    (w: VocabItem) => {
      if (levelFilter === 'all') return true;
      if (levelFilter === 'starred') return starred.has(vocabKey(w));
      return w.level === levelFilter;
    },
    [levelFilter, starred]
  );

  const pool = useMemo(
    () => queue.filter((w) => matchesLevel(w) && (topic === 'all' || w.topic === topic)),
    [queue, matchesLevel, topic]
  );

  const levelWords = useMemo(() => INITIAL_VOCAB.filter(matchesLevel), [matchesLevel]);
  const topicCounts = useMemo(() => countByTopic(levelWords), [levelWords]);

  const current = pool.length > 0 ? pool[index % pool.length] : undefined;

  const clearAutoNext = useCallback(() => {
    if (autoNextTimer.current) {
      clearTimeout(autoNextTimer.current);
      autoNextTimer.current = null;
    }
  }, []);

  useEffect(() => clearAutoNext, [clearAutoNext]);

  const next = useCallback(() => {
    clearAutoNext();
    setInput('');
    setAnswerState('idle');
    setHintUsed(false);
    setIndex((i) => i + 1);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [clearAutoNext]);

  const check = useCallback(() => {
    if (!input.trim() || answerState !== 'idle' || !current) return;
    const ok = isSpellingCorrect(input, current);
    setAnswerState(ok ? 'correct' : 'wrong');
    if (ok) {
      speakEnglish(speechText(current));
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
    setCompleted((c) => c + 1);
  }, [input, answerState, current, next]);

  const skip = useCallback(() => {
    setStreak(0);
    next();
  }, [next]);

  const restart = useCallback(() => {
    clearAutoNext();
    setInput('');
    setAnswerState('idle');
    setHintUsed(false);
    setIndex(0);
    setScore(0);
    setStreak(0);
    setCompleted(0);
    setQueue(shuffleArray(INITIAL_VOCAB));
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [clearAutoNext]);

  const switchLevel = useCallback(
    (l: LevelFilter) => {
      setLevelFilter(l);
      restart();
    },
    [restart]
  );

  const switchTopic = useCallback(
    (t: TopicFilter) => {
      setTopic(t);
      restart();
    },
    [restart]
  );

  const retry = useCallback(() => {
    setInput('');
    setAnswerState('idle');
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // Enter: kiểm tra, hoặc sang từ tiếp theo sau khi đã có kết quả.
  // Nghe ở cấp cửa sổ vì khi ô nhập bị khóa (sau khi trả lời) nó mất focus và không nhận phím nữa.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.isComposing) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, select, a, textarea')) return; // để nút tự xử lý Enter
      e.preventDefault();
      if (answerState === 'idle') check();
      else next();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [answerState, check, next]);

  const filterBar = (
    <div className="space-y-3">
      <div className="flex w-fit flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
        {([
          { key: 'all' as const, label: 'Tất cả' },
          ...LEVEL_ORDER.map((l) => ({ key: l as LevelFilter, label: LEVEL_LABEL[l] })),
          { key: 'starred' as const, label: 'Đã đánh dấu' },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => switchLevel(tab.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              levelFilter === tab.key
                ? 'bg-primary-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <TopicSelect value={topic} onChange={switchTopic} counts={topicCounts} total={levelWords.length} />
    </div>
  );

  if (!current) {
    return (
      <div className="space-y-6">
        {filterBar}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
          <Keyboard className="mb-4 h-12 w-12 text-slate-300" />
          <p className="text-slate-500 dark:text-slate-400">Không có từ nào trong bộ lọc này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          <Keyboard className="h-6 w-6 text-primary-600" />
          Luyện chính tả
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Xem nghĩa tiếng Việt và gõ lại từ tiếng Anh. Không phân biệt chữ hoa, chữ thường.
        </p>
      </div>

      {filterBar}

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs text-slate-400">Điểm</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{score}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs text-slate-400">Chuỗi đúng</p>
          <p className="flex items-center justify-center gap-1 text-2xl font-bold text-accent-600 dark:text-accent-400">
            {streak} {streak >= 3 && <Trophy className="h-5 w-5" />}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs text-slate-400">Kỷ lục</p>
          <p className="text-2xl font-bold text-success-600 dark:text-success-400">{bestStreak}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-5">
          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-950/50 dark:text-primary-300">
            {POS_LABEL[current.pos]}
          </span>
          <p className="text-center text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">{current.meaning}</p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <p className="font-mono text-lg tracking-widest text-slate-400">{maskWord(current.word)}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {isSpeechSupported() && (
              <button
                onClick={() => speakEnglish(speechText(current))}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700 dark:bg-primary-950/50 dark:text-primary-300"
              >
                <Volume2 className="h-4 w-4" />
                Nghe từ
              </button>
            )}
            <button
              onClick={() => setHintUsed(true)}
              disabled={hintUsed || answerState !== 'idle'}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Lightbulb className="h-4 w-4" />
              Gợi ý phiên âm
            </button>
          </div>
          {hintUsed && <p className="font-ipa text-lg text-primary-600 dark:text-primary-400">{current.ipa}</p>}

          <div className="w-full max-w-md">
            <div
              className={`relative rounded-xl border-2 transition-colors ${
                answerState === 'correct'
                  ? 'border-success-400 bg-success-50 dark:border-success-600 dark:bg-success-950/30'
                  : answerState === 'wrong'
                  ? 'border-error-400 bg-error-50 dark:border-error-600 dark:bg-error-950/30'
                  : 'border-slate-200 bg-slate-50 focus-within:border-primary-400 dark:border-slate-700 dark:bg-slate-800'
              }`}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                readOnly={answerState !== 'idle'}
                placeholder="Gõ từ tiếng Anh tại đây..."
                autoFocus
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                className="w-full rounded-xl bg-transparent px-5 py-4 text-lg text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
              />
              {answerState === 'correct' && <Check className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 text-success-600" />}
              {answerState === 'wrong' && <X className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 text-error-600" />}
            </div>

            {answerState === 'wrong' && (
              <div className="mt-3 rounded-xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Đáp án đúng:</p>
                <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                  {current.word} <span className="font-ipa text-sm font-normal text-slate-500">{current.ipa}</span>
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{current.example}</p>
              </div>
            )}

            {answerState === 'idle' ? (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={check}
                  disabled={!input.trim()}
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
                  Từ tiếp theo
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

          <p className="text-xs text-slate-400">Đã làm: {completed} — Nhấn Enter để kiểm tra/tiếp tục</p>
        </div>
      </div>
    </div>
  );
}
