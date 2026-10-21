import { useEffect, useRef, useState } from 'react';
import { BookOpen, Check, ClipboardCheck, Flame, Gamepad2, Headphones, Hourglass, Lightbulb, Play, RotateCcw, Sparkles, Volume2, X, Zap } from 'lucide-react';
import { LEVEL_LABEL } from '@/data/vocabData';
import { useSrsProgress } from '@/hooks/useSrsProgress';
import { useStudyStats } from '@/hooks/useStudyTime';
import { useVocabStats } from '@/hooks/useVocabStats';
import { useDisplayName } from '@/hooks/useDisplayName';
import { StudyGirl } from '@/components/StudyGirl';
import { GOAL_SECONDS } from '@/lib/studyTime';
import { POS_SHORT } from '@/lib/pos';
import { isSpeechSupported, speakEnglish } from '@/lib/speech';
import { sfx } from '@/lib/sfx';
import { speechText, vocabKey } from '@/lib/vocabKey';
import type { LevelStat } from '@/hooks/useVocabStats';
import type { Level, ReviewQuality, VocabItem } from '@/lib/types';
import type { ViewKey } from '@/components/Sidebar';

const fmt = (n: number) => n.toLocaleString('vi-VN');

const panel = 'border border-slate-200/80 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900';

const LEVEL_INFO: Record<Level, { badge: string; name: string }> = {
  A1: { badge: 'A1', name: 'Căn bản khởi động' },
  A2: { badge: 'A2', name: 'Sơ cấp tiếp nối' },
  B1: { badge: 'B1', name: 'Trung cấp độc lập' },
  B2: { badge: 'B2', name: 'Trung cao cấp' },
  C1: { badge: 'C1', name: 'Cao cấp thành thạo' },
  extra: { badge: '+', name: 'Bổ sung & chuyên ngành' },
};

// ---------------------------------------------------------------- banner

function Hero({
  name,
  due,
  learned,
  fresh,
  total,
  onStart,
}: {
  name: string;
  due: number;
  learned: number;
  fresh: number;
  total: number;
  onStart: () => void;
}) {
  const cta = due > 0 || learned === 0 ? 'Bắt đầu ôn ngay' : 'Học từ mới';
  return (
    <section
      aria-labelledby="today"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-700 via-primary-600 to-[#705ceb] px-5 py-4 text-white shadow-md shadow-primary-600/20 dark:from-primary-600 dark:via-primary-600 dark:to-primary-500 sm:px-6"
    >
      <div className="pointer-events-none absolute -bottom-6 -right-6 h-36 w-36 rounded-full bg-white/10 blur-lg" />
      <div className="pointer-events-none absolute -top-10 left-1/2 h-28 w-28 rounded-full bg-purple-400/15 blur-md" />
      <div className="relative z-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[10.5px] font-semibold backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-amber-300" />
            Mục tiêu hôm nay
          </span>
          <h1 id="today" className="text-base font-extrabold leading-snug tracking-tight sm:text-lg md:text-xl">
            {learned === 0 ? (
              <>Chào {name}! Bắt đầu với những từ đầu tiên</>
            ) : due > 0 ? (
              <>Chào {name}! Có {fmt(due)} thẻ cần ôn hôm nay</>
            ) : (
              <>Chào {name}! Bạn đã ôn xong các thẻ đến hạn</>
            )}
          </h1>
          <p className="mt-1 max-w-sm text-[11.5px] leading-relaxed text-purple-100">
            {learned === 0 ? (
              <>{fmt(total)} từ đang chờ, học từng thẻ một.</>
            ) : due > 0 ? (
              <>Ôn xong {fmt(due)} thẻ để giữ độ nhớ, sau đó tiếp tục mở khóa <b>{fmt(fresh)} từ mới</b>.</>
            ) : (
              <>Còn <b>{fmt(fresh)} từ mới</b> nếu bạn muốn học thêm.</>
            )}
          </p>
          <div className="mt-3 flex justify-center sm:justify-start">
            <button
              onClick={() => {
                sfx.success();
                onStart();
              }}
              className="group flex items-center gap-2 whitespace-nowrap rounded-xl bg-white px-4 py-2 text-xs font-bold text-primary-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow active:translate-y-0"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary-100 text-primary-600 transition-transform group-hover:scale-110">
                <Play className="ml-0.5 h-2.5 w-2.5 fill-current" />
              </span>
              {cta}
            </button>
          </div>
        </div>
        <div className="relative flex h-24 w-28 shrink-0 items-center justify-center sm:h-28 sm:w-36" title="Học tập chăm chỉ cùng Flex Learn!">
          <StudyGirl />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- số liệu nhanh

function StatCard({
  icon: Icon,
  tone,
  label,
  value,
  unit,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <li className={`${panel} flex items-center gap-4 rounded-2xl p-5`}>
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tone}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-0.5 text-2xl font-extrabold tabular-nums text-slate-900 dark:text-white">
          {fmt(value)} <span className="text-xs font-normal text-slate-500">{unit}</span>
        </p>
      </div>
    </li>
  );
}

// ---------------------------------------------------------------- tiến độ CEFR

function levelNote(learned: number, total: number): string {
  if (learned === 0) return 'Chưa bắt đầu';
  const ratio = learned / total;
  return ratio < 0.1 ? 'Đã mở bài học' : ratio < 0.5 ? 'Đang tiến bộ' : 'Nâng cao';
}

function LevelCard({ stat, active }: { stat: LevelStat; active: boolean }) {
  const { level, total, known, hard, fresh } = stat;
  const info = LEVEL_INFO[level];
  const learned = known + hard;
  const note = levelNote(learned, total);
  return (
    <li
      className={`rounded-2xl p-5 transition-all duration-300 ${
        active
          ? 'border-2 border-primary-500/40 bg-gradient-to-b from-primary-50/50 to-white hover:shadow-card-hover dark:border-primary-500/50 dark:from-slate-800/80 dark:to-slate-800/40'
          : 'border border-slate-200/70 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700'
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm ${
              active
                ? 'bg-primary-600 font-extrabold text-white shadow-md shadow-primary-500/30'
                : 'bg-slate-100 font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200'
            }`}
          >
            {info.badge}
          </span>
          <div className="min-w-0">
            <h4 className={`truncate text-sm font-bold ${active ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>{info.name}</h4>
            {active ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-success-600 dark:text-success-400">
                <Zap className="h-3 w-3 fill-current" />
                Cấp độ đang học chính
              </span>
            ) : (
              <span className={`text-[11px] ${learned > 0 ? 'font-medium text-primary-600 dark:text-primary-300' : 'text-slate-500'}`}>{note}</span>
            )}
          </div>
        </div>
        <span
          className={`shrink-0 rounded-lg text-xs tabular-nums ${
            active
              ? 'bg-primary-100 px-2.5 py-1 font-extrabold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
              : 'bg-slate-100 px-2 py-0.5 font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          {fmt(learned)}/{fmt(total)} từ
        </span>
      </div>

      <div
        className={`my-3 flex w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700 ${active ? 'h-3' : 'h-2.5'}`}
        role="img"
        aria-label={`Cấp ${LEVEL_LABEL[level]}: ${known} từ thuộc rồi, ${hard} từ chưa thuộc, ${fresh} từ chưa học`}
      >
        <div className="h-full bg-success-500 transition-all duration-500" style={{ width: `${(known / total) * 100}%`, minWidth: known > 0 ? 4 : 0 }} title={`Thuộc rồi: ${known}`} />
        <div className="h-full bg-warning-500 transition-all duration-500" style={{ width: `${(hard / total) * 100}%`, minWidth: hard > 0 ? 4 : 0 }} title={`Chưa thuộc: ${hard}`} />
      </div>

      <p className="flex items-center justify-between gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
        <span className={known > 0 ? 'font-semibold text-success-600 dark:text-success-400' : ''}>
          <b className="tabular-nums text-slate-800 dark:text-slate-200">{fmt(known)}</b> thuộc
        </span>
        <span className={hard > 0 ? 'font-semibold text-warning-700 dark:text-warning-400' : ''}>
          <b className="tabular-nums text-slate-800 dark:text-slate-200">{fmt(hard)}</b> chưa thuộc
        </span>
        <span>
          <b className="tabular-nums text-slate-600 dark:text-slate-400">{fmt(fresh)}</b> chưa học
        </span>
      </p>
    </li>
  );
}

function LevelProgress({ levels }: { levels: LevelStat[] }) {
  // Cấp đang học chính = cấp có nhiều từ đã học nhất (chưa học gì thì lấy cấp đầu tiên).
  let activeLevel = levels[0]?.level;
  let best = 0;
  for (const l of levels) {
    if (l.known + l.hard > best) {
      best = l.known + l.hard;
      activeLevel = l.level;
    }
  }
  const dot = 'h-2.5 w-2.5 rounded-full';
  return (
    <section aria-labelledby="progress" className={`${panel} rounded-3xl p-6 md:p-8`}>
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h3 id="progress" className="flex flex-wrap items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <span>Tiến độ theo cấp độ (CEFR)</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">Chuẩn khung châu Âu</span>
          </h3>
          <p className="mt-1 text-xs font-medium text-slate-500">Theo dõi chi tiết số từ đã hấp thụ và cần củng cố ở từng mốc trình độ</p>
        </div>
        <p className="flex shrink-0 items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className={`${dot} bg-success-500`} aria-hidden="true" />
            Thuộc rồi
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`${dot} bg-warning-500`} aria-hidden="true" />
            Chưa thuộc
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className={`${dot} bg-slate-200 dark:bg-slate-700`} aria-hidden="true" />
            Chưa học
          </span>
        </p>
      </div>
      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {levels.map((l) => (
          <LevelCard key={l.level} stat={l} active={l.level === activeLevel} />
        ))}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------- luyện tập thêm

const shortcuts: { key: ViewKey; title: string; desc: string; tone: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'dictation', title: 'Nghe chép', desc: 'Luyện tai nhanh', tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400', icon: Headphones },
  { key: 'games', title: 'Trò chơi từ vựng', desc: 'Học theo chủ đề, chơi để ôn', tone: 'bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-400', icon: Gamepad2 },
  { key: 'test', title: 'Kiểm tra TOEIC', desc: 'Luyện Part nghe và đọc', tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400', icon: ClipboardCheck },
];

function Shortcuts({ onNavigate }: { onNavigate: (v: ViewKey) => void }) {
  return (
    <section aria-labelledby="more">
      <h2 id="more" className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-100">
        <Zap className="h-4 w-4 text-amber-500" />
        Luyện tập thêm hôm nay
      </h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {shortcuts.map(({ key, title, desc, tone, icon: Icon }) => (
          <li key={key}>
            <button
              onClick={() => {
                sfx.chime();
                onNavigate(key);
              }}
              className={`${panel} flex w-full items-center gap-3.5 rounded-2xl p-4 text-left transition-all hover:-translate-y-1 hover:border-primary-400`}
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">{title}</span>
                <span className="block text-xs text-slate-500">{desc}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------- chuỗi học

function StreakCard() {
  const study = useStudyStats();
  const goalMinutes = Math.round(GOAL_SECONDS / 60);
  const todayMinutes = Math.floor(study.todaySeconds / 60);
  const remainingMinutes = Math.max(1, Math.ceil((GOAL_SECONDS - study.todaySeconds) / 60));
  const message = study.todayMet
    ? 'Bạn đã đạt mục tiêu hôm nay. Quay lại ngày mai để giữ chuỗi nhé.'
    : study.streak > 0
    ? `Chỉ còn ${remainingMinutes} phút học nữa để hoàn thành mục tiêu ngày và giữ chuỗi ${study.streak} ngày!`
    : `Học đủ ${goalMinutes} phút mỗi ngày để bắt đầu một chuỗi mới.`;

  return (
    <aside aria-labelledby="streak" className={`${panel} rounded-3xl p-6`}>
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
              study.streak > 0 ? 'animate-bounce bg-amber-500/10 text-amber-500' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
            }`}
          >
            <Flame className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h2 id="streak" className="text-lg font-extrabold text-slate-900 dark:text-white">
              Chuỗi học: {study.streak} ngày
            </h2>
            <p className="text-xs font-medium text-slate-500">Kỷ lục của bạn: {study.longest} ngày</p>
          </div>
        </div>
        {study.streak > 0 && (
          <span className="shrink-0 rounded-full bg-success-50 px-2.5 py-1 text-xs font-bold text-success-700 dark:bg-success-950/60 dark:text-success-400">Đang cháy!</span>
        )}
      </div>

      <ol className="mt-5 flex items-center justify-between text-center" aria-label="7 ngày gần nhất">
        {study.last7.map((d) => {
          const dayNum = Number(d.key.slice(8));
          const circle = d.met
            ? 'bg-success-500 text-white shadow-sm'
            : d.isToday
            ? 'bg-gradient-to-tr from-primary-600 to-primary-500 text-white shadow-md shadow-primary-500/30 ring-2 ring-primary-300 dark:ring-primary-700'
            : d.seconds > 0
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300'
            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
          return (
            <li key={d.key} className="flex flex-col items-center gap-1.5">
              <span className={`text-[11px] font-bold ${d.isToday ? 'text-primary-700 dark:text-primary-300' : 'text-slate-500'}`}>{d.label}</span>
              <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold tabular-nums ${circle}`} title={`${d.key}: ${Math.floor(d.seconds / 60)} phút`}>
                {d.met ? <Check className="h-3 w-3" aria-label="Đạt mục tiêu" /> : d.isToday ? <Flame className="h-4 w-4 text-amber-300" aria-label="Hôm nay" /> : dayNum}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
        <div className="mb-2 flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Hourglass className="h-3.5 w-3.5 text-primary-500" />
            Mục tiêu hôm nay
          </span>
          <span className="font-extrabold tabular-nums text-primary-700 dark:text-primary-300">
            {Math.min(todayMinutes, goalMinutes)} / {goalMinutes} phút
          </span>
        </div>
        <div
          className="h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 dark:bg-slate-800"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={goalMinutes}
          aria-valuenow={Math.min(todayMinutes, goalMinutes)}
          aria-label="Thời gian học hôm nay"
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${study.todayMet ? 'bg-success-500' : 'bg-gradient-to-r from-primary-600 to-[#705ceb]'}`}
            style={{ width: `${Math.min(100, (study.todaySeconds / GOAL_SECONDS) * 100)}%`, minWidth: study.todaySeconds > 0 ? 8 : 0 }}
          />
        </div>
        <p className="mt-2 text-[11px] font-medium leading-snug text-slate-500">{message}</p>
        <p className="mt-1.5 text-[11px] leading-snug text-slate-500">Tính khi bạn làm bài ở các mục (trừ trang chủ), tạm dừng sau 1 phút không thao tác. Lưu trên máy này.</p>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------- ôn nhanh 1 thẻ (thẻ lật 3D)

function QuickReview({ cardWord, due }: { cardWord: VocabItem | null; due: number }) {
  const { upsert } = useSrsProgress();
  const [flippedId, setFlippedId] = useState<number | null>(null);
  const [done, setDone] = useState(0);
  const [busy, setBusy] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flipped = cardWord !== null && flippedId === cardWord.id;
  const flip = () => {
    if (!cardWord || busy) return;
    sfx.chime();
    setFlippedId(flipped ? null : cardWord.id);
  };

  const answer = (quality: ReviewQuality) => {
    if (!cardWord || busy) return;
    if (quality === 'hard') sfx.forgot();
    else sfx.success();
    const commit = () => {
      upsert(vocabKey(cardWord), quality);
      setDone((n) => n + 1);
      setBusy(false);
    };
    if (flipped) {
      // Lật thẻ về mặt trước rồi mới sang thẻ kế tiếp, để không lộ nghĩa của thẻ sau.
      setBusy(true);
      setFlippedId(null);
      timer.current = window.setTimeout(commit, 350);
    } else {
      commit();
    }
  };

  const counter = due > 0 ? `Thẻ ${done + 1} / ${done + due}` : cardWord ? 'Từ mới' : '';
  const face = 'col-start-1 row-start-1 flex flex-col justify-between rounded-2xl p-5 text-left backface-hidden';

  return (
    <section aria-labelledby="quick" className={`${panel} rounded-3xl p-6`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 id="quick" className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white">
          <span className="h-2.5 w-2.5 rounded-full bg-primary-500" aria-hidden="true" />
          Ôn nhanh 1 thẻ ngay
        </h2>
        <span className="text-[11px] font-semibold tabular-nums text-slate-500">{counter}</span>
      </div>

      {cardWord ? (
        <div className="relative">
          <div className="perspective-1000 w-full">
            <div className={`transform-style-3d grid w-full min-h-[190px] transition-transform duration-500 ${flipped ? 'rotate-y-180' : ''}`}>
              <button
                type="button"
                onClick={flip}
                aria-hidden={flipped}
                tabIndex={flipped ? -1 : 0}
                aria-label="Lật thẻ để xem nghĩa và ví dụ"
                className={`${face} border-2 border-dashed border-slate-200 bg-slate-50/70 dark:border-slate-700 dark:bg-slate-800/60`}
              >
                <span className="flex items-start">
                  <span className="rounded-md bg-primary-100 px-2 py-0.5 text-[11px] font-bold text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                    {LEVEL_LABEL[cardWord.level]} • {POS_SHORT[cardWord.pos]}
                  </span>
                </span>
                <span className="my-3 block text-center">
                  <span className="block text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{cardWord.word}</span>
                  <span className="font-ipa mt-1 block text-xs text-slate-500">{cardWord.ipa}</span>
                </span>
                <span className="text-center text-[11px] italic text-slate-500">Nhấn để lật xem nghĩa & ví dụ ↺</span>
              </button>
              <button
                type="button"
                onClick={flip}
                aria-hidden={!flipped}
                tabIndex={flipped ? 0 : -1}
                aria-label="Lật thẻ về mặt trước"
                className={`${face} rotate-y-180 border border-primary-200 bg-white dark:border-primary-900 dark:bg-slate-800`}
              >
                <span className="block pr-8">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-success-600 dark:text-success-400">Ý nghĩa</span>
                  <span className="mt-1 block text-sm font-bold text-slate-800 dark:text-slate-100">{cardWord.meaning}</span>
                  <span className="mt-2 block rounded-lg bg-slate-50 p-2 text-xs italic text-slate-600 dark:bg-slate-900/40 dark:text-slate-400">
                    “{cardWord.example}”
                    <span className="mt-0.5 block not-italic text-slate-500">{cardWord.exampleVi}</span>
                  </span>
                </span>
                <span className="text-center text-[11px] italic text-slate-500">Nhấn để lật lại ↺</span>
              </button>
            </div>
          </div>
          {isSpeechSupported() && (
            <button
              type="button"
              onClick={() => speakEnglish(speechText(cardWord))}
              aria-label={`Nghe phát âm từ ${cardWord.word}`}
              title="Nghe phát âm"
              className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-primary-100 hover:text-primary-600 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex min-h-[190px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-success-200 bg-success-50/70 px-5 text-center dark:border-success-800 dark:bg-success-950/20">
          <Check className="h-6 w-6 text-success-600 dark:text-success-400" />
          <p className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-100">Không còn thẻ nào cần ôn</p>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">Quay lại ngày mai nhé.</p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={!cardWord || busy}
          onClick={() => answer('hard')}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50/60 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          <X className="h-3.5 w-3.5" />
          Quên / Chưa thuộc
        </button>
        <button
          type="button"
          disabled={!cardWord || busy}
          onClick={() => answer('good')}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-2.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
        >
          <Check className="h-3.5 w-3.5" />
          Đã nhớ rõ
        </button>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- mẹo SRS

function SrsTip() {
  return (
    <aside className="flex items-start gap-3.5 rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-5 dark:border-amber-500/10">
      <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
      <div>
        <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200">Mẹo Spaced Repetition (SRS)</h2>
        <p className="mt-1 text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
          Ôn 15 phút mỗi ngày hiệu quả hơn học dồn 2 tiếng vào cuối tuần. Ôn lại đúng lúc sắp quên giúp nhớ lâu hơn theo đường cong quên lãng của Ebbinghaus.
        </p>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------- trang chủ

export function HomeView({ onNavigate }: { onNavigate: (view: ViewKey) => void }) {
  const stats = useVocabStats();
  const name = useDisplayName() ?? 'bạn';

  return (
    <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="flex min-w-0 flex-col gap-8 lg:col-span-8">
        <Hero name={name} due={stats.due} learned={stats.learned} fresh={stats.fresh} total={stats.totals.total} onStart={() => onNavigate('flashcards')} />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Số liệu từ vựng">
          <StatCard icon={Check} tone="bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400" label="Đã thuộc làu" value={stats.totals.known} unit="từ" />
          <StatCard icon={RotateCcw} tone="bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400" label="Cần củng cố" value={stats.totals.hard} unit="từ" />
          <StatCard icon={BookOpen} tone="bg-primary-100 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400" label="Kho từ vựng" value={stats.totals.total} unit="tổng" />
        </ul>
        <LevelProgress levels={stats.levels} />
        <Shortcuts onNavigate={onNavigate} />
      </div>
      <div className="flex min-w-0 flex-col gap-6 lg:col-span-4">
        <StreakCard />
        <QuickReview cardWord={stats.nextCard} due={stats.due} />
        <SrsTip />
      </div>
    </div>
  );
}
