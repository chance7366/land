# CHANCE AUCTION — Design Specification

> 내포신도시 부동산 & 경매 전문 플랫폼  
> 구현 기준: `index.html` (사용자 앱) · `admin.html` (관리자 콘솔)  
> 디자인 시스템: Material Design 3 컬러 토큰 + Tailwind CSS

---

# Part I — 사용자 앱 (CHANCE AUCTION)

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **서비스명** | CHANCE AUCTION |
| **페이지 타이틀** | CHANCE AUCTION \| 내포신도시 부동산 & 경매 전문 |
| **부제** | 내포신도시 부동산 & 경매 전문 |
| **언어** | 한국어 (`lang="ko"`) |
| **테마** | Light (`class="light"`) |
| **레이아웃 패턴** | 홈: 다크 세로 랜딩 · 목록: 라이트 리스트 + 하단 탭 |

### 핵심 UX 컨셉

- **다크 랜딩 홈**: 가치제안 → 서비스 요약 → 추천 소수 → 상담 CTA (AI클럽식 세로 스토리)
- **목록 페이지로 탐색**: 매물·경매·소식·법률 전체는 각 라우트에서 확인
- **하단 네비(목록)**: 탭이 `/properties` 등 라우트로 이동 (`md:hidden`)
- **즉시 상담 접근**: 랜딩 헤더·히어로·FinalCta의 primary CTA

---

## 2. 디자인 토큰

### 2.1 컬러 팔레트

Material Design 3 기반 커스텀 토큰. Tailwind 클래스명으로 사용.

#### Brand Accent 2색 원칙

앱 전역 UI는 **네이vy (`primary`) + 블루 계열 (`primary-container`, `inverse-primary`, `primary-fixed` 등)** 만 브랜드 강조색으로 사용합니다.

| 용도 | 토큰 | 금지 |
|------|------|------|
| Primary CTA (상담, FAB, 헤더 버튼) | `primary` / `on-primary` | FAB·CTA에 `bg-secondary` |
| Secondary accent (가격 strip, 활성 칩) | `primary-container`, `primary-fixed`, `inverse-primary` | rainbow green/gold |
| 상태: 경매 안전등급 | `secondary-fixed` | 일반 버튼·보더에 사용 금지 |
| 상태: 긴급/태그 | `error-container` | — |
| 홈 4열 top-border | 네이vy 4톤 (`primary`, `primary-container`, `inverse-primary`, `primary-fixed-dim`) | `border-secondary`, gold |

#### Primary (브랜드 · 신뢰)

| 토큰 | Hex | 용도 |
|------|-----|------|
| `primary` | `#031635` | 헤더 로고, 버튼, 강조 텍스트, 스크롤바 |
| `on-primary` | `#ffffff` | Primary 위 텍스트 |
| `primary-container` | `#1a2b4b` | 경매 카드 내부 배경 |
| `on-primary-container` | `#8293b8` | Primary container 보조 텍스트 |
| `primary-fixed` | `#d8e2ff` | — |
| `primary-fixed-dim` | `#b6c6ef` | — |
| `on-primary-fixed` | `#081b3a` | — |
| `on-primary-fixed-variant` | `#364768` | — |
| `inverse-primary` | `#b6c6ef` | — |

#### Secondary (Semantic — 경매 안전등급만)

> **주의**: Secondary 녹색 계열은 **경매 "안전" 뱃지·추천가** 등 상태값에만 사용. CTA·FAB·일반중개 UI에는 사용하지 않음.

| 토큰 | Hex | 용도 |
|------|-----|------|
| `secondary` | `#3b6934` | Admin 콘솔 (범위外) |
| `on-secondary` | `#ffffff` | — |
| `secondary-container` | `#b9eeab` | — |
| `on-secondary-container` | `#3f6d38` | — |
| `secondary-fixed` | `#bcf0ae` | **경매 추천가, 안전 뱃지** |
| `secondary-fixed-dim` | `#a1d494` | — |
| `on-secondary-fixed` | `#002201` | — |
| `on-secondary-fixed-variant` | `#23501e` | — |

#### Tertiary (레거시 토큰 — 사용자 앱 UI 미사용)

> Tertiary/gold 계열은 MD3 팔레트 보존용. **사용자 앱 홈·매물 UI에서는 primary shade만 사용.**

| 토큰 | Hex | 용도 |
|------|-----|------|
| `tertiary` | `#211500` | — |
| `on-tertiary` | `#ffffff` | — |
| `tertiary-container` | `#3a2800` | — |
| `on-tertiary-container` | `#b18d48` | — |
| `tertiary-fixed` | `#ffdea5` | — |
| `tertiary-fixed-dim` | `#e9c176` | — |
| `on-tertiary-fixed` | `#261900` | — |
| `on-tertiary-fixed-variant` | `#5d4201` | — |

#### Surface (배경 · 카드)

| 토큰 | Hex | 용도 |
|------|-----|------|
| `background` | `#f8f9fa` | 페이지 배경 |
| `on-background` | `#191c1d` | — |
| `surface` | `#f8f9fa` | 헤더 배경 |
| `on-surface` | `#191c1d` | 본문 기본 텍스트 |
| `on-surface-variant` | `#44474e` | 보조 설명 텍스트 |
| `surface-bright` | `#f8f9fa` | — |
| `surface-dim` | `#d9dadb` | — |
| `surface-container-lowest` | `#ffffff` | 답변 박스 배경 |
| `surface-container-low` | `#f3f4f5` | 컬럼 패널 배경 |
| `surface-container` | `#edeeef` | 아이콘 원형 배경 |
| `surface-container-high` | `#e7e8e9` | 건수 뱃지 배경 |
| `surface-container-highest` | `#e1e3e4` | — |
| `surface-variant` | `#e1e3e4` | — |
| `surface-tint` | `#4e5e81` | — |

#### Outline · Error

| 토큰 | Hex | 용도 |
|------|-----|------|
| `outline` | `#75777f` | 메타 텍스트, 아이콘 |
| `outline-variant` | `#c5c6cf` | 구분선, 카드 보더 |
| `error` | `#ba1a1a` | 진행중 뱃지, 경매 컬럼 상단 보더 |
| `on-error` | `#ffffff` | — |
| `error-container` | `#ffdad6` | — |
| `on-error-container` | `#93000a` | — |

#### Inverse

| 토큰 | Hex |
|------|-----|
| `inverse-surface` | `#2e3132` |
| `inverse-on-surface` | `#f0f1f2` |

---

### 2.2 타이포그래피

#### 폰트 패밀리

| 역할 | 폰트 | Google Fonts |
|------|------|--------------|
| **Headline / Display** | Plus Jakarta Sans | `wght@400;500;600;700;800` (Admin 포함) |
| **Body / Label / Data** | Work Sans | `wght@400;500;600` |

#### 폰트 패밀리 별칭 (Admin 추가)

| 토큰 | 폰트 | 용도 |
|------|------|------|
| `headline` | Plus Jakarta Sans | Admin 섹션 제목 |
| `display` | Plus Jakarta Sans | Admin KPI 숫자 |
| `body` | Work Sans | Admin 본문 |
| `label` | Work Sans | Admin 라벨·버튼 |

#### 타입 스케일

| 토큰 | 크기 | Line Height | Weight | Letter Spacing | 용도 |
|------|------|-------------|--------|----------------|------|
| `display-lg` | 48px | 1.2 | 700 | -0.02em | 히어로 (예약) |
| `headline-lg` | 32px | 1.3 | 700 | — | 대제목 |
| `headline-lg-mobile` | 28px | 1.3 | 700 | — | 모바일 대제목 |
| `headline-md` | 24px | 1.4 | 600 | — | 섹션 제목, 로고 |
| `body-lg` | 18px | 1.6 | 400 | — | 본문 강조 |
| `body-md` | 16px | 1.6 | 400 | — | 기본 본문 (`font-body-md`) |
| `label-md` | 14px | 1.2 | 500 | 0.01em | 버튼, 라벨 |
| `data-numeral` | 20px | 1.0 | 600 | -0.01em | 가격 숫자 |

#### 대시보드·카드 위계 (신규)

| 토큰 | 크기 | Weight | 용도 |
|------|------|--------|------|
| `font-section-title` | 21px | 700 | SectionHeader, 상세 섹션 제목 |
| `font-card-title` | 15px | 600 | 카드·리스트 제목 |
| `font-meta-bold` | 14px | 700 | 가격, D-day 등 강조 메타 |
| `font-caption` | 12px | 400 (lh 1.5) | 본문·Q&A·날짜·하단 네비 |

#### 인라인 크기 (레거시 — 신규 UI는 위 토큰 우선)

| 클래스 | 크기 | 용도 |
|--------|------|------|
| `text-sm` | 14px | 카드 제목, 리스트 제목 |
| `text-xs` | 12px | 설명, 태그, 버튼 |
| `text-[11px]` | 11px | 리스트 부제, Q&A 메타 |
| `text-[10px]` | 10px | 날짜, D-day, 하단 네비 |

---

### 2.3 간격 (Spacing)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `base` | 8px | 기본 단위 |
| `gutter` | 1rem (16px) | 컬럼 간격 보조 |
| `container-padding-mobile` | 1.25rem (20px) | 헤더 좌우 패딩 |
| `container-padding-desktop` | 2.5rem (40px) | 데스크톱 컨테이너 |
| `section-gap` | 4rem (64px) | 섹션 간격 |

#### 레이아웃 수치

| 요소 | 값 |
|------|-----|
| 대시보드 패딩 | `p-4` (모바일) / `md:p-6` (데스크톱) |
| 컬럼 너비 | `300px` (모바일) / `md:grid-cols-4` (데스크톱 4열) |
| 컬럼 최소 높이 | `min-h-[560px]` / `md:min-h-[640px]` (Equal Height) |
| 컬럼 내부 gap | `gap-4` (16px) |
| 메인 하단 패딩 | `pb-24 md:pb-8` (모바일: 하단 네비 공간) |
| FAB 위치 | `bottom-20 right-6` (모바일) / `md:bottom-6` |
| FAB 색상 | `bg-primary text-on-primary` |
| FAB 크기 | `56×56px` (`w-14 h-14`) |

---

### 2.4 Border Radius

| 토큰 | 값 | 용도 |
|------|-----|------|
| `DEFAULT` | 0.25rem (4px) | 태그 |
| `lg` | 0.5rem (8px) | 이미지, 버튼 |
| `xl` | 0.75rem (12px) | 카드 |
| `2xl` | 1rem (16px) | 컬럼 패널 |
| `full` | 9999px | pill 버튼, FAB, 뱃지 |

---

### 2.5 그림자 · 효과

| 클래스 | 스펙 | 용도 |
|--------|------|------|
| `shadow-sm` | Tailwind default | 헤더, 카드 |
| `shadow-md` | Tailwind default | 컬럼 패널, CTA 버튼 |
| `shadow-2xl` | Tailwind default | FAB |
| `shadow-[0_-4px_12px_rgba(0,0,0,0.05)]` | 커스텀 | 하단 네비 상단 |
| `.property-card-shadow` | `0 4px 20px rgba(3,22,53,0.04)` | 매물 카드 (정의됨) |
| `.bg-glass` | `rgba(255,255,255,0.85)` + `blur(12px)` | 글래스모피즘 (예약) |
| `.stat-card` | hover: `translateY(-2px)`, shadow `0 4px 20px rgba(3,22,53,0.04)` | Admin KPI 카드 |
| `.sidebar-item-active` | bg `#b9eeab`, text `#3f6d38` | Admin 사이드바 활성 (CSS 클래스) |
| `.bento-grid` | 12-column grid, gap `1.5rem` | Admin Bento 레이아웃 |
| `.custom-scrollbar` | width 6px, track `#f1f1f1`, thumb `#031635` | Admin 테이블 가로 스크롤 |

---

### 2.6 아이콘

- **라이브러리**: Material Symbols Outlined
- **기본 설정**: `FILL 0`, `wght 400`, `GRAD 0`, `opsz 24`
- **활성 탭**: `FILL 1`

| 아이콘 | 사용 위치 |
|--------|-----------|
| `gavel` | 로고, 경매물건 탭 |
| `more_horiz` | 섹션 더보기 |
| `payments` | 매물 가격 |
| `newspaper` | 부동산소식 |
| `legal_services` | 법률상담 탭 |
| `chat` | FAB |
| `home` | 일반중개 탭 (활성) |

#### Admin 전용 아이콘

| 아이콘 | 사용 위치 |
|--------|-----------|
| `dashboard` | 사이드바 — 대시보드 (활성) |
| `search` | 사이드바 — 매물 관리 |
| `function` | 사이드바 — 경매 관리 (`data-icon="auction"`) |
| `reviews` | 사이드바 — 고객 후기 |
| `event` | 사이드바 — 상담 예약 |
| `person` | 프로필 아바타 |
| `show_chart` | 일일 방문자 KPI |
| `mail` | 새로운 문의 KPI |
| `api` | API 호출 성공률 KPI |
| `arrow_upward` | 증가율 표시 |
| `priority_high` | 긴급 문의 |
| `settings_ethernet` | API 시스템 관리 |
| `database` | 국토부 실거래가 API |
| `map` | 카카오 맵 API |
| `refresh` | 스크래핑 새로고침 |
| `sync` | Sync Now |
| `stop_circle` | 스크래핑 중지 |
| `check` | 문의 처리 완료 |

---

## 3. 페이지 구조

### 홈 (`/`) — 다크 랜딩 (AI클럽 벤치마크)

```
┌─────────────────────────────────────────┐
│  LandingHeader (sticky, dark)           │
│  [CHANCE gradient]     [상담 예약 CTA]   │
├─────────────────────────────────────────┤
│  LandingHero — 1메시지 + primary CTA    │
│  WhyChance — 문제 3카드                 │
│  ServiceCards — 4서비스 요약 → 목록     │
│  FeaturedPicks — 매물3 · 경매3          │
│  RegionTrust — 지역 커버리지            │
│  FinalCta — 상담 예약하기               │
└─────────────────────────────────────────┘
```

- 홈에 4열 대시보드·FAB·bottom nav **없음**
- 전체 리스트는 `/properties` `/auctions` `/news` `/legal`

### 목록 페이지 (라이트 유지)

```
┌─────────────────────────────────────────┐
│  UserHeader (라이트)                    │
├─────────────────────────────────────────┤
│  SectionPageHeader + 리스트             │
├─────────────────────────────────────────┤
│  UserBottomNav (md:hidden, 라우트 링크) │
└─────────────────────────────────────────┘
```

### Z-Index 계층

| 레이어 | z-index |
|--------|---------|
| LandingHeader / UserHeader | `z-50` |
| UserBottomNav | `z-50` |

---

## 4. 컴포넌트 명세

### 4.0 Landing (다크 홈)

벤치마크: [중개사 AI 클럽](https://realtor-aiclub-rosy.vercel.app/)

**토큰** (`globals.css`)

| 토큰 | Hex / 값 |
|------|----------|
| `landing-bg` | `#07070a` |
| `landing-surface` | `#0f0f15` |
| `landing-elevated` | `#15151d` |
| `landing-text` | `#f8fafc` |
| `landing-muted` | `#94a3b8` |
| `landing-border` | `rgba(255,255,255,0.08)` |
| `cta-from` / `cta-to` | `#2563eb` → `#8b5cf6` |

**LandingCta**

| variant | 스타일 |
|---------|--------|
| `primary` | blue→purple gradient, `rounded-xl`, `px-12 py-3.5`, glow shadow |
| `secondary` | `bg-landing-surface` + `border-landing-border` |
| `ghost` | 투명 + 얇은 보더 |

**히어로 카피**

| 줄 | 텍스트 |
|----|--------|
| Eyebrow | 내포신도시 · 홍성 부동산 & 경매 |
| H1 | 찬스부동산 경매중개 |
| Sub | 이집 저집 내집, 이땅 저땅 내땅 |
| CTA | 상담 예약하기 → `/consultation` |

**컴포넌트 경로:** `src/components/landing/*`

> 레거시 라이트 히어로·4열 대시보드는 `/mockup/hero-banner`, `/mockup/unified-dashboard` 및 `UserDashboard`에 보존.

---

### 4.1 Header (목록 페이지 — `UserHeader`)

| 속성 | 값 |
|------|-----|
| Position | `sticky top-0` |
| Background | `bg-surface` |
| Padding | `px-container-padding-mobile py-4` |
| Shadow | `shadow-sm` |

**구성**
- 좌: `gavel` 아이콘 + **CHANCE** (홈 링크)
- 우: **관리자** 링크 + **상담 예약** 버튼 — `bg-primary text-on-primary rounded-full`

**버튼 상태**
- Hover: `opacity-90`
- Transition: `transition-all`

---

### 4.1.1 HomeHeroBanner (레거시 목업)

홈에서는 미사용. `/mockup/hero-banner` 및 `HomeHeroBanner.tsx`에 보존.

| 속성 | 값 |
|------|-----|
| 목업 | `/mockup/hero-banner` (`robots: noindex`) |
| 배경 | `public/images/hero-naepo.jpg` |

**히어로 이미지 출처**

| 항목 | 내용 |
|------|------|
| 파일 | `public/images/hero-naepo.jpg` |
| 출처 | [Unsplash — a city with many buildings](https://unsplash.com/photos/a-city-with-many-buildings-rRSpD1mDZbs) by hyeok Eom (@eomhyeok) |
| 촬영지 | Seongnam, Gyeonggi-do, South Korea (한국 아파트 단지 전경 — 내포신도시 대표 이미지 대체) |
| 라이선스 | [Unsplash License](https://unsplash.com/license) — 상업적·비상업적 무료 사용 가능 |

> 실제 내포신도시 CC/공공 이미지 확보 시 동일 경로(`hero-naepo.jpg`)로 교체하고 이 표를 갱신.

---

### 4.2 Dashboard Column (공통 — 레거시/목업)

각 섹션(`section`)은 동일한 구조를 따름. **홈에서는 미사용** — `/mockup/unified-dashboard` 및 내부 참조용.

| 속성 | 값 |
|------|-----|
| Width | `w-[300px] md:w-auto` (데스크톱 4열 그리드) |
| Snap | `snap-start` (모바일) / `md:snap-none` |
| Layout | `flex flex-col gap-4 flex-shrink-0 h-full` |

**섹션 헤더**
- 제목: `font-section-title text-primary`
- 건수 뱃지: `font-caption bg-surface-container-high rounded-full text-on-surface-variant`
- 더보기: `more_horiz` (`text-outline`)

**패널 (컬럼 본체 — `DashboardPanel`)**
- Shape: `rounded-2xl p-4 min-h-[560px] md:min-h-[640px]`
- Layout: `flex flex-col gap-4 flex-1`
- 상단 보더: `border-t-4` (`DASHBOARD_SECTION_BORDERS` — 네이vy 4톤)
- 하단 CTA: `DashboardCta` + `mt-auto` — 4열 하단 라인 정렬

---

### 4.3 Property Card (일반중개)

**2축 분류**
- **거래유형** (`PropertyType`): 매매 · 임대 · 분양권
- **물건유형** (`PropertyCategory`): 아파트 · 오피스텔 · 상가 · 업무시설 · 연립 · 다세대 · 토지

**카드 변형** (`PropertyCard`)

| 변형 | 용도 | 노출 정보 |
|------|------|-----------|
| `featured` | 홈 컬럼 Featured | 썸네일, 물건·거래 뱃지, 제목, `formatPropertyPrice`, `formatPropertySummary`, 지역 |
| `compact` | 홈 컬럼 리스트 | 미니 카드 (`rounded-lg bg-white border shadow-sm`), 제목·가격·뱃지 |
| `default` | `/properties` 그리드 | 썸네일 + L1 스캔 정보 전체 |

**한 줄 스펙** (`formatPropertySummary`): `전용 84㎡ · 15/25층 · 남향`

**가격 표시** (`formatPropertyPrice`)

| 거래유형 | 표시 |
|----------|------|
| 매매 | `4억 2,000` (만원 단위 `price`) |
| 임대 | `보증금 3,000 / 월 150` (`deposit` + `monthlyRent`, 전세는 `isJeonse`) |
| 분양권 | `분양가 2억 8,000` |

**유형·거래 컬러 매핑** (`property-ui.ts`) — **Primary shade only**

| 물건유형 | accent (카드 top/left border) | 필터 활성 |
|----------|--------------------------------|-----------|
| 아파트 | `primary` | `bg-primary` |
| 오피스텔 | `primary-container` | `bg-primary-container` |
| 상가 | `inverse-primary` | `bg-inverse-primary` |
| 업무시설 | `primary-fixed` | `bg-primary-fixed` |
| 연립 | `primary-fixed-dim` | `bg-primary-fixed-dim` |
| 다세대 | `on-primary-container` | `bg-on-primary-container/30` |
| 토지 | `on-primary-fixed-variant` | `bg-on-primary-fixed-variant` |

| 거래유형 | 칩·가격 스트립 |
|----------|----------------|
| 매매 | `bg-primary` / `primary` strip |
| 임대 | `bg-primary-container` / `primary-container` strip |
| 분양권 | `bg-inverse-primary` / `inverse-primary` strip |

| 태그 (급매·즉시입주) | `error-container` |

**공통 UI 클래스** (`globals.css`): `.property-card` (hover lift), `.filter-chip-active`, `.scrollbar-hide`

**뱃지 컴포넌트**: `PropertyBadge` — variant `category` | `deal` | `tag`

---

### 4.3.1 `/properties` 허브

- **헤더 패널**: `border-t-4 border-t-primary`, 총 N건 pill (`bg-primary-container/15`)
- **필터 패널**: `rounded-2xl border-t-4 border-t-primary bg-surface-container-low`
- **유형 탭**: 7종 + 전체 — Material icon + primary shade pill
- **거래·지역 칩**: 매매 `primary` / 임대 `primary-container` / 분양권 `inverse-primary`
- **결과 요약**: `"아파트 · 매매 · 1건"` pill + 그리드 상단 텍스트
- **URL query**: `?category=APARTMENT&deal=SALE&region=내포&sort=price_asc`
- **컴포넌트**: `PropertyFilters`, `PropertyCard`, `PropertyBadge`

---

### 4.3.2 매물 상세 (`/properties/[id]`)

**공통 블록**
1. 이미지 갤러리
2. 가격 블록 + 물건·거래·태그 뱃지
3. 핵심 스펙 2×3 그리드 (`getCommonSpecItems`)
4. 유형별 추가 스펙 (`getCategorySpecItems`)
5. 위치 (주소·지역)
6. 상세 설명
7. CTA → `/consultation?propertyId=`

**유형별 추가 노출**

| 물건유형 | 추가 필드 |
|----------|-----------|
| 아파트 | 단지명, 동/호, 방/욕실, 관리비, 입주가능일 |
| 오피스텔 | 건물명, 관리비 |
| 상가 | 권리금, 현업종 |
| 토지 | 지목, 용도지역 |
| 분양권 | 입주예정 |

---

### 4.4 Text List Item (공통 리스트)

| 속성 | 값 |
|------|-----|
| Divider | `border-b border-outline-variant/30 pb-3` |
| Cursor | `cursor-pointer` |
| Hover | 제목 색상 → `secondary` 또는 `primary` |

---

### 4.5 Featured Auction Card (경매물건추천)

**Unified Light Panel** — 다른 3열과 동일한 밝은 패널

**패널**
- Background: `bg-surface-container-low` (4열 공통)
- Top border: `border-primary-container` (`DASHBOARD_SECTION_BORDERS.auctions`)

**Featured 카드** (`DashboardListCard`)
- Background: `bg-white`
- Accent: `border-l-4 border-l-primary-container`
- 텍스트: `text-on-surface` / `text-on-surface-variant`

**뱃지**
- 진행중: `bg-error-container text-on-error-container`
- 안전: `text-secondary-fixed font-bold` (텍스트만)

**CTA**
- `DashboardCta variant="outline"` — "분석 리포트", "경매 물건 리스트"

---

### 4.6 Featured News Card (부동산소식)

**패널**
- Top border: `border-inverse-primary` (`DASHBOARD_SECTION_BORDERS.news`)

**카드 헤더**
- 아이콘 원: `w-10 h-10 rounded-full bg-surface-container`
- 날짜: `text-[10px] text-outline`

**본문 이미지**
- `h-24 opacity-80 rounded-lg`

---

### 4.7 Legal Q&A Card (법률상담)

**패널**
- Top border: `border-primary-fixed-dim` (`DASHBOARD_SECTION_BORDERS.legal`)

**태그**
- `bg-primary/10 text-primary text-[10px] rounded font-bold`
- 예: `임대차`, `답변완료`

**답변 박스**
- `bg-surface-container-lowest border-l-2 border-primary rounded-lg p-3`
- 라벨: "찬스 법률자문단 답변"

**Q 리스트**
- Q 마커: `text-primary font-bold`
- 상태: `답변 대기 중 • 1시간 전` (`text-[10px] text-outline`)

**하단 CTA 블록**
- `bg-primary-container/10 border border-primary/15 rounded-xl p-4 text-center`
- 버튼: `DashboardCta variant="primary"` (`hover:opacity-90 hover:shadow-md`)

---

### 4.8 Floating Action Button (FAB)

| 속성 | 값 |
|------|-----|
| Position | `fixed bottom-20 right-6 md:bottom-6` |
| Size | `56×56px` |
| Shape | `rounded-full` |
| Color | `bg-primary text-on-primary` |
| Shadow | `shadow-2xl` |
| Active | `active:scale-95` |
| Icon | `chat` |
| A11y | `aria-label="채팅 상담"` |

---

### 4.8.1 DashboardCta (홈 CTA 공통)

| variant | 스타일 | 용도 |
|---------|--------|------|
| `primary` | `bg-primary text-on-primary` | 상담 신청하기 (1곳만) |
| `outline` | `border bg-white text-primary` | 전체 매물, 경매, 뉴스, 분석 리포트 |

공통: `hover:opacity-90 hover:shadow-md transition-all`, `mt-auto`로 패널 하단 정렬

### 4.8.2 SectionPageHeader (목록 페이지 헤더)

- `/properties`, `/auctions`, `/news` 공통
- `border-t-4` + `DASHBOARD_SECTION_BORDERS` + `bg-surface-container-low`
- props: `title`, `description?`, `count?`, `borderClass`

### 4.8.3 DashboardListCard (리스트 카드)

- `rounded-lg border border-outline-variant/30 bg-white p-3 shadow-sm`
- optional `accentBorderClass` (경매: `border-l-primary-container`)
- hover: `group-hover:text-primary`

### 4.8.4 디자인 목업

- 경로: `/mockup/unified-dashboard` (`robots: noindex`)
- Before/After 4열 비교 + 색상 토큰 레전드

---

### 4.9 Bottom Navigation

| 속성 | 값 |
|------|-----|
| Position | `fixed bottom-0 left-0 w-full` |
| Visibility | **`md:hidden`** — 데스크톱에서는 4열 그리드로 탐색 |
| Layout | `grid grid-cols-4 py-3` |
| Background | `bg-white` |
| Border | `border-t border-outline-variant/30` |

**탭 상태**

| 상태 | 아이콘 | 텍스트 | 색상 |
|------|--------|--------|------|
| Active | FILL 1 | `font-bold` | `text-primary` |
| Inactive | FILL 0 | `font-medium` | `text-on-surface-variant` |
| Hover | — | — | `hover:text-primary` |

**탭 목록**

| # | 라벨 | 아이콘 | 연결 섹션 |
|---|------|--------|-----------|
| 1 | 일반중개 | `home` | 일반중개 |
| 2 | 경매물건 | `gavel` | 경매물건추천 |
| 3 | 부동산소식 | `newspaper` | 부동산소식 |
| 4 | 법률상담 | `balance` | 법률상담 |

---

## 5. 카테고리별 디자인 차별화

| 카테고리 | 패널 배경 | 상단 보더 | 강조색 | 특징 |
|----------|-----------|-----------|--------|------|
| **일반중개** | `surface-container-low` | `primary` | Primary | 밝은 톤, 매물 미니 카드 |
| **경매물건추천** | `surface-container-low` | `primary-container` | Primary + semantic | 흰 카드, left-border accent, 안전 텍스트만 green |
| **부동산소식** | `surface-container-low` | `inverse-primary` | Primary | 뉴스 카드 + 리스트 |
| **법률상담** | `surface-container-low` | `primary-fixed-dim` | Primary | Q&A, 답변 박스, `DashboardCta` |

---

## 6. 인터랙션

### 6.1 가로 스크롤

```css
/* 컨테이너 */
flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4

/* 컬럼 */
snap-start flex-shrink-0
```

**데스크톱 드래그**
- `mousedown` → `mousemove` → `mouseup`
- 스크롤 속도: `(deltaX) * 1.5`
- 드래그 중: `cursor-grabbing`

### 6.2 하단 네비 → 섹션 스크롤

- 클릭 시 `scrollIntoView({ behavior: 'smooth', inline: 'start' })`
- 활성 탭 스타일 토글 (색상, FILL, font-weight)

### 6.3 호버 효과

| 대상 | 효과 |
|------|------|
| 리스트 제목 | `group-hover:text-secondary` 또는 `group-hover:text-primary` |
| 경매 리스트 | `group-hover:text-secondary-fixed` |
| CTA 텍스트 버튼 | `hover:bg-white/50` 또는 `hover:text-white` |
| Primary 버튼 | `hover:opacity-90` |
| FAB | `active:scale-95` |

---

## 7. 반응형

| Breakpoint | 동작 |
|------------|------|
| **Mobile (<768px)** | 컬럼 300px, 가로 snap 스크롤 1컬럼 중심, 하단 네비 표시 |
| **Desktop (≥768px)** | `md:grid md:grid-cols-4` 4열 Equal Height, 하단 네비 `md:hidden`, 패딩 `md:p-6` |

### 스크롤바

- 세로: 4px, thumb `#031635`
- 가로 대시보드: 숨김 (`scrollbar-width: none`)

---

## 8. 콘텐츠 샘플 데이터

### 일반중개 (7건 — 유형별 샘플)

| 물건유형 | 거래 | 제목 | 가격/스펙 |
|----------|------|------|-----------|
| 아파트 | 매매 | 내포신도시 OO아파트 84㎡ | 4억 2,000 · 전용 84㎡ · 15/25층 · 남향 |
| 상가 | 임대 | 홍성 중심가 1층 상가 | 보증금 3,000 / 월 150 |
| 토지 | 매매 | 단독주택 부지 120평 | 3억 5,000 · 지목 대 · 용도지역 주거 |
| 오피스텔 | 분양권 | 내포 프리미엄 오피스텔 | 분양가 2억 8,000 |
| 업무시설 | 매매 | 내포 업무시설 3층 | 전용 330㎡ |
| 연립 | 매매 | 홍성 연립 3세대 | 방 3 · 욕실 2 |
| 다세대 | 임대 | 내포 다세대 2층 | 보증금 2,000 / 월 80 |

### 경매물건추천 (8건)

| 사건번호 | 물건 | 감정가 | 추천가 | D-day |
|----------|------|--------|--------|-------|
| 2023타경 12345 | 골든타워 상가 3층 | ₩7.2억 | ₩5.1억 | 진행중 |
| — | 한양수자인 110동 15층 | — | — | D-7 |
| — | 근린생활시설 용지 150평 | — | — | D-14 |
| — | 이지더원 2차 저층 급매물 | — | — | D-21 |

### 부동산소식 (25건)

- Featured: 내포신도시 개발 계획 발표 (2024-05-19)
- List: 내포-홍성 광역철도, 6월 정책, 종합병원, 아파트 시세

### 법률상담 (Q&A)

- Featured: 계약 만료 전 퇴거 시 복비 문제 (임대차 · 답변완료)
- Pending: 경매 낙찰 후 명도 절차 기간?
- Done: 토지 용도 변경, 증여 취득세

---

## 9. 기술 스택

| 영역 | 선택 |
|------|------|
| CSS | Tailwind CSS (CDN) |
| Plugins | `forms`, `container-queries` |
| Icons | Material Symbols Outlined |
| Fonts | Google Fonts |
| Dark Mode | `class` 전략 (현재 Light만 사용) |
| JS | Vanilla — 드래그 스크롤, 네비 연동 |

---

## 10. 접근성 · UX 권장사항

- [ ] FAB에 `aria-label` 적용됨
- [ ] 이미지 `alt` 속성 제공
- [ ] 키보드 포커스 스타일 추가 권장
- [ ] `prefers-reduced-motion` 대응 권장
- [ ] 다크 모드 토큰은 정의되어 있으나 UI 미구현

---

## 11. 파일 구조 (Part I)

```
Chance Real Estate & Auction/
├── index.html      # 사용자 앱 구현본
├── admin.html      # Part II — 관리자 콘솔 (디자인 원본 HTML 기준)
└── DESIGN.md       # 본 디자인 명세
```

---

# Part II — 관리자 콘솔 (CHANCE ADMIN)

## 12. Admin 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **서비스명** | CHANCE ADMIN |
| **페이지 타이틀** | CHANCE Admin Dashboard |
| **부제** | Management Console |
| **언어** | 한국어 (`lang="ko"`) |
| **테마** | Light (`class="light"`) — Part I과 동일 MD3 토큰 |
| **레이아웃 패턴** | 고정 사이드바 + Bento Grid 메인 캔버스 |
| **최소 높이** | `min-height: max(884px, 100dvh)` |

### 핵심 UX 컨셉

- **통합 관리 콘솔**: 매물·경매·소식·후기·상담을 한 화면에서 모니터링
- **실시간 상태 표시**: System Online 인디케이터, API/스크래핑 상태
- **Bento Grid**: API 관리(5col) + 스크래핑 제어(7col) + 문의 테이블(full)
- **데스크톱 퍼스트**: 고정 288px 사이드바, `ml-72` 메인 오프셋

---

## 13. Admin 페이지 구조

```
┌──────────┬──────────────────────────────────────────────────┐
│ SideNav  │  Main Canvas (ml-72, p-10)                       │
│ w-72     │  ┌ Header: 대시보드 개요 + System Online ──────┐ │
│ fixed    │  └──────────────────────────────────────────────┘ │
│          │  ┌ Stats Grid (4 KPI cards) ────────────────────┐ │
│ CHANCE   │  └──────────────────────────────────────────────┘ │
│ ADMIN    │  ┌ Bento Grid ──────────────────────────────────┐ │
│          │  │ [API 관리 5col] │ [스크래핑 제어 7col]       │ │
│ nav ×6   │  │ [법률상담·문의 관리 테이블 — full 12col]     │ │
│          │  └──────────────────────────────────────────────┘ │
│ profile  │  Footer: © 2024 + 링크                           │
└──────────┴──────────────────────────────────────────────────┘
```

### Z-Index 계층

| 레이어 | z-index |
|--------|---------|
| SideNav (`aside`) | `z-40` |

### 레이아웃 수치

| 요소 | 값 |
|------|-----|
| 사이드바 너비 | `w-72` (288px) |
| 사이드바 | `fixed left-0 top-0 h-full rounded-r-xl shadow-lg` |
| 메인 오프셋 | `ml-72 flex-1 p-10 min-w-0` |
| Body | `flex min-h-screen bg-surface` |
| Bento gap | `1.5rem` (12-column grid) |
| Stats grid | `grid-cols-1 md:grid-cols-4 gap-6 mb-8` |
| KPI 카드 높이 | `h-32` |

---

## 14. Admin 컴포넌트 명세

### 14.1 SideNav (Navigation Drawer)

| 속성 | 값 |
|------|-----|
| Background | `bg-surface-container-lowest` |
| Padding | `py-6` |
| Shape | `rounded-r-xl` |
| Shadow | `shadow-lg` |

**브랜드 영역** (`px-8 mb-10`)
- 제목: **CHANCE ADMIN** — `font-headline-md text-primary font-bold tracking-tight`
- 부제: **Management Console** — `font-label-md text-on-surface-variant opacity-70`

**네비게이션 항목**

| # | 라벨 | 아이콘 | 기본 상태 |
|---|------|--------|-----------|
| 1 | 대시보드 | `dashboard` | **Active** |
| 2 | 매물 관리 | `search` | Inactive |
| 3 | 경매 관리 | `function` | Inactive |
| 4 | 부동산 소식 | `newspaper` | Inactive |
| 5 | 고객 후기 | `reviews` | Inactive |
| 6 | 상담 예약 | `event` | Inactive |

**Nav Item 스타일**

| 상태 | 클래스 |
|------|--------|
| Active | `bg-secondary-container text-on-secondary-container rounded-full px-6 py-3 mx-4 scale-95` |
| Inactive | `text-on-surface-variant hover:bg-surface-container-high rounded-full px-6 py-3 mx-4 transition-colors` |
| Layout | `flex items-center gap-4` |

**프로필 영역** (`px-8 mt-auto pt-6 border-t border-outline-variant`)
- 아바타: `w-10 h-10 rounded-full bg-primary text-white` + `person` 아이콘
- 이름: **관리자 님** — `font-label-md font-bold`
- 권한: **시스템 최고권한** — `text-[10px] text-on-surface-variant`

---

### 14.2 Page Header

| 속성 | 값 |
|------|-----|
| Layout | `flex justify-between items-end mb-10` |

**좌측**
- 제목: **대시보드 개요** — `font-headline-lg text-primary tracking-tight`
- 설명: **실시간 시스템 현황 및 서비스 통합 관리** — `font-body-md text-on-surface-variant`

**우측**
- System Online 뱃지: `bg-surface-container-high px-4 py-2 rounded-lg`
  - 펄스 dot: `w-2 h-2 rounded-full bg-secondary animate-pulse`
  - 텍스트: **System Online**
- CTA: **시스템 로그 확인** — `bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90`

---

### 14.3 Stat Card (KPI)

| 속성 | 값 |
|------|-----|
| Class | `.stat-card` |
| Background | `bg-white` |
| Border | `border border-outline-variant` |
| Radius | `rounded-xl` |
| Padding | `p-6` |
| Height | `h-32` |
| Layout | `flex flex-col justify-between` |
| Hover | `translateY(-2px)` + shadow |

**4개 KPI**

| KPI | 아이콘 | 값 | 부가 정보 | 부가 색상 |
|-----|--------|-----|-----------|-----------|
| 일일 방문자 수 | `show_chart` | **1,284** | ↑ 12% | `text-secondary` |
| 새로운 문의 | `mail` | **24** | Urgent | `text-error` |
| 활성 경매 물건 | `gavel` | **156** | 건 | `text-on-surface-variant` |
| API 호출 성공률 | `api` | **99.8** | % | `text-on-surface-variant` |

**숫자 스타일**: `font-data-numeral text-display-lg text-primary`

---

### 14.4 Bento Grid 섹션

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}
```

| 블록 | Span | 높이/특성 |
|------|------|-----------|
| API 시스템 관리 | `col-span-12 lg:col-span-5` | 흰색 카드 |
| 네이버 부동산 스크래핑 제어 | `col-span-12 lg:col-span-7` | 원형 progress + 컨트롤 |
| 법률상담 및 문의 관리 | `col-span-12` | 데이터 테이블 |

**공통 카드 스타일**: `bg-white p-8 rounded-xl border border-outline-variant shadow-sm`

---

### 14.5 API 시스템 관리

**헤더**
- 제목: **API 시스템 관리** — `font-headline-md text-primary`
- 아이콘: `settings_ethernet` (`text-primary-container`)

**API Row** (`bg-surface rounded-lg p-4`)

| API | 아이콘 배경 | 상태 | Toggle |
|-----|-------------|------|--------|
| 국토부 실거래가 API v2.4 Connected | `bg-secondary-container` + `database` | **ACTIVE** (`text-secondary`) | ON (`peer-checked:bg-primary`) |
| 카카오 맵 API Daily limit: 82% used | `bg-surface-variant` + `map` | **WARNING** (`text-on-tertiary-container`) | ON |

**Toggle Switch**
- Track: `w-11 h-6 bg-surface-dim rounded-full`
- Thumb: `after:h-5 after:w-5 after:bg-white`
- Checked: `peer-checked:bg-primary`, thumb translate right

**동기화 로그 패널** (`mt-8 p-6 bg-primary-container rounded-xl text-white`)
- 제목: **최근 API 동기화 로그** — `opacity-80`
- 폰트: `text-xs font-mono`
- 로그 예시:

| 시간 | 이벤트 | 결과 |
|------|--------|------|
| 14:20:05 | DATA_FETCH_SUCCESS | OK (`text-secondary-fixed`) |
| 14:00:12 | REAL_PRICE_UPDATE | OK |
| 13:30:44 | NEIGHBORHOOD_SYNC | ERR (`text-error`) |

---

### 14.6 네이버 부동산 스크래핑 제어

**헤더**
- 제목: **네이버 부동산 스크래핑 제어**
- 액션: `refresh` 버튼 — `hover:bg-surface-container rounded-lg`

**Progress Ring** (`w-48 h-48`, SVG circle)
- 배경 원: `text-surface-container`, stroke-width 8
- 진행 원: `text-primary`, `stroke-dasharray="552"`, `stroke-dashoffset="138"` → **75%**
- 중앙: **75%** + **Syncing...**

**수집기 상태 카드** (`bg-surface p-4 rounded-lg`)
- 제목: **내포신도시 매물 수집기**
- 뱃지: **RUNNING** — `bg-secondary-container text-on-secondary-container text-[10px] rounded font-bold`
- 최근 동기화: 2024-05-20 14:15:22
- 새 매물: **12건** (`text-primary font-bold`)

**액션 버튼**
- **Sync Now**: `flex-1 bg-primary text-white py-4 rounded-xl font-bold` + `sync` 아이콘
- **Stop**: `border border-outline text-primary rounded-xl` + `stop_circle`

**통계 3분할** (`grid grid-cols-3 gap-4`)

| 라벨 | 값 | 색상 |
|------|-----|------|
| Scraped | 1,402 | `text-primary` |
| Errors | 3 | `text-error` |
| Updated | 42 | `text-secondary` |

---

### 14.7 문의 관리 테이블

**헤더**
- 제목: **법률상담 및 문의 관리**
- 부제: **최근 48시간 이내 접수된 긴급 상담 요청**
- 링크: **전체 내역 보기** — `text-primary border-b border-primary`

**테이블** (`.custom-scrollbar`, `overflow-x-auto`)

| 컬럼 | 설명 |
|------|------|
| 접수 일시 | `text-sm` |
| 의뢰인 | 아바타(이니셜) + 이름 |
| 상담 분류 | `bg-surface-variant text-xs px-2 py-1 rounded` |
| 내용 요약 | `text-sm text-on-surface-variant` |
| 상태 | Status Badge |
| 관리 | chat / check 버튼 |

**thead**: `bg-surface-container text-on-surface-variant`

**Status Badge**

| 상태 | 스타일 |
|------|--------|
| Pending | `bg-error-container text-on-error-container` + red dot |
| Processing | `bg-secondary-container text-on-secondary-container` + green dot |

**아바타 색상 (의뢰인)**

| 이름 | 배경 토큰 | 텍스트 |
|------|-----------|--------|
| 김철수 | `primary-fixed` | `text-primary` |
| 이영희 | `tertiary-fixed` | `text-on-tertiary-fixed` |
| 박민준 | `secondary-fixed` | `text-on-secondary-fixed` |

**행 액션**
- Chat: `hover:bg-primary-fixed rounded-lg text-primary`
- Complete: `bg-primary-container hover:bg-primary text-white rounded-lg`

**샘플 데이터**

| 일시 | 의뢰인 | 분류 | 요약 | 상태 |
|------|--------|------|------|------|
| 2024.05.20 14:02 | 김철수 | 경매 입찰 대행 | 내포신도시 OO아파트 경매 참여... | Pending |
| 2024.05.20 13:45 | 이영희 | 권리분석 요청 | 홍성읍 상가건물 유치권... | Pending |
| 2024.05.20 11:20 | 박민준 | 부동산 절세 | 다주택자 취득세 중과... | Processing |

---

### 14.9 매물 관리 (Admin CRUD)

**목록** (`/admin/properties`)
- 테이블: 썸네일, 물건유형, 거래유형, 가격, 지역, 상태, Featured, 수정/삭제
- 필터: 유형·거래·상태
- **+ 매물 등록** → `/admin/properties/new`

**3단계 입력 폼** (`PropertyForm`)

| Step | 내용 |
|------|------|
| 1. 분류·노출 | 물건유형(7종), 거래유형, 상태, Featured, 제목 |
| 2. 위치·가격 | 지역, 주소, 단지명, 거래별 가격(매매/분양 `price`, 임대 `deposit`·`monthlyRent`·`isJeonse`) |
| 3. 스펙·미디어 | 공통 스펙 + 유형별 동적 필드, 이미지 URL, 설명, 태그 |

- Step 3 필드는 `property-fields.ts`의 `CATEGORY_SPEC_FIELDS`에 따라 물건유형별로만 노출
- 제목 자동 제안: `{단지명} {전용면적}㎡ {거래유형}` (수동 수정 가능)
- API: `GET/POST /api/admin/properties`, `GET/PATCH/DELETE /api/admin/properties/[id]`

---

| 속성 | 값 |
|------|-----|
| Layout | `mt-12 py-8 border-t border-outline-variant flex justify-between` |
| Opacity | `opacity-60` |
| Color | `text-on-surface-variant` |

**좌**: © 2024 Chance Real Estate & Auction Admin. Naepo New City Specialist.

**우 링크**: 시스템 설정 · 보안 가이드라인 · 로그아웃 (`hover:text-primary`)

---

## 15. Admin 인터랙션

### 15.1 사이드바 Active Toggle

- Nav 클릭 시 모든 링크에서 active 클래스 제거
- 클릭된 링크에 `bg-secondary-container text-on-secondary-container scale-95` 적용
- Inactive 링크: `text-on-surface-variant hover:bg-surface-container-high`

### 15.2 Sync Now 버튼

1. 클릭 → `sync` 아이콘 `animate-spin`
2. 버튼 disabled, 텍스트 **Synchronizing...**
3. 2초 후 복원 + alert **동기화가 완료되었습니다.**

### 15.3 Stat Card Hover

- `transform: translateY(-2px)`
- `box-shadow: 0 4px 20px rgba(3, 22, 53, 0.04)`

### 15.4 테이블 Row Hover

- `hover:bg-surface-container-low transition-colors`

---

## 16. Admin 반응형

| Breakpoint | 동작 |
|------------|------|
| **Mobile** | Stats 1열, Bento 블록 full-width (12col), 스크래핑 flex-col |
| **md (≥768px)** | Stats 4열 |
| **lg (≥1024px)** | Bento: API 5col + Scraping 7col |

---

## 17. Admin 기술 스택

| 영역 | 선택 |
|------|------|
| CSS | Tailwind CSS (CDN) + 커스텀 `.bento-grid`, `.stat-card` |
| Plugins | `forms`, `container-queries` |
| Icons | Material Symbols Outlined |
| Fonts | Google Fonts (Part I과 동일 + weight 400·500 추가) |
| JS | Vanilla — 사이드바 active, Sync 애니메이션 |

---

## 18. Part I ↔ Part II 공통 사항

| 항목 | 공유 여부 |
|------|-----------|
| MD3 컬러 토큰 | ✅ 동일 |
| Border Radius 토큰 | ✅ 동일 |
| Spacing 토큰 | ✅ 동일 |
| Typography 스케일 | ✅ 동일 (+ Admin 별칭 4종) |
| 레이아웃 패턴 | ❌ User: 모바일 가로 스크롤 / Admin: 사이드바 + Bento |
| 네비게이션 | ❌ User: Bottom Nav / Admin: SideNav |
| Primary CTA | User: 상담 예약 · Admin: 시스템 로그 확인 |

---

## 19. 전체 파일 구조

```
Chance Real Estate & Auction/
├── index.html      # Part I — 사용자 앱
├── admin.html      # Part II — 관리자 콘솔
├── DESIGN.md       # 디자인 명세
└── PRD.md          # 제품 요구사항 · 개발 계획
```

---

*Last updated: 2026-07-08 · Source: index.html, admin.html*
