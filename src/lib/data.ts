import type { Auction, LegalQuestion, NewsFeedItem, Property, SuccessStory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { newsFeedVisibleWhere } from "@/lib/news-feed";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { getLandingHomeDataFromSupabase } from "@/lib/supabase/repos/landing";

export async function getLandingFeaturedData() {
  const [properties, auctions, propertyCount, auctionCount, newsCount, legalCount] =
    await Promise.all([
      prisma.property.findMany({
        where: { status: "ACTIVE" },
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      }),
      prisma.auction.findMany({
        where: { status: "ONGOING" },
        orderBy: [{ featured: "desc" }, { dDay: "asc" }],
      }),
      prisma.property.count({ where: { status: "ACTIVE" } }),
      prisma.auction.count({ where: { status: "ONGOING" } }),
      prisma.news.count(),
      prisma.legalQuestion.count({ where: { isPublic: true } }),
    ]);

  return {
    properties,
    auctions,
    counts: {
      properties: propertyCount,
      auctions: auctionCount,
      news: newsCount,
      legal: legalCount,
    },
  };
}

const emptyLandingHomeData = (): {
  properties: Property[];
  auctions: Auction[];
  newsFeed: NewsFeedItem[];
  legalQuestions: LegalQuestion[];
  successStories: SuccessStory[];
} => ({
  properties: [],
  auctions: [],
  newsFeed: [],
  legalQuestions: [],
  successStories: [],
});

/** 홈 히어로 하단 멀티 섹션용 */
export async function getLandingHomeData(): Promise<{
  properties: Property[];
  auctions: Auction[];
  newsFeed: NewsFeedItem[];
  legalQuestions: LegalQuestion[];
  successStories: SuccessStory[];
}> {
  try {
    if (isSupabaseEnabled()) {
      const data = await getLandingHomeDataFromSupabase();
      return {
        properties: data.properties as unknown as Property[],
        auctions: data.auctions as unknown as Auction[],
        newsFeed: data.newsFeed as unknown as NewsFeedItem[],
        legalQuestions: data.legalQuestions as unknown as LegalQuestion[],
        successStories: data.successStories as unknown as SuccessStory[],
      };
    }

    const now = new Date();
    const [properties, auctions, estateNews, regionNews, legalQuestions, successStories] =
      await Promise.all([
        prisma.property.findMany({
          where: { status: "ACTIVE" },
          orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
          take: 12,
        }),
        prisma.auction.findMany({
          where: { status: "ONGOING" },
          orderBy: [{ featured: "desc" }, { dDay: "asc" }],
          take: 12,
        }),
        /** 부동산소식 전체보기 상위 3건 */
        prisma.newsFeedItem.findMany({
          where: newsFeedVisibleWhere("all", now, "estate"),
          orderBy: { pubDate: "desc" },
          take: 3,
        }),
        /** 지역소식 전체보기 상위 2건 */
        prisma.newsFeedItem.findMany({
          where: newsFeedVisibleWhere("all", now, "region"),
          orderBy: { pubDate: "desc" },
          take: 2,
        }),
        prisma.legalQuestion.findMany({
          where: { isPublic: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
        prisma.successStory.findMany({
          where: { status: "PUBLISHED" },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

    return {
      properties,
      auctions,
      newsFeed: [...estateNews, ...regionNews],
      legalQuestions,
      successStories,
    };
  } catch (error) {
    // Vercel 등에서 SQLite가 없거나 Supabase 미설정 시에도 홈은 렌더되게 함
    console.error("[getLandingHomeData] falling back to empty data", error);
    return emptyLandingHomeData();
  }
}

export async function getHomeDashboardData() {
  const [properties, auctions, news, legalQuestions, propertyCount, auctionCount, newsCount, legalCount] =
    await Promise.all([
      prisma.property.findMany({
        where: { status: "ACTIVE" },
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
        take: 12,
      }),
      prisma.auction.findMany({
        where: { status: "ONGOING" },
        orderBy: { dDay: "asc" },
        take: 12,
      }),
      prisma.news.findMany({
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
        take: 12,
      }),
      prisma.legalQuestion.findMany({
        where: { isPublic: true },
        orderBy: { createdAt: "desc" },
        take: 12,
      }),
      prisma.property.count({ where: { status: "ACTIVE" } }),
      prisma.auction.count({ where: { status: "ONGOING" } }),
      prisma.news.count(),
      prisma.legalQuestion.count({ where: { isPublic: true } }),
    ]);

  return {
    properties,
    auctions,
    news,
    legalQuestions,
    counts: {
      properties: propertyCount,
      auctions: auctionCount,
      news: newsCount,
      legal: legalCount,
    },
  };
}

export async function getAdminDashboardData() {
  try {
    const [
      visitorCount,
      consultationPending,
      activeAuctions,
      apiIntegrations,
      scrapingJob,
      consultations,
      systemLogs,
    ] = await Promise.all([
      Promise.resolve(1284),
      prisma.consultation.count({
        where: { status: { in: ["PENDING", "PROCESSING"] } },
      }),
      prisma.auction.count({ where: { status: "ONGOING" } }),
      prisma.apiIntegration.findMany({ orderBy: { name: "asc" } }),
      prisma.scrapingJob.findFirst({ orderBy: { updatedAt: "desc" } }),
      prisma.consultation.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.systemLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return {
      stats: {
        visitors: visitorCount,
        visitorGrowth: 12,
        newInquiries: consultationPending,
        activeAuctions,
        apiSuccessRate: 99.8,
      },
      apiIntegrations,
      scrapingJob,
      consultations,
      systemLogs,
    };
  } catch (error) {
    console.error("[getAdminDashboardData] falling back to empty data", error);
    return {
      stats: {
        visitors: 0,
        visitorGrowth: 0,
        newInquiries: 0,
        activeAuctions: 0,
        apiSuccessRate: 0,
      },
      apiIntegrations: [],
      scrapingJob: null,
      consultations: [],
      systemLogs: [],
    };
  }
}
