import type { PropertyInput } from "@/lib/property-service";
import type { AuctionInput } from "@/lib/auction-service";
import { calcDDay } from "@/lib/auction-service";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mapAuctionRow, mapPropertyRow } from "@/lib/supabase/mappers";

function parseSaleDate(value: string | null | undefined): string | null {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value}T00:00:00.000Z`;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function propertyInputToRow(input: PropertyInput & { manageCode: string }) {
  const isJeonse =
    input.isJeonse ??
    (input.dealSubType === "JEONSE" || (input.type === "RENT" && !input.monthlyRent));

  return {
    manage_code: input.manageCode,
    title: input.title,
    description: input.description ?? "",
    type: input.type,
    category: input.category,
    price: Number(input.price ?? 0),
    deposit: input.deposit ?? null,
    monthly_rent: input.monthlyRent ?? null,
    is_jeonse: Boolean(isJeonse),
    deal_sub_type:
      input.dealSubType ??
      (isJeonse ? "JEONSE" : input.type === "RENT" || input.type === "SHORT_TERM" ? "MONTHLY" : null),
    area: input.exclusiveArea != null ? String(input.exclusiveArea) : null,
    address: input.address ?? "",
    region: input.region ?? "내포신도시",
    building_name: input.buildingName ?? null,
    exclusive_area: input.exclusiveArea ?? null,
    supply_area: input.supplyArea ?? null,
    floor: input.floor ?? null,
    total_floors: input.totalFloors ?? null,
    images: input.images ?? [],
    tags: input.tags ?? [],
    specs: input.specs ?? {},
    featured: Boolean(input.featured),
    status: input.status ?? "ACTIVE",
    published_at: input.publishedAt
      ? new Date(input.publishedAt).toISOString()
      : new Date().toISOString(),
  };
}

export function auctionInputToRow(input: AuctionInput & { manageCode: string }) {
  const saleIso = parseSaleDate(input.saleDate ?? null);
  const saleDate = saleIso ? new Date(saleIso) : null;
  const appraisalPrice = Number(input.appraisalPrice ?? 0);
  const minPrice = input.minPrice != null ? Number(input.minPrice) : null;
  const recommendedPrice =
    input.recommendedPrice != null && Number(input.recommendedPrice) > 0
      ? Number(input.recommendedPrice)
      : minPrice != null && minPrice > 0
        ? minPrice
        : appraisalPrice;

  return {
    manage_code: input.manageCode,
    case_number: input.caseNumber.trim(),
    item_no:
      input.itemNo != null && Number.isFinite(Number(input.itemNo))
        ? Math.max(1, Math.round(Number(input.itemNo)))
        : 1,
    title: input.title.trim(),
    description:
      input.description?.trim() ||
      input.memo?.trim() ||
      input.rightsAnalysis?.trim() ||
      "",
    appraisal_price: appraisalPrice,
    recommended_price: recommendedPrice,
    min_price: minPrice,
    bid_deposit: input.bidDeposit != null ? Number(input.bidDeposit) : null,
    claim_amount: input.claimAmount != null ? Number(input.claimAmount) : null,
    safety_grade: input.safetyGrade ?? "SAFE",
    status: input.status ?? "ONGOING",
    d_day: calcDDay(saleDate),
    images: input.images ?? [],
    attachments: input.attachments ?? [],
    address: input.address ?? null,
    address2: input.address2 ?? null,
    region: input.region ?? null,
    court: input.court ?? null,
    auction_type: input.auctionType ?? null,
    item_type: input.itemType ?? null,
    auction_target: input.auctionTarget ?? null,
    bid_method: input.bidMethod ?? null,
    land_area: input.landArea ?? null,
    building_area: input.buildingArea ?? null,
    debtor_owner: input.debtorOwner ?? null,
    creditor: input.creditor ?? null,
    rights_analysis: input.rightsAnalysis ?? null,
    case_detail_json: input.caseDetailJson ?? null,
    memo: input.memo ?? null,
    winning_price: input.winningPrice != null ? Number(input.winningPrice) : null,
    winning_ratio: input.winningRatio != null ? Number(input.winningRatio) : null,
    bidder_count: input.bidderCount != null ? Math.round(Number(input.bidderCount)) : null,
    second_bid_amount:
      input.secondBidAmount != null ? Number(input.secondBidAmount) : null,
    report_url: input.reportUrl ?? null,
    sale_date: saleIso,
    featured: Boolean(input.featured),
    published_at: new Date().toISOString(),
  };
}

export async function listAllPropertiesAdminSupabase() {
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("properties")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapPropertyRow);
}

export async function listAllAuctionsAdminSupabase() {
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("auctions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapAuctionRow);
}

export async function findPropertyByManageCodeSupabase(manageCode: string) {
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("properties")
    .select("*")
    .eq("manage_code", manageCode)
    .maybeSingle();
  if (error) throw error;
  return data ? mapPropertyRow(data) : null;
}

export async function findAuctionByManageCodeSupabase(manageCode: string) {
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("auctions")
    .select("*")
    .eq("manage_code", manageCode)
    .maybeSingle();
  if (error) throw error;
  return data ? mapAuctionRow(data) : null;
}

export async function findAuctionByCaseSupabase(caseNumber: string, itemNo: number) {
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("auctions")
    .select("*")
    .eq("case_number", caseNumber)
    .eq("item_no", itemNo)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? mapAuctionRow(data) : null;
}

export async function createPropertySupabase(input: PropertyInput & { manageCode: string }) {
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("properties")
    .insert(propertyInputToRow(input))
    .select("*")
    .single();
  if (error) throw error;
  return mapPropertyRow(data);
}

export async function updatePropertySupabase(
  id: string,
  input: PropertyInput & { manageCode: string },
) {
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("properties")
    .update(propertyInputToRow(input))
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return mapPropertyRow(data);
}

export async function deletePropertySupabase(id: string) {
  const sb = createSupabaseAdminClient();
  const { error } = await sb.from("properties").delete().eq("id", id);
  if (error) throw error;
}

export async function createAuctionSupabase(input: AuctionInput & { manageCode: string }) {
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("auctions")
    .insert(auctionInputToRow(input))
    .select("*")
    .single();
  if (error) throw error;
  return mapAuctionRow(data);
}

export async function updateAuctionSupabase(
  id: string,
  input: AuctionInput & { manageCode: string },
) {
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("auctions")
    .update(auctionInputToRow(input))
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return mapAuctionRow(data);
}

/** report_url 컬럼만 갱신 (전체 AuctionInput 재전송 없음) */
export async function patchAuctionReportUrlSupabase(id: string, reportUrl: string) {
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("auctions")
    .update({ report_url: reportUrl, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return mapAuctionRow(data);
}

export async function deleteAuctionSupabase(id: string) {
  const sb = createSupabaseAdminClient();
  const { error } = await sb.from("auctions").delete().eq("id", id);
  if (error) throw error;
}

export async function allocateNextManageCodeSupabase(kind: "PROPERTY" | "AUCTION") {
  const sb = createSupabaseAdminClient();
  const table = kind === "PROPERTY" ? "properties" : "auctions";
  const prefix = kind === "PROPERTY" ? "매물_" : "경매_";
  const { data, error } = await sb.from(table).select("manage_code");
  if (error) throw error;
  let max = 0;
  for (const row of data ?? []) {
    const code = String((row as { manage_code?: string }).manage_code ?? "");
    const m = new RegExp(`^${prefix}(\\d{1,8})$`).exec(code);
    if (!m) continue;
    const n = Number(m[1]);
    if (Number.isFinite(n) && n > max) max = n;
  }
  const next = max + 1;
  return `${prefix}${String(next).padStart(8, "0")}`;
}

/** 데모 데이터 upsert — Vercel에서 한 번 호출하면 홈에 바로 보임 */
export async function seedDemoCatalogSupabase() {
  const sb = createSupabaseAdminClient();

  const properties = [
    {
      manage_code: "매물_DEMO_001",
      title: "내포신도시 센트럴자이 84㎡",
      description: "학군·생활편의 우수. 즉시 입주 가능.",
      type: "SALE",
      category: "APARTMENT",
      // 가격·보증금·월세는 앱 규칙상 '만원' 단위
      price: 38500,
      address: "충남 홍성군 홍북읍 신경리",
      region: "내포신도시",
      building_name: "센트럴자이",
      exclusive_area: 84.5,
      floor: 12,
      total_floors: 25,
      images: [],
      tags: ["즉시입주", "학군"],
      featured: true,
      status: "ACTIVE",
      is_jeonse: false,
    },
    {
      manage_code: "매물_DEMO_002",
      title: "홍성읍 투룸 월세",
      description: "직장인 추천 월세. 보증금 협의 가능.",
      type: "RENT",
      category: "ONE_ROOM",
      price: 0,
      deposit: 300,
      monthly_rent: 45,
      is_jeonse: false,
      address: "충남 홍성군 홍성읍",
      region: "홍성",
      exclusive_area: 28,
      floor: 3,
      total_floors: 5,
      images: [],
      tags: ["월세"],
      featured: false,
      status: "ACTIVE",
    },
  ];

  const auctions = [
    {
      manage_code: "경매_DEMO_001",
      case_number: "2024타경1234",
      item_no: 1,
      title: "홍성군 아파트 경매",
      description: "권리분석 후 입찰 권고가 제시.",
      appraisal_price: 420000000,
      recommended_price: 310000000,
      min_price: 294000000,
      safety_grade: "SAFE",
      status: "ONGOING",
      d_day: 14,
      address: "충남 홍성군 홍북읍",
      region: "내포신도시",
      court: "대전지방법원 홍성지원",
      images: [],
      featured: true,
    },
  ];

  const { error: pErr } = await sb.from("properties").upsert(properties, {
    onConflict: "manage_code",
  });
  if (pErr) throw pErr;

  const { error: aErr } = await sb.from("auctions").upsert(auctions, {
    onConflict: "manage_code",
  });
  if (aErr) throw aErr;

  const { error: lErr } = await sb.from("legal_questions").upsert(
    [
      {
        id: "demo-legal-001",
        category: "임대차",
        question: "전세 계약 만료 전 반환 청구는 어떻게 하나요?",
        content: "계약 만료 2개월 전입니다. 보증금 반환 절차를 알고 싶습니다.",
        author_name: "김○○",
        answer:
          "내용증명 발송 및 임차권등기명령 검토가 필요합니다. 상세 상담을 권합니다.",
        answerer: "찬스상담소",
        status: "ANSWERED",
        is_public: true,
        is_secret: false,
        access_code: "DEMO01",
      },
    ],
    { onConflict: "id" },
  );
  if (lErr) throw lErr;

  const { error: sErr } = await sb.from("success_stories").upsert(
    [
      {
        id: "demo-story-001",
        category: "경매",
        title: "권리분석 후 안전한 낙찰",
        content:
          "복잡한 임차인 이슈가 있었지만 찬스부동산 분석으로 안전하게 입찰했습니다.",
        author_name: "이○○",
        status: "PUBLISHED",
      },
    ],
    { onConflict: "id" },
  );
  if (sErr) throw sErr;

  return {
    properties: properties.length,
    auctions: auctions.length,
    legal: 1,
    stories: 1,
  };
}
