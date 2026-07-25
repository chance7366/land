import type { RtmsDealType, RtmsPropertyType } from "./types";

export type RtmsEndpoint = {
  propertyType: RtmsPropertyType;
  dealType: RtmsDealType;
  service: string;
  operation: string;
};

const BASE = "https://apis.data.go.kr/1613000";

/** 국토부 RTMS 서비스 엔드포인트 */
export const RTMS_ENDPOINTS: RtmsEndpoint[] = [
  {
    propertyType: "APT",
    dealType: "SALE",
    service: "RTMSDataSvcAptTradeDev",
    operation: "getRTMSDataSvcAptTradeDev",
  },
  {
    propertyType: "APT",
    dealType: "RENT",
    service: "RTMSDataSvcAptRent",
    operation: "getRTMSDataSvcAptRent",
  },
  {
    propertyType: "APT",
    dealType: "RIGHT",
    service: "RTMSDataSvcAptRight",
    operation: "getRTMSDataSvcAptRight",
  },
  {
    propertyType: "OFFICETEL",
    dealType: "SALE",
    service: "RTMSDataSvcOffiTrade",
    operation: "getRTMSDataSvcOffiTrade",
  },
  {
    propertyType: "OFFICETEL",
    dealType: "RENT",
    service: "RTMSDataSvcOffiRent",
    operation: "getRTMSDataSvcOffiRent",
  },
  {
    propertyType: "TOWNHOUSE",
    dealType: "SALE",
    service: "RTMSDataSvcRHTrade",
    operation: "getRTMSDataSvcRHTrade",
  },
  {
    propertyType: "TOWNHOUSE",
    dealType: "RENT",
    service: "RTMSDataSvcRHRent",
    operation: "getRTMSDataSvcRHRent",
  },
  {
    propertyType: "SINGLE_HOUSE",
    dealType: "SALE",
    service: "RTMSDataSvcSHTrade",
    operation: "getRTMSDataSvcSHTrade",
  },
  {
    propertyType: "SINGLE_HOUSE",
    dealType: "RENT",
    service: "RTMSDataSvcSHRent",
    operation: "getRTMSDataSvcSHRent",
  },
  {
    propertyType: "COMMERCIAL",
    dealType: "SALE",
    service: "RTMSDataSvcNrgTrade",
    operation: "getRTMSDataSvcNrgTrade",
  },
  {
    propertyType: "COMMERCIAL",
    dealType: "RENT",
    service: "RTMSDataSvcNrgRent",
    operation: "getRTMSDataSvcNrgRent",
  },
  {
    propertyType: "FACTORY",
    dealType: "SALE",
    service: "RTMSDataSvcNrgTrade",
    operation: "getRTMSDataSvcNrgTrade",
  },
  {
    propertyType: "FACTORY",
    dealType: "RENT",
    service: "RTMSDataSvcNrgRent",
    operation: "getRTMSDataSvcNrgRent",
  },
  {
    propertyType: "LAND",
    dealType: "SALE",
    service: "RTMSDataSvcLandTrade",
    operation: "getRTMSDataSvcLandTrade",
  },
];

export function rtmsUrl(ep: RtmsEndpoint): string {
  return `${BASE}/${ep.service}/${ep.operation}`;
}

export function findEndpoint(
  propertyType: RtmsPropertyType,
  dealType: RtmsDealType,
): RtmsEndpoint | undefined {
  return RTMS_ENDPOINTS.find(
    (e) => e.propertyType === propertyType && e.dealType === dealType,
  );
}
