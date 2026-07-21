/**
 * 권리분석 리포트 디자인 토큰·PDF CSS.
 * 목업(`/mockup/rights-analysis-report-sample`)과 동기화.
 * Gemini 시스템 지침의 색상·서식과 동일한 값을 사용합니다.
 */

export const REPORT_DESIGN = {
  brown: "#6B5344",
  brownDark: "#3D342C",
  brownMuted: "#A08B78",
  sectionBar: "#ECECEC",
  tableHead: "#F3F1EE",
  tableStripe: "#FAF8F6",
  border: "#E6E0D8",
  body: "#2F2F2F",
  bodyMuted: "#555555",
  green: "#2F6B4F",
  greenBg: "#F4F9F5",
  greenRing: "#C5DCCB",
  amber: "#E8A317",
  amberText: "#C4810A",
  amberBg: "#FFF8E7",
  amberBorder: "#E8D5A8",
  orangeQ: "#E8873A",
  indigo: "#58527E",
  teal: "#79B4B7",
  coral: "#C45A5A",
  dangerBg: "#FFEBEE",
  dangerText: "#D32F2F",
  warnBg: "#FFF3E0",
  warnText: "#F57C00",
  safeBg: "#E8F5E9",
  safeText: "#2F6B4F",
  gemBg: "#EDE7F6",
  gemText: "#5E35B1",
} as const;

/** Playwright PDF용 스타일 — 생성 리포트에 항상 적용 */
export const REPORT_PDF_CSS = `
  @page { margin: 16mm 14mm; }
  * { box-sizing: border-box; }
  body {
    font-family: "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
    font-size: 10.5pt;
    line-height: 1.65;
    color: ${REPORT_DESIGN.body};
    background: #fff;
  }
  h1 {
    font-size: 20pt;
    font-weight: 800;
    text-align: center;
    color: ${REPORT_DESIGN.brown};
    margin: 0 0 6px;
    letter-spacing: -0.02em;
  }
  .meta {
    text-align: center;
    color: ${REPORT_DESIGN.brownMuted};
    font-size: 9pt;
    margin: 0 0 18px;
  }
  .meta::after {
    content: "";
    display: block;
    width: 72px;
    height: 1px;
    background: #C4B5A5;
    margin: 12px auto 0;
  }
  h2 {
    font-size: 12.5pt;
    font-weight: 700;
    color: ${REPORT_DESIGN.brownDark};
    background: ${REPORT_DESIGN.sectionBar};
    border-radius: 999px;
    padding: 10px 18px;
    margin: 22px 0 12px;
    border: none;
    page-break-after: avoid;
  }
  h3 {
    font-size: 11pt;
    font-weight: 700;
    color: ${REPORT_DESIGN.indigo};
    margin: 16px 0 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid ${REPORT_DESIGN.teal}B3;
    page-break-after: avoid;
  }
  p, li { margin: 0 0 8px; color: ${REPORT_DESIGN.body}; }
  p + p { margin-top: 10px; }
  ul, ol { padding-left: 1.25em; margin: 6px 0 12px; }
  li::marker { color: ${REPORT_DESIGN.teal}; }
  strong { color: ${REPORT_DESIGN.brownDark}; }
  a { color: ${REPORT_DESIGN.green}; }
  hr {
    border: none;
    border-top: 1px solid #E5E5E5;
    margin: 20px 0;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 12px 0 16px;
    font-size: 9.5pt;
    border: 1px solid ${REPORT_DESIGN.border};
    border-radius: 12px;
    overflow: hidden;
  }
  th, td {
    border: 1px solid ${REPORT_DESIGN.border};
    padding: 8px 10px;
  }
  th {
    background: ${REPORT_DESIGN.tableHead};
    color: ${REPORT_DESIGN.brownDark};
    font-weight: 700;
    text-align: left;
  }
  td { text-align: center; }
  td:first-child { text-align: left; }
  tr:nth-child(even) td { background: ${REPORT_DESIGN.tableStripe}; }
  blockquote {
    margin: 12px 0;
    padding: 12px 14px;
    background: ${REPORT_DESIGN.amberBg};
    border: 1px solid ${REPORT_DESIGN.amberBorder};
    border-left: 4px solid ${REPORT_DESIGN.amber};
    border-radius: 10px;
    color: #4A4038;
  }
  blockquote p { margin: 0 0 6px; }
  blockquote p:last-child { margin: 0; }
  blockquote strong { color: ${REPORT_DESIGN.amberText}; }
  code, pre {
    font-family: Consolas, monospace;
    font-size: 9pt;
    background: ${REPORT_DESIGN.tableHead};
  }
  pre {
    padding: 10px;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    border-radius: 8px;
  }
  .badge {
    display: inline-block;
    font-weight: 700;
    padding: 1px 7px;
    border-radius: 4px;
    font-size: 9.5pt;
  }
  .badge-danger { background: ${REPORT_DESIGN.dangerBg}; color: ${REPORT_DESIGN.dangerText}; }
  .badge-warn { background: ${REPORT_DESIGN.warnBg}; color: ${REPORT_DESIGN.warnText}; }
  .badge-safe { background: ${REPORT_DESIGN.safeBg}; color: ${REPORT_DESIGN.safeText}; }
  .badge-gem { background: ${REPORT_DESIGN.gemBg}; color: ${REPORT_DESIGN.gemText}; }
  .summary-box {
    background: ${REPORT_DESIGN.greenBg};
    border: 1px solid ${REPORT_DESIGN.greenRing};
    border-radius: 12px;
    padding: 12px 14px;
    margin: 12px 0;
  }
  .footer-note {
    margin-top: 28px;
    text-align: center;
    font-size: 8.5pt;
    color: ${REPORT_DESIGN.coral};
  }
`;

/** marked HTML에 배지·요약박스 클래스를 입힙니다. */
export function enhanceReportHtml(html: string): string {
  // PDF 표지 h1과 중복되는 본문 선두 h1 제거
  let out = html.replace(
    /^\s*<h1[^>]*>[\s\S]*?권리분석[\s\S]*?<\/h1>\s*/i,
    "",
  );
  const badges: [RegExp, string][] = [
    [/\[위험\]/g, '<span class="badge badge-danger">[위험]</span>'],
    [/\[주의\]/g, '<span class="badge badge-warn">[주의]</span>'],
    [/\[안전\]/g, '<span class="badge badge-safe">[안전]</span>'],
    [/\[숨은 진주\]/g, '<span class="badge badge-gem">[숨은 진주]</span>'],
  ];
  for (const [re, rep] of badges) out = out.replace(re, rep);

  // Gemini가 쓰는 요약 인용구 휴리스틱: "인수 요약" 등이 포함된 blockquote
  out = out.replace(
    /<blockquote>([\s\S]*?)<\/blockquote>/g,
    (full, inner: string) => {
      if (/인수 요약|말소기준|종합 분류|실질 인수/i.test(inner)) {
        return `<div class="summary-box">${inner}</div>`;
      }
      return full;
    },
  );

  if (!/법적|투자 자문|자문이 아님/i.test(out)) {
    out += `<p class="footer-note">※ 본 리포트는 참고용이며 법적·투자 자문이 아닙니다.</p>`;
  } else {
    out = out.replace(
      /(<p>)([^<]*(?:법적|투자 자문)[^<]*)(<\/p>)/i,
      '<p class="footer-note">$2</p>',
    );
  }
  return out;
}
