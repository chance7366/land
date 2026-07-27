import {
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  isValidSupabaseUrl,
} from "@/lib/supabase/env";

/** DATA_PROVIDER=supabase 이고 URL/키가 유효할 때 true */
export function isSupabaseEnabled() {
  if (process.env.DATA_PROVIDER?.trim() !== "supabase") return false;
  const url = getSupabaseUrl();
  const anon = getSupabaseAnonKey();
  return Boolean(url && anon && isValidSupabaseUrl(url));
}

/**
 * Storage 업로드용 — Service Role이 있으면 DATA_PROVIDER와 무관하게 사용.
 * (Vercel은 로컬 디스크 폴백이 불가하므로 Storage가 필수)
 */
export function canUseSupabaseStorage() {
  const url = getSupabaseUrl();
  const service = getSupabaseServiceRoleKey();
  return Boolean(url && service && isValidSupabaseUrl(url));
}

export const PROPERTY_IMAGES_BUCKET = "property-images";
