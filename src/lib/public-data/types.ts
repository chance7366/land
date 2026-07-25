/** 정규화된 건축물대장(표제부) 조회 결과 → 매물 폼 필드 매핑용 */
export type BuildingLedgerFields = {
  buildingName?: string;
  exclusiveArea?: number;
  supplyArea?: number;
  totalFloorArea?: number;
  landShareArea?: number;
  totalFloors?: number;
  buildingUse?: string;
  useApprovalDate?: string;
  approvalDate?: string;
  totalParking?: number;
  structureType?: string;
};

/** 정규화된 토지(토지특성·지적) 조회 결과 */
export type LandLedgerFields = {
  exclusiveArea?: number;
  landCategory?: string;
  zoning?: string;
  roadAccess?: string;
  terrain?: string;
  landShape?: string;
  landUseStatus?: string;
  officialLandPrice?: number;
  pnu?: string;
};

export type ParcelCodes = {
  /** 시군구 5자리 */
  sigunguCd: string;
  /** 법정동 5자리 */
  bjdongCd: string;
  /** 0:대지 1:산 2:블록 */
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
