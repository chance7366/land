-- 비밀글도 목록에 표시(제목·자물쇠). 본문 열람은 앱에서 비밀번호 검증.
-- service_role 사용 시에는 불필요하지만, anon 키 조회 환경을 위해 정책을 완화합니다.

drop policy if exists "legal_questions public read" on public.legal_questions;
create policy "legal_questions public read"
  on public.legal_questions for select
  using (is_public = true or is_secret = true);
