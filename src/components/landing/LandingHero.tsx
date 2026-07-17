import { AuroraPenHeroPreview } from "@/components/landing/AuroraBackgroundCycle";

/**
 * Home hero — 펜글씨 타이틀 + 오로라 배경·슬로건 색 4.5초 순환.
 */
export function LandingHero() {
  return <AuroraPenHeroPreview intervalMs={4500} fadeMs={2200} />;
}
