import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { HomeSectionsSampleClient } from "@/components/mockup/landing-home/HomeSectionsSample";
import { getLandingFeaturedData } from "@/lib/data";

export const metadata: Metadata = {
  title: "디자인 목업 | 랜딩 멀티 섹션 레이아웃",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LandingHomeSectionsMockupPage() {
  const data = await getLandingFeaturedData();

  return (
    <LandingShell>
      <div className="border-b border-amber-400/30 bg-[#14100c] px-4 py-2 text-center text-xs text-amber-100/90">
        목업 v3 · 히어로 하단 멀티 섹션 · 프로덕션 미적용 ·{" "}
        <Link href="/" className="font-bold text-amber-300 hover:underline">
          현재 홈 →
        </Link>
      </div>
      <LandingHeader />
      <LandingNav />
      <main>
        <HomeSectionsSampleClient properties={data.properties} auctions={data.auctions} />
      </main>
      <LandingFooter />
    </LandingShell>
  );
}
