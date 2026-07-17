"use client";

import { useMemo, useState } from "react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  CONSULT_STATUS_LABEL,
  MOCK_CONSULTS,
  SERVICE_CATEGORIES,
  type ConsultStatus,
  type MockConsult,
} from "@/lib/mockup/consultation-sample-data";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#60a5fa] focus:outline-none";

function StatusBadge({ status }: { status: ConsultStatus }) {
  const meta = CONSULT_STATUS_LABEL[status];
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

function StepBadge({ n, label, active }: { n: number; label: string; active: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
        active
          ? "border-[#60a5fa]/50 bg-[#60a5fa]/15 text-[#93c5fd]"
          : "border-white/10 bg-white/5 text-white/45"
      }`}
    >
      <span>{n}</span>
      <span>{label}</span>
    </div>
  );
}

/** 샘플: 3단계 상담예약 + 하단 비밀번호 조회 게시판 */
export function ConsultationSampleClient() {
  const [step, setStep] = useState(1);
  const [categoryId, setCategoryId] = useState<(typeof SERVICE_CATEGORIES)[number]["id"] | "">(
    "",
  );
  const [subId, setSubId] = useState("");
  const [detailFields, setDetailFields] = useState<Record<string, string>>({});
  const [client, setClient] = useState({
    name: "",
    phone: "",
    method: "방문 상담",
    date: "",
    time: "14:00",
    agree: false,
  });
  const [submitted, setSubmitted] = useState<{ id: string; password: string } | null>(null);

  const [lookupPw, setLookupPw] = useState("");
  const [lookupName, setLookupName] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [found, setFound] = useState<MockConsult | null>(null);
  const [boardOpen, setBoardOpen] = useState(false);

  const category = SERVICE_CATEGORIES.find((c) => c.id === categoryId);
  const sub = category?.subs.find((s) => s.id === subId);

  const processSteps = useMemo(
    () => [
      { title: "예약 접수", desc: "상담 신청서 작성" },
      { title: "사전 검토", desc: "매물·사건 사전 분석" },
      { title: "전문 상담", desc: "1:1 방문·전화 상담" },
    ],
    [],
  );

  function goNextFromStep1() {
    if (!categoryId || !subId) return;
    setStep(2);
  }

  function goNextFromStep2() {
    setStep(3);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!client.agree) return;
    const id = `CS-${Date.now().toString().slice(-8)}`;
    const password = Math.random().toString(36).slice(2, 8);
    setSubmitted({ id, password });
    setStep(4);
  }

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setLookupError("");
    const hit = MOCK_CONSULTS.find(
      (c) =>
        c.password === lookupPw.trim() &&
        (lookupName.trim() === "" || c.clientName === lookupName.trim()),
    );
    if (!hit) {
      setFound(null);
      setLookupError("일치하는 상담 내역이 없습니다. 접수번호·비밀번호를 확인해 주세요.");
      return;
    }
    setFound(hit);
    setBoardOpen(true);
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

      <div className="mb-8 flex flex-wrap gap-2">
        <StepBadge n={1} label="분야 선택" active={step === 1} />
        <StepBadge n={2} label="상세 정보" active={step === 2} />
        <StepBadge n={3} label="고객·일정" active={step === 3 || step === 4} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          {step === 4 && submitted ? (
            <GlassCard className="p-6 md:p-8">
              <p className="text-lg font-bold text-emerald-300">상담 신청이 접수되었습니다.</p>
              <p className="mt-2 text-sm text-white/65">
                아래 접수번호와 비밀번호로 하단에서 진행 상태·답변을 확인할 수 있습니다.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                  <p className="text-xs text-white/45">접수번호</p>
                  <p className="mt-1 font-mono text-sm font-bold text-white">{submitted.id}</p>
                </div>
                <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-4">
                  <p className="text-xs text-amber-200/70">조회 비밀번호</p>
                  <p className="mt-1 font-mono text-sm font-bold text-[#fde68a]">
                    {submitted.password}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-xs text-white/40">
                ※ 샘플 페이지입니다. 실제 저장·알림은 반영 시 연동됩니다.
              </p>
              <button
                type="button"
                className="mt-6 text-sm font-semibold text-[#93c5fd] hover:underline"
                onClick={() => {
                  setStep(1);
                  setSubmitted(null);
                  setCategoryId("");
                  setSubId("");
                }}
              >
                새 상담 신청하기
              </button>
            </GlassCard>
          ) : null}

          {step === 1 ? (
            <GlassCard className="p-5 md:p-6">
              <h2 className="text-base font-bold text-white">STEP 1 · 상담 분야 선택</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {SERVICE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategoryId(cat.id);
                      setSubId("");
                    }}
                    className={`rounded-2xl border p-4 text-left transition ${
                      categoryId === cat.id
                        ? "border-[#60a5fa]/60 bg-[#60a5fa]/15"
                        : "border-white/10 bg-black/20 hover:border-white/25"
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl text-[#93c5fd]" aria-hidden>
                      {cat.icon}
                    </span>
                    <p className="mt-2 text-sm font-bold text-white">{cat.title}</p>
                    <p className="mt-1 text-xs text-white/50">{cat.desc}</p>
                  </button>
                ))}
              </div>
              {category ? (
                <div className="mt-5 space-y-2">
                  <p className="text-xs font-bold text-white/50">세부 선택</p>
                  {category.subs.map((s) => (
                    <label
                      key={s.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                        subId === s.id
                          ? "border-[#60a5fa]/50 bg-[#60a5fa]/10 text-white"
                          : "border-white/10 text-white/70 hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="sub"
                        checked={subId === s.id}
                        onChange={() => setSubId(s.id)}
                        className="accent-[#60a5fa]"
                      />
                      {s.label}
                    </label>
                  ))}
                </div>
              ) : null}
              <button
                type="button"
                disabled={!categoryId || !subId}
                onClick={goNextFromStep1}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-cta-from to-cta-to py-3.5 text-sm font-bold text-white disabled:opacity-40"
              >
                다음 단계
              </button>
            </GlassCard>
          ) : null}

          {step === 2 ? (
            <GlassCard className="p-5 md:p-6">
              <h2 className="text-base font-bold text-white">STEP 2 · 상세 정보</h2>
              <p className="mt-1 text-xs text-white/50">
                {category?.title} · {sub?.label}
              </p>
              <div className="mt-5 space-y-3">
                {categoryId === "brokerage" && subId === "list" ? (
                  <>
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
                      placeholder="매물 위치 (주소 또는 지역)"
                      value={detailFields.location ?? ""}
                      onChange={(e) =>
                        setDetailFields({ ...detailFields, location: e.target.value })
                      }
                    />
                    <input
                      className={fieldClass}
                      placeholder="희망 금액 (매매가 또는 보증금/월세)"
                      value={detailFields.price ?? ""}
                      onChange={(e) => setDetailFields({ ...detailFields, price: e.target.value })}
                    />
                  </>
                ) : null}
                {categoryId === "brokerage" && subId === "find" ? (
                  <>
                    <select
                      className={fieldClass}
                      value={detailFields.wantType ?? ""}
                      onChange={(e) =>
                        setDetailFields({ ...detailFields, wantType: e.target.value })
                      }
                    >
                      <option value="">희망 매물 유형</option>
                      <option>토지</option>
                      <option>아파트</option>
                      <option>상가·오피스</option>
                      <option>기타</option>
                    </select>
                    <input
                      className={fieldClass}
                      placeholder="희망 지역 (홍성, 예산, 서산, 당진, 천안, 아산, 세종, 대전 등)"
                      value={detailFields.region ?? ""}
                      onChange={(e) => setDetailFields({ ...detailFields, region: e.target.value })}
                    />
                    <input
                      className={fieldClass}
                      placeholder="예산 범위 (예: 2억~3억)"
                      value={detailFields.budget ?? ""}
                      onChange={(e) => setDetailFields({ ...detailFields, budget: e.target.value })}
                    />
                    <select
                      className={fieldClass}
                      value={detailFields.timing ?? ""}
                      onChange={(e) => setDetailFields({ ...detailFields, timing: e.target.value })}
                    >
                      <option value="">입주/매수 희망 시기</option>
                      <option>즉시</option>
                      <option>3개월 이내</option>
                      <option>6개월 이내</option>
                      <option>협의</option>
                    </select>
                  </>
                ) : null}
                {categoryId === "auction" ? (
                  <>
                    <input
                      className={fieldClass}
                      placeholder="경매 물건 (사건번호 예: 2025타경12345 또는 주소)"
                      value={detailFields.caseNo ?? ""}
                      onChange={(e) => setDetailFields({ ...detailFields, caseNo: e.target.value })}
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
                  </>
                ) : null}
                {categoryId === "consulting" ? (
                  <input
                    className={fieldClass}
                    placeholder="상담 주제 (예: 양도소득세, 임대차 분쟁, 자산 평가)"
                    value={detailFields.topic ?? ""}
                    onChange={(e) => setDetailFields({ ...detailFields, topic: e.target.value })}
                  />
                ) : null}
                <textarea
                  className={fieldClass}
                  rows={4}
                  placeholder="특이사항 / 요청사항"
                  value={detailFields.note ?? ""}
                  onChange={(e) => setDetailFields({ ...detailFields, note: e.target.value })}
                />
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl border border-white/15 py-3 text-sm font-bold text-white/70"
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={goNextFromStep2}
                  className="flex-[2] rounded-xl bg-gradient-to-r from-cta-from to-cta-to py-3 text-sm font-bold text-white"
                >
                  다음 단계
                </button>
              </div>
            </GlassCard>
          ) : null}

          {step === 3 ? (
            <GlassCard className="p-5 md:p-6">
              <h2 className="text-base font-bold text-white">STEP 3 · 고객 정보 · 상담 방식</h2>
              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
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
                <div className="space-y-2">
                  <p className="text-xs font-bold text-white/50">상담 방식</p>
                  {["방문 상담 (내포신도시 사무소)", "전화 상담", "출장 상담 요청"].map((m) => (
                    <label
                      key={m}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/75"
                    >
                      <input
                        type="radio"
                        name="method"
                        checked={client.method === m}
                        onChange={() => setClient({ ...client, method: m })}
                        className="accent-[#60a5fa]"
                      />
                      {m}
                    </label>
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="date"
                    className={fieldClass}
                    required
                    value={client.date}
                    onChange={(e) => setClient({ ...client, date: e.target.value })}
                  />
                  <select
                    className={fieldClass}
                    value={client.time}
                    onChange={(e) => setClient({ ...client, time: e.target.value })}
                  >
                    {["10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
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
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 rounded-xl border border-white/15 py-3 text-sm font-bold text-white/70"
                  >
                    이전
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] rounded-xl bg-gradient-to-r from-cta-from to-cta-to py-3 text-sm font-bold text-white"
                  >
                    상담 신청하기
                  </button>
                </div>
              </form>
            </GlassCard>
          ) : null}
        </div>

        {/* Side trust */}
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

      {/* Password lookup board */}
      <section className="mt-16 border-t border-white/10 pt-12">
        <h2 className="text-xl font-bold text-white">내 상담 내용 확인</h2>
        <p className="mt-2 text-sm text-white/55">
          접수 시 안내된 <strong className="text-white/80">조회 비밀번호</strong>로 진행 상태와
          답변을 확인합니다. (샘플 비밀번호:{" "}
          <code className="text-[#fde68a]">a1b2c3</code> / 성함 홍길동)
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

        {boardOpen && found ? (
          <GlassCard className="mt-4 overflow-hidden p-0">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-4">
              <div>
                <p className="font-mono text-xs text-white/45">{found.id}</p>
                <p className="mt-0.5 text-sm font-bold text-white">
                  {found.category} · {found.subType}
                </p>
              </div>
              <StatusBadge status={found.status} />
            </div>
            <div className="space-y-4 px-5 py-5 text-sm">
              <div className="grid gap-2 text-white/65 sm:grid-cols-2">
                <p>
                  <span className="text-white/40">신청일</span> {found.createdAt}
                </p>
                <p>
                  <span className="text-white/40">희망 일정</span> {found.preferredAt}
                </p>
                <p>
                  <span className="text-white/40">상담 방식</span> {found.method}
                </p>
                <p>
                  <span className="text-white/40">신청자</span> {found.clientName}
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
                      {found.reply.adminName} · {found.reply.repliedAt}
                    </p>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-white/85">{found.reply.body}</p>
                </div>
              ) : (
                <p className="text-sm text-white/45">아직 답변이 등록되지 않았습니다.</p>
              )}
            </div>
          </GlassCard>
        ) : null}

        {/* Mini board list preview */}
        <div className="mt-8">
          <p className="mb-3 text-xs font-bold text-white/40">최근 상담 게시판 미리보기 (마스킹)</p>
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
                {MOCK_CONSULTS.map((row) => (
                  <tr key={row.id} className="border-t border-white/10 text-white/70">
                    <td className="px-4 py-3 font-mono text-xs">{row.id}</td>
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
      </section>
    </div>
  );
}
