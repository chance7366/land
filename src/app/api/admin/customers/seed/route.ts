import { NextRequest, NextResponse } from "next/server";
import { seedCustomers } from "@/lib/customers/service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const reset = Boolean(body?.reset);
    const result = await seedCustomers({ reset });
    return NextResponse.json({
      ok: true,
      count: result.items.length,
      items: result.items,
      skipped: result.skipped,
      removed: result.removed,
      message: result.message,
    });
  } catch (e) {
    const msg =
      e instanceof Error
        ? e.message
        : typeof e === "object" && e && "message" in e
          ? String((e as { message: unknown }).message)
          : "시드 실패";
    console.warn("[admin/customers/seed]", msg, e);
    return NextResponse.json(
      {
        error:
          /schema cache|does not exist|PGRST205/i.test(msg)
            ? "customer_cards 테이블이 없습니다. Supabase SQL Editor에서 004_customer_crm.sql 을 Run 하세요."
            : msg,
      },
      { status: 500 },
    );
  }
}
