"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import {
  Bell,
  Building2,
  Check,
  Gavel,
  Mail,
  MessageCircle,
  Newspaper,
  Phone,
  Sparkles,
  X,
} from "lucide-react";
import { HeroBackgroundSlideshow } from "@/components/landing/HeroBackgroundSlideshow";
import {
  ALERT_REGIONS,
  AUCTION_ALERT_TYPES,
  DEFAULT_NEWS_SOURCES,
  manwonToWon,
  NEWS_ALERT_SOURCES,
  PROPERTY_ALERT_CATEGORIES,
  PROPERTY_ALERT_DEALS,
  type NewsDigestSourceId,
  type NotifyChannel,
  type SubscriptionType,
} from "@/lib/subscription";
import { trackBrowserEvent } from "@/lib/analytics/track";

function toggleInList<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

type AlertSubscribeModalProps = {
  open: boolean;
  onClose: () => void;
  defaultType?: SubscriptionType | null;
};

/** 한 화면 · 모니터 중앙 · body 포털(헤더 backdrop-blur 회피) */
export function AlertSubscribeModal({ open, onClose, defaultType = null }: AlertSubscribeModalProps) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [alertType, setAlertType] = useState<SubscriptionType>(defaultType ?? "REAL_ESTATE");
  const [channels, setChannels] = useState<NotifyChannel[]>(["EMAIL"]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<string[]>(["APARTMENT"]);
  const [deals, setDeals] = useState<string[]>(["SALE"]);
  const [regions, setRegions] = useState<string[]>(["홍성군"]);
  const [auctionTypes, setAuctionTypes] = useState<string[]>(["아파트"]);
  const [newsSources, setNewsSources] = useState<NewsDigestSourceId[]>([...DEFAULT_NEWS_SOURCES]);
  const [appraisalMin, setAppraisalMin] = useState("");
  const [appraisalMax, setAppraisalMax] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [okMessage, setOkMessage] = useState("");

  const isNews = alertType === "NEWS";
  const needEmail = isNews || channels.includes("EMAIL");
  const needPhone = !isNews && (channels.includes("SMS") || channels.includes("KAKAO"));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const next = defaultType ?? "REAL_ESTATE";
    setAlertType(next);
    if (next === "NEWS") setChannels(["EMAIL"]);
    setMessage("");
    setOkMessage("");
    setAgreed(false);
    setSubmitting(false);
  }, [open, defaultType]);

  useEffect(() => {
    if (alertType === "NEWS") setChannels(["EMAIL"]);
  }, [alertType]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  function toggleChannel(c: NotifyChannel) {
    if (isNews) return;
    setChannels((prev) => {
      if (prev.includes(c)) {
        if (prev.length === 1) return prev;
        return prev.filter((x) => x !== c);
      }
      return [...prev, c];
    });
  }

  async function submit() {
    setMessage("");
    setOkMessage("");
    setSubmitting(true);
    try {
      const preferences =
        alertType === "NEWS"
          ? { sources: newsSources }
          : alertType === "REAL_ESTATE"
            ? { categories, deals, regions }
            : {
                regions,
                itemTypes: auctionTypes,
                appraisalMin: manwonToWon(appraisalMin),
                appraisalMax: manwonToWon(appraisalMax),
              };

      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || null,
          email: needEmail ? email.trim() : null,
          phone: needPhone ? phone.trim() : null,
          subscriptionType: alertType,
          channels: isNews ? ["EMAIL"] : channels,
          preferences,
          isPrivacyAgreed: agreed,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "신청에 실패했습니다.");
        return;
      }
      setOkMessage(data.message ?? "신청이 접수되었습니다.");
      trackBrowserEvent({
        eventType: "cta_click",
        menuKey: "home",
        metadata: { action: "alert_subscribe", subscriptionType: alertType },
      });
      setTimeout(() => onClose(), 1400);
    } catch {
      setMessage("네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        aria-label="닫기"
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative z-10 flex h-[min(640px,92vh)] w-full max-w-[520px] flex-col overflow-hidden rounded-2xl border border-white/20 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="hr-aurora-layer hr-aurora-violet absolute inset-0">
            <div className="hr3-glow absolute inset-0" />
          </div>
          <div className="absolute inset-0 opacity-35">
            <HeroBackgroundSlideshow showDots={false} intervalMs={5000} fadeMs={2200} />
          </div>
          <div className="hr3-vignette absolute inset-0" />
          <div className="absolute inset-0 bg-[#0B0F19]/55" />
        </div>

        <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/30 to-[#4dabff]/25 ring-1 ring-white/20">
              <Bell className="h-4 w-4 text-amber-200" aria-hidden />
            </span>
            <div>
              <h2 id={titleId} className="text-sm font-extrabold tracking-tight text-white">
                맞춤 알림 신청
              </h2>
              <p className="text-[10px] text-white/45">
                {isNews
                  ? "당일 부동산소식을 매일 메일로 받아보세요"
                  : "조건에 맞는 물건이 등록되면 바로 알려 드립니다"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 transition hover:border-white/40 hover:bg-white/20 hover:text-white"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden px-4 py-3">
          <div className="grid shrink-0 grid-cols-3 gap-1 rounded-xl bg-black/35 p-1 ring-1 ring-white/10">
            <button
              type="button"
              onClick={() => setAlertType("REAL_ESTATE")}
              className={`flex items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-extrabold transition sm:text-xs ${
                alertType === "REAL_ESTATE"
                  ? "bg-gradient-to-r from-[#4dabff] to-[#6a7dff] text-white shadow-[0_4px_18px_rgba(77,171,255,0.45)]"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              }`}
            >
              <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">부동산매매</span>
            </button>
            <button
              type="button"
              onClick={() => setAlertType("AUCTION")}
              className={`flex items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-extrabold transition sm:text-xs ${
                alertType === "AUCTION"
                  ? "bg-gradient-to-r from-amber-400 to-orange-500 text-[#1a1208] shadow-[0_4px_18px_rgba(251,191,36,0.4)]"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              }`}
            >
              <Gavel className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">경매물건</span>
            </button>
            <button
              type="button"
              onClick={() => setAlertType("NEWS")}
              className={`flex items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-extrabold transition sm:text-xs ${
                alertType === "NEWS"
                  ? "bg-gradient-to-r from-[#d450ff] to-[#4dabff] text-white shadow-[0_4px_18px_rgba(212,80,255,0.4)]"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              }`}
            >
              <Newspaper className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">부동산소식</span>
            </button>
          </div>

          <div className="shrink-0">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-white/40">알림 수단</p>
            {isNews ? (
              <div className="relative flex flex-col items-center gap-1 rounded-xl border border-[#4dabff]/60 bg-gradient-to-b from-[#4dabff]/25 to-transparent px-1 py-2 text-white shadow-[inset_0_0_0_1px_rgba(77,171,255,0.25)]">
                <span className="absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#4dabff] text-[#0B0F19]">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden />
                </span>
                <Mail className="h-4 w-4" aria-hidden />
                <span className="text-[11px] font-bold">메일</span>
                <span className="px-2 text-center text-[9px] text-white/50">
                  매일 첫 수집 후 약 10분 · 당일 소식
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: "EMAIL" as const, label: "메일", Icon: Mail },
                    { id: "SMS" as const, label: "문자", Icon: Phone },
                    { id: "KAKAO" as const, label: "카카오톡", Icon: MessageCircle },
                  ] as const
                ).map(({ id, label, Icon }) => {
                  const on = channels.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleChannel(id)}
                      className={`relative flex flex-col items-center gap-1 rounded-xl border px-1 py-2 transition ${
                        on
                          ? "border-[#4dabff]/60 bg-gradient-to-b from-[#4dabff]/25 to-transparent text-white shadow-[inset_0_0_0_1px_rgba(77,171,255,0.25)]"
                          : "border-white/10 bg-white/[0.04] text-white/45 hover:border-white/25 hover:text-white/75"
                      }`}
                    >
                      {on ? (
                        <span className="absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#4dabff] text-[#0B0F19]">
                          <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden />
                        </span>
                      ) : null}
                      <Icon className="h-4 w-4" aria-hidden />
                      <span className="text-[11px] font-bold">{label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid shrink-0 grid-cols-2 gap-1.5">
            <label className="block text-[10px] font-bold text-white/45">
              이름
              <input
                className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:border-[#4dabff] focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="선택"
              />
            </label>
            {needEmail ? (
              <label className="block text-[10px] font-bold text-white/45">
                이메일
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:border-[#4dabff] focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@mail.com"
                  autoComplete="email"
                />
              </label>
            ) : (
              <label className="block text-[10px] font-bold text-white/45">
                휴대폰
                <input
                  type="tel"
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:border-[#4dabff] focus:outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  autoComplete="tel"
                />
              </label>
            )}
            {needEmail && needPhone ? (
              <label className="col-span-2 block text-[10px] font-bold text-white/45">
                휴대폰
                <input
                  type="tel"
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:border-[#4dabff] focus:outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  autoComplete="tel"
                />
              </label>
            ) : null}
          </div>

          {isNews ? (
            <div className="min-h-0 flex-1 overflow-y-auto">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-white/40">
                소식 출처
              </p>
              <div className="flex flex-wrap gap-1">
                {NEWS_ALERT_SOURCES.map((s) => {
                  const on = newsSources.includes(s.value);
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setNewsSources(toggleInList(newsSources, s.value))}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                        on
                          ? "bg-gradient-to-r from-[#d450ff]/90 to-[#4dabff]/80 text-white"
                          : "bg-white/8 text-white/50 ring-1 ring-white/10 hover:text-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-white/45">
                선택한 출처의 당일(한국 시간) 소식을 제목·요약으로 정리해 하루 한 번 메일로 보냅니다.
              </p>
            </div>
          ) : (
            <>
              <div className="shrink-0">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-white/40">관심 지역</p>
                <div className="flex flex-wrap gap-1">
                  {ALERT_REGIONS.map((r) => {
                    const on = regions.includes(r);
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRegions(toggleInList(regions, r))}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                          on
                            ? "bg-white text-[#0B0F19] shadow-[0_0_12px_rgba(255,255,255,0.25)]"
                            : "bg-white/10 text-white/55 ring-1 ring-white/10 hover:bg-white/15 hover:text-white"
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>

              {alertType === "REAL_ESTATE" ? (
                <>
                  <div className="shrink-0">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-white/40">매물 유형</p>
                    <div className="flex flex-wrap gap-1">
                      {PROPERTY_ALERT_CATEGORIES.map((c) => {
                        const on = categories.includes(c.value);
                        return (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => setCategories(toggleInList(categories, c.value))}
                            className={`rounded-lg px-2 py-1 text-[11px] font-bold transition ${
                              on
                                ? "bg-gradient-to-r from-[#4dabff]/90 to-[#913dff]/80 text-white"
                                : "bg-white/8 text-white/50 ring-1 ring-white/10 hover:text-white"
                            }`}
                          >
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-white/40">거래 유형</p>
                    <div className="flex flex-wrap gap-1">
                      {PROPERTY_ALERT_DEALS.map((d) => {
                        const on = deals.includes(d.value);
                        return (
                          <button
                            key={d.value}
                            type="button"
                            onClick={() => setDeals(toggleInList(deals, d.value))}
                            className={`rounded-lg px-3 py-1 text-[11px] font-bold transition ${
                              on
                                ? "bg-gradient-to-r from-cyan-400 to-[#4dabff] text-[#061018]"
                                : "bg-white/8 text-white/50 ring-1 ring-white/10 hover:text-white"
                            }`}
                          >
                            {d.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="shrink-0">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-white/40">경매 유형</p>
                    <div className="flex flex-wrap gap-1">
                      {AUCTION_ALERT_TYPES.map((t) => {
                        const on = auctionTypes.includes(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setAuctionTypes(toggleInList(auctionTypes, t))}
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                              on
                                ? "bg-gradient-to-r from-amber-400 to-orange-500 text-[#1a1208]"
                                : "bg-white/8 text-white/50 ring-1 ring-white/10 hover:text-white"
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid shrink-0 grid-cols-2 gap-1.5">
                    <label className="block text-[10px] font-bold text-white/45">
                      감정가 최소(만원)
                      <input
                        className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:border-amber-400 focus:outline-none"
                        inputMode="numeric"
                        value={appraisalMin}
                        onChange={(e) => setAppraisalMin(e.target.value)}
                        placeholder="10000"
                      />
                    </label>
                    <label className="block text-[10px] font-bold text-white/45">
                      감정가 최대(만원)
                      <input
                        className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:border-amber-400 focus:outline-none"
                        inputMode="numeric"
                        value={appraisalMax}
                        onChange={(e) => setAppraisalMax(e.target.value)}
                        placeholder="50000"
                      />
                    </label>
                  </div>
                </>
              )}
            </>
          )}

          <div className="mt-auto shrink-0 space-y-2 pt-1">
            <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-white/10 bg-black/30 px-2.5 py-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 rounded border-white/30 bg-black/40 text-[#4dabff]"
              />
              <span className="text-[10px] leading-snug text-white/60">
                {isNews
                  ? "개인정보(이메일·관심 출처) 수집·이용에 동의합니다. 승인 후 매일 당일 소식을 메일로 안내합니다."
                  : "개인정보(연락처·관심조건) 수집·이용에 동의합니다. 승인 후 조건 매칭 시 즉시 안내됩니다."}
              </span>
            </label>

            {message ? <p className="text-center text-[11px] font-medium text-amber-200">{message}</p> : null}
            {okMessage ? (
              <p className="text-center text-[11px] font-medium text-emerald-300">{okMessage}</p>
            ) : null}

            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="group relative w-full overflow-hidden rounded-xl py-3 text-sm font-extrabold text-white disabled:opacity-60"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-[#4dabff] to-[#913dff]" />
              <span className="absolute inset-0 bg-gradient-to-r from-[#913dff] via-[#4dabff] to-amber-400 opacity-0 transition group-hover:opacity-100" />
              <span className="relative flex items-center justify-center gap-2 drop-shadow">
                <Sparkles className="h-4 w-4" aria-hidden />
                {submitting ? "신청 중…" : "신청하기"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
