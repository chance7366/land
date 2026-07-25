import { NextRequest, NextResponse } from "next/server";
import { runGapSync, type RtmsDealType, type RtmsPropertyType } from "@/lib/public-data/rtms";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      lawdCds?: string[];
      propertyTypes?: RtmsPropertyType[];
      dealTypes?: RtmsDealType[];
      startYm?: string;
      endYm?: string;
      gapOnly?: boolean;
      regionLabel?: string;
    };

    const lawdCds = (body.lawdCds || []).map((x) => String(x).trim()).filter(Boolean);
    const propertyTypes = (body.propertyTypes || []) as RtmsPropertyType[];
    const dealTypes = (body.dealTypes || []) as RtmsDealType[];
    const startYm = String(body.startYm || "").trim();
    const endYm = String(body.endYm || "").trim();

    if (!lawdCds.length || !propertyTypes.length || !dealTypes.length || !startYm || !endYm) {
      return NextResponse.json(
        { error: "lawdCds, propertyTypes, dealTypes, startYm, endYm 이 필요합니다." },
        { status: 400 },
      );
    }

    const result = await runGapSync({
      lawdCds,
      propertyTypes,
      dealTypes,
      startYm,
      endYm,
      gapOnly: body.gapOnly !== false,
      regionLabel: body.regionLabel,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "수집 실패" },
      { status: 500 },
    );
  }
}
