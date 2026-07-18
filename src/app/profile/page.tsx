import type { Metadata } from "next";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { ProfileIntroContent } from "@/components/profile/ProfileIntroContent";
import { UserBottomNav } from "@/components/user/UserShell";
import { AnalyticsPageView } from "@/components/analytics/AnalyticsPageView";

export const metadata: Metadata = {
  title: "프로필 | 찬스부동산 경매중개",
  description:
    "김영찬 공인중개사 — 충청권 부동산 매매·임대 중개와 전국 경매 권리분석·입찰 대행",
};

export default function ProfilePage() {
  return (
    <LandingShell>
      <AnalyticsPageView menuKey="profile" />
      <LandingHeader />
      <LandingNav />
      <div className="relative min-h-[70vh] overflow-hidden pb-24">
        <div className="hr-aurora-layer hr-aurora-violet pointer-events-none absolute inset-0" aria-hidden>
          <div className="hr3-glow absolute inset-0" />
        </div>
        <div className="hr3-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />
        <ProfileIntroContent />
      </div>
      <LandingFooter />
      <UserBottomNav />
    </LandingShell>
  );
}
