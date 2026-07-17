import type { Metadata } from "next";
import Image from "next/image";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { FeaturedPicksMarquee } from "@/components/landing/FeaturedPicksMarquee";
import {
  HeroCalligraphyOptions,
  HeroCalligraphyVariantList,
} from "@/components/landing/HeroCalligraphy";
import { getLandingFeaturedData } from "@/lib/data";

export const metadata: Metadata = {
  title: "디자인 목업 | 캘리 색상 5종 + 감정가의 %",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function HeroCalligraphyColorsMockupPage() {
  const data = await getLandingFeaturedData();

  return (
    <LandingShell>
      <div className="border-b border-[#d4bfff]/30 bg-[rgba(212,191,255,0.12)] px-4 py-2 text-center text-xs text-[#d4bfff]">
        샘플 · 최저가 「감정가의 N%」 · 캘리 기존 A–C + 색상 추가 D–H (5종). 홈 캘리 미적용.
      </div>
      <LandingHeader />
      <LandingNav />

      <main>
        <section className="relative min-h-[280px] overflow-hidden px-container-padding-mobile py-16 md:px-8 md:py-20">
          <Image
            src="/images/hero-naepo.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%] brightness-[1.22] contrast-[1.05] saturate-[1.02]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0B0F19]/15 via-[#0B0F19]/50 to-[#0a0a0a]"
            aria-hidden
          />
          <HeroCalligraphyOptions activeId="C" />
          <div className="relative z-10 mx-auto max-w-6xl text-center">
            <h1 className="hero-title-chrome text-3xl md:text-4xl">찬스부동산 경매중개</h1>
            <p className="mt-2 text-xs text-[#a3a3a3]">미리보기 = C안 (md 이상에서만 좌측 표시)</p>
          </div>
        </section>

        <section className="border-t border-white/5 bg-[#0a0a0a] px-container-padding-mobile py-8 md:px-8">
          <h2 className="mb-2 text-sm font-bold text-white">캘리그라피 서체 (A–C)</h2>
          <p className="mb-4 text-[11px] text-[#737373]">
            줄바꿈·행 색상 최신본:{" "}
            <Link href="/mockup/hero-calligraphy-lines" className="text-[#facc15] hover:underline">
              /mockup/hero-calligraphy-lines
            </Link>
          </p>
          <HeroCalligraphyVariantList ids={["A", "B", "C"]} />
        </section>

        <FeaturedPicksMarquee
          properties={data.properties.slice(0, 6)}
          auctions={data.auctions}
          cardSize="sm"
          rowHeadings="accent"
          layout="section"
          isMockup
          mockupNote="최저가 옆 「감정가의 N%」 붉은 표기"
        />
      </main>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-xs text-[#737373]">
        <Link href="/mockup/home-enhancements" className="text-[#d4af37] hover:underline">
          이전 통합 샘플
        </Link>
        {" · "}
        <Link href="/" className="text-[#4dabff] hover:underline">
          ← 홈
        </Link>
      </footer>
    </LandingShell>
  );
}
