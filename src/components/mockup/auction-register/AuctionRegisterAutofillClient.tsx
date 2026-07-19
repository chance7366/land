"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  ImagePlus,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  type CourtAuctionFixture,
  type DocSlot,
  type FormGroup,
  type StatusReport,
  COURT_OPTIONS,
  findFixturesByCase,
  formatWon,
  groupLabel,
  listCasePresets,
} from "@/lib/mockup/auction-court-fixtures";
import {
  StatusReportSection,
  emptyStatusReport,
} from "@/components/auction/StatusReportSection";

type FormState = {
  court: string;
  caseYear: string;
  caseSerial: string;
  caseNumber: string;
  itemNo: number;
  formGroup: FormGroup | "";
  itemType: string;
  auctionType: string;
  title: string;
  region: string;
  address: string;
  saleDate: string;
  saleDateLabel: string;
  appraisalPrice: string;
  minPrice: string;
  bidDeposit: string;
  claimAmount: string;
  bidMethod: string;
  receivedAt: string;
  startedAt: string;
  dividendDeadline: string;
  remarks: string;
  appraisalSummary: string;
  exclusiveArea: string;
  landShareDenom: string;
  landShareNumer: string;
  landArea: string;
  buildingArea: string;
  saleShare: string;
  possessionNote: string;
  leaseNote: string;
  assumeRightsNote: string;
  chanceOpinion: string;
  safetyGrade: string;
  status: string;
  featured: boolean;
};

const emptyForm = (): FormState => ({
  court: "홍성지원",
  caseYear: "2026",
  caseSerial: "",
  caseNumber: "",
  itemNo: 1,
  formGroup: "",
  itemType: "",
  auctionType: "",
  title: "",
  region: "",
  address: "",
  saleDate: "",
  saleDateLabel: "",
  appraisalPrice: "",
  minPrice: "",
  bidDeposit: "",
  claimAmount: "",
  bidMethod: "",
  receivedAt: "",
  startedAt: "",
  dividendDeadline: "",
  remarks: "",
  appraisalSummary: "",
  exclusiveArea: "",
  landShareDenom: "",
  landShareNumer: "",
  landArea: "",
  buildingArea: "",
  saleShare: "",
  possessionNote: "",
  leaseNote: "",
  assumeRightsNote: "",
  chanceOpinion: "",
  safetyGrade: "SAFE",
  status: "ONGOING",
  featured: false,
});

function fixtureToForm(f: CourtAuctionFixture): FormState {
  return {
    court: f.court,
    caseYear: f.caseYear,
    caseSerial: f.caseSerial,
    caseNumber: f.caseNumber,
    itemNo: f.itemNo,
    formGroup: f.formGroup,
    itemType: f.itemType,
    auctionType: f.auctionType,
    title: f.title,
    region: f.region,
    address: f.parcels.map((p) => p.address).join(" / "),
    saleDate: f.saleDate,
    saleDateLabel: f.saleDateLabel,
    appraisalPrice: String(f.appraisalPrice),
    minPrice: String(f.minPrice),
    bidDeposit: String(f.bidDeposit),
    claimAmount: String(f.claimAmount),
    bidMethod: f.bidMethod,
    receivedAt: f.receivedAt,
    startedAt: f.startedAt,
    dividendDeadline: f.dividendDeadline,
    remarks: f.remarks,
    appraisalSummary: f.appraisalSummary,
    exclusiveArea: f.exclusiveArea != null ? String(f.exclusiveArea) : "",
    landShareDenom: f.landShareDenom != null ? String(f.landShareDenom) : "",
    landShareNumer: f.landShareNumer != null ? String(f.landShareNumer) : "",
    landArea: f.landArea != null ? String(f.landArea) : "",
    buildingArea: f.buildingArea != null ? String(f.buildingArea) : "",
    saleShare: f.saleShare ?? "",
    possessionNote: f.possessionNote,
    leaseNote: f.leaseNote,
    assumeRightsNote: f.assumeRightsNote,
    chanceOpinion: "",
    safetyGrade: "SAFE",
    status: "ONGOING",
    featured: false,
  };
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#4dabff]/50 focus:ring-1 focus:ring-[#4dabff]/30";
const autoClass = `${inputClass} border-emerald-400/35 bg-emerald-500/[0.07]`;

export function AuctionRegisterAutofillClient() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [parcels, setParcels] = useState<CourtAuctionFixture["parcels"]>([]);
  const [schedule, setSchedule] = useState<CourtAuctionFixture["schedule"]>([]);
  const [docs, setDocs] = useState<DocSlot[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [statusReport, setStatusReport] = useState<StatusReport>(emptyStatusReport);
  const [autoKeys, setAutoKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [itemChoices, setItemChoices] = useState<CourtAuctionFixture[] | null>(null);
  const [filled, setFilled] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const presets = useMemo(() => listCasePresets(), []);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setAutoKeys((prev) => {
      if (!prev.has(key as string)) return prev;
      const next = new Set(prev);
      next.delete(key as string);
      return next;
    });
  }

  function applyFixture(f: CourtAuctionFixture) {
    const next = fixtureToForm(f);
    setForm(next);
    setParcels(f.parcels);
    setSchedule(f.schedule);
    setDocs(f.documents.map((d) => ({ ...d })));
    setStatusReport(
      f.statusReport
        ? {
            ...f.statusReport,
            leases: f.statusReport.leases.map((l) => ({ ...l })),
          }
        : emptyStatusReport(),
    );
    setItemChoices(null);
    setFilled(true);
    setAutoKeys(
      new Set([
        "court",
        "caseYear",
        "caseNumber",
        "itemNo",
        "formGroup",
        "itemType",
        "auctionType",
        "title",
        "region",
        "address",
        "saleDate",
        "appraisalPrice",
        "minPrice",
        "bidDeposit",
        "claimAmount",
        "bidMethod",
        "receivedAt",
        "startedAt",
        "dividendDeadline",
        "remarks",
        "appraisalSummary",
        "exclusiveArea",
        "landShareDenom",
        "landShareNumer",
        "landArea",
        "buildingArea",
        "saleShare",
        "possessionNote",
        "leaseNote",
        "assumeRightsNote",
        "statusReport",
      ]),
    );
    const statusHint = f.statusReport?.available ? " · 현황조사서 포함" : "";
    setToast(
      `${f.caseNumber} 물건 ${f.itemNo} · ${groupLabel(f.formGroup)} 자동입력 완료${statusHint}`,
    );
  }

  async function handleFetch(serialOverride?: string) {
    setLoading(true);
    setToast("");
    setItemChoices(null);
    await new Promise((r) => setTimeout(r, 1100));
    const serial = (serialOverride ?? form.caseSerial).replace(/\D/g, "");
    const matches = findFixturesByCase(form.court, serial);
    setLoading(false);
    if (matches.length === 0) {
      setToast("샘플 픽스처에 없는 사건입니다. 아래 빠른 선택에서 골라보세요.");
      return;
    }
    if (matches.length > 1) {
      setItemChoices(matches);
      setForm((prev) => ({
        ...prev,
        caseSerial: serial,
        caseNumber: matches[0].caseNumber,
      }));
      setToast(`${matches[0].caseNumber} — 물건이 ${matches.length}개입니다. 번호를 선택하세요.`);
      return;
    }
    applyFixture(matches[0]);
  }

  function resetAll() {
    setForm(emptyForm());
    setParcels([]);
    setSchedule([]);
    setDocs([]);
    setStatusReport(emptyStatusReport());
    setPhotos((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return [];
    });
    setAutoKeys(new Set());
    setItemChoices(null);
    setFilled(false);
    setToast("초기화했습니다.");
  }

  function onPhotos(files: FileList | null) {
    if (!files?.length) return;
    const urls = Array.from(files).slice(0, 8 - photos.length).map((f) => URL.createObjectURL(f));
    setPhotos((p) => [...p, ...urls]);
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4200);
    return () => clearTimeout(t);
  }, [toast]);

  const appraisal = Number(form.appraisalPrice || 0);
  const minPrice = Number(form.minPrice || 0);
  const minPct = appraisal > 0 && minPrice > 0 ? Math.round((minPrice / appraisal) * 1000) / 10 : null;
  const cls = (key: string) => (autoKeys.has(key) ? autoClass : inputClass);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 pb-28 font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-200">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#d4bfff]/80">ADMIN SAMPLE</p>
        <h1 className="mt-2 text-3xl font-extrabold italic tracking-tight text-white md:text-4xl">
          경매물건 등록
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          관할법원·사건번호로 법원경매 데이터를 불러오는 UX 샘플입니다. 4번 섹션은 법원 현황조사서
          팝업 서식을 따릅니다.{" "}
          <span className="text-emerald-300/90">홍성지원 · 2026타경15044</span> 로 불러오면 첨부
          이미지와 동일한 데이터가 채워집니다.
        </p>
      </header>

      {/* Fetch bar */}
      <GlassCard className="relative overflow-hidden p-5 md:p-6">
        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
          <div className="hr-aurora-layer hr-aurora-violet absolute inset-0" />
        </div>
        <div className="relative z-10">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#d4bfff]" />
            <h2 className="text-sm font-bold text-white">법원경매 불러오기</h2>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
              mock · Playwright 연동 전
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_1fr_auto]">
            <label className="block text-xs text-slate-400">
              관할법원
              <select
                className={`${inputClass} mt-1`}
                value={form.court}
                onChange={(e) => setField("court", e.target.value)}
              >
                {COURT_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs text-slate-400">
              연도 · 타경 번호
              <div className="mt-1 flex gap-2">
                <input
                  className={`${inputClass} w-20`}
                  value={form.caseYear}
                  onChange={(e) => setField("caseYear", e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="2026"
                  inputMode="numeric"
                />
                <span className="flex items-center rounded-xl border border-white/10 bg-black/20 px-2 text-sm text-slate-300">
                  타경
                </span>
                <input
                  className={inputClass}
                  value={form.caseSerial}
                  onChange={(e) => setField("caseSerial", e.target.value.replace(/\D/g, ""))}
                  placeholder="15044"
                  inputMode="numeric"
                />
              </div>
            </label>
            <label className="block text-xs text-slate-400">
              빠른 선택
              <select
                className={`${inputClass} mt-1`}
                value=""
                onChange={(e) => {
                  const v = e.target.value;
                  if (!v) return;
                  const [court, year, serial] = v.split("|");
                  setForm((prev) => ({
                    ...prev,
                    court,
                    caseYear: year,
                    caseSerial: serial,
                  }));
                  void handleFetch(serial);
                }}
              >
                <option value="">사건 고르기…</option>
                {presets.map((p) => (
                  <option
                    key={`${p.court}-${p.caseYear}-${p.caseSerial}`}
                    value={`${p.court}|${p.caseYear}|${p.caseSerial}`}
                  >
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end gap-2">
              <button
                type="button"
                disabled={loading || !form.caseSerial}
                onClick={() => void handleFetch()}
                className="inline-flex h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-5 text-sm font-bold text-white shadow-lg shadow-[#913dff]/25 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                불러오기
              </button>
            </div>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setForm((prev) => ({
                ...prev,
                court: "홍성지원",
                caseYear: "2026",
                caseSerial: "15044",
              }));
              void handleFetch("15044");
            }}
            className="relative z-10 mt-3 text-left text-xs text-[#d4bfff] underline-offset-2 hover:underline"
          >
            → 현황조사서 데모: 홍성지원 2026타경15044 바로 불러오기
          </button>

          {itemChoices && (
            <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4">
              <p className="mb-2 text-xs font-semibold text-amber-100">물건번호 선택</p>
              <div className="flex flex-wrap gap-2">
                {itemChoices.map((it) => (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => applyFixture(it)}
                    className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-left text-sm text-white hover:border-[#4dabff]/50"
                  >
                    <span className="font-bold text-[#d4bfff]">물건 {it.itemNo}</span>
                    <span className="mt-0.5 block text-xs text-slate-300">{it.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Progress chips */}
      <div className="mt-6 flex flex-wrap gap-2 text-[11px]">
        {["기본", "가격·기일", "물건상세", "현황조사서", "감정요약", "서류", "사진", "찬스의견"].map(
          (label, i) => (
          <span
            key={label}
            className={`rounded-full border px-2.5 py-1 ${
              filled && (label !== "현황조사서" || statusReport.available)
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                : "border-white/10 text-slate-500"
            }`}
          >
            {i + 1}. {label}
          </span>
          ),
        )}
        {form.formGroup && (
          <span className="rounded-full border border-[#913dff]/40 bg-[#913dff]/15 px-2.5 py-1 font-semibold text-[#d4bfff]">
            {form.formGroup} · {groupLabel(form.formGroup as FormGroup)}
          </span>
        )}
      </div>

      <div className="mt-6 space-y-5">
        {/* 1 Basic */}
        <Section n={1} title="기본정보">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="사건번호">
              <input className={cls("caseNumber")} value={form.caseNumber} readOnly />
            </Field>
            <Field label="물건번호">
              <input className={cls("itemNo")} value={form.itemNo || ""} readOnly />
            </Field>
            <Field label="경매종류">
              <input
                className={cls("auctionType")}
                value={form.auctionType}
                onChange={(e) => setField("auctionType", e.target.value)}
              />
            </Field>
            <Field label="물건종류 (법원 원문)">
              <input
                className={cls("itemType")}
                value={form.itemType}
                onChange={(e) => setField("itemType", e.target.value)}
              />
            </Field>
            <Field label="제목" className="md:col-span-2">
              <input
                className={cls("title")}
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
              />
            </Field>
            <Field label="소재지 요약" className="md:col-span-2">
              <input
                className={cls("address")}
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
              />
            </Field>
            <Field label="지역 태그">
              <input
                className={cls("region")}
                value={form.region}
                onChange={(e) => setField("region", e.target.value)}
              />
            </Field>
            <Field label="상태 / 안전등급">
              <div className="flex gap-2">
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value)}
                >
                  <option value="ONGOING">진행중</option>
                  <option value="CLOSED">낙찰/종결</option>
                  <option value="FAILED">유찰</option>
                </select>
                <select
                  className={inputClass}
                  value={form.safetyGrade}
                  onChange={(e) => setField("safetyGrade", e.target.value)}
                >
                  <option value="SAFE">안전</option>
                  <option value="CAUTION">주의</option>
                  <option value="RISK">위험</option>
                </select>
              </div>
            </Field>
          </div>
        </Section>

        {/* 2 Price & schedule */}
        <Section n={2} title="가격 · 기일">
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="감정가 (원)">
              <input
                className={cls("appraisalPrice")}
                value={form.appraisalPrice}
                onChange={(e) => setField("appraisalPrice", e.target.value)}
              />
            </Field>
            <Field label={`최저가 (원)${minPct != null ? ` · ${minPct}%` : ""}`}>
              <input
                className={cls("minPrice")}
                value={form.minPrice}
                onChange={(e) => setField("minPrice", e.target.value)}
              />
            </Field>
            <Field label="입찰보증금 (원)">
              <input
                className={cls("bidDeposit")}
                value={form.bidDeposit}
                onChange={(e) => setField("bidDeposit", e.target.value)}
              />
            </Field>
            <Field label="청구금액">
              <input
                className={cls("claimAmount")}
                value={form.claimAmount}
                onChange={(e) => setField("claimAmount", e.target.value)}
              />
            </Field>
            <Field label="입찰방법">
              <input
                className={cls("bidMethod")}
                value={form.bidMethod}
                onChange={(e) => setField("bidMethod", e.target.value)}
              />
            </Field>
            <Field label="매각기일">
              <input
                type="date"
                className={cls("saleDate")}
                value={form.saleDate}
                onChange={(e) => setField("saleDate", e.target.value)}
              />
            </Field>
            <Field label="접수 / 개시 / 배당종기" className="md:col-span-3">
              <div className="grid gap-2 sm:grid-cols-3">
                <input className={cls("receivedAt")} value={form.receivedAt} placeholder="접수" readOnly />
                <input className={cls("startedAt")} value={form.startedAt} placeholder="개시" readOnly />
                <input
                  className={cls("dividendDeadline")}
                  value={form.dividendDeadline}
                  placeholder="배당요구종기"
                  readOnly
                />
              </div>
            </Field>
          </div>
          {form.saleDateLabel && (
            <p className="mt-2 text-xs text-slate-400">기일 장소: {form.saleDateLabel}</p>
          )}
          {schedule.length > 0 && (
            <div className="data-table mt-4 max-h-56 overflow-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs text-[#cbd5e1]">
                <thead>
                  <tr className="bg-[#0B0F19]/90">
                    <th className="px-3 py-2">기일</th>
                    <th className="px-3 py-2">종류</th>
                    <th className="px-3 py-2">최저가</th>
                    <th className="px-3 py-2">결과</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row) => (
                    <tr key={`${row.date}-${row.kind}`} className="border-t border-white/5">
                      <td className="px-3 py-2">{row.date}</td>
                      <td className="px-3 py-2">{row.kind}</td>
                      <td className="px-3 py-2">{row.minPrice != null ? formatWon(row.minPrice) : "—"}</td>
                      <td className="px-3 py-2">{row.result || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        {/* Remarks */}
        {(form.remarks || filled) && (
          <GlassCard className="border-amber-400/25 bg-amber-500/[0.06] p-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-100">
              <AlertTriangle className="h-4 w-4" />
              물건비고
            </div>
            <textarea
              className={`${cls("remarks")} min-h-[88px] whitespace-pre-wrap`}
              value={form.remarks}
              onChange={(e) => setField("remarks", e.target.value)}
              placeholder="농취증, 우선매수권, 재매각 조건 등"
            />
          </GlassCard>
        )}

        {/* 3 Detail by group */}
        <Section n={3} title="물건상세">
          {parcels.length > 0 && (
            <div className="mb-4 overflow-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs text-[#cbd5e1]">
                <thead>
                  <tr className="bg-white/[0.04]">
                    <th className="px-3 py-2">목록</th>
                    <th className="px-3 py-2">구분</th>
                    <th className="px-3 py-2">소재지</th>
                    <th className="px-3 py-2">상세</th>
                  </tr>
                </thead>
                <tbody>
                  {parcels.map((p) => (
                    <tr key={p.no} className="border-t border-white/5">
                      <td className="px-3 py-2">{p.no}</td>
                      <td className="px-3 py-2">{p.listKind}</td>
                      <td className="px-3 py-2">{p.address}</td>
                      <td className="px-3 py-2 text-slate-400">{p.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {form.formGroup === "UNIT" && (
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="전유면적 (㎡)">
                <input
                  className={cls("exclusiveArea")}
                  value={form.exclusiveArea}
                  onChange={(e) => setField("exclusiveArea", e.target.value)}
                />
              </Field>
              <Field label="대지권 분모">
                <input
                  className={cls("landShareDenom")}
                  value={form.landShareDenom}
                  onChange={(e) => setField("landShareDenom", e.target.value)}
                />
              </Field>
              <Field label="대지권 분자">
                <input
                  className={cls("landShareNumer")}
                  value={form.landShareNumer}
                  onChange={(e) => setField("landShareNumer", e.target.value)}
                />
              </Field>
            </div>
          )}

          {form.formGroup === "HOUSE" && (
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="토지면적 (㎡)">
                <input
                  className={cls("landArea")}
                  value={form.landArea}
                  onChange={(e) => setField("landArea", e.target.value)}
                />
              </Field>
              <Field label="건물면적 (㎡)">
                <input
                  className={cls("buildingArea")}
                  value={form.buildingArea}
                  onChange={(e) => setField("buildingArea", e.target.value)}
                />
              </Field>
            </div>
          )}

          {form.formGroup === "LAND" && (
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="토지 합계면적 (㎡)">
                <input
                  className={cls("landArea")}
                  value={form.landArea}
                  onChange={(e) => setField("landArea", e.target.value)}
                />
              </Field>
              <Field label="매각지분">
                <input
                  className={cls("saleShare")}
                  value={form.saleShare}
                  onChange={(e) => setField("saleShare", e.target.value)}
                  placeholder="해당 시"
                />
              </Field>
            </div>
          )}

          {!form.formGroup && (
            <p className="text-sm text-slate-500">사건을 불러오면 유형별 상세 필드가 나타납니다.</p>
          )}

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Field label="점유">
              <input
                className={cls("possessionNote")}
                value={form.possessionNote}
                onChange={(e) => setField("possessionNote", e.target.value)}
              />
            </Field>
            <Field label="임차관계">
              <input
                className={cls("leaseNote")}
                value={form.leaseNote}
                onChange={(e) => setField("leaseNote", e.target.value)}
              />
            </Field>
            <Field label="매수인 인수 권리">
              <input
                className={cls("assumeRightsNote")}
                value={form.assumeRightsNote}
                onChange={(e) => setField("assumeRightsNote", e.target.value)}
              />
            </Field>
          </div>
        </Section>

        {/* 4 Status report (court 현황조사서 form) */}
        <StatusReportSection
          n={4}
          report={statusReport}
          autoFilled={autoKeys.has("statusReport")}
          onChange={(next) => {
            setStatusReport(next);
            setAutoKeys((prev) => {
              if (!prev.has("statusReport")) return prev;
              const nset = new Set(prev);
              nset.delete("statusReport");
              return nset;
            });
          }}
        />

        {/* 5 Appraisal summary */}
        <Section n={5} title="감정요약" hint="법원 감정평가요항표 원문 · 글자 수 제한 없음">
          <textarea
            className={`${cls("appraisalSummary")} min-h-[280px] whitespace-pre-wrap`}
            value={form.appraisalSummary}
            onChange={(e) => setField("appraisalSummary", e.target.value)}
            placeholder="물건상세조회 → 감정평가요항표 내용"
          />
          <p className="mt-1 text-right text-[11px] text-slate-500">
            {form.appraisalSummary.length.toLocaleString("ko-KR")}자
          </p>
        </Section>

        {/* 6 Documents */}
        <Section n={6} title="서류 첨부" hint="샘플에서는 자동 첨부 상태로 표시 · 프로덕션에서 PDF 다운로드 연동">
          <div className="grid gap-3 md:grid-cols-3">
            {(["saleSpec", "appraisal", "status"] as const).map((type) => {
              const doc = docs.find((d) => d.type === type) ?? {
                type,
                label: type === "saleSpec" ? "매각물건명세서" : type === "appraisal" ? "감정평가서" : "현황조사서",
                name: "",
                status: "pending" as const,
              };
              return <DocCard key={type} doc={doc} />;
            })}
          </div>
        </Section>

        {/* 7 Photos */}
        <Section n={7} title="사진" hint="법원 사진은 직접 다운받아 첨부하세요 (샘플은 로컬 미리보기만)">
          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              onPhotos(e.target.files);
              e.target.value = "";
            }}
          />
          <div className="flex flex-wrap gap-3">
            {photos.map((url, i) => (
              <div key={url} className="relative h-24 w-24 overflow-hidden rounded-xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  className="absolute right-1 top-1 rounded-full bg-black/70 p-1"
                  onClick={() => {
                    URL.revokeObjectURL(url);
                    setPhotos((p) => p.filter((_, idx) => idx !== i));
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => photoRef.current?.click()}
              className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/20 text-slate-400 hover:border-[#4dabff]/50 hover:text-[#4dabff]"
            >
              <ImagePlus className="h-5 w-5" />
              <span className="text-[10px]">추가</span>
            </button>
          </div>
        </Section>

        {/* 8 Chance opinion */}
        <Section n={8} title="찬스부동산 의견" hint="내부 권리분석·메모와 별도 · 고객 안내용 코멘트">
          <textarea
            className={`${inputClass} min-h-[140px]`}
            value={form.chanceOpinion}
            onChange={(e) => setField("chanceOpinion", e.target.value)}
            placeholder="예: 유찰 횟수 대비 최저가 메리트, 임차·우선매수권 리스크, 입찰 시 주의점…"
            maxLength={2000}
          />
          <p className="mt-1 text-right text-[11px] text-slate-500">{form.chanceOpinion.length}/2000</p>
        </Section>
      </div>

      {/* Sticky actions */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0B0F19]/90 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            {filled ? (
              <span className="inline-flex items-center gap-1 text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" /> 자동입력됨 · 민트 테두리는 법원 데이터
              </span>
            ) : (
              "사건을 불러온 뒤 의견을 작성해 보세요"
            )}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              초기화
            </button>
            <button
              type="button"
              onClick={() => setToast("샘플 저장 — 실제 DB에는 저장되지 않습니다.")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-5 py-2 text-sm font-bold text-white"
            >
              <Upload className="h-3.5 w-3.5" />
              샘플 저장
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/15 bg-[#121826] px-4 py-2 text-xs text-slate-100 shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

function Section({
  n,
  title,
  hint,
  children,
}: {
  n: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <GlassCard className="p-5 md:p-6">
      <div className="mb-4 flex items-baseline gap-3 border-b border-white/10 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#4dabff] to-[#913dff] text-xs font-extrabold text-white">
          {n}
        </span>
        <div>
          <h2 className="text-base font-bold text-white">{title}</h2>
          {hint && <p className="mt-0.5 text-[11px] text-slate-500">{hint}</p>}
        </div>
      </div>
      {children}
    </GlassCard>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block text-xs text-slate-400 ${className}`}>
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function DocCard({ doc }: { doc: DocSlot }) {
  const icon =
    doc.status === "attached" ? (
      <FileText className="h-5 w-5 text-emerald-300" />
    ) : doc.status === "unavailable" ? (
      <Trash2 className="h-5 w-5 text-slate-500" />
    ) : (
      <FileText className="h-5 w-5 text-slate-500" />
    );
  const statusLabel =
    doc.status === "attached" ? "자동 첨부됨" : doc.status === "unavailable" ? "해당없음/미제공" : "대기";
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-4">
      <div className="flex items-start gap-3">
        {icon}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">{doc.label}</p>
          <p className="mt-0.5 truncate text-[11px] text-slate-400">{doc.name || "—"}</p>
          <p
            className={`mt-2 text-[10px] font-semibold ${
              doc.status === "attached"
                ? "text-emerald-300"
                : doc.status === "unavailable"
                  ? "text-slate-500"
                  : "text-amber-200"
            }`}
          >
            {statusLabel}
          </p>
        </div>
      </div>
      {doc.status === "attached" && (
        <button
          type="button"
          className="mt-3 w-full rounded-lg border border-white/10 py-1.5 text-[11px] text-slate-300 hover:bg-white/5"
          onClick={() => alert("샘플: 실제 PDF 미리보기는 프로덕션에서 연결됩니다.")}
        >
          미리보기
        </button>
      )}
    </div>
  );
}
