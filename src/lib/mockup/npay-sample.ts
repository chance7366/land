/** Npay 매물·단지 수집 목업 샘플 — 운영 미적용 · DB 없음 */

export type NpayTradeType = "A1" | "B1" | "B2" | "B3";

/** 네이버부동산 UI 매물유형 (fin.land / Npay URL 코드) */
export type NpayEstateType =
  | "A01"
  | "A04"
  | "A02"
  | "C02"
  | "B01"
  | "B02"
  | "C01"
  | "C03"
  | "C04"
  | "D05"
  | "F01"
  | "D02"
  | "E03"
  | "D01"
  | "D03"
  | "E02"
  | "E04";

export const NPAY_TRADE_LABEL: Record<NpayTradeType, string> = {
  A1: "매매",
  B1: "전세",
  B2: "월세",
  B3: "단기임대",
};

/** UI 표시 순서 = 네이버 필터와 동일하게 */
export const NPAY_ESTATE_OPTIONS: { code: NpayEstateType; label: string }[] = [
  { code: "A01", label: "아파트" },
  { code: "A04", label: "재건축" },
  { code: "A02", label: "오피스텔" },
  { code: "C02", label: "빌라" },
  { code: "B01", label: "아파트분양권" },
  { code: "B02", label: "오피스텔분양권" },
  { code: "C01", label: "원룸" },
  { code: "C03", label: "단독/다가구" },
  { code: "C04", label: "전원주택" },
  { code: "D05", label: "상가주택" },
  { code: "F01", label: "재개발" },
  { code: "D02", label: "상가" },
  { code: "E03", label: "토지" },
  { code: "D01", label: "사무실" },
  { code: "D03", label: "건물" },
  { code: "E02", label: "공장/창고" },
  { code: "E04", label: "지식산업센터" },
];

export const NPAY_ESTATE_LABEL: Record<NpayEstateType, string> =
  Object.fromEntries(
    NPAY_ESTATE_OPTIONS.map((o) => [o.code, o.label]),
  ) as Record<NpayEstateType, string>;

export const ALL_NPAY_ESTATE_CODES = NPAY_ESTATE_OPTIONS.map((o) => o.code);

/**
 * boundedArticles → representativeArticleInfo 기준 수집 필드
 * (NpayApiRef.md · APTListings Article 모델)
 */
export type NpayCollectField = {
  group: string;
  apiPath: string;
  label: string;
  note?: string;
};

export const NPAY_COLLECT_FIELDS: NpayCollectField[] = [
  // 식별
  { group: "식별", apiPath: "articleNumber", label: "매물번호" },
  { group: "식별", apiPath: "articleName", label: "매물명" },
  { group: "식별", apiPath: "complexName", label: "단지명", note: "없으면 articleName" },
  { group: "식별", apiPath: "dongName", label: "동명" },
  { group: "식별", apiPath: "buildingType", label: "건물유형코드" },
  {
    group: "식별",
    apiPath: "(derived) articleUrl",
    label: "매물 URL",
    note: "fin.land.naver.com/articles/{번호}",
  },
  {
    group: "식별",
    apiPath: "duplicatedArticleInfo",
    label: "동일주소 중복매물",
    note: "있을 때만 · isDuplicate",
  },
  // 유형
  { group: "유형", apiPath: "tradeType", label: "거래유형", note: "A1/B1/B2/B3 → 한글" },
  {
    group: "유형",
    apiPath: "realEstateType",
    label: "매물유형",
    note: "A01…E04 → 한글",
  },
  // 가격 (원 단위)
  { group: "가격", apiPath: "priceInfo.dealPrice", label: "매매가", note: "원" },
  { group: "가격", apiPath: "priceInfo.warrantyPrice", label: "보증금", note: "원" },
  { group: "가격", apiPath: "priceInfo.rentPrice", label: "월세", note: "원" },
  {
    group: "가격",
    apiPath: "priceInfo.managementFeeAmount",
    label: "관리비",
    note: "원",
  },
  // 면적
  { group: "면적", apiPath: "spaceInfo.supplySpace", label: "공급면적(㎡)" },
  { group: "면적", apiPath: "spaceInfo.exclusiveSpace", label: "전용면적(㎡)" },
  { group: "면적", apiPath: "spaceInfo.landSpace", label: "대지면적(㎡)", note: "토지·단독 등" },
  // 상세
  {
    group: "상세",
    apiPath: "articleDetail.floorInfo",
    label: "층정보",
    note: "해당층/전체층",
  },
  {
    group: "상세",
    apiPath: "articleDetail.floorDetailInfo",
    label: "층상세",
    note: "있을 때",
  },
  { group: "상세", apiPath: "articleDetail.direction", label: "향", note: "코드→한글" },
  {
    group: "상세",
    apiPath: "articleDetail.articleFeatureDescription",
    label: "특징설명",
  },
  // 주소
  { group: "주소", apiPath: "address.city", label: "시/도" },
  { group: "주소", apiPath: "address.division", label: "시군구" },
  { group: "주소", apiPath: "address.sector", label: "읍면동" },
  {
    group: "주소",
    apiPath: "address.coordinates.xCoordinate",
    label: "경도",
  },
  {
    group: "주소",
    apiPath: "address.coordinates.yCoordinate",
    label: "위도",
  },
  // 건물
  {
    group: "건물",
    apiPath: "buildingInfo.buildingConjunctionDate",
    label: "사용승인일",
  },
  {
    group: "건물",
    apiPath: "buildingInfo.approvalElapsedYear",
    label: "경과년수",
  },
  {
    group: "건물",
    apiPath: "landInfo.*",
    label: "토지정보",
    note: "지목·용도 등 · 유형별",
  },
  // 중개·검증
  { group: "중개·검증", apiPath: "brokerInfo.brokerageName", label: "중개사명" },
  {
    group: "중개·검증",
    apiPath: "verificationInfo.articleConfirmDate",
    label: "확인일자",
  },
  // 미디어
  {
    group: "미디어",
    apiPath: "articleMedia / articleMediaDto",
    label: "이미지·미디어",
    note: "목록 응답에 포함 시",
  },
];

export const NPAY_COLLECT_FIELD_GROUPS = [
  "식별",
  "유형",
  "가격",
  "면적",
  "상세",
  "주소",
  "건물",
  "중개·검증",
  "미디어",
] as const;

/** 목록 테이블·엑셀에 펼쳐 쓸 대표 컬럼 (목업) */
export type NpaySampleArticle = {
  articleNumber: string;
  tradeType: NpayTradeType;
  estateType: NpayEstateType;
  complexName: string;
  articleName: string;
  dongName: string;
  exclusiveArea: number | null;
  supplyArea: number | null;
  landArea: number | null;
  floorInfo: string;
  direction: string;
  /** 만원 단위(표시용). API는 원 */
  dealPrice: number;
  deposit: number;
  monthlyRent: number;
  managementFee: number;
  city: string;
  division: string;
  sector: string;
  latitude: number;
  longitude: number;
  realtorName: string;
  confirmationDate: string;
  approvalDate: string;
  approvalElapsedYear: number | null;
  feature: string;
  articleUrl: string;
  isDuplicate: boolean;
};

export type NpaySampleComplex = {
  complexNumber: number;
  complexName: string;
  pyeongName: string;
  supplyArea: number;
  exclusiveArea: number;
  city: string;
  division: string;
  sector: string;
  roadName: string;
  jibun: string;
  totalHouseholds: number;
  dongCount: number;
  highestFloor: number;
  useApprovalYear: number;
  constructionCompany: string;
};

export const NPAY_SAMPLE_ARTICLES: NpaySampleArticle[] = [
  {
    articleNumber: "2640082334",
    tradeType: "A1",
    estateType: "A01",
    complexName: "도시개발2단지",
    articleName: "도시개발2단지",
    dongName: "101동",
    exclusiveArea: 39.76,
    supplyArea: 52.16,
    landArea: null,
    floorInfo: "8/15",
    direction: "남향",
    dealPrice: 55_000,
    deposit: 0,
    monthlyRent: 0,
    managementFee: 12,
    city: "서울특별시",
    division: "강서구",
    sector: "방화동",
    latitude: 37.5712,
    longitude: 126.8082,
    realtorName: "매경부동산",
    confirmationDate: "2026-07-26",
    approvalDate: "1998-05-12",
    approvalElapsedYear: 28,
    feature: "역세권·올수리",
    articleUrl: "https://fin.land.naver.com/articles/2640082334",
    isDuplicate: false,
  },
  {
    articleNumber: "2639994109",
    tradeType: "B2",
    estateType: "D02",
    complexName: "",
    articleName: "단지내상가",
    dongName: "",
    exclusiveArea: 35.38,
    supplyArea: 63.27,
    landArea: null,
    floorInfo: "1/16",
    direction: "동남",
    dealPrice: 0,
    deposit: 2_000,
    monthlyRent: 110,
    managementFee: 10,
    city: "서울특별시",
    division: "강서구",
    sector: "방화동",
    latitude: 37.57118,
    longitude: 126.80818,
    realtorName: "마곡봄봄공인",
    confirmationDate: "2026-07-25",
    approvalDate: "1998-05-12",
    approvalElapsedYear: 28,
    feature: "개화산역 초역세권 상가",
    articleUrl: "https://fin.land.naver.com/articles/2639994109",
    isDuplicate: false,
  },
  {
    articleNumber: "2640032310",
    tradeType: "B1",
    estateType: "A01",
    complexName: "마곡힐스테이트",
    articleName: "마곡힐스테이트",
    dongName: "103동",
    exclusiveArea: 84.97,
    supplyArea: 112.0,
    landArea: null,
    floorInfo: "12/29",
    direction: "남향",
    dealPrice: 0,
    deposit: 45_000,
    monthlyRent: 0,
    managementFee: 18,
    city: "서울특별시",
    division: "강서구",
    sector: "마곡동",
    latitude: 37.5665,
    longitude: 126.8254,
    realtorName: "마곡타운공인",
    confirmationDate: "2026-07-20",
    approvalDate: "2017-03-01",
    approvalElapsedYear: 9,
    feature: "전세·즉시입주",
    articleUrl: "https://fin.land.naver.com/articles/2640032310",
    isDuplicate: false,
  },
  {
    articleNumber: "2640111001",
    tradeType: "A1",
    estateType: "A04",
    complexName: "방화재건축예정",
    articleName: "방화재건축예정",
    dongName: "",
    exclusiveArea: 59.2,
    supplyArea: 78.0,
    landArea: null,
    floorInfo: "5/12",
    direction: "남동향",
    dealPrice: 72_000,
    deposit: 0,
    monthlyRent: 0,
    managementFee: 8,
    city: "서울특별시",
    division: "강서구",
    sector: "방화동",
    latitude: 37.578,
    longitude: 126.812,
    realtorName: "방화공인",
    confirmationDate: "2026-07-22",
    approvalDate: "1985-08-01",
    approvalElapsedYear: 40,
    feature: "재건축 추진구역",
    articleUrl: "https://fin.land.naver.com/articles/2640111001",
    isDuplicate: true,
  },
  {
    articleNumber: "2640111002",
    tradeType: "A1",
    estateType: "C02",
    complexName: "",
    articleName: "방화빌라",
    dongName: "B동",
    exclusiveArea: 48.5,
    supplyArea: 62.0,
    landArea: null,
    floorInfo: "3/4",
    direction: "남향",
    dealPrice: 28_500,
    deposit: 0,
    monthlyRent: 0,
    managementFee: 3,
    city: "서울특별시",
    division: "강서구",
    sector: "방화동",
    latitude: 37.575,
    longitude: 126.81,
    realtorName: "서부공인",
    confirmationDate: "2026-07-19",
    approvalDate: "2001-04-10",
    approvalElapsedYear: 25,
    feature: "주차가능·올수리",
    articleUrl: "https://fin.land.naver.com/articles/2640111002",
    isDuplicate: false,
  },
  {
    articleNumber: "2640111003",
    tradeType: "A1",
    estateType: "E03",
    complexName: "",
    articleName: "방화동 토지",
    dongName: "",
    exclusiveArea: null,
    supplyArea: null,
    landArea: 198.0,
    floorInfo: "—",
    direction: "—",
    dealPrice: 120_000,
    deposit: 0,
    monthlyRent: 0,
    managementFee: 0,
    city: "서울특별시",
    division: "강서구",
    sector: "방화동",
    latitude: 37.58,
    longitude: 126.815,
    realtorName: "토지전문공인",
    confirmationDate: "2026-07-15",
    approvalDate: "",
    approvalElapsedYear: null,
    feature: "주거지역·도로접",
    articleUrl: "https://fin.land.naver.com/articles/2640111003",
    isDuplicate: false,
  },
  {
    articleNumber: "2512345671",
    tradeType: "A1",
    estateType: "A01",
    complexName: "내포신도시 더샵",
    articleName: "내포신도시 더샵",
    dongName: "105동",
    exclusiveArea: 84.92,
    supplyArea: 110.2,
    landArea: null,
    floorInfo: "12/25",
    direction: "남향",
    dealPrice: 38_500,
    deposit: 0,
    monthlyRent: 0,
    managementFee: 15,
    city: "충청남도",
    division: "홍성군",
    sector: "홍북읍",
    latitude: 36.601,
    longitude: 126.67,
    realtorName: "찬스공인중개사",
    confirmationDate: "2026-07-18",
    approvalDate: "2019-11-20",
    approvalElapsedYear: 6,
    feature: "확장형·올수리",
    articleUrl: "https://fin.land.naver.com/articles/2512345671",
    isDuplicate: false,
  },
  {
    articleNumber: "2512345675",
    tradeType: "A1",
    estateType: "A02",
    complexName: "",
    articleName: "내포센트럴타워",
    dongName: "",
    exclusiveArea: 29.4,
    supplyArea: 42.1,
    landArea: null,
    floorInfo: "9/18",
    direction: "동향",
    dealPrice: 12_800,
    deposit: 0,
    monthlyRent: 0,
    managementFee: 7,
    city: "충청남도",
    division: "홍성군",
    sector: "홍북읍",
    latitude: 36.602,
    longitude: 126.671,
    realtorName: "찬스공인중개사",
    confirmationDate: "2026-07-10",
    approvalDate: "2022-06-01",
    approvalElapsedYear: 4,
    feature: "오피스텔·투자",
    articleUrl: "https://fin.land.naver.com/articles/2512345675",
    isDuplicate: false,
  },
  {
    articleNumber: "2512345680",
    tradeType: "A1",
    estateType: "A01",
    complexName: "정자 I-Park",
    articleName: "정자 I-Park",
    dongName: "208동",
    exclusiveArea: 84.5,
    supplyArea: 109.0,
    landArea: null,
    floorInfo: "22/35",
    direction: "남서향",
    dealPrice: 185_000,
    deposit: 0,
    monthlyRent: 0,
    managementFee: 25,
    city: "경기도",
    division: "성남시분당구",
    sector: "정자동",
    latitude: 37.366,
    longitude: 127.108,
    realtorName: "분당역공인",
    confirmationDate: "2026-07-08",
    approvalDate: "2014-09-15",
    approvalElapsedYear: 11,
    feature: "학군·역세권",
    articleUrl: "https://fin.land.naver.com/articles/2512345680",
    isDuplicate: false,
  },
];

export const NPAY_SAMPLE_COMPLEXES: NpaySampleComplex[] = [
  {
    complexNumber: 105812,
    complexName: "내포신도시 더샵",
    pyeongName: "84A",
    supplyArea: 110.2,
    exclusiveArea: 84.92,
    city: "충청남도",
    division: "홍성군",
    sector: "홍북읍",
    roadName: "충남대로 100",
    jibun: "신경리 123",
    totalHouseholds: 980,
    dongCount: 12,
    highestFloor: 25,
    useApprovalYear: 2019,
    constructionCompany: "포스코이앤씨",
  },
  {
    complexNumber: 105812,
    complexName: "내포신도시 더샵",
    pyeongName: "74B",
    supplyArea: 98.4,
    exclusiveArea: 74.56,
    city: "충청남도",
    division: "홍성군",
    sector: "홍북읍",
    roadName: "충남대로 100",
    jibun: "신경리 123",
    totalHouseholds: 980,
    dongCount: 12,
    highestFloor: 25,
    useApprovalYear: 2019,
    constructionCompany: "포스코이앤씨",
  },
  {
    complexNumber: 112044,
    complexName: "마곡힐스테이트",
    pyeongName: "84",
    supplyArea: 112.0,
    exclusiveArea: 84.97,
    city: "서울특별시",
    division: "강서구",
    sector: "마곡동",
    roadName: "마곡중앙로 80",
    jibun: "마곡동 774",
    totalHouseholds: 720,
    dongCount: 8,
    highestFloor: 29,
    useApprovalYear: 2017,
    constructionCompany: "현대건설",
  },
  {
    complexNumber: 108221,
    complexName: "도시개발2단지",
    pyeongName: "39A",
    supplyArea: 52.16,
    exclusiveArea: 39.76,
    city: "서울특별시",
    division: "강서구",
    sector: "방화동",
    roadName: "방화대로 45",
    jibun: "방화동 215",
    totalHouseholds: 540,
    dongCount: 6,
    highestFloor: 15,
    useApprovalYear: 1998,
    constructionCompany: "대한주택공사",
  },
  {
    complexNumber: 120100,
    complexName: "정자 I-Park",
    pyeongName: "84A",
    supplyArea: 109.0,
    exclusiveArea: 84.5,
    city: "경기도",
    division: "성남시분당구",
    sector: "정자동",
    roadName: "정자일로 248",
    jibun: "정자동 178",
    totalHouseholds: 1200,
    dongCount: 14,
    highestFloor: 35,
    useApprovalYear: 2014,
    constructionCompany: "HDC현대산업개발",
  },
];

export const NPAY_PHASE_NOTES = [
  "목업 · 샘플 데이터 · API/DB 미연결 · 개발 전 UI 검증",
  "예정: /admin/npay (매물·단지 탭 · DB 없이 수집 후 파일 저장)",
  "지역: 전국 시/도 → 시군구 → 읍면동",
  "매물유형: 네이버부동산 17종 · 거래: 매매/전세/월세/단기임대",
  "수집원: fin.land.naver.com front-api boundedArticles (NpayApiRef.md)",
] as const;

/** 가격 표시: 목업은 만원 단위 */
export function formatManwon(v: number): string {
  if (!v) return "—";
  return `${v.toLocaleString("ko-KR")}만`;
}

export function articleSampleValue(
  a: NpaySampleArticle,
  apiPath: string,
): string {
  const map: Record<string, string> = {
    articleNumber: a.articleNumber,
    articleName: a.articleName,
    complexName: a.complexName || "—",
    dongName: a.dongName || "—",
    buildingType: "—",
    "(derived) articleUrl": a.articleUrl,
    duplicatedArticleInfo: a.isDuplicate ? "중복있음" : "—",
    tradeType: NPAY_TRADE_LABEL[a.tradeType],
    realEstateType: NPAY_ESTATE_LABEL[a.estateType],
    "priceInfo.dealPrice": a.dealPrice
      ? `${(a.dealPrice * 10_000).toLocaleString("ko-KR")}원`
      : "—",
    "priceInfo.warrantyPrice": a.deposit
      ? `${(a.deposit * 10_000).toLocaleString("ko-KR")}원`
      : "—",
    "priceInfo.rentPrice": a.monthlyRent
      ? `${(a.monthlyRent * 10_000).toLocaleString("ko-KR")}원`
      : "—",
    "priceInfo.managementFeeAmount": a.managementFee
      ? `${(a.managementFee * 10_000).toLocaleString("ko-KR")}원`
      : "—",
    "spaceInfo.supplySpace":
      a.supplyArea != null ? String(a.supplyArea) : "—",
    "spaceInfo.exclusiveSpace":
      a.exclusiveArea != null ? String(a.exclusiveArea) : "—",
    "spaceInfo.landSpace": a.landArea != null ? String(a.landArea) : "—",
    "articleDetail.floorInfo": a.floorInfo,
    "articleDetail.floorDetailInfo": "—",
    "articleDetail.direction": a.direction,
    "articleDetail.articleFeatureDescription": a.feature,
    "address.city": a.city,
    "address.division": a.division,
    "address.sector": a.sector,
    "address.coordinates.xCoordinate": String(a.longitude),
    "address.coordinates.yCoordinate": String(a.latitude),
    "buildingInfo.buildingConjunctionDate": a.approvalDate || "—",
    "buildingInfo.approvalElapsedYear":
      a.approvalElapsedYear != null ? String(a.approvalElapsedYear) : "—",
    "landInfo.*": a.landArea != null ? `대지면적 ${a.landArea}㎡` : "—",
    "brokerInfo.brokerageName": a.realtorName,
    "verificationInfo.articleConfirmDate": a.confirmationDate,
    "articleMedia / articleMediaDto": "(목록 응답 시)",
  };
  return map[apiPath] ?? "—";
}
