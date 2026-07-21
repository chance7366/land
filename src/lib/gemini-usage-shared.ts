import {
  GEMINI_FLASH_25_MODEL,
  GEMINI_FLASH_MODEL,
  GEMINI_PRO_MODEL,
  NANO_BANANA_PRO_MODEL,
  type AuctionReportModelId,
} from "@/lib/auction-report-models";

/** AI Studio 공개 단가 기준 추정 (USD / 1M tokens). 실제 청구와 다를 수 있음. */
export const GEMINI_PRICE_USD_PER_1M: Record<
  AuctionReportModelId,
  { input: number; output: number }
> = {
  [GEMINI_FLASH_MODEL]: { input: 1.5, output: 9.0 },
  [GEMINI_FLASH_25_MODEL]: { input: 0.3, output: 2.5 },
  [GEMINI_PRO_MODEL]: { input: 2.0, output: 12.0 },
  /** 이미지 모델 — 텍스트 토큰 단가 추정치(참고용). 실제는 이미지 출력 과금 */
  [NANO_BANANA_PRO_MODEL]: { input: 2.0, output: 12.0 },
};

export type GeminiUsageRecord = {
  at: string;
  model: AuctionReportModelId;
  auctionId?: string;
  caseNumber?: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  inputCostUsd: number;
  outputCostUsd: number;
  totalCostUsd: number;
};

export function estimateGeminiCostUsd(
  model: AuctionReportModelId,
  inputTokens: number,
  outputTokens: number,
) {
  const price = GEMINI_PRICE_USD_PER_1M[model] ?? { input: 2, output: 12 };
  const inputCostUsd = (inputTokens / 1_000_000) * price.input;
  const outputCostUsd = (outputTokens / 1_000_000) * price.output;
  return {
    inputCostUsd,
    outputCostUsd,
    totalCostUsd: inputCostUsd + outputCostUsd,
  };
}

export function buildUsageRecord(args: {
  model: AuctionReportModelId;
  inputTokens: number;
  outputTokens: number;
  auctionId?: string;
  caseNumber?: string;
}): GeminiUsageRecord {
  const inputTokens = Math.max(0, Math.round(args.inputTokens));
  const outputTokens = Math.max(0, Math.round(args.outputTokens));
  const costs = estimateGeminiCostUsd(args.model, inputTokens, outputTokens);
  return {
    at: new Date().toISOString(),
    model: args.model,
    auctionId: args.auctionId,
    caseNumber: args.caseNumber,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    ...costs,
  };
}

export function formatUsd(n: number): string {
  if (!Number.isFinite(n)) return "$0.00";
  if (n > 0 && n < 0.01) return `$${n.toFixed(5)}`;
  return `$${n.toFixed(4)}`;
}
