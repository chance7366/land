/** DATA_PROVIDER=supabase 이고 URL/키가 있을 때 true */
export function isSupabaseEnabled() {
  if (process.env.DATA_PROVIDER !== "supabase") return false;
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  );
}

export const PROPERTY_IMAGES_BUCKET = "property-images";
