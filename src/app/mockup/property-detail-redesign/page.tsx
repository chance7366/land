import { Suspense } from "react";
import { PropertyDetailRedesignSample } from "@/components/mockup/PropertyDetailRedesignSample";

/** 사용자 매물 상세 재구성 목업 — 운영 /properties/[id] 미적용 */
export default function PropertyDetailRedesignMockupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] text-sm text-white/50">
          불러오는 중…
        </div>
      }
    >
      <PropertyDetailRedesignSample />
    </Suspense>
  );
}
