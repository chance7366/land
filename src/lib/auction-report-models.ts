/** 경매분석 리포트용 Gemini 모델 ID (클라이언트·서버 공용, SDK 미포함) */

/** 일반 = 섹션 1~3 / 회원 = 현행 풀 리포트(1~7). report_url = 회원, general_report_url = 일반 */
export type AuctionReportKind = "general" | "member";

export function resolveAuctionReportKind(raw: unknown): AuctionReportKind {
  if (
    raw === "general" ||
    raw === "일반" ||
    raw === "일반리포트" ||
    raw === "basic"
  ) {
    return "general";
  }
  if (
    raw === "member" ||
    raw === "회원" ||
    raw === "회원리포트" ||
    raw === "premium" ||
    raw === "full"
  ) {
    return "member";
  }
  // 미지정 시 기존 동작 = 회원(풀) 리포트
  return "member";
}

export function reportKindLabel(kind: AuctionReportKind): string {
  return kind === "general" ? "일반리포트" : "회원리포트";
}

/** 기본(빠른) 분석 — Gemini 3.5 Flash */
export const GEMINI_FLASH_MODEL = "gemini-3.5-flash";
/** 안정·대체 Flash */
export const GEMINI_FLASH_25_MODEL = "gemini-2.5-flash";
/** 심층 분석 (API model id) */
export const GEMINI_PRO_MODEL = "gemini-3.1-pro-preview";
/**
 * Nano Banana Pro (별칭) = Gemini 3 Pro Image
 * 공식 API ID: gemini-3-pro-image-preview
 * 텍스트 권리분석용이 아니라 이미지 생성/편집 모델입니다.
 */
export const NANO_BANANA_PRO_MODEL = "gemini-3-pro-image-preview";

export type AuctionReportModelId =
  | typeof GEMINI_FLASH_MODEL
  | typeof GEMINI_FLASH_25_MODEL
  | typeof GEMINI_PRO_MODEL
  | typeof NANO_BANANA_PRO_MODEL;

export const AUCTION_REPORT_MODELS: {
  id: AuctionReportModelId;
  label: string;
  hint: string;
  /** 텍스트 마크다운 리포트 생성 가능 여부 */
  textReport: boolean;
}[] = [
  {
    id: GEMINI_FLASH_MODEL,
    label: "Gemini 3.5 Flash",
    hint: "기본 · 빠르고 가성비",
    textReport: true,
  },
  {
    id: GEMINI_FLASH_25_MODEL,
    label: "Gemini 2.5 Flash",
    hint: "대체 Flash · 안정적일 때 추천",
    textReport: true,
  },
  {
    id: GEMINI_PRO_MODEL,
    label: "Gemini 3.1 Pro",
    hint: "심층분석 · 더 신중·느림",
    textReport: true,
  },
  {
    id: NANO_BANANA_PRO_MODEL,
    label: "Nano Banana Pro",
    hint: "이미지 생성 전용 · 텍스트 리포트 불가",
    textReport: false,
  },
];

const ALLOWED = new Set<string>(AUCTION_REPORT_MODELS.map((m) => m.id));

export function isTextReportModel(model: AuctionReportModelId): boolean {
  return AUCTION_REPORT_MODELS.find((m) => m.id === model)?.textReport !== false;
}

export function resolveAuctionReportModel(raw: unknown): AuctionReportModelId {
  if (
    raw === NANO_BANANA_PRO_MODEL ||
    raw === "nano-banana-pro-preview" ||
    raw === "nano-banana-pro" ||
    raw === "nanobanana" ||
    raw === "banana-pro"
  ) {
    return NANO_BANANA_PRO_MODEL;
  }
  if (raw === GEMINI_PRO_MODEL || raw === "pro" || raw === "deep") {
    return GEMINI_PRO_MODEL;
  }
  if (raw === GEMINI_FLASH_25_MODEL || raw === "flash-2.5" || raw === "2.5-flash") {
    return GEMINI_FLASH_25_MODEL;
  }
  if (
    raw === GEMINI_FLASH_MODEL ||
    raw === "flash" ||
    raw === "default" ||
    raw == null ||
    raw === ""
  ) {
    return GEMINI_FLASH_MODEL;
  }
  if (typeof raw === "string" && ALLOWED.has(raw)) {
    return raw as AuctionReportModelId;
  }
  throw new Error(`지원하지 않는 모델입니다. (${[...ALLOWED].join(", ")})`);
}
