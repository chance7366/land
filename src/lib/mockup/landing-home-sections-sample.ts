export {
  HOME_TRUST_POINTS,
  HOME_TRUST_TAGLINE,
  STORY_BADGE_CLASS,
} from "@/lib/landing-home";

export type HomeStoryCardSample = {
  id: string;
  badge: string;
  badgeTone: "auction" | "sale" | "land";
  title: string;
  summary: string;
  date: string;
  image: string;
  href: string;
};

export const HOME_STORY_CARDS: HomeStoryCardSample[] = [
  {
    id: "hs-1",
    badge: "경매 낙찰",
    badgeTone: "auction",
    title: "내포신도시 아파트 감정가 대비 70% 최저가 낙찰 성공!",
    summary: "권리분석·입찰가 추천 후 대리 입찰로 원하던 금액대 낙찰.",
    date: "2026-07-08",
    image: "/mockup/landing-home/story-auction.png",
    href: "/success-stories",
  },
  {
    id: "hs-2",
    badge: "아파트 매매",
    badgeTone: "sale",
    title: "홍북읍 아파트 매매, 계약까지 성실하게 동행",
    summary: "조건에 맞는 매물 소개와 잔금·등기까지 차질 없이 진행.",
    date: "2026-07-10",
    image: "/mockup/landing-home/story-sale.png",
    href: "/success-stories",
  },
  {
    id: "hs-3",
    badge: "토지 중개",
    badgeTone: "land",
    title: "내포 인근 토지 매매 성사 — 지역 호재 기반 상담",
    summary: "행정 공지와 개발 흐름을 반영한 중개로 만족도 높은 거래.",
    date: "2026-06-28",
    image: "/mockup/landing-home/story-land.png",
    href: "/success-stories",
  },
];

export type HomeNewsSample = {
  id: string;
  source: string;
  sourceKey: "naver" | "chungnam" | "hongseong" | "molit";
  title: string;
  date: string;
  href: string;
};

export const HOME_NEWS_SAMPLES: HomeNewsSample[] = [
  {
    id: "hn-1",
    source: "네이버",
    sourceKey: "naver",
    title: "내포신도시 생활 SOC 확충… 주택 수요 관심 이어져",
    date: "2026-07-17",
    href: "/news?source=naver",
  },
  {
    id: "hn-2",
    source: "충남도청",
    sourceKey: "chungnam",
    title: "충남도, 지역 부동산 시장 안정화 대책 발표",
    date: "2026-07-16",
    href: "/news?source=chungnam",
  },
  {
    id: "hn-3",
    source: "홍성군청",
    sourceKey: "hongseong",
    title: "홍성군 도시계획 관련 주민 공지 및 열람 안내",
    date: "2026-07-15",
    href: "/news?source=hongseong",
  },
  {
    id: "hn-4",
    source: "국토부",
    sourceKey: "molit",
    title: "국토교통부, 주택공급 관련 정책 브리핑",
    date: "2026-07-14",
    href: "/news?source=molit",
  },
  {
    id: "hn-5",
    source: "네이버",
    sourceKey: "naver",
    title: "충청권 경매 물건 관심 증가… 권리분석 중요성 부각",
    date: "2026-07-13",
    href: "/news?source=naver",
  },
];

export type HomeQaSample = {
  id: string;
  category: string;
  title: string;
  status: "ANSWERED" | "PENDING";
  date: string;
  href: string;
};

export const HOME_QA_SAMPLES: HomeQaSample[] = [
  {
    id: "hq-1",
    category: "경매/권리분석",
    title: "임차인 있는 아파트 낙찰 시 인수 권리 범위가 궁금합니다",
    status: "ANSWERED",
    date: "2026-07-16",
    href: "/legal",
  },
  {
    id: "hq-2",
    category: "부동산 중개",
    title: "내포 전세 계약 시 확인해야 할 서류 체크리스트",
    status: "ANSWERED",
    date: "2026-07-14",
    href: "/legal",
  },
  {
    id: "hq-3",
    category: "경매/권리분석",
    title: "토지 경매 입찰가 산정 시 감정가 대비 가이드",
    status: "ANSWERED",
    date: "2026-07-12",
    href: "/legal",
  },
];

export const NEWS_SOURCE_BADGE: Record<
  HomeNewsSample["sourceKey"],
  string
> = {
  naver: "border-emerald-400/40 bg-emerald-500/15 text-emerald-300",
  chungnam: "border-amber-400/40 bg-amber-500/15 text-amber-300",
  hongseong: "border-orange-400/40 bg-orange-500/15 text-orange-300",
  molit: "border-sky-400/40 bg-sky-500/15 text-sky-300",
};
