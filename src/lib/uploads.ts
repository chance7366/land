import path from "path";

export type UploadKind = "properties" | "auctions";

export function getUploadDir(kind: UploadKind) {
  return path.join(process.cwd(), "storage", "uploads", kind);
}

export function getLegacyUploadDir(kind: UploadKind) {
  return path.join(process.cwd(), "public", "uploads", kind);
}

export function uploadUrlPrefix(kind: UploadKind) {
  return `/uploads/${kind}`;
}

/** @deprecated Use getUploadDir("properties") */
export function getPropertyUploadDir() {
  return getUploadDir("properties");
}

/** @deprecated Use getLegacyUploadDir("properties") */
export function getLegacyPropertyUploadDir() {
  return getLegacyUploadDir("properties");
}

/** @deprecated Use uploadUrlPrefix("properties") */
export const UPLOAD_URL_PREFIX = "/uploads/properties";

const SAFE_NAME = /^[a-zA-Z0-9._-]+$/;

export function isSafeUploadFilename(filename: string): boolean {
  return SAFE_NAME.test(filename) && !filename.includes("..");
}

export function contentTypeForFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".pdf") return "application/pdf";
  return "application/octet-stream";
}
