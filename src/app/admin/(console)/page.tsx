import { AppLink as Link } from "@/components/ui/AppLink";
import { getAdminDashboardData } from "@/lib/data";
import { SyncButton } from "@/components/admin/SyncButton";
import { GlassCard } from "@/components/ui/GlassCard";

function consultationStatusLabel(status: string) {
  if (status === "DONE") {
    return {
      label: "답변완료",
      className: "bg-emerald-500/20 text-emerald-300",
      dot: "bg-emerald-400",
    };
  }
  if (status === "PROCESSING") {
    return {
      label: "답변대기",
      className: "bg-amber-500/20 text-amber-300",
      dot: "bg-amber-400",
    };
  }
  return {
    label: "접수중",
    className: "bg-sky-500/20 text-sky-300",
    dot: "bg-sky-400",
  };
}

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  return (
    <main className="p-10 text-landing-text">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-headline-lg tracking-tight text-landing-text">대시보드 개요</h2>
          <p className="font-body-md text-landing-muted">실시간 운영 현황 및 서비스 통합 관리</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>
            <span className="font-label-md text-landing-muted">System Online</span>
          </div>
          <button
            type="button"
            className="rounded-lg bg-gradient-to-r from-cta-from to-cta-to px-6 py-2 font-label-md text-white hover:opacity-90"
          >
            시스템 로그 확인
          </button>
        </div>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        {[
          {
            label: "일일 방문자",
            icon: "show_chart",
            value: data.stats.visitors.toLocaleString(),
            sub: `↑${data.stats.visitorGrowth}%`,
            subClass: "text-emerald-400",
          },
          {
            label: "신규 문의",
            icon: "mail",
            value: String(data.stats.newInquiries),
            sub: "Urgent",
            subClass: "text-amber-400",
          },
          {
            label: "진행 경매 물건",
            icon: "gavel",
            value: String(data.stats.activeAuctions),
            sub: "건",
            subClass: "text-landing-muted",
          },
          {
            label: "API 호출 성공률",
            icon: "api",
            value: String(data.stats.apiSuccessRate),
            sub: "%",
            subClass: "text-landing-muted",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="stat-card flex h-32 flex-col justify-between rounded-xl border p-6"
          >
            <div className="flex items-start justify-between">
              <span className="font-label-md text-landing-muted">{card.label}</span>
              <span className="material-symbols-outlined text-blue-400">{card.icon}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-data-numeral text-display-lg text-landing-text">{card.value}</span>
              <span className={`flex items-center font-label-md ${card.subClass}`}>{card.sub}</span>
            </div>
          </div>
        ))}
      </section>

      <div className="bento-grid">
        <GlassCard className="col-span-12 h-full p-8 lg:col-span-5">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="font-headline-md text-landing-text">API 시스템 관리</h3>
            <span className="material-symbols-outlined text-violet-400">settings_ethernet</span>
          </div>
          <div className="space-y-6">
            {data.apiIntegrations.map((api) => (
              <div
                key={api.id}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.04] p-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      api.status === "ACTIVE"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-white/10 text-landing-muted"
                    }`}
                  >
                    <span className="material-symbols-outlined">
                      {api.provider === "kakao" ? "map" : "database"}
                    </span>
                  </div>
                  <div>
                    <p className="font-label-md font-bold text-landing-text">{api.name}</p>
                    <p className="text-xs text-landing-muted">
                      {api.provider === "kakao" ? `Daily limit: ${api.dailyUsage}% used` : "v2.4 Connected"}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold ${
                    api.status === "ACTIVE" ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {api.status}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-xl border border-white/10 bg-gradient-to-br from-cta-from/20 to-cta-to/20 p-6">
            <p className="mb-2 font-label-md text-landing-muted">최근 API 동기화 로그</p>
            <ul className="space-y-2 font-mono text-xs text-landing-text">
              {data.systemLogs.map((log) => (
                <li key={log.id} className="flex justify-between gap-4">
                  <span className="text-landing-muted">
                    [{log.createdAt.toTimeString().slice(0, 8)}] {log.event}
                  </span>
                  <span className={log.level === "error" ? "text-red-400" : "text-emerald-400"}>
                    {log.message}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </GlassCard>

        <GlassCard className="relative col-span-12 h-full overflow-hidden p-8 lg:col-span-7">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="font-headline-md text-landing-text">네이버 부동산 스크래핑 현황</h3>
          </div>
          <div className="mb-8 flex flex-col items-center gap-8 md:flex-row">
            <div className="relative flex h-48 w-48 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 192 192" aria-hidden="true">
                <circle
                  className="text-white/10"
                  cx="96"
                  cy="96"
                  fill="transparent"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                />
                <circle
                  className="text-blue-400"
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
                <span className="font-data-numeral text-display-lg text-landing-text">
                  {data.scrapingJob?.progress ?? 0}%
                </span>
                <span className="font-label-md text-landing-muted">Syncing...</span>
              </div>
            </div>
            <div className="w-full flex-1 space-y-6">
              <div className="rounded-lg border border-white/5 bg-white/[0.04] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-label-md text-landing-text">
                    {data.scrapingJob?.name ?? "수집기"}
                  </span>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    {data.scrapingJob?.status ?? "STOPPED"}
                  </span>
                </div>
                <p className="text-sm text-landing-muted">
                  최근 동기화: {data.scrapingJob?.lastRunAt?.toLocaleString("ko-KR") ?? "-"}
                </p>
                <p className="text-sm text-landing-muted">
                  신규 추가된 매물:{" "}
                  <span className="font-bold text-blue-400">{data.scrapingJob?.updatedCount ?? 0}건</span>
                </p>
              </div>
              <SyncButton />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Scraped", value: data.scrapingJob?.scrapedCount ?? 0, color: "text-blue-400" },
              { label: "Errors", value: data.scrapingJob?.errorCount ?? 0, color: "text-red-400" },
              { label: "Updated", value: data.scrapingJob?.updatedCount ?? 0, color: "text-emerald-400" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-center"
              >
                <p className="mb-1 text-xs text-landing-muted">{item.label}</p>
                <p className={`font-data-numeral text-headline-md ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="col-span-12 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="font-headline-md text-landing-text">법률상담 및 문의 관리</h3>
              <p className="text-sm text-landing-muted">최근 48시간 이내 접수된 긴급 상담 요청</p>
            </div>
            <Link
              href="/admin/consultations"
              className="border-b border-blue-400 pb-0.5 font-label-md text-blue-400"
            >
              전체 내역 보기
            </Link>
          </div>
          <div className="custom-scrollbar overflow-x-auto">
            <table className="w-full border-collapse text-left text-unifine-table-text">
              <thead>
                <tr className="text-landing-muted">
                  {["접수 일시", "의뢰인", "상담 분류", "내용 요약", "상태", "관리"].map((h) => (
                    <th key={h} className="border-b border-white/10 p-4 font-label-md">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.consultations.slice(0, 3).map((row) => {
                  const status = consultationStatusLabel(row.status);
                  return (
                    <tr key={row.id} className="transition-colors hover:bg-white/[0.04]">
                      <td className="p-4 text-sm">{row.createdAt.toLocaleString("ko-KR")}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-cta-from to-cta-to text-xs font-bold text-white">
                            {row.clientName.slice(0, 1)}
                          </div>
                          <span className="text-sm font-bold text-landing-text">{row.clientName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="rounded bg-white/10 px-2 py-1 text-xs">{row.category}</span>
                      </td>
                      <td className="p-4 text-sm text-landing-muted">{row.summary}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`}></span>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href="/admin/consultations"
                          className="inline-flex rounded-lg bg-gradient-to-r from-cta-from to-cta-to p-2 text-white"
                        >
                          <span className="material-symbols-outlined">check</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      <footer className="mt-12 flex items-center justify-between border-t border-white/10 py-8 text-landing-muted opacity-60">
        <p className="font-label-md">© 2024 Chance Real Estate & Auction Admin. Naepo New City Specialist.</p>
      </footer>
    </main>
  );
}
