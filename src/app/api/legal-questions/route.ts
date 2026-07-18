import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { maskAuthor } from "@/lib/qa";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import {
  createLegalQuestionInSupabase,
  listLegalQuestionsFromSupabase,
} from "@/lib/supabase/repos/catalog";

export async function GET() {
  try {
    const items = isSupabaseEnabled()
      ? await listLegalQuestionsFromSupabase(100)
      : await prisma.legalQuestion.findMany({
          where: { isPublic: true },
          orderBy: { createdAt: "desc" },
          take: 100,
        });

    return NextResponse.json(
      items.map((row) => ({
        id: row.id,
        category: row.category,
        question: row.question,
        authorMasked: maskAuthor(row.authorName || "익명"),
        isSecret: row.isSecret,
        status: row.status,
        createdAt: row.createdAt.toISOString(),
        hasAnswer: Boolean(row.answer),
      })),
    );
  } catch (err) {
    console.error("[api/legal-questions]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "목록을 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const category = String(body.category ?? "").trim();
    const question = String(body.question ?? body.title ?? "").trim();
    const content = String(body.content ?? body.body ?? "").trim();
    const authorName = String(body.authorName ?? body.author ?? "").trim();
    const phone = body.phone ? String(body.phone).trim() : null;
    const isSecret = Boolean(body.isSecret);
    const accessCode = isSecret ? String(body.accessCode ?? body.password ?? "").trim() : "";

    if (!category || !question || !content || !authorName) {
      return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 });
    }
    if (isSecret && accessCode.length < 4) {
      return NextResponse.json({ error: "비밀글 비밀번호 4자리를 입력해주세요." }, { status: 400 });
    }

    const row = isSupabaseEnabled()
      ? await createLegalQuestionInSupabase({
          category,
          question,
          content,
          authorName,
          phone,
          isSecret,
          accessCode: isSecret ? accessCode : "",
        })
      : await prisma.legalQuestion.create({
          data: {
            category,
            question,
            content,
            authorName,
            phone,
            isSecret,
            accessCode: isSecret ? accessCode : "",
            isPublic: !isSecret,
            status: "PENDING",
          },
        });

    return NextResponse.json(
      {
        id: row.id,
        category: row.category,
        question: row.question,
        status: row.status,
        isSecret: row.isSecret,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[api/legal-questions POST]", err);
    return NextResponse.json({ error: "질문 등록 중 오류가 발생했습니다." }, { status: 500 });
  }
}
