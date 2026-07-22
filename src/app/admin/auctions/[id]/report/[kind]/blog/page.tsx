import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuctionReportBlogCopy } from "@/components/admin/AuctionReportBlogCopy";
import { AppLink as Link } from "@/components/ui/AppLink";
import {
  reportKindLabel,
  type AuctionReportKind,
} from "@/lib/auction-report-models";
import { loadReportMarkdown } from "@/lib/auction-report-markdown";
import { markdownToReportHtml } from "@/lib/auction-report-pdf";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { listAllAuctionsAdminSupabase } from "@/lib/supabase/repos/admin-catalog";
import type { Auction } from "@prisma/client";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string; kind: string }>;
};

function parseReportKind(raw: string): AuctionReportKind | null {
  if (raw === "general" || raw === "member") return raw;
  return null;
}

async function loadAuction(id: string): Promise<Auction | null> {
  return withDbFallback(
    "admin-auction-report-blog",
    async () => {
      if (isSupabaseEnabled()) {
        const items = await listAllAuctionsAdminSupabase();
        return (items.find((a) => a.id === id) as Auction | undefined) ?? null;
      }
      return prisma.auction.findUnique({ where: { id } });
    },
    null,
  );
}

function reportTitle(caseNumber: string, kind: AuctionReportKind): string {
  return kind === "general"
    ? `${caseNumber} 권리분석 일반 리포트`
    : `${caseNumber} 권리분석 프리미엄 리포트`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, kind: kindRaw } = await params;
  const kind = parseReportKind(kindRaw);
  const auction = await loadAuction(id);
  if (!auction || !kind) {
    return { title: "리포트 블로그 복사 | 관리자" };
  }
  return {
    title: `${reportKindLabel(kind)} 블로그 복사 · ${auction.caseNumber}`,
  };
}

export default async function AdminAuctionReportBlogPage({ params }: PageProps) {
  const { id, kind: kindRaw } = await params;
  const kind = parseReportKind(kindRaw);
  if (!kind) notFound();

  const auction = await loadAuction(id);
  if (!auction) notFound();

  const markdown = await loadReportMarkdown(id, kind);
  const backHref = `/admin/auctions/${id}/edit`;
  const kindLabel = reportKindLabel(kind);
  const title = reportTitle(auction.caseNumber, kind);

  if (!markdown) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#D8D4CE] px-6 text-center text-[#3D342C]">
        <h1 className="text-lg font-bold">{kindLabel} 블로그용 본문이 없습니다</h1>
        <p className="mt-2 max-w-md text-sm text-[#6B5344]/90">
          PDF만 있는 기존 리포트는 마크다운이 저장되어 있지 않습니다. 수정 화면에서{" "}
          <strong>{kindLabel} 생성</strong>을 다시 실행한 뒤 이용해 주세요.
        </p>
        <Link
          href={backHref}
          className="mt-6 inline-flex rounded-xl bg-[#6B5344] px-4 py-2.5 text-sm font-bold text-white"
        >
          수정 화면으로
        </Link>
      </main>
    );
  }

  const { articleHtml } = await markdownToReportHtml(markdown, title);

  return (
    <AuctionReportBlogCopy
      auctionId={id}
      kindLabel={kindLabel}
      title={title}
      articleHtml={articleHtml}
      backHref={backHref}
    />
  );
}
