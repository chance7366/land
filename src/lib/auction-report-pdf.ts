import { chromium } from "playwright";
import { marked } from "marked";
import { enhanceReportHtml, REPORT_PDF_CSS } from "@/lib/auction-report-design";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Gemini가 표지 H1을 다시 쓴 경우 PDF 헤더와 중복되므로 제거 */
function stripRedundantReportH1(markdown: string): string {
  return markdown
    .replace(
      /^\s*#\s*\[?[^\n]*?\]?\s*권리분석\s*프리미엄\s*리포트\s*\n+/u,
      "",
    )
    .replace(/^\s*#\s*[^\n]*권리분석[^\n]*\n+/u, "");
}

export async function markdownToPdfBuffer(
  markdown: string,
  title = "경매물건 권리분석 리포트",
): Promise<Buffer> {
  const cleaned = stripRedundantReportH1(markdown);
  const bodyHtml = enhanceReportHtml(await marked.parse(cleaned, { async: true }));
  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>${REPORT_PDF_CSS}</style>
</head>
<body>
  <p class="meta" style="margin-bottom:4px;font-size:8.5pt;letter-spacing:0.18em;font-weight:600;color:#A08B78;">
    PREMIUM RIGHTS ANALYSIS
  </p>
  <h1>${escapeHtml(title)}</h1>
  <p class="meta">생성일시: ${escapeHtml(new Date().toLocaleString("ko-KR"))}</p>
  ${bodyHtml}
</body>
</html>`;

  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-dev-shm-usage"],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
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
