import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { FeaturedPicksMarquee } from "@/components/landing/FeaturedPicksMarquee";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "디자인 목업 | 마퀴 max-w-6xl 정렬",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function FeaturedMarqueeContainedMockupPage() {
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
            <h1 className="text-lg font-bold">마퀴 너비 = 헤더(max-w-6xl)</h1>
            <p className="mt-1 text-xs text-[#737373]">
              카드 트랙을 추천 매물/경매 헤더와 같은 1112px 폭으로 제한
            </p>
          </div>
          <Link href="/" className="text-sm text-[#d4af37] hover:underline">
            ← 홈
          </Link>
        </div>
      </header>

      <FeaturedPicksMarquee
        properties={properties}
        auctions={auctions}
        isMockup
        cardSize="sm"
        rowHeadings="accent"
        layout="contained"
        mockupNote="샘플 · 마퀴가 헤더와 동일 max-w-6xl 안에서만 보입니다. 승인 시 홈 적용."
      />
    </div>
  );
}
