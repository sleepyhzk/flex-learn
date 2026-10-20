import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle2, ClipboardCheck, ClipboardList, Clock, Headphones, Play, RotateCcw, SlidersHorizontal, Timer, Trophy, XCircle } from 'lucide-react';
import { PARTS, TOEIC_UNITS, questionCount } from '@/data/toeicData';
import type { PartKey, Unit } from '@/data/toeicData';
import { sceneSvg } from '@/data/toeicScenes';
import { shuffle } from '@/lib/dictItems';
import { ORDER, autoMinutes, bankSize, buildCustomUnits } from '@/lib/toeicMock';
import type { MockConfig } from '@/lib/toeicMock';
import { explainOptions, resolveLog, speakTexts, UNIT_BY_ID } from '@/lib/toeicExplain';
import { recordSession, loadReview } from '@/lib/toeicReview';
import type { AnswerLog, WrongEntry } from '@/lib/toeicReview';
import { LETTERS, partLabel, useSequencePlayer } from '@/lib/toeicUi';
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

const pick = (part: PartKey, n: number): Unit[] => shuffle(TOEIC_UNITS[part]).slice(0, n);

const MIX: [PartKey, number][] = [['p1', 2], ['p2', 4], ['p3', 1], ['p4', 1], ['p5', 4], ['p6', 1], ['p7', 1]];

function buildSession(key: PartKey | 'mix'): PUnit[] {
  if (key === 'mix') return MIX.flatMap(([p, n]) => pick(p, n)).map((u) => prepare(u));
  const info = PARTS.find((p) => p.key === key)!;
  return pick(key, info.perSession).map((u) => prepare(u));
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
const PICKED = 'border-primary-500 bg-primary-100 text-primary-900 dark:border-primary-400 dark:bg-primary-900/40 dark:text-primary-100';
const IDLE = 'border-slate-200 bg-white text-slate-800 hover:border-primary-300 hover:bg-primary-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800';

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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      {pq.prompt && (
        <p className="mb-3 text-[17px] font-medium text-slate-900 dark:text-slate-100">
          <span className="mr-2 text-primary-700 dark:text-primary-300">{number}.</span>
          {pq.prompt}
        </p>
      )}
      {!pq.prompt && <p className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Câu {number}: {hint ?? 'chọn câu trả lời phù hợp nhất'}</p>}
      {hideOptions && !reveal ? (
        <div className="flex gap-3">
          {pq.options.map((_, i) => (
            <button
              key={i}
              onClick={() => onPick(i)}
              className={`h-12 flex-1 rounded-xl border text-lg font-semibold transition-colors ${value === i ? PICKED : IDLE}`}
            >
              {LETTERS[i]}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {pq.options.map((opt, i) => {
            let cls = value === i ? PICKED : IDLE;
            if (reveal) {
              if (i === pq.answer) cls = 'border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-100';
              else if (i === value) cls = 'border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-600 dark:bg-rose-950/40 dark:text-rose-100';
              else cls = 'border-slate-200 bg-white text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500';
            }
            return (
              <button
                key={i}
                disabled={reveal}
                onClick={() => onPick(i)}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-[15px] transition-colors ${cls}`}
              >
                <span className="font-semibold">{LETTERS[i]}.</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      )}
      {reveal && (
        <>
          <p className={`mt-3 flex items-center gap-1.5 text-sm font-semibold ${correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
            {correct ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {correct ? 'Chính xác!' : `Chưa đúng, đáp án đúng là ${LETTERS[pq.answer]}`}
          </p>
          <ExplainPanel options={pq.options} answer={pq.answer} why={pq.why} notes={explainOptions(unit, pq.qi, pq.options)} chosen={value} />
        </>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ một lượt làm bài
function Session({
  units,
  exam,
  timeLimit,
  onExit,
  onFinish,
}: {
  units: PUnit[];
  exam?: boolean;
  /** Giới hạn thời gian, tính bằng giây. */
  timeLimit?: number;
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

  const isLast = uIdx + 1 >= units.length;
  const canNext = exam || done;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => {
            stop();
            onExit();
          }}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-primary-100/60 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" /> Thoát
        </button>
        <div className="flex items-center gap-3">
          {timeLimit ? (
            <span
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-sm font-semibold ${remaining <= 60 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}
            >
              <Clock className="h-4 w-4" /> {fmt(remaining)}
            </span>
          ) : null}
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            {partLabel(part)} · {cur.unit.title ? `${cur.unit.title} · ` : ''}
            phần {uIdx + 1}/{units.length}
          </p>
        </div>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full rounded-full bg-primary-600 transition-all" style={{ width: `${(uIdx / units.length) * 100}%` }} />
      </div>

      {isListening && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <button
            onClick={() => (playing ? stop() : play(cur.speak!, gap))}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            {playing ? <Timer className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? 'Dừng' : 'Nghe lại'}
          </button>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {part === 'p1' ? 'Nhìn bức tranh và nghe bốn câu mô tả A, B, C, D.' : part === 'p2' ? 'Bạn sẽ nghe một câu hỏi và ba câu trả lời A, B, C.' : 'Nghe rồi trả lời các câu hỏi bên dưới.'}
          </p>
          {(part === 'p1' || part === 'p2') && (
            <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <input type="checkbox" checked={showText} onChange={(e) => toggleText(e.target.checked)} className="h-4 w-4 accent-primary-600" />
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
        <p className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-[17px] font-medium text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
          <span className="mr-2 text-sm font-semibold text-slate-500">Câu hỏi:</span>
          {cur.speak[0]}
        </p>
      )}

      <div className="space-y-4">
        {cur.questions.map((pq, qi) => (
          <QuestionBlock
            key={`${uIdx}-${qi}`}
            number={offset + qi + 1}
            unit={cur.unit}
            pq={pq}
            value={answers[`${uIdx}-${qi}`]}
            onPick={(i) => setAnswers((a) => ({ ...a, [`${uIdx}-${qi}`]: i }))}
            hideOptions={(part === 'p1' || part === 'p2') && !showText}
            hint={part === 'p1' ? 'chọn câu mô tả đúng nhất bức tranh' : undefined}
            exam={exam}
          />
        ))}
      </div>

      {isListening && done && !exam && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <button onClick={() => setShowScript((v) => !v)} className="text-sm font-semibold text-primary-700 dark:text-primary-300">
            {showScript ? 'Ẩn lời thoại' : 'Xem lời thoại (transcript)'}
          </button>
          {showScript && (
            <div className="mt-3 space-y-1.5 text-[15px] text-slate-800 dark:text-slate-200">
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

      <div className="flex items-center justify-between gap-3">
        {exam && uIdx > 0 ? (
          <button
            onClick={() => setUIdx(uIdx - 1)}
            className="rounded-xl border border-slate-300 px-5 py-3 text-[15px] font-semibold text-slate-700 hover:bg-primary-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Phần trước
          </button>
        ) : (
          <span />
        )}
        <button
          disabled={!canNext}
          onClick={() => (isLast ? submit() : setUIdx(uIdx + 1))}
          className="rounded-xl bg-primary-600 px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
        >
          {!isLast ? 'Phần tiếp theo' : exam ? 'Nộp bài' : 'Xem kết quả'}
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ cấu hình thi thử
const PRESETS = [10, 20, 50, 100, 200];

function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-4 w-4 accent-primary-600" />
      <span>
        <span className="block text-[15px] font-semibold text-slate-900 dark:text-slate-100">{label}</span>
        {hint && <span className="block text-sm text-slate-500 dark:text-slate-400">{hint}</span>}
      </span>
    </label>
  );
}

function MockSetup({ onStart, onBack }: { onStart: (cfg: MockConfig) => void; onBack: () => void }) {
  const [parts, setParts] = useState<PartKey[]>([...ORDER]);
  const [totalInput, setTotalInput] = useState(50);
  const [timer, setTimer] = useState(true);
  const [exam, setExam] = useState(true);
  const [minutesInput, setMinutesInput] = useState<number | null>(null);

  const bank = bankSize(parts);
  const total = Math.max(1, Math.min(totalInput || 1, Math.max(bank, 1)));
  const minutes = minutesInput ?? autoMinutes(total);

  const toggle = (p: PartKey) => setParts((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));
  const setListening = () => setParts(['p1', 'p2', 'p3', 'p4']);
  const setReading = () => setParts(['p5', 'p6', 'p7']);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-primary-100/60 dark:text-slate-300 dark:hover:bg-slate-800">
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </button>
      </div>
      <header>
        <h1 className="flex items-center gap-3 font-display text-3xl font-semibold text-slate-900 dark:text-slate-100">
          <SlidersHorizontal className="h-8 w-8 text-primary-600 dark:text-primary-300" /> Thi thử tùy chỉnh
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-slate-600 dark:text-slate-300">Chọn các Part muốn thi và số câu. Đề được rút ngẫu nhiên từ ngân hàng, xếp nghe trước đọc sau.</p>
      </header>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-100">1. Chọn Part</h2>
          <div className="flex flex-wrap gap-2 text-sm">
            {[['Tất cả', () => setParts([...ORDER])], ['Chỉ phần nghe', setListening], ['Chỉ phần đọc', setReading], ['Bỏ chọn', () => setParts([])]].map(([label, fn]) => (
              <button key={label as string} onClick={fn as () => void} className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-primary-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                {label as string}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {ORDER.map((key) => {
            const info = PARTS.find((p) => p.key === key)!;
            const on = parts.includes(key);
            const Icon = info.skill === 'Nghe' ? Headphones : BookOpen;
            return (
              <button
                key={key}
                onClick={() => toggle(key)}
                aria-pressed={on}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${on ? PICKED : 'border-slate-200 bg-white text-slate-500 hover:border-primary-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'}`}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${on ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-[15px] font-semibold">{info.title}</span>
                  <span className="block text-xs">{info.skill} · có {questionCount(key)} câu trong ngân hàng</span>
                </span>
                {on && <CheckCircle2 className="h-5 w-5 text-primary-600 dark:text-primary-300" />}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-100">2. Số câu</h2>
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((n) => (
            <button
              key={n}
              disabled={n > bank}
              onClick={() => setTotalInput(n)}
              className={`rounded-xl border px-4 py-2 text-[15px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${total === n ? PICKED : IDLE}`}
            >
              {n}
            </button>
          ))}
          <button
            disabled={bank === 0}
            onClick={() => setTotalInput(bank)}
            className={`rounded-xl border px-4 py-2 text-[15px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${total === bank && bank > 0 ? PICKED : IDLE}`}
          >
            Tất cả ({bank})
          </button>
          <label className="ml-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            Hoặc nhập:
            <input
              type="number"
              min={1}
              max={Math.max(bank, 1)}
              value={totalInput}
              onChange={(e) => setTotalInput(Number(e.target.value))}
              className="w-24 rounded-xl border border-slate-300 bg-white px-3 py-2 text-[15px] text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Tối đa {bank} câu với các Part đã chọn. Mỗi đoạn nghe hoặc đọc có 3 đến 4 câu hỏi, nên số câu thực tế có thể ít hơn vài câu so với số bạn chọn.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-100">3. Tùy chọn</h2>
        <Toggle checked={exam} onChange={setExam} label="Chế độ thi thật" hint="Không hiện đúng sai sau mỗi câu, được đổi đáp án, chấm điểm và xem giải thích sau khi nộp bài." />
        <Toggle checked={timer} onChange={setTimer} label="Bấm giờ" hint="Hết giờ bài sẽ tự nộp. Mặc định tính theo tỉ lệ đề thật: 200 câu trong 120 phút." />
        {timer && (
          <label className="flex items-center gap-3 pl-1 text-sm text-slate-600 dark:text-slate-300">
            Thời gian làm bài (phút):
            <input
              type="number"
              min={1}
              max={240}
              value={minutes}
              onChange={(e) => setMinutesInput(Math.max(1, Number(e.target.value) || 1))}
              className="w-24 rounded-xl border border-slate-300 bg-white px-3 py-2 text-[15px] text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>
        )}
      </section>

      <div className="sticky bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
        <p className="text-sm text-slate-700 dark:text-slate-200">
          {parts.length === 0 ? 'Hãy chọn ít nhất một Part.' : `${parts.length} Part · khoảng ${total} câu${timer ? ` · ${minutes} phút` : ''} · ${exam ? 'chế độ thi thật' : 'xem đáp án từng câu'}`}
        </p>
        <button
          disabled={parts.length === 0}
          onClick={() => onStart({ parts, total, timer, minutes, exam })}
          className="rounded-xl bg-primary-600 px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
        >
          Bắt đầu thi
        </button>
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
    window.scrollTo({ top: 0 });
    setScreen({ kind: 'session', key, units: buildSession(key) });
  };

  const startCustom = (cfg: MockConfig) => {
    window.scrollTo({ top: 0 });
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

  if (screen.kind === 'setup') {
    return <MockSetup onStart={startCustom} onBack={() => setScreen({ kind: 'hub' })} />;
  }

  if (screen.kind === 'review') {
    return <ReviewHub onBack={() => setScreen({ kind: 'hub' })} onPractice={startReview} />;
  }

  if (screen.kind === 'session') {
    const { cfg } = screen;
    return (
      <Session
        key={screen.units.map((u) => u.unit.id).join('|')}
        units={screen.units}
        exam={cfg?.exam}
        timeLimit={cfg?.timer ? cfg.minutes * 60 : undefined}
        onExit={() => setScreen(screen.key === 'review' ? { kind: 'review' } : cfg ? { kind: 'setup' } : { kind: 'hub' })}
        onFinish={(correct, total, log, elapsed) => {
          // Lượt luyện lại câu sai không tính vào điểm các Part
          if (screen.key !== 'review') setProgress(recordToeicResult(screen.key, Math.round((correct / total) * 100)));
          recordSession({ key: screen.key, title: titleOfKey(screen.key), correct, total, items: log }, (a) => resolveLog(a)?.ok ?? false);
          window.scrollTo({ top: 0 });
          setScreen({ kind: 'result', key: screen.key, correct, total, log, elapsed, cfg });
        }}
      />
    );
  }

  if (screen.kind === 'result') {
    const pct = Math.round((screen.correct / screen.total) * 100);
    const title = titleOfKey(screen.key);
    const wrongCount = screen.total - screen.correct;
    const hasWrongBank = Object.keys(loadReview().wrong).length > 0;
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-100 dark:bg-accent-950/40">
            <Trophy className="h-7 w-7 text-accent-600 dark:text-accent-400" />
          </div>
          <h3 className="font-display text-3xl font-semibold text-slate-900 dark:text-slate-100">{pct}%</h3>
          <p className="mt-2 text-lg text-slate-700 dark:text-slate-300">
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
                <button onClick={() => startReview()} className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-[15px] font-semibold text-white hover:bg-primary-700">
                  <RotateCcw className="h-4 w-4" /> Luyện tiếp câu sai
                </button>
              )
            ) : (
              <button
                onClick={() => (screen.cfg ? startCustom(screen.cfg) : start(screen.key as PartKey | 'mix'))}
                className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-[15px] font-semibold text-white hover:bg-primary-700"
              >
                <RotateCcw className="h-4 w-4" /> Làm đề khác
              </button>
            )}
            <button onClick={() => setScreen({ kind: 'review' })} className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-[15px] font-semibold text-slate-700 hover:bg-primary-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              <ClipboardList className="h-4 w-4" /> Mở mục Ôn tập
            </button>
            {screen.cfg && (
              <button onClick={() => setScreen({ kind: 'setup' })} className="rounded-xl border border-slate-300 px-5 py-3 text-[15px] font-semibold text-slate-700 hover:bg-primary-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                Đổi cấu hình
              </button>
            )}
            <button onClick={() => setScreen({ kind: 'hub' })} className="rounded-xl border border-slate-300 px-5 py-3 text-[15px] font-semibold text-slate-700 hover:bg-primary-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              Về danh sách
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-100">Xem lại bài làm</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Xem từng câu: đáp án bạn chọn, đáp án đúng, vì sao đúng và vì sao các đáp án khác sai. Bài này đã được lưu trong mục Ôn tập{wrongCount > 0 ? `, ${wrongCount} câu sai nằm trong danh sách câu cần ôn.` : '.'}
          </p>
          <ReviewList items={screen.log} initialFilter={wrongCount > 0 ? 'wrong' : 'all'} />
        </div>
      </div>
    );
  }

  const rec = (k: string) => progress[k];
  const wrongBank = Object.values(loadReview().wrong).filter((w) => resolveLog(w)).length;
  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-3 font-display text-3xl font-semibold text-slate-900 dark:text-slate-100">
          <ClipboardCheck className="h-8 w-8 text-primary-600 dark:text-primary-300" /> Kiểm tra TOEIC
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
          Luyện từng Part (1 đến 7) theo dạng đề Listening và Reading, hoặc tự chọn Part và số câu để thi thử có bấm giờ. Phần nghe dùng giọng đọc của thiết bị (chỉnh ở mục "Giọng đọc"). Đề do Flex Learn soạn theo dạng bài TOEIC, không phải đề thi thật.
        </p>
      </header>

      <button
        onClick={() => setScreen({ kind: 'review' })}
        className="lift flex w-full items-center gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-left dark:border-amber-800 dark:bg-amber-950/30"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white">
          <ClipboardList className="h-6 w-6" />
        </span>
        <span className="flex-1">
          <span className="block font-display text-xl font-semibold text-slate-900 dark:text-slate-100">Ôn tập</span>
          <span className="block text-sm text-slate-600 dark:text-slate-300">Xem lại câu đã sai kèm giải thích, luyện lại câu sai, mở lại các bài đã làm.</span>
          <span className="mt-1 block text-sm font-semibold text-amber-800 dark:text-amber-300">{wrongBank > 0 ? `${wrongBank} câu cần ôn` : 'Chưa có câu sai nào được lưu'}</span>
        </span>
      </button>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          onClick={() => setScreen({ kind: 'setup' })}
          className="lift flex w-full items-center gap-4 rounded-2xl border border-primary-300 bg-primary-100 p-5 text-left dark:border-primary-700 dark:bg-primary-950/50"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white">
            <SlidersHorizontal className="h-6 w-6" />
          </span>
          <span className="flex-1">
            <span className="block font-display text-xl font-semibold text-slate-900 dark:text-slate-100">Thi thử tùy chỉnh</span>
            <span className="block text-sm text-slate-600 dark:text-slate-300">Chọn Part, số câu, bấm giờ và chế độ thi thật.</span>
            {rec('custom') && <span className="mt-1 block text-sm font-semibold text-primary-700 dark:text-primary-300">Cao nhất {rec('custom').best}% · {rec('custom').attempts} lượt</span>}
          </span>
        </button>
        <button
          onClick={() => start('mix')}
          className="lift flex w-full items-center gap-4 rounded-2xl border border-primary-200 bg-primary-100/70 p-5 text-left dark:border-primary-800 dark:bg-primary-950/40"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white">
            <ClipboardCheck className="h-6 w-6" />
          </span>
          <span className="flex-1">
            <span className="block font-display text-xl font-semibold text-slate-900 dark:text-slate-100">Thi thử mini (khoảng 24 câu)</span>
            <span className="block text-sm text-slate-600 dark:text-slate-300">Trộn đủ 7 dạng bài, nghe trước đọc sau.</span>
            {rec('mix') && <span className="mt-1 block text-sm font-semibold text-primary-700 dark:text-primary-300">Cao nhất {rec('mix').best}% · {rec('mix').attempts} lượt</span>}
          </span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PARTS.map((p) => {
          const r = rec(p.key);
          const Icon = p.skill === 'Nghe' ? Headphones : BookOpen;
          return (
            <button
              key={p.key}
              onClick={() => start(p.key)}
              className="lift flex flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-200">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{p.skill} · {questionCount(p.key)} câu</span>
              </span>
              <span className="mt-3 font-display text-xl font-semibold text-slate-900 dark:text-slate-100">{p.title}</span>
              <span className="mt-1 text-sm text-slate-600 dark:text-slate-300">{p.desc}</span>
              <span className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">Mẹo: {p.tip}</span>
              <span className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                {r ? `Cao nhất ${r.best}% · gần nhất ${r.last}% · ${r.attempts} lượt` : 'Chưa làm lần nào'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
