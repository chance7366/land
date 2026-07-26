import { NextRequest, NextResponse } from "next/server";
import { collectNpayComplexes } from "@/lib/npay";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      city?: string;
      division?: string;
      sector?: string;
      maxComplexes?: number;
    };

    if (!body.city || !body.division || !body.sector) {
      return NextResponse.json(
        { error: "city(시도), division(시군구), sector(읍면동) 가 필요합니다." },
        { status: 400 },
      );
    }

    const result = await collectNpayComplexes({
      city: body.city,
      division: body.division,
      sector: body.sector,
      maxComplexes: body.maxComplexes,
    });

    if (!result.ok) {
      return NextResponse.json(result, { status: 502 });
    }
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "단지 수집 실패" },
      { status: 500 },
    );
  }
}
