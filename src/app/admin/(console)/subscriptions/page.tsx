import { AdminSubscriptionsClient } from "@/components/admin/AdminSubscriptionsClient";
import { prisma } from "@/lib/prisma";
import {
  parseChannels,
  parsePreferences,
  summarizePreferences,
  type NotifyChannel,
  type SubscriberStatus,
  type SubscriptionType,
} from "@/lib/subscription";

export const dynamic = "force-dynamic";

export default async function AdminSubscriptionsPage() {
  const items = await prisma.emailSubscriber.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { notifications: true } } },
  });

  const initialItems = items.map((row) => {
    const type = row.subscriptionType as SubscriptionType;
    const preferences = parsePreferences(type, row.preferences);
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      subscriptionType: type,
      channels: parseChannels(row.channels) as NotifyChannel[],
      summary: summarizePreferences(type, preferences),
      status: row.status as SubscriberStatus,
      adminNote: row.adminNote,
      notificationCount: row._count.notifications,
      createdAt: row.createdAt.toISOString(),
    };
  });

  return <AdminSubscriptionsClient initialItems={initialItems} />;
}
