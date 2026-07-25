import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { UserBottomNav } from "@/components/user/UserShell";
import { PropertyFiltersDropdownConnected } from "@/components/property/PropertyFiltersDropdownConnected";
import { PropertyListBoard } from "@/components/property/PropertyListBoard";
import { getProperties, getPropertyCategoryCounts } from "@/lib/property-service";
import { parsePropertyListFilters } from "@/lib/property-fields";
import { serializeProperty } from "@/lib/property-split-view";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import {
  getPropertyCategoryCountsFromSupabase,
  listPropertiesFromSupabase,
  listPropertyRegionsFromSupabase,
} from "@/lib/supabase/repos/catalog";
import type { PropertyCategory } from "@prisma/client";
import { AnalyticsPageView } from "@/components/analytics/AnalyticsPageView";

export const metadata: Metadata = {
  title: "부동산 중개 | 찬스부동산 경매중개",
  description: "내포·홍성 중심 추천 매물 목록을 확인하세요.",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const openId = typeof params.id === "string" ? params.id : null;
  if (openId) {
    redirect(`/properties/${openId}`);
  }

  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "string") urlParams.set(key, value);
  });

  const filters = parsePropertyListFilters(urlParams);
  const { items, counts, regions } = await withDbFallback(
    "properties-page",
    async () => {
      if (isSupabaseEnabled()) {
        const [list, categoryCounts, regionList] = await Promise.all([
          listPropertiesFromSupabase(filters),
          getPropertyCategoryCountsFromSupabase(),
          listPropertyRegionsFromSupabase(),
        ]);
        return {
          items: list as Awaited<ReturnType<typeof getProperties>>,
          counts: categoryCounts,
          regions: regionList,
        };
      }
      const [list, categoryCounts, regionRows] = await Promise.all([
        getProperties(filters),
        getPropertyCategoryCounts(),
        prisma.property.findMany({
          where: { status: "ACTIVE", sigungu: { not: null } },
          select: { sigungu: true },
          distinct: ["sigungu"],
          orderBy: { sigungu: "asc" },
        }),
      ]);
      return {
        items: list,
        counts: categoryCounts,
        regions: regionRows
          .map((r) => r.sigungu?.trim())
          .filter((v): v is string => Boolean(v)),
      };
    },
    {
      items: [],
      counts: {} as Record<PropertyCategory, number>,
      regions: [] as string[],
    },
  );

  const serialized = items.map(serializeProperty);
  const recommended = serialized.filter((p) => p.featured).slice(0, 12);
  const recommendStrip =
    recommended.length > 0 ? recommended : serialized.slice(0, 8);
  const totalCount = Object.values(counts).reduce((sum, n) => sum + n, 0) || serialized.length;

  return (
    <LandingShell>
      <AnalyticsPageView menuKey="properties" />
      <LandingHeader />
      <LandingNav />
      <div className="relative min-h-[70vh] overflow-hidden pb-24">
        <div className="hr-aurora-layer hr-aurora-violet pointer-events-none absolute inset-0" aria-hidden>
          <div className="hr3-glow absolute inset-0" />
        </div>
        <div className="hr3-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />
        <div className="relative z-10 mx-auto max-w-[1400px] px-container-padding-mobile py-4 md:px-6 md:py-5">
          <div className="mb-4">
            <Suspense fallback={<div className="h-14 animate-pulse rounded-2xl bg-[rgba(20,18,28,0.6)]" />}>
              <PropertyFiltersDropdownConnected regions={regions} />
            </Suspense>
          </div>
          <Suspense
            fallback={
              <div className="flex min-h-[40vh] items-center justify-center text-sm text-white/50">
                불러오는 중…
              </div>
            }
          >
            <PropertyListBoard
              items={serialized}
              recommended={recommendStrip}
              totalCount={totalCount}
            />
          </Suspense>
        </div>
      </div>
      <LandingFooter />
      <UserBottomNav />
    </LandingShell>
  );
}
