import { useState, useMemo } from 'react';
import { MessageCircle, Volume2, ChevronDown, ChevronRight, ChevronsUpDown } from 'lucide-react';
import {
  CONVERSATION_SENTENCES,
  CONVERSATION_CATEGORIES,
  CONVERSATION_LEVELS,
} from '@/data/conversationData';
import type { ConversationCategory, ConversationLevel } from '@/data/conversationData';
import { speakEnglish, isSpeechSupported } from '@/lib/speech';
import { LEVEL_LABEL } from '@/data/vocabData';

type ConvLevel = 'all' | ConversationLevel;

const CATEGORY_LABELS = Object.fromEntries(
  CONVERSATION_CATEGORIES.map((c) => [c.key, c.label])
) as Record<ConversationCategory, string>;

const CATEGORY_COLORS: Record<ConversationCategory, string> = {
  greeting: 'bg-primary-100 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400',
  intro: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400',
  polite: 'bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400',
  help: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/40 dark:text-fuchsia-400',
  shopping: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400',
  food: 'bg-accent-100 text-accent-700 dark:bg-accent-950/40 dark:text-accent-400',
  directions: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  time: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400',
  health: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400',
  daily: 'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400',
  work: 'bg-lime-100 text-lime-800 dark:bg-lime-950/40 dark:text-lime-400',
  travel: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400',
  social: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-400',
  opinion: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
};

export function ConversationView() {
  const [level, setLevel] = useState<ConvLevel>('all');
  // Các chủ đề đang mở. Chọn một cấp thì mở hết (xem thẳng câu), chọn "Tất cả" thì thu gọn cho đỡ dài.
  const [open, setOpen] = useState<Set<string>>(new Set());
  const selectLevel = (l: ConvLevel) => {
    setLevel(l);
    setOpen(l === 'all' ? new Set() : new Set(CONVERSATION_CATEGORIES.map((c) => c.key)));
  };
  const toggleCategory = (key: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const filtered = useMemo(
    () =>
      level === 'all'
        ? CONVERSATION_SENTENCES
        : CONVERSATION_SENTENCES.filter((s) => s.level === level),
    [level]
  );

  // Giữ đúng thứ tự chủ đề đã định nghĩa; bỏ chủ đề không còn câu nào ở cấp đang chọn.
  const grouped = useMemo(
    () =>
      CONVERSATION_CATEGORIES.map((c) => ({
        key: c.key,
        sentences: filtered.filter((s) => s.category === c.key),
      })).filter((g) => g.sentences.length > 0),
    [filtered]
  );

  const levelTabs: { key: ConvLevel; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    ...CONVERSATION_LEVELS.map((l) => ({ key: l as ConvLevel, label: LEVEL_LABEL[l] })),
  ];
  const allOpen = grouped.length > 0 && grouped.every((g) => open.has(g.key));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          <MessageCircle className="h-6 w-6 text-primary-600" />
          Giao tiếp thường dùng
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {CONVERSATION_SENTENCES.length} câu giao tiếp theo {CONVERSATION_CATEGORIES.length} chủ đề (chào hỏi, mua sắm, du lịch, công việc, thảo luận...), từ cấp A1 đến C1.
        </p>
      </div>

      {/* Level filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex w-fit flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          {levelTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => selectLevel(tab.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                level === tab.key
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-600 hover:bg-primary-100/60 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setOpen(allOpen ? new Set() : new Set(grouped.map((g) => g.key)))}
          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-primary-100/60 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <ChevronsUpDown className="h-4 w-4" />
          {allOpen ? 'Thu gọn tất cả' : 'Mở tất cả'}
        </button>
      </div>

      {/* Category groups */}
      <div className="space-y-3">
        {grouped.map(({ key: cat, sentences }) => {
          const isOpen = open.has(cat);
          const catKey = cat;
          return (
            <div key={cat} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <button
                onClick={() => toggleCategory(cat)}
                className="flex w-full items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="flex items-center gap-3">
                  <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${CATEGORY_COLORS[catKey]}`}>
                    {CATEGORY_LABELS[catKey]}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{sentences.length} câu</span>
                </div>
                {isOpen ? <ChevronDown className="h-5 w-5 text-slate-400" /> : <ChevronRight className="h-5 w-5 text-slate-400" />}
              </button>
              {isOpen && (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sentences.map((s) => (
                    <div key={s.id} className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">{s.english}</span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            {s.level}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{s.vietnamese}</p>
                      </div>
                      {isSpeechSupported() && (
                        <button
                          onClick={() => speakEnglish(s.english)}
                          aria-label="Phát âm câu"
                          className="flex-shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-800 dark:hover:text-primary-400"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
