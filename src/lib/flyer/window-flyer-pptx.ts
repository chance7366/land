/**
 * 창문전단지 → PPTX (A4 세로 1장)
 * 서버 전용 (pptxgenjs는 Node API 사용)
 */

import "server-only";
import PptxGenJS from "pptxgenjs";
import { OFFICE_PROFILE } from "@/lib/office-profile";
import { flyerQrSrc, getPublicBaseUrl } from "@/lib/flyer/site-url";
import type { WindowFlyerTemplate, WindowFlyerViewModel } from "@/lib/flyer/window-types";

const W = 8.27;
const H = 11.69;
const FOOTER_H = 1.35;
const M = 0.35;

const FOOTER = {
  name: OFFICE_PROFILE.name || "찬스부동산 경매중개",
  broker: OFFICE_PROFILE.brokerName || "대표 공인중개사",
  regNo: OFFICE_PROFILE.regNo || "등록번호 확인 요망",
  phone: OFFICE_PROFILE.agentPhone || OFFICE_PROFILE.brokerPhone || "문의 요망",
  address: OFFICE_PROFILE.addressShort || "충남 홍성 · 내포신도시",
};

function safeName(s: string) {
  return s.replace(/[\\/:*?"<>|]/g, "_").slice(0, 40);
}

function addImageSafe(
  slide: PptxGenJS.Slide,
  url: string | undefined,
  opts: { x: number; y: number; w: number; h: number },
) {
  if (!url) return;
  try {
    slide.addImage({ path: url, ...opts });
  } catch {
    /* 외부 이미지 실패 시 배경만 */
  }
}

function addFooterBar(slide: PptxGenJS.Slide, data: WindowFlyerViewModel, fill: string) {
  const y = H - FOOTER_H;
  slide.addShape("rect", {
    x: 0,
    y,
    w: W,
    h: FOOTER_H,
    fill: { color: fill },
    line: { color: fill },
  });

  addImageSafe(slide, flyerQrSrc(data.publicPath), {
    x: 0.28,
    y: y + 0.22,
    w: 0.9,
    h: 0.9,
  });

  slide.addText(FOOTER.name, {
    x: 1.35,
    y: y + 0.18,
    w: 4.5,
    h: 0.28,
    fontSize: 13,
    bold: true,
    color: "FFFFFF",
    fontFace: "Arial",
  });
  slide.addText(`대표 ${FOOTER.broker} · ${FOOTER.regNo}`, {
    x: 1.35,
    y: y + 0.42,
    w: 4.5,
    h: 0.22,
    fontSize: 10,
    color: "FFFFFF",
    fontFace: "Arial",
  });
  slide.addText(`☎ ${FOOTER.phone}`, {
    x: 1.35,
    y: y + 0.68,
    w: 4.5,
    h: 0.36,
    fontSize: 22,
    bold: true,
    color: "FFFFFF",
    fontFace: "Arial",
  });
  slide.addText(FOOTER.address, {
    x: 1.35,
    y: y + 1.05,
    w: 4.8,
    h: 0.2,
    fontSize: 10,
    color: "FFFFFF",
    fontFace: "Arial",
  });
  slide.addText(getPublicBaseUrl() + data.publicPath, {
    x: 6.1,
    y: y + 0.35,
    w: 1.95,
    h: 0.7,
    fontSize: 8,
    color: "FFFFFF",
    fontFace: "Arial",
    valign: "middle",
  });
}

function buildTypeA(pptx: PptxGenJS, data: WindowFlyerViewModel) {
  const slide = pptx.addSlide();
  slide.background = { color: "F7F4EF" };
  const isAuction = data.kind === "AUCTION";

  slide.addText(data.headline, {
    x: M,
    y: 0.35,
    w: W - M * 2,
    h: 0.85,
    fontSize: 40,
    bold: true,
    color: "1C1917",
    fontFace: "Georgia",
  });
  slide.addText(isAuction ? data.locationLine : data.tagline, {
    x: M,
    y: 1.15,
    w: W - M * 2,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: "44403C",
    fontFace: "Arial",
  });

  const feats = (data.features.length ? data.features : data.highlights).slice(0, 2);
  feats.forEach((f, i) => {
    slide.addText(`✓  ${f}`, {
      x: M,
      y: 1.65 + i * 0.38,
      w: W - M * 2,
      h: 0.35,
      fontSize: 16,
      bold: true,
      color: "1C1917",
      fontFace: "Arial",
    });
  });

  const imgY = 2.5;
  const imgH = 5.4;
  slide.addShape("rect", {
    x: M,
    y: imgY,
    w: W - M * 2,
    h: imgH,
    fill: { color: "E7E5E4" },
    line: { color: "E7E5E4" },
  });
  addImageSafe(slide, data.images[0], { x: M, y: imgY, w: W - M * 2, h: imgH });

  const badgeX = W - M - 1.55;
  const badgeY = imgY + 0.25;
  slide.addShape("ellipse", {
    x: badgeX,
    y: badgeY,
    w: 1.45,
    h: 1.45,
    fill: { color: "F5C518" },
    line: { color: "FFFFFF", width: 3 },
  });
  if (isAuction && data.discountPct) {
    slide.addText(`할인\n${data.discountPct}`, {
      x: badgeX,
      y: badgeY + 0.3,
      w: 1.45,
      h: 0.9,
      fontSize: 22,
      bold: true,
      color: "1C1917",
      align: "center",
      valign: "middle",
      fontFace: "Arial",
    });
  } else {
    slide.addText(`${data.badge}\n${data.priceHuge}`, {
      x: badgeX + 0.05,
      y: badgeY + 0.3,
      w: 1.35,
      h: 0.9,
      fontSize: 13,
      bold: true,
      color: "1C1917",
      align: "center",
      valign: "middle",
      fontFace: "Arial",
    });
  }

  if (isAuction) {
    slide.addText(
      [data.appraisalLabel ? `감정 ${data.appraisalLabel} → 최저` : "최저매각가격", data.priceHuge]
        .join("\n"),
      {
        x: M,
        y: imgY + imgH + 0.15,
        w: W - M * 2,
        h: 0.85,
        fontSize: 22,
        bold: true,
        color: "C62828",
        fontFace: "Arial",
      },
    );
  } else {
    slide.addText(`📍 ${data.locationLine}`, {
      x: M,
      y: imgY + imgH + 0.2,
      w: W - M * 2,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: "1C1917",
      fontFace: "Arial",
    });
  }

  addFooterBar(slide, data, "1C1917");
}

function buildTypeB(pptx: PptxGenJS, data: WindowFlyerViewModel) {
  const slide = pptx.addSlide();
  slide.background = { color: "FFFFFF" };
  const isAuction = data.kind === "AUCTION";

  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: W,
    h: 4.2,
    fill: { color: "E7E5E4" },
    line: { color: "E7E5E4" },
  });
  addImageSafe(slide, data.images[0], { x: 0, y: 0, w: W, h: 4.2 });

  slide.addShape("roundRect", {
    x: 0.3,
    y: 3.55,
    w: 3.9,
    h: 1.0,
    fill: { color: "0D9488" },
    line: { color: "0D9488" },
    rectRadius: 0.1,
  });
  slide.addText(isAuction ? data.badge : data.headline, {
    x: 0.45,
    y: 3.7,
    w: 3.6,
    h: 0.7,
    fontSize: 22,
    bold: true,
    color: "FFFFFF",
    fontFace: "Arial",
    valign: "middle",
  });

  slide.addShape("rect", {
    x: 0.3,
    y: 4.55,
    w: 3.9,
    h: 1.35,
    fill: { color: "E8B84A" },
    line: { color: "E8B84A" },
  });
  slide.addText(`${isAuction ? "최저가" : data.badge}\n${data.priceHuge}`, {
    x: 0.45,
    y: 4.7,
    w: 3.6,
    h: 1.05,
    fontSize: 24,
    bold: true,
    color: "1C1917",
    fontFace: "Arial",
  });

  if (isAuction && data.discountPct) {
    slide.addShape("roundRect", {
      x: 4.4,
      y: 3.55,
      w: 3.55,
      h: 2.35,
      fill: { color: "C62828" },
      line: { color: "C62828" },
      rectRadius: 0.1,
    });
    slide.addText(`할인율\n${data.discountPct}`, {
      x: 4.55,
      y: 4.0,
      w: 3.25,
      h: 1.4,
      fontSize: 36,
      bold: true,
      color: "FFFFFF",
      align: "center",
      valign: "middle",
      fontFace: "Arial",
    });
  } else {
    slide.addShape("roundRect", {
      x: 4.4,
      y: 3.55,
      w: 3.55,
      h: 2.35,
      fill: { color: "0F172A" },
      line: { color: "0F172A" },
      rectRadius: 0.1,
    });
    slide.addText(
      ["FEATURES", ...data.highlights.slice(0, 4).map((h) => `· ${h}`)].join("\n"),
      {
        x: 4.6,
        y: 3.75,
        w: 3.2,
        h: 2.0,
        fontSize: 14,
        bold: true,
        color: "FFFFFF",
        fontFace: "Arial",
      },
    );
  }

  if (!isAuction) {
    data.specs.slice(0, 4).forEach((s, i) => {
      const x = 0.3 + i * 1.95;
      slide.addShape("roundRect", {
        x,
        y: 6.2,
        w: 1.85,
        h: 0.95,
        fill: { color: "F1F5F9" },
        line: { color: "F1F5F9" },
        rectRadius: 0.08,
      });
      slide.addText(s.label, {
        x,
        y: 6.45,
        w: 1.85,
        h: 0.45,
        fontSize: 12,
        bold: true,
        color: "0F172A",
        align: "center",
        fontFace: "Arial",
      });
    });
  } else {
    slide.addText(
      [data.locationLine, data.appraisalLabel ? `감정 ${data.appraisalLabel}` : "", data.saleDateShort || ""]
        .filter(Boolean)
        .join("\n"),
      {
        x: M,
        y: 6.2,
        w: W - M * 2,
        h: 1.0,
        fontSize: 15,
        bold: true,
        color: "334155",
        fontFace: "Arial",
      },
    );
  }

  addFooterBar(slide, data, isAuction ? "0F172A" : "0F766E");
}

function buildTypeC(pptx: PptxGenJS, data: WindowFlyerViewModel) {
  const slide = pptx.addSlide();
  slide.background = { color: "E8EBEF" };
  const isAuction = data.kind === "AUCTION";

  if (isAuction) {
    slide.addShape("rect", {
      x: 0,
      y: 0,
      w: W,
      h: 0.4,
      fill: { color: "1E293B" },
      line: { color: "1E293B" },
    });
    slide.addText(data.noticeNo ? `공고 ${data.noticeNo}` : "경매 물건", {
      x: M,
      y: 0.05,
      w: W - M * 2,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: "FFFFFF",
      align: "right",
      fontFace: "Arial",
    });
    slide.addText("경매", {
      x: M,
      y: 0.55,
      w: W - M * 2,
      h: 0.75,
      fontSize: 48,
      bold: true,
      color: "C62828",
      align: "center",
      fontFace: "Arial",
    });
    slide.addShape("roundRect", {
      x: 2.0,
      y: 1.35,
      w: 4.27,
      h: 0.42,
      fill: { color: "1E293B" },
      line: { color: "1E293B" },
      rectRadius: 0.2,
    });
    slide.addText(data.headline, {
      x: 2.0,
      y: 1.38,
      w: 4.27,
      h: 0.36,
      fontSize: 16,
      bold: true,
      color: "FFFFFF",
      align: "center",
      fontFace: "Arial",
    });
    slide.addText(data.locationLine, {
      x: M,
      y: 1.9,
      w: W - M * 2,
      h: 0.35,
      fontSize: 14,
      bold: true,
      color: "475569",
      align: "center",
      fontFace: "Arial",
    });
  } else {
    slide.addShape("rect", {
      x: 0,
      y: 0,
      w: W,
      h: 0.85,
      fill: { color: "3B5BDB" },
      line: { color: "3B5BDB" },
    });
    slide.addText(FOOTER.name, {
      x: M,
      y: 0.12,
      w: 4.5,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: "FFFFFF",
      fontFace: "Arial",
    });
    slide.addText(FOOTER.phone, {
      x: 5.0,
      y: 0.2,
      w: 2.9,
      h: 0.45,
      fontSize: 20,
      bold: true,
      color: "FFFFFF",
      align: "right",
      fontFace: "Arial",
    });
    slide.addText(data.badge, {
      x: M,
      y: 1.05,
      w: W - M * 2,
      h: 0.7,
      fontSize: 42,
      bold: true,
      color: "C62828",
      align: "center",
      fontFace: "Arial",
    });
    slide.addShape("roundRect", {
      x: 1.2,
      y: 1.8,
      w: W - 2.4,
      h: 0.4,
      fill: { color: "1E293B" },
      line: { color: "1E293B" },
      rectRadius: 0.2,
    });
    slide.addText(data.title, {
      x: 1.2,
      y: 1.83,
      w: W - 2.4,
      h: 0.34,
      fontSize: 14,
      bold: true,
      color: "FFFFFF",
      align: "center",
      fontFace: "Arial",
    });
  }

  const imgY = 2.4;
  const imgH = 2.55;
  const gap = 0.15;
  const iw = (W - M * 2 - gap) / 2;
  for (let i = 0; i < 2; i++) {
    const x = M + i * (iw + gap);
    slide.addShape("roundRect", {
      x,
      y: imgY,
      w: iw,
      h: imgH,
      fill: { color: "CBD5E1" },
      line: { color: "CBD5E1" },
      rectRadius: 0.08,
    });
    addImageSafe(slide, data.images[i], { x, y: imgY, w: iw, h: imgH });
  }

  let rowY = imgY + imgH + 0.25;
  if (isAuction) {
    slide.addShape("roundRect", {
      x: M,
      y: rowY,
      w: W - M * 2,
      h: 0.9,
      fill: { color: "FFFFFF" },
      line: { color: "E2E8F0" },
      rectRadius: 0.1,
    });
    slide.addText(`감정가  ···  ${data.appraisalLabel || "-"}`, {
      x: M + 0.25,
      y: rowY + 0.25,
      w: W - M * 2 - 0.5,
      h: 0.4,
      fontSize: 18,
      bold: true,
      color: "94A3B8",
      fontFace: "Arial",
    });
    rowY += 1.1;
    slide.addShape("roundRect", {
      x: M,
      y: rowY,
      w: W - M * 2,
      h: 1.3,
      fill: { color: "FFFFFF" },
      line: { color: "E2E8F0" },
      rectRadius: 0.1,
    });
    slide.addText(
      [`최저  ···  ${data.priceHuge}`, data.discountPct ? `할인 ${data.discountPct}` : ""]
        .filter(Boolean)
        .join("\n"),
      {
        x: M + 0.25,
        y: rowY + 0.25,
        w: W - M * 2 - 0.5,
        h: 0.9,
        fontSize: 24,
        bold: true,
        color: "C62828",
        fontFace: "Arial",
      },
    );
  } else {
    const rows =
      data.priceRows.length > 0
        ? data.priceRows.slice(0, 3)
        : [{ tab: data.badge, area: data.specs[0]?.label ?? "", price: data.priceHuge }];
    rows.forEach((row) => {
      slide.addShape("roundRect", {
        x: M,
        y: rowY,
        w: W - M * 2,
        h: 0.95,
        fill: { color: "FFFFFF" },
        line: { color: "E2E8F0" },
        rectRadius: 0.1,
      });
      slide.addText(`[${row.tab}]  ${row.area}\n${row.price}`, {
        x: M + 0.2,
        y: rowY + 0.15,
        w: W - M * 2 - 0.4,
        h: 0.7,
        fontSize: 18,
        bold: true,
        color: "C62828",
        fontFace: "Arial",
      });
      rowY += 1.1;
    });
  }

  addFooterBar(slide, data, isAuction ? "0F172A" : "3B5BDB");
}

export async function buildWindowFlyerPptxBuffer(
  data: WindowFlyerViewModel,
  template?: WindowFlyerTemplate,
): Promise<{ buffer: Buffer; fileName: string }> {
  const t = template ?? data.template ?? "A";
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "A4_PORTRAIT", width: W, height: H });
  pptx.layout = "A4_PORTRAIT";
  pptx.author = FOOTER.name;
  pptx.title = `창문전단지 ${data.badge} ${data.title}`;

  if (t === "B") buildTypeB(pptx, data);
  else if (t === "C") buildTypeC(pptx, data);
  else buildTypeA(pptx, data);

  const fileName = `창문전단지_Type${t}_${safeName(data.badge)}_${safeName(data.title)}.pptx`;
  const out = await pptx.write({ outputType: "nodebuffer" });
  const buffer = Buffer.isBuffer(out)
    ? out
    : Buffer.from(out as Uint8Array);
  return { buffer, fileName };
}
