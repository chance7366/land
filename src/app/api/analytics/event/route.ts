import { NextRequest, NextResponse } from "next/server";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { prisma } from "@/lib/prisma";

const ALLOWED = new Set([
  "page_view",
  "item_click",
  "item_dwell",
  "cta_click",
  "search",
  "share_action",
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = String(body.eventType ?? "");
    if (!ALLOWED.has(eventType)) {
      return NextResponse.json({ error: "invalid event" }, { status: 400 });
    }

    const path = String(body.path ?? "").slice(0, 500);
    const menuKey = body.menuKey ? String(body.menuKey).slice(0, 64) : null;
    const targetType = body.targetType ? String(body.targetType).slice(0, 32) : null;
    const targetId = body.targetId ? String(body.targetId).slice(0, 128) : null;
    const metadata =
      body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
        ? body.metadata
        : {};

    if (isSupabaseEnabled()) {
      const sb = createSupabaseAdminClient();
      const { error } = await sb.from("page_events").insert({
        event_type: eventType,
        path,
        menu_key: menuKey,
        target_type: targetType,
        target_id: targetId,
        metadata,
      });
      if (error) {
        console.warn("[analytics]", error.message);
        return NextResponse.json({ ok: false, skipped: true }, { status: 202 });
      }
      return NextResponse.json({ ok: true });
    }

    await prisma.pageEvent.create({
      data: {
        eventType,
        path,
        menuKey,
        targetType,
        targetId,
        metadata: JSON.stringify(metadata),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.warn("[analytics]", e);
    return NextResponse.json({ ok: false }, { status: 202 });
  }
}
