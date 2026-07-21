import { readFile } from "fs/promises";
import path from "path";
import {
  biddingValuationAttachments,
  courtDocAttachments,
  labelForAttachmentType,
  parseAuctionAttachments,
  type AuctionAttachment,
  type AuctionAttachmentType,
} from "@/lib/auction-attachments";
import { getUploadDir } from "@/lib/uploads";

export type ReportMediaPart = {
  type: AuctionAttachmentType | "unknown";
  label: string;
  name: string;
  mimeType: string;
  base64: string;
  kind: "pdf" | "image" | "text";
  /** kind=text 일 때 UTF-8 본문 */
  textContent?: string;
};

/** 법원 서류 + 적정가치평가 첨부 합산 상한 */
const MAX_FILES = 18;
const MAX_BYTES = 12 * 1024 * 1024;
const MAX_TEXT_CHARS = 80_000;

const MIME_BY_EXT: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".txt": "text/plain",
  ".csv": "text/csv",
};

function extOf(nameOrUrl: string): string {
  const clean = nameOrUrl.split("?")[0] ?? nameOrUrl;
  return path.extname(clean).toLowerCase();
}

function mimeFromName(nameOrUrl: string, fallback?: string | null): string | null {
  const byExt = MIME_BY_EXT[extOf(nameOrUrl)];
  if (byExt) return byExt;
  if (fallback && /^(application\/pdf|image\/|text\/(plain|csv))/i.test(fallback)) {
    return fallback.split(";")[0]!.trim().toLowerCase();
  }
  return null;
}

function kindFromMime(mime: string): "pdf" | "image" | "text" | null {
  if (mime === "application/pdf") return "pdf";
  if (mime.startsWith("image/")) return "image";
  if (mime === "text/plain" || mime === "text/csv") return "text";
  return null;
}

async function readLocalUpload(urlPath: string): Promise<Buffer | null> {
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

function decodeTextBuffer(buffer: Buffer): string {
  let text = buffer.toString("utf8");
  // UTF-8 BOM
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  if (text.length > MAX_TEXT_CHARS) {
    return `${text.slice(0, MAX_TEXT_CHARS)}\n\n…(이하 생략, 원문 ${text.length.toLocaleString("ko-KR")}자)`;
  }
  return text;
}

export function attachmentsFromAuction(auction: {
  attachments?: string | null;
}): AuctionAttachment[] {
  return parseAuctionAttachments(auction.attachments ?? "[]");
}

async function loadOneAttachment(
  att: AuctionAttachment,
  parts: ReportMediaPart[],
  skipped: string[],
): Promise<void> {
  if (parts.length >= MAX_FILES) {
    skipped.push(`${att.name || att.url} (최대 ${MAX_FILES}개)`);
    return;
  }
  if (!att.url?.trim()) return;

  try {
    const { buffer, contentType } = await fetchBytes(att.url.trim());
    if (buffer.length > MAX_BYTES) {
      skipped.push(`${att.name || att.url} (12MB 초과)`);
      return;
    }
    const mime = mimeFromName(att.name || att.url, contentType);
    if (!mime) {
      skipped.push(`${att.name || att.url} (지원 형식 아님 · PDF/이미지/TXT/CSV만)`);
      return;
    }
    const kind = kindFromMime(mime);
    if (!kind) {
      skipped.push(`${att.name || att.url} (PDF/이미지/TXT/CSV만 지원)`);
      return;
    }

    const name = att.name || path.basename(att.url.split("?")[0] || "file");
    const label = labelForAttachmentType(att.type);
    const part: ReportMediaPart = {
      type: att.type,
      label,
      name,
      mimeType: mime,
      base64: buffer.toString("base64"),
      kind,
    };
    if (kind === "text") {
      part.textContent = decodeTextBuffer(buffer);
    }
    parts.push(part);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "로드 실패";
    skipped.push(`${att.name || att.url} (${msg})`);
  }
}

/**
 * 리포트용 미디어 로드.
 * - 법원 서류 슬롯: PDF/이미지 (권리분석)
 * - 적정가치평가 슬롯: PDF/이미지/TXT/CSV (시세·실거래)
 */
export async function loadReportMediaParts(
  attachments: AuctionAttachment[],
): Promise<{ parts: ReportMediaPart[]; skipped: string[] }> {
  const parts: ReportMediaPart[] = [];
  const skipped: string[] = [];

  const ordered = [
    ...courtDocAttachments(attachments),
    ...biddingValuationAttachments(attachments),
  ];

  for (const att of ordered) {
    await loadOneAttachment(att, parts, skipped);
  }

  return { parts, skipped };
}
