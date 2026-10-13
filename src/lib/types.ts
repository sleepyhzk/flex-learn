import type { Topic } from '@/data/vocabTopics';

/** Cấp theo khung CEFR; 'extra' = từ ngoài danh sách chuẩn (nhóm "Bổ sung"). */
export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'extra';

export type Pos = 'n' | 'v' | 'adj' | 'adv' | 'prep' | 'conj' | 'pron' | 'det' | 'phrase';

/** Một nghĩa khác của từ nhiều nghĩa. */
export interface Sense {
  /** Nghĩa tiếng Việt. */
  meaning: string;
  /** Hoàn cảnh dùng nghĩa này, vd "kinh doanh", "khi nói về dòng sông". */
  context: string;
  /** Câu ví dụ tiếng Anh. */
  example: string;
}

export interface VocabItem {
  /** Không bao giờ đổi: khóa tiến độ học lưu theo id. */
  id: number;
  word: string;
  pos: Pos;
  /** Phiên âm IPA, có dấu gạch chéo, vd "/rʌn/". */
  ipa: string;
  /** Nghĩa tiếng Việt. */
  meaning: string;
  level: Level;
  topic: Topic;
  /** Câu ví dụ tiếng Anh. */
  example: string;
  /** Nghĩa tiếng Việt của câu ví dụ. */
  exampleVi: string;
  /** Văn bản đưa cho giọng đọc, khi máy đọc sai từ gốc. */
  speak?: string;
  /** Các nghĩa khác (nếu có), kèm hoàn cảnh dùng. */
  senses?: Sense[];
}

export type ReviewQuality = 'easy' | 'good' | 'hard';

export type FlashcardFilter = 'all' | 'hard' | 'good' | 'starred' | Level;

export interface SrsState {
  easiness: number;
  interval: number;
  repetitions: number;
  nextReview: string;
  lastQuality: ReviewQuality;
  lastReviewed: string;
}
