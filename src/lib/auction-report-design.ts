/**
 * 권리분석 리포트 디자인 토큰·PDF CSS.
 * 목업(`/mockup/report-layout-polish`)과 동기화.
 * Gemini 시스템 지침의 색상·서식과 동일한 값을 사용합니다.
 */

export const REPORT_DESIGN = {
  brown: "#6B5344",
  brownDark: "#3D342C",
  brownMuted: "#A08B78",
  /** 섹션(H2) 바 — 옅은 주황 */
  sectionBar: "#F7E8D8",
  /** 표 헤더 — 옅은 베이지 */
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
    position: relative;
    font-family: "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
    font-size: 10.5pt;
    line-height: 1.65;
    color: ${REPORT_DESIGN.body};
    background: #fff;
  }
  .generated-at {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
    font-size: 8.5pt;
    color: #8A7A6A;
    text-align: right;
  }
  .report-cover {
    text-align: center;
    padding-top: 14px;
    margin-bottom: 20px;
  }
  .eyebrow {
    margin: 0 0 6px;
    font-size: 8.5pt;
    font-weight: 600;
    letter-spacing: 0.18em;
    color: ${REPORT_DESIGN.brownMuted};
  }
  .eyebrow::after {
    content: "";
    display: block;
    width: 64px;
    height: 1px;
    background: #C4B5A5;
    margin: 8px auto 0;
  }
  h1 {
    font-size: 20pt;
    font-weight: 800;
    text-align: center;
    color: ${REPORT_DESIGN.brown};
    margin: 10px 0 8px;
    letter-spacing: -0.02em;
  }
  .ai-notice {
    margin: 0 auto;
    max-width: 34em;
    text-align: center;
    color: #8A7A6A;
    font-size: 9pt;
    line-height: 1.55;
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
    text-align: left;
    page-break-after: avoid;
  }
  h3 {
    font-size: 11pt;
    font-weight: 700;
    color: ${REPORT_DESIGN.indigo};
    margin: 16px 0 8px;
    padding: 0 0 4px 0.5em;
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
    table-layout: fixed;
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
    word-break: keep-all;
  }
  th {
    background: ${REPORT_DESIGN.tableHead};
    color: ${REPORT_DESIGN.brownDark};
    font-weight: 700;
    text-align: center;
  }
  td {
    text-align: center;
    vertical-align: middle;
  }
  tr:nth-child(even) td { background: ${REPORT_DESIGN.tableStripe}; }
  tr.address-row td {
    text-align: left;
    background: ${REPORT_DESIGN.tableStripe};
  }
  /* 긴 서술 열 — 좌측 정렬 */
  table.table-kb-band td:nth-child(4),
  table.table-valuation td:nth-child(3) {
    text-align: left;
    white-space: normal;
    line-height: 1.45;
  }
  table.table-kb-band td:nth-child(-n+3),
  table.table-valuation td:nth-child(-n+2) {
    white-space: nowrap;
  }
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

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "").trim();
}

/** 표 헤더를 보고 열폭·좌측정렬 클래스를 붙입니다. */
function enhanceTables(html: string): string {
  return html.replace(/<table([^>]*)>([\s\S]*?)<\/table>/gi, (full, attrs: string, inner: string) => {
    const firstRow = inner.match(/<tr[^>]*>([\s\S]*?)<\/tr>/i)?.[1] ?? "";
    const headers = [...firstRow.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)].map((m) =>
      stripTags(m[1]),
    );
    if (headers.length === 0) return full;

    const isKbBand =
      headers.some((h) => h.includes("하위 평균가")) &&
      headers.some((h) => h.includes("시세 괴리율"));
    const isValuation =
      headers.some((h) => h.includes("평가 금액") || h === "평가금액") &&
      headers.some((h) => h.includes("가치 산정") || h.includes("핵심 논거"));

    let className = "";
    let colgroup = "";
    if (isKbBand) {
      className = "table-kb-band";
      colgroup =
        '<colgroup><col style="width:18%" /><col style="width:18%" /><col style="width:18%" /><col style="width:46%" /></colgroup>';
    } else if (isValuation) {
      className = "table-valuation";
      colgroup =
        '<colgroup><col style="width:12%" /><col style="width:18%" /><col style="width:70%" /></colgroup>';
    }

    if (!className) return full;

    let nextAttrs = attrs;
    if (/\bclass\s*=/.test(attrs)) {
      nextAttrs = attrs.replace(/\bclass\s*=\s*(["'])([^"']*)\1/i, (_, q, c) => {
        return `class=${q}${c} ${className}${q}`;
      });
    } else {
      nextAttrs = `${attrs} class="${className}"`;
    }

    let nextInner = inner;
    if (!/<colgroup/i.test(inner)) {
      nextInner = colgroup + inner;
    }
    return `<table${nextAttrs}>${nextInner}</table>`;
  });
}

/** marked HTML에 배지·요약박스·표 클래스를 입힙니다. */
export function enhanceReportHtml(html: string): string {
  let out = html.replace(
    /^\s*<h1[^>]*>[\s\S]*?권리분석[\s\S]*?<\/h1>\s*/i,
    "",
  );
  out = out.replace(/<h3([^>]*)>\s*[-–—]\s*/g, "<h3$1>");

  const badges: [RegExp, string][] = [
    [/\[위험\]/g, '<span class="badge badge-danger">[위험]</span>'],
    [/\[주의\]/g, '<span class="badge badge-warn">[주의]</span>'],
    [/\[안전\]/g, '<span class="badge badge-safe">[안전]</span>'],
    [/\[숨은 진주\]/g, '<span class="badge badge-gem">[숨은 진주]</span>'],
  ];
  for (const [re, rep] of badges) out = out.replace(re, rep);

  // 경매 개요 소재지 행: 첫 칸 "소재지 : …" + 빈 칸 → 4열 병합
  out = out.replace(/<tr>([\s\S]*?)<\/tr>/g, (full, inner: string) => {
    const cells = [...inner.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)];
    if (cells.length < 2) return full;
    const firstText = stripTags(cells[0][1]);
    if (!/^소재지\s*:/.test(firstText)) return full;
    const restEmpty = cells
      .slice(1)
      .every((c) => stripTags(c[1]) === "");
    if (!restEmpty) return full;
    return `<tr class="address-row"><td colspan="${cells.length}">${cells[0][1]}</td></tr>`;
  });

  out = enhanceTables(out);

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
