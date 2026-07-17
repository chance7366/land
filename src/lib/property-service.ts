import type { Prisma, PropertyCategory, PropertyType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { PropertyListFilters } from "@/lib/property-fields";
import {
  collectSpecsFromBody,
  validatePropertyForm,
} from "@/lib/property-naver/validation";

export async function getProperties(filters: PropertyListFilters = {}) {
  const where: Prisma.PropertyWhereInput = {
    status: "ACTIVE",
  };
  const and: Prisma.PropertyWhereInput[] = [];

  const categories = filters.categories?.length
    ? filters.categories
    : filters.category
      ? [filters.category]
      : [];
  if (categories.length) and.push({ category: { in: categories } });

  if (filters.deals?.length) {
    const dealOr: Prisma.PropertyWhereInput[] = [];
    if (filters.deals.includes("SALE")) dealOr.push({ type: "SALE" });
    if (filters.deals.includes("SHORT_TERM")) dealOr.push({ type: "SHORT_TERM" });
    if (filters.deals.includes("JEONSE")) dealOr.push({ type: "RENT", isJeonse: true });
    if (filters.deals.includes("MONTHLY")) dealOr.push({ type: "RENT", isJeonse: false });
    if (dealOr.length) and.push({ OR: dealOr });
  } else if (filters.type) {
    and.push({ type: filters.type });
  }

  const regions = filters.regions?.length
    ? filters.regions
    : filters.region
      ? [filters.region]
      : [];
  if (regions.length) {
    and.push({
      OR: [{ sigungu: { in: regions } }, { region: { in: regions } }],
    });
  }

  if (and.length) where.AND = and;

  let orderBy: Prisma.PropertyOrderByWithRelationInput = { publishedAt: "desc" };
  if (filters.sort === "price_asc") orderBy = { price: "asc" };
  if (filters.sort === "price_desc") orderBy = { price: "desc" };

  return prisma.property.findMany({ where, orderBy });
}

export async function getPropertyCategoryCounts() {
  const rows = await prisma.property.findMany({
    where: { status: "ACTIVE" },
    select: { category: true },
  });

  const counts = {} as Record<PropertyCategory, number>;
  for (const row of rows) {
    counts[row.category] = (counts[row.category] ?? 0) + 1;
  }
  return counts;
}

export async function getAllPropertiesAdmin(filters?: {
  category?: PropertyCategory;
  type?: PropertyType;
  status?: string;
}) {
  const where: Prisma.PropertyWhereInput = {};
  if (filters?.category) where.category = filters.category;
  if (filters?.type) where.type = filters.type;
  if (filters?.status) where.status = filters.status as Prisma.PropertyWhereInput["status"];

  return prisma.property.findMany({ where, orderBy: { updatedAt: "desc" } });
}

export type PropertyInput = {
  manageCode?: string | null;
  title: string;
  description: string;
  type: PropertyType;
  category: PropertyCategory;
  price: number;
  deposit?: number | null;
  monthlyRent?: number | null;
  isJeonse?: boolean;
  dealSubType?: string | null;
  address: string;
  region: string;
  sido?: string | null;
  sigungu?: string | null;
  eupmyeondong?: string | null;
  ri?: string | null;
  jibunMain?: string | null;
  jibunSub?: string | null;
  buildingName?: string | null;
  exclusiveArea?: number | null;
  supplyArea?: number | null;
  floor?: number | null;
  totalFloors?: number | null;
  direction?: string | null;
  builtYear?: number | null;
  parking?: string | null;
  rooms?: number | null;
  bathrooms?: number | null;
  unitDong?: string | null;
  unitHo?: string | null;
  maintenanceFee?: number | null;
  keyMoney?: number | null;
  keyMoneyHidden?: boolean;
  vatIncluded?: boolean | null;
  businessType?: string | null;
  landCategory?: string | null;
  zoning?: string | null;
  loanStatus?: string | null;
  moveInType?: string | null;
  featureSummary?: string | null;
  ownerName?: string | null;
  ownerRelation?: string | null;
  ownerPhone?: string | null;
  clientName?: string | null;
  naverComplexId?: string | null;
  naverDongId?: string | null;
  specs?: Record<string, unknown>;
  tags?: string[];
  moveInDate?: string | null;
  images?: string[];
  featured?: boolean;
  status?: "ACTIVE" | "SOLD" | "HIDDEN";
  publishedAt?: string | Date | null;
};

function numOrNull(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function strOrNull(v: unknown): string | null {
  if (v == null || v === "") return null;
  return String(v);
}

function composeAddress(input: {
  address?: string;
  sido?: string | null;
  sigungu?: string | null;
  eupmyeondong?: string | null;
  ri?: string | null;
  jibunMain?: string | null;
  jibunSub?: string | null;
  buildingName?: string | null;
  unitDong?: string | null;
  unitHo?: string | null;
}): string {
  if (input.address?.trim()) return input.address.trim();
  const jibun =
    input.jibunMain != null
      ? input.jibunSub
        ? `${input.jibunMain}-${input.jibunSub}`
        : input.jibunMain
      : "";
  return [
    input.sido,
    input.sigungu,
    input.eupmyeondong,
    input.ri,
    jibun,
    input.buildingName,
    input.unitDong ? `${input.unitDong}동` : null,
    input.unitHo ? `${input.unitHo}호` : null,
  ]
    .filter(Boolean)
    .join(" ");
}

function composeRegion(input: { region?: string; sigungu?: string | null; eupmyeondong?: string | null }): string {
  if (input.region?.trim()) return input.region.trim();
  return input.eupmyeondong || input.sigungu || "기타";
}

export function toPropertyCreateData(input: PropertyInput & { manageCode: string }): Prisma.PropertyCreateInput {
  const isJeonse =
    input.isJeonse ?? (input.dealSubType === "JEONSE" || (input.type === "RENT" && !input.monthlyRent));

  return {
    manageCode: input.manageCode,
    title: input.title,
    description: input.description,
    type: input.type,
    category: input.category,
    price: input.price,
    deposit: input.deposit ?? null,
    monthlyRent: input.monthlyRent ?? null,
    isJeonse,
    dealSubType: input.dealSubType ?? (isJeonse ? "JEONSE" : input.type === "RENT" || input.type === "SHORT_TERM" ? "MONTHLY" : null),
    address: composeAddress(input),
    region: composeRegion(input),
    sido: input.sido ?? null,
    sigungu: input.sigungu ?? null,
    eupmyeondong: input.eupmyeondong ?? null,
    ri: input.ri ?? null,
    jibunMain: input.jibunMain ?? null,
    jibunSub: input.jibunSub ?? null,
    buildingName: input.buildingName ?? null,
    exclusiveArea: input.exclusiveArea ?? null,
    supplyArea: input.supplyArea ?? null,
    floor: input.floor ?? null,
    totalFloors: input.totalFloors ?? null,
    direction: input.direction ?? null,
    builtYear: input.builtYear ?? null,
    parking: input.parking ?? null,
    rooms: input.rooms ?? null,
    bathrooms: input.bathrooms ?? null,
    unitDong: input.unitDong ?? null,
    unitHo: input.unitHo ?? null,
    maintenanceFee: input.maintenanceFee ?? null,
    keyMoney: input.keyMoney ?? null,
    keyMoneyHidden: input.keyMoneyHidden ?? false,
    vatIncluded: input.vatIncluded ?? null,
    businessType: input.businessType ?? null,
    landCategory: input.landCategory ?? null,
    zoning: input.zoning ?? null,
    loanStatus: input.loanStatus ?? null,
    moveInType: input.moveInType ?? null,
    featureSummary: input.featureSummary ?? null,
    ownerName: input.ownerName ?? null,
    ownerRelation: input.ownerRelation ?? null,
    ownerPhone: input.ownerPhone ?? null,
    clientName: input.clientName ?? null,
    naverComplexId: input.naverComplexId ?? null,
    naverDongId: input.naverDongId ?? null,
    specs: JSON.stringify(input.specs ?? {}),
    tags: JSON.stringify(input.tags ?? []),
    moveInDate: input.moveInDate ?? null,
    images: JSON.stringify(input.images ?? []),
    featured: input.featured ?? false,
    status: input.status ?? "ACTIVE",
    publishedAt: parsePublishedAt(input.publishedAt),
  };
}

function parsePublishedAt(value: string | Date | null | undefined): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00`);
  }
  if (typeof value === "string") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

export function parsePropertyBody(
  body: Record<string, unknown>,
): { ok: true; data: PropertyInput } | { ok: false; error: string } {
  const category = body.category as PropertyCategory;
  const specs = collectSpecsFromBody(body, category);
  const validation = validatePropertyForm(body, specs);
  if (!validation.ok) {
    return { ok: false, error: validation.error };
  }

  if (!body.title || typeof body.title !== "string") {
    return { ok: false, error: "매물 제목이 필요합니다." };
  }
  if (!body.description || typeof body.description !== "string") {
    return { ok: false, error: "상세 설명이 필요합니다." };
  }

  const address = composeAddress({
    address: typeof body.address === "string" ? body.address : undefined,
    sido: strOrNull(body.sido),
    sigungu: strOrNull(body.sigungu),
    eupmyeondong: strOrNull(body.eupmyeondong),
    ri: strOrNull(body.ri),
    jibunMain: strOrNull(body.jibunMain),
    jibunSub: strOrNull(body.jibunSub),
    buildingName: strOrNull(body.buildingName),
    unitDong: strOrNull(body.unitDong),
    unitHo: strOrNull(body.unitHo),
  });

  if (!address) {
    return { ok: false, error: "소재지 정보가 필요합니다." };
  }

  const dealSubType = strOrNull(body.dealSubType);
  const isJeonse = Boolean(body.isJeonse) || dealSubType === "JEONSE";

  return {
    ok: true,
    data: {
      manageCode: strOrNull(body.manageCode),
      title: body.title as string,
      description: body.description as string,
      type: body.type as PropertyType,
      category,
      price: numOrNull(body.price) ?? 0,
      deposit: numOrNull(body.deposit),
      monthlyRent: numOrNull(body.monthlyRent),
      isJeonse,
      dealSubType,
      address,
      region: composeRegion({
        region: typeof body.region === "string" ? body.region : undefined,
        sigungu: strOrNull(body.sigungu),
        eupmyeondong: strOrNull(body.eupmyeondong),
      }),
      sido: strOrNull(body.sido),
      sigungu: strOrNull(body.sigungu),
      eupmyeondong: strOrNull(body.eupmyeondong),
      ri: strOrNull(body.ri),
      jibunMain: strOrNull(body.jibunMain),
      jibunSub: strOrNull(body.jibunSub),
      buildingName: strOrNull(body.buildingName),
      exclusiveArea: numOrNull(body.exclusiveArea),
      supplyArea: numOrNull(body.supplyArea),
      floor: numOrNull(body.floor),
      totalFloors: numOrNull(body.totalFloors),
      direction: strOrNull(body.direction),
      builtYear: numOrNull(body.builtYear),
      parking: strOrNull(body.parking),
      rooms: numOrNull(body.rooms),
      bathrooms: numOrNull(body.bathrooms),
      unitDong: strOrNull(body.unitDong),
      unitHo: strOrNull(body.unitHo),
      maintenanceFee: numOrNull(body.maintenanceFee),
      keyMoney: numOrNull(body.keyMoney),
      keyMoneyHidden: Boolean(body.keyMoneyHidden),
      vatIncluded: body.vatIncluded == null ? null : Boolean(body.vatIncluded),
      businessType: strOrNull(body.businessType),
      landCategory: strOrNull(body.landCategory),
      zoning: strOrNull(body.zoning),
      loanStatus: strOrNull(body.loanStatus),
      moveInType: strOrNull(body.moveInType),
      featureSummary: strOrNull(body.featureSummary),
      ownerName: strOrNull(body.ownerName),
      ownerRelation: strOrNull(body.ownerRelation),
      ownerPhone: strOrNull(body.ownerPhone),
      clientName: strOrNull(body.clientName),
      naverComplexId: strOrNull(body.naverComplexId),
      naverDongId: strOrNull(body.naverDongId),
      specs,
      tags: Array.isArray(body.tags) ? (body.tags as string[]) : [],
      moveInDate:
        body.moveInType === "지정일" ? strOrNull(body.moveInDate) : null,
      images: Array.isArray(body.images)
        ? (body.images as string[]).filter(Boolean).slice(0, 5)
        : [],
      featured: Boolean(body.featured),
      status: (body.status as PropertyInput["status"]) ?? "ACTIVE",
      publishedAt: strOrNull(body.publishedAt),
    },
  };
}
