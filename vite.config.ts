import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

const SUPABASE_PLACEHOLDER = 'https://YOUR-PROJECT-REF.supabase.co';

/**
 * Header bảo mật (gồm CSP) lấy từ vercel.json, để `npm run build && npm run preview` chạy ở máy bạn
 * với đúng bộ header sẽ chạy trên Vercel. Chỗ giữ chỗ địa chỉ Supabase được thay bằng VITE_SUPABASE_URL trong .env.
 */
function securityHeaders(supabaseUrl: string): Record<string, string> {
  try {
    const cfg = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8')) as {
      headers?: { source: string; headers: { key: string; value: string }[] }[];
    };
    const all = cfg.headers?.find((h) => h.source === '/(.*)')?.headers ?? [];
    let origin = '';
    try {
      origin = supabaseUrl ? new URL(supabaseUrl).origin : '';
    } catch {
      // ignore: URL sai thì giữ nguyên chỗ giữ chỗ
    }
    return Object.fromEntries(all.map((h) => [h.key, origin ? h.value.replace(SUPABASE_PLACEHOLDER, origin) : h.value]));
  } catch {
    return {};
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        // Tách thành các file riêng: sửa mã app không làm trình duyệt phải tải lại thư viện hay kho từ vựng (hàng trăm kB).
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'vendor-react';
            if (id.includes('@supabase')) return 'vendor-supabase';
            if (id.includes('lucide-react')) return 'vendor-icons';
            return undefined;
          }
          if (id.includes('/src/data/vocab/') || id.endsWith('/src/data/vocabData.ts')) return 'data-vocab';
          return undefined;
        },
      },
    },
    // Kho từ vựng (~5.500 từ) tự nó đã lớn hơn mức mặc định 500 kB; nâng ngưỡng để cảnh báo chỉ báo khi có thứ gì thật sự phình ra.
    chunkSizeWarningLimit: 1000,
  },
  preview: {
    headers: securityHeaders(loadEnv(mode, '.', '').VITE_SUPABASE_URL ?? ''),
  },
}));
