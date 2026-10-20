-- Chạy toàn bộ file này trong Supabase -> SQL Editor.
-- Flex Learn dùng CHUNG project Supabase với Hán Tự (chung tài khoản đăng nhập) nhưng có bảng riêng,
-- nên file này chỉ tạo các bảng mới (flex_progress, flex_starred, flex_study_days, flex_games, flex_toeic, flex_toeic_review) và không đụng vào bảng của Hán Tự
-- (user_progress, user_starred).
-- Mỗi người dùng chỉ đọc/ghi được dòng của chính mình (Row Level Security).

create table if not exists public.flex_progress (
  user_id     uuid        not null references auth.users (id) on delete cascade,
  card_key    text        not null,          -- khóa thẻ dạng 'từ#id', vd 'run#278' (run động từ) và 'run#1001' (run danh từ)
  state       jsonb       not null,          -- SrsState: easiness, interval, repetitions, nextReview, ...
  reviewed_at timestamptz not null,          -- lastReviewed, dùng để chọn bản mới hơn khi gộp
  primary key (user_id, card_key)
);

create table if not exists public.flex_starred (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  card_key   text        not null,
  starred    boolean     not null,           -- false = đã bỏ sao (giữ lại để đồng bộ giữa các thiết bị)
  updated_at timestamptz not null,
  primary key (user_id, card_key)
);

-- Streak: số giây học mỗi ngày (khóa day dạng 'YYYY-MM-DD' theo giờ địa phương của người học).
create table if not exists public.flex_study_days (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  day        text        not null,
  seconds    integer     not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

-- Tiến độ trò chơi: mỗi chủ đề một dòng (data = { lessons: [...], best: {...} }).
create table if not exists public.flex_games (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  topic_key  text        not null,
  data       jsonb       not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, topic_key)
);

-- Điểm luyện TOEIC: mỗi Part một dòng (part_key = 'p1'...'p7' hoặc 'mix'; data = { best, last, attempts, at }).
create table if not exists public.flex_toeic (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  part_key   text        not null,
  data       jsonb       not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, part_key)
);

alter table public.flex_toeic enable row level security;

drop policy if exists "own flex toeic" on public.flex_toeic;
create policy "own flex toeic" on public.flex_toeic
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

alter table public.flex_study_days enable row level security;
alter table public.flex_games      enable row level security;

drop policy if exists "own flex study days" on public.flex_study_days;
create policy "own flex study days" on public.flex_study_days
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "own flex games" on public.flex_games;
create policy "own flex games" on public.flex_games
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

alter table public.flex_progress enable row level security;
alter table public.flex_starred  enable row level security;

drop policy if exists "own flex progress" on public.flex_progress;
create policy "own flex progress" on public.flex_progress
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "own flex starred" on public.flex_starred;
create policy "own flex starred" on public.flex_starred
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Ôn tập TOEIC: câu đã làm sai + lịch sử các lượt làm bài, mỗi mục một dòng.
--   item_key = 'w:<id đơn vị>:<vị trí câu>' (kind 'wrong')   -> một câu đã sai; deleted = true nghĩa là đã bỏ khỏi danh sách ôn
--   item_key = 's:<id lượt làm>'            (kind 'session') -> một lượt làm bài (app chỉ giữ 10 lượt mới nhất)
-- updated_at là thời điểm của chính mục đó (không phải lúc ghi), dùng để chọn bản mới hơn khi gộp giữa các thiết bị.
create table if not exists public.flex_toeic_review (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  item_key   text        not null,
  kind       text        not null check (kind in ('wrong', 'session')),
  data       jsonb       not null default '{}'::jsonb,
  deleted    boolean     not null default false,
  updated_at timestamptz not null,
  primary key (user_id, item_key)
);

create index if not exists flex_toeic_review_kind_idx
  on public.flex_toeic_review (user_id, kind, updated_at desc);

alter table public.flex_toeic_review enable row level security;

drop policy if exists "own flex toeic review" on public.flex_toeic_review;
create policy "own flex toeic review" on public.flex_toeic_review
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
