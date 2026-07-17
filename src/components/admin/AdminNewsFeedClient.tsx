"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { AppLink as Link } from "@/components/ui/AppLink";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  HEALTH_STATUS_META,
  evaluateSourceHealth,
  formatRelativeKo,
  rowsByGroup,
  summarizeHealth,
  type AdminNewsHealthRow,
  type SourceHealthStatus,
} from "@/lib/admin-news-health";
import type { NewsFeedSourceId } from "@/lib/news-feed";

type CollectResponse = {
  ok?: boolean;
  created?: number;
  updated?: number;
  total?: number;
  error?: string;
  failedSources?: { source: string; error?: string }[];
  perSource?: Record<string, { ok: boolean; count: number; error?: string }>;
};

export function AdminNewsFeedClient({ initialRows }: { initialRows: AdminNewsHealthRow[] }) {
  const [rows, setRows] = useState<AdminNewsHealthRow[]>(initialRows);
  const [collectingAll, setCollectingAll] = useState(false);
  const [collectingSource, setCollectingSource] = useState<NewsFeedSourceId | null>(null);
  const [message, setMessage] = useState("");
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setTick((n) => n + 1), 60_000);
    return () => window.clearInterval(t);
  }, []);

  const summary = useMemo(() => summarizeHealth(rows), [rows]);
  const estate = useMemo(() => rowsByGroup(rows, "estate"), [rows]);
  const region = useMemo(() => rowsByGroup(rows, "region"), [rows]);

  async function refreshStatus(failureHints?: Record<string, string>) {
    const res = await fetch("/api/admin/news-feed/status");
    if (!res.ok) return;
    const data = (await res.json()) as { rows?: AdminNewsHealthRow[] };
    if (!data.rows) return;
    setRows(
      data.rows.map((row) => {
        const err = failureHints?.[row.source];
        if (!err) return { ...row, lastCollectFailed: false, lastError: undefined };
        return { ...row, lastCollectFailed: true, lastError: err };
      }),
    );
  }

  async function collect(sources?: NewsFeedSourceId[]) {
    const isAll = !sources?.length;
    if (isAll) setCollectingAll(true);
    else setCollectingSource(sources![0]);
    setMessage("");

    try {
      const res = await fetch("/api/admin/news-feed/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sources?.length ? { sources } : {}),
      });
      const data = (await res.json()) as CollectResponse;
      if (!res.ok && res.status >= 500) {
        setMessage(data.error ?? "수집 실패");
        return;
      }

      const failMap: Record<string, string> = {};
      for (const f of data.failedSources ?? []) {
        failMap[f.source] = f.error || "수집 실패";
      }
      if (data.perSource) {
        for (const [k, v] of Object.entries(data.perSource)) {
          if (!v.ok) failMap[k] = v.error || "수집 실패";
        }
      }

      const failHint = Object.keys(failMap).length
        ? ` · 실패 ${Object.keys(failMap).join(", ")}`
        : "";
      setMessage(
        `${data.ok ? "수집 완료" : "일부 출처 실패"} · 신규 ${data.created ?? 0} / 갱신 ${data.updated ?? 0} / 총 ${data.total ?? 0}${failHint}`,
      );
      await refreshStatus(failMap);
    } catch {
      setMessage("네트워크 오류");
    } finally {
      setCollectingAll(false);
      setCollectingSource(null);
    }
  }

  return (
    <main className="p-6 pb-16 font-[family-name:var(--font-unifine),Outfit,sans-serif] md:p-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-landing-text">부동산 소식 수집 모니터</h1>
          <p className="mt-2 max-w-2xl text-sm text-landing-muted">
            출처별 수집 상태만 확인합니다. 스케줄: 매일 08:00 · 14:00 · 20:00 (Windows 작업
            Chance-NewsFeed-Collect)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={collectingAll || collectingSource != null}
            onClick={() => void collect()}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#913dff]/20 disabled:opacity-50"
          >
            {collectingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            전체 지금 수집
          </button>
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5"
          >
            사용자 페이지
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <Link href="/admin" className="self-center text-sm text-blue-400 hover:underline">
            ← 대시보드
          </Link>
        </div>
      </div>

      {message ? (
        <p className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-emerald-200">
          {message}
        </p>
      ) : null}

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <SummaryCard status="ok" count={summary.ok} />
        <SummaryCard status="warn" count={summary.warn} />
        <SummaryCard status="fail" count={summary.fail} />
      </div>

      <GroupSection
        title="부동산소식"
        hint="사용자 사이드바 · 부동산소식 그룹"
        rows={estate}
        collectingSource={collectingSource}
        busy={collectingAll}
        onCollect={(source) => void collect([source])}
      />

      <GroupSection
        title="지역소식"
        hint="사용자 사이드바 · 지역소식 그룹"
        rows={region}
        collectingSource={collectingSource}
        busy={collectingAll}
        onCollect={(source) => void collect([source])}
        className="mt-8"
      />
    </main>
  );
}

function SummaryCard({ status, count }: { status: SourceHealthStatus; count: number }) {
  const meta = HEALTH_STATUS_META[status];
  const Icon = status === "ok" ? CheckCircle2 : status === "warn" ? AlertTriangle : XCircle;
  return (
    <GlassCard className={`p-4 ${meta.className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Icon className="h-4 w-4" />
          {meta.label}
        </div>
        <span className="text-2xl font-extrabold tabular-nums text-white">{count}</span>
      </div>
      <p className="mt-1 text-[11px] opacity-80">출처</p>
    </GlassCard>
  );
}

function GroupSection({
  title,
  hint,
  rows,
  collectingSource,
  busy,
  onCollect,
  className = "",
}: {
  title: string;
  hint: string;
  rows: AdminNewsHealthRow[];
  collectingSource: NewsFeedSourceId | null;
  busy: boolean;
  onCollect: (source: NewsFeedSourceId) => void;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mb-3">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="text-xs text-slate-500">{hint}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((row) => (
          <SourceCard
            key={row.source}
            row={row}
            collecting={collectingSource === row.source}
            disabled={busy || collectingSource != null}
            onCollect={() => onCollect(row.source)}
          />
        ))}
      </div>
    </section>
  );
}

function SourceCard({
  row,
  collecting,
  disabled,
  onCollect,
}: {
  row: AdminNewsHealthRow;
  collecting: boolean;
  disabled: boolean;
  onCollect: () => void;
}) {
  const status = evaluateSourceHealth(row);
  const meta = HEALTH_STATUS_META[status];

  return (
    <GlassCard className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-white">{row.label}</h3>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${meta.className}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>
          </div>
          <Link
            href={row.userPath}
            className="mt-1 inline-flex items-center gap-1 text-xs text-[#4dabff] hover:underline"
          >
            사용자 목록 보기
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={onCollect}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-[#4dabff]/40 hover:bg-white/10 disabled:opacity-40"
        >
          {collecting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          이 출처만 수집
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-[11px] text-slate-500">보관 건수</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-slate-100">
            {row.itemCount.toLocaleString("ko-KR")}건
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-slate-500">최근 수집</dt>
          <dd className="mt-0.5 font-semibold text-slate-100">
            {formatRelativeKo(row.lastFetchedAt)}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-slate-500">최근 기사일</dt>
          <dd className="mt-0.5 tabular-nums text-slate-300">{row.latestPubDate ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-slate-500">출처 키</dt>
          <dd className="mt-0.5 font-mono text-xs text-slate-400">{row.source}</dd>
        </div>
      </dl>

      {row.lastError && status === "fail" && (
        <p className="mt-3 rounded-lg border border-red-400/25 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {row.lastError}
        </p>
      )}
      {status === "warn" && row.itemCount === 0 && (
        <p className="mt-3 rounded-lg border border-amber-400/25 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
          보관 건수가 0입니다. 수집은 됐으나 신규 기사가 없거나 파서가 비어 있을 수 있습니다.
        </p>
      )}
    </GlassCard>
  );
}
