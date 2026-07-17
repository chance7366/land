export function isAdminAuthEnabled(): boolean {
  return process.env.ADMIN_AUTH_ENABLED === "true";
}
