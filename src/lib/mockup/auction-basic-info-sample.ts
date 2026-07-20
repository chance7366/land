/**
 * 법원 사건검색 결과 「물건기본정보」 샘플 (목업 전용)
 */
import type { AuctionBasicInfoView } from "@/lib/auction-basic-info";

export type { AuctionBasicInfoView };
export { formatWon } from "@/lib/auction-basic-info";

export type BasicInfoScheduleRow = {
  date: string;
  kind: string;
  minPrice: number | null;
  result: string;
};

export type AuctionBasicInfoSample = AuctionBasicInfoView & {
  id: string;
  label: string;
  schedule: BasicInfoScheduleRow[];
};

/** 아파트 · 목록 1건 */
export const SAMPLE_APT_15044: AuctionBasicInfoSample = {
  id: "apt-15044",
  label: "아파트 · 단건",
  electronic: true,
  caseNumber: "2026타경15044",
  itemNo: 1,
  itemType: "아파트",
  appraisalPrice: 198_000_000,
  minPrice: 138_600_000,
  bidDeposit: 13_860_000,
  bidMethod: "기일입찰",
  saleDateLabel: "2026.07.28 10:00 경매법정",
  remarks: "-아파트로 이용중임",
  locations: [
    {
      no: 1,
      kindLabel: "(아파트)",
      address:
        "충청남도 홍성군 홍북읍 신경리 1204 엘에이치스타힐스 103동 5층501호",
    },
  ],
  dept: "대전지방법원 홍성지원 | 경매5계",
  receivedAt: "2026.01.20",
  startedAt: "2026.01.21",
  dividendDeadline: "2026.04.13",
  claimAmount: 285_569_293,
  schedule: [
    { date: "2026.06.23", kind: "매각기일", minPrice: 198_000_000, result: "유찰" },
    { date: "2026.07.28", kind: "매각기일", minPrice: 138_600_000, result: "" },
    { date: "2026.08.04", kind: "매각결정기일", minPrice: null, result: "" },
  ],
};

/** 전답 · 단건 */
export const SAMPLE_LAND_1111: AuctionBasicInfoSample = {
  id: "land-1111",
  label: "전답 · 단건",
  electronic: false,
  caseNumber: "2025타경1111",
  itemNo: 1,
  itemType: "전답",
  appraisalPrice: 154_660_000,
  minPrice: 75_783_000,
  bidDeposit: 7_578_300,
  bidMethod: "기일입찰",
  saleDateLabel: "2026.07.21 10:00 경매법정",
  remarks:
    "-부정형 완경사지로 '답'으로 이용중이며, 도로가 개설되어 있음\n-농지취득자격증명원 제출요함(미제출시 보증금 미반환)",
  locations: [
    {
      no: 1,
      kindLabel: "(전)",
      address: "충청남도 홍성군 금마면 부평리 592",
    },
  ],
  dept: "대전지방법원 홍성지원 | 경매3계",
  receivedAt: "2025.07.25",
  startedAt: "2025.07.28",
  dividendDeadline: "2025.10.13",
  claimAmount: 79_722_065,
  schedule: [
    { date: "2026.05.12", kind: "매각기일", minPrice: 154_660_000, result: "유찰" },
    { date: "2026.06.16", kind: "매각기일", minPrice: 108_262_000, result: "유찰" },
    { date: "2026.07.21", kind: "매각기일", minPrice: 75_783_000, result: "" },
  ],
};

/** 근린시설 · 단건 */
export const SAMPLE_RETAIL_15834: AuctionBasicInfoSample = {
  id: "retail-15834",
  label: "근린시설 · 단건",
  electronic: true,
  caseNumber: "2025타경15834",
  itemNo: 1,
  itemType: "근린시설",
  appraisalPrice: 273_000_000,
  minPrice: 93_639_000,
  bidDeposit: 9_363_900,
  bidMethod: "기일입찰",
  saleDateLabel: "2026.07.21 10:00 경매법정",
  remarks:
    "- 본건은 호별로 구분등기된 상태이나, 현황은 501호~503호 내부적으로 일괄하여 사무실로 이용중임",
  locations: [
    {
      no: 1,
      kindLabel: "(업무시설)",
      address:
        "충청남도 홍성군 홍북읍 신경리 897 아르페온2차 5층502호",
    },
  ],
  dept: "대전지방법원 홍성지원 | 경매3계",
  receivedAt: "2025.07.02",
  startedAt: "2025.07.03",
  dividendDeadline: "2025.09.22",
  claimAmount: 303_273_413,
  schedule: [
    { date: "2026.06.16", kind: "매각기일", minPrice: 133_770_000, result: "유찰" },
    { date: "2026.07.21", kind: "매각기일", minPrice: 93_639_000, result: "" },
  ],
};

/** 대지+건물 등 · 목록 다건 */
export const SAMPLE_MULTI_15730: AuctionBasicInfoSample = {
  id: "multi-15730",
  label: "대지·건물 · 다건",
  electronic: true,
  caseNumber: "2025타경15730",
  itemNo: 1,
  itemType: "대지",
  appraisalPrice: 20_953_710,
  minPrice: 14_668_000,
  bidDeposit: 1_466_800,
  bidMethod: "기일입찰",
  saleDateLabel: "2026.07.21 10:00 경매법정",
  remarks: "- 일괄매각\n- 지분매각, 공유자우선매수는 1회에 한함",
  locations: [
    {
      no: 1,
      kindLabel: "(단독주택)",
      address: "충청남도 홍성군 광천읍 신진리 571-7 주1동",
    },
    {
      no: 2,
      kindLabel: "(대지)",
      address: "충청남도 홍성군 광천읍 신진리 571-7",
    },
    {
      no: 4,
      kindLabel: "(전)",
      address: "충청남도 홍성군 광천읍 신진리 571-6",
    },
  ],
  dept: "대전지방법원 홍성지원 | 경매3계",
  receivedAt: "2025.05.14",
  startedAt: "2025.05.15",
  dividendDeadline: "2025.08.04",
  claimAmount: 72_567_950,
  schedule: [
    { date: "2026.06.16", kind: "매각기일", minPrice: 20_953_710, result: "유찰" },
    { date: "2026.07.21", kind: "매각기일", minPrice: 14_668_000, result: "" },
  ],
};

/** 기타 · 목록 다건 (대규모) */
export const SAMPLE_MULTI_21795: AuctionBasicInfoSample = {
  id: "multi-21795",
  label: "기타 · 다건",
  electronic: true,
  caseNumber: "2024타경21795",
  itemNo: 1,
  itemType: "기타",
  appraisalPrice: 3_255_990_000,
  minPrice: 781_764_000,
  bidDeposit: 78_176_400,
  bidMethod: "기일입찰",
  saleDateLabel: "2026.07.28 10:00 경매법정",
  remarks:
    "- 제시외 건물 포함 여부 확인\n- 건축물대장 면적과 현황 차이 있음\n- 내부시설 현황 별도 확인 필요",
  locations: [
    {
      no: 1,
      kindLabel: "(토지)",
      address: "충청남도 홍성군 홍성읍 대교리 651",
    },
    {
      no: 2,
      kindLabel: "(토지)",
      address: "충청남도 홍성군 홍성읍 대교리 651-1",
    },
    {
      no: 3,
      kindLabel: "(건물)",
      address: "충청남도 홍성군 홍성읍 대교리 651 일원",
    },
  ],
  dept: "대전지방법원 홍성지원 | 경매5계",
  receivedAt: "2024.12.03",
  startedAt: "2024.12.05",
  dividendDeadline: "2025.02.25",
  claimAmount: 2_178_057_323,
  schedule: [
    { date: "2026.06.23", kind: "매각기일", minPrice: 977_205_000, result: "유찰" },
    { date: "2026.07.28", kind: "매각기일", minPrice: 781_764_000, result: "" },
  ],
};

export const BASIC_INFO_SAMPLES: AuctionBasicInfoSample[] = [
  SAMPLE_APT_15044,
  SAMPLE_LAND_1111,
  SAMPLE_RETAIL_15834,
  SAMPLE_MULTI_15730,
  SAMPLE_MULTI_21795,
];
