/**
 * Yêu cầu các nơi đang giữ dữ liệu chờ đẩy lên Supabase (tiến độ flashcard, dấu sao) đẩy ngay,
 * không đợi hết thời gian gom. Gọi khi người dùng chuyển sang mục khác.
 */
export const FLUSH_SYNC_EVENT = 'flex:flush-sync';

export function requestFlushSync(): void {
  window.dispatchEvent(new Event(FLUSH_SYNC_EVENT));
}

/** Gom các lần thay đổi trong tối đa chừng này mili giây rồi mới đẩy lên Supabase một lần. */
export const CLOUD_PUSH_DELAY_MS = 10_000;
