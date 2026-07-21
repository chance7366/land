import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getUploadDir, uploadUrlPrefix, type UploadKind } from "@/lib/uploads";
import { isSupabaseEnabled, PROPERTY_IMAGES_BUCKET } from "@/lib/supabase/config";
import { uploadPropertyImage } from "@/lib/supabase/storage";

const MAX_FILES = 20;
const MAX_BYTES = 20 * 1024 * 1024;
const KINDS = new Set<UploadKind>(["properties", "auctions"]);

/** 서류·입찰가산정 자료 공통 허용 MIME */
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "text/csv",
  "application/csv",
  "text/plain",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/x-hwp",
  "application/haansofthwp",
  "application/vnd.hancom.hwp",
  "application/vnd.hancom.hwpx",
  "application/hwp+zip",
  "application/octet-stream",
]);

const TYPE_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".csv": "text/csv",
  ".txt": "text/plain",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".hwp": "application/x-hwp",
  ".hwpx": "application/vnd.hancom.hwpx",
};

const ALLOWED_EXT = new Set(Object.keys(TYPE_BY_EXT));

function resolveMime(file: File): { mime: string; ext: string } | null {
  const ext = path.extname(file.name || "").toLowerCase();
  if (!ALLOWED_EXT.has(ext)) return null;
  const fromExt = TYPE_BY_EXT[ext];
  const raw = (file.type || "").trim().toLowerCase();
  // 브라우저가 octet-stream/빈 type을 주는 경우 확장자 MIME 사용
  if (!raw || raw === "application/octet-stream" || !ALLOWED.has(raw)) {
    return { mime: fromExt, ext: ext.slice(1) };
  }
  return { mime: fromExt || raw, ext: ext.slice(1) };
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
      return NextResponse.json(
        { error: `한 번에 최대 ${MAX_FILES}개까지 업로드할 수 있습니다.` },
        { status: 400 },
      );
    }

    const urls: string[] = [];
    let storage: string = "local";
    const useSupabase = isSupabaseEnabled();

    for (const file of files) {
      const resolved = resolveMime(file);
      if (!resolved) {
        return NextResponse.json(
          {
            error:
              "JPG, PNG, WEBP, GIF, PDF, TXT, CSV, Excel(xls/xlsx), Word(doc/docx), 한글(hwp/hwpx)만 업로드할 수 있습니다.",
          },
          { status: 400 },
        );
      }
      if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: "각 파일은 20MB 이하여야 합니다." }, { status: 400 });
      }

      const { mime, ext } = resolved;
      const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      // 이미지만 Supabase 시도 — 문서 MIME은 버킷 거부 가능성이 높아 로컬 우선
      const trySupabase = useSupabase && mime.startsWith("image/");
      if (trySupabase) {
        try {
          const storagePath = `${kind}/${filename}`;
          const publicUrl = await uploadPropertyImage(storagePath, buffer, mime);
          urls.push(publicUrl);
          storage = PROPERTY_IMAGES_BUCKET;
          continue;
        } catch (e) {
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
