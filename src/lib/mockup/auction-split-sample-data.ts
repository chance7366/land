/**
 * 경매 Split-View 목업용 샘플.
 * court fixtures → 상세 3섹션(기본정보·가격기일·물건상세)에 필요한 필드 포함.
 */
import {
  FIXTURES,
  type CourtAuctionFixture,
  type FormGroup,
  type ParcelRow,
  type ScheduleRow,
} from "@/lib/mockup/auction-court-fixtures";

export type AuctionSplitSample = {
  id: string;
  manageCode: string;
  caseNumber: string;
  itemNo: number;
  court: string;
  title: string;
  itemType: string;
  auctionType: string;
  auctionTarget: string;
  address: string;
  address2: string | null;
  region: string;
  formGroup: FormGroup;
  appraisalPrice: number;
  minPrice: number;
  bidDeposit: number;
  claimAmount: number;
  bidMethod: string;
  saleDate: string;
  dDay: number;
  status: "ONGOING" | "CLOSED" | "FAILED";
  safetyGrade: "SAFE" | "CAUTION" | "RISK";
  landArea: number | null;
  buildingArea: number | null;
  exclusiveArea: number | null;
  saleShare: string | null;
  possessionNote: string;
  leaseNote: string;
  assumeRightsNote: string;
  remarks: string;
  appraisalSummary: string;
  schedule: ScheduleRow[];
  parcels: ParcelRow[];
  images: string[];
};

const SAMPLE_IDS = [
  "844-1",
  "820-1",
  "7556-1",
  "8952-1",
  "7938-1",
  "7387-1",
  "8668-1",
  "hs-15803-1",
] as const;

const COVERS_BY_GROUP: Record<FormGroup, string[]> = {
  UNIT: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80",
  ],
  HOUSE: [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
  ],
  LAND: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&q=80",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=70&sat=-20",
  ],
};

function calcDDay(saleDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${saleDate}T00:00:00`);
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

function landAreaOf(f: CourtAuctionFixture): number | null {
  if (f.landArea != null) return f.landArea;
  return null;
}

function buildingAreaOf(f: CourtAuctionFixture): number | null {
  if (f.formGroup === "UNIT") return null;
  return f.buildingArea ?? null;
}

function fixtureToSample(f: CourtAuctionFixture, index: number): AuctionSplitSample {
  return {
    id: f.id,
    manageCode: `경매_${String(index + 1).padStart(8, "0")}`,
    caseNumber: f.caseNumber,
    itemNo: f.itemNo,
    court: f.court,
    title: f.title,
    itemType: f.itemType,
    auctionType: f.auctionType,
    auctionTarget: auctionTarget(f),
    address: f.parcels[0]?.address ?? "",
    address2: f.parcels[1]?.address ?? null,
    region: f.region,
    formGroup: f.formGroup,
    appraisalPrice: f.appraisalPrice,
    minPrice: f.minPrice,
    bidDeposit: f.bidDeposit,
    claimAmount: f.claimAmount,
    bidMethod: f.bidMethod,
    saleDate: f.saleDate,
    dDay: calcDDay(f.saleDate),
    status: "ONGOING",
    safetyGrade: safetyGrade(f),
    landArea: landAreaOf(f),
    buildingArea: buildingAreaOf(f),
    exclusiveArea: f.exclusiveArea ?? null,
    saleShare: f.saleShare ?? null,
    possessionNote: f.possessionNote,
    leaseNote: f.leaseNote,
    assumeRightsNote: f.assumeRightsNote,
    remarks: f.remarks.trim(),
    appraisalSummary: f.appraisalSummary,
    schedule: f.schedule,
    parcels: f.parcels,
    images: COVERS_BY_GROUP[f.formGroup],
  };
}

export const AUCTION_SPLIT_SAMPLES: AuctionSplitSample[] = SAMPLE_IDS.map((id, i) => {
  const f = FIXTURES.find((x) => x.id === id);
  if (!f) throw new Error(`Missing auction split fixture: ${id}`);
  return fixtureToSample(f, i);
});
