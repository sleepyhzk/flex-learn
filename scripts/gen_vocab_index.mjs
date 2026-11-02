// Sinh src/data/vocabIndex.ts: bảng tra gọn (khoảng vài kB) cho phép trang chủ đếm số từ đã thuộc theo từng cấp
// mà KHÔNG phải tải cả kho từ vựng (hàng trăm kB). Cần chạy lại mỗi khi thêm/xóa từ hoặc đổi cấp của từ:
//   npm run gen:vocab        (ghi lại file)
//   npm run check:data       (báo lỗi nếu file đang lỗi thời)
// Cần Node 22.6 trở lên (chạy trực tiếp file .ts bằng --experimental-strip-types).
import { INITIAL_VOCAB } from '../src/data/vocabData.ts';
import { LEVEL_ORDER } from '../src/data/vocabLevels.ts';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const OUT = new URL('../src/data/vocabIndex.ts', import.meta.url);

const maxId = Math.max(...INITIAL_VOCAB.map((w) => w.id));
const levelById = new Array(maxId + 1).fill('-');
const totals = Object.fromEntries(LEVEL_ORDER.map((l) => [l, 0]));
for (const w of INITIAL_VOCAB) {
  const code = LEVEL_ORDER.indexOf(w.level);
  if (code < 0) throw new Error(`Cấp không hợp lệ: ${w.level} (id ${w.id})`);
  if (levelById[w.id] !== '-') throw new Error(`Trùng id ${w.id}`);
  levelById[w.id] = String(code);
  totals[w.level] += 1;
}

// Thứ tự các id trong kho, nén thành các đoạn liên tiếp: "1-870,1001-1700,...".
const ranges = [];
let start = INITIAL_VOCAB[0].id;
let prev = start;
for (const w of INITIAL_VOCAB.slice(1)) {
  if (w.id === prev + 1) {
    prev = w.id;
    continue;
  }
  ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
  start = prev = w.id;
}
ranges.push(start === prev ? `${start}` : `${start}-${prev}`);

const text = `// FILE SINH TỰ ĐỘNG bởi scripts/gen_vocab_index.mjs: đừng sửa tay. Chạy \`npm run gen:vocab\` sau khi đổi dữ liệu từ vựng.
// Bảng tra gọn để trang chủ đếm tiến độ mà không cần tải cả kho từ vựng.

/** Tổng số từ trong kho. */
export const VOCAB_TOTAL = ${INITIAL_VOCAB.length};

/** Số từ của từng cấp. */
export const LEVEL_TOTALS: Record<string, number> = ${JSON.stringify(totals)};

/** Ký tự ở vị trí \`id\` = chỉ số cấp trong LEVEL_ORDER ('0'..'${LEVEL_ORDER.length - 1}'), hoặc '-' nếu không có từ nào mang id đó. */
export const LEVEL_BY_ID = '${levelById.join('')}';

/** Thứ tự các id trong kho (đoạn liên tiếp nén dạng "đầu-cuối"), dùng để chọn "từ mới đầu tiên". */
export const ORDER_RANGES = '${ranges.join(',')}';
`;

if (process.argv.includes('--check')) {
  const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  if (current !== text) {
    console.error('[vocabIndex] src/data/vocabIndex.ts đã lỗi thời so với dữ liệu từ vựng. Chạy: npm run gen:vocab');
    process.exit(1);
  }
  console.log(`[vocabIndex] hợp lệ (${INITIAL_VOCAB.length} từ).`);
} else {
  writeFileSync(OUT, text);
  console.log(`[vocabIndex] đã ghi ${INITIAL_VOCAB.length} từ, ${ranges.length} đoạn thứ tự, ${text.length} ký tự.`);
}
