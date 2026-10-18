import { useEffect, useMemo, useRef, useState } from 'react';
import type { VocabItem } from '@/lib/types';
import { speakEnglish } from '@/lib/speech';
import { speechText } from '@/lib/vocabKey';
import { chunk, shuffle } from './gameUtils';
import { GameResult } from './GameResult';

const PAIRS = 6;
const ROUNDS = 3;

/** Ghép cặp: nối từ tiếng Anh với nghĩa tiếng Việt. */
export function MatchGame({
  words,
  onExit,
  onFinish,
}: {
  words: VocabItem[];
  onExit: () => void;
  onFinish?: (score: number, total: number) => void;
}) {
  const [attempt, setAttempt] = useState(0);
  const rounds = useMemo(() => {
    const seen = new Set<string>();
    const uniq = shuffle(words).filter((w) => {
      if (seen.has(w.meaning)) return false;
      seen.add(w.meaning);
      return true;
    });
    return chunk(uniq.slice(0, PAIRS * ROUNDS), PAIRS).filter((r) => r.length >= 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, attempt]);

  const [roundIdx, setRoundIdx] = useState(0);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [left, setLeft] = useState<number | null>(null);
  const [right, setRight] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [mistakes, setMistakes] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);
  const timers = useRef<number[]>([]);

  const current = rounds[roundIdx] ?? [];
  const leftOrder = useMemo(() => shuffle(current), [current]);
  const rightOrder = useMemo(() => shuffle(current), [current]);
  const total = rounds.reduce((n, r) => n + r.length, 0);
  const score = total - mistakes.size;

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  // Ghép xong cả vòng: sang vòng sau hoặc kết thúc.
  useEffect(() => {
    if (current.length === 0 || matched.size !== current.length) return;
    later(() => {
      if (roundIdx + 1 >= rounds.length) setFinished(true);
      else {
        setRoundIdx((r) => r + 1);
        setMatched(new Set());
        setLeft(null);
        setRight(null);
      }
    }, 700);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched]);

  useEffect(() => {
    if (finished) onFinish?.(score, total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const choose = (side: 'l' | 'r', w: VocabItem) => {
    if (flash || matched.has(w.id)) return;
    const l = side === 'l' ? w.id : left;
    const r = side === 'r' ? w.id : right;
    if (side === 'l') {
      setLeft(w.id);
      speakEnglish(speechText(w));
    } else setRight(w.id);
    if (l === null || r === null) return;
    if (l === r) {
      setMatched((m) => new Set(m).add(l));
      setLeft(null);
      setRight(null);
    } else {
      setMistakes((m) => new Set(m).add(l).add(r));
      setFlash(true);
      later(() => {
        setFlash(false);
        setLeft(null);
        setRight(null);
      }, 650);
    }
  };

  const again = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setAttempt((a) => a + 1);
    setRoundIdx(0);
    setMatched(new Set());
    setLeft(null);
    setRight(null);
    setFlash(false);
    setMistakes(new Set());
    setFinished(false);
  };

  if (finished) {
    const wrong = rounds.flat().filter((w) => mistakes.has(w.id));
    return <GameResult title="Xong bài Ghép cặp" score={score} total={total} wrong={wrong} onAgain={again} onExit={onExit} />;
  }
  if (current.length === 0) return null;

  const cell = (side: 'l' | 'r', w: VocabItem) => {
    const sel = side === 'l' ? left === w.id : right === w.id;
    const done = matched.has(w.id);
    const bad = flash && sel;
    const cls = done
      ? 'border-success-500 bg-success-50 text-success-700 opacity-70 dark:border-success-700 dark:bg-success-950/30 dark:text-success-400'
      : bad
      ? 'border-error-500 bg-error-50 text-error-700 dark:border-error-700 dark:bg-error-950/30 dark:text-error-400'
      : sel
      ? 'border-primary-600 bg-primary-50 text-slate-900 ring-2 ring-primary-500/50 dark:bg-primary-950/60 dark:text-slate-100'
      : 'border-slate-200 bg-white text-slate-800 hover:border-primary-400 hover:bg-primary-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800';
    return (
      <button
        key={`${side}${w.id}`}
        onClick={() => choose(side, w)}
        disabled={done}
        className={`min-h-[3.5rem] w-full rounded-xl border px-3 py-2 text-center text-[15px] font-medium transition-colors ${cls}`}
      >
        {side === 'l' ? w.word : w.meaning}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span className="tabular-nums">Vòng {roundIdx + 1}/{rounds.length}</span>
        <span className="tabular-nums">Đã ghép {matched.size}/{current.length}</span>
      </div>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">Chạm một từ tiếng Anh, rồi chạm nghĩa tương ứng.</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2.5">{leftOrder.map((w) => cell('l', w))}</div>
        <div className="space-y-2.5">{rightOrder.map((w) => cell('r', w))}</div>
      </div>
    </div>
  );
}
