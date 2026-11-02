import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Khi đóng tab / tắt trình duyệt, request đang gửi sẽ bị hủy trừ khi có cờ `keepalive`.
 * Trình duyệt giới hạn tổng body của request keepalive khoảng 64KB, nên chỉ bật cho request ghi nhỏ;
 * lô lớn vẫn gửi bình thường (dữ liệu vẫn nằm ở localStorage và sẽ được gộp lên cloud ở lần mở sau).
 */
const KEEPALIVE_MAX_BODY = 60_000;
const keepaliveFetch: typeof fetch = (input, init) => {
  const body = init?.body;
  if (typeof body === 'string' && body.length < KEEPALIVE_MAX_BODY) {
    return fetch(input, { ...init, keepalive: true });
  }
  return fetch(input, init);
};

/** null khi chưa cấu hình biến môi trường: web chạy ở chế độ chỉ lưu trên máy. */
export const supabase = url && anonKey ? createClient(url, anonKey, { global: { fetch: keepaliveFetch } }) : null;
export const cloudEnabled = supabase !== null;
