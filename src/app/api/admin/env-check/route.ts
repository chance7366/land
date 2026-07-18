import { NextResponse } from "next/server";
import {
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  isValidSupabaseUrl,
} from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

/** 비밀키 값은 노출하지 않고, 설정 여부만 확인 */
export async function GET() {
  const provider = process.env.DATA_PROVIDER?.trim() ?? "";
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const url = getSupabaseUrl();
  const anon = getSupabaseAnonKey();
  const service = getSupabaseServiceRoleKey();
  const urlOk = isValidSupabaseUrl(url);
  const rawHadJunk = Boolean(rawUrl) && rawUrl !== url;

  return NextResponse.json({
    DATA_PROVIDER: provider || "(없음)",
    NEXT_PUBLIC_SUPABASE_URL: url
      ? urlOk
        ? `설정됨 (${new URL(url).hostname})${rawHadJunk ? " · 괄호/따옴표 자동제거" : ""}`
        : `형식 오류`
      : "(없음)",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anon ? `설정됨 (${anon.slice(0, 8)}…)` : "(없음)",
    SUPABASE_SERVICE_ROLE_KEY: service ? `설정됨 (${service.slice(0, 8)}…)` : "(없음)",
    ready: provider === "supabase" && urlOk && Boolean(anon) && Boolean(service),
    hint:
      provider === "supabase" && urlOk && anon && service
        ? "설정 OK — /admin 에서 「데모 데이터 넣기」를 누르세요."
        : "Vercel Environment Variables를 확인한 뒤 Redeploy 하세요.",
  });
}
