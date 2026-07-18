-- =============================================================================
-- customer_cards / customer_interactions — 개업공인중개사 고객관리(CRM)
-- SQL Editor에서 Run 하세요. (service_role 전용 읽기·쓰기; anon 정책 없음)
-- =============================================================================

create table if not exists public.customer_cards (
  id                      text primary key default gen_random_uuid()::text,
  name                    text not null,
  phone                   text not null default '',
  email                   text,
  current_address         text,
  profile_image           text,
  primary_contact_method  text not null default 'phone', -- visit | phone | email | web
  has_traded              boolean not null default false,
  is_subscribed           boolean not null default false,
  pipeline_stage          text not null default 'new', -- new | touring | contracting | closed | dormant
  budget_range            text,
  needs_loan              boolean not null default false,
  purpose                 text not null default 'reside', -- invest | reside
  move_urgency            text not null default 'mid', -- high | mid | low
  move_date               date,
  family_members          text,
  preferred_brand         text,
  decision_maker          text,
  inquiry_details         text not null default '',
  request_notes           text not null default '',
  special_notes           text not null default '',
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists customer_cards_phone_idx
  on public.customer_cards (phone);

create index if not exists customer_cards_pipeline_idx
  on public.customer_cards (pipeline_stage);

create index if not exists customer_cards_move_date_idx
  on public.customer_cards (move_date);

create index if not exists customer_cards_created_idx
  on public.customer_cards (created_at desc);

create table if not exists public.customer_interactions (
  id           text primary key default gen_random_uuid()::text,
  customer_id  text not null references public.customer_cards (id) on delete cascade,
  occurred_at  timestamptz not null default now(),
  channel      text not null default 'phone', -- visit | phone | email | web | tour | other
  title        text not null default '',
  body         text not null default '',
  created_at   timestamptz not null default now()
);

create index if not exists customer_interactions_customer_idx
  on public.customer_interactions (customer_id, occurred_at desc);

alter table public.customer_cards enable row level security;
alter table public.customer_interactions enable row level security;

-- anon/authenticated 정책 없음 → 브라우저 직접 접근 불가, service_role만 사용
