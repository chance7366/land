import {
  getSupabaseAnonKey,
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

export const PROPERTY_IMAGES_BUCKET = "property-images";
