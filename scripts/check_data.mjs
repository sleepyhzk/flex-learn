// Kiểm tra dữ liệu từ vựng và câu giao tiếp. Chạy:  npm run check:data
// Cần Node 22.6 trở lên (chạy trực tiếp file .ts bằng --experimental-strip-types).
import { INITIAL_VOCAB, LEVEL_ORDER } from '../src/data/vocabData.ts';
import { TOPICS } from '../src/data/vocabTopics.ts';
import { CONVERSATION_SENTENCES } from '../src/data/conversationData.ts';
import { vocabKey } from '../src/lib/vocabKey.ts';

const ID_RANGE = { A1: [1, 999], A2: [1001, 1999], B1: [2001, 2999], extra: [3001, 3999] };
const POS = new Set(['n', 'v', 'adj', 'adv', 'prep', 'conj', 'pron', 'det', 'phrase']);
const topicKeys = new Set(TOPICS.map((t) => t.key));

const errors = [];
const warns = [];
const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);

const ids = new Map();
const keys = new Map();
const wordPos = new Map();

for (const w of INITIAL_VOCAB) {
  const tag = `#${w.id} "${w.word}"`;
  if (ids.has(w.id)) err(`id trùng: ${tag} và "${ids.get(w.id)}"`);
  ids.set(w.id, w.word);
  const k = vocabKey(w);
  if (keys.has(k)) err(`khóa trùng: ${k}`);
  keys.set(k, true);

  const wp = `${w.word.toLowerCase()}|${w.pos}`;
  if (wordPos.has(wp)) err(`cùng từ và cùng loại từ xuất hiện hai lần: ${tag} (${w.pos}), trùng với #${wordPos.get(wp)}`);
  wordPos.set(wp, w.id);

  for (const f of ['word', 'ipa', 'meaning', 'example', 'exampleVi']) {
    if (typeof w[f] !== 'string' || w[f].trim() === '') err(`trường trống "${f}": ${tag}`);
    else if (w[f] !== w[f].trim()) err(`thừa khoảng trắng đầu/cuối ở "${f}": ${tag}`);
  }
  if (!topicKeys.has(w.topic)) err(`chủ đề không hợp lệ "${w.topic}": ${tag}`);
  if (!POS.has(w.pos)) err(`loại từ không hợp lệ "${w.pos}": ${tag}`);
  if (!LEVEL_ORDER.includes(w.level)) err(`cấp không hợp lệ "${w.level}": ${tag}`);
  else {
    const [lo, hi] = ID_RANGE[w.level];
    if (w.id < lo || w.id > hi) err(`id ngoài khoảng của cấp ${w.level} (${lo}-${hi}): ${tag}`);
  }
  if (!/^\/[^/]+\/$/.test(w.ipa)) err(`IPA phải có dạng /.../ : ${tag} -> ${w.ipa}`);
  if (!/[.!?]$/.test(w.example)) warn(`câu ví dụ không kết thúc bằng dấu câu: ${tag}`);
  if (!/[.!?]$/.test(w.exampleVi)) warn(`nghĩa câu ví dụ không kết thúc bằng dấu câu: ${tag}`);

  // Câu ví dụ nên chứa từ đó (cho phép biến thể: bỏ 2 chữ cuối, vd "buses", "studies")
  if (!['det', 'pron', 'phrase'].includes(w.pos)) {
    const stem = w.word.toLowerCase().slice(0, Math.max(3, w.word.length - 2));
    if (!w.example.toLowerCase().includes(stem)) warn(`câu ví dụ có vẻ không chứa từ: ${tag} -> "${w.example}"`);
  }
}

const cids = new Set();
for (const c of CONVERSATION_SENTENCES) {
  if (cids.has(c.id)) err(`câu giao tiếp trùng id: ${c.id}`);
  cids.add(c.id);
  if (!c.english.trim() || !c.vietnamese.trim()) err(`câu giao tiếp #${c.id} có trường trống`);
}

// Thống kê
const byLevel = Object.fromEntries(LEVEL_ORDER.map((l) => [l, INITIAL_VOCAB.filter((w) => w.level === l).length]));
console.log(`Từ vựng: ${INITIAL_VOCAB.length}`, byLevel);
console.log('Theo chủ đề:');
for (const t of TOPICS) {
  const n = INITIAL_VOCAB.filter((w) => w.topic === t.key).length;
  console.log(`  ${t.key.padEnd(8)} ${String(n).padStart(4)}  ${t.label}`);
}
console.log(`Câu giao tiếp: ${CONVERSATION_SENTENCES.length}`);

if (warns.length) {
  console.log(`\nCảnh báo (${warns.length}):`);
  warns.slice(0, 40).forEach((m) => console.log('  - ' + m));
  if (warns.length > 40) console.log(`  ... và ${warns.length - 40} cảnh báo nữa`);
}
if (errors.length) {
  console.log(`\nLỖI (${errors.length}):`);
  errors.forEach((m) => console.log('  - ' + m));
  process.exit(1);
}
console.log('\nDữ liệu hợp lệ.');
