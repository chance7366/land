import type { ParcelCodes } from "./types";

function pad4(n: string | number): string {
  const digits = String(n ?? "").replace(/\D/g, "");
  if (!digits) return "0000";
  return digits.slice(-4).padStart(4, "0");
}

/** PNU(19) → 시군구·법정동·대지·본번·부번 */
export function parsePnu(pnuRaw: string): ParcelCodes | null {
  const pnu = String(pnuRaw || "").replace(/\D/g, "");
  if (pnu.length !== 19) return null;
  return {
    sigunguCd: pnu.slice(0, 5),
    bjdongCd: pnu.slice(5, 10),
    platGbCd: pnu.slice(10, 11),
    bun: pnu.slice(11, 15),
    ji: pnu.slice(15, 19),
    pnu,
  };
}

export function buildPnu(codes: Omit<ParcelCodes, "pnu">): string {
  return `${codes.sigunguCd}${codes.bjdongCd}${codes.platGbCd}${pad4(codes.bun)}${pad4(codes.ji)}`;
}

export function normalizeParcelCodes(input: {
  sigunguCd?: string;
  bjdongCd?: string;
  platGbCd?: string;
  bun?: string | number;
  ji?: string | number;
  pnu?: string;
}): ParcelCodes | null {
  // 시군구·법정동·본번이 있으면 명시 코드를 우선 (PNU와 동시에 채워진 경우 혼동 방지)
  const sigunguCd = String(input.sigunguCd || "").replace(/\D/g, "");
  const bjdongCd = String(input.bjdongCd || "").replace(/\D/g, "");
  const hasBun = String(input.bun ?? "").replace(/\D/g, "").length > 0;

  if (sigunguCd.length === 5 && bjdongCd.length === 5 && hasBun) {
    const platGbCd = String(input.platGbCd ?? "0").replace(/\D/g, "").slice(0, 1) || "0";
    const bun = pad4(input.bun ?? "0");
    const ji = pad4(input.ji ?? "0");
    const codes = { sigunguCd, bjdongCd, platGbCd, bun, ji };
    return { ...codes, pnu: buildPnu(codes) };
  }

  if (input.pnu) {
    const fromPnu = parsePnu(input.pnu);
    if (fromPnu) return fromPnu;
  }

  if (sigunguCd.length !== 5 || bjdongCd.length !== 5) return null;

  const platGbCd = String(input.platGbCd ?? "0").replace(/\D/g, "").slice(0, 1) || "0";
  const bun = pad4(input.bun ?? "0");
  const ji = pad4(input.ji ?? "0");
  const codes = { sigunguCd, bjdongCd, platGbCd, bun, ji };
  return { ...codes, pnu: buildPnu(codes) };
}

/** YYYYMMDD → YYYY-MM-DD */
export function formatYmd(raw: unknown): string | undefined {
  const s = String(raw ?? "").replace(/\D/g, "");
  if (s.length !== 8) return undefined;
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

/** YYYYMM → YYYY-MM */
export function formatYm(raw: unknown): string | undefined {
  const s = String(raw ?? "").replace(/\D/g, "");
  if (s.length < 6) return undefined;
  return `${s.slice(0, 4)}-${s.slice(4, 6)}`;
}

export function toNumber(raw: unknown): number | undefined {
  if (raw == null || raw === "") return undefined;
  const n = Number(String(raw).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : undefined;
}

export function firstItem<T>(body: unknown): T | null {
  if (!body || typeof body !== "object") return null;
  const items = (body as { items?: unknown }).items;
  if (!items) return null;
  if (Array.isArray(items)) return (items[0] as T) ?? null;
  if (typeof items === "object" && items !== null && "item" in items) {
    const item = (items as { item: T | T[] }).item;
    if (Array.isArray(item)) return item[0] ?? null;
    return item ?? null;
  }
  return null;
}

export function allItems<T>(body: unknown): T[] {
  if (!body || typeof body !== "object") return [];
  const items = (body as { items?: unknown }).items;
  if (!items) return [];
  if (Array.isArray(items)) return items as T[];
  if (typeof items === "object" && items !== null && "item" in items) {
    const item = (items as { item: T | T[] }).item;
    if (Array.isArray(item)) return item;
    return item ? [item] : [];
  }
  return [];
}
