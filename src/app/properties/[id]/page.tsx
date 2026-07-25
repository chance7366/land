import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { UserBottomNav } from "@/components/user/UserShell";
import { PropertySplitDetail } from "@/components/property/split/PropertySplitDetail";
import { AppLink as Link } from "@/components/ui/AppLink";
import { ItemDwellTracker } from "@/components/analytics/ItemDwellTracker";
import { AnalyticsPageView } from "@/components/analytics/AnalyticsPageView";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { getPropertyFromSupabase } from "@/lib/supabase/repos/catalog";
import type { Property } from "@prisma/client";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function loadProperty(id: string): Promise<Property | null> {
  return withDbFallback(
    "property-detail",
    async () => {
      if (isSupabaseEnabled()) {
        return getPropertyFromSupabase(id) as Promise<Property | null>;
      }
      return prisma.property.findUnique({ where: { id } });
    },
    null,
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await loadProperty(id);
  if (!property) {
    return { title: "매물 | 찬스부동산 경매중개" };
  }
  return {
    title: `${property.title} | 찬스부동산 경매중개`,
    description: property.address || property.description?.slice(0, 120) || "중개 매물 상세",
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = await loadProperty(id);
  if (!property) notFound();

  return (
    <LandingShell>
      <AnalyticsPageView menuKey="properties" />
      <ItemDwellTracker targetType="property" targetId={property.id} menuKey="properties" />
      <LandingHeader />
      <LandingNav />
      <div className="relative min-h-[70vh] overflow-hidden pb-24">
        <div className="hr-aurora-layer hr-aurora-violet pointer-events-none absolute inset-0" aria-hidden>
          <div className="hr3-glow absolute inset-0" />
        </div>
        <div className="hr3-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />
        <div className="relative z-10 mx-auto max-w-[1400px] px-container-padding-mobile py-4 md:px-6 md:py-5">
          <Link
            href="/properties"
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#c4b5fd] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            매물목록으로
          </Link>
          <PropertySplitDetail property={property} />
        </div>
      </div>
      <LandingFooter />
      <UserBottomNav />
    </LandingShell>
  );
}
