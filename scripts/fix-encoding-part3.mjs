import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function write(rel, content) {
  fs.writeFileSync(path.join(root, rel), content, "utf8");
  console.log("wrote", rel);
}

write(
  "src/app/admin/(console)/properties/page.tsx",
  `import { AppLink as Link } from "@/components/ui/AppLink";
import { getAllPropertiesAdmin } from "@/lib/property-service";
import { AdminPropertyList } from "@/components/admin/AdminPropertyList";

export default async function AdminPropertiesPage() {
  const items = await getAllPropertiesAdmin();

  return (
    <main className="p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-lg text-primary">매물 관리</h1>
          <p className="mt-2 text-on-surface-variant">일반중개 매물 등록·수정·노출 관리</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="rounded-lg bg-primary px-4 py-2 font-label-md text-on-primary hover:opacity-90"
        >
          + 매물 등록
        </Link>
      </div>
      <AdminPropertyList items={items} />
    </main>
  );
}
`
);

write(
  "src/app/admin/(console)/properties/new/page.tsx",
  `import { AppLink as Link } from "@/components/ui/AppLink";
import { PropertyForm } from "@/components/admin/PropertyForm";

export default function AdminPropertyNewPage() {
  return (
    <main className="p-10">
      <Link href="/admin/properties" className="text-sm text-primary">
        ← 매물 목록
      </Link>
      <h1 className="mt-4 font-headline-lg text-primary">매물 등록</h1>
      <div className="mt-8">
        <PropertyForm />
      </div>
    </main>
  );
}
`
);

write(
  "src/app/mockup/hero-banner/page.tsx",
  `import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import {
  HeroBannerColorSchemeCards,
  HeroBannerPreviewFrames,
  HeroBannerSchemeComparison,
  HeroBannerTypoSpec,
} from "@/components/mockup/HeroBannerPreview";

export const metadata: Metadata = {
  title: "디자인 목업 | 히어로 배너",
  robots: { index: false, follow: false },
};

export default function HeroBannerMockupPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-outline-variant/30 bg-surface px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-error-container px-3 py-1 font-caption font-bold text-on-error-container">
              디자인 목업
            </span>
            <h1 className="font-section-title text-primary">히어로 배너 색상 조합</h1>
          </div>
          <Link href="/" className="font-caption font-medium text-primary hover:underline">
            ← 홈으로
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 pb-16">
        <p className="font-caption mb-8 text-on-surface-variant">
          3가지 색상 조합을 비교합니다. 추천 조합은 홈에 적용되어 있습니다.
        </p>

        <section className="mb-12">
          <h2 className="mb-4 font-headline-md text-primary">색상 조합 3종</h2>
          <HeroBannerColorSchemeCards />
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-headline-md text-primary">조합별 모바일 비교</h2>
          <HeroBannerSchemeComparison />
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-headline-md text-primary">타이포그래피 스펙</h2>
          <HeroBannerTypoSpec />
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-headline-md text-primary">프레임 미리보기</h2>
          <HeroBannerPreviewFrames />
        </section>

        <section className="rounded-2xl border border-primary/15 bg-primary/5 p-6 text-center">
          <p className="font-body-md text-on-surface-variant">추천 조합이 홈 히어로에 적용되어 있습니다.</p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-full bg-primary px-6 py-2.5 font-label-md text-on-primary transition-all hover:opacity-90"
          >
            홈에서 확인하기
          </Link>
        </section>
      </main>
    </div>
  );
}
`
);

write(
  "src/app/mockup/unified-dashboard/page.tsx",
  `import type { Metadata } from "next";
import { AppLink as Link } from "@/components/ui/AppLink";
import {
  ColorTokenLegend,
  LegacyDashboardColumns,
  UnifiedDashboardColumns,
} from "@/components/mockup/UnifiedDashboardPreview";

export const metadata: Metadata = {
  title: "디자인 목업 | 4섹션 대시보드",
  robots: { index: false, follow: false },
};

export default function UnifiedDashboardMockupPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-outline-variant/30 bg-surface px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-error-container px-3 py-1 font-caption font-bold text-on-error-container">
              디자인 목업
            </span>
            <h1 className="font-section-title text-primary">4섹션 대시보드 통일</h1>
          </div>
          <Link href="/" className="font-caption font-medium text-primary hover:underline">
            ← 홈으로
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 pb-16">
        <p className="font-caption mb-8 text-on-surface-variant">
          Unified Light Panel 제안: 4개 섹션 밝은 패널, 상단 border-t 4색으로만 섹션 구분.
        </p>

        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded bg-surface-container-high px-2 py-1 font-caption font-bold text-on-surface-variant">
              Before
            </span>
            <h2 className="font-section-title text-primary">현재 홈 경매 섹션 패널</h2>
          </div>
          <LegacyDashboardColumns />
        </section>

        <section className="mb-4">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded bg-primary/10 px-2 py-1 font-caption font-bold text-primary">After</span>
            <h2 className="font-section-title text-primary">제안: Unified Light Panel</h2>
          </div>
          <UnifiedDashboardColumns />
        </section>

        <ColorTokenLegend />
      </main>
    </div>
  );
}
`
);

write(
  "src/app/admin/(console)/page.tsx",
  `import { AppLink as Link } from "@/components/ui/AppLink";
import { getAdminDashboardData } from "@/lib/data";
import { SyncButton } from "@/components/admin/SyncButton";

function consultationStatusLabel(status: string) {
  if (status === "PROCESSING") {
    return {
      label: "Processing",
      className: "bg-secondary-container text-on-secondary-container",
      dot: "bg-secondary",
    };
  }
  return {
    label: "Pending",
    className: "bg-error-container text-on-error-container",
    dot: "bg-error",
  };
}

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  return (
    <main className="p-10">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-headline-lg tracking-tight text-primary">대시보드 개요</h2>
          <p className="font-body-md text-on-surface-variant">실시간 운영 현황 및 서비스 통합 관리</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-surface-container-high px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-secondary"></span>
            <span className="font-label-md">System Online</span>
          </div>
          <button type="button" className="rounded-lg bg-primary px-6 py-2 font-label-md text-white hover:opacity-90">
            시스템 로그 확인
          </button>
        </div>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        {[
          { label: "일일 방문자", icon: "show_chart", value: data.stats.visitors.toLocaleString(), sub: \`↑\${data.stats.visitorGrowth}%\`, subClass: "text-secondary" },
          { label: "신규 문의", icon: "mail", value: String(data.stats.newInquiries), sub: "Urgent", subClass: "text-error" },
          { label: "진행 경매 물건", icon: "gavel", value: String(data.stats.activeAuctions), sub: "건", subClass: "text-on-surface-variant" },
          { label: "API 호출 성공률", icon: "api", value: String(data.stats.apiSuccessRate), sub: "%", subClass: "text-on-surface-variant" },
        ].map((card) => (
          <div key={card.label} className="stat-card flex h-32 flex-col justify-between rounded-xl border border-outline-variant p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <span className="font-label-md text-on-surface-variant">{card.label}</span>
              <span className="material-symbols-outlined text-primary">{card.icon}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-data-numeral text-display-lg text-primary">{card.value}</span>
              <span className={\`flex items-center font-label-md \${card.subClass}\`}>{card.sub}</span>
            </div>
          </div>
        ))}
      </section>

      <div className="bento-grid">
        <div className="col-span-12 h-full rounded-xl border border-outline-variant bg-white p-8 shadow-sm lg:col-span-5">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="font-headline-md text-primary">API 시스템 관리</h3>
            <span className="material-symbols-outlined text-primary-container">settings_ethernet</span>
          </div>
          <div className="space-y-6">
            {data.apiIntegrations.map((api) => (
              <div key={api.id} className="flex items-center justify-between rounded-lg bg-surface p-4">
                <div className="flex items-center gap-4">
                  <div className={\`flex h-10 w-10 items-center justify-center rounded-full \${api.status === "ACTIVE" ? "bg-secondary-container text-on-secondary-container" : "bg-surface-variant text-on-surface-variant"}\`}>
                    <span className="material-symbols-outlined">{api.provider === "kakao" ? "map" : "database"}</span>
                  </div>
                  <div>
                    <p className="font-label-md font-bold">{api.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      {api.provider === "kakao" ? \`Daily limit: \${api.dailyUsage}% used\` : "v2.4 Connected"}
                    </p>
                  </div>
                </div>
                <span className={\`text-xs font-bold \${api.status === "ACTIVE" ? "text-secondary" : "text-on-tertiary-container"}\`}>
                  {api.status}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-xl bg-primary-container p-6 text-white">
            <p className="mb-2 font-label-md opacity-80">최근 API 동기화 로그</p>
            <ul className="space-y-2 font-mono text-xs">
              {data.systemLogs.map((log) => (
                <li key={log.id} className="flex justify-between">
                  <span>[{log.createdAt.toTimeString().slice(0, 8)}] {log.event}</span>
                  <span className={log.level === "error" ? "text-error" : "text-secondary-fixed"}>{log.message}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative col-span-12 h-full overflow-hidden rounded-xl border border-outline-variant bg-white p-8 shadow-sm lg:col-span-7">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="font-headline-md text-primary">네이버 부동산 스크래핑 현황</h3>
          </div>
          <div className="mb-8 flex flex-col items-center gap-8 md:flex-row">
            <div className="relative flex h-48 w-48 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 192 192" aria-hidden="true">
                <circle className="text-surface-container" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="8" />
                <circle
                  className="text-primary"
                  cx="96"
                  cy="96"
                  fill="transparent"
                  r="88"
                  stroke="currentColor"
                  strokeDasharray="552"
                  strokeDashoffset={552 - (552 * (data.scrapingJob?.progress ?? 0)) / 100}
                  strokeWidth="8"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-data-numeral text-display-lg text-primary">{data.scrapingJob?.progress ?? 0}%</span>
                <span className="font-label-md text-on-surface-variant">Syncing...</span>
              </div>
            </div>
            <div className="w-full flex-1 space-y-6">
              <div className="rounded-lg bg-surface p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-label-md">{data.scrapingJob?.name ?? "수집기"}</span>
                  <span className="rounded bg-secondary-container px-2 py-0.5 text-[10px] font-bold text-on-secondary-container">
                    {data.scrapingJob?.status ?? "STOPPED"}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant">
                  최근 동기화: {data.scrapingJob?.lastRunAt?.toLocaleString("ko-KR") ?? "-"}
                </p>
                <p className="text-sm text-on-surface-variant">
                  신규 추가된 매물: <span className="font-bold text-primary">{data.scrapingJob?.updatedCount ?? 0}건</span>
                </p>
              </div>
              <SyncButton />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-outline-variant p-4 text-center">
              <p className="mb-1 text-xs text-on-surface-variant">Scraped</p>
              <p className="font-data-numeral text-headline-md text-primary">{data.scrapingJob?.scrapedCount ?? 0}</p>
            </div>
            <div className="rounded-lg border border-outline-variant p-4 text-center">
              <p className="mb-1 text-xs text-on-surface-variant">Errors</p>
              <p className="font-data-numeral text-headline-md text-error">{data.scrapingJob?.errorCount ?? 0}</p>
            </div>
            <div className="rounded-lg border border-outline-variant p-4 text-center">
              <p className="mb-1 text-xs text-on-surface-variant">Updated</p>
              <p className="font-data-numeral text-headline-md text-secondary">{data.scrapingJob?.updatedCount ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="col-span-12 rounded-xl border border-outline-variant bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="font-headline-md text-primary">법률상담 및 문의 관리</h3>
              <p className="text-sm text-on-surface-variant">최근 48시간 이내 접수된 긴급 상담 요청</p>
            </div>
            <Link href="/admin/consultations" className="border-b border-primary pb-0.5 font-label-md text-primary">
              전체 내역 보기
            </Link>
          </div>
          <div className="custom-scrollbar overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="bg-surface-container text-on-surface-variant">
                <tr>
                  {["접수 일시", "의뢰인", "상담 분류", "내용 요약", "상태", "관리"].map((h) => (
                    <th key={h} className="border-b border-outline-variant p-4 font-label-md">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {data.consultations.slice(0, 3).map((row) => {
                  const status = consultationStatusLabel(row.status);
                  return (
                    <tr key={row.id} className="transition-colors hover:bg-surface-container-low">
                      <td className="p-4 text-sm">{row.createdAt.toLocaleString("ko-KR")}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-fixed text-xs font-bold text-primary">
                            {row.clientName.slice(0, 1)}
                          </div>
                          <span className="text-sm font-bold">{row.clientName}</span>
                        </div>
                      </td>
                      <td className="p-4"><span className="rounded bg-surface-variant px-2 py-1 text-xs">{row.category}</span></td>
                      <td className="p-4 text-sm text-on-surface-variant">{row.summary}</td>
                      <td className="p-4">
                        <span className={\`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium \${status.className}\`}>
                          <span className={\`h-1.5 w-1.5 rounded-full \${status.dot}\`}></span>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link href="/admin/consultations" className="inline-flex rounded-lg bg-primary-container p-2 text-white">
                          <span className="material-symbols-outlined">check</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <footer className="mt-12 flex items-center justify-between border-t border-outline-variant py-8 text-on-surface-variant opacity-60">
        <p className="font-label-md">© 2024 Chance Real Estate & Auction Admin. Naepo New City Specialist.</p>
      </footer>
    </main>
  );
}
`
);

console.log("done");
