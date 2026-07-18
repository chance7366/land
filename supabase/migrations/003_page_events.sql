-- =============================================================================
-- page_events — 사용자 행동 로그 (대시보드 분석)
-- SQL Editor에서 Run 하세요.
-- =============================================================================

create table if not exists public.page_events (
  id           text primary key default gen_random_uuid()::text,
  created_at   timestamptz not null default now(),
  event_type   text not null, -- page_view | item_click | item_dwell | cta_click | search | share_action
  path         text not null default '',
  menu_key     text,
  target_type  text, -- property | auction | null
  target_id    text,
  metadata     jsonb not null default '{}'::jsonb
);

create index if not exists page_events_type_created_idx
  on public.page_events (event_type, created_at desc);

create index if not exists page_events_menu_created_idx
  on public.page_events (menu_key, created_at desc);

create index if not exists page_events_target_idx
  on public.page_events (target_type, target_id, created_at desc);

alter table public.page_events enable row level security;

drop policy if exists "page_events anon insert" on public.page_events;
create policy "page_events anon insert"
  on public.page_events for insert
  with check (true);

-- 읽기는 service_role / 관리자 API 만 (정책 없음 = anon select 불가)
