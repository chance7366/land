"use client";

/**
 * Npay 매물·단지 수집 — DB 없이 수집 후 Excel/CSV/JSON
 */

import { useMemo, useState } from "react";
import {
  Building2,
  Download,
  FileJson,
  FileSpreadsheet,
  Layers,
  Loader2,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { DataTable } from "@/components/ui/DataTable";
import {
  ALL_NPAY_ESTATE_CODES,
  ALL_NPAY_TRADE_CODES,
  NPAY_ESTATE_LABEL,
  NPAY_ESTATE_OPTIONS,
  NPAY_TRADE_LABEL,
  type NpayEstateType,
  type NpayTradeType,
} from "@/lib/npay/codes";
import {
  NPAY_DEFAULT_REGION,
  listNpayEupmyeondong,
  listNpaySidos,
  listNpaySigungu,
} from "@/lib/npay/regions";
import {
  articleExportTable,
  buildSpreadsheetMl,
  complexExportTable,
  escapeCsvCell,
} from "@/lib/npay/export";
import type { NpayArticleRow, NpayComplexRow } from "@/lib/npay/types";

type TabId = "articles" | "complexes";

const SIDOS = listNpaySidos();

const selectCls =
  "min-w-[7.5rem] rounded-lg border border-white/10 bg-black/30 px-2.5 py-2 text-xs text-landing-text outline-none focus:border-blue-400/40 disabled:opacity-40";

function chipCls(on: boolean) {
  return [
    "rounded-md border px-2.5 py-1 text-[11px] transition",
    on
      ? "border-[#4dabff]/50 bg-[#4dabff]/15 text-sky-100"
      : "border-white/10 bg-white/[0.03] text-landing-muted hover:border-white/20",
  ].join(" ");
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function toggleIn<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((x) => x !== value)
    : [...list, value];
}

function formatManFromWon(v: number): string {
  if (!v) return "—";
  return `${Math.round(v / 10_000).toLocaleString("ko-KR")}만`;
}

export function AdminNpayClient() {
  const [tab, setTab] = useState<TabId>("articles");
  const [city, setCity] = useState(NPAY_DEFAULT_REGION.city);
  const [division, setDivision] = useState(NPAY_DEFAULT_REGION.division);
  const [sector, setSector] = useState(NPAY_DEFAULT_REGION.sector);
  const [estates, setEstates] =
    useState<NpayEstateType[]>(ALL_NPAY_ESTATE_CODES);
  const [trades, setTrades] = useState<NpayTradeType[]>([
    ...ALL_NPAY_TRADE_CODES,
  ]);
  const [includeDuplicates, setIncludeDuplicates] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(
    "지역·유형을 고른 뒤 수집하세요. 결과는 DB에 저장되지 않으며 파일로만 내려받습니다.",
  );
  const [articles, setArticles] = useState<NpayArticleRow[]>([]);
  const [complexes, setComplexes] = useState<NpayComplexRow[]>([]);
  const [meta, setMeta] = useState<{
    totalCount?: number;
    pages?: number;
    complexCount?: number;
    truncated?: boolean;
  }>({});

  const divisionList = listNpaySigungu(city);
  const sectorList = listNpayEupmyeondong(city, division);
  const rows = tab === "articles" ? articles : complexes;
  const regionLabel = useMemo(
    () => [city, division, sector].filter(Boolean).join(" "),
    [city, division, sector],
  );

  async function handleCollect() {
    if (!city || !division || !sector) {
      setStatus("시/도 · 시군구 · 읍면동을 모두 선택하세요.");
      return;
    }
    if (tab === "articles" && (!estates.length || !trades.length)) {
      setStatus("매물 유형·거래 유형을 하나 이상 선택하세요.");
      return;
    }

    setLoading(true);
    setStatus(`${regionLabel} · ${tab === "articles" ? "매물" : "단지"} 수집 중…`);
    try {
      if (tab === "articles") {
        const res = await fetch("/api/admin/npay/articles/collect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city,
            division,
            sector,
            tradeTypes: trades,
            estateTypes: estates,
            includeDuplicates,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || data.message || "매물 수집 실패");
        }
        setArticles((data.rows ?? []) as NpayArticleRow[]);
        setComplexes([]);
        setMeta({
          totalCount: data.totalCount,
          pages: data.pages,
          truncated: data.truncated,
        });
        setStatus(
          `완료 · API ${data.totalCount ?? 0}건 중 ${(data.rows as unknown[])?.length ?? 0}건` +
            ` · ${data.pages ?? 0}페이지` +
            (data.truncated ? " · (페이지 한도로 일부만)" : "") +
            " · DB 미저장",
        );
      } else {
        setStatus(
          `${regionLabel} · 단지 수집 중… (단지별 상세 호출 · 최대 약 1분)`,
        );
        const res = await fetch("/api/admin/npay/complexes/collect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city, division, sector, maxComplexes: 25 }),
        });
        const raw = await res.text();
        let data: {
          ok?: boolean;
          error?: string;
          message?: string;
          rows?: NpayComplexRow[];
          complexCount?: number;
          truncated?: boolean;
        };
        try {
          data = JSON.parse(raw) as typeof data;
        } catch {
          throw new Error(
            res.ok
              ? "단지 수집 응답 파싱 실패"
              : `단지 수집 실패 (HTTP ${res.status}). 개발 서버를 재시작해 보세요.`,
          );
        }
        if (!res.ok || data.ok === false) {
          throw new Error(data.error || data.message || "단지 수집 실패");
        }
        const nextRows = data.rows ?? [];
        setComplexes(nextRows);
        setArticles([]);
        setMeta({
          complexCount: data.complexCount,
          truncated: data.truncated,
        });
        setStatus(
          nextRows.length === 0
            ? `완료 · 해당 지역 단지 0곳 (아파트 클러스터 없음) · DB 미저장`
            : `완료 · 단지 ${data.complexCount ?? 0}곳 · 평형행 ${nextRows.length}건` +
                (data.truncated ? " · (단지 25곳 한도)" : "") +
                " · DB 미저장",
        );
      }
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "수집 실패");
    } finally {
      setLoading(false);
    }
  }

  function downloadCsv() {
    if (!rows.length) return;
    const { headers, body } =
      tab === "articles"
        ? articleExportTable(articles)
        : complexExportTable(complexes);
    const lines = body.map((r) => r.map(escapeCsvCell).join(","));
    const bom = "\uFEFF";
    triggerDownload(
      new Blob([bom + [headers.join(","), ...lines].join("\n")], {
        type: "text/csv;charset=utf-8",
      }),
      `npay_${tab}_${sector || "export"}.csv`,
    );
  }

  function downloadExcel() {
    if (!rows.length) return;
    const { headers, body } =
      tab === "articles"
        ? articleExportTable(articles)
        : complexExportTable(complexes);
    const xml = buildSpreadsheetMl(
      tab === "articles" ? "Npay매물" : "Npay단지",
      headers,
      body,
    );
    triggerDownload(
      new Blob([xml], {
        type: "application/vnd.ms-excel;charset=utf-8",
      }),
      `npay_${tab}_${sector || "export"}.xls`,
    );
  }

  function downloadJson() {
    if (!rows.length) return;
    const payload = tab === "articles" ? articles : complexes;
    triggerDownload(
      new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json;charset=utf-8",
      }),
      `npay_${tab}_${sector || "export"}.json`,
    );
  }

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-landing-text">Npay매물수집</h1>
        <p className="text-sm text-landing-muted">
          fin.land.naver.com · 탭으로 매물/단지 · DB 없이 파일 저장
        </p>
      </header>

      <GlassCard className="space-y-2 border-sky-400/20 bg-sky-500/5 p-3 text-[12px] leading-relaxed text-sky-100/85">
        <p>
          <span className="font-semibold text-sky-100">수집 환경:</span>{" "}
          <strong className="text-white/90">로컬 서버</strong>(
          <code className="text-sky-200">npm run dev</code> + Python{" "}
          <code className="text-sky-200">curl_cffi</code>)에서만 가능합니다.
          Vercel 등 서버리스에서는 TLS/브리지 제한으로 수집이 실패합니다.
        </p>
        <p className="text-sky-100/75">
          <span className="font-semibold text-sky-100/90">향후 선택지 (미정):</span>{" "}
          <strong className="text-white/85">A안</strong> — GitHub Actions로 수집 후
          Artifact/파일만 받기(DB 없음).{" "}
          <strong className="text-white/85">B안</strong> — Actions 수집 결과를
          Supabase에 저장하고 관리자에서 조회. 판단 후 한쪽을 적용하면 됩니다.
        </p>
      </GlassCard>

      <div className="flex gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
        {(
          [
            { id: "articles" as const, label: "매물", icon: Layers },
            { id: "complexes" as const, label: "단지", icon: Building2 },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={[
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition",
              tab === id
                ? "bg-gradient-to-r from-[#4dabff]/25 to-[#913dff]/25 text-white"
                : "text-landing-muted hover:text-landing-text",
            ].join(" ")}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {label}
          </button>
        ))}
      </div>

      <GlassCard className="space-y-4 p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-landing-muted" aria-hidden />
          <select
            className={selectCls}
            value={city}
            onChange={(e) => {
              const next = e.target.value;
              setCity(next);
              const sgg = listNpaySigungu(next)[0] ?? "";
              setDivision(sgg);
              setSector(listNpayEupmyeondong(next, sgg)[0] ?? "");
            }}
          >
            {SIDOS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            className={selectCls}
            value={division}
            disabled={!city}
            onChange={(e) => {
              const next = e.target.value;
              setDivision(next);
              setSector(listNpayEupmyeondong(city, next)[0] ?? "");
            }}
          >
            {divisionList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            className={selectCls}
            value={sector}
            disabled={!division}
            onChange={(e) => setSector(e.target.value)}
          >
            {sectorList.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-landing-muted">
            {SIDOS.length}개 시/도
          </span>
        </div>

        {tab === "articles" ? (
          <>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11px] text-landing-muted">
                  매물 유형 ({estates.length}/{NPAY_ESTATE_OPTIONS.length})
                </p>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    className="text-[11px] text-sky-300/90 hover:underline"
                    onClick={() => setEstates(ALL_NPAY_ESTATE_CODES)}
                  >
                    전체
                  </button>
                  <button
                    type="button"
                    className="text-[11px] text-landing-muted hover:underline"
                    onClick={() => setEstates([])}
                  >
                    해제
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {NPAY_ESTATE_OPTIONS.map(({ code, label }) => (
                  <button
                    key={code}
                    type="button"
                    className={chipCls(estates.includes(code))}
                    onClick={() => setEstates((prev) => toggleIn(prev, code))}
                    title={code}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] text-landing-muted">거래 유형</p>
              <div className="flex flex-wrap gap-1.5">
                {ALL_NPAY_TRADE_CODES.map((code) => (
                  <button
                    key={code}
                    type="button"
                    className={chipCls(trades.includes(code))}
                    onClick={() => setTrades((prev) => toggleIn(prev, code))}
                  >
                    {NPAY_TRADE_LABEL[code]}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-landing-muted">
              <input
                type="checkbox"
                checked={includeDuplicates}
                onChange={(e) => setIncludeDuplicates(e.target.checked)}
                className="rounded border-white/20"
              />
              동일주소 중복 매물도 포함
            </label>
          </>
        ) : (
          <p className="text-[12px] text-landing-muted">
            단지 클러스터 → 단지정보·평형 목록을 수집합니다. 단지당 API 2회라
            매물보다 오래 걸릴 수 있습니다. (최대 25곳 · 시세 API 미호출)
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => void handleCollect()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#4dabff] to-[#913dff] px-3.5 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" aria-hidden />
            )}
            {tab === "articles" ? "매물 수집" : "단지 수집"}
          </button>
          <span className="text-[12px] text-landing-muted">{status}</span>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden p-0 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
          <p className="text-landing-text">
            {tab === "articles" ? "매물" : "단지·평형"}{" "}
            <span className="text-landing-muted">{rows.length}건</span>
            {meta.totalCount != null && tab === "articles" ? (
              <span className="ml-2 text-[11px] text-landing-muted">
                API {meta.totalCount}건
              </span>
            ) : null}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              disabled={!rows.length}
              onClick={downloadExcel}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-landing-text disabled:opacity-40"
            >
              <FileSpreadsheet className="h-3 w-3" aria-hidden />
              Excel
            </button>
            <button
              type="button"
              disabled={!rows.length}
              onClick={downloadCsv}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-landing-text disabled:opacity-40"
            >
              <Download className="h-3 w-3" aria-hidden />
              CSV
            </button>
            <button
              type="button"
              disabled={!rows.length}
              onClick={downloadJson}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-landing-text disabled:opacity-40"
            >
              <FileJson className="h-3 w-3" aria-hidden />
              JSON
            </button>
          </div>
        </div>

        {!rows.length ? (
          <p className="px-4 py-10 text-center text-landing-muted">
            수집 결과가 없습니다. 조건을 선택한 뒤 수집하세요.
          </p>
        ) : tab === "articles" ? (
          <DataTable maxHeight="480px" className="text-sm">
            <table>
              <thead>
                <tr>
                  <th>매물번호</th>
                  <th>거래</th>
                  <th>유형</th>
                  <th>매물/단지</th>
                  <th>면적</th>
                  <th>층·향</th>
                  <th>가격</th>
                  <th>관리비</th>
                  <th>중개사</th>
                  <th>확인일</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a.articleNumber}>
                    <td className="font-mono text-[11px]">
                      <a
                        href={a.articleUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-300/90 hover:underline"
                      >
                        {a.articleNumber}
                      </a>
                      {a.isDuplicate ? (
                        <span className="ml-1 text-[10px] text-amber-200/80">
                          중복
                        </span>
                      ) : null}
                    </td>
                    <td>{a.tradeTypeLabel || NPAY_TRADE_LABEL[a.tradeType as NpayTradeType] || a.tradeType}</td>
                    <td>{a.estateTypeLabel || NPAY_ESTATE_LABEL[a.estateType as NpayEstateType] || a.estateType}</td>
                    <td>
                      {a.complexName || a.articleName}
                      {a.dongName ? (
                        <span className="text-landing-muted"> {a.dongName}</span>
                      ) : null}
                      {a.feature ? (
                        <div className="text-[10px] text-landing-muted">
                          {a.feature}
                        </div>
                      ) : null}
                    </td>
                    <td className="text-[11px]">
                      {a.exclusiveArea != null
                        ? `전용 ${a.exclusiveArea}`
                        : a.landArea != null
                          ? `대지 ${a.landArea}`
                          : "—"}
                    </td>
                    <td className="text-[11px]">
                      {a.floorInfo || "—"}
                      {a.direction ? ` · ${a.direction}` : ""}
                    </td>
                    <td>
                      {a.tradeType === "A1"
                        ? formatManFromWon(a.dealPrice)
                        : a.tradeType === "B1"
                          ? formatManFromWon(a.warrantyPrice)
                          : `${formatManFromWon(a.warrantyPrice)} / ${formatManFromWon(a.rentPrice)}`}
                    </td>
                    <td>{formatManFromWon(a.managementFee)}</td>
                    <td>{a.realtorName || "—"}</td>
                    <td>{a.confirmationDate || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataTable>
        ) : (
          <DataTable maxHeight="480px" className="text-sm">
            <table>
              <thead>
                <tr>
                  <th>단지번호</th>
                  <th>단지명</th>
                  <th>평형</th>
                  <th>전용</th>
                  <th>세대</th>
                  <th>동수</th>
                  <th>승인</th>
                  <th>시공사</th>
                  <th>주소</th>
                </tr>
              </thead>
              <tbody>
                {complexes.map((c, i) => (
                  <tr key={`${c.complexNumber}-${c.pyeongTypeNumber ?? i}`}>
                    <td className="font-mono text-[11px]">
                      <a
                        href={c.complexUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-300/90 hover:underline"
                      >
                        {c.complexNumber}
                      </a>
                    </td>
                    <td>{c.complexName}</td>
                    <td>{c.pyeongName || "—"}</td>
                    <td>{c.exclusiveArea ?? "—"}</td>
                    <td>
                      {c.totalHouseholds != null
                        ? c.totalHouseholds.toLocaleString("ko-KR")
                        : "—"}
                    </td>
                    <td>{c.dongCount ?? "—"}</td>
                    <td className="text-[11px]">
                      {c.useApprovalYear ?? c.useApprovalDate ?? "—"}
                    </td>
                    <td>{c.constructionCompany || "—"}</td>
                    <td className="max-w-[160px] truncate">
                      {c.roadName || c.jibun || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataTable>
        )}
      </GlassCard>
    </div>
  );
}
