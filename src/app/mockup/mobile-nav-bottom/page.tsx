import type { Metadata } from "next";
import { MobileNavBottomSample } from "@/components/mockup/MobileNavBottomSample";

export const metadata: Metadata = {
  title: "디자인 목업 | 모바일 하단메뉴·햄버거 Sheet",
  robots: { index: false, follow: false },
};

export default function MobileNavBottomMockupPage() {
  return (
    <div className="min-h-screen bg-landing-bg px-4 py-8 font-[family-name:var(--font-unifine)] text-landing-text md:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">Mockup</p>
        <h1 className="mt-1 text-2xl font-extrabold text-white md:text-3xl">
          모바일 하단 메뉴 · 햄버거 Sheet
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/55">
          하단 8탭 가로 스크롤과, Sheet 안 CTA(맞춤 알림·상담·YouTube·블로그) 라벨 표시 개선안입니다.
          프로덕션에는 아직 적용하지 않았습니다.
        </p>
        <div className="mt-8">
          <MobileNavBottomSample />
        </div>
      </div>
    </div>
  );
}
