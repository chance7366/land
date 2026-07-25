import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ymToInt } from "@/lib/public-data/rtms";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const startYm = sp.get("startYm") || "2026-01";
    const endYm = sp.get("endYm") || "2026-06";
    const propertyType = sp.get("propertyType") || "";
    const dealType = sp.get("dealType") || "";
    const lawdCds = (sp.get("lawdCds") || "").split(",").filter(Boolean);
    const q = (sp.get("q") || "").trim();
    const limit = Math.min(Number(sp.get("limit") || 200), 500);

    const sb = createSupabaseAdminClient();
    let query = sb
      .from("real_estate_transactions")
      .select("*", { count: "exact" })
      .gte("deal_ymd", ymToInt(startYm))
      .lte("deal_ymd", ymToInt(endYm))
      .order("deal_date", { ascending: false })
      .limit(limit);

    if (propertyType) query = query.eq("property_type", propertyType);
    if (dealType) query = query.eq("transaction_type", dealType);
    if (lawdCds.length) query = query.in("lawd_cd", lawdCds);
    if (q) query = query.or(`building_name.ilike.%${q}%,jibun.ilike.%${q}%`);

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);

    const { data: lawds } = await sb.from("lawd_codes").select("lawd_cd,sido,sigungu");
    const labelMap = new Map(
      (lawds ?? []).map((l) => [l.lawd_cd, { sido: l.sido, sigungu: l.sigungu }]),
    );

    return NextResponse.json({
      ok: true,
      count: count ?? 0,
      rows: (data ?? []).map((r) => {
        const loc = labelMap.get(r.lawd_cd);
        return {
          ...r,
          sido: loc?.sido || "",
          sigungu: loc?.sigungu || "",
          regionLabel: loc ? `${loc.sido} ${loc.sigungu}` : r.lawd_cd,
        };
      }),
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "조회 실패" },
      { status: 500 },
    );
  }
}
