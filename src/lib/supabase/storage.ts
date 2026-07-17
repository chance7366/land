import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { PROPERTY_IMAGES_BUCKET } from "@/lib/supabase/config";

/**
 * 매물/경매 이미지를 Supabase Storage 에 업로드하고 공개 URL 반환.
 * path 예: `properties/{id}/{filename}` 또는 `auctions/{id}/{filename}`
 */
export async function uploadPropertyImage(path: string, file: File | Buffer, contentType: string) {
  const sb = createSupabaseAdminClient();
  const body = file instanceof File ? file : file;

  const { error } = await sb.storage.from(PROPERTY_IMAGES_BUCKET).upload(path, body, {
    contentType,
    upsert: true,
  });
  if (error) throw error;

  const { data } = sb.storage.from(PROPERTY_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
