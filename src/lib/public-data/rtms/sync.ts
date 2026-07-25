import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { fetchRtmsMonth } from "./fetch-rtms";
import type { CoverageStatus, NormalizedRtmsRow, RtmsDealType, RtmsPropertyType } from "./types";

export function ymToInt(ym: string): number {
  return Number(ym.replace("-", ""));
}

export function intToYm(n: number): string {
  const s = String(n);
  return `${s.slice(0, 4)}-${s.slice(4)}`;
}

export function listYmBetween(startYm: string, endYm: string): string[] {
  const out: string[] = [];
  let [y, m] = startYm.split("-").map(Number);
  const [ey, em] = endYm.split("-").map(Number);
  if (y * 100 + m > ey * 100 + em) return out;
  while (y < ey || (y === ey && m <= em)) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return out;
}

function normalizeCancelDate(raw: string | null): string | null {
  if (!raw) return null;
  const m = String(raw).trim().match(/(\d{2,4})[.\-/](\d{1,2})[.\-/](\d{1,2})/);
  if (!m) return null;
  const y = m[1].length === 2 ? `20${m[1]}` : m[1];
  return `${y}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
}

function rowToDb(r: NormalizedRtmsRow) {
  return {
    property_type: r.propertyType,
    transaction_type: r.transactionType,
    lawd_cd: r.lawdCd,
    deal_ymd: r.dealYmd,
    deal_date: r.dealDate,
    building_name: r.buildingName || "",
    jibun: r.jibun || "",
    road_name: r.roadName || "",
    umd_nm: r.umdNm || "",
    floor: r.floor || "",
    excl_area: r.exclArea ?? 0,
    land_area: r.landArea ?? 0,
    build_year: r.buildYear,
    deal_amount: r.dealAmount,
    deposit_amount: r.depositAmount,
    monthly_rent: r.monthlyRent,
    price_per_sqm: r.pricePerSqm,
    cancelled: r.cancelled,
    cancel_date: normalizeCancelDate(r.cancelDate),
    dealing_gbn: r.dealingGbn || "",
    raw_details: r.rawDetails,
    updated_at: new Date().toISOString(),
  };
}

function dedupeRows(rows: NormalizedRtmsRow[]): NormalizedRtmsRow[] {
  const map = new Map<string, NormalizedRtmsRow>();
  for (const r of rows) {
    const k = [
      r.propertyType,
      r.transactionType,
      r.lawdCd,
      r.dealDate,
      r.buildingName || "",
      r.jibun || "",
      r.floor || "",
      r.exclArea ?? 0,
      r.dealAmount,
      r.depositAmount,
    ].join("|");
    map.set(k, r);
  }
  return [...map.values()];
}

export async function upsertTransactions(rows: NormalizedRtmsRow[]): Promise<number> {
  const unique = dedupeRows(rows);
  if (unique.length === 0) return 0;
  const sb = createSupabaseAdminClient();
  const chunk = 200;
  let n = 0;
  for (let i = 0; i < unique.length; i += chunk) {
    const part = unique.slice(i, i + chunk).map(rowToDb);
    const { error, count } = await sb
      .from("real_estate_transactions")
      .upsert(part, {
        onConflict:
          "property_type,transaction_type,lawd_cd,deal_date,building_name,jibun,floor,excl_area,deal_amount,deposit_amount",
        count: "exact",
      });
    if (error) throw new Error(error.message);
    n += count ?? part.length;
  }
  return n;
}

export async function upsertCoverage(args: {
  lawdCd: string;
  propertyType: RtmsPropertyType;
  dealType: RtmsDealType;
  dealYmd: number;
  status: CoverageStatus;
  rowCount: number;
}) {
  const sb = createSupabaseAdminClient();
  const { error } = await sb.from("real_estate_sync_coverage").upsert(
    {
      lawd_cd: args.lawdCd,
      property_type: args.propertyType,
      transaction_type: args.dealType,
      deal_ymd: args.dealYmd,
      status: args.status,
      row_count: args.rowCount,
      last_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "lawd_cd,property_type,transaction_type,deal_ymd" },
  );
  if (error) throw new Error(error.message);
}

export type SyncSlot = {
  lawdCd: string;
  propertyType: RtmsPropertyType;
  dealType: RtmsDealType;
  dealYm: string;
};

export async function runGapSync(args: {
  lawdCds: string[];
  propertyTypes: RtmsPropertyType[];
  dealTypes: RtmsDealType[];
  startYm: string;
  endYm: string;
  gapOnly: boolean;
  regionLabel?: string;
}): Promise<{
  slotsTotal: number;
  slotsOk: number;
  rowsUpserted: number;
  errors: string[];
  runId: string;
}> {
  const sb = createSupabaseAdminClient();
  const months = listYmBetween(args.startYm, args.endYm);
  const slots: SyncSlot[] = [];

  for (const lawdCd of args.lawdCds) {
    for (const propertyType of args.propertyTypes) {
      for (const dealType of args.dealTypes) {
        if (dealType === "RIGHT" && propertyType !== "APT") continue;
        for (const dealYm of months) {
          slots.push({ lawdCd, propertyType, dealType, dealYm });
        }
      }
    }
  }

  let work = slots;
  if (args.gapOnly && slots.length > 0) {
    const { data: cov } = await sb
      .from("real_estate_sync_coverage")
      .select("lawd_cd,property_type,transaction_type,deal_ymd,status")
      .in("lawd_cd", args.lawdCds)
      .gte("deal_ymd", ymToInt(args.startYm))
      .lte("deal_ymd", ymToInt(args.endYm));

    const collected = new Set(
      (cov ?? [])
        .filter((c) => c.status === "collected" || c.status === "empty")
        .map(
          (c) =>
            `${c.lawd_cd}|${c.property_type}|${c.transaction_type}|${c.deal_ymd}`,
        ),
    );
    work = slots.filter((s) => {
      const key = `${s.lawdCd}|${s.propertyType}|${s.dealType}|${ymToInt(s.dealYm)}`;
      return !collected.has(key);
    });
  }

  const { data: run, error: runErr } = await sb
    .from("real_estate_sync_runs")
    .insert({
      start_ymd: ymToInt(args.startYm),
      end_ymd: ymToInt(args.endYm),
      region_label: args.regionLabel || args.lawdCds.join(","),
      types_label: `${args.propertyTypes.join("/")}/${args.dealTypes.join("/")}`,
      gap_only: args.gapOnly,
      slots_total: work.length,
      status: "running",
    })
    .select("id")
    .single();
  if (runErr || !run) throw new Error(runErr?.message || "sync_runs 생성 실패");

  let slotsOk = 0;
  let rowsUpserted = 0;
  const errors: string[] = [];

  for (const slot of work) {
    try {
      const { rows, error } = await fetchRtmsMonth({
        propertyType: slot.propertyType,
        dealType: slot.dealType,
        lawdCd: slot.lawdCd,
        dealYmd: ymToInt(slot.dealYm),
      });
      if (error) {
        errors.push(`${slot.lawdCd} ${slot.dealYm} ${slot.propertyType}/${slot.dealType}: ${error}`);
        continue;
      }
      const n = await upsertTransactions(rows);
      rowsUpserted += n;
      await upsertCoverage({
        lawdCd: slot.lawdCd,
        propertyType: slot.propertyType,
        dealType: slot.dealType,
        dealYmd: ymToInt(slot.dealYm),
        status: rows.length === 0 ? "empty" : "collected",
        rowCount: rows.length,
      });
      slotsOk += 1;
    } catch (e) {
      errors.push(
        `${slot.lawdCd} ${slot.dealYm}: ${e instanceof Error ? e.message : "오류"}`,
      );
    }
  }

  await sb
    .from("real_estate_sync_runs")
    .update({
      finished_at: new Date().toISOString(),
      slots_ok: slotsOk,
      rows_upserted: rowsUpserted,
      status: errors.length && slotsOk === 0 ? "error" : "success",
      error_message: errors.slice(0, 5).join(" | ") || null,
      details: { errors: errors.slice(0, 30) },
    })
    .eq("id", run.id);

  return {
    slotsTotal: work.length,
    slotsOk,
    rowsUpserted,
    errors,
    runId: run.id,
  };
}
