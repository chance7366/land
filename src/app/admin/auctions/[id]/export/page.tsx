import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuctionDetailExport } from "@/components/auction/AuctionDetailExport";
import { serializeAuction } from "@/lib/auction-split-view";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { listAllAuctionsAdminSupabase } from "@/lib/supabase/repos/admin-catalog";
import type { Auction } from "@prisma/client";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function loadAuction(id: string): Promise<Auction | null> {
  return withDbFallback(
    "admin-auction-export",
    async () => {
      if (isSupabaseEnabled()) {
        const items = await listAllAuctionsAdminSupabase();
        return (items.find((a) => a.id === id) as Auction | undefined) ?? null;
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
    return { title: "경매물건 내보내기 | 관리자" };
  }
  return {
    title: `${auction.caseNumber} · 블로그·인쇄 | 관리자`,
    description: `${auction.caseNumber} 블로그·인쇄용 안내`,
  };
}

/** 관리자 전용 — 블로그용 복사 + 인쇄 (사이드바 없는 전체 화면) */
export default async function AdminAuctionExportPage({ params }: PageProps) {
  const { id } = await params;
  const auction = await loadAuction(id);
  if (!auction) notFound();

  const serialized = serializeAuction(auction);

  return (
    <AuctionDetailExport
      auction={serialized}
      allowBlogCopy
      backHref={`/admin/auctions/${id}/edit`}
      backLabel="수정 화면으로"
    />
  );
}
