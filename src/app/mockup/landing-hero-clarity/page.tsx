import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingHeroClaritySample } from "@/components/mockup/LandingHeroClaritySample";

export const metadata: Metadata = {
  title: "디자인 목업 | 랜딩 히어로 가독성·CTA",
  robots: { index: false, follow: false },
};

export default function LandingHeroClarityMockupPage() {
  return (
    <div className="min-h-screen bg-landing-bg text-landing-text">
      <div className="border-b border-amber-400/30 bg-[#14100c] px-4 py-2 text-center text-xs text-amber-100/90">
        목업 · Gemini 랜딩 피드백 반영 · 프로덕션 미적용 ·{" "}
        <Link href="/" className="font-bold text-amber-300 hover:underline">
          현재 홈 →
        </Link>
      </div>
      <LandingHeroClaritySample />
    </div>
  );
}
