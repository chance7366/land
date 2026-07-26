import {
  aggregateExposAreas,
  fetchBrBasisItems,
  fetchBrExposAreaForUnit,
  fetchBrExposUnit,
  fetchBrFlrItems,
  fetchBrHsprcForUnit,
  fetchBrJijiguItems,
  fetchBrRecapItems,
  fetchBrTitleItems,
  mapBrItem,
  mapFloorRows,
  mapJijiguRows,
} from "./building-ledger";
import { fetchLandLedger, resolvePnuFromAddress } from "./land-ledger";
import { matchDongLabel, normalizeDongHo } from "./ledger-kind";
import { normalizeParcelCodes, parsePnu } from "./parcel";
import type {
  BuildingLedgerFields,
  LedgerBundle,
  LedgerCandidate,
  LedgerKind,
  LedgerLookupError,
  LedgerLookupSuccess,
  ParcelCodes,
} from "./types";

export type LedgerLookupInput = {
  ledgerKind: LedgerKind;
  address?: string;
  pnu?: string;
  sigunguCd?: string;
  bjdongCd?: string;
  platGbCd?: string;
  bun?: string | number;
  ji?: string | number;
  dong?: string;
  ho?: string;
  selectedMgmPk?: string;
  selectedDong?: string;
  selectedHo?: string;
  skipLand?: boolean;
};

async function resolveCodes(input: LedgerLookupInput): Promise<
  | { codes: ParcelCodes; pnu?: string; warnings: string[] }
  | LedgerLookupError
> {
  const warnings: string[] = [];
  let codes = normalizeParcelCodes({
    sigunguCd: input.sigunguCd,
    bjdongCd: input.bjdongCd,
    platGbCd: input.platGbCd,
    bun: input.bun,
    ji: input.ji,
    pnu: input.pnu,
  });

  if (!codes && input.address?.trim()) {
    const resolved = await resolvePnuFromAddress(input.address.trim());
    if ("ok" in resolved && resolved.ok === false) {
      return resolved;
    }
    if ("pnu" in resolved) {
      codes = parsePnu(resolved.pnu);
      if (!codes) {
        return {
          ok: false,
          code: "BAD_REQUEST",
          error: "주소에서 PNU를 얻었으나 분해에 실패했습니다.",
        };
      }
      warnings.push(`주소→PNU 자동해석: ${resolved.pnu}`);
    }
  }

  if (!codes) {
    return {
      ok: false,
      code: "BAD_REQUEST",
      error:
        "시군구·법정동·본번 또는 PNU 19자리, 또는 조회 가능한 지번 주소가 필요합니다.",
    };
  }

  return { codes, pnu: codes.pnu, warnings };
}

/** 전유 우선 합성: expos > title > recap > basis (면적·동호·층은 전유만) */
function mergeExposFirst(parts: {
  expos?: BuildingLedgerFields;
  title?: BuildingLedgerFields;
  recap?: BuildingLedgerFields;
  basis?: BuildingLedgerFields;
}): BuildingLedgerFields {
  const { expos, title, recap, basis } = parts;
  const out: BuildingLedgerFields = {};

  // 1) 단지/동 배경 (총괄·표제·기본개요)
  for (const p of [basis, recap, title]) {
    if (!p) continue;
    for (const [k, v] of Object.entries(p) as [keyof BuildingLedgerFields, unknown][]) {
      if (v === undefined || v === "" || v == null) continue;
      if (
        k === "exclusiveArea" ||
        k === "supplyArea" ||
        k === "commonArea" ||
        k === "dongNm" ||
        k === "hoNm" ||
        k === "floor" ||
        k === "floorNm" ||
        k === "exposAreaRows" ||
        k === "housePrice" ||
        k === "housePriceStdDay"
      ) {
        continue; // 전유 전용
      }
      if (out[k] == null) (out as Record<string, unknown>)[k] = v;
    }
  }

  // 2) 전유가 최우선 — 호 단위 핵심
  if (expos) {
    out.dongNm = expos.dongNm ?? out.dongNm;
    out.hoNm = expos.hoNm ?? out.hoNm;
    out.floor = expos.floor ?? out.floor;
    out.floorNm = expos.floorNm ?? out.floorNm;
    out.flrGbNm = expos.flrGbNm ?? out.flrGbNm;
    out.exclusiveArea = expos.exclusiveArea;
    out.commonArea = expos.commonArea;
    out.supplyArea = expos.supplyArea;
    out.exposAreaRows = expos.exposAreaRows;
    out.housePrice = expos.housePrice;
    out.housePriceStdDay = expos.housePriceStdDay;
    out.mgmBldrgstPk = expos.mgmBldrgstPk ?? out.mgmBldrgstPk;
    out.regstrKindCdNm = expos.regstrKindCdNm ?? out.regstrKindCdNm;
    out.crtnDay = expos.crtnDay ?? out.crtnDay;
    if (expos.buildingName) out.buildingName = expos.buildingName;
    if (expos.buildingUse) out.buildingUse = expos.buildingUse;
    if (expos.etcPurps) out.etcPurps = expos.etcPurps;
    if (expos.structureType) out.structureType = expos.structureType;
    if (expos.etcStrct) out.etcStrct = expos.etcStrct;
    if (expos.mainAtchGbCdNm) out.mainAtchGbCdNm = expos.mainAtchGbCdNm;
    if (expos.floorRows?.length) out.floorRows = expos.floorRows;
    if (expos.jijiguRows?.length) out.jijiguRows = expos.jijiguRows;
    if (expos.extras) {
      out.extras = { ...(out.extras ?? {}), ...expos.extras };
    }
  }

  // 단지 스펙은 총괄이 있으면 덮어씀
  if (recap) {
    if (recap.totalParking != null) out.totalParking = recap.totalParking;
    if (recap.indoorParking != null) out.indoorParking = recap.indoorParking;
    if (recap.outdoorParking != null) out.outdoorParking = recap.outdoorParking;
    if (recap.landShareArea != null) out.landShareArea = recap.landShareArea;
    if (recap.bcRat != null) out.bcRat = recap.bcRat;
    if (recap.vlRat != null) out.vlRat = recap.vlRat;
    if (recap.vlRatEstmTotArea != null) out.vlRatEstmTotArea = recap.vlRatEstmTotArea;
    if (recap.hhldCnt != null) out.hhldCnt = recap.hhldCnt;
    if (recap.mainBldCnt != null) out.mainBldCnt = recap.mainBldCnt;
    if (recap.totalFloorArea != null) out.totalFloorArea = recap.totalFloorArea;
    if (recap.archArea != null) out.archArea = recap.archArea;
  }

  // 동 표제: 층수·구조·높이·승강기
  if (title) {
    if (title.totalFloors != null) out.totalFloors = title.totalFloors;
    if (title.undergroundFloors != null) out.undergroundFloors = title.undergroundFloors;
    if (title.structureType) out.structureType = title.structureType;
    if (title.height != null) out.height = title.height;
    if (title.elevatorCnt != null) out.elevatorCnt = title.elevatorCnt;
    if (title.seismicDesign) out.seismicDesign = title.seismicDesign;
    if (title.useApprovalDate) out.useApprovalDate = title.useApprovalDate;
  }

  return out;
}

export async function lookupLedgerBundle(
  input: LedgerLookupInput,
): Promise<LedgerLookupSuccess | LedgerLookupError> {
  const resolved = await resolveCodes(input);
  if ("ok" in resolved && resolved.ok === false) return resolved;
  if (!("codes" in resolved)) {
    return { ok: false, code: "BAD_REQUEST", error: "필지 코드를 해석하지 못했습니다." };
  }

  const { codes, pnu, warnings } = resolved;
  const dong = input.selectedDong || input.dong;
  const ho = input.selectedHo || input.ho;
  const rawSnapshots: NonNullable<LedgerBundle["rawSnapshots"]> = [];
  const summaryParts: string[] = [];

  let land;
  if (!input.skipLand) {
    const landResult = await fetchLandLedger({
      pnu,
      address: input.address,
      codes,
    });
    if (landResult.ok) {
      land = landResult.fields;
      rawSnapshots.push({ kind: "land", raw: landResult });
      if (landResult.rawSummary) summaryParts.push(landResult.rawSummary);
    } else {
      warnings.push(`토지: ${landResult.error}`);
    }
  }

  if (input.ledgerKind === "LAND_ONLY") {
    if (!land) {
      return {
        ok: false,
        code: "NOT_FOUND",
        error: warnings[0] || "토지특성을 찾지 못했습니다. 수기 입력으로 진행하세요.",
      };
    }
    return {
      ok: true,
      bundle: {
        ledgerKind: "LAND_ONLY",
        codes,
        pnu: land.pnu || pnu,
        land,
        warnings,
        rawSummary: summaryParts.join(" · ") || "토지특성만 조회",
        rawSnapshots,
      },
    };
  }

  let basis: BuildingLedgerFields | undefined;
  let recap: BuildingLedgerFields | undefined;
  let title: BuildingLedgerFields | undefined;
  let expos: BuildingLedgerFields | undefined;
  let candidates: LedgerCandidate[] = [];

  // 표제·총괄·기본개요·층별·지역지구 병렬 조회
  const [basisRes, recapRes, titleRes, flrRes, jijiguRes] = await Promise.all([
    fetchBrBasisItems(codes),
    input.ledgerKind === "AGGREGATE"
      ? fetchBrRecapItems(codes)
      : Promise.resolve({ ok: true as const, items: [], raw: null }),
    fetchBrTitleItems(codes),
    fetchBrFlrItems(codes, true),
    fetchBrJijiguItems(codes),
  ]);

  if (basisRes.ok && basisRes.items.length > 0) {
    basis = mapBrItem(basisRes.items[0], "basis");
    rawSnapshots.push({ kind: "basis", raw: basisRes.raw });
    summaryParts.push(`기본개요 ${basisRes.items.length}건`);
  } else if (!basisRes.ok && basisRes.code !== "NOT_FOUND") {
    warnings.push(`기본개요: ${basisRes.error}`);
  }

  if (recapRes.ok && recapRes.items.length > 0) {
    recap = mapBrItem(recapRes.items[0], "recap");
    rawSnapshots.push({ kind: "recap", raw: recapRes.raw });
    summaryParts.push(`총괄표제부 ${recapRes.items.length}건`);
  } else if (!recapRes.ok && "error" in recapRes) {
    warnings.push(`총괄표제부: ${recapRes.error}`);
  }

  if (!titleRes.ok) {
    if (input.ledgerKind === "GENERAL") return titleRes;
    warnings.push(`표제부: ${titleRes.error}`);
  } else {
    const titleItems = titleRes.items;
    rawSnapshots.push({ kind: "title", raw: titleRes.raw });
    summaryParts.push(`표제부 ${titleItems.length}건`);

    let picked = titleItems[0];
    if (dong) {
      const filtered = titleItems.filter((t) => matchDongLabel(String(t.dongNm ?? ""), dong));
      if (filtered.length === 1) picked = filtered[0];
      else if (filtered.length > 1) {
        candidates.push(
          ...filtered.map((t) => ({
            kind: "title" as const,
            label: `${t.dongNm || "동미상"} · ${t.bldNm || "건물"} · ${t.mainPurpsCdNm || ""}`.trim(),
            dongNm: String(t.dongNm ?? ""),
            mgmBldrgstPk: t.mgmBldrgstPk != null ? String(t.mgmBldrgstPk) : undefined,
            fields: mapBrItem(t, "title"),
          })),
        );
      } else if (titleItems.length > 1) {
        candidates.push(
          ...titleItems.map((t) => ({
            kind: "title" as const,
            label: `${t.dongNm || "동미상"} · ${t.bldNm || "건물"}`.trim(),
            dongNm: String(t.dongNm ?? ""),
            mgmBldrgstPk: t.mgmBldrgstPk != null ? String(t.mgmBldrgstPk) : undefined,
            fields: mapBrItem(t, "title"),
          })),
        );
        warnings.push(`입력 동(${dong})과 일치하는 표제부를 찾지 못했습니다. 후보에서 선택하세요.`);
      }
    } else if (titleItems.length > 1 && input.ledgerKind === "AGGREGATE") {
      candidates.push(
        ...titleItems.slice(0, 30).map((t) => ({
          kind: "title" as const,
          label: `${t.dongNm || "동미상"} · ${t.bldNm || "건물"}`.trim(),
          dongNm: String(t.dongNm ?? ""),
          mgmBldrgstPk: t.mgmBldrgstPk != null ? String(t.mgmBldrgstPk) : undefined,
          fields: mapBrItem(t, "title"),
        })),
      );
    }

    if (input.selectedMgmPk) {
      picked =
        titleItems.find((t) => String(t.mgmBldrgstPk) === input.selectedMgmPk) || picked;
    }
    if (picked) title = mapBrItem(picked, "title");
  }

  let floorRows = flrRes.ok
    ? mapFloorRows(flrRes.items, dong || title?.dongNm)
    : [];
  if (flrRes.ok) {
    rawSnapshots.push({ kind: "flr", raw: flrRes.raw });
    summaryParts.push(`층별개요 ${flrRes.items.length}행`);
    if (!floorRows.length && flrRes.items.length) {
      floorRows = mapFloorRows(flrRes.items);
    }
  } else if (flrRes.code !== "NOT_FOUND") {
    warnings.push(`층별개요: ${flrRes.error}`);
  }

  const jijiguRows = jijiguRes.ok ? mapJijiguRows(jijiguRes.items) : [];
  if (jijiguRes.ok) {
    rawSnapshots.push({ kind: "jijigu", raw: jijiguRes.raw });
    summaryParts.push(`지역지구 ${jijiguRes.items.length}건`);
  } else if (jijiguRes.code !== "NOT_FOUND") {
    warnings.push(`지역지구: ${jijiguRes.error}`);
  }

  if (input.ledgerKind === "AGGREGATE") {
    const exposRes = await fetchBrExposUnit(codes, dong, ho);

    if (exposRes.ok) {
      rawSnapshots.push({ kind: "expos", raw: exposRes.raw });
      summaryParts.push(
        `전유부 스캔 ${exposRes.items.length}건` +
          (exposRes.matched.length ? ` · 매칭 ${exposRes.matched.length}` : ""),
      );

      const hoMatched = Boolean(ho) && exposRes.matched.length > 0;
      const exposList = ho
        ? exposRes.matched
        : dong
          ? exposRes.dongCandidates
          : exposRes.items;

      if (ho && !hoMatched) {
        warnings.push(
          `호(${ho}) 일치 전유부를 찾지 못했습니다. 후보에서 선택하세요.`,
        );
      }

      const needHoPick = Boolean(ho) && !hoMatched;
      if (needHoPick || (exposList.length === 0 && exposRes.dongCandidates.length > 0)) {
        const pool =
          exposRes.dongCandidates.length > 0
            ? exposRes.dongCandidates
            : exposRes.items;
        const unique = new Map<string, LedgerCandidate>();
        for (const e of pool.slice(0, 120)) {
          const key = `${normalizeDongHo(String(e.dongNm ?? ""))}-${normalizeDongHo(String(e.hoNm ?? ""))}`;
          if (unique.has(key)) continue;
          unique.set(key, {
            kind: "expos",
            label: `${e.dongNm || "?"}동 ${e.hoNm || "?"}호 · ${e.mainPurpsCdNm || e.etcPurps || ""}`.trim(),
            dongNm: String(e.dongNm ?? ""),
            hoNm: String(e.hoNm ?? ""),
            mgmBldrgstPk: e.mgmBldrgstPk != null ? String(e.mgmBldrgstPk) : undefined,
            fields: mapBrItem(e, "expos"),
          });
        }
        candidates = [...candidates, ...unique.values()];
      } else if (exposList.length > 1 && !ho) {
        candidates = [
          ...candidates,
          ...exposList.slice(0, 50).map((e) => ({
            kind: "expos" as const,
            label: `${e.dongNm || "?"}동 ${e.hoNm || "?"}호 · ${e.mainPurpsCdNm || ""}`.trim(),
            dongNm: String(e.dongNm ?? ""),
            hoNm: String(e.hoNm ?? ""),
            mgmBldrgstPk: e.mgmBldrgstPk != null ? String(e.mgmBldrgstPk) : undefined,
            fields: mapBrItem(e, "expos"),
          })),
        ];
        warnings.push("호수를 선택하면 전용·공용면적·주택가격을 확정합니다.");
      } else if (exposList.length >= 1 && (!ho || hoMatched)) {
        const e = exposList[0];
        expos = mapBrItem(e, "expos");
        const unitDong = String(e.dongNm ?? dong ?? "");
        const unitHo = String(e.hoNm ?? ho ?? "");

        const unitPk = expos.mgmBldrgstPk;
        const hintPage = exposRes.matchedPage ?? 1;
        const [areaRes, hsprcRes] = await Promise.all([
          fetchBrExposAreaForUnit(codes, unitDong, unitHo, unitPk, hintPage),
          fetchBrHsprcForUnit(codes, unitDong, unitHo, unitPk),
        ]);
        if (areaRes.ok) {
          const areas = aggregateExposAreas(areaRes.items, unitDong, unitHo);
          if (areas.exclusiveArea != null) expos.exclusiveArea = areas.exclusiveArea;
          if (areas.commonArea != null) expos.commonArea = areas.commonArea;
          if (areas.supplyArea != null) expos.supplyArea = areas.supplyArea;
          if (areas.exposAreaRows.length) expos.exposAreaRows = areas.exposAreaRows;
          if (areas.enrich) {
            if (areas.enrich.buildingUse) expos.buildingUse = areas.enrich.buildingUse;
            if (areas.enrich.etcPurps) expos.etcPurps = areas.enrich.etcPurps;
            if (areas.enrich.structureType) expos.structureType = areas.enrich.structureType;
            if (areas.enrich.etcStrct) expos.etcStrct = areas.enrich.etcStrct;
            if (areas.enrich.floor != null) expos.floor = areas.enrich.floor;
            if (areas.enrich.floorNm) expos.floorNm = areas.enrich.floorNm;
            if (areas.enrich.flrGbNm) expos.flrGbNm = areas.enrich.flrGbNm;
            if (areas.enrich.mainAtchGbCdNm) {
              expos.mainAtchGbCdNm = areas.enrich.mainAtchGbCdNm;
            }
          }
          rawSnapshots.push({ kind: "expos", raw: areaRes.raw });
          summaryParts.push(`전유공용면적 ${areas.exposAreaRows.length}행`);
          if (!areas.exposAreaRows.length) {
            warnings.push(
              "전유공용면적 행을 찾지 못했습니다. 동·호를 다시 선택하거나 수기 입력하세요.",
            );
          }
        } else if (areaRes.code !== "NOT_FOUND") {
          warnings.push(`전유공용면적: ${areaRes.error}`);
        }

        if (hsprcRes.ok) {
          rawSnapshots.push({ kind: "hsprc", raw: hsprcRes.raw });
          if (hsprcRes.items[0]) {
            const mapped = mapBrItem(hsprcRes.items[0], "hsprc");
            expos.housePrice = mapped.housePrice;
            expos.housePriceStdDay = mapped.housePriceStdDay;
            if (mapped.extras) {
              expos.extras = { ...(expos.extras ?? {}), ...mapped.extras };
            }
            summaryParts.push("주택가격 1건");
          } else {
            summaryParts.push("주택가격 없음");
          }
        } else if (hsprcRes.code !== "NOT_FOUND") {
          warnings.push(`주택가격: ${hsprcRes.error}`);
        }

        const dongKey = unitDong;
        let dongFloors = floorRows.filter((r) => matchDongLabel(r.dongNm, dongKey));
        if (!dongFloors.length) dongFloors = floorRows;
        if (expos.floor != null) {
          dongFloors = [...dongFloors].sort((a, b) => {
            const da = Math.abs((a.floor ?? 0) - (expos!.floor ?? 0));
            const db = Math.abs((b.floor ?? 0) - (expos!.floor ?? 0));
            return da - db;
          });
        }
        if (dongFloors.length) expos.floorRows = dongFloors.slice(0, 40);
        if (jijiguRows.length) expos.jijiguRows = jijiguRows;
      }
    } else {
      warnings.push(`전유부: ${exposRes.error}`);
    }
  }

  let building: BuildingLedgerFields;
  if (input.ledgerKind === "AGGREGATE") {
    building = mergeExposFirst({ expos, title, recap, basis });
    if (!expos?.exclusiveArea) {
      delete building.exclusiveArea;
      // 전유 미확정이면 표제 연면적을 전용으로 쓰지 않음
    }
  } else {
    building = mergeExposFirst({ title, basis, recap: undefined, expos: undefined });
  }

  // 표제/합성에도 층별·지역지구 첨부
  if (floorRows.length) {
    building.floorRows = building.floorRows?.length ? building.floorRows : floorRows.slice(0, 40);
    if (title && !title.floorRows) title = { ...title, floorRows: floorRows.slice(0, 40) };
  }
  if (jijiguRows.length) {
    building.jijiguRows = building.jijiguRows?.length ? building.jijiguRows : jijiguRows;
    if (title && !title.jijiguRows) title = { ...title, jijiguRows };
    if (recap && !recap.jijiguRows) recap = { ...recap, jijiguRows };
  }

  if (
    !building.buildingName &&
    !building.totalFloorArea &&
    !building.exclusiveArea &&
    !land &&
    candidates.length === 0
  ) {
    return {
      ok: false,
      code: "NOT_FOUND",
      error: "대장 정보를 찾지 못했습니다. 코드를 확인하거나 수기 입력하세요.",
    };
  }

  return {
    ok: true,
    bundle: {
      ledgerKind: input.ledgerKind,
      codes,
      pnu: land?.pnu || pnu,
      basis,
      recap,
      title,
      expos,
      building: Object.keys(building).length ? building : undefined,
      land,
      candidates: candidates.length ? candidates : undefined,
      warnings,
      rawSummary: summaryParts.join(" · ") || "대장 조회 완료",
      rawSnapshots,
    },
  };
}
