/** DATA_PROVIDER=supabase 이고 URL/키가 유효할 때 true */
export function isSupabaseEnabled() {
  if (process.env.DATA_PROVIDER?.trim() !== "supabase") return false;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  if (!url || !anon) return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export const PROPERTY_IMAGES_BUCKET = "property-images";
