import type { Auction, AuctionSafetyGrade, AuctionStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  type AuctionAttachment,
  parseAuctionAttachments,
  stringifyAuctionAttachments,
} from "@/lib/auction-attachments";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { listAllAuctionsAdminSupabase } from "@/lib/supabase/repos/admin-catalog";
import { repairUtf8Mojibake } from "@/lib/text-encoding";

export type AuctionInput = {
  manageCode?: string | null;
  caseNumber: string;
  itemNo?: number | null;
  title: string;
  description: string;
  court?: string | null;
  saleDate?: string | null;
  address?: string | null;
  address2?: string | null;
  region?: string | null;
  auctionType?: string | null;
  itemType?: string | null;
  auctionTarget?: string | null;
  bidMethod?: string | null;
  landArea?: number | null;
  buildingArea?: number | null;
  appraisalPrice: number;
  minPrice?: number | null;
  bidDeposit?: number | null;
  claimAmount?: number | null;
  recommendedPrice?: number | null;
  winningPrice?: number | null;
  winningRatio?: number | null;
  bidderCount?: number | null;
  secondBidAmount?: number | null;
  debtorOwner?: string | null;
  creditor?: string | null;
  rightsAnalysis?: string | null;
  caseDetailJson?: string | null;
  memo?: string | null;
  images?: string[];
  attachments?: AuctionAttachment[];
  safetyGrade?: AuctionSafetyGrade;
  status?: AuctionStatus;
  featured?: boolean;
  /** 회원리포트(풀) PDF */
  reportUrl?: string | null;
  /** 일반리포트(1~3) PDF */
  generalReportUrl?: string | null;
};

function strOrNull(v: unknown): string | null {
  if (v == null || v === "") return null;
  return repairUtf8Mojibake(String(v));
}

function numOrNull(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = typeof v === "string" ? Number(String(v).replace(/,/g, "")) : Number(v);
  return Number.isFinite(n) ? n : null;
}

function intOrZero(v: unknown): number {
  const n = numOrNull(v);
  return n != null ? Math.round(n) : 0;
}

export function calcDDay(saleDate: Date | null | undefined): number {
  if (!saleDate || Number.isNaN(saleDate.getTime())) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(saleDate);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function parseSaleDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(`${value}T00:00:00`);
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseAttachmentsBody(raw: unknown): AuctionAttachment[] {
  if (!Array.isArray(raw)) return [];
  return parseAuctionAttachments(JSON.stringify(raw));
}

export function toAuctionCreateData(input: AuctionInput & { manageCode: string }): Prisma.AuctionCreateInput {
  const saleDate = parseSaleDate(input.saleDate ?? null);
  const appraisalPrice = intOrZero(input.appraisalPrice);
  const minPrice = input.minPrice != null ? intOrZero(input.minPrice) : null;
  const recommendedPrice =
    input.recommendedPrice != null && input.recommendedPrice > 0
      ? intOrZero(input.recommendedPrice)
      : minPrice != null && minPrice > 0
        ? minPrice
        : appraisalPrice;

  const itemNo =
    input.itemNo != null && Number.isFinite(Number(input.itemNo))
      ? Math.max(1, Math.round(Number(input.itemNo)))
      : 1;

  let winningRatio = input.winningRatio ?? null;
  const winningPrice = input.winningPrice != null ? intOrZero(input.winningPrice) : null;
  if (
    (winningRatio == null || !Number.isFinite(winningRatio)) &&
    winningPrice != null &&
    appraisalPrice > 0
  ) {
    winningRatio = Math.round((winningPrice / appraisalPrice) * 1000) / 10;
  }

  return {
    manageCode: input.manageCode,
    caseNumber: input.caseNumber.trim(),
    itemNo,
    title: input.title.trim(),
    description: input.description.trim() || input.memo?.trim() || input.rightsAnalysis?.trim() || "",
    appraisalPrice,
    recommendedPrice,
    safetyGrade: input.safetyGrade ?? "SAFE",
    status: input.status ?? "ONGOING",
    dDay: calcDDay(saleDate),
    images: JSON.stringify((input.images ?? []).slice(0, 8)),
    attachments: stringifyAuctionAttachments(input.attachments ?? []),
    reportUrl: input.reportUrl ?? null,
    generalReportUrl: input.generalReportUrl ?? null,
    court: input.court ?? null,
    saleDate,
    address: input.address ?? null,
    address2: input.address2 ?? null,
    region: input.region ?? null,
    auctionType: input.auctionType ?? null,
    itemType: input.itemType ?? null,
    auctionTarget: input.auctionTarget ?? null,
    bidMethod: input.bidMethod ?? null,
    landArea: input.landArea ?? null,
    buildingArea: input.buildingArea ?? null,
    minPrice,
    bidDeposit: input.bidDeposit != null ? intOrZero(input.bidDeposit) : null,
    claimAmount: input.claimAmount != null ? intOrZero(input.claimAmount) : null,
    debtorOwner: input.debtorOwner ?? null,
    creditor: input.creditor ?? null,
    rightsAnalysis: input.rightsAnalysis ?? null,
    caseDetailJson: input.caseDetailJson ?? null,
    memo: input.memo ?? null,
    winningPrice,
    winningRatio,
    bidderCount:
      input.bidderCount != null && Number.isFinite(input.bidderCount)
        ? Math.round(input.bidderCount)
        : null,
    secondBidAmount: input.secondBidAmount != null ? intOrZero(input.secondBidAmount) : null,
    featured: input.featured ?? false,
  };
}

export function parseAuctionBody(
  body: Record<string, unknown>,
): { ok: true; data: AuctionInput } | { ok: false; error: string } {
  const caseNumber = strOrNull(body.caseNumber);
  if (!caseNumber) return { ok: false, error: "사건번호가 필요합니다." };

  const title = strOrNull(body.title);
  if (!title) return { ok: false, error: "제목이 필요합니다." };

  const appraisalPrice = intOrZero(body.appraisalPrice);
  if (appraisalPrice <= 0) return { ok: false, error: "감정가를 입력하세요." };

  const saleDate = strOrNull(body.saleDate);
  if (saleDate && !/^\d{4}-\d{2}-\d{2}$/.test(saleDate)) {
    return { ok: false, error: "매각기일은 YYYY-MM-DD 형식이어야 합니다." };
  }

  return {
    ok: true,
    data: {
      manageCode: strOrNull(body.manageCode),
      caseNumber,
      itemNo: numOrNull(body.itemNo) ?? 1,
      title,
      description: strOrNull(body.description) ?? "",
      court: strOrNull(body.court),
      saleDate,
      address: strOrNull(body.address),
      address2: strOrNull(body.address2),
      region: strOrNull(body.region),
      auctionType: strOrNull(body.auctionType),
      itemType: strOrNull(body.itemType),
      auctionTarget: strOrNull(body.auctionTarget),
      bidMethod: strOrNull(body.bidMethod),
      landArea: numOrNull(body.landArea),
      buildingArea: numOrNull(body.buildingArea),
      appraisalPrice,
      minPrice: numOrNull(body.minPrice),
      bidDeposit: numOrNull(body.bidDeposit),
      claimAmount: numOrNull(body.claimAmount),
      recommendedPrice: numOrNull(body.recommendedPrice),
      winningPrice: numOrNull(body.winningPrice),
      winningRatio: numOrNull(body.winningRatio),
      bidderCount: numOrNull(body.bidderCount),
      secondBidAmount: numOrNull(body.secondBidAmount),
      debtorOwner: strOrNull(body.debtorOwner),
      creditor: strOrNull(body.creditor),
      rightsAnalysis: strOrNull(body.rightsAnalysis),
      caseDetailJson: strOrNull(body.caseDetailJson),
      memo: strOrNull(body.memo),
      images: Array.isArray(body.images) ? (body.images as string[]).filter(Boolean).slice(0, 8) : [],
      attachments: parseAttachmentsBody(body.attachments),
      safetyGrade: (body.safetyGrade as AuctionSafetyGrade) ?? "SAFE",
      status: (body.status as AuctionStatus) ?? "ONGOING",
      featured: Boolean(body.featured),
      reportUrl: strOrNull(body.reportUrl),
      generalReportUrl: strOrNull(body.generalReportUrl),
    },
  };
}

export async function getAllAuctionsAdmin() {
  const items = isSupabaseEnabled()
    ? ((await listAllAuctionsAdminSupabase()) as Auction[])
    : await prisma.auction.findMany({
        orderBy: [{ saleDate: "asc" }, { caseNumber: "asc" }, { itemNo: "asc" }],
      });
  // null saleDate → 뒤로
  return items.sort((a, b) => {
    if (!a.saleDate && !b.saleDate) {
      return a.caseNumber.localeCompare(b.caseNumber, "ko") || (a.itemNo ?? 1) - (b.itemNo ?? 1);
    }
    if (!a.saleDate) return 1;
    if (!b.saleDate) return -1;
    const diff = a.saleDate.getTime() - b.saleDate.getTime();
    if (diff !== 0) return diff;
    return a.caseNumber.localeCompare(b.caseNumber, "ko") || (a.itemNo ?? 1) - (b.itemNo ?? 1);
  });
}

export type { Auction };
