import { NextRequest, NextResponse } from "next/server";
import type { LegalQuestionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import {
  getLegalQuestionFromSupabase,
  updateLegalQuestionInSupabase,
} from "@/lib/supabase/repos/catalog";

const STATUSES: LegalQuestionStatus[] = ["PENDING", "REVIEWING", "ANSWERED"];

function serialize(row: {
  id: string;
  category: string;
  question: string;
  content: string;
  authorName: string;
  phone: string | null;
  answer: string | null;
  answerer: string | null;
  status: string;
  isPublic: boolean;
  isSecret: boolean;
  accessCode: string;
  suggestConsult: boolean;
  answeredAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...row,
    answeredAt: row.answeredAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

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

    const existing = isSupabaseEnabled()
      ? await getLegalQuestionFromSupabase(id)
      : await prisma.legalQuestion.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "게시글을 찾을 수 없습니다." }, { status: 404 });
    }

    const nextAnswer = answer !== undefined ? (answer.length ? answer : null) : existing.answer;
    const nextStatus =
      status ??
      (nextAnswer && !existing.answer ? ("ANSWERED" as LegalQuestionStatus) : existing.status);
    const nextAnswerer = nextAnswer ? "김영찬 공인중개사" : existing.answerer;
    const nextAnsweredAt = nextAnswer
      ? existing.answeredAt && existing.answer === nextAnswer
        ? existing.answeredAt
        : new Date()
      : existing.answeredAt;
    const nextSuggest = suggestConsult ?? existing.suggestConsult;

    const updated = isSupabaseEnabled()
      ? await updateLegalQuestionInSupabase(id, {
          status: nextStatus,
          answer: nextAnswer,
          answerer: nextAnswerer,
          answeredAt: nextAnsweredAt,
          suggestConsult: nextSuggest,
        })
      : await prisma.legalQuestion.update({
          where: { id },
          data: {
            status: nextStatus as LegalQuestionStatus,
            answer: nextAnswer,
            answerer: nextAnswerer,
            answeredAt: nextAnsweredAt,
            suggestConsult: nextSuggest,
          },
        });

    return NextResponse.json(serialize(updated));
  } catch (err) {
    console.error("[api/admin/legal-questions PATCH]", err);
    return NextResponse.json({ error: "답변 저장 중 오류가 발생했습니다." }, { status: 500 });
  }
}
