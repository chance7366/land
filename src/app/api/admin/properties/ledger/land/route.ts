import { NextRequest, NextResponse } from "next/server";
import { fetchLandLedger } from "@/lib/public-data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      pnu?: string;
      address?: string;
      sigunguCd?: string;
      bjdongCd?: string;
      platGbCd?: string;
      bun?: string;
      ji?: string;
      stdrYear?: string;
    };

    const result = await fetchLandLedger({
      pnu: body.pnu,
      address: body.address,
      stdrYear: body.stdrYear,
      codes: {
        sigunguCd: body.sigunguCd,
        bjdongCd: body.bjdongCd,
        platGbCd: body.platGbCd,
        bun: body.bun,
        ji: body.ji,
        pnu: body.pnu,
      },
    });

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
        error: err instanceof Error ? err.message : "토지대장 조회 중 오류",
      },
      { status: 500 },
    );
  }
}
