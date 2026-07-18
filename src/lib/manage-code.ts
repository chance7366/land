import { prisma } from "@/lib/prisma";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { allocateNextManageCodeSupabase } from "@/lib/supabase/repos/admin-catalog";

export type ManageCodeKind = "PROPERTY" | "AUCTION";

export const MANAGE_CODE_PREFIX: Record<ManageCodeKind, string> = {
  PROPERTY: "매물",
  AUCTION: "경매",
};

export function formatManageCode(kind: ManageCodeKind, seq: number): string {
  const n = Math.max(1, Math.floor(seq));
  return `${MANAGE_CODE_PREFIX[kind]}_${String(n).padStart(8, "0")}`;
}

export function parseManageCodeSeq(code: string | null | undefined, kind: ManageCodeKind): number | null {
  if (!code) return null;
  const prefix = MANAGE_CODE_PREFIX[kind];
  const m = new RegExp(`^${prefix}_(\\d{1,8})$`).exec(code.trim());
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function maxSeq(kind: ManageCodeKind): Promise<number> {
  const prefix = MANAGE_CODE_PREFIX[kind];
  if (kind === "PROPERTY") {
    const rows = await prisma.property.findMany({
      select: { manageCode: true },
      where: { manageCode: { startsWith: `${prefix}_` } },
    });
    let max = 0;
    for (const row of rows) {
      const n = parseManageCodeSeq(row.manageCode, kind);
      if (n != null && n > max) max = n;
    }
    return max;
  }
  const rows = await prisma.auction.findMany({
    select: { manageCode: true },
    where: { manageCode: { startsWith: `${prefix}_` } },
  });
  let max = 0;
  for (const row of rows) {
    const n = parseManageCodeSeq(row.manageCode, kind);
    if (n != null && n > max) max = n;
  }
  return max;
}

/** 다음 관리코드 발급 (매물_00000001 / 경매_00000001) */
export async function allocateNextManageCode(kind: ManageCodeKind): Promise<string> {
  if (isSupabaseEnabled()) {
    return allocateNextManageCodeSupabase(kind);
  }
  const next = (await maxSeq(kind)) + 1;
  return formatManageCode(kind, next);
}

export type ManageCodeConflictAction = "overwrite" | "create_new";

export function parseConflictAction(raw: unknown): ManageCodeConflictAction | null {
  if (raw === "overwrite" || raw === "create_new") return raw;
  return null;
}

/** 기존 데이터에 관리코드가 없거나 형식이 아니면 00000001부터 부여 */
export async function backfillManageCodes(): Promise<{ properties: number; auctions: number }> {
  const properties = await prisma.property.findMany({
    select: { id: true, manageCode: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  let pSeq = 0;
  for (const row of properties) {
    const existing = parseManageCodeSeq(row.manageCode, "PROPERTY");
    if (existing != null) {
      if (existing > pSeq) pSeq = existing;
      continue;
    }
    pSeq += 1;
    await prisma.property.update({
      where: { id: row.id },
      data: { manageCode: formatManageCode("PROPERTY", pSeq) },
    });
  }

  const auctions = await prisma.auction.findMany({
    select: { id: true, manageCode: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  let aSeq = 0;
  for (const row of auctions) {
    const existing = parseManageCodeSeq(row.manageCode, "AUCTION");
    if (existing != null) {
      if (existing > aSeq) aSeq = existing;
      continue;
    }
    aSeq += 1;
    await prisma.auction.update({
      where: { id: row.id },
      data: { manageCode: formatManageCode("AUCTION", aSeq) },
    });
  }

  return { properties: pSeq, auctions: aSeq };
}
