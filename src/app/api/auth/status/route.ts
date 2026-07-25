import { NextResponse } from "next/server";
import { getAdminEnvCredentials, isAdminAuthEnabled } from "@/lib/admin-auth";

/** 비밀값 없이 인증 설정 상태만 확인 (디버그용) */
export async function GET() {
  const creds = getAdminEnvCredentials();
  return NextResponse.json({
    authEnabled: isAdminAuthEnabled(),
    hasAdminPassword: Boolean(creds),
    passwordLength: creds?.password.length ?? 0,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    hasSessionSecret: Boolean(process.env.SESSION_SECRET?.trim()),
  });
}
