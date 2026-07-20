/** 법원 「목록내역」 (#mf_wfm_mainFrame_grp_lstDtsLimtMin) */

export type AuctionListDetailRow = {
  no: number;
  listKind: string;
  /** 상세내역 전체 (줄바꿈 유지) */
  detail: string;
};

const KIND_RE = /^(토지|건물|집합건물)/;

/** grp/body 텍스트에서 목록내역 행 파싱 (상세내역 컬럼 있는 PGJ151 표만) */
export function parseListDetailsFromText(text: string): AuctionListDetailRow[] {
  if (!text?.trim()) return [];
  // 검색결과(PGJ159)의 짧은 목록표(소재지·비고)는 제외 — 상세내역 컬럼 필수
  if (!/목록번호\s*[\t ]+목록구분\s*[\t ]+상세내역/.test(text)) return [];
  const header = text.search(/목록번호\s*[\t ]+목록구분\s*[\t ]+상세내역/);
  let body = header >= 0 ? text.slice(header) : text;
  // 안내 문구·다음 섹션 컷
  body = body.split(
    /\n(?:목록구분이 집합건물|감정평가요항|당사자내역|기일내역|배당요구|COPYRIGHT)/,
  )[0];

  const chunks = body.split(/(?=^\d+\t(?:토지|건물|집합건물)\t)/m);
  const rows: AuctionListDetailRow[] = [];
  for (const chunk of chunks) {
    const m = chunk.match(/^(\d+)\t(토지|건물|집합건물)\t([\s\S]*)$/);
    if (!m) continue;
    const no = Number(m[1]);
    if (!Number.isFinite(no) || no <= 0) continue;
    const detail = m[3]
      .replace(/\u00a0/g, " ")
      .replace(/\r/g, "")
      .split("\n")
      .map((l) => l.replace(/[ \t]+$/g, ""))
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    rows.push({ no, listKind: m[2], detail });
  }
  return rows;
}

export function normalizeListDetailCell(raw: string): string {
  return raw
    .replace(/\u00a0/g, " ")
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Playwright page.evaluate용 — 테이블 셀 우선 */
export function parseListDetailsFromDomSnapshot(input: {
  tableRows: { noText: string; kind: string; detail: string }[];
  fallbackText: string;
}): AuctionListDetailRow[] {
  const fromTable: AuctionListDetailRow[] = [];
  for (const r of input.tableRows) {
    const no = Number((r.noText || "").replace(/\D/g, ""));
    const listKind = (r.kind || "").trim();
    if (!Number.isFinite(no) || no <= 0 || !KIND_RE.test(listKind)) continue;
    fromTable.push({
      no,
      listKind,
      detail: normalizeListDetailCell(r.detail || ""),
    });
  }
  if (fromTable.length) return fromTable;
  return parseListDetailsFromText(input.fallbackText || "");
}

export function firstAddressFromDetail(detail: string): string {
  for (const line of detail.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    if (/^(제시외|매각지분|1동의|전유부분|대지권|위지상|지하|지\d|[\d]+층|옥탑)/.test(t)) {
      continue;
    }
    if (/[시군구읍면동리가로길]/.test(t) || /특별|광역|충청|전라|경상|강원|제주|경기|서울|부산|대구|인천|광주|대전|울산|세종/.test(t)) {
      return t.replace(/^\[도로명 주소\]\s*/, "").trim();
    }
  }
  return detail.split("\n").map((l) => l.trim()).find(Boolean) || "";
}

export function listDetailsToCaseListRows(rows: AuctionListDetailRow[]) {
  return rows.map((r) => ({
    no: r.no,
    listKind: r.listKind,
    address: firstAddressFromDetail(r.detail),
    detail: r.detail,
  }));
}
