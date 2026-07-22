import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const token =
      (typeof body.token === "string" && body.token.trim()) ||
      new URL(request.url).searchParams.get("token") ||
      "";

    if (!token) {
      return NextResponse.json({ error: "해지 토큰이 필요합니다." }, { status: 400 });
    }

    if (isSupabaseEnabled()) {
      const sb = createSupabaseAdminClient();
      const { data: sub, error } = await sb
        .from("subscribers")
        .select("id")
        .eq("unsubscribe_token", token)
        .maybeSingle();
      if (error) throw error;
      if (!sub) {
        return NextResponse.json({ error: "유효하지 않은 링크입니다." }, { status: 404 });
      }
      const { error: updErr } = await sb
        .from("subscribers")
        .update({ status: "REJECTED", admin_note: "사용자 해지" })
        .eq("id", sub.id);
      if (updErr) throw updErr;
      return NextResponse.json({ ok: true, message: "알림 신청이 해지되었습니다." });
    }

    const sub = await prisma.emailSubscriber.findUnique({
      where: { unsubscribeToken: token },
    });
    if (!sub) {
      return NextResponse.json({ error: "유효하지 않은 링크입니다." }, { status: 404 });
    }

    await prisma.emailSubscriber.update({
      where: { id: sub.id },
      data: { status: "REJECTED", adminNote: "사용자 해지" },
    });

    return NextResponse.json({ ok: true, message: "알림 신청이 해지되었습니다." });
  } catch {
    return NextResponse.json({ error: "해지 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
