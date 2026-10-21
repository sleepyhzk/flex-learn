import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Circle,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  FileText,
  GraduationCap,
  Headphones,
  Image as ImageIcon,
  Lightbulb,
  Megaphone,
  MessageCircle,
  PenLine,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Timer,
  Trophy,
  Users,
  Volume2,
  X,
  XCircle,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { PARTS, questionCount } from '@/data/toeicData';
import type { PartKey, Unit } from '@/data/toeicData';
import { sceneSvg } from '@/data/toeicScenes';
import { shuffle } from '@/lib/dictItems';
import { ORDER, autoMinutes, bankSize, buildCustomUnits, pickUnits } from '@/lib/toeicMock';
import type { MockConfig } from '@/lib/toeicMock';
import { explainOptions, resolveLog, speakTexts, UNIT_BY_ID } from '@/lib/toeicExplain';
import { recordSession, loadReview } from '@/lib/toeicReview';
import type { AnswerLog, WrongEntry } from '@/lib/toeicReview';
import { LETTERS, partLabel, useSequencePlayer } from '@/lib/toeicUi';
import { computeToeicStats, recordAnswers, summarize } from '@/lib/toeicStats';
import { Modal } from '@/components/Modal';
import { PageHeader } from '@/components/PageHeader';
import { ReviewHub, ReviewList } from './ToeicReview';
import { ExplainPanel, Passage } from './toeicShared';
import { TOEIC_CHANGED_EVENT, loadToeicProgress, recordToeicResult } from '@/lib/toeicProgress';
import type { ToeicProgress } from '@/lib/toeicProgress';

// ------------------------------------------------------------------ chuẩn bị đề
interface PQ {
  prompt?: string;
  options: string[];
  answer: number;
  why: string;
  /** Vị trí câu trong đơn vị đề gốc (để lưu và ôn tập). */
  qi: number;
}
interface PUnit {
  unit: Unit;
  questions: PQ[];
  /** Các đoạn sẽ đọc to theo thứ tự (Part 1, 2, 3, 4). */
  speak?: string[];
}

/** `only`: chỉ lấy các câu có vị trí này (dùng khi luyện lại câu sai); giữ nguyên đoạn văn/lời thoại của đơn vị. */
function prepare(unit: Unit, only?: number[]): PUnit {
  const questions: PQ[] = [];
  unit.questions.forEach((r, qi) => {
    if (only && !only.includes(qi)) return;
    const options = shuffle([r.correct, ...r.wrongs]);
    questions.push({ prompt: r.prompt, options, answer: options.indexOf(r.correct), why: r.why, qi });
  });
  return { unit, questions, speak: speakTexts(unit, questions[0].options) };
}

const MIX: [PartKey, number][] = [['p1', 2], ['p2', 4], ['p3', 1], ['p4', 1], ['p5', 4], ['p6', 1], ['p7', 1]];

function buildSession(key: PartKey | 'mix'): PUnit[] {
  if (key === 'mix') return MIX.flatMap(([p, n]) => pickUnits(p, n)).map((u) => prepare(u));
  const info = PARTS.find((p) => p.key === key)!;
  return pickUnits(key, info.perSession).map((u) => prepare(u));
}

// ------------------------------------------------------------------ thi thử tùy chỉnh
const buildCustom = (parts: PartKey[], total: number): PUnit[] => buildCustomUnits(parts, total).map((u) => prepare(u));

/** Dựng lượt luyện lại từ các câu đã sai: gom theo đơn vị đề, xếp nghe trước đọc sau. */
function buildReview(entries: WrongEntry[]): PUnit[] {
  const byUnit = new Map<string, number[]>();
  for (const e of entries) byUnit.set(e.u, [...(byUnit.get(e.u) ?? []), e.q]);
  return [...byUnit.entries()]
    .map(([id, qis]) => ({ unit: UNIT_BY_ID.get(id)!, qis }))
    .filter((x) => x.unit)
    .sort((a, b) => ORDER.indexOf(a.unit.part) - ORDER.indexOf(b.unit.part))
    .map((x) => prepare(x.unit, x.qis));
}

const titleOfKey = (key: string) => (key === 'mix' ? 'Thi thử mini' : key === 'custom' ? 'Thi thử tùy chỉnh' : key === 'review' ? 'Ôn câu sai' : PARTS.find((p) => p.key === key)?.title ?? key);
const fmt = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

// ------------------------------------------------------------------ khối hiển thị
const TARGET_SCORE = 750;
const CARD = 'border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900';
const BTN_PRIMARY =
  'rounded-xl bg-primary-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-primary-600/20 transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none dark:disabled:bg-slate-700';
const BTN_GHOST =
  'rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-primary-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800';

const optionClass = (state: 'idle' | 'picked' | 'right' | 'wrong' | 'dim') =>
  ({
    idle: 'border-slate-200 bg-white text-slate-900 hover:border-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white',
    picked: 'border-primary-500 bg-primary-50 text-primary-900 dark:border-primary-400 dark:bg-primary-900/30 dark:text-primary-100',
    right: 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-200',
    wrong: 'border-rose-500 bg-rose-50 text-rose-800 dark:border-rose-600 dark:bg-rose-950/50 dark:text-rose-200',
    dim: 'border-slate-200 bg-white text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500',
  })[state];

function QuestionBlock({
  number,
  unit,
  pq,
  value,
  onPick,
  hideOptions,
  hint,
  exam,
}: {
  number: number;
  unit: Unit;
  pq: PQ;
  value: number | undefined;
  onPick: (i: number) => void;
  hideOptions?: boolean;
  hint?: string;
  /** Chế độ thi: không hiện đúng sai ngay, được đổi đáp án đến khi nộp bài. */
  exam?: boolean;
}) {
  const answered = value !== undefined;
  const reveal = answered && !exam;
  const correct = value === pq.answer;
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-700/80 dark:bg-slate-800/40">
        <p className="text-sm font-bold leading-relaxed text-slate-900 dark:text-white">
          <span className="mr-2 text-primary-700 dark:text-primary-300">Câu {number}.</span>
          {pq.prompt ?? hint ?? 'Chọn câu trả lời phù hợp nhất'}
        </p>
      </div>
      {hideOptions && !reveal ? (
        <div className="flex gap-3">
          {pq.options.map((_, i) => (
            <button
              key={i}
              onClick={() => onPick(i)}
              aria-pressed={value === i}
              className={`h-12 flex-1 rounded-xl border text-lg font-bold transition-all ${optionClass(value === i ? 'picked' : 'idle')}`}
            >
              {LETTERS[i]}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-2.5">
          {pq.options.map((opt, i) => {
            let state: Parameters<typeof optionClass>[0] = value === i ? 'picked' : 'idle';
            if (reveal) state = i === pq.answer ? 'right' : i === value ? 'wrong' : 'dim';
            return (
              <button
                key={i}
                disabled={reveal}
                onClick={() => onPick(i)}
                aria-pressed={value === i}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3.5 text-left text-sm font-semibold transition-all ${optionClass(state)}`}
              >
                <span>
                  <span className="mr-1.5">{LETTERS[i]}.</span>
                  {opt}
                </span>
                {state === 'right' ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" aria-label="Đáp án đúng" />
                ) : state === 'wrong' ? (
                  <XCircle className="h-4 w-4 shrink-0 text-rose-500" aria-label="Bạn chọn sai" />
                ) : state === 'picked' ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-500" aria-label="Đã chọn" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      )}
      {reveal && (
        <>
          <p className={`flex items-center gap-1.5 text-sm font-bold ${correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
            {correct ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {correct ? 'Chính xác!' : `Chưa đúng, đáp án đúng là ${LETTERS[pq.answer]}`}
          </p>
          <ExplainPanel options={pq.options} answer={pq.answer} why={pq.why} notes={explainOptions(unit, pq.qi, pq.options)} chosen={value} />
        </>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ một lượt làm bài (hộp thoại)
function Session({
  units,
  exam,
  timeLimit,
  badge,
  title,
  onExit,
  onFinish,
}: {
  units: PUnit[];
  exam?: boolean;
  /** Giới hạn thời gian, tính bằng giây. */
  timeLimit?: number;
  badge: string;
  title: string;
  onExit: () => void;
  onFinish: (correct: number, total: number, log: AnswerLog[], elapsedSec: number) => void;
}) {
  const [uIdx, setUIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showScript, setShowScript] = useState(false);
  const { play, stop, playing } = useSequencePlayer();
  const startedAt = useRef(Date.now());
  // Part 1, 2: hiện chữ (câu hỏi và đáp án) hay chỉ nghe. Luyện tập mặc định hiện, chế độ thi thật mặc định ẩn.
  const [showText, setShowText] = useState<boolean>(() => {
    if (exam) return false;
    try {
      return localStorage.getItem('flex_toeic_showtext') !== '0';
    } catch {
      return true;
    }
  });
  const toggleText = (v: boolean) => {
    setShowText(v);
    if (!exam) {
      try {
        localStorage.setItem('flex_toeic_showtext', v ? '1' : '0');
      } catch {
        // ignore
      }
    }
  };
  const [remaining, setRemaining] = useState(timeLimit ?? 0);
  const [timeUp, setTimeUp] = useState(false);

  const cur = units[uIdx];
  const part = cur.unit.part;
  const isListening = !!cur.speak;
  const gap = part === 'p1' || part === 'p2' ? 900 : 450;
  const done = cur.questions.every((_, qi) => answers[`${uIdx}-${qi}`] !== undefined);

  // Số thứ tự câu hỏi trong cả lượt
  const offset = useMemo(() => units.slice(0, uIdx).reduce((n, u) => n + u.questions.length, 0), [units, uIdx]);
  const totalQ = useMemo(() => units.reduce((n, u) => n + u.questions.length, 0), [units]);

  // Đồng hồ đếm ngược (tính theo mốc kết thúc để không lệch khi tab bị làm chậm)
  useEffect(() => {
    if (!timeLimit) return;
    const endAt = startedAt.current + timeLimit * 1000;
    const tick = () => {
      const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) setTimeUp(true);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [timeLimit]);

  useEffect(() => {
    setShowScript(false);
    window.scrollTo({ top: 0 });
    if (cur.speak) play(cur.speak, gap);
    else stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uIdx]);

  const finish = () => {
    let correct = 0;
    const log: AnswerLog[] = [];
    units.forEach((u, ui) =>
      u.questions.forEach((pq, qi) => {
        const v = answers[`${ui}-${qi}`];
        if (v === pq.answer) correct += 1;
        log.push({ u: u.unit.id, q: pq.qi, o: pq.options, c: v ?? -1 });
      })
    );
    stop();
    onFinish(correct, totalQ, log, Math.round((Date.now() - startedAt.current) / 1000));
  };

  // Hết giờ thì tự nộp bài
  useEffect(() => {
    if (timeUp) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeUp]);

  const submit = () => {
    if (exam) {
      const unanswered = totalQ - Object.keys(answers).length;
      if (unanswered > 0 && !window.confirm(`Còn ${unanswered} câu chưa trả lời. Bạn vẫn muốn nộp bài?`)) return;
    }
    finish();
  };

  const exit = () => {
    if (Object.keys(answers).length > 0 && !window.confirm('Thoát bài làm? Kết quả chưa nộp sẽ không được lưu.')) return;
    stop();
    onExit();
  };

  const isLast = uIdx + 1 >= units.length;
  const canNext = exam || done;
  const listenHint =
    part === 'p1' ? 'Nhìn bức tranh và nghe bốn câu mô tả A, B, C, D.' : part === 'p2' ? 'Bạn sẽ nghe một câu hỏi và ba câu trả lời A, B, C.' : 'Nghe rồi trả lời các câu hỏi bên dưới.';

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-24 lg:pb-10">
      <div className="sticky top-14 z-10 lg:top-16">
        <div className={`overflow-hidden rounded-2xl ${CARD}`}>
      <div className="flex items-center justify-between gap-3 bg-primary-50/70 px-5 py-4 dark:bg-slate-800/70 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 rounded-lg bg-primary-100 px-2.5 py-1 text-xs font-extrabold text-primary-700 dark:bg-primary-900/50 dark:text-primary-200">{badge}</span>
          <div className="min-w-0">
            <h2 id="quiz-title" className="truncate text-sm font-extrabold text-slate-900 dark:text-white sm:text-base">
              {title}
            </h2>
            <p className="truncate text-[11px] text-slate-500">
              Phần {uIdx + 1}/{units.length} • {partLabel(part)}
              {cur.unit.title ? ` • ${cur.unit.title}` : ''}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {timeLimit ? (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tabular-nums ${
                remaining <= 60
                  ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300'
                  : 'border-amber-200/80 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/60 dark:text-amber-300'
              }`}
              role="timer"
              aria-label={`Còn lại ${fmt(remaining)}`}
            >
              <Clock className="h-3.5 w-3.5" /> {fmt(remaining)}
            </span>
          ) : null}
          <button
            onClick={exit}
            aria-label="Thoát bài làm"
            title="Thoát bài làm"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-400 transition-colors hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="h-1 bg-primary-100 dark:bg-slate-800" role="progressbar" aria-valuemin={0} aria-valuemax={units.length} aria-valuenow={uIdx} aria-label="Tiến độ bài làm">
        <div className="h-full bg-primary-600 transition-all duration-500" style={{ width: `${(uIdx / units.length) * 100}%` }} />
      </div>
        </div>
      </div>

      <div className="space-y-5">
        {isListening && (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary-100 bg-primary-50 p-4 dark:border-slate-700 dark:bg-slate-800/90">
            <div className="flex items-center gap-3">
              <button
                onClick={() => (playing ? stop() : play(cur.speak!, gap))}
                aria-label={playing ? 'Dừng phát' : 'Nghe lại'}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-md shadow-primary-600/20 transition-transform hover:bg-primary-700 active:scale-95"
              >
                {playing ? <Timer className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <div>
                <p className="text-xs font-extrabold text-slate-900 dark:text-white">{playing ? 'Đang phát...' : 'Bấm nút Loa để nghe lại'}</p>
                <p className="text-[11px] text-slate-500">{listenHint}</p>
              </div>
            </div>
            {(part === 'p1' || part === 'p2') && (
              <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <input type="checkbox" checked={showText} onChange={(e) => toggleText(e.target.checked)} className="h-3.5 w-3.5 accent-primary-600" />
                Hiện chữ câu hỏi và đáp án
              </label>
            )}
          </div>
        )}

        {cur.unit.scene && (
          <div
            className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700"
            dangerouslySetInnerHTML={{ __html: sceneSvg(cur.unit.scene) }}
          />
        )}

        {cur.unit.passage && <Passage text={cur.unit.passage} />}

        {showText && part === 'p2' && cur.speak && (
          <p className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
            <span className="mr-2 text-xs font-semibold text-slate-500">Câu hỏi:</span>
            {cur.speak[0]}
          </p>
        )}

        <div className="space-y-6">
          {cur.questions.map((pq, qi) => (
            <QuestionBlock
              key={`${uIdx}-${qi}`}
              number={offset + qi + 1}
              unit={cur.unit}
              pq={pq}
              value={answers[`${uIdx}-${qi}`]}
              onPick={(i) => setAnswers((a) => ({ ...a, [`${uIdx}-${qi}`]: i }))}
              hideOptions={(part === 'p1' || part === 'p2') && !showText}
              hint={part === 'p1' ? 'Chọn câu mô tả đúng nhất bức tranh' : undefined}
              exam={exam}
            />
          ))}
        </div>

        {isListening && done && !exam && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <button onClick={() => setShowScript((v) => !v)} className="text-xs font-bold text-primary-700 dark:text-primary-300">
              {showScript ? 'Ẩn lời thoại' : 'Xem lời thoại (transcript)'}
            </button>
            {showScript && (
              <div className="mt-3 space-y-1.5 text-sm text-slate-800 dark:text-slate-200">
                {part === 'p1' || part === 'p2'
                  ? cur.speak!.map((t, i) => {
                      const start = part === 'p2' ? 1 : 0;
                      return (
                        <p key={i}>
                          <span className="mr-2 font-semibold text-slate-500">{i < start ? 'Q' : LETTERS[i - start]}</span>
                          {t}
                        </p>
                      );
                    })
                  : cur.unit.lines!.map((l, i) => (
                      <p key={i}>
                        {l.who && <span className="mr-2 font-semibold text-slate-500">{l.who}:</span>}
                        {l.text}
                      </p>
                    ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="sticky bottom-20 z-10 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 px-5 py-4 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 lg:bottom-4">
        {exam && uIdx > 0 ? (
          <button onClick={() => setUIdx(uIdx - 1)} className={BTN_GHOST}>
            Phần trước
          </button>
        ) : (
          <button onClick={exit} className="text-xs font-bold text-slate-500 transition-colors hover:text-slate-800 dark:hover:text-slate-200">
            Đóng cửa sổ
          </button>
        )}
        <button disabled={!canNext} onClick={() => (isLast ? submit() : setUIdx(uIdx + 1))} className={BTN_PRIMARY}>
          {!isLast ? 'Phần tiếp theo' : exam ? 'Nộp bài' : 'Xem kết quả'}
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ thiết lập thi thử tùy chỉnh (hộp thoại)
const PRESETS = [10, 20, 30, 40, 50, 100, 200];

const MODES = [
  { v: 'exam-timed', label: 'Thi thật (giới hạn giờ)', exam: true, timer: true },
  { v: 'exam', label: 'Thi thật (không bấm giờ)', exam: true, timer: false },
  { v: 'practice', label: 'Luyện tập (giải thích ngay)', exam: false, timer: false },
  { v: 'practice-timed', label: 'Luyện tập có bấm giờ', exam: false, timer: true },
] as const;

const FIELD =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100';

function MockSetup({ onStart, onClose }: { onStart: (cfg: MockConfig) => void; onClose: () => void }) {
  const [parts, setParts] = useState<PartKey[]>([...ORDER]);
  const [totalInput, setTotalInput] = useState(50);
  const [modeKey, setModeKey] = useState<(typeof MODES)[number]['v']>('exam-timed');
  const [minutesInput, setMinutesInput] = useState<number | null>(null);

  const bank = bankSize(parts);
  const options = useMemo(() => {
    const list = PRESETS.filter((n) => n < bank);
    return bank > 0 ? [...list, bank] : [];
  }, [bank]);
  const total = options.includes(totalInput) ? totalInput : options[options.length - 1] ?? 0;
  const mode = MODES.find((m) => m.v === modeKey)!;
  const minutes = minutesInput ?? autoMinutes(Math.max(total, 1));

  const toggle = (p: PartKey) => setParts((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));

  return (
    <Modal onClose={onClose} labelledBy="setup-title" size="max-w-lg">
      <div className="flex items-center justify-between border-b border-slate-200 bg-primary-50/70 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/60">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
            <SlidersHorizontal className="h-4 w-4" />
          </span>
          <div>
            <h2 id="setup-title" className="text-base font-extrabold text-slate-900 dark:text-white">
              Thiết lập đề Thi thử tùy chỉnh
            </h2>
            <p className="text-[11px] text-slate-500">Chọn các Part, số lượng câu và thời gian làm bài</p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-400 transition-colors hover:text-slate-700 dark:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-6">
        <fieldset>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <legend className="text-xs font-bold uppercase tracking-wider text-slate-500">1. Chọn các Part muốn luyện</legend>
            <span className="flex items-center gap-3 text-[11px] font-bold text-primary-700 dark:text-primary-300">
              <button onClick={() => setParts([...ORDER])} className="hover:underline">
                Chọn tất cả
              </button>
              <button onClick={() => setParts(['p1', 'p2', 'p3', 'p4'])} className="hover:underline">
                Chỉ nghe
              </button>
              <button onClick={() => setParts(['p5', 'p6', 'p7'])} className="hover:underline">
                Chỉ đọc
              </button>
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {PARTS.map((info) => (
              <label
                key={info.key}
                className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-2.5 transition-colors hover:bg-primary-50/60 dark:hover:bg-slate-800 ${
                  parts.includes(info.key) ? 'border-primary-300 bg-primary-50/50 dark:border-primary-700 dark:bg-primary-950/20' : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <input type="checkbox" checked={parts.includes(info.key)} onChange={() => toggle(info.key)} className="h-4 w-4 accent-primary-600" />
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">{info.title.replace(' · ', ' • ')}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="mock-count" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Số lượng câu hỏi
            </label>
            <select id="mock-count" value={total} disabled={options.length === 0} onChange={(e) => setTotalInput(Number(e.target.value))} className={FIELD}>
              {options.map((n) => (
                <option key={n} value={n}>
                  {n === bank && !PRESETS.includes(n) ? `Tất cả (${n} câu)` : n === bank ? `${n} câu (tất cả)` : `${n} câu (~${autoMinutes(n)} phút)`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="mock-mode" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
              3. Chế độ làm bài
            </label>
            <select id="mock-mode" value={modeKey} onChange={(e) => setModeKey(e.target.value as (typeof MODES)[number]['v'])} className={FIELD}>
              {MODES.map((m) => (
                <option key={m.v} value={m.v}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="-mt-2 text-[11px] leading-relaxed text-slate-500">
          {mode.exam ? 'Thi thật: không hiện đúng sai sau mỗi câu, được đổi đáp án, chấm điểm và xem giải thích sau khi nộp bài.' : 'Luyện tập: hiện đúng sai và giải thích ngay sau mỗi câu.'} Mỗi đoạn nghe hoặc đọc có 3 đến 4 câu hỏi, nên số câu thực tế có thể lệch vài câu so với số bạn chọn.
        </p>

        {mode.timer && (
          <label className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
            Thời gian làm bài (phút):
            <input
              type="number"
              min={1}
              max={240}
              value={minutes}
              onChange={(e) => setMinutesInput(Math.max(1, Number(e.target.value) || 1))}
              className="w-24 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>
        )}
      </div>

      <div className="flex items-center justify-end gap-2.5 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
        {parts.length === 0 && <span className="mr-auto text-xs text-slate-500">Hãy chọn ít nhất một Part.</span>}
        <button onClick={onClose} className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
          Hủy
        </button>
        <button
          disabled={parts.length === 0 || total === 0}
          onClick={() => onStart({ parts, total, timer: mode.timer, minutes, exam: mode.exam })}
          className={`${BTN_PRIMARY} flex items-center gap-2`}
        >
          <Play className="h-3 w-3 fill-current" /> Tạo đề & Bắt đầu làm
        </button>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ trang chính
const PART_ICON: Record<PartKey, React.ComponentType<{ className?: string }>> = {
  p1: ImageIcon,
  p2: MessageCircle,
  p3: Users,
  p4: Megaphone,
  p5: PenLine,
  p6: FileText,
  p7: BookOpen,
};

type SkillFilter = 'all' | 'listening' | 'reading';
const FILTERS: { key: SkillFilter; label: string; icon?: React.ComponentType<{ className?: string }>; tone?: string }[] = [
  { key: 'all', label: 'Tất cả (7 Parts)' },
  { key: 'listening', label: 'Listening (Part 1–4)', icon: Headphones, tone: 'text-sky-500' },
  { key: 'reading', label: 'Reading (Part 5–7)', icon: BookOpen, tone: 'text-purple-500' },
];

function ScoreTile({ label, value, sub, valueTone, subTone, title }: { label: string; value: React.ReactNode; sub: string; valueTone: string; subTone: string; title?: string }) {
  return (
    <div className="rounded-2xl border border-primary-100 bg-primary-50 px-3.5 py-3 text-center dark:border-slate-700/70 dark:bg-slate-800/70" title={title}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-0.5 text-lg font-extrabold tabular-nums sm:text-xl ${valueTone}`}>{value}</p>
      <span className={`mt-1 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold ${subTone}`}>{sub}</span>
    </div>
  );
}

function Hub({ progress, onStart, onSetup, onReview }: { progress: ToeicProgress; onStart: (key: PartKey | 'mix') => void; onSetup: () => void; onReview: () => void }) {
  const [filter, setFilter] = useState<SkillFilter>('all');
  const [tips, setTips] = useState<boolean>(() => {
    try {
      return localStorage.getItem('flex_toeic_tips') !== '0';
    } catch {
      return true;
    }
  });
  const setTipsSaved = (v: boolean) => {
    setTips(v);
    try {
      localStorage.setItem('flex_toeic_tips', v ? '1' : '0');
    } catch {
      // ignore
    }
  };

  const stats = computeToeicStats();
  const sum = summarize(stats);
  const wrongBank = Object.values(loadReview().wrong).filter((w) => resolveLog(w)).length;
  const rec = (k: string) => progress[k];
  const shown = PARTS.filter((p) => filter === 'all' || (filter === 'listening') === (p.skill === 'Nghe'));

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-10">
      <PageHeader
        icon={ClipboardCheck}
        title="Kiểm tra TOEIC"
        eyebrow={{ icon: GraduationCap, text: 'Luyện đề theo cấu trúc TOEIC' }}
        description={
          <>
            Luyện từng Part (1 đến 7) theo dạng đề <strong>Listening</strong> và <strong>Reading</strong>, hoặc tự chọn Part và số câu để thi thử có bấm giờ. Phần nghe dùng giọng đọc của thiết bị (chỉnh ở mục &quot;Giọng đọc&quot;). Đề do Flex Learn soạn theo dạng bài TOEIC, không phải đề thi thật.
          </>
        }
        aside={
          <div className="grid shrink-0 grid-cols-3 gap-2.5 sm:gap-3">
            <ScoreTile
              label="Điểm ước tính"
              title="Ước tính thô từ tỉ lệ đúng của các câu đã làm (cần ít nhất 10 câu mỗi kỹ năng), không phải điểm thi thật."
              value={
                <>
                  {sum.score ?? '--'}
                  <span className="text-xs font-semibold text-slate-500">/990</span>
                </>
              }
              valueTone="text-primary-700 dark:text-primary-300"
              sub={sum.score === null ? 'Làm thêm để ước tính' : sum.score >= TARGET_SCORE ? 'Đã đạt mục tiêu' : `Mục tiêu: ${TARGET_SCORE}+`}
              subTone={sum.score !== null && sum.score >= TARGET_SCORE ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-300'}
            />
            <ScoreTile
              label="Listening"
              value={sum.listening.accuracy === null ? '--' : `${sum.listening.accuracy}%`}
              valueTone="text-sky-600 dark:text-sky-400"
              sub={sum.listening.done > 0 ? `${sum.listening.done} câu đã làm` : 'Chưa làm bài'}
              subTone="text-slate-500 dark:text-slate-400"
            />
            <ScoreTile
              label="Reading"
              value={sum.reading.accuracy === null ? '--' : `${sum.reading.accuracy}%`}
              valueTone="text-purple-600 dark:text-purple-400"
              sub={sum.reading.done > 0 ? `${sum.reading.done} câu đã làm` : 'Chưa làm bài'}
              subTone="text-slate-500 dark:text-slate-400"
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <button
          onClick={() => onStart('mix')}
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-600 to-[#705ceb] p-5 text-left text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:from-primary-600 dark:via-primary-600 dark:to-primary-500"
        >
          <span className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-white/10" aria-hidden="true" />
          <span className="block">
            <span className="mb-3 flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Zap className="h-4 w-4" />
              </span>
              <span className="rounded-full bg-amber-300 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-900">Khuyên dùng</span>
            </span>
            <span className="block text-base font-bold leading-snug">Thi thử mini (khoảng 24 câu)</span>
            <span className="mt-1 block text-xs leading-relaxed text-purple-100">Trộn đủ 7 dạng bài chuẩn tỉ lệ, phần Nghe trước Đọc sau giúp đánh giá nhanh trình độ.</span>
            {rec('mix') && <span className="mt-2 block text-[11px] font-semibold text-amber-200">Cao nhất {rec('mix').best}% • {rec('mix').attempts} lượt</span>}
          </span>
          <span className="mt-4 flex items-center justify-between border-t border-white/15 pt-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-purple-100">
              <Clock className="h-3.5 w-3.5" /> ~{autoMinutes(24)} phút
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1 text-primary-700 shadow-sm transition-transform group-hover:translate-x-0.5">
              Bắt đầu thi <Play className="h-2.5 w-2.5 fill-current" />
            </span>
          </span>
        </button>

        <button
          onClick={onSetup}
          className="group flex flex-col justify-between rounded-2xl border border-primary-200 bg-primary-100/75 p-5 text-left shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-100 hover:shadow-card-hover dark:border-primary-800/60 dark:bg-primary-950/40 dark:hover:bg-primary-950/60"
        >
          <span className="block">
            <span className="mb-3 flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
                <SlidersHorizontal className="h-4 w-4" />
              </span>
              <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-bold text-primary-700 dark:bg-slate-800 dark:text-primary-300">Tự chọn Part</span>
            </span>
            <span className="block text-base font-bold leading-snug text-slate-900 dark:text-white">Thi thử tùy chỉnh</span>
            <span className="mt-1 block text-xs leading-relaxed text-slate-600 dark:text-slate-300">Chọn Part, số câu, bấm giờ và chế độ thi thật hoặc luyện tập xem đáp án ngay.</span>
            {rec('custom') && <span className="mt-2 block text-[11px] font-semibold text-primary-700 dark:text-primary-300">Cao nhất {rec('custom').best}% • {rec('custom').attempts} lượt</span>}
          </span>
          <span className="mt-4 flex items-center justify-between border-t border-primary-200/70 pt-3 text-xs font-bold text-primary-700 dark:border-primary-800/50 dark:text-primary-300">
            <span>Tùy chỉnh Part 1–7</span>
            <span className="inline-flex items-center gap-1 transition-transform group-hover:translate-x-1">
              Thiết lập đề <ChevronRight className="h-3 w-3" />
            </span>
          </span>
        </button>

        <button
          onClick={onReview}
          className="group flex flex-col justify-between rounded-2xl border border-amber-200/90 bg-amber-50 p-5 text-left shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-100/70 hover:shadow-card-hover dark:border-amber-800/60 dark:bg-amber-950/30 dark:hover:bg-amber-950/50"
        >
          <span className="block">
            <span className="mb-3 flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
                <ClipboardList className="h-4 w-4" />
              </span>
              <span className="rounded-full bg-amber-200/80 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-900 dark:bg-amber-900/80 dark:text-amber-200">
                {wrongBank > 0 ? `${wrongBank} câu cần ôn` : '0 câu sai'}
              </span>
            </span>
            <span className="block text-base font-bold leading-snug text-amber-950 dark:text-amber-200">Ôn tập câu sai</span>
            <span className="mt-1 block text-xs leading-relaxed text-amber-900/80 dark:text-amber-300/80">Xem lại câu đã sai kèm giải thích chi tiết, luyện lại câu sai, mở lại các bài đã làm.</span>
          </span>
          <span className="mt-4 flex items-center justify-between border-t border-amber-200/70 pt-3 text-xs font-bold text-amber-800 dark:border-amber-800/50 dark:text-amber-300">
            <span>{wrongBank > 0 ? `Đã lưu ${wrongBank} câu hay bẫy` : 'Chưa có câu sai nào được lưu'}</span>
            <span className="inline-flex items-center gap-1 transition-transform group-hover:translate-x-1">
              Mở sổ ôn <ChevronRight className="h-3 w-3" />
            </span>
          </span>
        </button>
      </div>

      <div className="flex flex-col justify-between gap-3 pt-1 sm:flex-row sm:items-center">
        <div role="group" aria-label="Lọc theo kỹ năng" className={`flex w-fit flex-wrap items-center gap-1.5 rounded-2xl p-1.5 ${CARD} shadow-sm`}>
          {FILTERS.map(({ key, label, icon: Icon, tone }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs transition-all ${
                filter === key ? 'bg-primary-100 font-bold text-slate-900 dark:bg-primary-950/70 dark:text-white' : 'font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {Icon && <Icon className={`h-3.5 w-3.5 ${tone ?? ''}`} />}
              {label}
            </button>
          ))}
        </div>
        <label className={`inline-flex cursor-pointer select-none items-center gap-2 rounded-xl px-3.5 py-2 text-xs ${CARD} shadow-sm`}>
          <input type="checkbox" checked={tips} onChange={(e) => setTipsSaved(e.target.checked)} className="h-3.5 w-3.5 accent-primary-600" />
          <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
            Hiển thị mẹo làm bài (Tips)
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {shown.map((p) => {
          const st = stats[p.key];
          const r = rec(p.key);
          const Icon = PART_ICON[p.key];
          const listening = p.skill === 'Nghe';
          const pct = st.total > 0 ? Math.min(100, Math.round((st.done / st.total) * 100)) : 0;
          return (
            <button
              key={p.key}
              onClick={() => onStart(p.key)}
              className={`group flex flex-col justify-between rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-400 hover:shadow-card-hover ${CARD}`}
            >
              <span className="block">
                <span className="mb-3.5 flex items-center justify-between gap-2">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${
                      listening ? 'bg-primary-100 text-primary-600 dark:bg-primary-950/80 dark:text-primary-300' : 'bg-purple-100 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex items-center gap-1.5">
                    {st.accuracy !== null && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">Đúng {st.accuracy}%</span>
                    )}
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                        listening ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300' : 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                      }`}
                    >
                      {p.skill} • {questionCount(p.key)} câu
                    </span>
                  </span>
                </span>
                <span className="block text-base font-extrabold text-slate-900 transition-colors group-hover:text-primary-700 dark:text-white dark:group-hover:text-primary-300">{p.title.replace(' · ', ' • ')}</span>
                <span className="mt-1.5 block text-xs leading-relaxed text-slate-500 dark:text-slate-400">{p.desc}</span>
                {tips && (
                  <span className="mt-3.5 flex items-start gap-2 rounded-xl border border-amber-200/75 bg-[#FFFDF4] p-3 text-[11.5px] leading-relaxed text-amber-950/90 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-200/90">
                    <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                    <span>
                      <strong className="font-bold text-amber-900 dark:text-amber-300">Mẹo:</strong> {p.tip}
                    </span>
                  </span>
                )}
              </span>
              <span className="mt-4 block space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                <span
                  className="block h-1.5 w-full overflow-hidden rounded-full bg-primary-100 dark:bg-slate-800"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={st.total}
                  aria-valuenow={st.done}
                  aria-label={`Đã làm ${st.done} trên ${st.total} câu`}
                >
                  <span className="block h-full rounded-full bg-primary-600 transition-all duration-500" style={{ width: `${pct}%` }} />
                </span>
                <span className="flex items-center justify-between">
                  <span className={`text-[11px] font-semibold ${st.done > 0 || r ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500'}`}>
                    {st.done > 0 ? `Đã làm ${st.done}/${st.total} câu` : 'Chưa làm lần nào'}
                    {r ? ` • cao nhất ${r.best}%` : ''}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-2.5 py-1 text-[11px] font-bold text-primary-700 transition-all group-hover:bg-primary-600 group-hover:text-white dark:bg-slate-800 dark:text-primary-300">
                    Luyện ngay <Play className="h-2.5 w-2.5 fill-current" />
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ màn hình chính
type Key = PartKey | 'mix' | 'custom' | 'review';
type Screen =
  | { kind: 'hub' }
  | { kind: 'setup' }
  | { kind: 'review' }
  | { kind: 'session'; key: Key; units: PUnit[]; cfg?: MockConfig }
  | { kind: 'result'; key: Key; correct: number; total: number; log: AnswerLog[]; elapsed: number; cfg?: MockConfig };

const badgeOfKey = (key: Key) => (key === 'mix' ? 'Mini Test' : key === 'custom' ? 'Tùy chỉnh' : key === 'review' ? 'Ôn tập' : partLabel(key));

export function TestView() {
  const [screen, setScreen] = useState<Screen>({ kind: 'hub' });
  const [progress, setProgress] = useState<ToeicProgress>(loadToeicProgress);

  // Điểm vừa được gộp từ cloud (hoặc xóa khi đăng xuất): đọc lại từ máy.
  useEffect(() => {
    const reload = () => setProgress(loadToeicProgress());
    window.addEventListener(TOEIC_CHANGED_EVENT, reload);
    return () => window.removeEventListener(TOEIC_CHANGED_EVENT, reload);
  }, []);

  const start = (key: PartKey | 'mix') => {
    setScreen({ kind: 'session', key, units: buildSession(key) });
  };

  const startCustom = (cfg: MockConfig) => {
    setScreen({ kind: 'session', key: 'custom', units: buildCustom(cfg.parts, cfg.total), cfg });
  };

  /** Luyện lại các câu đã sai (nhận danh sách, hoặc tự lấy từ ngân hàng câu sai). */
  const startReview = (entries?: WrongEntry[]) => {
    const list =
      entries ??
      Object.values(loadReview().wrong)
        .filter((w) => resolveLog(w))
        .sort((a, b) => b.times - a.times)
        .slice(0, 30);
    const units = buildReview(list);
    if (units.length === 0) {
      setScreen({ kind: 'review' });
      return;
    }
    window.scrollTo({ top: 0 });
    setScreen({ kind: 'session', key: 'review', units });
  };

  const goHub = () => setScreen({ kind: 'hub' });
  const hub = <Hub progress={progress} onStart={start} onSetup={() => setScreen({ kind: 'setup' })} onReview={() => setScreen({ kind: 'review' })} />;

  if (screen.kind === 'setup') {
    return (
      <>
        {hub}
        <MockSetup onStart={startCustom} onClose={goHub} />
      </>
    );
  }

  if (screen.kind === 'review') {
    return <ReviewHub onBack={goHub} onPractice={startReview} />;
  }

  if (screen.kind === 'session') {
    const { cfg } = screen;
    return (
      <>
        <Session
          key={screen.units.map((u) => u.unit.id).join('|')}
          units={screen.units}
          exam={cfg?.exam}
          timeLimit={cfg?.timer ? cfg.minutes * 60 : undefined}
          badge={badgeOfKey(screen.key)}
          title={titleOfKey(screen.key)}
          onExit={() => setScreen(screen.key === 'review' ? { kind: 'review' } : cfg ? { kind: 'setup' } : { kind: 'hub' })}
          onFinish={(correct, total, log, elapsed) => {
            // Lượt luyện lại câu sai không tính vào điểm các Part
            if (screen.key !== 'review') setProgress(recordToeicResult(screen.key, Math.round((correct / total) * 100)));
            recordSession({ key: screen.key, title: titleOfKey(screen.key), correct, total, items: log }, (a) => resolveLog(a)?.ok ?? false);
            recordAnswers(log);
            window.scrollTo({ top: 0 });
            setScreen({ kind: 'result', key: screen.key, correct, total, log, elapsed, cfg });
          }}
        />
      </>
    );
  }

  if (screen.kind === 'result') {
    const pct = Math.round((screen.correct / screen.total) * 100);
    const title = titleOfKey(screen.key);
    const wrongCount = screen.total - screen.correct;
    const hasWrongBank = Object.keys(loadReview().wrong).length > 0;
    return (
      <div className="mx-auto max-w-3xl space-y-5 pb-10">
        <div className={`rounded-3xl px-6 py-10 text-center ${CARD}`}>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/40">
            <Trophy className="h-7 w-7 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">{pct}%</h2>
          <p className="mt-2 text-base font-semibold text-slate-700 dark:text-slate-300">
            {title}: đúng {screen.correct}/{screen.total} câu
          </p>
          {screen.cfg?.timer && (
            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <Clock className="h-4 w-4" /> Thời gian làm bài: {fmt(screen.elapsed)} / {screen.cfg.minutes}:00
            </p>
          )}
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {pct >= 80 ? 'Rất tốt, bạn nắm khá chắc dạng bài này.' : pct >= 60 ? 'Khá ổn, hãy xem lại các câu sai bên dưới.' : 'Cần luyện thêm, xem kỹ phần giải thích rồi làm lại.'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {screen.key === 'review' ? (
              hasWrongBank && (
                <button onClick={() => startReview()} className={`${BTN_PRIMARY} flex items-center gap-2`}>
                  <RotateCcw className="h-4 w-4" /> Luyện tiếp câu sai
                </button>
              )
            ) : (
              <button onClick={() => (screen.cfg ? startCustom(screen.cfg) : start(screen.key as PartKey | 'mix'))} className={`${BTN_PRIMARY} flex items-center gap-2`}>
                <RotateCcw className="h-4 w-4" /> Làm đề khác
              </button>
            )}
            <button onClick={() => setScreen({ kind: 'review' })} className={`${BTN_GHOST} flex items-center gap-2`}>
              <ClipboardList className="h-4 w-4" /> Mở mục Ôn tập
            </button>
            {screen.cfg && (
              <button onClick={() => setScreen({ kind: 'setup' })} className={BTN_GHOST}>
                Đổi cấu hình
              </button>
            )}
            <button onClick={goHub} className={BTN_GHOST}>
              Về danh sách
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="px-1 text-base font-bold text-slate-900 dark:text-white">Xem lại bài làm</h3>
          <p className="px-1 text-xs text-slate-500 dark:text-slate-400">
            Xem từng câu: đáp án bạn chọn, đáp án đúng, vì sao đúng và vì sao các đáp án khác sai. Bài này đã được lưu trong mục Ôn tập{wrongCount > 0 ? `, ${wrongCount} câu sai nằm trong danh sách câu cần ôn.` : '.'}
          </p>
          <ReviewList items={screen.log} initialFilter={wrongCount > 0 ? 'wrong' : 'all'} />
        </div>
      </div>
    );
  }

  return hub;
}
