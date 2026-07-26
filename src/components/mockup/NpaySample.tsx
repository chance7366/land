"use client";

/**
 * Npay 매물·단지 수집 목업 — 운영 미적용 · DB 없음.
 * 예정: /admin/npay
 */

import { useMemo, useState } from "react";
import {
  Building2,
  Download,
  FileJson,
  FileSpreadsheet,
  Info,
  Layers,
  Loader2,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { DataTable } from "@/components/ui/DataTable";
import {
  listNpayEupmyeondong,
  listNpaySidos,
  listNpaySigungu,
} from "@/lib/mockup/npay-regions";
import {
  ALL_NPAY_ESTATE_CODES,
  NPAY_COLLECT_FIELD_GROUPS,
  NPAY_COLLECT_FIELDS,
  NPAY_ESTATE_LABEL,
  NPAY_ESTATE_OPTIONS,
  NPAY_PHASE_NOTES,
  NPAY_SAMPLE_ARTICLES,
  NPAY_SAMPLE_COMPLEXES,
  NPAY_TRADE_LABEL,
  articleSampleValue,
  formatManwon,
  type NpayEstateType,
  type NpaySampleArticle,
  type NpaySampleComplex,
  type NpayTradeType,
} from "@/lib/mockup/npay-sample";
import {
  buildSpreadsheetMl,
  escapeCsvCell,
} from "@/lib/mockup/transactions-sample";

type TabId = "articles" | "complexes";

const ALL_TRADES = Object.keys(NPAY_TRADE_LABEL) as NpayTradeType[];
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

export function NpaySample() {
  const [tab, setTab] = useState<TabId>("articles");
  const [city, setCity] = useState("서울특별시");
  const [division, setDivision] = useState("강서구");
  const [sector, setSector] = useState("방화동");
  const [estates, setEstates] =
    useState<NpayEstateType[]>(ALL_NPAY_ESTATE_CODES);
  const [trades, setTrades] = useState<NpayTradeType[]>([...ALL_TRADES]);
  const [loading, setLoading] = useState(false);
  const [collected, setCollected] = useState(false);
  const [status, setStatus] = useState(
    "전국 지역·유형을 고른 뒤 수집을 눌러보세요.",
  );
  const [selectedNo, setSelectedNo] = useState<string | null>(null);
  const [showFieldGuide, setShowFieldGuide] = useState(true);

  const divisionList = listNpaySigungu(city);
  const sectorList = listNpayEupmyeondong(city, division);

  const articles = useMemo(() => {
    if (!collected) return [] as NpaySampleArticle[];
    return NPAY_SAMPLE_ARTICLES.filter((a) => {
      if (city && a.city !== city) return false;
      if (division && a.division !== division) return false;
      if (sector && a.sector !== sector) return false;
      if (estates.length && !estates.includes(a.estateType)) return false;
      if (trades.length && !trades.includes(a.tradeType)) return false;
      return true;
    });
  }, [collected, city, division, sector, estates, trades]);

  const complexes = useMemo(() => {
    if (!collected) return [] as NpaySampleComplex[];
    return NPAY_SAMPLE_COMPLEXES.filter((c) => {
      if (city && c.city !== city) return false;
      if (division && c.division !== division) return false;
      if (sector && c.sector !== sector) return false;
      return true;
    });
  }, [collected, city, division, sector]);

  const rows = tab === "articles" ? articles : complexes;
  const regionLabel = [city, division, sector].filter(Boolean).join(" ");
  const selected =
    articles.find((a) => a.articleNumber === selectedNo) ?? articles[0] ?? null;

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
    setStatus("수집 중… (목업 · 샘플 지연)");
    await new Promise((r) => setTimeout(r, 700));
    setCollected(true);
    setLoading(false);
    const n =
      tab === "articles"
        ? NPAY_SAMPLE_ARTICLES.filter(
            (a) =>
              a.city === city &&
              a.division === division &&
              a.sector === sector &&
              estates.includes(a.estateType) &&
              trades.includes(a.tradeType),
          ).length
        : NPAY_SAMPLE_COMPLEXES.filter(
            (c) =>
              c.city === city &&
              c.division === division &&
              c.sector === sector,
          ).length;
    setSelectedNo(null);
    setStatus(
      `${regionLabel} · ${tab === "articles" ? "매물" : "단지"} ${n}건 수집됨 (샘플 · DB 미저장)`,
    );
  }

  function articleExportRows(list: NpaySampleArticle[]) {
    const headers = [
      "매물번호",
      "거래",
      "유형",
      "단지명",
      "매물명",
      "동",
      "공급㎡",
      "전용㎡",
      "대지㎡",
      "층",
      "향",
      "매매가(만)",
      "보증금(만)",
      "월세(만)",
      "관리비(만)",
      "시/도",
      "시군구",
      "읍면동",
      "위도",
      "경도",
      "중개사",
      "확인일",
      "사용승인일",
      "경과년",
      "특징",
      "URL",
      "중복",
    ];
    const body = list.map((a) => [
      a.articleNumber,
      NPAY_TRADE_LABEL[a.tradeType],
      NPAY_ESTATE_LABEL[a.estateType],
      a.complexName,
      a.articleName,
      a.dongName,
      a.supplyArea != null ? String(a.supplyArea) : "",
      a.exclusiveArea != null ? String(a.exclusiveArea) : "",
      a.landArea != null ? String(a.landArea) : "",
      a.floorInfo,
      a.direction,
      String(a.dealPrice || ""),
      String(a.deposit || ""),
      String(a.monthlyRent || ""),
      String(a.managementFee || ""),
      a.city,
      a.division,
      a.sector,
      String(a.latitude),
      String(a.longitude),
      a.realtorName,
      a.confirmationDate,
      a.approvalDate,
      a.approvalElapsedYear != null ? String(a.approvalElapsedYear) : "",
      a.feature,
      a.articleUrl,
      a.isDuplicate ? "Y" : "",
    ]);
    return { headers, body };
  }

  function complexExportRows(list: NpaySampleComplex[]) {
    const headers = [
      "단지번호",
      "단지명",
      "평형",
      "공급",
      "전용",
      "시/도",
      "시군구",
      "읍면동",
      "도로명",
      "지번",
      "세대수",
      "동수",
      "최고층",
      "사용승인",
      "시공사",
    ];
    const body = list.map((c) => [
      String(c.complexNumber),
      c.complexName,
      c.pyeongName,
      String(c.supplyArea),
      String(c.exclusiveArea),
      c.city,
      c.division,
      c.sector,
      c.roadName,
      c.jibun,
      String(c.totalHouseholds),
      String(c.dongCount),
      String(c.highestFloor),
      String(c.useApprovalYear),
      c.constructionCompany,
    ]);
    return { headers, body };
  }

  function downloadCsv() {
    if (!rows.length) return;
    const { headers, body } =
      tab === "articles"
        ? articleExportRows(articles)
        : complexExportRows(complexes);
    const lines = body.map((r) => r.map(escapeCsvCell).join(","));
    const bom = "\uFEFF";
    triggerDownload(
      new Blob([bom + [headers.join(","), ...lines].join("\n")], {
        type: "text/csv;charset=utf-8",
      }),
      `npay_${tab}_${sector || "sample"}.csv`,
    );
  }

  function downloadExcel() {
    if (!rows.length) return;
    const { headers, body } =
      tab === "articles"
        ? articleExportRows(articles)
        : complexExportRows(complexes);
    const xml = buildSpreadsheetMl(
      tab === "articles" ? "Npay매물" : "Npay단지",
      headers,
      body,
    );
    triggerDownload(
      new Blob([xml], {
        type: "application/vnd.ms-excel;charset=utf-8",
      }),
      `npay_${tab}_${sector || "sample"}.xls`,
    );
  }

  function downloadJson() {
    if (!rows.length) return;
    const payload = tab === "articles" ? articles : complexes;
    triggerDownload(
      new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json;charset=utf-8",
      }),
      `npay_${tab}_${sector || "sample"}.json`,
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 md:px-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-landing-text md:text-2xl">
          Npay 매물·단지 수집
        </h1>
        <p className="text-sm text-landing-muted">
          한 화면 · 탭 전환 · 수집 후 Excel/CSV/JSON (DB 저장 없음)
        </p>
      </header>

      <GlassCard className="border-amber-400/20 bg-amber-500/5 p-3 text-[12px] text-amber-100/90">
        <ul className="space-y-1">
          {NPAY_PHASE_NOTES.map((n) => (
            <li key={n}>· {n}</li>
          ))}
        </ul>
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
              setCollected(false);
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
              setCollected(false);
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
            onChange={(e) => {
              setSector(e.target.value);
              setCollected(false);
            }}
          >
            {sectorList.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-landing-muted">
            {SIDOS.length}개 시/도 · 전국 법정동
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
                    onClick={() => {
                      setEstates(ALL_NPAY_ESTATE_CODES);
                      setCollected(false);
                    }}
                  >
                    전체
                  </button>
                  <button
                    type="button"
                    className="text-[11px] text-landing-muted hover:underline"
                    onClick={() => {
                      setEstates([]);
                      setCollected(false);
                    }}
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
                    onClick={() => {
                      setEstates((prev) => toggleIn(prev, code));
                      setCollected(false);
                    }}
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
                {ALL_TRADES.map((code) => (
                  <button
                    key={code}
                    type="button"
                    className={chipCls(trades.includes(code))}
                    onClick={() => {
                      setTrades((prev) => toggleIn(prev, code));
                      setCollected(false);
                    }}
                  >
                    {NPAY_TRADE_LABEL[code]}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="text-[12px] text-landing-muted">
            단지 탭은 선택 지역의 단지·평형 목록을 수집합니다. (유형 필터 없음)
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

      {tab === "articles" && (
        <GlassCard className="space-y-3 p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-sky-300/90" aria-hidden />
              <h2 className="text-sm font-semibold text-landing-text">
                매물 수집 시 가져오는 세부정보
              </h2>
            </div>
            <button
              type="button"
              className="text-[11px] text-landing-muted hover:underline"
              onClick={() => setShowFieldGuide((v) => !v)}
            >
              {showFieldGuide ? "접기" : "펼치기"}
            </button>
          </div>
          <p className="text-[12px] text-landing-muted">
            API:{" "}
            <code className="text-sky-200/80">
              POST /article/boundedArticles
            </code>{" "}
            →{" "}
            <code className="text-sky-200/80">
              result.list[].representativeArticleInfo
            </code>
            . 가격은 API 원 단위 · 목업 표는 만원 표시.
          </p>
          {showFieldGuide && (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {NPAY_COLLECT_FIELD_GROUPS.map((group) => {
                const fields = NPAY_COLLECT_FIELDS.filter(
                  (f) => f.group === group,
                );
                return (
                  <div
                    key={group}
                    className="rounded-lg border border-white/10 bg-black/20 p-3"
                  >
                    <p className="mb-2 text-[11px] font-semibold text-sky-200/90">
                      {group}
                    </p>
                    <ul className="space-y-1.5">
                      {fields.map((f) => (
                        <li key={f.apiPath} className="text-[11px] leading-snug">
                          <span className="text-landing-text">{f.label}</span>
                          <span className="ml-1 font-mono text-[10px] text-landing-muted">
                            {f.apiPath}
                          </span>
                          {f.note ? (
                            <span className="mt-0.5 block text-[10px] text-white/35">
                              {f.note}
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
          {collected && selected && (
            <div className="rounded-lg border border-[#4dabff]/25 bg-[#4dabff]/5 p-3">
              <p className="mb-2 text-[12px] text-landing-text">
                샘플 1건 필드값 ·{" "}
                <span className="font-mono text-sky-200/90">
                  {selected.articleNumber}
                </span>{" "}
                ({NPAY_ESTATE_LABEL[selected.estateType]})
              </p>
              <DataTable maxHeight="280px">
                <table>
                  <thead>
                    <tr>
                      <th>그룹</th>
                      <th>항목</th>
                      <th>API 경로</th>
                      <th>샘플값</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NPAY_COLLECT_FIELDS.map((f) => (
                      <tr key={f.apiPath}>
                        <td className="text-landing-muted">{f.group}</td>
                        <td>{f.label}</td>
                        <td className="font-mono text-[10px]">{f.apiPath}</td>
                        <td className="max-w-[220px] truncate">
                          {articleSampleValue(selected, f.apiPath)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </DataTable>
            </div>
          )}
        </GlassCard>
      )}

      <GlassCard className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
          <p className="text-sm text-landing-text">
            {tab === "articles" ? "매물" : "단지"}{" "}
            <span className="text-landing-muted">{rows.length}건</span>
            {tab === "articles" && collected ? (
              <span className="ml-2 text-[11px] text-landing-muted">
                행 클릭 → 위 필드 샘플 갱신
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

        {!collected ? (
          <p className="px-4 py-10 text-center text-sm text-landing-muted">
            수집 전입니다. 조건을 선택한 뒤 수집 버튼을 누르세요.
          </p>
        ) : rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-landing-muted">
            샘플에 해당 조건 데이터가 없습니다. (예: 서울 강서구 방화동 · 충남
            홍성군 홍북읍)
          </p>
        ) : tab === "articles" ? (
          <DataTable maxHeight="420px">
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
                  <th>승인·경과</th>
                  <th>중개사</th>
                  <th>확인일</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => {
                  const active =
                    (selectedNo ?? articles[0]?.articleNumber) ===
                    a.articleNumber;
                  return (
                    <tr
                      key={a.articleNumber}
                      onClick={() => setSelectedNo(a.articleNumber)}
                      className={[
                        "cursor-pointer",
                        active ? "bg-[#4dabff]/10" : "",
                      ].join(" ")}
                    >
                      <td className="font-mono text-[11px]">
                        {a.articleNumber}
                        {a.isDuplicate ? (
                          <span className="ml-1 text-[10px] text-amber-200/80">
                            중복
                          </span>
                        ) : null}
                      </td>
                      <td>{NPAY_TRADE_LABEL[a.tradeType]}</td>
                      <td>{NPAY_ESTATE_LABEL[a.estateType]}</td>
                      <td>
                        {a.complexName || a.articleName}
                        {a.dongName ? (
                          <span className="text-landing-muted">
                            {" "}
                            {a.dongName}
                          </span>
                        ) : null}
                        <div className="text-[10px] text-landing-muted">
                          {a.feature}
                        </div>
                      </td>
                      <td className="text-[11px]">
                        {a.exclusiveArea != null
                          ? `전용 ${a.exclusiveArea}`
                          : a.landArea != null
                            ? `대지 ${a.landArea}`
                            : "—"}
                      </td>
                      <td className="text-[11px]">
                        {a.floorInfo} · {a.direction}
                      </td>
                      <td>
                        {a.tradeType === "A1"
                          ? formatManwon(a.dealPrice)
                          : a.tradeType === "B1"
                            ? formatManwon(a.deposit)
                            : `${formatManwon(a.deposit)} / ${formatManwon(a.monthlyRent)}`}
                      </td>
                      <td>{formatManwon(a.managementFee)}</td>
                      <td className="text-[11px]">
                        {a.approvalDate || "—"}
                        {a.approvalElapsedYear != null
                          ? ` · ${a.approvalElapsedYear}년`
                          : ""}
                      </td>
                      <td>{a.realtorName}</td>
                      <td>{a.confirmationDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </DataTable>
        ) : (
          <DataTable maxHeight="420px">
            <table>
              <thead>
                <tr>
                  <th>단지번호</th>
                  <th>단지명</th>
                  <th>평형</th>
                  <th>전용</th>
                  <th>세대</th>
                  <th>동수</th>
                  <th>승인연</th>
                  <th>시공사</th>
                  <th>주소</th>
                </tr>
              </thead>
              <tbody>
                {complexes.map((c) => (
                  <tr key={`${c.complexNumber}-${c.pyeongName}`}>
                    <td className="font-mono text-[11px]">{c.complexNumber}</td>
                    <td>{c.complexName}</td>
                    <td>{c.pyeongName}</td>
                    <td>{c.exclusiveArea}</td>
                    <td>{c.totalHouseholds.toLocaleString("ko-KR")}</td>
                    <td>{c.dongCount}</td>
                    <td>{c.useApprovalYear}</td>
                    <td>{c.constructionCompany}</td>
                    <td className="max-w-[160px] truncate">
                      {c.roadName || c.jibun}
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
