export type NpayBoundingBox = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type NpayRegion = {
  legalDivisionNumber: string;
  city: string;
  division: string;
  sector: string;
  latitude: number;
  longitude: number;
  boundingBox: NpayBoundingBox;
  label: string;
};

/** 수집 결과 1건 (가격은 API 원 단위) */
export type NpayArticleRow = {
  articleNumber: string;
  tradeType: string;
  tradeTypeLabel: string;
  estateType: string;
  estateTypeLabel: string;
  complexName: string;
  articleName: string;
  dongName: string;
  exclusiveArea: number | null;
  supplyArea: number | null;
  landArea: number | null;
  floorInfo: string;
  direction: string;
  dealPrice: number;
  warrantyPrice: number;
  rentPrice: number;
  managementFee: number;
  city: string;
  division: string;
  sector: string;
  legalDivisionNumber: string;
  latitude: number | null;
  longitude: number | null;
  realtorName: string;
  confirmationDate: string;
  approvalDate: string;
  approvalElapsedYear: number | null;
  feature: string;
  articleUrl: string;
  isDuplicate: boolean;
};

export type NpayComplexRow = {
  complexNumber: number;
  complexName: string;
  pyeongTypeNumber: number | null;
  pyeongName: string;
  supplyArea: number | null;
  exclusiveArea: number | null;
  city: string;
  division: string;
  sector: string;
  legalDivisionNumber: string;
  roadName: string;
  jibun: string;
  latitude: number | null;
  longitude: number | null;
  totalHouseholds: number | null;
  dongCount: number | null;
  highestFloor: number | null;
  useApprovalDate: string;
  useApprovalYear: number | null;
  constructionCompany: string;
  heating: string;
  parking: string;
  complexUrl: string;
};
