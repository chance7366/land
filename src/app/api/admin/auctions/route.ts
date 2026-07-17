import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAllAuctionsAdmin, parseAuctionBody, toAuctionCreateData } from "@/lib/auction-service";
import { allocateNextManageCode, parseConflictAction } from "@/lib/manage-code";
import { scheduleNotifyMatchingSubscribers } from "@/lib/subscription-notify";

export async function GET() {
  const items = await getAllAuctionsAdmin();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parseAuctionBody(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const conflictAction = parseConflictAction(body.conflictAction);
    const itemNo =
      parsed.data.itemNo != null && Number.isFinite(Number(parsed.data.itemNo))
        ? Math.max(1, Math.round(Number(parsed.data.itemNo)))
        : 1;

    // 동일 사건·물건번호가 있으면 해당 관리코드 충돌로 처리
    const sameCase = await prisma.auction.findFirst({
      where: { caseNumber: parsed.data.caseNumber, itemNo },
      orderBy: { createdAt: "asc" },
    });

    let manageCode = parsed.data.manageCode?.trim() || null;
    if (sameCase?.manageCode && conflictAction !== "create_new") {
      manageCode = sameCase.manageCode;
    }
    if (!manageCode || conflictAction === "create_new") {
      manageCode = await allocateNextManageCode("AUCTION");
    }

    const existingByCode = await prisma.auction.findUnique({ where: { manageCode } });
    const existing = existingByCode ?? (conflictAction !== "create_new" ? sameCase : null);

    if (existing) {
      const code = existing.manageCode || manageCode;
      if (conflictAction === "overwrite") {
        const auction = await prisma.auction.update({
          where: { id: existing.id },
          data: toAuctionCreateData({ ...parsed.data, manageCode: code }),
        });
        scheduleNotifyMatchingSubscribers({ entityType: "AUCTION", entity: auction });
        return NextResponse.json(auction);
      }
      return NextResponse.json(
        {
          error: `관리코드 ${code} 가 이미 등록되어 있습니다.`,
          code: "MANAGE_CODE_CONFLICT",
          manageCode: code,
          existingId: existing.id,
        },
        { status: 409 },
      );
    }

    const auction = await prisma.auction.create({
      data: toAuctionCreateData({ ...parsed.data, manageCode }),
    });
    scheduleNotifyMatchingSubscribers({ entityType: "AUCTION", entity: auction });
    return NextResponse.json(auction, { status: 201 });
  } catch {
    return NextResponse.json({ error: "경매 등록 중 오류가 발생했습니다." }, { status: 500 });
  }
}
