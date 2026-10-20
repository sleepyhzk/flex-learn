// Kiểm tra lời giải đáp án sai TOEIC. Chạy:  npm run check:why
// Báo lỗi khi khóa không tồn tại hoặc số lời giải không khớp số đáp án sai; in độ phủ theo từng Part.
import { TOEIC_UNITS } from '../src/data/toeicData';
import { WHY_WRONG } from '../src/data/toeicWhyWrong';

const errors = [];
const cover = {};
const valid = new Set();
for (const [part, units] of Object.entries(TOEIC_UNITS)) {
  cover[part] = { total: 0, done: 0 };
  for (const u of units) {
    u.questions.forEach((q, qi) => {
      const k = `${u.id}:${qi}`;
      valid.add(k);
      cover[part].total += q.wrongs.length;
      const w = WHY_WRONG[k];
      if (!w) return;
      if (w.length !== q.wrongs.length) errors.push(`${k}: có ${w.length} lời giải nhưng có ${q.wrongs.length} đáp án sai`);
      w.forEach((t) => {
        if (typeof t !== 'string' || !t.trim()) errors.push(`${k}: có lời giải rỗng`);
        else cover[part].done += 1;
      });
    });
  }
}
for (const k of Object.keys(WHY_WRONG)) if (!valid.has(k)) errors.push(`${k}: khóa không tồn tại trong đề`);

let t = 0, d = 0;
for (const [p, c] of Object.entries(cover)) {
  console.log(`${p}: ${c.done}/${c.total} đáp án sai có lời giải riêng`);
  t += c.total; d += c.done;
}
console.log(`Tổng: ${d}/${t} (${Math.round((d / t) * 100)}%)`);
if (errors.length) {
  console.error(`\n${errors.length} lỗi:\n` + errors.join('\n'));
  process.exit(1);
}
