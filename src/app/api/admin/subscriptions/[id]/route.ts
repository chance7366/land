import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const existing = await prisma.emailSubscriber.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "신청을 찾을 수 없습니다." }, { status: 404 });
    }

    const body = await request.json();
    const status = body.status as string | undefined;
    if (status && !["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "잘못된 상태입니다." }, { status: 400 });
    }

    const adminNote =
      typeof body.adminNote === "string" ? body.adminNote.trim().slice(0, 500) : undefined;

    const updated = await prisma.emailSubscriber.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(adminNote !== undefined ? { adminNote: adminNote || null } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[admin subscriptions PATCH]", err);
    return NextResponse.json({ error: "저장 중 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const existing = await prisma.emailSubscriber.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "신청을 찾을 수 없습니다." }, { status: 404 });
    }
    await prisma.emailSubscriber.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "삭제 중 오류가 발생했습니다." }, { status: 500 });
  }
}
