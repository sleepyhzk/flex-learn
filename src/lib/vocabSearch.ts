import { INITIAL_VOCAB } from '../data/vocabData';
import type { VocabItem } from './types';

/** Chữ thường, bỏ dấu câu, gọn khoảng trắng. GIỮ dấu để phân biệt "cảm" / "cầm". */
function clean(s: string): string {
  return s
    .normalize('NFC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Bỏ toàn bộ dấu tiếng Việt, đ -> d. */
export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function splitMeaning(meaning: string): string[] {
  return meaning
    .split(/[,;，；、]/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Khớp theo TỪ nguyên vẹn, không khớp giữa chừng một từ. */
function hasWord(haystack: string, needle: string): boolean {
  return ` ${haystack} `.includes(` ${needle} `);
}

/** Khớp phải nhờ bỏ dấu (vd "cảm" ~ "cầm") sẽ bị cộng thêm điểm này để xếp sau. */
const LOOSE = 10;

/**
 * Tìm từ vựng theo từ tiếng Anh hoặc nghĩa tiếng Việt, trả về theo độ khớp (điểm càng thấp càng khớp):
 *  0 từ tiếng Anh khớp hệt | 1 từ tiếng Anh bắt đầu bằng truy vấn | 2 nghĩa khớp hệt (kể cả dấu)
 *  3 từ tiếng Anh chứa truy vấn | 4 nghĩa chứa nguyên từ (có dấu)
 *  LOOSE+1 / +2 / +3: khớp hệt / chứa nguyên từ / mọi từ của truy vấn, sau khi bỏ dấu tiếng Việt
 * Nếu người dùng gõ có dấu và đã có kết quả khớp đúng dấu thì bỏ qua các kết quả "lỏng",
 * để "cảm ơn" không kéo theo "cầm".
 */
export function searchVocab(query: string, vocab: VocabItem[] = INITIAL_VOCAB): VocabItem[] {
  const qTone = clean(query);
  const qBase = normalize(qTone);
  if (!qBase) return [];
  const qTokens = qBase.split(' ');
  const hasAccent = qTone !== qBase;

  const scoreWord = (w: VocabItem): number | null => {
    let best: number | null = null;
    const take = (n: number) => {
      if (best === null || n < best) best = n;
    };

    const word = clean(w.word);
    if (word === qTone) take(0);
    else if (word.startsWith(qTone)) take(1);
    else if (qTone.length >= 2 && word.includes(qTone)) take(3);

    for (const raw of splitMeaning(w.meaning)) {
      const p = clean(raw);
      if (!p) continue;
      const pBase = normalize(p);
      if (p === qTone) take(2);
      else if (qBase.length >= 2 && hasWord(p, qTone)) take(4);
      else if (pBase === qBase) take(LOOSE + 1);
      else if (qBase.length >= 2 && hasWord(pBase, qBase)) take(LOOSE + 2);
      else if (qTokens.length > 1 && qTokens.every((t) => t.length >= 2 && hasWord(pBase, t))) take(LOOSE + 3);
    }
    return best;
  };

  let scored: { w: VocabItem; score: number }[] = [];
  for (const w of vocab) {
    const score = scoreWord(w);
    if (score !== null) scored.push({ w, score });
  }
  if (hasAccent && scored.some((x) => x.score < LOOSE)) {
    scored = scored.filter((x) => x.score < LOOSE);
  }
  scored.sort((a, b) => a.score - b.score || a.w.word.length - b.w.word.length || a.w.id - b.w.id);
  return scored.map((x) => x.w);
}
