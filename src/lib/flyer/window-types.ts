import type { FlyerKind } from "@/lib/flyer/types";

/** 창문전단지 Type A/B/C */
export type WindowFlyerTemplate = "A" | "B" | "C";

export type WindowFlyerSpecIcon = "bed" | "bath" | "area" | "car" | "floor" | "garden";

export type WindowFlyerSpec = {
  icon: WindowFlyerSpecIcon;
  label: string;
};

export type WindowFlyerPriceRow = {
  tab: string;
  area: string;
  price: string;
  note?: string;
};

/**
 * 창문전단지(창부착) 뷰모델 — 광고전단지 FlyerViewModel과 분리
 * 보행 시인성: 유형·가격·할인율 초대형
 */
export type WindowFlyerViewModel = {
  kind: FlyerKind;
  /** 미리보기에서 선택 가능 · 매퍼 기본값 포함 */
  template: WindowFlyerTemplate;
  badge: string;
  /** OPEN HOUSE / JUST LISTED / 반값 찬스 등 */
  headline: string;
  tagline: string;
  title: string;
  priceHuge: string;
  priceNote?: string;
  locationLine: string;
  addressLine: string;
  /** 체크·불릿용 (2~4개) */
  highlights: string[];
  features: string[];
  specs: WindowFlyerSpec[];
  priceRows: WindowFlyerPriceRow[];
  images: string[];
  publicPath: string;
  /** 경매 */
  appraisalLabel?: string;
  discountPct?: string;
  saleDateShort?: string;
  noticeNo?: string;
};
