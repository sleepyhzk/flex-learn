import { CheckCircle2, Lightbulb, XCircle } from 'lucide-react';
import { LETTERS } from '@/lib/toeicUi';
import type { WrongNote } from '@/lib/toeicExplain';

// ------------------------------------------------------------------ đoạn văn có chỗ trống
export function Passage({ text }: { text: string }) {
  const parts = text.split(/(\[\d\])/);
  return (
    <div className="whitespace-pre-line rounded-2xl border border-slate-200 bg-white p-5 text-[15px] leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
      {parts.map((p, i) => {
        const m = /^\[(\d)\]$/.exec(p);
        return m ? (
          <span key={i} className="mx-0.5 rounded-md bg-primary-100 px-1.5 py-0.5 font-semibold text-primary-800 dark:bg-primary-900/50 dark:text-primary-200">
            ({m[1]}) ______
          </span>
        ) : (
          <span key={i}>{p}</span>
        );
      })}
    </div>
  );
}

// ------------------------------------------------------------------ khung giải thích
/**
 * Giải thích một câu: vì sao đáp án đúng là đúng, và vì sao TỪNG đáp án còn lại sai.
 * `notes` cùng thứ tự với `options` (null ở vị trí đáp án đúng).
 */
export function ExplainPanel({
  options,
  answer,
  why,
  notes,
  chosen,
}: {
  options: string[];
  answer: number;
  why: string;
  notes: (WrongNote | null)[];
  chosen: number | undefined;
}) {
  return (
    <div className="mt-3 space-y-3 text-sm">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100">
        <p className="flex items-center gap-1.5 font-semibold">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> Vì sao đáp án {LETTERS[answer]} đúng
        </p>
        <p className="mt-1 font-medium">“{options[answer]}”</p>
        <p className="mt-1 leading-relaxed">{why}</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
        <p className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-100">
          <Lightbulb className="h-4 w-4 shrink-0 text-amber-500" /> Vì sao các đáp án còn lại sai
        </p>
        <ul className="mt-2 space-y-2.5">
          {options.map((opt, i) => {
            const n = notes[i];
            if (!n) return null;
            const mine = chosen === i;
            return (
              <li key={i} className={`rounded-lg px-3 py-2 ${mine ? 'bg-rose-50 dark:bg-rose-950/30' : 'bg-slate-50 dark:bg-slate-800/60'}`}>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-medium text-slate-900 dark:text-slate-100">
                  <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
                  <span>
                    {LETTERS[i]}. {opt}
                  </span>
                  {mine && <span className="rounded-full bg-rose-200 px-2 py-0.5 text-xs font-semibold text-rose-800 dark:bg-rose-900/60 dark:text-rose-200">Bạn đã chọn</span>}
                </p>
                <p className={`mt-1 leading-relaxed ${n.generic ? 'text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>{n.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
