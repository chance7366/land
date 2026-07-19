/**
 * 법원 사건상세조회 샘플 — 홍성지원 2026타경15044 (목업·픽스처용)
 */
import type { CaseDetail } from "@/lib/auction-case-detail";

export type { CaseDetail };
export { formatWon } from "@/lib/auction-case-detail";

export const HS_15044_CASE_DETAIL: CaseDetail = {
  available: true,
  court: "홍성지원",
  basic: {
    caseNumber: "2026타경15044",
    caseName: "부동산강제경매",
    receivedAt: "2026.01.20",
    startedAt: "2026.01.21",
    dept: "경매5계 · 041-640-3234",
    claimAmount: 285_569_293,
    appealStay: "",
    finalResult: "미종국",
    finalDate: "",
  },
  dividendDeadlines: [
    {
      listNo: 1,
      address:
        "충청남도 홍성군 홍북읍 신경리 1204 엘에이치스타힐스, 103동 5층 501호",
      deadline: "2026.04.13",
    },
  ],
  appeals: [],
  relatedCases: [
    {
      court: "대전지방법원",
      caseNumber: "2025차전32658",
      kind: "지급명령",
    },
  ],
  item: {
    itemNo: 1,
    itemType: "아파트",
    appraisalPrice: 198_000_000,
    minPrice: 138_600_000,
    bidDeposit: 13_860_000,
    remarks: "아파트로 이용중임",
    status: "매각공고",
    saleDateLabel: "2026.07.28",
    recentResult: "2026.06.23 유찰",
  },
  lists: [
    {
      no: 1,
      listKind: "집합건물",
      address:
        "충청남도 홍성군 홍북읍 신경리 1204 엘에이치스타힐스 103동 5층501호",
      detail: "미종국",
    },
  ],
  parties: [
    { no: 1, role: "채권자", name: "주OOOOOOO" },
    { no: 2, role: "채무자겸소유자", name: "김OO" },
    { no: 3, role: "임차인", name: "이OO" },
    { no: 4, role: "교부권자", name: "홍성군" },
    { no: 5, role: "주택임차권자", name: "이OO" },
  ],
  docProcess: [
    { receivedAt: "2026.01.22", detail: "등기소 대OOOOO OOOO OOO 등기필증 제출", result: "" },
    { receivedAt: "2026.02.10", detail: "기타 김OO 현황조사보고서 제출", result: "" },
    {
      receivedAt: "2026.02.11",
      detail: "임차인 이OO 권리신고 및 배당요구신청서(주택임대차) 제출",
      result: "",
    },
    { receivedAt: "2026.02.12", detail: "기타 차OO 감정평가서 제출", result: "" },
    { receivedAt: "2026.02.13", detail: "감정인 (주)OOOOOO OO 감정평가서 제출", result: "" },
  ],
  services: [
    {
      servedAt: "2026.01.29",
      detail: "주무관서 국OOOOOO OOOO 최고서 발송",
      result: "2026.01.30 송달간주",
    },
    {
      servedAt: "2026.01.29",
      detail: "채무자겸소유자 김OO 개시결정정본 발송",
      result: "2026.02.04 폐문부재",
    },
    {
      servedAt: "2026.01.29",
      detail: "채권자대리인 지O 개시결정정본 발송",
      result: "2026.01.29 도달",
    },
    {
      servedAt: "2026.06.02",
      detail: "임차권자 이OO 매각기일 및 매각결정기일통지서 발송",
      result: "2026.06.04 송달간주",
    },
  ],
};

/** 등록용 요약 필드 목업 상태 */
export type CaseDetailSummaryFields = {
  exclusiveArea: string;
  landRightDenom: string;
  landRightNumer: string;
  possessionNote: string;
  leaseNote: string;
  assumeRightsNote: string;
};

export const HS_15044_SUMMARY: CaseDetailSummaryFields = {
  exclusiveArea: "84.92",
  landRightDenom: "24561.3",
  landRightNumer: "48.215",
  possessionNote: "임차인(별지)점유",
  leaseNote: "임차인 1명 · 보증 500만 / 월세 55만",
  assumeRightsNote: "명세서·현황조사서·권리신고 확인",
};
