import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { HeroTrustRightSample } from "@/components/mockup/landing-home/HeroTrustRightSample";

export const metadata: Metadata = {
  title: "디자인 목업 | 히어로 우측 신뢰 문구",
  robots: { index: false, follow: false },
};

export default function LandingHeroTrustRightMockupPage() {
  return (
    <LandingShell>
      <div className="border-b border-amber-400/30 bg-[#14100c] px-4 py-2 text-center text-xs text-amber-100/90">
        목업 · 히어로 우측 신뢰 4줄 · 프로덕션 미적용 ·{" "}
        <Link href="/" className="font-bold text-amber-300 hover:underline">
          현재 홈 →
        </Link>
      </div>
      <LandingHeader />
      <LandingNav />
      <main>
        <HeroTrustRightSample />
        <div className="border-t border-dashed border-white/10 px-4 py-8 text-center">
          <p className="text-xs text-white/40">
            기존 히어로 하단 신뢰 배너 문구를 우측 슬로건으로 이동한 안입니다.
          </p>
          <p className="mt-2 font-hero-pen text-sm leading-relaxed text-white/55">
            안전한 중개
            <br />
            정확한 권리분석
            <br />
            성공적인 경매 투자
            <br />
            찬스부동산이 함께 합니다.
          </p>
        </div>
      </main>
      <LandingFooter />
    </LandingShell>
  );
}
