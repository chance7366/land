import type { Metadata } from "next";
import { Suspense } from "react";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShell } from "@/components/landing/LandingShell";
import { ConsultationPageClient } from "@/components/consultation/ConsultationPageClient";
import { ConsultationPageWithQuery } from "@/components/consultation/ConsultationPageWithQuery";
import { AnalyticsPageView } from "@/components/analytics/AnalyticsPageView";
import { publicCaseId } from "@/lib/consultation";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "상담 예약 | 찬스부동산 경매중개",
  description: "부동산 중개 · 경매 권리분석·입찰대행 · 세무/법률 상담 예약",
};

export const dynamic = "force-dynamic";

export default async function ConsultationPage() {
  const recent = await withDbFallback(
    "consultation-page",
    () =>
      prisma.consultation.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: { id: true, category: true, status: true, createdAt: true },
      }),
    [],
  );

  const boardRows = recent.map((row) => ({
    caseId: publicCaseId(row.id, row.createdAt),
    category: row.category,
    status: row.status,
    createdAt: row.createdAt.toLocaleString("ko-KR"),
  }));

  return (
    <LandingShell>
      <AnalyticsPageView menuKey="consultation" />
      <LandingHeader />
      <LandingNav />
      <div className="relative min-h-[70vh] overflow-hidden">
        <div className="hr-aurora-layer hr-aurora-sapphire pointer-events-none absolute inset-0" aria-hidden>
          <div className="hr3-glow absolute inset-0" />
        </div>
        <div className="hr3-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />
        <div className="relative z-10">
          <Suspense
            fallback={
              <ConsultationPageClient boardRows={boardRows} propertyId={null} />
            }
          >
            <ConsultationPageWithQuery boardRows={boardRows} />
          </Suspense>
        </div>
      </div>
      <LandingFooter />
    </LandingShell>
  );
}
