import { useState } from 'react';
import { ArrowLeft, BookMarked, CheckCircle2, ChevronDown, ChevronRight, Lightbulb, ListChecks, PenLine, Volume2 } from 'lucide-react';
import { GRAMMAR_BY_LEVEL, GRAMMAR_EXERCISES, GRAMMAR_LEVELS, GRAMMAR_LEVEL_NOTE, GRAMMAR_TOTAL } from '@/data/grammarData';
import type { GrammarLevel, GrammarQuestion } from '@/data/grammarData';
import { shuffle } from '@/lib/dictItems';
import { LEVEL_LABEL } from '@/data/vocabLevels';
import { PageHeader } from '@/components/PageHeader';
import { speakEnglish, isSpeechSupported } from '@/lib/speech';
import { loadGrammarProgress, recordGrammarResult } from '@/lib/grammarProgress';
import type { GrammarQuizProgress } from '@/lib/grammarProgress';
import { GrammarQuiz } from './GrammarQuiz';

const LEVEL_KEY = 'flex_grammar_level_v1';

function loadLevel(): GrammarLevel {
  try {
    const v = localStorage.getItem(LEVEL_KEY);
    if (v && (GRAMMAR_LEVELS as string[]).includes(v)) return v as GrammarLevel;
  } catch {
    /* localStorage không dùng được: bắt đầu từ A1 */
  }
  return 'A1';
}

function saveLevel(l: GrammarLevel) {
  try {
    localStorage.setItem(LEVEL_KEY, l);
  } catch {
    /* bỏ qua */
  }
}

export function GrammarView() {
  const [level, setLevel] = useState<GrammarLevel>(loadLevel);
  // Các điểm ngữ pháp đang mở. Đổi cấp thì thu gọn hết cho danh sách gọn mắt.
  const [open, setOpen] = useState<Set<string>>(new Set());
  // Các điểm đang ở tab Bài tập (mặc định là tab Lý thuyết).
  const [quizTab, setQuizTab] = useState<Set<string>>(new Set());
  // Bài tập tổng hợp: bảng chọn nhiều điểm, các điểm đã tick, số câu muốn làm (0 = tất cả) và bộ câu đang làm.
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [count, setCount] = useState(10);
  const [mix, setMix] = useState<{ questions: GrammarQuestion[]; points: number } | null>(null);
  const [progress, setProgress] = useState<GrammarQuizProgress>(loadGrammarProgress);

  const points = GRAMMAR_BY_LEVEL[level];

  const selectLevel = (l: GrammarLevel) => {
    setLevel(l);
    saveLevel(l);
    setOpen(new Set());
    setQuizTab(new Set());
    setSelected(new Set());
    setPickerOpen(false);
    setMix(null);
  };
  const setTab = (id: string, quiz: boolean) =>
    setQuizTab((prev) => {
      const next = new Set(prev);
      if (quiz) next.add(id);
      else next.delete(id);
      return next;
    });
  const toggleSelected = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const pool = points.filter((p) => selected.has(p.id)).flatMap((p) => GRAMMAR_EXERCISES[p.id] ?? []);
  const poolSize = pool.length;
  const quizSize = count === 0 ? poolSize : Math.min(count, poolSize);
  /** Gộp câu hỏi của các điểm đã chọn, xáo trộn rồi lấy đủ số câu. */
  const startMix = () => {
    if (poolSize === 0) return;
    setMix({ questions: shuffle(pool).slice(0, quizSize), points: selected.size });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const doneCount = points.filter((p) => progress[p.id]).length;
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="space-y-6">
      <PageHeader
        icon={BookMarked}
        title="Ngữ pháp"
        description={`${GRAMMAR_TOTAL} điểm ngữ pháp từ A1 đến C1. Mỗi điểm có công thức, cách dùng, ví dụ có phát âm, những lỗi hay gặp và bài tập trắc nghiệm để luyện ngay.`}
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex w-fit flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          {GRAMMAR_LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => selectLevel(l)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                level === l
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-600 hover:bg-primary-100/60 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {LEVEL_LABEL[l]}
              <span className={`ml-1.5 text-xs ${level === l ? 'text-white/80' : 'text-slate-400'}`}>{GRAMMAR_BY_LEVEL[l].length}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setPickerOpen((v) => !v)}
          aria-expanded={pickerOpen}
          className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors ${
            pickerOpen
              ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300'
              : 'border-slate-200 bg-white text-slate-700 hover:border-primary-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
          }`}
        >
          <ListChecks className="h-4 w-4" />
          Tạo bài tập từ nhiều mục
        </button>
        <span className="ml-auto text-sm text-slate-500 dark:text-slate-400">
          Bài tập đã làm: <span className="font-semibold tabular-nums">{doneCount}/{points.length}</span>
        </span>
      </div>

      {mix && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Bài tập tổng hợp
              <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">
                {mix.points} điểm ngữ pháp · {mix.questions.length} câu
              </span>
            </h2>
            <button
              onClick={() => setMix(null)}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Thoát
            </button>
          </div>
          <GrammarQuiz questions={mix.questions} onFinish={() => undefined} onBackToTheory={() => setMix(null)} backLabel="Quay lại danh sách" />
        </div>
      )}

      {!mix && pickerOpen && (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Chọn các điểm ngữ pháp muốn làm ({level})</h2>
            <div className="flex gap-1">
              <button
                onClick={() => setSelected(new Set(points.filter((p) => GRAMMAR_EXERCISES[p.id]?.length).map((p) => p.id)))}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-primary-700 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-slate-800"
              >
                Chọn tất cả
              </button>
              <button
                onClick={() => setSelected(new Set())}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Bỏ chọn
              </button>
            </div>
          </div>

          <ul className="grid gap-2 sm:grid-cols-2">
            {points.map((p, i) => {
              const checked = selected.has(p.id);
              const r = progress[p.id];
              const has = (GRAMMAR_EXERCISES[p.id]?.length ?? 0) > 0;
              return (
                <li key={p.id}>
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
                      checked
                        ? 'border-primary-500 bg-primary-50 dark:border-primary-600 dark:bg-primary-950/40'
                        : 'border-slate-200 hover:border-primary-300 dark:border-slate-700 dark:hover:border-slate-600'
                    } ${has ? '' : 'cursor-not-allowed opacity-50'}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={!has}
                      onChange={() => toggleSelected(p.id)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-primary-600"
                    />
                    <span className="min-w-0 flex-1 text-slate-800 dark:text-slate-200">
                      <span className="font-medium">{i + 1}. {p.title}</span>
                    </span>
                    {r && <span className="shrink-0 text-xs font-bold tabular-nums text-slate-500 dark:text-slate-400">{r.best}/{r.total}</span>}
                  </label>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span>Số câu:</span>
              {[10, 20, 0].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  aria-pressed={count === n}
                  className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                    count === n
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-primary-100/60 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {n === 0 ? 'Tất cả' : n}
                </button>
              ))}
            </div>
            <button
              onClick={startMix}
              disabled={poolSize === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PenLine className="h-4 w-4" />
              {poolSize === 0 ? 'Chọn ít nhất 1 điểm' : `Bắt đầu (${quizSize} câu)`}
            </button>
          </div>
        </section>
      )}

      {!mix && (
        <>
      <p className="text-sm text-slate-500 dark:text-slate-400">{GRAMMAR_LEVEL_NOTE[level]}</p>

      <div className="space-y-3">
        {points.map((p, i) => {
          const isOpen = open.has(p.id);
          const panelId = `grammar-${p.id}`;
          const exercises = GRAMMAR_EXERCISES[p.id] ?? [];
          const result = progress[p.id];
          const showQuiz = quizTab.has(p.id) && exercises.length > 0;
          return (
            <div
              key={p.id}
              id={`grammar-card-${p.id}`}
              className="scroll-mt-20 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              <button
                onClick={() => toggle(p.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold text-slate-900 dark:text-slate-100">{p.title}</span>
                  <span className="mt-0.5 block text-sm text-slate-500 dark:text-slate-400">{p.summary}</span>
                </span>
                {result && (
                  <span
                    title="Điểm bài tập cao nhất"
                    className={`mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold tabular-nums ${
                      result.best === result.total
                        ? 'bg-success-100 text-success-700 dark:bg-success-950/40 dark:text-success-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {result.best === result.total && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {result.best}/{result.total}
                  </span>
                )}
                {isOpen ? (
                  <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-slate-400" />
                ) : (
                  <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-slate-400" />
                )}
              </button>

              {isOpen && (
                <div id={panelId} className="space-y-5 border-t border-slate-100 px-5 py-5 dark:border-slate-800">
                  {exercises.length > 0 && (
                    <div role="tablist" className="flex w-fit gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                      {([false, true] as const).map((quiz) => {
                        const active = showQuiz === quiz;
                        return (
                          <button
                            key={String(quiz)}
                            role="tab"
                            aria-selected={active}
                            onClick={() => setTab(p.id, quiz)}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                              active
                                ? 'bg-white text-primary-700 shadow-sm dark:bg-slate-900 dark:text-primary-300'
                                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                          >
                            {quiz ? <PenLine className="h-4 w-4" /> : <BookMarked className="h-4 w-4" />}
                            {quiz ? `Bài tập (${exercises.length} câu)` : 'Lý thuyết'}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {showQuiz ? (
                    <GrammarQuiz
                      questions={exercises}
                      onFinish={(score, total) => setProgress(recordGrammarResult(p.id, score, total))}
                      onBackToTheory={() => setTab(p.id, false)}
                    />
                  ) : (
                    <>
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Công thức</h3>
                    <ul className="mt-2 space-y-2">
                      {p.forms.map((f, k) => (
                        <li
                          key={k}
                          className="rounded-xl bg-primary-50 px-3.5 py-2.5 text-sm font-medium leading-relaxed text-primary-900 dark:bg-primary-950/50 dark:text-primary-100"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Cách dùng</h3>
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {p.uses.map((u, k) => (
                        <li key={k}>{u}</li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Ví dụ</h3>
                    <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                      {p.examples.map((ex, k) => (
                        <li key={k} className="flex items-start gap-3 px-4 py-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{ex.en}</p>
                            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{ex.vi}</p>
                          </div>
                          {isSpeechSupported() && (
                            <button
                              onClick={() => speakEnglish(ex.en)}
                              aria-label="Nghe câu ví dụ"
                              title="Nghe câu ví dụ"
                              className="flex-shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-800 dark:hover:text-primary-400"
                            >
                              <Volume2 className="h-4 w-4" />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>

                  {p.notes && p.notes.length > 0 && (
                    <section className="rounded-xl border border-warning-200 bg-warning-50 px-4 py-3 dark:border-warning-900/50 dark:bg-warning-900/20">
                      <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-warning-800 dark:text-warning-200">
                        <Lightbulb className="h-3.5 w-3.5" />
                        Lưu ý
                      </h3>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-warning-900 dark:text-warning-100">
                        {p.notes.map((n, k) => (
                          <li key={k}>{n}</li>
                        ))}
                      </ul>
                    </section>
                  )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
        </>
      )}
    </div>
  );
}
