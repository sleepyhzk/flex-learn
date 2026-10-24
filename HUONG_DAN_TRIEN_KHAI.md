# Đưa Flex Learn lên Supabase + Vercel

Flex Learn dùng **chung project Supabase với Hán Tự**: cùng tài khoản đăng nhập, nhưng bảng dữ liệu riêng
(`flex_progress`, `flex_starred`, `flex_study_days`, `flex_games`, `flex_toeic`, `flex_toeic_review`), nên tiến độ hai app không lẫn nhau và nút reset của app này không xóa dữ liệu app kia.

## 1. Tạo bảng cho Flex Learn trong project Hán Tự đang dùng
1. Vào supabase.com, mở project mà Hán Tự đang dùng.
2. SQL Editor, New query, dán toàn bộ `supabase/schema.sql`, bấm Run. File chỉ tạo 6 bảng mới và chính sách bảo mật; không sửa gì ở bảng của Hán Tự.
3. Table Editor: phải thấy thêm `flex_progress`, `flex_starred`, `flex_study_days`, `flex_games`, `flex_toeic` và `flex_toeic_review` (câu đã sai + lịch sử làm bài của mục Ôn tập TOEIC).
   Đã chạy `schema.sql` từ trước thì chạy lại cũng không sao (file dùng `if not exists`), hoặc chỉ chạy riêng đoạn cuối tạo `flex_toeic_review`.
4. Project Settings, API: copy **Project URL** và **anon / publishable key** (cùng giá trị Hán Tự đang dùng). Không dùng service_role.

## 2. Đăng nhập: không cần bật lại, chỉ thêm địa chỉ cho phép
Email và Google đã bật sẵn từ Hán Tự. Chỉ cần cho phép địa chỉ của Flex Learn quay lại sau khi đăng nhập:

Authentication, URL Configuration:
- **Site URL**: giữ nguyên (địa chỉ Hán Tự). Không đổi.
- **Redirect URLs**: thêm `http://localhost:5173/**` (nếu chưa có) và, sau khi deploy, `https://<địa-chỉ-vercel-của-flex-learn>/**`.

Google: không cần làm gì thêm, vì redirect URI của Google vẫn là địa chỉ Supabase `.../auth/v1/callback`, dùng chung.

## 3. Chạy thử trên máy
```
npm install
cp .env.example .env.local     # điền URL và key của project Supabase (chung với Hán Tự)
npm run typecheck
npm run check:data
npm run dev
```
Chưa điền `.env.local` thì web vẫn chạy, chỉ lưu tiến độ trên máy và không có nút đăng nhập.

Kiểm tra nhanh:
- Học vài thẻ ở "Từ vựng", mở lại trang: tiến độ còn nguyên.
- Đăng nhập bằng tài khoản Hán Tự đang có (hoặc đăng ký mới): thanh bên hiện "Tiến độ được lưu".
- Chấm một thẻ, vào Supabase, Table Editor, `flex_progress`: có dòng mới với `card_key` dạng `hello#1`.
- Mở Hán Tự cùng tài khoản: tiến độ tiếng Trung không thay đổi.

## 4. Deploy Vercel
1. Đẩy code lên GitHub (repo mới, nhớ commit `package-lock.json`).
2. Vercel, Add New Project, chọn repo. Vercel tự nhận Vite (build: `npm run build`, output: `dist`).
3. Settings, Environment Variables: thêm `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` (cùng giá trị Hán Tự), rồi Deploy.
4. Quay lại bước 2, thêm địa chỉ Vercel của Flex Learn vào Redirect URLs.

## Lưu ý khi dùng chung project
- Đăng ký, đặt lại mật khẩu và gửi email xác nhận: dùng chung mẫu email và cấu hình SMTP của project. Khi mở cho nhiều người, nhớ gắn SMTP riêng (Authentication, SMTP Settings).
- Mẫu email xác nhận của Supabase đang ghi chung chung; nếu muốn ghi tên app, sửa ở Authentication, Email Templates (sẽ áp dụng cho cả hai app).
- Gói Free có giới hạn dung lượng database và số người dùng hoạt động cho cả project, tính chung hai app.

## Cách đồng bộ hoạt động
- Chưa đăng nhập: lưu localStorage.
- Đăng nhập lần đầu: tiến độ và dấu sao trên máy được gộp với tài khoản. Mỗi thẻ lấy bản được ôn gần nhất; dấu sao lấy thay đổi mới nhất.
- Sau đó mỗi lần chấm thẻ hoặc bấm sao sẽ tự đẩy lên sau khoảng 1 giây. Mất mạng thì tự thử lại khi có mạng.
- Đăng xuất: xóa tiến độ trên máy này (dữ liệu vẫn nằm trên tài khoản).
- Nút reset tiến độ chỉ xóa bản trên cloud của Flex Learn.
- Cài đặt giọng đọc và chế độ tối chỉ lưu theo từng thiết bị.
- Khóa thẻ là `từ#id` (vd `run#278`): đừng bao giờ đổi `id` của một từ đã có trong dữ liệu.

## Đăng ký tài khoản: yêu cầu mật khẩu và thời hạn liên kết

Form đăng ký yêu cầu mật khẩu có chữ hoa, chữ thường, chữ số, ký tự đặc biệt và từ 8 ký tự. Đây mới chỉ là kiểm tra ở giao diện, để máy chủ cũng chặn mật khẩu yếu thì vào Supabase: **Authentication > Policies (hoặc Sign In / Providers) > Password requirements** và bật cùng các yêu cầu đó. Vì project này dùng chung với app Hán Tự, thay đổi này áp dụng cho cả hai app.

Thông báo "Liên kết hết hạn sau ..." sau khi đăng ký lấy số từ hằng `LINK_EXPIRY_MINUTES` trong `src/components/AuthModal.tsx` (mặc định 60 phút, bằng mặc định của Supabase). Muốn đổi, sửa **Authentication > Providers > Email > Email OTP Expiration** (đơn vị giây, ví dụ 600 là 10 phút) rồi sửa hằng số cho khớp.
