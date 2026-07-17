export const HOME_TRUST_POINTS = [
  {
    title: "정식 매수신청대리 등록업소",
    body: "법원 공인 경매대리 자격 보유",
  },
  {
    title: "철저한 권리분석 & 현장조사",
    body: "인수 권리 및 숨은 유치권 완벽 분석",
  },
  {
    title: "내포·홍성 지역 밀착 중개",
    body: "지역 호재 및 행정 공지 기반의 정밀 분석",
  },
] as const;

export const HOME_TRUST_TAGLINE =
  "정확한 권리분석, 안전한 중개, 성공적인 경매 투자 — 찬스부동산이 함께합니다.";

export type HomeStoryBadgeTone = "auction" | "sale" | "land";

export const STORY_BADGE_CLASS: Record<HomeStoryBadgeTone, string> = {
  auction: "border-[#d4af37]/45 bg-[#d4af37]/15 text-[#fde68a]",
  sale: "border-[#4dabff]/45 bg-[#4dabff]/15 text-[#93c5fd]",
  land: "border-lime-400/40 bg-lime-500/15 text-lime-200",
};

export function storyBadgeFromCategory(category: string): {
  badge: string;
  tone: HomeStoryBadgeTone;
} {
  if (category.includes("경매") || category.includes("공매")) {
    return { badge: category, tone: "auction" };
  }
  if (category.includes("토지")) {
    return { badge: category, tone: "land" };
  }
  return { badge: category || "중개", tone: "sale" };
}

/** 찬스상담소 카테고리 뱃지 (성공스토리와 동일 pill 스타일) */
export function qaCategoryBadgeClass(category: string): string {
  if (category.includes("경매") || category.includes("권리")) {
    return STORY_BADGE_CLASS.auction;
  }
  if (category.includes("세무") || category.includes("법률")) {
    return "border-violet-400/45 bg-violet-500/15 text-violet-200";
  }
  if (category.includes("임대")) {
    return "border-emerald-400/45 bg-emerald-500/15 text-emerald-300";
  }
  if (category.includes("중개")) {
    return STORY_BADGE_CLASS.sale;
  }
  return "border-white/25 bg-white/10 text-white/75";
}
