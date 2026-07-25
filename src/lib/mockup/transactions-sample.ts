/** 실거래가분석 목업 샘플 — 운영 적용 전 UI 검증용 */

export type TxPropertyType =
  | "APT"
  | "OFFICETEL"
  | "TOWNHOUSE"
  | "SINGLE_HOUSE"
  | "COMMERCIAL"
  | "FACTORY"
  | "LAND";

export type TxDealType = "SALE" | "RENT" | "RIGHT";

export type SampleTransaction = {
  id: string;
  propertyType: TxPropertyType;
  dealType: TxDealType;
  sido: string;
  sigungu: string;
  eupmyeondong: string;
  lawdCd: string;
  regionLabel: string;
  dealDate: string;
  buildingName: string;
  jibun: string;
  roadName?: string;
  floor: number | null;
  exclArea: number;
  landArea?: number;
  dealAmount: number;
  deposit: number;
  monthlyRent: number;
  buildYear: number | null;
  dealingGbn: string;
  cancelled: boolean;
  /** 유형별 확장 표시용 */
  contractTerm?: string;
  useRRRight?: string;
  buildingUse?: string;
  jimok?: string;
  landUse?: string;
  aptDong?: string;
  rgstDate?: string;
  plotAr?: number;
};

export const TX_PROPERTY_TABS: { id: TxPropertyType; label: string }[] = [
  { id: "APT", label: "아파트" },
  { id: "OFFICETEL", label: "오피스텔" },
  { id: "TOWNHOUSE", label: "연립다세대" },
  { id: "SINGLE_HOUSE", label: "단독/다가구" },
  { id: "COMMERCIAL", label: "상업업무용" },
  { id: "FACTORY", label: "공장창고" },
  { id: "LAND", label: "토지" },
];

export const TX_DEAL_TYPES: { id: TxDealType; label: string }[] = [
  { id: "SALE", label: "매매" },
  { id: "RENT", label: "전월세" },
  { id: "RIGHT", label: "분양권/입주권" },
];

/** 전국 시·도 → 시군구 → 읍면동 (목업 트리 · 대표 샘플) */
export type RegionNode = {
  code: string;
  name: string;
  children?: RegionNode[];
};

export const TX_REGION_TREE: RegionNode[] = [
  {
    code: "11",
    name: "서울특별시",
    children: [
      {
        code: "11680",
        name: "강남구",
        children: [
          { code: "11680101", name: "역삼동" },
          { code: "11680103", name: "개포동" },
          { code: "11680105", name: "청담동" },
        ],
      },
      {
        code: "11650",
        name: "서초구",
        children: [
          { code: "11650101", name: "방배동" },
          { code: "11650108", name: "반포동" },
        ],
      },
      {
        code: "11710",
        name: "송파구",
        children: [
          { code: "11710101", name: "잠실동" },
          { code: "11710107", name: "문정동" },
        ],
      },
    ],
  },
  {
    code: "41",
    name: "경기도",
    children: [
      {
        code: "41135",
        name: "성남시 분당구",
        children: [
          { code: "41135101", name: "정자동" },
          { code: "41135107", name: "수내동" },
        ],
      },
      {
        code: "41111",
        name: "수원시 장안구",
        children: [
          { code: "41111101", name: "파장동" },
          { code: "41111103", name: "정자동" },
        ],
      },
    ],
  },
  {
    code: "28",
    name: "인천광역시",
    children: [
      {
        code: "28185",
        name: "연수구",
        children: [
          { code: "28185101", name: "송도동" },
          { code: "28185105", name: "연수동" },
        ],
      },
    ],
  },
  {
    code: "26",
    name: "부산광역시",
    children: [
      {
        code: "26350",
        name: "해운대구",
        children: [
          { code: "26350101", name: "우동" },
          { code: "26350105", name: "좌동" },
        ],
      },
    ],
  },
  {
    code: "27",
    name: "대구광역시",
    children: [
      {
        code: "27200",
        name: "수성구",
        children: [{ code: "27200101", name: "범어동" }],
      },
    ],
  },
  {
    code: "29",
    name: "광주광역시",
    children: [
      {
        code: "29170",
        name: "광산구",
        children: [{ code: "29170101", name: "수완동" }],
      },
    ],
  },
  {
    code: "30",
    name: "대전광역시",
    children: [
      {
        code: "30200",
        name: "유성구",
        children: [{ code: "30200101", name: "봉명동" }],
      },
    ],
  },
  {
    code: "31",
    name: "울산광역시",
    children: [
      {
        code: "31140",
        name: "남구",
        children: [{ code: "31140101", name: "삼산동" }],
      },
    ],
  },
  {
    code: "36",
    name: "세종특별자치시",
    children: [
      {
        code: "36110",
        name: "세종시",
        children: [
          { code: "36110101", name: "한솔동" },
          { code: "36110107", name: "도담동" },
        ],
      },
    ],
  },
  {
    code: "42",
    name: "강원특별자치도",
    children: [
      {
        code: "42110",
        name: "춘천시",
        children: [{ code: "42110101", name: "효자동" }],
      },
    ],
  },
  {
    code: "43",
    name: "충청북도",
    children: [
      {
        code: "43111",
        name: "청주시 상당구",
        children: [{ code: "43111101", name: "영동" }],
      },
    ],
  },
  {
    code: "44",
    name: "충청남도",
    children: [
      {
        code: "44800",
        name: "홍성군",
        children: [
          { code: "44800253", name: "홍북읍" },
          { code: "44800252", name: "홍성읍" },
          { code: "44800310", name: "갈산면" },
        ],
      },
      {
        code: "44810",
        name: "예산군",
        children: [
          { code: "44810250", name: "예산읍" },
          { code: "44810310", name: "신암면" },
        ],
      },
      {
        code: "44130",
        name: "천안시",
        children: [
          { code: "44133101", name: "불당동" },
          { code: "44131101", name: "성정동" },
        ],
      },
      {
        code: "44200",
        name: "아산시",
        children: [{ code: "44200101", name: "배방읍" }],
      },
    ],
  },
  {
    code: "45",
    name: "전북특별자치도",
    children: [
      {
        code: "45111",
        name: "전주시 완산구",
        children: [{ code: "45111101", name: "중앙동" }],
      },
    ],
  },
  {
    code: "46",
    name: "전라남도",
    children: [
      {
        code: "46110",
        name: "목포시",
        children: [{ code: "46110101", name: "용당동" }],
      },
    ],
  },
  {
    code: "47",
    name: "경상북도",
    children: [
      {
        code: "47111",
        name: "포항시 남구",
        children: [{ code: "47111101", name: "대잠동" }],
      },
    ],
  },
  {
    code: "48",
    name: "경상남도",
    children: [
      {
        code: "48121",
        name: "창원시 성산구",
        children: [{ code: "48121101", name: "상남동" }],
      },
    ],
  },
  {
    code: "50",
    name: "제주특별자치도",
    children: [
      {
        code: "50110",
        name: "제주시",
        children: [{ code: "50110101", name: "연동" }],
      },
    ],
  },
];

export type DetailColumn = {
  key: string;
  label: string;
  get: (r: SampleTransaction) => string;
};

/** 부동산 종류·거래유형별 상세 컬럼 (다름을 목업으로 확인) */
export function getDetailColumns(
  propertyType: TxPropertyType,
  dealType: TxDealType,
): DetailColumn[] {
  const base: DetailColumn[] = [
    { key: "dealDate", label: "거래일", get: (r) => r.dealDate },
    {
      key: "region",
      label: "지역",
      get: (r) => `${r.sido} ${r.sigungu} ${r.eupmyeondong}`,
    },
  ];

  const nameCol: DetailColumn = {
    key: "name",
    label:
      propertyType === "LAND"
        ? "지번"
        : propertyType === "SINGLE_HOUSE"
          ? "주택유형/지번"
          : "물건명",
    get: (r) =>
      propertyType === "LAND"
        ? r.jibun
        : `${r.buildingName}${r.jibun ? ` (${r.jibun})` : ""}`,
  };

  const floorCol: DetailColumn = {
    key: "floor",
    label: "층",
    get: (r) => (r.floor != null ? `${r.floor}` : "—"),
  };

  const areaCol: DetailColumn = {
    key: "area",
    label:
      propertyType === "LAND"
        ? "거래면적(㎡)"
        : propertyType === "SINGLE_HOUSE" && dealType === "SALE"
          ? "연면적(㎡)"
          : propertyType === "COMMERCIAL" || propertyType === "FACTORY"
            ? "건물/임대면적(㎡)"
            : "전용면적(㎡)",
    get: (r) => String(r.exclArea),
  };

  const saleAmt: DetailColumn = {
    key: "amount",
    label: "거래금액",
    get: (r) => formatKrwMan(r.dealAmount),
  };
  const rentAmt: DetailColumn = {
    key: "rent",
    label: "보증금 / 월세",
    get: (r) =>
      r.monthlyRent > 0
        ? `${formatKrwMan(r.deposit)} / ${formatKrwMan(r.monthlyRent)}`
        : `전세 ${formatKrwMan(r.deposit)}`,
  };

  const buildYear: DetailColumn = {
    key: "buildYear",
    label: "건축년도",
    get: (r) => (r.buildYear != null ? String(r.buildYear) : "—"),
  };
  const dealing: DetailColumn = {
    key: "dealing",
    label: "거래유형",
    get: (r) => r.dealingGbn,
  };
  const note: DetailColumn = {
    key: "note",
    label: "비고",
    get: (r) => (r.cancelled ? "해제" : "—"),
  };

  if (propertyType === "APT" && dealType === "SALE") {
    return [
      ...base,
      nameCol,
      {
        key: "dong",
        label: "동",
        get: (r) => r.aptDong || "—",
      },
      floorCol,
      areaCol,
      saleAmt,
      buildYear,
      {
        key: "road",
        label: "도로명",
        get: (r) => r.roadName || "—",
      },
      dealing,
      {
        key: "rgst",
        label: "등기일자",
        get: (r) => r.rgstDate || "—",
      },
      note,
    ];
  }

  if (propertyType === "APT" && dealType === "RENT") {
    return [
      ...base,
      nameCol,
      floorCol,
      areaCol,
      rentAmt,
      buildYear,
      {
        key: "term",
        label: "계약기간",
        get: (r) => r.contractTerm || "—",
      },
      {
        key: "rr",
        label: "갱신요구권",
        get: (r) => r.useRRRight || "—",
      },
      note,
    ];
  }

  if (propertyType === "APT" && dealType === "RIGHT") {
    return [
      ...base,
      { key: "name", label: "단지명", get: (r) => r.buildingName },
      floorCol,
      areaCol,
      saleAmt,
      dealing,
      note,
    ];
  }

  if (propertyType === "OFFICETEL") {
    return [
      ...base,
      { key: "name", label: "단지명", get: (r) => r.buildingName },
      floorCol,
      areaCol,
      dealType === "RENT" ? rentAmt : saleAmt,
      buildYear,
      dealing,
      note,
    ];
  }

  if (propertyType === "TOWNHOUSE") {
    return [
      ...base,
      nameCol,
      floorCol,
      areaCol,
      {
        key: "plot",
        label: "대지권(㎡)",
        get: (r) => (r.plotAr != null ? String(r.plotAr) : "—"),
      },
      dealType === "RENT" ? rentAmt : saleAmt,
      buildYear,
      note,
    ];
  }

  if (propertyType === "SINGLE_HOUSE") {
    return [
      ...base,
      nameCol,
      areaCol,
      {
        key: "land",
        label: "대지면적(㎡)",
        get: (r) => (r.landArea != null ? String(r.landArea) : "—"),
      },
      dealType === "RENT" ? rentAmt : saleAmt,
      buildYear,
      note,
    ];
  }

  if (propertyType === "COMMERCIAL" || propertyType === "FACTORY") {
    return [
      ...base,
      nameCol,
      floorCol,
      areaCol,
      {
        key: "use",
        label: "건물용도",
        get: (r) => r.buildingUse || (propertyType === "FACTORY" ? "공장/창고" : "—"),
      },
      dealType === "RENT" ? rentAmt : saleAmt,
      buildYear,
      note,
    ];
  }

  // LAND
  return [
    ...base,
    nameCol,
    areaCol,
    saleAmt,
    {
      key: "jimok",
      label: "지목",
      get: (r) => r.jimok || "—",
    },
    {
      key: "landUse",
      label: "용도지역",
      get: (r) => r.landUse || "—",
    },
    dealing,
    note,
  ];
}

export const TX_SAMPLE_MONTHLY = [
  { month: "2026-01", avgSale: 318, volume: 42 },
  { month: "2026-02", avgSale: 325, volume: 38 },
  { month: "2026-03", avgSale: 331, volume: 51 },
  { month: "2026-04", avgSale: 336, volume: 47 },
  { month: "2026-05", avgSale: 348, volume: 55 },
  { month: "2026-06", avgSale: 362, volume: 49 },
];

export const TX_SAMPLE_SYNC_LOGS = [
  {
    id: "s1",
    at: "2026-07-25 14:20",
    range: "2026-04 ~ 2026-06",
    region: "충남 홍성군",
    types: "아파트·매매/전월세",
    rows: 1284,
    status: "성공" as const,
  },
  {
    id: "s2",
    at: "2026-07-20 09:05",
    range: "2026-01 ~ 2026-03",
    region: "서울 강남구",
    types: "아파트·매매",
    rows: 3421,
    status: "성공" as const,
  },
  {
    id: "s3",
    at: "2026-07-18 22:10",
    range: "2025-10 ~ 2025-12",
    region: "전국(시군구 배치)",
    types: "전체",
    rows: 0,
    status: "목업·미실행" as const,
  },
];

export const TX_SAMPLE_ROWS: SampleTransaction[] = [
  {
    id: "1",
    propertyType: "APT",
    dealType: "SALE",
    sido: "충청남도",
    sigungu: "홍성군",
    eupmyeondong: "홍북읍",
    lawdCd: "44800",
    regionLabel: "충남 홍성군",
    dealDate: "2026-06-12",
    buildingName: "내포신도시 더샵",
    jibun: "신경리 123",
    roadName: "충남대로",
    floor: 12,
    exclArea: 84.92,
    dealAmount: 385_000_000,
    deposit: 0,
    monthlyRent: 0,
    buildYear: 2019,
    dealingGbn: "중개거래",
    cancelled: false,
    aptDong: "101동",
    rgstDate: "2026-07-01",
  },
  {
    id: "2",
    propertyType: "APT",
    dealType: "SALE",
    sido: "충청남도",
    sigungu: "홍성군",
    eupmyeondong: "홍북읍",
    lawdCd: "44800",
    regionLabel: "충남 홍성군",
    dealDate: "2026-05-28",
    buildingName: "내포신도시 더샵",
    jibun: "신경리 123",
    roadName: "충남대로",
    floor: 8,
    exclArea: 74.56,
    dealAmount: 342_000_000,
    deposit: 0,
    monthlyRent: 0,
    buildYear: 2019,
    dealingGbn: "중개거래",
    cancelled: false,
    aptDong: "—",
  },
  {
    id: "3",
    propertyType: "APT",
    dealType: "RENT",
    sido: "충청남도",
    sigungu: "홍성군",
    eupmyeondong: "홍북읍",
    lawdCd: "44800",
    regionLabel: "충남 홍성군",
    dealDate: "2026-06-03",
    buildingName: "내포신도시 더샵",
    jibun: "신경리 123",
    floor: 15,
    exclArea: 84.92,
    dealAmount: 0,
    deposit: 220_000_000,
    monthlyRent: 0,
    buildYear: 2019,
    dealingGbn: "중개거래",
    cancelled: false,
    contractTerm: "2026.06~2028.06",
    useRRRight: "미사용",
  },
  {
    id: "4",
    propertyType: "APT",
    dealType: "RENT",
    sido: "충청남도",
    sigungu: "홍성군",
    eupmyeondong: "홍북읍",
    lawdCd: "44800",
    regionLabel: "충남 홍성군",
    dealDate: "2026-04-18",
    buildingName: "내포힐스테이트",
    jibun: "신경리 88",
    floor: 5,
    exclArea: 59.98,
    dealAmount: 0,
    deposit: 30_000_000,
    monthlyRent: 650_000,
    buildYear: 2017,
    dealingGbn: "직거래",
    cancelled: false,
    contractTerm: "2026.04~2027.04",
    useRRRight: "사용",
  },
  {
    id: "5",
    propertyType: "APT",
    dealType: "RIGHT",
    sido: "충청남도",
    sigungu: "예산군",
    eupmyeondong: "예산읍",
    lawdCd: "44810",
    regionLabel: "충남 예산군",
    dealDate: "2026-05-09",
    buildingName: "예산역 자이",
    jibun: "향천리 **",
    floor: 22,
    exclArea: 84.12,
    dealAmount: 298_000_000,
    deposit: 0,
    monthlyRent: 0,
    buildYear: null,
    dealingGbn: "중개거래",
    cancelled: false,
  },
  {
    id: "6",
    propertyType: "OFFICETEL",
    dealType: "SALE",
    sido: "충청남도",
    sigungu: "홍성군",
    eupmyeondong: "홍북읍",
    lawdCd: "44800",
    regionLabel: "충남 홍성군",
    dealDate: "2026-03-22",
    buildingName: "내포센트럴타워",
    jibun: "신경리 201",
    floor: 9,
    exclArea: 29.4,
    dealAmount: 128_000_000,
    deposit: 0,
    monthlyRent: 0,
    buildYear: 2021,
    dealingGbn: "중개거래",
    cancelled: false,
  },
  {
    id: "7",
    propertyType: "OFFICETEL",
    dealType: "RENT",
    sido: "충청남도",
    sigungu: "홍성군",
    eupmyeondong: "홍북읍",
    lawdCd: "44800",
    regionLabel: "충남 홍성군",
    dealDate: "2026-06-01",
    buildingName: "내포센트럴타워",
    jibun: "신경리 201",
    floor: 11,
    exclArea: 29.4,
    dealAmount: 0,
    deposit: 5_000_000,
    monthlyRent: 480_000,
    buildYear: 2021,
    dealingGbn: "중개거래",
    cancelled: false,
  },
  {
    id: "8",
    propertyType: "TOWNHOUSE",
    dealType: "SALE",
    sido: "충청남도",
    sigungu: "홍성군",
    eupmyeondong: "홍성읍",
    lawdCd: "44800",
    regionLabel: "충남 홍성군",
    dealDate: "2026-02-14",
    buildingName: "홍성빌라 A동",
    jibun: "오관리 45-2",
    floor: 3,
    exclArea: 62.1,
    plotAr: 28.4,
    dealAmount: 165_000_000,
    deposit: 0,
    monthlyRent: 0,
    buildYear: 2008,
    dealingGbn: "중개거래",
    cancelled: false,
  },
  {
    id: "9",
    propertyType: "SINGLE_HOUSE",
    dealType: "SALE",
    sido: "충청남도",
    sigungu: "홍성군",
    eupmyeondong: "홍성읍",
    lawdCd: "44800",
    regionLabel: "충남 홍성군",
    dealDate: "2026-01-30",
    buildingName: "단독주택",
    jibun: "***",
    floor: null,
    exclArea: 112.5,
    landArea: 198.0,
    dealAmount: 210_000_000,
    deposit: 0,
    monthlyRent: 0,
    buildYear: 1995,
    dealingGbn: "직거래",
    cancelled: false,
  },
  {
    id: "10",
    propertyType: "COMMERCIAL",
    dealType: "SALE",
    sido: "충청남도",
    sigungu: "홍성군",
    eupmyeondong: "홍북읍",
    lawdCd: "44800",
    regionLabel: "충남 홍성군",
    dealDate: "2026-04-07",
    buildingName: "내포상가 1호",
    jibun: "신경리 **",
    floor: 1,
    exclArea: 48.2,
    dealAmount: 520_000_000,
    deposit: 0,
    monthlyRent: 0,
    buildYear: 2020,
    dealingGbn: "중개거래",
    cancelled: false,
    buildingUse: "제1종근린생활시설",
  },
  {
    id: "11",
    propertyType: "COMMERCIAL",
    dealType: "RENT",
    sido: "충청남도",
    sigungu: "홍성군",
    eupmyeondong: "홍북읍",
    lawdCd: "44800",
    regionLabel: "충남 홍성군",
    dealDate: "2026-05-20",
    buildingName: "내포상가 1호",
    jibun: "신경리 **",
    floor: 2,
    exclArea: 36.0,
    dealAmount: 0,
    deposit: 50_000_000,
    monthlyRent: 1_200_000,
    buildYear: 2020,
    dealingGbn: "중개거래",
    cancelled: false,
    buildingUse: "제2종근린생활시설",
  },
  {
    id: "12",
    propertyType: "FACTORY",
    dealType: "SALE",
    sido: "충청남도",
    sigungu: "예산군",
    eupmyeondong: "신암면",
    lawdCd: "44810",
    regionLabel: "충남 예산군",
    dealDate: "2026-03-11",
    buildingName: "창고시설",
    jibun: "***",
    floor: null,
    exclArea: 420.0,
    dealAmount: 890_000_000,
    deposit: 0,
    monthlyRent: 0,
    buildYear: 2012,
    dealingGbn: "중개거래",
    cancelled: false,
    buildingUse: "창고시설",
  },
  {
    id: "13",
    propertyType: "LAND",
    dealType: "SALE",
    sido: "충청남도",
    sigungu: "홍성군",
    eupmyeondong: "갈산면",
    lawdCd: "44800",
    regionLabel: "충남 홍성군",
    dealDate: "2026-02-25",
    buildingName: "토지",
    jibun: "***",
    floor: null,
    exclArea: 330.0,
    dealAmount: 145_000_000,
    deposit: 0,
    monthlyRent: 0,
    buildYear: null,
    dealingGbn: "직거래",
    cancelled: false,
    jimok: "전",
    landUse: "계획관리지역",
  },
  {
    id: "14",
    propertyType: "APT",
    dealType: "SALE",
    sido: "충청남도",
    sigungu: "홍성군",
    eupmyeondong: "홍북읍",
    lawdCd: "44800",
    regionLabel: "충남 홍성군",
    dealDate: "2026-06-20",
    buildingName: "내포힐스테이트",
    jibun: "신경리 88",
    floor: 18,
    exclArea: 84.97,
    dealAmount: 401_000_000,
    deposit: 0,
    monthlyRent: 0,
    buildYear: 2017,
    dealingGbn: "중개거래",
    cancelled: true,
  },
  {
    id: "15",
    propertyType: "APT",
    dealType: "SALE",
    sido: "서울특별시",
    sigungu: "강남구",
    eupmyeondong: "역삼동",
    lawdCd: "11680",
    regionLabel: "서울 강남구",
    dealDate: "2026-05-15",
    buildingName: "역삼래미안",
    jibun: "123",
    roadName: "테헤란로",
    floor: 20,
    exclArea: 84.99,
    dealAmount: 1_850_000_000,
    deposit: 0,
    monthlyRent: 0,
    buildYear: 2018,
    dealingGbn: "중개거래",
    cancelled: false,
    aptDong: "102동",
    rgstDate: "2026-06-10",
  },
  {
    id: "16",
    propertyType: "APT",
    dealType: "SALE",
    sido: "경기도",
    sigungu: "성남시 분당구",
    eupmyeondong: "정자동",
    lawdCd: "41135",
    regionLabel: "경기 성남 분당",
    dealDate: "2026-04-02",
    buildingName: "분당더샵",
    jibun: "90",
    floor: 14,
    exclArea: 110.2,
    dealAmount: 1_420_000_000,
    deposit: 0,
    monthlyRent: 0,
    buildYear: 2015,
    dealingGbn: "중개거래",
    cancelled: false,
  },
];

export const TX_PHASE1_CHECKLIST = [
  "메뉴 분리: 실거래가 수집(/admin/transactions/sync) · 조회(/admin/transactions)",
  "연월 범위 + 시도/시군구/읍면동 · 전국 lawd 수집→Supabase",
  "유형·거래유형별 상세 컬럼 · CSV/Excel",
  "3개월 중첩 재수집 · 취소건 플래그",
] as const;

export const TX_PHASE2_TASKS = [
  {
    title: "지도 클러스터 (Kakao/Naver)",
    detail: "실거래 위치 마커 · 클릭 시 히스토리 팝업",
  },
  {
    title: "매물·경매 composite 매칭",
    detail: "도로명·건축년도·면적·지번 부분 키로 시세 연결",
  },
] as const;

export const TX_PHASE3_TASKS = [
  {
    title: "경매 적정가·입찰 가이드",
    detail: "감정가·최저가 대비 실거래 비율·권장 입찰 밴드",
  },
] as const;

export function formatKrwMan(won: number): string {
  if (!won) return "—";
  const man = Math.round(won / 10_000);
  if (man >= 10_000) {
    const eok = man / 10_000;
    return `${eok.toFixed(eok >= 10 ? 1 : 2)}억`;
  }
  return `${man.toLocaleString("ko-KR")}만`;
}

export function formatPyeong(sqm: number): string {
  return (sqm / 3.3058).toFixed(1);
}

export function pricePerSqm(row: SampleTransaction): number | null {
  const amount =
    row.dealType === "RENT"
      ? row.deposit + row.monthlyRent * 100
      : row.dealAmount;
  if (!amount || !row.exclArea) return null;
  return Math.round(amount / row.exclArea);
}

export function ymOptions(fromYear = 2015, toYear = 2026): string[] {
  const out: string[] = [];
  for (let y = toYear; y >= fromYear; y--) {
    for (let m = 12; m >= 1; m--) {
      if (y === toYear && m > 7) continue;
      out.push(`${y}-${String(m).padStart(2, "0")}`);
    }
  }
  return out;
}

/** UI 표시: 2026-01 → 2026.01. */
export function formatYmDot(ym: string): string {
  const [y, m] = ym.split("-");
  if (!y || !m) return ym;
  return `${y}.${m}.`;
}

/** 수집기간 표시: 2023.01. ~ 2026.06. */
export function formatYmRangeDot(startYm: string, endYm: string): string {
  return `${formatYmDot(startYm)} ~ ${formatYmDot(endYm)}`;
}

export function escapeCsvCell(v: string): string {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

/** Excel이 여는 SpreadsheetML (.xls) — 추가 의존성 없음 */
export function buildSpreadsheetMl(
  sheetName: string,
  headers: string[],
  rows: string[][],
): string {
  const cell = (v: string) =>
    `<Cell><Data ss:Type="String">${v
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")}</Data></Cell>`;
  const headerRow = `<Row>${headers.map(cell).join("")}</Row>`;
  const body = rows.map((r) => `<Row>${r.map(cell).join("")}</Row>`).join("");
  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Worksheet ss:Name="${sheetName.slice(0, 31)}">
<Table>${headerRow}${body}</Table>
</Worksheet>
</Workbook>`;
}

/** 수집 커버리지 단위: 시군구 × 유형 × 거래 × 연월 */
export type CoverageCell = {
  lawdCd: string;
  regionLabel: string;
  propertyType: TxPropertyType;
  dealType: TxDealType;
  dealYm: string; // YYYY-MM
  status: "collected" | "missing" | "empty"; // empty = 수집했으나 거래 0건
  rowCount: number;
  lastSyncedAt?: string;
};

/** 목업 초기 커버리지 (홍성·예산·강남 일부만 채워짐 → 갭 시각화) */
export const TX_INITIAL_COVERAGE: CoverageCell[] = [
  // 홍성 아파트 매매: 1~4월 수집, 5~6월 누락
  ...["2026-01", "2026-02", "2026-03", "2026-04"].map((ym, i) => ({
    lawdCd: "44800",
    regionLabel: "충남 홍성군",
    propertyType: "APT" as const,
    dealType: "SALE" as const,
    dealYm: ym,
    status: "collected" as const,
    rowCount: 40 + i * 5,
    lastSyncedAt: "2026-07-20 09:00",
  })),
  ...["2026-05", "2026-06"].map((ym) => ({
    lawdCd: "44800",
    regionLabel: "충남 홍성군",
    propertyType: "APT" as const,
    dealType: "SALE" as const,
    dealYm: ym,
    status: "missing" as const,
    rowCount: 0,
  })),
  // 홍성 아파트 전월세: 1~6월 전부 수집
  ...["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"].map(
    (ym, i) => ({
      lawdCd: "44800",
      regionLabel: "충남 홍성군",
      propertyType: "APT" as const,
      dealType: "RENT" as const,
      dealYm: ym,
      status: (i === 2 ? "empty" : "collected") as CoverageCell["status"],
      rowCount: i === 2 ? 0 : 20 + i,
      lastSyncedAt: "2026-07-20 09:05",
    }),
  ),
  // 예산 아파트 매매: 전부 누락
  ...["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"].map(
    (ym) => ({
      lawdCd: "44810",
      regionLabel: "충남 예산군",
      propertyType: "APT" as const,
      dealType: "SALE" as const,
      dealYm: ym,
      status: "missing" as const,
      rowCount: 0,
    }),
  ),
  // 강남 아파트 매매: 홀수 달만
  ...["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"].map(
    (ym, i) => ({
      lawdCd: "11680",
      regionLabel: "서울 강남구",
      propertyType: "APT" as const,
      dealType: "SALE" as const,
      dealYm: ym,
      status: (i % 2 === 0 ? "collected" : "missing") as CoverageCell["status"],
      rowCount: i % 2 === 0 ? 120 + i * 10 : 0,
      lastSyncedAt: i % 2 === 0 ? "2026-07-18 22:00" : undefined,
    }),
  ),
  // 홍성 오피스텔 매매: 일부
  ...["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"].map(
    (ym, i) => ({
      lawdCd: "44800",
      regionLabel: "충남 홍성군",
      propertyType: "OFFICETEL" as const,
      dealType: "SALE" as const,
      dealYm: ym,
      status: (i < 3 ? "collected" : "missing") as CoverageCell["status"],
      rowCount: i < 3 ? 8 + i : 0,
      lastSyncedAt: i < 3 ? "2026-07-15 11:00" : undefined,
    }),
  ),
];

export function listYmBetween(startYm: string, endYm: string): string[] {
  const out: string[] = [];
  let [y, m] = startYm.split("-").map(Number);
  const [ey, em] = endYm.split("-").map(Number);
  if (y * 100 + m > ey * 100 + em) return out;
  while (y < ey || (y === ey && m <= em)) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return out;
}

export function coverageKey(
  lawdCd: string,
  propertyType: string,
  dealType: string,
  dealYm: string,
): string {
  return `${lawdCd}|${propertyType}|${dealType}|${dealYm}`;
}

export type CoverageSummaryRow = {
  lawdCd: string;
  regionLabel: string;
  propertyType: TxPropertyType;
  dealType: TxDealType;
  collectedMonths: string[];
  missingMonths: string[];
  emptyMonths: string[];
  totalRows: number;
  coveragePct: number;
};

export function buildCoverageSummary(
  cells: CoverageCell[],
  startYm: string,
  endYm: string,
  lawdCds: string[] | null,
  propertyTypes: TxPropertyType[],
  dealTypes: TxDealType[],
): CoverageSummaryRow[] {
  const months = listYmBetween(startYm, endYm);
  const map = new Map(cells.map((c) => [coverageKey(c.lawdCd, c.propertyType, c.dealType, c.dealYm), c]));

  // 대상 시군구: 필터된 lawd 또는 샘플에 등장하는 코드
  const regions = new Map<string, string>();
  for (const c of cells) {
    if (lawdCds && lawdCds.length > 0 && !lawdCds.includes(c.lawdCd)) continue;
    regions.set(c.lawdCd, c.regionLabel);
  }
  // 필터 시군구가 커버리지에 없어도 행 생성
  if (lawdCds) {
    for (const cd of lawdCds) {
      if (!regions.has(cd)) {
        const fromTree = findRegionLabel(cd);
        regions.set(cd, fromTree);
      }
    }
  }

  const rows: CoverageSummaryRow[] = [];
  for (const [lawdCd, regionLabel] of regions) {
    for (const propertyType of propertyTypes) {
      for (const dealType of dealTypes) {
        if (dealType === "RIGHT" && propertyType !== "APT") continue;
        const collectedMonths: string[] = [];
        const missingMonths: string[] = [];
        const emptyMonths: string[] = [];
        let totalRows = 0;
        for (const ym of months) {
          const cell = map.get(coverageKey(lawdCd, propertyType, dealType, ym));
          if (!cell || cell.status === "missing") {
            missingMonths.push(ym);
          } else if (cell.status === "empty") {
            emptyMonths.push(ym);
            collectedMonths.push(ym);
          } else {
            collectedMonths.push(ym);
            totalRows += cell.rowCount;
          }
        }
        const covered = collectedMonths.length;
        const coveragePct =
          months.length === 0 ? 0 : Math.round((covered / months.length) * 100);
        rows.push({
          lawdCd,
          regionLabel,
          propertyType,
          dealType,
          collectedMonths,
          missingMonths,
          emptyMonths,
          totalRows,
          coveragePct,
        });
      }
    }
  }
  return rows.sort((a, b) => a.regionLabel.localeCompare(b.regionLabel, "ko"));
}

function findRegionLabel(lawdCd: string): string {
  for (const sido of TX_REGION_TREE) {
    for (const sgg of sido.children ?? []) {
      if (sgg.code === lawdCd) return `${sido.name.replace(/(특별시|광역시|특별자치시|특별자치도|도)$/, "")} ${sgg.name}`;
    }
  }
  return lawdCd;
}

export function propertyLabel(id: TxPropertyType): string {
  return TX_PROPERTY_TABS.find((t) => t.id === id)?.label ?? id;
}

export function dealLabel(id: TxDealType): string {
  return TX_DEAL_TYPES.find((t) => t.id === id)?.label ?? id;
}
