import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, Trophy, XCircle } from 'lucide-react';
import type { GrammarQuestion } from '@/data/grammarData';
import { shuffle } from '@/lib/dictItems';
import { isTypingTarget } from '@/lib/keys';
import { sfx } from '@/lib/sfx';

interface Q {
  src: GrammarQuestion;
  options: string[];
  /** Lý do sai của từng đáp án sai, tra theo nội dung đáp án (vì thứ tự phương án đã xáo). */
  reasons: Record<string, string>;
}

const prepare = (list: GrammarQuestion[]): Q[] =>
  shuffle(list).map((src) => ({
    src,
    options: shuffle([src.a, ...src.w]),
    reasons: Object.fromEntries(src.w.map((opt, i) => [opt, src.why[i]])),
  }));

/** Hiện đề bài; chỗ trống ___ được tô nổi, và điền đáp án đúng vào sau khi đã trả lời. */
function Sentence({ text, fill }: { text: string; fill: string | null }) {
  const parts = text.split('___');
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 &&
            (fill === null ? (
              <span className="mx-1 inline-block min-w-[3.5rem] border-b-2 border-primary-500 align-baseline">&nbsp;</span>
            ) : (
              <span className="mx-1 rounded-md bg-success-100 px-1.5 text-success-700 dark:bg-success-950/40 dark:text-success-400">{fill}</span>
            ))}
        </span>
      ))}
    </>
  );
}

/** Bài tập trắc nghiệm của một điểm ngữ pháp: trả lời xong có giải thích ngay, cuối bài có danh sách câu sai. */
export function GrammarQuiz({
  questions,
  onFinish,
  onBackToTheory,
  backLabel = 'Xem lại lý thuyết',
}: {
  questions: GrammarQuestion[];
  onFinish: (score: number, total: number) => void;
  onBackToTheory: () => void;
  backLabel?: string;
}) {
  const [round, setRound] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = useMemo(() => prepare(questions), [questions, round]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<GrammarQuestion[]>([]);
  const [finished, setFinished] = useState(false);
  const nextRef = useRef<HTMLButtonElement>(null);
  const reported = useRef(false);

  const q = items[index];

  useEffect(() => {
    if (!finished || reported.current) return;
    reported.current = true;
    onFinish(score, items.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  // Trả lời xong: đưa focus vào nút "Câu tiếp" để Enter / Space đi tiếp.
  useEffect(() => {
    if (picked !== null) nextRef.current?.focus();
  }, [picked]);

  const choose = useCallback(
    (opt: string) => {
      if (picked !== null || !q) return;
      setPicked(opt);
      if (opt === q.src.a) {
        setScore((s) => s + 1);
        sfx.success();
      } else {
        setWrong((w) => [...w, q.src]);
        sfx.forgot();
      }
    },
    [picked, q]
  );

  const next = useCallback(() => {
    setPicked(null);
    if (index + 1 >= items.length) setFinished(true);
    else setIndex((i) => i + 1);
  }, [index, items.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || finished || !q || isTypingTarget(e)) return;
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length) {
        choose(q.options[n - 1]);
      } else if ((e.key === 'Enter' || e.key === ' ') && picked !== null) {
        // Nút "Câu tiếp" đang có focus sẽ tự xử lý Enter / Space; tránh đi tiếp hai lần.
        if (e.target instanceof HTMLButtonElement) return;
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [q, picked, finished, choose, next]);

  const again = () => {
    reported.current = false;
    setRound((r) => r + 1);
    setIndex(0);
    setPicked(null);
    setScore(0);
    setWrong([]);
    setFinished(false);
  };

  if (finished) {
    const total = items.length;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const message =
      pct === 100 ? 'Tuyệt vời, không sai câu nào!' : pct >= 70 ? 'Rất tốt! Xem lại vài câu sai bên dưới là chắc rồi.' : 'Cố lên! Đọc lại lý thuyết rồi làm lại nhé.';
    return (
      <div className="space-y-5 py-2 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-100 dark:bg-accent-950/40">
          <Trophy className="h-7 w-7 text-accent-600 dark:text-accent-400" />
        </div>
        <div>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Đúng {score}/{total} ({pct}%)
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message}</p>
        </div>

        {wrong.length > 0 && (
          <div className="mx-auto max-w-xl rounded-xl border border-slate-200 p-4 text-left dark:border-slate-800">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Câu cần ôn lại ({wrong.length})</p>
            <ul className="mt-3 space-y-3">
              {wrong.map((w, i) => (
                <li key={i} className="text-sm">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    <Sentence text={w.q} fill={w.a} />
                  </p>
                  <p className="mt-0.5 leading-relaxed text-slate-600 dark:text-slate-400">{w.e}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2.5">
          <button
            onClick={again}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            <RotateCcw className="h-4 w-4" />
            Làm lại
          </button>
          <button
            onClick={onBackToTheory}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </button>
        </div>
      </div>
    );
  }

  if (!q) return <p className="text-sm text-slate-500 dark:text-slate-400">Điểm ngữ pháp này chưa có bài tập.</p>;

  const optClass = (o: string) => {
    const base = 'flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-base font-medium transition-colors';
    if (picked === null) {
      return `${base} border-slate-200 bg-white text-slate-800 hover:border-primary-400 hover:bg-primary-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800`;
    }
    if (o === q.src.a) return `${base} border-success-500 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-950/30 dark:text-success-400`;
    if (o === picked) return `${base} border-error-500 bg-error-50 text-error-700 dark:border-error-700 dark:bg-error-950/30 dark:text-error-400`;
    return `${base} border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400`;
  };

  const ok = picked === q.src.a;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span className="tabular-nums">
          Câu {index + 1}/{items.length}
        </span>
        <span className="tabular-nums">Đúng {score}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-primary-100 dark:bg-slate-800">
        <div className="h-full bg-primary-600 transition-[width] duration-300" style={{ width: `${(index / items.length) * 100}%` }} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-6 text-center dark:border-slate-800 dark:bg-slate-800/40">
        <p className="text-xl font-semibold leading-relaxed text-slate-900 dark:text-slate-100">
          <Sentence text={q.src.q} fill={picked === null ? null : q.src.a} />
        </p>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {q.options.map((o, i) => (
          <button key={o} onClick={() => choose(o)} disabled={picked !== null} className={optClass(o)}>
            <kbd className="mt-0.5 hidden h-6 w-6 flex-shrink-0 items-center justify-center rounded border border-current font-sans text-xs font-normal opacity-50 sm:flex">{i + 1}</kbd>
            <span className="min-w-0">
              <span className="block">{o}</span>
              {picked !== null && o !== q.src.a && (
                <span className="mt-1 block text-sm font-normal leading-snug opacity-90">Sai vì: {q.reasons[o]}</span>
              )}
            </span>
          </button>
        ))}
      </div>

      {picked !== null && (
        <div
          role="status"
          className={`flex flex-col gap-3 rounded-xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
            ok ? 'bg-success-50 dark:bg-success-950/30' : 'bg-error-50 dark:bg-error-950/30'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {ok ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-600 dark:text-success-400" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-error-600 dark:text-error-400" />
            )}
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <span className="font-semibold">{ok ? 'Chính xác. ' : `Chưa đúng, đáp án là "${q.src.a}". `}</span>
              {q.src.e}
            </p>
          </div>
          <button
            ref={nextRef}
            onClick={next}
            className="flex-shrink-0 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            {index + 1 >= items.length ? 'Xem kết quả' : 'Câu tiếp'}
          </button>
        </div>
      )}
    </div>
  );
}
