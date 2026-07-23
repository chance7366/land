import { NextRequest, NextResponse } from "next/server";
import {
  GEMINI_FLASH_MODEL,
  GeminiRequestError,
  generateTodayNewsReportMarkdown,
  getGeminiApiKey,
  resolveAuctionReportModel,
} from "@/lib/gemini-client";
import { appendGeminiUsage } from "@/lib/gemini-usage";
import { seoulDateKey } from "@/lib/news-digest-email";
import { loadTodayArticles } from "@/lib/news-today";
import {
  emptyTodayNewsReportMarkdown,
  saveTodayNewsReportMarkdown,
} from "@/lib/news-today-report";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * POST — 당일 뉴스 Gemini 요약 보고서 생성
 * body: { dateKey?: "YYYY-MM-DD", model?: string }
 */
export async function POST(request: NextRequest) {
  let dateKey = seoulDateKey();
  let model = GEMINI_FLASH_MODEL;

  try {
    const body = (await request.json().catch(() => ({}))) as {
      dateKey?: string;
      model?: string;
    };
    if (body.dateKey && /^\d{4}-\d{2}-\d{2}$/.test(body.dateKey)) {
      dateKey = body.dateKey;
    }
    if (body.model) {
      model = resolveAuctionReportModel(body.model);
    }
  } catch {
    /* defaults */
  }

  if (!getGeminiApiKey()) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY가 설정되어 있지 않습니다." },
      { status: 503 },
    );
  }

  let articles;
  try {
    articles = await loadTodayArticles(dateKey);
  } catch (e) {
    console.error("[today-report] load articles", e);
    return NextResponse.json({ error: "당일 기사 조회에 실패했습니다." }, { status: 500 });
  }

  const reportUrl = `/admin/news/today-report?date=${encodeURIComponent(dateKey)}`;

  if (articles.length === 0) {
    const markdown = emptyTodayNewsReportMarkdown(dateKey);
    try {
      await saveTodayNewsReportMarkdown(dateKey, markdown);
    } catch (e) {
      console.error("[today-report] save empty", e);
      return NextResponse.json({ error: "보고서 저장에 실패했습니다." }, { status: 500 });
    }
    return NextResponse.json({
      dateKey,
      articleCount: 0,
      reportUrl,
      empty: true,
    });
  }

  try {
    const { markdown, usage } = await generateTodayNewsReportMarkdown(
      dateKey,
      articles,
      model,
    );
    await saveTodayNewsReportMarkdown(dateKey, markdown);
    await appendGeminiUsage(usage).catch((e) =>
      console.warn("[today-report] usage log failed", e),
    );

    return NextResponse.json({
      dateKey,
      articleCount: articles.length,
      reportUrl,
      model,
      usage: {
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalCostUsd: usage.totalCostUsd,
      },
    });
  } catch (e) {
    console.error("[today-report] gemini", e);
    if (e instanceof GeminiRequestError) {
      return NextResponse.json({ error: e.message, dateKey }, { status: e.status });
    }
    const msg = e instanceof Error ? e.message : "보고서 생성에 실패했습니다.";
    return NextResponse.json({ error: msg, dateKey }, { status: 500 });
  }
}
