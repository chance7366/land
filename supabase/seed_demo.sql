-- =============================================================================
-- 데모 데이터 (선택) — 001_init_chance.sql 실행 후 SQL Editor에서 Run
-- =============================================================================

insert into public.properties (
  manage_code, title, description, type, category, price, address, region,
  building_name, exclusive_area, floor, total_floors, images, tags, featured, status
) values
(
  '매물_DEMO_001',
  '내포신도시 센트럴자이 84㎡',
  '학군·생활편의 우수. 즉시 입주 가능.',
  'SALE', 'APARTMENT', 38500,
  '충남 홍성군 홍북읍 신경리', '내포신도시',
  '센트럴자이', 84.5, 12, 25,
  '[]'::jsonb, '["즉시입주","학군"]'::jsonb, true, 'ACTIVE'
),
(
  '매물_DEMO_002',
  '홍성읍 투룸 월세',
  '직장인 추천 월세. 보증금 협의 가능.',
  'RENT', 'ONE_ROOM', 0,
  '충남 홍성군 홍성읍', '홍성',
  null, 28, 3, 5,
  '[]'::jsonb, '["월세"]'::jsonb, false, 'ACTIVE'
)
on conflict (manage_code) do nothing;

-- 월세 필드 보정
update public.properties
set deposit = 300, monthly_rent = 45, is_jeonse = false, price = 0
where manage_code = '매물_DEMO_002';

insert into public.auctions (
  manage_code, case_number, item_no, title, description,
  appraisal_price, recommended_price, min_price, safety_grade, status, d_day,
  address, region, court, featured
) values
(
  '경매_DEMO_001', '2024타경1234', 1,
  '홍성군 아파트 경매',
  '권리분석 후 입찰 권고가 제시.',
  420000000, 310000000, 294000000, 'SAFE', 'ONGOING', 14,
  '충남 홍성군 홍북읍', '내포신도시', '대전지방법원 홍성지원', true
)
on conflict (manage_code) do nothing;

insert into public.legal_questions (
  category, question, content, author_name, answer, answerer, status, is_public, is_secret
) values
(
  '임대차',
  '전세 계약 만료 전 반환 청구는 어떻게 하나요?',
  '계약 만료 2개월 전입니다. 보증금 반환 절차를 알고 싶습니다.',
  '김○○',
  '내용증명 발송 및 임차권등기명령 검토가 필요합니다. 상세 상담을 권합니다.',
  '찬스상담소',
  'ANSWERED', true, false
);

insert into public.success_stories (category, title, content, author_name, status) values
(
  '경매',
  '권리분석 후 안전한 낙찰',
  '복잡한 임차인 이슈가 있었지만 찬스부동산 분석으로 안전하게 입찰했습니다.',
  '이○○',
  'PUBLISHED'
);
