"use client";

/**
 * 매물 등록 고도화 목업 — 5-Step 위저드 + 우측 법적 체크리스트
 * 운영 /admin/properties/new 미적용
 */

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CircleAlert,
  Lock,
  ShieldCheck,
} from "lucide-react";
import {
  COMPLIANCE_PROPERTY_SAMPLE as S,
  LEGAL_CHECKLIST_SAMPLE,
  REGISTER_WIZARD_STEPS,
} from "@/lib/mockup/property-compliance-sample";

const panel =
  "rounded-2xl border border-white/10 bg-[rgba(20,18,28,0.78)] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md";
const input =
  "w-full rounded-lg border border-white/15 bg-[rgba(10,10,18,0.55)] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#a78bfa]/50 focus:outline-none";
const label = "mb-1 block text-xs font-semibold text-[#c4b5fd]/85";

type MaintMode = "NONE" | "ACTUAL" | "FIXED";

export function PropertyRegisterComplianceSample() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("아파트");
  const [maintMode, setMaintMode] = useState<MaintMode>("FIXED");
  const [maintTotal, setMaintTotal] = useState(11.5); // 만원
  const [floorBand, setFloorBand] = useState(false);
  const [illegal, setIllegal] = useState(false);
  const [unregSet, setUnregSet] = useState(false);
  const [desc, setDesc] = useState(S.description);
  const isRetail = category === "상가" || category === "사무실";

  const checklist = useMemo(() => {
    const items = LEGAL_CHECKLIST_SAMPLE.map((c) => ({ ...c }));
    const maintItem = items.find((i) => i.id === "maint");
    // 정액·10만+이면 7비목 폼 노출(목업에서는 입력 완료로 간주). 미선택 모드만 미충족.
    if (maintItem) {
      maintItem.ok = maintMode === "NONE" || maintMode === "ACTUAL" || maintTotal > 0;
    }
    const unreg = items.find((i) => i.id === "unreg");
    if (unreg) unreg.ok = unregSet;
    const ill = items.find((i) => i.id === "illegal");
    if (ill) ill.ok = true; // always answered
    return items;
  }, [maintMode, maintTotal, unregSet]);

  const okCount = checklist.filter((c) => c.ok).length;
  const adWarn = /최저가|무조건 수익|보장/.test(desc);

  function next() {
    setStep((s) => Math.min(5, s + 1));
  }
  function prev() {
    setStep((s) => Math.max(1, s - 1));
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-200">
      <div className="border-b border-emerald-400/30 bg-[#0a1210] px-4 py-3 text-center text-xs text-emerald-100/90">
        <p className="font-bold text-emerald-50">매물 등록 고도화 목업 — 운영 적용됨</p>
        <p className="mt-1 text-[11px] text-emerald-100/70">
          실제: /admin/properties/new · 5-Step · 7비목 · 법적 체크리스트
        </p>
        <p className="mt-1.5 flex flex-wrap justify-center gap-3 text-[11px]">
          <Link href="/mockup/property-detail-conversion" className="font-semibold text-[#c4b5fd] underline-offset-2 hover:underline">
            고객 상세 전환 목업 →
          </Link>
          <Link href="/mockup/property-compliance-hub" className="text-amber-100/60 underline-offset-2 hover:underline">
            허브
          </Link>
        </p>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-5 md:px-6">
        {/* Progress */}
        <div className={`${panel} mb-4 p-4`}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-lg font-extrabold text-white">매물 등록 · 법적 준수 위저드</h1>
            <span className="text-xs text-white/45">Step {step} / 5</span>
          </div>
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {REGISTER_WIZARD_STEPS.map((s) => {
              const active = s.id === step;
              const done = s.id < step;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setStep(s.id)}
                    className={`w-full rounded-xl border px-2 py-2 text-left transition ${
                      active
                        ? "border-[#a78bfa]/55 bg-[#a78bfa]/15"
                        : done
                          ? "border-emerald-400/30 bg-emerald-500/10"
                          : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-white/90">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                          done ? "bg-emerald-500/30 text-emerald-200" : "bg-white/10 text-white/70"
                        }`}
                      >
                        {done ? <Check className="h-3 w-3" /> : s.id}
                      </span>
                      {s.title}
                    </span>
                    <span className="mt-0.5 block pl-6 text-[10px] text-white/40">{s.sub}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Main */}
          <div className={`${panel} p-4 md:p-5`}>
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-white">1. 매물 분류 · 주소 검색</h2>
                <div>
                  <span className={label}>매물 유형</span>
                  <div className="flex flex-wrap gap-2">
                    {["아파트", "오피스텔", "원룸", "상가", "사무실", "토지"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setCategory(c);
                          if (c === "상가" || c === "사무실") setFloorBand(false);
                        }}
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                          category === c
                            ? "border-[#a78bfa] bg-[#a78bfa]/20 text-[#ddd6fe]"
                            : "border-white/15 text-white/60"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className={label}>주소 검색 (건축물대장 API 시뮬레이션)</span>
                  <div className="flex gap-2">
                    <input className={input} defaultValue={S.address} readOnly />
                    <button
                      type="button"
                      className="shrink-0 rounded-lg bg-gradient-to-r from-[#4dabff] to-[#913dff] px-3 text-xs font-bold text-white"
                    >
                      대장 조회
                    </button>
                  </div>
                </div>
                <div className="rounded-xl border border-sky-400/25 bg-sky-500/10 p-3 text-xs text-sky-100/90">
                  <p className="mb-2 flex items-center gap-1.5 font-bold">
                    <Building2 className="h-3.5 w-3.5" />
                    건축물대장 자동기입 · 잠금
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      ["전용면적", `${S.exclusiveArea}㎡`],
                      ["총층수", `${S.totalFloors}층`],
                      ["주용도", S.buildingUse],
                      ["사용승인일", S.useApprovalDate],
                      ["대장 주차", `${S.parkingTotal}대`],
                      ["동/호", `${S.unitDong} ${S.unitHo}`],
                    ].map(([k, v]) => (
                      <label key={k} className="flex items-center gap-2 rounded-lg bg-black/20 px-2 py-1.5">
                        <Lock className="h-3 w-3 text-sky-300/70" />
                        <span className="text-white/45">{k}</span>
                        <span className="ml-auto font-semibold text-white">{v}</span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-[10px] text-sky-100/50">수정 시 사유 입력이 필요합니다. (목업)</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-white">2. 매물 상세 · 면적</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="전용면적 (㎡)">
                    <input className={input} defaultValue={S.exclusiveArea} />
                    <p className="mt-1 text-[10px] text-white/35">≈ {(S.exclusiveArea / 3.3058).toFixed(1)}평</p>
                  </Field>
                  <Field label="공급면적 (㎡)">
                    <input className={input} defaultValue={S.supplyArea} />
                  </Field>
                  <Field label="해당층">
                    <input className={input} defaultValue={S.floor} disabled={floorBand} />
                  </Field>
                  <Field label="총층수">
                    <input className={input} defaultValue={S.totalFloors} />
                  </Field>
                  <Field label="방향">
                    <select className={input} defaultValue={S.direction}>
                      <option>남향</option>
                      <option>남동향</option>
                      <option>동향</option>
                      <option>서향</option>
                    </select>
                  </Field>
                  <Field label="방향 기준점 *">
                    <select className={input} defaultValue={S.directionBasis}>
                      <option>거실 창문 기준</option>
                      <option>안방 기준</option>
                      <option>주된 창문 기준</option>
                    </select>
                  </Field>
                  <Field label="총 주차대수">
                    <input className={input} defaultValue={S.parkingTotal} />
                  </Field>
                  <Field label="실사용 가능 주차">
                    <input className={input} defaultValue={S.parkingActual} />
                  </Field>
                  {!isRetail && (
                    <>
                      <Field label="방 수">
                        <input className={input} defaultValue={S.rooms} />
                      </Field>
                      <Field label="욕실 수">
                        <input className={input} defaultValue={S.bathrooms} />
                      </Field>
                    </>
                  )}
                </div>
                <label
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm ${
                    isRetail
                      ? "cursor-not-allowed border-white/10 text-white/30"
                      : "border-white/15 text-white/80"
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={isRetail}
                    checked={floorBand}
                    onChange={(e) => setFloorBand(e.target.checked)}
                  />
                  중개의뢰인 미희망 시 층수 저/중/고 표시
                  {isRetail ? (
                    <span className="ml-auto text-[10px] text-rose-300/80">상가·비주거 불가</span>
                  ) : null}
                </label>
                {floorBand && !isRetail ? (
                  <div className="flex gap-2">
                    {["저", "중", "고"].map((b) => (
                      <span
                        key={b}
                        className="rounded-lg border border-[#a78bfa]/40 bg-[#a78bfa]/12 px-3 py-1.5 text-xs font-bold text-[#ddd6fe]"
                      >
                        {b}층대
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-white">3. 가격 · 관리비</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="거래 유형">
                    <select className={input} defaultValue="매매">
                      <option>매매</option>
                      <option>전세</option>
                      <option>월세</option>
                      <option>분양권</option>
                    </select>
                  </Field>
                  <Field label="매매가 (만원)">
                    <input className={input} defaultValue={32500} />
                  </Field>
                </div>
                <div>
                  <span className={label}>관리비 부과 방식</span>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ["NONE", "관리비 없음"],
                        ["ACTUAL", "실비 부과"],
                        ["FIXED", "정액 관리비"],
                      ] as const
                    ).map(([k, t]) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setMaintMode(k)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                          maintMode === k
                            ? "border-[#a78bfa] bg-[#a78bfa]/20 text-[#ddd6fe]"
                            : "border-white/15 text-white/60"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                {maintMode === "FIXED" ? (
                  <div className="space-y-3 rounded-xl border border-amber-400/30 bg-amber-500/5 p-3">
                    <Field label="월 정액 관리비 (만원)">
                      <input
                        className={input}
                        type="number"
                        step="0.1"
                        value={maintTotal}
                        onChange={(e) => setMaintTotal(Number(e.target.value))}
                      />
                    </Field>
                    {maintTotal >= 10 ? (
                      <>
                        <p className="flex items-center gap-1.5 text-xs font-bold text-amber-200">
                          <CircleAlert className="h-3.5 w-3.5" />
                          월 10만원 이상 — 7대 비목 금액 필수
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {S.maintenance.map((m) => (
                            <Field key={m.key} label={`${m.label} (원)`}>
                              <input
                                className={input}
                                defaultValue={m.amount ?? ""}
                                placeholder={m.amount == null ? "실비 또는 사유" : undefined}
                              />
                            </Field>
                          ))}
                        </div>
                        <Field label="비목 미고지 시 사유">
                          <select className={input} defaultValue="">
                            <option value="">해당 없음</option>
                            <option>임대인 세부 내역 미고지</option>
                            <option>관리규약상 비공개</option>
                          </select>
                        </Field>
                      </>
                    ) : (
                      <p className="text-xs text-white/45">10만원 미만이면 세부 비목 생략 가능</p>
                    )}
                  </div>
                ) : null}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-white">4. 법적 상태 · 담당자</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-sm">
                    <input
                      type="checkbox"
                      checked={illegal}
                      onChange={(e) => setIllegal(e.target.checked)}
                    />
                    위반건축물
                  </label>
                  <label className="flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-sm">
                    <input
                      type="checkbox"
                      checked={unregSet}
                      onChange={(e) => setUnregSet(e.target.checked)}
                    />
                    미등기 건물 여부 확인 완료
                  </label>
                </div>
                {illegal ? (
                  <p className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
                    설명란에 「위반건축물」 문구가 자동 삽입됩니다. (목업)
                  </p>
                ) : null}
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="입주 가능일">
                    <select className={input} defaultValue="즉시입주">
                      <option>즉시입주</option>
                      <option>협의가능</option>
                      <option>지정일</option>
                    </select>
                  </Field>
                  <Field label="사용승인일">
                    <input className={input} type="date" defaultValue={S.useApprovalDate} />
                  </Field>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="mb-2 text-xs font-bold text-[#ddd6fe]">담당 중개사 병기</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Field label="개업공인중개사">
                      <input className={input} defaultValue={S.office.brokerName} readOnly />
                    </Field>
                    <Field label="개업 연락처">
                      <input className={input} defaultValue={S.office.brokerPhone} readOnly />
                    </Field>
                    <Field label="소속공인중개사">
                      <input className={input} defaultValue={S.office.agentName} />
                    </Field>
                    <Field label="소속 연락처">
                      <input className={input} defaultValue={S.office.agentPhone} />
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-white">5. 미디어 · 상세 설명</h2>
                <div className="flex h-36 items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/[0.03] text-sm text-white/40">
                  드래그 앤 드롭 · 대표 / 실내 / 평면도 (목업)
                </div>
                <Field label="상세 설명 (부당광고 린터)">
                  <textarea
                    className={`${input} min-h-[140px]`}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </Field>
                {adWarn ? (
                  <p className="flex items-center gap-1.5 rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
                    <CircleAlert className="h-3.5 w-3.5" />
                    부당 표시·광고 우려 문구 감지: 「최저가 / 무조건 수익 / 보장」
                  </p>
                ) : (
                  <p className="text-[11px] text-white/35">
                    팁: 설명에 「최저가 보장」을 넣어 린터 경고를 확인해 보세요.
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-between gap-2 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={prev}
                disabled={step === 1}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-4 py-2 text-sm font-bold text-white/70 disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" />
                이전
              </button>
              {step < 5 ? (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-4 py-2 text-sm font-bold text-white"
                >
                  다음
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-4 py-2 text-sm font-bold text-white"
                >
                  <ShieldCheck className="h-4 w-4" />
                  법적 검증 후 등록 (목업)
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
            <div className={`${panel} p-4`}>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-[#ddd6fe]">
                <ShieldCheck className="h-3.5 w-3.5" />
                법적 필수 체크리스트
              </p>
              <p className="mb-3 text-[11px] text-white/40">
                {okCount}/{checklist.length} 충족
              </p>
              <ul className="space-y-1.5">
                {checklist.map((c) => (
                  <li
                    key={c.id}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] ${
                      c.ok ? "bg-emerald-500/10 text-emerald-100/90" : "bg-rose-500/10 text-rose-100/90"
                    }`}
                  >
                    {c.ok ? <Check className="h-3 w-3 shrink-0" /> : <CircleAlert className="h-3 w-3 shrink-0" />}
                    {c.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${panel} p-4`}>
              <p className="mb-2 text-xs font-bold text-sky-200">건축물대장 API</p>
              <p className="text-[11px] text-white/50">상태: 시뮬레이션 연동 완료</p>
              <p className="mt-1 text-[10px] text-white/35">실키 연동은 Phase 2 · 운영 미적용</p>
            </div>
            <Link
              href="/mockup/property-detail-conversion"
              className="block rounded-xl border border-[#a78bfa]/35 bg-[#a78bfa]/10 px-3 py-2.5 text-center text-xs font-bold text-[#ddd6fe] hover:bg-[#a78bfa]/20"
            >
              고객 화면 미리보기
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({ label: l, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={label}>{l}</span>
      {children}
    </label>
  );
}
