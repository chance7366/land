# 클라우드 전환 가이드 (Supabase + GitHub + Vercel)

로컬 SQLite/Prisma 개발을 유지한 채, Supabase·GitHub·Vercel로 배포 파이프라인을 구축하는 순서입니다.

---

## 1단계 — 보안·환경변수

### 완료된 작업
- `.gitignore`에 `.env`, `.env.local`, `node_modules` 등 시크릿/의존성 제외 확인
- 템플릿: [`.env.local.example`](../.env.local.example)

### 로컬에서 할 일

```powershell
cd "d:\바이브코딩\Chance Real Estate & Auction"
copy .env.local.example .env.local
# .env.local 을 열어 Supabase / Solapi / Gmail 값 입력
```

**중요:** `.env`, `.env.local` 은 절대 GitHub에 올리지 마세요.  
이미 커밋된 적이 있다면 GitHub에서 키를 폐기·재발급하고 히스토리에서 제거하세요.

---

## 2단계 — Supabase DB & Storage

### 2-1. 패키지 설치 (이미 설치된 경우 생략)

```powershell
npm install @supabase/supabase-js @supabase/ssr
```

### 2-2. 클라이언트 모듈
| 파일 | 용도 |
|------|------|
| `src/lib/supabase/client.ts` | 브라우저 |
| `src/lib/supabase/server.ts` | 서버 컴포넌트 / Route |
| `src/lib/supabase/admin.ts` | Service Role (서버 전용) |
| `src/lib/supabase/repos/*` | 홈·상담·구독 조회/저장 |
| `src/lib/supabase/storage.ts` | `property-images` 업로드 |

### 2-3. SQL 실행
1. [Supabase Dashboard](https://supabase.com/dashboard) → 프로젝트 생성
2. **SQL Editor** → New query
3. 파일 내용 전체 붙여넣기 후 Run:  
   [`supabase/migrations/001_init_chance.sql`](../supabase/migrations/001_init_chance.sql)

포함 테이블:
- `properties` — 매물 (images jsonb)
- `auctions` — 경매
- `consultations` — 1:1 상담 예약
- `legal_questions` — 찬스상담소 Q&A
- `success_stories` — 성공스토리
- `subscribers` — 알림 신청자  
Storage 버킷: **`property-images`** (public)

### 2-4. 앱에서 Supabase 사용 켜기

`.env.local`:

```env
DATA_PROVIDER=supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

전환된 API/페이지:
- 홈 `getLandingHomeData` (매물·경매·상담소·성공스토리)
- `POST /api/consultations`, `POST /api/consultations/lookup`
- `POST /api/subscriptions`

`DATA_PROVIDER=prisma`(기본)이면 기존 로컬 SQLite 동작을 유지합니다.  
뉴스 피드·관리자 CRUD 전체는 Prisma 경로를 아직 사용하므로, 완전 이관은 단계적으로 확장하면 됩니다.

---

## 3단계 — GitHub 원격 저장소

현재 로컬은 Git 저장소이지만 **아직 커밋이 없는 상태**일 수 있습니다.  
그 경우 아래 순서로 **첫 커밋 → 원격 연결 → push** 하면 됩니다. (`git init`은 이미 되어 있으면 생략)

### A. GitHub에서 빈 Repository 생성
1. https://github.com/new  
2. 이름 예: `chance-real-estate`  
3. **Private** 권장  
4. README / .gitignore 추가하지 않음 (로컬에 이미 있음)

### B. 터미널 명령 (PowerShell)

```powershell
cd "d:\바이브코딩\Chance Real Estate & Auction"

# (필요 시만) git init
# git init

# 상태 확인 — .env / .env.local 이 목록에 있으면 안 됨
git status
git check-ignore -v .env .env.local

# 첫 커밋
git add .
git status
git commit -m "chore: initial commit with Supabase cloud foundation"

# 원격 연결 (YOUR_USER / YOUR_REPO 교체)
git remote remove origin 2>$null
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git

# 첫 푸시
git branch -M main
git push -u origin main
```

SSH를 쓰는 경우:

```powershell
git remote add origin git@github.com:YOUR_USER/YOUR_REPO.git
git push -u origin main
```

---

## 4단계 — Vercel 자동 배포

### 4-1. 프로젝트 Import
1. https://vercel.com/new  
2. **Import Git Repository** → GitHub 권한 허용  
3. 방금 푸시한 저장소 선택  
4. Framework Preset: **Next.js** (자동 감지)  
5. Root Directory: `.`  
6. Build Command / Output: 기본값 유지  
7. **Deploy** 전에 Environment Variables 먼저 입력 권장

### 4-2. Environment Variables
Vercel 프로젝트 → **Settings** → **Environment Variables**

| Name | Value | Environments |
|------|--------|----------------|
| `DATA_PROVIDER` | `supabase` | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role (비밀) | Production, Preview |
| `DATABASE_URL` | `file:./dev.db` (빌드용 placeholder; SQLite는 Vercel에서 동작하지 않음) | Production, Preview |
| `SESSION_SECRET` | 긴 랜덤 문자열 | Production, Preview |
| `ADMIN_AUTH_ENABLED` | `true` | Production |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | 관리자 계정 | Production |
| `APP_BASE_URL` | `https://your-app.vercel.app` | Production |
| `SOLAPI_API_KEY` 등 | Solapi 값 | Production |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | 메일 발송 시 | Production |

**빌드 실패(`/admin` prerender) 주의:** 관리자·DB 페이지는 `force-dynamic`이며, Vercel에는 위 환경변수를 넣은 뒤 Redeploy 하세요. `DATABASE_URL`이 없으면 `prisma generate`가 실패할 수 있습니다.

저장 후 **Deployments → Redeploy** 하여 환경변수를 반영하세요.

### 4-3. 자동 배포 흐름
- `main`(또는 연결 브랜치)에 `git push` → Vercel이 빌드·배포  
- PR 생성 시 Preview URL 자동 생성  
- 배포 URL 예: `https://chance-real-estate.vercel.app`

### 4-4. 배포 후 확인
1. 홈 로드  
2. `/consultation` 상담 신청 → Supabase Table Editor에서 `consultations` 행 확인  
3. Storage → `property-images` 버킷 존재 확인  

---

## 권장 마이그레이션 순서

1. Supabase 프로젝트 + SQL 실행  
2. `.env.local`에 키 넣고 `DATA_PROVIDER=supabase`로 로컬 스모크 테스트  
3. GitHub push  
4. Vercel 연동 + 환경변수  
5. 관리자 매물/경매 CRUD·뉴스 피드를 Supabase로 순차 이관  
6. 로컬 SQLite는 개발용 폴백으로 유지하거나, Prisma `DATABASE_URL`을 Supabase Postgres로 바꿔 스키마 동기화

문의·확장 작업은 Agent 모드에서 이어서 요청하면 됩니다.
