/** 부당 표시·광고 우려 문구 린터 (경고) */

const WARN_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /최저가\s*보장/, label: "최저가 보장" },
  { re: /무조건\s*수익/, label: "무조건 수익" },
  { re: /확정\s*수익/, label: "확정 수익" },
  { re: /원금\s*보장/, label: "원금 보장" },
  { re: /투자\s*보장/, label: "투자 보장" },
  { re: /대박/, label: "대박" },
];

export function lintPropertyAdCopy(text: string): string[] {
  if (!text?.trim()) return [];
  const hits: string[] = [];
  for (const { re, label } of WARN_PATTERNS) {
    if (re.test(text)) hits.push(label);
  }
  return hits;
}
