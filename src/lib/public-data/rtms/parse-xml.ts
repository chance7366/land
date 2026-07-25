/** 경량 XML item 파서 (의존성 없이 RTMS 응답 처리) */

export function parseXmlItems(xml: string): Record<string, string>[] {
  const items: Record<string, string>[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/gi;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(xml)) != null) {
    const body = m[1];
    const row: Record<string, string> = {};
    const tagRe = /<([A-Za-z0-9_]+)>([\s\S]*?)<\/\1>/g;
    let t: RegExpExecArray | null;
    while ((t = tagRe.exec(body)) != null) {
      row[t[1]] = decodeXml(t[2].trim());
    }
    // self-closing empty tags
    const emptyRe = /<([A-Za-z0-9_]+)\s*\/>/g;
    while ((t = emptyRe.exec(body)) != null) {
      if (row[t[1]] == null) row[t[1]] = "";
    }
    items.push(row);
  }
  return items;
}

function decodeXml(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

export function parseResultCode(xml: string): { code: string; msg: string } {
  const code = xml.match(/<resultCode>([^<]*)<\/resultCode>/i)?.[1]?.trim() ?? "";
  const msg = xml.match(/<resultMsg>([^<]*)<\/resultMsg>/i)?.[1]?.trim() ?? "";
  return { code, msg };
}

export function parseTotalCount(xml: string): number {
  const n = xml.match(/<totalCount>([^<]*)<\/totalCount>/i)?.[1]?.trim();
  return n ? Number(n) || 0 : 0;
}
