import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { CONVERSATION_LEVELS } from '@/data/conversationData';
import { Mic, Square, Volume2, Turtle, ArrowRight, Play, Eye, EyeOff, Trophy, RotateCcw, AlertTriangle, MessagesSquare, CheckCircle2 } from 'lucide-react';
import { LEVEL_LABEL, LEVEL_ORDER } from '@/data/vocabData';
import { TopicSelect, countByTopic } from '@/components/TopicSelect';
import type { TopicFilter } from '@/components/TopicSelect';
import { buildItems, shuffle } from '@/lib/dictItems';
import type { DictItem } from '@/lib/dictItems';
import { DIALOGUES } from '@/data/dialogueData';
import type { Speaker } from '@/data/dialogueData';
import { speakEnglish, stopSpeaking } from '@/lib/speech';
import { diffWords } from '@/lib/spelling';
import { useStarred } from '@/hooks/useStarred';
import type { Level } from '@/lib/types';
import type { Topic } from '@/data/vocabTopics';

type SentenceSource = 'conversation' | 'example' | 'dialogue';
type Role = 'both' | Speaker;
/** Mục luyện; với hội thoại có thêm người nói và vị trí lượt lời. */
type ShItem = DictItem & { speaker?: Speaker; lineIdx?: number };
type LevelFilter = 'all' | Level | 'starred';
type Phase = 'idle' | 'listening' | 'recording' | 'done';

const SOURCES: { key: SentenceSource; label: string }[] = [
  { key: 'conversation', label: 'Câu giao tiếp' },
  { key: 'example', label: 'Câu ví dụ' },
  { key: 'dialogue', label: 'Hội thoại dài và talk show' },
];
const DIALOGUE_LEVELS: Level[] = LEVEL_ORDER.filter((l) => DIALOGUES.some((d) => d.level === l));
const PASS_SCORE = 70;
const MAX_RECORD_MS = 20000;

// Web Speech API chưa có trong lib.dom của TypeScript nên khai báo phần cần dùng.
interface RecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface RecognitionEventLike {
  results: ArrayLike<RecognitionResultLike>;
}
interface RecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((e: RecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
type RecognitionCtor = new () => RecognitionLike;

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function canRecord(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined';
}

const ERROR_TEXT: Record<string, string> = {
  'not-allowed': 'Trình duyệt chưa được cấp quyền dùng micro. Hãy cho phép micro cho trang này rồi thử lại.',
  'service-not-allowed': 'Trình duyệt chặn nhận dạng giọng nói trên trang này.',
  'no-speech': 'Không nghe thấy giọng nói. Hãy nói to và gần micro hơn rồi thử lại.',
  'audio-capture': 'Không tìm thấy micro.',
  network: 'Nhận dạng giọng nói cần có mạng. Hãy kiểm tra kết nối.',
};

/** Shadowing: nghe câu mẫu rồi nhại theo, thu âm, so với câu gốc và nghe lại bản của mình. */
export function ShadowingView() {
  const [source, setSource] = useState<SentenceSource>('conversation');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [topic, setTopic] = useState<TopicFilter>('all');
  const [dialogueId, setDialogueId] = useState<number>(DIALOGUES[0]?.id ?? 0);
  const [role, setRole] = useState<Role>('both');
  const [playingAll, setPlayingAll] = useState(false);
  // Nghe cả hội thoại: câu đang đọc và câu sẽ đọc tiếp khi bấm "Nghe tiếp" sau khi dừng
  const [playingLine, setPlayingLine] = useState<number | null>(null);
  const [resumeLine, setResumeLine] = useState<number | null>(null);
  const playingLineRef = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const [seed, setSeed] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [showText, setShowText] = useState(true);
  const [showMeaning, setShowMeaning] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [myAudioUrl, setMyAudioUrl] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [passed, setPassed] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const { starred } = useStarred();

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<RecognitionLike | null>(null);
  const transcriptRef = useRef('');
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishedRef = useRef(false);
  const playerRef = useRef<HTMLAudioElement | null>(null);

  const recognitionSupported = useMemo(() => getRecognitionCtor() !== null, []);
  const recordSupported = useMemo(() => canRecord(), []);

  const isDialogue = source === 'dialogue';

  // Các đoạn hội thoại hợp bộ lọc cấp, và đoạn đang chọn (nếu đoạn đã chọn không còn trong danh sách thì lấy đoạn đầu).
  const dialogueList = useMemo(
    () => DIALOGUES.filter((d) => levelFilter === 'all' || d.level === levelFilter),
    [levelFilter]
  );
  const dialogue = dialogueList.find((d) => d.id === dialogueId) ?? dialogueList[0];

  const allItems = useMemo<ShItem[]>(() => {
    if (source === 'dialogue') {
      return (dialogue?.lines ?? []).map((l, i) => ({
        key: `d${dialogue!.id}-${i}`,
        answer: l.english,
        speak: l.english,
        meaning: l.vietnamese,
        level: dialogue!.level,
        speaker: l.speaker,
        lineIdx: i,
      }));
    }
    return buildItems(source);
  }, [source, dialogue]);
  const matchesLevel = useCallback(
    (it: DictItem) => {
      if (levelFilter === 'all') return true;
      if (levelFilter === 'starred') return !!it.starKey && starred.has(it.starKey);
      return it.level === levelFilter;
    },
    [levelFilter, starred]
  );
  const levelItems = useMemo(() => (isDialogue ? allItems : allItems.filter(matchesLevel)), [isDialogue, allItems, matchesLevel]);
  const topicCounts = useMemo(
    () => countByTopic(levelItems.filter((it): it is DictItem & { topic: Topic } => !!it.topic)),
    [levelItems]
  );
  // Hội thoại giữ nguyên thứ tự và chỉ lấy các lượt lời của người học; các nguồn khác xáo ngẫu nhiên.
  const pool = useMemo<ShItem[]>(
    () =>
      isDialogue
        ? levelItems.filter((it) => role === 'both' || it.speaker === role)
        : shuffle(levelItems.filter((it) => topic === 'all' || it.topic === topic)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDialogue, levelItems, role, topic, seed]
  );
  const finished = isDialogue && pool.length > 0 && index >= pool.length;
  const current = pool.length > 0 ? (isDialogue ? pool[Math.min(index, pool.length - 1)] : pool[index % pool.length]) : undefined;

  // ------------------------------------------------------------ thu âm
  const releaseMic = useCallback(() => {
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    const rec = recorderRef.current;
    if (rec && rec.state !== 'inactive') {
      rec.onstop = null;
      rec.stop();
    }
    recorderRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      releaseMic();
      stopSpeaking();
    };
  }, [releaseMic]);

  useEffect(() => {
    return () => {
      if (myAudioUrl) URL.revokeObjectURL(myAudioUrl);
    };
  }, [myAudioUrl]);

  const resetAttempt = useCallback(() => {
    releaseMic();
    stopSpeaking();
    playerRef.current?.pause();
    finishedRef.current = false;
    transcriptRef.current = '';
    setTranscript('');
    setError('');
    setScore(null);
    setMyAudioUrl(null);
    setPlayingAll(false);
    setPlayingLine(null);
    setPhase('idle');
  }, [releaseMic]);

  /** Kết thúc lần thu: dừng micro, chấm điểm, tạo file nghe lại. */
  const finish = useCallback(
    (errorKey?: string) => {
      if (finishedRef.current || !current) return;
      finishedRef.current = true;
      if (stopTimerRef.current) {
        clearTimeout(stopTimerRef.current);
        stopTimerRef.current = null;
      }
      recognitionRef.current?.abort();
      recognitionRef.current = null;

      const rec = recorderRef.current;
      const stream = streamRef.current;
      recorderRef.current = null;
      streamRef.current = null;
      const closeStream = () => stream?.getTracks().forEach((t) => t.stop());
      if (rec && rec.state !== 'inactive') {
        rec.onstop = () => {
          closeStream();
          if (chunksRef.current.length > 0) {
            setMyAudioUrl(URL.createObjectURL(new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' })));
          }
        };
        rec.stop();
      } else {
        closeStream();
      }

      const heard = transcriptRef.current.trim();
      if (recognitionSupported) {
        if (!heard) {
          setError(ERROR_TEXT[errorKey ?? 'no-speech'] ?? ERROR_TEXT['no-speech']);
          setScore(null);
        } else {
          const d = diffWords(heard, current.answer);
          const pct = Math.round((d.answer.filter((t) => t.ok).length / d.answer.length) * 100);
          setScore(pct);
          setCompleted((c) => c + 1);
          if (pct >= PASS_SCORE) {
            setPassed((p) => p + 1);
            setStreak((s) => {
              const ns = s + 1;
              setBestStreak((b) => Math.max(b, ns));
              return ns;
            });
          } else {
            setStreak(0);
          }
        }
      }
      setPhase('done');
    },
    [current, recognitionSupported]
  );

  const startRecording = useCallback(async () => {
    if (!current) return;
    finishedRef.current = false;
    transcriptRef.current = '';
    setTranscript('');
    setError('');
    setScore(null);
    setMyAudioUrl(null);

    if (!recordSupported) {
      setError('Trình duyệt này không hỗ trợ thu âm.');
      setPhase('idle');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorderRef.current = recorder;
      recorder.start();

      const Ctor = getRecognitionCtor();
      if (Ctor) {
        const rec = new Ctor();
        rec.lang = 'en-US';
        rec.interimResults = true;
        rec.continuous = false;
        rec.maxAlternatives = 1;
        rec.onresult = (e) => {
          let text = '';
          for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript + ' ';
          transcriptRef.current = text.trim();
          setTranscript(text.trim());
        };
        rec.onerror = (e) => {
          if (e.error === 'aborted') return;
          finish(e.error);
        };
        rec.onend = () => finish();
        recognitionRef.current = rec;
        rec.start();
      }
      stopTimerRef.current = setTimeout(() => finish(), MAX_RECORD_MS);
      setPhase('recording');
    } catch {
      releaseMic();
      setError(ERROR_TEXT['not-allowed']);
      setPhase('idle');
    }
  }, [current, recordSupported, finish, releaseMic]);

  /** Đọc lần lượt nhiều câu; câu cuối đọc xong thì gọi onDone. Bị hủy khi có lệnh đọc hoặc dừng khác. */
  const playSequence = useCallback((texts: string[], onDone?: () => void) => {
    const step = (i: number) => {
      if (i >= texts.length) {
        onDone?.();
        return;
      }
      speakEnglish(texts[i], { onEnd: () => step(i + 1) });
    };
    step(0);
  }, []);

  /** Với hội thoại có chọn vai: các lời của bạn diễn ngay trước lượt của người học (từ lượt trước của người học đến lượt này). */
  const leadIn = useCallback(
    (item: ShItem): string[] => {
      if (!dialogue || role === 'both' || item.lineIdx === undefined) return [];
      const out: string[] = [];
      for (let i = item.lineIdx - 1; i >= 0 && dialogue.lines[i].speaker !== role; i--) out.unshift(dialogue.lines[i].english);
      return out;
    },
    [dialogue, role]
  );

  /** Nghe câu mẫu (kèm lời bạn diễn nếu đóng vai), đọc xong thì tự bắt đầu thu âm. */
  const listenThenRecord = useCallback(() => {
    if (!current) return;
    resetAttempt();
    setPhase('listening');
    playSequence([...leadIn(current), current.speak], () => void startRecording());
  }, [current, resetAttempt, startRecording, playSequence, leadIn]);

  /** Nghe cả hội thoại. Bấm "Dừng" thì nhớ câu đang đọc; bấm lại sẽ đọc tiếp từ câu đó, không phải từ đầu. */
  const playLinesFrom = useCallback(
    (from: number) => {
      if (!dialogue) return;
      const lines = dialogue.lines;
      const step = (i: number) => {
        if (i >= lines.length) {
          playingLineRef.current = null;
          setPlayingLine(null);
          setResumeLine(null);
          setPlayingAll(false);
          return;
        }
        playingLineRef.current = i;
        setPlayingLine(i);
        speakEnglish(lines[i].english, { onEnd: () => step(i + 1) });
      };
      setPlayingAll(true);
      step(from);
    },
    [dialogue]
  );

  const playAll = useCallback(() => {
    if (!dialogue) return;
    if (playingAll) {
      stopSpeaking();
      setResumeLine(playingLineRef.current);
      setPlayingLine(null);
      setPlayingAll(false);
      return;
    }
    stopSpeaking();
    playerRef.current?.pause();
    playLinesFrom(resumeLine !== null && resumeLine < dialogue.lines.length ? resumeLine : 0);
  }, [dialogue, playingAll, resumeLine, playLinesFrom]);

  const playAllFromStart = useCallback(() => {
    stopSpeaking();
    setResumeLine(null);
    playLinesFrom(0);
  }, [playLinesFrom]);

  /** Dừng việc đang đọc mẫu trước khi thu (không xóa kết quả hay vị trí nào). */
  const cancelListening = useCallback(() => {
    stopSpeaking();
    setPhase('idle');
  }, []);

  const listenOnly = (slow: boolean) => {
    if (!current) return;
    if (phase === 'recording') return;
    stopSpeaking();
    setPhase((p) => (p === 'listening' ? 'idle' : p));
    speakEnglish(current.speak, { rateScale: slow ? 0.65 : 1 });
  };

  const stopRecording = useCallback(() => finish(), [finish]);

  const playMine = () => {
    if (!myAudioUrl) return;
    stopSpeaking();
    playerRef.current?.pause();
    const a = new Audio(myAudioUrl);
    playerRef.current = a;
    void a.play();
  };

  const next = useCallback(() => {
    resetAttempt();
    setShowMeaning(false);
    setIndex((i) => i + 1);
  }, [resetAttempt]);

  const skip = useCallback(() => {
    setStreak(0);
    next();
  }, [next]);

  const restart = useCallback(() => {
    resetAttempt();
    setShowMeaning(false);
    setIndex(0);
    setResumeLine(null);
    setSeed((x) => x + 1);
    setPassed(0);
    setCompleted(0);
    setStreak(0);
  }, [resetAttempt]);

  // Cuộn tới câu đang được đọc khi nghe cả hội thoại
  useEffect(() => {
    if (playingLine === null) return;
    document.getElementById(`shadow-line-${playingLine}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [playingLine]);


  // Enter: bắt đầu nghe và nhại / dừng thu / sang câu tiếp.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.isComposing) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, select, a, textarea, input')) return;
      e.preventDefault();
      if (phase === 'idle') listenThenRecord();
      else if (phase === 'recording') stopRecording();
      else if (phase === 'done') next();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, listenThenRecord, stopRecording, next]);

  const switchSource = (s: SentenceSource) => {
    setSource(s);
    setTopic('all');
    const validLevels = s === 'conversation' ? CONVERSATION_LEVELS : s === 'dialogue' ? DIALOGUE_LEVELS : null;
    if (levelFilter === 'starred' && s === 'dialogue') setLevelFilter('all');
    else if (validLevels && levelFilter !== 'all' && levelFilter !== 'starred' && !validLevels.includes(levelFilter as Level)) {
      setLevelFilter('all');
    }
    restart();
  };
  const switchDialogue = (id: number) => {
    setDialogueId(id);
    // Đoạn độc thoại chỉ có người nói A nên không đóng vai B được
    const target = DIALOGUES.find((d) => d.id === id);
    if (role === 'B' && target && !target.lines.some((l) => l.speaker === 'B')) setRole('both');
    restart();
  };
  const switchRole = (r: Role) => {
    setRole(r);
    restart();
  };
  const switchLevel = (l: LevelFilter) => {
    setLevelFilter(l);
    restart();
  };
  const switchTopic = (t: TopicFilter) => {
    setTopic(t);
    restart();
  };

  const levelTabs: { key: LevelFilter; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    ...(source === 'conversation' ? CONVERSATION_LEVELS : source === 'dialogue' ? DIALOGUE_LEVELS : LEVEL_ORDER).map((l) => ({
      key: l as LevelFilter,
      label: LEVEL_LABEL[l],
    })),
    ...(source === 'example' ? [{ key: 'starred' as LevelFilter, label: 'Đã đánh dấu' }] : []),
  ];

  const tabBox = 'flex w-fit flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900';
  const tabBtn = (active: boolean) =>
    `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
      active ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
    }`;
  const card = 'rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900';
  const ghostBtn =
    'inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700';

  const header = (
    <>
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          <Mic className="h-6 w-6 text-primary-600" />
          Shadowing
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Nghe câu mẫu rồi nói nhại theo ngay, cùng nhịp và ngữ điệu. App thu âm giọng bạn, so với câu gốc và cho bạn nghe lại.
        </p>
      </div>
      <div className="space-y-3">
        <div className={tabBox}>
          {SOURCES.map((s) => (
            <button key={s.key} onClick={() => switchSource(s.key)} className={tabBtn(source === s.key)}>
              {s.label}
            </button>
          ))}
        </div>
        <div className={tabBox}>
          {levelTabs.map((tab) => (
            <button key={tab.key} onClick={() => switchLevel(tab.key)} className={tabBtn(levelFilter === tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>
        {source === 'example' && (
          <TopicSelect value={topic} onChange={switchTopic} counts={topicCounts} total={levelItems.length} />
        )}
        {isDialogue && dialogue && (
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium">Hội thoại:</span>
              <select
                value={dialogue.id}
                onChange={(e) => {
                  switchDialogue(Number(e.target.value));
                  e.currentTarget.blur();
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {dialogueList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.level} · {d.title} ({d.titleVi})
                  </option>
                ))}
              </select>
            </label>
            {dialogue.lines.some((l) => l.speaker === 'B') && (
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium">Bạn đóng vai:</span>
              <select
                value={role}
                onChange={(e) => {
                  switchRole(e.target.value as Role);
                  e.currentTarget.blur();
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="both">Cả hai vai (nhại từng câu)</option>
                <option value="A">A: {dialogue.roleA}</option>
                <option value="B">B: {dialogue.roleB}</option>
              </select>
            </label>
            )}
          </div>
        )}
      </div>
    </>
  );

  if (!current) {
    return (
      <div className="space-y-6">
        {header}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
          <Mic className="mb-4 h-12 w-12 text-slate-300" />
          <p className="text-slate-500 dark:text-slate-400">Không có câu nào trong bộ lọc này.</p>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="space-y-6">
        {header}
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center dark:border-slate-800 dark:bg-slate-900">
          <CheckCircle2 className="h-14 w-14 text-success-600" />
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">Hoàn thành hội thoại!</p>
          <p className="text-slate-500 dark:text-slate-400">
            Bạn đạt {passed}/{pool.length} lượt lời (từ {PASS_SCORE}%).
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={restart} className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700">
              Luyện lại đoạn này
            </button>
            {role !== 'both' && (
              <button
                onClick={() => switchRole(role === 'A' ? 'B' : 'A')}
                className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Đổi sang vai {role === 'A' ? 'B' : 'A'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const diff = phase === 'done' && transcript ? diffWords(transcript, current.answer) : null;
  const busy = phase === 'listening' || phase === 'recording' || playingAll;

  return (
    <div className="space-y-6">
      {header}

      {!recordSupported && (
        <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          Trình duyệt này không hỗ trợ thu âm nên chỉ nghe mẫu được. Hãy dùng Chrome, Edge hoặc Safari mới.
        </p>
      )}
      {recordSupported && !recognitionSupported && (
        <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          Trình duyệt này chưa hỗ trợ nhận dạng giọng nói nên app không chấm điểm được. Bạn vẫn thu âm và so sánh bằng tai. Dùng Chrome hoặc Edge để có điểm.
        </p>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className={card}>
          <p className="text-xs text-slate-400">Đạt (từ {PASS_SCORE}%)</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{passed}</p>
        </div>
        <div className={card}>
          <p className="text-xs text-slate-400">Chuỗi đạt</p>
          <p className="flex items-center justify-center gap-1 text-2xl font-bold text-accent-600 dark:text-accent-400">
            {streak} {streak >= 3 && <Trophy className="h-5 w-5" />}
          </p>
        </div>
        <div className={card}>
          <p className="text-xs text-slate-400">Kỷ lục</p>
          <p className="text-2xl font-bold text-success-600 dark:text-success-400">{bestStreak}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="flex flex-col items-center gap-5">
          <div className="min-h-[4.5rem] w-full max-w-2xl text-center">
            {showText ? (
              <p className="text-2xl font-semibold leading-snug text-slate-900 dark:text-slate-100 sm:text-3xl">
                {diff
                  ? diff.answer.map((t, k) => (
                      <span
                        key={k}
                        className={t.ok ? 'text-success-600 dark:text-success-400' : 'rounded bg-error-100 px-1 text-error-700 dark:bg-error-900/50 dark:text-error-300'}
                      >
                        {t.text}{' '}
                      </span>
                    ))
                  : current.answer}
              </p>
            ) : (
              <p className="text-lg text-slate-400">Câu đang được ẩn. Hãy nghe và nhại theo.</p>
            )}
            {showMeaning && <p className="mt-3 text-slate-600 dark:text-slate-400">{current.meaning}</p>}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button onClick={() => listenOnly(false)} disabled={phase === 'recording'} className={ghostBtn}>
              <Volume2 className="h-4 w-4" />
              Nghe mẫu
            </button>
            <button onClick={() => listenOnly(true)} disabled={phase === 'recording'} className={ghostBtn}>
              <Turtle className="h-4 w-4" />
              Nghe chậm
            </button>
            <button onClick={() => setShowText((v) => !v)} className={ghostBtn}>
              {showText ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showText ? 'Ẩn câu' : 'Hiện câu'}
            </button>
            <button onClick={() => setShowMeaning((v) => !v)} className={ghostBtn}>
              {showMeaning ? 'Ẩn nghĩa' : 'Xem nghĩa'}
            </button>
          </div>

          {/* nút chính */}
          {phase === 'recording' ? (
            <button
              onClick={stopRecording}
              className="flex h-24 w-24 animate-pulse items-center justify-center rounded-full bg-error-600 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              aria-label="Dừng thu âm"
            >
              <Square className="h-9 w-9 fill-current" />
            </button>
          ) : phase === 'listening' ? (
            <button
              onClick={cancelListening}
              className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-700 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 dark:bg-slate-600"
              aria-label="Dừng đọc mẫu"
            >
              <Square className="h-9 w-9 fill-current" />
            </button>
          ) : (
            <button
              onClick={listenThenRecord}
              disabled={!recordSupported}
              className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-primary-700 active:scale-95 disabled:opacity-60"
              aria-label="Nghe rồi nhại"
            >
              <Mic className="h-10 w-10" />
            </button>
          )}
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {phase === 'idle' && 'Bấm micro: app đọc câu mẫu, rồi tự thu giọng bạn'}
            {phase === 'listening' && 'Đang đọc câu mẫu... chuẩn bị nói theo (bấm vuông để dừng)'}
            {phase === 'recording' && 'Đang nghe bạn nói... hãy nói theo câu mẫu (bấm vuông để dừng)'}
            {phase === 'done' && (score !== null ? 'Xong! Xem kết quả bên dưới' : 'Xong lần thu này')}
          </p>

          {phase === 'recording' && transcript && <p className="text-sm italic text-slate-500">"{transcript}"</p>}
          {error && (
            <p className="flex max-w-md items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          {phase === 'done' && (
            <div className="w-full max-w-xl space-y-3 rounded-xl bg-slate-100 px-4 py-4 dark:bg-slate-800">
              {score !== null && (
                <div className="text-center">
                  <p
                    className={`text-4xl font-bold ${
                      score >= 90 ? 'text-success-600 dark:text-success-400' : score >= PASS_SCORE ? 'text-primary-600 dark:text-primary-400' : 'text-error-600 dark:text-error-400'
                    }`}
                  >
                    {score}%
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {score >= 90 ? 'Tuyệt vời, rất giống câu mẫu!' : score >= PASS_SCORE ? 'Khá tốt, thử thêm lần nữa cho chuẩn hơn.' : 'Chưa khớp, nghe chậm rồi nhại lại nhé.'}
                  </p>
                </div>
              )}
              {transcript && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  App nghe được: <span className="text-slate-700 dark:text-slate-200">"{transcript}"</span>
                </p>
              )}
              <p className="text-xs text-slate-400">
                Điểm dựa trên nhận dạng giọng nói của trình duyệt nên chỉ để tham khảo. Hãy nghe lại bản thu và so với câu mẫu bằng tai.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {myAudioUrl && (
                  <button onClick={playMine} className={ghostBtn}>
                    <Play className="h-4 w-4" />
                    Nghe giọng của tôi
                  </button>
                )}
                <button onClick={() => listenOnly(false)} className={ghostBtn}>
                  <Volume2 className="h-4 w-4" />
                  Nghe mẫu
                </button>
              </div>
            </div>
          )}

          <div className="flex w-full max-w-xl gap-3">
            {phase === 'done' && (
              <button
                onClick={listenThenRecord}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4" />
                Nhại lại
              </button>
            )}
            <button
              onClick={phase === 'done' ? next : skip}
              disabled={busy}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-colors disabled:opacity-50 ${
                phase === 'done'
                  ? 'bg-primary-600 text-white hover:bg-primary-700 dark:bg-slate-100 dark:text-slate-900'
                  : 'border border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {phase === 'done' ? 'Câu tiếp theo' : 'Bỏ qua'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {isDialogue && dialogue && (
            <div className="w-full max-w-2xl border-t border-slate-200 pt-5 dark:border-slate-800">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {dialogue.title} · lượt {Math.min(index + 1, pool.length)}/{pool.length}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {!playingAll && resumeLine !== null && (
                    <button onClick={playAllFromStart} disabled={phase === 'recording' || phase === 'listening'} className={ghostBtn}>
                      <RotateCcw className="h-4 w-4" />
                      Từ đầu
                    </button>
                  )}
                  <button onClick={playAll} disabled={phase === 'recording' || phase === 'listening'} className={ghostBtn}>
                    {playingAll ? <Square className="h-4 w-4" /> : <MessagesSquare className="h-4 w-4" />}
                    {playingAll ? 'Dừng' : resumeLine !== null ? `Nghe tiếp (câu ${resumeLine + 1})` : 'Nghe cả hội thoại'}
                  </button>
                </div>
              </div>
              <ul className="space-y-2">
                {dialogue.lines.map((l, i) => {
                  const mine = role === 'both' || l.speaker === role;
                  const active = (current as ShItem).lineIdx === i;
                  const playing = playingLine === i;
                  return (
                    <li
                      key={i}
                      id={`shadow-line-${i}`}
                      className={`flex gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                        playing
                          ? 'bg-accent-100 ring-1 ring-accent-400 dark:bg-accent-950/40 dark:ring-accent-500'
                          : active
                          ? 'bg-primary-50 ring-1 ring-primary-300 dark:bg-primary-950/40 dark:ring-primary-700'
                          : mine
                          ? 'bg-slate-50 dark:bg-slate-800/60'
                          : 'bg-transparent'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          l.speaker === 'A' ? 'bg-primary-600 text-white' : 'bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900'
                        }`}
                      >
                        {l.speaker}
                      </span>
                      <span className="flex-1">
                        <span className={`block ${active && !showText ? 'text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {active && !showText ? '••••••' : l.english}
                        </span>
                        <span className="block text-xs text-slate-400">{l.vietnamese}</span>
                      </span>
                      <button
                        onClick={() => {
                          if (phase !== 'recording') {
                            setPlayingAll(false);
                            setPlayingLine(null);
                            setResumeLine(i);
                            speakEnglish(l.english);
                          }
                        }}
                        className="shrink-0 self-center rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700"
                        aria-label="Nghe câu này"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <p className="text-xs text-slate-400">
            Đã nhại: {completed} — Enter: bắt đầu / dừng / câu tiếp
          </p>
        </div>
      </div>
    </div>
  );
}
