import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import {
  HeroBannerColorSchemeCards,
  HeroBannerPreviewFrames,
  HeroBannerSchemeComparison,
  HeroBannerTypoSpec,
} from "@/components/mockup/HeroBannerPreview";

export const metadata: Metadata = {
  title: "디자인 목업 | 히어로 배너",
  robots: { index: false, follow: false },
};

export default function HeroBannerMockupPage() {
  return (
    <div className="min-h-screen bg-landing-bg text-landing-text">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-landing-bg/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-violet-500/20 px-3 py-1 font-caption font-bold text-violet-300">
              디자인 목업
            </span>
            <h1 className="font-section-title text-landing-text">히어로 배너 색상 조합</h1>
          </div>
          <Link href="/" className="font-caption font-medium text-blue-400 hover:underline">
            ← 홈으로
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 pb-16">
        <p className="font-caption mb-8 text-landing-muted">
          3가지 색상 조합을 비교합니다. 추천 조합은 홈에 적용되어 있습니다.
        </p>

        <section className="mb-12">
          <h2 className="mb-4 font-headline-md text-primary">색상 조합 3종</h2>
          <HeroBannerColorSchemeCards />
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-headline-md text-primary">조합별 모바일 비교</h2>
          <HeroBannerSchemeComparison />
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-headline-md text-primary">타이포그래피 스펙</h2>
          <HeroBannerTypoSpec />
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-headline-md text-primary">프레임 미리보기</h2>
          <HeroBannerPreviewFrames />
        </section>

        <section className="glass-card rounded-2xl p-6 text-center">
          <p className="font-body-md text-landing-muted">추천 조합이 홈 히어로에 적용되어 있습니다.</p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-full bg-gradient-to-r from-cta-from to-cta-to px-6 py-2.5 font-label-md text-white transition-all hover:opacity-90"
          >
            홈에서 확인하기
          </Link>
        </section>
      </main>
    </div>
  );
}
