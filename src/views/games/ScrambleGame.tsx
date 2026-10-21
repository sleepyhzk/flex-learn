import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Lightbulb, RotateCcw, Volume2 } from 'lucide-react';
import type { VocabItem } from '@/lib/types';
import { speakEnglish, isSpeechSupported } from '@/lib/speech';
import { speechText } from '@/lib/vocabKey';
import { POS_SHORT } from '@/lib/pos';
import { pickN, shuffle } from './gameUtils';
import { GameResult } from './GameResult';

const QUESTIONS = 10;
type Tile = { id: number; ch: string };
type Status = 'play' | 'bad' | 'ok' | 'revealed';

function scramble(word: string): Tile[] {
  const tiles = [...word.toLowerCase()].map((ch, i) => ({ id: i, ch }));
  for (let t = 0; t < 10; t++) {
    const s = shuffle(tiles);
    if (s.map((x) => x.ch).join('') !== word.toLowerCase()) return s;
  }
  return shuffle(tiles);
}

/** Xếp chữ: sắp lại các chữ cái xáo trộn thành từ đúng. */
export function ScrambleGame({
  words,
  onExit,
  onFinish,
}: {
  words: VocabItem[];
  onExit: () => void;
  onFinish?: (score: number, total: number) => void;
}) {
  const eligible = useMemo(() => words.filter((w) => /^[a-zA-Z]{3,12}$/.test(w.word)), [words]);
  const [round, setRound] = useState(0);
  const items = useMemo(
    () => pickN(eligible, Math.min(QUESTIONS, eligible.length)).map((w) => ({ word: w, tiles: scramble(w.word) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eligible, round]
  );

  const [index, setIndex] = useState(0);
  const [placed, setPlaced] = useState<number[]>([]);
  const [status, setStatus] = useState<Status>('play');
  const [hinted, setHinted] = useState(false);
  const [results, setResults] = useState<{ word: VocabItem; ok: boolean }[]>([]);
  const [finished, setFinished] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const item = items[index];
  const target = item ? item.word.word.toLowerCase() : '';
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const score = results.filter((r) => r.ok).length;
  useEffect(() => {
    if (finished) onFinish?.(score, items.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const commit = useCallback(
    (np: number[], usedHint: boolean) => {
      if (!item) return;
      setPlaced(np);
      if (np.length < item.tiles.length) {
        setStatus('play');
        return;
      }
      const byId = new Map(item.tiles.map((t) => [t.id, t.ch]));
      const typed = np.map((id) => byId.get(id)).join('');
      if (typed === target) {
        setStatus('ok');
        setResults((r) => [...r, { word: item.word, ok: !usedHint }]);
        speakEnglish(speechText(item.word));
        timer.current = window.setTimeout(() => nextRef.current(), 1400);
      } else setStatus('bad');
    },
    [item, target]
  );

  const next = useCallback(() => {
    window.clearTimeout(timer.current);
    setPlaced([]);
    setStatus('play');
    setHinted(false);
    if (index + 1 >= items.length) setFinished(true);
    else setIndex((i) => i + 1);
  }, [index, items.length]);
  const nextRef = useRef(next);
  nextRef.current = next;

  const place = useCallback(
    (id: number) => {
      if (!item || (status !== 'play') || placed.includes(id)) return;
      commit([...placed, id], hinted);
    },
    [item, status, placed, hinted, commit]
  );

  const removeAt = (pos: number) => {
    if (status !== 'play' && status !== 'bad') return;
    setStatus('play');
    setPlaced((p) => p.filter((_, i) => i !== pos));
  };

  const hint = () => {
    if (!item || (status !== 'play' && status !== 'bad')) return;
    const byId = new Map(item.tiles.map((t) => [t.id, t.ch]));
    let c = 0;
    while (c < placed.length && byId.get(placed[c]) === target[c]) c++;
    const keep = placed.slice(0, c);
    const tile = item.tiles.find((t) => !keep.includes(t.id) && t.ch === target[c]);
    if (!tile) return;
    setHinted(true);
    commit([...keep, tile.id], true);
  };

  const reveal = () => {
    if (!item || (status !== 'play' && status !== 'bad')) return;
    const used: number[] = [];
    for (const ch of target) {
      const t = item.tiles.find((x) => x.ch === ch && !used.includes(x.id));
      if (t) used.push(t.id);
    }
    setPlaced(used);
    setStatus('revealed');
    setResults((r) => [...r, { word: item.word, ok: false }]);
    speakEnglish(speechText(item.word));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || finished || !item) return;
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (placed.length > 0) removeAt(placed.length - 1);
      } else if (e.key === 'Enter' && (status === 'ok' || status === 'revealed')) {
        e.preventDefault();
        next();
      } else if (/^[a-zA-Z]$/.test(e.key) && status === 'play') {
        const t = item.tiles.find((x) => x.ch === e.key.toLowerCase() && !placed.includes(x.id));
        if (t) place(t.id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, placed, status, finished, place, next]);

  const again = () => {
    window.clearTimeout(timer.current);
    setRound((r) => r + 1);
    setIndex(0);
    setPlaced([]);
    setStatus('play');
    setHinted(false);
    setResults([]);
    setFinished(false);
  };

  if (eligible.length < 3) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="text-slate-600 dark:text-slate-300">Bài này có quá ít từ đơn để chơi Xếp chữ.</p>
        <button onClick={onExit} className="mt-4 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
          Về bài học
        </button>
      </div>
    );
  }
  if (finished) {
    const wrong = results.filter((r) => !r.ok).map((r) => r.word);
    return <GameResult title="Xong bài Xếp chữ" score={score} total={items.length} wrong={wrong} onAgain={again} onExit={onExit} />;
  }
  if (!item) return null;

  const byId = new Map(item.tiles.map((t) => [t.id, t.ch]));
  const slotCls =
    status === 'ok' || status === 'revealed'
      ? status === 'ok'
        ? 'border-success-500 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-950/30 dark:text-success-400'
        : 'border-accent-500 bg-accent-50 text-accent-700 dark:border-accent-700 dark:bg-accent-950/30 dark:text-accent-400'
      : status === 'bad'
      ? 'border-error-500 bg-error-50 text-error-700 dark:border-error-700 dark:bg-error-950/30 dark:text-error-400'
      : 'border-primary-300 bg-white text-slate-900 dark:border-primary-700 dark:bg-slate-900 dark:text-slate-100';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span className="tabular-nums">Từ {index + 1}/{items.length}</span>
        <span className="tabular-nums">Đúng {score}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-primary-100 dark:bg-slate-800">
        <div className="h-full bg-primary-600 transition-[width] duration-300" style={{ width: `${(index / items.length) * 100}%` }} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-7 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">Sắp xếp các chữ cái thành từ có nghĩa</p>
        <h3 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-50">{item.word.meaning}</h3>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          <span className="italic">{POS_SHORT[item.word.pos]}</span>
          <span className="font-ipa ml-3 text-primary-600 dark:text-primary-400">{item.word.ipa}</span>
          {isSpeechSupported() && (
            <button onClick={() => speakEnglish(speechText(item.word))} className="ml-2 inline-block rounded-full p-1.5 align-middle text-slate-400 hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-800" aria-label="Nghe phát âm">
              <Volume2 className="h-4 w-4" />
            </button>
          )}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Đáp án của bạn">
          {item.tiles.map((_, pos) => {
            const id = placed[pos];
            return (
              <button
                key={pos}
                onClick={() => id !== undefined && removeAt(pos)}
                className={`flex h-12 w-10 items-center justify-center rounded-lg border-2 text-xl font-bold uppercase ${id !== undefined ? slotCls : 'border-dashed border-slate-300 dark:border-slate-700'}`}
                aria-label={id !== undefined ? `Gỡ chữ ${byId.get(id)}` : 'Ô trống'}
              >
                {id !== undefined ? byId.get(id) : ''}
              </button>
            );
          })}
        </div>
        {status === 'bad' && <p className="mt-3 text-sm font-medium text-error-600 dark:text-error-400">Chưa đúng, chạm vào chữ để gỡ rồi thử lại.</p>}
        {status === 'ok' && <p className="mt-3 text-sm font-medium text-success-600 dark:text-success-400">Chính xác!</p>}
        {status === 'revealed' && <p className="mt-3 text-sm font-medium text-accent-700 dark:text-accent-400">Đáp án: {item.word.word}</p>}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {item.tiles.map((t) => {
          const used = placed.includes(t.id);
          return (
            <button
              key={t.id}
              onClick={() => place(t.id)}
              disabled={used || status !== 'play'}
              className={`flex h-12 w-12 items-center justify-center rounded-xl border text-xl font-bold uppercase transition-colors ${
                used
                  ? 'border-slate-200 bg-slate-100 text-transparent dark:border-slate-800 dark:bg-slate-800/50'
                  : 'border-slate-300 bg-white text-slate-900 hover:border-primary-400 hover:bg-primary-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {t.ch}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {(status === 'play' || status === 'bad') && (
          <>
            <button onClick={() => { setPlaced([]); setStatus('play'); }} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              <RotateCcw className="h-4 w-4" />
              Xóa hết
            </button>
            <button onClick={hint} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              <Lightbulb className="h-4 w-4" />
              Gợi ý
            </button>
            <button onClick={reveal} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              Xem đáp án
            </button>
          </>
        )}
        {(status === 'ok' || status === 'revealed') && (
          <button onClick={next} className="rounded-lg bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700">
            {index + 1 >= items.length ? 'Xem kết quả' : 'Từ tiếp'}
          </button>
        )}
      </div>
      <p className="hidden text-center text-xs text-slate-400 sm:block">Bạn có thể gõ bàn phím: gõ chữ để điền, Backspace để gỡ, Enter để sang từ tiếp.</p>
    </div>
  );
}
