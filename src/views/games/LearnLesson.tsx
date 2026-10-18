import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Volume2, Check, RotateCcw, ArrowLeft, ListChecks } from 'lucide-react';
import type { VocabItem } from '@/lib/types';
import { LEVEL_LABEL } from '@/data/vocabData';
import { speakEnglish, isSpeechSupported } from '@/lib/speech';
import { speechText } from '@/lib/vocabKey';
import { POS_SHORT } from '@/lib/pos';
import { WordVisual } from '@/components/WordVisual';

/** Học một bài (10 từ): xem từng thẻ có nghĩa, ví dụ, hình minh họa; cuối bài có tổng kết. */
export function LearnLesson({
  lessonNo,
  words,
  onComplete,
  onQuiz,
  onExit,
}: {
  lessonNo: number;
  words: VocabItem[];
  onComplete: () => void;
  onQuiz: () => void;
  onExit: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const done = idx >= words.length;
  const w = words[idx];
  const completed = useRef(false);

  useEffect(() => {
    if (done && !completed.current) {
      completed.current = true;
      onComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  useEffect(() => {
    if (!w) return;
    const t = window.setTimeout(() => speakEnglish(speechText(w)), 250);
    return () => window.clearTimeout(t);
  }, [w]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'ArrowRight') setIdx((i) => Math.min(words.length, i + 1));
      else if (e.key === 'ArrowLeft') setIdx((i) => Math.max(0, i - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [words.length]);

  if (done) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-success-100 dark:bg-success-950/40">
            <Check className="h-7 w-7 text-success-600 dark:text-success-400" />
          </div>
          <h3 className="font-display text-3xl font-semibold text-slate-900 dark:text-slate-100">Xong bài {lessonNo}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Xem lại {words.length} từ vừa học, rồi làm bài kiểm tra nhanh để nhớ chắc hơn.</p>
        </div>
        <ul className="mx-auto mt-5 max-w-md divide-y divide-slate-200 dark:divide-slate-800">
          {words.map((x) => (
            <li key={x.id} className="flex items-center gap-2 py-2">
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-slate-900 dark:text-slate-100">{x.word}</span>
                <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">{x.meaning}</span>
              </div>
              {isSpeechSupported() && (
                <button onClick={() => speakEnglish(speechText(x))} className="flex-shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-800" aria-label={`Nghe từ ${x.word}`}>
                  <Volume2 className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button onClick={onQuiz} className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700">
            <ListChecks className="h-4 w-4" />
            Kiểm tra nhanh bài này
          </button>
          <button onClick={() => setIdx(0)} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            <RotateCcw className="h-4 w-4" />
            Học lại bài
          </button>
          <button onClick={onExit} className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4" />
            Về bài học
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>Bài {lessonNo}</span>
        <span className="tabular-nums">Từ {idx + 1}/{words.length}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-primary-100 dark:bg-slate-800">
        <div className="h-full bg-primary-600 transition-[width] duration-300" style={{ width: `${((idx + 1) / words.length) * 100}%` }} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center dark:border-slate-800 dark:bg-slate-900 sm:px-10">
        <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">{LEVEL_LABEL[w.level]}</span>
        <h3 className="mt-3 break-words font-display text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-6xl">{w.word}</h3>
        <p className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-slate-500 dark:text-slate-400">
          <span className="font-display text-xl italic">{POS_SHORT[w.pos]}</span>
          <span className="font-ipa text-xl text-primary-600 dark:text-primary-400">{w.ipa}</span>
          {isSpeechSupported() && (
            <button onClick={() => speakEnglish(speechText(w))} className="rounded-full bg-primary-50 p-2 text-primary-600 hover:bg-primary-100 dark:bg-primary-950/60 dark:text-primary-300" aria-label="Nghe phát âm">
              <Volume2 className="h-4 w-4" />
            </button>
          )}
        </p>

        <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-800">
          <WordVisual key={`${w.word}|${w.pos}`} word={w.word} pos={w.pos} />
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{w.meaning}</p>
          <blockquote className="mx-auto mt-4 max-w-md border-l-2 border-primary-300 pl-4 text-left dark:border-primary-700">
            <div className="flex items-start gap-2">
              <p className="flex-1 text-lg leading-relaxed text-slate-800 dark:text-slate-200">{w.example}</p>
              {isSpeechSupported() && (
                <button onClick={() => speakEnglish(w.example)} className="flex-shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-800" aria-label="Nghe câu ví dụ">
                  <Volume2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="mt-1 text-base text-slate-500 dark:text-slate-400">{w.exampleVi}</p>
          </blockquote>
          {w.senses && w.senses.length > 0 && (
            <div className="mx-auto mt-5 max-w-md rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-left dark:border-slate-800 dark:bg-slate-800/40">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Nghĩa khác</p>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                {w.senses.map((s, i) => (
                  <li key={i}>
                    <span className="font-semibold">{s.meaning}</span> <span className="text-slate-500 dark:text-slate-400">({s.context})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-4 text-base font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ChevronLeft className="h-5 w-5" />
          Từ trước
        </button>
        <button onClick={() => setIdx((i) => i + 1)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-4 text-base font-semibold text-white hover:bg-primary-700">
          {idx + 1 >= words.length ? 'Hoàn thành bài' : 'Từ tiếp'}
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <p className="hidden text-center text-xs text-slate-400 sm:block">Phím tắt: ← từ trước, → từ tiếp</p>
    </div>
  );
}
