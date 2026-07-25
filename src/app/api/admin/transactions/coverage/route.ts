import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ymToInt } from "@/lib/public-data/rtms";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const startYm = sp.get("startYm") || "2026-01";
    const endYm = sp.get("endYm") || "2026-06";
    const lawdCds = (sp.get("lawdCds") || "").split(",").filter(Boolean);
    const propertyTypes = (sp.get("propertyTypes") || "").split(",").filter(Boolean);
    const dealTypes = (sp.get("dealTypes") || "").split(",").filter(Boolean);

    const sb = createSupabaseAdminClient();
    let q = sb
      .from("real_estate_sync_coverage")
      .select("*")
      .gte("deal_ymd", ymToInt(startYm))
      .lte("deal_ymd", ymToInt(endYm))
      .order("lawd_cd")
      .order("deal_ymd");

    if (lawdCds.length) q = q.in("lawd_cd", lawdCds);
    if (propertyTypes.length) q = q.in("property_type", propertyTypes);
    if (dealTypes.length) q = q.in("transaction_type", dealTypes);

    const { data, error } = await q;
    if (error) throw new Error(error.message);

    const { data: lawds } = await sb.from("lawd_codes").select("lawd_cd,sido,sigungu");
    const labelMap = new Map(
      (lawds ?? []).map((l) => [l.lawd_cd, `${l.sido} ${l.sigungu}`]),
    );

    return NextResponse.json({
      ok: true,
      coverage: (data ?? []).map((c) => ({
        ...c,
        regionLabel: labelMap.get(c.lawd_cd) || c.lawd_cd,
        dealYm: `${String(c.deal_ymd).slice(0, 4)}-${String(c.deal_ymd).slice(4)}`,
      })),
      lawdCodes: lawds ?? [],
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "커버리지 조회 실패" },
      { status: 500 },
    );
  }
}
