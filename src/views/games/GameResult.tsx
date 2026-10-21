import { Trophy, Volume2, RotateCcw, ArrowLeft } from 'lucide-react';
import type { VocabItem } from '@/lib/types';
import { speakEnglish, isSpeechSupported } from '@/lib/speech';
import { speechText } from '@/lib/vocabKey';

export function GameResult({
  title,
  score,
  total,
  wrong,
  onAgain,
  onExit,
}: {
  title: string;
  score: number;
  total: number;
  wrong: VocabItem[];
  onAgain: () => void;
  onExit: () => void;
}) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const message =
    pct === 100 ? 'Tuyệt vời, không sai câu nào!' : pct >= 70 ? 'Rất tốt! Thêm chút nữa là nhớ chắc.' : 'Cố lên! Xem lại các từ bên dưới rồi chơi lại nhé.';
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-100 dark:bg-accent-950/40">
        <Trophy className="h-7 w-7 text-accent-600 dark:text-accent-400" />
      </div>
      <h3 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-2 text-lg text-slate-700 dark:text-slate-300">
        Đúng {score}/{total} ({pct}%)
      </p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message}</p>

      {wrong.length > 0 && (
        <div className="mx-auto mt-6 max-w-md rounded-xl border border-slate-200 p-4 text-left dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Từ cần ôn lại ({wrong.length})</p>
          <ul className="mt-3 space-y-2">
            {wrong.map((w) => (
              <li key={w.id} className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{w.word}</span>
                  <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">{w.meaning}</span>
                </div>
                {isSpeechSupported() && (
                  <button
                    onClick={() => speakEnglish(speechText(w))}
                    className="flex-shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-800"
                    aria-label={`Nghe từ ${w.word}`}
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button onClick={onAgain} className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700">
          <RotateCcw className="h-4 w-4" />
          Chơi lại
        </button>
        <button
          onClick={onExit}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Về bài học
        </button>
      </div>
    </div>
  );
}
