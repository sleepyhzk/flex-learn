import type { VocabRow } from './rows.ts';

/**
 * Cấp B1: mới có vài từ chuyển từ bản mẫu giai đoạn 1; sẽ mở rộng ở lô sau.
 * id bắt đầu từ 2001. id không bao giờ đổi; thêm từ mới thì thêm vào CUỐI danh sách với id kế tiếp.
 * Nghĩa tiếng Việt là bản nháp, cần rà lại.
 */
export const B1_ROWS: VocabRow[] = [
  [2001, "schedule", "n", "/ˈskedʒuːl/", "lịch trình, thời gian biểu", "office", "Please check the schedule.", "Vui lòng kiểm tra lịch trình."],
  [2002, "deadline", "n", "/ˈdedlaɪn/", "hạn chót", "office", "The deadline is Friday.", "Hạn chót là thứ Sáu."],
  [2003, "invoice", "n", "/ˈɪnvɔɪs/", "hóa đơn", "biz", "Please send me the invoice.", "Vui lòng gửi cho tôi hóa đơn."],
  [2004, "candidate", "n", "/ˈkændɪdeɪt/", "ứng viên", "hr", "The candidate has five years of experience.", "Ứng viên có năm năm kinh nghiệm."],
  [2005, "hacker", "n", "/ˈhækər/", "tin tặc", "cyber", "The hacker stole customer data.", "Tin tặc đã đánh cắp dữ liệu khách hàng."],
  [2006, "firewall", "n", "/ˈfaɪərwɔːl/", "tường lửa", "cyber", "The firewall blocks unwanted traffic.", "Tường lửa chặn lưu lượng không mong muốn."],
];
