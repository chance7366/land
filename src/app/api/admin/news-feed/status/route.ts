import { NextResponse } from "next/server";
import { loadAdminNewsHealthRows } from "@/lib/admin-news-health";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await loadAdminNewsHealthRows();
    return NextResponse.json({ rows });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "상태 조회 실패",
      },
      { status: 500 },
    );
  }
}
