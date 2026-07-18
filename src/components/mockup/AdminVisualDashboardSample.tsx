"use client";

import {
  ACCENT,
  SAMPLE_ACTION,
  SAMPLE_ATTRIBUTION,
  SAMPLE_CUSTOMER_ACTIONS,
  SAMPLE_DWELL_TOP,
  SAMPLE_DWELL_TREND,
  SAMPLE_FUNNEL,
  SAMPLE_INVENTORY,
  SAMPLE_MENU_SHARE,
  SAMPLE_MONTHLY,
  SAMPLE_RESPONSE_HOURS,
  SAMPLE_SEARCH_KEYWORDS,
  SAMPLE_STORY_MARKERS,
  SAMPLE_SUPPLY_GAP,
  SAMPLE_TOP_AUCTIONS,
  SAMPLE_TOP_PROPERTIES,
} from "@/lib/mockup/admin-visual-dashboard-sample";
import {
  AlertTriangle,
  Bell,
  CalendarClock,
  CircleHelp,
  Clock3,
  Copy,
  Flame,
  Link2,
  Printer,
  Search,
  Share2,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type AccentCardProps = {
  children: React.ReactNode;
  accentRgb: string;
  accentHex: string;
  className?: string;
};

function AccentCard({ children, accentRgb, accentHex, className = "" }: AccentCardProps) {
  const idleBg = `linear-gradient(165deg, rgba(${accentRgb}, 0.14) 0%, rgba(${accentRgb}, 0.06) 55%, rgba(15, 18, 28, 0.55) 100%)`;
  return (
    <div
      className={`relative rounded-2xl border p-5 backdrop-blur-sm ${className}`}
      style={{
        borderColor: `rgba(${accentRgb}, 0.4)`,
        background: idleBg,
        boxShadow: `0 8px 28px rgba(${accentRgb}, 0.12), 0 0 0 1px rgba(${accentRgb}, 0.08)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-40"
        style={{ boxShadow: `inset 0 0 40px rgba(${accentRgb}, 0.08)` }}
        aria-hidden
      />
      <div className="relative" style={{ ["--accent" as string]: accentHex }}>
        {children}
      </div>
    </div>
  );
}

function ZoneTitle({
  step,
  title,
  subtitle,
}: {
  step: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">{step}</p>
      <h2 className="mt-1 font-serif text-xl font-bold text-white md:text-2xl">{title}</h2>
      <div className="mt-2 h-px w-16 bg-gradient-to-r from-[#d4af37] to-transparent" />
      <p className="mt-2 text-xs text-white/50">{subtitle}</p>
    </div>
  );
}

function GaugeBar({
  label,
  current,
  target,
  accent,
}: {
  label: string;
  current: number;
  target: number;
  accent: string;
}) {
  const pct = Math.min(100, Math.round((current / Math.max(target, 1)) * 100));
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold text-white/85">{label}</span>
        <span className="font-mono text-xs text-white/55">
          {current}/{target} · {pct}%
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-black/40">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: accent }} />
      </div>
    </div>
  );
}

/** 반원 타코미터 (SVG) */
function ResponseTacho({
  hours,
  target,
  label,
  accent,
}: {
  hours: number;
  target: number;
  label: string;
  accent: string;
}) {
  const pct = Math.min(1, hours / target);
  const angle = -180 + pct * 180;
  const r = 54;
  const cx = 70;
  const cy = 68;
  const rad = (angle * Math.PI) / 180;
  const nx = cx + r * Math.cos(rad);
  const ny = cy + r * Math.sin(rad);
  const status =
    hours <= target * 0.5 ? "양호" : hours <= target ? "보통" : "지연";
  const statusColor =
    hours <= target * 0.5 ? ACCENT.green : hours <= target ? ACCENT.gold : "#f87171";

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 140 84" className="h-28 w-40">
        <path
          d="M 16 68 A 54 54 0 0 1 124 68"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 16 68 A 54 54 0 0 1 124 68"
          fill="none"
          stroke={accent}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${pct * 170} 170`}
          opacity={0.9}
        />
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={accent} strokeWidth="2.5" />
        <circle cx={cx} cy={cy} r="4" fill={accent} />
      </svg>
      <p className="font-mono text-2xl font-extrabold text-white">
        {hours.toFixed(1)}
        <span className="ml-1 text-sm font-medium text-white/45">시간</span>
      </p>
      <p className="mt-0.5 text-xs text-white/55">{label}</p>
      <span
        className="mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
        style={{ color: statusColor, background: `${statusColor}22` }}
      >
        {status} · 목표 {target}h
      </span>
    </div>
  );
}

function FunnelVisual() {
  return (
    <div className="flex flex-col items-center gap-2 py-2">
      {SAMPLE_FUNNEL.map((row, i) => {
        const widthPct = 100 - i * 18;
        const drop =
          i === 0
            ? null
            : Math.round((1 - row.value / SAMPLE_FUNNEL[i - 1].value) * 100);
        return (
          <div key={row.stage} className="w-full max-w-md">
            <div
              className="mx-auto flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-white"
              style={{
                width: `${widthPct}%`,
                background: `linear-gradient(90deg, ${row.fill}cc, ${row.fill}55)`,
                border: `1px solid ${row.fill}66`,
                boxShadow: `0 0 20px ${row.fill}33`,
              }}
            >
              <span>{row.stage}</span>
              <span className="font-mono">{row.value.toLocaleString()}</span>
            </div>
            {drop != null ? (
              <p className="mt-1 text-center text-[11px] text-amber-300/80">이탈 {drop}%</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

const tipStyle = {
  background: "#0f121c",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  fontSize: 12,
};

export function AdminVisualDashboardSample() {
  const inv = SAMPLE_INVENTORY;
  const pieData = [
    { name: "중개 매물", value: inv.propertyTotal, fill: ACCENT.blue },
    { name: "경매 물건", value: inv.auctionTotal, fill: ACCENT.gold },
  ];

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      {/* Hero-like aurora background */}
      <div className="hr-aurora-layer hr-aurora-violet pointer-events-none absolute inset-0" aria-hidden>
        <div className="hr3-glow absolute inset-0" />
      </div>
      <div
        className="pointer-events-none absolute -left-32 top-20 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(212,80,255,0.35), transparent 70%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-40 h-[380px] w-[380px] rounded-full opacity-35 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(77,171,255,0.4), transparent 70%)" }}
        aria-hidden
      />
      <div className="hr3-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />

      <div className="relative z-10 mx-auto max-w-[1400px] space-y-12 px-4 py-8 md:px-8 md:py-12">
        <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
              Chance Admin Insight
            </p>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
              운영 시각 대시보드
            </h1>
            <div className="mt-2 h-px w-24 bg-gradient-to-r from-[#d4af37] via-[#d4af37]/50 to-transparent" />
            <p className="mt-2 text-sm text-white/50">
              목업 · 샘플 데이터 · 라이브는{" "}
              <a href="/admin" className="text-[#4dabff] underline-offset-2 hover:underline">
                /admin
              </a>
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-xs text-white/70 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            목업 모드
          </div>
        </header>

        {/* Zone 1 */}
        <section>
          <ZoneTitle step="Zone 1" title="실시간 긴급 알림 & 독촉" subtitle="출근 후 3초 안에 처리할 일" />
          <div className="grid gap-4 md:grid-cols-3">
            <AccentCard
              accentRgb={SAMPLE_ACTION.legalOver24h > 0 ? "248, 113, 113" : ACCENT.greenRgb}
              accentHex={SAMPLE_ACTION.legalOver24h > 0 ? "#f87171" : ACCENT.green}
              className="relative"
            >
              {SAMPLE_ACTION.legalOver24h > 0 ? (
                <span className="absolute right-4 top-4 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                </span>
              ) : null}
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#fca5a5" }}>
                <CircleHelp className="h-4 w-4" />
                찬스상담 답변 대기
              </div>
              <p className="mt-3 font-mono text-4xl font-extrabold text-white">
                {SAMPLE_ACTION.legalPending}
                <span className="ml-1 text-base font-medium text-white/45">건</span>
              </p>
              <p className="mt-2 text-xs text-red-200/80">
                24시간 초과 <strong>{SAMPLE_ACTION.legalOver24h}</strong>건 · 즉시 답변 권장
              </p>
            </AccentCard>

            <AccentCard accentRgb={ACCENT.goldRgb} accentHex={ACCENT.gold}>
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: ACCENT.gold }}>
                <CalendarClock className="h-4 w-4" />
                신규·미처리 상담 예약
              </div>
              <p className="mt-3 font-mono text-4xl font-extrabold text-white">
                {SAMPLE_ACTION.consultPending}
                <span className="ml-1 text-base font-medium text-white/45">건</span>
              </p>
              <ul className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
                {SAMPLE_ACTION.consultTodayTomorrow.map((row) => (
                  <li
                    key={`${row.time}-${row.name}`}
                    className="flex items-center justify-between text-xs text-white/70"
                  >
                    <span className="font-mono" style={{ color: ACCENT.gold }}>
                      {row.time}
                    </span>
                    <span>
                      {row.name} · {row.category}
                    </span>
                  </li>
                ))}
              </ul>
            </AccentCard>

            <AccentCard accentRgb={ACCENT.blueRgb} accentHex={ACCENT.blue}>
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: ACCENT.blue }}>
                <Bell className="h-4 w-4" />
                미승인 맞춤알림
              </div>
              <p className="mt-3 font-mono text-4xl font-extrabold text-white">
                {SAMPLE_ACTION.subscriberPending}
                <span className="ml-1 text-base font-medium text-white/45">명</span>
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-sky-200/80">
                <AlertTriangle className="h-3.5 w-3.5" />
                승인 대기 중인 신규 신청자
              </p>
            </AccentCard>
          </div>
        </section>

        {/* Zone 2 */}
        <section>
          <ZoneTitle step="Zone 2" title="매물 & 경매 머니 맵" subtitle="조회·클릭이 몰리는 물건 (샘플)" />
          <div className="grid gap-4 lg:grid-cols-12">
            <AccentCard accentRgb={ACCENT.violetRgb} accentHex={ACCENT.violet} className="lg:col-span-4">
              <h3 className="mb-3 text-sm font-bold" style={{ color: ACCENT.violet }}>
                등록 비중 · 월 목표
              </h3>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={46} outerRadius={70} paddingAngle={3}>
                      {pieData.map((d) => (
                        <Cell key={d.name} fill={d.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-3">
                <GaugeBar
                  label="이번 달 중개 등록"
                  current={inv.propertyMonth}
                  target={inv.propertyTarget}
                  accent={`linear-gradient(90deg, ${ACCENT.blue}, ${ACCENT.violet})`}
                />
                <GaugeBar
                  label="이번 달 경매 등록"
                  current={inv.auctionMonth}
                  target={inv.auctionTarget}
                  accent={`linear-gradient(90deg, ${ACCENT.gold}, #fbbf24)`}
                />
              </div>
            </AccentCard>

            <AccentCard accentRgb={ACCENT.blueRgb} accentHex={ACCENT.blue} className="lg:col-span-4">
              <h3 className="mb-1 flex items-center gap-2 text-sm font-bold" style={{ color: ACCENT.blue }}>
                <Flame className="h-4 w-4" />
                중개 매물 TOP 5 (클릭)
              </h3>
              <div className="mt-2 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SAMPLE_TOP_PROPERTIES} layout="vertical" margin={{ left: 4, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fill: "#cbd5e1", fontSize: 10 }} />
                    <Tooltip contentStyle={tipStyle} />
                    <Bar dataKey="views" name="조회" fill={ACCENT.blue} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </AccentCard>

            <AccentCard accentRgb={ACCENT.goldRgb} accentHex={ACCENT.gold} className="lg:col-span-4">
              <h3 className="mb-1 flex items-center gap-2 text-sm font-bold" style={{ color: ACCENT.gold }}>
                <TrendingUp className="h-4 w-4" />
                경매 관심도 랭킹
              </h3>
              <ul className="mt-3 space-y-2">
                {SAMPLE_TOP_AUCTIONS.map((row, i) => {
                  const w = Math.round((row.clicks / SAMPLE_TOP_AUCTIONS[0].clicks) * 100);
                  return (
                    <li key={row.name} className="rounded-xl border border-white/10 bg-black/25 p-2.5">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="font-bold text-white/90">
                          <span className="mr-1 font-mono text-amber-300">#{i + 1}</span>
                          {row.name}
                        </span>
                        <span className="font-mono text-white/50">{row.clicks}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${w}%`,
                            background: `linear-gradient(90deg, ${ACCENT.gold}, #fbbf24)`,
                          }}
                        />
                      </div>
                      <p className="mt-1 text-[10px] text-white/40">알림 매칭 {row.alertMatches}건</p>
                    </li>
                  );
                })}
              </ul>
            </AccentCard>
          </div>
        </section>

        {/* Zone 3 */}
        <section>
          <ZoneTitle step="Zone 3" title="고객 여정 & 관심도" subtitle="메뉴 점유율 · 전환 깔때기" />
          <div className="grid gap-4 lg:grid-cols-2">
            <AccentCard accentRgb="249, 115, 22" accentHex={ACCENT.orange}>
              <h3 className="mb-3 text-sm font-bold text-orange-300">메뉴별 점유율</h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={SAMPLE_MENU_SHARE} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={2}>
                      {SAMPLE_MENU_SHARE.map((d) => (
                        <Cell key={d.name} fill={d.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tipStyle} formatter={(v) => [`${v}%`, "점유"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </AccentCard>
            <AccentCard accentRgb={ACCENT.violetRgb} accentHex={ACCENT.violet}>
              <h3 className="mb-3 text-sm font-bold" style={{ color: ACCENT.violet }}>
                고객 유입 깔때기
              </h3>
              <FunnelVisual />
            </AccentCard>
          </div>
        </section>

        {/* Zone 4 */}
        <section>
          <ZoneTitle
            step="Zone 4"
            title="매출 증대 & 성과 지표"
            subtitle="상담 추이 · 성공스토리 등록 효과"
          />
          <AccentCard accentRgb={ACCENT.blueRgb} accentHex={ACCENT.blue}>
            <div className="mb-3 flex flex-wrap gap-4 text-[11px] text-white/50">
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-4" style={{ background: ACCENT.blue }} /> 상담 예약
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-4" style={{ background: ACCENT.orange }} /> 방문자
              </span>
              <span className="text-amber-200/70">
                {SAMPLE_STORY_MARKERS.map((m) => `${m.month} ${m.label}`).join(" · ")}
              </span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={SAMPLE_MONTHLY}>
                  <defs>
                    <linearGradient id="consultFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={ACCENT.blue} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={ACCENT.blue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={tipStyle} />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="consults"
                    name="상담 예약"
                    stroke={ACCENT.blue}
                    fill="url(#consultFill)"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="visitors"
                    name="방문자"
                    stroke={ACCENT.orange}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: ACCENT.orange }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </AccentCard>
        </section>

        {/* Zone 5 — High intent */}
        <section>
          <ZoneTitle
            step="Zone 5 · Sales"
            title="고의도 고객 행동"
            subtitle="30초+ 체류 · 공유/복사/인쇄 액션 (샘플)"
          />
          <div className="grid gap-4 lg:grid-cols-12">
            <AccentCard accentRgb={ACCENT.greenRgb} accentHex={ACCENT.green} className="lg:col-span-3">
              <h3 className="mb-3 text-sm font-bold" style={{ color: ACCENT.green }}>
                고객 액션 발생 현황
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Share2, label: "공유", value: SAMPLE_CUSTOMER_ACTIONS.share },
                  { icon: Copy, label: "링크 복사", value: SAMPLE_CUSTOMER_ACTIONS.copyLink },
                  { icon: Printer, label: "프린트", value: SAMPLE_CUSTOMER_ACTIONS.print },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-3"
                  >
                    <span className="flex items-center gap-2 text-sm text-white/80">
                      <row.icon className="h-4 w-4" style={{ color: ACCENT.green }} />
                      {row.label}
                    </span>
                    <span className="font-mono text-xl font-extrabold text-white">{row.value}</span>
                  </div>
                ))}
              </div>
            </AccentCard>

            <AccentCard accentRgb={ACCENT.blueRgb} accentHex={ACCENT.blue} className="lg:col-span-5">
              <h3 className="mb-1 text-sm font-bold" style={{ color: ACCENT.blue }}>
                진성 관심 매물 TOP 5
              </h3>
              <p className="mb-2 text-[11px] text-white/40">상세 체류 30초 이상 세션 기준</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SAMPLE_DWELL_TOP} layout="vertical" margin={{ left: 4, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" width={120} tick={{ fill: "#cbd5e1", fontSize: 9 }} />
                    <Tooltip contentStyle={tipStyle} />
                    <Bar dataKey="dwellSec" name="평균 체류(초)" fill={ACCENT.green} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </AccentCard>

            <AccentCard accentRgb={ACCENT.violetRgb} accentHex={ACCENT.violet} className="lg:col-span-4">
              <h3 className="mb-2 text-sm font-bold" style={{ color: ACCENT.violet }}>
                진성 관심 추이 (주간)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SAMPLE_DWELL_TREND}>
                    <defs>
                      <linearGradient id="deepFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={ACCENT.violet} stopOpacity={0.5} />
                        <stop offset="100%" stopColor={ACCENT.violet} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="clickFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={ACCENT.blue} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={ACCENT.blue} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <Tooltip contentStyle={tipStyle} />
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      name="클릭"
                      stroke={ACCENT.blue}
                      fill="url(#clickFill)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="deepViews"
                      name="30초+ 체류"
                      stroke={ACCENT.violet}
                      fill="url(#deepFill)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </AccentCard>
          </div>
        </section>

        {/* Zone 6 — Supply gap */}
        <section>
          <ZoneTitle
            step="Zone 6 · Sales"
            title="매물 공급·수요 밸런스"
            subtitle="이번 주 매물 확보 집중 타겟 상권"
          />
          <div className="grid gap-4 lg:grid-cols-12">
            <AccentCard accentRgb={ACCENT.goldRgb} accentHex={ACCENT.gold} className="lg:col-span-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold" style={{ color: ACCENT.gold }}>
                <Search className="h-4 w-4" />
                인기 검색 키워드
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SAMPLE_SEARCH_KEYWORDS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="keyword" tick={{ fill: "#cbd5e1", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <Tooltip contentStyle={tipStyle} />
                    <Bar dataKey="count" name="검색" fill={ACCENT.gold} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </AccentCard>

            <AccentCard accentRgb="248, 113, 113" accentHex="#f87171" className="lg:col-span-7">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-red-300">
                <Target className="h-4 w-4" />
                수요 대비 공급 부족 · 확보 타겟
              </h3>
              <ul className="space-y-2.5">
                {SAMPLE_SUPPLY_GAP.map((row, i) => (
                  <li
                    key={row.region}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2.5"
                  >
                    <span className="font-mono text-xs text-red-300">#{i + 1}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{row.region}</p>
                      <p className="text-[11px] text-white/45">
                        검색 {row.searches} · 등록 {row.supply}건
                      </p>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-red-400 to-amber-400"
                          style={{ width: `${Math.min(100, row.gap)}%` }}
                        />
                      </div>
                    </div>
                    <span className="rounded-full border border-red-400/40 bg-red-500/15 px-2.5 py-1 text-[11px] font-bold text-red-200">
                      갭 {row.gap}
                    </span>
                  </li>
                ))}
              </ul>
            </AccentCard>
          </div>
        </section>

        {/* Zone 7 — Attribution + response */}
        <section>
          <ZoneTitle
            step="Zone 7 · Sales"
            title="마케팅 유입 & 대응 효율"
            subtitle="채널별 전환 · 평균 답변 소요시간"
          />
          <div className="grid gap-4 lg:grid-cols-12">
            <AccentCard accentRgb={ACCENT.violetRgb} accentHex={ACCENT.violet} className="lg:col-span-7">
              <h3 className="mb-1 flex items-center gap-2 text-sm font-bold" style={{ color: ACCENT.violet }}>
                <Link2 className="h-4 w-4" />
                마케팅 채널별 방문 · 예약 전환율
              </h3>
              <p className="mb-2 text-[11px] text-white/40">?ref=youtube · blog · direct 샘플</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SAMPLE_ATTRIBUTION}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="channel" tick={{ fill: "#cbd5e1", fontSize: 11 }} />
                    <YAxis yAxisId="v" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <YAxis yAxisId="r" orientation="right" tick={{ fill: "#94a3b8", fontSize: 11 }} unit="%" />
                    <Tooltip contentStyle={tipStyle} />
                    <Bar yAxisId="v" dataKey="visits" name="방문" fill={ACCENT.violet} radius={[6, 6, 0, 0]} opacity={0.85} />
                    <Bar yAxisId="r" dataKey="rate" name="전환율%" fill={ACCENT.green} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </AccentCard>

            <AccentCard accentRgb={ACCENT.greenRgb} accentHex={ACCENT.green} className="lg:col-span-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold" style={{ color: ACCENT.green }}>
                <Clock3 className="h-4 w-4" />
                평균 고객 문의 답변 소요
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <ResponseTacho
                  hours={SAMPLE_RESPONSE_HOURS.legalAvgHours}
                  target={SAMPLE_RESPONSE_HOURS.targetHours}
                  label="찬스상담소"
                  accent={ACCENT.green}
                />
                <ResponseTacho
                  hours={SAMPLE_RESPONSE_HOURS.consultAvgHours}
                  target={SAMPLE_RESPONSE_HOURS.targetHours}
                  label="상담 예약"
                  accent={ACCENT.blue}
                />
              </div>
            </AccentCard>
          </div>
        </section>
      </div>
    </div>
  );
}
