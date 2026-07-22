"use client";

/**
 * 관리자 전용 — 일반/회원 리포트 블로그용 HTML 복사
 */

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Check, Copy } from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { htmlWithInlinedStyles } from "@/lib/blog-clipboard-html";

type Props = {
  auctionId: string;
  kindLabel: string;
  title: string;
  /** 서버에서 렌더한 리포트 HTML (스타일 포함) */
  articleHtml: string;
  backHref: string;
};

function absolutizeUrls(html: string, origin: string): string {
  return html
    .replace(/(src|href)="(\/[^"]*)"/g, (_, attr: string, url: string) => {
      return `${attr}="${origin}${url}"`;
    })
    .replace(/(src|href)='(\/[^']*)'/g, (_, attr: string, url: string) => {
      return `${attr}='${origin}${url}'`;
    });
}

export function AuctionReportBlogCopy({
  auctionId,
  kindLabel,
  title,
  articleHtml,
  backHref,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState(articleHtml);

  useEffect(() => {
    const origin = window.location.origin;
    setHtml(absolutizeUrls(articleHtml, origin));
  }, [articleHtml]);

  const handleCopy = useCallback(async () => {
    const el = document.getElementById("report-blog-article");
    if (!el) return;
    try {
      // 표 th/td 배경·테두리 등 computed style → 인라인 (네이버는 style/class 제거)
      const copyHtml = htmlWithInlinedStyles(el);
      const text = el.innerText;
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([copyHtml], { type: "text/html" }),
            "text/plain": new Blob([text], { type: "text/plain" }),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      document.execCommand("copy");
      sel?.removeAllRanges();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#D8D4CE] font-[family-name:var(--font-unifine),Pretendard,Noto_Sans_KR,sans-serif] text-[#2F2F2F]">
      <div className="mx-auto flex max-w-[794px] flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3D342C]/80 hover:text-[#3D342C]"
        >
          <ArrowLeft className="h-4 w-4" />
          수정 화면으로
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#6B5344]/15 px-3 py-1 text-[11px] font-bold text-[#6B5344]">
            {kindLabel} · 관리자
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#6B5344]/25 bg-white px-4 py-2.5 text-sm font-bold text-[#3D342C] shadow-sm hover:bg-[#F7E8D8]"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            {copied ? "복사됨" : "블로그용 복사"}
          </button>
        </div>
      </div>

      <p className="mx-auto mb-3 max-w-[794px] px-4 text-center text-[12px] text-[#6B5344]/80">
        {title}
        <span className="mx-1 text-[#A08B78]">·</span>
        네이버 블로그 등에 HTML로 붙여넣기 하세요
        <span className="mx-1 text-[#A08B78]">·</span>
        <span className="text-[#888]">{auctionId.slice(0, 8)}…</span>
      </p>

      <div
        id="report-blog-article"
        className="relative mx-auto mb-12 w-full max-w-[794px] bg-white px-6 py-8 shadow-[0_12px_40px_rgba(0,0,0,0.12)] ring-1 ring-black/5 sm:px-10"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
