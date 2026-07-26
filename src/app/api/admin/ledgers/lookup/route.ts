import { NextRequest, NextResponse } from "next/server";
import { lookupLedgerBundle } from "@/lib/public-data/ledger-orchestrator";
import type { LedgerKind } from "@/lib/public-data/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      ledgerKind?: LedgerKind;
      address?: string;
      pnu?: string;
      sigunguCd?: string;
      bjdongCd?: string;
      platGbCd?: string;
      bun?: string;
      ji?: string;
      dong?: string;
      ho?: string;
      selectedMgmPk?: string;
      selectedDong?: string;
      selectedHo?: string;
      skipLand?: boolean;
    };

    const ledgerKind = body.ledgerKind;
    if (
      ledgerKind !== "GENERAL" &&
      ledgerKind !== "AGGREGATE" &&
      ledgerKind !== "LAND_ONLY"
    ) {
      return NextResponse.json(
        { ok: false, error: "ledgerKind는 GENERAL | AGGREGATE | LAND_ONLY 이어야 합니다." },
        { status: 400 },
      );
    }

    const result = await lookupLedgerBundle({
      ledgerKind,
      address: body.address,
      pnu: body.pnu,
      sigunguCd: body.sigunguCd,
      bjdongCd: body.bjdongCd,
      platGbCd: body.platGbCd,
      bun: body.bun,
      ji: body.ji,
      dong: body.dong,
      ho: body.ho,
      selectedMgmPk: body.selectedMgmPk,
      selectedDong: body.selectedDong,
      selectedHo: body.selectedHo,
      skipLand: body.skipLand,
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

    // 클라이언트에 rawSnapshots는 용량 큼 → 요약만
    const { rawSnapshots: _raw, ...bundle } = result.bundle;
    return NextResponse.json({
      ok: true,
      bundle: {
        ...bundle,
        // persist용으로 raw는 서버 세션에 안 들고 감 — 저장 API는 재조회 또는 fields만
        hasRaw: Boolean(_raw?.length),
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "대장 조회 중 오류",
      },
      { status: 500 },
    );
  }
}
