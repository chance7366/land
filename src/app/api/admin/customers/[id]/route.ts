import { NextRequest, NextResponse } from "next/server";
import {
  deleteCustomer,
  findRelatedByPhone,
  getCustomer,
  updateCustomer,
} from "@/lib/customers/service";
import type { CustomerWriteInput } from "@/lib/customers/types";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const item = await getCustomer(id);
    if (!item) {
      return NextResponse.json({ error: "고객을 찾을 수 없습니다." }, { status: 404 });
    }
    const related = await findRelatedByPhone(item.phone);
    return NextResponse.json({ item, related });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "조회 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as CustomerWriteInput;
    const existing = await getCustomer(id);
    if (!existing) {
      return NextResponse.json({ error: "고객을 찾을 수 없습니다." }, { status: 404 });
    }
    const item = await updateCustomer(id, body);
    return NextResponse.json({ item });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "저장 실패";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    await deleteCustomer(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "삭제 실패";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
