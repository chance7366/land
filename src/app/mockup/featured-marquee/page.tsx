import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { FeaturedPicksMarquee } from "@/components/landing/FeaturedPicksMarquee";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "디자인 목업 | 매물·경매 RTL 마퀴",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function FeaturedMarqueeMockupPage() {
  const [properties, auctions] = await Promise.all([
    prisma.property.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    }),
    prisma.auction.findMany({
      where: { status: "ONGOING" },
      orderBy: [{ featured: "desc" }, { dDay: "asc" }],
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#a3a3a3]">Mockup</p>
            <h1 className="text-lg font-bold">매물 · 경매 우측→좌측 마퀴</h1>
          </div>
          <Link href="/" className="text-sm text-[#d4af37] hover:underline">
            ← 홈
          </Link>
        </div>
      </header>

      <FeaturedPicksMarquee properties={properties} auctions={auctions} isMockup />

      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-[#737373]">
        승인 후 홈 추천 섹물 · 경매 섹션에 동일 패턴 적용 가능
      </footer>
    </div>
  );
}
