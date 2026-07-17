import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { PropertyCardGlass } from "@/components/property/PropertyCardGlass";
import { FeaturedPicksMarquee } from "@/components/landing/FeaturedPicksMarquee";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "디자인 목업 | 매물 카드 필드 규칙",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PropertyCardFieldsMockupPage() {
  const [properties, auctions] = await Promise.all([
    prisma.property.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      take: 9,
    }),
    prisma.auction.findMany({
      where: { status: "ONGOING" },
      orderBy: [{ featured: "desc" }, { dDay: "asc" }],
      take: 6,
    }),
  ]);

  return (
    <LandingShell>
      <div className="border-b border-[#facc15]/30 bg-[rgba(250,204,21,0.08)] px-4 py-2 text-center text-xs text-[#facc15]">
        샘플 · 배지 확대(노랑/분홍) · 건물명·스펙·가격(만원)·주소+등록일. 목록·홈 마퀴 동일 규칙.
      </div>
      <LandingHeader />
      <LandingNav />

      <main className="pb-24">
        <section className="mx-auto max-w-6xl px-container-padding-mobile py-8 md:px-8">
          <h1 className="mb-2 text-lg font-bold text-[#4dabff]">목록 카드 (3열)</h1>
          <p className="mb-6 text-xs text-[#a3a3a3]">
            유형 배지 노랑 · 거래 배지 분홍 · 제목=건물명(토지=지목·용도) · 가격 라벨+만원 · 주소 우측 등록일
          </p>
          <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 sm:justify-items-stretch lg:grid-cols-3">
            {properties.map((p) => (
              <PropertyCardGlass key={p.id} property={p} />
            ))}
          </div>
        </section>

        <section className="border-t border-white/5 bg-[#0a0a0a] py-10">
          <div className="mx-auto mb-5 max-w-6xl px-container-padding-mobile md:px-8">
            <h2 className="text-lg font-bold text-[#4dabff]">홈 추천 매물 마퀴 (동일 규칙)</h2>
          </div>
          <FeaturedPicksMarquee
            properties={properties}
            auctions={auctions}
            cardSize="sm"
            rowHeadings="accent"
            layout="contained"
            isMockup
            mockupNote="홈 FeaturedPicksMarquee 매물 카드에 동일 필드 규칙 적용 미리보기"
          />
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-[#737373]">
        <Link href="/properties" className="text-[#4dabff] hover:underline">
          /properties
        </Link>
        {" · "}
        <Link href="/" className="text-[#d4af37] hover:underline">
          ← 홈
        </Link>
      </footer>
    </LandingShell>
  );
}
