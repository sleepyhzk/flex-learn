/**
 * Phần nhỏ của thống kê TOEIC mà phần lõi của app (đồng bộ khi đăng xuất...) cần.
 * Tách khỏi toeicStats.ts vì file đó kéo theo cả ngân hàng đề TOEIC (hàng trăm kB): import nó từ phần lõi
 * làm cả ngân hàng đề bị nhét vào file JS tải đầu tiên dù người dùng chưa mở mục TOEIC.
 */
export const TOEIC_STATS_KEY = 'flex_toeic_stats_v1';

export function clearToeicStats() {
  try {
    localStorage.removeItem(TOEIC_STATS_KEY);
  } catch {
    // ignore
  }
}
