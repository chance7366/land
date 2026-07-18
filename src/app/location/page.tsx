import type { Metadata } from "next";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { LocationPage } from "@/components/location/LocationPage";
import { UserBottomNav } from "@/components/user/UserShell";
import { LOCATION_INFO } from "@/lib/location";
import { AnalyticsPageView } from "@/components/analytics/AnalyticsPageView";

export const metadata: Metadata = {
  title: "찾아오시는 길 | 찬스부동산 경매중개",
  description: `${LOCATION_INFO.address} · ${LOCATION_INFO.nameFull}`,
};

export default function LocationRoutePage() {
  return (
    <LandingShell>
      <AnalyticsPageView menuKey="location" />
      <LandingHeader />
      <LandingNav />
      <div className="relative min-h-[70vh] overflow-hidden pb-24">
        <div className="hr-aurora-layer hr-aurora-sapphire pointer-events-none absolute inset-0" aria-hidden>
          <div className="hr3-glow absolute inset-0" />
        </div>
        <div className="hr3-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />
        <div className="relative z-10">
          <LocationPage />
        </div>
      </div>
      <LandingFooter />
      <UserBottomNav />
    </LandingShell>
  );
}
