/**
 * 미리보기용 — 프로덕션 문구는 `subscription-templates.ts` 와 동일 규격.
 */

export const SAMPLE_OFFICE_TEL = "041-633-0000";

export type SampleSmsPropertyInput = {
  customerName: string;
  title: string;
  dealLabel: string;
  categoryLabel: string;
  addressSummary: string;
  priceLabel: string;
  areaLabel: string | null;
  floorLabel: string | null;
  featureLine: string | null;
  detailUrl: string;
  unsubscribeUrl: string;
};

export type SampleSmsAuctionInput = {
  customerName: string;
  title: string;
  caseNumber: string;
  court: string | null;
  itemTypeLabel: string;
  statusLabel: string;
  addressSummary: string | null;
  appraisalLabel: string;
  minPriceLabel: string;
  dDayLabel: string | null;
  detailUrl: string;
  unsubscribeUrl: string;
};

export const SAMPLE_SMS_PROPERTY: SampleSmsPropertyInput = {
  customerName: "김다은",
  title: "내포신도시 자이 84㎡ 고층 남향",
  dealLabel: "매매",
  categoryLabel: "아파트",
  addressSummary: "홍성군 홍북읍 신경리",
  priceLabel: "3억 8,500만 원",
  areaLabel: "전용 84.9㎡",
  floorLabel: "15/28층",
  featureLine: "남향 · 즉시입주",
  detailUrl: "https://chance.example.com/properties/sample",
  unsubscribeUrl: "https://chance.example.com/unsubscribe?token=sample",
};

export const SAMPLE_SMS_AUCTION: SampleSmsAuctionInput = {
  customerName: "김다은",
  title: "내포자이 1단지 1502호",
  caseNumber: "2024타경10010",
  court: "대전지방법원 홍성지원",
  itemTypeLabel: "아파트",
  statusLabel: "진행중",
  addressSummary: "홍성군 홍북읍 신경리",
  appraisalLabel: "4억 5,000만 원",
  minPriceLabel: "3억 1,500만 원",
  dDayLabel: "D-5",
  detailUrl: "https://chance.example.com/auctions/sample",
  unsubscribeUrl: "https://chance.example.com/unsubscribe?token=sample",
};

/** 문자·알림톡 공통 본문 (LMS / 알림톡 대체문자) */
export function renderSamplePropertySms(data: SampleSmsPropertyInput = SAMPLE_SMS_PROPERTY): string {
  const featureParts = [data.areaLabel, data.floorLabel, data.featureLine].filter(Boolean);
  const featureLine = featureParts.length ? featureParts.join(" | ") : "상세 페이지에서 확인";

  return [
    "[찬스부동산] 관심 매물 등록 안내",
    "",
    `안녕하세요, ${data.customerName}님!`,
    "요청하신 조건의 신규 매물이 등록되었습니다.",
    "",
    `■ 매물명: ${data.title}`,
    `■ 거래/유형: ${data.dealLabel} / ${data.categoryLabel}`,
    `■ 소재지: ${data.addressSummary}`,
    `■ 금액: ${data.priceLabel}`,
    `■ 특징: ${featureLine}`,
    "",
    "▼ 상세 정보 및 현장 안내 문의",
    data.detailUrl,
    "",
    `- 문의: 찬스부동산 (${SAMPLE_OFFICE_TEL})`,
    `- 수신거부: ${data.unsubscribeUrl}`,
  ].join("\n");
}

export function renderSampleAuctionSms(data: SampleSmsAuctionInput = SAMPLE_SMS_AUCTION): string {
  const courtPart = data.court ? ` (${data.court})` : "";
  const minLine = data.dDayLabel
    ? `■ 최저가: ${data.minPriceLabel} (${data.dDayLabel})`
    : `■ 최저가: ${data.minPriceLabel}`;

  return [
    "[찬스부동산] 관심 경매 물건 안내",
    "",
    `안녕하세요, ${data.customerName}님!`,
    "설정하신 조건의 경매 물건 정보를 안내해 드립니다.",
    "",
    `■ 사건번호: ${data.caseNumber}${courtPart}`,
    `■ 물건종류: ${data.itemTypeLabel} [${data.statusLabel}]`,
    `■ 소재지: ${data.addressSummary || "상세 페이지 참고"}`,
    `■ 감정가: ${data.appraisalLabel}`,
    minLine,
    "",
    "▼ 권리분석 및 입찰대리 상담하기",
    data.detailUrl,
    "",
    `- 전문 경매대리인: 찬스부동산 (${SAMPLE_OFFICE_TEL})`,
    `- 수신거부: ${data.unsubscribeUrl}`,
  ].join("\n");
}

/** Solapi/카카오 검수용 알림톡 템플릿 원문 (변수 포함) */
export function samplePropertyKakaoTemplateDraft(): string {
  return [
    "[찬스부동산] 관심 매물 등록 안내",
    "",
    "안녕하세요, #{고객명}님!",
    "요청하신 조건의 신규 매물이 등록되었습니다.",
    "",
    "■ 매물명: #{매물명}",
    "■ 거래/유형: #{거래유형} / #{매물유형}",
    "■ 소재지: #{소재지}",
    "■ 금액: #{금액}",
    "■ 특징: #{특징}",
    "",
    "▼ 상세 정보 및 현장 안내 문의",
    "#{링크}",
    "",
    "- 문의: 찬스부동산 (#{문의전화})",
    "- 수신거부: #{수신거부}",
  ].join("\n");
}

export function sampleAuctionKakaoTemplateDraft(): string {
  return [
    "[찬스부동산] 관심 경매 물건 안내",
    "",
    "안녕하세요, #{고객명}님!",
    "설정하신 조건의 경매 물건 정보를 안내해 드립니다.",
    "",
    "■ 사건번호: #{사건번호} (#{담당법원})",
    "■ 물건종류: #{물건유형} [#{진행상태}]",
    "■ 소재지: #{소재지}",
    "■ 감정가: #{감정가}",
    "■ 최저가: #{최저가} (#{DDay})",
    "",
    "▼ 권리분석 및 입찰대리 상담하기",
    "#{링크}",
    "",
    "- 전문 경매대리인: 찬스부동산 (#{문의전화})",
    "- 수신거부: #{수신거부}",
  ].join("\n");
}

/** 프로덕션 이식 시 Solapi variables 키 (샘플 규격) */
export const SAMPLE_KAKAO_PROPERTY_VARS = [
  "#{고객명}",
  "#{매물명}",
  "#{거래유형}",
  "#{매물유형}",
  "#{소재지}",
  "#{금액}",
  "#{특징}",
  "#{링크}",
  "#{문의전화}",
  "#{수신거부}",
] as const;

export const SAMPLE_KAKAO_AUCTION_VARS = [
  "#{고객명}",
  "#{사건번호}",
  "#{담당법원}",
  "#{물건유형}",
  "#{진행상태}",
  "#{소재지}",
  "#{감정가}",
  "#{최저가}",
  "#{DDay}",
  "#{링크}",
  "#{문의전화}",
  "#{수신거부}",
] as const;

export function smsLengthInfo(text: string): { chars: number; kind: "SMS" | "LMS" } {
  const chars = [...text].length;
  return { chars, kind: chars > 90 ? "LMS" : "SMS" };
}
