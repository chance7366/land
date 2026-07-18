"use client";

import { useMemo, useState } from "react";
import {
  ImagePlus,
  List,
  Plus,
  Search,
  UserPlus,
  X,
} from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  CONTACT_LABELS,
  MOCK_CUSTOMERS,
  PURPOSE_LABELS,
  STAGE_LABELS,
  URGENCY_LABELS,
  type MockCustomer,
} from "@/lib/mockup/admin-customers-sample";

type View = "list" | "create";

const fieldClass =
  "mt-1 w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-[#4dabff]/50 focus:outline-none";

const labelClass = "block text-xs font-medium text-white/55";

function Badge({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "blue" | "gold" | "green" | "red" | "violet" | "orange";
}) {
  const tones: Record<string, string> = {
    slate: "border-white/15 bg-white/10 text-white/75",
    blue: "border-sky-400/35 bg-sky-500/15 text-sky-200",
    gold: "border-amber-400/35 bg-amber-500/15 text-amber-100",
    green: "border-emerald-400/35 bg-emerald-500/15 text-emerald-200",
    red: "border-red-400/40 bg-red-500/15 text-red-200",
    violet: "border-violet-400/35 bg-violet-500/15 text-violet-200",
    orange: "border-orange-400/35 bg-orange-500/15 text-orange-200",
  };
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-3 border-b border-white/10 pb-2">
      <h3 className="text-sm font-bold text-white">{title}</h3>
      {hint ? <p className="mt-0.5 text-[11px] text-white/40">{hint}</p> : null}
    </div>
  );
}

type CreateForm = {
  name: string;
  phone: string;
  email: string;
  currentAddress: string;
  profileImage: string;
  contactChannels: string[];
  hasTraded: boolean;
  isSubscribed: boolean;
  inquiryDetails: string;
  requestNotes: string;
  specialNotes: string;
  budgetRange: string;
  needsLoan: boolean;
  purpose: string;
  moveUrgency: string;
  moveDate: string;
  familyMembers: string;
  preferredBrand: string;
  decisionMaker: string;
  pipelineStage: string;
};

const emptyCreate: CreateForm = {
  name: "",
  phone: "",
  email: "",
  currentAddress: "",
  profileImage: "",
  contactChannels: ["phone"],
  hasTraded: false,
  isSubscribed: false,
  inquiryDetails: "",
  requestNotes: "",
  specialNotes: "",
  budgetRange: "",
  needsLoan: false,
  purpose: "reside",
  moveUrgency: "mid",
  moveDate: "",
  familyMembers: "",
  preferredBrand: "",
  decisionMaker: "",
  pipelineStage: "new",
};

function matchesQuery(c: MockCustomer, q: string) {
  if (!q.trim()) return true;
  const hay = [
    c.name,
    c.phone,
    c.phone.replace(/\D/g, ""),
    c.email,
    c.currentAddress,
    c.inquiryDetails,
    c.requestNotes,
    c.specialNotes,
    c.budgetRange,
    c.familyMembers,
    c.preferredBrand,
    c.decisionMaker,
    c.contactChannels.map((ch) => CONTACT_LABELS[ch]).join(" "),
    PURPOSE_LABELS[c.purpose],
    STAGE_LABELS[c.pipelineStage],
    c.hasTraded ? "기존거래 기존고객" : "신규",
    c.isSubscribed ? "맞춤알림" : "",
  ]
    .join(" ")
    .toLowerCase();
  return q
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .every((token) => hay.includes(token) || hay.includes(token.replace(/\D/g, "")));
}

export function AdminCustomersMockup() {
  const [view, setView] = useState<View>("list");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateForm>(emptyCreate);
  const [savedNote, setSavedNote] = useState("");

  const filtered = useMemo(
    () => MOCK_CUSTOMERS.filter((c) => matchesQuery(c, query)),
    [query],
  );
  const selected = MOCK_CUSTOMERS.find((c) => c.id === selectedId) ?? null;

  function toggleChannel(ch: string) {
    setForm((f) => {
      const has = f.contactChannels.includes(ch);
      if (has && f.contactChannels.length === 1) return f;
      return {
        ...f,
        contactChannels: has
          ? f.contactChannels.filter((x) => x !== ch)
          : [...f.contactChannels, ch],
      };
    });
  }

  function submitMock(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setSavedNote("이름과 전화번호는 필수입니다. (목업)");
      return;
    }
    setSavedNote(
      `목업 저장 미리보기: 「${form.name}」 / ${form.phone} / 접촉 ${form.contactChannels
        .map((c) => CONTACT_LABELS[c])
        .join("·")} — 실제 DB에는 저장되지 않습니다.`,
    );
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <div className="hr-aurora-layer hr-aurora-violet pointer-events-none absolute inset-0" aria-hidden>
        <div className="hr3-glow absolute inset-0" />
      </div>
      <div className="hr3-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />

      <div className="relative z-10 mx-auto max-w-[1280px] space-y-6 px-4 py-8 md:px-8">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
              Chance Admin · CRM Mockup
            </p>
            <h1 className="mt-1 font-serif text-3xl font-bold text-white">고객 관리</h1>
            <div className="mt-2 h-px w-20 bg-gradient-to-r from-[#d4af37] to-transparent" />
            <p className="mt-2 text-sm text-white/50">
              리스트 검색 · 상세 신규등록 — 라이브는 /admin/customers
            </p>
          </div>
          <div className="flex rounded-xl border border-white/15 bg-black/30 p-1">
            <button
              type="button"
              onClick={() => setView("list")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold ${
                view === "list" ? "bg-white/15 text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              <List className="h-4 w-4" />
              고객 리스트
            </button>
            <button
              type="button"
              onClick={() => {
                setView("create");
                setSavedNote("");
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold ${
                view === "create" ? "bg-gradient-to-r from-cta-from/40 to-cta-to/40 text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              <UserPlus className="h-4 w-4" />
              신규 등록
            </button>
          </div>
        </header>

        {view === "list" ? (
          <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
            <GlassCard className="space-y-4 p-5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="이름 · 전화 · 이메일 · 거주지 · 문의내용 · 브랜드 · 메모 검색"
                  className={`${fieldClass} !mt-0 pl-10`}
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    aria-label="검색어 지우기"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
              <p className="text-xs text-white/40">
                {filtered.length}명 표시
                {query.trim() ? ` · “${query.trim()}” 검색` : " · 전체"}
                {" · "}과거 상담 여부 확인용으로 전화·이름으로 바로 찾아보세요
              </p>

              <DataTable maxHeight="560px">
                <table className="w-full border-collapse text-left text-sm text-unifine-table-text">
                  <thead>
                    <tr className="text-landing-muted">
                      {["고객", "연락처 / 거주지", "접촉·성향", "최근상담", ""].map((h) => (
                        <th
                          key={h || "a"}
                          className="sticky top-0 border-b border-white/10 bg-[#12161f] p-3 font-label-md"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-white/40">
                          검색 결과가 없습니다. 다른 키워드로 다시 찾아보세요.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((c) => (
                        <tr
                          key={c.id}
                          onClick={() => setSelectedId(c.id)}
                          className={`cursor-pointer border-b border-white/5 transition-colors hover:bg-white/[0.04] ${
                            selectedId === c.id ? "bg-sky-500/10" : ""
                          }`}
                        >
                          <td className="p-3">
                            <p className="font-bold text-white">{c.name}</p>
                            <p className="text-[11px] text-white/40">
                              {c.hasTraded ? "기존 거래" : "신규"} · 이력 {c.interactionCount}건
                            </p>
                          </td>
                          <td className="p-3">
                            <p className="font-mono text-xs text-white/80">{c.phone}</p>
                            <p className="truncate text-[11px] text-white/45">{c.currentAddress || "-"}</p>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {c.contactChannels.map((ch) => (
                                <Badge key={ch} tone="blue">
                                  {CONTACT_LABELS[ch]}
                                </Badge>
                              ))}
                              <Badge tone={c.purpose === "invest" ? "violet" : "green"}>
                                {PURPOSE_LABELS[c.purpose]}
                              </Badge>
                              <Badge tone={c.moveUrgency === "high" ? "red" : "gold"}>
                                긴급 {URGENCY_LABELS[c.moveUrgency]}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-3 font-mono text-xs text-white/55">{c.lastContactAt}</td>
                          <td className="p-3 text-right text-xs text-sky-300">보기</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </DataTable>
            </GlassCard>

            <GlassCard className="h-fit space-y-3 p-5">
              <h2 className="text-sm font-bold text-white">선택 고객 요약</h2>
              {!selected ? (
                <p className="py-8 text-center text-sm text-white/35">
                  리스트에서 고객을 선택하면
                  <br />
                  과거 상담·요청사항이 여기에 보입니다.
                </p>
              ) : (
                <>
                  <p className="text-lg font-bold text-white">{selected.name}</p>
                  <p className="font-mono text-sm text-sky-200">{selected.phone}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge tone="orange">{STAGE_LABELS[selected.pipelineStage]}</Badge>
                    {selected.isSubscribed ? <Badge tone="gold">맞춤알림</Badge> : null}
                    {selected.needsLoan ? <Badge tone="orange">대출 필요</Badge> : null}
                  </div>
                  <div className="space-y-2 border-t border-white/10 pt-3 text-xs text-white/60">
                    <p>
                      <span className="text-white/40">가용자금</span>
                      <br />
                      {selected.budgetRange || "-"}
                    </p>
                    <p>
                      <span className="text-white/40">문의 내용</span>
                      <br />
                      {selected.inquiryDetails || "-"}
                    </p>
                    <p>
                      <span className="text-white/40">요청사항</span>
                      <br />
                      {selected.requestNotes || "-"}
                    </p>
                    <p>
                      <span className="text-white/40">특징·의사결정</span>
                      <br />
                      {selected.specialNotes || "-"}
                      {selected.decisionMaker ? ` · ${selected.decisionMaker}` : ""}
                    </p>
                    <p>
                      <span className="text-white/40">과거 상담</span>
                      <br />
                      타임라인 {selected.interactionCount}건 · 최근 {selected.lastContactAt}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setView("create")}
                    className="mt-2 w-full rounded-xl border border-white/15 py-2 text-sm text-white/70 hover:bg-white/5"
                  >
                    유사 정보로 신규등록 폼 열기 (목업)
                  </button>
                </>
              )}
            </GlassCard>
          </div>
        ) : (
          <form onSubmit={submitMock} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-white/50">
                개업공인중개사 실전 필드 전부 포함 · 저장은 미리보기만
              </p>
              <button
                type="button"
                onClick={() => setView("list")}
                className="text-xs text-sky-300 hover:underline"
              >
                ← 리스트로
              </button>
            </div>

            {savedNote ? (
              <GlassCard className="border-amber-400/30 p-4 text-sm text-amber-100">{savedNote}</GlassCard>
            ) : null}

            {/* 1. 기본 식별 */}
            <GlassCard className="p-5">
              <SectionTitle
                title="1. 고객 식별"
                hint="이름·전화로 과거 상담 고객을 다시 찾을 수 있어야 합니다"
              />
              <div className="grid gap-3 md:grid-cols-2">
                <label className={labelClass}>
                  고객 이름 *
                  <input
                    className={fieldClass}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="홍길동"
                    required
                  />
                </label>
                <label className={labelClass}>
                  전화번호 *
                  <input
                    className={fieldClass}
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="010-0000-0000"
                    required
                  />
                </label>
                <label className={labelClass}>
                  메일주소
                  <input
                    className={fieldClass}
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="optional@email.com"
                  />
                </label>
                <label className={labelClass}>
                  현재 거주지 (사는 곳)
                  <input
                    className={fieldClass}
                    value={form.currentAddress}
                    onChange={(e) => setForm((f) => ({ ...f, currentAddress: e.target.value }))}
                    placeholder="시·군·읍면동"
                  />
                </label>
                <label className={`${labelClass} md:col-span-2`}>
                  이미지 (명함 / 현장 사진 URL)
                  <div className="mt-1 flex gap-2">
                    <input
                      className={fieldClass}
                      value={form.profileImage}
                      onChange={(e) => setForm((f) => ({ ...f, profileImage: e.target.value }))}
                      placeholder="https://... 또는 추후 업로드"
                    />
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-dashed border-white/20 px-3 text-xs text-white/40">
                      <ImagePlus className="h-4 w-4" />
                      업로드(예정)
                    </span>
                  </div>
                </label>
              </div>
            </GlassCard>

            {/* 2. 접촉 경로 */}
            <GlassCard className="p-5">
              <SectionTitle
                title="2. 접촉 경로"
                hint="방문 · 전화 · 메일 · 웹사이트 (복수 선택 가능)"
              />
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["visit", "방문상담"],
                    ["phone", "전화상담"],
                    ["email", "메일상담"],
                    ["web", "웹사이트 문의"],
                  ] as const
                ).map(([key, label]) => {
                  const on = form.contactChannels.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleChannel(key)}
                      className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
                        on
                          ? "border-sky-400/50 bg-sky-500/20 text-sky-100"
                          : "border-white/15 text-white/50 hover:border-white/30"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <label className="flex items-center gap-2 text-sm text-white/75">
                  <input
                    type="checkbox"
                    checked={form.hasTraded}
                    onChange={(e) => setForm((f) => ({ ...f, hasTraded: e.target.checked }))}
                  />
                  거래한 적 있음 (기존 고객)
                </label>
                <label className="flex items-center gap-2 text-sm text-white/75">
                  <input
                    type="checkbox"
                    checked={form.isSubscribed}
                    onChange={(e) => setForm((f) => ({ ...f, isSubscribed: e.target.checked }))}
                  />
                  맞춤 알림 서비스 동의/이용
                </label>
                <label className={labelClass}>
                  파이프라인 단계
                  <select
                    className={fieldClass}
                    value={form.pipelineStage}
                    onChange={(e) => setForm((f) => ({ ...f, pipelineStage: e.target.value }))}
                  >
                    {Object.entries(STAGE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </GlassCard>

            {/* 3. 핵심 내용 */}
            <GlassCard className="p-5">
              <SectionTitle title="3. 문의 · 요청 · 특징" hint="상담 방향과 후속 관리의 핵심 메모" />
              <div className="grid gap-3">
                <label className={labelClass}>
                  문의 내용
                  <textarea
                    className={`${fieldClass} min-h-[88px]`}
                    value={form.inquiryDetails}
                    onChange={(e) => setForm((f) => ({ ...f, inquiryDetails: e.target.value }))}
                    placeholder="예: 홍북읍 84㎡ 매매, 학군·주차 중요"
                  />
                </label>
                <label className={labelClass}>
                  고객 요청사항
                  <textarea
                    className={`${fieldClass} min-h-[72px]`}
                    value={form.requestNotes}
                    onChange={(e) => setForm((f) => ({ ...f, requestNotes: e.target.value }))}
                    placeholder="예: 이사 일정에 맞춰 잔금일 조율"
                  />
                </label>
                <label className={labelClass}>
                  특징 / 성향 메모
                  <textarea
                    className={`${fieldClass} min-h-[72px]`}
                    value={form.specialNotes}
                    onChange={(e) => setForm((f) => ({ ...f, specialNotes: e.target.value }))}
                    placeholder="예: 주말 오후만 가능 · 신중형 · 가격 민감"
                  />
                </label>
              </div>
            </GlassCard>

            {/* 4. 현업 밀착 — 돈과 시간 */}
            <GlassCard className="p-5">
              <SectionTitle
                title="4. 현업 밀착 · 돈과 시간"
                hint="매물 매칭·우선순위를 가르는 핵심 지표"
              />
              <div className="grid gap-3 md:grid-cols-2">
                <label className={labelClass}>
                  보유 가용 자금 / 예산 규모
                  <input
                    className={fieldClass}
                    value={form.budgetRange}
                    onChange={(e) => setForm((f) => ({ ...f, budgetRange: e.target.value }))}
                    placeholder="예: 현금 3억 + 대출 2억"
                  />
                </label>
                <label className="flex items-end gap-2 pb-2 text-sm text-white/75">
                  <input
                    type="checkbox"
                    checked={form.needsLoan}
                    onChange={(e) => setForm((f) => ({ ...f, needsLoan: e.target.checked }))}
                  />
                  대출 필요
                </label>
                <label className={labelClass}>
                  거래 성향 (목적)
                  <select
                    className={fieldClass}
                    value={form.purpose}
                    onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))}
                  >
                    <option value="reside">실거주</option>
                    <option value="invest">투자</option>
                  </select>
                </label>
                <label className={labelClass}>
                  이사 긴급도
                  <select
                    className={fieldClass}
                    value={form.moveUrgency}
                    onChange={(e) => setForm((f) => ({ ...f, moveUrgency: e.target.value }))}
                  >
                    <option value="high">상 — 급함</option>
                    <option value="mid">중</option>
                    <option value="low">하 — 천천히</option>
                  </select>
                </label>
                <label className={labelClass}>
                  이사 예정일 / 잔금 가능일
                  <input
                    type="date"
                    className={fieldClass}
                    value={form.moveDate}
                    onChange={(e) => setForm((f) => ({ ...f, moveDate: e.target.value }))}
                  />
                </label>
                <label className={labelClass}>
                  동거 가족 구성 (학군 등)
                  <input
                    className={fieldClass}
                    value={form.familyMembers}
                    onChange={(e) => setForm((f) => ({ ...f, familyMembers: e.target.value }))}
                    placeholder="예: 부부 + 초등 자녀 1"
                  />
                </label>
                <label className={labelClass}>
                  선호 브랜드 · 단지 / 동 · 층
                  <input
                    className={fieldClass}
                    value={form.preferredBrand}
                    onChange={(e) => setForm((f) => ({ ...f, preferredBrand: e.target.value }))}
                    placeholder="예: 센트럴자이 1단지 로얄층"
                  />
                </label>
                <label className={labelClass}>
                  실제 의사결정자 (공동명의 여부)
                  <input
                    className={fieldClass}
                    value={form.decisionMaker}
                    onChange={(e) => setForm((f) => ({ ...f, decisionMaker: e.target.value }))}
                    placeholder="예: 배우자(아내) 최종 / 공동"
                  />
                </label>
              </div>
            </GlassCard>

            <div className="flex flex-wrap gap-2 pb-8">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cta-from to-cta-to px-5 py-3 text-sm font-bold text-white"
              >
                <Plus className="h-4 w-4" />
                고객 카드 저장 (목업)
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm(emptyCreate);
                  setSavedNote("");
                }}
                className="rounded-xl border border-white/15 px-5 py-3 text-sm text-white/70"
              >
                초기화
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
