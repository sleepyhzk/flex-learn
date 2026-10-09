import type { VocabItem } from './types';

/**
 * Khóa dùng để lưu tiến độ học và dấu sao: `từ#id` (vd "run#11", "run#23").
 * Cùng một từ có nhiều loại từ nên mỗi loại là một thẻ riêng; id không bao giờ đổi
 * nên khóa vẫn đúng khi sửa phiên âm, nghĩa hay câu ví dụ.
 */
export function vocabKey(w: Pick<VocabItem, 'id' | 'word'>): string {
  return `${w.word}#${w.id}`;
}

/**
 * Từ đã đổi chữ (sửa chính tả, đổi dạng viết): khóa tiến độ / dấu sao cũ -> khóa mới.
 * Thêm một dòng vào đây mỗi khi đổi `word` của một từ đã có người học, để không mất dữ liệu đã lưu.
 * Ví dụ: 'e-mail#210': 'email#210'.
 */
const RENAMED: Record<string, string> = {};
const renameKey = (k: string) => RENAMED[k] ?? k;

/** Văn bản đưa cho giọng đọc: dùng `speak` khi máy đọc sai từ gốc. */
export function speechText(w: { word: string; speak?: string }): string {
  return w.speak ?? w.word;
}

/** Áp bảng RENAMED lên dữ liệu đã lưu (tiến độ hoặc dấu sao). Khóa mới đã có thì ưu tiên dữ liệu của khóa mới. */
export function migrateKeys<T>(rawMap: Record<string, T>): Record<string, T> {
  const out: Record<string, T> = {};
  for (const [k, v] of Object.entries(rawMap)) {
    const nk = renameKey(k);
    if (!(nk in out) || nk === k) out[nk] = v;
  }
  return out;
}

export function migrateKeySet(set: Set<string>): Set<string> {
  return new Set([...set].map(renameKey));
}
