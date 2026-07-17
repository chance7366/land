/** Sample fixtures from courtauction.go.kr lookups. Cached snapshots — not live-fetched at runtime. */

export type FormGroup = "UNIT" | "HOUSE" | "LAND";

export type DocSlot = {
  type: "saleSpec" | "appraisal" | "status";
  label: string;
  name: string;
  status: "attached" | "unavailable" | "pending";
};

export type ParcelRow = {
  no: number;
  listKind: string;
  address: string;
  detail: string;
};

export type ScheduleRow = {
  date: string;
  kind: string;
  place: string;
  minPrice: number | null;
  result: string;
};

export type CourtAuctionFixture = {
  id: string;
  court: string;
  caseYear: string;
  caseSerial: string;
  caseNumber: string;
  itemNo: number;
  siblingItems?: { itemNo: number; label: string; fixtureId: string }[];
  formGroup: FormGroup;
  itemType: string;
  auctionType: string;
  title: string;
  region: string;
  parcels: ParcelRow[];
  exclusiveArea?: number;
  landShareDenom?: number;
  landShareNumer?: number;
  landArea?: number;
  buildingArea?: number;
  appraisalPrice: number;
  minPrice: number;
  bidDeposit: number;
  claimAmount: number;
  bidMethod: string;
  saleDate: string;
  saleDateLabel: string;
  receivedAt: string;
  startedAt: string;
  dividendDeadline: string;
  remarks: string;
  appraisalSummary: string;
  schedule: ScheduleRow[];
  documents: DocSlot[];
  possessionNote: string;
  leaseNote: string;
  assumeRightsNote: string;
  saleShare?: string;
};

const DOCS_UNIT: DocSlot[] = [
  { type: "saleSpec", label: "매각물건명세서", name: "매각물건명세서.pdf", status: "attached" },
  { type: "appraisal", label: "감정평가서", name: "감정평가서.pdf", status: "attached" },
  { type: "status", label: "현황조사서", name: "", status: "unavailable" },
];

const DOCS_LAND_HOUSE: DocSlot[] = [
  { type: "saleSpec", label: "매각물건명세서", name: "매각물건명세서.pdf", status: "attached" },
  { type: "appraisal", label: "감정평가서", name: "감정평가서.pdf", status: "attached" },
  { type: "status", label: "현황조사서", name: "현황조사서.pdf", status: "attached" },
];

/** courtauction.go.kr 경매사건검색 법원 select (2026-07 기준 60곳, 가나다순) */
export const COURT_OPTIONS = [
  "강릉지원",
  "거창지원",
  "경주지원",
  "고양지원",
  "공주지원",
  "광주지방법원",
  "군산지원",
  "김천지원",
  "남양주지원",
  "남원지원",
  "논산지원",
  "대구서부지원",
  "대구지방법원",
  "대전지방법원",
  "마산지원",
  "목포지원",
  "밀양지원",
  "부산동부지원",
  "부산서부지원",
  "부산지방법원",
  "부천지원",
  "상주지원",
  "서산지원",
  "서울남부지방법원",
  "서울동부지방법원",
  "서울북부지방법원",
  "서울서부지방법원",
  "서울중앙지방법원",
  "성남지원",
  "속초지원",
  "수원지방법원",
  "순천지원",
  "안동지원",
  "안산지원",
  "안양지원",
  "여주지원",
  "영덕지원",
  "영동지원",
  "영월지원",
  "울산지방법원",
  "원주지원",
  "의성지원",
  "의정부지방법원",
  "인천지방법원",
  "장흥지원",
  "전주지방법원",
  "정읍지원",
  "제주지방법원",
  "제천지원",
  "진주지원",
  "창원지방법원",
  "천안지원",
  "청주지방법원",
  "춘천지방법원",
  "충주지원",
  "통영지원",
  "평택지원",
  "포항지원",
  "해남지원",
  "홍성지원",
] as const;

export const FIXTURES: CourtAuctionFixture[] = [
  {
    id: "hs-15803-1",
    court: "홍성지원",
    caseYear: "2025",
    caseSerial: "15803",
    caseNumber: "2025타경15803",
    itemNo: 1,
    formGroup: "LAND",
    itemType: "대지,임야,전답",
    auctionType: "부동산임의경매",
    title: "홍성군 은하면 장척리 231·232 토지",
    region: "충남 홍성군",
    parcels: [
      {
        no: 1,
        listKind: "토지",
        address: "충청남도 홍성군 은하면 장척리 231",
        detail: "토지 · 미종국",
      },
      {
        no: 2,
        listKind: "토지",
        address: "충청남도 홍성군 은하면 장척리 232",
        detail: "토지 · 미종국",
      },
    ],
    appraisalPrice: 47_384_000,
    minPrice: 7_964_000,
    bidDeposit: 796_400,
    claimAmount: 33_329_977,
    bidMethod: "기일입찰",
    saleDate: "2026-07-28",
    saleDateLabel: "2026.07.28 경매법정",
    receivedAt: "2025.06.24",
    startedAt: "2025.06.27",
    dividendDeadline: "2025.09.15",
    remarks: "",
    appraisalSummary: "홍성군 은하면 장척리 토지(대지·임야·전답). 매각공고 진행.",
    schedule: [
      { date: "2026.06.23", kind: "매각기일", place: "경매법정", minPrice: null, result: "유찰" },
      { date: "2026.07.28", kind: "매각기일", place: "경매법정", minPrice: 7_964_000, result: "" },
    ],
    documents: DOCS_LAND_HOUSE,
    possessionNote: "확인 필요",
    leaseNote: "해당사항 확인",
    assumeRightsNote: "명세서·등기 확인",
  },
  {
    id: "hs-1111-1",
    court: "홍성지원",
    caseYear: "2025",
    caseSerial: "1111",
    caseNumber: "2025타경1111",
    itemNo: 1,
    siblingItems: [
      { itemNo: 1, label: "1 · 전답 부평리 592", fixtureId: "hs-1111-1" },
      { itemNo: 2, label: "2 · 전답 부평리 605~614 일괄", fixtureId: "hs-1111-2" },
      { itemNo: 3, label: "3 · 전답 부평리 626", fixtureId: "hs-1111-3" },
    ],
    formGroup: "LAND",
    itemType: "전답",
    auctionType: "부동산임의경매",
    title: "홍성군 금마면 부평리 592 전답",
    region: "충남 홍성군",
    parcels: [
      {
        no: 1,
        listKind: "토지",
        address: "충청남도 홍성군 금마면 부평리 592",
        detail: "답 · 부정형 완경사지 · 도로 개설",
      },
    ],
    appraisalPrice: 154_660_000,
    minPrice: 75_783_000,
    bidDeposit: 7_578_300,
    claimAmount: 79_722_065,
    bidMethod: "기일입찰",
    saleDate: "2026-07-21",
    saleDateLabel: "2026.07.21 10:00 경매법정",
    receivedAt: "2025.07.25",
    startedAt: "2025.07.28",
    dividendDeadline: "2025.10.13",
    remarks:
      "부정형 완경사지로 '답'으로 이용중이며, 도로가 개설되어 있음\n농지취득자격증명원 제출요함(미제출시 보증금 미반환)",
    appraisalSummary: "홍성군 금마면 부평리 전답. 매각공고 진행. 농취증 필수.",
    schedule: [
      { date: "2026.05.12", kind: "매각기일", place: "경매법정", minPrice: 154_660_000, result: "유찰" },
      { date: "2026.06.16", kind: "매각기일", place: "경매법정", minPrice: 108_262_000, result: "유찰" },
      { date: "2026.07.21", kind: "매각기일", place: "경매법정", minPrice: 75_783_000, result: "" },
      { date: "2026.07.28", kind: "매각결정기일", place: "경매법정", minPrice: null, result: "" },
    ],
    documents: DOCS_LAND_HOUSE,
    possessionNote: "확인 필요",
    leaseNote: "해당사항 확인",
    assumeRightsNote: "명세서·등기 확인",
  },
  {
    id: "hs-1111-2",
    court: "홍성지원",
    caseYear: "2025",
    caseSerial: "1111",
    caseNumber: "2025타경1111",
    itemNo: 2,
    siblingItems: [
      { itemNo: 1, label: "1 · 전답 부평리 592", fixtureId: "hs-1111-1" },
      { itemNo: 2, label: "2 · 전답 부평리 605~614 일괄", fixtureId: "hs-1111-2" },
      { itemNo: 3, label: "3 · 전답 부평리 626", fixtureId: "hs-1111-3" },
    ],
    formGroup: "LAND",
    itemType: "전답",
    auctionType: "부동산임의경매",
    title: "홍성군 금마면 부평리 605~614 전답 일괄",
    region: "충남 홍성군",
    parcels: [
      { no: 2, listKind: "토지", address: "충청남도 홍성군 금마면 부평리 605", detail: "토지 · 제시외 비닐하우스 매각 제외" },
      { no: 3, listKind: "토지", address: "충청남도 홍성군 금마면 부평리 606", detail: "토지 · 제시외 정자 매각 제외" },
      { no: 4, listKind: "토지", address: "충청남도 홍성군 금마면 부평리 607", detail: "토지 · 맹지" },
      { no: 5, listKind: "토지", address: "충청남도 홍성군 금마면 부평리 614", detail: "토지 · 제시외 창고 매각 제외" },
    ],
    appraisalPrice: 59_240_000,
    minPrice: 59_240_000,
    bidDeposit: 5_924_000,
    claimAmount: 79_722_065,
    bidMethod: "기일입찰",
    saleDate: "2026-07-21",
    saleDateLabel: "2026.07.21 10:00 경매법정",
    receivedAt: "2025.07.25",
    startedAt: "2025.07.28",
    dividendDeadline: "2025.10.13",
    remarks:
      "일괄매각, 목록2,3,5 지상의 제시외 건물 매각 제외\n목록4 맹지임\n농지취득자격증명원 제출요함",
    appraisalSummary: "부평리 일괄 전답. 제시외 건물·맹지·전용허가 주의.",
    schedule: [
      { date: "2026.07.21", kind: "매각기일", place: "경매법정", minPrice: 59_240_000, result: "" },
      { date: "2026.07.28", kind: "매각결정기일", place: "경매법정", minPrice: null, result: "" },
    ],
    documents: DOCS_LAND_HOUSE,
    possessionNote: "확인 필요",
    leaseNote: "해당사항 확인",
    assumeRightsNote: "제시외·맹지·전용허가 확인",
  },
  {
    id: "hs-1111-3",
    court: "홍성지원",
    caseYear: "2025",
    caseSerial: "1111",
    caseNumber: "2025타경1111",
    itemNo: 3,
    siblingItems: [
      { itemNo: 1, label: "1 · 전답 부평리 592", fixtureId: "hs-1111-1" },
      { itemNo: 2, label: "2 · 전답 부평리 605~614 일괄", fixtureId: "hs-1111-2" },
      { itemNo: 3, label: "3 · 전답 부평리 626", fixtureId: "hs-1111-3" },
    ],
    formGroup: "LAND",
    itemType: "전답",
    auctionType: "부동산임의경매",
    title: "홍성군 금마면 부평리 626 전답",
    region: "충남 홍성군",
    parcels: [
      {
        no: 6,
        listKind: "토지",
        address: "충청남도 홍성군 금마면 부평리 626",
        detail: "토지 · 지상 분묘 2기",
      },
    ],
    appraisalPrice: 33_796_000,
    minPrice: 33_796_000,
    bidDeposit: 3_379_600,
    claimAmount: 79_722_065,
    bidMethod: "기일입찰",
    saleDate: "2026-07-21",
    saleDateLabel: "2026.07.21 10:00 경매법정",
    receivedAt: "2025.07.25",
    startedAt: "2025.07.28",
    dividendDeadline: "2025.10.13",
    remarks: "지상에 분묘2기 소재\n농지취득자격증명원 제출요함",
    appraisalSummary: "부평리 626 전답. 분묘·농취증 주의.",
    schedule: [
      { date: "2026.07.21", kind: "매각기일", place: "경매법정", minPrice: 33_796_000, result: "" },
      { date: "2026.07.28", kind: "매각결정기일", place: "경매법정", minPrice: null, result: "" },
    ],
    documents: DOCS_LAND_HOUSE,
    possessionNote: "확인 필요",
    leaseNote: "해당사항 확인",
    assumeRightsNote: "분묘·농취증 확인",
  },
  {
    id: "7405-1",
    court: "대구지방법원",
    caseYear: "2025",
    caseSerial: "7405",
    caseNumber: "2025타경7405",
    itemNo: 1,
    formGroup: "UNIT",
    itemType: "아파트",
    auctionType: "부동산강제경매",
    title: "수성구 매호효성백년가약 105동 702호",
    region: "대구 수성구",
    parcels: [
      {
        no: 1,
        listKind: "집합건물",
        address: "(아파트) 대구광역시 수성구 매호동 750 매호효성백년가약아파트 105동 7층702호",
        detail: "전유 84.9726㎡ · 대지권 18708분의 38.8153",
      },
    ],
    exclusiveArea: 84.9726,
    landShareDenom: 18708,
    landShareNumer: 38.8153,
    appraisalPrice: 299_000_000,
    minPrice: 17_237_000,
    bidDeposit: 1_723_700,
    claimAmount: 294_000_000,
    bidMethod: "기일입찰",
    saleDate: "2026-07-20",
    saleDateLabel: "2026.07.20 10:00 신관 지하2층 입찰법정",
    receivedAt: "2025.02.18",
    startedAt: "2025.02.20",
    dividendDeadline: "2025.05.02",
    remarks: "",
    appraisalSummary:
      "매동초 북서측 인근. 제3종일반주거지역. 교통 보통. 아파트 이용중. 임대관계 미상. 내부 마감 현장 미확인(유사 마감 기준 평가).",
    schedule: [
      { date: "2025.11.11", kind: "매각기일", place: "신관 지하2층", minPrice: 299_000_000, result: "유찰" },
      { date: "2025.12.12", kind: "매각기일", place: "신관 지하2층", minPrice: 209_300_000, result: "유찰" },
      { date: "2026.01.08", kind: "매각기일", place: "신관 지하2층", minPrice: 146_510_000, result: "유찰" },
      { date: "2026.02.05", kind: "매각기일", place: "신관 지하2층", minPrice: 102_557_000, result: "유찰" },
      { date: "2026.03.11", kind: "매각기일", place: "신관 지하2층", minPrice: 71_790_000, result: "유찰" },
      { date: "2026.04.08", kind: "매각기일", place: "신관 지하2층", minPrice: 50_253_000, result: "유찰" },
      { date: "2026.05.14", kind: "매각기일", place: "신관 지하2층", minPrice: 35_177_000, result: "유찰" },
      { date: "2026.06.18", kind: "매각기일", place: "신관 지하2층", minPrice: 24_624_000, result: "유찰" },
      { date: "2026.07.20", kind: "매각기일", place: "신관 지하2층", minPrice: 17_237_000, result: "" },
      { date: "2026.07.27", kind: "매각결정기일", place: "신관 지하2층", minPrice: null, result: "" },
    ],
    documents: DOCS_UNIT,
    possessionNote: "채무자(소유자) 점유",
    leaseNote: "해당사항 없음",
    assumeRightsNote: "해당사항 없음",
  },
  {
    id: "844-1",
    court: "대구지방법원",
    caseYear: "2025",
    caseSerial: "844",
    caseNumber: "2025타경844",
    itemNo: 1,
    siblingItems: [
      { itemNo: 1, label: "1 · 근린시설 3층301호", fixtureId: "844-1" },
      { itemNo: 2, label: "2 · 근린시설 4층401호", fixtureId: "844-2" },
    ],
    formGroup: "UNIT",
    itemType: "근린시설",
    auctionType: "부동산임의경매",
    title: "북구 연경 제이9621타워 3층301호",
    region: "대구 북구",
    parcels: [
      {
        no: 1,
        listKind: "집합건물",
        address: "(근린생활시설) 대구광역시 북구 연경동 962-1 제이9621타워 3층301호",
        detail: "전유 505.74㎡ · 대지권 963분의 120.38 · 운동시설 빌딩",
      },
    ],
    exclusiveArea: 505.74,
    landShareDenom: 963,
    landShareNumer: 120.38,
    appraisalPrice: 2_020_000_000,
    minPrice: 989_800_000,
    bidDeposit: 98_980_000,
    claimAmount: 3_803_142_705,
    bidMethod: "기일입찰",
    saleDate: "2026-07-20",
    saleDateLabel: "2026.07.20 10:00 신관 지하2층 입찰법정",
    receivedAt: "2025.05.19",
    startedAt: "2025.05.20",
    dividendDeadline: "2025.08.01",
    remarks: "",
    appraisalSummary:
      "연경초 남측 인근. 근린생활시설·아파트·다세대 혼재. 차량접근 가능, 교통 보통. 구분건물감정평가요항표 적용.",
    schedule: [
      { date: "2026.05.14", kind: "매각기일", place: "신관 지하2층", minPrice: 2_020_000_000, result: "유찰" },
      { date: "2026.06.18", kind: "매각기일", place: "신관 지하2층", minPrice: 1_414_000_000, result: "유찰" },
      { date: "2026.07.20", kind: "매각기일", place: "신관 지하2층", minPrice: 989_800_000, result: "" },
      { date: "2026.07.27", kind: "매각결정기일", place: "신관 지하2층", minPrice: null, result: "" },
    ],
    documents: DOCS_UNIT,
    possessionNote: "확인 필요(임차인 다수)",
    leaseNote: "임차인·전세권자·근저당 등 다수 — 명세서 확인",
    assumeRightsNote: "명세서 확인 필요",
  },
  {
    id: "844-2",
    court: "대구지방법원",
    caseYear: "2025",
    caseSerial: "844",
    caseNumber: "2025타경844",
    itemNo: 2,
    siblingItems: [
      { itemNo: 1, label: "1 · 근린시설 3층301호", fixtureId: "844-1" },
      { itemNo: 2, label: "2 · 근린시설 4층401호", fixtureId: "844-2" },
    ],
    formGroup: "UNIT",
    itemType: "근린시설",
    auctionType: "부동산임의경매",
    title: "북구 연경 제이9621타워 4층401호",
    region: "대구 북구",
    parcels: [
      {
        no: 1,
        listKind: "집합건물",
        address: "(근린생활시설) 대구광역시 북구 연경동 962-1 제이9621타워 4층401호",
        detail: "집합건물 전유 · 물건 2호 (샘플)",
      },
    ],
    exclusiveArea: 500,
    landShareDenom: 963,
    landShareNumer: 120,
    appraisalPrice: 2_020_000_000,
    minPrice: 989_800_000,
    bidDeposit: 98_980_000,
    claimAmount: 3_803_142_705,
    bidMethod: "기일입찰",
    saleDate: "2026-07-20",
    saleDateLabel: "2026.07.20 10:00 신관 지하2층 입찰법정",
    receivedAt: "2025.05.19",
    startedAt: "2025.05.20",
    dividendDeadline: "2025.08.01",
    remarks: "동일 사건 물건번호 2",
    appraisalSummary: "844 물건1과 동일 단지. 물건번호 선택 데모용.",
    schedule: [
      { date: "2026.07.20", kind: "매각기일", place: "신관 지하2층", minPrice: 989_800_000, result: "" },
    ],
    documents: DOCS_UNIT,
    possessionNote: "확인 필요",
    leaseNote: "명세서 확인",
    assumeRightsNote: "명세서 확인",
  },
  {
    id: "820-1",
    court: "대구지방법원",
    caseYear: "2025",
    caseSerial: "820",
    caseNumber: "2025타경820",
    itemNo: 1,
    formGroup: "HOUSE",
    itemType: "단독주택",
    auctionType: "부동산임의경매",
    title: "수성구 수성동2가 단독주택 일괄",
    region: "대구 수성구",
    parcels: [
      {
        no: 1,
        listKind: "토지",
        address: "(대지) 대구광역시 수성구 수성동2가 138-2",
        detail: "대 132.2㎡",
      },
      {
        no: 2,
        listKind: "건물",
        address: "(단독주택) 대구광역시 수성구 수성동2가 138-2",
        detail: "목조 주택·창고 · 제시외 다용도실·화장실 포함",
      },
    ],
    landArea: 132.2,
    buildingArea: 56.8,
    appraisalPrice: 638_907_950,
    minPrice: 313_065_000,
    bidDeposit: 31_306_500,
    claimAmount: 420_000_000,
    bidMethod: "기일입찰",
    saleDate: "2026-07-20",
    saleDateLabel: "2026.07.20 10:00 신관 지하2층 입찰법정",
    receivedAt: "2025.05.12",
    startedAt: "2025.05.13",
    dividendDeadline: "2025.07.28",
    remarks: "일괄매각. 제시외 건물 포함",
    appraisalSummary:
      "대구동중 남측 인근. 제3종일반주거지역. 주거용 건부지. 토지감정요항표 + 건물 평가.",
    schedule: [
      { date: "2026.05.14", kind: "매각기일", place: "신관 지하2층", minPrice: 638_907_950, result: "유찰" },
      { date: "2026.06.18", kind: "매각기일", place: "신관 지하2층", minPrice: 447_236_000, result: "유찰" },
      { date: "2026.07.20", kind: "매각기일", place: "신관 지하2층", minPrice: 313_065_000, result: "" },
      { date: "2026.07.27", kind: "매각결정기일", place: "신관 지하2층", minPrice: null, result: "" },
    ],
    documents: DOCS_LAND_HOUSE,
    possessionNote: "확인 필요",
    leaseNote: "확인 필요",
    assumeRightsNote: "명세서 확인",
  },
  {
    id: "7556-1",
    court: "대구지방법원",
    caseYear: "2025",
    caseSerial: "7556",
    caseNumber: "2025타경7556",
    itemNo: 1,
    formGroup: "UNIT",
    itemType: "아파트",
    auctionType: "부동산강제경매",
    title: "중구 반월당아너스제네스 오피스텔 1521호",
    region: "대구 중구",
    parcels: [
      {
        no: 1,
        listKind: "집합건물",
        address: "(오피스텔) 대구광역시 중구 남산동 694-3 반월당아너스제네스타워오피스텔 15층1521호",
        detail: "법원 물건종류 라벨은 아파트 · 소재지는 오피스텔",
      },
    ],
    exclusiveArea: 30,
    appraisalPrice: 121_000_000,
    minPrice: 59_290_000,
    bidDeposit: 11_858_000,
    claimAmount: 100_658_734,
    bidMethod: "기일입찰",
    saleDate: "2026-07-20",
    saleDateLabel: "2026.07.20 10:00 신관 지하2층 입찰법정",
    receivedAt: "2025.03.07",
    startedAt: "2025.03.12",
    dividendDeadline: "2025.05.23",
    remarks: "재매각조건 매수신청보증금 최저매각가격의 20%",
    appraisalSummary: "업무시설(오피스텔)·근린생활시설 복합. 집합건물. 임차인·임차권자 존재.",
    schedule: [
      { date: "2025.11.11", kind: "매각기일", place: "신관 지하2층", minPrice: 121_000_000, result: "유찰" },
      { date: "2026.05.14", kind: "매각기일", place: "신관 지하2층", minPrice: 59_290_000, result: "매각" },
      { date: "2026.05.21", kind: "매각결정기일", place: "신관 지하2층", minPrice: null, result: "최고가매각허가결정" },
      { date: "2026.07.20", kind: "매각기일", place: "신관 지하2층", minPrice: 59_290_000, result: "" },
    ],
    documents: DOCS_UNIT,
    possessionNote: "확인 필요",
    leaseNote: "임차인·임차권자 있음",
    assumeRightsNote: "명세서 확인",
  },
  {
    id: "8952-1",
    court: "대구지방법원",
    caseYear: "2025",
    caseSerial: "8952",
    caseNumber: "2025타경8952",
    itemNo: 1,
    formGroup: "LAND",
    itemType: "전답",
    auctionType: "부동산임의경매",
    title: "북구 도남동 전답 일괄(지분)",
    region: "대구 북구",
    parcels: [
      { no: 1, listKind: "토지", address: "(답) 대구광역시 북구 도남동 196-2", detail: "답 995㎡ · 현황 전" },
      { no: 2, listKind: "토지", address: "(전) 대구광역시 북구 도남동 198", detail: "전 1904㎡ · 제시외 농막·창고 매각 제외" },
      { no: 3, listKind: "토지", address: "(답) 대구광역시 북구 도남동 196-3", detail: "답 238㎡ · 현황 비포장 내부도로" },
    ],
    landArea: 3137,
    appraisalPrice: 497_209_800,
    minPrice: 348_047_000,
    bidDeposit: 34_804_700,
    claimAmount: 351_851_409,
    bidMethod: "기일입찰",
    saleDate: "2026-07-20",
    saleDateLabel: "2026.07.20 10:00 신관 지하2층 입찰법정",
    receivedAt: "2025.08.08",
    startedAt: "2025.08.12",
    dividendDeadline: "2025.10.27",
    remarks:
      "일괄매각\n목록1,2,3 농지취득자격증명 제출 요함(미제출시 매수보증금 미반환)\n목록1,2 지상 비닐하우스·농막·창고 매각 제외\n목록1·3 공부상 답이나 현황 상이",
    appraisalSummary:
      "도남지 북동측. 자연녹지·개발제한구역 등. 교통 불편. 토지감정요항표. 공유·지상권 주의.",
    schedule: [
      { date: "2026.06.18", kind: "매각기일", place: "신관 지하2층", minPrice: 497_209_800, result: "유찰" },
      { date: "2026.07.20", kind: "매각기일", place: "신관 지하2층", minPrice: 348_047_000, result: "" },
      { date: "2026.07.27", kind: "매각결정기일", place: "신관 지하2층", minPrice: null, result: "" },
    ],
    documents: DOCS_LAND_HOUSE,
    possessionNote: "확인 필요",
    leaseNote: "해당사항 확인",
    assumeRightsNote: "지분·지상권 확인",
    saleShare: "전 소유권 지분 중 2653분의 1093 (갑구2번 신분연 지분 전부)",
  },
  {
    id: "7938-1",
    court: "대구지방법원",
    caseYear: "2025",
    caseSerial: "7938",
    caseNumber: "2025타경7938",
    itemNo: 1,
    formGroup: "LAND",
    itemType: "아파트",
    auctionType: "부동산임의경매",
    title: "북구 침산동 대지 109㎡",
    region: "대구 북구",
    parcels: [
      {
        no: 1,
        listKind: "토지",
        address: "(대지) 대구광역시 북구 침산동 1426-2",
        detail: "대 109㎡ · 법원 물건종류 라벨은 아파트이나 목록은 토지만",
      },
    ],
    landArea: 109,
    appraisalPrice: 150_420_000,
    minPrice: 36_116_000,
    bidDeposit: 3_611_600,
    claimAmount: 103_201_508,
    bidMethod: "기일입찰",
    saleDate: "2026-07-20",
    saleDateLabel: "2026.07.20 10:00 신관 지하2층 입찰법정",
    receivedAt: "2025.04.22",
    startedAt: "2025.04.23",
    dividendDeadline: "",
    remarks: "",
    appraisalSummary:
      "침산동화타운 동측 인근. 단독·다세대·근린시설. 세장형 토지. 토지감정요항표. 채무자와 소유자 분리.",
    schedule: [
      { date: "2026.07.20", kind: "매각기일", place: "신관 지하2층", minPrice: 36_116_000, result: "" },
    ],
    documents: DOCS_LAND_HOUSE,
    possessionNote: "소유자 점유 여부 확인",
    leaseNote: "확인 필요",
    assumeRightsNote: "명세서 확인",
  },
  {
    id: "7387-1",
    court: "대구지방법원",
    caseYear: "2025",
    caseSerial: "7387",
    caseNumber: "2025타경7387",
    itemNo: 1,
    formGroup: "HOUSE",
    itemType: "상가,오피스텔,근린시설",
    auctionType: "부동산임의경매",
    title: "남구 대명동 다가구·근린 일괄",
    region: "대구 남구",
    parcels: [
      {
        no: 1,
        listKind: "토지",
        address: "(대지) 대구광역시 남구 대명동 1913-23",
        detail: "대 210.6㎡",
      },
      {
        no: 2,
        listKind: "건물",
        address: "(다가구주택) 대구광역시 남구 대명동 1913-23",
        detail: "철근콘크리트 4층 단독주택·근린생활시설 · 연면적 약 376㎡",
      },
    ],
    landArea: 210.6,
    buildingArea: 376.89,
    appraisalPrice: 1_005_314_040,
    minPrice: 492_604_000,
    bidDeposit: 49_260_400,
    claimAmount: 515_175_749,
    bidMethod: "기일입찰",
    saleDate: "2026-07-20",
    saleDateLabel: "2026.07.20 10:00 신관 지하2층 입찰법정",
    receivedAt: "2025.02.17",
    startedAt: "2025.02.17",
    dividendDeadline: "",
    remarks:
      "일괄매각\n임차인 이지영 전세사기피해자등 결정통지서 제출함. 전세사기피해자 우선매수권 있음.(2025.10.28.정정.변경)",
    appraisalSummary:
      "삼각지네거리 남측. 다가구·근린 혼용. 임차인 다수. 전세사기피해자 우선매수권 고지.",
    schedule: [
      { date: "2026.07.20", kind: "매각기일", place: "신관 지하2층", minPrice: 492_604_000, result: "" },
    ],
    documents: DOCS_LAND_HOUSE,
    possessionNote: "임차인 다수 점유 가능",
    leaseNote: "임차인·임차권자 다수",
    assumeRightsNote: "우선매수권·임차 인수 여부 명세서 필수",
  },
  {
    id: "8668-1",
    court: "대구지방법원",
    caseYear: "2025",
    caseSerial: "8668",
    caseNumber: "2025타경8668",
    itemNo: 1,
    formGroup: "UNIT",
    itemType: "다세대",
    auctionType: "부동산강제경매",
    title: "북구 산격동 에이동 202호",
    region: "대구 북구",
    parcels: [
      {
        no: 1,
        listKind: "집합건물",
        address: "(다세대주택) 대구광역시 북구 산격동 179-1 에이동 2층202호",
        detail: "전유 59.72㎡ · 대지권 888㎡ 중 지분",
      },
    ],
    exclusiveArea: 59.72,
    landShareDenom: 888,
    landShareNumer: 59.72,
    appraisalPrice: 102_000_000,
    minPrice: 102_000_000,
    bidDeposit: 10_200_000,
    claimAmount: 65_096_775,
    bidMethod: "기일입찰",
    saleDate: "2026-07-20",
    saleDateLabel: "2026.07.20 10:00 신관 지하2층 입찰법정",
    receivedAt: "2025.07.16",
    startedAt: "2025.07.22",
    dividendDeadline: "",
    remarks: "",
    appraisalSummary: "4층 다세대. 집합건물 전유·대지권. 강제경매.",
    schedule: [
      { date: "2026.07.20", kind: "매각기일", place: "신관 지하2층", minPrice: 102_000_000, result: "" },
    ],
    documents: DOCS_UNIT,
    possessionNote: "확인 필요",
    leaseNote: "확인 필요",
    assumeRightsNote: "명세서 확인",
  },
];

export function findFixturesByCase(court: string, caseSerial: string): CourtAuctionFixture[] {
  const serial = caseSerial.replace(/\D/g, "");
  return FIXTURES.filter((f) => f.court === court && f.caseSerial === serial);
}

export function getFixtureById(id: string): CourtAuctionFixture | undefined {
  return FIXTURES.find((f) => f.id === id);
}

/** Unique cases for quick-pick (first item of each case). */
export function listCasePresets(): { label: string; court: string; caseSerial: string; group: FormGroup }[] {
  const seen = new Set<string>();
  const out: { label: string; court: string; caseSerial: string; group: FormGroup }[] = [];
  for (const f of FIXTURES) {
    if (seen.has(f.caseNumber)) continue;
    seen.add(f.caseNumber);
    out.push({
      label: `${f.caseNumber} · ${f.itemType} (${f.formGroup})`,
      court: f.court,
      caseSerial: f.caseSerial,
      group: f.formGroup,
    });
  }
  return out;
}

export function formatWon(n: number): string {
  return `${n.toLocaleString("ko-KR")}원`;
}

export function groupLabel(g: FormGroup): string {
  if (g === "UNIT") return "집합·구분건물";
  if (g === "HOUSE") return "토지+건물";
  return "토지";
}
