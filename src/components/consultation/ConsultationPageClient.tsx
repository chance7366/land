"use client";

import { useMemo, useState } from "react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  KoreanDateTimePicker,
  preferredAtLabel,
} from "@/components/ui/KoreanDateTimePicker";
import {
  CONSULT_STATUS_META,
  SERVICE_CATEGORIES,
} from "@/lib/consultation";
import { trackBrowserEvent } from "@/lib/analytics/track";
import type { ConsultationStatus } from "@prisma/client";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#60a5fa] focus:outline-none";

const subLabelClass = (active: boolean) =>
  `flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
    active
      ? "border-[#60a5fa]/50 bg-[#60a5fa]/10 text-white"
      : "border-white/10 text-white/70 hover:border-white/20"
  }`;

const methodLabelClass = (active: boolean) =>
  `flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-center text-sm ${
    active
      ? "border-[#60a5fa]/50 bg-[#60a5fa]/10 text-white"
      : "border-white/10 text-white/75 hover:border-white/20"
  }`;

function StatusBadge({ status }: { status: ConsultationStatus }) {
  const meta = CONSULT_STATUS_META[status];
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

function StepBadge({
  n,
  label,
  active,
  done,
}: {
  n: number;
  label: string;
  active: boolean;
  done?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
        active
          ? "border-[#60a5fa]/50 bg-[#60a5fa]/15 text-[#93c5fd]"
          : done
            ? "border-emerald-400/35 bg-emerald-500/10 text-emerald-300/90"
            : "border-white/10 bg-white/5 text-white/45"
      }`}
    >
      <span>{n}</span>
      <span>{label}</span>
    </div>
  );
}

type LookupResult = {
  caseId: string;
  category: string;
  subCategory: string | null;
  method: string | null;
  preferredAt: string | null;
  detail: string;
  status: ConsultationStatus;
  createdAt: string;
  clientName: string;
  phoneMasked: string;
  reply: string | null;
  repliedAt: string | null;
};

type BoardRow = {
  caseId: string;
  category: string;
  status: ConsultationStatus;
  createdAt: string;
};

export function ConsultationPageClient({
  boardRows,
  propertyId,
}: {
  boardRows: BoardRow[];
  propertyId?: string | null;
}) {
  const [step, setStep] = useState(1);
  const [categoryId, setCategoryId] = useState<(typeof SERVICE_CATEGORIES)[number]["id"] | "">(
    "",
  );
  const [subId, setSubId] = useState("");
  const [detailFields, setDetailFields] = useState<Record<string, string>>({});
  const [client, setClient] = useState({
    name: "",
    phone: "",
    method: "방문 상담 (내포신도시 사무소)",
    preferredAt: "",
    agree: false,
  });
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ accessCode: string; caseHint: string } | null>(
    null,
  );

  const [lookupPw, setLookupPw] = useState("");
  const [lookupName, setLookupName] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [found, setFound] = useState<LookupResult | null>(null);

  const category = SERVICE_CATEGORIES.find((c) => c.id === categoryId);
  const sub = category?.subs.find((s) => s.id === subId);
  const expanded = Boolean(category && sub);
  const showForm = step !== 4 || !submitted;

  const processSteps = useMemo(
    () => [
      { title: "예약 접수", desc: "상담 신청서 작성" },
      { title: "사전 검토", desc: "매물·사건 사전 분석" },
      { title: "전문 상담", desc: "1:1 방문·전화 상담" },
    ],
    [],
  );

  function buildDetail(): string {
    const lines: string[] = [];
    if (propertyId) lines.push(`연관 매물 ID: ${propertyId}`);
    Object.entries(detailFields).forEach(([k, v]) => {
      if (!v?.trim()) return;
      const labels: Record<string, string> = {
        propertyType: "매물 유형",
        location: "매물 위치",
        price: "희망 금액",
        wantType: "희망 매수 유형",
        region: "희망 지역",
        budget: "예산 범위",
        timing: "희망 시기",
        caseNo: "경매 물건",
        purpose: "상담 목적",
        topic: "상담 주제",
        note: "요청사항",
      };
      lines.push(`${labels[k] ?? k}: ${v.trim()}`);
    });
    return lines.join("\n") || "상세 내용 없음";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!client.agree || !category || !sub || !client.preferredAt) return;
    setSubmitError("");
    setSubmitting(true);
    const preferredAt = preferredAtLabel(client.preferredAt);
    const detail = buildDetail();
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: client.name,
          phone: client.phone,
          category: category.title,
          subCategory: sub.label,
          detail,
          summary: `${category.title} · ${sub.label}`,
          method: client.method,
          preferredAt,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "신청에 실패했습니다.");
        return;
      }
      setSubmitted({
        accessCode: data.accessCode,
        caseHint: String(data.id).slice(-4).toUpperCase(),
      });
      trackBrowserEvent({
        eventType: "cta_click",
        menuKey: "consultation",
        metadata: { action: "consult_submit", category: category.title },
      });
      setStep(4);
    } catch {
      setSubmitError("네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setLookupError("");
    setFound(null);
    try {
      const res = await fetch("/api/consultations/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode: lookupPw, clientName: lookupName }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLookupError(
          typeof data.error === "string" ? data.error : "조회에 실패했습니다.",
        );
        return;
      }
      setFound(data);
    } catch {
      setLookupError("네트워크 오류가 발생했습니다.");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-container-padding-mobile py-10 md:px-8 md:py-14">
      <header className="mb-10 flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-wide text-[#93c5fd]">CONSULTATION</p>
          <h1 className="mt-1 text-3xl font-extrabold text-white md:text-4xl">상담 예약</h1>
          <p className="mt-2 max-w-xl text-sm text-white/65">
            부동산 중개 · 경매 권리분석·입찰대행 · 세무/법률/경영진단까지, 원하시는 상담을
            선택해 주세요.
          </p>
        </div>
        <nav className="text-xs text-white/40" aria-label="breadcrumb">
          HOME › <span className="text-[#93c5fd]">상담 예약</span>
        </nav>
      </header>

      {propertyId ? (
        <p className="mb-6 rounded-xl border border-white/10 bg-black/25 px-4 py-2 text-sm text-white/60">
          선택한 매물에 대한 상담입니다. (매물 ID: {propertyId})
        </p>
      ) : null}

      <div className="mb-8 flex flex-wrap gap-2">
        <StepBadge n={1} label="분야 선택" active={showForm && !expanded} done={expanded} />
        <StepBadge n={2} label="신청 정보" active={showForm && expanded} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          {step === 4 && submitted ? (
            <GlassCard className="p-6 md:p-8">
              <p className="text-lg font-bold text-emerald-300">상담 신청이 접수되었습니다.</p>
              <p className="mt-2 text-sm text-white/65">
                아래 조회 비밀번호로 이 페이지 하단에서 진행 상태·답변을 확인할 수 있습니다.
              </p>
              <div className="mt-5 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4">
                <p className="text-xs text-amber-200/70">조회 비밀번호 (꼭 저장해 주세요)</p>
                <p className="mt-1 font-mono text-lg font-bold text-[#fde68a]">
                  {submitted.accessCode}
                </p>
                <p className="mt-2 text-xs text-white/40">
                  접수 식별: …{submitted.caseHint} · 상태: 접수중
                </p>
              </div>
              <button
                type="button"
                className="mt-6 text-sm font-semibold text-[#93c5fd] hover:underline"
                onClick={() => {
                  setStep(1);
                  setSubmitted(null);
                  setCategoryId("");
                  setSubId("");
                  setDetailFields({});
                  setClient({
                    name: "",
                    phone: "",
                    method: "방문 상담 (내포신도시 사무소)",
                    preferredAt: "",
                    agree: false,
                  });
                }}
              >
                새 상담 신청하기
              </button>
            </GlassCard>
          ) : null}

          {showForm ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <GlassCard className="p-5 md:p-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  {SERVICE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCategoryId(cat.id);
                        setSubId("");
                        setDetailFields({});
                      }}
                      className={`rounded-2xl border p-4 text-left transition ${
                        categoryId === cat.id
                          ? "border-[#60a5fa]/60 bg-[#60a5fa]/15"
                          : "border-white/10 bg-black/20 hover:border-white/25"
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-2xl text-[#93c5fd]"
                        aria-hidden
                      >
                        {cat.icon}
                      </span>
                      <p className="mt-2 text-sm font-bold text-white">{cat.title}</p>
                      <p className="mt-1 text-xs text-white/50">{cat.desc}</p>
                    </button>
                  ))}
                </div>
                {category ? (
                  <div
                    className={`mt-5 grid gap-2 ${
                      category.subs.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
                    }`}
                  >
                    {category.subs.map((s) => (
                      <label key={s.id} className={subLabelClass(subId === s.id)}>
                        <input
                          type="radio"
                          name="sub"
                          checked={subId === s.id}
                          onChange={() => {
                            setSubId(s.id);
                            setDetailFields({});
                          }}
                          className="accent-[#60a5fa]"
                        />
                        <span className="leading-snug">{s.label}</span>
                      </label>
                    ))}
                  </div>
                ) : null}
                {!expanded ? (
                  <p className="mt-5 text-center text-xs text-white/40">
                    세부 항목을 선택하면 아래에 신청 정보가 펼쳐집니다.
                  </p>
                ) : null}
              </GlassCard>

              {expanded ? (
                <GlassCard className="p-5 md:p-6">
                  <div className="space-y-3">
                    {categoryId === "brokerage" && subId === "list" ? (
                      <>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <select
                            className={fieldClass}
                            value={detailFields.propertyType ?? ""}
                            onChange={(e) =>
                              setDetailFields({ ...detailFields, propertyType: e.target.value })
                            }
                          >
                            <option value="">매물 유형</option>
                            <option>토지</option>
                            <option>아파트</option>
                            <option>상가·오피스</option>
                            <option>기타</option>
                          </select>
                          <input
                            className={fieldClass}
                            placeholder="희망 금액 (매매가 또는 보증금/월세)"
                            value={detailFields.price ?? ""}
                            onChange={(e) =>
                              setDetailFields({ ...detailFields, price: e.target.value })
                            }
                          />
                        </div>
                        <input
                          className={fieldClass}
                          placeholder="매물 위치 (주소 또는 지역)"
                          value={detailFields.location ?? ""}
                          onChange={(e) =>
                            setDetailFields({ ...detailFields, location: e.target.value })
                          }
                        />
                      </>
                    ) : null}
                    {categoryId === "brokerage" && subId === "find" ? (
                      <>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <select
                            className={fieldClass}
                            value={detailFields.wantType ?? ""}
                            onChange={(e) =>
                              setDetailFields({ ...detailFields, wantType: e.target.value })
                            }
                          >
                            <option value="">희망 매수 유형</option>
                            <option>토지</option>
                            <option>아파트</option>
                            <option>상가·오피스</option>
                            <option>기타</option>
                          </select>
                          <input
                            className={fieldClass}
                            placeholder="예산 범위 (예: 2억~3억)"
                            value={detailFields.budget ?? ""}
                            onChange={(e) =>
                              setDetailFields({ ...detailFields, budget: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            className={fieldClass}
                            placeholder="희망 지역"
                            value={detailFields.region ?? ""}
                            onChange={(e) =>
                              setDetailFields({ ...detailFields, region: e.target.value })
                            }
                          />
                          <select
                            className={fieldClass}
                            value={detailFields.timing ?? ""}
                            onChange={(e) =>
                              setDetailFields({ ...detailFields, timing: e.target.value })
                            }
                          >
                            <option value="">입주/매수 희망 시기</option>
                            <option>즉시</option>
                            <option>3개월 이내</option>
                            <option>6개월 이내</option>
                            <option>협의</option>
                          </select>
                        </div>
                      </>
                    ) : null}
                    {categoryId === "auction" ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          className={fieldClass}
                          placeholder="경매 물건 (사건번호 예: 2025타경12345 또는 주소)"
                          value={detailFields.caseNo ?? ""}
                          onChange={(e) =>
                            setDetailFields({ ...detailFields, caseNo: e.target.value })
                          }
                        />
                        <select
                          className={fieldClass}
                          value={detailFields.purpose ?? ""}
                          onChange={(e) =>
                            setDetailFields({ ...detailFields, purpose: e.target.value })
                          }
                        >
                          <option value="">상담 목적</option>
                          <option>권리분석 요청</option>
                          <option>입찰 대행 요청</option>
                          <option>기타 문의</option>
                        </select>
                      </div>
                    ) : null}
                    {categoryId === "consulting" ? (
                      <input
                        className={fieldClass}
                        placeholder="상담 주제 (예: 양도소득세, 임대차 분쟁, 자산 평가)"
                        value={detailFields.topic ?? ""}
                        onChange={(e) =>
                          setDetailFields({ ...detailFields, topic: e.target.value })
                        }
                      />
                    ) : null}
                    <textarea
                      className={fieldClass}
                      rows={3}
                      placeholder="특이사항 / 요청사항"
                      value={detailFields.note ?? ""}
                      onChange={(e) => setDetailFields({ ...detailFields, note: e.target.value })}
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        className={fieldClass}
                        placeholder="성함"
                        required
                        value={client.name}
                        onChange={(e) => setClient({ ...client, name: e.target.value })}
                      />
                      <input
                        className={fieldClass}
                        placeholder="연락처 010-0000-0000"
                        required
                        value={client.phone}
                        onChange={(e) => setClient({ ...client, phone: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {["방문 상담 (내포신도시 사무소)", "전화 상담", "출장 상담 요청"].map(
                        (m) => (
                          <label key={m} className={methodLabelClass(client.method === m)}>
                            <input
                              type="radio"
                              name="method"
                              checked={client.method === m}
                              onChange={() => setClient({ ...client, method: m })}
                              className="accent-[#60a5fa]"
                            />
                            <span className="leading-snug">{m}</span>
                          </label>
                        ),
                      )}
                    </div>
                    <div>
                      <p className="mb-1.5 text-xs font-bold text-white/50">희망 일시</p>
                      <KoreanDateTimePicker
                        required
                        value={client.preferredAt}
                        onChange={(preferredAt) => setClient({ ...client, preferredAt })}
                      />
                    </div>
                    <label className="flex items-start gap-2 text-xs text-white/60">
                      <input
                        type="checkbox"
                        checked={client.agree}
                        onChange={(e) => setClient({ ...client, agree: e.target.checked })}
                        className="mt-0.5 accent-[#60a5fa]"
                        required
                      />
                      개인정보 수집 및 이용에 동의합니다. (필수)
                    </label>
                    {submitError ? <p className="text-sm text-red-300">{submitError}</p> : null}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-xl bg-gradient-to-r from-cta-from to-cta-to py-3.5 text-sm font-bold text-white disabled:opacity-50"
                    >
                      {submitting ? "접수 중…" : "상담 신청하기"}
                    </button>
                  </div>
                </GlassCard>
              ) : null}
            </form>
          ) : null}
        </div>

        <aside className="space-y-4">
          <GlassCard className="p-5">
            <h3 className="text-sm font-bold text-white">상담 프로세스</h3>
            <ol className="mt-4 space-y-3">
              {processSteps.map((p, i) => (
                <li key={p.title} className="flex gap-3 text-sm">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#60a5fa]/40 text-xs font-bold text-[#93c5fd]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-bold text-white">{p.title}</p>
                    <p className="text-xs text-white/50">{p.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-xs leading-relaxed text-white/70">
              공인중개사 · 권리분석사 · 경영진단사 자격을 갖춘 전문가가 직접 상담합니다.
            </p>
            <Link href="/profile" className="mt-3 inline-block text-xs font-bold text-[#f9a8d4] hover:underline">
              프로필 보기 →
            </Link>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-xs text-white/55">폼 작성이 번거로우신가요?</p>
            <a
              href="tel:041-633-0000"
              className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[#93c5fd]"
            >
              <span className="material-symbols-outlined text-base">call</span>
              041-633-0000
            </a>
          </GlassCard>
        </aside>
      </div>

      <section className="mt-16 border-t border-white/10 pt-12">
        <h2 className="text-xl font-bold text-white">내 상담 내용 확인</h2>
        <p className="mt-2 text-sm text-white/55">
          접수 시 안내된 <strong className="text-white/80">조회 비밀번호</strong>로 진행 상태와
          답변을 확인합니다.
        </p>

        <GlassCard className="mt-6 p-5 md:p-6">
          <form onSubmit={handleLookup} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <input
              className={fieldClass}
              placeholder="성함 (선택)"
              value={lookupName}
              onChange={(e) => setLookupName(e.target.value)}
            />
            <input
              className={fieldClass}
              placeholder="조회 비밀번호"
              value={lookupPw}
              onChange={(e) => setLookupPw(e.target.value)}
              required
            />
            <button
              type="submit"
              className="rounded-xl border border-[#60a5fa]/40 bg-[#60a5fa]/15 px-5 py-3 text-sm font-bold text-[#93c5fd]"
            >
              조회하기
            </button>
          </form>
          {lookupError ? <p className="mt-3 text-sm text-red-300">{lookupError}</p> : null}
        </GlassCard>

        {found ? (
          <GlassCard className="mt-4 overflow-hidden p-0">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-4">
              <div>
                <p className="font-mono text-xs text-white/45">{found.caseId}</p>
                <p className="mt-0.5 text-sm font-bold text-white">
                  {found.category}
                  {found.subCategory ? ` · ${found.subCategory}` : ""}
                </p>
              </div>
              <StatusBadge status={found.status} />
            </div>
            <div className="space-y-4 px-5 py-5 text-sm">
              <div className="grid gap-2 text-white/65 sm:grid-cols-2">
                <p>
                  <span className="text-white/40">신청일</span>{" "}
                  {new Date(found.createdAt).toLocaleString("ko-KR")}
                </p>
                <p>
                  <span className="text-white/40">희망 일정</span> {found.preferredAt ?? "-"}
                </p>
                <p>
                  <span className="text-white/40">상담 방식</span> {found.method ?? "-"}
                </p>
                <p>
                  <span className="text-white/40">신청자</span> {found.clientName} (
                  {found.phoneMasked})
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs font-bold text-white/45">상담 내용</p>
                <p className="mt-2 whitespace-pre-wrap text-white/80">{found.detail}</p>
              </div>
              {found.reply ? (
                <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-bold text-emerald-300">관리자 답변</p>
                    <p className="text-[11px] text-white/40">
                      {found.repliedAt
                        ? new Date(found.repliedAt).toLocaleString("ko-KR")
                        : ""}
                    </p>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-white/85">{found.reply}</p>
                </div>
              ) : (
                <p className="text-sm text-white/45">아직 답변이 등록되지 않았습니다.</p>
              )}
            </div>
          </GlassCard>
        ) : null}

        {boardRows.length > 0 ? (
          <div className="mt-8">
            <p className="mb-3 text-xs font-bold text-white/40">최근 상담 접수 현황</p>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-xs text-white/45">
                  <tr>
                    <th className="px-4 py-3 font-semibold">접수번호</th>
                    <th className="px-4 py-3 font-semibold">분류</th>
                    <th className="px-4 py-3 font-semibold">상태</th>
                    <th className="hidden px-4 py-3 font-semibold sm:table-cell">신청일</th>
                  </tr>
                </thead>
                <tbody>
                  {boardRows.map((row) => (
                    <tr key={row.caseId} className="border-t border-white/10 text-white/70">
                      <td className="px-4 py-3 font-mono text-xs">{row.caseId}</td>
                      <td className="px-4 py-3">{row.category}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="hidden px-4 py-3 text-xs text-white/45 sm:table-cell">
                        {row.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
