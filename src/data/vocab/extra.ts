import type { VocabRow } from './rows.ts';

/**
 * Nhóm Bổ sung (TOEIC nâng cao, an ninh mạng...): mới có vài từ mẫu; sẽ mở rộng ở lô sau.
 * id bắt đầu từ 3001. id không bao giờ đổi; thêm từ mới thì thêm vào CUỐI danh sách với id kế tiếp.
 * Nghĩa tiếng Việt là bản nháp, cần rà lại.
 */
export const EXTRA_ROWS: VocabRow[] = [
  [3001, "phishing", "n", "/ˈfɪʃɪŋ/", "lừa đảo qua email, tin nhắn (phishing)", "cyber", "Never click links in phishing emails.", "Đừng bao giờ bấm vào liên kết trong email lừa đảo."],
  [3002, "encrypt", "v", "/ɪnˈkrɪpt/", "mã hóa", "cyber", "We encrypt all customer files.", "Chúng tôi mã hóa mọi tệp của khách hàng."],
  [3003, "vulnerability", "n", "/ˌvʌlnərəˈbɪləti/", "lỗ hổng bảo mật", "cyber", "The team fixed the vulnerability.", "Nhóm đã vá lỗ hổng bảo mật."],
];
