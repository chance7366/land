import { GoogleGenAI } from "@google/genai";
import { GeminiRequestError, getGeminiApiKey } from "@/lib/gemini-client";
import { GEMINI_FLASH_25_MODEL, type AuctionReportModelId } from "@/lib/auction-report-models";
import { buildUsageRecord, type GeminiUsageRecord } from "@/lib/gemini-usage-shared";
import {
  buildLegalCounselUserPrompt,
  LEGAL_COUNSEL_SYSTEM_PROMPT,
} from "./system-prompt";
import type { LegalCounselHistoryItem } from "./types";

const DEFAULT_MODEL: AuctionReportModelId = GEMINI_FLASH_25_MODEL;

export type LegalCounselStreamResult = {
  usage: GeminiUsageRecord;
  model: AuctionReportModelId;
};

/** Gemini 스트리밍 — onChunk로 텍스트 델타를 전달 */
export async function streamLegalCounselAnswer(args: {
  userQuery: string;
  contextText: string;
  history?: LegalCounselHistoryItem[];
  onChunk: (text: string) => void;
}): Promise<LegalCounselStreamResult> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new GeminiRequestError("GEMINI_API_KEY가 설정되어 있지 않습니다.", 503);
  }

  const model = DEFAULT_MODEL;
  const ai = new GoogleGenAI({ apiKey });
  const userPrompt = buildLegalCounselUserPrompt({
    contextText: args.contextText,
    userQuery: args.userQuery,
    history: args.history,
  });

  const stream = await ai.models.generateContentStream({
    model,
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    config: {
      systemInstruction: LEGAL_COUNSEL_SYSTEM_PROMPT,
      temperature: 0.2,
    },
  });

  let inputTokens = 0;
  let outputTokens = 0;

  for await (const chunk of stream) {
    const text = chunk.text;
    if (text) args.onChunk(text);

    const u = chunk.usageMetadata;
    if (u) {
      if (u.promptTokenCount != null) inputTokens = Number(u.promptTokenCount) || inputTokens;
      if (u.candidatesTokenCount != null) {
        outputTokens = Number(u.candidatesTokenCount) || outputTokens;
      } else if (u.totalTokenCount != null && inputTokens) {
        outputTokens = Math.max(0, Number(u.totalTokenCount) - inputTokens);
      }
    }
  }

  return {
    model,
    usage: buildUsageRecord({
      model,
      inputTokens,
      outputTokens,
      caseNumber: "legal-counsel",
    }),
  };
}
