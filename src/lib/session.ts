import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getSessionCookieName, getSessionMaxAge } from "@/lib/auth";

const SESSION_SECRET = process.env.SESSION_SECRET ?? "dev-session-secret-change-me";

function signPayload(payload: string): string {
  return createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
}

export function createSessionValue(userId: string): string {
  const issuedAt = Date.now().toString();
  const payload = `${userId}:${issuedAt}`;
  const signature = signPayload(payload);
  return Buffer.from(`${payload}:${signature}`).toString("base64url");
}

export function verifySessionValue(value: string): string | null {
  try {
    const decoded = Buffer.from(value, "base64url").toString("utf8");
    const [userId, issuedAt, signature] = decoded.split(":");
    if (!userId || !issuedAt || !signature) return null;

    const expected = signPayload(`${userId}:${issuedAt}`);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

    const age = Date.now() - Number(issuedAt);
    if (age > getSessionMaxAge() * 1000) return null;

    return userId;
  } catch {
    return null;
  }
}

export async function getAdminSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(getSessionCookieName())?.value;
  if (!session) return null;
  return verifySessionValue(session);
}

export function buildSessionCookie(userId: string) {
  return {
    name: getSessionCookieName(),
    value: createSessionValue(userId),
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getSessionMaxAge(),
  };
}

export function clearSessionCookie() {
  return {
    name: getSessionCookieName(),
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  };
}
