export type RtmsPropertyType =
  | "APT"
  | "OFFICETEL"
  | "TOWNHOUSE"
  | "SINGLE_HOUSE"
  | "COMMERCIAL"
  | "FACTORY"
  | "LAND";

export type RtmsDealType = "SALE" | "RENT" | "RIGHT";

export type NormalizedRtmsRow = {
  propertyType: RtmsPropertyType;
  transactionType: RtmsDealType;
  lawdCd: string;
  dealYmd: number;
  dealDate: string; // YYYY-MM-DD
  buildingName: string;
  jibun: string;
  roadName: string;
  umdNm: string;
  floor: string;
  exclArea: number | null;
  landArea: number | null;
  buildYear: number | null;
  dealAmount: number;
  depositAmount: number;
  monthlyRent: number;
  pricePerSqm: number | null;
  cancelled: boolean;
  cancelDate: string | null;
  dealingGbn: string;
  rawDetails: Record<string, unknown>;
};

export type CoverageStatus = "collected" | "missing" | "empty";
