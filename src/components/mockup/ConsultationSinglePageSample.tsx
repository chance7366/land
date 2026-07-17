"use client";

import { useMemo, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SERVICE_CATEGORIES } from "@/lib/consultation";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#60a5fa] focus:outline-none";

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

/**
 * 목업: STEP1 세부 선택 시 상세·고객일정이 같은 화면으로 펼쳐짐.
 * 프로덕션 미적용 · API 미연동.
 */
export function ConsultationSinglePageSample() {
  const [categoryId, setCategoryId] = useState<(typeof SERVICE_CATEGORIES)[number]["id"] | "">(
    "",
  );
  const [subId, setSubId] = useState("");
  const [detailFields, setDetailFields] = useState<Record<string, string>>({});
  const [client, setClient] = useState({
    name: "",
    phone: "",
    method: "방문 상담 (내포신도시 사무소)",
    date: "",
    time: "14:00",
    agree: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const category = SERVICE_CATEGORIES.find((c) => c.id === categoryId);
  const sub = category?.subs.find((s) => s.id === subId);
  const expanded = Boolean(category && sub);

  const processSteps = useMemo(
    () => [
      { title: "예약 접수", desc: "상담 신청서 작성" },
      { title: "사전 검토", desc: "매물·사건 사전 분석" },
      { title: "전문 상담", desc: "1:1 방문·전화 상담" },
    ],
    [],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!client.agree || !expanded) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <GlassCard className="p-6 md:p-8">
        <p className="text-lg font-bold text-emerald-300">상담 신청이 접수되었습니다. (목업)</p>
        <p className="mt-2 text-sm text-white/65">
          한 화면 작성 흐름 미리보기입니다. 실제 접수·비밀번호는 저장되지 않습니다.
        </p>
        <button
          type="button"
          className="mt-6 text-sm font-semibold text-[#93c5fd] hover:underline"
          onClick={() => {
            setSubmitted(false);
            setCategoryId("");
            setSubId("");
            setDetailFields({});
            setClient({
              name: "",
              phone: "",
              method: "방문 상담 (내포신도시 사무소)",
              date: "",
              time: "14:00",
              agree: false,
            });
          }}
        >
          다시 작성해보기
        </button>
      </GlassCard>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        <div className="mb-2 flex flex-wrap gap-2">
          <StepBadge n={1} label="분야 선택" active={!expanded} done={expanded} />
          <StepBadge n={2} label="상세 정보" active={expanded} done={false} />
          <StepBadge n={3} label="고객·일정" active={expanded} done={false} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* STEP 1 */}
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
                    setDetailFields({});
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
                      onChange={() => {
                        setSubId(s.id);
                        setDetailFields({});
                      }}
                      className="accent-[#60a5fa]"
                    />
                    {s.label}
                  </label>
                ))}
              </div>
            ) : null}
            {!expanded ? (
              <p className="mt-5 text-center text-xs text-white/40">
                세부 항목을 선택하면 아래에 상세 정보·고객 일정이 펼쳐집니다.
              </p>
            ) : null}
          </GlassCard>

          {/* STEP 2 — 펼침 */}
          {expanded ? (
            <GlassCard className="animate-in fade-in slide-in-from-top-2 p-5 duration-300 md:p-6">
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
                      onChange={(e) =>
                        setDetailFields({ ...detailFields, price: e.target.value })
                      }
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
                      placeholder="희망 지역"
                      value={detailFields.region ?? ""}
                      onChange={(e) =>
                        setDetailFields({ ...detailFields, region: e.target.value })
                      }
                    />
                    <input
                      className={fieldClass}
                      placeholder="예산 범위 (예: 2억~3억)"
                      value={detailFields.budget ?? ""}
                      onChange={(e) =>
                        setDetailFields({ ...detailFields, budget: e.target.value })
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
                  </>
                ) : null}
                {categoryId === "auction" ? (
                  <>
                    <input
                      className={fieldClass}
                      placeholder="경매 물건 (사건번호 또는 주소)"
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
                  </>
                ) : null}
                {categoryId === "consulting" ? (
                  <input
                    className={fieldClass}
                    placeholder="상담 주제 (예: 양도소득세, 임대차 분쟁)"
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
            </GlassCard>
          ) : null}

          {/* STEP 3 — 펼침 */}
          {expanded ? (
            <GlassCard className="animate-in fade-in slide-in-from-top-2 p-5 duration-300 md:p-6">
              <h2 className="text-base font-bold text-white">STEP 3 · 고객 정보 · 상담 방식</h2>
              <div className="mt-5 space-y-3">
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
                <button
                  type="submit"
                  className="mt-2 w-full rounded-xl bg-gradient-to-r from-cta-from to-cta-to py-3.5 text-sm font-bold text-white"
                >
                  상담 신청하기
                </button>
              </div>
            </GlassCard>
          ) : null}
        </form>
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
          <p className="text-xs leading-relaxed text-white/45">
            목업 · 단계 이동 없이 한 화면에서 작성합니다. 「다음 단계」 버튼이 없습니다.
          </p>
        </GlassCard>
      </aside>
    </div>
  );
}
