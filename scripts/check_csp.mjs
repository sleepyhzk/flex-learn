// Chạy tự động trước `npm run build` (prebuild). Chặn deploy khi CSP trong vercel.json bị sai hoặc quên điền địa chỉ Supabase.
//   - script-src không được có 'unsafe-inline' / 'unsafe-eval' / dấu *
//   - connect-src phải có đúng địa chỉ Supabase của bạn (không dùng *.supabase.co, vì khi đó mã độc vẫn gửi dữ liệu
//     được sang một project Supabase khác của kẻ tấn công)
import { existsSync, readFileSync } from 'node:fs';

const fail = (msg) => {
  console.error(`\n[check:csp] ${msg}\n`);
  process.exit(1);
};

function readEnvFiles() {
  const out = {};
  for (const f of ['.env', '.env.local', '.env.production', '.env.production.local']) {
    if (!existsSync(f)) continue;
    for (const line of readFileSync(f, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
  return out;
}

const cfg = JSON.parse(readFileSync('vercel.json', 'utf8'));
const headers = cfg.headers?.find((h) => h.source === '/(.*)')?.headers ?? [];
const csp = headers.find((h) => h.key.toLowerCase() === 'content-security-policy')?.value;
if (!csp) fail('vercel.json thiếu header Content-Security-Policy.');

const directives = Object.fromEntries(
  csp.split(';').map((d) => d.trim()).filter(Boolean).map((d) => {
    const [name, ...vals] = d.split(/\s+/);
    return [name, vals];
  })
);

if (!directives['default-src']?.includes("'none'")) fail("default-src phải là 'none'.");
const script = directives['script-src'] ?? [];
for (const bad of ["'unsafe-inline'", "'unsafe-eval'", '*', 'data:', 'blob:', 'http:', 'https:']) {
  if (script.includes(bad)) fail(`script-src không được có ${bad}.`);
}
if (!script.includes("'self'")) fail("script-src phải có 'self'.");

const env = { ...readEnvFiles(), ...process.env };
const supabaseUrl = env.VITE_SUPABASE_URL;
const connect = directives['connect-src'] ?? [];
if (connect.some((v) => v.includes('*'))) fail('connect-src không được dùng ký tự *; hãy ghi đúng địa chỉ project Supabase.');

const onVercel = Boolean(process.env.VERCEL);
if (connect.some((v) => v.includes('YOUR-PROJECT-REF'))) {
  const msg = 'connect-src trong vercel.json còn chỗ giữ chỗ YOUR-PROJECT-REF: thay bằng địa chỉ Supabase của bạn (vd. https://abcd1234.supabase.co).';
  if (onVercel || supabaseUrl) fail(msg);
  console.warn(`[check:csp] ${msg} (bỏ qua vì chưa cấu hình Supabase)`);
} else if (supabaseUrl) {
  let origin;
  try {
    origin = new URL(supabaseUrl).origin;
  } catch {
    fail('VITE_SUPABASE_URL không phải địa chỉ hợp lệ.');
  }
  if (!connect.includes(origin)) fail(`connect-src chưa có ${origin} (VITE_SUPABASE_URL). Sửa vercel.json cho khớp.`);
}
console.log('[check:csp] CSP hợp lệ.');
