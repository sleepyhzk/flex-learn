export type GameKey = 'quiz' | 'listen' | 'match' | 'scramble';

export interface TopicGameProgress {
  /** Số thứ tự các bài (bắt đầu từ 0) đã học xong. */
  lessons: number[];
  /** Điểm cao nhất của từng trò chơi trong từng bài (khóa là số thứ tự bài), theo phần trăm (0-100). */
  best: Record<string, Partial<Record<GameKey, number>>>;
}

export type GameProgress = Record<string, TopicGameProgress>;

const KEY = 'flex_games_v1';
/** Phát ra mỗi khi tiến độ được lưu trên máy (để đẩy lên cloud). */
export const GAMES_SAVED_EVENT = 'flexlearn:games-saved';
/** Phát ra khi tiến độ bị đổi từ bên ngoài (gộp từ cloud, đăng xuất) để màn Trò chơi đọc lại. */
export const GAMES_CHANGED_EVENT = 'flexlearn:games-changed';

export function clearGameProgress() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(GAMES_CHANGED_EVENT));
}

export function loadGameProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as GameProgress) : {};
  } catch {
    return {};
  }
}

export function saveGameProgress(p: GameProgress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(GAMES_SAVED_EVENT));
}
