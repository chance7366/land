import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sb = createSupabaseAdminClient();
    const { data, error } = await sb
      .from("real_estate_sync_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return NextResponse.json({
      ok: true,
      settings: data || { auto_collect: false, cadence: "weekly" },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "설정 조회 실패" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      autoCollect?: boolean;
      cadence?: "weekly" | "monthly";
    };
    const sb = createSupabaseAdminClient();
    const { data, error } = await sb
      .from("real_estate_sync_settings")
      .upsert({
        id: 1,
        auto_collect: Boolean(body.autoCollect),
        cadence: body.cadence === "monthly" ? "monthly" : "weekly",
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true, settings: data });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "설정 저장 실패" },
      { status: 500 },
    );
  }
}
