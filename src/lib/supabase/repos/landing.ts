import { createSupabaseDataClient } from "@/lib/supabase/data-client";
import {
  mapAuctionRow,
  mapLegalRow,
  mapPropertyRow,
  mapStoryRow,
} from "@/lib/supabase/mappers";

/** 홈 히어로 하단 — Supabase 조회 */
export async function getLandingHomeDataFromSupabase() {
  const sb = createSupabaseDataClient();

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
