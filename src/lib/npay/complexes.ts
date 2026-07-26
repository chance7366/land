import { NpayClient } from "./client";
import { resolveNpayRegion } from "./regions";
import type { NpayComplexRow, NpayRegion } from "./types";

const PRECISION = 14;

function toInt(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function toFloat(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function asRec(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

function clusterPayload(region: NpayRegion) {
  return {
    filter: {
      tradeTypes: ["A1"],
      realEstateTypes: ["A01"],
      roomCount: [],
      bathRoomCount: [],
      optionTypes: [],
      oneRoomShapeTypes: [],
      moveInTypes: [],
      filtersExclusiveSpace: false,
      floorTypes: [],
      directionTypes: [],
      hasArticlePhoto: false,
      isAuthorizedByOwner: false,
      parkingTypes: [],
      entranceTypes: [],
      hasArticle: false,
      legalDivisionNumbers: [region.legalDivisionNumber],
      legalDivisionType: "EUP",
    },
    boundingBox: region.boundingBox,
    precision: PRECISION,
    userChannelType: "PC",
  };
}

function mapComplexBase(
  info: Record<string, unknown>,
  region: NpayRegion,
  complexNumber: number,
  cluster?: Record<string, unknown>,
) {
  const detail = asRec(info.complexDetail ?? info);
  const address = asRec(info.addressInfo ?? info.address ?? detail);
  const coords = asRec(
    info.coordinates ??
      address.coordinates ??
      info.coordinate ??
      cluster?.coordinates,
  );
  const parking = asRec(info.parkingInfo ?? detail.parkingInfo);
  const approvalDate = String(
    info.useApprovalDate ??
      detail.useApproveYmd ??
      detail.useApprovalDate ??
      cluster?.useApprovalDate ??
      "",
  );
  return {
    complexNumber,
    complexName: String(
      info.name ?? info.complexName ?? detail.complexName ?? "",
    ),
    city: region.city,
    division: region.division,
    sector: region.sector,
    legalDivisionNumber: region.legalDivisionNumber,
    roadName: String(
      address.roadName ??
        address.roadNameAddress ??
        address.roadAddress ??
        "",
    ),
    jibun: String(
      address.jibun ?? address.jibunAddress ?? address.address ?? "",
    ),
    latitude: toFloat(
      coords.yCoordinate ?? coords.y ?? coords.latitude ?? info.latitude,
    ),
    longitude: toFloat(
      coords.xCoordinate ?? coords.x ?? coords.longitude ?? info.longitude,
    ),
    useApprovalDate: approvalDate,
    useApprovalYear: toInt(
      detail.useApproveYear ?? (approvalDate.slice(0, 4) || null),
    ),
    totalHouseholds: toInt(
      info.totalHouseholdNumber ??
        detail.totalHouseholdNumber ??
        detail.totalHouseholdCount ??
        cluster?.totalHouseholdNumber,
    ),
    dongCount: toInt(
      info.dongCount ?? detail.totalDongCount ?? detail.dongCount,
    ),
    highestFloor: toInt(
      info.highestFloor ?? detail.highFloor ?? detail.highestFloor,
    ),
    heating: String(
      info.heatMethodTypeCode ??
        detail.heatMethodTypeCode ??
        detail.heating ??
        "",
    ),
    parking: String(
      parking.totalParkingCount != null
        ? `총 ${parking.totalParkingCount}대`
        : (detail.parkingPossibleCount ?? detail.parking ?? ""),
    ),
    constructionCompany: String(
      info.constructionCompany ??
        detail.constructionCompanyName ??
        detail.constructionCompany ??
        "",
    ),
    complexUrl: `https://fin.land.naver.com/complexes/${complexNumber}`,
  };
}

function extractClusters(clusterData: Record<string, unknown>): Record<string, unknown>[] {
  const result = clusterData.result;
  if (Array.isArray(result)) {
    return result.filter((x): x is Record<string, unknown> => !!x && typeof x === "object");
  }
  if (result && typeof result === "object") {
    const clusters = (result as { clusters?: unknown }).clusters;
    if (Array.isArray(clusters)) {
      return clusters.filter(
        (x): x is Record<string, unknown> => !!x && typeof x === "object",
      );
    }
  }
  return [];
}

export type CollectComplexesResult = {
  ok: boolean;
  regionLabel: string;
  legalDivisionNumber: string;
  complexCount: number;
  rows: NpayComplexRow[];
  truncated: boolean;
  error?: string;
};

export async function collectNpayComplexes(opts: {
  city: string;
  division: string;
  sector: string;
  /** 상세(평형)까지 가져올 단지 수. 기본 25 */
  maxComplexes?: number;
}): Promise<CollectComplexesResult> {
  const region = resolveNpayRegion(opts.city, opts.division, opts.sector);
  const maxComplexes = Math.min(Math.max(opts.maxComplexes ?? 25, 1), 80);
  // APTListings와 동일하게 간격 축소 (기본 1초면 단지 25곳 ≈ 1분+)
  const client = new NpayClient(350);
  const rows: NpayComplexRow[] = [];
  let complexCount = 0;
  let truncated = false;

  try {
    const clusterData = await client.post(
      "/complex/complexClusters",
      clusterPayload(region),
    );
    const clusters = extractClusters(clusterData);

    const targets: { number: number; cluster: Record<string, unknown> }[] = [];
    const seen = new Set<number>();
    for (const item of clusters) {
      const n = toInt(item.complexNumber);
      if (n == null || seen.has(n)) continue;
      seen.add(n);
      targets.push({ number: n, cluster: item });
    }

    if (targets.length > maxComplexes) {
      truncated = true;
    }
    const slice = targets.slice(0, maxComplexes);
    complexCount = slice.length;

    if (slice.length === 0) {
      return {
        ok: true,
        regionLabel: region.label,
        legalDivisionNumber: region.legalDivisionNumber,
        complexCount: 0,
        rows: [],
        truncated: false,
        error: undefined,
      };
    }

    for (const { number: complexNumber, cluster } of slice) {
      const referer = `https://fin.land.naver.com/complexes/${complexNumber}`;
      let info: Record<string, unknown> = {};
      try {
        const infoData = await client.get(
          "/complex",
          { complexNumber },
          referer,
        );
        info = asRec(infoData.result);
      } catch {
        /* 클러스터 정보로 폴백 */
      }
      const base = mapComplexBase(info, region, complexNumber, cluster);

      let pyeongs: Record<string, unknown>[] = [];
      try {
        const pyeongData = await client.get(
          "/complex/pyeongList",
          { complexNumber },
          referer,
        );
        pyeongs = Array.isArray(pyeongData.result)
          ? (pyeongData.result as Record<string, unknown>[])
          : [];
      } catch {
        pyeongs = [];
      }

      if (pyeongs.length === 0) {
        rows.push({
          ...base,
          pyeongTypeNumber: toInt(cluster.pyeongTypeNumber),
          pyeongName: "",
          supplyArea: toFloat(cluster.baseSpace),
          exclusiveArea: null,
        });
        continue;
      }

      for (const p of pyeongs) {
        rows.push({
          ...base,
          pyeongTypeNumber: toInt(p.pyeongTypeNumber ?? p.pyeongNo),
          pyeongName: String(p.pyeongName ?? p.pyeongName2 ?? p.name ?? ""),
          supplyArea: toFloat(p.supplyArea ?? p.supplySpace ?? p.spc1),
          exclusiveArea: toFloat(
            p.exclusiveArea ?? p.exclusiveSpace ?? p.spc2,
          ),
        });
      }
    }

    return {
      ok: true,
      regionLabel: region.label,
      legalDivisionNumber: region.legalDivisionNumber,
      complexCount,
      rows,
      truncated,
    };
  } catch (e) {
    return {
      ok: false,
      regionLabel: region.label,
      legalDivisionNumber: region.legalDivisionNumber,
      complexCount,
      rows,
      truncated,
      error: e instanceof Error ? e.message : "단지 수집 실패",
    };
  }
}
