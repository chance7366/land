import { chromium } from "playwright";
import { marked } from "marked";
import {
  enhanceReportHtml,
  inlineReportTableStyles,
  REPORT_PDF_CSS,
} from "@/lib/auction-report-design";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Gemini가 표지 H1을 다시 쓴 경우 PDF 헤더와 중복되므로 제거 */
export function stripRedundantReportH1(markdown: string): string {
  return markdown
    .replace(
      /^\s*#\s*\[?[^\n]*?\]?\s*권리분석\s*프리미엄\s*리포트\s*\n+/u,
      "",
    )
    .replace(/^\s*#\s*[^\n]*권리분석[^\n]*\n+/u, "");
}

export type ReportArticleHtml = {
  /** 클립보드·미리보기용 본문 (표지 포함, style 인라인) */
  articleHtml: string;
  /** Playwright PDF용 전체 문서 */
  documentHtml: string;
};

/** 마크다운 → 리포트 HTML (PDF·블로그 복사 공통) */
export async function markdownToReportHtml(
  markdown: string,
  title = "경매물건 권리분석 리포트",
): Promise<ReportArticleHtml> {
  const cleaned = stripRedundantReportH1(markdown);
  const bodyHtml = enhanceReportHtml(await marked.parse(cleaned, { async: true }));
  const generatedAt = new Date().toLocaleString("ko-KR");
  const articleInner = `
  <p class="generated-at">생성일시 : ${escapeHtml(generatedAt)}</p>
  <header class="report-cover">
    <p class="eyebrow">PREMIUM RIGHTS ANALYSIS</p>
    <h1>${escapeHtml(title)}</h1>
    <p class="ai-notice">본 보고서는 찬스부동산의 경매물건 정보에 기반한 AI로 생성한 보고서 입니다.</p>
  </header>
  ${bodyHtml}`;

  // 블로그 복사용: 표 배경/테두리를 인라인으로도 심어 둔다 (style 태그 제거 대비)
  const blogBody = inlineReportTableStyles(articleInner);

  const articleHtml = `<div class="chance-report-article">
<style>
${REPORT_PDF_CSS}
.chance-report-article { max-width: 794px; margin: 0 auto; background: #fff; color: #2F2F2F; }
</style>
${blogBody}
</div>`;

  const documentHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>${REPORT_PDF_CSS}</style>
</head>
<body>
${articleInner}
</body>
</html>`;

  return { articleHtml, documentHtml };
}

export async function markdownToPdfBuffer(
  markdown: string,
  title = "경매물건 권리분석 리포트",
): Promise<Buffer> {
  const { documentHtml } = await markdownToReportHtml(markdown, title);

  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-dev-shm-usage"],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(documentHtml, { waitUntil: "networkidle" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", bottom: "14mm", left: "12mm", right: "12mm" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
