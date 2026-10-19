/** Kết quả luyện TOEIC, lưu trên máy (localStorage) và đồng bộ lên Supabase khi đã đăng nhập. */
export interface ToeicRecord {
  /** Điểm cao nhất, phần trăm 0-100. */
  best: number;
  /** Điểm lần làm gần nhất. */
  last: number;
  attempts: number;
  /** Thời điểm làm lần gần nhất (ISO), dùng để chọn bản mới hơn khi gộp. */
  at?: string;
}

export type ToeicProgress = Record<string, ToeicRecord>;

const KEY = 'flex_toeic_v1';
/** Phát ra mỗi khi kết quả được lưu trên máy (để đẩy lên cloud). */
export const TOEIC_SAVED_EVENT = 'flexlearn:toeic-saved';
/** Phát ra khi kết quả bị đổi từ bên ngoài (gộp từ cloud, đăng xuất) để màn Kiểm tra đọc lại. */
export const TOEIC_CHANGED_EVENT = 'flexlearn:toeic-changed';

export function loadToeicProgress(): ToeicProgress {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? (parsed as ToeicProgress) : {};
  } catch {
    return {};
  }
}

export function saveToeicProgress(all: ToeicProgress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(TOEIC_SAVED_EVENT));
}

export function recordToeicResult(key: string, percent: number): ToeicProgress {
  const all = loadToeicProgress();
  const prev = all[key];
  all[key] = { best: Math.max(prev?.best ?? 0, percent), last: percent, attempts: (prev?.attempts ?? 0) + 1, at: new Date().toISOString() };
  saveToeicProgress(all);
  return all;
}

export function clearToeicProgress() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(TOEIC_CHANGED_EVENT));
}
