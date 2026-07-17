# CHANCE Real Estate & Auction — Product Requirements Document (PRD)

| 항목 | 내용 |
|------|------|
| **문서 버전** | v1.0 |
| **작성일** | 2026-07-08 |
| **상태** | Draft → 개발 착수 |
| **관련 문서** | `DESIGN.md`, `index.html`, `admin.html` |

---

## 1. Executive Summary

**CHANCE Real Estate & Auction**은 충남 내포신도시·홍성 지역을 특화한 **부동산 중개 + 경매 + 법률상담** 통합 플랫폼이다. 사용자는 모바일 퍼스트 대시보드에서 매물·경매·뉴스·Q&A를 한 번에 탐색하고, 관리자는 별도 콘솔에서 콘텐츠·API·스크래핑·문의를 통합 운영한다.

### 1.1 제품 비전

> "내포신도시 부동산 의사결정의 단 하나의 창(窓) — 매물부터 경매, 법률까지."

### 1.2 현재 상태

| 구분 | 상태 | 파일 |
|------|------|------|
| 사용자 UI 프로토타입 | ✅ 완료 | `index.html` |
| 관리자 UI 프로토타입 | ✅ 완료 | `admin.html` |
| 디자인 명세 | ✅ 완료 | `DESIGN.md` |
| 백엔드 / DB | ❌ 미구현 | — |
| 실데이터 연동 | ❌ 미구현 | — |

### 1.3 개발 목표 (6개월)

1. **MVP 출시**: 일반중개·경매 추천·뉴스·법률 Q&A 핵심 흐름 동작
2. **관리자 운영**: CMS 수준의 콘텐츠 CRUD + 문의 처리
3. **데이터 자동화**: 국토부 실거래가 API 연동, 네이버 매물 수집(합법 범위 내)
4. **전환율**: 상담 예약 CTA 클릭 → 예약 완료 전환 5% 이상

---

## 2. 문제 정의 & 기회

### 2.1 문제

| Pain Point | 설명 |
|------------|------|
| 정보 분산 | 매물(네이버/직방), 경매(법원/전문 사이트), 뉴스, 법률 정보가 각각 분리 |
| 지역 특화 부재 | 내포신도시 특화 필터·분석 콘텐츠 부족 |
| 경매 진입 장벽 | 권리분석·명도 리스크 이해 어려움 |
| 상담 접근성 | 법률·세무 상담 예약 채널 불명확 |

### 2.2 기회

- 내포신도시 개발·철도·병원 등 **지역 모멘텀** 활용
- 중개사 + 경매 전문 + 법률자문 **원스톱 브랜딩**
- Admin 콘솔로 **운영 효율** 확보 → 콘텐츠 freshness 경쟁력

---

## 3. 타겟 사용자 & 페르소나

### 3.1 Primary — 실수요자 (User App)

| 페르소나 | 프로필 | 니즈 |
|----------|--------|------|
| **김내포 (35)** | 내포신도시 이주 예정 가구 | 아파트 매물 비교, 학군·교통 정보 |
| **박투자 (42)** | 경매 입문 투자자 | 안전 등급, 추천가, 권리분석 요약 |
| **이임차 (28)** | 홍성 상가 임차 희망 | 임대차 법률 Q&A, 상담 예약 |

### 3.2 Secondary — 운영자 (Admin)

| 페르소나 | 프로필 | 니즈 |
|----------|--------|------|
| **관리자** | CHANCE 내부 운영 | KPI 모니터링, 매물/경매/뉴스 관리, 문의 처리 |
| **콘텐츠 담당** | 마케팅/에디터 | 부동산 소식 발행, 후기 관리 |
| **시스템 담당** | 개발/운영 | API·스크래핑 상태, 로그 확인 |

---

## 4. 제품 범위

### 4.1 In Scope (MVP → v1.0)

#### 사용자 앱 (Part I)

| 모듈 | 기능 |
|------|------|
| **일반중개** | 매물 목록, Featured 카드, 상세 페이지, 전체 보기 | 2축 분류(물건·거래), 유형별 스펙, 필터 허브 |
| **경매물건추천** | 경매 목록, 안전등급, D-day, 분석 리포트(PDF/페이지) |
| **부동산소식** | 뉴스 피드, Featured 기사, 뉴스룸 |
| **법률상담** | Q&A 목록, 답변 표시, 상담 신청 폼 |
| **공통** | 상담 예약 CTA, FAB 채팅, 하단 네비, 가로 스냅 스크롤 |

#### 관리자 콘솔 (Part II)

| 모듈 | 기능 |
|------|------|
| **대시보드** | KPI 4종, System Online, API/스크래핑 현황 |
| **매물 관리** | CRUD, 3단계 입력, 유형별 스펙, 이미지 URL, 노출 ON/OFF |
| **경매 관리** | CRUD, 안전등급, 추천가, 리포트 첨부 |
| **부동산 소식** | 기사 CRUD, Featured 지정 |
| **고객 후기** | 후기 CRUD, 노출 관리 |
| **상담 예약** | 문의 목록, 상태 변경(Pending→Processing→Done), 채팅 연결 |
| **시스템** | API 토글, 스크래핑 Sync/Stop, 로그 조회 |

### 4.2 Out of Scope (v1.0 이후)

- 모바일 네이티브 앱 (iOS/Android)
- 실시간 경매 입찰 대행 결제
- AI 자동 권리분석 (v1.1 후보)
- 다지역 확장 (서울/수도권)
- 다크 모드 (토큰만 준비됨)

---

## 5. 기능 요구사항

### 5.1 사용자 앱 — FR-U

| ID | 기능 | 우선순위 | 설명 | Acceptance Criteria |
|----|------|----------|------|---------------------|
| FR-U01 | 홈 대시보드 | P0 | 4컬럼 스냅 스크롤 | 컬럼별 Featured + 리스트 3건 이상 표시, 하단 네비 연동 |
| FR-U02 | 매물 상세 | P0 | 개별 매물 페이지 | 갤러리, 거래별 가격, 핵심·유형별 스펙 그리드, 상담 CTA |
| FR-U03 | 매물 전체 목록 | P1 | 필터·정렬 | 물건유형 탭(7종), 거래·지역 필터, 가격·최신 정렬 |
| FR-U04 | 경매 상세 | P0 | 사건번호, 감정가, 추천가, D-day | 안전등급 뱃지, 분석 리포트 링크 |
| FR-U05 | 경매 리스트 | P1 | 전체 경매 물건 | D-day 정렬, 상태 필터 |
| FR-U06 | 뉴스 상세 | P1 | 기사 본문 + 이미지 | 발행일, 공유(optional) |
| FR-U07 | 뉴스룸 | P1 | 전체 뉴스 목록 | 최신순, 카테고리 |
| FR-U08 | Q&A 목록/상세 | P0 | 질문 + 답변(있을 경우) | 태그(임대차 등), 답변 상태 |
| FR-U09 | 상담 신청 | P0 | 폼 제출 | 이름, 연락처, 분류, 내용 → Admin 문의 테이블 |
| FR-U10 | 상담 예약 (헤더) | P0 | CTA → 예약 플로우 | FR-U09 또는 캘린더 연동 |
| FR-U11 | FAB 채팅 | P1 | 카카오/채널톡 연결 | 외부 채팅 또는 인앱(Phase 2) |
| FR-U12 | 반응형 | P0 | 모바일 퍼스트 | 320px~ desktop, DESIGN.md breakpoint 준수 |

### 5.2 관리자 — FR-A

| ID | 기능 | 우선순위 | 설명 | Acceptance Criteria |
|----|------|----------|------|---------------------|
| FR-A01 | Admin 인증 | P0 | 로그인/세션 | 역할 기반 접근(RBAC) |
| FR-A02 | KPI 대시보드 | P0 | 4 Stat Cards | 실데이터 집계, 일일 갱신 |
| FR-A03 | API 관리 | P1 | 토글 ON/OFF, 상태 표시 | 국토부·카카오맵 연동 상태 |
| FR-A04 | API 동기화 로그 | P1 | 최근 N건 로그 | OK/ERR 색상, 타임스탬프 |
| FR-A05 | 스크래핑 제어 | P1 | Sync/Stop, progress | 백그라운드 job 상태 반영 |
| FR-A06 | 스크래핑 통계 | P1 | Scraped/Errors/Updated | job 완료 후 갱신 |
| FR-A07 | 문의 관리 테이블 | P0 | CRUD + 상태 변경 | Pending/Processing/Done, chat/check 액션 |
| FR-A08 | 매물 CRUD | P0 | 3단계 입력 폼 | 물건·거래 2축 분류, 유형별 스펙, User 앱 즉시 반영 |
| FR-A09 | 경매 CRUD | P0 | — | 안전등급, 추천가 필드 |
| FR-A10 | 뉴스 CRUD | P1 | — | Featured 플래그 |
| FR-A11 | 후기 CRUD | P2 | — | — |
| FR-A12 | 시스템 로그 | P2 | 헤더 CTA | 감사 로그, API 에러 로그 |

---

## 6. 비기능 요구사항 (NFR)

| ID | 영역 | 요구사항 | 목표 |
|----|------|----------|------|
| NFR-01 | 성능 | 사용자 홈 LCP | < 2.5s (4G) |
| NFR-02 | 성능 | API 응답 p95 | < 500ms |
| NFR-03 | 가용성 | 서비스 uptime | 99.5% |
| NFR-04 | 보안 | Admin 인증 | JWT/Session + HTTPS |
| NFR-05 | 보안 | 개인정보 | 상담 폼 암호화 저장, 마스킹 |
| NFR-06 | SEO | 공개 페이지 | 메타태그, OG, sitemap |
| NFR-07 | 접근성 | WCAG | Level AA (키보드, aria-label) |
| NFR-08 | i18n | 언어 | ko (v1), en (v2 후보) |
| NFR-09 | 디자인 | UI 일관성 | DESIGN.md MD3 토큰 100% 준수 |
| NFR-10 | 법적 | 스크래핑 | robots.txt·이용약관 준수, 공식 API 우선 |

---

## 7. 데이터 모델 (초안)

### 7.1 Core Entities

```
User (optional, v1.1)
├── id, name, phone, email, created_at

Property (일반중개)
├── id, title, description
├── type(매매|SALE|임대|RENT|분양권|PRE_SALE)     ← 거래유형
├── category(아파트|오피스텔|상가|…|LAND)         ← 물건유형 (PropertyCategory)
├── price(만원), deposit, monthlyRent, isJeonse  ← 임대 조건
├── address, region(내포|홍성), buildingName
├── exclusiveArea, supplyArea, floor, totalFloors, direction, builtYear, parking
├── rooms, bathrooms, unitDong, unitHo, maintenanceFee  ← 주택
├── keyMoney, businessType                               ← 상업
├── landCategory, zoning                                 ← 토지
├── tags(JSON), moveInDate, area(legacy)
├── images[], featured(boolean), status(ACTIVE|HIDDEN|SOLD)
├── published_at, created_at, updated_at

Auction (경매)
├── id, case_number(2023타경12345), title, description
├── appraisal_price, recommended_price, safety_grade(안전|주의|위험)
├── status(진행중|마감|유찰), d_day, images[]
├── report_url, published_at

News (부동산소식)
├── id, title, summary, body, thumbnail
├── featured(boolean), published_at, author_id

LegalQuestion (법률 Q&A)
├── id, category(임대차|경매|세무|토지)
├── question, answer, answerer, status(대기|완료)
├── is_public, created_at, answered_at

Consultation (상담/문의)
├── id, client_name, phone, email
├── category, summary, detail
├── status(Pending|Processing|Done)
├── assigned_to, created_at, updated_at

Review (고객 후기)
├── id, client_name, content, rating, visible

ApiIntegration
├── id, name, provider, status(ACTIVE|WARNING|OFF)
├── config(json), last_sync_at, daily_usage

ScrapingJob
├── id, name, status(RUNNING|STOPPED|ERROR)
├── progress(0-100), scraped_count, error_count, updated_count
├── last_run_at

SystemLog
├── id, level, event, message, created_at
```

### 7.2 관계

- `Consultation` ← User App 상담 신청
- `LegalQuestion` ← 공개 Q&A (답변 있을 때만 노출 옵션)
- `Property` ← Admin CRUD + ScrapingJob import
- `Auction` ← Admin CRUD (+ 추후 법원 API/수동 입력)

---

## 8. 외부 연동

| 서비스 | 용도 | 우선순위 | 비고 |
|--------|------|----------|------|
| **국토교통부 실거래가 API** | 시세 참고, 매물 검증 | P1 | Admin API 토글 |
| **카카오맵 API** | 지도, 좌표, 주소 검색 | P1 | 일일 quota 모니터링 |
| **네이버 부동산** | 매물 수집 | P2 | 법적 검토 필수, 공식 제휴 검토 |
| **카카오톡 채널 / 채널톡** | FAB 채팅, 상담 | P1 | MVP는 deep link |
| **이메일/SMS** | 상담 접수 알림 | P2 | Admin 알림 |

---

## 9. 기술 아키텍처 (권장)

### 9.1 Phase 0 — 현재 (프로토타입)

```
Static HTML + Tailwind CDN + Vanilla JS
├── index.html
└── admin.html
```

### 9.2 Phase 1 — MVP (권장 스택)

```
┌─────────────────────────────────────────────────┐
│  Frontend                                        │
│  Next.js 14+ (App Router) + TypeScript           │
│  Tailwind CSS (DESIGN.md 토큰 tailwind.config)   │
│  ├── / (User Dashboard)                          │
│  ├── /properties, /auctions, /news, /legal       │
│  └── /admin/* (Admin Console, protected)         │
├─────────────────────────────────────────────────┤
│  Backend                                         │
│  Next.js API Routes 또는 NestJS                    │
│  REST API + OpenAPI spec                         │
├─────────────────────────────────────────────────┤
│  Database                                        │
│  PostgreSQL (Supabase 또는 RDS)                  │
│  Prisma ORM                                      │
├─────────────────────────────────────────────────┤
│  Storage                                         │
│  S3 / Supabase Storage (이미지)                  │
├─────────────────────────────────────────────────┤
│  Jobs                                            │
│  BullMQ / Inngest (스크래핑, API sync cron)      │
├─────────────────────────────────────────────────┤
│  Deploy                                          │
│  Vercel (FE) + Railway/Fly.io (Worker)           │
└─────────────────────────────────────────────────┘
```

### 9.3 Phase 2 — 확장

- Redis 캐시, Elasticsearch 매물 검색
- WebSocket 실시간 Admin KPI
- PWA + 푸시 알림

---

## 10. UI/UX 원칙

1. **DESIGN.md 단일 진실 공급원** — 모든 컴포넌트는 MD3 토큰 기반
2. **모바일 퍼스트 (User)** / **데스크톱 퍼스트 (Admin)**
3. **3-Tap Rule** — 핵심 정보(매물 가격, 경매 추천가)는 3탭 이내
4. **신뢰 시그널** — 경매 안전등급, 법률자문단 답변, 실거래가 출처 명시
5. **CTA 일관성** — Primary `#031635`, Secondary `#3b6934`

---

## 11. 개발 로드맵

### Phase 0 — 기반 구축 (Week 1–2) ✅ 진행 중

| Task | 산출물 |
|------|--------|
| UI 프로토타입 | `index.html`, `admin.html` ✅ |
| 디자인 명세 | `DESIGN.md` ✅ |
| PRD 확정 | `PRD.md` ✅ |
| Repo 초기화 | Git, ESLint, Prettier |
| Next.js 프로젝트 셋업 | monorepo 또는 single app |
| Tailwind 토큰 이식 | `tailwind.config.ts` |

### Phase 1 — MVP Core (Week 3–6)

| Sprint | 목표 | Deliverables |
|--------|------|--------------|
| **S1** | DB + Auth + Admin shell | Schema, Admin login, SideNav routing |
| **S2** | 매물·경매 CRUD | Admin CRUD → User 목록/상세 |
| **S3** | 뉴스·Q&A | News feed, Legal Q&A, 상담 폼 |
| **S4** | User 홈 통합 | 4컬럼 대시보드 API 연동, 하단 네비 |

**MVP Definition of Done**
- [ ] User: 4섹션 실데이터 표시 + 상세 페이지
- [ ] User: 상담 신청 → Admin 테이블 반영
- [ ] Admin: 매물/경매/뉴스/문의 CRUD
- [ ] Admin: KPI 실데이터 (방문자 제외 mock 가능)
- [ ] 배포 URL 제공 (staging)

### Phase 2 — 데이터 자동화 (Week 7–10)

| Sprint | 목표 |
|--------|------|
| **S5** | 국토부 API 연동 + Admin 토글/로그 |
| **S6** | 스크래핑 job (내포신도시) + Admin 제어 UI |
| **S7** | 카카오맵 embed, FAB 채팅 연동 |

### Phase 3 — 운영 고도화 (Week 11–14)

| Sprint | 목표 |
|--------|------|
| **S8** | 고객 후기, 분석 리포트 PDF |
| **S9** | SEO, Analytics, 성능 최적화 |
| **S10** | QA, 보안 점검, Production launch |

---

## 12. 성공 지표 (KPI)

| 지표 | MVP 목표 (3개월) | 측정 |
|------|------------------|------|
| MAU | 500+ | GA4 |
| 일일 방문자 | 200+ | GA4 |
| 상담 신청 건수 | 월 30+ | DB |
| 상담 전환율 | 5%+ | CTA click → submit |
| 매물 등록 수 | 100+ | Admin |
| 경매 추천 물건 | 20+ active | Admin |
| API sync 성공률 | 99%+ | SystemLog |
| Admin 문의 처리 시간 | 24h 이내 80% | Consultation status |

---

## 13. 리스크 & 대응

| 리스크 | 영향 | 대응 |
|--------|------|------|
| 네이버 스크래핑 법적 이슈 | High | 공식 API·제휴 우선, 수동 입력 병행 |
| 국토부 API 변경 | Med | Adapter 패턴, 버전 관리 |
| 경매 정보 정확성 | High | 면책 고지, 전문가 검수 워크플로 |
| 개인정보 유출 | High | 암호화, 접근 로그, 최소 수집 |
| 1인 개발 리소스 | Med | MVP scope 엄수, Phase 2 defer |

---

## 14. 의존성 & 선행 조건

- [ ] 도메인·호스팅 결정
- [ ] 국토부 API 키 발급
- [ ] 카카오 개발자 앱 등록 (Map, 채널)
- [ ] 법률 검토 (스크래핑, 경매 정보, 면책)
- [ ] 초기 콘텐츠 (매물 10건, 경매 5건, 뉴스 5건) 시드 데이터

---

## 15. 팀 & 역할 (권장)

| 역할 | 책임 |
|------|------|
| PM / 기획 | PRD, 우선순위, QA |
| Frontend | User + Admin UI, DESIGN.md 구현 |
| Backend | API, DB, Jobs |
| Domain Expert | 경매·법률 콘텐츠 검수 |
| (Optional) Design | DESIGN.md 유지보수 |

*1인 개발 시: Phase 1→3 순차, FR P0만 MVP.*

---

## 16. 다음 액션 (Immediate)

1. **Git repo 초기화** 및 `.gitignore` 설정
2. **Next.js + TypeScript** 프로젝트 생성
3. **`tailwind.config.ts`** — DESIGN.md 토큰 이식
4. **Prisma schema** — §7 데이터 모델 반영
5. **Sprint 1 착수** — Admin Auth + DB + SideNav 라우팅
6. **`index.html` / `admin.html`** → React 컴ponent 점진 마이그레이션

---

## 17. 문서 이력

| 버전 | 날짜 | 변경 |
|------|------|------|
| v1.0 | 2026-07-08 | 초안 작성 — 프로토타입 기반 PRD |

---

## 부록 A — 페이지 맵

### User App

```
/                     홈 (4컬럼 대시보드)
/properties           일반중개 전체
/properties/:id       매물 상세
/auctions             경매 전체
/auctions/:id         경매 상세 + 리포트
/news                 뉴스룸
/news/:id             기사 상세
/legal                법률 Q&A
/legal/:id            Q&A 상세
/consultation         상담 신청
/chat                 FAB redirect
```

### Admin

```
/admin                대시보드 (KPI + Bento)
/admin/properties     매물 관리
/admin/auctions       경매 관리
/admin/news           부동산 소식
/admin/reviews        고객 후기
/admin/consultations  상담 예약
/admin/settings       시스템 설정
/admin/logs           시스템 로그
/admin/login          로그인
```

---

## 부록 B — API Endpoint 초안

```
GET    /api/properties?region=&type=&page=
GET    /api/properties/:id
GET    /api/auctions?status=&sort=d_day
GET    /api/auctions/:id
GET    /api/news?featured=
GET    /api/news/:id
GET    /api/legal-questions?status=
POST   /api/consultations
GET    /api/dashboard/stats          (Admin)
GET    /api/admin/consultations
PATCH  /api/admin/consultations/:id
POST   /api/admin/properties
PATCH  /api/admin/properties/:id
DELETE /api/admin/properties/:id
POST   /api/admin/scraping/sync
POST   /api/admin/scraping/stop
GET    /api/admin/system-logs
```

---

*본 PRD는 `DESIGN.md` 및 HTML 프로토타입과 함께 living document로 관리한다.*
