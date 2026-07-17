import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { FeaturedPicksMarquee } from "@/components/landing/FeaturedPicksMarquee";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { getLandingFeaturedData } from "@/lib/data";

export const metadata: Metadata = {
  title: "디자인 목업 | 추천매물 밴드 #0e1a14",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Sample: home Featured section background → organic-forest --of-bg-deep (#0e1a14).
 * Home itself unchanged.
 */
export default async function FeaturedSectionForestBgMockupPage() {
  const data = await getLandingFeaturedData();

  return (
    <LandingShell>
      <style>{`
        .sample-of-bg-deep section.bg-landing-section {
          background-color: #0e1a14 !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
      <div className="border-b border-white/10 bg-[#0e1a14] px-4 py-2 text-center text-xs text-[#c8e6d2]">
        샘플 · 추천매물/경매 섹션 배경 ={" "}
        <code className="text-[#9fd4b5]">#0e1a14</code> (organic-forest --of-bg-deep) · 홈 미적용.{" "}
        <Link href="/" className="text-[#9fd4b5] hover:underline">
          ← 홈
        </Link>
        {" · "}
        <Link href="/mockup/organic-forest" className="text-[#9fd4b5] hover:underline">
          Organic Forest
        </Link>
      </div>
      <LandingHeader />
      <LandingNav />
      <main className="sample-of-bg-deep">
        <LandingHero />
        <FeaturedPicksMarquee
          properties={data.properties}
          auctions={data.auctions}
          cardSize="sm"
          rowHeadings="accent"
          layout="section"
          isMockup
          mockupNote="이 밴드 배경만 #0e1a14 (--of-bg-deep) 로 바꾼 샘플입니다."
        />
      </main>
      <LandingFooter />
    </LandingShell>
  );
}
