/**
 * 관리자 인증 사용 여부
 * - ADMIN_AUTH_ENABLED=false → 항상 비활성 (로컬 개발용)
 * - ADMIN_AUTH_ENABLED=true → 항상 활성
 * - 미설정 + Vercel Production + ADMIN_PASSWORD 있음 → 자동 활성
 */
export function isAdminAuthEnabled(): boolean {
  const flag = process.env.ADMIN_AUTH_ENABLED?.trim().toLowerCase();
  if (flag === "false" || flag === "0") return false;
  if (flag === "true" || flag === "1") return true;

  const hasPassword = Boolean(process.env.ADMIN_PASSWORD?.trim());
  return process.env.VERCEL_ENV === "production" && hasPassword;
}

export function getAdminEnvCredentials(): { email: string; password: string } | null {
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password) return null;
  const email = (process.env.ADMIN_EMAIL || "admin@chance.local").trim();
  return { email, password };
}
