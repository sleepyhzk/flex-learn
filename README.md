# Flex Learn

Web tự học tiếng Anh (giao tiếp hằng ngày, TOEIC, từ vựng an ninh mạng). Vite + React + TypeScript + Tailwind, đăng nhập và đồng bộ bằng Supabase (chung project và tài khoản với Hán Tự, bảng riêng `flex_progress`, `flex_starred`), deploy Vercel. Dựng từ khung của Hán Tự.

## Trạng thái: giai đoạn 2 đang làm (dữ liệu)

Đã có:
- SRS (SM-2), tiến độ, dấu sao, đăng nhập, đồng bộ Supabase, chế độ tối: giữ nguyên từ Hán Tự, đổi tên khóa lưu.
- Flashcard (menu "Flashcard"): mặt trước từ + loại từ + phiên âm IPA, mặt sau nghĩa + câu ví dụ; lọc theo cấp A1/A2/B1/B2/Bổ sung và theo chủ đề.
- Từ vựng (menu "Từ vựng"): danh sách từ theo cấp và chủ đề, trắc nghiệm chọn nghĩa / chọn từ.
- Giao tiếp: 150 câu theo 10 chủ đề và 3 cấp, có phát âm.
- Chính tả: xem nghĩa tiếng Việt, gõ từ tiếng Anh.
- Tra cứu: tìm theo từ tiếng Anh hoặc nghĩa tiếng Việt.
- Giọng đọc tiếng Anh (Web Speech API, ưu tiên giọng Natural/Neural), script tạo mp3 bằng `npm run audio`.
- Giao diện trắng xanh, tên Flex Learn.

Đã bỏ: luyện viết Hán tự, luyện gõ pinyin, bộ tách từ và phân tích câu tiếng Trung.

**Dữ liệu (giai đoạn 2, lô 8):** 3669 từ, nghĩa tiếng Việt là bản nháp cần rà. Cấp đã được chuyển theo danh sách Oxford 3000 (American, theo cấp CEFR): A1 929 từ, A2 898 từ, B1 889 từ, B2 774 từ, Bổ sung 179 từ (TOEIC 700+ và an ninh mạng chuyên sâu, không có trong Oxford). Từ nào không có trong Oxford thì giữ cấp tự gán. Bảng chuyển cấp nằm ở `src/data/vocab/levelOverrides.ts`: id và khóa tiến độ giữ nguyên, chỉ trường `level` đổi. Câu giao tiếp: 150 câu (10 chủ đề x 15 câu, mỗi chủ đề 6 câu A1, 6 câu A2, 3 câu B1), tự soạn, nghĩa là bản nháp cần rà.

Dữ liệu nằm trong `src/data/vocab/` (một file mỗi cấp). Khoảng id: A1 1-999, A2 1001-1999 và 6001-6999, B1 2001-2999 và 5001-5999, Bổ sung 3001-3999, B2 4001-4999 (hết khoảng đầu thì dùng khoảng sau). Thêm từ mới vào cuối file với id kế tiếp (cấp thật của từ = cấp của file, trừ khi có trong bảng chuyển cấp). Sau mỗi lần sửa chạy `npm run check:data` (kiểm tra id và khóa trùng, trường trống, chủ đề, loại từ, định dạng IPA, câu ví dụ).

## Cấu trúc dữ liệu

`src/lib/types.ts`: `VocabItem { id, word, pos, ipa, meaning, level, topic, example, exampleVi, speak? }`.
Khóa tiến độ: `word#id` (`src/lib/vocabKey.ts`). 19 chủ đề ở `src/data/vocabTopics.ts`, chia 3 nhóm: giao tiếp hằng ngày, TOEIC & công việc, an ninh mạng (bản nháp, chốt ở giai đoạn 2).

## Chạy và deploy

Xem `HUONG_DAN_TRIEN_KHAI.md`.
