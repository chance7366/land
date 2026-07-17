import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { PropertyCardGlass } from "@/components/property/PropertyCardGlass";
import { PropertyFilterDropdownBar } from "@/components/property/PropertyFilterDropdownBar";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "디자인 목업 | 매물 목록 랜딩 톤",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PropertyListLandingToneMockupPage() {
  const [properties, regionRows] = await Promise.all([
    prisma.property.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      take: 9,
    }),
    prisma.property.findMany({
      where: { status: "ACTIVE", sigungu: { not: null } },
      select: { sigungu: true },
      distinct: ["sigungu"],
      orderBy: { sigungu: "asc" },
    }),
  ]);

  const regions = regionRows
    .map((r) => r.sigungu?.trim())
    .filter((v): v is string => Boolean(v));

  return (
    <LandingShell>
      <div className="border-b border-[#4dabff]/30 bg-[rgba(77,171,255,0.08)] px-4 py-2 text-center text-xs text-[#4dabff]">
        샘플 · 홈 히어로/추천매물 카드 톤 (#1f1f1f · #4dabff glow · 골드 가격 · 핑크 지역). 승인 시
        /properties 적용.
      </div>
      <LandingHeader />
      <LandingNav />

      <main className="mx-auto max-w-6xl px-container-padding-mobile py-8 pb-24 md:px-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#4dabff]" />
          <h1 className="text-lg font-bold text-[#4dabff]">
            부동산중개 [{properties.length.toLocaleString("ko-KR")}+건 샘플]
          </h1>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#4dabff]" />
        </div>

        <PropertyFilterDropdownBar regions={regions} variant="landing" />

        <div className="mt-8 grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 sm:justify-items-stretch lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCardGlass key={property.id} property={property} />
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-[#737373]">
          카드 ≈ 홈 마퀴(240px·16:10) · lg 3열 · 글래스+#4dabff 글로우
        </p>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-[#737373]">
        <Link href="/properties" className="text-[#a3a3a3] hover:text-[#4dabff]">
          현재 /properties
        </Link>
        {" · "}
        <Link href="/" className="text-[#d4af37] hover:underline">
          ← 홈
        </Link>
      </footer>
    </LandingShell>
  );
}
