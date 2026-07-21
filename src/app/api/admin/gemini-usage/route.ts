import { NextResponse } from "next/server";
import { getGeminiUsageSummaryForToday } from "@/lib/gemini-usage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const summary = await getGeminiUsageSummaryForToday();
    return NextResponse.json(summary);
  } catch (e) {
    console.error("[gemini-usage GET]", e);
    return NextResponse.json({ error: "사용량 조회 실패" }, { status: 500 });
  }
}
