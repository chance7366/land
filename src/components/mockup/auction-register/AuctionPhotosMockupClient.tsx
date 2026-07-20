"use client";

import { useMemo, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AUCTION_PHOTOS_15044_SAMPLE } from "@/lib/mockup/auction-photos-15044-sample";

const MAX_IMAGES = 8;
const STEP_LABELS = [
  "기본정보",
  "기일 내역",
  "목록 내역",
  "감정요약",
  "물건상세",
  "현황조사서",
  "서류",
  "사진",
];

type Mode = "live15044" | "many";

type PhotoItem = {
  key: string;
  url: string;
  alt: string;
  fromCourt: boolean;
};

export function AuctionPhotosMockupClient() {
  const sample = AUCTION_PHOTOS_15044_SAMPLE;
  const [mode, setMode] = useState<Mode>("live15044");
  const [removed, setRemoved] = useState<Set<string>>(new Set());

  const courtPool: PhotoItem[] = useMemo(() => {
    if (mode === "live15044") {
      return sample.photos.map((p) => ({
        key: `live-${p.index}`,
        url: p.url,
        alt: p.alt,
        fromCourt: true,
      }));
    }
    // 다량 사진 시나리오: 실사진 5장을 순환해 12장으로 시뮬레이션
    const many: PhotoItem[] = [];
    for (let i = 0; i < 12; i++) {
      const src = sample.photos[i % sample.photos.length];
      many.push({
        key: `many-${i + 1}`,
        url: src.url,
        alt: `${src.alt} (시뮬 ${i + 1})`,
        fromCourt: true,
      });
    }
    return many;
  }, [mode, sample.photos]);

  const applied = courtPool.filter((p) => !removed.has(p.key)).slice(0, MAX_IMAGES);
  const overflow = Math.max(0, courtPool.filter((p) => !removed.has(p.key)).length - MAX_IMAGES);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 pb-20 font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-200">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#d4bfff]/80">
          ADMIN SAMPLE · 법원 사진 자동첨부
        </p>
        <h1 className="mt-2 text-3xl font-extrabold italic tracking-tight text-white md:text-4xl">
          경매물건 자동등록
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          <strong className="text-white">{sample.caseNumber}</strong> (
          {sample.court}) 물건상세{" "}
          <code className="text-[#4dabff]/90">#mf_wfm_mainFrame_gen_pic</code> 에서
          실제 수집한 사진을{" "}
          <strong className="text-white">8. 사진</strong> 슬롯에 넣는 흐름 목업입니다.
          운영 폼에는 아직 적용하지 않았습니다.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2 text-[11px]">
        {STEP_LABELS.map((label, i) => (
          <span
            key={label}
            className={`rounded-full border px-2.5 py-1 ${
              i === 7
                ? "border-emerald-400/40 bg-emerald-500/15 font-semibold text-emerald-200"
                : "border-white/10 text-slate-600"
            }`}
          >
            {i + 1}. {label}
          </span>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("live15044");
            setRemoved(new Set());
          }}
          className={`rounded-full border px-3 py-1.5 text-xs transition ${
            mode === "live15044"
              ? "border-[#4dabff]/50 bg-[#4dabff]/15 font-semibold text-white"
              : "border-white/10 text-slate-400 hover:border-white/25"
          }`}
        >
          실데이터 · {sample.caseNumber} ({sample.savedCount}장)
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("many");
            setRemoved(new Set());
          }}
          className={`rounded-full border px-3 py-1.5 text-xs transition ${
            mode === "many"
              ? "border-[#4dabff]/50 bg-[#4dabff]/15 font-semibold text-white"
              : "border-white/10 text-slate-400 hover:border-white/25"
          }`}
        >
          다량 사진 시뮬 (12장 → 최대 8장)
        </button>
      </div>

      <div className="mb-5 grid gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-slate-400 md:grid-cols-3">
        <div>
          <p className="text-[11px] text-slate-500">수집 경로</p>
          <p className="mt-1 text-slate-200">물건상세조회 → gen_pic data URI</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-500">법원에서 읽은 장수</p>
          <p className="mt-1 text-slate-200">
            {courtPool.length}장
            {mode === "live15044" ? " (실수집)" : " (시뮬)"}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-slate-500">폼 반영 규칙</p>
          <p className="mt-1 text-slate-200">앞에서부터 최대 {MAX_IMAGES}장 자동 채움</p>
        </div>
      </div>

      <div className="space-y-5">
        <GlassCard className="p-5 opacity-45 md:p-6">
          <SectionHead n={7} title="서류 첨부" hint="목업 맥락 · 생략" />
          <p className="text-sm text-slate-500">서류 슬롯 (기존 섹션)</p>
        </GlassCard>

        <GlassCard className="p-5 md:p-6 ring-1 ring-[#4dabff]/25">
          <SectionHead
            n={8}
            title="사진"
            hint={`법원 사진 자동첨부 예정 · 최대 ${MAX_IMAGES}장 · 수동 추가/삭제 가능`}
          />

          {overflow > 0 && (
            <p className="mb-3 rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-100/90">
              법원 사진 {courtPool.length}장 중 상위 {MAX_IMAGES}장만 자동 등록했습니다.
              나머지 {overflow}장은 제외되었습니다. (필요 시 수동 추가)
            </p>
          )}

          {mode === "live15044" && (
            <p className="mb-3 text-[11px] text-slate-500">
              수집 시각 {new Date(sample.fetchedAt).toLocaleString("ko-KR")} · 소스{" "}
              <code className="text-slate-400">{sample.sourceDom}</code>
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {applied.map((photo) => (
              <div
                key={photo.key}
                className="relative h-24 w-24 overflow-hidden rounded-xl border border-emerald-400/35 bg-emerald-500/[0.07]"
                title={photo.alt}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.alt} className="h-full w-full object-cover" />
                <span className="absolute bottom-0 left-0 right-0 bg-black/65 px-1 py-0.5 text-center text-[9px] text-emerald-200">
                  자동
                </span>
                <button
                  type="button"
                  className="absolute right-1 top-1 rounded-full bg-black/70 p-1"
                  onClick={() =>
                    setRemoved((prev) => {
                      const next = new Set(prev);
                      next.add(photo.key);
                      return next;
                    })
                  }
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              disabled={applied.length >= MAX_IMAGES}
              className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/20 text-slate-400 disabled:opacity-40"
            >
              <ImagePlus className="h-5 w-5" />
              <span className="text-[10px]">
                추가 ({applied.length}/{MAX_IMAGES})
              </span>
            </button>
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[480px] text-left text-xs text-[#cbd5e1]">
              <thead>
                <tr className="bg-white/[0.06] text-[11px] text-slate-400">
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">법원 라벨</th>
                  <th className="px-3 py-2">반영</th>
                  <th className="px-3 py-2">파일</th>
                </tr>
              </thead>
              <tbody>
                {courtPool.map((p, i) => {
                  const inForm = applied.some((a) => a.key === p.key);
                  const skipped = !inForm && !removed.has(p.key);
                  return (
                    <tr key={p.key} className="border-t border-white/5">
                      <td className="px-3 py-2">{i + 1}</td>
                      <td className="px-3 py-2">{p.alt}</td>
                      <td className="px-3 py-2">
                        {removed.has(p.key) ? (
                          <span className="text-slate-500">삭제됨</span>
                        ) : inForm ? (
                          <span className="text-emerald-300">자동 등록</span>
                        ) : skipped ? (
                          <span className="text-amber-200/90">한도 초과 제외</span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="max-w-[220px] truncate px-3 py-2 text-slate-500">
                        {p.url.split("/").pop()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function SectionHead({
  n,
  title,
  hint,
}: {
  n: number;
  title: string;
  hint: string;
}) {
  return (
    <div className="mb-4 flex items-baseline gap-3 border-b border-white/10 pb-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#4dabff] to-[#913dff] text-xs font-extrabold text-white">
        {n}
      </span>
      <div>
        <h2 className="text-base font-bold text-white">{title}</h2>
        <p className="mt-0.5 text-[11px] text-slate-500">{hint}</p>
      </div>
    </div>
  );
}
