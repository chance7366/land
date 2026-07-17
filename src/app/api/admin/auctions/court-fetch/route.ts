import { NextRequest, NextResponse } from "next/server";
import { fetchCourtAuctionLive } from "@/lib/court-auction-live-fetch";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 90;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      court?: string;
      caseYear?: string;
      caseSerial?: string;
      itemNo?: number | null;
    };

    const court = String(body.court || "").trim();
    const caseYear = String(body.caseYear || "").trim();
    const caseSerial = String(body.caseSerial || "").replace(/\D/g, "");
    const itemNo =
      body.itemNo != null && Number(body.itemNo) > 0 ? Number(body.itemNo) : null;

    if (!court || !caseYear || !caseSerial) {
      return NextResponse.json(
        { ok: false, error: "관할법원·연도·타경 숫자가 필요합니다." },
        { status: 400 },
      );
    }

    const result = await fetchCourtAuctionLive({
      court,
      caseYear,
      caseSerial,
      itemNo,
    });

    if (!result.ok) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "법원 조회 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
