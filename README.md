# CHANCE Real Estate & Auction

내포신도시 부동산 · 경매 · 법률상담 통합 플랫폼 (Next.js)

## 프로젝트 구조

```
├── docs/           DESIGN.md, PRD.md
├── prototype/      초기 HTML 프로토타입
├── prisma/         DB 스키마 및 seed
└── src/
    ├── app/        App Router 페이지
    ├── components/ UI 컴포넌트
    └── lib/        DB, auth, format 유틸
```

## 시작하기

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

- **사용자 앱**: http://localhost:3000
- **관리자**: http://localhost:3000/admin (개발 중 로그인 불필요)

### Admin 접근

- 사용자 앱 **헤더 → 관리자** 메뉴
- 또는 직접 `/admin` 접속

### Admin 로그인 (배포 시)

`.env`에서 `ADMIN_AUTH_ENABLED=true` 설정 후:

| 항목 | 값 |
|------|-----|
| 이메일 | `admin@chance.local` |
| 비밀번호 | `.env`의 `ADMIN_PASSWORD` (기본: `change-me-in-production`) |

## 주요 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run db:push` | SQLite 스키마 적용 |
| `npm run db:seed` | 샘플 데이터 + Admin 계정 |
| `npm run db:studio` | Prisma Studio |

## Sprint 1 완료 항목

- [x] Next.js 15 + TypeScript + Tailwind v4
- [x] DESIGN.md MD3 토큰 이식
- [x] Prisma SQLite 스키마
- [x] User 홈 대시보드 (DB 연동)
- [x] Admin 로그인 + 세션
- [x] Admin 대시보드 (KPI, API, 스크래핑, 문의)
- [x] 상담 신청 API + 폼
- [x] 매물/경매/뉴스/법률 상세 페이지

## 다음 Sprint (PRD Phase 1)

- Admin CRUD UI (매물/경매/뉴스)
- 문의 상태 변경 API
- Analytics 연동 (방문자 KPI)

## 문서

- [디자인 명세](docs/DESIGN.md)
- [제품 요구사항](docs/PRD.md)
