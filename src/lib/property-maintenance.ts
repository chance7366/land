/** 정액 관리비 7대 비목 (국토부 표시·광고) — specs JSON */

export const MAINTENANCE_BREAKDOWN_KEYS = [
  { key: "general", label: "일반(공용)관리비" },
  { key: "water", label: "수도료" },
  { key: "electric", label: "전기료" },
  { key: "gas", label: "가스사용료" },
  { key: "heating", label: "난방비" },
  { key: "internet", label: "인터넷 사용료" },
  { key: "tv", label: "TV 사용료" },
] as const;

export type MaintenanceMode = "NONE" | "ACTUAL" | "FIXED";
export type MaintenanceBreakdownKey = (typeof MAINTENANCE_BREAKDOWN_KEYS)[number]["key"];

export type MaintenanceBreakdown = Partial<
  Record<MaintenanceBreakdownKey, number | null | "ACTUAL">
>;

export const COMPLIANCE_SPEC_KEYS = [
  "maintenanceMode",
  "maintenanceBreakdown",
  "maintenanceBreakdownReason",
  "illegalBuilding",
  "unregisteredBuilding",
  "unregisteredConfirmed",
  "floorDisplayMode",
  "floorBand",
  "actualParking",
  "useApprovalDate",
  "listingAgentName",
  "listingAgentPhone",
  "directionBasis",
  "officialLandPrice",
  "pnu",
] as const;

export function parseMaintenanceMode(specs: Record<string, unknown>): MaintenanceMode {
  const m = specs.maintenanceMode;
  if (m === "NONE" || m === "ACTUAL" || m === "FIXED") return m;
  if (typeof specs.maintenanceBilling === "string") {
    if (specs.maintenanceBilling === "정액") return "FIXED";
    if (specs.maintenanceBilling === "실비") return "ACTUAL";
  }
  return "NONE";
}

export function parseMaintenanceBreakdown(
  specs: Record<string, unknown>,
): MaintenanceBreakdown {
  const raw = specs.maintenanceBreakdown;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return raw as MaintenanceBreakdown;
}

/** maintenanceFee는 만원 단위(기존 컬럼). 10만원 이상이면 비목 필수 */
export function needsMaintenanceBreakdown(
  mode: MaintenanceMode,
  feeManwon: number | null | undefined,
): boolean {
  return mode === "FIXED" && feeManwon != null && feeManwon >= 10;
}

export function validateMaintenanceBreakdown(
  mode: MaintenanceMode,
  feeManwon: number | null | undefined,
  breakdown: MaintenanceBreakdown,
  reason?: string | null,
): string | null {
  if (!needsMaintenanceBreakdown(mode, feeManwon)) return null;
  const missing = MAINTENANCE_BREAKDOWN_KEYS.filter((k) => {
    const v = breakdown[k.key];
    return v === undefined;
  });
  if (missing.length === 0) return null;
  if (reason && String(reason).trim()) return null;
  return `정액 관리비 월 10만원 이상인 경우 7대 비목 금액(또는 미고지 사유)이 필요합니다. (미입력: ${missing.map((m) => m.label).join(", ")})`;
}

export function fixedMaintenanceSumWon(breakdown: MaintenanceBreakdown): number {
  let sum = 0;
  for (const { key } of MAINTENANCE_BREAKDOWN_KEYS) {
    const v = breakdown[key];
    if (typeof v === "number" && Number.isFinite(v) && v > 0) sum += v;
  }
  return sum;
}

export function formatBreakdownAmount(v: number | null | "ACTUAL" | undefined): string {
  if (v === "ACTUAL" || v === null) return "실비";
  if (typeof v === "number") return `${v.toLocaleString("ko-KR")}원`;
  return "—";
}

/** body에서 compliance specs 병합 */
export function mergeComplianceSpecs(
  body: Record<string, unknown>,
  specs: Record<string, unknown>,
): Record<string, unknown> {
  const out = { ...specs };
  for (const key of COMPLIANCE_SPEC_KEYS) {
    if (key in body) out[key] = body[key];
  }
  // maintenanceBreakdown nested object
  if (body.maintenanceBreakdown && typeof body.maintenanceBreakdown === "object") {
    out.maintenanceBreakdown = body.maintenanceBreakdown;
  }
  return out;
}
