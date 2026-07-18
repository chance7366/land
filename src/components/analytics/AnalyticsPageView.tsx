"use client";

import { useEffect } from "react";
import { trackBrowserEvent } from "@/lib/analytics/track";
import type { AnalyticsMenuKey } from "@/lib/analytics/types";

export function AnalyticsPageView({ menuKey }: { menuKey: AnalyticsMenuKey }) {
  useEffect(() => {
    trackBrowserEvent({ eventType: "page_view", menuKey });
  }, [menuKey]);
  return null;
}
