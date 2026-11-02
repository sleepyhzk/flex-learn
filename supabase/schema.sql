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


-- =====================================================================================
-- CHỐNG GIAN LẬN / DỮ LIỆU RÁC (chạy lại nhiều lần vẫn an toàn)
-- =====================================================================================
-- Vì sao cần: chính sách RLS ở trên chỉ kiểm tra "dòng này của ai" (user_id = auth.uid()), KHÔNG kiểm tra giá trị.
-- Anon key nằm trong mã web, token đăng nhập nằm trong trình duyệt, nên ai cũng gọi thẳng REST API của Supabase
-- để ghi dữ liệu tùy ý vào dòng của mình (seconds = 99999999, điểm 100%, jsonb khổng lồ, ngày ở tương lai...).
-- Các trigger bên dưới chạy trên server nên không thể bị bỏ qua từ trình duyệt:
--   * kiểm tra hình dạng dữ liệu, kẹp giá trị về khoảng hợp lệ, dựng lại jsonb theo đúng cấu trúc (không lưu trường lạ);
--   * không tin giờ do máy khách gửi (không cho ngày/giờ ở tương lai), giờ ghi (updated_at) do server đặt;
--   * số giây học: tối đa 12 giờ/ngày, chỉ được tăng, tăng không nhanh hơn thời gian thực trôi qua;
--   * giới hạn số dòng và dung lượng mỗi người (chống làm đầy database).
-- Giới hạn: web chấm điểm ở phía máy khách nên server KHÔNG thể biết người dùng có thật sự làm đúng hay không.
-- Phần này chỉ chặn giá trị bất khả thi, dữ liệu rác và tăng tốc quá nhanh; muốn chống tuyệt đối (bảng xếp hạng thật)
-- thì phải để server tự chấm / tự tính (RPC), xem ghi chú trong HUONG_DAN_TRIEN_KHAI.md.
-- Chạy bằng SQL Editor (vai trò postgres) hoặc service_role thì không bị các trigger này chặn, để bạn còn sửa tay được.

-- ---------------------------------------------------------------- hàm phụ
create or replace function public.flex_safe_date(t text) returns date
language plpgsql stable as $$
begin
  if t is null or t !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' then return null; end if;
  return t::date;
exception when others then
  return null;
end $$;

create or replace function public.flex_safe_ts(t text) returns timestamptz
language plpgsql stable as $$
begin
  if t is null or length(t) > 40 then return null; end if;
  return t::timestamptz;
exception when others then
  return null;
end $$;

-- Dựng lại SrsState từ dữ liệu người dùng gửi; trả về null nếu sai hình dạng.
create or replace function public.flex_norm_progress(s jsonb) returns jsonb
language plpgsql stable as $$
declare
  v_ease numeric;
  v_int  numeric;
  v_rep  numeric;
  v_next date;
  v_last timestamptz;
  v_q    text;
begin
  if s is null or jsonb_typeof(s) <> 'object' then return null; end if;
  if coalesce(jsonb_typeof(s->'easiness'), '')     <> 'number'
     or coalesce(jsonb_typeof(s->'interval'), '')     <> 'number'
     or coalesce(jsonb_typeof(s->'repetitions'), '')  <> 'number'
     or coalesce(jsonb_typeof(s->'nextReview'), '')   <> 'string'
     or coalesce(jsonb_typeof(s->'lastQuality'), '')  <> 'string'
     or coalesce(jsonb_typeof(s->'lastReviewed'), '') <> 'string' then
    return null;
  end if;
  v_ease := (s->>'easiness')::numeric;
  v_int  := (s->>'interval')::numeric;
  v_rep  := (s->>'repetitions')::numeric;
  v_next := public.flex_safe_date(s->>'nextReview');
  v_last := public.flex_safe_ts(s->>'lastReviewed');
  v_q    := s->>'lastQuality';
  if v_next is null or v_last is null or v_q not in ('easy', 'good', 'hard') then return null; end if;

  v_ease := least(5, greatest(1.3, v_ease));
  v_int  := least(36500, greatest(0, round(v_int)));
  v_rep  := least(1000, greatest(0, round(v_rep)));
  v_last := least(v_last, now() + interval '5 minutes');
  v_next := least(v_next, current_date + 36500);

  return jsonb_build_object(
    'easiness', round(v_ease, 4),
    'interval', v_int,
    'repetitions', v_rep,
    'nextReview', to_char(v_next, 'YYYY-MM-DD'),
    'lastQuality', v_q,
    'lastReviewed', to_char(v_last at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
  );
end $$;

-- Dựng lại { lessons: [...], best: { "<bài>": { quiz|listen|match|scramble: 0-100 } } }.
create or replace function public.flex_norm_game(d jsonb) returns jsonb
language plpgsql stable as $$
declare
  v_lessons jsonb;
  v_best    jsonb;
begin
  if d is null or jsonb_typeof(d) <> 'object' or octet_length(d::text) > 20000 then return null; end if;
  if coalesce(jsonb_typeof(d->'lessons'), '') <> 'array' then
    v_lessons := '[]'::jsonb;
  else
    select coalesce(jsonb_agg(n order by n), '[]'::jsonb) into v_lessons
    from (
      select distinct (e)::int as n
      from jsonb_array_elements_text(d->'lessons') as e
      where e ~ '^[0-9]{1,3}$'
      limit 500
    ) s;
  end if;

  if coalesce(jsonb_typeof(d->'best'), '') <> 'object' then
    v_best := '{}'::jsonb;
  else
    select coalesce(jsonb_object_agg(l.key, coalesce(g.obj, '{}'::jsonb)), '{}'::jsonb) into v_best
    from jsonb_each(d->'best') as l(key, val)
    left join lateral (
      select jsonb_object_agg(k.key, least(100, (k.val #>> '{}')::int)) as obj
      from jsonb_each(case when jsonb_typeof(l.val) = 'object' then l.val else '{}'::jsonb end) as k(key, val)
      where k.key in ('quiz', 'listen', 'match', 'scramble')
        and jsonb_typeof(k.val) = 'number'
        and (k.val #>> '{}') ~ '^[0-9]{1,3}$'
    ) g on true
    where l.key ~ '^[0-9]{1,3}$' and jsonb_typeof(l.val) = 'object';
  end if;

  return jsonb_build_object('lessons', v_lessons, 'best', v_best);
end $$;

-- Dựng lại { best, last, attempts, at? } của điểm TOEIC.
create or replace function public.flex_norm_toeic(d jsonb) returns jsonb
language plpgsql stable as $$
declare
  v_best numeric;
  v_last numeric;
  v_att  numeric;
  v_at   timestamptz;
begin
  if d is null or jsonb_typeof(d) <> 'object' then return null; end if;
  if coalesce(jsonb_typeof(d->'best'), '')     <> 'number'
     or coalesce(jsonb_typeof(d->'last'), '')     <> 'number'
     or coalesce(jsonb_typeof(d->'attempts'), '') <> 'number' then
    return null;
  end if;
  v_best := least(100, greatest(0, round((d->>'best')::numeric)));
  v_last := least(100, greatest(0, round((d->>'last')::numeric)));
  v_att  := least(100000, greatest(1, round((d->>'attempts')::numeric)));
  v_best := greatest(v_best, v_last);               -- điểm cao nhất không thể thấp hơn lần gần nhất
  if coalesce(jsonb_typeof(d->'at'), '') = 'string' then
    v_at := public.flex_safe_ts(d->>'at');
    if v_at is not null then v_at := least(v_at, now() + interval '5 minutes'); end if;
  end if;
  return jsonb_strip_nulls(jsonb_build_object(
    'best', v_best,
    'last', v_last,
    'attempts', v_att,
    'at', case when v_at is null then null else to_char(v_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') end
  ));
end $$;

-- ---------------------------------------------------------------- dọn dữ liệu đã bị sửa trước đây
-- Chạy trước khi bật trigger. Chỉ xóa/sửa dòng vi phạm luật mới (giá trị bất khả thi, sai hình dạng).
delete from public.flex_study_days
 where seconds < 0 or seconds > 43200
    or public.flex_safe_date(day) is null
    or public.flex_safe_date(day) > current_date + 1;

delete from public.flex_progress
 where card_key !~ '^[^#]{1,60}#[0-9]{1,5}$' or public.flex_norm_progress(state) is null;
update public.flex_progress
   set state = public.flex_norm_progress(state),
       reviewed_at = public.flex_safe_ts(public.flex_norm_progress(state)->>'lastReviewed')
 where public.flex_norm_progress(state) is distinct from state;

delete from public.flex_games where topic_key !~ '^[a-z]{2,24}$' or public.flex_norm_game(data) is null;
update public.flex_games set data = public.flex_norm_game(data) where public.flex_norm_game(data) is distinct from data;

delete from public.flex_toeic where part_key !~ '^(p[1-7]|mix|custom)$' or public.flex_norm_toeic(data) is null;
update public.flex_toeic set data = public.flex_norm_toeic(data) where public.flex_norm_toeic(data) is distinct from data;

update public.flex_starred set updated_at = now() where updated_at > now() + interval '5 minutes';
update public.flex_toeic_review set updated_at = now() where updated_at > now() + interval '5 minutes';

-- ---------------------------------------------------------------- trigger từng bảng
create or replace function public.flex_progress_guard() returns trigger
language plpgsql as $$
declare
  v_state jsonb;
begin
  if current_user in ('postgres', 'service_role', 'supabase_admin') then return new; end if;
  if new.card_key is null or new.card_key !~ '^[^#]{1,60}#[0-9]{1,5}$' then
    raise exception 'flex_progress: card_key khong hop le' using errcode = '23514';
  end if;
  v_state := public.flex_norm_progress(new.state);
  if v_state is null then
    raise exception 'flex_progress: state khong hop le' using errcode = '23514';
  end if;
  -- Bản cũ hơn bản đang có thì bỏ qua (giữ nguyên dòng hiện tại).
  if tg_op = 'UPDATE'
     and public.flex_safe_ts(old.state->>'lastReviewed') > public.flex_safe_ts(v_state->>'lastReviewed') then
    return old;
  end if;
  new.state := v_state;
  new.reviewed_at := public.flex_safe_ts(v_state->>'lastReviewed');
  return new;
end $$;

drop trigger if exists flex_progress_guard on public.flex_progress;
create trigger flex_progress_guard before insert or update on public.flex_progress
  for each row execute function public.flex_progress_guard();

create or replace function public.flex_starred_guard() returns trigger
language plpgsql as $$
begin
  if current_user in ('postgres', 'service_role', 'supabase_admin') then return new; end if;
  if new.card_key is null or new.card_key !~ '^[^#]{1,60}#[0-9]{1,5}$' or new.starred is null then
    raise exception 'flex_starred: du lieu khong hop le' using errcode = '23514';
  end if;
  new.updated_at := least(coalesce(new.updated_at, now()), now() + interval '5 minutes');
  return new;
end $$;

drop trigger if exists flex_starred_guard on public.flex_starred;
create trigger flex_starred_guard before insert or update on public.flex_starred
  for each row execute function public.flex_starred_guard();

-- Streak: ngày hợp lệ, tối đa 12 giờ/ngày, chỉ tăng, tăng không nhanh hơn thời gian thực (+60 giây du di).
create or replace function public.flex_study_days_guard() returns trigger
language plpgsql as $$
declare
  v_day     date;
  v_sec     numeric;
  v_elapsed numeric;
begin
  if current_user in ('postgres', 'service_role', 'supabase_admin') then return new; end if;
  v_day := public.flex_safe_date(new.day);
  if v_day is null or new.seconds is null then
    raise exception 'flex_study_days: du lieu khong hop le' using errcode = '23514';
  end if;
  -- Ngoài cửa sổ hợp lệ (tương lai, hoặc quá 400 ngày trước): bỏ qua dòng này, không làm hỏng cả lô.
  if v_day > current_date + 1 or v_day < current_date - 400 then return null; end if;
  v_sec := least(43200, greatest(0, new.seconds));
  if tg_op = 'UPDATE' then
    v_elapsed := greatest(0, extract(epoch from (now() - old.updated_at)));
    v_sec := greatest(old.seconds, least(v_sec, old.seconds + v_elapsed + 60));
  end if;
  new.seconds := round(v_sec)::integer;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists flex_study_days_guard on public.flex_study_days;
create trigger flex_study_days_guard before insert or update on public.flex_study_days
  for each row execute function public.flex_study_days_guard();

-- Không cho xóa rồi ghi lại dòng ngày học (nếu xóa được thì né được giới hạn tốc độ ở trên).
drop policy if exists "own flex study days" on public.flex_study_days;
drop policy if exists "own flex study days select" on public.flex_study_days;
drop policy if exists "own flex study days insert" on public.flex_study_days;
drop policy if exists "own flex study days update" on public.flex_study_days;
create policy "own flex study days select" on public.flex_study_days
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "own flex study days insert" on public.flex_study_days
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own flex study days update" on public.flex_study_days
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create or replace function public.flex_games_guard() returns trigger
language plpgsql as $$
declare
  v_data jsonb;
begin
  if current_user in ('postgres', 'service_role', 'supabase_admin') then return new; end if;
  if new.topic_key is null or new.topic_key !~ '^[a-z]{2,24}$' then
    raise exception 'flex_games: topic_key khong hop le' using errcode = '23514';
  end if;
  v_data := public.flex_norm_game(new.data);
  if v_data is null then
    raise exception 'flex_games: data khong hop le' using errcode = '23514';
  end if;
  if tg_op = 'INSERT'
     and not exists (select 1 from public.flex_games g where g.user_id = new.user_id and g.topic_key = new.topic_key)
     and (select count(*) from public.flex_games g where g.user_id = new.user_id) >= 60 then
    return null;
  end if;
  new.data := v_data;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists flex_games_guard on public.flex_games;
create trigger flex_games_guard before insert or update on public.flex_games
  for each row execute function public.flex_games_guard();

create or replace function public.flex_toeic_guard() returns trigger
language plpgsql as $$
declare
  v_data jsonb;
begin
  if current_user in ('postgres', 'service_role', 'supabase_admin') then return new; end if;
  if new.part_key is null or new.part_key !~ '^(p[1-7]|mix|custom)$' then
    raise exception 'flex_toeic: part_key khong hop le' using errcode = '23514';
  end if;
  v_data := public.flex_norm_toeic(new.data);
  if v_data is null then
    raise exception 'flex_toeic: data khong hop le' using errcode = '23514';
  end if;
  new.data := v_data;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists flex_toeic_guard on public.flex_toeic;
create trigger flex_toeic_guard before insert or update on public.flex_toeic
  for each row execute function public.flex_toeic_guard();

-- Ôn tập TOEIC: khóa đúng định dạng, giới hạn dung lượng từng dòng và số dòng mỗi người.
create or replace function public.flex_toeic_review_guard() returns trigger
language plpgsql as $$
declare
  v_max_bytes integer;
  v_max_rows  integer;
begin
  if current_user in ('postgres', 'service_role', 'supabase_admin') then return new; end if;
  if new.kind = 'wrong' then
    if new.item_key is null or new.item_key !~ '^w:[A-Za-z0-9_-]{1,24}:[0-9]{1,3}$' then
      raise exception 'flex_toeic_review: item_key khong hop le' using errcode = '23514';
    end if;
    v_max_bytes := 3000;
    v_max_rows := 6000;
  elsif new.kind = 'session' then
    if new.item_key is null or new.item_key !~ '^s:[A-Za-z0-9]{4,32}$' then
      raise exception 'flex_toeic_review: item_key khong hop le' using errcode = '23514';
    end if;
    v_max_bytes := 250000;
    v_max_rows := 40;
  else
    raise exception 'flex_toeic_review: kind khong hop le' using errcode = '23514';
  end if;
  if new.data is null or jsonb_typeof(new.data) <> 'object' or octet_length(new.data::text) > v_max_bytes then
    raise exception 'flex_toeic_review: data khong hop le' using errcode = '23514';
  end if;
  if new.deleted is null then new.deleted := false; end if;
  if new.deleted then new.data := '{}'::jsonb; end if;
  new.updated_at := least(coalesce(new.updated_at, now()), now() + interval '5 minutes');
  if tg_op = 'INSERT'
     and not exists (select 1 from public.flex_toeic_review r where r.user_id = new.user_id and r.item_key = new.item_key)
     and (select count(*) from public.flex_toeic_review r where r.user_id = new.user_id and r.kind = new.kind) >= v_max_rows then
    return null;
  end if;
  return new;
end $$;

drop trigger if exists flex_toeic_review_guard on public.flex_toeic_review;
create trigger flex_toeic_review_guard before insert or update on public.flex_toeic_review
  for each row execute function public.flex_toeic_review_guard();

-- Vai trò anon (chưa đăng nhập) không cần quyền gì trên các bảng này (RLS vốn đã chặn, đây là lớp thứ hai).
revoke all on public.flex_progress, public.flex_starred, public.flex_study_days,
              public.flex_games, public.flex_toeic, public.flex_toeic_review from anon;
