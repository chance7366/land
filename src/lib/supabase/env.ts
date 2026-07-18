/** Vercel에 실수로 붙은 [], 따옴표, 마크다운 링크를 제거 */
export function cleanEnvValue(raw: string | undefined | null): string {
  if (!raw) return "";
  let v = raw.trim();
  // [https://...](https://...) 또는 [https://...]
  const md = /^\[(https?:\/\/[^\]]+)\](?:\([^)]*\))?$/.exec(v);
  if (md) v = md[1];
  v = v.replace(/^[['"<\s]+/, "").replace(/[]'">\s]+$/, "");
  // 문자열 안에 URL만 있는 경우
  const found = /(https?:\/\/[a-z0-9.-]+\.supabase\.co)/i.exec(v);
  if (found) return found[1];
  return v.trim();
}

export function getSupabaseUrl(): string {
  return cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function getSupabaseAnonKey(): string {
  return cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseServiceRoleKey(): string {
  return cleanEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function isValidSupabaseUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      (u.protocol === "https:" || u.protocol === "http:") &&
      u.hostname.includes("supabase")
    );
  } catch {
    return false;
  }
}
