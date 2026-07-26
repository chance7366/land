"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  KeyRound,
  LandPlot,
  Loader2,
  PenLine,
  RefreshCw,
  Search,
} from "lucide-react";
import type {
  BuildingLedgerFields,
  LandLedgerFields,
  LedgerBundle,
  LedgerCandidate,
  LedgerKind,
} from "@/lib/public-data/types";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#4dabff]/50 focus:ring-1 focus:ring-[#4dabff]/30";

export type LedgerLookupPanelProps = {
  addressParts: {
    sido?: string;
    sigungu?: string;
    eupmyeondong?: string;
    ri?: string;
    jibunMain?: string | number;
    jibunSub?: string | number;
  };
  /** 전체 주소 문자열 (경매 등) */
  addressOverride?: string;
  unitDong?: string;
  unitHo?: string;
  defaultLedgerKind?: LedgerKind;
  onApplyBuilding: (fields: BuildingLedgerFields) => void;
  onApplyLand: (fields: LandLedgerFields) => void;
  onApplyBundle?: (bundle: LedgerBundle) => void;
  /** 저장 후 스냅샷 persist용 */
  persistOwner?: { type: "property" | "auction"; id: string };
};

const KIND_LABELS: Record<LedgerKind, string> = {
  GENERAL: "일반건축물",
  AGGREGATE: "집합건물",
  LAND_ONLY: "토지만",
};

/** 매물·경매 공용 대장 조회 패널 */
export function PropertyLedgerLookupPanel({
  addressParts,
  addressOverride,
  unitDong = "",
  unitHo = "",
  defaultLedgerKind = "GENERAL",
  onApplyBuilding,
  onApplyLand,
  onApplyBundle,
  persistOwner,
}: LedgerLookupPanelProps) {
  const addressHint = useMemo(() => {
    if (addressOverride?.trim()) return addressOverride.trim();
    return [
      addressParts.sido,
      addressParts.sigungu,
      addressParts.eupmyeondong,
      addressParts.ri,
      addressParts.jibunMain != null && addressParts.jibunMain !== ""
        ? `${addressParts.jibunMain}${
            addressParts.jibunSub != null && addressParts.jibunSub !== ""
              ? `-${addressParts.jibunSub}`
              : ""
          }`
        : "",
    ]
      .filter(Boolean)
      .join(" ")
      .trim();
  }, [addressParts, addressOverride]);

  const [manualOnly, setManualOnly] = useState(false);
  const [ledgerKind, setLedgerKind] = useState<LedgerKind>(defaultLedgerKind);
  const [sigunguCd, setSigunguCd] = useState("");
  const [bjdongCd, setBjdongCd] = useState("");
  const [platGbCd, setPlatGbCd] = useState("0");
  const [bun, setBun] = useState(String(addressParts.jibunMain ?? ""));
  const [ji, setJi] = useState(String(addressParts.jibunSub ?? ""));
  const [pnu, setPnu] = useState("");
  const [address, setAddress] = useState(addressHint);
  const [dong, setDong] = useState(unitDong);
  const [ho, setHo] = useState(unitHo);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [bundle, setBundle] = useState<LedgerBundle | null>(null);
  const [candidates, setCandidates] = useState<LedgerCandidate[]>([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [previewTab, setPreviewTab] = useState<
    "expos" | "building" | "land" | "recap" | "title"
  >("expos");

  useEffect(() => {
    setLedgerKind(defaultLedgerKind);
  }, [defaultLedgerKind]);

  useEffect(() => {
    setDong(unitDong);
    setHo(unitHo);
  }, [unitDong, unitHo]);

  function syncAddressFromForm() {
    setAddress(addressHint);
    if (addressParts.jibunMain != null && addressParts.jibunMain !== "") {
      setBun(String(addressParts.jibunMain));
    }
    if (addressParts.jibunSub != null && addressParts.jibunSub !== "") {
      setJi(String(addressParts.jibunSub));
    }
    setDong(unitDong);
    setHo(unitHo);
  }

  async function runLookup(extra?: {
    selectedMgmPk?: string;
    selectedDong?: string;
    selectedHo?: string;
  }) {
    setLoading(true);
    setError("");
    setMessage("");
    setWarnings([]);
    try {
      const res = await fetch("/api/admin/ledgers/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ledgerKind,
          address: address || addressHint || undefined,
          pnu: pnu || undefined,
          sigunguCd: sigunguCd || undefined,
          bjdongCd: bjdongCd || undefined,
          platGbCd,
          bun: bun || undefined,
          ji: ji || undefined,
          dong: dong || undefined,
          ho: ho || undefined,
          ...extra,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        bundle?: LedgerBundle;
      };
      if (!data.ok || !data.bundle) {
        setBundle(null);
        setCandidates([]);
        setError(data.error || "대장 조회에 실패했습니다.");
        return;
      }
      setBundle(data.bundle);
      setCandidates(data.bundle.candidates ?? []);
      setWarnings(data.bundle.warnings ?? []);
      setMessage(data.bundle.rawSummary || "대장 조회 완료");
      if (data.bundle.pnu) setPnu(data.bundle.pnu);
      if (data.bundle.codes) {
        setSigunguCd(data.bundle.codes.sigunguCd);
        setBjdongCd(data.bundle.codes.bjdongCd);
        setPlatGbCd(data.bundle.codes.platGbCd);
        setBun(String(Number(data.bundle.codes.bun)));
        setJi(String(Number(data.bundle.codes.ji)));
      }
      if (data.bundle.expos) setPreviewTab("expos");
      else if (data.bundle.building) setPreviewTab("building");
      else if (data.bundle.recap) setPreviewTab("recap");
      else if (data.bundle.land) setPreviewTab("land");
      else setPreviewTab("building");
    } catch {
      setError("대장 조회 중 네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function applyAll() {
    if (!bundle) return;
    if (bundle.building) onApplyBuilding(bundle.building);
    if (bundle.land) onApplyLand(bundle.land);
    onApplyBundle?.(bundle);

    if (persistOwner?.id) {
      try {
        await fetch("/api/admin/ledgers/persist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ownerType: persistOwner.type,
            ownerId: persistOwner.id,
            ledgerKind,
            address: address || addressHint || undefined,
            pnu: pnu || undefined,
            sigunguCd: sigunguCd || undefined,
            bjdongCd: bjdongCd || undefined,
            platGbCd,
            bun,
            ji,
            dong,
            ho,
          }),
        });
      } catch {
        /* 스냅샷 실패해도 폼 적용은 유지 */
      }
    }
    setMessage("폼에 적용했습니다. 아래에서 수기 수정할 수 있습니다.");
  }

  function selectCandidate(c: LedgerCandidate) {
    const key = `${c.kind}-${c.mgmBldrgstPk}-${c.dongNm}-${c.hoNm}`;
    setSelectedKey(key);
    void runLookup({
      selectedMgmPk: c.mgmBldrgstPk,
      selectedDong: c.dongNm,
      selectedHo: c.hoNm,
    });
    if (c.dongNm) setDong(c.dongNm.replace(/동$/i, ""));
    if (c.hoNm) setHo(c.hoNm.replace(/호$/i, ""));
  }

  return (
    <div className="rounded-2xl border border-sky-400/25 bg-sky-500/[0.07] p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-bold text-sky-100">
            <KeyRound className="h-4 w-4" />
            공공데이터 · 브이월드 대장 조회
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-sky-100/55">
            유형에 따라 총괄·표제·전유·토지특성을 조회합니다. 실패해도 수기 입력으로 등록을 계속할
            수 있습니다.
          </p>
        </div>
        <label className="flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[11px] text-slate-200">
          <input
            type="checkbox"
            checked={manualOnly}
            onChange={(e) => setManualOnly(e.target.checked)}
          />
          <PenLine className="h-3 w-3" />
          수기입력만
        </label>
      </div>

      {manualOnly ? (
        <p className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-xs text-slate-300">
          API 조회를 건너뛰고 아래 상세 필드를 직접 입력하세요.
        </p>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {(Object.keys(KIND_LABELS) as LedgerKind[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setLedgerKind(k)}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                  ledgerKind === k
                    ? "border-[#4dabff]/50 bg-[#4dabff]/20 text-[#cfe9ff]"
                    : "border-white/15 text-white/55"
                }`}
              >
                {KIND_LABELS[k]}
              </button>
            ))}
            <button
              type="button"
              onClick={syncAddressFromForm}
              className="ml-auto inline-flex items-center gap-1 rounded-full border border-white/15 px-2.5 py-1.5 text-[11px] text-white/60 hover:text-white"
            >
              <RefreshCw className="h-3 w-3" />
              주소 동기화
            </button>
          </div>

          <div className="mb-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-[11px] text-white/45 sm:col-span-2">
              조회 주소
              <input
                className={`${inputClass} mt-1`}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="충청남도 홍성군 … 본번-부번"
              />
            </label>
            <label className="text-[11px] text-white/45">
              PNU (선택)
              <input
                className={`${inputClass} mt-1`}
                value={pnu}
                onChange={(e) => setPnu(e.target.value)}
                placeholder="19자리"
              />
            </label>
            {ledgerKind === "AGGREGATE" && (
              <>
                <label className="text-[11px] text-white/45">
                  동
                  <input
                    className={`${inputClass} mt-1`}
                    value={dong}
                    onChange={(e) => setDong(e.target.value)}
                    placeholder="101"
                  />
                </label>
                <label className="text-[11px] text-white/45">
                  호
                  <input
                    className={`${inputClass} mt-1`}
                    value={ho}
                    onChange={(e) => setHo(e.target.value)}
                    placeholder="502"
                  />
                </label>
              </>
            )}
            <label className="text-[11px] text-white/45">
              대지구분
              <select
                className={`${inputClass} mt-1`}
                value={platGbCd}
                onChange={(e) => setPlatGbCd(e.target.value)}
              >
                <option value="0">0 · 대지</option>
                <option value="1">1 · 산</option>
                <option value="2">2 · 블록</option>
              </select>
            </label>
            <label className="text-[11px] text-white/45">
              시군구코드 (5)
              <input
                className={`${inputClass} mt-1`}
                value={sigunguCd}
                onChange={(e) => setSigunguCd(e.target.value)}
                placeholder="자동 또는 44800"
              />
            </label>
            <label className="text-[11px] text-white/45">
              법정동코드 (5)
              <input
                className={`${inputClass} mt-1`}
                value={bjdongCd}
                onChange={(e) => setBjdongCd(e.target.value)}
                placeholder="자동 또는 25000"
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-[11px] text-white/45">
                본번
                <input
                  className={`${inputClass} mt-1`}
                  value={bun}
                  onChange={(e) => setBun(e.target.value)}
                />
              </label>
              <label className="text-[11px] text-white/45">
                부번
                <input
                  className={`${inputClass} mt-1`}
                  value={ji}
                  onChange={(e) => setJi(e.target.value)}
                />
              </label>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => void runLookup()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Search className="h-3.5 w-3.5" />
            )}
            대장 일괄 조회
          </button>

          {error && (
            <p className="mt-3 rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
              {error}
              <span className="mt-1 block text-[10px] text-amber-100/60">
                조회 실패해도 아래 필드는 수기 입력할 수 있습니다.
              </span>
            </p>
          )}
          {message && !error && (
            <p className="mt-3 text-xs text-sky-100/80">{message}</p>
          )}
          {warnings.length > 0 && (
            <ul className="mt-2 space-y-0.5 text-[10px] text-amber-200/70">
              {warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          )}

          {candidates.length > 0 && (
            <div className="mt-3 rounded-xl border border-violet-400/25 bg-violet-500/10 p-3">
              <p className="mb-2 text-xs font-bold text-violet-100">후보 선택 (동·호 불일치)</p>
              <ul className="max-h-40 space-y-1 overflow-y-auto">
                {candidates.map((c) => {
                  const key = `${c.kind}-${c.mgmBldrgstPk}-${c.dongNm}-${c.hoNm}`;
                  return (
                    <li key={key}>
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] hover:bg-white/5">
                        <input
                          type="radio"
                          name="ledger-candidate"
                          checked={selectedKey === key}
                          onChange={() => selectCandidate(c)}
                        />
                        <span className="text-slate-200">{c.label}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {bundle && (
            <div className="mt-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {(
                  [
                    bundle.expos && { id: "expos" as const, label: "전유부 ★", Icon: Building2 },
                    bundle.building && { id: "building" as const, label: "합성적용", Icon: Building2 },
                    bundle.title && { id: "title" as const, label: "표제부(동)", Icon: Building2 },
                    bundle.recap && { id: "recap" as const, label: "총괄표제부", Icon: Building2 },
                    bundle.land && { id: "land" as const, label: "토지", Icon: LandPlot },
                  ] as const
                )
                  .filter(Boolean)
                  .map((t) =>
                    t ? (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setPreviewTab(t.id)}
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                          previewTab === t.id
                            ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-100"
                            : "border-white/15 text-white/50"
                        }`}
                      >
                        <t.Icon className="h-3 w-3" />
                        {t.label}
                      </button>
                    ) : null,
                  )}
              </div>

              {previewTab === "expos" && bundle.expos && (
                <div className="space-y-2">
                  <PreviewBox
                    title="전유부 (호 단위 · 우선 적용)"
                    rows={exposRows(bundle.expos)}
                    onApply={() => void applyAll()}
                    applyLabel="전유 우선으로 폼에 적용"
                  />
                  {bundle.expos.exposAreaRows && bundle.expos.exposAreaRows.length > 0 && (
                    <AreaTable rows={bundle.expos.exposAreaRows} />
                  )}
                  {bundle.expos.jijiguRows && bundle.expos.jijiguRows.length > 0 && (
                    <TagList
                      title="지역·지구·구역"
                      items={bundle.expos.jijiguRows.map(
                        (j) =>
                          [j.gbNm, j.cdNm || j.etcNm, j.reprYn === "1" ? "대표" : ""]
                            .filter(Boolean)
                            .join(" · "),
                      )}
                    />
                  )}
                  {bundle.expos.floorRows && bundle.expos.floorRows.length > 0 && (
                    <FloorTable rows={bundle.expos.floorRows} highlightFloor={bundle.expos.floor} />
                  )}
                  {bundle.expos.extras && Object.keys(bundle.expos.extras).length > 0 && (
                    <ExtrasBox extras={bundle.expos.extras} />
                  )}
                </div>
              )}
              {previewTab === "building" && bundle.building && (
                <div className="space-y-2">
                  <PreviewBox
                    title="적용 예정 (전유 우선 합성)"
                    rows={buildingRows(bundle.building)}
                    onApply={() => void applyAll()}
                    applyLabel="전체 폼에 적용"
                  />
                  {bundle.building.exposAreaRows && bundle.building.exposAreaRows.length > 0 && (
                    <AreaTable rows={bundle.building.exposAreaRows} />
                  )}
                </div>
              )}
              {previewTab === "title" && bundle.title && (
                <div className="space-y-2">
                  <PreviewBox title="표제부 (동)" rows={buildingRows(bundle.title)} />
                  {bundle.title.floorRows && bundle.title.floorRows.length > 0 && (
                    <FloorTable rows={bundle.title.floorRows} />
                  )}
                </div>
              )}
              {previewTab === "recap" && bundle.recap && (
                <div className="space-y-2">
                  <PreviewBox title="총괄표제부 (단지)" rows={buildingRows(bundle.recap)} />
                  {bundle.recap.jijiguRows && bundle.recap.jijiguRows.length > 0 && (
                    <TagList
                      title="지역·지구·구역"
                      items={bundle.recap.jijiguRows.map(
                        (j) =>
                          [j.gbNm, j.cdNm || j.etcNm, j.reprYn === "1" ? "대표" : ""]
                            .filter(Boolean)
                            .join(" · "),
                      )}
                    />
                  )}
                </div>
              )}
              {previewTab === "land" && bundle.land && (
                <PreviewBox
                  title="토지특성"
                  rows={[
                    ["PNU", bundle.land.pnu],
                    ["면적(㎡)", bundle.land.exclusiveArea],
                    ["지목", bundle.land.landCategory],
                    ["지목코드", bundle.land.landCategoryCode],
                    ["용도지역", bundle.land.zoning],
                    ["용도지역2", bundle.land.zoning2],
                    ["이용상황", bundle.land.landUseStatus],
                    ["지형", bundle.land.terrain],
                    ["형상", bundle.land.landShape],
                    ["도로접면", bundle.land.roadAccess],
                    ["공시지가", bundle.land.officialLandPrice],
                    ["가격기준연도", bundle.land.priceStdYear],
                    ...(bundle.land.extras
                      ? (Object.entries(bundle.land.extras).slice(0, 8) as [
                          string,
                          string | number,
                        ][])
                      : []),
                  ]}
                  onApply={() => void applyAll()}
                  applyLabel="전체 폼에 적용"
                />
              )}

              {bundle.building || bundle.land ? (
                <button
                  type="button"
                  onClick={() => void applyAll()}
                  className="mt-2 w-full rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-3 py-2 text-xs font-bold text-emerald-100"
                >
                  조회 결과 전체 폼에 적용
                </button>
              ) : null}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export const LedgerLookupPanel = PropertyLedgerLookupPanel;

function exposRows(f: BuildingLedgerFields): [string, string | number | undefined][] {
  const areaSummary =
    f.exposAreaRows && f.exposAreaRows.length
      ? `${f.exposAreaRows.length}행 (아래 표 참고)`
      : undefined;
  return [
    ["건물명", f.buildingName],
    ["동", f.dongNm],
    ["호", f.hoNm],
    ["층구분", f.flrGbNm],
    ["층", f.floorNm || f.floor],
    ["전용면적(㎡)", f.exclusiveArea],
    ["공용면적(㎡)", f.commonArea],
    ["공급면적(㎡)", f.supplyArea],
    ["주용도", f.buildingUse],
    ["기타용도", f.etcPurps],
    ["구조", f.structureType || f.etcStrct],
    ["주부속", f.mainAtchGbCdNm],
    ["주택가격", f.housePrice],
    ["가격기준일", f.housePriceStdDay],
    ["대장종류", f.regstrKindCdNm],
    ["대장구분", f.regstrGbCdNm],
    ["도로명", f.roadAddress],
    ["지번위치", f.platPlc],
    ["생성일", f.crtnDay],
    ["면적상세", areaSummary],
    ["관리PK", f.mgmBldrgstPk],
  ];
}

function buildingRows(f: BuildingLedgerFields): [string, string | number | undefined][] {
  const jijigu =
    f.jijiguRows && f.jijiguRows.length
      ? f.jijiguRows
          .slice(0, 4)
          .map((j) => j.cdNm || j.etcNm || j.gbNm)
          .filter(Boolean)
          .join(" · ")
      : undefined;
  return [
    ["건물명", f.buildingName],
    ["동/호", [f.dongNm, f.hoNm].filter(Boolean).join(" ") || undefined],
    ["주용도", f.buildingUse],
    ["기타용도", f.etcPurps],
    ["전용면적", f.exclusiveArea],
    ["공용면적", f.commonArea],
    ["공급면적", f.supplyArea],
    ["연면적(단지/동)", f.totalFloorArea],
    ["건축면적", f.archArea],
    ["대지면적", f.landShareArea],
    ["높이(m)", f.height],
    ["지상/지하층", [f.totalFloors, f.undergroundFloors].filter((v) => v != null).join(" / ") || undefined],
    ["해당층", [f.flrGbNm, f.floorNm || f.floor].filter(Boolean).join(" ") || undefined],
    ["사용승인일", f.useApprovalDate],
    ["허가일", f.permitDate],
    ["착공일", f.startConstructDate],
    ["주차(총/내/외)", [f.totalParking, f.indoorParking, f.outdoorParking].filter((v) => v != null).join(" / ") || undefined],
    ["승강기(비상)", [f.elevatorCnt, f.emergElevatorCnt].filter((v) => v != null).join(" / ") || undefined],
    ["건폐율/용적률", [f.bcRat, f.vlRat].filter((v) => v != null).join(" / ") || undefined],
    ["용적률산정연면적", f.vlRatEstmTotArea],
    ["세대/가구/호", [f.hhldCnt, f.fmlyCnt, f.hoCnt].filter((v) => v != null).join(" / ") || undefined],
    ["주·부속동수", [f.mainBldCnt, f.atchBldCnt].filter((v) => v != null).join(" / ") || undefined],
    ["부속면적", f.atchBldArea],
    ["구조", f.structureType || f.etcStrct],
    ["내진", f.seismicDesign],
    ["에너지/친환경", [f.energyGrade, f.ecoBldGrade].filter(Boolean).join(" / ") || undefined],
    ["주택가격", f.housePrice],
    ["지역지구", jijigu],
    ["도로명", f.roadAddress],
    ["지번위치", f.platPlc],
  ];
}

function AreaTable({ rows }: { rows: NonNullable<BuildingLedgerFields["exposAreaRows"]> }) {
  return (
    <div className="overflow-auto rounded-xl border border-white/10 bg-black/25 p-3">
      <p className="mb-2 text-xs font-bold text-emerald-100">전유·공용면적 상세</p>
      <table className="w-full min-w-[520px] text-left text-[11px] text-[#cbd5e1]">
        <thead className="sticky top-0 bg-[#0B0F19]/95">
          <tr className="text-white/40">
            <th className="px-2 py-1.5 font-medium">구분</th>
            <th className="px-2 py-1.5 font-medium">층</th>
            <th className="px-2 py-1.5 font-medium">용도</th>
            <th className="px-2 py-1.5 font-medium">구조</th>
            <th className="px-2 py-1.5 font-medium text-right">면적㎡</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={`${r.exposPubuseGb}-${r.area}-${i}`} className="border-t border-white/5">
              <td className="px-2 py-1.5">
                <span
                  className={
                    /전유/.test(r.exposPubuseGb || "")
                      ? "font-semibold text-emerald-200"
                      : "text-slate-300"
                  }
                >
                  {r.exposPubuseGb || "—"}
                </span>
                {r.mainAtchGb ? (
                  <span className="ml-1 text-white/30">({r.mainAtchGb})</span>
                ) : null}
              </td>
              <td className="px-2 py-1.5">{[r.flrGbNm, r.floorNm].filter(Boolean).join(" ") || "—"}</td>
              <td className="px-2 py-1.5">{r.etcPurps || r.mainPurps || "—"}</td>
              <td className="px-2 py-1.5">{r.structureType || r.etcStrct || "—"}</td>
              <td className="px-2 py-1.5 text-right font-semibold">{r.area ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FloorTable({
  rows,
  highlightFloor,
}: {
  rows: NonNullable<BuildingLedgerFields["floorRows"]>;
  highlightFloor?: number;
}) {
  return (
    <div className="max-h-48 overflow-auto rounded-xl border border-white/10 bg-black/25 p-3">
      <p className="mb-2 text-xs font-bold text-sky-100">층별개요 (동)</p>
      <table className="w-full min-w-[480px] text-left text-[11px] text-[#cbd5e1]">
        <thead className="sticky top-0 bg-[#0B0F19]/95">
          <tr className="text-white/40">
            <th className="px-2 py-1.5 font-medium">층</th>
            <th className="px-2 py-1.5 font-medium">용도</th>
            <th className="px-2 py-1.5 font-medium">구조</th>
            <th className="px-2 py-1.5 font-medium text-right">면적㎡</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 30).map((r, i) => {
            const hi = highlightFloor != null && r.floor === highlightFloor;
            return (
              <tr
                key={`${r.floorNm}-${r.area}-${i}`}
                className={`border-t border-white/5 ${hi ? "bg-emerald-500/10" : ""}`}
              >
                <td className="px-2 py-1.5">
                  {[r.flrGbNm, r.floorNm].filter(Boolean).join(" ") || "—"}
                </td>
                <td className="px-2 py-1.5">{r.etcPurps || r.mainPurps || "—"}</td>
                <td className="px-2 py-1.5">{r.structureType || "—"}</td>
                <td className="px-2 py-1.5 text-right font-semibold">{r.area ?? "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TagList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-3">
      <p className="mb-2 text-xs font-bold text-violet-100">{title}</p>
      <ul className="flex flex-wrap gap-1.5">
        {items.filter(Boolean).map((t) => (
          <li
            key={t}
            className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-slate-200"
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExtrasBox({ extras }: { extras: Record<string, string | number> }) {
  const entries = Object.entries(extras).slice(0, 16);
  if (!entries.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-3">
      <p className="mb-2 text-xs font-bold text-white/70">기타 원문 필드</p>
      <div className="grid gap-1 sm:grid-cols-2">
        {entries.map(([k, v]) => (
          <div
            key={k}
            className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.03] px-2 py-1 text-[10px]"
          >
            <span className="text-white/35">{k}</span>
            <span className="font-medium text-slate-200">{String(v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewBox({
  title,
  rows,
  onApply,
  applyLabel,
}: {
  title: string;
  rows: [string, string | number | undefined][];
  onApply?: () => void;
  applyLabel?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-3">
      <p className="mb-2 text-xs font-bold text-white">{title}</p>
      <div className="grid gap-1.5 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.03] px-2 py-1.5 text-[11px]"
          >
            <span className="text-white/40">{k}</span>
            <span className="font-semibold text-slate-100">
              {v == null || v === "" ? "—" : String(v)}
            </span>
          </div>
        ))}
      </div>
      {onApply && (
        <button
          type="button"
          onClick={onApply}
          className="mt-3 rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-100"
        >
          {applyLabel || "폼에 적용"}
        </button>
      )}
    </div>
  );
}
