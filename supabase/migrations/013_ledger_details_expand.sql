-- 013: 대장 스냅샷 상세 필드 확장 (전유부 중심)

alter table public.building_ledgers
  drop constraint if exists building_ledgers_kind_check;

alter table public.building_ledgers
  add constraint building_ledgers_kind_check
  check (kind in ('basis', 'recap', 'title', 'expos'));

alter table public.building_ledgers
  add column if not exists common_area double precision,
  add column if not exists height double precision,
  add column if not exists elevator_cnt integer,
  add column if not exists house_price double precision,
  add column if not exists house_price_std_day text,
  add column if not exists etc_purps text,
  add column if not exists floor_nm text,
  add column if not exists road_address text,
  add column if not exists plat_plc text,
  add column if not exists details_json jsonb not null default '{}'::jsonb;

alter table public.land_ledgers
  add column if not exists land_category_code text,
  add column if not exists zoning2 text,
  add column if not exists price_std_year text,
  add column if not exists plat_plc text,
  add column if not exists details_json jsonb not null default '{}'::jsonb;
