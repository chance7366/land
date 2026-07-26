import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { BuildingLedgerFields, LandLedgerFields, LedgerBundle } from "./types";

export type LedgerOwnerType = "property" | "auction";

export async function persistLedgerSnapshots(args: {
  ownerType: LedgerOwnerType;
  ownerId: string;
  bundle: LedgerBundle;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const sb = createSupabaseAdminClient();
    const fetchedAt = new Date().toISOString();

    await sb
      .from("building_ledgers")
      .delete()
      .eq("owner_type", args.ownerType)
      .eq("owner_id", args.ownerId);
    await sb
      .from("land_ledgers")
      .delete()
      .eq("owner_type", args.ownerType)
      .eq("owner_id", args.ownerId);

    const buildingRows: Record<string, unknown>[] = [];
    const pushBuilding = (
      kind: string,
      fields: BuildingLedgerFields | undefined,
      raw: unknown,
    ) => {
      if (!fields) return;
      buildingRows.push({
        owner_type: args.ownerType,
        owner_id: args.ownerId,
        kind,
        mgm_bldrgst_pk: fields.mgmBldrgstPk ?? null,
        dong_nm: fields.dongNm ?? null,
        ho_nm: fields.hoNm ?? null,
        building_name: fields.buildingName ?? null,
        building_use: fields.buildingUse ?? null,
        structure_type: fields.structureType ?? null,
        exclusive_area: fields.exclusiveArea ?? null,
        common_area: fields.commonArea ?? null,
        supply_area: fields.supplyArea ?? null,
        total_floor_area: fields.totalFloorArea ?? null,
        arch_area: fields.archArea ?? null,
        land_share_area: fields.landShareArea ?? null,
        total_floors: fields.totalFloors ?? null,
        underground_floors: fields.undergroundFloors ?? null,
        floor: fields.floor ?? null,
        floor_nm: fields.floorNm ?? null,
        height: fields.height ?? null,
        elevator_cnt: fields.elevatorCnt ?? null,
        total_parking: fields.totalParking ?? null,
        bc_rat: fields.bcRat ?? null,
        vl_rat: fields.vlRat ?? null,
        hhld_cnt: fields.hhldCnt ?? null,
        use_approval_date: fields.useApprovalDate ?? null,
        seismic_design: fields.seismicDesign ?? null,
        house_price: fields.housePrice ?? null,
        house_price_std_day: fields.housePriceStdDay ?? null,
        etc_purps: fields.etcPurps ?? null,
        road_address: fields.roadAddress ?? null,
        plat_plc: fields.platPlc ?? null,
        details_json: fields,
        raw_json: raw ?? fields,
        source: "BldRgstHub",
        fetched_at: fetchedAt,
      });
    };

    const rawByKind = new Map(
      (args.bundle.rawSnapshots ?? []).map((s) => [s.kind, s.raw]),
    );
    pushBuilding("basis", args.bundle.basis, rawByKind.get("basis"));
    pushBuilding("recap", args.bundle.recap, rawByKind.get("recap"));
    pushBuilding("title", args.bundle.title, rawByKind.get("title"));
    pushBuilding("expos", args.bundle.expos, rawByKind.get("expos"));

    if (buildingRows.length) {
      const { error } = await sb.from("building_ledgers").insert(buildingRows);
      if (error) return { ok: false, error: error.message };
    }

    if (args.bundle.land) {
      const land: LandLedgerFields = args.bundle.land;
      const { error } = await sb.from("land_ledgers").insert({
        owner_type: args.ownerType,
        owner_id: args.ownerId,
        pnu: land.pnu ?? args.bundle.pnu ?? null,
        land_category: land.landCategory ?? null,
        land_category_code: land.landCategoryCode ?? null,
        land_area: land.exclusiveArea ?? null,
        zoning: land.zoning ?? null,
        zoning2: land.zoning2 ?? null,
        road_access: land.roadAccess ?? null,
        terrain: land.terrain ?? null,
        land_shape: land.landShape ?? null,
        land_use_status: land.landUseStatus ?? null,
        official_land_price: land.officialLandPrice ?? null,
        price_std_year: land.priceStdYear ?? null,
        plat_plc: land.platPlc ?? null,
        details_json: land,
        raw_json: rawByKind.get("land") ?? land,
        source: "VWorld",
        fetched_at: fetchedAt,
      });
      if (error) return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "대장 스냅샷 저장 실패",
    };
  }
}
