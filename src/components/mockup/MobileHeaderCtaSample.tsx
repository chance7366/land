"use client";

import { Bell, CalendarDays, FileText, Gavel, PlayCircle } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";

const BOTTOM_NAV = [
  { label: "홈", icon: "home" },
  { label: "부동산중개", icon: "apartment" },
  { label: "경매공매", icon: "gavel" },
  { label: "부동산·지역소식", icon: "newspaper" },
  { label: "찬스상담소", icon: "balance" },
  { label: "성공스토리", icon: "star" },
  { label: "프로필", icon: "person" },
  { label: "찾아오시는 길", icon: "location_on" },
] as const;

function MaterialIcon({ name }: { name: string }) {
  return (
    <span className="material-symbols-outlined select-none text-[20px]" aria-hidden>
      {name}
    </span>
  );
}

/**
 * 실제 LandingHeader와 동일 구성:
 * [관리자] [브랜드] …… [맞춤 알림] [상담 예약] [YouTube] [네이버 블로그]
 * 모바일에서는 패딩·글자·아이콘만 축소 (라벨은 항상 표시)
 */
function MobileScaledHeader() {
  const cta =
    "inline-flex items-center justify-center gap-0.5 rounded-md border px-1.5 py-1.5 text-[9px] font-bold leading-none sm:gap-1 sm:rounded-lg sm:px-2 sm:py-2 sm:text-[11px]";

  return (
    <header className="sticky top-0 z-10 border-b border-landing-border bg-landing-bg/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-1.5 px-3 py-2.5 sm:gap-2 sm:px-4 sm:py-3 md:gap-3 md:px-8 md:py-4">
        <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            aria-label="관리자 페이지 이동"
            className="shrink-0 rounded-md outline-offset-2"
          >
            <Gavel className="h-4 w-4 text-blue-400 sm:h-5 sm:w-5 md:h-6 md:w-6" aria-hidden />
          </button>
          <span className="block min-w-0 truncate bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text font-['Times_New_Roman',serif] text-[9px] font-bold leading-tight text-transparent sm:text-[11px] md:text-lg">
            CHANCE REAL ESTATE & AUCTION
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            className={`${cta} border-amber-400/35 bg-amber-500/15 text-landing-text`}
          >
            <Bell className="h-3 w-3 shrink-0 text-amber-300 sm:h-4 sm:w-4" aria-hidden />
            <span>맞춤 알림</span>
          </button>
          <button
            type="button"
            className={`${cta} border-landing-border bg-violet-500/15 text-landing-text`}
          >
            <CalendarDays className="h-3 w-3 shrink-0 text-violet-400 sm:h-4 sm:w-4" aria-hidden />
            <span>상담 예약</span>
          </button>
          <a
            href="https://www.youtube.com"
            className={`${cta} border-landing-border bg-landing-card text-landing-text`}
          >
            <PlayCircle className="h-3 w-3 shrink-0 text-red-500 sm:h-4 sm:w-4" aria-hidden />
            <span>YouTube</span>
          </a>
          <a
            href="https://blog.naver.com"
            className={`${cta} border-landing-border bg-[#03c75a]/10 text-landing-text`}
          >
            <FileText className="h-3 w-3 shrink-0 text-[#03c75a] sm:h-4 sm:w-4" aria-hidden />
            <span className="max-[360px]:hidden">네이버 블로그</span>
            <span className="hidden max-[360px]:inline">블로그</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function PhoneFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[390px]">
      <p className="mb-2 text-center text-xs font-bold text-white/45">{title}</p>
      <div className="overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#0b0f19] shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
        {children}
      </div>
    </div>
  );
}

export function MobileHeaderCtaSample() {
  return (
    <div className="space-y-10">
      <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-center text-xs text-amber-100/90">
        샘플 · 프로덕션 미적용 · PC와 같은 상단 한 줄 배치 · 모바일만 크기 축소 · 햄버거 없음
      </div>

      <PhoneFrame title="모바일 390px · 상단 헤더 (관리자 · 브랜드 · CTA 4개)">
        <div className="flex h-[620px] flex-col">
          <MobileScaledHeader />

          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 text-center">
            <p className="text-sm font-bold text-white">본문 영역</p>
            <p className="text-[11px] leading-relaxed text-white/45">
              맞춤 알림 · 상담 예약 · YouTube · 네이버 블로그를
              <br />
              상단 우측 한 줄에 두고, 모바일에서는 글자·패딩만 줄입니다.
              <br />
              Sheet CTA · 햄버거 버튼은 이 목업에 없습니다.
            </p>
          </div>

          <nav className="border-t border-white/10 px-1 py-1.5">
            <div className="flex overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {BOTTOM_NAV.map((item) => (
                <div
                  key={item.label}
                  className="flex min-h-11 min-w-[4.5rem] shrink-0 flex-col items-center justify-center gap-0.5 text-white/40"
                >
                  <MaterialIcon name={item.icon} />
                  <span className="max-w-[4.25rem] truncate text-[9px]">{item.label}</span>
                </div>
              ))}
            </div>
          </nav>
        </div>
      </PhoneFrame>

      {/* 실제 폭 비교용 — 좁은 화면 전체 폭 */}
      <section className="overflow-hidden rounded-2xl border border-white/10">
        <p className="border-b border-white/10 px-4 py-2 text-xs font-bold text-white/50">
          실제 페이지 폭 미리보기 (max-w 없이)
        </p>
        <MobileScaledHeader />
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-white/70">
        <h2 className="font-bold text-white">적용 시 변경 (아직 미적용)</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs leading-relaxed">
          <li>
            상단:{" "}
            <strong className="text-white">
              관리자 · CHANCE … · 맞춤 알림 · 상담 예약 · YouTube · 네이버 블로그
            </strong>{" "}
            — PC와 같은 한 줄, 모바일은 아이콘·글자·간격만 축소
          </li>
          <li>
            <strong className="text-white">삭제</strong>: 햄버거 Sheet 하단 CTA / 이 목업의 햄버거
            버튼
          </li>
          <li>매우 좁은 화면(≤360px)에서만 「네이버 블로그」→「블로그」로 줄임</li>
        </ul>
        <Link href="/" className="mt-3 inline-block text-xs text-sky-300 hover:underline">
          ← 홈으로
        </Link>
      </section>
    </div>
  );
}
