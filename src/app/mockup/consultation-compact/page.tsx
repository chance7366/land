import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { ConsultationCompactFormSample } from "@/components/mockup/ConsultationCompactFormSample";

export const metadata: Metadata = {
  title: "디자인 목업 | 상담예약 컴팩트 폼",
  robots: { index: false, follow: false },
};

export default function ConsultationCompactMockupPage() {
  return (
    <LandingShell>
      <div className="border-b border-amber-400/30 bg-[#14100c] px-4 py-2 text-center text-xs text-amber-100/90">
        목업 · 컴팩트 상담예약 · 프로덕션 미적용 ·{" "}
        <Link href="/consultation" className="font-bold text-amber-300 hover:underline">
          현재 상담예약 →
        </Link>
      </div>
      <LandingHeader />
      <LandingNav />
      <main className="relative min-h-[70vh] overflow-hidden">
        <div
          className="hr-aurora-layer hr-aurora-sapphire pointer-events-none absolute inset-0"
          aria-hidden
        >
          <div className="hr3-glow absolute inset-0" />
        </div>
        <div className="hr3-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />
        <div className="relative z-10 mx-auto max-w-6xl px-container-padding-mobile py-10 md:px-8 md:py-14">
          <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white md:text-3xl">상담 예약</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
                STEP 제목 없이 분야 선택 후 상세·고객 정보를 한 카드에서 작성합니다.
              </p>
            </div>
            <nav className="text-xs text-white/40" aria-label="breadcrumb">
              HOME › <span className="text-[#93c5fd]">상담 예약</span>
            </nav>
          </header>
          <ConsultationCompactFormSample />
        </div>
      </main>
      <LandingFooter />
    </LandingShell>
  );
}
