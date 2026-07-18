-- =============================================================================
-- 뉴스 피드 (NewsFeedItem) — Supabase
-- SQL Editor에서 Run 하세요. (또는 앱이 자동 적용을 시도합니다)
-- =============================================================================

create table if not exists public.news_feed_items (
  id           text primary key default gen_random_uuid()::text,
  source       text not null,
  source_name  text not null default '',
  title        text not null,
  summary      text not null default '',
  press        text not null default '',
  origin_url   text not null unique,
  image_url    text,
  rank         integer,
  pub_date     timestamptz not null,
  fetched_at   timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists news_feed_items_source_pub_date_idx
  on public.news_feed_items (source, pub_date desc);

create index if not exists news_feed_items_source_rank_idx
  on public.news_feed_items (source, rank asc nulls last);

drop trigger if exists news_feed_items_set_updated_at on public.news_feed_items;
create trigger news_feed_items_set_updated_at
  before update on public.news_feed_items
  for each row execute function public.set_updated_at();

alter table public.news_feed_items enable row level security;

drop policy if exists "news_feed_items public read" on public.news_feed_items;
create policy "news_feed_items public read"
  on public.news_feed_items for select
  using (true);
