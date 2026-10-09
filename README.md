# Flex Learn

Web tự học tiếng Anh (giao tiếp hằng ngày, TOEIC, từ vựng an ninh mạng). Vite + React + TypeScript + Tailwind, đăng nhập và đồng bộ bằng Supabase (chung project và tài khoản với Hán Tự, bảng riêng `flex_progress`, `flex_starred`), deploy Vercel. Dựng từ khung của Hán Tự.

## Trạng thái: giai đoạn 2 đang làm (dữ liệu)

Đã có:
- SRS (SM-2), tiến độ, dấu sao, đăng nhập, đồng bộ Supabase, chế độ tối: giữ nguyên từ Hán Tự, đổi tên khóa lưu.
- Flashcard: mặt trước từ + loại từ + phiên âm IPA, mặt sau nghĩa + câu ví dụ; lọc theo cấp A1/A2/B1/Bổ sung và theo chủ đề.
- Bài học: danh sách từ theo cấp và chủ đề, trắc nghiệm chọn nghĩa / chọn từ.
- Giao tiếp: khung nhóm câu theo chủ đề và cấp.
- Chính tả: xem nghĩa tiếng Việt, gõ từ tiếng Anh.
- Tra cứu: tìm theo từ tiếng Anh hoặc nghĩa tiếng Việt.
- Giọng đọc tiếng Anh (Web Speech API, ưu tiên giọng Natural/Neural), script tạo mp3 bằng `npm run audio`.
- Giao diện trắng xanh, tên Flex Learn.

Đã bỏ: luyện viết Hán tự, luyện gõ pinyin, bộ tách từ và phân tích câu tiếng Trung.

**Dữ liệu (giai đoạn 2, lô 1):** 343 từ A1 cho giao tiếp hằng ngày (tự soạn, nghĩa tiếng Việt là bản nháp cần rà), cùng 12 từ mẫu ở A2, B1 và Bổ sung. Từ TOEIC và an ninh mạng sẽ làm ở các lô sau. Câu giao tiếp vẫn là 12 câu mẫu (giai đoạn 4).

Dữ liệu nằm trong `src/data/vocab/` (một file mỗi cấp). Khoảng id: A1 1-999, A2 1001-1999, B1 2001-2999, Bổ sung 3001-3999. Thêm từ mới vào cuối file với id kế tiếp. Sau mỗi lần sửa chạy `npm run check:data` (kiểm tra id và khóa trùng, trường trống, chủ đề, loại từ, định dạng IPA, câu ví dụ).

## Cấu trúc dữ liệu

`src/lib/types.ts`: `VocabItem { id, word, pos, ipa, meaning, level, topic, example, exampleVi, speak? }`.
Khóa tiến độ: `word#id` (`src/lib/vocabKey.ts`). 19 chủ đề ở `src/data/vocabTopics.ts`, chia 3 nhóm: giao tiếp hằng ngày, TOEIC & công việc, an ninh mạng (bản nháp, chốt ở giai đoạn 2).

## Chạy và deploy

Xem `HUONG_DAN_TRIEN_KHAI.md`.
