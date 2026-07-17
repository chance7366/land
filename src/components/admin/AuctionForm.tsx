"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  ImagePlus,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { Auction } from "@prisma/client";
import { GlassCard } from "@/components/ui/GlassCard";
import { navigateTo } from "@/lib/navigate";
import { parseImages } from "@/lib/format";
import { suggestAuctionTitle } from "@/lib/auction-title";
import {
  type CourtAuctionFixture,
  type FormGroup,
  COURT_OPTIONS,
  findFixturesByCase,
  formatWon,
  groupLabel,
} from "@/lib/mockup/auction-court-fixtures";
import {
  type AuctionAttachment,
  type AuctionDocType,
  AUCTION_DOC_SLOTS,
  parseAuctionAttachments,
} from "@/lib/auction-attachments";
import { askManageCodeConflict, type ManageCodeConflictResponse } from "@/lib/manage-code-conflict";

const MAX_IMAGES = 8;

type FormState = {
  court: string;
  caseYear: string;
  /** 타경 뒷자리+물건번호 표시용 — 예: 1111(1) */
  caseTail: string;
  caseSerial: string;
  caseNumber: string;
  /** null = 미입력(공란). 불러오기 시 물건번호 없이 사건만 조회 */
  itemNo: number | null;
  formGroup: FormGroup | "";
  itemType: string;
  auctionType: string;
  auctionTarget: string;
  title: string;
  region: string;
  address: string;
  address2: string;
  saleDate: string;
  saleDateLabel: string;
  appraisalPrice: string;
  minPrice: string;
  bidDeposit: string;
  claimAmount: string;
  recommendedPrice: string;
  winningPrice: string;
  winningRatio: string;
  bidderCount: string;
  secondBidAmount: string;
  bidMethod: string;
  receivedAt: string;
  startedAt: string;
  dividendDeadline: string;
  remarks: string;
  appraisalSummary: string;
  exclusiveArea: string;
  landShareDenom: string;
  landShareNumer: string;
  landArea: string;
  buildingArea: string;
  saleShare: string;
  possessionNote: string;
  leaseNote: string;
  assumeRightsNote: string;
  chanceOpinion: string;
  safetyGrade: string;
  status: string;
  featured: boolean;
};

type DocSlotState = {
  type: AuctionDocType;
  /** court: available on court site but file not auto-pulled yet */
  courtStatus: "none" | "available" | "unavailable";
};

function formatMoneyDisplay(raw: string): string {
  const digits = String(raw).replace(/[^\d]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("ko-KR");
}

function moneyDigits(raw: string): string {
  return String(raw).replace(/[^\d]/g, "");
}

function splitStoredAddress(addr: string | null | undefined, addr2?: string | null): [string, string] {
  if (addr2) return [addr ?? "", addr2];
  if (!addr) return ["", ""];
  if (addr.includes("\n")) {
    const [a, b = ""] = addr.split("\n");
    return [a.trim(), b.trim()];
  }
  if (addr.includes(" / ")) {
    const parts = addr.split(" / ");
    return [(parts[0] ?? "").trim(), (parts[1] ?? "").trim()];
  }
  return [addr, ""];
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#4dabff]/50 focus:ring-1 focus:ring-[#4dabff]/30";
const autoClass = `${inputClass} border-emerald-400/35 bg-emerald-500/[0.07]`;

function formatCaseTail(serial: string, itemNo: number | null): string {
  if (!serial) return "";
  if (itemNo == null || itemNo < 1) return serial;
  return `${serial}(${itemNo})`;
}

function emptyForm(): FormState {
  return {
    court: "홍성지원",
    caseYear: "2025",
    caseTail: "",
    caseSerial: "",
    caseNumber: "",
    itemNo: null,
    formGroup: "",
    itemType: "",
    auctionType: "",
    auctionTarget: "",
    title: "",
    region: "",
    address: "",
    address2: "",
    saleDate: "",
    saleDateLabel: "",
    appraisalPrice: "",
    minPrice: "",
    bidDeposit: "",
    claimAmount: "",
    recommendedPrice: "",
    winningPrice: "",
    winningRatio: "",
    bidderCount: "",
    secondBidAmount: "",
    bidMethod: "기일입찰",
    receivedAt: "",
    startedAt: "",
    dividendDeadline: "",
    remarks: "",
    appraisalSummary: "",
    exclusiveArea: "",
    landShareDenom: "",
    landShareNumer: "",
    landArea: "",
    buildingArea: "",
    saleShare: "",
    possessionNote: "",
    leaseNote: "",
    assumeRightsNote: "",
    chanceOpinion: "",
    safetyGrade: "SAFE",
    status: "ONGOING",
    featured: false,
  };
}

/** 지원 예: 2025타경1111(1) · 2025-1111(1) · 2025타경1111 · 1111(1) · 1111 */
function parseCaseRef(input: string): { year?: string; serial?: string; itemNo?: number } {
  const s = input.trim();
  if (!s) return {};

  let m = s.match(/(\d{4})\s*타경\s*(\d+)\s*(?:\((\d+)\))?/i);
  if (m) {
    return {
      year: m[1],
      serial: m[2],
      itemNo: m[3] ? Math.max(1, Number(m[3])) : undefined,
    };
  }

  m = s.match(/(\d{4})\s*[-./]\s*(\d+)\s*(?:\((\d+)\))?/);
  if (m) {
    return {
      year: m[1],
      serial: m[2],
      itemNo: m[3] ? Math.max(1, Number(m[3])) : undefined,
    };
  }

  m = s.match(/^(\d+)\s*(?:\((\d+)\))?$/);
  if (m) {
    return {
      serial: m[1],
      itemNo: m[2] ? Math.max(1, Number(m[2])) : undefined,
    };
  }

  return {};
}

function parseCaseParts(caseNumber: string): { year: string; serial: string } {
  const parsed = parseCaseRef(caseNumber);
  if (parsed.serial) {
    return { year: parsed.year ?? "2025", serial: parsed.serial };
  }
  return { year: "2025", serial: caseNumber.replace(/\D/g, "") };
}

function applyParsedCaseRef(
  prev: FormState,
  raw: string,
): Pick<FormState, "caseYear" | "caseTail" | "caseSerial" | "caseNumber" | "itemNo"> | null {
  const parsed = parseCaseRef(raw);
  if (!parsed.serial) return null;
  const year = parsed.year ?? prev.caseYear;
  const itemNo = parsed.itemNo ?? prev.itemNo;
  return {
    caseYear: year,
    caseSerial: parsed.serial,
    caseTail: formatCaseTail(parsed.serial, itemNo),
    caseNumber: `${year}타경${parsed.serial}`,
    itemNo: itemNo ?? null,
  };
}

function inferFormGroup(auction: Auction): FormGroup {
  const t = `${auction.itemType ?? ""} ${auction.auctionTarget ?? ""} ${auction.rightsAnalysis ?? ""}`;
  if (/집합|전유|오피스텔|다세대|근린시설|아파트/.test(t) && !/토지만/.test(t)) {
    if (auction.landArea && auction.buildingArea && /일괄|토지 및 건물/.test(t)) return "HOUSE";
    if (!auction.landArea || auction.landArea === 0) return "UNIT";
  }
  if (/토지만|전답|임야|대지/.test(t) || (auction.landArea && !auction.buildingArea)) return "LAND";
  if (auction.landArea && auction.buildingArea) return "HOUSE";
  return "UNIT";
}

function sectionFromRights(text: string, key: string): string {
  const re = new RegExp(`\\[${key}\\]\\s*([\\s\\S]*?)(?=\\n\\n\\[|$)`);
  const m = text.match(re);
  return m?.[1]?.trim() ?? "";
}

function auctionToForm(auction?: Auction): FormState {
  if (!auction) return emptyForm();
  const { year, serial } = parseCaseParts(auction.caseNumber);
  const rights = auction.rightsAnalysis ?? "";
  const group = inferFormGroup(auction);
  return {
    ...emptyForm(),
    court: auction.court ?? "대구지방법원",
    caseYear: year,
    caseSerial: serial,
    caseTail: formatCaseTail(serial, auction.itemNo ?? null),
    caseNumber: auction.caseNumber,
    itemNo: auction.itemNo ?? null,
    formGroup: group,
    itemType: auction.itemType ?? "",
    auctionType: auction.auctionType ?? "",
    auctionTarget: auction.auctionTarget ?? "",
    title: auction.title,
    region: auction.region ?? "",
    address: splitStoredAddress(auction.address, auction.address2)[0],
    address2: splitStoredAddress(auction.address, auction.address2)[1],
    saleDate: auction.saleDate ? new Date(auction.saleDate).toISOString().slice(0, 10) : "",
    appraisalPrice: auction.appraisalPrice != null ? String(Math.round(auction.appraisalPrice)) : "",
    minPrice: auction.minPrice != null ? String(Math.round(auction.minPrice)) : "",
    bidDeposit: auction.bidDeposit != null ? String(Math.round(auction.bidDeposit)) : "",
    claimAmount: auction.claimAmount != null ? String(Math.round(auction.claimAmount)) : "",
    recommendedPrice:
      auction.recommendedPrice != null ? String(Math.round(auction.recommendedPrice)) : "",
    winningPrice: auction.winningPrice != null ? String(Math.round(auction.winningPrice)) : "",
    winningRatio: auction.winningRatio != null ? String(auction.winningRatio) : "",
    bidderCount: auction.bidderCount != null ? String(auction.bidderCount) : "",
    secondBidAmount:
      auction.secondBidAmount != null ? String(Math.round(auction.secondBidAmount)) : "",
    bidMethod: auction.bidMethod ?? "기일입찰",
    remarks: sectionFromRights(rights, "물건비고") || "",
    appraisalSummary: sectionFromRights(rights, "감정요약") || auction.description || "",
    possessionNote: sectionFromRights(rights, "점유"),
    leaseNote: sectionFromRights(rights, "임차"),
    assumeRightsNote: sectionFromRights(rights, "매수인 인수 권리"),
    saleShare: sectionFromRights(rights, "매각지분"),
    exclusiveArea: group === "UNIT" && auction.buildingArea != null ? String(auction.buildingArea) : "",
    landArea: auction.landArea != null ? String(auction.landArea) : "",
    buildingArea: group !== "UNIT" && auction.buildingArea != null ? String(auction.buildingArea) : "",
    chanceOpinion: auction.memo ?? "",
    safetyGrade: auction.safetyGrade,
    status: auction.status,
    featured: auction.featured,
  };
}

function fixtureToForm(f: CourtAuctionFixture): FormState {
  return {
    ...emptyForm(),
    court: f.court,
    caseYear: f.caseYear,
    caseSerial: f.caseSerial,
    caseTail: formatCaseTail(f.caseSerial, f.itemNo),
    caseNumber: f.caseNumber,
    itemNo: f.itemNo,
    formGroup: f.formGroup,
    itemType: f.itemType,
    auctionType: f.auctionType,
    auctionTarget:
      f.formGroup === "LAND"
        ? "토지만 매각"
        : f.formGroup === "HOUSE"
          ? "토지 및 건물일괄매각"
          : "구분건물 매각",
    title: f.title,
    region: f.region,
    address: f.parcels[0]?.address ?? "",
    address2: f.parcels[1]?.address ?? "",
    saleDate: f.saleDate,
    saleDateLabel: f.saleDateLabel,
    appraisalPrice: String(f.appraisalPrice),
    minPrice: String(f.minPrice),
    bidDeposit: String(f.bidDeposit),
    claimAmount: String(f.claimAmount),
    recommendedPrice: "",
    winningPrice: "",
    winningRatio: "",
    bidderCount: "",
    secondBidAmount: "",
    bidMethod: f.bidMethod,
    receivedAt: f.receivedAt,
    startedAt: f.startedAt,
    dividendDeadline: f.dividendDeadline,
    remarks: f.remarks,
    appraisalSummary: f.appraisalSummary,
    exclusiveArea: f.exclusiveArea != null ? String(f.exclusiveArea) : "",
    landShareDenom: f.landShareDenom != null ? String(f.landShareDenom) : "",
    landShareNumer: f.landShareNumer != null ? String(f.landShareNumer) : "",
    landArea: f.landArea != null ? String(f.landArea) : "",
    buildingArea: f.buildingArea != null ? String(f.buildingArea) : "",
    saleShare: f.saleShare ?? "",
    possessionNote: f.possessionNote,
    leaseNote: f.leaseNote,
    assumeRightsNote: f.assumeRightsNote,
  };
}

function buildRightsAnalysis(form: FormState, scheduleLines: string): string {
  const lines = [
    form.appraisalSummary ? `[감정요약] ${form.appraisalSummary}` : "",
    form.possessionNote ? `[점유] ${form.possessionNote}` : "",
    form.leaseNote ? `[임차] ${form.leaseNote}` : "",
    form.assumeRightsNote ? `[매수인 인수 권리] ${form.assumeRightsNote}` : "",
    form.saleShare ? `[매각지분] ${form.saleShare}` : "",
    form.remarks.trim() ? `[물건비고]\n${form.remarks.trim()}` : "",
    scheduleLines ? `[기일내역]\n${scheduleLines}` : "",
    form.landShareDenom && form.landShareNumer
      ? `[대지권] ${form.landShareDenom}분의 ${form.landShareNumer}`
      : "",
  ].filter(Boolean);
  return lines.join("\n\n");
}

type AuctionFormProps = { initial?: Auction };

export function AuctionForm({ initial }: AuctionFormProps) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<FormState>(() => auctionToForm(initial));
  const [parcels, setParcels] = useState<CourtAuctionFixture["parcels"]>([]);
  const [schedule, setSchedule] = useState<CourtAuctionFixture["schedule"]>([]);
  const [docSlots, setDocSlots] = useState<DocSlotState[]>(() =>
    AUCTION_DOC_SLOTS.map((s) => ({ type: s.type, courtStatus: "none" as const })),
  );
  const [images, setImages] = useState<string[]>(() => parseImages(initial?.images || "[]"));
  const [attachments, setAttachments] = useState<AuctionAttachment[]>(() =>
    parseAuctionAttachments(initial?.attachments || "[]"),
  );
  const slotUploadRef = useRef<HTMLInputElement>(null);
  const [slotUploading, setSlotUploading] = useState<AuctionDocType | null>(null);
  const [autoKeys, setAutoKeys] = useState<Set<string>>(new Set());
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [itemChoices, setItemChoices] = useState<CourtAuctionFixture[] | null>(null);
  const [filled, setFilled] = useState(Boolean(initial));
  const photoRef = useRef<HTMLInputElement>(null);
  const [pendingDocType, setPendingDocType] = useState<AuctionDocType | null>(null);
  function setMoneyField(key: keyof FormState, value: string) {
    setField(key, moneyDigits(value) as FormState[typeof key]);
  }

  function setWinningPrice(value: string) {
    const digits = moneyDigits(value);
    setField("winningPrice", digits);
    const win = Number(digits);
    const app = Number(moneyDigits(form.appraisalPrice));
    if (win > 0 && app > 0) {
      setField("winningRatio", String(Math.round((win / app) * 1000) / 10));
    }
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setAutoKeys((prev) => {
      if (!prev.has(key as string)) return prev;
      const next = new Set(prev);
      next.delete(key as string);
      return next;
    });
  }

  function applyFixture(f: CourtAuctionFixture) {
    const next = fixtureToForm(f);
    if (!next.title) {
      next.title = suggestAuctionTitle({
        itemType: next.itemType,
        landArea: next.landArea ? Number(next.landArea) : null,
        buildingArea: next.exclusiveArea
          ? Number(next.exclusiveArea)
          : next.buildingArea
            ? Number(next.buildingArea)
            : null,
        appraisalPrice: Number(next.appraisalPrice || 0),
        minPrice: Number(next.minPrice || 0),
        saleDate: next.saleDate,
      });
    }
    setForm(next);
    setParcels(f.parcels.slice(0, 2));
    setSchedule(f.schedule);
    setDocSlots(
      AUCTION_DOC_SLOTS.map((s) => {
        if (!s.courtLinked) return { type: s.type, courtStatus: "none" as const };
        const hit = f.documents.find((d) => d.type === s.type);
        if (!hit) return { type: s.type, courtStatus: "none" as const };
        if (hit.status === "unavailable") return { type: s.type, courtStatus: "unavailable" as const };
        if (hit.status === "attached") return { type: s.type, courtStatus: "available" as const };
        return { type: s.type, courtStatus: "none" as const };
      }),
    );
    setItemChoices(null);
    setFilled(true);
    setAutoKeys(
      new Set([
        "court",
        "caseNumber",
        "itemNo",
        "formGroup",
        "itemType",
        "auctionType",
        "title",
        "region",
        "address",
        "address2",
        "saleDate",
        "appraisalPrice",
        "minPrice",
        "bidDeposit",
        "claimAmount",
        "bidMethod",
        "remarks",
        "appraisalSummary",
        "exclusiveArea",
        "landArea",
        "buildingArea",
        "saleShare",
        "possessionNote",
        "leaseNote",
        "assumeRightsNote",
      ]),
    );
    setToast(`${f.caseNumber} 물건 ${f.itemNo} · ${groupLabel(f.formGroup)} 자동입력 완료`);
  }

  function applyFetchedMatches(
    matches: CourtAuctionFixture[],
    preferredItem: number | undefined,
    year: string,
    serial: string,
    source: "cache" | "live",
  ) {
    if (matches.length > 1) {
      const picked = preferredItem
        ? matches.find((m) => m.itemNo === preferredItem)
        : undefined;
      if (picked) {
        applyFixture(picked);
        setToast(
          `${picked.caseNumber} 물건 ${picked.itemNo} · ${source === "live" ? "실시간" : "캐시"} 불러오기 완료`,
        );
        return;
      }
      setItemChoices(matches);
      setForm((prev) => ({
        ...prev,
        caseYear: year,
        caseSerial: serial,
        caseTail: formatCaseTail(serial, null),
        caseNumber: matches[0].caseNumber,
        itemNo: null,
      }));
      setToast(`${matches[0].caseNumber} — 물건 ${matches.length}개. 번호를 선택하세요.`);
      return;
    }
    applyFixture(matches[0]);
    setToast(
      `${matches[0].caseNumber} 물건 ${matches[0].itemNo} · ${source === "live" ? "실시간" : "캐시"} 불러오기 완료`,
    );
  }

  async function handleFetch(serialOverride?: string, itemNoOverride?: number) {
    setFetching(true);
    setError("");
    setToast("");
    setItemChoices(null);
    const fromOverride = serialOverride ? parseCaseRef(serialOverride) : {};
    const serial = (fromOverride.serial ?? form.caseSerial).replace(/\D/g, "");
    const year = fromOverride.year ?? form.caseYear;
    const preferredItem =
      itemNoOverride ??
      fromOverride.itemNo ??
      (form.itemNo != null && form.itemNo > 0 ? form.itemNo : undefined);

    if (!serial) {
      setFetching(false);
      setError("타경 숫자를 입력해 주세요.");
      return;
    }

    // 1) local cache first
    const cached = findFixturesByCase(form.court, serial);
    if (cached.length > 0) {
      await new Promise((r) => setTimeout(r, 400));
      setFetching(false);
      applyFetchedMatches(cached, preferredItem, year, serial, "cache");
      return;
    }

    // 2) live courtauction.go.kr
    setToast("법원경매 사이트에서 조회 중…");
    try {
      const res = await fetch("/api/admin/auctions/court-fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          court: form.court,
          caseYear: year,
          caseSerial: serial,
          itemNo: preferredItem ?? null,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        items?: CourtAuctionFixture[];
      };
      setFetching(false);
      if (!res.ok || !data.ok || !data.items?.length) {
        setToast("");
        setError(data.error ?? "법원에서 사건을 불러오지 못했습니다.");
        setForm((prev) => ({
          ...prev,
          caseYear: year,
          caseSerial: serial,
          caseTail: formatCaseTail(serial, preferredItem ?? null),
          caseNumber: `${year}타경${serial}`,
          itemNo: preferredItem ?? null,
        }));
        return;
      }
      applyFetchedMatches(data.items, preferredItem, year, serial, "live");
    } catch {
      setFetching(false);
      setToast("");
      setError("법원 조회 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  async function uploadImages(fileList: FileList | null) {
    if (!fileList?.length) return;
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setError("사진은 최대 8장까지 등록할 수 있습니다.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("kind", "auctions");
      for (const file of Array.from(fileList).slice(0, remaining)) {
        body.append("files", file);
      }
      const res = await fetch("/api/admin/uploads", { method: "POST", body });
      const data = (await res.json()) as { urls?: string[]; error?: string };
      if (!res.ok) {
        setError(data.error ?? "업로드에 실패했습니다.");
        return;
      }
      setImages((prev) => [...prev, ...(data.urls ?? [])].slice(0, MAX_IMAGES));
    } catch {
      setError("업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
      if (photoRef.current) photoRef.current.value = "";
    }
  }

  async function uploadDocSlot(type: AuctionDocType, fileList: FileList | null) {
    if (!fileList?.length) return;
    setSlotUploading(type);
    setError("");
    try {
      const body = new FormData();
      body.append("kind", "auctions");
      body.append("files", fileList[0]);
      const res = await fetch("/api/admin/uploads", { method: "POST", body });
      const data = (await res.json()) as { urls?: string[]; error?: string };
      if (!res.ok) {
        setError(data.error ?? "서류 업로드에 실패했습니다.");
        return;
      }
      const url = data.urls?.[0];
      if (!url) return;
      const name = fileList[0].name || url.split("/").pop() || "file";
      setAttachments((prev) => {
        const rest = prev.filter((a) => a.type !== type);
        return [...rest, { type, url, name }];
      });
      setToast("서류가 첨부되었습니다.");
    } catch {
      setError("서류 업로드 중 오류가 발생했습니다.");
    } finally {
      setSlotUploading(null);
      if (slotUploadRef.current) slotUploadRef.current.value = "";
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    const caseNumber =
      form.caseNumber.trim() ||
      (form.caseSerial ? `${form.caseYear}타경${form.caseSerial}` : "");
    if (!caseNumber) {
      setError("사건번호가 필요합니다. 법원 불러오기 또는 수동 입력하세요.");
      setSaving(false);
      return;
    }

    const landArea =
      form.landArea !== "" && form.landArea != null ? Number(form.landArea) : null;
    const buildingArea =
      form.formGroup === "UNIT"
        ? form.exclusiveArea !== ""
          ? Number(form.exclusiveArea)
          : null
        : form.buildingArea !== ""
          ? Number(form.buildingArea)
          : null;

    let title = form.title.trim();
    if (!title) {
      title = suggestAuctionTitle({
        itemType: form.itemType,
        landArea,
        buildingArea,
        appraisalPrice: Number(form.appraisalPrice || 0),
        minPrice: Number(form.minPrice || 0),
        saleDate: form.saleDate,
      });
    }

    const scheduleLines = schedule
      .map(
        (s) =>
          `${s.date} ${s.kind} ${s.minPrice != null ? `${s.minPrice.toLocaleString("ko-KR")}원` : ""} ${s.result}`.trim(),
      )
      .join("\n");

    const payload = {
      caseNumber,
      itemNo: form.itemNo != null && form.itemNo > 0 ? form.itemNo : 1,
      title,
      description: form.appraisalSummary || form.chanceOpinion || "",
      court: form.court,
      saleDate: form.saleDate || null,
      address: form.address || null,
      address2: form.address2 || null,
      region: form.region || null,
      auctionType: form.auctionType || null,
      itemType: form.itemType || null,
      auctionTarget: form.auctionTarget || null,
      bidMethod: form.bidMethod || null,
      landArea,
      buildingArea,
      appraisalPrice: Number(moneyDigits(form.appraisalPrice) || 0),
      minPrice: moneyDigits(form.minPrice) ? Number(moneyDigits(form.minPrice)) : null,
      bidDeposit: moneyDigits(form.bidDeposit) ? Number(moneyDigits(form.bidDeposit)) : null,
      claimAmount: moneyDigits(form.claimAmount) ? Number(moneyDigits(form.claimAmount)) : null,
      recommendedPrice: moneyDigits(form.recommendedPrice)
        ? Number(moneyDigits(form.recommendedPrice))
        : null,
      winningPrice: moneyDigits(form.winningPrice) ? Number(moneyDigits(form.winningPrice)) : null,
      winningRatio: form.winningRatio !== "" ? Number(form.winningRatio) : null,
      bidderCount: form.bidderCount !== "" ? Number(form.bidderCount) : null,
      secondBidAmount: moneyDigits(form.secondBidAmount)
        ? Number(moneyDigits(form.secondBidAmount))
        : null,
      rightsAnalysis: buildRightsAnalysis(form, scheduleLines),
      memo: form.chanceOpinion || null,
      images,
      attachments,
      safetyGrade: form.safetyGrade,
      status: form.status,
      featured: form.featured,
    };

    try {
      const url = initial ? `/api/admin/auctions/${initial.id}` : "/api/admin/auctions";
      const method = initial ? "PATCH" : "POST";

      async function save(extra?: Record<string, unknown>) {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, ...extra }),
        });
        const data = (await res.json().catch(() => ({}))) as ManageCodeConflictResponse;
        return { res, data };
      }

      let { res, data } = await save();

      if (!isEdit && res.status === 409 && data.code === "MANAGE_CODE_CONFLICT" && data.manageCode) {
        const action = askManageCodeConflict(data.manageCode);
        if (!action) {
          setError("저장을 취소했습니다.");
          setSaving(false);
          return;
        }
        ({ res, data } = await save({
          manageCode: data.manageCode,
          conflictAction: action,
        }));
      }

      if (!res.ok) {
        setError(data.error ?? "저장에 실패했습니다.");
        setSaving(false);
        return;
      }
      navigateTo("/admin/auctions");
    } catch {
      setError("저장 중 오류가 발생했습니다.");
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4200);
    return () => clearTimeout(t);
  }, [toast]);

  const appraisal = Number(moneyDigits(form.appraisalPrice) || 0);
  const minPrice = Number(moneyDigits(form.minPrice) || 0);
  const minPct = appraisal > 0 && minPrice > 0 ? Math.round((minPrice / appraisal) * 1000) / 10 : null;
  const cls = (key: string) => (autoKeys.has(key) ? autoClass : inputClass);

  return (
    <div className="mx-auto max-w-5xl pb-28 font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-200">
      <p className="mb-4 text-sm text-slate-400">
        {isEdit
          ? "기존 경매를 수정합니다. 법원 불러오기로 덮어쓸 수도 있습니다."
          : "관할법원·사건번호를 입력해 불러온 뒤 저장하세요."}
      </p>
      <p className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200">
        <span className="text-slate-400">관리번호 · </span>
        <span className="font-medium tabular-nums text-[#d4bfff]">
          {initial?.manageCode || "등록 저장 시 자동 생성 (경매_00000000)"}
        </span>
      </p>

      <GlassCard className="relative overflow-hidden p-5 md:p-6">
        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
          <div className="hr-aurora-layer hr-aurora-violet absolute inset-0" />
        </div>
        <div className="relative z-10">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#d4bfff]" />
            <h2 className="text-sm font-bold text-white">법원경매 불러오기</h2>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
              캐시 우선 · 없으면 실시간 조회
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_auto_1fr_0.55fr_auto]">
            <label className="block text-xs text-slate-400">
              관할법원
              <select
                className={`${inputClass} mt-1`}
                value={form.court}
                onChange={(e) => setField("court", e.target.value)}
              >
                {COURT_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs text-slate-400">
              사건번호 (연도)
              <select
                className={`${inputClass} mt-1`}
                value={form.caseYear}
                onChange={(e) => {
                  const year = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    caseYear: year,
                    caseNumber: prev.caseSerial ? `${year}타경${prev.caseSerial}` : prev.caseNumber,
                    caseTail: prev.caseSerial ? formatCaseTail(prev.caseSerial, prev.itemNo) : prev.caseTail,
                  }));
                }}
                aria-label="사건번호 연도"
              >
                {["2026", "2025", "2024", "2023"].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs text-slate-400">
              타경
              <div
                className="mt-1 flex h-[42px] items-center justify-center rounded-xl border border-white/10 bg-black/20 px-3 text-sm font-semibold text-slate-200"
                aria-hidden
              >
                타경
              </div>
            </label>
            <label className="block text-xs text-slate-400">
              숫자
              <input
                className={`${inputClass} mt-1`}
                value={form.caseSerial}
                onChange={(e) => {
                  const serial = e.target.value.replace(/\D/g, "");
                  setForm((prev) => ({
                    ...prev,
                    caseSerial: serial,
                    caseTail: serial ? formatCaseTail(serial, prev.itemNo) : "",
                    caseNumber: serial ? `${prev.caseYear}타경${serial}` : "",
                  }));
                }}
                onPaste={(e) => {
                  const text = e.clipboardData.getData("text");
                  const applied = applyParsedCaseRef(form, text);
                  if (!applied) return;
                  e.preventDefault();
                  setForm((prev) => ({ ...prev, ...applied }));
                }}
                placeholder="1111"
                inputMode="numeric"
                aria-label="타경 숫자"
              />
            </label>
            <label className="block text-xs text-slate-400">
              물건번호
              <input
                className={`${inputClass} mt-1`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.itemNo ?? ""}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  if (!digits) {
                    setForm((prev) => ({
                      ...prev,
                      itemNo: null,
                      caseTail: prev.caseSerial ? formatCaseTail(prev.caseSerial, null) : "",
                    }));
                    return;
                  }
                  const n = Math.max(1, Number(digits));
                  setForm((prev) => ({
                    ...prev,
                    itemNo: n,
                    caseTail: prev.caseSerial ? formatCaseTail(prev.caseSerial, n) : prev.caseTail,
                  }));
                }}
                placeholder="있을 때만"
                aria-label="물건번호"
              />
            </label>
            <div className="flex items-end">
              <button
                type="button"
                disabled={fetching || !form.caseSerial}
                onClick={() => void handleFetch()}
                className="inline-flex h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-4 text-sm font-bold text-white shadow-lg shadow-[#913dff]/25 disabled:opacity-40"
              >
                {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                불러오기
              </button>
            </div>
          </div>

          {itemChoices && (
            <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4">
              <p className="mb-2 text-xs font-semibold text-amber-100">물건번호 선택</p>
              <div className="flex flex-wrap gap-2">
                {itemChoices.map((it) => (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => applyFixture(it)}
                    className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-left text-sm text-white hover:border-[#4dabff]/50"
                  >
                    <span className="font-bold text-[#d4bfff]">물건 {it.itemNo}</span>
                    <span className="mt-0.5 block text-xs text-slate-300">{it.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      <div className="mt-6 flex flex-wrap gap-2 text-[11px]">
        {["기본", "가격·기일", "물건상세", "감정요약", "서류", "사진", "찬스의견", "추천입찰가", "낙찰결과"].map((label, i) => (
          <span
            key={label}
            className={`rounded-full border px-2.5 py-1 ${
              filled ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200" : "border-white/10 text-slate-500"
            }`}
          >
            {i + 1}. {label}
          </span>
        ))}
        {form.formGroup && (
          <span className="rounded-full border border-[#913dff]/40 bg-[#913dff]/15 px-2.5 py-1 font-semibold text-[#d4bfff]">
            {form.formGroup} · {groupLabel(form.formGroup as FormGroup)}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-5">
        <Section n={1} title="기본정보">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="사건번호">
              <input
                className={cls("caseNumber")}
                value={form.caseNumber || (form.caseSerial ? `${form.caseYear}타경${form.caseSerial}` : "")}
                placeholder="상단에서 연도·타경 뒷자리 입력"
                readOnly
              />
            </Field>
            <Field label="물건번호">
              <input
                className={cls("itemNo")}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.itemNo ?? ""}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  if (!digits) {
                    setForm((prev) => ({
                      ...prev,
                      itemNo: null,
                      caseTail: prev.caseSerial ? formatCaseTail(prev.caseSerial, null) : "",
                    }));
                    return;
                  }
                  const n = Math.max(1, Number(digits));
                  setForm((prev) => ({
                    ...prev,
                    itemNo: n,
                    caseTail: prev.caseSerial ? formatCaseTail(prev.caseSerial, n) : prev.caseTail,
                    caseNumber: prev.caseSerial
                      ? `${prev.caseYear}타경${prev.caseSerial}`
                      : prev.caseNumber,
                  }));
                }}
                placeholder="있을 때만"
              />
            </Field>
            <Field label="경매종류">
              <input
                className={cls("auctionType")}
                value={form.auctionType}
                onChange={(e) => setField("auctionType", e.target.value)}
              />
            </Field>
            <Field label="물건종류">
              <input
                className={cls("itemType")}
                value={form.itemType}
                onChange={(e) => setField("itemType", e.target.value)}
              />
            </Field>
            <Field label="제목 *" className="md:col-span-2">
              <input
                className={cls("title")}
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
              />
            </Field>
            <Field label="소재지 1" className="md:col-span-2">
              <input
                className={cls("address")}
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                placeholder="목록1 소재지"
              />
            </Field>
            <Field label="소재지 2" className="md:col-span-2">
              <input
                className={cls("address2")}
                value={form.address2}
                onChange={(e) => setField("address2", e.target.value)}
                placeholder="목록2 소재지 (없으면 비움 · 최대 2건 저장)"
              />
            </Field>
            <Field label="지역 태그">
              <input
                className={cls("region")}
                value={form.region}
                onChange={(e) => setField("region", e.target.value)}
              />
            </Field>
            <Field label="상태 / 안전등급 / Featured">
              <div className="flex flex-wrap gap-2">
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value)}
                >
                  <option value="ONGOING">진행중</option>
                  <option value="CLOSED">낙찰/종결</option>
                  <option value="FAILED">유찰</option>
                </select>
                <select
                  className={inputClass}
                  value={form.safetyGrade}
                  onChange={(e) => setField("safetyGrade", e.target.value)}
                >
                  <option value="SAFE">안전</option>
                  <option value="CAUTION">주의</option>
                  <option value="RISK">위험</option>
                </select>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setField("featured", e.target.checked)}
                  />
                  Featured
                </label>
              </div>
            </Field>
          </div>
        </Section>

        <Section n={2} title="가격 · 기일">
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="감정가 (원)">
              <input
                className={`${cls("appraisalPrice")} tabular-nums`}
                inputMode="numeric"
                value={formatMoneyDisplay(form.appraisalPrice)}
                onChange={(e) => setMoneyField("appraisalPrice", e.target.value)}
              />
            </Field>
            <Field label={`최저가 (원)${minPct != null ? ` · ${minPct}%` : ""}`}>
              <input
                className={`${cls("minPrice")} tabular-nums`}
                inputMode="numeric"
                value={formatMoneyDisplay(form.minPrice)}
                onChange={(e) => setMoneyField("minPrice", e.target.value)}
              />
            </Field>
            <Field label="입찰보증금 (원)">
              <input
                className={`${cls("bidDeposit")} tabular-nums`}
                inputMode="numeric"
                value={formatMoneyDisplay(form.bidDeposit)}
                onChange={(e) => setMoneyField("bidDeposit", e.target.value)}
              />
            </Field>
            <Field label="청구금액 (원)">
              <input
                className={`${cls("claimAmount")} tabular-nums`}
                inputMode="numeric"
                value={formatMoneyDisplay(form.claimAmount)}
                onChange={(e) => setMoneyField("claimAmount", e.target.value)}
              />
            </Field>
            <Field label="입찰방법">
              <input
                className={cls("bidMethod")}
                value={form.bidMethod}
                onChange={(e) => setField("bidMethod", e.target.value)}
              />
            </Field>
            <Field label="매각기일 (연-월-일)">
              <div className="flex gap-2">
                <input
                  type="text"
                  className={`${cls("saleDate")} tabular-nums`}
                  placeholder="2026-07-19"
                  value={form.saleDate}
                  onChange={(e) => setField("saleDate", e.target.value)}
                />
                <input
                  type="date"
                  className="w-[42px] shrink-0 rounded-xl border border-white/10 bg-black/30 px-1 text-sm text-slate-100"
                  value={/^\d{4}-\d{2}-\d{2}$/.test(form.saleDate) ? form.saleDate : ""}
                  onChange={(e) => setField("saleDate", e.target.value)}
                  title="달력 선택"
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-500">형식: YYYY-MM-DD (예: 2026-07-19)</p>
            </Field>
          </div>
          {schedule.length > 0 && (
            <div className="data-table mt-4 max-h-56 overflow-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs text-[#cbd5e1]">
                <thead>
                  <tr className="bg-[#0B0F19]/90">
                    <th className="px-3 py-2">기일</th>
                    <th className="px-3 py-2">종류</th>
                    <th className="px-3 py-2">최저가</th>
                    <th className="px-3 py-2">결과</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row) => (
                    <tr key={`${row.date}-${row.kind}`} className="border-t border-white/5">
                      <td className="px-3 py-2">{row.date}</td>
                      <td className="px-3 py-2">{row.kind}</td>
                      <td className="px-3 py-2">{row.minPrice != null ? formatWon(row.minPrice) : "—"}</td>
                      <td className="px-3 py-2">{row.result || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        <GlassCard className="border-amber-400/25 bg-amber-500/[0.06] p-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-100">
            <AlertTriangle className="h-4 w-4" />
            물건비고
          </div>
          <textarea
            className={`${cls("remarks")} min-h-[80px] whitespace-pre-wrap`}
            value={form.remarks}
            onChange={(e) => setField("remarks", e.target.value)}
            placeholder="농취증, 우선매수권, 재매각 조건 등"
          />
        </GlassCard>

        <Section n={3} title="물건상세">
          {parcels.length > 0 && (
            <div className="mb-4 overflow-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs text-[#cbd5e1]">
                <thead>
                  <tr className="bg-white/[0.04]">
                    <th className="px-3 py-2">목록</th>
                    <th className="px-3 py-2">구분</th>
                    <th className="px-3 py-2">소재지</th>
                    <th className="px-3 py-2">상세</th>
                  </tr>
                </thead>
                <tbody>
                  {parcels.map((p) => (
                    <tr key={p.no} className="border-t border-white/5">
                      <td className="px-3 py-2">{p.no}</td>
                      <td className="px-3 py-2">{p.listKind}</td>
                      <td className="px-3 py-2">{p.address}</td>
                      <td className="px-3 py-2 text-slate-400">{p.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {form.formGroup === "UNIT" && (
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="전유면적 (㎡)">
                <input
                  className={cls("exclusiveArea")}
                  value={form.exclusiveArea}
                  onChange={(e) => setField("exclusiveArea", e.target.value)}
                />
              </Field>
              <Field label="대지권 분모">
                <input
                  className={cls("landShareDenom")}
                  value={form.landShareDenom}
                  onChange={(e) => setField("landShareDenom", e.target.value)}
                />
              </Field>
              <Field label="대지권 분자">
                <input
                  className={cls("landShareNumer")}
                  value={form.landShareNumer}
                  onChange={(e) => setField("landShareNumer", e.target.value)}
                />
              </Field>
            </div>
          )}

          {form.formGroup === "HOUSE" && (
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="토지면적 (㎡)">
                <input
                  className={cls("landArea")}
                  value={form.landArea}
                  onChange={(e) => setField("landArea", e.target.value)}
                />
              </Field>
              <Field label="건물면적 (㎡)">
                <input
                  className={cls("buildingArea")}
                  value={form.buildingArea}
                  onChange={(e) => setField("buildingArea", e.target.value)}
                />
              </Field>
            </div>
          )}

          {form.formGroup === "LAND" && (
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="토지 합계면적 (㎡)">
                <input
                  className={cls("landArea")}
                  value={form.landArea}
                  onChange={(e) => setField("landArea", e.target.value)}
                />
              </Field>
              <Field label="매각지분">
                <input
                  className={cls("saleShare")}
                  value={form.saleShare}
                  onChange={(e) => setField("saleShare", e.target.value)}
                />
              </Field>
            </div>
          )}

          {!form.formGroup && (
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="토지면적 (㎡)">
                <input
                  className={inputClass}
                  value={form.landArea}
                  onChange={(e) => setField("landArea", e.target.value)}
                />
              </Field>
              <Field label="건물/전유면적 (㎡)">
                <input
                  className={inputClass}
                  value={form.buildingArea || form.exclusiveArea}
                  onChange={(e) => {
                    setField("buildingArea", e.target.value);
                    setField("exclusiveArea", e.target.value);
                  }}
                />
              </Field>
            </div>
          )}

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Field label="점유">
              <input
                className={cls("possessionNote")}
                value={form.possessionNote}
                onChange={(e) => setField("possessionNote", e.target.value)}
              />
            </Field>
            <Field label="임차관계">
              <input
                className={cls("leaseNote")}
                value={form.leaseNote}
                onChange={(e) => setField("leaseNote", e.target.value)}
              />
            </Field>
            <Field label="매수인 인수 권리">
              <input
                className={cls("assumeRightsNote")}
                value={form.assumeRightsNote}
                onChange={(e) => setField("assumeRightsNote", e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section n={4} title="감정요약">
          <textarea
            className={`${cls("appraisalSummary")} min-h-[120px]`}
            value={form.appraisalSummary}
            onChange={(e) => setField("appraisalSummary", e.target.value)}
          />
        </Section>

        <Section
          n={5}
          title="서류 첨부"
          hint="법원 PDF 자동 다운로드는 아직 연동 전입니다. 제공 여부는 불러오기 시 표시되며, 파일은 슬롯별 수동 첨부(이미지/PDF)하세요."
        >
          <input
            ref={slotUploadRef}
            type="file"
            accept="image/*,.pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (pendingDocType) void uploadDocSlot(pendingDocType, e.target.files);
              setPendingDocType(null);
            }}
          />
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {AUCTION_DOC_SLOTS.map((slot) => {
              const state = docSlots.find((d) => d.type === slot.type);
              const file = attachments.find((a) => a.type === slot.type);
              const courtHint =
                state?.courtStatus === "available"
                  ? "법원 제공 확인 · 자동다운 대기 → 수동 첨부"
                  : state?.courtStatus === "unavailable"
                    ? "법원 미제공/해당없음 · 수동 첨부 가능"
                    : slot.courtLinked
                      ? "수동 첨부"
                      : "수동 첨부 전용";
              return (
                <div key={slot.type} className="rounded-xl border border-white/10 bg-black/25 p-4">
                  <div className="flex items-start gap-2">
                    <FileText className={`h-5 w-5 ${file ? "text-emerald-300" : "text-slate-500"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white">{slot.label}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">{courtHint}</p>
                      {file ? (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 block truncate text-[11px] text-[#4dabff] hover:underline"
                        >
                          {file.name}
                        </a>
                      ) : (
                        <p className="mt-1 text-[11px] text-slate-600">첨부 없음</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      disabled={slotUploading === slot.type}
                      onClick={() => {
                        setPendingDocType(slot.type);
                        slotUploadRef.current?.click();
                      }}
                      className="flex-1 rounded-lg border border-white/10 py-1.5 text-[11px] text-slate-200 hover:bg-white/5"
                    >
                      {slotUploading === slot.type ? "업로드…" : file ? "교체" : "첨부"}
                    </button>
                    {file && (
                      <button
                        type="button"
                        onClick={() => setAttachments((list) => list.filter((a) => a.type !== slot.type))}
                        className="rounded-lg border border-white/10 px-2 py-1.5 text-[11px] text-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        <Section n={6} title="사진" hint="복수 첨부 가능 · 최대 8장 · 법원 사진은 직접 다운받아 첨부">
          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => void uploadImages(e.target.files)}
          />
          <div className="flex flex-wrap gap-3">
            {images.map((url, i) => (
              <div key={url} className="relative h-24 w-24 overflow-hidden rounded-xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  className="absolute right-1 top-1 rounded-full bg-black/70 p-1"
                  onClick={() => setImages((list) => list.filter((_, idx) => idx !== i))}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              disabled={uploading || images.length >= MAX_IMAGES}
              onClick={() => photoRef.current?.click()}
              className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/20 text-slate-400 hover:border-[#4dabff]/50 disabled:opacity-40"
            >
              <ImagePlus className="h-5 w-5" />
              <span className="text-[10px]">추가 ({images.length}/{MAX_IMAGES})</span>
            </button>
          </div>
        </Section>

        <Section n={7} title="찬스부동산 의견" hint="고객 안내용 · 권리분석과 별도 저장(memo)">
          <textarea
            className={`${inputClass} min-h-[140px]`}
            value={form.chanceOpinion}
            onChange={(e) => setField("chanceOpinion", e.target.value)}
            placeholder="유찰 횟수·최저가 메리트, 임차·우선매수권 리스크, 입찰 시 주의점…"
            maxLength={2000}
          />
          <p className="mt-1 text-right text-[11px] text-slate-500">{form.chanceOpinion.length}/2000</p>
        </Section>

        <Section n={8} title="추천입찰가격">
          <Field label="추천입찰가격 (원)">
            <input
              className={`${inputClass} max-w-md tabular-nums`}
              inputMode="numeric"
              value={formatMoneyDisplay(form.recommendedPrice)}
              onChange={(e) => setMoneyField("recommendedPrice", e.target.value)}
              placeholder="예: 350,000,000"
            />
          </Field>
        </Section>

        <Section n={9} title="낙찰결과">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="낙찰가격 (원)">
              <input
                className={`${inputClass} tabular-nums`}
                inputMode="numeric"
                value={formatMoneyDisplay(form.winningPrice)}
                onChange={(e) => setWinningPrice(e.target.value)}
              />
            </Field>
            <Field label="감정가대비 낙찰가율 (%)">
              <input
                className={`${inputClass} tabular-nums`}
                inputMode="decimal"
                value={form.winningRatio}
                onChange={(e) => setField("winningRatio", e.target.value)}
                placeholder="낙찰가 입력 시 자동 계산"
              />
            </Field>
            <Field label="입찰참여인원">
              <input
                className={`${inputClass} tabular-nums`}
                inputMode="numeric"
                value={form.bidderCount}
                onChange={(e) => setField("bidderCount", e.target.value.replace(/[^\d]/g, ""))}
              />
            </Field>
            <Field label="차순위금액 (원)">
              <input
                className={`${inputClass} tabular-nums`}
                inputMode="numeric"
                value={formatMoneyDisplay(form.secondBidAmount)}
                onChange={(e) => setMoneyField("secondBidAmount", e.target.value)}
              />
            </Field>
          </div>
        </Section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0B0F19]/92 px-4 py-3 backdrop-blur-md md:left-[var(--admin-sidebar-w,0px)]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            {filled ? (
              <span className="inline-flex items-center gap-1 text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" /> {isEdit ? "수정 모드" : "자동입력 가능"} · 민트 =
                법원 데이터
              </span>
            ) : (
              "사건을 불러오거나 직접 입력 후 저장"
            )}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (initial) {
                  setForm(auctionToForm(initial));
                  setImages(parseImages(initial.images || "[]"));
                  setAttachments(parseAuctionAttachments(initial.attachments || "[]"));
                  setParcels([]);
                  setSchedule([]);
                  setDocSlots(
                    AUCTION_DOC_SLOTS.map((s) => ({ type: s.type, courtStatus: "none" as const })),
                  );
                  setAutoKeys(new Set());
                  setFilled(true);
                  setToast("원본으로 되돌렸습니다.");
                } else {
                  setForm(emptyForm());
                  setImages([]);
                  setAttachments([]);
                  setParcels([]);
                  setSchedule([]);
                  setDocSlots(
                    AUCTION_DOC_SLOTS.map((s) => ({ type: s.type, courtStatus: "none" as const })),
                  );
                  setAutoKeys(new Set());
                  setFilled(false);
                  setToast("초기화했습니다.");
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {isEdit ? "되돌리기" : "초기화"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => void handleSave()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-5 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              {isEdit ? "수정 저장" : "등록 저장"}
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/15 bg-[#121826] px-4 py-2 text-xs text-slate-100 shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

function Section({
  n,
  title,
  hint,
  children,
}: {
  n: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <GlassCard className="p-5 md:p-6">
      <div className="mb-4 flex items-baseline gap-3 border-b border-white/10 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#4dabff] to-[#913dff] text-xs font-extrabold text-white">
          {n}
        </span>
        <div>
          <h2 className="text-base font-bold text-white">{title}</h2>
          {hint && <p className="mt-0.5 text-[11px] text-slate-500">{hint}</p>}
        </div>
      </div>
      {children}
    </GlassCard>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block text-xs text-slate-400 ${className}`}>
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}
