/**
 * 오늘의 뉴스 HTML 보고서 — 마크다운 저장/로드 · 프롬프트
 */

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { dateKeyInSeoul } from "@/lib/news-digest-email";
import type { TodayNewsArticle } from "@/lib/news-today";

export function todayReportFileStem(dateKey: string): string {
  return `today-report-${dateKey.replace(/-/g, "")}`;
}

function newsUploadDir(): string {
  return path.join(process.cwd(), "storage", "uploads", "news");
}

export function todayReportLocalPath(dateKey: string): string {
  return path.join(newsUploadDir(), `${todayReportFileStem(dateKey)}.md`);
}

export async function saveTodayNewsReportMarkdown(
  dateKey: string,
  markdown: string,
): Promise<void> {
  const dir = newsUploadDir();
  await mkdir(dir, { recursive: true });
  await writeFile(todayReportLocalPath(dateKey), markdown, "utf8");
}

export async function loadTodayNewsReportMarkdown(
  dateKey: string,
): Promise<string | null> {
  try {
    const text = (await readFile(todayReportLocalPath(dateKey), "utf8")).trim();
    return text || null;
  } catch {
    return null;
  }
}

/** 기사 0건용 고정 마크다운 (Gemini 미호출) */
export function emptyTodayNewsReportMarkdown(dateKey: string): string {
  return `# 오늘의 부동산소식 · ${dateKey}

당일(네이버·부동산114·부동산테크) 수집 기사가 없습니다.

관리자 **부동산 소식** 화면에서 수집을 실행한 뒤 다시 보고서를 생성해 주세요.
`;
}

export function buildTodayNewsReportSystemPrompt(): string {
  return [
    "당신은 한국 부동산 뉴스 편집자입니다.",
    "주어진 기사 목록으로 「오늘의 부동산소식」 마크다운 보고서를 작성합니다.",
    "",
    "규칙:",
    "1. 기사 제목(title)은 원문 그대로 사용합니다. 제목을 새로 짓거나 바꾸지 마세요.",
    "2. 각 기사마다 2~4문장의 쉬운 한국어 요약을 작성합니다. 기존 summary가 있으면 참고하되 그대로 복사하지 말고 다듬습니다.",
    "3. 추측·없는 사실 추가 금지. 제공된 정보만 사용합니다.",
    "4. 출력은 마크다운만. 코드펜스(```)로 감싸지 마세요.",
    "",
    "형식:",
    "# 오늘의 부동산소식 · {dateKey}",
    "",
    "짧은 도입 문단 1개(오늘 기사 건수·주요 주제 한 줄).",
    "",
    "## 1. {원문 제목 그대로}",
    "요약 문단",
    "- 출처: {sourceName}",
    "- 원문: {originUrl}",
    "",
    "(이후 기사 동일. 번호는 1부터)",
  ].join("\n");
}

export function buildTodayNewsReportUserPrompt(
  dateKey: string,
  articles: TodayNewsArticle[],
): string {
  const lines = articles.map((a, i) => {
    const pub = dateKeyInSeoul(a.pubDate) || dateKey;
    return [
      `### 기사 ${i + 1}`,
      `title: ${a.title}`,
      `source: ${a.source}`,
      `sourceName: ${a.sourceName}`,
      `press: ${a.press?.trim() || "-"}`,
      `pubDate: ${pub}`,
      `originUrl: ${a.originUrl}`,
      `summary: ${(a.summary ?? "").trim() || "(없음)"}`,
    ].join("\n");
  });

  return [
    `dateKey: ${dateKey}`,
    `articleCount: ${articles.length}`,
    "",
    "아래 기사 목록으로 보고서를 작성하세요.",
    "",
    ...lines,
  ].join("\n");
}

export type { TodayNewsArticle } from "@/lib/news-today";
