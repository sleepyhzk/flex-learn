import { useEffect, useMemo, useRef, useState } from 'react';
import { Lightbulb, Shuffle } from 'lucide-react';
import type { VocabItem } from '@/lib/types';
import { speakEnglish } from '@/lib/speech';
import { speechText } from '@/lib/vocabKey';
import { sfx } from '@/lib/sfx';
import { shuffle } from './gameUtils';
import { GameResult } from './GameResult';
import { center, findMove, findPath, layoutFor, makeGrid, tilesOf } from './connectLogic';
import type { Grid, Pos, Tile } from './connectLogic';

const MAX_PAIRS = 12;
const HINTS = 3;
const SHUFFLES = 2;
const BOARD_RATIO = 0.7; // chiều cao một ô so với chiều rộng

interface Setup {
  pairs: VocabItem[];
  rows: number;
  cols: number;
  grid: Grid;
}

/** Mỗi từ thành hai thẻ (từ tiếng Anh và nghĩa); bỏ các từ trùng nghĩa hoặc trùng chữ để cặp không mơ hồ. */
function newSetup(words: VocabItem[]): Setup {
  const seenMeaning = new Set<string>();
  const seenWord = new Set<string>();
  const pairs = shuffle(words)
    .filter((w) => {
      const wk = w.word.toLowerCase();
      if (seenMeaning.has(w.meaning) || seenWord.has(wk)) return false;
      seenMeaning.add(w.meaning);
      seenWord.add(wk);
      return true;
    })
    .slice(0, MAX_PAIRS);
  const tiles: Tile[] = pairs.flatMap((w, i) => [
    { key: i * 2, vid: w.id, kind: 'w' as const, text: w.word },
    { key: i * 2 + 1, vid: w.id, kind: 'm' as const, text: w.meaning },
  ]);
  const wide = typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches;
  const { rows, cols } = layoutFor(tiles.length, wide);
  return { pairs, rows, cols, grid: makeGrid(tiles, rows, cols) };
}

/** Nối thẻ kiểu Pikachu: nối thẻ từ tiếng Anh với thẻ nghĩa của nó bằng đường đi qua ô trống, tối đa 2 chỗ rẽ. */
export function ConnectGame({
  words,
  onExit,
  onFinish,
}: {
  words: VocabItem[];
  onExit: () => void;
  onFinish?: (score: number, total: number) => void;
}) {
  const [setup, setSetup] = useState<Setup>(() => newSetup(words));
  const [grid, setGrid] = useState<Grid>(setup.grid);
  const [sel, setSel] = useState<{ tile: Tile; pos: Pos } | null>(null);
  const [flash, setFlash] = useState<{ keys: number[]; kind: 'bad' | 'blocked' } | null>(null);
  const [hint, setHint] = useState<number[]>([]);
  const [line, setLine] = useState<Pos[] | null>(null);
  const [mistakes, setMistakes] = useState<Set<number>>(new Set());
  const [hints, setHints] = useState(HINTS);
  const [shuffles, setShuffles] = useState(SHUFFLES);
  const [msg, setMsg] = useState('');
  const [finished, setFinished] = useState(false);
  const timers = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const { rows, cols, pairs } = setup;
  const total = pairs.length;
  const left = useMemo(() => tilesOf(grid).length / 2, [grid]);
  const score = Math.max(0, total - mistakes.size);

  useEffect(() => {
    if (finished) onFinish?.(score, total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const say = (text: string) => {
    setMsg(text);
    later(() => setMsg(''), 2600);
  };

  const pick = (tile: Tile, pos: Pos) => {
    if (finished || flash) return;
    if (tile.kind === 'w') {
      const w = pairs.find((p) => p.id === tile.vid);
      if (w) speakEnglish(speechText(w));
    }
    if (!sel || sel.tile.kind === tile.kind) {
      // Chọn thẻ đầu tiên, hoặc đổi sang thẻ khác cùng loại; chạm lại thẻ đang chọn thì bỏ chọn.
      setSel(sel && sel.tile.key === tile.key ? null : { tile, pos });
      return;
    }
    const keys = [sel.tile.key, tile.key];
    if (sel.tile.vid !== tile.vid) {
      setMistakes((m) => new Set(m).add(sel.tile.vid).add(tile.vid));
      setFlash({ keys, kind: 'bad' });
      sfx.forgot();
      later(() => {
        setFlash(null);
        setSel(null);
      }, 600);
      return;
    }
    const path = findPath(grid, sel.pos, pos);
    if (!path) {
      setFlash({ keys, kind: 'blocked' });
      say('Đúng cặp nhưng đường nối bị chắn. Cần nối được với tối đa 2 chỗ rẽ.');
      later(() => {
        setFlash(null);
        setSel(null);
      }, 700);
      return;
    }
    // Nối được: bỏ hai thẻ, vẽ đường nối một lát.
    const next = grid.map((row) => row.map((t) => (t && keys.includes(t.key) ? null : t)));
    sfx.success();
    setLine(path);
    later(() => setLine(null), 450);
    setSel(null);
    setHint([]);
    const remain = tilesOf(next);
    if (remain.length === 0) {
      setGrid(next);
      later(() => setFinished(true), 600);
    } else if (!findMove(next)) {
      setGrid(makeGrid(remain, rows, cols));
      say('Hết đường nối, đã tự xáo lại thẻ.');
    } else {
      setGrid(next);
    }
  };

  const useHint = () => {
    if (hints <= 0 || finished || flash) return;
    const mv = findMove(grid);
    if (!mv) return;
    setHints((h) => h - 1);
    setHint([mv[0].key, mv[1].key]);
    later(() => setHint([]), 1800);
  };

  const doShuffle = () => {
    if (shuffles <= 0 || finished || flash) return;
    setShuffles((s) => s - 1);
    setGrid(makeGrid(tilesOf(grid), rows, cols));
    setSel(null);
    setHint([]);
    say('Đã xáo lại thẻ.');
  };

  const again = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    const s = newSetup(words);
    setSetup(s);
    setGrid(s.grid);
    setSel(null);
    setFlash(null);
    setHint([]);
    setLine(null);
    setMistakes(new Set());
    setHints(HINTS);
    setShuffles(SHUFFLES);
    setMsg('');
    setFinished(false);
  };

  if (pairs.length < 2) return <p className="text-sm text-slate-500 dark:text-slate-400">Bài này chưa đủ từ để chơi Nối thẻ.</p>;

  if (finished) {
    const wrong = pairs.filter((w) => mistakes.has(w.id));
    return <GameResult title="Xong bài Nối thẻ" score={score} total={total} wrong={wrong} onAgain={again} onExit={onExit} />;
  }

  const W = cols + 0.8;
  const H = rows + 0.8;
  const tileCls = (t: Tile) => {
    const on = sel?.tile.key === t.key;
    const f = flash?.keys.includes(t.key) ? flash.kind : null;
    const base = 'flex h-full w-full items-center justify-center rounded-lg border-2 px-1 text-center text-[11px] font-semibold leading-tight shadow-sm transition-colors sm:text-sm';
    if (f === 'bad') return `${base} border-error-500 bg-error-50 text-error-700 dark:border-error-700 dark:bg-error-950/40 dark:text-error-400`;
    if (f === 'blocked') return `${base} border-warning-500 bg-warning-50 text-warning-800 dark:border-warning-600 dark:bg-warning-900/30 dark:text-warning-200`;
    if (on) return `${base} border-primary-600 bg-primary-100 text-slate-900 ring-2 ring-primary-500/60 dark:bg-primary-950/70 dark:text-slate-100`;
    if (hint.includes(t.key)) return `${base} animate-pulse border-accent-500 bg-accent-50 text-slate-900 ring-2 ring-accent-400 dark:bg-accent-950/40 dark:text-slate-100`;
    return t.kind === 'w'
      ? `${base} border-slate-200 bg-white text-slate-800 hover:border-primary-400 hover:bg-primary-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800`
      : `${base} border-pink-200 bg-pink-50 text-pink-900 hover:border-pink-400 hover:bg-pink-100 dark:border-pink-900/60 dark:bg-pink-950/30 dark:text-pink-100 dark:hover:bg-pink-950/60`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span className="tabular-nums">Còn {left}/{total} cặp</span>
        <div className="flex gap-2">
          <button
            onClick={useHint}
            disabled={hints <= 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            Gợi ý ({hints})
          </button>
          <button
            onClick={doShuffle}
            disabled={shuffles <= 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Shuffle className="h-3.5 w-3.5" />
            Xáo ({shuffles})
          </button>
        </div>
      </div>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Nối thẻ từ tiếng Anh (trắng) với thẻ nghĩa (hồng). Đường nối đi qua ô trống, rẽ tối đa 2 lần.
      </p>

      <div
        className="relative mx-auto w-full rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900/60"
        aria-label="Bàn nối thẻ"
      >
        <div
          className="relative w-full"
          style={{
            aspectRatio: `${W} / ${H * BOARD_RATIO}`,
            display: 'grid',
            gridTemplateColumns: `0.4fr repeat(${cols}, 1fr) 0.4fr`,
            gridTemplateRows: `0.4fr repeat(${rows}, 1fr) 0.4fr`,
          }}
        >
          {grid.flatMap((row, r) =>
            row.map((t, c) =>
              t ? (
                <div key={t.key} style={{ gridRow: r + 1, gridColumn: c + 1 }} className="p-[2px] sm:p-1">
                  <button
                    onClick={() => pick(t, { r, c })}
                    className={tileCls(t)}
                    aria-label={`${t.kind === 'w' ? 'Từ tiếng Anh' : 'Nghĩa'}: ${t.text}`}
                    aria-pressed={sel?.tile.key === t.key}
                    title={t.text}
                  >
                    <span className="line-clamp-3 break-words">{t.text}</span>
                  </button>
                </div>
              ) : null
            )
          )}
          {line && (
            <svg className="pointer-events-none absolute inset-0 h-full w-full text-primary-500" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
              <polyline
                points={line.map((p) => `${center(p.c, cols)},${center(p.r, rows)}`).join(' ')}
                fill="none"
                stroke="currentColor"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          )}
        </div>
      </div>

      <p className="min-h-[1.25rem] text-center text-sm text-slate-600 dark:text-slate-400" role="status" aria-live="polite">
        {msg}
      </p>
    </div>
  );
}
