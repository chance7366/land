import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** 비밀키 값은 노출하지 않고, 설정 여부만 확인 */
export async function GET() {
  const provider = process.env.DATA_PROVIDER?.trim() ?? "";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";

  let urlOk = false;
  try {
    const u = new URL(url);
    urlOk = (u.protocol === "https:" || u.protocol === "http:") && u.hostname.includes("supabase");
  } catch {
    urlOk = false;
  }

  return NextResponse.json({
    DATA_PROVIDER: provider || "(없음)",
    NEXT_PUBLIC_SUPABASE_URL: url
      ? urlOk
        ? `설정됨 (${uHost(url)})`
        : `형식 오류: "${url.slice(0, 40)}..."`
      : "(없음)",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anon ? `설정됨 (${anon.slice(0, 8)}…)` : "(없음)",
    SUPABASE_SERVICE_ROLE_KEY: service ? `설정됨 (${service.slice(0, 8)}…)` : "(없음)",
    ready: provider === "supabase" && urlOk && Boolean(anon) && Boolean(service),
    hint: !urlOk
      ? "Vercel에 NEXT_PUBLIC_SUPABASE_URL 을 https://xxxx.supabase.co 형식으로 넣어 주세요."
      : provider !== "supabase"
        ? "DATA_PROVIDER=supabase 로 설정하세요."
        : !service
          ? "SUPABASE_SERVICE_ROLE_KEY(service_role)를 넣어 주세요."
          : "설정 OK — /admin 에서 「데모 데이터 넣기」를 누르세요.",
  });
}

function uHost(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return "?";
  }
}
