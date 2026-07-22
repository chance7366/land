/**
 * 사용자 경매상세(관리자 1~6절)용 뷰모델 조립.
 * rightsAnalysis / caseDetailJson 에서 관리자 폼과 동일 규칙으로 파싱합니다.
 */

import {
  emptyBasicInfoView,
  type AuctionBasicInfoView,
} from "@/lib/auction-basic-info";
import {
  caseDetailFromRights,
  emptyCaseDetail,
  type CaseDetail,
} from "@/lib/auction-case-detail";
import {
  firstAddressFromDetail,
  type AuctionListDetailRow,
} from "@/lib/auction-list-details";
import type {
  ScheduleRow,
  StatusLeaseRow,
  StatusReport,
} from "@/lib/mockup/auction-court-fixtures";
import { repairUtf8Mojibake } from "@/lib/text-encoding";

function emptyLeaseRow(no = 1): StatusLeaseRow {
  return {
    no,
    address: "",
    leaseCountLabel: "",
    occupant: "",
    partyType: "",
    occupyPart: "",
    usage: "",
    occupyPeriod: "",
    deposit: "",
    rent: "",
    moveInDate: "",
    fixedDate: "",
    leaseEtc: "",
  };
}

function emptyStatusReport(): StatusReport {
  return {
    available: false,
    court: "",
    ordRound: "1",
    caseLabel: "",
    surveyedAt: "",
    photoCount: 0,
    photoLabel: "",
    possessionAddress: "",
    possessionRelation: "",
    possessionEtc: "",
    leases: [emptyLeaseRow(1)],
  };
}

export type AuctionDetailSource = {
  caseNumber: string;
  itemNo?: number | null;
  title?: string | null;
  description?: string | null;
  court?: string | null;
  address?: string | null;
  address2?: string | null;
  region?: string | null;
  itemType?: string | null;
  bidMethod?: string | null;
  saleDate?: string | Date | null;
  appraisalPrice?: number | null;
  minPrice?: number | null;
  bidDeposit?: number | null;
  claimAmount?: number | null;
  landArea?: number | null;
  buildingArea?: number | null;
  rightsAnalysis?: string | null;
  caseDetailJson?: string | null;
};

export type AuctionDetailSections = {
  basic: AuctionBasicInfoView;
  schedule: ScheduleRow[];
  listDetails: AuctionListDetailRow[];
  appraisalSummary: string;
  caseDetail: CaseDetail;
  statusReport: StatusReport;
  chips: {
    exclusiveArea: string;
    landRight: string;
    possession: string;
  };
};

function sectionFromRights(text: string, key: string): string {
  const normalized = repairUtf8Mojibake(text || "");
  // 관리자 저장은 \n\n[ 구분, 구형/혼용은 \n[ 도 허용
  const re = new RegExp(`\\[${key}\\]\\s*([\\s\\S]*?)(?=\\n\\s*\\[|$)`);
  const m = normalized.match(re);
  return m?.[1]?.trim() ?? "";
}

function looksLikeRightsDump(text: string): boolean {
  return /\[기일내역JSON\]|\[목록내역JSON\]|\[현황조사서JSON\]|\[사건상세JSON\]|\[등록메타JSON\]/.test(
    text,
  );
}

function parseMeta(rights: string): Record<string, string> {
  const raw = sectionFromRights(rights, "등록메타JSON");
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (v == null) continue;
      out[k] = String(v);
    }
    return out;
  } catch {
    return {};
  }
}

export function loadCaseDetailFromAuction(auction: AuctionDetailSource): CaseDetail {
  const fromCol = auction.caseDetailJson;
  if (fromCol) {
    try {
      const parsed = JSON.parse(fromCol) as CaseDetail;
      if (parsed && typeof parsed === "object") {
        return { ...emptyCaseDetail(), ...parsed };
      }
    } catch {
      /* fall through */
    }
  }
  return caseDetailFromRights(auction.rightsAnalysis ?? "");
}

export function scheduleFromRights(text: string): ScheduleRow[] {
  const jsonRaw = sectionFromRights(text, "기일내역JSON");
  if (jsonRaw) {
    try {
      const parsed = JSON.parse(jsonRaw) as ScheduleRow[];
      if (Array.isArray(parsed) && parsed.length) {
        return parsed
          .filter((r) => r && typeof r === "object")
          .map((r) => ({
            date: String(r.date || ""),
            kind: String(r.kind || ""),
            place: String(r.place || ""),
            minPrice:
              r.minPrice == null || Number.isNaN(Number(r.minPrice))
                ? null
                : Number(r.minPrice),
            result: String(r.result || ""),
          }));
      }
    } catch {
      /* fall through */
    }
  }

  const lines = sectionFromRights(text, "기일내역");
  if (!lines) return [];
  return lines
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(
        /^(\d{4}[.\-/]\d{1,2}[.\-/]\d{1,2})\s+(\S+)\s*(?:([\d,]+)원)?\s*(.*)$/,
      );
      if (!m) {
        return { date: line, kind: "", place: "", minPrice: null, result: "" };
      }
      return {
        date: m[1],
        kind: m[2],
        place: "",
        minPrice: m[3] ? Number(m[3].replace(/,/g, "")) : null,
        result: (m[4] || "").trim(),
      };
    });
}

function listDetailsFromRights(text: string): AuctionListDetailRow[] {
  const raw = sectionFromRights(text, "목록내역JSON");
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as AuctionListDetailRow[];
      if (Array.isArray(parsed) && parsed.length) {
        return parsed
          .filter((r) => r && Number(r.no) > 0)
          .map((r) => ({
            no: Number(r.no),
            listKind: String(r.listKind || ""),
            detail: String(r.detail || ""),
          }));
      }
    } catch {
      /* fall through */
    }
  }
  return [];
}

function listDetailsFromCaseDetail(detail: CaseDetail): AuctionListDetailRow[] {
  if (!detail.lists?.length) return [];
  return detail.lists.map((r) => ({
    no: r.no,
    listKind: r.listKind,
    detail:
      r.detail && r.detail.length >= 8
        ? r.detail
        : [r.address, r.detail].filter(Boolean).join("\n"),
  }));
}

export function loadListDetailsFromAuction(
  auction: AuctionDetailSource,
  caseDetail?: CaseDetail,
): AuctionListDetailRow[] {
  const fromRights = listDetailsFromRights(auction.rightsAnalysis ?? "");
  if (fromRights.length) return fromRights;
  const detail = caseDetail ?? loadCaseDetailFromAuction(auction);
  return listDetailsFromCaseDetail(detail);
}

export function statusReportFromRights(text: string): StatusReport {
  const raw = sectionFromRights(text, "현황조사서JSON");
  if (!raw) return emptyStatusReport();
  try {
    const parsed = JSON.parse(raw) as StatusReport;
    if (parsed && typeof parsed === "object") {
      return {
        ...emptyStatusReport(),
        ...parsed,
        leases: Array.isArray(parsed.leases) ? parsed.leases : emptyStatusReport().leases,
      };
    }
  } catch {
    /* ignore */
  }
  return emptyStatusReport();
}

function formatSaleDateLabel(
  saleDate: string | Date | null | undefined,
  saleDateLabel: string,
): string {
  if (saleDateLabel.trim()) return saleDateLabel.trim();
  if (!saleDate) return "";
  try {
    const d = typeof saleDate === "string" ? new Date(saleDate) : saleDate;
    if (Number.isNaN(d.getTime())) {
      if (/^\d{4}-\d{2}-\d{2}/.test(String(saleDate))) {
        return String(saleDate).slice(0, 10).replace(/-/g, ".");
      }
      return String(saleDate);
    }
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${day}`;
  } catch {
    return String(saleDate);
  }
}

function fmtArea(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n) || n <= 0) return "—";
  return `${n.toLocaleString("ko-KR")}㎡`;
}

function buildBasicInfo(
  auction: AuctionDetailSource,
  listDetails: AuctionListDetailRow[],
  caseDetail: CaseDetail,
  rights: string,
  meta: Record<string, string>,
): AuctionBasicInfoView {
  const locations =
    listDetails.length > 0
      ? listDetails.map((r) => ({
          no: r.no,
          kindLabel: r.listKind ? `(${r.listKind})` : "",
          address: firstAddressFromDetail(r.detail) || r.detail.split("\n")[0] || "",
        }))
      : (
          [
            auction.address
              ? { no: 1, kindLabel: "", address: repairUtf8Mojibake(auction.address) }
              : null,
            auction.address2
              ? { no: 2, kindLabel: "", address: repairUtf8Mojibake(auction.address2) }
              : null,
          ] as const
        ).filter(Boolean) as AuctionBasicInfoView["locations"];

  const deptFromCase = caseDetail.basic.dept?.trim() || "";
  const court = repairUtf8Mojibake(auction.court ?? "") || caseDetail.court || "";
  const dept = deptFromCase
    ? deptFromCase.includes("|")
      ? deptFromCase
      : `${court} | ${deptFromCase}`.replace(/^\s*\|\s*/, "")
    : court;

  const remarks = sectionFromRights(rights, "물건비고");

  return {
    ...emptyBasicInfoView(),
    electronic: false,
    caseNumber: repairUtf8Mojibake(auction.caseNumber),
    itemNo: auction.itemNo ?? null,
    itemType: repairUtf8Mojibake(auction.itemType ?? ""),
    appraisalPrice: auction.appraisalPrice ?? 0,
    minPrice: auction.minPrice ?? 0,
    bidDeposit: auction.bidDeposit ?? 0,
    bidMethod: auction.bidMethod || "기일입찰",
    saleDateLabel: formatSaleDateLabel(auction.saleDate, meta.saleDateLabel || ""),
    remarks,
    locations,
    dept,
    receivedAt: meta.receivedAt || caseDetail.basic.receivedAt || "",
    startedAt: meta.startedAt || caseDetail.basic.startedAt || "",
    dividendDeadline:
      meta.dividendDeadline || caseDetail.dividendDeadlines[0]?.deadline || "",
    claimAmount: auction.claimAmount || caseDetail.basic.claimAmount || 0,
  };
}

/** 사용자 상세 우측 1~6절 데이터 */
export function buildAuctionDetailSections(
  auction: AuctionDetailSource,
): AuctionDetailSections {
  const rights = repairUtf8Mojibake(auction.rightsAnalysis ?? "");
  const meta = parseMeta(rights);
  const caseDetail = loadCaseDetailFromAuction(auction);
  const listDetails = loadListDetailsFromAuction(auction, caseDetail);
  const schedule = scheduleFromRights(rights);
  const statusReport = statusReportFromRights(rights);
  const fromTag = sectionFromRights(rights, "감정요약");
  const fromDesc = repairUtf8Mojibake(auction.description ?? "").trim();
  const appraisalSummary =
    fromTag ||
    (fromDesc && !looksLikeRightsDump(fromDesc) ? fromDesc : "") ||
    "";
  const landRight = sectionFromRights(rights, "대지권");
  const possession =
    sectionFromRights(rights, "점유") ||
    statusReport.possessionRelation ||
    "";

  return {
    basic: buildBasicInfo(auction, listDetails, caseDetail, rights, meta),
    schedule,
    listDetails,
    appraisalSummary,
    caseDetail,
    statusReport,
    chips: {
      exclusiveArea: fmtArea(auction.buildingArea),
      landRight: landRight || "—",
      possession: possession || "—",
    },
  };
}
