import { NextRequest, NextResponse } from "next/server";
import type { SuccessStoryStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const STATUSES: SuccessStoryStatus[] = ["PUBLISHED", "HIDDEN"];

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const status = body.status as SuccessStoryStatus | undefined;

    if (status && !STATUSES.includes(status)) {
      return NextResponse.json({ error: "올바르지 않은 상태입니다." }, { status: 400 });
    }

    const existing = await prisma.successStory.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "후기를 찾을 수 없습니다." }, { status: 404 });
    }

    const updated = await prisma.successStory.update({
      where: { id },
      data: {
        status: status ?? existing.status,
        title: typeof body.title === "string" ? body.title.trim() : undefined,
        content: typeof body.content === "string" ? body.content.trim() : undefined,
        category: typeof body.category === "string" ? body.category.trim() : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "저장 중 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    await prisma.successStory.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "삭제 중 오류가 발생했습니다." }, { status: 500 });
  }
}
