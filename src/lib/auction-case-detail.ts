/**
 * 법원 사건상세조회(PGJ151F00) — 사건내역 + 문건/송달내역
 * (기일내역 제외)
 */

export type CaseBasicInfo = {
  caseNumber: string;
  caseName: string;
  receivedAt: string;
  startedAt: string;
  dept: string;
  claimAmount: number;
  appealStay: string;
  finalResult: string;
  finalDate: string;
};

export type DividendDeadlineRow = {
  listNo: number;
  address: string;
  deadline: string;
};

export type AppealRow = {
  court: string;
  caseNumber: string;
  kind: string;
  filedAt: string;
  result: string;
};

export type RelatedCaseRow = {
  court: string;
  caseNumber: string;
  kind: string;
};

export type CaseItemDetail = {
  itemNo: number;
  itemType: string;
  appraisalPrice: number;
  minPrice: number;
  bidDeposit: number;
  remarks: string;
  status: string;
  saleDateLabel: string;
  recentResult: string;
};

export type ListRow = {
  no: number;
  listKind: string;
  address: string;
  detail?: string;
};

export type PartyRow = {
  no: number;
  role: string;
  name: string;
};

export type DocProcessRow = {
  receivedAt: string;
  detail: string;
  result: string;
};

export type ServiceRow = {
  servedAt: string;
  detail: string;
  result: string;
};

export type CaseDetail = {
  available: boolean;
  court: string;
  basic: CaseBasicInfo;
  dividendDeadlines: DividendDeadlineRow[];
  appeals: AppealRow[];
  relatedCases: RelatedCaseRow[];
  item: CaseItemDetail;
  lists: ListRow[];
  parties: PartyRow[];
  docProcess: DocProcessRow[];
  services: ServiceRow[];
};

export function emptyCaseDetail(court = ""): CaseDetail {
  return {
    available: false,
    court,
    basic: {
      caseNumber: "",
      caseName: "",
      receivedAt: "",
      startedAt: "",
      dept: "",
      claimAmount: 0,
      appealStay: "",
      finalResult: "",
      finalDate: "",
    },
    dividendDeadlines: [],
    appeals: [],
    relatedCases: [],
    item: {
      itemNo: 1,
      itemType: "",
      appraisalPrice: 0,
      minPrice: 0,
      bidDeposit: 0,
      remarks: "",
      status: "",
      saleDateLabel: "",
      recentResult: "",
    },
    lists: [],
    parties: [],
    docProcess: [],
    services: [],
  };
}

export function cloneCaseDetail(data: CaseDetail): CaseDetail {
  return {
    ...data,
    basic: { ...data.basic },
    dividendDeadlines: data.dividendDeadlines.map((r) => ({ ...r })),
    appeals: data.appeals.map((r) => ({ ...r })),
    relatedCases: data.relatedCases.map((r) => ({ ...r })),
    item: { ...data.item },
    lists: data.lists.map((r) => ({ ...r })),
    parties: data.parties.map((r) => ({ ...r })),
    docProcess: data.docProcess.map((r) => ({ ...r })),
    services: data.services.map((r) => ({ ...r })),
  };
}

export function formatWon(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n) || n <= 0) return "—";
  return `${Math.round(n).toLocaleString("ko-KR")}원`;
}

/** 20260120 | 2026-01-20 → 2026.01.20 */
export function formatCourtYmd(raw: string | null | undefined): string {
  if (!raw) return "";
  const digits = String(raw).replace(/\D/g, "");
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6, 8)}`;
  }
  const m = String(raw).match(/(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/);
  if (m) return `${m[1]}.${m[2].padStart(2, "0")}.${m[3].padStart(2, "0")}`;
  return String(raw).trim();
}

function parseWon(raw: unknown): number {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  const digits = String(raw ?? "").replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function buildAddress(row: Record<string, unknown>): string {
  const userSt = String(row.userSt || row.printSt || "").trim();
  if (userSt) return userSt;
  const parts = [
    row.adongSdNm,
    row.adongSggNm,
    row.adongEmdNm,
    row.adongRiNm,
    row.rprsLtnoAddr,
    row.bldNm,
    row.bldDtlDts,
  ]
    .map((x) => String(x || "").trim())
    .filter(Boolean);
  return parts.join(" ");
}

/**
 * selectAuctnCsSrchRslt.on (pgj15A) → 사건내역 구조화
 */
export function parseCaseDetailFromSrchJson(
  json: unknown,
  fallbackCourt = "",
  preferredItemNo?: number | null,
): CaseDetail | null {
  const data = (json as { data?: Record<string, unknown> } | null)?.data;
  if (!data || typeof data !== "object") return null;
  const bas = data.dma_csBasInf as Record<string, unknown> | undefined;
  if (!bas) return null;

  const court =
    String(bas.cortSptNm || bas.cortOfcNm || fallbackCourt || "").trim() ||
    fallbackCourt;
  const caseNumber = String(bas.userCsNo || "").trim();
  const deptParts = [
    String(bas.cortAuctnJdbnNm || "").trim(),
    String(bas.jdbnTelno || "").trim(),
  ].filter(Boolean);

  const ultmt = String(bas.ultmtDvsCd || "");
  const finalResult =
    ultmt === "000" || ultmt === ""
      ? "미종국"
      : String(bas.csProgStatCd || "").includes("종국")
        ? "종국"
        : ultmt;

  const divList = Array.isArray(data.dlt_dstrtDemnLstprdDts)
    ? data.dlt_dstrtDemnLstprdDts
    : [];
  const dividendDeadlines: DividendDeadlineRow[] = divList.map((row, i) => {
    const r = row as Record<string, unknown>;
    return {
      listNo: Number(r.dspslObjctSeq || i + 1),
      address: buildAddress(r),
      deadline: formatCourtYmd(String(r.dstrtDemnLstprdYmd || "")),
    };
  });

  const appealList = Array.isArray(data.dlt_csApalRaplDts)
    ? data.dlt_csApalRaplDts
    : [];
  const appeals: AppealRow[] = appealList.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      court: String(r.cortOfcNm || r.cortSptNm || "").trim(),
      caseNumber: String(r.userCsNo || r.csNo || "").trim(),
      kind: String(r.apalDvsNm || r.reltCsDvsNm || "").trim(),
      filedAt: formatCourtYmd(String(r.apalRcptYmd || r.csRcptYmd || "")),
      result: String(r.apalRslt || r.ultmtNm || "").trim(),
    };
  });

  const relList = Array.isArray(data.dlt_rletReltCsLst) ? data.dlt_rletReltCsLst : [];
  const relatedCases: RelatedCaseRow[] = relList.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      court: String(r.cortSptNm || r.cortOfcNm || "").trim(),
      caseNumber: String(r.userReltCsNo || "").trim(),
      kind: String(r.reltCsDvsNm || "").trim(),
    };
  });

  const gdsList = Array.isArray(data.dlt_dspslGdsDspslObjctLst)
    ? data.dlt_dspslGdsDspslObjctLst
    : [];
  let gds =
    preferredItemNo != null && preferredItemNo > 0
      ? gdsList.find(
          (row) => Number((row as Record<string, unknown>).dspslGdsSeq) === preferredItemNo,
        )
      : gdsList[0];
  if (!gds) gds = gdsList[0];
  const g = (gds || {}) as Record<string, unknown>;

  const listRows = Array.isArray(data.dlt_rletCsDspslObjctLst)
    ? data.dlt_rletCsDspslObjctLst
    : [];
  const lists: ListRow[] = listRows.map((row, i) => {
    const r = row as Record<string, unknown>;
    return {
      no: Number(r.dspslObjctSeq || i + 1),
      listKind: String(r.auctnLstNm || "").trim() || "목록",
      address: buildAddress(r),
      detail: String(r.ultmtNm || "").trim(),
    };
  });

  const partyList = Array.isArray(data.dlt_rletCsIntrpsLst)
    ? data.dlt_rletCsIntrpsLst
    : [];
  const parties: PartyRow[] = partyList.map((row, i) => {
    const r = row as Record<string, unknown>;
    return {
      no: i + 1,
      role: String(r.auctnIntrpsDvsNm || "").trim(),
      name: String(r.intrpsNm || "").trim(),
    };
  });

  const itemNo = Number(g.dspslGdsSeq || preferredItemNo || 1) || 1;
  const usg = String(g.auctnGdsUsgCd || "");
  const usgLabel =
    usg === "01"
      ? "아파트"
      : usg === "02"
        ? "다세대"
        : usg === "03"
          ? "연립"
          : usg === "07"
            ? "오피스텔"
            : usg === "08"
              ? "근린시설"
              : usg === "12"
                ? "토지"
                : "";
  const minPrice =
    parseWon(g.dspslAmt) || parseWon(g.fstPbancLwsDspslPrc) || 0;
  const rate = Number(g.prchDposRate || 10);
  const bidDeposit =
    minPrice > 0 && Number.isFinite(rate)
      ? Math.round((minPrice * rate) / 100)
      : 0;

  return {
    available: true,
    court,
    basic: {
      caseNumber,
      caseName: String(bas.csNm || "").trim(),
      receivedAt: formatCourtYmd(String(bas.csRcptYmd || "")),
      startedAt: formatCourtYmd(String(bas.csCmdcYmd || "")),
      dept: deptParts.join(" · "),
      claimAmount: parseWon(bas.clmAmt),
      appealStay: String(bas.csProgSuspRsn || "").trim(),
      finalResult,
      finalDate: formatCourtYmd(String(bas.csUltmtYmd || "")),
    },
    dividendDeadlines,
    appeals,
    relatedCases,
    item: {
      itemNo,
      itemType: usgLabel,
      appraisalPrice: parseWon(g.aeeEvlAmt),
      minPrice,
      bidDeposit,
      remarks: String(g.dspslGdsRmk || "")
        .replace(/^\s*-?\s*/, "")
        .trim(),
      status: String(g.realGdsProgStat || "").trim() === "1" ? "매각공고" : "",
      saleDateLabel: formatCourtYmd(String(g.dspslDxdyYmd || "")),
      recentResult: "",
    },
    lists,
    parties,
    docProcess: [],
    services: [],
  };
}

/**
 * selectDlvrOfdocDtsDtl.on → 문건처리·송달내역
 */
export function mergeDocsIntoCaseDetail(
  detail: CaseDetail,
  json: unknown,
): CaseDetail {
  const data = (json as { data?: Record<string, unknown> } | null)?.data;
  if (!data) return detail;

  const ofdoc = Array.isArray(data.dlt_ofdocDtsLst) ? data.dlt_ofdocDtsLst : [];
  const dlvr = Array.isArray(data.dlt_dlvrDtsLst) ? data.dlt_dlvrDtsLst : [];

  return {
    ...detail,
    available: true,
    docProcess: ofdoc.map((row) => {
      const r = row as Record<string, unknown>;
      return {
        receivedAt: formatCourtYmd(String(r.ofdocRcptYmd || "")),
        detail: String(r.rcptDts || "").trim(),
        result: String(r.rcptRslt || "").trim(),
      };
    }),
    services: dlvr.map((row) => {
      const r = row as Record<string, unknown>;
      return {
        servedAt: formatCourtYmd(String(r.dlvrbkRegYmd || "")),
        detail: String(r.dlvrDts || "").trim(),
        result: String(r.lastDlvrblRchYmd || "").trim(),
      };
    }),
  };
}

export function caseDetailFromRights(text: string): CaseDetail {
  const re = /\[사건상세JSON\]\s*([\s\S]*?)(?=\n\n\[|$)/;
  const m = text.match(re);
  if (!m?.[1]) return emptyCaseDetail();
  try {
    const parsed = JSON.parse(m[1].trim()) as CaseDetail;
    if (parsed && typeof parsed === "object") {
      return { ...emptyCaseDetail(), ...parsed, available: Boolean(parsed.available) };
    }
  } catch {
    /* ignore */
  }
  return emptyCaseDetail();
}
