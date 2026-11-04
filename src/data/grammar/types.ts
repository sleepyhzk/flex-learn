/** Cấp của mục Ngữ pháp (không có cấp 'extra' như từ vựng). */
export type GrammarLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface GrammarExample {
  /** Câu tiếng Anh (có nút nghe). */
  en: string;
  /** Nghĩa tiếng Việt. */
  vi: string;
}

/** Một điểm ngữ pháp. Mỗi cấp một file trong src/data/grammar/, nối lại ở src/data/grammarData.ts. */
export interface GrammarPoint {
  /** Không bao giờ đổi, dạng 'a1-be'. */
  id: string;
  level: GrammarLevel;
  title: string;
  /** Một câu tóm tắt, hiện ngay dưới tiêu đề khi thu gọn. */
  summary: string;
  /** Công thức / cấu trúc (mỗi dòng một công thức). */
  forms: string[];
  /** Cách dùng (mỗi dòng một ý). */
  uses: string[];
  /** Ví dụ có kèm nghĩa tiếng Việt. */
  examples: GrammarExample[];
  /** Lưu ý, lỗi hay gặp. */
  notes?: string[];
}

/**
 * Một câu trắc nghiệm của điểm ngữ pháp. Chỗ trống trong câu hỏi viết là ___ .
 * Thứ tự phương án được xáo ngẫu nhiên mỗi lần làm, nên chỉ cần ghi đáp án đúng và 3 đáp án nhiễu.
 */
export interface GrammarQuestion {
  /** Đề bài (chỗ trống là ___ ; có thể kèm gợi ý tiếng Việt trong ngoặc). */
  q: string;
  /** Đáp án đúng. */
  a: string;
  /** Ba đáp án sai (không trùng đáp án đúng). */
  w: [string, string, string];
  /** Giải thích vì sao đáp án đúng là đúng (tiếng Việt), hiện sau khi trả lời. */
  e: string;
  /** Lý do từng đáp án sai là sai, đúng thứ tự với `w`. */
  why: [string, string, string];
}
