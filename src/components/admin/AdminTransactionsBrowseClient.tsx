"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Download,
  FileSpreadsheet,
  MapPin,
  Search,
  TrendingUp,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { DataTable } from "@/components/ui/DataTable";
import {
  TX_DEAL_TYPES,
  TX_PROPERTY_TABS,
  TX_REGION_TREE,
  buildSpreadsheetMl,
  escapeCsvCell,
  formatKrwMan,
  formatYmDot,
  formatYmRangeDot,
  getDetailColumns,
  pricePerSqm,
  ymOptions,
  type SampleTransaction,
  type TxDealType,
  type TxPropertyType,
} from "@/lib/mockup/transactions-sample";

const YM_OPTIONS = ymOptions();
const SELECT_CLS =
  "rounded-lg border border-white/10 bg-black/30 px-2.5 py-2 text-xs text-landing-text outline-none focus:border-blue-400/40";

type ApiTxRow = {
  id: string;
  property_type: string;
  transaction_type: string;
  lawd_cd: string;
  deal_date: string;
  building_name?: string;
  jibun?: string;
  road_name?: string;
  umd_nm?: string;
  floor?: string | null;
  excl_area?: number | null;
  land_area?: number | null;
  deal_amount?: number | null;
  deposit_amount?: number | null;
  monthly_rent?: number | null;
  build_year?: number | null;
  dealing_gbn?: string;
  cancelled?: boolean;
  sido?: string;
  sigungu?: string;
  regionLabel?: string;
  raw_details?: Record<string, unknown> | null;
};

function RegionCascade(props: {
  sido: string;
  sigungu: string;
  eupmyeondong: string;
  onSido: (v: string) => void;
  onSigungu: (v: string) => void;
  onEmd: (v: string) => void;
}) {
  const sidoNode = TX_REGION_TREE.find((s) => s.code === props.sido);
  const sggList = sidoNode?.children ?? [];
  const sggNode = sggList.find((s) => s.code === props.sigungu);
  const emdList = sggNode?.children ?? [];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <MapPin className="h-3.5 w-3.5 text-landing-muted" aria-hidden />
      <select
        className={SELECT_CLS}
        value={props.sido}
        onChange={(e) => {
          props.onSido(e.target.value);
          props.onSigungu("");
          props.onEmd("");
        }}
      >
        <option value="">시/도 전체(전국)</option>
        {TX_REGION_TREE.map((s) => (
          <option key={s.code} value={s.code}>
            {s.name}
          </option>
        ))}
      </select>
      <select
        className={SELECT_CLS}
        value={props.sigungu}
        disabled={!props.sido}
        onChange={(e) => {
          props.onSigungu(e.target.value);
          props.onEmd("");
        }}
      >
        <option value="">시군구 전체</option>
        {sggList.map((s) => (
          <option key={s.code} value={s.code}>
            {s.name}
          </option>
        ))}
      </select>
      <select
        className={SELECT_CLS}
        value={props.eupmyeondong}
        disabled={!props.sigungu}
        onChange={(e) => props.onEmd(e.target.value)}
      >
        <option value="">읍면동 전체</option>
        {emdList.map((s) => (
          <option key={s.code} value={s.code}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function YearMonthRange(props: {
  startYm: string;
  endYm: string;
  onStart: (v: string) => void;
  onEnd: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 text-xs text-landing-muted">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-landing-text">수집기간</span>
        <select
          className={SELECT_CLS}
          value={props.startYm}
          onChange={(e) => props.onStart(e.target.value)}
        >
          {YM_OPTIONS.map((ym) => (
            <option key={`s-${ym}`} value={ym}>
              {ym.replace("-", "년 ")}월
            </option>
          ))}
        </select>
        <span>~</span>
        <select
          className={SELECT_CLS}
          value={props.endYm}
          onChange={(e) => props.onEnd(e.target.value)}
        >
          {YM_OPTIONS.map((ym) => (
            <option key={`e-${ym}`} value={ym}>
              {ym.replace("-", "년 ")}월
            </option>
          ))}
        </select>
      </div>
      <p className="font-semibold tracking-wide text-[#a5b4fc]">
        {formatYmRangeDot(props.startYm, props.endYm)}
      </p>
    </div>
  );
}

function resolveLawdCds(sido: string, sigungu: string): string[] {
  if (sigungu) return [sigungu];
  if (sido) {
    const node = TX_REGION_TREE.find((s) => s.code === sido);
    return (node?.children ?? []).map((c) => c.code);
  }
  return [];
}

function mapApiRow(r: ApiTxRow): SampleTransaction {
  const raw = (r.raw_details ?? {}) as Record<string, unknown>;
  const floorRaw = r.floor;
  const floorNum =
    floorRaw == null || floorRaw === "" ? null : Number(floorRaw);
  const str = (k: string) =>
    typeof raw[k] === "string" ? (raw[k] as string) : undefined;
  const num = (k: string) =>
    typeof raw[k] === "number" ? (raw[k] as number) : undefined;

  return {
    id: r.id,
    propertyType: r.property_type as TxPropertyType,
    dealType: r.transaction_type as TxDealType,
    sido: r.sido || "",
    sigungu: r.sigungu || "",
    eupmyeondong: r.umd_nm || "",
    lawdCd: String(r.lawd_cd).trim(),
    regionLabel: r.regionLabel || String(r.lawd_cd),
    dealDate: String(r.deal_date || "").slice(0, 10),
    buildingName: r.building_name || "",
    jibun: r.jibun || "",
    roadName: r.road_name || undefined,
    floor: Number.isFinite(floorNum as number) ? (floorNum as number) : null,
    exclArea: Number(r.excl_area) || 0,
    landArea: r.land_area != null ? Number(r.land_area) : undefined,
    dealAmount: Number(r.deal_amount) || 0,
    deposit: Number(r.deposit_amount) || 0,
    monthlyRent: Number(r.monthly_rent) || 0,
    buildYear: r.build_year ?? null,
    dealingGbn: r.dealing_gbn || "",
    cancelled: Boolean(r.cancelled),
    contractTerm: str("contractTerm") || str("계약기간"),
    useRRRight: str("useRRRight") || str("갱신요구권"),
    buildingUse: str("buildingUse") || str("건물용도"),
    jimok: str("jimok") || str("지목"),
    landUse: str("landUse") || str("용도지역"),
    aptDong: str("aptDong") || str("동"),
    rgstDate: str("rgstDate") || str("등기일자"),
    plotAr: num("plotAr"),
  };
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminTransactionsBrowseClient() {
  const [propertyType, setPropertyType] = useState<TxPropertyType>("APT");
  const [dealType, setDealType] = useState<TxDealType>("SALE");
  const [startYm, setStartYm] = useState("2026-01");
  const [endYm, setEndYm] = useState("2026-06");
  const [sido, setSido] = useState("44");
  const [sigungu, setSigungu] = useState("44800");
  const [eupmyeondong, setEupmyeondong] = useState("");
  const [q, setQ] = useState("");
  const [qDebounced, setQDebounced] = useState("");

  const [rows, setRows] = useState<SampleTransaction[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setQDebounced(q.trim()), 300);
    return () => window.clearTimeout(t);
  }, [q]);

  const columns = useMemo(
    () => getDetailColumns(propertyType, dealType),
    [propertyType, dealType],
  );

  const emdName = useMemo(() => {
    if (!eupmyeondong) return "";
    return (
      TX_REGION_TREE.find((s) => s.code === sido)
        ?.children?.find((c) => c.code === sigungu)
        ?.children?.find((c) => c.code === eupmyeondong)?.name ?? ""
    );
  }, [sido, sigungu, eupmyeondong]);

  const filtered = useMemo(() => {
    if (!emdName) return rows;
    return rows.filter((r) => r.eupmyeondong === emdName);
  }, [rows, emdName]);

  const activeRows = filtered.filter((r) => !r.cancelled);

  const kpi = useMemo(() => {
    if (activeRows.length === 0) {
      return { avg: 0, max: 0, volume: 0, perSqm: 0 };
    }
    const amounts = activeRows.map((r) =>
      dealType === "RENT" ? r.deposit + r.monthlyRent * 100 : r.dealAmount,
    );
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const max = Math.max(...amounts);
    const perList = activeRows
      .map((r) => pricePerSqm(r))
      .filter((v): v is number => v != null);
    const perSqm =
      perList.length > 0
        ? perList.reduce((a, b) => a + b, 0) / perList.length
        : 0;
    return { avg, max, volume: activeRows.length, perSqm };
  }, [activeRows, dealType]);

  const loadList = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const lawdCds = resolveLawdCds(sido, sigungu);
      const params = new URLSearchParams({
        startYm,
        endYm,
        propertyType,
        dealType,
        limit: "500",
      });
      if (lawdCds.length) params.set("lawdCds", lawdCds.join(","));
      if (qDebounced) params.set("q", qDebounced);

      const res = await fetch(`/api/admin/transactions/list?${params}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "조회 실패");
        setRows([]);
        setTotalCount(0);
        return;
      }
      setRows(((data.rows ?? []) as ApiTxRow[]).map(mapApiRow));
      setTotalCount(Number(data.count) || 0);
    } catch {
      setError("네트워크 오류로 조회하지 못했습니다.");
      setRows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [startYm, endYm, propertyType, dealType, sido, sigungu, qDebounced]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  function downloadCsv() {
    const headers = columns.map((c) => c.label);
    const lines = filtered.map((r) =>
      columns.map((c) => escapeCsvCell(c.get(r))).join(","),
    );
    const bom = "\uFEFF";
    const blob = new Blob([bom + [headers.join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    triggerDownload(
      blob,
      `실거래가_${propertyType}_${dealType}_${formatYmDot(startYm)}_${formatYmDot(endYm)}.csv`,
    );
  }

  function downloadExcel() {
    const headers = columns.map((c) => c.label);
    const body = filtered.map((r) => columns.map((c) => c.get(r)));
    const xml = buildSpreadsheetMl("실거래가", headers, body);
    const blob = new Blob([xml], {
      type: "application/vnd.ms-excel;charset=utf-8",
    });
    triggerDownload(
      blob,
      `실거래가_${propertyType}_${dealType}_${formatYmDot(startYm)}_${formatYmDot(endYm)}.xls`,
    );
  }

  return (
    <main className="space-y-5 p-6 md:p-10">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#c4b5fd]">
            Browse · Analytics
          </p>
          <h1 className="mt-1 flex items-center gap-2 text-2xl font-extrabold text-landing-text">
            <TrendingUp className="h-7 w-7 text-blue-400" aria-hidden />
            실거래가 조회
          </h1>
          <p className="mt-1 text-sm text-landing-muted">
            Supabase에 저장된 실거래를 필터·KPI로 조회합니다. 상세 컬럼은 부동산
            종류·거래유형에 따라 달라집니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={downloadCsv}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" aria-hidden />
            CSV
          </button>
          <button
            type="button"
            onClick={downloadExcel}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-100 hover:bg-emerald-500/20 disabled:opacity-40"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden />
            Excel
          </button>
        </div>
      </header>

      {error ? (
        <GlassCard className="border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-100">
          {error}
        </GlassCard>
      ) : null}

      <GlassCard className="space-y-4 p-4 md:p-5">
        <div className="flex flex-wrap gap-1.5">
          {TX_PROPERTY_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setPropertyType(t.id);
                if (t.id !== "APT" && dealType === "RIGHT") setDealType("SALE");
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                propertyType === t.id
                  ? "bg-gradient-to-r from-cta-from/40 to-cta-to/40 text-white"
                  : "bg-white/5 text-landing-muted hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {TX_DEAL_TYPES.map((t) => {
            const disabled = t.id === "RIGHT" && propertyType !== "APT";
            return (
              <button
                key={t.id}
                type="button"
                disabled={disabled}
                onClick={() => setDealType(t.id)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold disabled:opacity-30 ${
                  dealType === t.id
                    ? "border-blue-400/50 bg-blue-500/20 text-blue-100"
                    : "border-white/10 text-landing-muted"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <YearMonthRange
          startYm={startYm}
          endYm={endYm}
          onStart={setStartYm}
          onEnd={setEndYm}
        />
        <RegionCascade
          sido={sido}
          sigungu={sigungu}
          eupmyeondong={eupmyeondong}
          onSido={setSido}
          onSigungu={setSigungu}
          onEmd={setEupmyeondong}
        />

        <label className="relative block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-landing-muted"
            aria-hidden
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="단지명 · 건물명 · 지번 검색"
            className="w-full rounded-xl border border-white/10 bg-black/30 py-2.5 pl-10 pr-3 text-sm text-landing-text outline-none placeholder:text-white/30 focus:border-blue-400/40"
          />
        </label>

        <p className="text-[11px] text-[#a5b4fc]">
          수집기간 {formatYmRangeDot(startYm, endYm)} · 컬럼{" "}
          {columns.map((c) => c.label).join(" · ")}
          {loading ? " · 불러오는 중…" : ""}
        </p>
      </GlassCard>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: dealType === "RENT" ? "평균 보증금(환산)" : "평균 실거래가",
            value: formatKrwMan(kpi.avg),
            hint: "필터 결과",
          },
          { label: "최고가", value: formatKrwMan(kpi.max), hint: "필터 결과" },
          {
            label: "거래량",
            value: `${kpi.volume}건`,
            hint: totalCount > filtered.length
              ? `표시 ${filtered.length} / 전체 ${totalCount}`
              : "취소 제외",
          },
          {
            label: "㎡당 평균",
            value: kpi.perSqm ? formatKrwMan(kpi.perSqm) : "—",
            hint: "전용면적 기준",
          },
        ].map((card) => (
          <GlassCard key={card.label} className="p-4">
            <p className="text-[11px] text-landing-muted">{card.label}</p>
            <p className="mt-1 text-xl font-extrabold text-landing-text">
              {card.value}
            </p>
            <p className="mt-1 text-[11px] font-medium text-emerald-400">
              {card.hint}
            </p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="text-sm font-bold text-landing-text">
            상세 내역{" "}
            <span className="font-normal text-landing-muted">
              {filtered.length}건 · 컬럼 {columns.length}개
            </span>
          </p>
        </div>
        <DataTable maxHeight="420px" className="rounded-none border-0">
          <table className="data-table w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="px-3 py-2.5 whitespace-nowrap">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-3 py-10 text-center text-landing-muted"
                  >
                    {loading
                      ? "불러오는 중…"
                      : "조건에 맞는 실거래가 없습니다. 수집 메뉴에서 먼저 데이터를 수집하세요."}
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr
                    key={r.id}
                    className={r.cancelled ? "opacity-50" : undefined}
                  >
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={`px-3 py-2.5 ${
                          c.key === "amount" || c.key === "rent"
                            ? "font-semibold text-[#d4bfff]"
                            : ""
                        }`}
                      >
                        {c.get(r)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </DataTable>
      </GlassCard>
    </main>
  );
}
