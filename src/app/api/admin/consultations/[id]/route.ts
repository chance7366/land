import { NextRequest, NextResponse } from "next/server";
import type { ConsultationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const STATUSES: ConsultationStatus[] = ["PENDING", "PROCESSING", "DONE"];

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const status = body.status as ConsultationStatus | undefined;
    const reply = typeof body.reply === "string" ? body.reply.trim() : undefined;

    if (status && !STATUSES.includes(status)) {
      return NextResponse.json({ error: "올바르지 않은 상태입니다." }, { status: 400 });
    }

    const existing = await prisma.consultation.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "상담 건을 찾을 수 없습니다." }, { status: 404 });
    }

    const nextStatus = status ?? existing.status;
    const nextReply = reply !== undefined ? (reply.length ? reply : null) : existing.reply;
    const repliedAt =
      reply !== undefined
        ? reply.length
          ? new Date()
          : null
        : existing.repliedAt;

    const updated = await prisma.consultation.update({
      where: { id },
      data: {
        status: nextStatus,
        reply: nextReply,
        repliedAt,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "답변 저장 중 오류가 발생했습니다." }, { status: 500 });
  }
}
