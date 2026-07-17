import type { Auction, Property } from "@prisma/client";
import { sendMail } from "@/lib/mailer";
import { isKakaoEnabled, sendKakaoAlimtalk, sendSms } from "@/lib/notify-solapi";
import { prisma } from "@/lib/prisma";
import { matchesAuction, matchesProperty } from "@/lib/subscription-match";
import {
  parseChannels,
  parsePreferences,
  type NotifyChannel,
  type SubscriptionType,
} from "@/lib/subscription";
import {
  auctionAlertEmail,
  auctionAlertSms,
  auctionKakaoTemplateId,
  auctionKakaoVariables,
  propertyAlertEmail,
  propertyAlertSms,
  propertyKakaoTemplateId,
  propertyKakaoVariables,
} from "@/lib/subscription-templates";

export type NotifyEntityType = "PROPERTY" | "AUCTION";

/**
 * 매물/경매 저장 후 호출. API 응답을 막지 않도록 fire-and-forget 권장.
 * 이미 SENT인 (구독자·물건·채널)은 스킵.
 */
export async function notifyMatchingSubscribers(options: {
  entityType: NotifyEntityType;
  entity: Property | Auction;
}): Promise<{ matched: number; sent: number; failed: number }> {
  const subscriptionType: SubscriptionType =
    options.entityType === "PROPERTY" ? "REAL_ESTATE" : "AUCTION";

  if (options.entityType === "PROPERTY" && (options.entity as Property).status !== "ACTIVE") {
    return { matched: 0, sent: 0, failed: 0 };
  }
  if (options.entityType === "AUCTION" && (options.entity as Auction).status !== "ONGOING") {
    return { matched: 0, sent: 0, failed: 0 };
  }

  const subscribers = await prisma.emailSubscriber.findMany({
    where: { status: "APPROVED", subscriptionType },
  });

  let matched = 0;
  let sent = 0;
  let failed = 0;

  for (const sub of subscribers) {
    const preferences = parsePreferences(subscriptionType, sub.preferences);
    const ok =
      options.entityType === "PROPERTY"
        ? matchesProperty(options.entity as Property, preferences)
        : matchesAuction(options.entity as Auction, preferences);
    if (!ok) continue;
    matched += 1;

    const channels = parseChannels(sub.channels);
    for (const channel of channels) {
      const existing = await prisma.notificationLog.findUnique({
        where: {
          subscriberId_entityType_entityId_channel: {
            subscriberId: sub.id,
            entityType: options.entityType,
            entityId: options.entity.id,
            channel,
          },
        },
      });
      if (existing?.status === "SENT") continue;

      const result = await sendChannel({
        channel,
        subscriber: sub,
        entityType: options.entityType,
        entity: options.entity,
      });

      try {
        await prisma.notificationLog.upsert({
          where: {
            subscriberId_entityType_entityId_channel: {
              subscriberId: sub.id,
              entityType: options.entityType,
              entityId: options.entity.id,
              channel,
            },
          },
          create: {
            subscriberId: sub.id,
            entityType: options.entityType,
            entityId: options.entity.id,
            channel,
            status: result.ok ? "SENT" : "FAILED",
            errorMessage: result.ok ? null : result.error,
          },
          update: {
            status: result.ok ? "SENT" : "FAILED",
            errorMessage: result.ok ? null : result.error,
          },
        });
      } catch (err) {
        console.error("[notify] log upsert failed", err);
      }

      if (result.ok) sent += 1;
      else {
        failed += 1;
        console.error(
          `[notify] ${channel} failed sub=${sub.id} entity=${options.entity.id}:`,
          result.error,
        );
      }
    }
  }

  return { matched, sent, failed };
}

/** API에서 응답 후 백그라운드로 돌릴 때 사용 */
export function scheduleNotifyMatchingSubscribers(options: {
  entityType: NotifyEntityType;
  entity: Property | Auction;
}) {
  void notifyMatchingSubscribers(options).catch((err) => {
    console.error("[notify] unexpected error", err);
  });
}

async function sendChannel(options: {
  channel: NotifyChannel;
  subscriber: {
    name: string | null;
    email: string | null;
    phone: string | null;
    unsubscribeToken: string;
  };
  entityType: NotifyEntityType;
  entity: Property | Auction;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { channel, subscriber, entityType, entity } = options;
  const msgCtx = {
    customerName: subscriber.name,
    unsubscribeToken: subscriber.unsubscribeToken,
  };

  if (channel === "EMAIL") {
    if (!subscriber.email) return { ok: false, error: "이메일 없음" };
    const content =
      entityType === "PROPERTY"
        ? propertyAlertEmail(entity as Property, subscriber.unsubscribeToken)
        : auctionAlertEmail(entity as Auction, subscriber.unsubscribeToken);
    return sendMail({ to: subscriber.email, ...content });
  }

  const lmsText =
    entityType === "PROPERTY"
      ? propertyAlertSms(entity as Property, msgCtx)
      : auctionAlertSms(entity as Auction, msgCtx);

  if (channel === "SMS") {
    if (!subscriber.phone) return { ok: false, error: "휴대폰 없음" };
    return sendSms(subscriber.phone, lmsText);
  }

  // KAKAO — 알림톡 실패(또는 미설정) 시 동일 LMS로 폴백
  if (!subscriber.phone) return { ok: false, error: "휴대폰 없음" };

  const templateId =
    entityType === "PROPERTY" ? propertyKakaoTemplateId() : auctionKakaoTemplateId();
  const variables =
    entityType === "PROPERTY"
      ? propertyKakaoVariables(entity as Property, msgCtx)
      : auctionKakaoVariables(entity as Auction, msgCtx);

  if (isKakaoEnabled() && templateId) {
    const kakao = await sendKakaoAlimtalk({
      to: subscriber.phone,
      templateId,
      variables,
      text: lmsText,
    });
    if (kakao.ok) return kakao;
    console.error("[notify] 알림톡 실패 → LMS 폴백:", kakao.error);
  }

  const sms = await sendSms(subscriber.phone, lmsText);
  if (sms.ok) return sms;
  return {
    ok: false,
    error: `알림톡/LMS 모두 실패: ${sms.error}`,
  };
}
