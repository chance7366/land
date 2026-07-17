# Supabase 연동 — 지금 할 일 (체크리스트)

코드·SQL·Vercel용 설정은 준비돼 있습니다.  
**아래 ①~③은 본인 계정으로만 가능**합니다. 키를 채팅에 붙여 주시면 Vercel 등록까지 이어서 도와드릴 수 있습니다.

---

## ① Supabase 프로젝트 만들기 (약 2분)

1. https://supabase.com/dashboard 로그인  
2. **New project**  
   - Name: `chance-land` (자유)  
   - Database password: **저장해 두기**  
   - Region: Northeast Asia (Seoul) 권장  
3. 프로젝트 생성 완료까지 대기

---

## ② SQL 실행 (스키마 + 데모 데이터)

1. 좌측 **SQL Editor** → **New query**  
2. 아래 파일 내용을 **전부 복사 → 붙여넣기 → Run**  
   - [`supabase/migrations/001_init_chance.sql`](../supabase/migrations/001_init_chance.sql)  
3. (선택) 데모 매물/경매가 바로 보이게:  
   - [`supabase/seed_demo.sql`](../supabase/seed_demo.sql) 도 동일하게 Run  

Table Editor에 `properties`, `auctions` 등이 보이면 성공입니다.

---

## ③ API 키 복사

**Project Settings → API**

| 항목 | 환경변수 이름 |
|------|----------------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` `public` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` `secret` | `SUPABASE_SERVICE_ROLE_KEY` |

`service_role`은 비밀키입니다. GitHub에 올리지 마세요.

---

## ④ Vercel 환경변수 + Redeploy

https://vercel.com → 프로젝트 **landchance** → **Settings → Environment Variables**

다음을 **Production + Preview**에 추가:

```
DATA_PROVIDER=supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=file:./dev.db
SESSION_SECRET=임의의긴문자열
APP_BASE_URL=https://landchance.vercel.app
```

저장 후 **Deployments → ⋯ → Redeploy** (또는 `main`에 푸시).

---

## ⑤ 확인

1. https://landchance.vercel.app — 추천 매물/경매에 데모 데이터  
2. `/consultation` — 상담 신청 후 Supabase Table `consultations` 행 확인  

---

## 로컬에서도 쓰려면

```powershell
cd "d:\바이브코딩\Chance Real Estate & Auction"
copy .env.local.example .env.local
# .env.local 에 위 키 + DATA_PROVIDER=supabase 입력
npm run dev
```

로컬 SQLite만 쓰려면 `DATA_PROVIDER=prisma` 로 두면 됩니다.
