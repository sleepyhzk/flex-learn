import type { Level } from '@/lib/types';

export type ConversationCategory =
  | 'greeting'
  | 'intro'
  | 'polite'
  | 'help'
  | 'shopping'
  | 'food'
  | 'directions'
  | 'time'
  | 'health'
  | 'daily';

export interface ConversationEntry {
  id: number;
  english: string;
  vietnamese: string;
  category: ConversationCategory;
  /** Mức độ khó của câu (gán tay). */
  level: Exclude<Level, 'extra'>;
}

/** Thứ tự chủ đề hiển thị ở tab Giao tiếp, kèm tên tiếng Việt. */
export const CONVERSATION_CATEGORIES: { key: ConversationCategory; label: string }[] = [
  { key: 'greeting', label: 'Chào hỏi' },
  { key: 'intro', label: 'Giới thiệu bản thân' },
  { key: 'polite', label: 'Cảm ơn & xin lỗi' },
  { key: 'help', label: 'Nhờ giúp đỡ & hiểu ý' },
  { key: 'shopping', label: 'Mua sắm' },
  { key: 'food', label: 'Ăn uống' },
  { key: 'directions', label: 'Hỏi đường & đi lại' },
  { key: 'time', label: 'Thời gian & ngày tháng' },
  { key: 'health', label: 'Sức khoẻ & khẩn cấp' },
  { key: 'daily', label: 'Sinh hoạt & công việc' },
];

/**
 * DỮ LIỆU MẪU của giai đoạn 1 (12 câu). Giai đoạn 4 sẽ viết đủ 100 câu (10 chủ đề x 10 câu).
 * Định dạng mỗi dòng: [chủ đề, mức độ, câu tiếng Anh, nghĩa tiếng Việt].
 */
const RAW: [ConversationCategory, Exclude<Level, 'extra'>, string, string][] = [
  ['greeting', 'A1', 'Hello! How are you?', 'Xin chào! Bạn khỏe không?'],
  ['greeting', 'A1', "I'm fine, thank you. And you?", 'Tôi khỏe, cảm ơn. Còn bạn?'],
  ['greeting', 'A2', "Long time no see! How's it going?", 'Lâu rồi không gặp! Dạo này thế nào?'],
  ['intro', 'A1', 'My name is Lan.', 'Tên tôi là Lan.'],
  ['intro', 'A1', 'Nice to meet you.', 'Rất vui được gặp bạn.'],
  ['polite', 'A1', 'Thank you very much.', 'Cảm ơn bạn rất nhiều.'],
  ['polite', 'A1', "I'm sorry. I'm late.", 'Xin lỗi. Tôi đến trễ.'],
  ['help', 'A1', 'Could you say that again, please?', 'Bạn có thể nhắc lại được không?'],
  ['shopping', 'A1', 'How much is this?', 'Cái này bao nhiêu tiền?'],
  ['directions', 'A2', 'Excuse me, where is the bus stop?', 'Xin lỗi, trạm xe buýt ở đâu vậy?'],
  ['food', 'A1', "I'd like a cup of coffee, please.", 'Cho tôi một tách cà phê.'],
  ['daily', 'B1', "I'll send you the report by Friday.", 'Tôi sẽ gửi báo cáo cho bạn trước thứ Sáu.'],
];

export const CONVERSATION_SENTENCES: ConversationEntry[] = RAW.map(
  ([category, level, english, vietnamese], i) => ({
    id: i + 1,
    category,
    level,
    english,
    vietnamese,
  })
);
