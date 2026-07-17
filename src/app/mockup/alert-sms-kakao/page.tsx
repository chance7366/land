import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { AlertSmsKakaoSampleClient } from "@/components/mockup/AlertSmsKakaoSampleClient";

export const metadata: Metadata = {
  title: "디자인 목업 | 문자·카카오 알림 문구",
  robots: { index: false, follow: false },
};

export default function AlertSmsKakaoMockupPage() {
  return (
    <LandingShell>
      <div className="border-b border-amber-400/30 bg-[#12100a] px-4 py-2 text-center text-xs text-amber-100/90">
        프로덕션 문구 적용됨 · Solapi/카카오 키는 운영 시 등록{" "}
        <Link href="/" className="text-amber-200 hover:underline">
          ← 홈
        </Link>
        {" · "}
        <Link href="/mockup/alert-email-templates" className="text-amber-200/80 hover:underline">
          메일 템플릿
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
          <AlertSmsKakaoSampleClient />
        </div>
      </div>
      <LandingFooter />
    </LandingShell>
  );
}
