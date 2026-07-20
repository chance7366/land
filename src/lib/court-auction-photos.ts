import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import type { Page } from "playwright";
import { getUploadDir, uploadUrlPrefix } from "@/lib/uploads";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { uploadPropertyImage } from "@/lib/supabase/storage";

/** 폼 사진 슬롯 한도 (AuctionForm MAX_IMAGES와 동일) */
export const COURT_PHOTO_FORM_MAX = 8;
/** DOM에서 읽을 최대 장수 (과도한 메모리 방지) */
export const COURT_PHOTO_READ_MAX = 40;

export type CourtPhotoRaw = {
  alt: string;
  buffer: Buffer;
  mime: string;
  ext: string;
};

export type CourtPhotoPersistResult = {
  urls: string[];
  totalFromCourt: number;
  truncated: boolean;
};

function extFromBuf(buf: Buffer): { ext: string; mime: string } {
  if (buf[0] === 0xff && buf[1] === 0xd8) return { ext: "jpg", mime: "image/jpeg" };
  if (buf[0] === 0x47 && buf[1] === 0x49) return { ext: "gif", mime: "image/gif" };
  if (buf[0] === 0x89 && buf[1] === 0x50) return { ext: "png", mime: "image/png" };
  if (buf[0] === 0x52 && buf[1] === 0x49) return { ext: "webp", mime: "image/webp" };
  return { ext: "jpg", mime: "image/jpeg" };
}

/** 물건상세 #mf_wfm_mainFrame_gen_pic 의 data URI 이미지 */
export async function extractCourtPhotosFromPage(
  page: Page,
  readMax = COURT_PHOTO_READ_MAX,
): Promise<CourtPhotoRaw[]> {
  const rows = await page.evaluate((max) => {
    const root = document.querySelector("#mf_wfm_mainFrame_gen_pic");
    if (!root) return [] as { alt: string; dataUrl: string }[];
    return Array.from(root.querySelectorAll("img[id*='img_reltPic']"))
      .slice(0, max)
      .map((img) => ({
        alt: img.getAttribute("alt") || "",
        dataUrl: (img as HTMLImageElement).src || "",
      }));
  }, readMax);

  const out: CourtPhotoRaw[] = [];
  for (const row of rows) {
    const m = row.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!m) continue;
    try {
      const buffer = Buffer.from(m[2], "base64");
      if (buffer.length < 100) continue;
      const { ext, mime } = extFromBuf(buffer);
      out.push({
        alt: row.alt.trim() || `사진 ${out.length + 1}`,
        buffer,
        mime,
        ext,
      });
    } catch {
      /* skip bad base64 */
    }
  }
  return out;
}

/** 로컬/Supabase 업로드 후 공개 URL (최대 formMax장) */
export async function persistCourtPhotos(
  photos: CourtPhotoRaw[],
  formMax = COURT_PHOTO_FORM_MAX,
): Promise<CourtPhotoPersistResult> {
  const totalFromCourt = photos.length;
  const toSave = photos.slice(0, formMax);
  if (!toSave.length) {
    return { urls: [], totalFromCourt, truncated: false };
  }

  const useSupabase = isSupabaseEnabled();
  if (!useSupabase) {
    await mkdir(getUploadDir("auctions"), { recursive: true });
  }
  const prefix = uploadUrlPrefix("auctions");
  const urls: string[] = [];

  for (const photo of toSave) {
    const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${photo.ext}`;
    if (useSupabase) {
      const storagePath = `auctions/${filename}`;
      const publicUrl = await uploadPropertyImage(storagePath, photo.buffer, photo.mime);
      urls.push(publicUrl);
    } else {
      await writeFile(path.join(getUploadDir("auctions"), filename), photo.buffer);
      urls.push(`${prefix}/${filename}`);
    }
  }

  return {
    urls,
    totalFromCourt,
    truncated: totalFromCourt > formMax,
  };
}
