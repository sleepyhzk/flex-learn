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

/** Chuẩn hóa câu cho bài nghe chép: chữ thường, nháy cong -> nháy thẳng, bỏ mọi dấu câu (giữ ' và -), gọn khoảng trắng. */
export function normalizeSentence(s: string): string {
  return s
    .normalize('NFC')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, '-')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}'\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Nghe chép đúng khi các từ khớp, bỏ qua hoa thường và dấu câu. */
export function isDictationCorrect(input: string, answer: string): boolean {
  return normalizeSentence(input) === normalizeSentence(answer);
}

export interface DiffToken {
  text: string;
  ok: boolean;
}

/** So từng từ giữa câu người học gõ và đáp án (LCS). Trả về từ của đáp án (ok = gõ đúng) và từ của người học (ok = có trong đáp án). */
export function diffWords(input: string, answer: string): { answer: DiffToken[]; typed: DiffToken[] } {
  const a = answer.split(/\s+/).filter(Boolean);
  const t = input.split(/\s+/).filter(Boolean);
  const an = a.map(normalizeSentence);
  const tn = t.map(normalizeSentence);
  const m = a.length;
  const n = t.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = an[i] === tn[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const aOk = new Array<boolean>(m).fill(false);
  const tOk = new Array<boolean>(n).fill(false);
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (an[i] === tn[j]) {
      aOk[i] = true;
      tOk[j] = true;
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return {
    answer: a.map((text, k) => ({ text, ok: aOk[k] })),
    typed: t.map((text, k) => ({ text, ok: tOk[k] })),
  };
}

/** Gợi ý số từ của câu: "I am fine." -> "_ _ _". */
export function maskWordCount(sentence: string): string {
  const n = normalizeSentence(sentence).split(' ').filter(Boolean).length;
  return new Array(n).fill('_').join(' ');
}
