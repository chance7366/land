import { GoogleGenAI } from "@google/genai";
import {
  buildAttachmentCatalogPrompt,
  buildAuctionAnalysisUserPrompt,
  getAuctionAnalysisSystemPrompt,
  type AuctionReportSource,
} from "@/lib/auction-analysis-prompt";
import {
  GEMINI_FLASH_25_MODEL,
  GEMINI_FLASH_MODEL,
  GEMINI_PRO_MODEL,
  isTextReportModel,
  NANO_BANANA_PRO_MODEL,
  type AuctionReportKind,
  type AuctionReportModelId,
} from "@/lib/auction-report-models";
import type { ReportMediaPart } from "@/lib/auction-report-media";
import { buildUsageRecord, type GeminiUsageRecord } from "@/lib/gemini-usage-shared";
import {
  buildTodayNewsReportSystemPrompt,
  buildTodayNewsReportUserPrompt,
} from "@/lib/news-today-report";
import type { TodayNewsArticle } from "@/lib/news-today";

export {
  AUCTION_REPORT_MODELS,
  GEMINI_FLASH_25_MODEL,
  GEMINI_FLASH_MODEL,
  GEMINI_PRO_MODEL,
  NANO_BANANA_PRO_MODEL,
  resolveAuctionReportModel,
  type AuctionReportModelId,
} from "@/lib/auction-report-models";

/** @deprecated 기본 Flash — GEMINI_FLASH_MODEL 사용 */
export const GEMINI_REPORT_MODEL = GEMINI_FLASH_MODEL;

/** 서류 이미지 사전 요약에 사용 (Nano Banana Pro / Gemini 3 Pro Image) */
export const GEMINI_IMAGE_DOC_MODEL = NANO_BANANA_PRO_MODEL;

export class GeminiRequestError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = "GeminiRequestError";
    this.status = status;
  }
}

export type GeminiAnalysisResult = {
  markdown: string;
  usage: GeminiUsageRecord;
  mediaCount: number;
  imageModelUsed: boolean;
  imageModelNote?: string;
};

export function getGeminiApiKey(): string | null {
  const key = process.env.GEMINI_API_KEY?.trim();
  return key || null;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function extractApiPayload(err: unknown): { code?: number; message?: string; status?: string } {
  const raw = err instanceof Error ? err.message : String(err ?? "");
  try {
    const parsed = JSON.parse(raw) as {
      error?: { code?: number; message?: string; status?: string };
    };
    if (parsed?.error) return parsed.error;
  } catch {
    /* ignore */
  }
  const status =
    typeof err === "object" && err && "status" in err
      ? Number((err as { status?: number }).status)
      : undefined;
  return { code: status, message: raw };
}

function friendlyGeminiError(err: unknown, model: AuctionReportModelId): GeminiRequestError {
  const { code, message = "" } = extractApiPayload(err);
  const lower = message.toLowerCase();

  if (code === 429 || /resource_exhausted|quota|rate.?limit/i.test(message)) {
    if (model === GEMINI_PRO_MODEL || /gemini-3\.1-pro|free_tier/i.test(message)) {
      return new GeminiRequestError(
        "Gemini 3.1 Pro API 할당량이 없습니다. Gemini 앱 Pro 구독과 API 결제는 별개입니다. " +
          "Google AI Studio → 결제(Billing)를 연결한 API 키로 다시 시도하거나, 기본 모델(3.5 Flash)을 사용하세요.",
        429,
      );
    }
    return new GeminiRequestError(
      "Gemini API 요청 한도를 초과했습니다. 잠시 후 다시 시도하거나 AI Studio 사용량·결제를 확인하세요.",
      429,
    );
  }

  if (code === 503 || /unavailable|high demand|overloaded/i.test(lower)) {
    return new GeminiRequestError(
      "Gemini 서버가 일시적으로 혼잡합니다(503). 잠시 후 다시 시도해 주세요.",
      503,
    );
  }

  if (code === 404 || /not found|is not found/i.test(lower)) {
    return new GeminiRequestError(
      `선택한 모델(${model})을 사용할 수 없습니다. 모델 ID 또는 API 권한을 확인하세요.`,
      404,
    );
  }

  if (code === 401 || code === 403 || /api.?key|permission|unauthenticated/i.test(lower)) {
    return new GeminiRequestError(
      "Gemini API 키가 유효하지 않거나 권한이 없습니다. .env.local의 GEMINI_API_KEY를 확인하세요.",
      401,
    );
  }

  const short = message.length > 280 ? `${message.slice(0, 280)}…` : message;
  return new GeminiRequestError(
    short ? `Gemini 호출 실패: ${short}` : "Gemini 분석 생성에 실패했습니다.",
    code && code >= 400 && code < 600 ? code : 500,
  );
}

function readUsageTokens(response: {
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  } | null;
}): { inputTokens: number; outputTokens: number } {
  const u = response.usageMetadata;
  const inputTokens = Number(u?.promptTokenCount ?? 0) || 0;
  let outputTokens = Number(u?.candidatesTokenCount ?? 0) || 0;
  if (!outputTokens && u?.totalTokenCount != null) {
    outputTokens = Math.max(0, Number(u.totalTokenCount) - inputTokens);
  }
  return { inputTokens, outputTokens };
}

function mergeUsage(
  a: GeminiUsageRecord,
  b: GeminiUsageRecord | null,
  primaryModel: AuctionReportModelId,
): GeminiUsageRecord {
  if (!b) return a;
  return buildUsageRecord({
    model: primaryModel,
    inputTokens: a.inputTokens + b.inputTokens,
    outputTokens: a.outputTokens + b.outputTokens,
    auctionId: a.auctionId,
    caseNumber: a.caseNumber,
  });
}

type InlinePart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

function mediaToParts(media: ReportMediaPart[]): InlinePart[] {
  const parts: InlinePart[] = [];
  for (const m of media) {
    parts.push({
      text: `\n[첨부:${m.label}] 파일명: ${m.name} (${m.kind})\n`,
    });
    if (m.kind === "text") {
      parts.push({
        text: m.textContent?.trim()
          ? m.textContent
          : Buffer.from(m.base64, "base64").toString("utf8"),
      });
    } else {
      parts.push({
        inlineData: { mimeType: m.mimeType, data: m.base64 },
      });
    }
  }
  return parts;
}

/** 이미지 서류 → Nano Banana Pro(이미지 모델)로 사전 요약 시도. 실패 시 null */
async function summarizeImagesWithImageModel(
  ai: GoogleGenAI,
  images: ReportMediaPart[],
): Promise<{ text: string; usage: GeminiUsageRecord } | null> {
  if (!images.length) return null;
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_IMAGE_DOC_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                "당신은 경매·시세·입지 서류를 읽는 보조자입니다. 첨부 이미지에서 다음을 한국어로 요약하세요.\n" +
                "1) 권리서류(등기부·명세서·조사서 등): 말소기준권리, 소유자·채무자, 채권·근저당, 임차·점유, 주의 문구\n" +
                "2) 시세·실거래 화면(Npay/KB/아실/국토부 등): 단지명, 면적, 동·층, 호가, 시세(하/일/상), " +
                "실거래 일자·금액, 공시가격 등 숫자와 단위를 빠짐없이\n" +
                "3) 입지 자료(지도·지적·교통·학군·상권·환경·호재·토지이용계획): 역·학교·마트·병원·IC 거리/도보분, " +
                "용도지역·규제, 혐오시설, 개발·교통 호재 등 고유명사와 수치를 빠짐없이\n" +
                "파일명·슬롯명을 인용하세요. 읽을 수 없으면 이유를 적으세요. 마크다운 불릿으로만 답하세요.",
            },
            ...mediaToParts(images),
          ],
        },
      ],
    });
    const text = response.text?.trim();
    if (!text) return null;
    const { inputTokens, outputTokens } = readUsageTokens(response);
    return {
      text,
      usage: buildUsageRecord({
        model: GEMINI_IMAGE_DOC_MODEL,
        inputTokens,
        outputTokens,
      }),
    };
  } catch (e) {
    console.warn(
      "[gemini] image-doc model summarize failed → 텍스트 모델 멀티모달로 폴백",
      GEMINI_IMAGE_DOC_MODEL,
      e,
    );
    return null;
  }
}

export async function generateAuctionAnalysisMarkdown(
  auction: AuctionReportSource,
  model: AuctionReportModelId = GEMINI_FLASH_MODEL,
  media: ReportMediaPart[] = [],
  skipped: string[] = [],
  kind: AuctionReportKind = "member",
): Promise<GeminiAnalysisResult> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new GeminiRequestError("GEMINI_API_KEY가 설정되어 있지 않습니다.", 503);
  }

  if (!isTextReportModel(model) || model === NANO_BANANA_PRO_MODEL) {
    throw new GeminiRequestError(
      "텍스트 권리분석 모델로 Gemini 3.1 Pro 또는 Flash를 선택하세요. " +
        "Nano Banana Pro(gemini-3-pro-image-preview)는 이미지 서류 사전 요약에 자동 사용됩니다.",
      400,
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  const images = media.filter((m) => m.kind === "image");
  const pdfs = media.filter((m) => m.kind === "pdf");
  const texts = media.filter((m) => m.kind === "text");

  let imageNotes: string | null = null;
  let imageUsage: GeminiUsageRecord | null = null;
  let imageModelUsed = false;
  let imageModelNote: string | undefined;

  if (images.length) {
    const summarized = await summarizeImagesWithImageModel(ai, images);
    if (summarized) {
      imageNotes = summarized.text;
      imageUsage = {
        ...summarized.usage,
        auctionId: auction.id,
        caseNumber: auction.caseNumber,
      };
      imageModelUsed = true;
      imageModelNote = `${GEMINI_IMAGE_DOC_MODEL}로 이미지 ${images.length}건 사전 요약`;
    } else {
      imageModelNote =
        `${GEMINI_IMAGE_DOC_MODEL} 이미지 사전 요약 실패 → 선택 모델(${model}) 멀티모달로 이미지 포함 분석`;
    }
  }

  const catalog = buildAttachmentCatalogPrompt(
    media.map((m) => ({ label: m.label, name: m.name, kind: m.kind })),
    skipped,
    imageNotes,
  );
  const userPrompt = `${buildAuctionAnalysisUserPrompt(auction, kind)}\n${catalog}`;
  const systemInstruction = getAuctionAnalysisSystemPrompt(kind);

  // PDF·TXT는 항상 선택 텍스트 모델에 첨부. 이미지 사전 요약 성공 시 이미지는 요약문만 사용.
  const mediaForTextModel = imageModelUsed ? [...pdfs, ...texts] : media;

  const attempts =
    model === GEMINI_FLASH_MODEL || model === GEMINI_FLASH_25_MODEL ? 2 : 1;
  let lastErr: unknown;

  for (let i = 0; i < attempts; i++) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }, ...mediaToParts(mediaForTextModel)],
          },
        ],
        config: {
          systemInstruction,
        },
      });

      const text = response.text?.trim();
      if (!text) {
        throw new GeminiRequestError("Gemini가 빈 응답을 반환했습니다.", 502);
      }

      const { inputTokens, outputTokens } = readUsageTokens(response);
      const mainUsage = buildUsageRecord({
        model,
        inputTokens,
        outputTokens,
        auctionId: auction.id,
        caseNumber: auction.caseNumber,
      });

      return {
        markdown: text,
        usage: mergeUsage(mainUsage, imageUsage, model),
        mediaCount: media.length,
        imageModelUsed,
        imageModelNote,
      };
    } catch (e) {
      lastErr = e;
      const { code, message = "" } = extractApiPayload(e);
      const busy = code === 503 || /unavailable|high demand|overloaded/i.test(message);
      if (busy && i < attempts - 1) {
        await sleep(2500);
        continue;
      }
      if (e instanceof GeminiRequestError) throw e;
      throw friendlyGeminiError(e, model);
    }
  }

  throw friendlyGeminiError(lastErr, model);
}

export type TodayNewsReportResult = {
  markdown: string;
  usage: GeminiUsageRecord;
};

/** 오늘의 부동산소식 HTML 보고서용 마크다운 (제목 유지 · 요약만 생성) */
export async function generateTodayNewsReportMarkdown(
  dateKey: string,
  articles: TodayNewsArticle[],
  model: AuctionReportModelId = GEMINI_FLASH_MODEL,
): Promise<TodayNewsReportResult> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new GeminiRequestError("GEMINI_API_KEY가 설정되어 있지 않습니다.", 503);
  }

  if (!isTextReportModel(model) || model === NANO_BANANA_PRO_MODEL) {
    throw new GeminiRequestError(
      "뉴스 요약은 Gemini Flash 또는 Pro 텍스트 모델을 사용하세요.",
      400,
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  const systemInstruction = buildTodayNewsReportSystemPrompt();
  const userPrompt = buildTodayNewsReportUserPrompt(dateKey, articles);

  const attempts =
    model === GEMINI_FLASH_MODEL || model === GEMINI_FLASH_25_MODEL ? 2 : 1;
  let lastErr: unknown;

  for (let i = 0; i < attempts; i++) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        config: { systemInstruction },
      });

      const text = response.text?.trim();
      if (!text) {
        throw new GeminiRequestError("Gemini가 빈 응답을 반환했습니다.", 502);
      }

      const { inputTokens, outputTokens } = readUsageTokens(response);
      const usage = buildUsageRecord({
        model,
        inputTokens,
        outputTokens,
        caseNumber: `news-${dateKey}`,
      });

      return { markdown: text, usage };
    } catch (e) {
      lastErr = e;
      const { code, message = "" } = extractApiPayload(e);
      const busy = code === 503 || /unavailable|high demand|overloaded/i.test(message);
      if (busy && i < attempts - 1) {
        await sleep(2500);
        continue;
      }
      if (e instanceof GeminiRequestError) throw e;
      throw friendlyGeminiError(e, model);
    }
  }

  throw friendlyGeminiError(lastErr, model);
}

