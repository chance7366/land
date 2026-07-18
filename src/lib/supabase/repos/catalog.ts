import type { PropertyCategory } from "@prisma/client";
import type { PropertyListFilters } from "@/lib/property-fields";
import { createSupabaseDataClient } from "@/lib/supabase/data-client";
import {
  mapAuctionRow,
  mapLegalRow,
  mapPropertyRow,
  mapStoryRow,
} from "@/lib/supabase/mappers";

function matchesPropertyFilters(
  p: ReturnType<typeof mapPropertyRow>,
  filters: PropertyListFilters,
) {
  const categories = filters.categories?.length
    ? filters.categories
    : filters.category
      ? [filters.category]
      : [];
  if (categories.length && !categories.includes(p.category as PropertyCategory)) return false;

  if (filters.deals?.length) {
    const ok = filters.deals.some((d) => {
      if (d === "SALE") return p.type === "SALE";
      if (d === "SHORT_TERM") return p.type === "SHORT_TERM";
      if (d === "JEONSE") return p.type === "RENT" && p.isJeonse;
      if (d === "MONTHLY") return p.type === "RENT" && !p.isJeonse;
      return false;
    });
    if (!ok) return false;
  } else if (filters.type && p.type !== filters.type) {
    return false;
  }

  const regions = filters.regions?.length
    ? filters.regions
    : filters.region
      ? [filters.region]
      : [];
  if (regions.length) {
    const hit = regions.some(
      (r) => p.sigungu === r || p.region === r || p.address.includes(r),
    );
    if (!hit) return false;
  }
  return true;
}

export async function listPropertiesFromSupabase(filters: PropertyListFilters = {}) {
  const sb = createSupabaseDataClient();
  const { data, error } = await sb
    .from("properties")
    .select("*")
    .eq("status", "ACTIVE")
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false });
  if (error) throw error;

  let items = (data ?? []).map(mapPropertyRow).filter((p) => matchesPropertyFilters(p, filters));
  if (filters.sort === "price_asc") items = [...items].sort((a, b) => a.price - b.price);
  if (filters.sort === "price_desc") items = [...items].sort((a, b) => b.price - a.price);
  return items;
}

export async function getPropertyCategoryCountsFromSupabase() {
  const items = await listPropertiesFromSupabase({});
  const counts = {} as Record<PropertyCategory, number>;
  for (const row of items) {
    const c = row.category as PropertyCategory;
    counts[c] = (counts[c] ?? 0) + 1;
  }
  return counts;
}

export async function listPropertyRegionsFromSupabase() {
  const items = await listPropertiesFromSupabase({});
  const set = new Set<string>();
  for (const p of items) {
    const r = (p.sigungu || p.region || "").trim();
    if (r) set.add(r);
  }
  return [...set].sort((a, b) => a.localeCompare(b, "ko"));
}

export async function listAuctionsFromSupabase() {
  const sb = createSupabaseDataClient();
  const { data, error } = await sb
    .from("auctions")
    .select("*")
    .eq("status", "ONGOING")
    .order("featured", { ascending: false })
    .order("d_day", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapAuctionRow);
}

export async function listLegalQuestionsFromSupabase(take = 100) {
  const sb = createSupabaseDataClient();
  const { data, error } = await sb
    .from("legal_questions")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(take);
  if (error) throw error;
  return (data ?? []).map(mapLegalRow);
}

export async function getLegalQuestionFromSupabase(id: string) {
  const sb = createSupabaseDataClient();
  const { data, error } = await sb.from("legal_questions").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapLegalRow(data) : null;
}

export async function createLegalQuestionInSupabase(input: {
  category: string;
  question: string;
  content: string;
  authorName: string;
  phone?: string | null;
  isSecret: boolean;
  accessCode: string;
}) {
  const sb = createSupabaseDataClient();
  const { data, error } = await sb
    .from("legal_questions")
    .insert({
      category: input.category,
      question: input.question,
      content: input.content,
      author_name: input.authorName,
      phone: input.phone ?? null,
      is_secret: input.isSecret,
      access_code: input.isSecret ? input.accessCode : "",
      is_public: !input.isSecret,
      status: "PENDING",
    })
    .select("*")
    .single();
  if (error) throw error;
  return mapLegalRow(data);
}

export async function listSuccessStoriesFromSupabase(take = 200) {
  const sb = createSupabaseDataClient();
  const { data, error } = await sb
    .from("success_stories")
    .select("*")
    .eq("status", "PUBLISHED")
    .order("created_at", { ascending: false })
    .limit(take);
  if (error) throw error;
  return (data ?? []).map(mapStoryRow);
}
