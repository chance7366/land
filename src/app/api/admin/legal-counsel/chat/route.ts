import { NextRequest } from "next/server";
import { GeminiRequestError } from "@/lib/gemini-client";
import { appendGeminiUsage } from "@/lib/gemini-usage";
import {
  searchLegalCounselContext,
  searchTaxCounselContext,
  streamLegalCounselAnswer,
  type CounselMode,
  type LegalCounselHistoryItem,
  type LegalCounselSource,
} from "@/lib/legal-counsel";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 120;

function sseLine(payload: unknown): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  let body: {
    message?: string;
    history?: LegalCounselHistoryItem[];
    mode?: CounselMode;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return new Response(JSON.stringify({ error: "잘못된 요청입니다." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const message = String(body.message || "").trim();
  if (!message) {
    return new Response(JSON.stringify({ error: "질문을 입력해주세요." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const mode: CounselMode = body.mode === "tax" ? "tax" : "legal";
  const history = Array.isArray(body.history) ? body.history.slice(-8) : [];

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: unknown) => {
        controller.enqueue(encoder.encode(sseLine(payload)));
      };

      try {
        const bundle =
          mode === "tax"
            ? await searchTaxCounselContext(message)
            : await searchLegalCounselContext(message);
        const sources: LegalCounselSource[] = [
          ...bundle.laws,
          ...bundle.precedents,
          ...bundle.interpretations,
        ];
        send({
          type: "meta",
          mode,
          sources,
          warnings: bundle.warnings,
        });

        const result = await streamLegalCounselAnswer({
          userQuery: message,
          contextText: bundle.contextText,
          history,
          mode,
          onChunk: (text) => send({ type: "delta", text }),
        });

        try {
          await appendGeminiUsage(result.usage);
        } catch {
          /* ignore usage log failure */
        }

        send({
          type: "done",
          mode,
          model: result.model,
          usage: {
            inputTokens: result.usage.inputTokens,
            outputTokens: result.usage.outputTokens,
            totalCostUsd: result.usage.totalCostUsd,
          },
        });
      } catch (err) {
        const msg =
          err instanceof GeminiRequestError
            ? err.message
            : err instanceof Error
              ? err.message
              : "법률세무상담 처리 중 오류가 발생했습니다.";
        send({ type: "error", error: msg });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
