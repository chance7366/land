"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Download,
  ExternalLink,
  FileImage,
  Loader2,
  Printer,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { GlassCard } from "@/components/ui/GlassCard";
import { FLYER_SAMPLE_AUCTION, FLYER_SAMPLE_PROPERTY } from "@/lib/mockup/a4-flyer-sample";

type Tab = "property" | "auction" | "viewer";

/**
 * 광고전단지 생성 버튼 위치 · 결과 보기 흐름 목업 (운영 PropertyForm/AuctionForm 미연결)
 */
export function A4FlyerAdminUxSample() {
  const [tab, setTab] = useState<Tab>("property");
  const [propSaved, setPropSaved] = useState(true);
  const [aucSaved, setAucSaved] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [flyerReady, setFlyerReady] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerKind, setViewerKind] = useState<"property" | "auction">("property");

  function runGenerate(kind: "property" | "auction") {
    setGenerating(true);
    setViewerKind(kind);
    window.setTimeout(() => {
      setGenerating(false);
      setFlyerReady(true);
      setViewerOpen(true);
      setTab("viewer");
    }, 900);
  }

  return (
    <div className="min-h-screen bg-landing-bg font-[family-name:var(--font-unifine),Outfit,sans-serif] text-landing-text">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        <div className="mb-5 rounded-2xl border border-amber-400/35 bg-[#1a1408] px-4 py-3 text-amber-50">
          <p className="text-sm font-bold">광고전단지 UX 목업 · 운영 미적용</p>
          <p className="mt-1 text-[11px] text-amber-100/75">
            지침: <code className="text-amber-200">docs/A4_FLYER_GENERATION_GUIDELINES.md</code> ·
            전단 디자인:{" "}
            <Link href="/mockup/a4-flyer" className="underline hover:text-white">
              /mockup/a4-flyer
            </Link>
          </p>
        </div>

        <h1 className="text-xl font-extrabold text-white">버튼 위치 · 생성된 전단지 보기</h1>
        <p className="mt-1 text-sm text-white/50">
          매물등록·경매자동등록 화면에 붙일 위치와, 생성 후 미리보기 흐름만 보여 줍니다.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {(
            [
              ["property", "① 매물등록 버튼"],
              ["auction", "② 경매등록 버튼"],
              ["viewer", "③ 생성된 전단지 보기"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                tab === id
                  ? "bg-gradient-to-r from-cta-from to-cta-to text-white"
                  : "border border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "property" && (
          <div className="relative mt-6 pb-28">
            <GlassCard className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <p className="text-xs text-sky-300">목업 · /admin/properties/new · edit</p>
                  <h2 className="text-lg font-bold text-white">매물 등록 (위저드 요약)</h2>
                </div>
                <label className="flex items-center gap-2 text-[11px] text-slate-400">
                  <input
                    type="checkbox"
                    checked={propSaved}
                    onChange={(e) => {
                      setPropSaved(e.target.checked);
                      if (!e.target.checked) setFlyerReady(false);
                    }}
                  />
                  저장 완료(수정 모드)로 가정
                </label>
              </div>
              <div className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                <p>
                  <span className="text-slate-500">매물 </span>
                  {FLYER_SAMPLE_PROPERTY.title}
                </p>
                <p>
                  <span className="text-slate-500">가격 </span>
                  {FLYER_SAMPLE_PROPERTY.priceLine}
                </p>
              </div>
              <p className="rounded-xl border border-dashed border-orange-400/40 bg-orange-500/10 px-3 py-2 text-[11px] text-orange-100">
                <strong className="text-orange-200">권장 위치 A:</strong> 아래 sticky 바에서 「등록 저장」
                왼쪽 — 미저장 시 비활성, 저장 후 활성
              </p>
            </GlassCard>

            {/* sticky mock */}
            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0B0F19]/95 px-4 py-3 backdrop-blur-md md:left-0">
              <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  {propSaved ? (
                    <span className="inline-flex items-center gap-1 text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" /> 수정 모드 · 전단지 생성 가능
                    </span>
                  ) : (
                    "입력 후 등록 저장하세요"
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={!propSaved || generating}
                    onClick={() => runGenerate("property")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-orange-400/40 bg-orange-500/20 px-4 py-2 text-sm font-bold text-orange-100 disabled:opacity-40"
                  >
                    {generating && viewerKind === "property" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <FileImage className="h-3.5 w-3.5" />
                    )}
                    광고전단지 생성
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-5 py-2 text-sm font-bold text-white"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    등록 저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "auction" && (
          <div className="relative mt-6 space-y-4 pb-28">
            <GlassCard className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <p className="text-xs text-sky-300">목업 · /admin/auctions/new · edit</p>
                  <h2 className="text-lg font-bold text-white">경매물건 자동등록 · 리포트 영역</h2>
                </div>
                <label className="flex items-center gap-2 text-[11px] text-slate-400">
                  <input
                    type="checkbox"
                    checked={aucSaved}
                    onChange={(e) => {
                      setAucSaved(e.target.checked);
                      if (!e.target.checked) setFlyerReady(false);
                    }}
                  />
                  저장 완료(수정 모드)로 가정
                </label>
              </div>
              <p className="text-sm text-slate-300">
                {FLYER_SAMPLE_AUCTION.caseNumber} · {FLYER_SAMPLE_AUCTION.address}
              </p>
              <p className="rounded-xl border border-dashed border-amber-400/40 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-100">
                <strong className="text-amber-200">권장 위치 A:</strong> 일반/회원 리포트 옆{" "}
                <strong>A4 광고전단지</strong> 카드 (Gemini 풀 리포트와 별도)
              </p>
            </GlassCard>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-sky-400/25 bg-gradient-to-br from-sky-500/20 to-indigo-500/10 p-4 opacity-60">
                <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-200">
                  GENERAL
                </span>
                <h3 className="mt-2 text-sm font-bold text-white">일반리포트</h3>
                <p className="mt-1 text-[11px] text-slate-400">기존 Gemini PDF (참고)</p>
              </div>
              <div className="rounded-2xl border border-violet-400/25 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 p-4 opacity-60">
                <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-200">
                  MEMBER
                </span>
                <h3 className="mt-2 text-sm font-bold text-white">회원리포트</h3>
                <p className="mt-1 text-[11px] text-slate-400">기존 Gemini PDF (참고)</p>
              </div>
              <div className="rounded-2xl border-2 border-orange-400/50 bg-gradient-to-br from-orange-500/25 to-amber-500/10 p-4 ring-2 ring-orange-400/20">
                <span className="rounded-full bg-orange-500/25 px-2 py-0.5 text-[10px] font-bold text-orange-100">
                  FLYER
                </span>
                <h3 className="mt-2 text-sm font-bold text-white">A4 광고전단지</h3>
                <p className="mt-1 text-[11px] text-slate-300">1페이지 · 법정 명시 · 영업용</p>
                {flyerReady && viewerKind === "auction" ? (
                  <p className="mt-2 text-[11px] text-emerald-300">PDF 준비됨 (목업)</p>
                ) : (
                  <p className="mt-2 text-[11px] text-slate-500">저장된 전단지 없음</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={!aucSaved || generating}
                    onClick={() => runGenerate("auction")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-3 py-2 text-xs font-bold text-white disabled:opacity-40"
                  >
                    {generating && viewerKind === "auction" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    전단지 생성
                  </button>
                  <button
                    type="button"
                    disabled={!flyerReady}
                    onClick={() => {
                      setViewerKind("auction");
                      setViewerOpen(true);
                      setTab("viewer");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200 disabled:opacity-40"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    전단지 보기
                  </button>
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0B0F19]/95 px-4 py-3 backdrop-blur-md">
              <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
                <p className="text-[11px] text-slate-500">
                  <strong className="text-amber-200">위치 B:</strong> sticky에도 동일 버튼 (선택)
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={!aucSaved || generating}
                    onClick={() => runGenerate("auction")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-orange-400/40 bg-orange-500/20 px-4 py-2 text-sm font-bold text-orange-100 disabled:opacity-40"
                  >
                    <FileImage className="h-3.5 w-3.5" />
                    광고전단지
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-5 py-2 text-sm font-bold text-white"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    등록 저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "viewer" && (
          <div className="mt-6 space-y-4">
            <GlassCard className="p-5">
              <h2 className="text-lg font-bold text-white">③ 생성된 전단지 보기 (흐름)</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
                <li>「광고전단지 생성」 클릭</li>
                <li>미리보기 패널/모달 오픈 (라이트 A4)</li>
                <li>PDF 다운로드 · 인쇄 · 닫기</li>
                <li>다시 생성 시 최신 등록 데이터로 갱신</li>
              </ol>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFlyerReady(true);
                    setViewerOpen(true);
                    setViewerKind("property");
                  }}
                  className="rounded-xl border border-white/15 px-3 py-2 text-xs text-slate-200"
                >
                  매물 전단지 미리보기 열기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFlyerReady(true);
                    setViewerOpen(true);
                    setViewerKind("auction");
                  }}
                  className="rounded-xl border border-white/15 px-3 py-2 text-xs text-slate-200"
                >
                  경매 전단지 미리보기 열기
                </button>
                <Link
                  href="/mockup/a4-flyer"
                  className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white"
                >
                  전체 A4 시트 페이지 →
                </Link>
              </div>
            </GlassCard>

            {viewerOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#121826] shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <div>
                      <p className="text-xs text-slate-400">미리보기 · 목업</p>
                      <p className="text-sm font-bold text-white">
                        {viewerKind === "property"
                          ? FLYER_SAMPLE_PROPERTY.title
                          : FLYER_SAMPLE_AUCTION.caseNumber}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewerOpen(false)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
                      aria-label="닫기"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-auto bg-[#D8D4CE] p-4">
                    <div className="mx-auto aspect-[210/297] max-w-[420px] rounded-sm bg-white p-6 shadow-lg">
                      <p className="text-[10px] font-bold text-slate-500">
                        {viewerKind === "property" ? "매매 전단지" : "법원 경매 전단지"}
                      </p>
                      <p className="mt-2 text-sm font-extrabold text-slate-900">
                        {viewerKind === "property"
                          ? FLYER_SAMPLE_PROPERTY.title
                          : FLYER_SAMPLE_AUCTION.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        {viewerKind === "property"
                          ? FLYER_SAMPLE_PROPERTY.priceLine
                          : `최저 ${FLYER_SAMPLE_AUCTION.minPrice}`}
                      </p>
                      <div className="mt-4 grid grid-cols-3 gap-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="aspect-square rounded-sm bg-slate-200"
                            style={
                              viewerKind === "auction" && FLYER_SAMPLE_AUCTION.images[i]
                                ? {
                                    backgroundImage: `url(${FLYER_SAMPLE_AUCTION.images[i]})`,
                                    backgroundSize: "cover",
                                  }
                                : undefined
                            }
                          />
                        ))}
                      </div>
                      <p className="mt-3 text-[10px] text-slate-500">
                        Header → 사진 3장 → 핵심정보 →{" "}
                        {viewerKind === "property" ? "특장점·입지" : "전문가 포인트"} → Footer
                      </p>
                      <p className="mt-4 text-[9px] text-slate-400">
                        실제 구현 시 이 영역에 풀 A4 FlyerSheet가 렌더됩니다.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-3 py-2 text-xs font-bold text-white"
                    >
                      <Download className="h-3.5 w-3.5" />
                      PDF 다운로드
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-xs text-slate-200"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      인쇄
                    </button>
                    <Link
                      href="/mockup/a4-flyer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-xs text-slate-200"
                    >
                      실물 A4 목업 보기
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
