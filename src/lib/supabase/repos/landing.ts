import { createClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/** 홈 조회용 — service role 우선, 없으면 anon(공개 RLS) */
function createLandingClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (url && service) {
    return createSupabaseAdminClient();
  }
  if (url && anon) {
    return createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  throw new Error("Supabase URL/키가 설정되지 않았습니다.");
}

/** 홈 히어로 하단 — Supabase 조회 */
export async function getLandingHomeDataFromSupabase() {
  const sb = createLandingClient();

  const [
    { data: properties, error: pErr },
    { data: auctions, error: aErr },
    { data: legalQuestions, error: lErr },
    { data: successStories, error: sErr },
  ] = await Promise.all([
    sb
      .from("properties")
      .select("*")
      .eq("status", "ACTIVE")
      .order("featured", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(12),
    sb
      .from("auctions")
      .select("*")
      .eq("status", "ONGOING")
      .order("featured", { ascending: false })
      .order("d_day", { ascending: true })
      .limit(12),
    sb
      .from("legal_questions")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(5),
    sb
      .from("success_stories")
      .select("*")
      .eq("status", "PUBLISHED")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (pErr) console.error("[landing] properties", pErr.message);
  if (aErr) console.error("[landing] auctions", aErr.message);
  if (lErr) console.error("[landing] legal_questions", lErr.message);
  if (sErr) console.error("[landing] success_stories", sErr.message);

  return {
    properties: (properties ?? []).map(mapPropertyRow),
    auctions: (auctions ?? []).map(mapAuctionRow),
    newsFeed: [] as never[],
    legalQuestions: (legalQuestions ?? []).map(mapLegalRow),
    successStories: (successStories ?? []).map(mapStoryRow),
  };
}

function mapPropertyRow(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    manageCode: String(row.manage_code ?? ""),
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    type: String(row.type ?? "SALE"),
    category: String(row.category ?? "APARTMENT"),
    price: Number(row.price ?? 0),
    deposit: row.deposit == null ? null : Number(row.deposit),
    monthlyRent: row.monthly_rent == null ? null : Number(row.monthly_rent),
    isJeonse: Boolean(row.is_jeonse),
    dealSubType: (row.deal_sub_type as string | null) ?? null,
    area: (row.area as string | null) ?? null,
    address: String(row.address ?? ""),
    region: String(row.region ?? ""),
    buildingName: (row.building_name as string | null) ?? null,
    exclusiveArea: row.exclusive_area == null ? null : Number(row.exclusive_area),
    supplyArea: row.supply_area == null ? null : Number(row.supply_area),
    floor: row.floor == null ? null : Number(row.floor),
    totalFloors: row.total_floors == null ? null : Number(row.total_floors),
    images: JSON.stringify(row.images ?? []),
    tags: JSON.stringify(row.tags ?? []),
    specs: JSON.stringify(row.specs ?? {}),
    featured: Boolean(row.featured),
    status: String(row.status ?? "ACTIVE"),
    publishedAt: new Date(String(row.published_at ?? Date.now())),
    createdAt: new Date(String(row.created_at ?? Date.now())),
    updatedAt: new Date(String(row.updated_at ?? Date.now())),
  };
}

function mapAuctionRow(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    manageCode: String(row.manage_code ?? ""),
    caseNumber: String(row.case_number ?? ""),
    itemNo: Number(row.item_no ?? 1),
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    appraisalPrice: Number(row.appraisal_price ?? 0),
    recommendedPrice: Number(row.recommended_price ?? 0),
    minPrice: row.min_price == null ? null : Number(row.min_price),
    safetyGrade: String(row.safety_grade ?? "SAFE"),
    status: String(row.status ?? "ONGOING"),
    dDay: Number(row.d_day ?? 0),
    images: JSON.stringify(row.images ?? []),
    address: (row.address as string | null) ?? null,
    region: (row.region as string | null) ?? null,
    court: (row.court as string | null) ?? null,
    saleDate: row.sale_date ? new Date(String(row.sale_date)) : null,
    featured: Boolean(row.featured),
    publishedAt: new Date(String(row.published_at ?? Date.now())),
    createdAt: new Date(String(row.created_at ?? Date.now())),
    updatedAt: new Date(String(row.updated_at ?? Date.now())),
  };
}

function mapLegalRow(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    category: String(row.category ?? ""),
    question: String(row.question ?? ""),
    content: String(row.content ?? ""),
    authorName: String(row.author_name ?? ""),
    phone: (row.phone as string | null) ?? null,
    answer: (row.answer as string | null) ?? null,
    answerer: (row.answerer as string | null) ?? null,
    status: String(row.status ?? "PENDING"),
    isPublic: Boolean(row.is_public),
    isSecret: Boolean(row.is_secret),
    accessCode: String(row.access_code ?? ""),
    suggestConsult: Boolean(row.suggest_consult),
    answeredAt: row.answered_at ? new Date(String(row.answered_at)) : null,
    createdAt: new Date(String(row.created_at ?? Date.now())),
    updatedAt: new Date(String(row.updated_at ?? Date.now())),
  };
}

function mapStoryRow(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    category: String(row.category ?? ""),
    title: String(row.title ?? ""),
    content: String(row.content ?? ""),
    authorName: String(row.author_name ?? ""),
    status: String(row.status ?? "PUBLISHED"),
    createdAt: new Date(String(row.created_at ?? Date.now())),
    updatedAt: new Date(String(row.updated_at ?? Date.now())),
  };
}
