-- Chạy toàn bộ file này trong Supabase -> SQL Editor.
-- Flex Learn dùng CHUNG project Supabase với Hán Tự (chung tài khoản đăng nhập) nhưng có bảng riêng,
-- nên file này chỉ tạo các bảng mới (flex_progress, flex_starred, flex_study_days, flex_games) và không đụng vào bảng của Hán Tự
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
