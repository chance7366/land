import type { PropertyCategory, PropertyType } from "@prisma/client";
import { propertyTypeLabel } from "@/lib/format";
import { PROPERTY_CATEGORIES } from "@/lib/property-fields";

export type CategoryUiStyle = {
  icon: string;
  borderTop: string;
  borderLeft: string;
  badge: string;
  badgeSolid: string;
  placeholder: string;
  filterActive: string;
  filterInactive: string;
  priceAccent: string;
};

export type DealUiStyle = {
  chipActive: string;
  chipInactive: string;
  badge: string;
  priceText: string;
  priceStrip: string;
};

/** Primary navy + blue shades — dark-landing friendly inactive chips */
const SHADE_A: CategoryUiStyle = {
  icon: "apartment",
  borderTop: "border-t-blue-500",
  borderLeft: "border-l-blue-500",
  badge: "bg-cta-from/15 text-blue-300 ring-1 ring-cta-from/30",
  badgeSolid: "bg-cta-from text-white",
  placeholder: "bg-landing-elevated text-blue-400",
  filterActive: "bg-gradient-to-r from-cta-from to-cta-to text-white filter-chip-active scale-[1.02]",
  filterInactive: "bg-landing-elevated text-landing-muted border border-landing-border hover:border-white/20",
  priceAccent: "text-blue-400",
};

const SHADE_B: CategoryUiStyle = {
  icon: "domain",
  borderTop: "border-t-indigo-400",
  borderLeft: "border-l-indigo-400",
  badge: "bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/30",
  badgeSolid: "bg-indigo-500 text-white",
  placeholder: "bg-landing-elevated text-indigo-300",
  filterActive: "bg-indigo-500 text-white filter-chip-active scale-[1.02]",
  filterInactive: "bg-landing-elevated text-landing-muted border border-landing-border hover:border-white/20",
  priceAccent: "text-blue-400",
};

const SHADE_C: CategoryUiStyle = {
  icon: "storefront",
  borderTop: "border-t-cyan-400",
  borderLeft: "border-l-cyan-400",
  badge: "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30",
  badgeSolid: "bg-cyan-500 text-landing-bg",
  placeholder: "bg-landing-elevated text-cyan-300",
  filterActive: "bg-cyan-500 text-landing-bg filter-chip-active scale-[1.02]",
  filterInactive: "bg-landing-elevated text-landing-muted border border-landing-border hover:border-white/20",
  priceAccent: "text-cyan-300",
};

const SHADE_D: CategoryUiStyle = {
  icon: "business",
  borderTop: "border-t-sky-400",
  borderLeft: "border-l-sky-400",
  badge: "bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30",
  badgeSolid: "bg-sky-500 text-landing-bg",
  placeholder: "bg-landing-elevated text-sky-300",
  filterActive: "bg-sky-500 text-landing-bg filter-chip-active scale-[1.02]",
  filterInactive: "bg-landing-elevated text-landing-muted border border-landing-border hover:border-white/20",
  priceAccent: "text-sky-300",
};

const SHADE_E: CategoryUiStyle = {
  icon: "home_work",
  borderTop: "border-t-violet-400",
  borderLeft: "border-l-violet-400",
  badge: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/30",
  badgeSolid: "bg-violet-500 text-white",
  placeholder: "bg-landing-elevated text-violet-300",
  filterActive: "bg-violet-500 text-white filter-chip-active scale-[1.02]",
  filterInactive: "bg-landing-elevated text-landing-muted border border-landing-border hover:border-white/20",
  priceAccent: "text-violet-300",
};

const SHADE_F: CategoryUiStyle = {
  icon: "other_houses",
  borderTop: "border-t-fuchsia-400",
  borderLeft: "border-l-fuchsia-400",
  badge: "bg-fuchsia-500/15 text-fuchsia-300 ring-1 ring-fuchsia-400/30",
  badgeSolid: "bg-fuchsia-500 text-white",
  placeholder: "bg-landing-elevated text-fuchsia-300",
  filterActive: "bg-fuchsia-500 text-white filter-chip-active scale-[1.02]",
  filterInactive: "bg-landing-elevated text-landing-muted border border-landing-border hover:border-white/20",
  priceAccent: "text-fuchsia-300",
};

const SHADE_G: CategoryUiStyle = {
  icon: "landscape",
  borderTop: "border-t-emerald-400",
  borderLeft: "border-l-emerald-400",
  badge: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30",
  badgeSolid: "bg-emerald-500 text-landing-bg",
  placeholder: "bg-landing-elevated text-emerald-300",
  filterActive: "bg-emerald-500 text-landing-bg filter-chip-active scale-[1.02]",
  filterInactive: "bg-landing-elevated text-landing-muted border border-landing-border hover:border-white/20",
  priceAccent: "text-emerald-300",
};

export const CATEGORY_UI: Record<PropertyCategory, CategoryUiStyle> = {
  APARTMENT: { ...SHADE_A, icon: "apartment" },
  OFFICETEL: { ...SHADE_B, icon: "domain" },
  RETAIL: { ...SHADE_C, icon: "storefront" },
  OFFICE: { ...SHADE_D, icon: "business" },
  ROW_HOUSE: { ...SHADE_E, icon: "home_work" },
  MULTI_FAMILY: { ...SHADE_F, icon: "other_houses" },
  LAND: { ...SHADE_G, icon: "landscape" },
  DETACHED: { ...SHADE_E, icon: "cottage" },
  ONE_ROOM: { ...SHADE_F, icon: "bed" },
  FACTORY: { ...SHADE_C, icon: "factory" },
};

export const DEAL_UI: Record<PropertyType, DealUiStyle> = {
  SALE: {
    chipActive: "bg-gradient-to-r from-cta-from to-cta-to text-white filter-chip-active",
    chipInactive: "bg-landing-elevated text-landing-muted border border-landing-border hover:border-white/20",
    badge: "bg-cta-from text-white",
    priceText: "text-blue-400",
    priceStrip: "bg-cta-from/10 border border-cta-from/25",
  },
  RENT: {
    chipActive: "bg-indigo-500 text-white filter-chip-active",
    chipInactive: "bg-landing-elevated text-landing-muted border border-landing-border hover:border-white/20",
    badge: "bg-indigo-500 text-white",
    priceText: "text-indigo-300",
    priceStrip: "bg-indigo-500/10 border border-indigo-400/25",
  },
  PRE_SALE: {
    chipActive: "bg-cyan-500 text-landing-bg filter-chip-active",
    chipInactive: "bg-landing-elevated text-landing-muted border border-landing-border hover:border-white/20",
    badge: "bg-cyan-500 text-landing-bg ring-1 ring-cyan-400/30",
    priceText: "text-cyan-300",
    priceStrip: "bg-cyan-500/10 border border-cyan-400/25",
  },
  SHORT_TERM: {
    chipActive: "bg-violet-500 text-white filter-chip-active",
    chipInactive: "bg-landing-elevated text-landing-muted border border-landing-border hover:border-white/20",
    badge: "bg-violet-500 text-white",
    priceText: "text-violet-300",
    priceStrip: "bg-violet-500/10 border border-violet-400/25",
  },
};

export const TAG_BADGE =
  "rounded bg-error-container text-on-error-container font-bold ring-1 ring-error/20";

export const FILTER_ALL_ACTIVE =
  "bg-gradient-to-r from-cta-from to-cta-to text-white filter-chip-active scale-[1.02]";
export const FILTER_ALL_INACTIVE =
  "bg-landing-elevated text-landing-muted border border-landing-border hover:border-white/20";

/** Section top borders — visible on dark landing */
export const DASHBOARD_SECTION_BORDERS = {
  properties: "border-t-blue-500",
  auctions: "border-t-violet-500",
  news: "border-t-cyan-400",
  legal: "border-t-indigo-300",
} as const;

export function getCategoryUi(category: PropertyCategory) {
  return CATEGORY_UI[category];
}

export function getDealUi(type: PropertyType) {
  return DEAL_UI[type];
}

export function buildFilterSummary(params: {
  category?: string | null;
  deal?: string | null;
  region?: string | null;
  count: number;
}) {
  const parts: string[] = [];
  if (params.category) {
    const found = PROPERTY_CATEGORIES.find((c) => c.value === params.category);
    if (found) parts.push(found.label);
  }
  if (params.deal) {
    parts.push(propertyTypeLabel(params.deal as PropertyType));
  }
  if (params.region) {
    parts.push(params.region);
  }
  parts.push(`${params.count}건`);
  return parts.join(" · ");
}
