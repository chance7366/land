import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseAuctionBody, toAuctionCreateData } from "@/lib/auction-service";
import { scheduleNotifyMatchingSubscribers } from "@/lib/subscription-notify";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import {
  deleteAuctionSupabase,
  listAllAuctionsAdminSupabase,
  updateAuctionSupabase,
} from "@/lib/supabase/repos/admin-catalog";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    if (isSupabaseEnabled()) {
      const items = await listAllAuctionsAdminSupabase();
      const auction = items.find((a) => a.id === id);
      if (!auction) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(auction);
    }
    const auction = await prisma.auction.findUnique({ where: { id } });
    if (!auction) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(auction);
  } catch (e) {
    console.error("[admin/auctions GET id]", e);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = parseAuctionBody(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    if (isSupabaseEnabled()) {
      const items = await listAllAuctionsAdminSupabase();
      const existing = items.find((a) => a.id === id);
      if (!existing) {
        return NextResponse.json({ error: "경매를 찾을 수 없습니다." }, { status: 404 });
      }
      const auction = await updateAuctionSupabase(id, {
        ...parsed.data,
        manageCode: existing.manageCode,
        // body에 리포트 URL이 없으면 기존 값 유지 (수정 저장 시 유실 방지)
        reportUrl:
          body.reportUrl !== undefined ? parsed.data.reportUrl : existing.reportUrl,
        generalReportUrl:
          body.generalReportUrl !== undefined
            ? parsed.data.generalReportUrl
            : (existing as { generalReportUrl?: string | null }).generalReportUrl ?? null,
      });
      scheduleNotifyMatchingSubscribers({
        entityType: "AUCTION",
        entity: auction as never,
      });
      return NextResponse.json(auction);
    }

    const existing = await prisma.auction.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "경매를 찾을 수 없습니다." }, { status: 404 });
    }

    const auction = await prisma.auction.update({
      where: { id },
      data: toAuctionCreateData({
        ...parsed.data,
        manageCode: existing.manageCode,
        reportUrl:
          body.reportUrl !== undefined ? parsed.data.reportUrl : existing.reportUrl,
        generalReportUrl:
          body.generalReportUrl !== undefined
            ? parsed.data.generalReportUrl
            : existing.generalReportUrl,
      }),
    });
    scheduleNotifyMatchingSubscribers({ entityType: "AUCTION", entity: auction });
    return NextResponse.json(auction);
  } catch (e) {
    console.error("[admin/auctions PATCH]", e);
    return NextResponse.json({ error: "경매 수정 중 오류가 발생했습니다." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    if (isSupabaseEnabled()) {
      await deleteAuctionSupabase(id);
      return NextResponse.json({ ok: true });
    }
    const existing = await prisma.auction.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "경매를 찾을 수 없습니다." }, { status: 404 });
    }
    await prisma.auction.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/auctions DELETE]", e);
    return NextResponse.json({ error: "경매 삭제 중 오류가 발생했습니다." }, { status: 500 });
  }
}
