# Đưa Flex Learn lên Supabase + Vercel

Flex Learn dùng **chung project Supabase với Hán Tự**: cùng tài khoản đăng nhập, nhưng bảng dữ liệu riêng
(`flex_progress`, `flex_starred`, `flex_study_days`, `flex_games`, `flex_toeic`, `flex_toeic_review`), nên tiến độ hai app không lẫn nhau và nút reset của app này không xóa dữ liệu app kia.

## 1. Tạo bảng cho Flex Learn trong project Hán Tự đang dùng
1. Vào supabase.com, mở project mà Hán Tự đang dùng.
2. SQL Editor, New query, dán toàn bộ `supabase/schema.sql`, bấm Run. File tạo 6 bảng mới, chính sách bảo mật và các trigger chống gian lận (phần cuối file); không sửa gì ở bảng của Hán Tự. Đã chạy bản cũ từ trước thì chạy lại cả file này để cập nhật (an toàn, chạy nhiều lần được; nó cũng dọn các dòng có giá trị bất khả thi đã bị đẩy lên trước đó).
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


## Chống gian lận tiến độ (phía server)

Anon key nằm trong mã web và token đăng nhập nằm trong trình duyệt, nên người dùng có thể gọi thẳng REST API của Supabase và ghi giá trị tùy ý vào dòng của chính họ. RLS chỉ kiểm tra "dòng của ai", không kiểm tra giá trị. Vì vậy `schema.sql` có thêm trigger chạy trên server:

- Kiểm tra hình dạng và kẹp giá trị về khoảng hợp lệ (điểm 0-100, tối đa 12 giờ học mỗi ngày, ...), dựng lại jsonb theo đúng cấu trúc nên không lưu được trường lạ hay dữ liệu khổng lồ.
- Không tin giờ do máy khách gửi: giờ ở tương lai bị kẹp về hiện tại, `updated_at` do server đặt.
- Số giây học chỉ tăng và tăng không nhanh hơn thời gian thực; không có quyền xóa dòng ngày học (nếu xóa được thì ghi lại để né giới hạn).
- Giới hạn số dòng mỗi người (chống làm đầy database gói Free).
- Dòng bị server từ chối (mã lỗi 23514) bị bỏ riêng, không làm hỏng cả lô đẩy lên (`upsertRows` trong `src/lib/cloudSync.ts`).

Giới hạn cần biết: web chấm điểm ở phía máy khách (đáp án nằm sẵn trong mã web), nên server không thể biết người dùng có thật sự làm đúng. Các luật trên chặn giá trị bất khả thi và việc tăng quá nhanh, không chặn được việc "tự khai" một điểm hợp lệ hoặc nhồi lịch sử ngày cũ. Dữ liệu mỗi người chỉ đọc được của chính họ nên hiện chỉ ảnh hưởng đến chính họ; nếu sau này làm bảng xếp hạng thì phải để server tự chấm / tự tính (hàm RPC `security definer`, đóng quyền ghi trực tiếp vào bảng).

Việc nên làm thêm trên Supabase (Dashboard): bật CAPTCHA ở Authentication > Attack Protection để bot không tạo hàng loạt tài khoản; bật yêu cầu mật khẩu mạnh phía server (đã nêu ở trên). Vì dùng chung project với Hán Tự nên các bảng của Hán Tự (`user_progress`, `user_starred`) cũng cần được kiểm tra tương tự.

## CSP và header bảo mật (chống mã độc đọc form đăng nhập)

`vercel.json` đặt Content-Security-Policy và các header bảo mật cho mọi trang. **Việc phải làm một lần:** mở `vercel.json`, thay `https://YOUR-PROJECT-REF.supabase.co` bằng địa chỉ Supabase thật của bạn (đúng giá trị `VITE_SUPABASE_URL`, không dùng `*.supabase.co`). `npm run build` tự chạy `scripts/check_csp.mjs` và dừng nếu quên điền hoặc điền sai.

Chính sách hiện tại: mặc định chặn hết (`default-src 'none'`), chỉ mở đúng từng loại cần dùng.

| Chỉ thị | Giá trị | Vì sao |
| --- | --- | --- |
| `script-src` | `'self'` | Không chạy script inline hay từ domain khác, không `eval`. Đây là lớp chặn XSS chính. |
| `connect-src` | `'self'` + đúng địa chỉ Supabase | Mã độc không `fetch` / WebSocket được tới server của kẻ tấn công. |
| `img-src` | `'self'` | Chặn kiểu gửi dữ liệu bằng `new Image().src = "https://..."`. |
| `form-action` | `'self'` | Chặn đổi `action` của form đăng nhập sang server lạ. |
| `base-uri` | `'none'` | Chặn chèn thẻ `<base>` để bẻ hướng các đường dẫn tương đối. |
| `style-src` / `font-src` | `'self'` + Google Fonts | Chỉ phục vụ phông chữ. Không có `'unsafe-inline'`. |
| `media-src` | `'self' blob:` | File âm thanh và bản ghi nghe lại của Shadowing. |
| `frame-ancestors` | `'none'` | Không cho nhúng web vào iframe (chống clickjacking trên form đăng nhập). |
| `object-src` | `'none'` | Không plugin. |

Để áp dụng được, đã đổi: hai script inline trong `index.html` thành `public/boot.js`, và bỏ `style="..."` viết thẳng trong chuỗi SVG ở `src/data/toeicScenes.ts` (thay bằng class Tailwind). **Đừng thêm lại `<script>` inline hay `style="..."` trong HTML/chuỗi `innerHTML`**: CSP sẽ chặn.

Thử trước khi lên production: `npm run build && npm run preview` (preview dùng đúng header trong `vercel.json`, tự thay địa chỉ Supabase từ `.env.local`), mở DevTools > Console và đi qua các mục (đăng nhập, Google, nghe phát âm, Shadowing, TOEIC có hình). Dòng `Refused to ...` nghĩa là CSP chặn một thứ app đang cần. Muốn chỉ ghi nhận mà không chặn, tạm đổi tên header thành `Content-Security-Policy-Report-Only`.

CSP **không** thay thế được các việc sau:
- Giữ không có lỗ XSS: không dùng `dangerouslySetInnerHTML` với dữ liệu từ người dùng (hiện chỉ dùng cho SVG dựng từ dữ liệu tĩnh trong mã). Không thêm `'unsafe-inline'` / `'unsafe-eval'` để "cho chạy được".
- Chuỗi cung ứng npm: mã độc nằm trong thư viện bị build vào bundle thì chạy như mã của bạn (`'self'`). Khi đó chỉ còn `connect-src` / `img-src` / `form-action` cản đường gửi dữ liệu ra ngoài. Hãy commit `package-lock.json`, deploy bằng `npm ci`, chạy `npm audit`, và xem kỹ khi cập nhật thư viện.
- Token đăng nhập Supabase nằm trong localStorage nên mã JS chạy được trong trang là đọc được. CSP chỉ làm khó việc gửi nó đi, không che nó đi.
- CSP không chặn được điều hướng trang (`location.href = "https://kẻ-tấn-công/?d=..."`) và không chặn việc gửi dữ liệu tới chính Supabase của bạn bằng tài khoản của kẻ tấn công. Vì vậy `connect-src` phải ghi đúng project của bạn, không dùng ký tự đại diện.

Siết thêm nữa (chưa làm vì cần cài thư viện): tự host phông chữ bằng `@fontsource` rồi bỏ `https://fonts.googleapis.com` khỏi `style-src` và `https://fonts.gstatic.com` khỏi `font-src` (không còn phụ thuộc bên thứ ba nào).

## Chia nhỏ file JS (tải trang đầu nhanh hơn)

- `src/App.tsx`: các mục (Flashcard, Trò chơi, TOEIC, Bài học, Hội thoại, Chính tả, Shadowing, Nghe chép, Từ điển) tải riêng khi mở bằng `React.lazy`; sau khi trang chủ hiện, trình duyệt tải sẵn chúng lúc rảnh (bỏ qua nếu bật tiết kiệm dữ liệu).
- `src/lib/toeicStatsStore.ts`: phần nhỏ của thống kê TOEIC mà phần lõi cần. Trước đây phần lõi import `toeicStats.ts` nên cả ngân hàng đề TOEIC bị gộp vào file tải đầu tiên. **Đừng import `toeicStats`, `toeicExplain`, `toeicMock` hay `@/data/toeic*` từ App, hooks, Sidebar, TopBar hoặc HomeView**, nếu không ngân hàng đề lại quay về file đầu.
- `vite.config.ts`: tách `vendor-react`, `vendor-supabase`, `vendor-icons`, `data-vocab` thành file riêng để trình duyệt cache; sửa code app không buộc tải lại các phần này.
- Sau khi deploy bản mới, người đang mở tab cũ có thể gặp lỗi tải mục mới (tên file đã đổi); màn hình "Có lỗi xảy ra" có nút "Tải lại trang" để xử lý.

### Kho từ vựng tải riêng

Trang chủ, thanh bên và thanh trên đếm "đã thuộc / cần củng cố / đến hạn" bằng bảng tra nhỏ `src/data/vocabIndex.ts` (khoảng 10 kB, sinh tự động) và tiến độ đã lưu, nên không phải chờ kho từ vựng (hàng trăm kB). Kho từ vựng tải riêng ở nền; thẻ "Ôn nhanh" chỉ hiện khi nó tải xong (trong lúc chờ có khung xám).

- **Mỗi lần thêm/xóa từ hoặc đổi cấp của từ:** chạy `npm run gen:vocab` để cập nhật `vocabIndex.ts`. `npm run check:data` sẽ báo lỗi nếu quên. Quên thì số liệu trang chủ sẽ lệch và Console báo `vocabIndex.ts đã lỗi thời`.
- Khóa tiến độ có dạng `từ#id`; số liệu trang chủ chỉ dùng phần `id`. Vì vậy **không dùng lại id cũ cho từ khác** (đã là quy ước của kho từ vựng).
- Đừng import `@/data/vocabData` từ App, hooks, Sidebar, TopBar hay HomeView: file tải đầu tiên sẽ lại phình ra. Cần nhãn/thứ tự cấp thì dùng `@/data/vocabLevels`; cần nội dung từ thì dùng `useVocabItem` trong `src/lib/vocabLoader.ts`.
