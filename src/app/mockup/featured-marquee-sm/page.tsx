import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { FeaturedPicksMarquee } from "@/components/landing/FeaturedPicksMarquee";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "디자인 목업 | 마퀴 카드 20% 축소",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function FeaturedMarqueeSmMockupPage() {
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
            <h1 className="text-lg font-bold">마퀴 카드 약 20% 축소 (240px)</h1>
            <p className="mt-1 text-xs text-[#737373]">기본 300px → 240px · 패딩·타이포도 함께 축소</p>
          </div>
          <div className="flex gap-4 text-sm">
            <Link href="/mockup/featured-marquee" className="text-[#a3a3a3] hover:text-[#d4af37]">
              기본 크기
            </Link>
            <Link href="/" className="text-[#d4af37] hover:underline">
              ← 홈
            </Link>
          </div>
        </div>
      </header>

      <FeaturedPicksMarquee
        properties={properties}
        auctions={auctions}
        isMockup
        cardSize="sm"
        mockupNote="샘플 · 카드 폭 300→240px (약 20% 축소). 승인 시 홈에 적용 가능."
      />

      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-[#737373]">
        비교:{" "}
        <Link href="/mockup/featured-marquee" className="text-[#d4af37] hover:underline">
          /mockup/featured-marquee
        </Link>{" "}
        (300px)
      </footer>
    </div>
  );
}
