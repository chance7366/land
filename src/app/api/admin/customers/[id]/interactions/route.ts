import { NextRequest, NextResponse } from "next/server";
import { addCustomerInteraction, getCustomer } from "@/lib/customers/service";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const existing = await getCustomer(id);
    if (!existing) {
      return NextResponse.json({ error: "고객을 찾을 수 없습니다." }, { status: 404 });
    }
    const body = await request.json();
    const title = String(body.title ?? "").trim();
    if (!title) {
      return NextResponse.json({ error: "제목을 입력하세요." }, { status: 400 });
    }
    const item = await addCustomerInteraction(id, {
      title,
      body: typeof body.body === "string" ? body.body : "",
      channel: typeof body.channel === "string" ? body.channel : "phone",
      occurredAt: typeof body.occurredAt === "string" ? body.occurredAt : undefined,
    });
    return NextResponse.json({ item }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "이력 추가 실패";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
