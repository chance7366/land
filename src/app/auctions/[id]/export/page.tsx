import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuctionDetailExport } from "@/components/auction/AuctionDetailExport";
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

async function loadAuction(id: string): Promise<Auction | null> {
  return withDbFallback(
    "auction-detail-export",
    async () => {
      if (isSupabaseEnabled()) {
        return getAuctionFromSupabase(id) as Promise<Auction | null>;
      }
      return prisma.auction.findUnique({ where: { id } });
    },
    null,
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const auction = await loadAuction(id);
  if (!auction) {
    return { title: "경매물건 내보내기 | 찬스부동산 경매중개" };
  }
  return {
    title: `${auction.caseNumber} · 내보내기 | 찬스부동산 경매중개`,
    description: `${auction.caseNumber} 블로그·인쇄용 안내`,
  };
}

export default async function AuctionDetailExportPage({ params }: PageProps) {
  const { id } = await params;
  const auction = await loadAuction(id);
  if (!auction) notFound();

  const serialized = serializeAuction(auction);

  return (
    <>
      <AnalyticsPageView menuKey="auctions" />
      <AuctionDetailExport auction={serialized} />
    </>
  );
}
