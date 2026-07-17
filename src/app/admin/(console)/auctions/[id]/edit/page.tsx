import { AppLink as Link } from "@/components/ui/AppLink";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AuctionForm } from "@/components/admin/AuctionForm";

export const dynamic = "force-dynamic";

export default async function AdminAuctionEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auction = await prisma.auction.findUnique({ where: { id } });
  if (!auction) notFound();

  return (
    <main className="p-6 md:p-10">
      <Link href="/admin/auctions" className="text-sm text-blue-400 hover:underline">
        ← 경매 목록
      </Link>
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
