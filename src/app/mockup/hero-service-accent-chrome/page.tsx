import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { HeroBackgroundSlideshow } from "@/components/landing/HeroBackgroundSlideshow";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { HeroServiceCardsAccentChromeSample } from "./HeroServiceCardsAccentChromeSample";

export const metadata: Metadata = {
  title: "디자인 목업 | 서비스카드 아이콘·바로가기 액센트",
  robots: { index: false, follow: false },
};

/**
 * Sample: B card tint + white title/body, but icon & CTA use original accent colors.
 */
export default function HeroServiceAccentChromeMockupPage() {
  return (
    <LandingShell>
      <div className="border-b border-white/10 bg-[#0e1a14] px-4 py-2 text-center text-xs text-[#c8e6d2]">
        샘플 · 아이콘·「바로가기」원색 복원 · 제목/본문은 흰 굵은 글씨 유지 · 홈 미적용.{" "}
        <Link href="/" className="text-[#9fd4b5] hover:underline">
          ← 홈
        </Link>
      </div>
      <LandingHeader />
      <LandingNav />
      <main>
        <section
          className="relative overflow-hidden px-container-padding-mobile pb-12 pt-12 md:px-8 md:pb-16 md:pt-16"
          aria-label="서비스카드 액센트 크롬 샘플"
        >
          <HeroBackgroundSlideshow intervalMs={4500} fadeMs={2800} showDots={false} />
          <div className="landing-hero-scrim pointer-events-none absolute inset-0" aria-hidden />

          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="mb-8 text-center">
              <h1 className="hero-title-chrome">찬스부동산 경매중개</h1>
              <p className="mt-3 text-xs text-white/70">
                아이콘·바로가기 = 카드별 원래 색 (#4dabff / #d4af37 / #d450ff / #34d399)
              </p>
            </div>
            <div className="mb-4 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#d4af37] md:w-16" />
              <h2 className="our-services-title text-xl font-semibold tracking-wide md:text-2xl">
                Our Services
              </h2>
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#d4af37] md:w-16" />
            </div>
            <HeroServiceCardsAccentChromeSample />
          </div>
        </section>
      </main>
    </LandingShell>
  );
}
