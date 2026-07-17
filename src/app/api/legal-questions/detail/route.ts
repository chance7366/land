import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ANSWER_FOOTER, maskAuthor } from "@/lib/qa";

/** 비밀글 열람 또는 공개글 상세 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = String(body.id ?? "").trim();
    const accessCode = String(body.accessCode ?? body.password ?? "").trim();

    if (!id) {
      return NextResponse.json({ error: "게시글 ID가 필요합니다." }, { status: 400 });
    }

    const row = await prisma.legalQuestion.findUnique({ where: { id } });
    if (!row) {
      return NextResponse.json({ error: "게시글을 찾을 수 없습니다." }, { status: 404 });
    }

    if (row.isSecret) {
      if (!accessCode || accessCode !== row.accessCode) {
        return NextResponse.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 403 });
      }
    }

    return NextResponse.json({
      id: row.id,
      category: row.category,
      question: row.question,
      content: row.content || row.question,
      authorMasked: maskAuthor(row.authorName || "익명"),
      isSecret: row.isSecret,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      answer: row.answer,
      answerer: row.answerer,
      answeredAt: row.answeredAt?.toISOString() ?? null,
      suggestConsult: row.suggestConsult,
      answerFooter: ANSWER_FOOTER,
    });
  } catch {
    return NextResponse.json({ error: "조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}
