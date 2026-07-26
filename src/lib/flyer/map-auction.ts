import { formatAuctionMoney, formatDateYmd, parseImages } from "@/lib/format";
import type { FlyerViewModel } from "@/lib/flyer/types";

export type AuctionFlyerSource = {
  id: string;
  title?: string | null;
  caseNumber?: string | null;
  itemNo?: number | string | null;
  court?: string | null;
  address?: string | null;
  address2?: string | null;
  appraisalPrice?: number | null;
  minPrice?: number | null;
  recommendedPrice?: number | null;
  bidDeposit?: number | null;
  saleDate?: Date | string | null;
  landArea?: number | null;
  buildingArea?: number | null;
  images?: string | string[] | null;
  rightsAnalysis?: string | null;
  description?: string | null;
  memo?: string | null;
};

function clamp(s: string, n: number) {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= n) return t;
  return `${t.slice(0, n - 1)}…`;
}

function rightsSummary(rights: string | null | undefined): string {
  if (!rights?.trim()) return "";
  const lines = rights
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("[") && !l.startsWith("{"));
  const pick =
    lines.find((l) => /점유|말소|대항|임차|권리|지분/.test(l)) || lines[0] || "";
  return clamp(pick, 72);
}

export function mapAuctionToFlyer(a: AuctionFlyerSource): FlyerViewModel {
  const missing: string[] = [];
  const min = a.minPrice ?? a.recommendedPrice ?? null;
  const appraisal = a.appraisalPrice ?? null;
  const images = Array.isArray(a.images)
    ? a.images.filter(Boolean).slice(0, 3)
    : parseImages(typeof a.images === "string" ? a.images : "[]").slice(0, 3);

  const discount =
    appraisal && min && appraisal > 0
      ? `감정가 대비 약 ${Math.round((min / appraisal) * 100)}%`
      : "";

  const deposit =
    a.bidDeposit != null && a.bidDeposit > 0
      ? formatAuctionMoney(a.bidDeposit)
      : min != null
        ? `${formatAuctionMoney(Math.round(min * 0.1))} (최저가의 10% 추정)`
        : "";

  const areaParts: string[] = [];
  if (a.buildingArea != null) areaParts.push(`건물 ${a.buildingArea}㎡`);
  if (a.landArea != null) areaParts.push(`토지 ${a.landArea}㎡`);
  const areaLine = areaParts.join(" / ");

  const rights = rightsSummary(a.rightsAnalysis);
  const insight =
    clamp(a.memo || "", 140) ||
    clamp(a.description || "", 140) ||
    (rights
      ? `권리·점유 사전 확인이 필요합니다. ${rights}`
      : "입찰 전 현장·공부·점유 상태를 매수신청대리인과 함께 확인해 주세요.");

  function cell(label: string, value: string): [string, string] {
    if (!value.trim()) {
      missing.push(label);
      return [label, "미기재"];
    }
    return [label, value];
  }

  return {
    kind: "AUCTION",
    badge: "법원 경매",
    title: a.title?.trim() || `${a.address || "경매물건"}`.trim(),
    subtitle: [discount, rights ? "권리분석 요약 포함" : "권리·현장 확인 권장"]
      .filter(Boolean)
      .join(" · "),
    priceLine: min != null ? `최저 ${formatAuctionMoney(min)}` : "최저가 미기재",
    metaLine: [a.court, a.caseNumber, a.itemNo != null ? `물건 ${a.itemNo}번` : ""]
      .filter(Boolean)
      .join(" · "),
    publicPath: `/auctions/${a.id}`,
    images,
    specs: [
      cell("관할법원", a.court?.trim() || ""),
      cell("사건번호", a.caseNumber?.trim() || ""),
      cell("물건번호", a.itemNo != null ? `${a.itemNo}번` : ""),
      cell("소재지", [a.address, a.address2].filter(Boolean).join(" ")),
      cell("면적", areaLine),
      cell("감정평가액", appraisal != null ? formatAuctionMoney(appraisal) : ""),
      cell("최저매각가격", min != null ? formatAuctionMoney(min) : ""),
      cell("입찰보증금", deposit),
      cell("매각기일", formatDateYmd(a.saleDate) === "-" ? "" : formatDateYmd(a.saleDate)),
      cell("권리요약", rights),
      ["비고", "법원 공부 변동 가능"],
      ["용도", "경매물건"],
    ],
    insightTitle: "전문가 포인트",
    insight,
    missingLabels: missing,
    footerDisclaimer:
      "※ 본 자료는 참고용이며 법원 공부 변동에 따라 매각 조건이 달라질 수 있습니다.",
  };
}
