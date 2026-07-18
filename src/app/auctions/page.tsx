import { Suspense } from "react";
import type { Metadata } from "next";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { UserBottomNav } from "@/components/user/UserShell";
import { AuctionSplitBoard } from "@/components/auction/split/AuctionSplitBoard";
import { serializeAuction } from "@/lib/auction-split-view";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { listAuctionsFromSupabase } from "@/lib/supabase/repos/catalog";
import type { Auction } from "@prisma/client";
import { AnalyticsPageView } from "@/components/analytics/AnalyticsPageView";

export const metadata: Metadata = {
  title: "경매물건 | 찬스부동산 경매중개",
  description: "진행 중인 경매 목록과 상세를 한 화면에서 확인하세요.",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AuctionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const openId = typeof params.id === "string" ? params.id : null;

  const items = await withDbFallback(
    "auctions-page",
    async () => {
      if (isSupabaseEnabled()) {
        return listAuctionsFromSupabase() as Promise<Auction[]>;
      }
      return prisma.auction.findMany({
        where: { status: "ONGOING" },
        orderBy: [{ featured: "desc" }, { dDay: "asc" }],
      });
    },
    [] as Auction[],
  );

  return (
    <LandingShell>
      <AnalyticsPageView menuKey="auctions" />
      <LandingHeader />
      <LandingNav />
      <div className="relative min-h-[70vh] overflow-hidden pb-24">
        <div className="hr-aurora-layer hr-aurora-violet pointer-events-none absolute inset-0" aria-hidden>
          <div className="hr3-glow absolute inset-0" />
        </div>
        <div className="hr3-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />
        <div className="relative z-10 mx-auto max-w-[1400px] px-container-padding-mobile py-4 md:px-6 md:py-5">
          <Suspense
            fallback={
              <div className="flex min-h-[40vh] items-center justify-center text-sm text-white/50">
                불러오는 중…
              </div>
            }
          >
            <AuctionSplitBoard
              items={items.map(serializeAuction)}
              initialId={openId}
              totalCount={items.length}
            />
          </Suspense>
        </div>
      </div>
      <LandingFooter />
      <UserBottomNav />
    </LandingShell>
  );
}
