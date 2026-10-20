/**
 * Lưu bài làm TOEIC để ôn tập, trên máy (localStorage):
 * - `sessions`: các lượt làm gần đây, giữ lại từng câu với đáp án đã chọn, để xem lại câu nào đúng, câu nào sai.
 * - `wrong`: ngân hàng câu đã làm sai (làm đúng lại thì tự bỏ khỏi danh sách).
 */

/** Một câu trong một lượt làm: đơn vị đề, vị trí câu, thứ tự đáp án đã hiển thị và đáp án đã chọn. */
export interface AnswerLog {
  u: string;
  q: number;
  /** Thứ tự đáp án lúc làm bài (đã xáo trộn). */
  o: string[];
  /** Chỉ số đáp án đã chọn trong `o`, -1 nếu bỏ trống. */
  c: number;
}

export interface SessionLog {
  id: string;
  at: string;
  /** Khóa lượt làm: p1..p7, mix, custom hoặc review. */
  key: string;
  title: string;
  correct: number;
  total: number;
  items: AnswerLog[];
}

export interface WrongEntry extends AnswerLog {
  at: string;
  /** Số lần đã làm sai câu này. */
  times: number;
}

export interface ReviewStore {
  sessions: SessionLog[];
  wrong: Record<string, WrongEntry>;
  /** Câu đã bỏ khỏi danh sách ôn (làm đúng lại hoặc bấm "Đã nắm") kèm thời điểm, để gộp đúng giữa các thiết bị. */
  gone: Record<string, string>;
}

const KEY = 'flex_toeic_review_v1';
const MAX_SESSIONS = 10;
/** Phát ra mỗi khi dữ liệu ôn tập thay đổi (để màn Ôn tập đọc lại). */
export const REVIEW_CHANGED_EVENT = 'flexlearn:toeic-review-changed';
/** Phát ra khi người dùng tự làm thay đổi dữ liệu (để đẩy lên cloud). Gộp từ cloud về thì không phát. */
export const REVIEW_SAVED_EVENT = 'flexlearn:toeic-review-saved';
const MAX_GONE = 800;

export const qKey = (u: string, q: number) => `${u}:${q}`;

export function loadReview(): ReviewStore {
  try {
    const raw = localStorage.getItem(KEY);
    const p = raw ? JSON.parse(raw) : null;
    if (p && typeof p === 'object') {
      return {
        sessions: Array.isArray(p.sessions) ? p.sessions : [],
        wrong: p.wrong && typeof p.wrong === 'object' ? p.wrong : {},
        gone: p.gone && typeof p.gone === 'object' ? p.gone : {},
      };
    }
  } catch {
    // ignore
  }
  return { sessions: [], wrong: {}, gone: {} };
}

/** Ghi vào máy và báo cho màn Ôn tập đọc lại (không đẩy cloud: dùng khi gộp dữ liệu từ cloud về). */
export function saveReview(s: ReviewStore) {
  // Giữ gọn: chỉ nhớ MAX_GONE câu bỏ gần nhất
  const keys = Object.keys(s.gone);
  if (keys.length > MAX_GONE) {
    keys.sort((a, b) => s.gone[b].localeCompare(s.gone[a]));
    s.gone = Object.fromEntries(keys.slice(0, MAX_GONE).map((k) => [k, s.gone[k]]));
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // ignore (đầy bộ nhớ hoặc bị chặn)
  }
  window.dispatchEvent(new Event(REVIEW_CHANGED_EVENT));
}

/** Ghi do người dùng thao tác: lưu rồi báo để đẩy lên cloud. */
function save(s: ReviewStore) {
  saveReview(s);
  window.dispatchEvent(new Event(REVIEW_SAVED_EVENT));
}

/** Ghi lại một lượt làm: thêm vào lịch sử, cập nhật ngân hàng câu sai. */
export function recordSession(s: Omit<SessionLog, 'id' | 'at'>, isCorrect: (a: AnswerLog) => boolean): ReviewStore {
  const store = loadReview();
  const at = new Date().toISOString();
  store.sessions = [{ ...s, id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, at }, ...store.sessions].slice(0, MAX_SESSIONS);
  for (const it of s.items) {
    const k = qKey(it.u, it.q);
    if (isCorrect(it)) {
      // Chỉ cần ghi "đã bỏ" nếu câu này đang nằm trong danh sách ôn
      if (store.wrong[k]) {
        delete store.wrong[k];
        store.gone[k] = at;
      }
    } else {
      store.wrong[k] = { ...it, at, times: (store.wrong[k]?.times ?? 0) + 1 };
      delete store.gone[k];
    }
  }
  save(store);
  return store;
}

export function removeWrong(key: string): ReviewStore {
  const store = loadReview();
  if (store.wrong[key]) {
    delete store.wrong[key];
    store.gone[key] = new Date().toISOString();
  }
  save(store);
  return store;
}

export function clearReview() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(REVIEW_CHANGED_EVENT));
}
