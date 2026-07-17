import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseAuctionBody, toAuctionCreateData } from "@/lib/auction-service";
import { scheduleNotifyMatchingSubscribers } from "@/lib/subscription-notify";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const auction = await prisma.auction.findUnique({ where: { id } });
  if (!auction) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(auction);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const existing = await prisma.auction.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "경매를 찾을 수 없습니다." }, { status: 404 });
    }

    const body = await request.json();
    const parsed = parseAuctionBody(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const auction = await prisma.auction.update({
      where: { id },
      data: toAuctionCreateData({ ...parsed.data, manageCode: existing.manageCode }),
    });
    scheduleNotifyMatchingSubscribers({ entityType: "AUCTION", entity: auction });
    return NextResponse.json(auction);
  } catch {
    return NextResponse.json({ error: "경매 수정 중 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const existing = await prisma.auction.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "경매를 찾을 수 없습니다." }, { status: 404 });
    }
    await prisma.auction.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "경매 삭제 중 오류가 발생했습니다." }, { status: 500 });
  }
}
