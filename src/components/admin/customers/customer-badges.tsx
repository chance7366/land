import {
  PIPELINE_LABELS,
  PURPOSE_LABELS,
  URGENCY_LABELS,
} from "@/lib/customers/types";

export function Badge({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "blue" | "gold" | "green" | "red" | "violet" | "orange";
}) {
  const tones: Record<string, string> = {
    slate: "border-white/15 bg-white/10 text-white/80",
    blue: "border-sky-400/35 bg-sky-500/15 text-sky-200",
    gold: "border-amber-400/35 bg-amber-500/15 text-amber-100",
    green: "border-emerald-400/35 bg-emerald-500/15 text-emerald-200",
    red: "border-red-400/40 bg-red-500/15 text-red-200",
    violet: "border-violet-400/35 bg-violet-500/15 text-violet-200",
    orange: "border-orange-400/35 bg-orange-500/15 text-orange-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function CustomerTendencyBadges({
  budgetRange,
  moveUrgency,
  purpose,
  pipelineStage,
}: {
  budgetRange?: string | null;
  moveUrgency?: string;
  purpose?: string;
  pipelineStage?: string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {budgetRange ? <Badge tone="blue">가용자금: {budgetRange}</Badge> : null}
      {moveUrgency ? (
        <Badge tone={moveUrgency === "high" ? "red" : moveUrgency === "mid" ? "gold" : "slate"}>
          긴급도: {URGENCY_LABELS[moveUrgency] ?? moveUrgency}
        </Badge>
      ) : null}
      {purpose ? (
        <Badge tone={purpose === "invest" ? "violet" : "green"}>
          {PURPOSE_LABELS[purpose] ?? purpose}
        </Badge>
      ) : null}
      {pipelineStage ? (
        <Badge tone="orange">{PIPELINE_LABELS[pipelineStage] ?? pipelineStage}</Badge>
      ) : null}
    </div>
  );
}
