// Kiểm tra bài tập Ngữ pháp. Chạy:  npm run check:grammar
// Cần Node 22.6 trở lên (chạy trực tiếp file .ts bằng --experimental-strip-types).
import { GRAMMAR_BY_LEVEL, GRAMMAR_LEVELS, GRAMMAR_EXERCISES } from '../src/data/grammarData.ts';

const errors = [];
const err = (m) => errors.push(m);
const ids = new Set();
let total = 0;

for (const l of GRAMMAR_LEVELS) {
  for (const p of GRAMMAR_BY_LEVEL[l]) {
    ids.add(p.id);
    const qs = GRAMMAR_EXERCISES[p.id];
    if (!qs || qs.length === 0) {
      err(`${p.id}: chưa có bài tập`);
      continue;
    }
    if (qs.length < 5) err(`${p.id}: chỉ có ${qs.length} câu (nên từ 5 câu)`);
    const seen = new Set();
    qs.forEach((q, i) => {
      total++;
      const tag = `${p.id} câu ${i + 1}`;
      for (const f of ['q', 'a', 'e']) if (typeof q[f] !== 'string' || q[f].trim() === '') err(`${tag}: trường "${f}" trống`);
      if (!Array.isArray(q.w) || q.w.length !== 3) return err(`${tag}: cần đúng 3 đáp án sai`);
      if (!Array.isArray(q.why) || q.why.length !== 3 || q.why.some((x) => typeof x !== 'string' || x.trim() === '')) err(`${tag}: cần đủ 3 lý do sai (why)`);
      const all = [q.a, ...q.w];
      if (new Set(all.map((x) => x.trim().toLowerCase())).size !== 4) err(`${tag}: các phương án bị trùng nhau: ${all.join(' | ')}`);
      if (all.some((x) => x !== x.trim() || x === '')) err(`${tag}: phương án trống hoặc thừa khoảng trắng`);
      if (q.q.split('___').length > 2) err(`${tag}: nhiều hơn một chỗ trống`);
      if (seen.has(q.q)) err(`${tag}: đề bài trùng`);
      seen.add(q.q);
    });
  }
}
for (const id of Object.keys(GRAMMAR_EXERCISES)) if (!ids.has(id)) err(`${id}: có bài tập nhưng không có điểm ngữ pháp tương ứng`);

if (errors.length) {
  console.error(`Lỗi (${errors.length}):\n- ` + errors.join('\n- '));
  process.exit(1);
}
console.log(`OK: ${ids.size} điểm ngữ pháp, ${total} câu hỏi.`);
