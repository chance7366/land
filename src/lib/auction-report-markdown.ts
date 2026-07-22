import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { AuctionReportKind } from "@/lib/auction-report-models";
import { isSupabaseEnabled, PROPERTY_IMAGES_BUCKET } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { uploadPropertyImage } from "@/lib/supabase/storage";
import { getUploadDir } from "@/lib/uploads";

export function reportFileStem(auctionId: string, kind: AuctionReportKind): string {
  return kind === "general" ? `${auctionId}-general` : auctionId;
}

function storageMdPath(stem: string): string {
  return `auctions/reports/${stem}.md`;
}

function localMdFilename(stem: string): string {
  return `report-${stem}.md`;
}

/** PDF와 함께 마크다운 본문 저장 (블로그용 복사) */
export async function saveReportMarkdown(
  auctionId: string,
  markdown: string,
  kind: AuctionReportKind,
): Promise<void> {
  const stem = reportFileStem(auctionId, kind);
  const body = Buffer.from(markdown, "utf8");

  if (isSupabaseEnabled()) {
    try {
      await uploadPropertyImage(storageMdPath(stem), body, "text/markdown; charset=utf-8");
      return;
    } catch (e) {
      console.warn(
        "[report-markdown] Supabase 업로드 실패 → 로컬 저장 폴백",
        e,
      );
    }
  }

  const dir = path.join(getUploadDir("auctions"));
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, localMdFilename(stem)), body);
}

/** 저장된 리포트 마크다운 로드. 없으면 null */
export async function loadReportMarkdown(
  auctionId: string,
  kind: AuctionReportKind,
): Promise<string | null> {
  const stem = reportFileStem(auctionId, kind);

  if (isSupabaseEnabled()) {
    try {
      const sb = createSupabaseAdminClient();
      const { data, error } = await sb.storage
        .from(PROPERTY_IMAGES_BUCKET)
        .download(storageMdPath(stem));
      if (!error && data) {
        const text = (await data.text()).trim();
        if (text) return text;
      }
    } catch (e) {
      console.warn("[report-markdown] Supabase 다운로드 실패", e);
    }
  }

  try {
    const filePath = path.join(getUploadDir("auctions"), localMdFilename(stem));
    const text = (await readFile(filePath, "utf8")).trim();
    return text || null;
  } catch {
    return null;
  }
}
