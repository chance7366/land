"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  KeyRound,
  LandPlot,
  Loader2,
  PenLine,
  RefreshCw,
} from "lucide-react";
import type { BuildingLedgerFields, LandLedgerFields } from "@/lib/public-data/types";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#4dabff]/50 focus:ring-1 focus:ring-[#4dabff]/30";

type Props = {
  /** Step1 주소 필드로 조회 힌트 구성 */
  addressParts: {
    sido?: string;
    sigungu?: string;
    eupmyeondong?: string;
    ri?: string;
    jibunMain?: string | number;
    jibunSub?: string | number;
  };
  onApplyBuilding: (fields: BuildingLedgerFields) => void;
  onApplyLand: (fields: LandLedgerFields) => void;
};

type LookupTab = "building" | "land";

export function PropertyLedgerLookupPanel({
  addressParts,
  onApplyBuilding,
  onApplyLand,
}: Props) {
  const addressHint = useMemo(() => {
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
  }, [addressParts]);

  const [tab, setTab] = useState<LookupTab>("building");
  const [manualOnly, setManualOnly] = useState(false);
  const [sigunguCd, setSigunguCd] = useState("");
  const [bjdongCd, setBjdongCd] = useState("");
  const [platGbCd, setPlatGbCd] = useState("0");
  const [bun, setBun] = useState(String(addressParts.jibunMain ?? ""));
  const [ji, setJi] = useState(String(addressParts.jibunSub ?? ""));
  const [pnu, setPnu] = useState("");
  const [address, setAddress] = useState(addressHint);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [buildingPreview, setBuildingPreview] = useState<BuildingLedgerFields | null>(null);
  const [landPreview, setLandPreview] = useState<LandLedgerFields | null>(null);

  function syncAddressFromForm() {
    setAddress(addressHint);
    if (addressParts.jibunMain != null && addressParts.jibunMain !== "") {
      setBun(String(addressParts.jibunMain));
    }
    if (addressParts.jibunSub != null && addressParts.jibunSub !== "") {
      setJi(String(addressParts.jibunSub));
    }
  }

  async function lookupBuilding() {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/properties/ledger/building", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sigunguCd,
          bjdongCd,
          platGbCd,
          bun,
          ji,
          pnu: pnu || undefined,
          addressHint: address || addressHint,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        fields?: BuildingLedgerFields;
        rawSummary?: string;
      };
      if (!data.ok || !data.fields) {
        setBuildingPreview(null);
        setError(data.error || "건축물대장 조회에 실패했습니다.");
        return;
      }
      setBuildingPreview(data.fields);
      setMessage(data.rawSummary || "건축물대장 조회 완료");
    } catch {
      setError("건축물대장 조회 중 네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function lookupLand() {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/properties/ledger/land", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pnu: pnu || undefined,
          address: address || addressHint || undefined,
          sigunguCd,
          bjdongCd,
          platGbCd,
          bun,
          ji,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        fields?: LandLedgerFields;
        rawSummary?: string;
      };
      if (!data.ok || !data.fields) {
        setLandPreview(null);
        setError(data.error || "토지대장 조회에 실패했습니다.");
        return;
      }
      setLandPreview(data.fields);
      if (data.fields.pnu) setPnu(data.fields.pnu);
      setMessage(data.rawSummary || "토지특성 조회 완료");
    } catch {
      setError("토지대장 조회 중 네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
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
            건축물대장(공공데이터포털) · 토지특성(브이월드)으로 면적·용도·층수 등을 채운 뒤, 아래
            필드에서 수기로 수정할 수 있습니다.
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
          API 조회를 건너뛰고 아래 상세 필드를 직접 입력하세요. 나중에 언제든 조회를 다시 켤 수
          있습니다.
        </p>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTab("building")}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${
                tab === "building"
                  ? "border-[#4dabff]/50 bg-[#4dabff]/20 text-[#cfe9ff]"
                  : "border-white/15 text-white/55"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              건축물대장
            </button>
            <button
              type="button"
              onClick={() => setTab("land")}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${
                tab === "land"
                  ? "border-[#a78bfa]/50 bg-[#a78bfa]/20 text-[#ddd6fe]"
                  : "border-white/15 text-white/55"
              }`}
            >
              <LandPlot className="h-3.5 w-3.5" />
              토지대장
            </button>
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
            <label className="text-[11px] text-white/45">
              조회 주소
              <input
                className={`${inputClass} mt-1`}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="충청남도 홍성군 … 본번-부번"
              />
            </label>
            <label className="text-[11px] text-white/45">
              PNU (19자리, 선택)
              <input
                className={`${inputClass} mt-1`}
                value={pnu}
                onChange={(e) => setPnu(e.target.value)}
                placeholder="시군구5+법정동5+대지1+본번4+부번4"
              />
            </label>
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
                placeholder="예: 44800"
              />
            </label>
            <label className="text-[11px] text-white/45">
              법정동코드 (5)
              <input
                className={`${inputClass} mt-1`}
                value={bjdongCd}
                onChange={(e) => setBjdongCd(e.target.value)}
                placeholder="예: 25000"
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

          <div className="flex flex-wrap gap-2">
            {tab === "building" ? (
              <button
                type="button"
                disabled={loading}
                onClick={lookupBuilding}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Building2 className="h-3.5 w-3.5" />}
                건축물대장 조회 (공공데이터)
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={lookupLand}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LandPlot className="h-3.5 w-3.5" />}
                토지특성 조회 (브이월드)
              </button>
            )}
          </div>

          {error && (
            <p className="mt-3 rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
              {error}
              <span className="mt-1 block text-[10px] text-amber-100/60">
                키가 없거나 조회가 실패해도 아래 필드는 수기 입력할 수 있습니다.
              </span>
            </p>
          )}
          {message && !error && (
            <p className="mt-3 text-xs text-sky-100/80">{message}</p>
          )}

          {tab === "building" && buildingPreview && (
            <PreviewBox
              title="건축물대장 미리보기"
              rows={[
                ["건물명", buildingPreview.buildingName],
                ["주용도", buildingPreview.buildingUse],
                ["연면적/전용", buildingPreview.totalFloorArea ?? buildingPreview.exclusiveArea],
                ["대지면적", buildingPreview.landShareArea],
                ["지상층수", buildingPreview.totalFloors],
                ["사용승인일", buildingPreview.useApprovalDate],
                ["주차", buildingPreview.totalParking],
              ]}
              onApply={() => onApplyBuilding(buildingPreview)}
            />
          )}

          {tab === "land" && landPreview && (
            <PreviewBox
              title="토지특성 미리보기"
              rows={[
                ["PNU", landPreview.pnu],
                ["면적", landPreview.exclusiveArea],
                ["지목", landPreview.landCategory],
                ["용도지역", landPreview.zoning],
                ["도로접면", landPreview.roadAccess],
                ["지형", landPreview.terrain],
                ["형상", landPreview.landShape],
                ["이용상황", landPreview.landUseStatus],
                ["공시지가", landPreview.officialLandPrice],
              ]}
              onApply={() => onApplyLand(landPreview)}
            />
          )}
        </>
      )}
    </div>
  );
}

function PreviewBox({
  title,
  rows,
  onApply,
}: {
  title: string;
  rows: [string, string | number | undefined][];
  onApply: () => void;
}) {
  return (
    <div className="mt-3 rounded-xl border border-white/10 bg-black/25 p-3">
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
      <button
        type="button"
        onClick={onApply}
        className="mt-3 rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-100"
      >
        폼에 적용 (이후 수기 수정 가능)
      </button>
    </div>
  );
}
