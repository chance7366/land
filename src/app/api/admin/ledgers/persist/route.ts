import { NextRequest, NextResponse } from "next/server";
import { lookupLedgerBundle } from "@/lib/public-data/ledger-orchestrator";
import { persistLedgerSnapshots } from "@/lib/public-data/ledger-persist";
import type { LedgerKind } from "@/lib/public-data/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

/** 조회를 다시 수행한 뒤 스냅샷 저장 (원문 포함) */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      ownerType?: "property" | "auction";
      ownerId?: string;
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
    };

    if (
      (body.ownerType !== "property" && body.ownerType !== "auction") ||
      !body.ownerId?.trim()
    ) {
      return NextResponse.json(
        { ok: false, error: "ownerType·ownerId가 필요합니다." },
        { status: 400 },
      );
    }

    const ledgerKind = body.ledgerKind;
    if (
      ledgerKind !== "GENERAL" &&
      ledgerKind !== "AGGREGATE" &&
      ledgerKind !== "LAND_ONLY"
    ) {
      return NextResponse.json(
        { ok: false, error: "ledgerKind가 필요합니다." },
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
    });

    if (!result.ok) {
      return NextResponse.json(result, { status: 502 });
    }

    const saved = await persistLedgerSnapshots({
      ownerType: body.ownerType,
      ownerId: body.ownerId.trim(),
      bundle: result.bundle,
    });

    if (!saved.ok) {
      return NextResponse.json(saved, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "스냅샷 저장 중 오류",
      },
      { status: 500 },
    );
  }
}
