import { NextRequest, NextResponse } from "next/server";
import {
  collectNpayArticles,
  isNpayEstateType,
  isNpayTradeType,
  type NpayEstateType,
  type NpayTradeType,
} from "@/lib/npay";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      city?: string;
      division?: string;
      sector?: string;
      tradeTypes?: string[];
      estateTypes?: string[];
      includeDuplicates?: boolean;
      maxPages?: number;
    };

    if (!body.city || !body.division || !body.sector) {
      return NextResponse.json(
        { error: "city(시도), division(시군구), sector(읍면동) 가 필요합니다." },
        { status: 400 },
      );
    }

    const tradeTypes = (body.tradeTypes ?? []).filter(
      isNpayTradeType,
    ) as NpayTradeType[];
    const estateTypes = (body.estateTypes ?? []).filter(
      isNpayEstateType,
    ) as NpayEstateType[];

    if (!tradeTypes.length || !estateTypes.length) {
      return NextResponse.json(
        { error: "거래유형·매물유형을 하나 이상 선택하세요." },
        { status: 400 },
      );
    }

    const result = await collectNpayArticles({
      city: body.city,
      division: body.division,
      sector: body.sector,
      tradeTypes,
      estateTypes,
      includeDuplicates: body.includeDuplicates,
      maxPages: body.maxPages,
    });

    if (!result.ok) {
      return NextResponse.json(result, { status: 502 });
    }
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "매물 수집 실패" },
      { status: 500 },
    );
  }
}
