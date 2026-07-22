/**
 * 네이버 블로그 등 붙여넣기용 — 클래스/style 태그 대신 인라인 스타일 보존
 */

const STYLE_TAGS = new Set([
  "TABLE",
  "THEAD",
  "TBODY",
  "TR",
  "TH",
  "TD",
  "H1",
  "H2",
  "H3",
  "BLOCKQUOTE",
  "HEADER",
  "SPAN",
  "DIV",
  "P",
  "STRONG",
  "LI",
]);

function isTransparent(bg: string): boolean {
  return (
    !bg ||
    bg === "transparent" ||
    bg === "rgba(0, 0, 0, 0)" ||
    /^rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)$/i.test(bg)
  );
}

function shouldInline(el: HTMLElement): boolean {
  const tag = el.tagName;
  if (STYLE_TAGS.has(tag)) return true;
  if (el.classList.contains("badge")) return true;
  if (el.classList.contains("summary-box")) return true;
  if (el.classList.contains("report-cover")) return true;
  if (el.classList.contains("footer-note")) return true;
  return false;
}

function applyComputedToInline(src: HTMLElement, dst: HTMLElement): void {
  if (!shouldInline(src)) return;
  const cs = window.getComputedStyle(src);
  const tag = src.tagName;

  const bg = cs.backgroundColor;
  if (!isTransparent(bg)) {
    dst.style.backgroundColor = bg;
  }

  if (cs.color) dst.style.color = cs.color;

  if (tag === "TABLE") {
    dst.style.borderCollapse = "collapse";
    dst.style.width = "100%";
    dst.style.margin = "12px 0 16px";
    dst.style.fontSize = cs.fontSize || "9.5pt";
    dst.style.border = `1px solid ${cs.borderTopColor || "#E6E0D8"}`;
  }

  if (tag === "TH" || tag === "TD") {
    const borderColor = cs.borderTopColor || "#E6E0D8";
    dst.style.border = `1px solid ${borderColor}`;
    dst.style.padding = `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`;
    dst.style.textAlign = cs.textAlign;
    dst.style.verticalAlign = cs.verticalAlign || "middle";
    dst.style.fontWeight = cs.fontWeight;
    dst.style.wordBreak = "keep-all";
    if (tag === "TH" && isTransparent(bg)) {
      // 헤더 배경이 유실된 경우 리포트 기본값
      dst.style.backgroundColor = "#F3F1EE";
      dst.style.color = cs.color || "#3D342C";
    }
  }

  if (tag === "H2") {
    if (isTransparent(bg)) dst.style.backgroundColor = "#F7E8D8";
    dst.style.borderRadius = "999px";
    dst.style.padding = `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`;
    dst.style.fontWeight = "700";
    dst.style.fontSize = cs.fontSize;
  }

  if (tag === "H3") {
    dst.style.fontWeight = "700";
    dst.style.borderBottom = `1px solid ${cs.borderBottomColor || "#79B4B7"}`;
    dst.style.paddingBottom = cs.paddingBottom;
  }

  if (src.classList.contains("badge") || src.classList.contains("summary-box")) {
    dst.style.display = cs.display === "inline" ? "inline-block" : cs.display;
    dst.style.padding = `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`;
    dst.style.borderRadius = cs.borderRadius;
    dst.style.fontWeight = cs.fontWeight;
    if (cs.borderTopWidth !== "0px") {
      dst.style.border = `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`;
    }
  }

  if (tag === "BLOCKQUOTE") {
    dst.style.padding = `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`;
    dst.style.borderRadius = cs.borderRadius;
    dst.style.border = `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`;
    dst.style.borderLeft = `${cs.borderLeftWidth} ${cs.borderLeftStyle} ${cs.borderLeftColor}`;
    if (isTransparent(bg)) dst.style.backgroundColor = "#FFF8E7";
  }
}

/**
 * 미리보기 DOM의 계산 스타일을 인라인으로 옮긴 HTML 문자열.
 * `<style>` 태그는 제거 (붙여넣기 시 대부분 버려지므로).
 */
export function htmlWithInlinedStyles(root: HTMLElement): string {
  const clone = root.cloneNode(true) as HTMLElement;
  const srcNodes = [root, ...Array.from(root.querySelectorAll("*"))];
  const dstNodes = [clone, ...Array.from(clone.querySelectorAll("*"))];

  for (let i = 0; i < srcNodes.length; i++) {
    const src = srcNodes[i];
    const dst = dstNodes[i];
    if (!(src instanceof HTMLElement) || !(dst instanceof HTMLElement)) continue;
    applyComputedToInline(src, dst);
  }

  clone.querySelectorAll("style").forEach((el) => el.remove());
  return clone.innerHTML;
}
