import { appendFile, mkdir, readFile } from "fs/promises";
import path from "path";
import type { AuctionReportModelId } from "@/lib/auction-report-models";
import {
  type GeminiUsageRecord,
} from "@/lib/gemini-usage-shared";

export {
  GEMINI_PRICE_USD_PER_1M,
  buildUsageRecord,
  estimateGeminiCostUsd,
  formatUsd,
  type GeminiUsageRecord,
} from "@/lib/gemini-usage-shared";

export type GeminiUsageSummary = {
  date: string;
  calls: number;
  inputTokens: number;
  outputTokens: number;
  totalCostUsd: number;
  byModel: Partial<
    Record<
      AuctionReportModelId,
      { calls: number; inputTokens: number; outputTokens: number; totalCostUsd: number }
    >
  >;
};

function usageLogPath() {
  return path.join(process.cwd(), "storage", "logs", "gemini-usage.jsonl");
}

export async function appendGeminiUsage(record: GeminiUsageRecord): Promise<void> {
  const file = usageLogPath();
  await mkdir(path.dirname(file), { recursive: true });
  await appendFile(file, `${JSON.stringify(record)}\n`, "utf8");
}

function todayKeySeoul(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function recordDateKeySeoul(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

export async function readGeminiUsageRecords(): Promise<GeminiUsageRecord[]> {
  try {
    const raw = await readFile(usageLogPath(), "utf8");
    const out: GeminiUsageRecord[] = [];
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t) continue;
      try {
        out.push(JSON.parse(t) as GeminiUsageRecord);
      } catch {
        /* skip bad line */
      }
    }
    return out;
  } catch {
    return [];
  }
}

export async function getGeminiUsageSummaryForToday(): Promise<GeminiUsageSummary> {
  const date = todayKeySeoul();
  const records = (await readGeminiUsageRecords()).filter((r) => recordDateKeySeoul(r.at) === date);
  const summary: GeminiUsageSummary = {
    date,
    calls: records.length,
    inputTokens: 0,
    outputTokens: 0,
    totalCostUsd: 0,
    byModel: {},
  };
  for (const r of records) {
    summary.inputTokens += r.inputTokens;
    summary.outputTokens += r.outputTokens;
    summary.totalCostUsd += r.totalCostUsd;
    const slot = summary.byModel[r.model] ?? {
      calls: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalCostUsd: 0,
    };
    slot.calls += 1;
    slot.inputTokens += r.inputTokens;
    slot.outputTokens += r.outputTokens;
    slot.totalCostUsd += r.totalCostUsd;
    summary.byModel[r.model] = slot;
  }
  return summary;
}
