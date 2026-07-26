export type FlyerKind = "SALE" | "LEASE" | "AUCTION";

export type FlyerViewModel = {
  kind: FlyerKind;
  badge: string;
  title: string;
  subtitle: string;
  priceLine: string;
  /** 경매: 법원·사건번호 한 줄 */
  metaLine?: string;
  publicPath: string;
  images: string[];
  specs: [string, string][];
  insightTitle: string;
  insight: string;
  /** soft gate용 미기재 라벨 */
  missingLabels: string[];
  footerDisclaimer?: string;
};
