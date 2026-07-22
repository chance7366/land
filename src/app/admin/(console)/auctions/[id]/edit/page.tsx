import { Printer } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { notFound } from "next/navigation";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";
import { AuctionForm } from "@/components/admin/AuctionForm";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { listAllAuctionsAdminSupabase } from "@/lib/supabase/repos/admin-catalog";

export const dynamic = "force-dynamic";

export default async function AdminAuctionEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auction = await withDbFallback(
    "admin-auction-edit",
    async () => {
      if (isSupabaseEnabled()) {
        const items = await listAllAuctionsAdminSupabase();
        return items.find((a) => a.id === id) ?? null;
      }
      return prisma.auction.findUnique({ where: { id } });
    },
    null,
  );
  if (!auction) notFound();

  return (
    <main className="p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/auctions" className="text-sm text-blue-400 hover:underline">
          ← 경매 목록
        </Link>
        <Link
          href={`/admin/auctions/${id}/export`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#f5e6d3]/35 bg-[#6B5344]/50 px-3.5 py-2 text-sm font-bold text-[#f5e6d3] hover:bg-[#6B5344]/70"
        >
          <Printer className="h-4 w-4" />
          블로그·인쇄
        </Link>
      </div>
      <h1 className="mt-4 font-headline-lg text-landing-text">경매물건 수정</h1>
      <p className="mt-2 text-sm text-landing-muted">
        자동등록과 동일한 화면입니다. 법원 불러오기로 덮어쓰거나 필드만 수정 후 저장하세요.
      </p>
      <div className="mt-6">
        <AuctionForm initial={auction} />
      </div>
    </main>
  );
}
