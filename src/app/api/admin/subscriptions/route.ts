import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { listSubscribersSupabase } from "@/lib/supabase/repos/subscribers";
import {
  parseChannels,
  parsePreferences,
  summarizePreferences,
  type SubscriptionType,
} from "@/lib/subscription";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const statusFilter =
      status && ["PENDING", "APPROVED", "REJECTED"].includes(status) ? status : undefined;

    if (isSupabaseEnabled()) {
      const rows = await listSubscribersSupabase(
        statusFilter ? { status: statusFilter } : undefined,
      );
      return NextResponse.json(
        rows.map((row) => {
          const type = row.subscription_type as SubscriptionType;
          const preferences = parsePreferences(type, row.preferences);
          return {
            id: row.id,
            name: row.name,
            email: row.email,
            phone: row.phone,
            subscriptionType: type,
            channels: parseChannels(row.channels),
            preferences,
            summary: summarizePreferences(type, preferences),
            status: row.status,
            adminNote: row.admin_note,
            notificationCount: 0,
            createdAt: row.created_at,
          };
        }),
      );
    }

    const items = await prisma.emailSubscriber.findMany({
      where: statusFilter ? { status: statusFilter } : {},
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { notifications: true } },
      },
    });

    return NextResponse.json(
      items.map((row) => {
        const type = row.subscriptionType as SubscriptionType;
        const preferences = parsePreferences(type, row.preferences);
        return {
          ...row,
          channels: parseChannels(row.channels),
          preferences,
          summary: summarizePreferences(type, preferences),
          notificationCount: row._count.notifications,
        };
      }),
    );
  } catch (err) {
    console.error("[admin subscriptions GET]", err);
    return NextResponse.json({ error: "목록을 불러오지 못했습니다." }, { status: 500 });
  }
}
