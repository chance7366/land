import { NextRequest, NextResponse } from "next/server";
import type { LegalQuestionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const STATUSES: LegalQuestionStatus[] = ["PENDING", "REVIEWING", "ANSWERED"];

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const status = body.status as LegalQuestionStatus | undefined;
    const answer = typeof body.answer === "string" ? body.answer.trim() : undefined;
    const suggestConsult =
      typeof body.suggestConsult === "boolean" ? body.suggestConsult : undefined;

    if (status && !STATUSES.includes(status)) {
      return NextResponse.json({ error: "올바르지 않은 상태입니다." }, { status: 400 });
    }

    const existing = await prisma.legalQuestion.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "게시글을 찾을 수 없습니다." }, { status: 404 });
    }

    const nextAnswer = answer !== undefined ? (answer.length ? answer : null) : existing.answer;
    const nextStatus = status ?? (nextAnswer && !existing.answer ? "ANSWERED" : existing.status);

    const updated = await prisma.legalQuestion.update({
      where: { id },
      data: {
        status: nextStatus,
        answer: nextAnswer,
        answerer: nextAnswer ? "김영찬 공인중개사" : existing.answerer,
        answeredAt: nextAnswer ? new Date() : existing.answeredAt,
        suggestConsult: suggestConsult ?? existing.suggestConsult,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "답변 저장 중 오류가 발생했습니다." }, { status: 500 });
  }
}
