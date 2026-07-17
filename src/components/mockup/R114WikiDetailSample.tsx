"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { GlassCard } from "@/components/ui/GlassCard";
import { getR114WikiCategory, type R114WikiSample } from "@/lib/mockup/r114-wiki-sample";

export function R114WikiDetailSample({ item }: { item: R114WikiSample }) {
  const meta = getR114WikiCategory(item.category);

  return (
    <div className="mx-auto max-w-3xl px-container-padding-mobile py-10 md:px-8 md:py-14">
      <Link
        href="/mockup/r114-news"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-white/55 transition hover:text-[#e9d5ff]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        부동산114 목록
      </Link>

      <GlassCard className="p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-6 items-center rounded-full border border-fuchsia-400/40 bg-fuchsia-500/15 px-2.5 text-[11px] font-bold text-fuchsia-300">
            R114
          </span>
          <span className="inline-flex h-6 items-center rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] font-bold text-white/70">
            {meta.label}
          </span>
          <span className="text-[11px] text-white/40">{item.pubDate}</span>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold leading-snug text-white md:text-3xl">
          {item.title}
        </h1>

        <p className="mt-5 text-sm leading-relaxed text-white/70 md:text-[15px]">
          {item.summary}
        </p>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
          <a
            href={item.originUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#d450ff] to-[#4dabff] px-4 py-2.5 text-sm font-bold text-white"
          >
            원문 보기
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
          <Link
            href="/mockup/r114-news"
            className="inline-flex items-center rounded-xl border border-white/15 px-4 py-2.5 text-sm font-bold text-white/70 hover:text-white"
          >
            목록으로
          </Link>
        </div>
      </GlassCard>

      <p className="mt-6 text-center text-[11px] text-white/35">
        샘플 상세 페이지 · 프로덕션에서는 `/news/r114/[id]` 형태로 제공 예정 · 원문 저작권은
        부동산114
      </p>
    </div>
  );
}
