import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Volume2 } from 'lucide-react';
import type { VocabItem } from '@/lib/types';
import { speakEnglish, isSpeechSupported } from '@/lib/speech';
import { speechText } from '@/lib/vocabKey';
import { POS_SHORT } from '@/lib/pos';
import { makeOptions, pickN } from './gameUtils';
import { GameResult } from './GameResult';

const QUESTIONS = 10;

type Mode = 'quiz' | 'listen';
interface Q {
  word: VocabItem;
  /** Phương án hiện nghĩa tiếng Việt hay hiện từ tiếng Anh. */
  optionKind: 'meaning' | 'word';
  options: VocabItem[];
}

/** Trắc nghiệm nhanh (chọn nghĩa / chọn từ) và Nghe rồi chọn từ. */
export function QuizGame({
  words,
  pool,
  mode,
  onExit,
  onFinish,
}: {
  words: VocabItem[];
  pool: VocabItem[];
  mode: Mode;
  onExit: () => void;
  onFinish?: (score: number, total: number) => void;
}) {
  const [round, setRound] = useState(0);
  const questions = useMemo<Q[]>(
    () =>
      pickN(words, Math.min(QUESTIONS, words.length)).map((w) => ({
        word: w,
        optionKind: mode === 'listen' || Math.random() < 0.5 ? 'word' : 'meaning',
        options: makeOptions(w, pool),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [words, pool, mode, round]
  );

  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<VocabItem[]>([]);
  const [finished, setFinished] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const q = questions[index];

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Đọc từ khi sang câu mới (trừ câu chọn từ theo nghĩa, vì đọc sẽ lộ đáp án).
  useEffect(() => {
    if (!q || finished) return;
    if (mode === 'quiz' && q.optionKind === 'word') return;
    const t = window.setTimeout(() => speakEnglish(speechText(q.word)), 250);
    return () => window.clearTimeout(t);
  }, [q, mode, finished]);

  useEffect(() => {
    if (finished) onFinish?.(score, questions.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const next = useCallback(() => {
    window.clearTimeout(timer.current);
    setPicked(null);
    if (index + 1 >= questions.length) setFinished(true);
    else setIndex((i) => i + 1);
  }, [index, questions.length]);

  const choose = useCallback(
    (opt: VocabItem) => {
      if (picked !== null || !q) return;
      setPicked(opt.id);
      const ok = opt.id === q.word.id;
      if (ok) setScore((s) => s + 1);
      else setWrong((w) => [...w, q.word]);
      if (mode === 'quiz' && q.optionKind === 'word') speakEnglish(speechText(q.word));
      if (ok) timer.current = window.setTimeout(next, 900);
    },
    [picked, q, mode, next]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || finished || !q) return;
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length) {
        choose(q.options[n - 1]);
      } else if ((e.key === 'Enter' || e.key === ' ') && picked !== null) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [q, picked, finished, choose, next]);

  const again = () => {
    window.clearTimeout(timer.current);
    setRound((r) => r + 1);
    setIndex(0);
    setPicked(null);
    setScore(0);
    setWrong([]);
    setFinished(false);
  };

  const title = mode === 'listen' ? 'Xong bài Nghe và chọn' : 'Xong bài Trắc nghiệm';
  if (finished) return <GameResult title={title} score={score} total={questions.length} wrong={wrong} onAgain={again} onExit={onExit} />;
  if (!q) return null;

  const optClass = (o: VocabItem) => {
    const base = 'flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-base font-medium transition-colors';
    if (picked === null) {
      return `${base} border-slate-200 bg-white text-slate-800 hover:border-primary-400 hover:bg-primary-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800`;
    }
    if (o.id === q.word.id) return `${base} border-success-500 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-950/30 dark:text-success-400`;
    if (o.id === picked) return `${base} border-error-500 bg-error-50 text-error-700 dark:border-error-700 dark:bg-error-950/30 dark:text-error-400`;
    return `${base} border-slate-200 bg-white text-slate-400 opacity-60 dark:border-slate-800 dark:bg-slate-900`;
  };

  const speaker = (
    <button
      onClick={() => speakEnglish(speechText(q.word))}
      className="rounded-full bg-primary-50 p-3 text-primary-600 hover:bg-primary-100 dark:bg-primary-950/60 dark:text-primary-300"
      aria-label="Nghe lại"
    >
      <Volume2 className="h-6 w-6" />
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span className="tabular-nums">Câu {index + 1}/{questions.length}</span>
        <span className="tabular-nums">Đúng {score}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-primary-100 dark:bg-slate-800">
        <div className="h-full bg-primary-600 transition-[width] duration-300" style={{ width: `${(index / questions.length) * 100}%` }} />
      </div>

      <div className="flex min-h-[10rem] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center dark:border-slate-800 dark:bg-slate-900">
        {mode === 'listen' ? (
          <>
            <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">Nghe rồi chọn từ bạn nghe được</p>
            {isSpeechSupported() && speaker}
          </>
        ) : q.optionKind === 'meaning' ? (
          <>
            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">Chọn nghĩa đúng</p>
            <div className="flex items-center gap-3">
              <h3 className="text-4xl font-semibold text-slate-900 dark:text-slate-50 sm:text-5xl">{q.word.word}</h3>
              {isSpeechSupported() && speaker}
            </div>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              <span className="italic">{POS_SHORT[q.word.pos]}</span>
              <span className="font-ipa ml-3 text-primary-600 dark:text-primary-400">{q.word.ipa}</span>
            </p>
          </>
        ) : (
          <>
            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">Chọn từ tiếng Anh đúng</p>
            <h3 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">{q.word.meaning}</h3>
            <p className="mt-1 italic text-slate-500 dark:text-slate-400">{POS_SHORT[q.word.pos]}</p>
          </>
        )}
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {q.options.map((o, i) => (
          <button key={o.id} onClick={() => choose(o)} disabled={picked !== null} className={optClass(o)}>
            <kbd className="hidden h-6 w-6 flex-shrink-0 items-center justify-center rounded border border-current font-sans text-xs font-normal opacity-50 sm:flex">{i + 1}</kbd>
            <span>{q.optionKind === 'meaning' ? o.meaning : o.word}</span>
          </button>
        ))}
      </div>

      {picked !== null && (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-100 px-4 py-3 dark:bg-slate-800/60">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-semibold">{q.word.word}</span> {q.word.ipa}: {q.word.meaning}
          </p>
          <button onClick={next} className="flex-shrink-0 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
            {index + 1 >= questions.length ? 'Xem kết quả' : 'Câu tiếp'}
          </button>
        </div>
      )}
    </div>
  );
}
