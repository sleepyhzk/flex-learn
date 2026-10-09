import type { Level, VocabItem } from '@/lib/types';
import { rowsToItems } from './vocab/rows.ts';
import { A1_ROWS } from './vocab/a1.ts';
import { A2_ROWS } from './vocab/a2.ts';
import { B1_ROWS } from './vocab/b1.ts';
import { EXTRA_ROWS } from './vocab/extra.ts';

/** Nhãn hiển thị của từng cấp. 'extra' = từ ngoài danh sách chuẩn A1-B1 (TOEIC nâng cao, an ninh mạng...). */
export const LEVEL_LABEL: Record<Level, string> = {
  A1: 'A1',
  A2: 'A2',
  B1: 'B1',
  extra: 'Bổ sung',
};

/** Thứ tự các cấp khi hiển thị. */
export const LEVEL_ORDER: Level[] = ['A1', 'A2', 'B1', 'extra'];

/**
 * Dữ liệu từ vựng, mỗi cấp một file trong src/data/vocab/ (khoảng id: A1 1-999, A2 1001-1999,
 * B1 2001-2999, Bổ sung 3001-3999).
 *
 * Quy ước (giữ nguyên từ bản Hán Tự):
 *  - `id` không bao giờ đổi. Khóa tiến độ là `từ#id`, nên cùng một từ có nhiều loại từ
 *    (run: động từ và danh từ) là hai thẻ riêng.
 *  - Thêm từ mới: thêm vào CUỐI file của cấp đó với id kế tiếp, không chèn giữa, không dùng lại id cũ.
 *  - Muốn đổi chữ của một từ đã có người học: ghi vào bảng RENAMED trong lib/vocabKey.ts.
 *  - Nghĩa tiếng Việt là bản nháp, cần rà lại.
 *  - Chạy `npm run check:data` sau mỗi lần sửa dữ liệu.
 */
export const INITIAL_VOCAB: VocabItem[] = [
  ...rowsToItems(A1_ROWS, 'A1'),
  ...rowsToItems(A2_ROWS, 'A2'),
  ...rowsToItems(B1_ROWS, 'B1'),
  ...rowsToItems(EXTRA_ROWS, 'extra'),
];

export const VOCAB_BY_LEVEL: Record<Level, VocabItem[]> = {
  A1: INITIAL_VOCAB.filter((w) => w.level === 'A1'),
  A2: INITIAL_VOCAB.filter((w) => w.level === 'A2'),
  B1: INITIAL_VOCAB.filter((w) => w.level === 'B1'),
  extra: INITIAL_VOCAB.filter((w) => w.level === 'extra'),
};
