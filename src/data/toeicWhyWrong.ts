/**
 * Lời giải cho từng đáp án SAI của các câu TOEIC.
 * Khóa: `${id đơn vị}:${vị trí câu trong đơn vị}`  (ví dụ "p5-1:0").
 * Giá trị: mảng cùng thứ tự với `wrongs` của câu đó (đáp án đúng KHÔNG có ở đây, lời giải đúng nằm ở `why`).
 * Dữ liệu chia theo Part ở thư mục `whywrong/`. Câu nào chưa có mục sẽ hiện lời giải chung theo dạng bài
 * (xem src/lib/toeicExplain.ts). Chạy `npm run check:why` để kiểm tra độ phủ và số lượng khớp.
 */
import { WW_P1 } from './whywrong/p1';
import { WW_P2A } from './whywrong/p2a';
import { WW_P2B } from './whywrong/p2b';
import { WW_P2C } from './whywrong/p2c';
import { WW_P3 } from './whywrong/p3';
import { WW_P4 } from './whywrong/p4';
import { WW_P5A } from './whywrong/p5a';
import { WW_P5B } from './whywrong/p5b';
import { WW_P5C } from './whywrong/p5c';
import { WW_P5D } from './whywrong/p5d';
import { WW_P6 } from './whywrong/p6';
import { WW_P7 } from './whywrong/p7';

export const WHY_WRONG: Record<string, string[]> = {
  ...WW_P1,
  ...WW_P2A,
  ...WW_P2B,
  ...WW_P2C,
  ...WW_P3,
  ...WW_P4,
  ...WW_P5A,
  ...WW_P5B,
  ...WW_P5C,
  ...WW_P5D,
  ...WW_P6,
  ...WW_P7,
};
