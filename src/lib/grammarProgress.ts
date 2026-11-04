/**
 * Kết quả bài tập Ngữ pháp, lưu trên máy (localStorage). Khóa là id của điểm ngữ pháp.
 * Chỉ giữ điểm cao nhất của mỗi điểm.
 */
export interface GrammarQuizRecord {
  /** Số câu đúng cao nhất. */
  best: number;
  /** Tổng số câu của lần làm đạt điểm cao nhất. */
  total: number;
}

export type GrammarQuizProgress = Record<string, GrammarQuizRecord>;

const KEY = 'flex_grammar_quiz_v1';

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

export function loadGrammarProgress(): GrammarQuizProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const data: unknown = JSON.parse(raw);
    if (!isObj(data)) return {};
    const out: GrammarQuizProgress = {};
    for (const [id, v] of Object.entries(data)) {
      if (!isObj(v)) continue;
      const { best, total } = v;
      if (typeof best !== 'number' || typeof total !== 'number') continue;
      if (!Number.isInteger(best) || !Number.isInteger(total) || total < 1 || total > 100 || best < 0 || best > total) continue;
      out[id] = { best, total };
    }
    return out;
  } catch {
    return {};
  }
}

/** Ghi kết quả một lần làm; trả về tiến độ mới (chỉ nâng điểm cao nhất, không hạ). */
export function recordGrammarResult(id: string, score: number, total: number): GrammarQuizProgress {
  const all = loadGrammarProgress();
  const old = all[id];
  const better = !old || score / total > old.best / old.total;
  if (better) all[id] = { best: score, total };
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* localStorage không dùng được: bỏ qua */
  }
  return all;
}
