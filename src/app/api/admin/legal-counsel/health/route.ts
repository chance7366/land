import { NextResponse } from "next/server";
import { getGeminiApiKey } from "@/lib/gemini-client";
import { getLawOpenApiOc } from "@/lib/legal-counsel";

export const dynamic = "force-dynamic";

export async function GET() {
  const oc = getLawOpenApiOc();
  return NextResponse.json({
    gemini: Boolean(getGeminiApiKey()),
    lawOpenApi: Boolean(oc),
    lawOcLength: oc?.length ?? 0,
  });
}
