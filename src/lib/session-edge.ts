const SESSION_SECRET = process.env.SESSION_SECRET ?? "dev-session-secret-change-me";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  return atob(padded);
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function signPayload(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toHex(signature);
}

export async function verifySessionValueEdge(value: string): Promise<string | null> {
  try {
    const decoded = fromBase64Url(value);
    const parts = decoded.split(":");
    // userId:issuedAt:signature — userId에 ':'가 있어도 마지막 2칸을 기준으로 파싱
    if (parts.length < 3) return null;
    const signature = parts[parts.length - 1];
    const issuedAt = parts[parts.length - 2];
    const userId = parts.slice(0, -2).join(":");
    if (!userId || !issuedAt || !signature) return null;

    const expected = await signPayload(`${userId}:${issuedAt}`);
    if (signature !== expected) return null;

    const age = Date.now() - Number(issuedAt);
    if (age > SESSION_MAX_AGE * 1000) return null;

    return userId;
  } catch {
    return null;
  }
}
