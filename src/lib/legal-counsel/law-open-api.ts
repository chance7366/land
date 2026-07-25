import type { LegalCounselSearchBundle, LegalCounselSource } from "./types";

const SEARCH_BASE = "https://www.law.go.kr/DRF/lawSearch.do";

export function getLawOpenApiOc(): string | undefined {
  const oc =
    process.env.LAW_OPEN_API_OC?.trim() ||
    process.env.LAW_OC?.trim() ||
    process.env.LAW_GO_KR_OC?.trim() ||
    process.env.LEGISLATION_API_KEY?.trim();
  return oc || undefined;
}

function asArray<T>(value: unknown): T[] {
  if (value == null) return [];
  return Array.isArray(value) ? (value as T[]) : [value as T];
}

function pickString(obj: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number") return String(v);
  }
  return "";
}

function stripHtml(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** 질의에서 검색어 후보 추출 (법령명·핵심 키워드) */
export function extractSearchQueries(userQuery: string): string[] {
  const q = userQuery.trim();
  if (!q) return [];

  const known = [
    "주택임대차보호법",
    "상가건물 임대차보호법",
    "공인중개사법",
    "민사집행법",
    "민법",
    "집합건물법",
    "건축법",
    "국토의 계획 및 이용에 관한 법률",
  ];
  const hits = known.filter((name) => q.includes(name.replace(/\s/g, "")) || q.includes(name));

  const tokens = q
    .replace(/[^\w가-힣\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 2)
    .slice(0, 8);

  const keyword = tokens.filter((t) =>
    /임대|전세|월세|임차|보증금|경매|배당|대항력|확정일자|근저당|가압류|중개|확인설명|말소|유치권/.test(
      t,
    ),
  );

  const out = [...hits];
  if (keyword.length) out.push(keyword.slice(0, 4).join(" "));
  if (out.length === 0) out.push(tokens.slice(0, 5).join(" ") || q.slice(0, 40));
  return [...new Set(out)].slice(0, 3);
}

async function fetchLawSearchJson(params: Record<string, string>): Promise<unknown> {
  const url = new URL(SEARCH_BASE);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`법령 API HTTP ${res.status}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("법령 API 응답이 JSON이 아닙니다. OC·서비스 신청을 확인하세요.");
  }
}

function parseLawList(json: unknown): LegalCounselSource[] {
  const root = json as Record<string, unknown>;
  const block = (root.LawSearch ?? root.lawSearch ?? root) as Record<string, unknown>;
  const items = asArray<Record<string, unknown>>(block.law ?? block.Law ?? block);
  return items
    .map((item) => {
      const title = pickString(item, [
        "법령명한글",
        "법령명",
        "법명",
        "lawNm",
        "법령명_한글",
      ]);
      const id = pickString(item, ["법령일련번호", "법령ID", "id", "MST"]);
      const date = pickString(item, ["공포일자", "시행일자", "ancYd", "efYd"]);
      const summary = pickString(item, ["법령약칭명", "소관부처명", "법령종류"]);
      if (!title) return null;
      return {
        kind: "법령" as const,
        title,
        ref: [id && `ID ${id}`, date].filter(Boolean).join(" · ") || "현행법령",
        summary: summary || undefined,
        link: id
          ? `https://www.law.go.kr/DRF/lawService.do?OC=view&target=law&ID=${encodeURIComponent(id)}&type=HTML`
          : undefined,
      };
    })
    .filter((x): x is LegalCounselSource => Boolean(x))
    .slice(0, 5);
}

function parsePrecList(json: unknown): LegalCounselSource[] {
  const root = json as Record<string, unknown>;
  const block = (root.PrecSearch ?? root.precSearch ?? root) as Record<string, unknown>;
  const items = asArray<Record<string, unknown>>(block.prec ?? block.Prec ?? block);
  return items
    .map((item) => {
      const title = pickString(item, ["사건명", "판례명", "사건번호", "title"]);
      const caseNo = pickString(item, ["사건번호", "판례정보일련번호", "id"]);
      const court = pickString(item, ["법원명", "선고일자", "판결일자"]);
      const summary = pickString(item, ["판시사항", "판결요지", "요약"]);
      if (!title && !caseNo) return null;
      return {
        kind: "판례" as const,
        title: title || caseNo,
        ref: [caseNo !== title ? caseNo : "", court].filter(Boolean).join(" · ") || "판례",
        summary: summary ? stripHtml(summary).slice(0, 280) : undefined,
      };
    })
    .filter((x): x is LegalCounselSource => Boolean(x))
    .slice(0, 3);
}

function parseExpcList(json: unknown): LegalCounselSource[] {
  const root = json as Record<string, unknown>;
  const block = (root.ExpcSearch ?? root.expcSearch ?? root) as Record<string, unknown>;
  const items = asArray<Record<string, unknown>>(block.expc ?? block.Expc ?? block);
  return items
    .map((item) => {
      const title = pickString(item, ["안건명", "해석례명", "제목", "title"]);
      const id = pickString(item, ["안건번호", "해석례일련번호", "id"]);
      const summary = pickString(item, ["질의요지", "회답", "요약"]);
      if (!title && !id) return null;
      return {
        kind: "해석례" as const,
        title: title || id,
        ref: id || "법령해석례",
        summary: summary ? stripHtml(summary).slice(0, 280) : undefined,
      };
    })
    .filter((x): x is LegalCounselSource => Boolean(x))
    .slice(0, 2);
}

async function searchTarget(
  oc: string,
  target: "law" | "prec" | "expc",
  query: string,
): Promise<unknown> {
  return fetchLawSearchJson({
    OC: oc,
    target,
    type: "JSON",
    search: "2",
    query,
    display: target === "law" ? "8" : "5",
    page: "1",
  });
}

export async function searchLegalCounselContext(
  userQuery: string,
): Promise<LegalCounselSearchBundle> {
  const oc = getLawOpenApiOc();
  const warnings: string[] = [];
  if (!oc) {
    return {
      laws: [],
      precedents: [],
      interpretations: [],
      contextText: "",
      warnings: [
        "LAW_OPEN_API_OC(국가법령정보센터 인증값)가 없습니다. 법령 검색 없이 Gemini만 사용합니다.",
      ],
    };
  }

  const queries = extractSearchQueries(userQuery);
  const laws: LegalCounselSource[] = [];
  const precedents: LegalCounselSource[] = [];
  const interpretations: LegalCounselSource[] = [];

  for (const query of queries) {
    try {
      const lawJson = await searchTarget(oc, "law", query);
      laws.push(...parseLawList(lawJson));
    } catch (e) {
      warnings.push(`법령 검색 실패(${query}): ${e instanceof Error ? e.message : "오류"}`);
    }
    try {
      const precJson = await searchTarget(oc, "prec", query);
      precedents.push(...parsePrecList(precJson));
    } catch (e) {
      warnings.push(`판례 검색 실패(${query}): ${e instanceof Error ? e.message : "오류"}`);
    }
    try {
      const expcJson = await searchTarget(oc, "expc", query);
      interpretations.push(...parseExpcList(expcJson));
    } catch {
      /* 해석례 미신청 계정일 수 있음 — 치명적이지 않음 */
    }
  }

  const uniq = <T extends LegalCounselSource>(list: T[]) => {
    const seen = new Set<string>();
    return list.filter((x) => {
      const k = `${x.kind}:${x.title}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  };

  const lawU = uniq(laws).slice(0, 5);
  const precU = uniq(precedents).slice(0, 3);
  const expcU = uniq(interpretations).slice(0, 2);

  const lines: string[] = [];
  lines.push("관련 법령 조문:");
  if (lawU.length === 0) lines.push("- (검색 결과 없음)");
  for (const s of lawU) {
    lines.push(`- ${s.title} (${s.ref})${s.summary ? ` — ${s.summary}` : ""}`);
  }
  lines.push("");
  lines.push("대법원 판례 및 관련 판례:");
  if (precU.length === 0) lines.push("- (검색 결과 없음)");
  for (const s of precU) {
    lines.push(`- ${s.title} (${s.ref})${s.summary ? `\n  ${s.summary}` : ""}`);
  }
  lines.push("");
  lines.push("법령해석례:");
  if (expcU.length === 0) lines.push("- (검색 결과 없음 또는 미신청)");
  for (const s of expcU) {
    lines.push(`- ${s.title} (${s.ref})${s.summary ? `\n  ${s.summary}` : ""}`);
  }

  return {
    laws: lawU,
    precedents: precU,
    interpretations: expcU,
    contextText: lines.join("\n"),
    warnings,
  };
}
