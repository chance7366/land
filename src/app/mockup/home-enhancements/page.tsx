import type { Metadata } from "next";
import Image from "next/image";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingFooter } from "@/components/landing/LandingFooter";
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
  title: "디자인 목업 | 푸터·프로필·히어로·경매 보강",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function HomeEnhancementsMockupPage() {
  const data = await getLandingFeaturedData();

  return (
    <LandingShell>
      <div className="border-b border-[#d4af37]/30 bg-[rgba(212,175,55,0.1)] px-4 py-2 text-center text-xs text-[#d4af37]">
        샘플 · ①사무소/매수신청대리 등록번호 ②프로필 메뉴 ③히어로 캘리 A–H ④감정가의 % · 경매 절차. 홈 캘리 미적용.
      </div>
      <LandingHeader />
      <LandingNav />

      <main>
        <section className="relative overflow-hidden px-container-padding-mobile pb-8 pt-12 md:px-8 md:pb-10 md:pt-16">
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
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0B0F19]/10 via-[#0B0F19]/45 to-[#0a0a0a]/95"
            aria-hidden
          />
          <HeroCalligraphyOptions activeId="A" />
          <div className="relative z-10 mx-auto max-w-6xl py-16 text-center md:py-24">
            <h1 className="hero-title-chrome text-3xl md:text-4xl">찬스부동산 경매중개</h1>
            <p className="mt-3 text-xs text-[#a3a3a3]">히어로 미리보기 = 안 A · 색상 비교는 아래 / 전용 샘플</p>
          </div>
        </section>

        <section className="border-t border-white/5 bg-[#0a0a0a] px-container-padding-mobile py-8 md:px-8">
          <h2 className="mb-4 text-sm font-bold text-white">히어로 캘리그라피 (A–H)</h2>
          <HeroCalligraphyVariantList />
          <p className="mt-3 text-[11px] text-[#737373]">
            색상 전용 샘플:{" "}
            <Link href="/mockup/hero-calligraphy-colors" className="text-[#d4bfff] hover:underline">
              /mockup/hero-calligraphy-colors
            </Link>
          </p>
        </section>

        <FeaturedPicksMarquee
          properties={data.properties}
          auctions={data.auctions}
          cardSize="sm"
          rowHeadings="accent"
          layout="section"
          isMockup
          mockupNote="최저가 옆 「감정가의 N%」 · 추천 경매 옆 절차 칩"
        />
      </main>

      <LandingFooter />

      <footer className="border-t border-white/10 px-6 py-6 text-center text-xs text-[#737373]">
        <Link href="/profile" className="text-pink-400 hover:underline">
          /profile
        </Link>
        {" · "}
        <Link href="/" className="text-[#4dabff] hover:underline">
          ← 홈
        </Link>
      </footer>
    </LandingShell>
  );
}
