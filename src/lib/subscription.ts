export type SubscriptionType = "REAL_ESTATE" | "AUCTION" | "NEWS";
export type NotifyChannel = "EMAIL" | "SMS" | "KAKAO";
export type SubscriberStatus = "PENDING" | "APPROVED" | "REJECTED";

export type NewsDigestSourceId = "naver" | "r114" | "rtech";

export type RealEstatePreferences = {
  categories: string[];
  deals: string[];
  regions: string[];
};

export type AuctionPreferences = {
  regions: string[];
  itemTypes: string[];
  /** 원 단위 */
  appraisalMin?: number | null;
  /** 원 단위 */
  appraisalMax?: number | null;
};

export type NewsPreferences = {
  sources: NewsDigestSourceId[];
};

export type SubscriptionPreferences =
  | RealEstatePreferences
  | AuctionPreferences
  | NewsPreferences;

export const SUBSCRIPTION_TYPE_LABEL: Record<SubscriptionType, string> = {
  REAL_ESTATE: "부동산매매 알림",
  AUCTION: "경매물건 알림",
  NEWS: "부동산소식 알림",
};

export const CHANNEL_LABEL: Record<NotifyChannel, string> = {
  EMAIL: "메일",
  SMS: "문자",
  KAKAO: "카카오톡",
};

export const NEWS_ALERT_SOURCES: { value: NewsDigestSourceId; label: string }[] = [
  { value: "naver", label: "네이버뉴스" },
  { value: "r114", label: "부동산114" },
  { value: "rtech", label: "부동산테크" },
];

export const DEFAULT_NEWS_SOURCES: NewsDigestSourceId[] = ["naver", "r114", "rtech"];

export const PROPERTY_ALERT_CATEGORIES = [
  { value: "APARTMENT", label: "아파트" },
  { value: "OFFICETEL", label: "오피스텔" },
  { value: "RETAIL", label: "상가" },
  { value: "LAND", label: "토지/임야" },
  { value: "DETACHED", label: "단독·다가구" },
  { value: "ROW_HOUSE", label: "빌라/연립" },
  { value: "ONE_ROOM", label: "원룸·투룸" },
  { value: "OFFICE", label: "사무실" },
  { value: "FACTORY", label: "공장" },
] as const;

export const PROPERTY_ALERT_DEALS = [
  { value: "SALE", label: "매매" },
  { value: "JEONSE", label: "전세" },
  { value: "MONTHLY", label: "월세" },
] as const;

export const ALERT_REGIONS = ["홍성군", "예산군", "보령시", "서산시", "당진시", "아산시"] as const;

export const AUCTION_ALERT_TYPES = ["아파트", "주택", "상가", "토지", "공장"] as const;

const CHANNELS: NotifyChannel[] = ["EMAIL", "SMS", "KAKAO"];
const NEWS_SOURCE_SET = new Set<string>(DEFAULT_NEWS_SOURCES);

export function isNewsDigestSourceId(value: string): value is NewsDigestSourceId {
  return NEWS_SOURCE_SET.has(value);
}

export function parseChannels(raw: unknown): NotifyChannel[] {
  if (typeof raw === "string") {
    try {
      return parseChannels(JSON.parse(raw));
    } catch {
      return [];
    }
  }
  if (!Array.isArray(raw)) return [];
  return raw.filter((c): c is NotifyChannel => CHANNELS.includes(c as NotifyChannel));
}

export function parsePreferences(type: SubscriptionType, raw: unknown): SubscriptionPreferences {
  const obj =
    typeof raw === "string"
      ? (() => {
          try {
            return JSON.parse(raw) as Record<string, unknown>;
          } catch {
            return {};
          }
        })()
      : raw && typeof raw === "object"
        ? (raw as Record<string, unknown>)
        : {};

  if (type === "NEWS") {
    const sources = Array.isArray(obj.sources)
      ? obj.sources
          .filter((s): s is string => typeof s === "string")
          .map((s) => s.trim())
          .filter(isNewsDigestSourceId)
      : [];
    return { sources: sources.length ? sources : [...DEFAULT_NEWS_SOURCES] };
  }

  const regions = Array.isArray(obj.regions)
    ? obj.regions.filter((r): r is string => typeof r === "string" && r.trim().length > 0).map((r) => r.trim())
    : [];

  if (type === "REAL_ESTATE") {
    return {
      regions,
      categories: Array.isArray(obj.categories)
        ? obj.categories.filter((c): c is string => typeof c === "string").map((c) => c.trim())
        : [],
      deals: Array.isArray(obj.deals)
        ? obj.deals.filter((d): d is string => typeof d === "string").map((d) => d.trim())
        : [],
    };
  }

  const toNum = (v: unknown) => {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  return {
    regions,
    itemTypes: Array.isArray(obj.itemTypes)
      ? obj.itemTypes.filter((t): t is string => typeof t === "string").map((t) => t.trim())
      : [],
    appraisalMin: toNum(obj.appraisalMin),
    appraisalMax: toNum(obj.appraisalMax),
  };
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function formatPhoneDisplay(phone: string): string {
  const d = normalizePhone(phone);
  if (d.length === 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return phone.trim();
}

export type CreateSubscriptionInput = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  subscriptionType: SubscriptionType;
  channels: NotifyChannel[];
  preferences: SubscriptionPreferences;
  isPrivacyAgreed: boolean;
};

export type ValidationResult =
  | { ok: true; data: CreateSubscriptionInput }
  | { ok: false; error: string };

export function validateSubscriptionBody(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "잘못된 요청입니다." };
  }
  const b = body as Record<string, unknown>;
  const subscriptionType = b.subscriptionType;
  if (
    subscriptionType !== "REAL_ESTATE" &&
    subscriptionType !== "AUCTION" &&
    subscriptionType !== "NEWS"
  ) {
    return { ok: false, error: "알림 유형을 선택해 주세요." };
  }

  let channels = parseChannels(b.channels);
  if (subscriptionType === "NEWS") {
    // 부동산소식은 메일링 전용
    channels = ["EMAIL"];
  }
  if (channels.length === 0) {
    return { ok: false, error: "알림 수단을 하나 이상 선택해 주세요." };
  }

  if (!b.isPrivacyAgreed) {
    return { ok: false, error: "개인정보 수집·이용에 동의해 주세요." };
  }

  const needEmail = channels.includes("EMAIL");
  const needPhone = channels.includes("SMS") || channels.includes("KAKAO");

  const email =
    typeof b.email === "string" && b.email.trim() ? b.email.trim().toLowerCase() : null;
  const phoneRaw = typeof b.phone === "string" && b.phone.trim() ? b.phone.trim() : null;
  const phone = phoneRaw ? normalizePhone(phoneRaw) : null;
  const name = typeof b.name === "string" && b.name.trim() ? b.name.trim() : null;

  if (needEmail) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, error: "메일 알림을 위해 올바른 이메일을 입력해 주세요." };
    }
  }
  if (needPhone) {
    if (!phone || phone.length < 10 || phone.length > 11) {
      return { ok: false, error: "문자·카카오톡 알림을 위해 휴대폰 번호를 입력해 주세요." };
    }
  }
  if (!email && !phone) {
    return { ok: false, error: "이메일 또는 휴대폰 번호가 필요합니다." };
  }

  const preferences = parsePreferences(subscriptionType, b.preferences);

  if (subscriptionType === "NEWS") {
    const p = preferences as NewsPreferences;
    if (!p.sources.length) {
      return { ok: false, error: "소식 출처를 하나 이상 선택해 주세요." };
    }
  } else if (subscriptionType === "REAL_ESTATE") {
    const p = preferences as RealEstatePreferences;
    if (!p.regions.length || !p.categories.length || !p.deals.length) {
      return { ok: false, error: "관심 지역·매물 유형·거래 유형을 선택해 주세요." };
    }
  } else {
    const p = preferences as AuctionPreferences;
    if (!p.regions.length || !p.itemTypes.length) {
      return { ok: false, error: "관심 지역·경매 유형을 선택해 주세요." };
    }
    if (
      p.appraisalMin != null &&
      p.appraisalMax != null &&
      p.appraisalMin > p.appraisalMax
    ) {
      return { ok: false, error: "감정가 최소가 최대보다 클 수 없습니다." };
    }
  }

  return {
    ok: true,
    data: {
      name,
      email,
      phone,
      subscriptionType,
      channels,
      preferences,
      isPrivacyAgreed: true,
    },
  };
}

export function summarizePreferences(
  type: SubscriptionType,
  preferences: SubscriptionPreferences,
): string {
  if (type === "NEWS") {
    const p = preferences as NewsPreferences;
    const labels = p.sources
      .map((s) => NEWS_ALERT_SOURCES.find((x) => x.value === s)?.label ?? s)
      .join(" · ");
    return labels || "출처 미선택";
  }
  if (type === "REAL_ESTATE") {
    const p = preferences as RealEstatePreferences;
    const cats = p.categories
      .map((c) => PROPERTY_ALERT_CATEGORIES.find((x) => x.value === c)?.label ?? c)
      .join("/");
    const deals = p.deals
      .map((d) => PROPERTY_ALERT_DEALS.find((x) => x.value === d)?.label ?? d)
      .join("/");
    return `${p.regions.join(", ")} · ${cats} · ${deals}`;
  }
  const p = preferences as AuctionPreferences;
  const min =
    p.appraisalMin != null ? `${Math.round(p.appraisalMin / 10000).toLocaleString()}만` : "—";
  const max =
    p.appraisalMax != null ? `${Math.round(p.appraisalMax / 10000).toLocaleString()}만` : "—";
  return `${p.regions.join(", ")} · ${p.itemTypes.join("/")} · 감정가 ${min}~${max}`;
}

/** UI 만원 → 원 */
export function manwonToWon(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 10000);
}
