import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, ChevronRight, ClipboardList, History, Play, RotateCcw, Timer, Trash2, XCircle } from 'lucide-react';
import { sceneSvg } from '@/data/toeicScenes';
import { explainOptions, resolveLog, speakTexts } from '@/lib/toeicExplain';
import { REVIEW_CHANGED_EVENT, loadReview, qKey, removeWrong } from '@/lib/toeicReview';
import type { AnswerLog, SessionLog, WrongEntry } from '@/lib/toeicReview';
import { LETTERS, partLabel, useSequencePlayer } from '@/lib/toeicUi';
import { ExplainPanel } from './toeicShared';

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
};

// ------------------------------------------------------------------ một câu để xem lại
export function ReviewCard({ log, number, times, onDismiss }: { log: AnswerLog; number?: number; times?: number; onDismiss?: () => void }) {
  const info = resolveLog(log);
  const { play, stop, playing } = useSequencePlayer();
  if (!info) return null;
  const { unit, rq, answer, chosen, ok } = info;
  const part = unit.part;
  const speak = speakTexts(unit, log.o);
  const notes = explainOptions(unit, log.q, log.o);
  const isChoicesOnlyAudio = part === 'p1' || part === 'p2';

  return (
    <div className={`rounded-2xl border bg-white p-5 dark:bg-slate-900 ${ok ? 'border-emerald-200 dark:border-emerald-900' : 'border-rose-200 dark:border-rose-900'}`}>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide">
        {number !== undefined && <span className="text-slate-500">Câu {number}</span>}
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{partLabel(part)}</span>
        {unit.title && <span className="normal-case tracking-normal text-slate-500 dark:text-slate-400">{unit.title}</span>}
        <span
          className={`ml-auto flex items-center gap-1 rounded-full px-2.5 py-1 ${
            ok
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200'
              : chosen === undefined
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200'
          }`}
        >
          {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
          {ok ? 'Đúng' : chosen === undefined ? 'Bỏ trống' : 'Sai'}
        </span>
        {times !== undefined && times > 1 && <span className="rounded-full bg-rose-50 px-2.5 py-1 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">Sai {times} lần</span>}
      </div>

      {unit.scene && <div className="mx-auto mb-3 max-w-md overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700" dangerouslySetInnerHTML={{ __html: sceneSvg(unit.scene) }} />}

      {part === 'p2' && unit.lines && (
        <p className="mb-3 rounded-xl bg-slate-50 px-4 py-3 text-[16px] font-medium text-slate-900 dark:bg-slate-800/60 dark:text-slate-100">
          <span className="mr-2 text-sm font-semibold text-slate-500">Câu hỏi:</span>
          {unit.lines[0].text}
        </p>
      )}

      {rq.prompt && <p className="mb-3 text-[16px] font-medium text-slate-900 dark:text-slate-100">{rq.prompt}</p>}
      {!rq.prompt && part === 'p1' && <p className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Chọn câu mô tả đúng nhất bức tranh</p>}

      {(unit.passage || (unit.lines && !isChoicesOnlyAudio)) && (
        <details className="mb-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[15px] dark:border-slate-700 dark:bg-slate-800/40">
          <summary className="cursor-pointer text-sm font-semibold text-primary-700 dark:text-primary-300">{unit.passage ? 'Xem đoạn văn' : 'Xem lời thoại (transcript)'}</summary>
          <div className="mt-2 space-y-1.5 whitespace-pre-line text-slate-800 dark:text-slate-200">
            {unit.passage ??
              unit.lines!.map((l, i) => (
                <p key={i}>
                  {l.who && <span className="mr-2 font-semibold text-slate-500">{l.who}:</span>}
                  {l.text}
                </p>
              ))}
          </div>
        </details>
      )}

      {speak && (
        <button
          onClick={() => (playing ? stop() : play(speak, part === 'p1' || part === 'p2' ? 900 : 450))}
          className="mb-3 flex items-center gap-2 rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-primary-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {playing ? <Timer className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? 'Dừng' : 'Nghe lại'}
        </button>
      )}

      <div className="space-y-2">
        {log.o.map((opt, i) => {
          let cls = 'border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400';
          if (i === answer) cls = 'border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-100';
          else if (i === chosen) cls = 'border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-600 dark:bg-rose-950/40 dark:text-rose-100';
          return (
            <div key={i} className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-[15px] ${cls}`}>
              <span className="font-semibold">{LETTERS[i]}.</span>
              <span className="flex-1">{opt}</span>
              {i === answer && <span className="shrink-0 text-xs font-bold">Đáp án đúng</span>}
              {i === chosen && i !== answer && <span className="shrink-0 text-xs font-bold">Bạn chọn</span>}
            </div>
          );
        })}
        {chosen === undefined && <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Bạn đã bỏ trống câu này.</p>}
      </div>

      <ExplainPanel options={log.o} answer={answer} why={rq.why} notes={notes} chosen={chosen} />

      {onDismiss && (
        <button onClick={onDismiss} className="mt-3 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
          <Trash2 className="h-4 w-4" /> Đã nắm, bỏ khỏi danh sách ôn
        </button>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ danh sách xem lại (lọc đúng/sai)
type Filter = 'all' | 'wrong' | 'right';

export function ReviewList({ items, initialFilter = 'all' }: { items: AnswerLog[]; initialFilter?: Filter }) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  // Giữ số thứ tự câu theo thứ tự làm bài, kể cả khi đang lọc
  const rows = useMemo(
    () =>
      items
        .map((log, i) => ({ log, n: i + 1, info: resolveLog(log) }))
        .filter((r) => r.info)
        .map((r) => ({ log: r.log, n: r.n, ok: r.info!.ok })),
    [items]
  );
  const wrongCount = rows.filter((r) => !r.ok).length;
  const shown = rows.filter((r) => (filter === 'all' ? true : filter === 'wrong' ? !r.ok : r.ok));
  const tabs: [Filter, string, number][] = [
    ['all', 'Tất cả', rows.length],
    ['wrong', 'Câu sai', wrongCount],
    ['right', 'Câu đúng', rows.length - wrongCount],
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map(([key, label, n]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
              filter === key
                ? 'border-primary-500 bg-primary-100 text-primary-900 dark:border-primary-400 dark:bg-primary-900/40 dark:text-primary-100'
                : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
            }`}
          >
            {label} ({n})
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white px-5 py-8 text-center text-[15px] text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          {filter === 'wrong' ? 'Không có câu sai nào, làm tốt lắm!' : 'Không có câu nào trong mục này.'}
        </p>
      ) : (
        shown.map((r) => <ReviewCard key={`${r.log.u}:${r.log.q}`} log={r.log} number={r.n} />)
      )}
    </div>
  );
}

// ------------------------------------------------------------------ màn hình Ôn tập
const PRACTICE_CAP = 30;

export function ReviewHub({ onBack, onPractice }: { onBack: () => void; onPractice: (entries: WrongEntry[]) => void }) {
  const [store, setStore] = useState(loadReview);
  const [tab, setTab] = useState<'wrong' | 'history'>('wrong');
  const [open, setOpen] = useState<SessionLog | null>(null);

  useEffect(() => {
    const reload = () => setStore(loadReview());
    window.addEventListener(REVIEW_CHANGED_EVENT, reload);
    return () => window.removeEventListener(REVIEW_CHANGED_EVENT, reload);
  }, []);

  // Bỏ các câu không còn tồn tại trong ngân hàng đề; câu sai nhiều lần xếp trước
  const wrong = useMemo(
    () =>
      Object.values(store.wrong)
        .filter((w) => resolveLog(w))
        .sort((a, b) => b.times - a.times || b.at.localeCompare(a.at)),
    [store.wrong]
  );

  const back = (
    <button onClick={open ? () => setOpen(null) : onBack} className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-primary-100/60 dark:text-slate-300 dark:hover:bg-slate-800">
      <ArrowLeft className="h-4 w-4" /> {open ? 'Lịch sử làm bài' : 'Quay lại'}
    </button>
  );

  if (open) {
    const pct = Math.round((open.correct / open.total) * 100);
    return (
      <div className="space-y-5">
        {back}
        <header>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{open.title}</h1>
          <p className="mt-1 text-[15px] text-slate-600 dark:text-slate-300">
            {fmtDate(open.at)} · đúng {open.correct}/{open.total} câu ({pct}%)
          </p>
        </header>
        <ReviewList items={open.items} initialFilter={open.correct < open.total ? 'wrong' : 'all'} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {back}
      <header>
        <h1 className="flex items-center gap-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">
          <ClipboardList className="h-8 w-8 text-primary-600 dark:text-primary-300" /> Ôn tập
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
          Các câu bạn từng làm sai được lưu lại ở đây. Làm đúng lại ở phần luyện lại thì câu đó tự bỏ khỏi danh sách. Mục “Lịch sử” cho xem lại cả câu đúng lẫn câu sai của 10 lượt làm gần nhất.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ['wrong', `Câu đã sai (${wrong.length})`, ClipboardList],
            ['history', `Lịch sử làm bài (${store.sessions.length})`, History],
          ] as const
        ).map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            aria-pressed={tab === key}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[15px] font-semibold transition-colors ${
              tab === key
                ? 'border-primary-500 bg-primary-100 text-primary-900 dark:border-primary-400 dark:bg-primary-900/40 dark:text-primary-100'
                : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {tab === 'wrong' ? (
        wrong.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center text-[15px] text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            Chưa có câu sai nào được lưu. Làm một bài kiểm tra, các câu sai sẽ xuất hiện ở đây.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary-200 bg-primary-50 p-4 dark:border-primary-800 dark:bg-primary-950/40">
              <p className="text-[15px] text-slate-700 dark:text-slate-200">
                Luyện lại {Math.min(wrong.length, PRACTICE_CAP)} câu sai nhiều nhất{wrong.length > PRACTICE_CAP ? ` (trong tổng ${wrong.length} câu)` : ''}, có giải thích sau mỗi câu.
              </p>
              <button
                onClick={() => onPractice(wrong.slice(0, PRACTICE_CAP))}
                className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-[15px] font-semibold text-white hover:bg-primary-700"
              >
                <RotateCcw className="h-4 w-4" /> Luyện lại câu sai
              </button>
            </div>
            <div className="space-y-4">
              {wrong.map((w) => (
                <ReviewCard key={qKey(w.u, w.q)} log={w} times={w.times} onDismiss={() => setStore(removeWrong(qKey(w.u, w.q)))} />
              ))}
            </div>
          </>
        )
      ) : store.sessions.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center text-[15px] text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">Chưa có lượt làm nào được lưu.</p>
      ) : (
        <div className="space-y-3">
          {store.sessions.map((s) => {
            const pct = Math.round((s.correct / s.total) * 100);
            return (
              <button
                key={s.id}
                onClick={() => setOpen(s)}
                className="lift flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left dark:border-slate-800 dark:bg-slate-900"
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${pct >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200' : pct >= 60 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200'}`}>
                  {pct}%
                </span>
                <span className="flex-1">
                  <span className="block text-lg font-semibold text-slate-900 dark:text-slate-100">{s.title}</span>
                  <span className="block text-sm text-slate-500 dark:text-slate-400">
                    {fmtDate(s.at)} · đúng {s.correct}/{s.total} câu
                  </span>
                </span>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

