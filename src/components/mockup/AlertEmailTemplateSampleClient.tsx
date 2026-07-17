"use client";

import { useState } from "react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  renderSampleAuctionEmailHtml,
  renderSamplePropertyEmailHtml,
  sampleAuctionSubject,
  samplePropertySubject,
} from "@/lib/mockup/alert-email-html-sample";

type Tab = "property" | "auction";

export function AlertEmailTemplateSampleClient() {
  const [tab, setTab] = useState<Tab>("property");
  const subject = tab === "property" ? samplePropertySubject() : sampleAuctionSubject();
  const html =
    tab === "property" ? renderSamplePropertyEmailHtml() : renderSampleAuctionEmailHtml();

  return (
    <div className="mx-auto max-w-5xl px-container-padding-mobile py-8 md:px-8 md:py-10">
      <GlassCard className="mb-6 p-5 md:p-6">
        <p className="text-xs font-bold tracking-wide text-amber-200/90">샘플 · 프로덕션 미적용</p>
        <h1 className="mt-1 text-2xl font-extrabold text-white md:text-3xl">맞춤 알림 메일 템플릿</h1>
        <p className="mt-2 max-w-3xl text-sm text-white/60">
          정중한 문조 · 상세 스펙 카드 · 수신거부 링크가 포함된 HTML 메일 미리보기입니다. 승인하시면 실제
          발송 템플릿에 이식합니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTab("property")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              tab === "property"
                ? "bg-gradient-to-r from-[#4dabff] to-[#6a7dff] text-white"
                : "border border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            중개 매물 메일
          </button>
          <button
            type="button"
            onClick={() => setTab("auction")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              tab === "auction"
                ? "bg-gradient-to-r from-amber-400 to-orange-500 text-[#1a1208]"
                : "border border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            경매 물건 메일
          </button>
          <Link
            href="/mockup/alert-subscribe"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white/60 hover:bg-white/10"
          >
            신청 UI 샘플
          </Link>
        </div>
        <div className="mt-4 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/70">
          <span className="text-white/40">제목 · </span>
          {subject}
        </div>
      </GlassCard>

      <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#eef2f7] shadow-[0_16px_48px_rgba(0,0,0,0.35)]">
        <iframe
          title="alert-email-preview"
          className="h-[min(920px,85vh)] w-full bg-[#eef2f7]"
          srcDoc={html}
        />
      </div>
    </div>
  );
}
