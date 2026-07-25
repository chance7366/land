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

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      password?: string;
    };

    const password = String(body.password || "");
    if (!password) {
      return NextResponse.json({ error: "비밀번호를 입력해주세요." }, { status: 400 });
    }

    const envCreds = getAdminEnvCredentials();
    if (envCreds && safeEqualText(password, envCreds.password)) {
      const email = String(body.email || envCreds.email).trim();
      // 이메일을 보낸 경우 env 이메일과 일치할 때만 허용(미입력 시 비밀번호만으로 통과)
      if (body.email && !safeEqualText(email, envCreds.email)) {
        return NextResponse.json({ error: "로그인 정보가 올바르지 않습니다." }, { status: 401 });
      }
      const response = NextResponse.json({ ok: true });
      response.cookies.set(buildSessionCookie("env-admin"));
      return response;
    }

    const email = String(body.email || "").trim();
    if (!email) {
      return NextResponse.json(
        { error: "로그인 정보가 올바르지 않습니다." },
        { status: 401 },
      );
    }

    try {
      const admin = await prisma.adminUser.findUnique({ where: { email } });
      if (!admin || !verifyPassword(password, admin.passwordHash)) {
        return NextResponse.json({ error: "로그인 정보가 올바르지 않습니다." }, { status: 401 });
      }
      const response = NextResponse.json({ ok: true });
      response.cookies.set(buildSessionCookie(admin.id));
      return response;
    } catch {
      // DB에 AdminUser가 없어도 env 비밀번호 경로가 우선이므로 여기선 실패 처리
      return NextResponse.json({ error: "로그인 정보가 올바르지 않습니다." }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "로그인 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
