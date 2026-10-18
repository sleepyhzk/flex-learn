# Flex Learn

Web tự học tiếng Anh (giao tiếp hằng ngày, TOEIC, từ vựng an ninh mạng). Vite + React + TypeScript + Tailwind, đăng nhập và đồng bộ bằng Supabase (chung project và tài khoản với Hán Tự, bảng riêng `flex_progress`, `flex_starred`), deploy Vercel. Dựng từ khung của Hán Tự.

## Trạng thái

Đã có:
- SRS (SM-2), tiến độ, dấu sao, đăng nhập, đồng bộ Supabase, chế độ tối: giữ nguyên từ Hán Tự, đổi tên khóa lưu.
- Flashcard (menu "Flashcard"): mặt trước từ + loại từ + phiên âm IPA, mặt sau nghĩa + câu ví dụ; lọc theo cấp A1/A2/B1/B2/C1/Bổ sung và theo chủ đề; có "Nghĩa khác", hình động minh họa và chế độ Ôn tập.
- Từ vựng (menu "Từ vựng"): danh sách từ theo cấp và chủ đề, trắc nghiệm chọn nghĩa / chọn từ.
- Giao tiếp: 486 câu theo 14 chủ đề và 5 cấp (A1 đến C1), có phát âm.
- Nghe chép và Shadowing (dùng chung dữ liệu câu giao tiếp và hội thoại). Nghe chép mặc định KHÔNG tự đọc; có công tắc "Tự đọc khi sang câu mới" (localStorage `flex_dictation_autoplay`). Shadowing có 16 hội thoại: 2 talk show phỏng vấn (id 13, 14) và 2 đoạn độc thoại một người nói (id 15, 16); "Nghe cả hội thoại" dừng được và nghe tiếp đúng câu đang đọc.
- Thanh bên (máy tính) thu gọn thành cột biểu tượng nhỏ bằng nút ở góc thanh bên, lưu ở localStorage `flex_sidebar`. Dây đèn lồng hồng ở mép trên (`src/components/Lanterns.tsx`, chỉ máy tính). Hiệu ứng nổi khi rê chuột dùng lớp `.lift` và `.lift-nav` trong `src/index.css`.
- Trang chủ: mỗi cấp hiện rõ số từ thuộc rồi (lần ôn gần nhất là good/easy), chưa thuộc (hard) và chưa học. Thẻ Chuỗi học (streak): đạt 15 phút mỗi ngày thì tính một ngày; thời gian đếm khi ở các mục học (không tính trang chủ), tab đang mở và có thao tác trong 60 giây qua; lưu ở localStorage `flex_study_time_v1` (`src/lib/studyTime.ts`, `src/hooks/useStudyTime.ts`), chưa đồng bộ Supabase.
- Icon app: `public/favicon.svg` (đèn lồng san hô trên nền indigo), các bản PNG và `public/manifest.webmanifest` để thêm vào màn hình chính.
- Độ sáng: thanh kéo 60% đến 130% ở phần cài đặt (thanh bên, hoặc biểu tượng bánh răng trên điện thoại), lưu ở localStorage `flex_brightness`; áp bằng CSS filter lên thẻ html (`src/hooks/useBrightness.ts`).
- Trò chơi (menu "Trò chơi"): chọn một chủ đề, rồi chọn một bài 10 từ (dễ đến khó); trong bài có phần học (hình minh họa, nghĩa khác) và 4 trò Trắc nghiệm, Ghép cặp, Nghe và chọn, Xếp chữ chỉ dùng từ của bài đó. Tiến độ bài học và điểm cao lưu ở localStorage (`flex_games_v1`), chưa đồng bộ Supabase. Mã ở `src/views/GamesView.tsx` và `src/views/games/`.
- Chính tả: xem nghĩa tiếng Việt, gõ từ tiếng Anh.
- Tra cứu: tìm theo từ tiếng Anh hoặc nghĩa tiếng Việt.
- Giọng đọc tiếng Anh (Web Speech API, ưu tiên giọng Natural/Neural), script tạo mp3 bằng `npm run audio`.
- Giao diện giấy kẻ ô tông trắng xanh lavender (nền `#f4f2fb`, chữ `#1d1a30`, chủ đạo indigo `#3b2a9c` và `#705ceb`, đèn lồng san hô viền vàng), màu lấy theo web học tiếng Nhật, có dòng chữ lớn chạy dọc ở nền bên phải (màn hình từ 1400px, sửa chữ ở `src/App.tsx`, kiểu ở `.bg-quote` trong `src/index.css`); chế độ tối nền gần đen ngả tím, thẻ tím than, màu chủ đạo violet, nhấn hồng, đèn lồng đỏ viền vàng (biến màu ở `src/index.css`, khối `.dark`).

Đã bỏ: luyện viết Hán tự, luyện gõ pinyin, bộ tách từ và phân tích câu tiếng Trung.

**Dữ liệu (giai đoạn 2, lô 8):** 5.570 từ, nghĩa tiếng Việt là bản nháp cần rà. Cấp đã được chuyển theo danh sách Oxford 3000 (American, theo cấp CEFR): số từ từng cấp xem bằng `npm run check:data` (TOEIC 700+ và an ninh mạng chuyên sâu, không có trong Oxford). Từ nào không có trong Oxford thì giữ cấp tự gán. Bảng chuyển cấp nằm ở `src/data/vocab/levelOverrides.ts`: id và khóa tiến độ giữ nguyên, chỉ trường `level` đổi. Câu giao tiếp: 486 câu (14 chủ đề, A1 đến C1), tự soạn; nghĩa khác (senses) cho 170 từ cũng do AI soạn, nghĩa là bản nháp cần rà.

Dữ liệu nằm trong `src/data/vocab/` (một file mỗi cấp). Khoảng id: A1 1-999, A2 1001-1999 và 6001-6999, B1 2001-2999 và 5001-5999, Bổ sung 3001-3999, B2 4001-4999 và 7001-7999, C1 8001-8999 và 9001-9999 (hết khoảng đầu thì dùng khoảng sau). Thêm từ mới vào cuối file với id kế tiếp (cấp thật của từ = cấp của file, trừ khi có trong bảng chuyển cấp). Sau mỗi lần sửa chạy `npm run check:data` (kiểm tra id và khóa trùng, trường trống, chủ đề, loại từ, định dạng IPA, câu ví dụ).

## Cấu trúc dữ liệu

`src/lib/types.ts`: `VocabItem { id, word, pos, ipa, meaning, level, topic, example, exampleVi, speak?, senses? }`.
Khóa tiến độ: `word#id` (`src/lib/vocabKey.ts`). 23 chủ đề ở `src/data/vocabTopics.ts`, chia 4 nhóm: giao tiếp hằng ngày, TOEIC & công việc, an ninh mạng, học thuật.

## Chạy và deploy

Xem `HUONG_DAN_TRIEN_KHAI.md`.

Cần Node 22.6 trở lên (để chạy `npm run check:data`).
