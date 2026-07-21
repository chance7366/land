import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import {
  listAllAuctionsAdminSupabase,
  patchAuctionReportUrlSupabase,
} from "@/lib/supabase/repos/admin-catalog";
import { uploadPropertyImage } from "@/lib/supabase/storage";
import { getUploadDir, uploadUrlPrefix } from "@/lib/uploads";
import {
  generateAuctionAnalysisMarkdown,
  getGeminiApiKey,
  GeminiRequestError,
} from "@/lib/gemini-client";
import {
  resolveAuctionReportModel,
  type AuctionReportModelId,
} from "@/lib/auction-report-models";
import { appendGeminiUsage, type GeminiUsageRecord } from "@/lib/gemini-usage";
import {
  attachmentsFromAuction,
  loadReportMediaParts,
} from "@/lib/auction-report-media";
import { markdownToPdfBuffer } from "@/lib/auction-report-pdf";
import type { AuctionReportSource } from "@/lib/auction-analysis-prompt";

type Params = { params: Promise<{ id: string }> };

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Gemini + Playwright PDF — 관리자 전용, 시간 여유 */
export const maxDuration = 120;

function toReportSource(auction: Record<string, unknown>): AuctionReportSource {
  return {
    id: String(auction.id ?? ""),
    manageCode: (auction.manageCode as string | null) ?? null,
    caseNumber: String(auction.caseNumber ?? ""),
    itemNo: auction.itemNo == null ? 1 : Number(auction.itemNo),
    title: String(auction.title ?? ""),
    court: (auction.court as string | null) ?? null,
    address: (auction.address as string | null) ?? null,
    address2: (auction.address2 as string | null) ?? null,
    region: (auction.region as string | null) ?? null,
    itemType: (auction.itemType as string | null) ?? null,
    auctionType: (auction.auctionType as string | null) ?? null,
    saleDate: (auction.saleDate as Date | string | null) ?? null,
    appraisalPrice: auction.appraisalPrice == null ? null : Number(auction.appraisalPrice),
    minPrice: auction.minPrice == null ? null : Number(auction.minPrice),
    bidDeposit: auction.bidDeposit == null ? null : Number(auction.bidDeposit),
    claimAmount: auction.claimAmount == null ? null : Number(auction.claimAmount),
    recommendedPrice:
      auction.recommendedPrice == null ? null : Number(auction.recommendedPrice),
    rightsAnalysis: (auction.rightsAnalysis as string | null) ?? null,
    caseDetailJson: (auction.caseDetailJson as string | null) ?? null,
    memo: (auction.memo as string | null) ?? null,
    description: (auction.description as string | null) ?? null,
    safetyGrade: (auction.safetyGrade as string | null) ?? null,
    status: (auction.status as string | null) ?? null,
  };
}

async function loadAuction(id: string) {
  if (isSupabaseEnabled()) {
    const items = await listAllAuctionsAdminSupabase();
    return items.find((a) => a.id === id) ?? null;
  }
  return prisma.auction.findUnique({ where: { id } });
}

async function uploadReportPdf(auctionId: string, buffer: Buffer): Promise<string> {
  const withCacheBust = (url: string) => {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}t=${Date.now()}`;
  };

  if (isSupabaseEnabled()) {
    try {
      const storagePath = `auctions/reports/${auctionId}.pdf`;
      const publicUrl = await uploadPropertyImage(storagePath, buffer, "application/pdf");
      return withCacheBust(publicUrl);
    } catch (e) {
      // property-images 버킷에 application/pdf 가 허용되지 않은 경우 로컬로 폴백
      console.warn(
        "[auctions/report] Supabase Storage PDF 업로드 실패 → 로컬 저장으로 폴백. " +
          "Dashboard에서 property-images 버킷 Allowed MIME에 application/pdf를 추가하세요.",
        e,
      );
    }
  }

  const dir = path.join(getUploadDir("auctions"));
  await mkdir(dir, { recursive: true });
  const filename = `report-${auctionId}.pdf`;
  await writeFile(path.join(dir, filename), buffer);
  return withCacheBust(`${uploadUrlPrefix("auctions")}/${filename}`);
}

async function patchReportUrl(id: string, reportUrl: string) {
  if (isSupabaseEnabled()) {
    return patchAuctionReportUrlSupabase(id, reportUrl);
  }
  return prisma.auction.update({
    where: { id },
    data: { reportUrl },
  });
}

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;

  if (!getGeminiApiKey()) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY가 설정되어 있지 않습니다. .env.local을 확인하세요." },
      { status: 503 },
    );
  }

  let model: AuctionReportModelId;
  try {
    const body = (await request.json().catch(() => ({}))) as { model?: unknown };
    model = resolveAuctionReportModel(body.model);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "모델 선택이 올바르지 않습니다.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  let auction;
  try {
    auction = await loadAuction(id);
  } catch (e) {
    console.error("[auctions/report] load", e);
    return NextResponse.json({ error: "경매 물건 조회에 실패했습니다." }, { status: 500 });
  }

  if (!auction) {
    return NextResponse.json({ error: "경매 물건을 찾을 수 없습니다." }, { status: 404 });
  }

  const source = toReportSource(auction as unknown as Record<string, unknown>);
  const attachments = attachmentsFromAuction(
    auction as { attachments?: string | null },
  );

  let mediaParts: Awaited<ReturnType<typeof loadReportMediaParts>>["parts"] = [];
  let mediaSkipped: string[] = [];
  try {
    const loaded = await loadReportMediaParts(attachments);
    mediaParts = loaded.parts;
    mediaSkipped = loaded.skipped;
  } catch (e) {
    console.warn("[auctions/report] media load", e);
  }

  let markdown: string;
  let usage: GeminiUsageRecord;
  let mediaCount = 0;
  let imageModelUsed = false;
  let imageModelNote: string | undefined;
  try {
    const result = await generateAuctionAnalysisMarkdown(
      source,
      model,
      mediaParts,
      mediaSkipped,
    );
    markdown = result.markdown;
    usage = result.usage;
    mediaCount = result.mediaCount;
    imageModelUsed = result.imageModelUsed;
    imageModelNote = result.imageModelNote;
    await appendGeminiUsage(usage).catch((e) =>
      console.warn("[auctions/report] usage log failed", e),
    );
  } catch (e) {
    console.error("[auctions/report] gemini", e);
    if (e instanceof GeminiRequestError) {
      return NextResponse.json({ error: e.message, model }, { status: e.status });
    }
    const msg = e instanceof Error ? e.message : "Gemini 분석 생성에 실패했습니다.";
    return NextResponse.json({ error: msg, model }, { status: 500 });
  }

  let pdfBuffer: Buffer;
  try {
    const title = `${source.caseNumber} 권리분석 프리미엄 리포트`;
    pdfBuffer = await markdownToPdfBuffer(markdown, title);
  } catch (e) {
    console.error("[auctions/report] pdf", e);
    const msg = e instanceof Error ? e.message : "PDF 변환에 실패했습니다.";
    const hint = /Executable doesn't exist|browserType\.launch/i.test(msg)
      ? " Playwright Chromium이 필요합니다. `npx playwright install chromium`을 실행하세요."
      : "";
    return NextResponse.json({ error: `PDF 변환 실패: ${msg}.${hint}` }, { status: 500 });
  }

  let reportUrl: string;
  try {
    reportUrl = await uploadReportPdf(id, pdfBuffer);
  } catch (e) {
    console.error("[auctions/report] upload", e);
    return NextResponse.json({ error: "PDF 업로드에 실패했습니다." }, { status: 500 });
  }

  try {
    await patchReportUrl(id, reportUrl);
  } catch (e) {
    console.error("[auctions/report] patch", e);
    return NextResponse.json(
      { error: "리포트 URL 저장에 실패했습니다.", reportUrl },
      { status: 500 },
    );
  }

  return NextResponse.json({
    reportUrl,
    markdown,
    model,
    mediaCount,
    mediaSkipped,
    imageModelUsed,
    imageModelNote,
    usage: {
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      totalTokens: usage.totalTokens,
      inputCostUsd: usage.inputCostUsd,
      outputCostUsd: usage.outputCostUsd,
      totalCostUsd: usage.totalCostUsd,
    },
  });
}
