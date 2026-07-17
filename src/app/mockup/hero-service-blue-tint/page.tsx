import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { HeroBackgroundSlideshow } from "@/components/landing/HeroBackgroundSlideshow";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { HeroServiceCardsBlueTintSample } from "./HeroServiceCardsBlueTintSample";

export const metadata: Metadata = {
  title: "디자인 목업 | 서비스카드 파란 틴트",
  robots: { index: false, follow: false },
};

/**
 * Sample: faint blue-tint card bg + bright blue title for 부동산중개.
 * Also shows accent-tint for all 4 cards as option B.
 */
export default function HeroServiceBlueTintMockupPage() {
  return (
    <LandingShell>
      <div className="border-b border-white/10 bg-[#0e1a14] px-4 py-2 text-center text-xs text-[#c8e6d2]">
        샘플 · 옅은 액센트 배경 + 밝은 흰·굵은 글자 · 홈 미적용.{" "}
        <Link href="/" className="text-[#9fd4b5] hover:underline">
          ← 홈
        </Link>
      </div>
      <LandingHeader />
      <LandingNav />
      <main>
        <section
          className="relative overflow-hidden px-container-padding-mobile pb-10 pt-12 md:px-8 md:pb-14 md:pt-16"
          aria-label="서비스카드 파란 틴트 샘플"
        >
          <HeroBackgroundSlideshow intervalMs={4500} fadeMs={2800} showDots={false} />
          <div className="landing-hero-scrim pointer-events-none absolute inset-0" aria-hidden />

          <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12">
            <div className="text-center">
              <h1 className="hero-title-chrome">찬스부동산 경매중개</h1>
            </div>

            {/* A: blue card only (as requested) */}
            <div>
              <div className="mb-3 flex items-center justify-center gap-4">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#4dabff] md:w-16" />
                <h2 className="text-sm font-bold tracking-wide text-[#8ecfff] md:text-base">
                  A. 부동산중개만 파란 틴트
                </h2>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#4dabff] md:w-16" />
              </div>
              <p className="mb-4 text-center text-[11px] text-white/65">
                배경 파란 틴트 · 제목/본문 밝은 흰색 · extrabold
              </p>
              <HeroServiceCardsBlueTintSample blueOnly />
            </div>

            {/* B: all cards accent-tinted */}
            <div>
              <div className="mb-3 flex items-center justify-center gap-4">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#d4af37] md:w-16" />
                <h2 className="text-sm font-bold tracking-wide text-[#e8c86a] md:text-base">
                  B. 카드별 액센트 틴트 (확장안)
                </h2>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#d4af37] md:w-16" />
              </div>
              <p className="mb-4 text-center text-[11px] text-white/65">
                카드별 옅은 액센트 배경 · 글자는 모두 밝은 흰색·굵게
              </p>
              <HeroServiceCardsBlueTintSample />
            </div>
          </div>
        </section>
      </main>
    </LandingShell>
  );
}
