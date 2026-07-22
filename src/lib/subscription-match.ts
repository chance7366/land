import type { Auction, Property } from "@prisma/client";
import type {
  AuctionPreferences,
  RealEstatePreferences,
  SubscriptionPreferences,
  SubscriptionType,
} from "@/lib/subscription";

function haystackIncludesAny(haystack: string, needles: string[]): boolean {
  const h = haystack.toLowerCase();
  return needles.some((n) => h.includes(n.trim().toLowerCase()));
}

function propertyDealKey(property: Property): "SALE" | "JEONSE" | "MONTHLY" | "OTHER" {
  if (property.type === "SALE" || property.type === "PRE_SALE") return "SALE";
  if (property.type === "RENT" || property.type === "SHORT_TERM") {
    return property.isJeonse || property.dealSubType === "JEONSE" ? "JEONSE" : "MONTHLY";
  }
  return "OTHER";
}

export function matchesProperty(
  property: Property,
  preferences: SubscriptionPreferences,
): boolean {
  const prefs = preferences as RealEstatePreferences;
  if (!prefs.regions?.length || !prefs.categories?.length || !prefs.deals?.length) return false;
  if (property.status !== "ACTIVE") return false;

  if (!prefs.categories.includes(property.category)) return false;

  const deal = propertyDealKey(property);
  if (deal === "OTHER" || !prefs.deals.includes(deal)) return false;

  const regionText = [property.region, property.sigungu, property.eupmyeondong, property.address]
    .filter(Boolean)
    .join(" ");
  return haystackIncludesAny(regionText, prefs.regions);
}

export function matchesAuction(
  auction: Auction,
  preferences: SubscriptionPreferences,
): boolean {
  const prefs = preferences as AuctionPreferences;
  if (!prefs.regions?.length || !prefs.itemTypes?.length) return false;
  if (auction.status !== "ONGOING") return false;

  const typeText = [auction.itemType, auction.auctionType, auction.auctionTarget, auction.title]
    .filter(Boolean)
    .join(" ");
  if (!haystackIncludesAny(typeText, prefs.itemTypes)) return false;

  if (prefs.appraisalMin != null && auction.appraisalPrice < prefs.appraisalMin) return false;
  if (prefs.appraisalMax != null && auction.appraisalPrice > prefs.appraisalMax) return false;

  const regionText = [auction.region, auction.address, auction.court].filter(Boolean).join(" ");
  return haystackIncludesAny(regionText, prefs.regions);
}

export function matchesEntity(
  subscriptionType: SubscriptionType,
  entity: Property | Auction,
  preferences: SubscriptionPreferences,
): boolean {
  if (subscriptionType === "NEWS") return false;
  if (subscriptionType === "REAL_ESTATE") {
    return matchesProperty(entity as Property, preferences);
  }
  return matchesAuction(entity as Auction, preferences);
}
