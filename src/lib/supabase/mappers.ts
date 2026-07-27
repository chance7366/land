/** Supabase row → 앱(Prisma 형태) 매핑 */

import { repairUtf8Mojibake, repairUtf8MojibakeNullable } from "@/lib/text-encoding";

function s(v: unknown): string {
  return repairUtf8Mojibake(String(v ?? ""));
}

function sn(v: unknown): string | null {
  if (v == null) return null;
  return repairUtf8MojibakeNullable(String(v)) ?? null;
}

export function mapPropertyRow(row: Record<string, unknown>) {
  const specsObj =
    row.specs && typeof row.specs === "object" && !Array.isArray(row.specs)
      ? (row.specs as Record<string, unknown>)
      : {};
  const fromSpecs = <T,>(key: string, fallback: T): T => {
    if (row[key] != null && row[key] !== "") return row[key] as T;
    if (specsObj[key] != null && specsObj[key] !== "") return specsObj[key] as T;
    // camelCase in specs
    const camel = key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
    if (specsObj[camel] != null && specsObj[camel] !== "") return specsObj[camel] as T;
    return fallback;
  };

  return {
    id: String(row.id),
    manageCode: String(row.manage_code ?? ""),
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    type: String(row.type ?? "SALE") as never,
    category: String(row.category ?? "APARTMENT") as never,
    price: Number(row.price ?? 0),
    deposit: row.deposit == null ? null : Number(row.deposit),
    monthlyRent: row.monthly_rent == null ? null : Number(row.monthly_rent),
    isJeonse: Boolean(row.is_jeonse),
    dealSubType: (row.deal_sub_type as string | null) ?? null,
    area: (row.area as string | null) ?? null,
    address: String(row.address ?? ""),
    region: String(row.region ?? ""),
    sido: (fromSpecs("sido", null) as string | null) ?? null,
    sigungu: (fromSpecs("sigungu", null) as string | null) ?? null,
    eupmyeondong: (fromSpecs("eupmyeondong", null) as string | null) ?? null,
    ri: (fromSpecs("ri", null) as string | null) ?? null,
    jibunMain: (fromSpecs("jibunMain", fromSpecs("jibun_main", null)) as string | null) ?? null,
    jibunSub: (fromSpecs("jibunSub", fromSpecs("jibun_sub", null)) as string | null) ?? null,
    buildingName: (row.building_name as string | null) ?? null,
    exclusiveArea: row.exclusive_area == null ? null : Number(row.exclusive_area),
    supplyArea: row.supply_area == null ? null : Number(row.supply_area),
    floor: row.floor == null ? null : Number(row.floor),
    totalFloors: row.total_floors == null ? null : Number(row.total_floors),
    direction: (fromSpecs("direction", null) as string | null) ?? null,
    builtYear: (() => {
      const v = fromSpecs<unknown>("builtYear", fromSpecs("built_year", null));
      return v == null || v === "" ? null : Number(v);
    })(),
    parking: (fromSpecs("parking", null) as string | null) ?? null,
    rooms: (() => {
      const v = fromSpecs<unknown>("rooms", null);
      return v == null || v === "" ? null : Number(v);
    })(),
    bathrooms: (() => {
      const v = fromSpecs<unknown>("bathrooms", null);
      return v == null || v === "" ? null : Number(v);
    })(),
    unitDong: (fromSpecs("unitDong", fromSpecs("unit_dong", null)) as string | null) ?? null,
    unitHo: (fromSpecs("unitHo", fromSpecs("unit_ho", null)) as string | null) ?? null,
    maintenanceFee: (() => {
      const v = fromSpecs<unknown>("maintenanceFee", fromSpecs("maintenance_fee", null));
      return v == null || v === "" ? null : Number(v);
    })(),
    keyMoney: (() => {
      const v = fromSpecs<unknown>("keyMoney", fromSpecs("key_money", null));
      return v == null || v === "" ? null : Number(v);
    })(),
    keyMoneyHidden: Boolean(fromSpecs("keyMoneyHidden", fromSpecs("key_money_hidden", false))),
    vatIncluded: (() => {
      const v = fromSpecs<unknown>("vatIncluded", fromSpecs("vat_included", null));
      return v == null || v === "" ? null : Boolean(v);
    })(),
    businessType: (fromSpecs("businessType", fromSpecs("business_type", null)) as string | null) ?? null,
    landCategory: (fromSpecs("landCategory", fromSpecs("land_category", null)) as string | null) ?? null,
    zoning: (fromSpecs("zoning", null) as string | null) ?? null,
    loanStatus: (fromSpecs("loanStatus", fromSpecs("loan_status", null)) as string | null) ?? null,
    moveInType: (fromSpecs("moveInType", fromSpecs("move_in_type", null)) as string | null) ?? null,
    featureSummary:
      (fromSpecs("featureSummary", fromSpecs("feature_summary", null)) as string | null) ?? null,
    ownerName: (fromSpecs("ownerName", fromSpecs("owner_name", null)) as string | null) ?? null,
    ownerRelation:
      (fromSpecs("ownerRelation", fromSpecs("owner_relation", null)) as string | null) ?? null,
    ownerPhone: (fromSpecs("ownerPhone", fromSpecs("owner_phone", null)) as string | null) ?? null,
    clientName: (fromSpecs("clientName", fromSpecs("client_name", null)) as string | null) ?? null,
    naverComplexId:
      (fromSpecs("naverComplexId", fromSpecs("naver_complex_id", null)) as string | null) ?? null,
    naverDongId: (fromSpecs("naverDongId", fromSpecs("naver_dong_id", null)) as string | null) ?? null,
    specs: JSON.stringify(specsObj),
    tags: JSON.stringify(row.tags ?? []),
    moveInDate: (fromSpecs("moveInDate", fromSpecs("move_in_date", null)) as string | null) ?? null,
    images: JSON.stringify(row.images ?? []),
    featured: Boolean(row.featured),
    status: String(row.status ?? "ACTIVE") as never,
    publishedAt: new Date(String(row.published_at ?? Date.now())),
    createdAt: new Date(String(row.created_at ?? Date.now())),
    updatedAt: new Date(String(row.updated_at ?? Date.now())),
  };
}

export function mapAuctionRow(row: Record<string, unknown>) {
  const caseDetailRaw =
    row.case_detail_json == null
      ? null
      : typeof row.case_detail_json === "string"
        ? row.case_detail_json
        : JSON.stringify(row.case_detail_json);

  return {
    id: String(row.id),
    manageCode: s(row.manage_code),
    caseNumber: s(row.case_number),
    itemNo: Number(row.item_no ?? 1),
    title: s(row.title),
    description: s(row.description),
    appraisalPrice: Number(row.appraisal_price ?? 0),
    recommendedPrice: Number(row.recommended_price ?? 0),
    safetyGrade: String(row.safety_grade ?? "SAFE") as never,
    status: String(row.status ?? "ONGOING") as never,
    dDay: Number(row.d_day ?? 0),
    images: JSON.stringify(row.images ?? []),
    reportUrl: (row.report_url as string | null) ?? null,
    generalReportUrl: (row.general_report_url as string | null) ?? null,
    court: sn(row.court),
    saleDate: row.sale_date ? new Date(String(row.sale_date)) : null,
    address: sn(row.address),
    address2: sn(row.address2),
    region: sn(row.region),
    auctionType: sn(row.auction_type),
    itemType: sn(row.item_type),
    auctionTarget: sn(row.auction_target),
    bidMethod: sn(row.bid_method),
    landArea: row.land_area == null ? null : Number(row.land_area),
    buildingArea: row.building_area == null ? null : Number(row.building_area),
    minPrice: row.min_price == null ? null : Number(row.min_price),
    bidDeposit: row.bid_deposit == null ? null : Number(row.bid_deposit),
    claimAmount: row.claim_amount == null ? null : Number(row.claim_amount),
    debtorOwner: sn(row.debtor_owner),
    creditor: sn(row.creditor),
    attachments: JSON.stringify(row.attachments ?? []),
    rightsAnalysis: sn(row.rights_analysis),
    caseDetailJson: caseDetailRaw == null ? null : repairUtf8Mojibake(caseDetailRaw),
    memo: sn(row.memo),
    winningPrice: row.winning_price == null ? null : Number(row.winning_price),
    winningRatio: row.winning_ratio == null ? null : Number(row.winning_ratio),
    bidderCount: row.bidder_count == null ? null : Number(row.bidder_count),
    secondBidAmount: row.second_bid_amount == null ? null : Number(row.second_bid_amount),
    featured: Boolean(row.featured),
    publishedAt: new Date(String(row.published_at ?? Date.now())),
    createdAt: new Date(String(row.created_at ?? Date.now())),
    updatedAt: new Date(String(row.updated_at ?? Date.now())),
  };
}

export function mapLegalRow(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    category: String(row.category ?? ""),
    question: String(row.question ?? ""),
    content: String(row.content ?? ""),
    authorName: String(row.author_name ?? ""),
    phone: (row.phone as string | null) ?? null,
    answer: (row.answer as string | null) ?? null,
    answerer: (row.answerer as string | null) ?? null,
    status: String(row.status ?? "PENDING") as never,
    isPublic: Boolean(row.is_public),
    isSecret: Boolean(row.is_secret),
    accessCode: String(row.access_code ?? ""),
    suggestConsult: Boolean(row.suggest_consult),
    answeredAt: row.answered_at ? new Date(String(row.answered_at)) : null,
    createdAt: new Date(String(row.created_at ?? Date.now())),
    updatedAt: new Date(String(row.updated_at ?? Date.now())),
  };
}

export function mapStoryRow(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    category: String(row.category ?? ""),
    title: String(row.title ?? ""),
    content: String(row.content ?? ""),
    authorName: String(row.author_name ?? ""),
    status: String(row.status ?? "PUBLISHED") as never,
    createdAt: new Date(String(row.created_at ?? Date.now())),
    updatedAt: new Date(String(row.updated_at ?? Date.now())),
  };
}
