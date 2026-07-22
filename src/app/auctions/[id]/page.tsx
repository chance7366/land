import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { UserBottomNav } from "@/components/user/UserShell";
import { AuctionSplitDetail } from "@/components/auction/split/AuctionSplitDetail";
import { AppLink as Link } from "@/components/ui/AppLink";
import { ItemDwellTracker } from "@/components/analytics/ItemDwellTracker";
import { AnalyticsPageView } from "@/components/analytics/AnalyticsPageView";
import { serializeAuction } from "@/lib/auction-split-view";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { getAuctionFromSupabase } from "@/lib/supabase/repos/catalog";
import type { Auction } from "@prisma/client";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const auction = await loadAuction(id);
  if (!auction) {
    return { title: "경매물건 | 찬스부동산 경매중개" };
  }
  return {
    title: `${auction.caseNumber} · ${auction.title} | 찬스부동산 경매중개`,
    description: auction.address || auction.description?.slice(0, 120) || "경매물건 상세",
  };
}

async function loadAuction(id: string): Promise<Auction | null> {
  return withDbFallback(
    "auction-detail",
    async () => {
      if (isSupabaseEnabled()) {
        return getAuctionFromSupabase(id) as Promise<Auction | null>;
      }
      return prisma.auction.findUnique({ where: { id } });
    },
    null,
  );
}

export default async function AuctionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const auction = await loadAuction(id);
  if (!auction) notFound();

  const serialized = serializeAuction(auction);

  return (
    <LandingShell>
      <AnalyticsPageView menuKey="auctions" />
      <ItemDwellTracker targetType="auction" targetId={serialized.id} menuKey="auctions" />
      <LandingHeader />
      <LandingNav />
      <div className="relative min-h-[70vh] overflow-hidden pb-24">
        <div className="hr-aurora-layer hr-aurora-violet pointer-events-none absolute inset-0" aria-hidden>
          <div className="hr3-glow absolute inset-0" />
        </div>
        <div className="hr3-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />
        <div className="relative z-10 mx-auto max-w-[1400px] px-container-padding-mobile py-4 md:px-6 md:py-5">
          <Link
            href="/auctions"
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#c4b5fd] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            경매목록으로
          </Link>
          <AuctionSplitDetail auction={serialized} />
        </div>
      </div>
      <LandingFooter />
      <UserBottomNav />
    </LandingShell>
  );
}
