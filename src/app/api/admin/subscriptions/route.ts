import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
    const where =
      status && ["PENDING", "APPROVED", "REJECTED"].includes(status)
        ? { status }
        : {};

    const items = await prisma.emailSubscriber.findMany({
      where,
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
