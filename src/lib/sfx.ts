/**
 * Âm thanh hiệu ứng nhỏ (tổng hợp bằng Web Audio, không cần file mp3 hay thư viện ngoài).
 * Bật/tắt bằng nút loa ở thanh trên; lựa chọn được nhớ trên máy.
 */
const KEY = 'flex_sfx_v1';

function load(): boolean {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
}

let enabled = load();
let ctx: AudioContext | null = null;
const listeners = new Set<() => void>();

export const isSfxOn = () => enabled;

export function setSfxOn(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

export function subscribeSfx(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function play(freqs: number[], dur = 0.16) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') void ctx.resume();
    const now = ctx.currentTime;
    for (const f of freqs) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.1, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + dur + 0.02);
    }
  } catch {
    // ignore
  }
}

export const sfx = {
  /** Nhớ rõ: hợp âm E5 G#5 B5. */
  success: () => play([659.25, 830.61, 987.77]),
  /** Quên: C4 A#3. */
  forgot: () => play([261.63, 233.08]),
  /** Chạm nhẹ: C5 G5. */
  chime: () => play([523.25, 783.99]),
};
