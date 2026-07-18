/**
 * 로컬 SQLite(prisma/dev.db) → Supabase Postgres 이관
 * 사용: npx tsx scripts/migrate-sqlite-to-supabase.ts
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) throw new Error(".env.local 이 없습니다.");
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

function parseJsonArray(raw: string | null | undefined): unknown[] {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function parseJsonObject(raw: string | null | undefined): Record<string, unknown> {
  try {
    const v = JSON.parse(raw || "{}");
    return v && typeof v === "object" && !Array.isArray(v) ? v : {};
  } catch {
    return {};
  }
}

async function upsertBatched(
  sb: ReturnType<typeof createClient>,
  table: string,
  rows: Record<string, unknown>[],
  onConflict: string,
) {
  const chunk = 50;
  let ok = 0;
  for (let i = 0; i < rows.length; i += chunk) {
    const part = rows.slice(i, i + chunk);
    const { error } = await sb.from(table).upsert(part, { onConflict });
    if (error) throw new Error(`${table}: ${error.message}`);
    ok += part.length;
  }
  return ok;
}

async function main() {
  loadEnvLocal();
  process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("Supabase URL / SERVICE_ROLE 키가 없습니다.");

  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const prisma = new PrismaClient();

  try {
    const [properties, auctions, consultations, legalQuestions, stories, subscribers] =
      await Promise.all([
        prisma.property.findMany(),
        prisma.auction.findMany(),
        prisma.consultation.findMany(),
        prisma.legalQuestion.findMany(),
        prisma.successStory.findMany(),
        prisma.emailSubscriber.findMany(),
      ]);

    console.log("로컬 건수:", {
      properties: properties.length,
      auctions: auctions.length,
      consultations: consultations.length,
      legalQuestions: legalQuestions.length,
      stories: stories.length,
      subscribers: subscribers.length,
    });

    const propertyRows = properties.map((p) => ({
      id: p.id,
      manage_code: p.manageCode,
      title: p.title,
      description: p.description ?? "",
      type: p.type,
      category: p.category,
      price: p.price,
      deposit: p.deposit,
      monthly_rent: p.monthlyRent,
      is_jeonse: p.isJeonse,
      deal_sub_type: p.dealSubType,
      area: p.area,
      address: p.address ?? "",
      region: p.region ?? "내포신도시",
      building_name: p.buildingName,
      exclusive_area: p.exclusiveArea,
      supply_area: p.supplyArea,
      floor: p.floor,
      total_floors: p.totalFloors,
      images: parseJsonArray(p.images),
      tags: parseJsonArray(p.tags),
      specs: parseJsonObject(p.specs),
      featured: p.featured,
      status: p.status,
      published_at: p.publishedAt.toISOString(),
      created_at: p.createdAt.toISOString(),
      updated_at: p.updatedAt.toISOString(),
    }));

    const auctionRows = auctions.map((a) => ({
      id: a.id,
      manage_code: a.manageCode,
      case_number: a.caseNumber,
      item_no: a.itemNo,
      title: a.title,
      description: a.description ?? "",
      appraisal_price: a.appraisalPrice,
      recommended_price: a.recommendedPrice,
      min_price: a.minPrice,
      safety_grade: a.safetyGrade,
      status: a.status,
      d_day: a.dDay,
      images: parseJsonArray(a.images),
      address: a.address,
      region: a.region,
      court: a.court,
      sale_date: a.saleDate ? a.saleDate.toISOString() : null,
      featured: a.featured,
      published_at: a.publishedAt.toISOString(),
      created_at: a.createdAt.toISOString(),
      updated_at: a.updatedAt.toISOString(),
    }));

    const consultationRows = consultations.map((c) => ({
      id: c.id,
      client_name: c.clientName,
      phone: c.phone,
      email: c.email,
      category: c.category,
      sub_category: c.subCategory,
      summary: c.summary,
      detail: c.detail,
      method: c.method,
      preferred_at: c.preferredAt,
      access_code: c.accessCode,
      reply: c.reply,
      replied_at: c.repliedAt ? c.repliedAt.toISOString() : null,
      status: c.status,
      created_at: c.createdAt.toISOString(),
      updated_at: c.updatedAt.toISOString(),
    }));

    const legalRows = legalQuestions.map((q) => ({
      id: q.id,
      category: q.category,
      question: q.question,
      content: q.content ?? "",
      author_name: q.authorName ?? "",
      phone: q.phone,
      answer: q.answer,
      answerer: q.answerer,
      status: q.status,
      is_public: q.isPublic,
      is_secret: q.isSecret,
      access_code: q.accessCode ?? "",
      suggest_consult: q.suggestConsult,
      answered_at: q.answeredAt ? q.answeredAt.toISOString() : null,
      created_at: q.createdAt.toISOString(),
      updated_at: q.updatedAt.toISOString(),
    }));

    const storyRows = stories.map((s) => ({
      id: s.id,
      category: s.category,
      title: s.title,
      content: s.content,
      author_name: s.authorName ?? "",
      status: s.status,
      created_at: s.createdAt.toISOString(),
      updated_at: s.updatedAt.toISOString(),
    }));

    const subscriberRows = subscribers.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      phone: s.phone,
      subscription_type: s.subscriptionType,
      channels: parseJsonArray(s.channels),
      preferences: parseJsonObject(s.preferences),
      status: s.status,
      is_privacy_agreed: s.isPrivacyAgreed,
      unsubscribe_token: s.unsubscribeToken,
      admin_note: s.adminNote,
      created_at: s.createdAt.toISOString(),
      updated_at: s.updatedAt.toISOString(),
    }));

    const result = {
      properties: propertyRows.length
        ? await upsertBatched(sb, "properties", propertyRows, "manage_code")
        : 0,
      auctions: auctionRows.length
        ? await upsertBatched(sb, "auctions", auctionRows, "manage_code")
        : 0,
      consultations: consultationRows.length
        ? await upsertBatched(sb, "consultations", consultationRows, "id")
        : 0,
      legal_questions: legalRows.length
        ? await upsertBatched(sb, "legal_questions", legalRows, "id")
        : 0,
      success_stories: storyRows.length
        ? await upsertBatched(sb, "success_stories", storyRows, "id")
        : 0,
      subscribers: subscriberRows.length
        ? await upsertBatched(sb, "subscribers", subscriberRows, "id")
        : 0,
    };

    console.log("Supabase 이관 완료:", result);
    console.log("※ 뉴스 피드(news_feed)는 Supabase 스키마에 없어 제외되었습니다.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
