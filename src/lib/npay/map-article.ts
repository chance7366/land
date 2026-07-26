import {
  directionLabel,
  estateTypeLabel,
  tradeTypeLabel,
} from "./codes";
import type { NpayArticleRow, NpayRegion } from "./types";

function toInt(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function toFloat(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function asRec(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

export function mapNpayArticle(
  raw: Record<string, unknown>,
  region: NpayRegion,
  isDuplicate = false,
): NpayArticleRow | null {
  const articleNumber = String(raw.articleNumber ?? "").trim();
  if (!articleNumber) return null;

  const detail = asRec(raw.articleDetail);
  const space = asRec(raw.spaceInfo);
  const price = asRec(raw.priceInfo);
  const address = asRec(raw.address);
  const coords = asRec(address.coordinates);
  const broker = asRec(raw.brokerInfo);
  const verification = asRec(raw.verificationInfo);
  const building = asRec(raw.buildingInfo);

  const tradeType = String(raw.tradeType ?? "");
  const estateType = String(raw.realEstateType ?? "");
  const approvalDate = String(building.buildingConjunctionDate ?? "");

  return {
    articleNumber,
    tradeType,
    tradeTypeLabel: tradeTypeLabel(tradeType),
    estateType,
    estateTypeLabel: estateTypeLabel(estateType),
    complexName: String(raw.complexName ?? ""),
    articleName: String(raw.articleName ?? raw.complexName ?? ""),
    dongName: String(raw.dongName ?? ""),
    exclusiveArea: toFloat(space.exclusiveSpace),
    supplyArea: toFloat(space.supplySpace),
    landArea: toFloat(space.landSpace),
    floorInfo: String(detail.floorInfo ?? ""),
    direction: directionLabel(String(detail.direction ?? "")),
    dealPrice: toInt(price.dealPrice) ?? 0,
    warrantyPrice: toInt(price.warrantyPrice) ?? 0,
    rentPrice: toInt(price.rentPrice) ?? 0,
    managementFee: toInt(price.managementFeeAmount) ?? 0,
    city: String(address.city || region.city),
    division: String(address.division || region.division),
    sector: String(address.sector || region.sector),
    legalDivisionNumber: region.legalDivisionNumber,
    latitude: toFloat(coords.yCoordinate),
    longitude: toFloat(coords.xCoordinate),
    realtorName: String(broker.brokerageName ?? ""),
    confirmationDate: String(verification.articleConfirmDate ?? ""),
    approvalDate,
    approvalElapsedYear: toInt(building.approvalElapsedYear),
    feature: String(detail.articleFeatureDescription ?? ""),
    articleUrl: `https://fin.land.naver.com/articles/${articleNumber}`,
    isDuplicate,
  };
}
