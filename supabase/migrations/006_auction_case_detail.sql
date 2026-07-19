-- 006: auctions 테이블을 Prisma Auction 모델에 맞게 확장 + 사건상세 JSON
-- 기존 001_init 의 최소 컬럼만 있는 프로젝트용 (idempotent)

alter table public.auctions add column if not exists address2 text;
alter table public.auctions add column if not exists report_url text;
alter table public.auctions add column if not exists auction_type text;
alter table public.auctions add column if not exists item_type text;
alter table public.auctions add column if not exists auction_target text;
alter table public.auctions add column if not exists bid_method text;
alter table public.auctions add column if not exists land_area double precision;
alter table public.auctions add column if not exists building_area double precision;
alter table public.auctions add column if not exists bid_deposit double precision;
alter table public.auctions add column if not exists claim_amount double precision;
alter table public.auctions add column if not exists debtor_owner text;
alter table public.auctions add column if not exists creditor text;
alter table public.auctions add column if not exists attachments jsonb not null default '[]'::jsonb;
alter table public.auctions add column if not exists rights_analysis text;
alter table public.auctions add column if not exists case_detail_json text;
alter table public.auctions add column if not exists memo text;
alter table public.auctions add column if not exists winning_price double precision;
alter table public.auctions add column if not exists winning_ratio double precision;
alter table public.auctions add column if not exists bidder_count integer;
alter table public.auctions add column if not exists second_bid_amount double precision;

create index if not exists auctions_case_item_idx
  on public.auctions (case_number, item_no);

comment on column public.auctions.case_detail_json is
  '법원 사건상세조회: 사건내역 + 문건/송달내역 JSON (기일내역 제외)';
comment on column public.auctions.rights_analysis is
  '권리분석·요약 텍스트 ([감정요약], [현황조사서JSON], [사건상세JSON] 등)';
