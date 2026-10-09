/** Chuẩn hóa để so từ: chữ thường, nháy cong -> nháy thẳng, gọn khoảng trắng, bỏ dấu câu cuối. */
export function normalizeAnswer(s: string): string {
  return s
    .normalize('NFC')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:]+$/g, '');
}

/** Câu trả lời gõ vào có đúng chính tả không (không phân biệt hoa thường, bỏ dấu câu cuối). */
export function isSpellingCorrect(input: string, word: { word: string }): boolean {
  return normalizeAnswer(input) === normalizeAnswer(word.word);
}

/** Gợi ý độ dài: "run" -> "_ _ _", "thank you" -> "_ _ _ _ _   _ _ _". Dấu nháy và gạch nối được giữ lại. */
export function maskWord(word: string): string {
  return word
    .split(' ')
    .map((part) =>
      [...part].map((ch) => (/[\p{L}\p{N}]/u.test(ch) ? '_' : ch)).join(' ')
    )
    .join('   ');
}
