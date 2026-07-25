"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Database,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { DataTable } from "@/components/ui/DataTable";
import {
  TX_DEAL_TYPES,
  TX_PROPERTY_TABS,
  TX_REGION_TREE,
  buildCoverageSummary,
  dealLabel,
  formatYmDot,
  formatYmRangeDot,
  listYmBetween,
  propertyLabel,
  ymOptions,
  type CoverageCell,
  type TxDealType,
  type TxPropertyType,
} from "@/lib/mockup/transactions-sample";

const YM_OPTIONS = ymOptions();
const SELECT_CLS =
  "rounded-lg border border-white/10 bg-black/30 px-2.5 py-2 text-xs text-landing-text outline-none focus:border-blue-400/40";

type LawdCodeRow = { lawd_cd: string; sido: string; sigungu: string };

type CoverageApiRow = {
  lawd_cd: string;
  property_type: string;
  transaction_type: string;
  status: string;
  row_count: number;
  last_synced_at?: string | null;
  regionLabel?: string;
  dealYm: string;
};

function RegionCascade(props: {
  sido: string;
  sigungu: string;
  onSido: (v: string) => void;
  onSigungu: (v: string) => void;
}) {
  const sidoNode = TX_REGION_TREE.find((s) => s.code === props.sido);
  const sggList = sidoNode?.children ?? [];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className={SELECT_CLS}
        value={props.sido}
        onChange={(e) => {
          props.onSido(e.target.value);
          props.onSigungu("");
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
        onChange={(e) => props.onSigungu(e.target.value)}
      >
        <option value="">시군구 전체</option>
        {sggList.map((s) => (
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
    <div className="flex flex-wrap items-center gap-2 text-xs text-landing-muted">
      <span>수집 기간</span>
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
      <span className="font-semibold text-[#a5b4fc]">
        {formatYmRangeDot(props.startYm, props.endYm)}
      </span>
    </div>
  );
}

function mapCoverage(rows: CoverageApiRow[]): CoverageCell[] {
  return rows.map((c) => ({
    lawdCd: String(c.lawd_cd).trim(),
    regionLabel: c.regionLabel || String(c.lawd_cd),
    propertyType: c.property_type as TxPropertyType,
    dealType: c.transaction_type as TxDealType,
    dealYm: c.dealYm,
    status: (c.status === "empty" || c.status === "collected" || c.status === "missing"
      ? c.status
      : "missing") as CoverageCell["status"],
    rowCount: Number(c.row_count) || 0,
    lastSyncedAt: c.last_synced_at
      ? String(c.last_synced_at).slice(0, 16).replace("T", " ")
      : undefined,
  }));
}

function resolveLawdCds(
  sido: string,
  sigungu: string,
  allLawd: LawdCodeRow[],
): string[] {
  if (sigungu) return [sigungu];
  if (sido) {
    const node = TX_REGION_TREE.find((s) => s.code === sido);
    const fromTree = (node?.children ?? []).map((c) => c.code);
    if (fromTree.length) return fromTree;
    return allLawd
      .filter((l) => {
        const sidoName = TX_REGION_TREE.find((s) => s.code === sido)?.name;
        return sidoName ? l.sido === sidoName : false;
      })
      .map((l) => l.lawd_cd);
  }
  return allLawd.map((l) => l.lawd_cd);
}

export function AdminTransactionsCollectClient() {
  const [startYm, setStartYm] = useState("2026-01");
  const [endYm, setEndYm] = useState("2026-06");
  const [sido, setSido] = useState("44");
  const [sigungu, setSigungu] = useState("44800");
  const [collectTypes, setCollectTypes] = useState<TxPropertyType[]>(["APT"]);
  const [collectDeals, setCollectDeals] = useState<TxDealType[]>(["SALE", "RENT"]);
  const [gapOnly, setGapOnly] = useState(true);
  const [autoCollect, setAutoCollect] = useState(false);
  const [autoCadence, setAutoCadence] = useState<"weekly" | "monthly">("weekly");
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  const [coverage, setCoverage] = useState<CoverageCell[]>([]);
  const [lawdCodes, setLawdCodes] = useState<LawdCodeRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncNote, setSyncNote] = useState(
    "미수집 기간만 수집하는 것이 기본입니다.",
  );
  const [settingsMsg, setSettingsMsg] = useState("");

  const targetLawdCds = useMemo(
    () => resolveLawdCds(sido, sigungu, lawdCodes),
    [sido, sigungu, lawdCodes],
  );

  const coverageSummary = useMemo(
    () =>
      buildCoverageSummary(
        coverage,
        startYm,
        endYm,
        targetLawdCds.length ? targetLawdCds : null,
        collectTypes.length ? collectTypes : ["APT"],
        collectDeals.length ? collectDeals : ["SALE"],
      ),
    [coverage, startYm, endYm, targetLawdCds, collectTypes, collectDeals],
  );

  const gapStats = useMemo(() => {
    const missingCells = coverageSummary.reduce(
      (n, r) => n + r.missingMonths.length,
      0,
    );
    const rowsWithGap = coverageSummary.filter((r) => r.missingMonths.length > 0)
      .length;
    return { missingCells, rowsWithGap };
  }, [coverageSummary]);

  const regionLabel = useMemo(() => {
    if (sigungu) {
      const s = TX_REGION_TREE.find((x) => x.code === sido);
      const g = s?.children?.find((c) => c.code === sigungu);
      return g ? `${s?.name ?? ""} ${g.name}`.trim() : sigungu;
    }
    if (sido) {
      return TX_REGION_TREE.find((x) => x.code === sido)?.name ?? sido;
    }
    return "전국";
  }, [sido, sigungu]);

  const loadCoverage = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ startYm, endYm });
      // 요청용 lawd: 트리 기준. 전국(시/도 미선택)은 파라미터 생략 → API가 lawdCodes 전체 반환
      if (sigungu) {
        params.set("lawdCds", sigungu);
      } else if (sido) {
        const cds = (TX_REGION_TREE.find((s) => s.code === sido)?.children ?? []).map(
          (c) => c.code,
        );
        if (cds.length) params.set("lawdCds", cds.join(","));
      }
      if (collectTypes.length) params.set("propertyTypes", collectTypes.join(","));
      if (collectDeals.length) params.set("dealTypes", collectDeals.join(","));

      const res = await fetch(`/api/admin/transactions/coverage?${params}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "커버리지 조회 실패");
        setCoverage([]);
        return;
      }
      setCoverage(mapCoverage((data.coverage ?? []) as CoverageApiRow[]));
      if (Array.isArray(data.lawdCodes)) {
        const next = data.lawdCodes as LawdCodeRow[];
        setLawdCodes((prev) => {
          if (
            prev.length === next.length &&
            prev.every((p, i) => p.lawd_cd === next[i]?.lawd_cd)
          ) {
            return prev;
          }
          return next;
        });
      }
    } catch {
      setError("네트워크 오류로 커버리지를 불러오지 못했습니다.");
      setCoverage([]);
    } finally {
      setLoading(false);
    }
  }, [startYm, endYm, sido, sigungu, collectTypes, collectDeals]);

  useEffect(() => {
    void loadCoverage();
  }, [loadCoverage]);

  useEffect(() => {
    let cancelled = false;
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/transactions/settings", {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok || cancelled) return;
        const s = data.settings ?? {};
        setAutoCollect(Boolean(s.auto_collect));
        setAutoCadence(s.cadence === "monthly" ? "monthly" : "weekly");
        setSettingsLoaded(true);
      } catch {
        if (!cancelled) setSettingsLoaded(true);
      }
    }
    void loadSettings();
    return () => {
      cancelled = true;
    };
  }, []);

  async function persistSettings(
    nextAuto: boolean,
    nextCadence: "weekly" | "monthly",
  ) {
    setSettingsMsg("");
    try {
      const res = await fetch("/api/admin/transactions/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          autoCollect: nextAuto,
          cadence: nextCadence,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSettingsMsg(data.error ?? "설정 저장 실패");
        return;
      }
      setSettingsMsg("자동 수집 설정이 저장되었습니다.");
    } catch {
      setSettingsMsg("설정 저장 중 네트워크 오류");
    }
  }

  async function runSync(forceAll = false) {
    const types = collectTypes.length ? collectTypes : (["APT"] as TxPropertyType[]);
    const deals = collectDeals.length ? collectDeals : (["SALE"] as TxDealType[]);
    const lawds = resolveLawdCds(sido, sigungu, lawdCodes);
    if (!lawds.length) {
      setSyncNote("수집할 시군구(lawdCd)가 없습니다. 지역을 선택하거나 lawd_codes를 확인하세요.");
      return;
    }

    setSyncing(true);
    setError("");
    setSyncNote(
      forceAll || !gapOnly
        ? `전체 ${lawds.length}개 시군구 재수집 중…`
        : `갭만 수집 중… (시군구 ${lawds.length})`,
    );

    try {
      const res = await fetch("/api/admin/transactions/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lawdCds: lawds,
          propertyTypes: types,
          dealTypes: deals,
          startYm,
          endYm,
          gapOnly: forceAll ? false : gapOnly,
          regionLabel,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "수집 실패");
        setSyncNote(data.error ?? "수집 실패");
        return;
      }
      const errN = Array.isArray(data.errors) ? data.errors.length : 0;
      setSyncNote(
        `완료 · 슬롯 ${data.slotsOk ?? 0}/${data.slotsTotal ?? 0} · 저장 ${data.rowsUpserted ?? 0}건` +
          (errN ? ` · 오류 ${errN}건` : ""),
      );
      if (errN && data.errors?.[0]) {
        setError(String(data.errors[0]));
      }
      await loadCoverage();
    } catch {
      setError("수집 요청 중 네트워크 오류");
      setSyncNote("수집 요청 중 네트워크 오류");
    } finally {
      setSyncing(false);
    }
  }

  function toggleCollectType(id: TxPropertyType) {
    setCollectTypes((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function toggleCollectDeal(id: TxDealType) {
    setCollectDeals((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <main className="space-y-5 p-6 md:p-10">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#c4b5fd]">
          Collect · Coverage
        </p>
        <h1 className="mt-1 flex items-center gap-2 text-2xl font-extrabold text-landing-text">
          <Database className="h-7 w-7 text-blue-400" aria-hidden />
          실거래가 수집
        </h1>
        <p className="mt-1 text-sm text-landing-muted">
          지역·종류·거래유형·연월별 수집 현황을 보고, 미수집 기간만 추가 수집합니다.
        </p>
      </header>

      {error ? (
        <GlassCard className="border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-100">
          {error}
        </GlassCard>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <GlassCard className="p-4">
          <p className="text-[11px] text-landing-muted">현황 행</p>
          <p className="mt-1 text-xl font-extrabold">{coverageSummary.length}</p>
          <p className="text-[11px] text-white/40">지역×종류×거래유형</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-[11px] text-landing-muted">미수집 연월 슬롯</p>
          <p className="mt-1 text-xl font-extrabold text-rose-300">
            {gapStats.missingCells}
          </p>
          <p className="text-[11px] text-white/40">
            갭 있는 조합 {gapStats.rowsWithGap}개
          </p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-[11px] text-landing-muted">자동 수집</p>
          <p className="mt-1 text-xl font-extrabold">
            {autoCollect ? "ON" : "OFF"}
          </p>
          <p className="text-[11px] text-white/40">
            {autoCollect
              ? `${autoCadence === "weekly" ? "매주" : "매월"} · 갭만`
              : "수동만"}
          </p>
        </GlassCard>
      </div>

      <GlassCard className="space-y-4 p-4 md:p-5">
        <p className="text-sm font-bold text-landing-text">현황 필터 · 수집 범위</p>
        <YearMonthRange
          startYm={startYm}
          endYm={endYm}
          onStart={setStartYm}
          onEnd={setEndYm}
        />
        <RegionCascade
          sido={sido}
          sigungu={sigungu}
          onSido={setSido}
          onSigungu={setSigungu}
        />
        <p className="text-[11px] text-white/40">
          시군구 단위(5자리 lawdCd)로 수집합니다. 시/도만 선택하면 하위 시군구 전체,
          미선택 시 lawd_codes 전체를 대상으로 합니다.
        </p>

        <div>
          <p className="mb-1.5 text-[11px] text-landing-muted">부동산 종류</p>
          <div className="flex flex-wrap gap-1.5">
            {TX_PROPERTY_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleCollectType(t.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  collectTypes.includes(t.id)
                    ? "bg-gradient-to-r from-cta-from/40 to-cta-to/40 text-white"
                    : "bg-white/5 text-landing-muted"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[11px] text-landing-muted">거래 유형</p>
          <div className="flex flex-wrap gap-1.5">
            {TX_DEAL_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleCollectDeal(t.id)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                  collectDeals.includes(t.id)
                    ? "border-blue-400/50 bg-blue-500/20 text-blue-100"
                    : "border-white/10 text-landing-muted"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-200">
          <input
            type="checkbox"
            checked={gapOnly}
            onChange={(e) => setGapOnly(e.target.checked)}
            className="rounded border-white/20"
          />
          미수집 기간만 수집 (권장 · 이미 수집된 연월 건너뜀)
        </label>

        <div className="rounded-xl border border-white/10 bg-black/25 p-3">
          <div className="flex flex-wrap items-center gap-3">
            <CalendarClock className="h-4 w-4 text-[#c4b5fd]" aria-hidden />
            <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-200">
              <input
                type="checkbox"
                checked={autoCollect}
                disabled={!settingsLoaded}
                onChange={(e) => {
                  const next = e.target.checked;
                  setAutoCollect(next);
                  void persistSettings(next, autoCadence);
                }}
                className="rounded border-white/20"
              />
              자동 수집 사용 (선택)
            </label>
            <select
              disabled={!autoCollect || !settingsLoaded}
              value={autoCadence}
              onChange={(e) => {
                const next = e.target.value as "weekly" | "monthly";
                setAutoCadence(next);
                void persistSettings(autoCollect, next);
              }}
              className="rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-landing-text disabled:opacity-40"
            >
              <option value="weekly">매주 (최근 3개월 갭)</option>
              <option value="monthly">매월 (최근 3개월 갭)</option>
            </select>
          </div>
          {settingsMsg ? (
            <p className="mt-2 text-[11px] text-sky-200/80">{settingsMsg}</p>
          ) : (
            <p className="mt-2 text-[11px] text-white/40">
              설정은 서버에 저장됩니다. 스케줄러는 갭만 채웁니다.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void runSync(false)}
            disabled={
              syncing || collectTypes.length === 0 || collectDeals.length === 0
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cta-from to-cta-to px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`}
              aria-hidden
            />
            {syncing
              ? "수집 중…"
              : gapOnly
                ? `미수집분 수집 (${gapStats.missingCells})`
                : "수집 실행"}
          </button>
          <button
            type="button"
            onClick={() => void runSync(true)}
            disabled={syncing}
            className="rounded-full border border-white/15 px-3 py-2 text-[11px] text-landing-muted hover:bg-white/5"
          >
            강제 전체 재수집
          </button>
          <button
            type="button"
            onClick={() => void loadCoverage()}
            disabled={loading || syncing}
            className="rounded-full border border-white/15 px-3 py-2 text-[11px] text-landing-muted hover:bg-white/5"
          >
            현황 새로고침
          </button>
          <p className="text-[11px] text-white/45">{syncNote}</p>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
          <p className="text-sm font-bold text-landing-text">
            수집 현황{" "}
            <span className="font-normal text-landing-muted">
              {formatYmRangeDot(startYm, endYm)}
              {loading ? " · 불러오는 중…" : ""}
            </span>
          </p>
          <div className="flex gap-3 text-[10px] text-landing-muted">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" /> 수집됨
            </span>
            <span className="inline-flex items-center gap-1">
              <XCircle className="h-3 w-3 text-rose-400" /> 미수집
            </span>
            <span className="text-white/35">회색 = 수집·0건</span>
          </div>
        </div>
        <DataTable maxHeight="440px" className="rounded-none border-0">
          <table className="data-table w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2.5">지역</th>
                <th className="px-3 py-2.5">종류</th>
                <th className="px-3 py-2.5">거래</th>
                <th className="px-3 py-2.5">커버리지</th>
                <th className="px-3 py-2.5">연월 현황</th>
                <th className="px-3 py-2.5">건수</th>
                <th className="px-3 py-2.5">미수집</th>
              </tr>
            </thead>
            <tbody>
              {coverageSummary.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-8 text-center text-landing-muted"
                  >
                    {loading
                      ? "불러오는 중…"
                      : "종류·거래유형을 선택하거나 지역을 조정하세요."}
                  </td>
                </tr>
              ) : (
                coverageSummary.map((row) => {
                  const months = listYmBetween(startYm, endYm);
                  return (
                    <tr key={`${row.lawdCd}-${row.propertyType}-${row.dealType}`}>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {row.regionLabel}
                      </td>
                      <td className="px-3 py-2.5">
                        {propertyLabel(row.propertyType)}
                      </td>
                      <td className="px-3 py-2.5">{dealLabel(row.dealType)}</td>
                      <td className="px-3 py-2.5">
                        <span
                          className={
                            row.coveragePct === 100
                              ? "text-emerald-300"
                              : row.coveragePct === 0
                                ? "text-rose-300"
                                : "text-amber-200"
                          }
                        >
                          {row.coveragePct}%
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {months.map((ym) => {
                            const miss = row.missingMonths.includes(ym);
                            const empty = row.emptyMonths.includes(ym);
                            return (
                              <span
                                key={ym}
                                title={
                                  miss
                                    ? `${formatYmDot(ym)} 미수집`
                                    : empty
                                      ? `${formatYmDot(ym)} 수집·0건`
                                      : `${formatYmDot(ym)} 수집됨`
                                }
                                className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                                  miss
                                    ? "bg-rose-500/25 text-rose-100"
                                    : empty
                                      ? "bg-white/10 text-white/45"
                                      : "bg-emerald-500/20 text-emerald-100"
                                }`}
                              >
                                {formatYmDot(ym)}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        {row.totalRows.toLocaleString()}
                      </td>
                      <td className="px-3 py-2.5 text-[11px] text-rose-200/90">
                        {row.missingMonths.length
                          ? row.missingMonths.map(formatYmDot).join(", ")
                          : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </DataTable>
      </GlassCard>
    </main>
  );
}
