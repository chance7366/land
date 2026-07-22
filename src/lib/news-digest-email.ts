/**
 * 부동산소식 일일 메일 리포트 HTML (사용자 /news 목록과 동일한 정보 구조).
 */

import {
  getNewsFeedSourceMeta,
  isNewsFeedSourceId,
  type NewsFeedSourceId,
} from "@/lib/news-feed";
import type { NewsDigestSourceId } from "@/lib/subscription";
import { NEWS_ALERT_SOURCES } from "@/lib/subscription";

export type DigestNewsItem = {
  id: string;
  source: string;
  sourceName: string;
  title: string;
  summary?: string | null;
  press?: string | null;
  originUrl: string;
  pubDate: Date | string;
};

function appBaseUrl(): string {
  return (process.env.APP_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Asia/Seoul 달력일 YYYY-MM-DD */
export function seoulDateKey(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** 표시용 YYYY.MM.DD (KST) */
export function seoulDateLabel(now = new Date()): string {
  return seoulDateKey(now).replace(/-/g, ".");
}

export function dateKeyInSeoul(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return seoulDateKey(d);
}

function sourceLabel(source: string): string {
  if (isNewsFeedSourceId(source)) return getNewsFeedSourceMeta(source).shortLabel;
  return NEWS_ALERT_SOURCES.find((s) => s.value === source)?.label ?? source;
}

function badgeColors(source: string): { bg: string; color: string; border: string } {
  switch (source as NewsFeedSourceId) {
    case "naver":
      return { bg: "#064e3b33", color: "#6ee7b7", border: "#34d39966" };
    case "r114":
      return { bg: "#701a7533", color: "#f0abfc", border: "#e879f966" };
    case "rtech":
      return { bg: "#4c1d9533", color: "#c4b5fd", border: "#a78bfa66" };
    default:
      return { bg: "#ffffff14", color: "#cbd5e1", border: "#ffffff22" };
  }
}

function formatPub(value: Date | string): string {
  const key = dateKeyInSeoul(value);
  return key ? key.replace(/-/g, ".") : "";
}

export function buildNewsDigestEmail(options: {
  dateKey: string;
  items: DigestNewsItem[];
  sources: NewsDigestSourceId[];
  unsubscribeToken: string;
}): { subject: string; html: string; text: string } {
  const dateLabel = options.dateKey.replace(/-/g, ".");
  const bySource = new Map<string, DigestNewsItem[]>();
  for (const src of options.sources) {
    bySource.set(src, []);
  }
  for (const item of options.items) {
    const list = bySource.get(item.source);
    if (list) list.push(item);
  }

  const total = options.items.length;
  const subject = `[찬스부동산] ${dateLabel} 부동산소식 ${total.toLocaleString("ko-KR")}건`;
  const newsUrl = `${appBaseUrl()}/news`;
  const unsub = `${appBaseUrl()}/unsubscribe?token=${encodeURIComponent(options.unsubscribeToken)}`;

  const sections = options.sources
    .map((src) => {
      const rows = bySource.get(src) ?? [];
      const label = NEWS_ALERT_SOURCES.find((s) => s.value === src)?.label ?? src;
      const colors = badgeColors(src);
      const body =
        rows.length === 0
          ? `<p style="margin:0;padding:12px 0;font-size:13px;color:#94a3b8;">당일 등록 소식이 없습니다.</p>`
          : rows
              .map((row) => {
                const summary = (row.summary || "").trim();
                const press =
                  src === "r114" && row.press?.trim()
                    ? escapeHtml(row.press.trim())
                    : null;
                return `
              <tr>
                <td style="padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.08);">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:72px;vertical-align:top;padding-right:10px;">
                        <span style="display:inline-block;padding:4px 8px;border-radius:999px;border:1px solid ${colors.border};background:${colors.bg};color:${colors.color};font-size:11px;font-weight:700;white-space:nowrap;">${press ?? escapeHtml(sourceLabel(src))}</span>
                      </td>
                      <td style="vertical-align:top;">
                        <a href="${escapeHtml(row.originUrl)}" style="display:block;text-decoration:none;color:#ffffff;font-size:14px;font-weight:700;line-height:1.45;">${escapeHtml(row.title)}</a>
                        ${
                          summary
                            ? `<div style="margin-top:6px;font-size:12px;line-height:1.55;color:#94a3b8;">${escapeHtml(summary)}</div>`
                            : ""
                        }
                        <div style="margin-top:8px;font-size:11px;color:#64748b;">
                          ${row.press && src !== "r114" ? `${escapeHtml(row.press)} · ` : ""}${escapeHtml(formatPub(row.pubDate))}
                          &nbsp;·&nbsp;
                          <a href="${escapeHtml(row.originUrl)}" style="color:#e9d5ff;text-decoration:underline;">원문보기</a>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>`;
              })
              .join("");

      return `
        <tr>
          <td style="padding:20px 0 8px;">
            <div style="font-size:13px;font-weight:800;color:#e9d5ff;letter-spacing:-0.01em;">${escapeHtml(label)} <span style="color:#64748b;font-weight:600;">(${rows.length})</span></div>
          </td>
        </tr>
        <tr>
          <td>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${body}</table>
          </td>
        </tr>`;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#0B0F19;font-family:'Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR',Arial,sans-serif;color:#e2e8f0;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(dateLabel)} 부동산소식 ${total}건 요약</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0B0F19;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#14121c;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.12);">
          <tr>
            <td style="background:linear-gradient(135deg,#d450ff,#4dabff);padding:22px 24px;color:#ffffff;">
              <div style="font-size:12px;opacity:0.9;letter-spacing:0.04em;">CHANCE REAL ESTATE &amp; AUCTION</div>
              <div style="margin-top:6px;font-size:20px;font-weight:800;">부동산소식 일일 리포트</div>
              <div style="margin-top:4px;font-size:13px;opacity:0.92;">${escapeHtml(dateLabel)} · 총 ${total.toLocaleString("ko-KR")}건</div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 4px;font-size:13px;color:#94a3b8;">
              네이버뉴스 · 부동산114 · 부동산테크 중 신청하신 출처의 당일 소식을 정리했습니다.
            </td>
          </tr>
          <tr>
            <td style="padding:4px 24px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${sections}</table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 28px;" align="center">
              <a href="${escapeHtml(newsUrl)}" style="display:inline-block;padding:12px 22px;border-radius:12px;background:linear-gradient(90deg,#d450ff,#4dabff);color:#ffffff;font-size:13px;font-weight:800;text-decoration:none;">부동산 소식 전체 보기</a>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 24px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;line-height:1.7;color:#64748b;text-align:center;">
              찬스부동산 공인중개사사무소 · 문의 041-633-0000<br />
              <a href="${escapeHtml(unsub)}" style="color:#94a3b8;text-decoration:underline;">수신거부 / 알림해제</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const textLines = [
    `찬스부동산 부동산소식 ${dateLabel}`,
    `총 ${total}건`,
    "",
  ];
  for (const src of options.sources) {
    const rows = bySource.get(src) ?? [];
    const label = NEWS_ALERT_SOURCES.find((s) => s.value === src)?.label ?? src;
    textLines.push(`[${label}] ${rows.length}건`);
    for (const row of rows) {
      textLines.push(`- ${row.title}`);
      if (row.summary?.trim()) textLines.push(`  ${row.summary.trim()}`);
      textLines.push(`  ${row.originUrl}`);
    }
    textLines.push("");
  }
  textLines.push(`전체 보기: ${newsUrl}`);
  textLines.push(`수신거부: ${unsub}`);

  return { subject, html, text: textLines.join("\n") };
}
