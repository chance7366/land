import type { AnalyticsPayload } from "@/lib/analytics/types";

/** 브라우저에서 분석 이벤트 전송 (실패해도 UI에 영향 없음) */
export function trackBrowserEvent(payload: AnalyticsPayload) {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({
      eventType: payload.eventType,
      path: payload.path ?? window.location.pathname,
      menuKey: payload.menuKey,
      targetType: payload.targetType ?? null,
      targetId: payload.targetId ?? null,
      metadata: {
        ...(payload.metadata ?? {}),
        ref:
          typeof payload.metadata?.ref === "string"
            ? payload.metadata.ref
            : new URLSearchParams(window.location.search).get("ref") ?? undefined,
        href: window.location.href,
      },
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/event", blob);
      return;
    }

    void fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore
  }
}
