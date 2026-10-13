/**
 * Đọc tiếng Anh. Thứ tự ưu tiên:
 *  1) File âm thanh thu sẵn (public/audio/manifest.json, tạo bằng scripts/generate_audio.py)
 *  2) Giọng tốt nhất của trình duyệt/thiết bị (ưu tiên giọng Natural/Neural/Premium),
 *     người dùng có thể chọn giọng và tốc độ trong mục "Giọng đọc".
 */

// ---------------------------------------------------------------- cài đặt

export interface SpeechSettings {
  /** voiceURI của giọng đã chọn; null = tự động chọn giọng tốt nhất */
  voiceURI: string | null;
  rate: number;
}

const SETTINGS_KEY = 'flex_tts_settings_v1';
export const DEFAULT_RATE = 0.9;
export const RATE_MIN = 0.5;
export const RATE_MAX = 1.2;
export const SAMPLE_TEXT = 'Hello, nice to meet you.';

const clampRate = (r: number) => Math.min(RATE_MAX, Math.max(RATE_MIN, r));

function loadSettings(): SpeechSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<SpeechSettings>;
      return {
        voiceURI: typeof p.voiceURI === 'string' ? p.voiceURI : null,
        rate: typeof p.rate === 'number' ? clampRate(p.rate) : DEFAULT_RATE,
      };
    }
  } catch {
    // ignore
  }
  return { voiceURI: null, rate: DEFAULT_RATE };
}

let settings: SpeechSettings = loadSettings();

export function getSpeechSettings(): SpeechSettings {
  return settings;
}

export function setSpeechSettings(patch: Partial<SpeechSettings>): SpeechSettings {
  settings = {
    ...settings,
    ...patch,
    rate: clampRate(patch.rate ?? settings.rate),
  };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
  return settings;
}

// ---------------------------------------------------------------- chọn giọng

export interface VoiceLike {
  name: string;
  lang: string;
  voiceURI: string;
}
export type VoiceQuality = 'natural' | 'high' | 'basic';
export interface RankedVoice<T extends VoiceLike = VoiceLike> {
  voice: T;
  score: number;
  quality: VoiceQuality;
}

function scoreVoice(v: VoiceLike): { score: number; quality: VoiceQuality } | null {
  const lang = v.lang.replace('_', '-').toLowerCase();
  const name = v.name.toLowerCase();
  if (!lang.startsWith('en')) return null;

  // Ưu tiên giọng Mỹ (en-US), rồi Anh (en-GB); các giọng Anh ngữ khác xếp sau.
  let score = lang === 'en-us' ? 30 : lang === 'en-gb' ? 25 : 10;
  let quality: VoiceQuality = 'basic';

  if (/natural|neural/.test(name)) {
    score += 100;
    quality = 'natural';
  } else if (/premium/.test(name)) {
    score += 70;
    quality = 'high';
  } else if (/enhanced/.test(name)) {
    score += 50;
    quality = 'high';
  } else if (/google/.test(name)) {
    score += 45;
    quality = 'high';
  } else if (/microsoft/.test(name)) {
    score += 25;
  } else if (/samantha|alex|daniel|karen|serena/.test(name)) {
    score += 15;
  }
  if (/online/.test(name)) score += 10;
  if (/compact/.test(name)) score -= 10;
  // Giọng "novelty" của macOS (Albert, Bells, Zarvox...) đọc rất khó nghe
  if (/albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|junior|kathy|organ|princess|ralph|trinoids|whisper|zarvox/.test(name)) {
    return null;
  }
  return { score, quality };
}

/** Lọc giọng tiếng Anh và xếp từ tự nhiên nhất xuống kém nhất. */
export function rankEnglishVoices<T extends VoiceLike>(voices: T[]): RankedVoice<T>[] {
  const ranked: RankedVoice<T>[] = [];
  for (const voice of voices) {
    const s = scoreVoice(voice);
    if (s) ranked.push({ voice, ...s });
  }
  return ranked.sort((a, b) => b.score - a.score || a.voice.name.localeCompare(b.voice.name));
}

const hasSynth = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

export function listEnglishVoices(): RankedVoice<SpeechSynthesisVoice>[] {
  if (!hasSynth()) return [];
  return rankEnglishVoices(window.speechSynthesis.getVoices());
}

function pickVoice(): SpeechSynthesisVoice | null {
  const ranked = listEnglishVoices();
  if (settings.voiceURI) {
    const chosen = ranked.find((r) => r.voice.voiceURI === settings.voiceURI);
    if (chosen) return chosen.voice;
  }
  return ranked[0]?.voice ?? null;
}

const voiceListeners = new Set<() => void>();
export function onVoicesChanged(cb: () => void): () => void {
  voiceListeners.add(cb);
  return () => voiceListeners.delete(cb);
}
if (hasSynth()) {
  // Chrome nạp danh sách giọng bất đồng bộ
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    voiceListeners.forEach((cb) => cb());
  });
}

// ---------------------------------------------------------------- file âm thanh thu sẵn

type Manifest = Record<string, string>;
let manifest: Manifest | null = null;
let manifestPromise: Promise<Manifest> | null = null;

const audioUrl = (file: string) => `${import.meta.env.BASE_URL}audio/${file}`;

export function loadAudioManifest(): Promise<Manifest> {
  if (manifestPromise) return manifestPromise;
  manifestPromise = fetch(`${import.meta.env.BASE_URL}audio/manifest.json`)
    .then((res) => (res.ok ? res.json() : {}))
    .then((data: unknown) => {
      const raw =
        data && typeof data === 'object' && 'files' in data
          ? (data as { files: unknown }).files
          : data;
      const files: Manifest = {};
      if (raw && typeof raw === 'object') {
        for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
          if (typeof v === 'string') files[k] = v;
        }
      }
      manifest = files;
      return files;
    })
    .catch(() => {
      manifest = {};
      return {} as Manifest;
    });
  return manifestPromise;
}

export function audioFileCount(): number {
  return manifest ? Object.keys(manifest).length : 0;
}

if (typeof window !== 'undefined') {
  void loadAudioManifest(); // tải sớm để lần bấm loa đầu tiên đã dùng được file thu sẵn
}

// ---------------------------------------------------------------- phát âm

let currentAudio: HTMLAudioElement | null = null;
/** Mỗi lần phát hoặc dừng tăng một đơn vị; onEnd của lần phát cũ bị bỏ qua. */
let playToken = 0;

export interface SpeakOptions {
  /** Nhân với tốc độ đã chọn, vd 0.7 = chậm hơn 30%. */
  rateScale?: number;
  /** Gọi khi đọc xong (không gọi nếu bị dừng hoặc bị thay bằng lần đọc khác). */
  onEnd?: () => void;
}

export function stopSpeaking(): void {
  playToken += 1;
  if (currentAudio) {
    const a = currentAudio;
    currentAudio = null; // đặt null trước để lỗi do pause() không kích hoạt dự phòng
    a.pause();
  }
  if (hasSynth()) window.speechSynthesis.cancel();
}

function speakWithBrowser(text: string, opts: SpeakOptions = {}, token = playToken): void {
  if (!hasSynth()) return;
  const synth = window.speechSynthesis;
  const voice = pickVoice();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voice?.lang || 'en-US';
  if (voice) utterance.voice = voice;
  utterance.rate = Math.min(2, Math.max(0.1, settings.rate * (opts.rateScale ?? 1)));
  utterance.onend = () => {
    if (token === playToken) opts.onEnd?.();
  };
  utterance.pitch = 1;
  utterance.volume = 1;

  // Chrome đôi khi im lặng nếu speak() ngay sau cancel()
  if (synth.speaking || synth.pending) {
    synth.cancel();
    setTimeout(() => synth.speak(utterance), 60);
  } else {
    synth.resume();
    synth.speak(utterance);
  }
}

function playFile(text: string, file: string, opts: SpeakOptions = {}, token = playToken): void {
  const audio = new Audio(audioUrl(file));
  // File được thu ở tốc độ mặc định; thanh tốc độ chỉnh theo tỉ lệ so với mặc định
  audio.playbackRate = Math.min(2, Math.max(0.4, (settings.rate / DEFAULT_RATE) * (opts.rateScale ?? 1)));
  currentAudio = audio;

  const fallback = () => {
    if (currentAudio === audio) {
      currentAudio = null;
      speakWithBrowser(text, opts, token);
    }
  };
  audio.addEventListener('ended', () => {
    if (token === playToken) opts.onEnd?.();
  });
  audio.addEventListener('error', fallback, { once: true });
  audio.play().catch(fallback);
}

/** Đọc to một từ hoặc câu tiếng Anh. */
export function speakEnglish(text: string, opts: SpeakOptions = {}): void {
  if (typeof window === 'undefined') return;
  stopSpeaking();
  const token = playToken;
  const file = manifest?.[text];
  if (file) {
    playFile(text, file, opts, token);
  } else {
    speakWithBrowser(text, opts, token);
  }
}

export function speakSample(): void {
  speakEnglish(SAMPLE_TEXT);
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && ('speechSynthesis' in window || 'Audio' in window);
}
