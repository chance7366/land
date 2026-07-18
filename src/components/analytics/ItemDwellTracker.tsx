"use client";

import { useEffect, useRef } from "react";
import { trackBrowserEvent } from "@/lib/analytics/track";

/** 상세 선택 후 30초 이상 체류 시 item_dwell 1회 기록 */
export function ItemDwellTracker({
  targetType,
  targetId,
  menuKey,
}: {
  targetType: "property" | "auction";
  targetId: string | null;
  menuKey: "properties" | "auctions";
}) {
  const fired = useRef<string | null>(null);

  useEffect(() => {
    if (!targetId) return;
    fired.current = null;
    const started = Date.now();
    const timer = window.setTimeout(() => {
      if (fired.current === targetId) return;
      fired.current = targetId;
      trackBrowserEvent({
        eventType: "item_dwell",
        menuKey,
        targetType,
        targetId,
        metadata: { dwellMs: Date.now() - started, thresholdSec: 30 },
      });
    }, 30_000);
    return () => window.clearTimeout(timer);
  }, [targetId, targetType, menuKey]);

  return null;
}
