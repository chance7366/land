import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import { LandingShell } from "@/components/landing/LandingShell";
import { PropertyFilterDropdownBar } from "@/components/property/PropertyFilterDropdownBar";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "디자인 목업 | 매물 필터 드롭다운",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PropertyFiltersDropdownMockupPage() {
  const rows = await prisma.property.findMany({
    where: { status: "ACTIVE", sigungu: { not: null } },
    select: { sigungu: true },
    distinct: ["sigungu"],
    orderBy: { sigungu: "asc" },
  });
  const regions = rows
    .map((r) => r.sigungu?.trim())
    .filter((v): v is string => Boolean(v));

  return (
    <LandingShell>
      <header className="border-b border-landing-border px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div>
            <p className="text-xs text-landing-muted">Mockup</p>
            <h1 className="text-lg font-bold">매물 필터 드롭다운 (복수선택)</h1>
          </div>
          <Link href="/properties" className="text-sm text-[#d4af37] hover:underline">
            /properties 적용본 →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-container-padding-mobile py-8 md:px-8">
        <p className="mb-6 rounded-lg border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2 text-center text-xs text-[#d4af37]">
          샘플 · 전체선택 · 정렬 우측. 실제 목록은 /properties 에서 확인하세요.
        </p>

        <div
          className="relative min-h-[320px] overflow-hidden rounded-2xl border border-landing-border bg-cover bg-center p-4 md:p-6"
          style={{ backgroundImage: "url(/images/hero-naepo.jpg)" }}
        >
          <div className="absolute inset-0 bg-landing-bg/75 backdrop-blur-[2px]" />
          <div className="relative">
            <PropertyFilterDropdownBar regions={regions} />
          </div>
        </div>
      </main>
    </LandingShell>
  );
}
