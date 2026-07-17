import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAllPropertiesAdmin, parsePropertyBody, toPropertyCreateData } from "@/lib/property-service";
import { allocateNextManageCode, parseConflictAction } from "@/lib/manage-code";
import { scheduleNotifyMatchingSubscribers } from "@/lib/subscription-notify";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;
  const type = searchParams.get("deal") ?? undefined;
  const status = searchParams.get("status") ?? undefined;

  const items = await getAllPropertiesAdmin({
    category: category as never,
    type: type as never,
    status: status || undefined,
  });

  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parsePropertyBody(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const conflictAction = parseConflictAction(body.conflictAction);
    let manageCode = parsed.data.manageCode?.trim() || null;

    if (!manageCode || conflictAction === "create_new") {
      manageCode = await allocateNextManageCode("PROPERTY");
    }

    const existing = await prisma.property.findUnique({ where: { manageCode } });
    if (existing) {
      if (conflictAction === "overwrite") {
        const property = await prisma.property.update({
          where: { id: existing.id },
          data: toPropertyCreateData({ ...parsed.data, manageCode }),
        });
        scheduleNotifyMatchingSubscribers({ entityType: "PROPERTY", entity: property });
        return NextResponse.json(property);
      }
      return NextResponse.json(
        {
          error: `관리코드 ${manageCode} 가 이미 등록되어 있습니다.`,
          code: "MANAGE_CODE_CONFLICT",
          manageCode,
          existingId: existing.id,
        },
        { status: 409 },
      );
    }

    const property = await prisma.property.create({
      data: toPropertyCreateData({ ...parsed.data, manageCode }),
    });
    scheduleNotifyMatchingSubscribers({ entityType: "PROPERTY", entity: property });
    return NextResponse.json(property, { status: 201 });
  } catch {
    return NextResponse.json({ error: "매물 등록 중 오류가 발생했습니다." }, { status: 500 });
  }
}
