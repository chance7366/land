/**
 * 부동산소식 일일 메일 발송 (승인된 NEWS 구독자 · 하루 1회).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { sendMail } from "@/lib/mailer";
import { buildNewsDigestEmail, seoulDateKey } from "@/lib/news-digest-email";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_NEWS_SOURCES,
  parseChannels,
  parsePreferences,
  type NewsDigestSourceId,
  type NewsPreferences,
} from "@/lib/subscription";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { listSubscribersSupabase } from "@/lib/supabase/repos/subscribers";
import { loadTodayArticles } from "@/lib/news-today";

const ENTITY_TYPE = "NEWS_DIGEST";
const CHANNEL = "EMAIL";

export type NewsDigestSendResult = {
  dateKey: string;
  articleCount: number;
  matched: number;
  sent: number;
  skipped: number;
  failed: number;
  errors: string[];
};

type DigestSubscriber = {
  id: string;
  email: string;
  unsubscribeToken: string;
  sources: NewsDigestSourceId[];
};

function ledgerPath(dateKey: string): string {
  const dir = join(process.cwd(), "storage", "logs");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return join(dir, `news-digest-sent-${dateKey.replace(/-/g, "")}.json`);
}

function readLedger(dateKey: string): Record<string, string> {
  const path = ledgerPath(dateKey);
  if (!existsSync(path)) return {};
  try {
    const raw = JSON.parse(readFileSync(path, "utf8")) as Record<string, string>;
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
}

function writeLedger(dateKey: string, ledger: Record<string, string>) {
  writeFileSync(ledgerPath(dateKey), JSON.stringify(ledger, null, 2), "utf8");
}

async function alreadySent(subscriberId: string, dateKey: string): Promise<boolean> {
  const ledger = readLedger(dateKey);
  if (ledger[subscriberId] === "SENT") return true;

  try {
    const existing = await prisma.notificationLog.findUnique({
      where: {
        subscriberId_entityType_entityId_channel: {
          subscriberId,
          entityType: ENTITY_TYPE,
          entityId: dateKey,
          channel: CHANNEL,
        },
      },
    });
    return existing?.status === "SENT";
  } catch {
    return false;
  }
}

async function markSent(
  subscriberId: string,
  dateKey: string,
  ok: boolean,
  errorMessage?: string,
) {
  const ledger = readLedger(dateKey);
  ledger[subscriberId] = ok ? "SENT" : "FAILED";
  writeLedger(dateKey, ledger);

  try {
    await prisma.notificationLog.upsert({
      where: {
        subscriberId_entityType_entityId_channel: {
          subscriberId,
          entityType: ENTITY_TYPE,
          entityId: dateKey,
          channel: CHANNEL,
        },
      },
      create: {
        subscriberId,
        entityType: ENTITY_TYPE,
        entityId: dateKey,
        channel: CHANNEL,
        status: ok ? "SENT" : "FAILED",
        errorMessage: ok ? null : (errorMessage ?? "fail"),
      },
      update: {
        status: ok ? "SENT" : "FAILED",
        errorMessage: ok ? null : (errorMessage ?? "fail"),
      },
    });
  } catch {
    // Supabase-only 구독자 id 는 Prisma FK 가 없을 수 있음 — 레저로 충분
  }
}

async function loadApprovedNewsSubscribers(): Promise<DigestSubscriber[]> {
  if (isSupabaseEnabled()) {
    const rows = await listSubscribersSupabase({
      status: "APPROVED",
      subscriptionType: "NEWS",
    });
    return rows
      .filter((r) => r.email?.trim())
      .map((r) => {
        const prefs = parsePreferences("NEWS", r.preferences) as NewsPreferences;
        const channels = parseChannels(r.channels);
        if (!channels.includes("EMAIL")) return null;
        return {
          id: r.id,
          email: r.email!.trim().toLowerCase(),
          unsubscribeToken: r.unsubscribe_token,
          sources: prefs.sources.length ? prefs.sources : [...DEFAULT_NEWS_SOURCES],
        };
      })
      .filter(Boolean) as DigestSubscriber[];
  }

  const rows = await prisma.emailSubscriber.findMany({
    where: { status: "APPROVED", subscriptionType: "NEWS" },
  });
  return rows
    .filter((r) => r.email?.trim())
    .map((r) => {
      const prefs = parsePreferences("NEWS", r.preferences) as NewsPreferences;
      const channels = parseChannels(r.channels);
      if (!channels.includes("EMAIL")) return null;
      return {
        id: r.id,
        email: r.email!.trim().toLowerCase(),
        unsubscribeToken: r.unsubscribeToken,
        sources: prefs.sources.length ? prefs.sources : [...DEFAULT_NEWS_SOURCES],
      };
    })
    .filter(Boolean) as DigestSubscriber[];
}

export async function sendDailyNewsDigest(options?: {
  dateKey?: string;
  force?: boolean;
}): Promise<NewsDigestSendResult> {
  const dateKey = options?.dateKey ?? seoulDateKey();
  const articles = await loadTodayArticles(dateKey);
  const subscribers = await loadApprovedNewsSubscribers();

  const result: NewsDigestSendResult = {
    dateKey,
    articleCount: articles.length,
    matched: subscribers.length,
    sent: 0,
    skipped: 0,
    failed: 0,
    errors: [],
  };

  for (const sub of subscribers) {
    if (!options?.force && (await alreadySent(sub.id, dateKey))) {
      result.skipped += 1;
      continue;
    }

    const filtered = articles.filter((a) =>
      sub.sources.includes(a.source as NewsDigestSourceId),
    );
    const mail = buildNewsDigestEmail({
      dateKey,
      items: filtered,
      sources: sub.sources,
      unsubscribeToken: sub.unsubscribeToken,
    });

    const send = await sendMail({
      to: sub.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });

    if (send.ok) {
      await markSent(sub.id, dateKey, true);
      result.sent += 1;
    } else {
      await markSent(sub.id, dateKey, false, send.error);
      result.failed += 1;
      result.errors.push(`${sub.email}: ${send.error}`);
    }
  }

  return result;
}
