import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { HeroSloganRotateSample } from "@/components/mockup/landing-home/HeroSloganRotateSample";

export const metadata: Metadata = {
  title: "디자인 목업 | 히어로 슬로건 행별 등장",
  robots: { index: false, follow: false },
};

export default function LandingHeroSloganRotateMockupPage() {
  return (
    <LandingShell>
      <div className="border-b border-amber-400/30 bg-[#14100c] px-4 py-2 text-center text-xs text-amber-100/90">
        목업 · 1→4행 순차 등장 · 한번에 퇴장 · 프로덕션 미적용 ·{" "}
        <Link href="/" className="font-bold text-amber-300 hover:underline">
          현재 홈 →
        </Link>
      </div>
      <LandingHeader />
      <LandingNav />
      <main>
        <HeroSloganRotateSample
          holdMs={3600}
          gapMs={1000}
          lineStaggerMs={380}
          lineFadeMs={320}
          fadeOutMs={480}
        />
        <div className="border-t border-dashed border-white/10 px-4 py-8 text-center text-xs leading-relaxed text-white/40">
          등장: 1→2→3→4행 순차 · 유지 약 3.6초 · 퇴장: 전체 페이드아웃 · 1초 공백 후 다음
        </div>
      </main>
      <LandingFooter />
    </LandingShell>
  );
}
