import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSubscriptionBody } from "@/lib/subscription";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import {
  createSubscriberSupabase,
  findSubscriberSupabase,
} from "@/lib/supabase/repos/subscribers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = validateSubscriptionBody(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { data } = parsed;
    const okMessage =
      data.subscriptionType === "NEWS"
        ? "신청이 접수되었습니다. 관리자 승인 후, 매일 당일 부동산소식을 메일로 보내 드립니다."
        : "신청이 접수되었습니다. 관리자 승인 후, 조건에 맞는 물건이 등록되면 바로 알려 드립니다.";
    const updateMessage =
      data.subscriptionType === "NEWS"
        ? "기존 신청을 갱신했습니다. 관리자 승인 후, 매일 당일 부동산소식을 메일로 보내 드립니다."
        : "기존 신청을 갱신했습니다. 관리자 승인 후, 조건에 맞는 물건이 등록되면 바로 알려 드립니다.";

    if (isSupabaseEnabled()) {
      const existing = await findSubscriberSupabase({
        email: data.email,
        phone: data.phone,
        subscriptionType: data.subscriptionType,
      });

      if (existing && ["PENDING", "APPROVED"].includes(String(existing.status))) {
        const sb = createSupabaseAdminClient();
        const { data: updated, error } = await sb
          .from("subscribers")
          .update({
            name: data.name,
            email: data.email ?? existing.email,
            phone: data.phone ?? existing.phone,
            channels: data.channels,
            preferences: data.preferences,
            is_privacy_agreed: true,
            status: "PENDING",
            admin_note: null,
          })
          .eq("id", existing.id)
          .select("id, status")
          .single();
        if (error) throw error;
        return NextResponse.json(
          {
            id: updated.id,
            status: updated.status,
            message: updateMessage,
          },
          { status: 200 },
        );
      }

      const created = await createSubscriberSupabase({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subscriptionType: data.subscriptionType,
        channels: data.channels,
        preferences: data.preferences as Record<string, unknown>,
        isPrivacyAgreed: true,
      });
      return NextResponse.json(
        {
          id: created.id,
          status: "PENDING",
          message: okMessage,
        },
        { status: 201 },
      );
    }

    const or: { email?: string; phone?: string }[] = [];
    if (data.email) or.push({ email: data.email });
    if (data.phone) or.push({ phone: data.phone });

    const existing = await prisma.emailSubscriber.findFirst({
      where: {
        subscriptionType: data.subscriptionType,
        status: { in: ["PENDING", "APPROVED"] },
        OR: or,
      },
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      const updated = await prisma.emailSubscriber.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          email: data.email ?? existing.email,
          phone: data.phone ?? existing.phone,
          channels: JSON.stringify(data.channels),
          preferences: JSON.stringify(data.preferences),
          isPrivacyAgreed: true,
          status: "PENDING",
          adminNote: null,
        },
      });
      return NextResponse.json(
        {
          id: updated.id,
          status: updated.status,
          message: updateMessage,
        },
        { status: 200 },
      );
    }

    const created = await prisma.emailSubscriber.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subscriptionType: data.subscriptionType,
        channels: JSON.stringify(data.channels),
        preferences: JSON.stringify(data.preferences),
        isPrivacyAgreed: true,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        id: created.id,
        status: created.status,
        message: okMessage,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[subscriptions POST]", err);
    return NextResponse.json({ error: "신청 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
