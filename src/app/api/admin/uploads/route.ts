import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getUploadDir, uploadUrlPrefix, type UploadKind } from "@/lib/uploads";

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
      return NextResponse.json({ error: "한 번에 최대 5장까지 업로드할 수 있습니다." }, { status: 400 });
    }

    const uploadDir = getUploadDir(kind);
    await mkdir(uploadDir, { recursive: true });

    const urls: string[] = [];
    const prefix = uploadUrlPrefix(kind);

    for (const file of files) {
      if (!ALLOWED.has(file.type)) {
        return NextResponse.json(
          { error: "JPG, PNG, WEBP, GIF 또는 PDF만 업로드할 수 있습니다." },
          { status: 400 },
        );
      }
      if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: "각 파일은 12MB 이하여야 합니다." }, { status: 400 });
      }

      const ext = EXT_BY_TYPE[file.type] ?? "jpg";
      const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(uploadDir, filename), buffer);
      urls.push(`${prefix}/${filename}`);
    }

    return NextResponse.json({ urls }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "사진 업로드 중 오류가 발생했습니다." }, { status: 500 });
  }
}
