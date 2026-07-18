"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  CalendarPlus,
  ImagePlus,
  List,
  Plus,
  Search,
  Sparkles,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppLink as Link } from "@/components/ui/AppLink";
import { DataTable } from "@/components/ui/DataTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge, CustomerTendencyBadges } from "@/components/admin/customers/customer-badges";
import {
  CONTACT_METHOD_LABELS,
  CONTACT_METHODS,
  PIPELINE_LABELS,
  PIPELINE_STAGES,
  PURPOSE_LABELS,
  formatContactMethods,
  normalizePhone,
  parseContactMethods,
  type CustomerCardDTO,
  type CustomerWriteInput,
} from "@/lib/customers/types";

type View = "dashboard" | "list" | "create";

/** 메인 헤더(맞춤알림·상담·YouTube·블로그)와 같은 채널 버튼 톤 */
function channelBtn(tone: "amber" | "violet" | "sky" | "emerald", active: boolean) {
  const tones = {
    amber: active
      ? "border-amber-400/55 bg-amber-500/25 text-landing-text"
      : "border-amber-400/35 bg-amber-500/15 text-landing-text hover:border-amber-400/55 hover:bg-amber-500/25",
    violet: active
      ? "border-violet-400/55 bg-violet-500/25 text-landing-text"
      : "border-landing-border bg-violet-500/15 text-landing-text hover:border-violet-400/50 hover:bg-violet-500/25",
    sky: active
      ? "border-sky-400/55 bg-sky-500/25 text-landing-text"
      : "border-landing-border bg-sky-500/10 text-landing-text hover:border-sky-400/50 hover:bg-sky-500/20",
    emerald: active
      ? "border-emerald-400/55 bg-emerald-500/25 text-landing-text"
      : "border-landing-border bg-emerald-500/10 text-landing-text hover:border-emerald-400/50 hover:bg-emerald-500/20",
  } as const;
  return `inline-flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-[11px] font-bold transition-colors disabled:opacity-50 sm:px-3 ${tones[tone]}`;
}

const iconTone = {
  amber: "text-amber-300",
  violet: "text-violet-400",
  sky: "text-sky-400",
  emerald: "text-emerald-400",
} as const;

const tipStyle = {
  background: "#0f121c",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  fontSize: 12,
};

const fieldClass =
  "mt-1 w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-[#4dabff]/50 focus:outline-none";

const labelClass = "block text-xs font-medium text-white/55";

function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-3 border-b border-white/10 pb-2">
      <h3 className="text-sm font-bold text-white">{title}</h3>
      {hint ? <p className="mt-0.5 text-[11px] text-white/40">{hint}</p> : null}
    </div>
  );
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function inDays(iso: string | null, within: number) {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return false;
  const now = Date.now();
  return t >= now && t <= now + within * 24 * 60 * 60 * 1000;
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

function matchesQuery(c: CustomerCardDTO, q: string) {
  if (!q.trim()) return true;
  const channels = parseContactMethods(c.primaryContactMethod);
  const hay = [
    c.name,
    c.phone,
    normalizePhone(c.phone),
    c.email ?? "",
    c.currentAddress ?? "",
    c.inquiryDetails,
    c.requestNotes,
    c.specialNotes,
    c.budgetRange ?? "",
    c.familyMembers ?? "",
    c.preferredBrand ?? "",
    c.decisionMaker ?? "",
    channels.map((ch) => CONTACT_METHOD_LABELS[ch] ?? ch).join(" "),
    PURPOSE_LABELS[c.purpose] ?? c.purpose,
    PIPELINE_LABELS[c.pipelineStage] ?? c.pipelineStage,
    c.hasTraded ? "기존거래 기존고객" : "신규",
    c.isSubscribed ? "맞춤알림" : "",
  ]
    .join(" ")
    .toLowerCase();
  return q
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .every((token) => hay.includes(token) || hay.includes(normalizePhone(token)));
}

function toWriteInput(form: CreateForm): CustomerWriteInput {
  return {
    name: form.name.trim(),
    phone: form.phone.trim(),
    email: form.email.trim() || null,
    currentAddress: form.currentAddress.trim() || null,
    profileImage: form.profileImage.trim() || null,
    primaryContactMethod: formatContactMethods(form.contactChannels),
    hasTraded: form.hasTraded,
    isSubscribed: form.isSubscribed,
    pipelineStage: form.pipelineStage,
    budgetRange: form.budgetRange.trim() || null,
    needsLoan: form.needsLoan,
    purpose: form.purpose,
    moveUrgency: form.moveUrgency,
    moveDate: form.moveDate || null,
    familyMembers: form.familyMembers.trim() || null,
    preferredBrand: form.preferredBrand.trim() || null,
    decisionMaker: form.decisionMaker.trim() || null,
    inquiryDetails: form.inquiryDetails,
    requestNotes: form.requestNotes,
    specialNotes: form.specialNotes,
  };
}

export function AdminCustomersClient({ initialItems }: { initialItems: CustomerCardDTO[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [view, setView] = useState<View>("dashboard");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateForm>(emptyCreate);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [phoneHits, setPhoneHits] = useState<CustomerCardDTO[]>([]);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    const phone = form.phone.trim();
    if (view !== "create" || normalizePhone(phone).length < 8) {
      setPhoneHits([]);
      return;
    }
    const t = window.setTimeout(() => {
      void fetch(`/api/admin/customers?phone=${encodeURIComponent(phone)}`)
        .then((r) => r.json())
        .then((d) => setPhoneHits(Array.isArray(d.items) ? d.items : []))
        .catch(() => setPhoneHits([]));
    }, 350);
    return () => window.clearTimeout(t);
  }, [form.phone, view]);

  const filtered = useMemo(() => items.filter((c) => matchesQuery(c, query)), [items, query]);
  const selected = items.find((c) => c.id === selectedId) ?? null;
  const hasAny = items.length > 0;

  const stats = useMemo(() => {
    const today = startOfToday();
    const todayNew = items.filter((c) => new Date(c.createdAt) >= today).length;
    const moveSoon = items.filter((c) => inDays(c.moveDate, 30)).length;
    const traded = items.filter((c) => c.hasTraded).length;
    const purposePie = [
      {
        name: PURPOSE_LABELS.invest,
        value: items.filter((c) => c.purpose === "invest").length,
        fill: "#d450ff",
      },
      {
        name: PURPOSE_LABELS.reside,
        value: items.filter((c) => c.purpose === "reside").length,
        fill: "#34d399",
      },
    ].filter((d) => d.value > 0);
    const contactBars = CONTACT_METHODS.map((m) => ({
      name: CONTACT_METHOD_LABELS[m],
      count: items.filter((c) => parseContactMethods(c.primaryContactMethod).includes(m)).length,
    }));
    return { todayNew, moveSoon, traded, purposePie, contactBars };
  }, [items]);

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

  async function refreshList() {
    const list = await fetch("/api/admin/customers").then((r) => r.json());
    if (list.items) setItems(list.items);
  }

  async function seed(reset: boolean) {
    if (reset) {
      if (
        !confirm(
          "샘플 전화번호(010-1111~5555)로 등록된 고객을 모두 지우고 5명만 다시 넣을까요?\n(중복으로 쌓인 샘플 정리에 사용)",
        )
      ) {
        return;
      }
    } else if (!confirm("샘플 고객 5명과 상담 이력을 넣을까요?")) {
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/customers/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error ?? "시드 실패");
        return;
      }
      if (data.skipped) {
        setMsg(data.message ?? "이미 샘플이 있습니다.");
      } else {
        setMsg(
          data.removed
            ? `기존 샘플 ${data.removed}건 정리 후 ${data.count}명을 넣었습니다.`
            : `샘플 ${data.count}명을 등록했습니다.`,
        );
      }
      await refreshList();
      router.refresh();
      setView("dashboard");
    } catch {
      setMsg("시드 요청 중 오류");
    } finally {
      setBusy(false);
    }
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setMsg("이름과 전화번호는 필수입니다.");
      return;
    }
    if (phoneHits.length) {
      setMsg("동일 전화번호 고객이 있습니다. 리스트에서 기존 카드를 열어 주세요.");
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toWriteInput(form)),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error ?? "등록 실패");
        return;
      }
      setForm(emptyCreate);
      setPhoneHits([]);
      router.push(`/admin/customers/${data.item.id}`);
      router.refresh();
    } catch {
      setMsg("등록 중 오류");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="space-y-6 p-6 text-landing-text md:p-10">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">
            Customer CRM
          </p>
          <h1 className="mt-1 font-serif text-2xl font-bold text-white md:text-3xl">고객 관리</h1>
          <p className="mt-1 text-sm text-white/50">
            {view === "dashboard"
              ? "현황·통계를 먼저 보고, 리스트·신규등록으로 전환하세요"
              : view === "list"
                ? "이름·전화로 과거 상담 고객을 검색합니다"
                : "실전 필드로 고객 카드를 등록합니다"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            disabled={busy}
            onClick={() => void seed(!hasAny ? false : true)}
            className={channelBtn("amber", !hasAny)}
            title="개발·데모용: 샘플 고객 5명 넣기 / 중복 샘플 초기화"
          >
            <Sparkles className={`h-4 w-4 shrink-0 ${iconTone.amber}`} aria-hidden />
            <span>{hasAny ? "샘플 초기화" : "샘플 넣기"}</span>
          </button>
          <button
            type="button"
            onClick={() => setView("dashboard")}
            className={channelBtn("violet", view === "dashboard")}
          >
            <BarChart3 className={`h-4 w-4 shrink-0 ${iconTone.violet}`} aria-hidden />
            <span>현황차트보기</span>
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={channelBtn("sky", view === "list")}
          >
            <List className={`h-4 w-4 shrink-0 ${iconTone.sky}`} aria-hidden />
            <span>고객 리스트</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setView("create");
              setMsg("");
            }}
            className={channelBtn("emerald", view === "create")}
          >
            <UserPlus className={`h-4 w-4 shrink-0 ${iconTone.emerald}`} aria-hidden />
            <span>신규 등록</span>
          </button>
        </div>
      </header>

      {msg ? <p className="text-sm text-amber-200/90">{msg}</p> : null}

      {view === "dashboard" ? (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "오늘 신규",
                value: stats.todayNew,
                icon: CalendarPlus,
                tone: "text-sky-300",
              },
              {
                label: "이사 30일 이내",
                value: stats.moveSoon,
                icon: AlertTriangle,
                tone: "text-red-300",
              },
              { label: "전체 고객", value: items.length, icon: Users, tone: "text-violet-300" },
              {
                label: "거래 이력",
                value: stats.traded,
                icon: Sparkles,
                tone: "text-emerald-300",
              },
            ].map((card) => (
              <GlassCard key={card.label} className="p-4">
                <div className="flex items-center justify-between text-xs text-white/50">
                  {card.label}
                  <card.icon className={`h-4 w-4 ${card.tone}`} />
                </div>
                <p className="mt-2 font-mono text-3xl font-extrabold text-white">{card.value}</p>
              </GlassCard>
            ))}
          </section>

          {stats.moveSoon > 0 ? (
            <GlassCard className="border-red-400/30 p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-red-200">
                <AlertTriangle className="h-4 w-4" />
                이사 임박 · 최우선 관리
              </h3>
              <ul className="space-y-1.5">
                {items
                  .filter((c) => inDays(c.moveDate, 30))
                  .map((c) => (
                    <li key={c.id}>
                      <Link
                        href={`/admin/customers/${c.id}`}
                        className="flex items-center justify-between rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm hover:border-red-400/40"
                      >
                        <span className="font-semibold text-white">{c.name}</span>
                        <span className="font-mono text-xs text-red-200">{c.moveDate}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </GlassCard>
          ) : null}

          <section className="grid gap-4 lg:grid-cols-2">
            <GlassCard className="p-4">
              <h3 className="mb-2 text-sm font-bold text-white/80">투자 vs 실거주</h3>
              <div className="h-44">
                {stats.purposePie.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.purposePie}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={40}
                        outerRadius={68}
                        paddingAngle={2}
                      >
                        {stats.purposePie.map((d) => (
                          <Cell key={d.name} fill={d.fill} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="flex h-full items-center justify-center text-sm text-white/35">
                    데이터 없음
                  </p>
                )}
              </div>
            </GlassCard>
            <GlassCard className="p-4">
              <h3 className="mb-2 text-sm font-bold text-white/80">접촉 경로</h3>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.contactBars}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 10 }} />
                    <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <Tooltip contentStyle={tipStyle} />
                    <Bar dataKey="count" name="고객" fill="#4dabff" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </section>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setView("list")}
              className="inline-flex items-center gap-1.5 text-sm text-sky-300 hover:underline"
            >
              <List className="h-4 w-4" />
              고객 리스트로 이동
            </button>
          </div>
        </>
      ) : null}

      {view === "list" ? (
        <>
          <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
            <GlassCard className="space-y-4 p-5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  placeholder="이름 · 전화 · 이메일 · 거주지 · 문의내용 · 브랜드 · 메모 검색 (과거 상담 여부 확인)"
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
                {" · "}행을 클릭하면 상세 카드로 이동합니다
              </p>

              <DataTable maxHeight="520px">
                <table className="w-full border-collapse text-left text-sm text-unifine-table-text">
                  <thead>
                    <tr className="text-landing-muted">
                      {["고객", "연락처 / 거주지", "접촉·성향", "이사일", ""].map((h) => (
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
                          {items.length === 0
                            ? "등록된 고객이 없습니다. 「신규 등록」또는 「샘플 5명」으로 시작하세요."
                            : "검색 결과가 없습니다. 다른 키워드로 다시 찾아보세요."}
                        </td>
                      </tr>
                    ) : (
                      filtered.map((c) => {
                        const channels = parseContactMethods(c.primaryContactMethod);
                        return (
                          <tr
                            key={c.id}
                            onClick={() => router.push(`/admin/customers/${c.id}`)}
                            onMouseEnter={() => setSelectedId(c.id)}
                            className={`cursor-pointer border-b border-white/5 transition-colors hover:bg-white/[0.04] ${
                              selectedId === c.id ? "bg-sky-500/10" : ""
                            }`}
                          >
                            <td className="p-3">
                              <p className="font-bold text-white">{c.name}</p>
                              <p className="text-[11px] text-white/40">
                                {c.hasTraded ? "기존 거래" : "신규"} ·{" "}
                                {PIPELINE_LABELS[c.pipelineStage] ?? c.pipelineStage}
                              </p>
                            </td>
                            <td className="p-3">
                              <p className="font-mono text-xs text-white/80">{c.phone || "-"}</p>
                              <p className="truncate text-[11px] text-white/45">
                                {c.currentAddress || "-"}
                              </p>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-1">
                                {channels.map((ch) => (
                                  <Badge key={ch} tone="blue">
                                    {CONTACT_METHOD_LABELS[ch] ?? ch}
                                  </Badge>
                                ))}
                                <CustomerTendencyBadges
                                  budgetRange={null}
                                  moveUrgency={c.moveUrgency}
                                  purpose={c.purpose}
                                />
                              </div>
                            </td>
                            <td className="p-3 font-mono text-xs">
                              {c.moveDate ? (
                                <span className={inDays(c.moveDate, 30) ? "text-red-300" : ""}>
                                  {c.moveDate}
                                </span>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="p-3 text-right text-xs text-sky-300">열기 →</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </DataTable>
            </GlassCard>

            <GlassCard className="h-fit space-y-3 p-5">
              <h2 className="text-sm font-bold text-white">선택 고객 요약</h2>
              {!selected ? (
                <p className="py-8 text-center text-sm text-white/35">
                  행에 마우스를 올리면 요약이 보입니다.
                  <br />
                  클릭하면 상세 카드로 이동합니다.
                </p>
              ) : (
                <>
                  <p className="text-lg font-bold text-white">{selected.name}</p>
                  <p className="font-mono text-sm text-sky-200">{selected.phone}</p>
                  <CustomerTendencyBadges
                    budgetRange={selected.budgetRange}
                    moveUrgency={selected.moveUrgency}
                    purpose={selected.purpose}
                    pipelineStage={selected.pipelineStage}
                  />
                  <div className="space-y-2 border-t border-white/10 pt-3 text-xs text-white/60">
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
                      <span className="text-white/40">특징 · 의사결정</span>
                      <br />
                      {selected.specialNotes || "-"}
                      {selected.decisionMaker ? ` · ${selected.decisionMaker}` : ""}
                    </p>
                  </div>
                  <Link
                    href={`/admin/customers/${selected.id}`}
                    className="mt-2 block w-full rounded-xl bg-gradient-to-r from-cta-from to-cta-to py-2.5 text-center text-sm font-bold text-white"
                  >
                    상세 카드 열기
                  </Link>
                </>
              )}
            </GlassCard>
          </div>
        </>
      ) : null}

      {view === "create" ? (
        <form onSubmit={(e) => void create(e)} className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-white/50">개업공인중개사 실전 필드 · DB에 저장됩니다</p>
            <button
              type="button"
              onClick={() => setView("dashboard")}
              className="text-xs text-sky-300 hover:underline"
            >
              ← 현황차트로
            </button>
          </div>

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
                  required
                />
              </label>
              <label className={labelClass}>
                전화번호 *
                <input
                  className={fieldClass}
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  required
                />
                {phoneHits.length > 0 ? (
                  <span className="mt-1.5 block rounded-lg border border-amber-400/40 bg-amber-500/10 px-2.5 py-2 text-[11px] text-amber-100">
                    동일 번호 고객 {phoneHits.length}명 —{" "}
                    {phoneHits.slice(0, 3).map((h, i) => (
                      <span key={h.id}>
                        {i > 0 ? ", " : null}
                        <Link
                          href={`/admin/customers/${h.id}`}
                          className="font-semibold underline underline-offset-2"
                        >
                          {h.name}
                        </Link>
                      </span>
                    ))}
                    . 신규 대신 기존 카드를 열어 주세요.
                  </span>
                ) : null}
              </label>
              <label className={labelClass}>
                메일주소
                <input
                  className={fieldClass}
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </label>
              <label className={labelClass}>
                현재 거주지 (사는 곳)
                <input
                  className={fieldClass}
                  value={form.currentAddress}
                  onChange={(e) => setForm((f) => ({ ...f, currentAddress: e.target.value }))}
                />
              </label>
              <label className={`${labelClass} md:col-span-2`}>
                이미지 (명함 / 현장 사진 URL)
                <div className="mt-1 flex gap-2">
                  <input
                    className={fieldClass}
                    value={form.profileImage}
                    onChange={(e) => setForm((f) => ({ ...f, profileImage: e.target.value }))}
                    placeholder="https://..."
                  />
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-dashed border-white/20 px-3 text-xs text-white/40">
                    <ImagePlus className="h-4 w-4" />
                    URL
                  </span>
                </div>
              </label>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <SectionTitle
              title="2. 접촉 경로"
              hint="방문 · 전화 · 메일 · 웹사이트 (복수 선택 가능)"
            />
            <div className="flex flex-wrap gap-2">
              {CONTACT_METHODS.map((key) => {
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
                    {CONTACT_METHOD_LABELS[key]}
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
                  {PIPELINE_STAGES.map((s) => (
                    <option key={s} value={s}>
                      {PIPELINE_LABELS[s]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <SectionTitle title="3. 문의 · 요청 · 특징" />
            <div className="grid gap-3">
              <label className={labelClass}>
                문의 내용
                <textarea
                  className={`${fieldClass} min-h-[88px]`}
                  value={form.inquiryDetails}
                  onChange={(e) => setForm((f) => ({ ...f, inquiryDetails: e.target.value }))}
                />
              </label>
              <label className={labelClass}>
                고객 요청사항
                <textarea
                  className={`${fieldClass} min-h-[72px]`}
                  value={form.requestNotes}
                  onChange={(e) => setForm((f) => ({ ...f, requestNotes: e.target.value }))}
                />
              </label>
              <label className={labelClass}>
                특징 / 성향 메모
                <textarea
                  className={`${fieldClass} min-h-[72px]`}
                  value={form.specialNotes}
                  onChange={(e) => setForm((f) => ({ ...f, specialNotes: e.target.value }))}
                />
              </label>
            </div>
          </GlassCard>

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
                />
              </label>
              <label className={labelClass}>
                선호 브랜드 · 단지 / 동 · 층
                <input
                  className={fieldClass}
                  value={form.preferredBrand}
                  onChange={(e) => setForm((f) => ({ ...f, preferredBrand: e.target.value }))}
                />
              </label>
              <label className={labelClass}>
                실제 의사결정자 (공동명의 여부)
                <input
                  className={fieldClass}
                  value={form.decisionMaker}
                  onChange={(e) => setForm((f) => ({ ...f, decisionMaker: e.target.value }))}
                />
              </label>
            </div>
          </GlassCard>

          <div className="flex flex-wrap gap-2 pb-4">
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cta-from to-cta-to px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {busy ? "저장 중…" : "고객 카드 저장"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(emptyCreate);
                setMsg("");
              }}
              className="rounded-xl border border-white/15 px-5 py-3 text-sm text-white/70"
            >
              초기화
            </button>
          </div>
        </form>
      ) : null}
    </main>
  );
}
