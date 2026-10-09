import type { VocabRow } from './rows.ts';

/**
 * Cấp A2: mới có vài từ chuyển từ bản mẫu giai đoạn 1; sẽ mở rộng ở lô sau.
 * id bắt đầu từ 1001. id không bao giờ đổi; thêm từ mới thì thêm vào CUỐI danh sách với id kế tiếp.
 * Nghĩa tiếng Việt là bản nháp, cần rà lại.
 */
export const A2_ROWS: VocabRow[] = [
  [1001, "run", "n", "/rʌn/", "lần chạy bộ", "fun", "I went for a run before work.", "Tôi đi chạy bộ trước giờ làm."],
  [1002, "meeting", "n", "/ˈmiːtɪŋ/", "cuộc họp", "office", "The meeting starts at nine.", "Cuộc họp bắt đầu lúc chín giờ."],
  [1003, "password", "n", "/ˈpæswɜːrd/", "mật khẩu", "cyber", "Use a strong password.", "Hãy dùng mật khẩu mạnh."],
];
