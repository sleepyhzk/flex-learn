import { useState, useMemo } from 'react';
import { BookOpen, Search, Volume2, Star } from 'lucide-react';
import { INITIAL_VOCAB } from '@/data/vocabData';
import { TOPIC_LABEL } from '@/data/vocabTopics';
import { searchVocab } from '@/lib/vocabSearch';
import { speakEnglish, isSpeechSupported } from '@/lib/speech';
import { vocabKey, speechText } from '@/lib/vocabKey';
import { POS_SHORT } from '@/lib/pos';
import { useStarred } from '@/hooks/useStarred';

const MAX_RESULTS = 60;

/** Tra cứu theo từ tiếng Anh hoặc nghĩa tiếng Việt (chưa phân tích câu). */
export function DictionaryView() {
  const [query, setQuery] = useState('');
  const { isStarred, toggle } = useStarred();

  const results = useMemo(() => searchVocab(query), [query]);
  const shown = results.slice(0, MAX_RESULTS);
  const hasQuery = query.trim().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          <BookOpen className="h-6 w-6 text-primary-600" />
          Tra cứu từ
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Gõ một từ tiếng Anh (vd: schedule) hoặc nghĩa tiếng Việt (vd: lịch trình) trong {INITIAL_VOCAB.length} từ của app.
        </p>
      </div>

      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm từ hoặc nghĩa..."
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-base text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      {!hasQuery ? (
        <p className="py-8 text-center text-sm text-slate-400">Nhập từ khóa để bắt đầu tra cứu.</p>
      ) : results.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">Không tìm thấy từ nào khớp với "{query.trim()}".</p>
      ) : (
        <>
          <p className="text-sm text-slate-400">
            {results.length} kết quả{results.length > MAX_RESULTS ? `, hiển thị ${MAX_RESULTS} kết quả đầu` : ''}
          </p>
          <div className="space-y-3">
            {shown.map((w) => {
              const key = vocabKey(w);
              const starred = isStarred(key);
              return (
                <div
                  key={w.id}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{w.word}</span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {POS_SHORT[w.pos]}
                      </span>
                      <span className="font-ipa text-sm text-primary-600 dark:text-primary-400">{w.ipa}</span>
                    </div>
                    <p className="mt-1 text-base text-slate-800 dark:text-slate-200">{w.meaning}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{w.example}</p>
                    <p className="text-sm text-slate-400">{w.exampleVi}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                      <span className="rounded-md bg-primary-50 px-2 py-0.5 font-medium text-primary-700 dark:bg-primary-950/40 dark:text-primary-300">
                        {w.level === 'extra' ? 'Bổ sung' : w.level}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        {TOPIC_LABEL[w.topic]}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 flex-col gap-1">
                    <button
                      onClick={() => toggle(key)}
                      className={`rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${starred ? 'text-accent-500' : 'text-slate-300'}`}
                      title={starred ? 'Bỏ đánh dấu' : 'Đánh dấu cần học'}
                      aria-pressed={starred}
                    >
                      <Star className={`h-5 w-5 ${starred ? 'fill-current' : ''}`} />
                    </button>
                    {isSpeechSupported() && (
                      <button
                        onClick={() => speakEnglish(speechText(w))}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-800 dark:hover:text-primary-400"
                        title="Phát âm"
                      >
                        <Volume2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
