import type { Auction, Property } from "@prisma/client";
import {
  categoryLabel,
  formatAreaPyeong,
  formatAuctionMoney,
  formatDateYmd,
  formatPropertyPrice,
  parseImages,
  propertyTypeLabel,
} from "@/lib/format";

const BUSINESS = {
  officeName: "찬스부동산 공인중개사사무소",
  tagline: "경매대리 전문",
  representative: "김영찬 공인중개사 / 매수신청대리인",
  tel: "041-633-0000",
  mobile: "010-0000-0000",
  address: "충남 홍성군 홍북읍 신경리 00번지",
  officeRegNo: "000000-0000-00000",
  bidAgentRegNo: "0000000-0000-00000",
} as const;

function appBaseUrl(): string {
  return (process.env.APP_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
}

function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${appBaseUrl()}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e8edf5;width:34%;font-size:13px;color:#64748b;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e8edf5;font-size:13px;color:#0f172a;font-weight:600;vertical-align:top;">${escapeHtml(value)}</td>
    </tr>`;
}

function badge(text: string, bg: string, color: string): string {
  return `<span style="display:inline-block;padding:4px 10px;border-radius:999px;background:${bg};color:${color};font-size:12px;font-weight:700;letter-spacing:-0.01em;">${escapeHtml(text)}</span>`;
}

function areaLabel(prefix: string, sqm: number | null | undefined): string | null {
  if (sqm == null || !Number.isFinite(sqm) || sqm <= 0) return null;
  return `${prefix} ${sqm}㎡ (약 ${formatAreaPyeong(sqm)})`;
}

function dealLabel(property: Property): string {
  if (property.type === "SALE" || property.type === "PRE_SALE") {
    return propertyTypeLabel(property.type);
  }
  if (property.isJeonse || property.dealSubType === "JEONSE") return "전세";
  if (property.dealSubType === "MONTHLY") return "월세";
  return propertyTypeLabel(property.type);
}

function auctionStatusLabel(auction: Auction): string {
  switch (auction.status) {
    case "ONGOING":
      return "진행중";
    case "CLOSED":
      return "매각";
    case "FAILED":
      return "유찰/취하";
    default:
      return auction.status;
  }
}

function rightsComment(auction: Auction): string | null {
  if (auction.rightsAnalysis?.trim()) {
    return auction.rightsAnalysis.trim().slice(0, 120);
  }
  switch (auction.safetyGrade) {
    case "SAFE":
      return "권리관계 깨끗함 · 매수신청대리 검토 추천";
    case "CAUTION":
      return "권리관계 유의 · 전문가 검토 권장";
    case "RISK":
      return "권리위험 있음 · 상세 분석 필수";
    default:
      return null;
  }
}

function dDayLabel(auction: Auction): string | null {
  if (auction.dDay != null && Number.isFinite(auction.dDay)) {
    if (auction.dDay === 0) return "D-Day";
    if (auction.dDay > 0) return `D-${auction.dDay}`;
    return `D+${Math.abs(auction.dDay)}`;
  }
  if (auction.saleDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sale = new Date(auction.saleDate);
    sale.setHours(0, 0, 0, 0);
    const diff = Math.round((sale.getTime() - today.getTime()) / 86400000);
    if (diff === 0) return "D-Day";
    if (diff > 0) return `D-${diff}`;
    return `D+${Math.abs(diff)}`;
  }
  return null;
}

function auctionWon(amount: number): number {
  return amount > 0 && amount < 1_000_000 ? amount * 10_000 : amount;
}

function discountLabel(appraisal: number, minPrice: number | null | undefined): string | null {
  if (minPrice == null || minPrice <= 0 || appraisal <= 0) return null;
  const a = auctionWon(appraisal);
  const m = auctionWon(minPrice);
  const pct = Math.round((m / a) * 100);
  if (!Number.isFinite(pct) || pct <= 0) return null;
  return `감정가 대비 ${pct}%`;
}

function emailShell(options: {
  preheader: string;
  accentFrom: string;
  accentTo: string;
  bodyInner: string;
  unsubscribeUrl: string;
}): string {
  const b = BUSINESS;
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>찬스부동산 맞춤 알림</title>
</head>
<body style="margin:0;padding:0;background:#eef2f7;font-family:'Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR',Arial,sans-serif;color:#0f172a;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(options.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #dbe3ef;box-shadow:0 8px 28px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,${options.accentFrom},${options.accentTo});padding:22px 24px;color:#ffffff;">
              <div style="font-size:12px;opacity:0.9;letter-spacing:0.04em;">CHANCE REAL ESTATE &amp; AUCTION</div>
              <div style="margin-top:6px;font-size:20px;font-weight:800;letter-spacing:-0.02em;">${escapeHtml(b.officeName)}</div>
              <div style="margin-top:4px;font-size:13px;opacity:0.92;">${escapeHtml(b.tagline)} · 대표 ${escapeHtml(b.representative.split(" / ")[0] || b.representative)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px 8px;font-size:14px;line-height:1.75;color:#334155;">
              ${options.bodyInner}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 24px;font-size:13px;line-height:1.75;color:#475569;">
              <p style="margin:0 0 12px;">
                본 매물에 대한 상세 권리분석, 현장 안내 및 입찰 대리 상담은 아래 버튼을 통해 바로 문의해 주시면
                친절하고 정확하게 안내해 드리겠습니다.<br />감사합니다.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <div style="font-size:14px;font-weight:800;color:#0f172a;margin-bottom:8px;">[${escapeHtml(b.officeName)}]</div>
                    <div style="font-size:12px;color:#64748b;line-height:1.7;">
                      대표 공인중개사 / 매수신청대리인<br />
                      문의전화: ${escapeHtml(b.tel)} · ${escapeHtml(b.mobile)}<br />
                      주소: ${escapeHtml(b.address)}<br />
                      사무소등록번호: ${escapeHtml(b.officeRegNo)}<br />
                      매수신청대리등록번호: ${escapeHtml(b.bidAgentRegNo)}
                    </div>
                  </td>
                </tr>
              </table>
              <p style="margin:20px 0 0;font-size:12px;line-height:1.6;color:#94a3b8;text-align:center;">
                더 이상 맞춤 알림을 받지 않으시려면
                <a href="${escapeHtml(options.unsubscribeUrl)}" style="color:#64748b;text-decoration:underline;">수신거부 / 알림해제</a>
                를 눌러 주세요.
              </p>
            </td>
          </tr>
        </table>
        <div style="max-width:600px;margin-top:14px;font-size:11px;color:#94a3b8;line-height:1.5;text-align:center;">
          본 메일은 고객님께서 신청하신 맞춤 알림에 따라 발송되었습니다.<br />
          매물·경매 정보는 참고용이며, 최종 확인은 현장·등기·법원 공고를 기준으로 합니다.
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function plainTextFooter(unsubscribeUrl: string): string {
  return [
    "",
    "본 안내에 대한 상세 상담은 홈페이지 또는 전화로 문의해 주세요.",
    `${BUSINESS.officeName}`,
    `문의: ${BUSINESS.tel} / ${BUSINESS.mobile}`,
    `주소: ${BUSINESS.address}`,
    "",
    `수신거부/알림해제: ${unsubscribeUrl}`,
  ].join("\n");
}

export function propertyAlertEmail(property: Property, unsubscribeToken: string) {
  const url = `${appBaseUrl()}/properties/${property.id}`;
  const unsub = `${appBaseUrl()}/unsubscribe?token=${unsubscribeToken}`;
  const cat = categoryLabel(property.category);
  const deal = dealLabel(property);
  const price = formatPropertyPrice(property);
  const images = parseImages(property.images);
  const imageUrl = images[0] ? absoluteUrl(images[0]) : null;
  const supply = areaLabel("공급", property.supplyArea);
  const exclusive = areaLabel(
    property.category === "LAND" ? "면적" : "전용",
    property.exclusiveArea,
  );
  const floor =
    property.floor != null
      ? property.totalFloors
        ? `${property.floor}층 / ${property.totalFloors}층`
        : `${property.floor}층`
      : null;
  const rooms = property.rooms != null ? `방 ${property.rooms}` : null;
  const baths = property.bathrooms != null ? `욕실 ${property.bathrooms}` : null;
  const feature =
    property.featureSummary?.trim() ||
    [property.direction, property.moveInType, property.buildingName].filter(Boolean).join(" · ") ||
    null;

  const subject =
    "[찬스부동산] 고객님께서 등록하신 관심 조건의 신규 매물이 등록되었습니다.";

  const badges = `${badge(cat, "#dbeafe", "#1d4ed8")}&nbsp;${badge(deal, "#dcfce7", "#15803d")}`;
  const imageBlock = imageUrl
    ? `<tr><td style="padding:0;"><img src="${escapeHtml(imageUrl)}" alt="" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;" /></td></tr>`
    : "";

  const bodyInner = `
    <p style="margin:0 0 16px;">
      안녕하십니까, 고객님.<br />
      고객님의 소중한 자산 형성 및 성공적인 부동산 투자를 함께하는 <strong style="color:#0f172a;">찬스부동산</strong>입니다.<br />
      신청해주신 맞춤 알림 조건에 딱 맞는 최신 <strong style="color:#0f172a;">부동산 매물</strong>이 새로 등록되어 안내드립니다.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;margin:0 0 18px;">
      ${imageBlock}
      <tr>
        <td style="padding:18px 16px 8px;">
          <div style="margin-bottom:10px;">${badges}</div>
          <div style="font-size:18px;font-weight:800;color:#0f172a;letter-spacing:-0.02em;line-height:1.35;">${escapeHtml(property.title)}</div>
          <div style="margin-top:8px;font-size:13px;color:#64748b;">${escapeHtml(property.address)}</div>
          <div style="margin-top:12px;font-size:22px;font-weight:800;color:#0b3b8c;">${escapeHtml(price)}</div>
          ${feature ? `<div style="margin-top:10px;padding:10px 12px;background:#f8fafc;border-radius:10px;font-size:13px;color:#475569;">${escapeHtml(feature)}</div>` : ""}
        </td>
      </tr>
      <tr>
        <td style="padding:0 8px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            ${row("공급면적", supply)}
            ${row(property.category === "LAND" ? "면적" : "전용면적", exclusive)}
            ${row("층수", floor)}
            ${row("방 / 욕실", [rooms, baths].filter(Boolean).join(" · ") || null)}
            ${row("소재지", property.address)}
            ${row("가격", price)}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 16px 20px;" align="center">
          <a href="${escapeHtml(url)}" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#4f46e5);color:#ffffff;text-decoration:none;font-weight:800;font-size:14px;padding:14px 22px;border-radius:12px;">
            매물 상세정보 및 현장 문의하기
          </a>
        </td>
      </tr>
    </table>
  `;

  const html = emailShell({
    preheader: `${cat}/${deal} · ${property.title} · ${price}`,
    accentFrom: "#1e3a8a",
    accentTo: "#4f46e5",
    bodyInner,
    unsubscribeUrl: unsub,
  });

  const text = [
    "안녕하십니까, 고객님.",
    "찬스부동산입니다. 맞춤 알림 조건에 맞는 부동산 매물이 등록되어 안내드립니다.",
    "",
    `[${cat}/${deal}] ${property.title}`,
    property.address,
    `가격: ${price}`,
    supply ? `공급: ${supply}` : "",
    exclusive ? `전용/면적: ${exclusive}` : "",
    floor ? `층수: ${floor}` : "",
    feature ? `특징: ${feature}` : "",
    "",
    `상세보기: ${url}`,
    plainTextFooter(unsub),
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}

export function auctionAlertEmail(auction: Auction, unsubscribeToken: string) {
  const url = `${appBaseUrl()}/auctions?id=${encodeURIComponent(auction.id)}`;
  const unsub = `${appBaseUrl()}/unsubscribe?token=${unsubscribeToken}`;
  const itemType =
    auction.itemType?.trim() || auction.auctionType?.trim() || auction.auctionTarget?.trim() || "경매물건";
  const status = auctionStatusLabel(auction);
  const appraisal = formatAuctionMoney(auction.appraisalPrice);
  const minSource = auction.minPrice ?? auction.recommendedPrice;
  const minPrice = formatAuctionMoney(minSource);
  const discount = discountLabel(auction.appraisalPrice, minSource);
  const saleDate = formatDateYmd(auction.saleDate);
  const dDay = dDayLabel(auction);
  const rights = rightsComment(auction);
  const images = parseImages(auction.images);
  const imageUrl = images[0] ? absoluteUrl(images[0]) : null;
  const land =
    auction.landArea != null && auction.landArea > 0
      ? `토지 ${auction.landArea}㎡ (약 ${formatAreaPyeong(auction.landArea)})`
      : null;
  const building =
    auction.buildingArea != null && auction.buildingArea > 0
      ? `건물 ${auction.buildingArea}㎡ (약 ${formatAreaPyeong(auction.buildingArea)})`
      : null;

  const subject =
    "[찬스부동산 경매알림] 설정하신 조건에 부합하는 경매/공매 물건 안내드립니다.";

  const badges = `${badge(itemType, "#ffedd5", "#c2410c")}&nbsp;${badge(status, "#fef3c7", "#b45309")}${
    dDay ? `&nbsp;${badge(dDay, "#fee2e2", "#b91c1c")}` : ""
  }`;
  const imageBlock = imageUrl
    ? `<tr><td style="padding:0;"><img src="${escapeHtml(imageUrl)}" alt="" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;" /></td></tr>`
    : "";

  const bodyInner = `
    <p style="margin:0 0 16px;">
      안녕하십니까, 고객님.<br />
      고객님의 소중한 자산 형성 및 성공적인 부동산 투자를 함께하는 <strong style="color:#0f172a;">찬스부동산</strong>입니다.<br />
      신청해주신 맞춤 알림 조건에 딱 맞는 최신 <strong style="color:#0f172a;">경매 물건</strong>이 새로 등록되어 안내드립니다.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;margin:0 0 18px;">
      ${imageBlock}
      <tr>
        <td style="padding:18px 16px 8px;">
          <div style="margin-bottom:10px;">${badges}</div>
          <div style="font-size:18px;font-weight:800;color:#0f172a;letter-spacing:-0.02em;line-height:1.35;">${escapeHtml(auction.title)}</div>
          <div style="margin-top:8px;font-size:13px;color:#64748b;">
            사건번호 <strong style="color:#0f172a;">${escapeHtml(auction.caseNumber)}</strong>
            ${auction.court ? ` · ${escapeHtml(auction.court)}` : ""}
          </div>
          <div style="margin-top:14px;display:block;">
            <div style="font-size:12px;color:#94a3b8;">감정가</div>
            <div style="font-size:16px;font-weight:700;color:#475569;text-decoration:line-through;">${escapeHtml(appraisal)}</div>
            <div style="margin-top:6px;font-size:12px;color:#94a3b8;">최저매각가격 ${discount ? `(${escapeHtml(discount)})` : ""}</div>
            <div style="font-size:22px;font-weight:800;color:#b45309;">${escapeHtml(minPrice)}</div>
          </div>
          ${
            rights
              ? `<div style="margin-top:12px;padding:10px 12px;background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;font-size:13px;color:#9a3412;font-weight:600;">${escapeHtml(rights)}</div>`
              : ""
          }
        </td>
      </tr>
      <tr>
        <td style="padding:0 8px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            ${row("사건번호", auction.caseNumber)}
            ${row("담당 법원", auction.court)}
            ${row("물건 종류", itemType)}
            ${row("진행 상태", status)}
            ${row("매각기일", saleDate !== "-" ? `${saleDate}${dDay ? ` (${dDay})` : ""}` : null)}
            ${row("소재지", auction.address)}
            ${row("면적", [land, building].filter(Boolean).join(" · ") || null)}
            ${row("감정가", appraisal)}
            ${row("최저매각가격", `${minPrice}${discount ? ` · ${discount}` : ""}`)}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 16px 20px;" align="center">
          <a href="${escapeHtml(url)}" style="display:inline-block;background:linear-gradient(135deg,#d97706,#ea580c);color:#ffffff;text-decoration:none;font-weight:800;font-size:14px;padding:14px 22px;border-radius:12px;">
            전문 경매대리 상담 신청하기
          </a>
        </td>
      </tr>
    </table>
  `;

  const html = emailShell({
    preheader: `${auction.caseNumber} · ${auction.title} · 최저 ${minPrice}`,
    accentFrom: "#9a3412",
    accentTo: "#d97706",
    bodyInner,
    unsubscribeUrl: unsub,
  });

  const text = [
    "안녕하십니까, 고객님.",
    "찬스부동산입니다. 맞춤 알림 조건에 맞는 경매/공매 물건이 등록되어 안내드립니다.",
    "",
    auction.title,
    `사건번호: ${auction.caseNumber}`,
    auction.court ? `법원: ${auction.court}` : "",
    auction.address ? `소재지: ${auction.address}` : "",
    `감정가: ${appraisal}`,
    `최저매각가격: ${minPrice}${discount ? ` (${discount})` : ""}`,
    saleDate !== "-" ? `매각기일: ${saleDate}${dDay ? ` (${dDay})` : ""}` : "",
    rights ? `권리요약: ${rights}` : "",
    "",
    `상세보기: ${url}`,
    plainTextFooter(unsub),
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}

export type AlertMessageContext = {
  customerName?: string | null;
  unsubscribeToken: string;
};

function customerDisplayName(name?: string | null): string {
  const n = name?.trim();
  return n || "고객";
}

function unsubscribeUrl(token: string): string {
  return `${appBaseUrl()}/unsubscribe?token=${token}`;
}

function addressSummary(address: string | null | undefined, max = 40): string {
  const a = (address || "").trim();
  if (!a) return "상세 페이지 참고";
  return a.length > max ? `${a.slice(0, max)}…` : a;
}

function clip(value: string, max: number): string {
  const t = value.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

function propertyFeatureParts(property: Property): {
  areaLabel: string | null;
  floorLabel: string | null;
  featureLine: string | null;
} {
  const exclusive = property.exclusiveArea;
  const areaLabel =
    exclusive != null && exclusive > 0
      ? `전용 ${exclusive}㎡`
      : property.supplyArea != null && property.supplyArea > 0
        ? `공급 ${property.supplyArea}㎡`
        : null;
  const floorLabel =
    property.floor != null
      ? property.totalFloors
        ? `${property.floor}/${property.totalFloors}층`
        : `${property.floor}층`
      : null;
  const featureLine =
    property.featureSummary?.trim() ||
    [property.direction, property.moveInType, property.buildingName].filter(Boolean).join(" · ") ||
    null;
  return { areaLabel, floorLabel, featureLine };
}

/** LMS · 알림톡 대체문자 (중개 매물) */
export function propertyAlertSms(property: Property, ctx: AlertMessageContext): string {
  const url = `${appBaseUrl()}/properties/${property.id}`;
  const unsub = unsubscribeUrl(ctx.unsubscribeToken);
  const { areaLabel, floorLabel, featureLine } = propertyFeatureParts(property);
  const featureParts = [areaLabel, floorLabel, featureLine].filter(Boolean);
  const feature = featureParts.length ? featureParts.join(" | ") : "상세 페이지에서 확인";

  return [
    "[찬스부동산] 관심 매물 등록 안내",
    "",
    `안녕하세요, ${customerDisplayName(ctx.customerName)}님!`,
    "요청하신 조건에 맞는 신규 매물이 등록되었습니다.",
    "",
    `■ 매물명: ${property.title}`,
    `■ 거래/유형: ${dealLabel(property)} / ${categoryLabel(property.category)}`,
    `■ 소재지: ${addressSummary(property.address)}`,
    `■ 금액: ${formatPropertyPrice(property)}`,
    `■ 특징: ${feature}`,
    "",
    "▼ 상세 정보 및 현장 안내 문의",
    url,
    "",
    `- 문의: 찬스부동산 (${BUSINESS.tel})`,
    `- 수신거부: ${unsub}`,
  ].join("\n");
}

/** LMS · 알림톡 대체문자 (경매) */
export function auctionAlertSms(auction: Auction, ctx: AlertMessageContext): string {
  const url = `${appBaseUrl()}/auctions?id=${encodeURIComponent(auction.id)}`;
  const unsub = unsubscribeUrl(ctx.unsubscribeToken);
  const itemType =
    auction.itemType?.trim() || auction.auctionType?.trim() || auction.auctionTarget?.trim() || "경매물건";
  const minSource = auction.minPrice ?? auction.recommendedPrice;
  const dDay = dDayLabel(auction);
  const courtPart = auction.court?.trim() ? ` (${auction.court.trim()})` : "";
  const minLine = dDay
    ? `■ 최저가: ${formatAuctionMoney(minSource)} (${dDay})`
    : `■ 최저가: ${formatAuctionMoney(minSource)}`;

  return [
    "[찬스부동산] 관심 경매 물건 안내",
    "",
    `안녕하세요, ${customerDisplayName(ctx.customerName)}님!`,
    "설정하신 조건에 맞는 경매 물건 정보를 안내해 드립니다.",
    "",
    `■ 사건번호: ${auction.caseNumber}${courtPart}`,
    `■ 물건종류: ${itemType} [${auctionStatusLabel(auction)}]`,
    `■ 소재지: ${addressSummary(auction.address || auction.region)}`,
    `■ 감정가: ${formatAuctionMoney(auction.appraisalPrice)}`,
    minLine,
    "",
    "▼ 권리분석 및 입찰대리 상담하기",
    url,
    "",
    `- 전문 경매대리인: 찬스부동산 (${BUSINESS.tel})`,
    `- 수신거부: ${unsub}`,
  ].join("\n");
}

export function propertyKakaoTemplateId(): string | null {
  return process.env.SOLAPI_KAKAO_TEMPLATE_PROPERTY?.trim() || null;
}

export function auctionKakaoTemplateId(): string | null {
  return process.env.SOLAPI_KAKAO_TEMPLATE_AUCTION?.trim() || null;
}

/** 카카오 비즈메시지 검수 템플릿 변수 (운영 시 Solapi에 동일 키로 등록) */
export function propertyKakaoVariables(
  property: Property,
  ctx: AlertMessageContext,
): Record<string, string> {
  const { areaLabel, floorLabel, featureLine } = propertyFeatureParts(property);
  const featureParts = [areaLabel, floorLabel, featureLine].filter(Boolean);
  const feature = featureParts.length ? featureParts.join(" | ") : "상세 페이지에서 확인";

  return {
    "#{고객명}": clip(customerDisplayName(ctx.customerName), 20),
    "#{매물명}": clip(property.title, 40),
    "#{거래유형}": clip(dealLabel(property), 20),
    "#{매물유형}": clip(categoryLabel(property.category), 20),
    "#{소재지}": clip(addressSummary(property.address), 40),
    "#{금액}": clip(formatPropertyPrice(property), 30),
    "#{특징}": clip(feature, 40),
    "#{링크}": `${appBaseUrl()}/properties/${property.id}`,
    "#{문의전화}": BUSINESS.tel,
    "#{수신거부}": unsubscribeUrl(ctx.unsubscribeToken),
  };
}

export function auctionKakaoVariables(
  auction: Auction,
  ctx: AlertMessageContext,
): Record<string, string> {
  const itemType =
    auction.itemType?.trim() || auction.auctionType?.trim() || auction.auctionTarget?.trim() || "경매물건";
  const minSource = auction.minPrice ?? auction.recommendedPrice;
  const dDay = dDayLabel(auction) || "-";

  return {
    "#{고객명}": clip(customerDisplayName(ctx.customerName), 20),
    "#{사건번호}": clip(auction.caseNumber, 30),
    "#{담당법원}": clip(auction.court?.trim() || "-", 30),
    "#{물건유형}": clip(itemType, 20),
    "#{진행상태}": clip(auctionStatusLabel(auction), 20),
    "#{소재지}": clip(addressSummary(auction.address || auction.region), 40),
    "#{감정가}": clip(formatAuctionMoney(auction.appraisalPrice), 30),
    "#{최저가}": clip(formatAuctionMoney(minSource), 30),
    "#{DDay}": clip(dDay, 10),
    "#{링크}": `${appBaseUrl()}/auctions?id=${encodeURIComponent(auction.id)}`,
    "#{문의전화}": BUSINESS.tel,
    "#{수신거부}": unsubscribeUrl(ctx.unsubscribeToken),
  };
}
