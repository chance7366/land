/**
 * 샘플 전용 — 맞춤 알림 HTML 메일 템플릿 미리보기.
 * 승인 후 프로덕션 `subscription-templates.ts`에 이식.
 */

export const SAMPLE_BUSINESS = {
  officeName: "찬스부동산 공인중개사사무소",
  tagline: "경매대리 전문",
  representative: "김영찬 공인중개사 / 매수신청대리인",
  tel: "041-633-0000",
  mobile: "010-0000-0000",
  address: "충남 홍성군 홍북읍 신경리 00번지",
  officeRegNo: "000000-0000-00000",
  bidAgentRegNo: "0000000-0000-00000",
} as const;

export type SamplePropertyEmail = {
  title: string;
  categoryLabel: string;
  dealLabel: string;
  address: string;
  priceLabel: string;
  supplyAreaLabel: string | null;
  exclusiveAreaLabel: string | null;
  floorLabel: string | null;
  roomsLabel: string | null;
  bathsLabel: string | null;
  featureSummary: string | null;
  imageUrl: string | null;
  detailUrl: string;
  unsubscribeUrl: string;
};

export type SampleAuctionEmail = {
  title: string;
  caseNumber: string;
  court: string | null;
  itemTypeLabel: string;
  statusLabel: string;
  appraisalLabel: string;
  minPriceLabel: string;
  discountLabel: string | null;
  saleDateLabel: string | null;
  dDayLabel: string | null;
  address: string | null;
  landAreaLabel: string | null;
  buildingAreaLabel: string | null;
  rightsComment: string | null;
  imageUrl: string | null;
  detailUrl: string;
  unsubscribeUrl: string;
};

export const SAMPLE_PROPERTY: SamplePropertyEmail = {
  title: "내포신도시 자이 84㎡ 고층 남향",
  categoryLabel: "아파트",
  dealLabel: "매매",
  address: "충남 홍성군 홍북읍 신경리 123 (내포신도시)",
  priceLabel: "3억 8,500만 원",
  supplyAreaLabel: "공급 110.2㎡ (약 33.3평)",
  exclusiveAreaLabel: "전용 84.9㎡ (약 25.7평)",
  floorLabel: "15층 / 28층",
  roomsLabel: "방 3",
  bathsLabel: "욕실 2",
  featureSummary: "남향 · 역세권 도보 7분 · 즉시입주 가능 · 확장형 구조",
  imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
  detailUrl: "https://example.com/properties/sample",
  unsubscribeUrl: "https://example.com/unsubscribe?token=sample",
};

export const SAMPLE_AUCTION: SampleAuctionEmail = {
  title: "내포자이 1단지 1502호",
  caseNumber: "2024타경10010",
  court: "대전지방법원 홍성지원",
  itemTypeLabel: "아파트",
  statusLabel: "유찰 1회",
  appraisalLabel: "4억 5,000만 원",
  minPriceLabel: "3억 1,500만 원",
  discountLabel: "감정가 대비 70%",
  saleDateLabel: "2026-07-22",
  dDayLabel: "D-5",
  address: "충남 홍성군 홍북읍 신경리 456",
  landAreaLabel: "토지 48.2㎡",
  buildingAreaLabel: "건물 84.9㎡",
  rightsComment: "권리관계 양호 · 매수신청대리 검토 추천",
  imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
  detailUrl: "https://example.com/auctions/sample",
  unsubscribeUrl: "https://example.com/unsubscribe?token=sample",
};

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

function emailShell(options: {
  preheader: string;
  accentFrom: string;
  accentTo: string;
  bodyInner: string;
  unsubscribeUrl: string;
}): string {
  const b = SAMPLE_BUSINESS;
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
                본 안내에 대한 상세 권리분석, 현장 안내 및 입찰 대리 상담은 아래 버튼을 통해 문의해 주시면
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

export function samplePropertySubject(): string {
  return "[찬스부동산] 고객님께서 등록하신 관심 조건의 신규 매물이 등록되었습니다.";
}

export function sampleAuctionSubject(): string {
  return "[찬스부동산 경매알림] 설정하신 조건에 부합하는 경매/공매 물건 안내드립니다.";
}

export function renderSamplePropertyEmailHtml(data: SamplePropertyEmail = SAMPLE_PROPERTY): string {
  const badges = `${badge(data.categoryLabel, "#dbeafe", "#1d4ed8")}&nbsp;${badge(data.dealLabel, "#dcfce7", "#15803d")}`;
  const imageBlock = data.imageUrl
    ? `<tr><td style="padding:0;">
        <img src="${escapeHtml(data.imageUrl)}" alt="" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;" />
      </td></tr>`
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
          <div style="font-size:18px;font-weight:800;color:#0f172a;letter-spacing:-0.02em;line-height:1.35;">${escapeHtml(data.title)}</div>
          <div style="margin-top:8px;font-size:13px;color:#64748b;">${escapeHtml(data.address)}</div>
          <div style="margin-top:12px;font-size:22px;font-weight:800;color:#0b3b8c;">${escapeHtml(data.priceLabel)}</div>
          ${data.featureSummary ? `<div style="margin-top:10px;padding:10px 12px;background:#f8fafc;border-radius:10px;font-size:13px;color:#475569;">${escapeHtml(data.featureSummary)}</div>` : ""}
        </td>
      </tr>
      <tr>
        <td style="padding:0 8px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            ${row("공급면적", data.supplyAreaLabel)}
            ${row("전용면적", data.exclusiveAreaLabel)}
            ${row("층수", data.floorLabel)}
            ${row("방 / 욕실", [data.roomsLabel, data.bathsLabel].filter(Boolean).join(" · ") || null)}
            ${row("소재지", data.address)}
            ${row("가격", data.priceLabel)}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 16px 20px;" align="center">
          <a href="${escapeHtml(data.detailUrl)}" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#4f46e5);color:#ffffff;text-decoration:none;font-weight:800;font-size:14px;padding:14px 22px;border-radius:12px;">
            매물 상세정보 및 현장 문의하기
          </a>
        </td>
      </tr>
    </table>
  `;

  return emailShell({
    preheader: `${data.categoryLabel}/${data.dealLabel} · ${data.title} · ${data.priceLabel}`,
    accentFrom: "#1e3a8a",
    accentTo: "#4f46e5",
    bodyInner,
    unsubscribeUrl: data.unsubscribeUrl,
  });
}

export function renderSampleAuctionEmailHtml(data: SampleAuctionEmail = SAMPLE_AUCTION): string {
  const badges = `${badge(data.itemTypeLabel, "#ffedd5", "#c2410c")}&nbsp;${badge(data.statusLabel, "#fef3c7", "#b45309")}${
    data.dDayLabel
      ? `&nbsp;${badge(data.dDayLabel, "#fee2e2", "#b91c1c")}`
      : ""
  }`;
  const imageBlock = data.imageUrl
    ? `<tr><td style="padding:0;">
        <img src="${escapeHtml(data.imageUrl)}" alt="" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;" />
      </td></tr>`
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
          <div style="font-size:18px;font-weight:800;color:#0f172a;letter-spacing:-0.02em;line-height:1.35;">${escapeHtml(data.title)}</div>
          <div style="margin-top:8px;font-size:13px;color:#64748b;">
            사건번호 <strong style="color:#0f172a;">${escapeHtml(data.caseNumber)}</strong>
            ${data.court ? ` · ${escapeHtml(data.court)}` : ""}
          </div>
          <div style="margin-top:14px;display:block;">
            <div style="font-size:12px;color:#94a3b8;">감정가</div>
            <div style="font-size:16px;font-weight:700;color:#475569;text-decoration:line-through;">${escapeHtml(data.appraisalLabel)}</div>
            <div style="margin-top:6px;font-size:12px;color:#94a3b8;">최저매각가격 ${data.discountLabel ? `(${escapeHtml(data.discountLabel)})` : ""}</div>
            <div style="font-size:22px;font-weight:800;color:#b45309;">${escapeHtml(data.minPriceLabel)}</div>
          </div>
          ${
            data.rightsComment
              ? `<div style="margin-top:12px;padding:10px 12px;background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;font-size:13px;color:#9a3412;font-weight:600;">${escapeHtml(data.rightsComment)}</div>`
              : ""
          }
        </td>
      </tr>
      <tr>
        <td style="padding:0 8px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            ${row("사건번호", data.caseNumber)}
            ${row("담당 법원", data.court)}
            ${row("물건 종류", data.itemTypeLabel)}
            ${row("진행 상태", data.statusLabel)}
            ${row("매각기일", data.saleDateLabel ? `${data.saleDateLabel}${data.dDayLabel ? ` (${data.dDayLabel})` : ""}` : null)}
            ${row("소재지", data.address)}
            ${row("면적", [data.landAreaLabel, data.buildingAreaLabel].filter(Boolean).join(" · ") || null)}
            ${row("감정가", data.appraisalLabel)}
            ${row("최저매각가격", `${data.minPriceLabel}${data.discountLabel ? ` · ${data.discountLabel}` : ""}`)}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 16px 20px;" align="center">
          <a href="${escapeHtml(data.detailUrl)}" style="display:inline-block;background:linear-gradient(135deg,#d97706,#ea580c);color:#ffffff;text-decoration:none;font-weight:800;font-size:14px;padding:14px 22px;border-radius:12px;">
            전문 경매대리 상담 신청하기
          </a>
        </td>
      </tr>
    </table>
  `;

  return emailShell({
    preheader: `${data.caseNumber} · ${data.title} · 최저 ${data.minPriceLabel}`,
    accentFrom: "#9a3412",
    accentTo: "#d97706",
    bodyInner,
    unsubscribeUrl: data.unsubscribeUrl,
  });
}
