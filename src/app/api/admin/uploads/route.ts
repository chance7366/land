import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getUploadDir, uploadUrlPrefix, type UploadKind } from "@/lib/uploads";
import { isSupabaseEnabled, PROPERTY_IMAGES_BUCKET } from "@/lib/supabase/config";
import { uploadPropertyImage } from "@/lib/supabase/storage";

const MAX_FILES = 8;
const MAX_BYTES = 12 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);
const KINDS = new Set<UploadKind>(["properties", "auctions"]);

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
};

const TYPE_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
};

function resolveMime(file: File): string {
  const raw = (file.type || "").trim().toLowerCase();
  if (ALLOWED.has(raw)) return raw;
  const ext = path.extname(file.name || "").toLowerCase();
  return TYPE_BY_EXT[ext] || raw;
}

async function saveLocal(kind: UploadKind, filename: string, buffer: Buffer): Promise<string> {
  await mkdir(getUploadDir(kind), { recursive: true });
  await writeFile(path.join(getUploadDir(kind), filename), buffer);
  return `${uploadUrlPrefix(kind)}/${filename}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const kindRaw = String(formData.get("kind") || "properties");
    const kind: UploadKind = KINDS.has(kindRaw as UploadKind) ? (kindRaw as UploadKind) : "properties";

    const files = formData
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (files.length === 0) {
      return NextResponse.json({ error: "업로드할 파일이 없습니다." }, { status: 400 });
    }
    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: "한 번에 최대 8개까지 업로드할 수 있습니다." }, { status: 400 });
    }

    const urls: string[] = [];
    let storage: string = "local";
    const useSupabase = isSupabaseEnabled();

    for (const file of files) {
      const mime = resolveMime(file);
      if (!ALLOWED.has(mime)) {
        return NextResponse.json(
          { error: "JPG, PNG, WEBP, GIF 또는 PDF만 업로드할 수 있습니다." },
          { status: 400 },
        );
      }
      if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: "각 파일은 12MB 이하여야 합니다." }, { status: 400 });
      }

      const ext = EXT_BY_TYPE[mime] ?? "bin";
      const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      if (useSupabase) {
        try {
          const storagePath = `${kind}/${filename}`;
          const publicUrl = await uploadPropertyImage(storagePath, buffer, mime);
          urls.push(publicUrl);
          storage = PROPERTY_IMAGES_BUCKET;
          continue;
        } catch (e) {
          // property-images 버킷이 PDF MIME을 거부하는 경우가 많음 → 로컬 폴백
          console.warn(
            "[admin/uploads] Supabase 업로드 실패 → 로컬 폴백",
            mime,
            e instanceof Error ? e.message : e,
          );
        }
      }

      urls.push(await saveLocal(kind, filename, buffer));
      storage = storage === PROPERTY_IMAGES_BUCKET ? "mixed" : "local";
    }

    return NextResponse.json({ urls, storage }, { status: 201 });
  } catch (e) {
    console.error("[admin/uploads]", e);
    return NextResponse.json(
      {
        error:
          e instanceof Error
            ? `업로드 중 오류: ${e.message}`
            : "파일 업로드 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
