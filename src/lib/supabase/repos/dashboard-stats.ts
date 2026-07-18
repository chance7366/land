import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { prisma } from "@/lib/prisma";

export type DashboardConsultRow = {
  id: string;
  clientName: string;
  category: string;
  preferredAt: string | null;
  createdAt: string;
  status: string;
};

export type DashboardNamedCount = { name: string; value: number; extra?: number };
export type DashboardMonthPoint = { month: string; consults: number; visitors: number; stories: number };
export type DashboardChannel = { channel: string; visits: number; converts: number; rate: number };
export type DashboardSupplyGap = { region: string; searches: number; supply: number; gap: number };
export type DashboardKeyword = { keyword: string; count: number };
export type DashboardFunnel = { stage: string; value: number; fill: string };
export type DashboardMenuShare = { name: string; value: number; fill: string };

export type AdminDashboardPayload = {
  action: {
    legalPending: number;
    legalOver24h: number;
    consultPending: number;
    consultRecent: DashboardConsultRow[];
    subscriberPending: number;
  };
  inventory: {
    propertyTotal: number;
    auctionTotal: number;
    propertyMonth: number;
    auctionMonth: number;
    propertyTarget: number;
    auctionTarget: number;
  };
  successStoryMonthly: { month: string; count: number }[];
  topProperties: DashboardNamedCount[];
  topAuctions: DashboardNamedCount[];
  dwellTop: DashboardNamedCount[];
  customerActions: { share: number; copyLink: number; print: number };
  menuShare: DashboardMenuShare[];
  funnel: DashboardFunnel[];
  monthly: DashboardMonthPoint[];
  storyMarkers: { month: string; label: string }[];
  searchKeywords: DashboardKeyword[];
  supplyGap: DashboardSupplyGap[];
  attribution: DashboardChannel[];
  responseHours: { legalAvgHours: number; consultAvgHours: number; targetHours: number };
  eventsReady: boolean;
};

const MENU_COLORS: Record<string, string> = {
  home: "#f97316",
  properties: "#4dabff",
  auctions: "#d4af37",
  legal: "#34d399",
  news: "#d450ff",
  success_stories: "#fbbf24",
  profile: "#f472b6",
  location: "#38bdf8",
  consultation: "#a78bfa",
  other: "#94a3b8",
};

const MENU_LABELS: Record<string, string> = {
  home: "홈",
  properties: "부동산중개",
  auctions: "경매공매",
  legal: "찬스상담소",
  news: "소식",
  success_stories: "성공스토리",
  profile: "프로필",
  location: "오시는길",
  consultation: "상담예약",
  other: "기타",
};

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const m = Number(key.split("-")[1]);
  return `${m}월`;
}

function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

function numEnv(name: string, fallback: number) {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

function emptyEventsSlice(): Pick<
  AdminDashboardPayload,
  | "topProperties"
  | "topAuctions"
  | "dwellTop"
  | "customerActions"
  | "menuShare"
  | "funnel"
  | "monthly"
  | "storyMarkers"
  | "searchKeywords"
  | "supplyGap"
  | "attribution"
  | "eventsReady"
> {
  return {
    topProperties: [],
    topAuctions: [],
    dwellTop: [],
    customerActions: { share: 0, copyLink: 0, print: 0 },
    menuShare: [],
    funnel: [],
    monthly: [],
    storyMarkers: [],
    searchKeywords: [],
    supplyGap: [],
    attribution: [],
    eventsReady: false,
  };
}

async function resolveTitles(
  sb: ReturnType<typeof createSupabaseAdminClient>,
  type: "property" | "auction",
  ids: string[],
) {
  if (!ids.length) return new Map<string, string>();
  const table = type === "property" ? "properties" : "auctions";
  const { data } = await sb.from(table).select("id, title").in("id", ids);
  return new Map((data ?? []).map((r) => [String(r.id), String(r.title ?? r.id)]));
}

async function loadEventsFromSupabase(
  sb: ReturnType<typeof createSupabaseAdminClient>,
  storyMonthly: { month: string; count: number }[],
  consultMonthly: Map<string, number>,
): Promise<ReturnType<typeof emptyEventsSlice>> {
  const since = daysAgo(30).toISOString();
  const { data, error } = await sb
    .from("page_events")
    .select("event_type, menu_key, target_type, target_id, metadata, created_at, path")
    .gte("created_at", since)
    .limit(20000);

  if (error) {
    console.warn("[dashboard] page_events", error.message);
    return emptyEventsSlice();
  }

  const rows = data ?? [];
  const pageViews = rows.filter((r) => r.event_type === "page_view");
  const itemClicks = rows.filter((r) => r.event_type === "item_click");
  const dwells = rows.filter((r) => r.event_type === "item_dwell");
  const ctas = rows.filter((r) => r.event_type === "cta_click");
  const searches = rows.filter((r) => r.event_type === "search");
  const shares = rows.filter((r) => r.event_type === "share_action");

  // menu share
  const menuCounts = new Map<string, number>();
  for (const r of pageViews) {
    const k = String(r.menu_key || "other");
    menuCounts.set(k, (menuCounts.get(k) ?? 0) + 1);
  }
  const menuTotal = [...menuCounts.values()].reduce((a, b) => a + b, 0) || 1;
  const menuShare: DashboardMenuShare[] = [...menuCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([k, v]) => ({
      name: MENU_LABELS[k] ?? k,
      value: Math.round((v / menuTotal) * 100),
      fill: MENU_COLORS[k] ?? "#94a3b8",
    }));

  // top property / auction clicks
  async function topByType(type: "property" | "auction"): Promise<DashboardNamedCount[]> {
    const counts = new Map<string, number>();
    for (const r of itemClicks) {
      if (r.target_type !== type || !r.target_id) continue;
      const id = String(r.target_id);
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    const titles = await resolveTitles(
      sb,
      type,
      top.map(([id]) => id),
    );
    return top.map(([id, value]) => ({ name: titles.get(id) ?? id.slice(0, 8), value }));
  }

  const topProperties = await topByType("property");
  const topAuctions = await topByType("auction");

  // dwell top
  const dwellMap = new Map<string, { sum: number; n: number; type: string }>();
  for (const r of dwells) {
    if (!r.target_id) continue;
    const id = String(r.target_id);
    const meta = (r.metadata ?? {}) as Record<string, unknown>;
    const ms = Number(meta.dwellMs ?? 30000);
    const cur = dwellMap.get(id) ?? { sum: 0, n: 0, type: String(r.target_type ?? "property") };
    cur.sum += ms;
    cur.n += 1;
    dwellMap.set(id, cur);
  }
  const dwellSorted = [...dwellMap.entries()]
    .map(([id, v]) => ({ id, avgSec: Math.round(v.sum / v.n / 1000), type: v.type, n: v.n }))
    .sort((a, b) => b.avgSec - a.avgSec)
    .slice(0, 5);
  const propTitles = await resolveTitles(
    sb,
    "property",
    dwellSorted.filter((d) => d.type === "property").map((d) => d.id),
  );
  const aucTitles = await resolveTitles(
    sb,
    "auction",
    dwellSorted.filter((d) => d.type === "auction").map((d) => d.id),
  );
  const dwellTop: DashboardNamedCount[] = dwellSorted.map((d) => ({
    name:
      d.type === "auction"
        ? (aucTitles.get(d.id) ?? d.id.slice(0, 8))
        : (propTitles.get(d.id) ?? d.id.slice(0, 8)),
    value: d.avgSec,
    extra: d.n,
  }));

  const customerActions = {
    share: shares.filter((r) => (r.metadata as { action?: string })?.action === "share").length ||
      shares.filter((r) => String((r.metadata as { action?: string })?.action ?? "").includes("share")).length,
    copyLink: shares.filter((r) => (r.metadata as { action?: string })?.action === "copy").length,
    print: shares.filter((r) => (r.metadata as { action?: string })?.action === "print").length,
  };
  // fallback: count by action string loosely
  if (shares.length && !customerActions.share && !customerActions.copyLink && !customerActions.print) {
    customerActions.share = shares.length;
  }

  const funnel: DashboardFunnel[] = [
    { stage: "총 방문자(PV)", value: pageViews.length, fill: "#4dabff" },
    { stage: "매물·경매 클릭", value: itemClicks.length, fill: "#d450ff" },
    {
      stage: "상담·알림 전환",
      value: ctas.filter((c) =>
        ["consult_submit", "alert_subscribe"].includes(
          String((c.metadata as { action?: string })?.action ?? ""),
        ),
      ).length,
      fill: "#34d399",
    },
  ];

  // monthly visitors from page_view + consults/stories overlays
  const visitorMonth = new Map<string, number>();
  for (const r of pageViews) {
    const k = monthKey(new Date(String(r.created_at)));
    visitorMonth.set(k, (visitorMonth.get(k) ?? 0) + 1);
  }
  const keys = new Set([
    ...visitorMonth.keys(),
    ...consultMonthly.keys(),
    ...storyMonthly.map((s) => s.month),
  ]);
  const sortedKeys = [...keys].sort().slice(-6);
  const monthly: DashboardMonthPoint[] = sortedKeys.map((k) => ({
    month: monthLabel(k),
    consults: consultMonthly.get(k) ?? 0,
    visitors: visitorMonth.get(k) ?? 0,
    stories: storyMonthly.find((s) => s.month === k)?.count ?? 0,
  }));
  const storyMarkers = storyMonthly
    .filter((s) => s.count > 0 && sortedKeys.includes(s.month))
    .map((s) => ({ month: monthLabel(s.month), label: `스토리+${s.count}` }));

  // search keywords
  const kw = new Map<string, number>();
  for (const r of searches) {
    const meta = r.metadata as { keyword?: string; q?: string };
    const key = String(meta.keyword ?? meta.q ?? "").trim();
    if (!key) continue;
    kw.set(key, (kw.get(key) ?? 0) + 1);
  }
  const searchKeywords = [...kw.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([keyword, count]) => ({ keyword, count }));

  // supply gap: search regions vs property counts by region field
  const regionSearch = new Map<string, number>();
  for (const r of searches) {
    const meta = r.metadata as { region?: string; keyword?: string };
    const region = String(meta.region ?? meta.keyword ?? "").trim();
    if (!region || region.length > 20) continue;
    regionSearch.set(region, (regionSearch.get(region) ?? 0) + 1);
  }
  const { data: props } = await sb.from("properties").select("region, address").limit(2000);
  const supplyByRegion = new Map<string, number>();
  for (const p of props ?? []) {
    const region = String(p.region || "").trim() || "기타";
    supplyByRegion.set(region, (supplyByRegion.get(region) ?? 0) + 1);
  }
  const supplyGap: DashboardSupplyGap[] = [...regionSearch.entries()]
    .map(([region, searchesN]) => {
      const supply = supplyByRegion.get(region) ?? 0;
      return { region, searches: searchesN, supply, gap: Math.max(0, searchesN - supply * 10) };
    })
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 5);

  // attribution by metadata.ref
  const byRef = new Map<string, { visits: number; converts: number }>();
  for (const r of pageViews) {
    const ref = String((r.metadata as { ref?: string })?.ref ?? "direct").toLowerCase() || "direct";
    const channel =
      ref.includes("youtube") || ref === "yt"
        ? "유튜브"
        : ref.includes("blog") || ref.includes("naver")
          ? "네이버 블로그"
          : ref === "direct" || ref === ""
            ? "직접·검색"
            : "기타 SNS";
    const cur = byRef.get(channel) ?? { visits: 0, converts: 0 };
    cur.visits += 1;
    byRef.set(channel, cur);
  }
  for (const r of ctas) {
    const ref = String((r.metadata as { ref?: string })?.ref ?? "direct").toLowerCase();
    const channel =
      ref.includes("youtube") || ref === "yt"
        ? "유튜브"
        : ref.includes("blog") || ref.includes("naver")
          ? "네이버 블로그"
          : ref === "direct" || ref === ""
            ? "직접·검색"
            : "기타 SNS";
    const cur = byRef.get(channel) ?? { visits: 0, converts: 0 };
    cur.converts += 1;
    byRef.set(channel, cur);
  }
  const attribution: DashboardChannel[] = [...byRef.entries()].map(([channel, v]) => ({
    channel,
    visits: v.visits,
    converts: v.converts,
    rate: v.visits ? Math.round((v.converts / v.visits) * 1000) / 10 : 0,
  }));

  return {
    topProperties,
    topAuctions,
    dwellTop,
    customerActions,
    menuShare,
    funnel,
    monthly,
    storyMarkers,
    searchKeywords,
    supplyGap,
    attribution,
    eventsReady: true,
  };
}

export async function getAdminDashboardPayload(): Promise<AdminDashboardPayload> {
  const propertyTarget = numEnv("ADMIN_MONTHLY_PROPERTY_TARGET", 30);
  const auctionTarget = numEnv("ADMIN_MONTHLY_AUCTION_TARGET", 10);
  const monthStart = startOfMonth().toISOString();
  const over24h = daysAgo(1).toISOString();

  if (!isSupabaseEnabled()) {
    return getAdminDashboardPayloadPrisma(propertyTarget, auctionTarget);
  }

  const sb = createSupabaseAdminClient();

  const [
    legalPendingRes,
    legalOldRes,
    consultPendingRes,
    consultRecentRes,
    subPendingRes,
    propCountRes,
    aucCountRes,
    propMonthRes,
    aucMonthRes,
    storiesRes,
    consultsAllRes,
    legalAnsweredRes,
    consultDoneRes,
  ] = await Promise.all([
    sb
      .from("legal_questions")
      .select("id", { count: "exact", head: true })
      .in("status", ["PENDING", "REVIEWING"]),
    sb
      .from("legal_questions")
      .select("id", { count: "exact", head: true })
      .in("status", ["PENDING", "REVIEWING"])
      .lt("created_at", over24h),
    sb
      .from("consultations")
      .select("id", { count: "exact", head: true })
      .in("status", ["PENDING", "PROCESSING"]),
    sb
      .from("consultations")
      .select("id, client_name, category, preferred_at, created_at, status")
      .in("status", ["PENDING", "PROCESSING"])
      .order("created_at", { ascending: false })
      .limit(6),
    sb
      .from("subscribers")
      .select("id", { count: "exact", head: true })
      .eq("status", "PENDING"),
    sb.from("properties").select("id", { count: "exact", head: true }),
    sb.from("auctions").select("id", { count: "exact", head: true }),
    sb
      .from("properties")
      .select("id", { count: "exact", head: true })
      .gte("created_at", monthStart),
    sb
      .from("auctions")
      .select("id", { count: "exact", head: true })
      .gte("created_at", monthStart),
    sb
      .from("success_stories")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(500),
    sb.from("consultations").select("created_at").limit(2000),
    sb
      .from("legal_questions")
      .select("created_at, answered_at")
      .eq("status", "ANSWERED")
      .not("answered_at", "is", null)
      .limit(500),
    sb
      .from("consultations")
      .select("created_at, replied_at, updated_at, status")
      .eq("status", "DONE")
      .limit(500),
  ]);

  const storyMonthlyMap = new Map<string, number>();
  for (const s of storiesRes.data ?? []) {
    const k = monthKey(new Date(String(s.created_at)));
    storyMonthlyMap.set(k, (storyMonthlyMap.get(k) ?? 0) + 1);
  }
  const successStoryMonthly = [...storyMonthlyMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([month, count]) => ({ month, count }));

  const consultMonthly = new Map<string, number>();
  for (const c of consultsAllRes.data ?? []) {
    const k = monthKey(new Date(String(c.created_at)));
    consultMonthly.set(k, (consultMonthly.get(k) ?? 0) + 1);
  }

  let legalAvg = 0;
  const legalTimes = (legalAnsweredRes.data ?? [])
    .map((r) => {
      const a = new Date(String(r.answered_at)).getTime();
      const c = new Date(String(r.created_at)).getTime();
      return a > c ? (a - c) / 3600000 : null;
    })
    .filter((n): n is number => n != null);
  if (legalTimes.length) legalAvg = legalTimes.reduce((a, b) => a + b, 0) / legalTimes.length;

  let consultAvg = 0;
  const consultTimes = (consultDoneRes.data ?? [])
    .map((r) => {
      const end = r.replied_at ? new Date(String(r.replied_at)).getTime() : new Date(String(r.updated_at)).getTime();
      const c = new Date(String(r.created_at)).getTime();
      return end > c ? (end - c) / 3600000 : null;
    })
    .filter((n): n is number => n != null);
  if (consultTimes.length) consultAvg = consultTimes.reduce((a, b) => a + b, 0) / consultTimes.length;

  const events = await loadEventsFromSupabase(sb, successStoryMonthly, consultMonthly);

  // If no monthly from events, build from consult/stories only
  let monthly = events.monthly;
  if (!monthly.length) {
    const keys = new Set([...consultMonthly.keys(), ...successStoryMonthly.map((s) => s.month)]);
    monthly = [...keys]
      .sort()
      .slice(-6)
      .map((k) => ({
        month: monthLabel(k),
        consults: consultMonthly.get(k) ?? 0,
        visitors: 0,
        stories: successStoryMonthly.find((s) => s.month === k)?.count ?? 0,
      }));
  }

  return {
    action: {
      legalPending: legalPendingRes.count ?? 0,
      legalOver24h: legalOldRes.count ?? 0,
      consultPending: consultPendingRes.count ?? 0,
      consultRecent: (consultRecentRes.data ?? []).map((r) => ({
        id: String(r.id),
        clientName: String(r.client_name ?? ""),
        category: String(r.category ?? ""),
        preferredAt: r.preferred_at ? String(r.preferred_at) : null,
        createdAt: String(r.created_at),
        status: String(r.status ?? ""),
      })),
      subscriberPending: subPendingRes.count ?? 0,
    },
    inventory: {
      propertyTotal: propCountRes.count ?? 0,
      auctionTotal: aucCountRes.count ?? 0,
      propertyMonth: propMonthRes.count ?? 0,
      auctionMonth: aucMonthRes.count ?? 0,
      propertyTarget,
      auctionTarget,
    },
    successStoryMonthly,
    ...events,
    monthly,
    responseHours: {
      legalAvgHours: Math.round(legalAvg * 10) / 10,
      consultAvgHours: Math.round(consultAvg * 10) / 10,
      targetHours: 24,
    },
  };
}

async function getAdminDashboardPayloadPrisma(
  propertyTarget: number,
  auctionTarget: number,
): Promise<AdminDashboardPayload> {
  const monthStart = startOfMonth();
  const over24h = daysAgo(1);

  const [
    legalPending,
    legalOver24h,
    consultPending,
    consultRecent,
    subscriberPending,
    propertyTotal,
    auctionTotal,
    propertyMonth,
    auctionMonth,
    stories,
    consults,
  ] = await Promise.all([
    prisma.legalQuestion.count({ where: { status: { in: ["PENDING", "REVIEWING"] } } }),
    prisma.legalQuestion.count({
      where: { status: { in: ["PENDING", "REVIEWING"] }, createdAt: { lt: over24h } },
    }),
    prisma.consultation.count({ where: { status: { in: ["PENDING", "PROCESSING"] } } }),
    prisma.consultation.findMany({
      where: { status: { in: ["PENDING", "PROCESSING"] } },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.emailSubscriber.count({ where: { status: "PENDING" } }),
    prisma.property.count(),
    prisma.auction.count(),
    prisma.property.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.auction.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.successStory.findMany({ select: { createdAt: true }, take: 500 }),
    prisma.consultation.findMany({ select: { createdAt: true }, take: 2000 }),
  ]);

  const storyMonthlyMap = new Map<string, number>();
  for (const s of stories) {
    const k = monthKey(s.createdAt);
    storyMonthlyMap.set(k, (storyMonthlyMap.get(k) ?? 0) + 1);
  }
  const successStoryMonthly = [...storyMonthlyMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([month, count]) => ({ month, count }));

  const consultMonthly = new Map<string, number>();
  for (const c of consults) {
    const k = monthKey(c.createdAt);
    consultMonthly.set(k, (consultMonthly.get(k) ?? 0) + 1);
  }

  const keys = new Set([...consultMonthly.keys(), ...successStoryMonthly.map((s) => s.month)]);
  const monthly = [...keys]
    .sort()
    .slice(-6)
    .map((k) => ({
      month: monthLabel(k),
      consults: consultMonthly.get(k) ?? 0,
      visitors: 0,
      stories: successStoryMonthly.find((s) => s.month === k)?.count ?? 0,
    }));

  return {
    action: {
      legalPending,
      legalOver24h,
      consultPending,
      consultRecent: consultRecent.map((r) => ({
        id: r.id,
        clientName: r.clientName,
        category: r.category,
        preferredAt: r.preferredAt,
        createdAt: r.createdAt.toISOString(),
        status: r.status,
      })),
      subscriberPending,
    },
    inventory: {
      propertyTotal,
      auctionTotal,
      propertyMonth,
      auctionMonth,
      propertyTarget,
      auctionTarget,
    },
    successStoryMonthly,
    ...emptyEventsSlice(),
    monthly,
    storyMarkers: successStoryMonthly
      .filter((s) => s.count > 0)
      .map((s) => ({ month: monthLabel(s.month), label: `스토리+${s.count}` })),
    responseHours: { legalAvgHours: 0, consultAvgHours: 0, targetHours: 24 },
  };
}
