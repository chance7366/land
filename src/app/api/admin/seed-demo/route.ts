import { NextResponse } from "next/server";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { seedDemoCatalogSupabase } from "@/lib/supabase/repos/admin-catalog";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/seed-demo
 * Vercel에 Supabase가 연결된 상태에서 데모 매물·경매·Q&A·스토리를 넣습니다.
 */
export async function POST() {
  try {
    if (!isSupabaseEnabled()) {
      return NextResponse.json(
        {
          error:
            "DATA_PROVIDER=supabase 와 Supabase 키가 Vercel 환경변수에 없습니다.",
        },
        { status: 400 },
      );
    }
    const result = await seedDemoCatalogSupabase();
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error("[seed-demo]", e);
    const message = e instanceof Error ? e.message : "시드 실패";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
