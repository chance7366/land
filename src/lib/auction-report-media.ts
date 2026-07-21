import { readFile } from "fs/promises";
import path from "path";
import {
  AUCTION_DOC_SLOTS,
  parseAuctionAttachments,
  type AuctionAttachment,
  type AuctionDocType,
} from "@/lib/auction-attachments";
import { getUploadDir } from "@/lib/uploads";

export type ReportMediaPart = {
  type: AuctionDocType | "unknown";
  label: string;
  name: string;
  mimeType: string;
  base64: string;
  kind: "pdf" | "image";
};

const MAX_FILES = 6;
const MAX_BYTES = 12 * 1024 * 1024;

const MIME_BY_EXT: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

function slotLabel(type: string): string {
  return AUCTION_DOC_SLOTS.find((s) => s.type === type)?.label ?? type;
}

function extOf(nameOrUrl: string): string {
  const clean = nameOrUrl.split("?")[0] ?? nameOrUrl;
  return path.extname(clean).toLowerCase();
}

function mimeFromName(nameOrUrl: string, fallback?: string | null): string | null {
  const byExt = MIME_BY_EXT[extOf(nameOrUrl)];
  if (byExt) return byExt;
  if (fallback && /^(application\/pdf|image\/)/.test(fallback)) return fallback;
  return null;
}

function kindFromMime(mime: string): "pdf" | "image" | null {
  if (mime === "application/pdf") return "pdf";
  if (mime.startsWith("image/")) return "image";
  return null;
}

async function readLocalUpload(urlPath: string): Promise<Buffer | null> {
  // /uploads/auctions/foo.pdf  or  /uploads/properties/...
  const m = urlPath.match(/^\/uploads\/(auctions|properties)\/([^/?#]+)/);
  if (!m) return null;
  const kind = m[1] as "auctions" | "properties";
  const filename = decodeURIComponent(m[2]);
  try {
    return await readFile(path.join(getUploadDir(kind), filename));
  } catch {
    return null;
  }
}

async function fetchBytes(url: string): Promise<{ buffer: Buffer; contentType: string | null }> {
  const pathOnly = url.startsWith("http") ? new URL(url).pathname : url.split("?")[0] ?? url;
  if (pathOnly.startsWith("/uploads/")) {
    const local = await readLocalUpload(pathOnly);
    if (local) {
      return { buffer: local, contentType: mimeFromName(pathOnly) };
    }
  }

  const absolute =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `${process.env.APP_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000"}${
          url.startsWith("/") ? url : `/${url}`
        }`;

  const res = await fetch(absolute, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`첨부 다운로드 실패 (${res.status}): ${url}`);
  }
  const ab = await res.arrayBuffer();
  return {
    buffer: Buffer.from(ab),
    contentType: res.headers.get("content-type"),
  };
}

export function attachmentsFromAuction(auction: {
  attachments?: string | null;
}): AuctionAttachment[] {
  return parseAuctionAttachments(auction.attachments ?? "[]");
}

/** 서류 슬롯 PDF/이미지를 Gemini 멀티모달용으로 로드 */
export async function loadReportMediaParts(
  attachments: AuctionAttachment[],
): Promise<{ parts: ReportMediaPart[]; skipped: string[] }> {
  const parts: ReportMediaPart[] = [];
  const skipped: string[] = [];

  for (const att of attachments) {
    if (parts.length >= MAX_FILES) {
      skipped.push(`${att.name || att.url} (최대 ${MAX_FILES}개)`);
      continue;
    }
    if (!att.url?.trim()) continue;

    try {
      const { buffer, contentType } = await fetchBytes(att.url.trim());
      if (buffer.length > MAX_BYTES) {
        skipped.push(`${att.name || att.url} (12MB 초과)`);
        continue;
      }
      const mime = mimeFromName(att.name || att.url, contentType);
      if (!mime) {
        skipped.push(`${att.name || att.url} (지원 형식 아님)`);
        continue;
      }
      const kind = kindFromMime(mime);
      if (!kind) {
        skipped.push(`${att.name || att.url} (PDF/이미지만 지원)`);
        continue;
      }
      parts.push({
        type: att.type,
        label: slotLabel(att.type),
        name: att.name || path.basename(att.url.split("?")[0] || "file"),
        mimeType: mime,
        base64: buffer.toString("base64"),
        kind,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "로드 실패";
      skipped.push(`${att.name || att.url} (${msg})`);
    }
  }

  return { parts, skipped };
}
