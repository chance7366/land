import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import {
  ColorTokenLegend,
  LegacyDashboardColumns,
  UnifiedDashboardColumns,
} from "@/components/mockup/UnifiedDashboardPreview";

export const metadata: Metadata = {
  title: "디자인 목업 | 4섹션 대시보드",
  robots: { index: false, follow: false },
};

export default function UnifiedDashboardMockupPage() {
  return (
    <div className="min-h-screen bg-landing-bg text-landing-text">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-landing-bg/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-violet-500/20 px-3 py-1 font-caption font-bold text-violet-300">
              디자인 목업
            </span>
            <h1 className="font-section-title text-landing-text">4섹션 대시보드 통일</h1>
          </div>
          <Link href="/" className="font-caption font-medium text-blue-400 hover:underline">
            ← 홈으로
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 pb-16">
        <p className="font-caption mb-8 text-landing-muted">
          Unified Light Panel 제안: 4개 섹션 밝은 패널, 상단 border-t 4색으로만 섹션 구분.
        </p>

        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded bg-surface-container-high px-2 py-1 font-caption font-bold text-on-surface-variant">
              Before
            </span>
            <h2 className="font-section-title text-primary">현재 홈 경매 섹션 패널</h2>
          </div>
          <LegacyDashboardColumns />
        </section>

        <section className="mb-4">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded bg-primary/10 px-2 py-1 font-caption font-bold text-primary">After</span>
            <h2 className="font-section-title text-primary">제안: Unified Light Panel</h2>
          </div>
          <UnifiedDashboardColumns />
        </section>

        <ColorTokenLegend />
      </main>
    </div>
  );
}
