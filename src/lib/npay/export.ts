import type { NpayArticleRow, NpayComplexRow } from "./types";

export function escapeCsvCell(v: string): string {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

export function buildSpreadsheetMl(
  sheetName: string,
  headers: string[],
  rows: string[][],
): string {
  const cell = (v: string) =>
    `<Cell><Data ss:Type="String">${v
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")}</Data></Cell>`;
  const headerRow = `<Row>${headers.map(cell).join("")}</Row>`;
  const body = rows.map((r) => `<Row>${r.map(cell).join("")}</Row>`).join("");
  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Worksheet ss:Name="${sheetName.slice(0, 31)}">
<Table>${headerRow}${body}</Table>
</Worksheet>
</Workbook>`;
}

/** 원 → 만원 문자열 (표시/엑셀용) */
export function wonToMan(v: number): string {
  if (!v) return "";
  return String(Math.round(v / 10_000));
}

export function articleExportTable(list: NpayArticleRow[]) {
  const headers = [
    "매물번호",
    "거래",
    "유형",
    "단지명",
    "매물명",
    "동",
    "공급㎡",
    "전용㎡",
    "대지㎡",
    "층",
    "향",
    "매매가(만)",
    "보증금(만)",
    "월세(만)",
    "관리비(만)",
    "시/도",
    "시군구",
    "읍면동",
    "위도",
    "경도",
    "중개사",
    "확인일",
    "사용승인일",
    "경과년",
    "특징",
    "URL",
    "중복",
  ];
  const body = list.map((a) => [
    a.articleNumber,
    a.tradeTypeLabel,
    a.estateTypeLabel,
    a.complexName,
    a.articleName,
    a.dongName,
    a.supplyArea != null ? String(a.supplyArea) : "",
    a.exclusiveArea != null ? String(a.exclusiveArea) : "",
    a.landArea != null ? String(a.landArea) : "",
    a.floorInfo,
    a.direction,
    wonToMan(a.dealPrice),
    wonToMan(a.warrantyPrice),
    wonToMan(a.rentPrice),
    wonToMan(a.managementFee),
    a.city,
    a.division,
    a.sector,
    a.latitude != null ? String(a.latitude) : "",
    a.longitude != null ? String(a.longitude) : "",
    a.realtorName,
    a.confirmationDate,
    a.approvalDate,
    a.approvalElapsedYear != null ? String(a.approvalElapsedYear) : "",
    a.feature,
    a.articleUrl,
    a.isDuplicate ? "Y" : "",
  ]);
  return { headers, body };
}

export function complexExportTable(list: NpayComplexRow[]) {
  const headers = [
    "단지번호",
    "단지명",
    "평형번호",
    "평형",
    "공급㎡",
    "전용㎡",
    "시/도",
    "시군구",
    "읍면동",
    "도로명",
    "지번",
    "위도",
    "경도",
    "세대수",
    "동수",
    "최고층",
    "사용승인일",
    "승인연",
    "시공사",
    "난방",
    "주차",
    "URL",
  ];
  const body = list.map((c) => [
    String(c.complexNumber),
    c.complexName,
    c.pyeongTypeNumber != null ? String(c.pyeongTypeNumber) : "",
    c.pyeongName,
    c.supplyArea != null ? String(c.supplyArea) : "",
    c.exclusiveArea != null ? String(c.exclusiveArea) : "",
    c.city,
    c.division,
    c.sector,
    c.roadName,
    c.jibun,
    c.latitude != null ? String(c.latitude) : "",
    c.longitude != null ? String(c.longitude) : "",
    c.totalHouseholds != null ? String(c.totalHouseholds) : "",
    c.dongCount != null ? String(c.dongCount) : "",
    c.highestFloor != null ? String(c.highestFloor) : "",
    c.useApprovalDate,
    c.useApprovalYear != null ? String(c.useApprovalYear) : "",
    c.constructionCompany,
    c.heating,
    c.parking,
    c.complexUrl,
  ]);
  return { headers, body };
}
