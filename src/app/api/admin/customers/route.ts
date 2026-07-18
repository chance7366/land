import { NextRequest, NextResponse } from "next/server";
import {
  createCustomer,
  findCustomersByPhone,
  listCustomers,
} from "@/lib/customers/service";
import type { CustomerWriteInput } from "@/lib/customers/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const phone = request.nextUrl.searchParams.get("phone");
    if (phone?.trim()) {
      const items = await findCustomersByPhone(phone);
      return NextResponse.json({ items });
    }
    const items = await listCustomers();
    return NextResponse.json({ items });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "목록 조회 실패";
    console.warn("[admin/customers GET]", msg);
    return NextResponse.json({ error: msg, items: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CustomerWriteInput;
    const item = await createCustomer(body);
    return NextResponse.json({ item }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "등록 실패";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
