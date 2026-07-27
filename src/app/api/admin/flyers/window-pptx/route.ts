import { NextRequest, NextResponse } from "next/server";
import { buildWindowFlyerPptxBuffer } from "@/lib/flyer/window-flyer-pptx";
import type { WindowFlyerTemplate, WindowFlyerViewModel } from "@/lib/flyer/window-types";

export const runtime = "nodejs";

type Body = {
  data?: WindowFlyerViewModel;
  template?: WindowFlyerTemplate;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Body;
    if (!body?.data?.publicPath || !body.data.title) {
      return NextResponse.json({ error: "전단지 데이터가 없습니다." }, { status: 400 });
    }

    const { buffer, fileName } = await buildWindowFlyerPptxBuffer(body.data, body.template);
    const asciiName = fileName.replace(/[^\x20-\x7E]/g, "_");

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("[window-pptx]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "PPT 생성에 실패했습니다." },
      { status: 500 },
    );
  }
}
