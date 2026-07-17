import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { AlertEmailTemplateSampleClient } from "@/components/mockup/AlertEmailTemplateSampleClient";

export const metadata: Metadata = {
  title: "디자인 목업 | 맞춤 알림 메일 템플릿",
  robots: { index: false, follow: false },
};

export default function AlertEmailTemplateMockupPage() {
  return (
    <LandingShell>
      <div className="border-b border-amber-400/30 bg-[#12100a] px-4 py-2 text-center text-xs text-amber-100/90">
        샘플 · 맞춤 알림 HTML 메일 (중개/경매) · 프로덕션 발송 미적용{" "}
        <Link href="/" className="text-amber-200 hover:underline">
          ← 홈
        </Link>
      </div>
      <LandingHeader />
      <LandingNav />
      <div className="relative min-h-[70vh] overflow-hidden">
        <div className="hr-aurora-layer hr-aurora-violet pointer-events-none absolute inset-0" aria-hidden>
          <div className="hr3-glow absolute inset-0" />
        </div>
        <div className="hr3-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />
        <div className="relative z-10">
          <AlertEmailTemplateSampleClient />
        </div>
      </div>
      <LandingFooter />
    </LandingShell>
  );
}
