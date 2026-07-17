"use client";

import { useMemo, useState } from "react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  renderSampleAuctionSms,
  renderSamplePropertySms,
  SAMPLE_KAKAO_AUCTION_VARS,
  SAMPLE_KAKAO_PROPERTY_VARS,
  sampleAuctionKakaoTemplateDraft,
  samplePropertyKakaoTemplateDraft,
  smsLengthInfo,
} from "@/lib/mockup/alert-sms-kakao-sample";

type Kind = "property" | "auction";
type View = "filled" | "kakao-draft";

export function AlertSmsKakaoSampleClient() {
  const [kind, setKind] = useState<Kind>("property");
  const [view, setView] = useState<View>("filled");

  const filled = useMemo(
    () => (kind === "property" ? renderSamplePropertySms() : renderSampleAuctionSms()),
    [kind],
  );
  const draft = useMemo(
    () =>
      kind === "property" ? samplePropertyKakaoTemplateDraft() : sampleAuctionKakaoTemplateDraft(),
    [kind],
  );
  const text = view === "filled" ? filled : draft;
  const meta = smsLengthInfo(filled);
  const vars = kind === "property" ? SAMPLE_KAKAO_PROPERTY_VARS : SAMPLE_KAKAO_AUCTION_VARS;

  return (
    <div className="mx-auto max-w-5xl px-container-padding-mobile py-8 md:px-8 md:py-10">
      <GlassCard className="mb-6 p-5 md:p-6">
        <p className="text-xs font-bold tracking-wide text-emerald-200/90">
          프로덕션 적용됨 · 키 등록 전 발송은 LMS 폴백
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-white md:text-3xl">
          문자 · 카카오 알림톡 문구
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-white/60">
          메일보다 간결한 LMS/알림톡 문구입니다. Solapi·카카오 키는 홈페이지 운영 시 등록하고, 문구
          승인 후 발송 로직에 이식합니다. 알림톡 실패 시 동일 문구로 LMS 폴백하는 구조를 전제로
          합니다.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setKind("property")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              kind === "property"
                ? "bg-gradient-to-r from-[#4dabff] to-[#6a7dff] text-white"
                : "border border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            중개 매물
          </button>
          <button
            type="button"
            onClick={() => setKind("auction")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              kind === "auction"
                ? "bg-gradient-to-r from-amber-400 to-orange-500 text-[#1a1208]"
                : "border border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            경매 물건
          </button>
          <button
            type="button"
            onClick={() => setView("filled")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              view === "filled"
                ? "border border-emerald-400/40 bg-emerald-500/20 text-emerald-200"
                : "border border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            고객 수신 예시
          </button>
          <button
            type="button"
            onClick={() => setView("kakao-draft")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              view === "kakao-draft"
                ? "border border-violet-400/40 bg-violet-500/20 text-violet-200"
                : "border border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            알림톡 검수용 원문
          </button>
          <Link
            href="/mockup/alert-email-templates"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white/60 hover:bg-white/10"
          >
            메일 템플릿 →
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-white/50">
          <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1">
            채워진 본문 길이 {meta.chars}자 → {meta.kind}
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1">
            폴백: 알림톡 실패 → 동일 문구 LMS
          </span>
        </div>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* phone mock */}
        <div className="mx-auto w-full max-w-[320px]">
          <div className="rounded-[2rem] border border-white/20 bg-[#0a0e14] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
            <div className="mb-2 flex items-center justify-center">
              <div className="h-1.5 w-16 rounded-full bg-white/20" />
            </div>
            <div className="overflow-hidden rounded-[1.4rem] bg-[#111827]">
              <div className="border-b border-white/10 px-4 py-3">
                <p className="text-[11px] font-bold text-white/45">
                  {view === "filled" ? "문자 · 알림톡 수신 미리보기" : "카카오 검수 템플릿"}
                </p>
                <p className="mt-0.5 text-sm font-extrabold text-amber-200">찬스부동산</p>
              </div>
              <div className="max-h-[520px] overflow-y-auto px-3 py-4">
                <div className="ml-auto max-w-[92%] rounded-2xl rounded-tr-md bg-[#1f2937] px-3.5 py-3 text-[13px] leading-relaxed text-white/90 whitespace-pre-wrap shadow-inner ring-1 ring-white/10">
                  {text}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <GlassCard className="p-4 md:p-5">
            <h2 className="text-sm font-extrabold text-white">발송 원칙 (샘플)</h2>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-white/55">
              <li>상단 고정 브랜드: [찬스부동산]</li>
              <li>긴 인사·스펙 나열 최소화, 핵심 항목 + 상세 URL</li>
              <li>문자와 알림톡 대체문자는 동일 본문 사용 (LMS)</li>
              <li>알림톡 실패 시 Solapi 폴백으로 LMS 재발송 예정</li>
            </ul>
          </GlassCard>

          <GlassCard className="p-4 md:p-5">
            <h2 className="text-sm font-extrabold text-white">알림톡 변수 목록 (검수 등록용)</h2>
            <p className="mt-1 text-[11px] text-white/40">
              Solapi/카카오에 템플릿 등록 시 아래 변수명을 그대로 사용합니다.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {vars.map((v) => (
                <span
                  key={v}
                  className="rounded-md border border-violet-400/30 bg-violet-500/10 px-2 py-1 font-mono text-[11px] text-violet-200"
                >
                  {v}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-4 md:p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-extrabold text-white">원문 텍스트</h2>
              <button
                type="button"
                onClick={() => void navigator.clipboard.writeText(text)}
                className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-white/70 hover:bg-white/10"
              >
                복사
              </button>
            </div>
            <pre className="mt-3 max-h-[360px] overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/40 p-3 text-[12px] leading-relaxed text-white/80">
              {text}
            </pre>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
