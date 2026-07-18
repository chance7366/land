import type { Metadata } from "next";
import { MobileHeaderCtaSample } from "@/components/mockup/MobileHeaderCtaSample";

export const metadata: Metadata = {
  title: "디자인 목업 | 모바일 상단 헤더 CTA",
  robots: { index: false, follow: false },
};

export default function MobileHeaderCtaMockupPage() {
  return (
    <div className="min-h-screen bg-landing-bg px-4 py-8 font-[family-name:var(--font-unifine)] text-landing-text md:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">Mockup</p>
        <h1 className="mt-1 text-2xl font-extrabold text-white md:text-3xl">
          모바일 상단 헤더 CTA
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/55">
          PC와 같이 한 줄에 맞춤 알림·상담 예약·YouTube·네이버 블로그를 두고, 모바일 폭에 맞게
          크기만 줄인 안입니다. 햄버거·Sheet CTA는 포함하지 않습니다. 프로덕션 미적용.
        </p>
        <div className="mt-8">
          <MobileHeaderCtaSample />
        </div>
      </div>
    </div>
  );
}
