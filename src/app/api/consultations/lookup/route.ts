import { NextRequest, NextResponse } from "next/server";
import { maskPhone, publicCaseId } from "@/lib/consultation";
import { prisma } from "@/lib/prisma";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { lookupConsultationSupabase } from "@/lib/supabase/repos/consultations";

/** 고객: 조회 비밀번호로 본인 상담 확인 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const accessCode = String(body.accessCode ?? "").trim().toLowerCase();
    const clientName = String(body.clientName ?? "").trim();

    if (!accessCode) {
      return NextResponse.json({ error: "조회 비밀번호를 입력해주세요." }, { status: 400 });
    }

    if (isSupabaseEnabled()) {
      const row = await lookupConsultationSupabase(accessCode, clientName || undefined);
      if (!row) {
        return NextResponse.json(
          { error: "일치하는 상담 내역이 없습니다. 성함·비밀번호를 확인해 주세요." },
          { status: 404 },
        );
      }
      const createdAt = new Date(String(row.created_at));
      return NextResponse.json({
        caseId: publicCaseId(String(row.id), createdAt),
        category: row.category,
        subCategory: row.sub_category,
        method: row.method,
        preferredAt: row.preferred_at,
        detail: row.detail,
        status: row.status,
        createdAt,
        clientName: row.client_name,
        phoneMasked: maskPhone(String(row.phone)),
        reply: row.reply,
        repliedAt: row.replied_at,
      });
    }

    const row = await prisma.consultation.findFirst({
      where: {
        accessCode,
        ...(clientName ? { clientName } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    if (!row) {
      return NextResponse.json(
        { error: "일치하는 상담 내역이 없습니다. 성함·비밀번호를 확인해 주세요." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      caseId: publicCaseId(row.id, row.createdAt),
      category: row.category,
      subCategory: row.subCategory,
      method: row.method,
      preferredAt: row.preferredAt,
      detail: row.detail,
      status: row.status,
      createdAt: row.createdAt,
      clientName: row.clientName,
      phoneMasked: maskPhone(row.phone),
      reply: row.reply,
      repliedAt: row.repliedAt,
    });
  } catch (err) {
    console.error("[consultations lookup]", err);
    return NextResponse.json({ error: "조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}
