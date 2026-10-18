import { toLocalDateString } from './srs';

/** Mục tiêu mỗi ngày: 15 phút. */
export const GOAL_SECONDS = 15 * 60;
/** Quá 60 giây không thao tác thì tạm dừng đếm giờ. */
export const IDLE_MS = 60_000;

const KEY = 'flex_study_time_v1';
const KEEP_DAYS = 400;

/** Số giây học theo từng ngày (khóa YYYY-MM-DD theo giờ địa phương). */
export type StudyMap = Record<string, number>;

function load(): StudyMap {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? (parsed as StudyMap) : {};
  } catch {
    return {};
  }
}

// ------------------------------------------------------------------ kho dữ liệu nhỏ (dùng với useSyncExternalStore)
let state: StudyMap = load();
let dirty = false;
/** Các ngày đã đổi từ lần đẩy lên cloud gần nhất. */
const touched = new Set<string>();
const listeners = new Set<() => void>();

export function getStudySnapshot(): StudyMap {
  return state;
}

export function subscribeStudy(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function addStudySeconds(date: string, seconds = 1) {
  state = { ...state, [date]: (state[date] ?? 0) + seconds };
  dirty = true;
  touched.add(date);
  listeners.forEach((l) => l());
}

/** Lấy (và xóa) danh sách ngày cần đẩy lên cloud. */
export function takeTouchedDays(): string[] {
  const days = [...touched];
  touched.clear();
  return days;
}

export function markTouchedDays(days: string[]) {
  days.forEach((d) => touched.add(d));
}

/** Thay toàn bộ dữ liệu bằng bản đã gộp với cloud; pushDays là các ngày cloud còn thiếu hoặc thấp hơn. */
export function replaceStudyMap(map: StudyMap, pushDays: string[] = []) {
  state = { ...map };
  dirty = true;
  markTouchedDays(pushDays);
  listeners.forEach((l) => l());
  flushStudy();
}

/** Xóa dữ liệu học trên máy này (khi đăng xuất). */
export function clearStudy() {
  state = {};
  dirty = false;
  touched.clear();
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

export function flushStudy() {
  if (!dirty) return;
  dirty = false;
  try {
    const keys = Object.keys(state).sort().slice(-KEEP_DAYS);
    const trimmed: StudyMap = {};
    for (const k of keys) trimmed[k] = state[k];
    localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

// ------------------------------------------------------------------ tính streak
const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

function parseDay(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export interface StudyDay {
  key: string;
  label: string;
  seconds: number;
  met: boolean;
  isToday: boolean;
}

export interface StudyStats {
  /** Số ngày liên tiếp đạt mục tiêu. Nếu hôm nay chưa đạt thì vẫn tính đến hôm qua (chuỗi còn sống đến hết ngày). */
  streak: number;
  longest: number;
  todaySeconds: number;
  todayMet: boolean;
  last7: StudyDay[];
}

export function computeStudyStats(map: StudyMap, now: Date = new Date()): StudyStats {
  const met = (key: string) => (map[key] ?? 0) >= GOAL_SECONDS;
  const todayKey = toLocalDateString(now);

  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!met(todayKey)) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (met(toLocalDateString(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  let longest = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const key of Object.keys(map).filter(met).sort()) {
    const d = parseDay(key);
    run = prev && Math.round((d.getTime() - prev.getTime()) / 86_400_000) === 1 ? run + 1 : 1;
    if (run > longest) longest = run;
    prev = d;
  }

  const last7: StudyDay[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const key = toLocalDateString(d);
    last7.push({ key, label: DAY_LABELS[d.getDay()], seconds: map[key] ?? 0, met: met(key), isToday: i === 0 });
  }

  const todaySeconds = map[todayKey] ?? 0;
  return { streak, longest: Math.max(longest, streak), todaySeconds, todayMet: met(todayKey), last7 };
}
