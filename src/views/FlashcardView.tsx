import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Volume2, Eye, EyeOff, RotateCcw, Check, Layers, Inbox, Star } from 'lucide-react';
import { INITIAL_VOCAB, VOCAB_BY_LEVEL, LEVEL_LABEL, LEVEL_ORDER } from '@/data/vocabData';
import { topicOf } from '@/data/vocabTopics';
import { TopicSelect, countByTopic } from '@/components/TopicSelect';
import type { TopicFilter } from '@/components/TopicSelect';
import { speakEnglish, isSpeechSupported } from '@/lib/speech';
import { POS_SHORT } from '@/lib/pos';
import { useSrsProgress } from '@/hooks/useSrsProgress';
import { useStarred } from '@/hooks/useStarred';
import { vocabKey, speechText } from '@/lib/vocabKey';
import { isDue } from '@/lib/srs';
import type { VocabItem, ReviewQuality, FlashcardFilter, SrsState } from '@/lib/types';

type ProgressMap = Record<string, SrsState>;
type SessionStats = { reviewed: number; known: number; unknown: number };
const EMPTY_STATS: SessionStats = { reviewed: 0, known: 0, unknown: 0 };

/**
 * Thứ tự ôn: thẻ đến hạn (cũ nhất trước) -> thẻ mới chưa học -> thẻ chưa đến hạn.
 */
function sortByDue(list: VocabItem[], progressMap: ProgressMap): VocabItem[] {
  const rank = (w: VocabItem) => {
    const s = progressMap[vocabKey(w)];
    if (!s) return 1;
    return isDue(s.nextReview) ? 0 : 2;
  };
  return [...list].sort((a, b) => {
    const ra = rank(a);
    const rb = rank(b);
    if (ra !== rb) return ra - rb;
    if (ra === 1) return 0;
    return progressMap[vocabKey(a)].nextReview.localeCompare(progressMap[vocabKey(b)].nextReview);
  });
}

function listFor(filter: FlashcardFilter, progressMap: ProgressMap, starred: Set<string>): VocabItem[] {
  let list: VocabItem[];
  if (filter === 'all') list = INITIAL_VOCAB;
  else if (filter === 'hard') list = INITIAL_VOCAB.filter((w) => progressMap[vocabKey(w)]?.lastQuality === 'hard');
  else if (filter === 'good') {
    list = INITIAL_VOCAB.filter((w) => {
      const s = progressMap[vocabKey(w)];
      return s && (s.lastQuality === 'good' || s.lastQuality === 'easy');
    });
  } else if (filter === 'starred') list = INITIAL_VOCAB.filter((w) => starred.has(vocabKey(w)));
  else list = VOCAB_BY_LEVEL[filter] ?? [];
  return list;
}

function buildDeck(filter: FlashcardFilter, topic: TopicFilter, progressMap: ProgressMap, starred: Set<string>): VocabItem[] {
  let list = listFor(filter, progressMap, starred);
  if (topic !== 'all') list = list.filter((w) => topicOf(w) === topic);
  return sortByDue(list, progressMap);
}

export function FlashcardView() {
  const { progressMap, upsert } = useSrsProgress();
  const { starred, toggle: toggleStar } = useStarred();
  const [filter, setFilter] = useState<FlashcardFilter>('all');
  const [topic, setTopic] = useState<TopicFilter>('all');
  const [showIpa, setShowIpa] = useState(true);
  const [showMeaning, setShowMeaning] = useState(false);
  const [index, setIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState<SessionStats>(EMPTY_STATS);
  const [finished, setFinished] = useState(false);

  // Bộ thẻ được "chụp" lúc bắt đầu phiên (đổi bộ lọc / học lại). Nếu tính lại sau
  // mỗi lần chấm điểm, thứ tự đổi giữa chừng và thẻ kế tiếp sẽ bị nhảy cóc.
  const progressRef = useRef(progressMap);
  progressRef.current = progressMap;
  const starredRef = useRef(starred);
  starredRef.current = starred;

  const [cards, setCards] = useState<VocabItem[]>(() => buildDeck('all', 'all', progressMap, starred));

  const startSession = useCallback((f: FlashcardFilter, t: TopicFilter) => {
    setCards(buildDeck(f, t, progressRef.current, starredRef.current));
    setIndex(0);
    setShowMeaning(false);
    setFinished(false);
    setSessionStats(EMPTY_STATS); // phiên mới thì thống kê tính lại từ đầu
  }, []);

  useEffect(() => {
    startSession(filter, topic);
  }, [filter, topic, startSession]);

  const currentCard: VocabItem | undefined = cards[index];

  // Chỉ còn 2 mức: "Chưa thuộc" -> hard (quên, ôn lại ngày mai), "Thuộc rồi" -> good
  const handleReview = (quality: Extract<ReviewQuality, 'hard' | 'good'>) => {
    if (!currentCard || finished) return;
    upsert(vocabKey(currentCard), quality);
    setSessionStats((prev) => ({
      reviewed: prev.reviewed + 1,
      known: prev.known + (quality === 'good' ? 1 : 0),
      unknown: prev.unknown + (quality === 'hard' ? 1 : 0),
    }));
    if (index + 1 >= cards.length) setFinished(true);
    else { setIndex((i) => i + 1); setShowMeaning(false); }
  };

  // Lật thẻ: khi hiện nghĩa thì tự phát âm
  const toggleMeaning = () => {
    if (!currentCard || finished) return;
    const next = !showMeaning;
    setShowMeaning(next);
    if (next) speakEnglish(speechText(currentCard));
  };

  const toggleCurrentStar = () => {
    if (currentCard && !finished) toggleStar(vocabKey(currentCard));
  };

  // Phím tắt: Space lật thẻ, ← chưa thuộc, → thuộc rồi, ↓ đánh dấu sao.
  // Dùng ref để một listener duy nhất luôn gọi bản xử lý mới nhất.
  const actionsRef = useRef({ flip: toggleMeaning, known: () => {}, unknown: () => {}, star: toggleCurrentStar });
  actionsRef.current = {
    flip: toggleMeaning,
    known: () => handleReview('good'),
    unknown: () => handleReview('hard'),
    star: toggleCurrentStar,
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      if (document.querySelector('[role="dialog"]')) return; // đang mở hộp thoại (vd. Giọng đọc)
      const a = actionsRef.current;
      switch (e.key) {
        case ' ':
          e.preventDefault(); // không cuộn trang / không kích hoạt nút đang focus
          if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
          if (!e.repeat) a.flip();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (!e.repeat) a.unknown();
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (!e.repeat) a.known();
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!e.repeat) a.star();
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const reset = () => startSession(filter, topic);

  const isStarredCard = currentCard ? starred.has(vocabKey(currentCard)) : false;

  const dueCount = INITIAL_VOCAB.filter((w) => {
    const s = progressMap[vocabKey(w)];
    return s && isDue(s.nextReview);
  }).length;
  const hardCount = INITIAL_VOCAB.filter((w) => progressMap[vocabKey(w)]?.lastQuality === 'hard').length;
  const goodCount = INITIAL_VOCAB.filter((w) => {
    const s = progressMap[vocabKey(w)];
    return s && (s.lastQuality === 'good' || s.lastQuality === 'easy');
  }).length;

  // Số từ của từng chủ đề trong bộ lọc đang chọn (A1/A2/B1, Đã đánh dấu...)
  const baseList = listFor(filter, progressMap, starred);
  const topicCounts = useMemo(() => countByTopic(baseList), [baseList]);

  const filterTabs: { key: FlashcardFilter; label: string; count: number }[] = [
    { key: 'all', label: 'Tất cả', count: INITIAL_VOCAB.length },
    ...LEVEL_ORDER.map((l) => ({ key: l as FlashcardFilter, label: LEVEL_LABEL[l], count: VOCAB_BY_LEVEL[l].length })),
    { key: 'starred', label: 'Đã đánh dấu', count: starred.size },
    { key: 'hard', label: 'Cần ôn', count: hardCount },
    { key: 'good', label: 'Đã thuộc', count: goodCount },
  ];

  const chip = (active: boolean) =>
    `flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
      active
        ? 'border-primary-600 bg-primary-600 text-white'
        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
    }`;

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Ôn từ vựng</h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          {dueCount > 0 ? `${dueCount} thẻ đến hạn hôm nay` : 'Chưa có thẻ nào đến hạn'}
        </p>
      </header>

      <div className="-mx-4 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
        <div role="tablist" aria-label="Bộ thẻ" className="flex w-max gap-1.5">
          {filterTabs.map((tab) => (
            <button
              key={String(tab.key)}
              role="tab"
              aria-selected={filter === tab.key}
              onClick={() => setFilter(tab.key)}
              className={chip(filter === tab.key)}
            >
              {tab.label}
              <span className={`text-xs tabular-nums ${filter === tab.key ? 'text-white/75' : 'text-slate-400'}`}>{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      <TopicSelect value={topic} onChange={setTopic} counts={topicCounts} total={baseList.length} />

      {finished ? (
        <SessionComplete stats={sessionStats} onReset={reset} />
      ) : cards.length === 0 || !currentCard ? (
        <EmptyState onShowAll={() => { setFilter('all'); setTopic('all'); }} />
      ) : (
        <>
          <section
            aria-label="Thẻ từ vựng"
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_0_rgba(15,27,47,0.04),0_16px_40px_-16px_rgba(37,99,235,0.25)] dark:border-slate-800 dark:bg-slate-900"
          >
            <div
              className="h-1 bg-primary-100 dark:bg-slate-800"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={cards.length}
              aria-valuenow={index + 1}
              aria-label="Tiến độ phiên học"
            >
              <div className="h-full bg-primary-600 transition-[width] duration-300" style={{ width: `${((index + 1) / cards.length) * 100}%` }} />
            </div>

            <div className="px-6 pb-7 pt-4 sm:px-10">
              <div className="flex items-center justify-between">
                <span className="text-sm tabular-nums text-slate-500 dark:text-slate-400">
                  {index + 1} / {cards.length}
                </span>
                <div className="-mr-2 flex items-center">
                  <button
                    onClick={toggleCurrentStar}
                    className={`rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${isStarredCard ? 'text-accent-500' : 'text-slate-400 hover:text-slate-600'}`}
                    title={isStarredCard ? 'Bỏ đánh dấu (phím ↓)' : 'Đánh dấu cần học (phím ↓)'}
                    aria-label={isStarredCard ? 'Bỏ đánh dấu' : 'Đánh dấu cần học'}
                    aria-pressed={isStarredCard}
                  >
                    <Star className={`h-5 w-5 ${isStarredCard ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => setShowIpa(!showIpa)}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                    title={showIpa ? 'Ẩn phiên âm' : 'Hiện phiên âm'}
                    aria-label={showIpa ? 'Ẩn phiên âm' : 'Hiện phiên âm'}
                  >
                    {showIpa ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="mt-6 cursor-pointer select-none text-center" onClick={toggleMeaning}>
                <h3 className="break-words font-display text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-6xl">
                  {currentCard.word}
                </h3>
                <p className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-slate-500 dark:text-slate-400">
                  <span className="font-display text-lg italic">{POS_SHORT[currentCard.pos]}</span>
                  {showIpa && <span className="font-ipa text-lg text-primary-600 dark:text-primary-400">{currentCard.ipa}</span>}
                  {isSpeechSupported() && (
                    <button
                      onClick={(e) => { e.stopPropagation(); speakEnglish(speechText(currentCard)); }}
                      className="rounded-full bg-primary-50 p-2 text-primary-600 transition-colors hover:bg-primary-100 dark:bg-primary-950/60 dark:text-primary-300 dark:hover:bg-primary-900/60"
                      aria-label="Nghe phát âm"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  )}
                </p>
              </div>

              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 motion-reduce:transition-none ${
                  showMeaning ? 'mt-7 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
                aria-hidden={!showMeaning}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
                    <p className="text-center text-xl font-semibold text-slate-900 dark:text-slate-100">{currentCard.meaning}</p>
                    <blockquote className="mt-5 border-l-2 border-primary-300 pl-4 dark:border-primary-700">
                      <div className="flex items-start gap-2">
                        <p className="flex-1 text-base leading-relaxed text-slate-800 dark:text-slate-200">{currentCard.example}</p>
                        {isSpeechSupported() && (
                          <button
                            onClick={() => speakEnglish(currentCard.example)}
                            tabIndex={showMeaning ? 0 : -1}
                            className="flex-shrink-0 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-800"
                            aria-label="Nghe câu ví dụ"
                            title="Nghe câu ví dụ"
                          >
                            <Volume2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{currentCard.exampleVi}</p>
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {showMeaning ? (
            <div className="grid grid-cols-2 gap-3">
              <ReviewButton
                label="Chưa thuộc"
                sublabel="Ôn lại ngày mai"
                hint="←"
                onClick={() => handleReview('hard')}
                tone="border-error-200 bg-error-50 text-error-700 hover:bg-error-100 dark:border-error-900 dark:bg-error-950/30 dark:text-error-400 dark:hover:bg-error-950/50"
              />
              <ReviewButton
                label="Thuộc rồi"
                sublabel="Ôn lại sau vài ngày"
                hint="→"
                onClick={() => handleReview('good')}
                tone="border-success-200 bg-success-50 text-success-700 hover:bg-success-100 dark:border-success-900 dark:bg-success-950/30 dark:text-success-400 dark:hover:bg-success-950/50"
              />
            </div>
          ) : (
            <button
              onClick={toggleMeaning}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-4 text-base font-semibold text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7)] transition-colors hover:bg-primary-700"
            >
              Xem nghĩa
              <kbd className="hidden rounded border border-white/40 px-1.5 py-0.5 font-sans text-xs font-normal text-white/80 sm:inline">Space</kbd>
            </button>
          )}

          <p className="hidden text-center text-xs text-slate-400 sm:block">
            Phím tắt: Space lật thẻ, ← chưa thuộc, → thuộc rồi, ↓ đánh dấu
          </p>
        </>
      )}
    </div>
  );
}

function ReviewButton({ label, sublabel, hint, onClick, tone }: { label: string; sublabel: string; hint: string; onClick: () => void; tone: string }) {
  return (
    <button onClick={onClick} className={`rounded-xl border px-4 py-3.5 text-center transition-transform active:scale-[0.98] ${tone}`}>
      <div className="flex items-center justify-center gap-2 text-base font-semibold">
        {label}
        <kbd className="hidden rounded border border-current px-1.5 py-0.5 font-sans text-xs font-normal opacity-60 sm:inline">{hint}</kbd>
      </div>
      <div className="mt-0.5 text-xs opacity-75">{sublabel}</div>
    </button>
  );
}

function SessionComplete({ stats, onReset }: { stats: SessionStats; onReset: () => void }) {
  const pct = stats.reviewed > 0 ? Math.round((stats.known / stats.reviewed) * 100) : 0;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-100 dark:bg-success-950/40">
        <Check className="h-7 w-7 text-success-600 dark:text-success-400" />
      </div>
      <h3 className="font-display text-3xl font-semibold text-slate-900 dark:text-slate-100">Xong phiên học</h3>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Bạn đã ôn {stats.reviewed} thẻ và nhớ {pct}%. Thuộc rồi {stats.known}, chưa thuộc {stats.unknown}.
      </p>
      <button
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
      >
        <RotateCcw className="h-4 w-4" />
        Học lại bộ này
      </button>
    </div>
  );
}

function EmptyState({ onShowAll }: { onShowAll: () => void }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <Inbox className="h-7 w-7 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Bộ này chưa có thẻ nào</h3>
      <p className="mx-auto mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-400">
        Thẻ sẽ xuất hiện ở đây khi bạn học và đánh dấu từ. Chọn "Tất cả" để bắt đầu.
      </p>
      <button
        onClick={onShowAll}
        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <Layers className="h-4 w-4" />
        Xem tất cả thẻ
      </button>
    </div>
  );
}
