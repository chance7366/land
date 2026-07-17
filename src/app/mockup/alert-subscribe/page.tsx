import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { AlertSubscribeSample } from "@/components/mockup/AlertSubscribeSample";

export const metadata: Metadata = {
  title: "디자인 목업 | 맞춤 알림 신청",
  robots: { index: false, follow: false },
};

export default function AlertSubscribeMockupPage() {
  return (
    <LandingShell>
      <div className="border-b border-amber-400/30 bg-[#12100a] px-4 py-2 text-center text-xs text-amber-100/90">
        샘플 v2 · 맞춤 알림 한 화면 모달 (중앙·무스크롤·히어로 배경) · 프로덕션 미적용{" "}
        <Link href="/" className="text-amber-200 hover:underline">
          ← 홈
        </Link>
        {" · "}
        <Link href="/mockup/alert-subscribe/admin" className="text-amber-200/80 hover:underline">
          관리자 승인
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
          <AlertSubscribeSample />
        </div>
      </div>
      <LandingFooter />
    </LandingShell>
  );
}
