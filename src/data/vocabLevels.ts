import type { Level } from '@/lib/types';

// Nhãn và thứ tự cấp nằm riêng ở đây (file nhỏ) để phần lõi của app dùng được mà không kéo theo cả kho từ vựng
// (hàng trăm kB). vocabData.ts vẫn xuất lại hai hằng này nên các nơi import cũ không bị ảnh hưởng.

/** Nhãn hiển thị của từng cấp. 'extra' = từ ngoài danh sách chuẩn A1-B1 (TOEIC nâng cao, an ninh mạng...). */
export const LEVEL_LABEL: Record<Level, string> = {
  A1: 'A1',
  A2: 'A2',
  B1: 'B1',
  B2: 'B2',
  C1: 'C1',
  extra: 'Bổ sung',
};

/** Thứ tự các cấp khi hiển thị. */
export const LEVEL_ORDER: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'extra'];
