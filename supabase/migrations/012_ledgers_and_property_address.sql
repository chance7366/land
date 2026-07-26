-- 012: 건축물/토지 대장 스냅샷 + properties 주소·동호 컬럼 drift 해소

-- -----------------------------------------------------------------------------
-- Properties: Prisma에 있던 주소 파트 컬럼을 Supabase에도 추가
-- -----------------------------------------------------------------------------
alter table public.properties
  add column if not exists sido text,
  add column if not exists sigungu text,
  add column if not exists eupmyeondong text,
  add column if not exists ri text,
  add column if not exists jibun_main text,
  add column if not exists jibun_sub text,
  add column if not exists unit_dong text,
  add column if not exists unit_ho text,
  add column if not exists direction text,
  add column if not exists built_year integer,
  add column if not exists parking text,
  add column if not exists rooms integer,
  add column if not exists bathrooms integer,
  add column if not exists maintenance_fee integer,
  add column if not exists key_money integer,
  add column if not exists key_money_hidden boolean not null default false,
  add column if not exists vat_included boolean,
  add column if not exists business_type text,
  add column if not exists land_category text,
  add column if not exists zoning text,
  add column if not exists loan_status text,
  add column if not exists move_in_type text,
  add column if not exists feature_summary text,
  add column if not exists owner_name text,
  add column if not exists owner_relation text,
  add column if not exists owner_phone text,
  add column if not exists client_name text,
  add column if not exists move_in_date text;

-- -----------------------------------------------------------------------------
-- Building ledgers (건축물대장 스냅샷)
-- -----------------------------------------------------------------------------
create table if not exists public.building_ledgers (
  id                  text primary key default gen_random_uuid()::text,
  owner_type          text not null check (owner_type in ('property', 'auction')),
  owner_id            text not null,
  kind                text not null check (kind in ('recap', 'title', 'expos')),
  mgm_bldrgst_pk      text,
  dong_nm             text,
  ho_nm               text,
  building_name       text,
  building_use        text,
  structure_type      text,
  exclusive_area      double precision,
  supply_area         double precision,
  total_floor_area    double precision,
  arch_area           double precision,
  land_share_area     double precision,
  total_floors        integer,
  underground_floors  integer,
  floor               integer,
  total_parking       integer,
  bc_rat              double precision,
  vl_rat              double precision,
  hhld_cnt            integer,
  use_approval_date   text,
  seismic_design      text,
  raw_json            jsonb not null default '{}'::jsonb,
  source              text not null default 'BldRgstHub',
  fetched_at          timestamptz not null default now(),
  created_at          timestamptz not null default now()
);

create index if not exists building_ledgers_owner_idx
  on public.building_ledgers (owner_type, owner_id);

-- -----------------------------------------------------------------------------
-- Land ledgers (토지특성 스냅샷)
-- -----------------------------------------------------------------------------
create table if not exists public.land_ledgers (
  id                   text primary key default gen_random_uuid()::text,
  owner_type           text not null check (owner_type in ('property', 'auction')),
  owner_id             text not null,
  pnu                  text,
  land_category        text,
  land_area            double precision,
  zoning               text,
  road_access          text,
  terrain              text,
  land_shape           text,
  land_use_status      text,
  official_land_price  double precision,
  raw_json             jsonb not null default '{}'::jsonb,
  source               text not null default 'VWorld',
  fetched_at           timestamptz not null default now(),
  created_at           timestamptz not null default now()
);

create index if not exists land_ledgers_owner_idx
  on public.land_ledgers (owner_type, owner_id);

create index if not exists land_ledgers_pnu_idx
  on public.land_ledgers (pnu);

alter table public.building_ledgers enable row level security;
alter table public.land_ledgers enable row level security;

-- 관리자(service role)만 사용 — anon 정책 없음
