/** 대장 조회 분기 — 매물 category / 경매 itemType 정규화 */
export type LedgerKind = "GENERAL" | "AGGREGATE" | "LAND_ONLY";

/** 전유공용면적 상세 행 */
export type ExposAreaRow = {
  dongNm?: string;
  hoNm?: string;
  flrGbNm?: string;
  floorNm?: string;
  floor?: number;
  exposPubuseGb?: string;
  mainAtchGb?: string;
  mainPurps?: string;
  etcPurps?: string;
  structureType?: string;
  etcStrct?: string;
  area?: number;
};

/** 층별개요 행 */
export type FloorOutlineRow = {
  dongNm?: string;
  flrGbNm?: string;
  floorNm?: string;
  floor?: number;
  mainPurps?: string;
  etcPurps?: string;
  structureType?: string;
  area?: number;
  mainAtchGb?: string;
};

/** 지역지구구역 행 */
export type JijiguRow = {
  gbNm?: string;
  cdNm?: string;
  etcNm?: string;
  reprYn?: string;
};

/** 정규화된 건축물대장 필드 → 매물/경매 폼·미리보기용 */
export type BuildingLedgerFields = {
  buildingName?: string;
  dongNm?: string;
  hoNm?: string;
  floor?: number;
  floorNm?: string;
  /** 지상/지하 등 */
  flrGbNm?: string;
  exclusiveArea?: number;
  commonArea?: number;
  supplyArea?: number;
  totalFloorArea?: number;
  landShareArea?: number;
  archArea?: number;
  height?: number;
  totalFloors?: number;
  undergroundFloors?: number;
  buildingUse?: string;
  etcPurps?: string;
  useApprovalDate?: string;
  approvalDate?: string;
  permitDate?: string;
  startConstructDate?: string;
  totalParking?: number;
  indoorParking?: number;
  outdoorParking?: number;
  structureType?: string;
  etcStrct?: string;
  bcRat?: number;
  vlRat?: number;
  vlRatEstmTotArea?: number;
  hhldCnt?: number;
  fmlyCnt?: number;
  hoCnt?: number;
  mainBldCnt?: number;
  atchBldCnt?: number;
  atchBldArea?: number;
  elevatorCnt?: number;
  emergElevatorCnt?: number;
  seismicDesign?: string;
  energyGrade?: string;
  ecoBldGrade?: string;
  housePrice?: number;
  housePriceStdDay?: string;
  platPlc?: string;
  roadAddress?: string;
  regstrGbCdNm?: string;
  mainAtchGbCdNm?: string;
  mgmBldrgstPk?: string;
  regstrKindCdNm?: string;
  crtnDay?: string;
  /** 전유공용면적 상세 (호 단위 핵심) */
  exposAreaRows?: ExposAreaRow[];
  /** 해당 동 층별개요 (일부) */
  floorRows?: FloorOutlineRow[];
  /** 지역·지구·구역 */
  jijiguRows?: JijiguRow[];
  /** API 원문에서 추가로 보존한 키-값 */
  extras?: Record<string, string | number>;
};

/** 정규화된 토지(토지특성) 조회 결과 */
export type LandLedgerFields = {
  exclusiveArea?: number;
  landCategory?: string;
  landCategoryCode?: string;
  zoning?: string;
  zoning2?: string;
  roadAccess?: string;
  terrain?: string;
  landShape?: string;
  landUseStatus?: string;
  officialLandPrice?: number;
  priceStdYear?: string;
  pnu?: string;
  platPlc?: string;
  extras?: Record<string, string | number>;
};

export type ParcelCodes = {
  /** 시군구 5자리 */
  sigunguCd: string;
  /** 법정동 5자리 */
  bjdongCd: string;
  /** 0:대지 1:산 2:블록 (건축물대장 API) */
  platGbCd: string;
  /** 본번 4자리 zero-pad */
  bun: string;
  /** 부번 4자리 zero-pad */
  ji: string;
  /** 19자리 PNU (있으면) */
  pnu?: string;
};

export type BuildingLookupResult = {
  ok: true;
  source: "public-data";
  fields: BuildingLedgerFields;
  rawSummary?: string;
  items?: BuildingLedgerFields[];
};

export type LandLookupResult = {
  ok: true;
  source: "vworld";
  fields: LandLedgerFields;
  rawSummary?: string;
};

export type LedgerLookupError = {
  ok: false;
  error: string;
  code?: "MISSING_KEY" | "BAD_REQUEST" | "NOT_FOUND" | "UPSTREAM" | "PARSE";
};

export type LedgerCandidate = {
  kind: "title" | "expos";
  label: string;
  dongNm?: string;
  hoNm?: string;
  mgmBldrgstPk?: string;
  fields: BuildingLedgerFields;
};

export type LedgerBundle = {
  ledgerKind: LedgerKind;
  codes?: ParcelCodes;
  pnu?: string;
  basis?: BuildingLedgerFields;
  recap?: BuildingLedgerFields;
  title?: BuildingLedgerFields;
  expos?: BuildingLedgerFields;
  /** 폼 적용용 — 전유 우선 합성 */
  building?: BuildingLedgerFields;
  land?: LandLedgerFields;
  candidates?: LedgerCandidate[];
  warnings: string[];
  rawSummary: string;
  rawSnapshots?: {
    kind: "basis" | "recap" | "title" | "expos" | "hsprc" | "flr" | "jijigu" | "land";
    raw: unknown;
  }[];
};

export type LedgerLookupSuccess = {
  ok: true;
  bundle: LedgerBundle;
};
