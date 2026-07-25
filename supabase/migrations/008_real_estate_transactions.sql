-- =============================================================================
-- 국토부 실거래가 (RTMS) — 통합 저장 · 커버리지 · 수집 설정
-- service_role 전용 (anon 정책 없음)
-- =============================================================================

create table if not exists public.lawd_codes (
  lawd_cd     char(5) primary key,
  sido        text not null default '',
  sigungu     text not null default '',
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.real_estate_transactions (
  id                 text primary key default gen_random_uuid()::text,
  property_type      text not null,
  transaction_type   text not null,
  lawd_cd            char(5) not null,
  deal_ymd           int not null,
  deal_date          date not null,
  building_name      text not null default '',
  jibun              text not null default '',
  road_name          text not null default '',
  umd_nm             text not null default '',
  floor              text not null default '',
  excl_area          numeric,
  land_area          numeric,
  build_year         int,
  deal_amount        bigint not null default 0,
  deposit_amount     bigint not null default 0,
  monthly_rent       bigint not null default 0,
  price_per_sqm      bigint,
  cancelled          boolean not null default false,
  cancel_date        date,
  dealing_gbn        text not null default '',
  raw_details        jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

do $$ begin
  alter table public.real_estate_transactions
    add constraint uq_real_estate_transaction_record unique (
      property_type,
      transaction_type,
      lawd_cd,
      deal_date,
      building_name,
      jibun,
      floor,
      excl_area,
      deal_amount,
      deposit_amount
    );
exception when duplicate_object then null;
end $$;

create index if not exists real_estate_tx_filter_idx
  on public.real_estate_transactions (lawd_cd, deal_ymd, property_type, transaction_type);

create index if not exists real_estate_tx_deal_date_idx
  on public.real_estate_transactions (deal_date desc);

create index if not exists real_estate_tx_building_idx
  on public.real_estate_transactions (building_name);

create table if not exists public.real_estate_sync_coverage (
  id                 text primary key default gen_random_uuid()::text,
  lawd_cd            char(5) not null,
  property_type      text not null,
  transaction_type   text not null,
  deal_ymd           int not null,
  status             text not null default 'missing', -- collected | missing | empty
  row_count          int not null default 0,
  last_synced_at     timestamptz,
  updated_at         timestamptz not null default now(),
  unique (lawd_cd, property_type, transaction_type, deal_ymd)
);

create index if not exists real_estate_coverage_filter_idx
  on public.real_estate_sync_coverage (lawd_cd, property_type, transaction_type, deal_ymd);

create table if not exists public.real_estate_sync_runs (
  id            text primary key default gen_random_uuid()::text,
  started_at    timestamptz not null default now(),
  finished_at   timestamptz,
  start_ymd     int not null,
  end_ymd       int not null,
  region_label  text not null default '',
  types_label   text not null default '',
  gap_only      boolean not null default true,
  slots_total   int not null default 0,
  slots_ok      int not null default 0,
  rows_upserted int not null default 0,
  status        text not null default 'running',
  error_message text,
  details       jsonb not null default '{}'::jsonb
);

create table if not exists public.real_estate_sync_settings (
  id              int primary key default 1 check (id = 1),
  auto_collect    boolean not null default false,
  cadence         text not null default 'weekly', -- weekly | monthly
  updated_at      timestamptz not null default now()
);

insert into public.real_estate_sync_settings (id, auto_collect, cadence)
values (1, false, 'weekly')
on conflict (id) do nothing;

-- 시드 시군구 (목업 트리 + 충남 중심)
insert into public.lawd_codes (lawd_cd, sido, sigungu) values
  ('11680', '서울특별시', '강남구'),
  ('11650', '서울특별시', '서초구'),
  ('11710', '서울특별시', '송파구'),
  ('41135', '경기도', '성남시 분당구'),
  ('41111', '경기도', '수원시 장안구'),
  ('28185', '인천광역시', '연수구'),
  ('26350', '부산광역시', '해운대구'),
  ('27200', '대구광역시', '수성구'),
  ('29170', '광주광역시', '광산구'),
  ('30200', '대전광역시', '유성구'),
  ('31140', '울산광역시', '남구'),
  ('36110', '세종특별자치시', '세종시'),
  ('42110', '강원특별자치도', '춘천시'),
  ('43111', '충청북도', '청주시 상당구'),
  ('44800', '충청남도', '홍성군'),
  ('44810', '충청남도', '예산군'),
  ('44133', '충청남도', '천안시 서북구'),
  ('44131', '충청남도', '천안시 동남구'),
  ('44200', '충청남도', '아산시'),
  ('45111', '전북특별자치도', '전주시 완산구'),
  ('46110', '전라남도', '목포시'),
  ('47111', '경상북도', '포항시 남구'),
  ('48121', '경상남도', '창원시 성산구'),
  ('50110', '제주특별자치도', '제주시')
on conflict (lawd_cd) do nothing;

alter table public.lawd_codes enable row level security;
alter table public.real_estate_transactions enable row level security;
alter table public.real_estate_sync_coverage enable row level security;
alter table public.real_estate_sync_runs enable row level security;
alter table public.real_estate_sync_settings enable row level security;
