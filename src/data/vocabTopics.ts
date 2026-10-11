import type { VocabItem } from '@/lib/types';

/**
 * Chủ đề từ vựng. Mỗi từ thuộc đúng một chủ đề, ghi ngay trong trường `topic` của từ.
 * Nhóm đầu: giao tiếp hằng ngày. Nhóm sau: TOEIC (office, biz, hr, tech) và an ninh mạng (cyber).
 * Danh sách này là bản nháp của giai đoạn 1; sẽ chốt lại ở giai đoạn 2 khi nhập dữ liệu thật.
 */
export type Topic =
  | 'greet'
  | 'time'
  | 'people'
  | 'food'
  | 'shop'
  | 'travel'
  | 'place'
  | 'home'
  | 'health'
  | 'nature'
  | 'fun'
  | 'feel'
  | 'verb'
  | 'grammar'
  | 'school'
  | 'general'
  | 'office'
  | 'biz'
  | 'hr'
  | 'tech'
  | 'cyber'
  | 'academic'
  | 'society';

export type TopicGroup = 'daily' | 'toeic' | 'cyber' | 'academic';

export const TOPICS: { key: Topic; label: string; group: TopicGroup }[] = [
  { key: 'greet', label: 'Chào hỏi & xã giao', group: 'daily' },
  { key: 'time', label: 'Số đếm, thời gian & lịch', group: 'daily' },
  { key: 'people', label: 'Gia đình & con người', group: 'daily' },
  { key: 'food', label: 'Ăn uống', group: 'daily' },
  { key: 'shop', label: 'Mua sắm & tiền bạc', group: 'daily' },
  { key: 'travel', label: 'Giao thông & du lịch', group: 'daily' },
  { key: 'place', label: 'Nơi chốn & phương hướng', group: 'daily' },
  { key: 'home', label: 'Nhà cửa, đồ dùng & quần áo', group: 'daily' },
  { key: 'health', label: 'Sức khỏe & cơ thể', group: 'daily' },
  { key: 'nature', label: 'Thiên nhiên & thời tiết', group: 'daily' },
  { key: 'fun', label: 'Giải trí & thể thao', group: 'daily' },
  { key: 'feel', label: 'Cảm xúc & tính cách', group: 'daily' },
  { key: 'verb', label: 'Động từ thường dùng', group: 'daily' },
  { key: 'grammar', label: 'Từ chức năng & ngữ pháp', group: 'daily' },
  { key: 'school', label: 'Trường học & học tập', group: 'daily' },
  { key: 'general', label: 'Từ thông dụng khác', group: 'daily' },
  { key: 'office', label: 'Văn phòng & công việc (TOEIC)', group: 'toeic' },
  { key: 'biz', label: 'Kinh doanh & tài chính (TOEIC)', group: 'toeic' },
  { key: 'hr', label: 'Tuyển dụng & nhân sự (TOEIC)', group: 'toeic' },
  { key: 'tech', label: 'Công nghệ & thiết bị', group: 'toeic' },
  { key: 'cyber', label: 'An ninh mạng', group: 'cyber' },
  { key: 'academic', label: 'Học thuật & tư duy', group: 'academic' },
  { key: 'society', label: 'Xã hội, môi trường & tin tức', group: 'academic' },
];

export const TOPIC_LABEL = Object.fromEntries(TOPICS.map((t) => [t.key, t.label])) as Record<Topic, string>;

export function topicOf(word: Pick<VocabItem, 'topic'>): Topic {
  return word.topic;
}
