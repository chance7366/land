-- =============================================================================
-- 찬스부동산 경매중개 — Supabase (Postgres) 초기 스키마
-- Supabase Dashboard → SQL Editor 에서 실행하세요.
-- =============================================================================

-- Extensions
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Properties (매물)
-- images: 공개 Storage URL 배열 (jsonb)
-- -----------------------------------------------------------------------------
create table if not exists public.properties (
  id              text primary key default gen_random_uuid()::text,
  manage_code     text not null unique,
  title           text not null,
  description     text not null default '',
  type            text not null, -- SALE | RENT | PRE_SALE | SHORT_TERM
  category        text not null default 'APARTMENT',
  price           integer not null default 0,
  deposit         integer,
  monthly_rent    integer,
  is_jeonse       boolean not null default false,
  deal_sub_type   text,
  area            text,
  address         text not null default '',
  region          text not null default '내포신도시',
  building_name   text,
  exclusive_area  double precision,
  supply_area     double precision,
  floor           integer,
  total_floors    integer,
  specs           jsonb not null default '{}'::jsonb,
  tags            jsonb not null default '[]'::jsonb,
  images          jsonb not null default '[]'::jsonb,
  featured        boolean not null default false,
  status          text not null default 'ACTIVE', -- ACTIVE | SOLD | HIDDEN
  published_at    timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists properties_status_featured_idx
  on public.properties (status, featured desc, published_at desc);

-- -----------------------------------------------------------------------------
-- Auctions (경매) — 앱에서 매물과 분리 관리
-- -----------------------------------------------------------------------------
create table if not exists public.auctions (
  id                 text primary key default gen_random_uuid()::text,
  manage_code        text not null unique,
  case_number        text not null,
  item_no            integer not null default 1,
  title              text not null,
  description        text not null default '',
  appraisal_price    double precision not null default 0,
  recommended_price  double precision not null default 0,
  min_price          double precision,
  safety_grade       text not null default 'SAFE', -- SAFE | CAUTION | RISK
  status             text not null default 'ONGOING', -- ONGOING | CLOSED | FAILED
  d_day              integer not null default 0,
  images             jsonb not null default '[]'::jsonb,
  address            text,
  region             text,
  court              text,
  sale_date          timestamptz,
  featured           boolean not null default false,
  published_at       timestamptz not null default now(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists auctions_status_featured_idx
  on public.auctions (status, featured desc, d_day asc);

-- -----------------------------------------------------------------------------
-- Consultations (1:1 상담 예약)
-- -----------------------------------------------------------------------------
create table if not exists public.consultations (
  id             text primary key default gen_random_uuid()::text,
  client_name    text not null,
  phone          text not null,
  email          text,
  category       text not null,
  sub_category   text,
  summary        text not null default '',
  detail         text not null default '',
  method         text,
  preferred_at   text,
  access_code    text not null default '',
  reply          text,
  replied_at     timestamptz,
  status         text not null default 'PENDING', -- PENDING | PROCESSING | DONE
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists consultations_access_code_idx
  on public.consultations (access_code);

-- -----------------------------------------------------------------------------
-- Legal questions (찬스상담소 Q&A)
-- -----------------------------------------------------------------------------
create table if not exists public.legal_questions (
  id               text primary key default gen_random_uuid()::text,
  category         text not null,
  question         text not null,
  content          text not null default '',
  author_name      text not null default '',
  phone            text,
  answer           text,
  answerer         text,
  status           text not null default 'PENDING', -- PENDING | REVIEWING | ANSWERED
  is_public        boolean not null default true,
  is_secret        boolean not null default false,
  access_code      text not null default '',
  suggest_consult  boolean not null default false,
  answered_at      timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists legal_questions_public_created_idx
  on public.legal_questions (is_public, created_at desc);

-- -----------------------------------------------------------------------------
-- Success stories (성공스토리)
-- -----------------------------------------------------------------------------
create table if not exists public.success_stories (
  id           text primary key default gen_random_uuid()::text,
  category     text not null,
  title        text not null,
  content      text not null,
  author_name  text not null default '',
  status       text not null default 'PUBLISHED', -- PUBLISHED | HIDDEN
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists success_stories_status_created_idx
  on public.success_stories (status, created_at desc);

-- -----------------------------------------------------------------------------
-- Subscribers (관심 매물/경매 알림 신청자)
-- -----------------------------------------------------------------------------
create table if not exists public.subscribers (
  id                  text primary key default gen_random_uuid()::text,
  name                text,
  email               text,
  phone               text,
  subscription_type   text not null, -- REAL_ESTATE | AUCTION
  channels            jsonb not null default '["EMAIL"]'::jsonb,
  preferences         jsonb not null default '{}'::jsonb,
  status              text not null default 'PENDING', -- PENDING | APPROVED | REJECTED
  is_privacy_agreed   boolean not null default false,
  unsubscribe_token   text not null unique default gen_random_uuid()::text,
  admin_note          text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists subscribers_status_type_idx
  on public.subscribers (status, subscription_type);

-- -----------------------------------------------------------------------------
-- updated_at trigger
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'properties', 'auctions', 'consultations', 'legal_questions',
    'success_stories', 'subscribers'
  ]
  loop
    execute format(
      'drop trigger if exists %I_set_updated_at on public.%I;
       create trigger %I_set_updated_at
       before update on public.%I
       for each row execute function public.set_updated_at();',
      t, t, t, t
    );
  end loop;
end $$;

-- -----------------------------------------------------------------------------
-- Storage: property-images (공개 버킷)
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-images',
  'property-images',
  true,
  10485760, -- 10MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set public = excluded.public;

-- 공개 읽기
drop policy if exists "property-images public read" on storage.objects;
create policy "property-images public read"
  on storage.objects for select
  using (bucket_id = 'property-images');

-- 업로드/수정/삭제: service role 또는 인증 사용자 (배포 후 정책 강화 권장)
drop policy if exists "property-images authenticated write" on storage.objects;
create policy "property-images authenticated write"
  on storage.objects for insert
  with check (bucket_id = 'property-images');

drop policy if exists "property-images authenticated update" on storage.objects;
create policy "property-images authenticated update"
  on storage.objects for update
  using (bucket_id = 'property-images');

drop policy if exists "property-images authenticated delete" on storage.objects;
create policy "property-images authenticated delete"
  on storage.objects for delete
  using (bucket_id = 'property-images');

-- -----------------------------------------------------------------------------
-- RLS: 공개 읽기 / 쓰기는 서버(service role) 권장
-- Anon 키로 직접 insert 할 공개 테이블만 완화
-- -----------------------------------------------------------------------------
alter table public.properties enable row level security;
alter table public.auctions enable row level security;
alter table public.consultations enable row level security;
alter table public.legal_questions enable row level security;
alter table public.success_stories enable row level security;
alter table public.subscribers enable row level security;

drop policy if exists "properties public read active" on public.properties;
create policy "properties public read active"
  on public.properties for select
  using (status = 'ACTIVE');

drop policy if exists "auctions public read ongoing" on public.auctions;
create policy "auctions public read ongoing"
  on public.auctions for select
  using (status = 'ONGOING');

drop policy if exists "success_stories public read" on public.success_stories;
create policy "success_stories public read"
  on public.success_stories for select
  using (status = 'PUBLISHED');

drop policy if exists "legal_questions public read" on public.legal_questions;
create policy "legal_questions public read"
  on public.legal_questions for select
  using (is_public = true);

-- 상담/구독 신청: anon insert 허용 (서비스 롤 사용 시에도 무방)
drop policy if exists "consultations anon insert" on public.consultations;
create policy "consultations anon insert"
  on public.consultations for insert
  with check (true);

drop policy if exists "subscribers anon insert" on public.subscribers;
create policy "subscribers anon insert"
  on public.subscribers for insert
  with check (true);

drop policy if exists "legal_questions anon insert" on public.legal_questions;
create policy "legal_questions anon insert"
  on public.legal_questions for insert
  with check (true);

drop policy if exists "success_stories anon insert" on public.success_stories;
create policy "success_stories anon insert"
  on public.success_stories for insert
  with check (true);
