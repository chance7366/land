import type { Prisma } from "@prisma/client";
import { FIXTURES, type CourtAuctionFixture } from "../src/lib/mockup/auction-court-fixtures";
import { suggestAuctionTitle } from "../src/lib/auction-title";

type AuctionSeed = Prisma.AuctionCreateManyInput;

/** User-selected court cases (대구지방법원) — exclude demo siblings / 7405. */
const PRODUCTION_FIXTURE_IDS = [
  "844-1",
  "820-1",
  "7556-1",
  "8952-1",
  "7938-1",
  "7387-1",
  "8668-1",
] as const;

function calcDDay(saleDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(saleDate);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function auctionTarget(f: CourtAuctionFixture): string {
  if (f.formGroup === "LAND") return "토지만 매각";
  if (f.formGroup === "HOUSE") return "토지 및 건물일괄매각";
  return "구분건물 매각";
}

function safetyGrade(f: CourtAuctionFixture): "SAFE" | "CAUTION" | "RISK" {
  if (/전세사기|우선매수|농지취득|재매각/.test(f.remarks)) return "CAUTION";
  if (/임차인 다수|지분/.test(`${f.leaseNote} ${f.saleShare ?? ""}`)) return "CAUTION";
  return "SAFE";
}

function landArea(f: CourtAuctionFixture): number | null {
  if (f.landArea != null) return f.landArea;
  return null;
}

function buildingArea(f: CourtAuctionFixture): number | null {
  if (f.formGroup === "UNIT" && f.exclusiveArea != null) return f.exclusiveArea;
  if (f.buildingArea != null) return f.buildingArea;
  return null;
}

function rightsAnalysis(f: CourtAuctionFixture): string {
  const lines = [
    `[감정요약] ${f.appraisalSummary}`,
    `[점유] ${f.possessionNote}`,
    `[임차] ${f.leaseNote}`,
    `[매수인 인수 권리] ${f.assumeRightsNote}`,
  ];
  if (f.saleShare) lines.push(`[매각지분] ${f.saleShare}`);
  if (f.remarks.trim()) lines.push(`[물건비고]\n${f.remarks.trim()}`);
  const schedule = f.schedule
    .map(
      (s) =>
        `${s.date} ${s.kind} ${s.minPrice != null ? s.minPrice.toLocaleString("ko-KR") + "원" : ""} ${s.result}`.trim(),
    )
    .join("\n");
  if (schedule) lines.push(`[기일내역]\n${schedule}`);
  return lines.join("\n\n");
}

function fixtureToSeed(f: CourtAuctionFixture): AuctionSeed {
  const saleDate = new Date(`${f.saleDate}T00:00:00`);
  const land = landArea(f);
  const building = buildingArea(f);
  const address = f.parcels[0]?.address ?? "";
  const address2 = f.parcels[1]?.address ?? null;

  return {
    caseNumber: f.caseNumber,
    itemNo: f.itemNo,
    title: "",
    description: f.appraisalSummary,
    court: f.court,
    saleDate,
    address,
    address2,
    region: f.region,
    auctionType: f.auctionType,
    itemType: f.itemType,
    auctionTarget: auctionTarget(f),
    bidMethod: f.bidMethod,
    landArea: land,
    buildingArea: building,
    appraisalPrice: f.appraisalPrice,
    minPrice: f.minPrice,
    recommendedPrice: f.minPrice,
    bidDeposit: f.bidDeposit,
    claimAmount: f.claimAmount,
    debtorOwner: null,
    creditor: null,
    safetyGrade: safetyGrade(f),
    status: "ONGOING",
    dDay: calcDDay(saleDate),
    featured: ["844-1", "8952-1", "7387-1", "820-1"].includes(f.id),
    rightsAnalysis: rightsAnalysis(f),
    memo: f.remarks.trim() || null,
    images: "[]",
    attachments: "[]",
  };
}

const AUCTION_SEED_RAW: AuctionSeed[] = PRODUCTION_FIXTURE_IDS.map((id) => {
  const f = FIXTURES.find((x) => x.id === id);
  if (!f) throw new Error(`Missing fixture ${id}`);
  return fixtureToSeed(f);
});

export const AUCTION_SEED_DATA: AuctionSeed[] = AUCTION_SEED_RAW.map((a) => ({
  ...a,
  title: suggestAuctionTitle({
    itemType: a.itemType,
    landArea: a.landArea,
    buildingArea: a.buildingArea,
    appraisalPrice: a.appraisalPrice,
    minPrice: a.minPrice ?? a.recommendedPrice,
    saleDate: a.saleDate,
  }),
}));
