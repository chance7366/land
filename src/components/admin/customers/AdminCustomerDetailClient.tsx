"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CalendarClock,
  Mail,
  MapPin,
  Phone,
  Trash2,
  UserRound,
} from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Badge,
  CustomerTendencyBadges,
} from "@/components/admin/customers/customer-badges";
import {
  CHANNEL_LABELS,
  CONTACT_METHOD_LABELS,
  CONTACT_METHODS,
  INTERACTION_CHANNELS,
  PIPELINE_LABELS,
  PIPELINE_STAGES,
  PURPOSE_LABELS,
  URGENCY_LABELS,
  formatContactMethods,
  parseContactMethods,
  type CustomerCardDTO,
  type CustomerInteractionDTO,
  type CustomerRelatedConsultation,
  type CustomerRelatedSubscriber,
  type CustomerWriteInput,
} from "@/lib/customers/types";

type Related = {
  consultations: CustomerRelatedConsultation[];
  subscribers: CustomerRelatedSubscriber[];
};

const fieldClass =
  "mt-1 w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/35";

export function AdminCustomerDetailClient({
  initial,
  related: initialRelated,
}: {
  initial: CustomerCardDTO;
  related: Related;
}) {
  const router = useRouter();
  const [card, setCard] = useState(initial);
  const [related] = useState(initialRelated);
  const [form, setForm] = useState<CustomerWriteInput>({ ...initial });
  const [contactChannels, setContactChannels] = useState(() =>
    parseContactMethods(initial.primaryContactMethod),
  );
  const [ixTitle, setIxTitle] = useState("");
  const [ixBody, setIxBody] = useState("");
  const [ixChannel, setIxChannel] = useState("phone");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  function toggleChannel(ch: string) {
    setContactChannels((prev) => {
      const has = prev.includes(ch);
      if (has && prev.length === 1) return prev;
      return has ? prev.filter((x) => x !== ch) : [...prev, ch];
    });
  }

  async function save() {
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/customers/${card.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          primaryContactMethod: formatContactMethods(contactChannels),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error ?? "저장 실패");
        return;
      }
      setCard(data.item);
      setForm({ ...data.item });
      setContactChannels(parseContactMethods(data.item.primaryContactMethod));
      setMsg("저장했습니다.");
      router.refresh();
    } catch {
      setMsg("저장 중 오류");
    } finally {
      setBusy(false);
    }
  }

  async function addIx() {
    if (!ixTitle.trim()) {
      setMsg("이력 제목을 입력하세요.");
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/customers/${card.id}/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: ixTitle, body: ixBody, channel: ixChannel }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error ?? "이력 추가 실패");
        return;
      }
      const ix = data.item as CustomerInteractionDTO;
      setCard((c) => ({
        ...c,
        interactions: [ix, ...(c.interactions ?? [])],
      }));
      setIxTitle("");
      setIxBody("");
      setMsg("이력을 추가했습니다.");
    } catch {
      setMsg("이력 추가 중 오류");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm(`「${card.name}」고객 카드를 삭제할까요?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/customers/${card.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setMsg(data.error ?? "삭제 실패");
        return;
      }
      router.push("/admin/customers");
      router.refresh();
    } catch {
      setMsg("삭제 중 오류");
    } finally {
      setBusy(false);
    }
  }

  const interactions = card.interactions ?? [];

  return (
    <main className="space-y-6 p-6 text-landing-text md:p-10">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/admin/customers" className="text-xs text-sky-300 hover:underline">
            ← 고객 목록
          </Link>
          <h1 className="mt-1 font-serif text-2xl font-bold text-white">{card.name}</h1>
          <div className="mt-2">
            <CustomerTendencyBadges
              budgetRange={card.budgetRange}
              moveUrgency={card.moveUrgency}
              purpose={card.purpose}
              pipelineStage={card.pipelineStage}
            />
          </div>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void remove()}
          className="inline-flex items-center gap-1.5 self-start rounded-lg border border-red-400/35 px-3 py-2 text-sm text-red-200 hover:bg-red-500/10 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          삭제
        </button>
      </header>

      {msg ? <p className="text-sm text-amber-200/90">{msg}</p> : null}

      <div className="grid gap-4 xl:grid-cols-[340px_1fr_300px]">
        {/* Left — profile & edit */}
        <GlassCard className="space-y-4 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/5">
              {card.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={card.profileImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-8 w-8 text-white/40" />
              )}
            </div>
            <div className="min-w-0 space-y-1 text-sm">
              <p className="flex items-center gap-1.5 text-white/80">
                <Phone className="h-3.5 w-3.5" /> {card.phone || "-"}
              </p>
              <p className="flex items-center gap-1.5 truncate text-white/60">
                <Mail className="h-3.5 w-3.5" /> {card.email || "-"}
              </p>
              <p className="flex items-center gap-1.5 text-white/60">
                <MapPin className="h-3.5 w-3.5" /> {card.currentAddress || "-"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {parseContactMethods(card.primaryContactMethod).map((ch) => (
              <Badge key={ch} tone="blue">
                {CONTACT_METHOD_LABELS[ch] ?? ch}
              </Badge>
            ))}
            {card.hasTraded ? <Badge tone="green">거래이력</Badge> : <Badge>신규</Badge>}
            {card.isSubscribed ? (
              <Badge tone="gold">
                <Bell className="mr-1 inline h-3 w-3" />
                맞춤알림
              </Badge>
            ) : null}
            {card.needsLoan ? <Badge tone="orange">대출 필요</Badge> : null}
          </div>

          <div className="space-y-2 border-t border-white/10 pt-4">
            {(
              [
                ["name", "이름"],
                ["phone", "전화"],
                ["email", "이메일"],
                ["currentAddress", "거주지"],
                ["budgetRange", "가용 자금"],
                ["familyMembers", "가족 구성"],
                ["preferredBrand", "선호 브랜드/단지"],
                ["decisionMaker", "의사결정자"],
                ["moveDate", "이사 예정일"],
                ["profileImage", "이미지 URL"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block text-xs text-white/45">
                {label}
                <input
                  type={key === "moveDate" ? "date" : "text"}
                  className={fieldClass}
                  value={String(form[key] ?? "")}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </label>
            ))}

            <label className="block text-xs text-white/45">
              파이프라인
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
            <label className="block text-xs text-white/45">
              목적
              <select
                className={fieldClass}
                value={form.purpose}
                onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))}
              >
                <option value="reside">{PURPOSE_LABELS.reside}</option>
                <option value="invest">{PURPOSE_LABELS.invest}</option>
              </select>
            </label>
            <label className="block text-xs text-white/45">
              긴급도
              <select
                className={fieldClass}
                value={form.moveUrgency}
                onChange={(e) => setForm((f) => ({ ...f, moveUrgency: e.target.value }))}
              >
                {(["high", "mid", "low"] as const).map((u) => (
                  <option key={u} value={u}>
                    {URGENCY_LABELS[u]}
                  </option>
                ))}
              </select>
            </label>
            <div className="space-y-1.5">
              <p className="text-xs text-white/45">접촉 경로 (복수 선택)</p>
              <div className="flex flex-wrap gap-1.5">
                {CONTACT_METHODS.map((key) => {
                  const on = contactChannels.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleChannel(key)}
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                        on
                          ? "border-sky-400/50 bg-sky-500/20 text-sky-100"
                          : "border-white/15 text-white/45"
                      }`}
                    >
                      {CONTACT_METHOD_LABELS[key]}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-white/70">
              <input
                type="checkbox"
                checked={Boolean(form.hasTraded)}
                onChange={(e) => setForm((f) => ({ ...f, hasTraded: e.target.checked }))}
              />
              거래 이력 있음
            </label>
            <label className="flex items-center gap-2 text-xs text-white/70">
              <input
                type="checkbox"
                checked={Boolean(form.isSubscribed)}
                onChange={(e) => setForm((f) => ({ ...f, isSubscribed: e.target.checked }))}
              />
              맞춤알림 동의/이용
            </label>
            <label className="flex items-center gap-2 text-xs text-white/70">
              <input
                type="checkbox"
                checked={Boolean(form.needsLoan)}
                onChange={(e) => setForm((f) => ({ ...f, needsLoan: e.target.checked }))}
              />
              대출 필요
            </label>

            <label className="block text-xs text-white/45">
              문의 내용
              <textarea
                className={`${fieldClass} min-h-[72px]`}
                value={form.inquiryDetails ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, inquiryDetails: e.target.value }))}
              />
            </label>
            <label className="block text-xs text-white/45">
              요청사항
              <textarea
                className={`${fieldClass} min-h-[72px]`}
                value={form.requestNotes ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, requestNotes: e.target.value }))}
              />
            </label>
            <label className="block text-xs text-white/45">
              특징·성향 메모
              <textarea
                className={`${fieldClass} min-h-[72px]`}
                value={form.specialNotes ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, specialNotes: e.target.value }))}
              />
            </label>

            <button
              type="button"
              disabled={busy}
              onClick={() => void save()}
              className="w-full rounded-xl bg-gradient-to-r from-cta-from to-cta-to py-2.5 text-sm font-bold text-white disabled:opacity-50"
            >
              프로필 저장
            </button>
          </div>
        </GlassCard>

        {/* Center — timeline */}
        <GlassCard className="p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
            <CalendarClock className="h-4 w-4 text-sky-300" />
            상담·접촉 타임라인
          </h2>

          <div className="mb-5 space-y-2 rounded-xl border border-white/10 bg-black/25 p-3">
            <select
              className={fieldClass}
              value={ixChannel}
              onChange={(e) => setIxChannel(e.target.value)}
            >
              {INTERACTION_CHANNELS.map((c) => (
                <option key={c} value={c}>
                  {CHANNEL_LABELS[c]}
                </option>
              ))}
            </select>
            <input
              className={fieldClass}
              placeholder="제목 (예: 전화상담)"
              value={ixTitle}
              onChange={(e) => setIxTitle(e.target.value)}
            />
            <textarea
              className={`${fieldClass} min-h-[64px]`}
              placeholder="내용"
              value={ixBody}
              onChange={(e) => setIxBody(e.target.value)}
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => void addIx()}
              className="rounded-lg border border-sky-400/40 bg-sky-500/15 px-3 py-2 text-sm text-sky-100 disabled:opacity-50"
            >
              이력 추가
            </button>
          </div>

          <ol className="relative space-y-4 border-l border-white/15 pl-4">
            {interactions.length === 0 ? (
              <li className="text-sm text-white/40">아직 이력이 없습니다.</li>
            ) : (
              interactions.map((ix) => (
                <li key={ix.id} className="relative">
                  <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(77,171,255,0.6)]" />
                  <p className="font-mono text-[11px] text-white/40">
                    {new Date(ix.occurredAt).toLocaleString("ko-KR")}
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-white">
                    {CHANNEL_LABELS[ix.channel] ?? ix.channel} · {ix.title}
                  </p>
                  {ix.body ? <p className="mt-1 text-sm text-white/60">{ix.body}</p> : null}
                </li>
              ))
            )}
          </ol>
        </GlassCard>

        {/* Right — alerts & related */}
        <div className="space-y-4">
          <GlassCard className="space-y-3 p-5">
            <h2 className="text-sm font-bold text-white">요청·알림</h2>
            <p className="text-xs text-white/45">고객 요청사항</p>
            <p className="rounded-xl border border-white/10 bg-black/25 p-3 text-sm text-white/80">
              {card.requestNotes || "없음"}
            </p>
            <p className="text-xs text-white/45">맞춤알림</p>
            <p className="text-sm text-white/80">
              {card.isSubscribed ? "이용/동의 표시됨" : "미이용"}
            </p>
            <p className="text-xs text-white/45">문의 요약</p>
            <p className="text-sm text-white/70">{card.inquiryDetails || "-"}</p>
          </GlassCard>

          <GlassCard className="space-y-3 p-5">
            <h2 className="text-sm font-bold text-white">관련 상담 예약</h2>
            <p className="text-[11px] text-white/40">동일 전화번호 매칭 (자동 동기화 없음)</p>
            {related.consultations.length ? (
              <ul className="space-y-2">
                {related.consultations.map((r) => (
                  <li key={r.id}>
                    <Link
                      href="/admin/consultations"
                      className="block rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-xs hover:border-sky-400/40"
                    >
                      <p className="font-semibold text-white">{r.category}</p>
                      <p className="text-white/45">
                        {r.status} · {new Date(r.createdAt).toLocaleDateString("ko-KR")}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-white/40">관련 건 없음</p>
            )}
          </GlassCard>

          <GlassCard className="space-y-3 p-5">
            <h2 className="text-sm font-bold text-white">관련 맞춤 알림</h2>
            {related.subscribers.length ? (
              <ul className="space-y-2">
                {related.subscribers.map((r) => (
                  <li key={r.id}>
                    <Link
                      href="/admin/subscriptions"
                      className="block rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-xs hover:border-amber-400/40"
                    >
                      <p className="font-semibold text-white">
                        {r.name || "이름 없음"} · {r.subscriptionType}
                      </p>
                      <p className="text-white/45">{r.status}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-white/40">관련 건 없음</p>
            )}
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
