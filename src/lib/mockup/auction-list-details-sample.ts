/**
 * 법원 PGJ151F00 「목록내역」 샘플
 * 소스: #mf_wfm_mainFrame_grp_lstDtsLimtMin
 */

import type { AuctionListDetailRow } from "@/lib/auction-list-details";

export type { AuctionListDetailRow };

export type AuctionListDetailsSample = {
  id: string;
  label: string;
  caseNumber: string;
  itemType: string;
  hint: string;
  rows: AuctionListDetailRow[];
};

export const LIST_DETAILS_SAMPLES: AuctionListDetailsSample[] = [
  {
    id: "multi-land-building",
    label: "토지2 + 건물",
    caseNumber: "2025타경····",
    itemType: "건물",
    hint: "목록 3건 · 건물 층별면적·제시외 포함",
    rows: [
      { no: 1, listKind: "토지", detail: "대 870.4㎡" },
      { no: 2, listKind: "토지", detail: "대 455.6㎡" },
      {
        no: 3,
        listKind: "건물",
        detail: [
          "충청남도 홍성군 홍성읍 대교리 651",
          "충청남도 홍성군 홍성읍 대교리 665",
          "충청남도 홍성군 홍성읍 의사로72번길 18",
          "철근콘크리트구조 슬래브지붕 6층 제1·2종근린생활시설 및 단독주택, 문화및집회시설",
          "지하 178.5㎡",
          "1층 178.5㎡",
          "2층 178.5㎡",
          "3층 178.5㎡",
          "4층 178.5㎡",
          "5층 178.5㎡",
          "6층 178.5㎡",
          "옥탑 12.4㎡",
          "제시외",
          "1. 출입구(포치) 샤시조 2.4㎡",
          "2. 주방 판넬조 47.8㎡",
        ].join("\n"),
      },
    ],
  },
  {
    id: "building-land-share",
    label: "건물 + 토지(지분)",
    caseNumber: "2025타경····",
    itemType: "건물",
    hint: "목록 3건 · 매각지분 표기",
    rows: [
      {
        no: 1,
        listKind: "건물",
        detail: [
          "충청남도 홍성군 광천읍 신진리 571-7",
          "주1동",
          "위지상",
          "블록구조 기타(전통기와형칼라강판)지붕 단층 단독주택",
          "1층 108.82㎡",
          "매각지분 : 소유자 양선경 지분 9분의 1 전부",
        ].join("\n"),
      },
      {
        no: 2,
        listKind: "토지",
        detail: ["대 328㎡", "매각지분 : 소유자 양선경 지분 9분의 1 전부"].join("\n"),
      },
      {
        no: 4,
        listKind: "토지",
        detail: ["전 65㎡", "매각지분 : 소유자 양선경 지분 9분의 1 전부"].join("\n"),
      },
    ],
  },
  {
    id: "condo-office",
    label: "집합건물 1건",
    caseNumber: "2025타경····",
    itemType: "오피스텔",
    hint: "목록 1건 · 1동·전유·대지권",
    rows: [
      {
        no: 1,
        listKind: "집합건물",
        detail: [
          "[1동의 건물의 표시]",
          "충청남도 홍성군 홍북읍 신경리 897",
          "아르페온2차",
          "철근콘크리트구조 (철근)콘크리트평지붕 7층 업무시설(사무소) 제1.2종근린생활시설",
          "지하1층 1,245.32㎡",
          "1층 412.18㎡",
          "2층 398.50㎡",
          "3층 398.50㎡",
          "4층 398.50㎡",
          "5층 398.50㎡",
          "6층 398.50㎡",
          "7층 398.50㎡",
          "옥탑1층 42.10㎡",
          "",
          "[전유부분의 건물의 표시]",
          "건물의 번호 : 5층502호",
          "구 조 : 철근콘크리트구조 104.8㎡",
          "",
          "[대지권의 목적인 토지의 표시]",
          "토지의 표시 : 1. 충청남도 홍성군 홍북읍 신경리 897 대 7284㎡",
          "대지권의 종류: 1. 소유권",
          "대지권의 비율: 1. 7284 분의 89.751",
        ].join("\n"),
      },
    ],
  },
  {
    id: "land-only",
    label: "토지 1건",
    caseNumber: "2025타경····",
    itemType: "토지",
    hint: "목록 1건 · 단순 지목·면적",
    rows: [{ no: 1, listKind: "토지", detail: "전 2812㎡" }],
  },
  {
    id: "land-exclude",
    label: "토지 + 제시외",
    caseNumber: "2025타경····",
    itemType: "토지",
    hint: "목록 1건 · 제시외 창고",
    rows: [
      {
        no: 1,
        listKind: "토지",
        detail: [
          "답 1000㎡",
          "제시외",
          "1.(용도)창고(구조)판넬조(면적)175㎡",
          "2.(용도)창고(구조)철파이프조(면적)6.2㎡",
        ].join("\n"),
      },
    ],
  },
  {
    id: "condo-apt",
    label: "아파트 집합건물",
    caseNumber: "2025타경····",
    itemType: "아파트",
    hint: "목록 1건 · 동·호·대지권비율",
    rows: [
      {
        no: 1,
        listKind: "집합건물",
        detail: [
          "[1동의 건물의 표시]",
          "충청남도 홍성군 홍북읍 신경리 1204",
          "엘에이치스타힐스",
          "철근콘크리트구조 철근콘크리트평지붕 18층 공동주택(아파트)",
          "지하2층 12,450.20㎡",
          "지하1층 8,320.15㎡",
          "1층~18층 각 444.8㎡",
          "",
          "[전유부분의 건물의 표시]",
          "건물의 번호 : 103동 5층 501호",
          "구 조 : 철근콘크리트구조 84.92㎡",
          "",
          "[대지권의 목적인 토지의 표시]",
          "토지의 표시 : 1. 충청남도 홍성군 홍북읍 신경리 1204 대 108,764.8㎡",
          "대지권의 종류: 1. 소유권",
          "대지권의 비율: 1. 108764.8 분의 52.6499",
        ].join("\n"),
      },
    ],
  },
];
