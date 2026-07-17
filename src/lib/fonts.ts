import localFont from "next/font/local";

/** 기본 UI (Unifine) — 로컬 woff2 (빌드 시 Google Fonts 의존 제거) */
export const outfit = localFont({
  src: [
    { path: "../fonts/outfit-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/outfit-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/outfit-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-unifine",
  display: "swap",
});

export const plusJakarta = localFont({
  src: [
    { path: "../fonts/plus-jakarta-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/plus-jakarta-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/plus-jakarta-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/plus-jakarta-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/plus-jakarta-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-headline",
  display: "swap",
});

export const workSans = localFont({
  src: [
    { path: "../fonts/work-sans-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/work-sans-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/work-sans-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

const baseFontInstances = [outfit, plusJakarta, workSans];

/** layout.tsx <body> className에 연결 (기본 3종만) */
export const rootFontVariableClasses = baseFontInstances.map((f) => f.variable).join(" ");

/**
 * 히어로 한글 폰트 — Google Fonts 단일 링크로 런타임 로드.
 * (12종을 next/font에 넣으면 빌드 시 네트워크 타임아웃이 자주 발생함)
 */
export const HERO_FONTS_GOOGLE_URL =
  "https://fonts.googleapis.com/css2?" +
  [
    "family=Nanum+Brush+Script",
    "family=Nanum+Pen+Script",
    "family=East+Sea+Dokdo",
    "family=Gamja+Flower",
    "family=Yeon+Sung",
    "family=Noto+Serif+KR:wght@400;600;700;900",
    "family=Nanum+Myeongjo:wght@400;700;800",
    "family=Gowun+Batang:wght@400;700",
    "family=Noto+Sans+KR:wght@400;500;700;900",
    "family=Gothic+A1:wght@400;700;900",
    "family=Black+Han+Sans",
    "family=Jua",
  ].join("&") +
  "&display=swap";

export type HeroFontCategory = "calligraphy" | "serif" | "gothic";

export type HeroFontEntry = {
  id: string;
  category: HeroFontCategory;
  categoryLabel: string;
  name: string;
  googleName: string;
  utilityClass: string;
  mood: string;
  weights: string;
};

/** 개발 시 참고용 카탈로그 — globals.css utilityClass와 1:1 */
export const HERO_FONT_CATALOG: HeroFontEntry[] = [
  {
    id: "brush",
    category: "calligraphy",
    categoryLabel: "캘리 / 손글씨",
    name: "나눔손글씨 붓",
    googleName: "Nanum Brush Script",
    utilityClass: "font-hero-brush",
    mood: "웅장한 붓글씨 · 신뢰·권위",
    weights: "400",
  },
  {
    id: "pen",
    category: "calligraphy",
    categoryLabel: "캘리 / 손글씨",
    name: "나눔손글씨 펜",
    googleName: "Nanum Pen Script",
    utilityClass: "font-hero-pen",
    mood: "펜 손글씨 · 자연스러움",
    weights: "400",
  },
  {
    id: "dokdo",
    category: "calligraphy",
    categoryLabel: "캘리 / 손글씨",
    name: "독도체",
    googleName: "East Sea Dokdo",
    utilityClass: "font-hero-dokdo",
    mood: "예술적 갈필 · 개성",
    weights: "400",
  },
  {
    id: "gamja",
    category: "calligraphy",
    categoryLabel: "캘리 / 손글씨",
    name: "감자꽃체",
    googleName: "Gamja Flower",
    utilityClass: "font-hero-gamja",
    mood: "아기자기 · 친근",
    weights: "400",
  },
  {
    id: "yeon",
    category: "calligraphy",
    categoryLabel: "캘리 / 손글씨",
    name: "연성체",
    googleName: "Yeon Sung",
    utilityClass: "font-hero-yeon",
    mood: "흘림·품격 · 고전",
    weights: "400",
  },
  {
    id: "noto-serif",
    category: "serif",
    categoryLabel: "세리프 / 명조",
    name: "Noto Serif KR",
    googleName: "Noto Serif KR",
    utilityClass: "font-hero-serif-noto",
    mood: "정돈된 세리프 · 프리미엄",
    weights: "400–900",
  },
  {
    id: "myeongjo",
    category: "serif",
    categoryLabel: "세리프 / 명조",
    name: "나눔명조",
    googleName: "Nanum Myeongjo",
    utilityClass: "font-hero-serif-myeongjo",
    mood: "전통 명조 · 신뢰",
    weights: "400, 700, 800",
  },
  {
    id: "gowun",
    category: "serif",
    categoryLabel: "세리프 / 명조",
    name: "고운바탕",
    googleName: "Gowun Batang",
    utilityClass: "font-hero-serif-gowun",
    mood: "가독성 좋은 바탕 · 차분",
    weights: "400, 700",
  },
  {
    id: "noto-sans",
    category: "gothic",
    categoryLabel: "고딕 / 산세리프",
    name: "Noto Sans KR",
    googleName: "Noto Sans KR",
    utilityClass: "font-hero-gothic-noto",
    mood: "중립·깔끔 · 범용",
    weights: "400–900",
  },
  {
    id: "gothic-a1",
    category: "gothic",
    categoryLabel: "고딕 / 산세리프",
    name: "고딕 A1",
    googleName: "Gothic A1",
    utilityClass: "font-hero-gothic-a1",
    mood: "모던 고딕 · 테크",
    weights: "400–900",
  },
  {
    id: "blackhan",
    category: "gothic",
    categoryLabel: "고딕 / 산세리프",
    name: "Black Han Sans",
    googleName: "Black Han Sans",
    utilityClass: "font-hero-gothic-blackhan",
    mood: "초굵은 임팩트 · 주목",
    weights: "400",
  },
  {
    id: "jua",
    category: "gothic",
    categoryLabel: "고딕 / 산세리프",
    name: "주아체",
    googleName: "Jua",
    utilityClass: "font-hero-gothic-jua",
    mood: "둥근 고딕 · 편안",
    weights: "400",
  },
];
