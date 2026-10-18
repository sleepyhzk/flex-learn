import { supabase } from './supabase';
import type { SrsState } from './types';
import type { StudyMap } from './studyTime';
import type { GameProgress, TopicGameProgress } from './gameProgress';

export type ProgressMap = Record<string, SrsState>;
export type StarEntry = { on: boolean; at: string };
export type StarMeta = Record<string, StarEntry>;

const EPOCH = '1970-01-01T00:00:00.000Z';
export const LEGACY_STAR_TIME = EPOCH;

const time = (iso: string | undefined) => {
  const t = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(t) ? 0 : t;
};

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
  return out;
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
    const { error } = await supabase
      .from('flex_progress')
      .upsert(rows.slice(i, i + 500), { onConflict: 'user_id,card_key' });
    if (error) throw error;
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
    const { error } = await supabase
      .from('flex_starred')
      .upsert(rows.slice(i, i + 500), { onConflict: 'user_id,card_key' });
    if (error) throw error;
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
  return out;
}

export async function pushStudyDays(userId: string, map: StudyMap, days: string[]) {
  if (!supabase || days.length === 0) return;
  const now = new Date().toISOString();
  const rows = days
    .filter((d) => map[d] != null)
    .map((d) => ({ user_id: userId, day: d, seconds: Math.round(map[d]), updated_at: now }));
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await supabase
      .from('flex_study_days')
      .upsert(rows.slice(i, i + 500), { onConflict: 'user_id,day' });
    if (error) throw error;
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
    if (JSON.stringify(m) !== JSON.stringify(cloud[topic])) toPush.push(topic);
  }
  return { merged, toPush };
}

export async function fetchGames(): Promise<GameProgress> {
  if (!supabase) return {};
  const { data, error } = await supabase.from('flex_games').select('topic_key,data');
  if (error) throw error;
  const out: GameProgress = {};
  for (const r of data ?? []) out[r.topic_key as string] = r.data as TopicGameProgress;
  return out;
}

export async function pushGames(userId: string, map: GameProgress, topics: string[]) {
  if (!supabase || topics.length === 0) return;
  const now = new Date().toISOString();
  const rows = topics
    .filter((t) => map[t])
    .map((t) => ({ user_id: userId, topic_key: t, data: map[t], updated_at: now }));
  const { error } = await supabase.from('flex_games').upsert(rows, { onConflict: 'user_id,topic_key' });
  if (error) throw error;
}
