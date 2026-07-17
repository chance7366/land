import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { HeroBackgroundSlideshow } from "@/components/landing/HeroBackgroundSlideshow";
import { HeroServiceCards } from "@/components/landing/HeroServiceCards";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";

export const metadata: Metadata = {
  title: "디자인 목업 | 히어로 슬라이드쇼 · 느린 페이드",
  robots: { index: false, follow: false },
};

/**
 * Sample: slow dissolve hero (2.8s fade / 4.5s interval). Home unchanged.
 */
export default function HeroSlideshowMockupPage() {
  return (
    <LandingShell>
      <div className="border-b border-white/10 bg-[#0e1a14] px-4 py-2 text-center text-xs text-[#c8e6d2]">
        샘플 · 느린 크로스페이드(2.8초) · 4.5초마다 전환 · 홈 미적용.{" "}
        <Link href="/" className="text-[#9fd4b5] hover:underline">
          ← 홈
        </Link>
      </div>
      <LandingHeader />
      <LandingNav />
      <main>
        <section
          className="relative overflow-hidden px-container-padding-mobile pb-8 pt-12 md:px-8 md:pb-10 md:pt-16"
          aria-label="히어로 슬라이드쇼 느린 페이드 샘플"
        >
          <HeroBackgroundSlideshow intervalMs={4500} fadeMs={2800} />

          <div
            className="pointer-events-none absolute inset-0 bg-[url('/images/chungnam-map-overlay.svg')] bg-cover bg-center opacity-[0.1]"
            aria-hidden
          />
          <div className="landing-hero-scrim pointer-events-none absolute inset-0" aria-hidden />

          <div className="relative z-10 mx-auto flex max-w-6xl flex-col">
            <div className="mx-auto w-full max-w-4xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                Sample · Slow Dissolve
              </p>
              <h1 className="hero-title-chrome">찬스부동산 경매중개</h1>
              <p className="mx-auto mt-3 max-w-md text-sm text-white/75">
                내포 전경 5컷 · 서서히 녹아드는 전환 (페이드 2.8초)
              </p>
            </div>

            <div className="mt-10 md:mt-14">
              <div className="mb-4 flex items-center justify-center gap-4">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#d4af37] md:w-16" />
                <h2 className="our-services-title text-xl font-semibold tracking-wide md:text-2xl">
                  Our Services
                </h2>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#d4af37] md:w-16" />
              </div>
              <HeroServiceCards />
            </div>
          </div>
        </section>

        <section className="border-t border-landing-border bg-landing-section px-container-padding-mobile py-8 md:px-8">
          <div className="mx-auto max-w-6xl text-sm text-landing-muted">
            <p className="font-bold text-landing-text">현재 샘플 설정</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>크로스페이드: 2.8초 (ease-in-out)</li>
              <li>전환 주기: 4.5초 (완전 표시 ≈ 1.7초 + 페이드)</li>
              <li>
                <code className="text-landing-text">prefers-reduced-motion</code> 이면 첫 장 고정
              </li>
            </ul>
            <p className="mt-4">더 느리게/빠르게 원하시면 말해 주세요. 확정 시 홈에 적용합니다.</p>
          </div>
        </section>
      </main>
    </LandingShell>
  );
}
