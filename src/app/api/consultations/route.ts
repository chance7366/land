import { NextRequest, NextResponse } from "next/server";
import { generateAccessCode } from "@/lib/consultation";
import { prisma } from "@/lib/prisma";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { createConsultationSupabase } from "@/lib/supabase/repos/consultations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientName,
      phone,
      email,
      category,
      subCategory,
      detail,
      method,
      preferredAt,
      summary,
    } = body;

    if (!clientName || !phone || !category || !detail) {
      return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 });
    }

    const accessCode = generateAccessCode(6);
    const payload = {
      clientName: String(clientName).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim() : null,
      category: String(category).trim(),
      subCategory: subCategory ? String(subCategory).trim() : null,
      summary: String(summary || detail).slice(0, 120),
      detail: String(detail).trim(),
      method: method ? String(method).trim() : null,
      preferredAt: preferredAt ? String(preferredAt).trim() : null,
      accessCode,
    };

    if (isSupabaseEnabled()) {
      const created = await createConsultationSupabase(payload);
      return NextResponse.json(
        {
          id: created.id,
          accessCode: created.accessCode,
          status: "PENDING",
          createdAt: new Date().toISOString(),
        },
        { status: 201 },
      );
    }

    const consultation = await prisma.consultation.create({
      data: {
        ...payload,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        id: consultation.id,
        accessCode: consultation.accessCode,
        status: consultation.status,
        createdAt: consultation.createdAt,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[consultations POST]", err);
    return NextResponse.json({ error: "상담 신청 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
