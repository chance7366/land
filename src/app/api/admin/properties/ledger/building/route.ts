import { NextRequest, NextResponse } from "next/server";
import { fetchBuildingLedger } from "@/lib/public-data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      sigunguCd?: string;
      bjdongCd?: string;
      platGbCd?: string;
      bun?: string;
      ji?: string;
      pnu?: string;
      addressHint?: string;
    };

    const result = await fetchBuildingLedger(body);
    if (!result.ok) {
      const status =
        result.code === "MISSING_KEY"
          ? 503
          : result.code === "BAD_REQUEST"
            ? 400
            : result.code === "NOT_FOUND"
              ? 404
              : 502;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "건축물대장 조회 중 오류",
      },
      { status: 500 },
    );
  }
}
