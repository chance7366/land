import Link from "next/link";

const links = [
  {
    href: "/mockup/property-register-compliance",
    title: "등록 위저드 고도화",
    desc: "5-Step · 관리비 7비목 · 법적 체크리스트 · 대장 자동기입(시뮬)",
    tone: "done",
  },
  {
    href: "/mockup/property-detail-conversion",
    title: "고객 상세 전환 UX",
    desc: "Sticky CTA · 법적 표 · 관리비 카드 · 지도·대출 추정",
    tone: "done",
  },
  {
    href: "/mockup/property-list-redesign",
    title: "목록 재구성 (기적용)",
    desc: "추천 스트립 + 전폭 표 — 운영 /properties 반영됨",
    tone: "done",
  },
  {
    href: "/mockup/property-detail-redesign",
    title: "상세 §1~3 KV (기적용)",
    desc: "운영 /properties/[id] 반영된 섹션 표 목업",
    tone: "done",
  },
];

/** 매물 고도화 목업 허브 — 운영 미적용 */
export default function PropertyComplianceHubPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] px-4 py-10 font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-200 md:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 rounded-2xl border border-emerald-400/30 bg-[#0a1210] px-4 py-3 text-center text-xs text-emerald-100/90">
          <p className="font-bold text-emerald-50">매물관리 고도화 목업 허브 — 운영 적용됨</p>
          <p className="mt-1 text-[11px] text-emerald-100/70">
            /admin/properties/new · /properties/[id]
          </p>
        </div>
        <h1 className="mb-2 text-2xl font-extrabold text-white">매물 등록 · 상세 재구상</h1>
        <p className="mb-6 text-sm text-white/50">
          국토부 표시·광고 기준 · 관리비 투명화 · 전환 CTA 방향의 미리보기입니다.
        </p>
        <ul className="space-y-3">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block rounded-2xl border border-white/10 bg-[rgba(20,18,28,0.78)] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:border-[#a78bfa]/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-white">{l.title}</p>
                    <p className="mt-1 text-xs text-white/50">{l.desc}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      l.tone === "done"
                        ? "bg-emerald-500/15 text-emerald-200"
                        : l.tone === "admin"
                          ? "bg-sky-500/15 text-sky-200"
                          : "bg-[#a78bfa]/15 text-[#ddd6fe]"
                    }`}
                  >
                    {l.tone === "done" ? "기적용" : "신규 목업"}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
