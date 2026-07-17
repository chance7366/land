import type { Metadata } from "next";
import { Suspense } from "react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { AuctionSplitSampleClient } from "@/components/mockup/auction-split/AuctionSplitSampleClient";

export const metadata: Metadata = {
  title: "디자인 목업 | 경매 Split-View",
  robots: { index: false, follow: false },
};

export default function AuctionListSplitMockupPage() {
  return (
    <LandingShell>
      <div className="border-b border-amber-400/30 bg-[#12100a] px-4 py-2 text-center text-xs text-amber-100/90">
        샘플 · 헤더·CTA 개편 ·{" "}
        <Link href="/auctions" className="font-bold text-emerald-300 hover:underline">
          프로덕션 적용됨 → /auctions
        </Link>
        {" · "}
        <Link href="/mockup/property-list-split" className="text-amber-200 hover:underline">
          매물 Split 참조
        </Link>
        {" · "}
        <Link href="/" className="text-amber-200/80 hover:underline">
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
          <Suspense
            fallback={
              <div className="flex min-h-[40vh] items-center justify-center text-sm text-white/50">
                불러오는 중…
              </div>
            }
          >
            <AuctionSplitSampleClient />
          </Suspense>
        </div>
      </div>
      <LandingFooter />
    </LandingShell>
  );
}
