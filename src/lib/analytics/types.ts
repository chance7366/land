export type AnalyticsEventType =
  | "page_view"
  | "item_click"
  | "item_dwell"
  | "cta_click"
  | "search"
  | "share_action";

export type AnalyticsMenuKey =
  | "home"
  | "properties"
  | "auctions"
  | "news"
  | "legal"
  | "success_stories"
  | "profile"
  | "location"
  | "consultation"
  | "other";

export type AnalyticsPayload = {
  eventType: AnalyticsEventType;
  path?: string;
  menuKey?: AnalyticsMenuKey | string;
  targetType?: "property" | "auction" | null;
  targetId?: string | null;
  metadata?: Record<string, unknown>;
};
