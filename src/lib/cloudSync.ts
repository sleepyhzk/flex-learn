import { supabase } from './supabase';
import type { SrsState } from './types';
import type { StudyMap } from './studyTime';
import type { GameProgress, TopicGameProgress } from './gameProgress';
import type { ToeicProgress, ToeicRecord } from './toeicProgress';
import type { ReviewStore, SessionLog, WrongEntry } from './toeicReview';
import {
  MAX_SKEW_MS,
  sanitizeGames,
  sanitizeSession,
  sanitizeSrs,
  sanitizeStudy,
  sanitizeToeic,
  sanitizeWrongEntry,
  stable,
} from './sanitize';

export type ProgressMap = Record<string, SrsState>;
export type StarEntry = { on: boolean; at: string };
export type StarMeta = Record<string, StarEntry>;

const EPOCH = '1970-01-01T00:00:00.000Z';
export const LEGACY_STAR_TIME = EPOCH;

/** Giờ ISO -> mili giây. Giờ ở tương lai quá 5 phút bị kéo về hiện tại, để một mốc giờ giả (vd. năm 2099) không thắng mọi lần gộp. */
const time = (iso: string | undefined) => {
  const t = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(t) ? 0 : Math.min(t, Date.now() + MAX_SKEW_MS);
};

/**
 * Upsert theo lô, nhưng nếu server từ chối (lỗi 23514 = vi phạm luật kiểm tra trong schema.sql) thì chia đôi lô để tìm đúng dòng xấu
 * và bỏ riêng dòng đó. Nếu không, một dòng bị từ chối sẽ làm cả lô (tối đa 500 dòng) thất bại và bị đẩy lại mãi.
 * Lỗi khác (mất mạng, hết phiên...) vẫn được ném ra để lần sau thử lại.
 */
async function upsertRows(table: string, rows: Record<string, unknown>[], onConflict: string): Promise<void> {
  if (!supabase || rows.length === 0) return;
  const { error } = await supabase.from(table).upsert(rows, { onConflict });
  if (!error) return;
  if (error.code === '23514' && rows.length > 1) {
    const mid = Math.ceil(rows.length / 2);
    await upsertRows(table, rows.slice(0, mid), onConflict);
    await upsertRows(table, rows.slice(mid), onConflict);
    return;
  }
  if (error.code === '23514') return; // dòng duy nhất bị từ chối: bỏ, không thử lại
  throw error;
}

/** Gộp tiến độ: với mỗi thẻ lấy bản được ôn gần nhất. toPush = thẻ chỉ có ở máy hoặc mới hơn trên cloud. */
export function mergeProgress(local: ProgressMap, cloud: ProgressMap) {
  const merged: ProgressMap = { ...cloud };
  const toPush: string[] = [];
  for (const [key, l] of Object.entries(local)) {
    const c = cloud[key];
    if (!c || time(l.lastReviewed) > time(c.lastReviewed)) {
      merged[key] = l;
      toPush.push(key);
    }
  }
  return { merged, toPush };
}

/** Gộp dấu sao theo thời điểm thay đổi gần nhất của từng thẻ. */
export function mergeStars(local: StarMeta, cloud: StarMeta) {
  const merged: StarMeta = { ...cloud };
  const toPush: string[] = [];
  for (const [key, l] of Object.entries(local)) {
    const c = cloud[key];
    if (!c || time(l.at) > time(c.at)) {
      merged[key] = l;
      // Dấu sao cũ chưa có thời gian mà cloud không có: chỉ đẩy lên nếu thật sự đang bật.
      if (!c && !l.on) continue;
      toPush.push(key);
    }
  }
  return { merged, toPush };
}

const PAGE = 1000;

export async function fetchProgress(): Promise<ProgressMap> {
  if (!supabase) return {};
  const out: ProgressMap = {};
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('flex_progress')
      .select('card_key,state')
      .order('card_key')
      .range(from, from + PAGE - 1);
    if (error) throw error;
    for (const r of data ?? []) out[r.card_key as string] = r.state as SrsState;
    if (!data || data.length < PAGE) break;
  }
  return sanitizeSrs(out);
}

export async function pushProgress(userId: string, map: ProgressMap, keys: string[]) {
  if (!supabase || keys.length === 0) return;
  const rows = keys
    .filter((k) => map[k])
    .map((k) => ({
      user_id: userId,
      card_key: k,
      state: map[k],
      reviewed_at: map[k].lastReviewed,
    }));
  for (let i = 0; i < rows.length; i += 500) {
    await upsertRows('flex_progress', rows.slice(i, i + 500), 'user_id,card_key');
  }
}

export async function deleteAllProgress(userId: string) {
  if (!supabase) return;
  const { error } = await supabase.from('flex_progress').delete().eq('user_id', userId);
  if (error) throw error;
}

export async function fetchStars(): Promise<StarMeta> {
  if (!supabase) return {};
  const out: StarMeta = {};
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('flex_starred')
      .select('card_key,starred,updated_at')
      .order('card_key')
      .range(from, from + PAGE - 1);
    if (error) throw error;
    for (const r of data ?? []) {
      out[r.card_key as string] = { on: r.starred as boolean, at: r.updated_at as string };
    }
    if (!data || data.length < PAGE) break;
  }
  return out;
}

export async function pushStars(userId: string, meta: StarMeta, keys: string[]) {
  if (!supabase || keys.length === 0) return;
  const rows = keys
    .filter((k) => meta[k])
    .map((k) => ({
      user_id: userId,
      card_key: k,
      starred: meta[k].on,
      updated_at: meta[k].at === EPOCH ? new Date().toISOString() : meta[k].at,
    }));
  for (let i = 0; i < rows.length; i += 500) {
    await upsertRows('flex_starred', rows.slice(i, i + 500), 'user_id,card_key');
  }
}

// ------------------------------------------------------------------ streak (số giây học mỗi ngày)

/** Gộp thời gian học: mỗi ngày lấy số giây lớn hơn (số giây chỉ tăng, nên không mất dữ liệu khi học trên 2 máy). */
export function mergeStudy(local: StudyMap, cloud: StudyMap) {
  const merged: StudyMap = { ...cloud };
  const toPush: string[] = [];
  for (const [day, sec] of Object.entries(local)) {
    if (sec > (cloud[day] ?? 0)) {
      merged[day] = sec;
      toPush.push(day);
    }
  }
  return { merged, toPush };
}

export async function fetchStudyDays(): Promise<StudyMap> {
  if (!supabase) return {};
  const out: StudyMap = {};
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('flex_study_days')
      .select('day,seconds')
      .order('day')
      .range(from, from + PAGE - 1);
    if (error) throw error;
    for (const r of data ?? []) out[r.day as string] = r.seconds as number;
    if (!data || data.length < PAGE) break;
  }
  return sanitizeStudy(out);
}

export async function pushStudyDays(userId: string, map: StudyMap, days: string[]) {
  if (!supabase || days.length === 0) return;
  const now = new Date().toISOString();
  const rows = days
    .filter((d) => map[d] != null)
    .map((d) => ({ user_id: userId, day: d, seconds: Math.round(map[d]), updated_at: now }));
  for (let i = 0; i < rows.length; i += 500) {
    await upsertRows('flex_study_days', rows.slice(i, i + 500), 'user_id,day');
  }
}

// ------------------------------------------------------------------ tiến độ trò chơi (mỗi chủ đề một dòng)

function mergeTopic(a: TopicGameProgress | undefined, b: TopicGameProgress | undefined): TopicGameProgress {
  const lessons = [...new Set([...(a?.lessons ?? []), ...(b?.lessons ?? [])])].sort((x, y) => x - y);
  const best: TopicGameProgress['best'] = {};
  for (const src of [a?.best ?? {}, b?.best ?? {}]) {
    for (const [lesson, games] of Object.entries(src)) {
      const cur = (best[lesson] ??= {});
      for (const [g, v] of Object.entries(games) as [keyof typeof cur, number][]) {
        cur[g] = Math.max(cur[g] ?? 0, v ?? 0);
      }
    }
  }
  return { lessons, best };
}

/** Gộp tiến độ trò chơi: hợp các bài đã học, điểm cao nhất của từng trò lấy giá trị lớn hơn. */
export function mergeGames(local: GameProgress, cloud: GameProgress) {
  const merged: GameProgress = { ...cloud };
  const toPush: string[] = [];
  for (const topic of Object.keys(local)) {
    const m = mergeTopic(local[topic], cloud[topic]);
    merged[topic] = m;
    if (stable(m) !== stable(cloud[topic])) toPush.push(topic);
  }
  return { merged, toPush };
}

export async function fetchGames(): Promise<GameProgress> {
  if (!supabase) return {};
  const { data, error } = await supabase.from('flex_games').select('topic_key,data');
  if (error) throw error;
  const out: GameProgress = {};
  for (const r of data ?? []) out[r.topic_key as string] = r.data as TopicGameProgress;
  return sanitizeGames(out);
}

export async function pushGames(userId: string, map: GameProgress, topics: string[]) {
  if (!supabase || topics.length === 0) return;
  const now = new Date().toISOString();
  const rows = topics
    .filter((t) => map[t])
    .map((t) => ({ user_id: userId, topic_key: t, data: map[t], updated_at: now }));
  await upsertRows('flex_games', rows, 'user_id,topic_key');
}

// ------------------------------------------------------------------ điểm TOEIC (mỗi Part một dòng)

function mergeToeicRecord(a: ToeicRecord | undefined, b: ToeicRecord | undefined): ToeicRecord {
  if (!a) return b!;
  if (!b) return a;
  const newer = time(a.at) >= time(b.at) ? a : b;
  return {
    best: Math.max(a.best, b.best),
    last: newer.last,
    attempts: Math.max(a.attempts, b.attempts),
    at: newer.at ?? a.at ?? b.at,
  };
}

/** Gộp điểm TOEIC: điểm cao nhất lấy giá trị lớn hơn, "gần nhất" lấy bản làm sau cùng. */
export function mergeToeic(local: ToeicProgress, cloud: ToeicProgress) {
  const merged: ToeicProgress = { ...cloud };
  const toPush: string[] = [];
  for (const key of Object.keys(local)) {
    const m = mergeToeicRecord(local[key], cloud[key]);
    merged[key] = m;
    if (stable(m) !== stable(cloud[key])) toPush.push(key);
  }
  return { merged, toPush };
}

export async function fetchToeic(): Promise<ToeicProgress> {
  if (!supabase) return {};
  const { data, error } = await supabase.from('flex_toeic').select('part_key,data');
  if (error) throw error;
  const out: ToeicProgress = {};
  for (const r of data ?? []) out[r.part_key as string] = r.data as ToeicRecord;
  return sanitizeToeic(out);
}

export async function pushToeic(userId: string, map: ToeicProgress, keys: string[]) {
  if (!supabase || keys.length === 0) return;
  const now = new Date().toISOString();
  const rows = keys
    .filter((k) => map[k])
    .map((k) => ({ user_id: userId, part_key: k, data: map[k], updated_at: now }));
  await upsertRows('flex_toeic', rows, 'user_id,part_key');
}

// ------------------------------------------------------------------ ôn tập TOEIC (câu đã sai + lịch sử làm bài)
// Bảng flex_toeic_review, mỗi dòng một mục:
//   item_key 'w:<đơn vị>:<câu>' (kind 'wrong')  = một câu đã sai; deleted = true là "đã bỏ khỏi danh sách ôn".
//   item_key 's:<id>'           (kind 'session') = một lượt làm bài.
// updated_at là thời điểm của chính mục đó (không phải lúc ghi), dùng để chọn bản mới hơn khi gộp.

export interface ReviewRow {
  item_key: string;
  kind: 'wrong' | 'session';
  data: unknown;
  deleted: boolean;
  updated_at: string;
}

const MAX_SESSIONS = 10;
const REVIEW_PAGE = 1000;

/** Chuyển kho ôn tập thành danh sách dòng cloud. */
export function reviewRows(store: ReviewStore): ReviewRow[] {
  const rows: ReviewRow[] = [];
  for (const [k, e] of Object.entries(store.wrong)) rows.push({ item_key: `w:${k}`, kind: 'wrong', data: e, deleted: false, updated_at: e.at });
  for (const [k, at] of Object.entries(store.gone)) rows.push({ item_key: `w:${k}`, kind: 'wrong', data: {}, deleted: true, updated_at: at });
  for (const x of store.sessions) rows.push({ item_key: `s:${x.id}`, kind: 'session', data: x, deleted: false, updated_at: x.at });
  return rows;
}

export async function fetchReview(): Promise<ReviewStore> {
  const out: ReviewStore = { sessions: [], wrong: {}, gone: {} };
  if (!supabase) return out;
  // Các câu sai/đã bỏ: lấy hết (có thể hơn 1000 dòng nên đọc theo trang)
  for (let from = 0; ; from += REVIEW_PAGE) {
    const { data, error } = await supabase
      .from('flex_toeic_review')
      .select('item_key,data,deleted,updated_at')
      .eq('kind', 'wrong')
      .order('item_key')
      .range(from, from + REVIEW_PAGE - 1);
    if (error) throw error;
    for (const r of data ?? []) {
      const k = (r.item_key as string).slice(2);
      if (r.deleted) out.gone[k] = r.updated_at as string;
      else {
        const e = sanitizeWrongEntry(r.data);
        if (e) out.wrong[k] = e;
      }
    }
    if (!data || data.length < REVIEW_PAGE) break;
  }
  // Lượt làm bài: chỉ cần vài lượt mới nhất
  const { data: ses, error: e2 } = await supabase
    .from('flex_toeic_review')
    .select('data')
    .eq('kind', 'session')
    .order('updated_at', { ascending: false })
    .limit(MAX_SESSIONS);
  if (e2) throw e2;
  out.sessions = (ses ?? []).map((r) => sanitizeSession(r.data)).filter((x): x is SessionLog => x !== null);
  return out;
}

/**
 * Gộp ôn tập giữa máy và cloud, từng câu một: bản có thời điểm mới hơn thắng
 * (câu sai mới hơn lần bỏ -> còn trong danh sách; lần bỏ mới hơn -> đã bỏ). Lượt làm bài gộp theo id, giữ 10 lượt mới nhất.
 */
export function mergeReview(local: ReviewStore, cloud: ReviewStore): ReviewStore {
  const merged: ReviewStore = { sessions: [], wrong: {}, gone: {} };
  const keys = new Set([...Object.keys(local.wrong), ...Object.keys(local.gone), ...Object.keys(cloud.wrong), ...Object.keys(cloud.gone)]);
  for (const k of keys) {
    const cands: { t: number; entry?: WrongEntry; at?: string }[] = [];
    if (local.wrong[k]) cands.push({ t: time(local.wrong[k].at), entry: local.wrong[k] });
    if (cloud.wrong[k]) cands.push({ t: time(cloud.wrong[k].at), entry: cloud.wrong[k] });
    if (local.gone[k]) cands.push({ t: time(local.gone[k]), at: local.gone[k] });
    if (cloud.gone[k]) cands.push({ t: time(cloud.gone[k]), at: cloud.gone[k] });
    // Bằng giờ thì ưu tiên mục "còn sai" để không làm mất câu cần ôn
    cands.sort((a, b) => b.t - a.t || (a.entry ? -1 : 1));
    const win = cands[0];
    if (win.entry) merged.wrong[k] = win.entry;
    else if (win.at) merged.gone[k] = win.at;
  }
  const byId = new Map<string, SessionLog>();
  for (const x of [...cloud.sessions, ...local.sessions]) byId.set(x.id, x);
  merged.sessions = [...byId.values()].sort((a, b) => time(b.at) - time(a.at)).slice(0, MAX_SESSIONS);
  return merged;
}

export async function pushReview(userId: string, rows: ReviewRow[]) {
  if (!supabase || rows.length === 0) return;
  for (let i = 0; i < rows.length; i += 200) {
    const batch = rows.slice(i, i + 200).map((r) => ({ ...r, user_id: userId }));
    await upsertRows('flex_toeic_review', batch, 'user_id,item_key');
  }
}

/** Xóa các lượt làm bài cũ trên cloud, chỉ giữ MAX_SESSIONS lượt mới nhất (best effort, lỗi cũng không sao). */
export async function pruneReviewSessions(oldestKept: string) {
  if (!supabase) return;
  await supabase.from('flex_toeic_review').delete().eq('kind', 'session').lt('updated_at', oldestKept);
}
