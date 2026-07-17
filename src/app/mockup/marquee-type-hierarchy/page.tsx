import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";

export const metadata: Metadata = {
  title: "디자인 목업 | 마퀴 카드 타이포·행순서",
  robots: { index: false, follow: false },
};

/**
 * 매물 행:
 * 1 제목 흰 · 2 스펙 연파랑 12px · 3 주소·날짜 파랑 12px · 4 가격 진파랑 14px
 * 경매 행:
 * 1 위치 흰 · 2 사건·매각기일 연노랑 12px · 3 감정가 노랑 · 4 최저가+(%) 진노랑 14px
 */
function PropertyCardSample() {
  return (
    <article className="w-[240px] shrink-0 overflow-hidden rounded-2xl border border-landing-border bg-landing-card shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
      <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-[#2a3344] to-[#151a24] text-[11px] text-white/40">
        이미지
      </div>
      <div className="featured-marquee-card__body flex flex-col gap-1.5 p-4">
        {/* 1행 제목 — 흰색 */}
        <p className="line-clamp-2 text-sm font-bold text-white">중흥S-클래스더시티</p>
        {/* 2행 스펙 — 연파랑 12px */}
        <p className="line-clamp-1 text-xs font-bold text-[#93c5fd]">
          공급 108㎡ · 전용 84.96㎡ · 12/22층 · 남향
        </p>
        {/* 3행 주소·날짜 — 파랑 12px */}
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 flex-1 truncate text-xs font-bold text-[#60a5fa]">
            충청남도 예산군 삽교읍
          </p>
          <p className="shrink-0 text-xs font-bold text-[#60a5fa]">2026.07.11</p>
        </div>
        {/* 4행 가격 — 밝은 분홍 15px extrabold (가장 중요) */}
        <p className="text-left text-[15px] font-extrabold text-[#f472b6]">매매가 3억</p>
      </div>
    </article>
  );
}

function AuctionCardSample() {
  return (
    <article className="w-[240px] shrink-0 overflow-hidden rounded-2xl border border-landing-border bg-landing-card shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
      <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-[#2a3344] to-[#151a24] text-[11px] text-white/40">
        이미지
      </div>
      <div className="featured-marquee-card__body flex flex-col gap-1.5 p-4">
        {/* 1행 위치 — 흰색 */}
        <p className="line-clamp-2 text-sm font-bold text-white">
          충청남도 홍성군 홍북읍 신정리 45 · 내포신도시
        </p>
        {/* 2행 사건·매각기일 — 연노랑 12px */}
        <div className="flex items-center justify-between gap-2">
          <span className="min-w-0 truncate text-xs font-bold text-[#fde68a]">
            2024타경51202
          </span>
          <span className="shrink-0 text-xs font-bold text-[#fde68a]">
            매각기일 2026-07-19
          </span>
        </div>
        {/* 3행 감정가 — 노랑 */}
        <p className="text-xs font-bold text-[#facc15]">감정가 185,000,000원</p>
        {/* 4행 최저가+(%) — 밝은 분홍 15px extrabold (가장 중요) */}
        <p className="text-[15px] font-extrabold text-[#f472b6]">
          최저가 129,500,000원
          <span className="ml-1">(70%)</span>
        </p>
      </div>
    </article>
  );
}

export default function MarqueeTypeHierarchyMockupPage() {
  return (
    <LandingShell>
      <LandingHeader />
      <LandingNav />

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-10 md:px-6">
        <header className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4dabff]">
            Mockup · Not applied to home
          </p>
          <h1 className="text-2xl font-bold text-white">
            마퀴 카드 행순서 · 크기 · 색 계층
          </h1>
          <p className="max-w-2xl text-sm text-[#a3a3a3]">
            매물은 가격(4행), 경매는 최저가·비율(4행)을 가장 강조합니다.
            4행은 <strong className="text-[#f472b6]">15px · extrabold · 밝은 분홍</strong>,
            비율은 <code className="text-[#facc15]">(70%)</code> 형식입니다.
          </p>
          <p className="text-xs text-[#737373]">
            <Link href="/" className="text-[#4dabff] underline-offset-2 hover:underline">
              홈으로
            </Link>
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#60a5fa]">추천 매물</h2>
          <ul className="space-y-1 text-[12px] text-[#a3a3a3]">
            <li>1행 제목 — 흰색 · 14px · bold</li>
            <li>2행 스펙 — 연파랑 #93c5fd · 12px · bold</li>
            <li>3행 주소·날짜 — 파랑 #60a5fa · 12px · bold</li>
            <li>4행 가격 — 밝은 분홍 #f472b6 · 15px · extrabold (최중요)</li>
          </ul>
          <div className="flex justify-center rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_50%_0%,#1a1220_0%,#0a0809_70%)] py-10">
            <PropertyCardSample />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#facc15]">추천 경매</h2>
          <ul className="space-y-1 text-[12px] text-[#a3a3a3]">
            <li>1행 위치 — 흰색 · 14px · bold</li>
            <li>2행 사건번호·매각기일 — 연노랑 #fde68a · 12px · bold</li>
            <li>3행 감정가 — 노랑 #facc15 · 12px · bold</li>
            <li>4행 최저가+(%) — 밝은 분홍 #f472b6 · 15px · extrabold (최중요)</li>
          </ul>
          <div className="flex justify-center rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_50%_0%,#1a1220_0%,#0a0809_70%)] py-10">
            <AuctionCardSample />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-[13px] text-[#a3a3a3]">
          색·행순서가 괜찮으면 말씀해 주세요. 홈 추천매물·추천경매 마퀴에 적용합니다.
        </section>
      </main>

      <LandingFooter />
    </LandingShell>
  );
}
