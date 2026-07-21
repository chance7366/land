-- 일반리포트 PDF URL (회원리포트는 기존 report_url 유지)
alter table public.auctions add column if not exists general_report_url text;

comment on column public.auctions.report_url is '회원리포트(풀) PDF URL';
comment on column public.auctions.general_report_url is '일반리포트(섹션 1~3) PDF URL';
