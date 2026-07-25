import { createHash, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAdminEnvCredentials } from "@/lib/admin-auth";
import { verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildSessionCookie } from "@/lib/session";

function safeEqualText(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

function applySessionCookie(response: NextResponse, userId: string) {
  const cookie = buildSessionCookie(userId);
  response.cookies.set(cookie.name, cookie.value, {
    httpOnly: cookie.httpOnly,
    sameSite: cookie.sameSite,
    secure: cookie.secure,
    path: cookie.path,
    maxAge: cookie.maxAge,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      password?: string;
    };

    const password = String(body.password || "").trim();
    if (!password) {
      return NextResponse.json({ error: "비밀번호를 입력해주세요." }, { status: 400 });
    }

    const envCreds = getAdminEnvCredentials();
    if (!envCreds) {
      return NextResponse.json(
        {
          error:
            "서버에 ADMIN_PASSWORD가 없습니다. Vercel Environment Variables를 확인한 뒤 Redeploy 하세요.",
        },
        { status: 503 },
      );
    }

    if (safeEqualText(password, envCreds.password)) {
      const response = NextResponse.json({ ok: true });
      applySessionCookie(response, "env-admin");
      return response;
    }

    const email = String(body.email || "").trim();
    if (email) {
      try {
        const admin = await prisma.adminUser.findUnique({ where: { email } });
        if (admin && verifyPassword(password, admin.passwordHash)) {
          const response = NextResponse.json({ ok: true });
          applySessionCookie(response, admin.id);
          return response;
        }
      } catch {
        // ignore DB errors — env password is the primary path
      }
    }

    return NextResponse.json(
      { error: "비밀번호가 올바르지 않습니다. Vercel에 저장한 ADMIN_PASSWORD와 같은지 확인하세요." },
      { status: 401 },
    );
  } catch {
    return NextResponse.json({ error: "로그인 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
