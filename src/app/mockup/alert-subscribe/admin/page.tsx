import type { Metadata } from "next";
import { LandingShell } from "@/components/landing/LandingShell";
import { AdminAlertSubscribeSample } from "@/components/mockup/AdminAlertSubscribeSample";

export const metadata: Metadata = {
  title: "디자인 목업 | 맞춤 알림 관리자 승인",
  robots: { index: false, follow: false },
};

export default function AlertSubscribeAdminMockupPage() {
  return (
    <LandingShell>
      <div className="relative min-h-screen overflow-hidden">
        <div className="hr-aurora-layer hr-aurora-violet pointer-events-none absolute inset-0" aria-hidden>
          <div className="hr3-glow absolute inset-0" />
        </div>
        <div className="hr3-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />
        <div className="relative z-10">
          <AdminAlertSubscribeSample />
        </div>
      </div>
    </LandingShell>
  );
}
