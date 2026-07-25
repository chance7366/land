import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import {
  contentTypeForFilename,
  getLegacyUploadDir,
  getUploadDir,
  isSafeUploadFilename,
} from "@/lib/uploads";
import { isSupabaseEnabled, PROPERTY_IMAGES_BUCKET } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** report-{uuid}.pdf | report-{uuid}-general.pdf → storage stem */
function storageStemFromUploadFilename(filename: string): string | null {
  const m = filename.match(/^report-(.+)\.pdf$/i);
  return m?.[1] ?? null;
}

async function readLocalUpload(filename: string): Promise<Buffer | null> {
  const dirs = [getUploadDir("auctions"), getLegacyUploadDir("auctions")];
  for (const dir of dirs) {
    try {
      return await readFile(path.join(dir, filename));
    } catch {
      // try next
    }
  }
  return null;
}

async function readStorageReport(filename: string): Promise<Buffer | null> {
  if (!isSupabaseEnabled()) return null;
  const stem = storageStemFromUploadFilename(filename);
  if (!stem) return null;
  try {
    const sb = createSupabaseAdminClient();
    const { data, error } = await sb.storage
      .from(PROPERTY_IMAGES_BUCKET)
      .download(`auctions/reports/${stem}.pdf`);
    if (error || !data) return null;
    return Buffer.from(await data.arrayBuffer());
  } catch {
    return null;
  }
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ filename: string }> },
) {
  const { filename } = await context.params;
  if (!isSafeUploadFilename(filename)) {
    return NextResponse.json({ error: "잘못된 파일명입니다." }, { status: 400 });
  }

  const data = (await readLocalUpload(filename)) ?? (await readStorageReport(filename));
  if (!data) {
    return NextResponse.json({ error: "파일을 찾을 수 없습니다." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(data), {
    status: 200,
    headers: {
      "Content-Type": contentTypeForFilename(filename),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
