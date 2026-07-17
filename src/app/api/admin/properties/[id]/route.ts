import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parsePropertyBody, toPropertyCreateData } from "@/lib/property-service";
import { scheduleNotifyMatchingSubscribers } from "@/lib/subscription-notify";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(property);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "매물을 찾을 수 없습니다." }, { status: 404 });
    }

    const body = await request.json();
    const parsed = parsePropertyBody(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const property = await prisma.property.update({
      where: { id },
      data: toPropertyCreateData({ ...parsed.data, manageCode: existing.manageCode }),
    });
    scheduleNotifyMatchingSubscribers({ entityType: "PROPERTY", entity: property });
    return NextResponse.json(property);
  } catch {
    return NextResponse.json({ error: "매물 수정 중 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "매물을 찾을 수 없습니다. 목록을 새로고침 해주세요." }, { status: 404 });
    }

    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "매물 삭제 중 오류가 발생했습니다." }, { status: 500 });
  }
}
