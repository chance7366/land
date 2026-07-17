import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { AuroraPenHeroPreview } from "@/components/landing/AuroraBackgroundCycle";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";

export const metadata: Metadata = {
  title: "디자인 목업 | 펜글씨 + 오로라 히어로 (홈 적용본)",
  robots: { index: false, follow: false },
};

export default function HeroRefinedMockupPage() {
  return (
    <LandingShell>
      <LandingHeader />
      <LandingNav />

      <div className="border-b border-white/10 bg-[#121622] px-4 py-3 md:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4dabff]">
          Mockup · Same as home
        </p>
        <h1 className="mt-1 text-lg font-bold text-white md:text-xl">
          펜글씨 + 오로라 배경·슬로건 순환 (홈 적용)
        </h1>
        <p className="mt-1 text-[11px] text-[#a3a3a3]">
          <Link href="/" className="text-[#4dabff] underline-offset-2 hover:underline">
            홈에서 확인
          </Link>
        </p>
      </div>

      <AuroraPenHeroPreview intervalMs={4500} fadeMs={2200} showLabel />

      <LandingFooter />
    </LandingShell>
  );
}
