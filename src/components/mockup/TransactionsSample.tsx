"use client";

/**
 * 실거래가 목업 — 수집 / 조회 메뉴 분리. 운영 미적용.
 * 예정: /admin/transactions/sync · /admin/transactions
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Building2,
  CalendarClock,
  CheckCircle2,
  Database,
  Download,
  FileSpreadsheet,
  Gavel,
  MapPin,
  RefreshCw,
  Search,
  TrendingUp,
  XCircle,
} from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { DataTable } from "@/components/ui/DataTable";
import {
  TX_DEAL_TYPES,
  TX_INITIAL_COVERAGE,
  TX_PHASE1_CHECKLIST,
  TX_PHASE2_TASKS,
  TX_PHASE3_TASKS,
  TX_PROPERTY_TABS,
  TX_REGION_TREE,
  TX_SAMPLE_MONTHLY,
  TX_SAMPLE_ROWS,
  TX_SAMPLE_SYNC_LOGS,
  buildCoverageSummary,
  buildSpreadsheetMl,
  coverageKey,
  dealLabel,
  escapeCsvCell,
  formatKrwMan,
  formatYmDot,
  formatYmRangeDot,
  getDetailColumns,
  listYmBetween,
  pricePerSqm,
  propertyLabel,
  ymOptions,
  type CoverageCell,
  type TxDealType,
  type TxPropertyType,
} from "@/lib/mockup/transactions-sample";

type MenuMode = "collect" | "browse";

const YM_OPTIONS = ymOptions();

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

  const selectCls =
    "rounded-lg border border-white/10 bg-black/30 px-2.5 py-2 text-xs text-landing-text outline-none focus:border-blue-400/40";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <MapPin className="h-3.5 w-3.5 text-landing-muted" aria-hidden />
      <select
        className={selectCls}
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
        className={selectCls}
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
        className={selectCls}
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
  const selectCls =
    "rounded-lg border border-white/10 bg-black/30 px-2.5 py-2 text-xs text-landing-text outline-none focus:border-blue-400/40";
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-landing-muted">
      <span>수집·조회 기간</span>
      <select
        className={selectCls}
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
        className={selectCls}
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

export function TransactionsSample() {
  const [menu, setMenu] = useState<MenuMode>("collect");

  const [propertyType, setPropertyType] = useState<TxPropertyType>("APT");
  const [dealType, setDealType] = useState<TxDealType>("SALE");
  const [startYm, setStartYm] = useState("2026-01");
  const [endYm, setEndYm] = useState("2026-06");
  const [sido, setSido] = useState("44");
  const [sigungu, setSigungu] = useState("44800");
  const [eupmyeondong, setEupmyeondong] = useState("");
  const [q, setQ] = useState("");

  const [collectTypes, setCollectTypes] = useState<TxPropertyType[]>(["APT"]);
  const [collectDeals, setCollectDeals] = useState<TxDealType[]>(["SALE", "RENT"]);
  const [coverage, setCoverage] = useState<CoverageCell[]>(() => [
    ...TX_INITIAL_COVERAGE,
  ]);
  const [gapOnly, setGapOnly] = useState(true);
  const [autoCollect, setAutoCollect] = useState(false);
  const [autoCadence, setAutoCadence] = useState<"weekly" | "monthly">("weekly");
  const [syncing, setSyncing] = useState(false);
  const [syncNote, setSyncNote] = useState(
    "갭(미수집 연월)만 수집하는 것이 기본입니다 · Supabase 저장은 운영 적용 시",
  );
  const [lastGapList, setLastGapList] = useState<string[]>([]);

  const columns = useMemo(
    () => getDetailColumns(propertyType, dealType),
    [propertyType, dealType],
  );

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    const sidoName = TX_REGION_TREE.find((s) => s.code === sido)?.name;
    const sggName = TX_REGION_TREE.find((s) => s.code === sido)?.children?.find(
      (c) => c.code === sigungu,
    )?.name;
    const emdName = TX_REGION_TREE.find((s) => s.code === sido)
      ?.children?.find((c) => c.code === sigungu)
      ?.children?.find((c) => c.code === eupmyeondong)?.name;

    return TX_SAMPLE_ROWS.filter((r) => {
      if (r.propertyType !== propertyType) return false;
      if (r.dealType !== dealType) return false;
      const ym = r.dealDate.slice(0, 7);
      if (ym < startYm || ym > endYm) return false;
      if (sido && r.sido !== sidoName) return false;
      if (sigungu && r.sigungu !== sggName) return false;
      if (eupmyeondong && r.eupmyeondong !== emdName) return false;
      if (qq) {
        const hay = `${r.buildingName} ${r.jibun} ${r.regionLabel}`.toLowerCase();
        if (!hay.includes(qq)) return false;
      }
      return true;
    });
  }, [
    propertyType,
    dealType,
    startYm,
    endYm,
    sido,
    sigungu,
    eupmyeondong,
    q,
  ]);

  const activeRows = filtered.filter((r) => !r.cancelled);

  const kpi = useMemo(() => {
    if (activeRows.length === 0) {
      return { avg: 0, max: 0, volume: 0, perSqm: 0, deltaPct: 0 };
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
    return { avg, max, volume: activeRows.length, perSqm, deltaPct: 4.2 };
  }, [activeRows, dealType]);

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
      `실거래가_${propertyType}_${dealType}_${startYm}_${endYm}.csv`,
    );
  }

  function downloadExcel() {
    const headers = columns.map((c) => c.label);
    const rows = filtered.map((r) => columns.map((c) => c.get(r)));
    const xml = buildSpreadsheetMl("실거래가", headers, rows);
    const blob = new Blob([xml], {
      type: "application/vnd.ms-excel;charset=utf-8",
    });
    triggerDownload(
      blob,
      `실거래가_${propertyType}_${dealType}_${startYm}_${endYm}.xls`,
    );
  }

  function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const targetLawdCds = useMemo(() => {
    if (sigungu) return [sigungu];
    if (sido) {
      const node = TX_REGION_TREE.find((s) => s.code === sido);
      return (node?.children ?? []).map((c) => c.code);
    }
    // 전국 목업: 커버리지에 있는 시군구 + 트리 일부
    const set = new Set(coverage.map((c) => c.lawdCd));
    for (const s of TX_REGION_TREE) {
      for (const g of s.children ?? []) set.add(g.code);
    }
    return [...set].slice(0, 12);
  }, [sido, sigungu, coverage]);

  const coverageSummary = useMemo(
    () =>
      buildCoverageSummary(
        coverage,
        startYm,
        endYm,
        targetLawdCds,
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

  function runMockSync(forceAll = false) {
    const onlyGaps = forceAll ? false : gapOnly;
    const months = listYmBetween(startYm, endYm);
    const types = collectTypes.length ? collectTypes : (["APT"] as TxPropertyType[]);
    const deals = collectDeals.length ? collectDeals : (["SALE"] as TxDealType[]);

    const gaps: string[] = [];
    const toFill: CoverageCell[] = [];

    for (const lawdCd of targetLawdCds) {
      const regionLabel =
        coverage.find((c) => c.lawdCd === lawdCd)?.regionLabel ??
        coverageSummary.find((r) => r.lawdCd === lawdCd)?.regionLabel ??
        lawdCd;
      for (const propertyType of types) {
        for (const dealType of deals) {
          if (dealType === "RIGHT" && propertyType !== "APT") continue;
          for (const dealYm of months) {
            const existing = coverage.find(
              (c) =>
                c.lawdCd === lawdCd &&
                c.propertyType === propertyType &&
                c.dealType === dealType &&
                c.dealYm === dealYm,
            );
            const isMissing = !existing || existing.status === "missing";
            if (onlyGaps && !isMissing) continue;
            if (isMissing || !onlyGaps) {
              gaps.push(
                `${regionLabel} · ${propertyLabel(propertyType)}/${dealLabel(dealType)} · ${dealYm}`,
              );
              toFill.push({
                lawdCd,
                regionLabel,
                propertyType,
                dealType,
                dealYm,
                status: "collected",
                rowCount: 10 + Math.floor(Math.random() * 40),
                lastSyncedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
              });
            }
          }
        }
      }
    }

    if (toFill.length === 0) {
      setSyncNote("미수집 기간이 없습니다. 이미 선택한 범위는 모두 수집됨(목업).");
      setLastGapList([]);
      return;
    }

    setSyncing(true);
    setLastGapList(gaps.slice(0, 40));
    setSyncNote(
      onlyGaps
        ? `갭 ${toFill.length}개 연월만 수집 중… (이미 수집된 기간 건너뜀)`
        : `전체 ${toFill.length}개 연월 재수집 중…`,
    );

    window.setTimeout(() => {
      setCoverage((prev) => {
        const map = new Map(
          prev.map((c) => [
            coverageKey(c.lawdCd, c.propertyType, c.dealType, c.dealYm),
            c,
          ]),
        );
        for (const cell of toFill) {
          map.set(
            coverageKey(cell.lawdCd, cell.propertyType, cell.dealType, cell.dealYm),
            cell,
          );
        }
        return [...map.values()];
      });
      setSyncing(false);
      setSyncNote(
        `목업 완료 · ${toFill.length}개 슬롯 upsert 예정 → Supabase · ${onlyGaps ? "갭만" : "전체"}`,
      );
    }, 1100);
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

  const navItems = [
    { label: "매물 관리", mode: null as MenuMode | null, Icon: Building2 },
    {
      label: "경매 관리",
      mode: null,
      Icon: Gavel,
      href: "/admin/auctions",
    },
    {
      label: "실거래가 수집",
      mode: "collect" as MenuMode,
      Icon: Database,
    },
    {
      label: "실거래가 조회",
      mode: "browse" as MenuMode,
      Icon: TrendingUp,
    },
  ];

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl gap-0 md:gap-6">
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-white/10 bg-white/[0.04] py-6 backdrop-blur-xl md:flex">
        <div className="mb-6 px-4">
          <p className="text-xs font-bold text-landing-text">찬스 관리자</p>
          <p className="text-[10px] text-landing-muted">수집 / 조회 분리 목업</p>
        </div>
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const active = item.mode === menu;
            const Icon = item.Icon;
            return (
              <button
                key={item.label}
                type="button"
                disabled={item.mode == null && !("href" in item && item.href)}
                onClick={() => {
                  if (item.mode) setMenu(item.mode);
                }}
                className={`flex w-full items-center gap-2 rounded-full px-3 py-2.5 text-left text-sm transition ${
                  active
                    ? "bg-gradient-to-r from-cta-from/25 to-cta-to/25 text-landing-text"
                    : "text-landing-muted hover:bg-white/5 hover:text-landing-text"
                } ${item.mode == null && !("href" in item) ? "opacity-50" : ""}`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {"href" in item && item.href ? (
                  <Link href={item.href} className="hover:text-blue-300">
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto space-y-2 px-4 text-[10px] leading-relaxed text-white/35">
          <p>
            운영 예정
            <br />
            <span className="text-sky-300/70">/admin/transactions/sync</span>
            <br />
            <span className="text-sky-300/70">/admin/transactions</span>
          </p>
          <p>경매 관리 다음에 두 메뉴로 배치</p>
        </div>
      </aside>

      <div className="min-w-0 flex-1 space-y-5 px-4 py-6 md:px-2 md:py-8">
        {/* 모바일 메뉴 전환 */}
        <div className="flex gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMenu("collect")}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-bold ${
              menu === "collect"
                ? "bg-gradient-to-r from-cta-from to-cta-to text-white"
                : "bg-white/5 text-landing-muted"
            }`}
          >
            수집
          </button>
          <button
            type="button"
            onClick={() => setMenu("browse")}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-bold ${
              menu === "browse"
                ? "bg-gradient-to-r from-cta-from to-cta-to text-white"
                : "bg-white/5 text-landing-muted"
            }`}
          >
            조회
          </button>
        </div>

        <GlassCard className="border-amber-400/20 bg-amber-500/5 p-3 text-[12px] text-amber-100/90">
          <p className="font-semibold">메뉴 분리 확인</p>
          <p className="mt-1 text-amber-100/70">
            이전 목업은 한 화면에 수집·조회가 섞여 있었습니다. 지금은{" "}
            <strong className="text-amber-50">실거래가 수집</strong>(RTMS →
            Supabase 저장)과{" "}
            <strong className="text-amber-50">실거래가 조회</strong>(DB 조회·분석·다운로드)를
            사이드바에서 나눕니다. 운영 적용 전이므로 실제 DB 저장은 하지 않습니다.
          </p>
        </GlassCard>

        {menu === "collect" ? (
          <>
            <header>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#c4b5fd]">
                Collect · Coverage
              </p>
              <h1 className="mt-1 flex items-center gap-2 text-2xl font-extrabold text-landing-text">
                <Database className="h-7 w-7 text-blue-400" aria-hidden />
                실거래가 수집
              </h1>
              <p className="mt-1 text-sm text-landing-muted">
                지역·종류·거래유형·연월별 수집 현황을 보고, 미수집 기간만 추가
                수집합니다. 자동 수집은 선택 사항입니다.
              </p>
            </header>

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
                  {autoCollect ? `${autoCadence === "weekly" ? "매주" : "매월"} · 갭만` : "수동만"}
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
                eupmyeondong={eupmyeondong}
                onSido={setSido}
                onSigungu={setSigungu}
                onEmd={setEupmyeondong}
              />
              <p className="text-[11px] text-white/40">
                시/도·시군구로 현황을 좁히고, 미수집 연월만 실행합니다. (읍면동은
                RTMS 시군구 단위 수집 후 조회 필터용)
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
                      onChange={(e) => setAutoCollect(e.target.checked)}
                      className="rounded border-white/20"
                    />
                    자동 수집 사용 (선택)
                  </label>
                  <select
                    disabled={!autoCollect}
                    value={autoCadence}
                    onChange={(e) =>
                      setAutoCadence(e.target.value as "weekly" | "monthly")
                    }
                    className="rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-landing-text disabled:opacity-40"
                  >
                    <option value="weekly">매주 (최근 3개월 갭)</option>
                    <option value="monthly">매월 (최근 3개월 갭)</option>
                  </select>
                </div>
                <p className="mt-2 text-[11px] text-white/40">
                  켜면 스케줄러가 동일하게 <strong className="text-white/60">갭만</strong>{" "}
                  채웁니다. 기본값은 꺼짐(수동).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => runMockSync(false)}
                  disabled={syncing || collectTypes.length === 0 || collectDeals.length === 0}
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
                  onClick={() => runMockSync(true)}
                  disabled={syncing}
                  className="rounded-full border border-white/15 px-3 py-2 text-[11px] text-landing-muted hover:bg-white/5"
                >
                  강제 전체 재수집
                </button>
                <p className="text-[11px] text-white/45">{syncNote}</p>
              </div>

              {lastGapList.length > 0 && (
                <div className="rounded-lg border border-rose-400/20 bg-rose-500/5 px-3 py-2 text-[11px] text-rose-100/80">
                  <p className="font-semibold text-rose-100">이번 실행 대상 (최대 40)</p>
                  <ul className="mt-1 max-h-24 space-y-0.5 overflow-y-auto">
                    {lastGapList.map((g) => (
                      <li key={g}>· {g}</li>
                    ))}
                  </ul>
                </div>
              )}
            </GlassCard>

            <GlassCard className="overflow-hidden p-0">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
                <p className="text-sm font-bold text-landing-text">
                  수집 현황{" "}
                  <span className="font-normal text-landing-muted">
                    지역 · 종류 · 거래유형 · 연월
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
                          종류·거래유형을 선택하세요.
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
                                ? row.missingMonths.join(", ")
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

            <GlassCard className="overflow-hidden p-0">
              <div className="border-b border-white/10 px-4 py-3">
                <p className="text-sm font-bold text-landing-text">수집 이력 (샘플)</p>
              </div>
              <DataTable maxHeight="220px" className="rounded-none border-0">
                <table className="data-table w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr>
                      <th className="px-3 py-2.5">시각</th>
                      <th className="px-3 py-2.5">기간</th>
                      <th className="px-3 py-2.5">지역</th>
                      <th className="px-3 py-2.5">유형</th>
                      <th className="px-3 py-2.5">건수</th>
                      <th className="px-3 py-2.5">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TX_SAMPLE_SYNC_LOGS.map((log) => (
                      <tr key={log.id}>
                        <td className="px-3 py-2.5 whitespace-nowrap">{log.at}</td>
                        <td className="px-3 py-2.5">{log.range}</td>
                        <td className="px-3 py-2.5">{log.region}</td>
                        <td className="px-3 py-2.5">{log.types}</td>
                        <td className="px-3 py-2.5">{log.rows.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-emerald-300/90">{log.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </DataTable>
            </GlassCard>
          </>
        ) : (
          <>
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
                  Supabase에 저장된 실거래를 필터·KPI·차트로 조회합니다. 상세 컬럼은
                  부동산 종류·거래유형에 따라 달라집니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={downloadCsv}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden />
                  CSV
                </button>
                <button
                  type="button"
                  onClick={downloadExcel}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-100 hover:bg-emerald-500/20"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden />
                  Excel
                </button>
              </div>
            </header>

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
                현재 상세 컬럼 세트:{" "}
                <strong>
                  {TX_PROPERTY_TABS.find((t) => t.id === propertyType)?.label} ·{" "}
                  {TX_DEAL_TYPES.find((t) => t.id === dealType)?.label}
                </strong>{" "}
                → {columns.map((c) => c.label).join(" · ")}
              </p>
            </GlassCard>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: dealType === "RENT" ? "평균 보증금(환산)" : "평균 실거래가",
                  value: formatKrwMan(kpi.avg),
                  hint: `전기 대비 +${kpi.deltaPct}%`,
                },
                { label: "최고가", value: formatKrwMan(kpi.max), hint: "필터 결과" },
                {
                  label: "거래량",
                  value: `${kpi.volume}건`,
                  hint: "취소 제외",
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

            <div className="grid gap-4 lg:grid-cols-5">
              <GlassCard className="p-4 lg:col-span-2">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-bold text-landing-text">지도 (Phase 2)</p>
                  <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/50">
                    미연동
                  </span>
                </div>
                <div className="flex h-56 flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-black/25 text-center">
                  <MapPin className="mb-2 h-8 w-8 text-white/25" aria-hidden />
                  <p className="text-xs text-white/40">Kakao/Naver 클러스터 맵 자리</p>
                </div>
              </GlassCard>
              <GlassCard className="p-4 lg:col-span-3">
                <div className="mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-400" aria-hidden />
                  <p className="text-sm font-bold text-landing-text">
                    월별 평균가 · 거래량 (샘플)
                  </p>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={TX_SAMPLE_MONTHLY}>
                      <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        yAxisId="left"
                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#14121c",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 12,
                          fontSize: 12,
                        }}
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="volume"
                        name="거래량"
                        fill="rgba(77,171,255,0.35)"
                        radius={[4, 4, 0, 0]}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="avgSale"
                        name="평균가(백만)"
                        stroke="#c4b5fd"
                        strokeWidth={2}
                        dot={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
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
                          조건에 맞는 샘플이 없습니다. 시/도를 「충청남도」또는
                          「서울특별시」로 바꿔 보세요.
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
          </>
        )}

        <section className="space-y-3 pb-10">
          <p className="text-sm font-bold text-landing-text">향후 확장</p>
          <div className="grid gap-3 md:grid-cols-3">
            <GlassCard className="p-4">
              <p className="text-sm font-bold text-emerald-100">Phase 1 · 운영</p>
              <ul className="mt-2 space-y-1.5 text-[12px] text-slate-300">
                {TX_PHASE1_CHECKLIST.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="text-emerald-400/80">○</span>
                    {t}
                  </li>
                ))}
              </ul>
            </GlassCard>
            <GlassCard className="p-4">
              <p className="text-sm font-bold text-sky-100">Phase 2</p>
              <ul className="mt-2 space-y-2 text-[12px] text-slate-300">
                {TX_PHASE2_TASKS.map((t) => (
                  <li key={t.title}>
                    <p className="font-semibold text-slate-200">{t.title}</p>
                    <p className="text-white/45">{t.detail}</p>
                  </li>
                ))}
              </ul>
            </GlassCard>
            <GlassCard className="p-4">
              <p className="text-sm font-bold text-violet-100">Phase 3</p>
              <ul className="mt-2 space-y-2 text-[12px] text-slate-300">
                {TX_PHASE3_TASKS.map((t) => (
                  <li key={t.title}>
                    <p className="font-semibold text-slate-200">{t.title}</p>
                    <p className="text-white/45">{t.detail}</p>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </section>
      </div>
    </div>
  );
}
