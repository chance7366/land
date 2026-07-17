import { createHash, randomBytes, timingSafeEqual } from "crypto";

const SESSION_COOKIE = "chance_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  const input = hashPassword(password);
  const a = Buffer.from(input);
  const b = Buffer.from(passwordHash);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE;
}

export function getSessionMaxAge(): number {
  return SESSION_MAX_AGE;
}

export function hashSessionToken(token: string): string {
  return hashToken(token);
}

export { SESSION_COOKIE, SESSION_MAX_AGE };
