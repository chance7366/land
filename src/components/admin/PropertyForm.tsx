"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleAlert,
  FileImage,
  ImagePlus,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { FlyerPreviewModal } from "@/components/flyer/FlyerPreviewModal";
import { WindowFlyerPreviewModal } from "@/components/flyer/WindowFlyerPreviewModal";
import {
  mapPropertyToFlyer,
  propertyFormToFlyerSource,
} from "@/lib/flyer/map-property";
import { mapPropertyToWindowFlyer } from "@/lib/flyer/map-property-window";
import type { FlyerViewModel } from "@/lib/flyer/types";
import type { WindowFlyerViewModel } from "@/lib/flyer/window-types";
import { navigateTo } from "@/lib/navigate";
import type { Property, PropertyCategory, PropertyType } from "@prisma/client";
import { GlassCard } from "@/components/ui/GlassCard";
import { PROPERTY_TAGS, suggestPropertyTitle } from "@/lib/property-fields";
import { parseImages, parseTags } from "@/lib/format";
import { askManageCodeConflict, type ManageCodeConflictResponse } from "@/lib/manage-code-conflict";
import { lintPropertyAdCopy } from "@/lib/property-ad-linter";
import {
  MAINTENANCE_BREAKDOWN_KEYS,
  needsMaintenanceBreakdown,
  type MaintenanceMode,
} from "@/lib/property-maintenance";
import { OFFICE_PROFILE } from "@/lib/office-profile";
import {
  CATEGORY_GROUP_LABELS,
  CATEGORY_GROUP_OPTIONS,
  DEAL_SUBTYPE_OPTIONS,
  DEAL_TYPE_OPTIONS,
  getCategoryGroup,
  getFieldsForStep,
  sqmToPyeong,
  uniqueFields,
  type CategoryGroup,
  type FieldSpec,
  type FormStep,
} from "@/lib/property-naver";
import { PropertyLedgerLookupPanel } from "@/components/admin/PropertyLedgerLookupPanel";
import { ledgerKindFromPropertyCategory } from "@/lib/public-data/ledger-kind";
import type { BuildingLedgerFields, LandLedgerFields } from "@/lib/public-data/types";

const MAX_IMAGES = 5;

const STEP_LABELS = [
  { title: "기본정보", sub: "분류 · 거래" },
  { title: "상세정보", sub: "대장조회 · 면적" },
  { title: "가격/관리비", sub: "거래가 · 7비목" },
  { title: "시설·법적", sub: "옵션 · 위반 · 담당" },
  { title: "미디어", sub: "사진 · 소유자" },
] as const;

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#4dabff]/50 focus:ring-1 focus:ring-[#4dabff]/30";

type PropertyFormProps = {
  initial?: Property;
};

type FormState = Record<
  string,
  string | number | boolean | string[] | Record<string, unknown> | null | undefined
>;

function parseSpecs(json: string | undefined | null): Record<string, unknown> {
  try {
    const parsed = JSON.parse(json || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function propertyToFormState(property?: Property): FormState {
  if (!property) {
    return {
      category: "APARTMENT",
      type: "SALE",
      status: "ACTIVE",
      featured: false,
      isJeonse: false,
      dealSubType: "MONTHLY",
      region: "내포신도시",
      sido: "충청남도",
      sigungu: "홍성군",
      eupmyeondong: "홍북읍",
      moveInType: "협의가능",
      loanStatus: "없음",
      publishedAt: new Date().toISOString().slice(0, 10),
      tags: [],
      images: [],
      price: 0,
      ownerRelation: "본인",
      keyMoneyHidden: false,
      vatIncluded: false,
      maintenanceMode: "NONE",
      maintenanceBreakdown: {},
      maintenanceBreakdownReason: "",
      illegalBuilding: false,
      unregisteredBuilding: false,
      unregisteredConfirmed: false,
      floorDisplayMode: "NUMBER",
      floorBand: "",
      actualParking: "",
      useApprovalDate: "",
      listingAgentName: OFFICE_PROFILE.agentName,
      listingAgentPhone: OFFICE_PROFILE.agentPhone,
    };
  }

  const specs = parseSpecs(property.specs);
  const base: FormState = {
    title: property.title,
    description: property.description,
    category: property.category,
    type: property.type,
    status: property.status,
    featured: property.featured,
    isJeonse: property.isJeonse,
    dealSubType: property.dealSubType ?? (property.isJeonse ? "JEONSE" : "MONTHLY"),
    region: property.region,
    address: property.address,
    sido: property.sido ?? "",
    sigungu: property.sigungu ?? "",
    eupmyeondong: property.eupmyeondong ?? "",
    ri: property.ri ?? "",
    jibunMain: property.jibunMain ?? "",
    jibunSub: property.jibunSub ?? "",
    buildingName: property.buildingName ?? "",
    price: property.price,
    deposit: property.deposit ?? "",
    monthlyRent: property.monthlyRent ?? "",
    exclusiveArea: property.exclusiveArea ?? "",
    supplyArea: property.supplyArea ?? "",
    floor: property.floor ?? "",
    totalFloors: property.totalFloors ?? "",
    direction: property.direction ?? "",
    builtYear: property.builtYear ?? "",
    parking: property.parking ?? "",
    rooms: property.rooms ?? "",
    bathrooms: property.bathrooms ?? "",
    unitDong: property.unitDong ?? "",
    unitHo: property.unitHo ?? "",
    maintenanceFee: property.maintenanceFee ?? "",
    keyMoney: property.keyMoney ?? "",
    keyMoneyHidden: property.keyMoneyHidden,
    vatIncluded: property.vatIncluded ?? false,
    businessType: property.businessType ?? "",
    landCategory: property.landCategory ?? "",
    zoning: property.zoning ?? "",
    loanStatus: property.loanStatus ?? "없음",
    moveInType: property.moveInType ?? "협의가능",
    featureSummary: property.featureSummary ?? "",
    ownerName: property.ownerName ?? "",
    ownerRelation: property.ownerRelation ?? "본인",
    ownerPhone: property.ownerPhone ?? "",
    clientName: property.clientName ?? "",
    naverComplexId: property.naverComplexId ?? "",
    naverDongId: property.naverDongId ?? "",
    moveInDate: property.moveInDate && /^\d{4}-\d{2}-\d{2}$/.test(property.moveInDate)
      ? property.moveInDate
      : "",
    publishedAt: property.publishedAt
      ? new Date(property.publishedAt).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    tags: parseTags(property.tags),
    images: parseImages(property.images),
  };

  for (const [k, v] of Object.entries(specs)) {
    if (base[k] === undefined || base[k] === "") {
      base[k] = v as FormState[string];
    }
  }
  return base;
}

export function PropertyForm({ initial }: PropertyFormProps) {
  const [form, setForm] = useState<FormState>(() => propertyToFormState(initial));
  const [wizardStep, setWizardStep] = useState(1);
  const [imageInput, setImageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [flyerOpen, setFlyerOpen] = useState(false);
  const [flyerData, setFlyerData] = useState<FlyerViewModel | null>(null);
  const [windowFlyerOpen, setWindowFlyerOpen] = useState(false);
  const [windowFlyerData, setWindowFlyerData] = useState<WindowFlyerViewModel | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(initial);

  function openFlyerPreview() {
    if (!initial?.id) return;
    setFlyerData(mapPropertyToFlyer(propertyFormToFlyerSource(initial.id, form)));
    setFlyerOpen(true);
  }

  function openWindowFlyerPreview() {
    if (!initial?.id) return;
    setWindowFlyerData(
      mapPropertyToWindowFlyer(propertyFormToFlyerSource(initial.id, form)),
    );
    setWindowFlyerOpen(true);
  }

  const category = form.category as PropertyCategory;
  const dealType = form.type as PropertyType;
  const group = useMemo(() => getCategoryGroup(category), [category]);
  const imageList = (form.images as string[]) ?? [];
  const remainingSlots = MAX_IMAGES - imageList.length;
  const isRetailLike = group === "RETAIL_OFFICE" || group === "LAND";
  const maintMode = (String(form.maintenanceMode || "NONE") as MaintenanceMode) || "NONE";
  const feeManwon =
    form.maintenanceFee !== "" && form.maintenanceFee != null
      ? Number(form.maintenanceFee)
      : null;
  const showBreakdown = needsMaintenanceBreakdown(maintMode, feeManwon);
  const breakdown = (form.maintenanceBreakdown as Record<string, unknown>) || {};
  const adWarnings = lintPropertyAdCopy(String(form.description || ""));

  const fieldsByStep = useMemo(() => {
    const steps = [1, 2, 3, 4] as FormStep[];
    return Object.fromEntries(
      steps.map((s) => [s, uniqueFields(getFieldsForStep(group, s))]),
    ) as Record<FormStep, FieldSpec[]>;
  }, [group]);

  const legalChecklist = useMemo(() => {
    const addrOk = Boolean(form.sido && form.sigungu && form.eupmyeondong);
    const areaOk = form.exclusiveArea !== "" && form.exclusiveArea != null;
    const priceOk =
      dealType === "SALE" || dealType === "PRE_SALE"
        ? Number(form.price) > 0
        : form.deposit !== "" && form.deposit != null;
    const maintOk =
      maintMode !== "FIXED" ||
      (feeManwon != null && feeManwon < 10) ||
      showBreakdown;
    const dirOk =
      group === "LAND" ||
      Boolean(form.direction) ||
      group === "RETAIL_OFFICE";
    const parkOk = group === "LAND" || Boolean(form.totalParking || form.parking || form.actualParking);
    return [
      { id: "addr", label: "소재지(시군구·읍면동)", ok: addrOk },
      { id: "area", label: "전용면적", ok: areaOk || group === "LAND" },
      { id: "price", label: "거래 가격", ok: priceOk },
      { id: "maint", label: "관리비·7비목 규칙", ok: maintOk },
      { id: "dir", label: "방향", ok: Boolean(dirOk) },
      { id: "park", label: "주차 정보", ok: Boolean(parkOk) },
      { id: "approve", label: "사용승인일(권장)", ok: Boolean(form.useApprovalDate || form.approvalDate) },
      { id: "illegal", label: "위반건축물 표기", ok: typeof form.illegalBuilding === "boolean" },
      { id: "unreg", label: "미등기 확인", ok: Boolean(form.unregisteredConfirmed) },
      {
        id: "agent",
        label: "소속 중개사 병기",
        ok: Boolean(form.listingAgentName && form.listingAgentPhone),
      },
    ];
  }, [form, dealType, group, maintMode, feeManwon, showBreakdown]);

  function setField(key: string, value: FormState[string]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setCategoryGroup(nextGroup: CategoryGroup) {
    const first = CATEGORY_GROUP_OPTIONS.find((g) => g.group === nextGroup)?.categories[0];
    if (first) setField("category", first.value);
  }

  function toggleTag(tag: string) {
    const tags = (form.tags as string[]) ?? [];
    setField(
      "tags",
      tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
    );
  }

  function toggleMulti(field: string, option: string) {
    const current = Array.isArray(form[field]) ? (form[field] as string[]) : [];
    setField(
      field,
      current.includes(option) ? current.filter((v) => v !== option) : [...current, option],
    );
  }

  function normalizeImageUrl(raw: string): string | null {
    let u = raw.trim();
    if (!u) return null;
    if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
    try {
      const parsed = new URL(u);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
      return parsed.toString();
    } catch {
      return null;
    }
  }

  function addImageUrl() {
    const url = normalizeImageUrl(imageInput);
    if (!url) {
      setError("올바른 이미지 URL을 입력하세요. (https://…)");
      return;
    }
    if (imageList.length >= MAX_IMAGES) {
      setError("사진은 최대 5장까지 등록할 수 있습니다.");
      return;
    }
    if (imageList.includes(url)) {
      setError("이미 등록된 사진입니다.");
      return;
    }
    setError("");
    setForm((prev) => ({
      ...prev,
      images: [...((prev.images as string[]) ?? []), url].slice(0, MAX_IMAGES),
    }));
    setImageInput("");
  }

  async function uploadFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    if (remainingSlots <= 0) {
      setError("사진은 최대 5장까지 등록할 수 있습니다.");
      return;
    }

    const maxBytes = 4 * 1024 * 1024;
    const selected = Array.from(fileList).slice(0, remainingSlots);
    const oversized = selected.find((f) => f.size > maxBytes);
    if (oversized) {
      setError(`「${oversized.name}」이(가) 4MB를 초과합니다. 압축 후 다시 올려 주세요.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    setError("");

    try {
      const body = new FormData();
      body.append("kind", "properties");
      for (const file of selected) {
        body.append("files", file);
      }

      const res = await fetch("/api/admin/uploads", { method: "POST", body });
      let data: { urls?: string[]; error?: string } = {};
      try {
        data = (await res.json()) as { urls?: string[]; error?: string };
      } catch {
        setError(
          res.status === 413
            ? "파일이 너무 큽니다. 각 4MB 이하로 올려 주세요."
            : `사진 업로드 실패 (HTTP ${res.status}). 잠시 후 다시 시도하거나 URL로 추가하세요.`,
        );
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "사진 업로드에 실패했습니다.");
        return;
      }

      const urls = data.urls ?? [];
      setForm((prev) => ({
        ...prev,
        images: [...((prev.images as string[]) ?? []), ...urls].slice(0, MAX_IMAGES),
      }));
    } catch {
      setError("사진 업로드 중 오류가 발생했습니다. 네트워크를 확인하거나 URL로 추가해 보세요.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    const images = [...imageList];
    images.splice(index, 1);
    setField("images", images);
  }

  function setRepresentative(index: number) {
    const images = [...imageList];
    if (index <= 0 || index >= images.length) return;
    const [picked] = images.splice(index, 1);
    setField("images", [picked, ...images]);
  }

  function suggestTitle() {
    const title = suggestPropertyTitle({
      category,
      type: dealType,
      buildingName: String(form.buildingName || ""),
      exclusiveArea: form.exclusiveArea ? Number(form.exclusiveArea) : null,
    });
    setField("title", title);
  }

  function applyBuildingLedger(fields: BuildingLedgerFields) {
    setForm((prev) => {
      const next = { ...prev };
      const assign = (key: string, value: string | number | undefined) => {
        if (value === undefined || value === "") return;
        next[key] = value;
      };
      // 전유부 핵심 우선
      if (fields.dongNm) assign("unitDong", String(fields.dongNm).replace(/동$/i, ""));
      if (fields.hoNm) assign("unitHo", String(fields.hoNm).replace(/호$/i, ""));
      if (fields.floor != null) assign("floor", fields.floor);
      if (fields.exclusiveArea != null) next.exclusiveArea = fields.exclusiveArea;
      if (fields.supplyArea != null) assign("supplyArea", fields.supplyArea);
      if (fields.commonArea != null) assign("commonArea", fields.commonArea);
      if (fields.housePrice != null) assign("housePrice", fields.housePrice);
      if (fields.etcPurps) assign("etcPurps", fields.etcPurps);

      assign("buildingName", fields.buildingName);
      assign("buildingUse", fields.buildingUse || fields.etcPurps);
      assign("totalFloorArea", fields.totalFloorArea);
      assign("archArea", fields.archArea);
      assign("landShareArea", fields.landShareArea);
      assign("totalFloors", fields.totalFloors);
      assign("undergroundFloors", fields.undergroundFloors);
      assign("useApprovalDate", fields.useApprovalDate);
      assign("approvalDate", fields.approvalDate);
      assign("permitDate", fields.permitDate);
      assign("startConstructDate", fields.startConstructDate);
      assign("totalParking", fields.totalParking);
      assign("indoorParking", fields.indoorParking);
      assign("outdoorParking", fields.outdoorParking);
      assign("structureType", fields.structureType || fields.etcStrct);
      assign("bcRat", fields.bcRat);
      assign("vlRat", fields.vlRat);
      assign("vlRatEstmTotArea", fields.vlRatEstmTotArea);
      assign("height", fields.height);
      assign("elevatorCnt", fields.elevatorCnt);
      assign("emergElevatorCnt", fields.emergElevatorCnt);
      assign("seismicDesign", fields.seismicDesign);
      assign("energyGrade", fields.energyGrade);
      assign("ecoBldGrade", fields.ecoBldGrade);
      assign("hhldCnt", fields.hhldCnt);
      assign("roadAddress", fields.roadAddress);
      assign("platPlc", fields.platPlc);
      if (fields.totalParking != null) {
        next.parking = String(fields.totalParking);
      }
      // 전유공용·층별·지역지구 등 상세는 specs에 보존
      next.ledgerExposDetail = {
        exposAreaRows: fields.exposAreaRows,
        floorRows: fields.floorRows,
        jijiguRows: fields.jijiguRows,
        extras: fields.extras,
        housePrice: fields.housePrice,
        housePriceStdDay: fields.housePriceStdDay,
        mgmBldrgstPk: fields.mgmBldrgstPk,
        flrGbNm: fields.flrGbNm,
        floorNm: fields.floorNm,
        commonArea: fields.commonArea,
        supplyArea: fields.supplyArea,
        exclusiveArea: fields.exclusiveArea,
        etcStrct: fields.etcStrct,
        mainAtchGbCdNm: fields.mainAtchGbCdNm,
        regstrKindCdNm: fields.regstrKindCdNm,
        crtnDay: fields.crtnDay,
      };
      return next;
    });
  }

  function applyLandLedger(fields: LandLedgerFields) {
    setForm((prev) => {
      const next = { ...prev };
      const assign = (key: string, value: string | number | undefined) => {
        if (value === undefined || value === "") return;
        next[key] = value;
      };
      assign("exclusiveArea", fields.exclusiveArea);
      assign("landCategory", fields.landCategory);
      assign("zoning", fields.zoning);
      assign("roadAccess", fields.roadAccess);
      assign("terrain", fields.terrain);
      assign("landShape", fields.landShape);
      assign("landUseStatus", fields.landUseStatus);
      if (fields.officialLandPrice != null) {
        next.officialLandPrice = fields.officialLandPrice;
      }
      if (fields.pnu) next.pnu = fields.pnu;
      return next;
    });
  }

  function handleReset() {
    setForm(propertyToFormState(initial));
    setImageInput("");
    setError("");
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");

    const payload: Record<string, unknown> = {
      ...form,
      price: Number(form.price || 0),
      deposit: form.deposit !== "" && form.deposit != null ? Number(form.deposit) : null,
      monthlyRent: form.monthlyRent !== "" && form.monthlyRent != null ? Number(form.monthlyRent) : null,
      exclusiveArea: form.exclusiveArea !== "" && form.exclusiveArea != null ? Number(form.exclusiveArea) : null,
      supplyArea: form.supplyArea !== "" && form.supplyArea != null ? Number(form.supplyArea) : null,
      floor: form.floor !== "" && form.floor != null ? Number(form.floor) : null,
      totalFloors: form.totalFloors !== "" && form.totalFloors != null ? Number(form.totalFloors) : null,
      builtYear: form.builtYear !== "" && form.builtYear != null ? Number(form.builtYear) : null,
      rooms: form.rooms !== "" && form.rooms != null ? Number(form.rooms) : null,
      bathrooms: form.bathrooms !== "" && form.bathrooms != null ? Number(form.bathrooms) : null,
      maintenanceFee: form.maintenanceFee !== "" && form.maintenanceFee != null ? Number(form.maintenanceFee) : null,
      keyMoney: form.keyMoney !== "" && form.keyMoney != null ? Number(form.keyMoney) : null,
      isJeonse: form.dealSubType === "JEONSE" || Boolean(form.isJeonse),
      images: imageList.slice(0, MAX_IMAGES),
      tags: form.tags as string[],
      moveInDate: form.moveInType === "지정일" ? form.moveInDate || null : null,
      publishedAt: form.publishedAt || null,
      maintenanceMode: form.maintenanceMode || "NONE",
      maintenanceBreakdown: form.maintenanceBreakdown || {},
      maintenanceBreakdownReason: form.maintenanceBreakdownReason || "",
      illegalBuilding: Boolean(form.illegalBuilding),
      unregisteredBuilding: Boolean(form.unregisteredBuilding),
      unregisteredConfirmed: Boolean(form.unregisteredConfirmed),
      floorDisplayMode: isRetailLike ? "NUMBER" : form.floorDisplayMode || "NUMBER",
      floorBand: isRetailLike ? null : form.floorBand || null,
      actualParking:
        form.actualParking !== "" && form.actualParking != null
          ? Number(form.actualParking)
          : null,
      useApprovalDate: form.useApprovalDate || null,
      listingAgentName: form.listingAgentName || null,
      listingAgentPhone: form.listingAgentPhone || null,
    };

    const url = initial ? `/api/admin/properties/${initial.id}` : "/api/admin/properties";
    const method = initial ? "PATCH" : "POST";

    async function save(extra?: Record<string, unknown>) {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, ...extra }),
      });
      const data = (await res.json().catch(() => ({}))) as ManageCodeConflictResponse & {
        manageCode?: string;
      };
      return { res, data };
    }

    let { res, data } = await save();

    if (!initial && res.status === 409 && data.code === "MANAGE_CODE_CONFLICT" && data.manageCode) {
      const action = askManageCodeConflict(data.manageCode);
      if (!action) {
        setError("저장을 취소했습니다.");
        setLoading(false);
        return;
      }
      ({ res, data } = await save({
        manageCode: data.manageCode,
        conflictAction: action,
      }));
    }

    if (!res.ok) {
      setError(data.error ?? "저장에 실패했습니다.");
      setLoading(false);
      return;
    }

    navigateTo("/admin/properties");
  }

  const checklistOk = legalChecklist.filter((c) => c.ok).length;
  const facilityFields = fieldsByStep[3].filter(
    (f) => !["maintenanceFee", "maintenanceIncludes", "maintenanceBilling"].includes(f.field_name),
  );
  const maintFields = fieldsByStep[3].filter((f) =>
    ["maintenanceFee", "maintenanceIncludes", "maintenanceBilling"].includes(f.field_name),
  );

  function setBreakdownKey(key: string, value: string) {
    const next = { ...breakdown };
    if (value === "" || value === "ACTUAL") next[key] = value === "ACTUAL" ? "ACTUAL" : null;
    else next[key] = Number(value);
    setField("maintenanceBreakdown", next);
  }

  return (
    <div className="mx-auto max-w-[1200px] pb-28 font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-200">
      <p className="mb-3 text-sm text-slate-400">
        {isEdit ? "기존 매물 수정 · 법적 준수 위저드" : "법적 준수 위저드로 매물을 등록합니다."}
      </p>
      <p className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200">
        <span className="text-slate-400">관리번호 · </span>
        <span className="font-medium tabular-nums text-[#d4bfff]">
          {initial?.manageCode || "등록 저장 시 자동 생성 (매물_00000000)"}
        </span>
        <span className="ml-2 rounded-full border border-[#913dff]/40 bg-[#913dff]/15 px-2 py-0.5 text-[11px] font-semibold text-[#d4bfff]">
          {CATEGORY_GROUP_LABELS[group]}
        </span>
      </p>

      <GlassCard className="mb-4 p-4">
        <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold text-white">등록 단계</span>
          <span>
            Step {wizardStep} / {STEP_LABELS.length}
          </span>
        </div>
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {STEP_LABELS.map((s, i) => {
            const n = i + 1;
            const active = n === wizardStep;
            const done = n < wizardStep;
            return (
              <li key={s.title}>
                <button
                  type="button"
                  onClick={() => setWizardStep(n)}
                  className={`w-full rounded-xl border px-2 py-2 text-left transition ${
                    active
                      ? "border-[#a78bfa]/55 bg-[#a78bfa]/15"
                      : done
                        ? "border-emerald-400/30 bg-emerald-500/10"
                        : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-white/90">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                        done ? "bg-emerald-500/30 text-emerald-200" : "bg-white/10 text-white/70"
                      }`}
                    >
                      {done ? <Check className="h-3 w-3" /> : n}
                    </span>
                    {s.title}
                  </span>
                  <span className="mt-0.5 block pl-6 text-[10px] text-white/40">{s.sub}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </GlassCard>

      {error && (
        <p className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          {wizardStep === 1 && (
            <Section n={1} title="기본정보 · 거래조건">
              <div className="space-y-4">
                <Field label="카테고리 그룹">
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(CATEGORY_GROUP_LABELS) as CategoryGroup[]).map((g) => (
                      <ChipButton
                        key={g}
                        active={group === g}
                        label={CATEGORY_GROUP_LABELS[g]}
                        onClick={() => setCategoryGroup(g)}
                      />
                    ))}
                  </div>
                </Field>
                <Field label="세부 유형">
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_GROUP_OPTIONS.find((g) => g.group === group)?.categories.map((item) => (
                      <ChipButton
                        key={item.value}
                        active={category === item.value}
                        label={item.label}
                        onClick={() => setField("category", item.value)}
                      />
                    ))}
                  </div>
                </Field>
                <Field label="거래 유형">
                  <div className="flex flex-wrap gap-2">
                    {DEAL_TYPE_OPTIONS.map((item) => (
                      <ChipButton
                        key={item.value}
                        active={dealType === item.value}
                        label={item.label}
                        onClick={() => setField("type", item.value)}
                      />
                    ))}
                  </div>
                </Field>
                {(dealType === "RENT" || dealType === "SHORT_TERM") && (
                  <Field label="전세/월세">
                    <div className="flex flex-wrap gap-2">
                      {DEAL_SUBTYPE_OPTIONS.map((item) => (
                        <ChipButton
                          key={item.value}
                          active={String(form.dealSubType) === item.value}
                          label={item.label}
                          onClick={() => {
                            setField("dealSubType", item.value);
                            setField("isJeonse", item.value === "JEONSE");
                          }}
                        />
                      ))}
                    </div>
                  </Field>
                )}
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="노출 상태">
                    <select
                      className={inputClass}
                      value={String(form.status)}
                      onChange={(e) => setField("status", e.target.value)}
                    >
                      <option value="ACTIVE">노출</option>
                      <option value="HIDDEN">숨김</option>
                      <option value="SOLD">거래완료</option>
                    </select>
                  </Field>
                  <Field label="매물 등록일">
                    <input
                      type="date"
                      className={inputClass}
                      value={String(form.publishedAt ?? "")}
                      onChange={(e) => setField("publishedAt", e.target.value)}
                    />
                  </Field>
                  <Field label="상태 / Featured" className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={Boolean(form.featured)}
                        onChange={(e) => setField("featured", e.target.checked)}
                      />
                      Featured 매물
                    </label>
                  </Field>
                  {fieldsByStep[1].map((field) => (
                    <DynamicField
                      key={`1-${field.field_name}`}
                      field={field}
                      form={form}
                      dealType={dealType}
                      setField={setField}
                      toggleMulti={toggleMulti}
                      onSuggestTitle={field.field_name === "title" ? suggestTitle : undefined}
                    />
                  ))}
                </div>
              </div>
            </Section>
          )}

          {wizardStep === 2 && (
            <Section n={2} title="매물 상세 · 면적">
              <div className="space-y-4">
                <PropertyLedgerLookupPanel
                  addressParts={{
                    sido: String(form.sido || ""),
                    sigungu: String(form.sigungu || ""),
                    eupmyeondong: String(form.eupmyeondong || ""),
                    ri: String(form.ri || ""),
                    jibunMain: form.jibunMain as string | number | undefined,
                    jibunSub: form.jibunSub as string | number | undefined,
                  }}
                  unitDong={String(form.unitDong || "")}
                  unitHo={String(form.unitHo || "")}
                  defaultLedgerKind={ledgerKindFromPropertyCategory(category)}
                  persistOwner={
                    initial?.id ? { type: "property", id: initial.id } : undefined
                  }
                  onApplyBuilding={applyBuildingLedger}
                  onApplyLand={applyLandLedger}
                />
                <p className="text-[11px] text-slate-400">
                  아래 항목은 API 적용 후에도 언제든 수기 수정할 수 있습니다.
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  {fieldsByStep[2].map((field) => (
                    <DynamicField
                      key={`2-${field.field_name}`}
                      field={field}
                      form={form}
                      dealType={dealType}
                      setField={setField}
                      toggleMulti={toggleMulti}
                    />
                  ))}
                  <Field label="실사용 가능 주차대수">
                    <input
                      type="number"
                      className={inputClass}
                      value={form.actualParking == null ? "" : String(form.actualParking)}
                      onChange={(e) => setField("actualParking", e.target.value)}
                    />
                  </Field>
                  <Field label="사용승인일">
                    <input
                      type="date"
                      className={inputClass}
                      value={String(form.useApprovalDate ?? "")}
                      onChange={(e) => setField("useApprovalDate", e.target.value)}
                    />
                  </Field>
                </div>
                <label
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm ${
                    isRetailLike
                      ? "cursor-not-allowed border-white/10 text-white/30"
                      : "border-white/15 text-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={isRetailLike}
                    checked={form.floorDisplayMode === "BAND"}
                    onChange={(e) => {
                      setField("floorDisplayMode", e.target.checked ? "BAND" : "NUMBER");
                      if (!e.target.checked) setField("floorBand", "");
                    }}
                  />
                  중개의뢰인 미희망 시 층수 저/중/고 표시
                  {isRetailLike ? (
                    <span className="ml-auto text-[10px] text-rose-300/80">상가·비주거 불가</span>
                  ) : null}
                </label>
                {form.floorDisplayMode === "BAND" && !isRetailLike ? (
                  <div className="flex flex-wrap gap-2">
                    {(["LOW", "MID", "HIGH"] as const).map((b) => (
                      <ChipButton
                        key={b}
                        active={form.floorBand === b}
                        label={b === "LOW" ? "저" : b === "MID" ? "중" : "고"}
                        onClick={() => setField("floorBand", b)}
                      />
                    ))}
                  </div>
                ) : null}
                {fieldsByStep[2].length === 0 && (
                  <p className="text-sm text-slate-500">이 유형에 해당하는 상세 필드가 없습니다.</p>
                )}
              </div>
            </Section>
          )}

          {wizardStep === 3 && (
            <Section n={3} title="가격 · 관리비">
              <p className="mb-3 text-xs text-slate-500">
                거래 가액은 1단계에서 입력합니다. 여기서는 관리비 부과 방식과 7대 비목을 설정합니다.
              </p>
              <Field label="관리비 부과 방식">
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["NONE", "관리비 없음"],
                      ["ACTUAL", "실비 부과"],
                      ["FIXED", "정액 관리비"],
                    ] as const
                  ).map(([k, t]) => (
                    <ChipButton
                      key={k}
                      active={maintMode === k}
                      label={t}
                      onClick={() => setField("maintenanceMode", k)}
                    />
                  ))}
                </div>
              </Field>
              {maintMode === "FIXED" ? (
                <div className="mt-3 space-y-3 rounded-xl border border-amber-400/30 bg-amber-500/5 p-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    {maintFields.map((field) => (
                      <DynamicField
                        key={`m-${field.field_name}`}
                        field={field}
                        form={form}
                        dealType={dealType}
                        setField={setField}
                        toggleMulti={toggleMulti}
                      />
                    ))}
                  </div>
                  {showBreakdown ? (
                    <>
                      <p className="flex items-center gap-1.5 text-xs font-bold text-amber-200">
                        <CircleAlert className="h-3.5 w-3.5" />
                        월 10만원 이상 — 7대 비목 금액 필수 (원 단위, 실비는 ACTUAL)
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {MAINTENANCE_BREAKDOWN_KEYS.map((m) => (
                          <Field key={m.key} label={`${m.label} (원)`}>
                            <input
                              className={inputClass}
                              placeholder="금액 또는 ACTUAL"
                              value={
                                breakdown[m.key] === "ACTUAL" || breakdown[m.key] === null
                                  ? breakdown[m.key] === "ACTUAL"
                                    ? "ACTUAL"
                                    : ""
                                  : breakdown[m.key] == null
                                    ? ""
                                    : String(breakdown[m.key])
                              }
                              onChange={(e) => setBreakdownKey(m.key, e.target.value)}
                            />
                          </Field>
                        ))}
                      </div>
                      <Field label="비목 미고지 시 사유">
                        <select
                          className={inputClass}
                          value={String(form.maintenanceBreakdownReason ?? "")}
                          onChange={(e) => setField("maintenanceBreakdownReason", e.target.value)}
                        >
                          <option value="">해당 없음</option>
                          <option value="임대인 세부 내역 미고지">임대인 세부 내역 미고지</option>
                          <option value="관리규약상 비공개">관리규약상 비공개</option>
                        </select>
                      </Field>
                    </>
                  ) : (
                    <p className="text-xs text-slate-500">10만원 미만이면 세부 비목 생략 가능</p>
                  )}
                </div>
              ) : null}
              {maintMode !== "FIXED" && maintFields.length > 0 ? (
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {maintFields.map((field) => (
                    <DynamicField
                      key={`m2-${field.field_name}`}
                      field={field}
                      form={form}
                      dealType={dealType}
                      setField={setField}
                      toggleMulti={toggleMulti}
                    />
                  ))}
                </div>
              ) : null}
            </Section>
          )}

          {wizardStep === 4 && (
            <Section n={4} title="시설 · 법적 상태 · 담당">
              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={Boolean(form.illegalBuilding)}
                    onChange={(e) => setField("illegalBuilding", e.target.checked)}
                  />
                  위반건축물
                </label>
                <label className="flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={Boolean(form.unregisteredBuilding)}
                    onChange={(e) => setField("unregisteredBuilding", e.target.checked)}
                  />
                  미등기 건물
                </label>
                <label className="flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-sm text-slate-300 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={Boolean(form.unregisteredConfirmed)}
                    onChange={(e) => setField("unregisteredConfirmed", e.target.checked)}
                  />
                  미등기·등기 상태 확인 완료
                </label>
              </div>
              {form.illegalBuilding ? (
                <p className="mb-3 rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
                  상세 설명에 「위반건축물」 고지를 포함하세요.
                </p>
              ) : null}
              <div className="mb-4 grid gap-3 md:grid-cols-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <Field label="개업공인중개사">
                  <input className={inputClass} value={OFFICE_PROFILE.brokerName} readOnly />
                </Field>
                <Field label="개업 연락처">
                  <input className={inputClass} value={OFFICE_PROFILE.brokerPhone} readOnly />
                </Field>
                <Field label="소속공인중개사">
                  <input
                    className={inputClass}
                    value={String(form.listingAgentName ?? "")}
                    onChange={(e) => setField("listingAgentName", e.target.value)}
                  />
                </Field>
                <Field label="소속 연락처">
                  <input
                    className={inputClass}
                    value={String(form.listingAgentPhone ?? "")}
                    onChange={(e) => setField("listingAgentPhone", e.target.value)}
                  />
                </Field>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {facilityFields.map((field) => (
                  <DynamicField
                    key={`3-${field.field_name}`}
                    field={field}
                    form={form}
                    dealType={dealType}
                    setField={setField}
                    toggleMulti={toggleMulti}
                  />
                ))}
              </div>
              {facilityFields.length === 0 && (
                <p className="text-sm text-slate-500">추가 시설·옵션 필드가 없습니다.</p>
              )}
            </Section>
          )}

          {wizardStep === 5 && (
            <>
              <Section n={5} title="사진" hint="최대 5장 · JPG/PNG/WEBP/GIF · 각 4MB 이하 · 첫 번째가 대표 이미지">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="hidden"
                  onChange={(e) => void uploadFiles(e.target.files)}
                />
                <div className="flex flex-wrap gap-3">
                  {imageList.map((url, i) => (
                    <div
                      key={`${url}-${i}`}
                      className={`relative h-24 w-24 overflow-hidden rounded-xl border ${
                        i === 0 ? "border-[#d4bfff]/60 ring-1 ring-[#d4bfff]/30" : "border-white/10"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`매물 사진 ${i + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const el = e.currentTarget;
                          el.style.display = "none";
                          const fallback = el.nextElementSibling;
                          if (fallback instanceof HTMLElement) fallback.hidden = false;
                        }}
                      />
                      <div
                        hidden
                        className="flex h-full w-full items-center justify-center bg-white/10 p-1 text-center text-[9px] text-slate-400"
                      >
                        URL 등록됨
                      </div>
                      {i === 0 && (
                        <span className="absolute left-1 top-1 rounded bg-[#913dff]/90 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          대표
                        </span>
                      )}
                      <button
                        type="button"
                        className="absolute right-1 top-1 rounded-full bg-black/70 p-1"
                        onClick={() => removeImage(i)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {i !== 0 && (
                        <button
                          type="button"
                          className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] text-white"
                          onClick={() => setRepresentative(i)}
                        >
                          대표로
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    disabled={remainingSlots <= 0 || uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/20 text-slate-400 hover:border-[#4dabff]/50 disabled:opacity-40"
                  >
                    {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
                    <span className="text-[10px]">
                      {uploading ? "업로드…" : `추가 (${imageList.length}/${MAX_IMAGES})`}
                    </span>
                  </button>
                </div>
                <div className="mt-4 block text-xs text-slate-400">
                  <span>또는 URL로 추가</span>
                  <div className="mt-1 flex gap-2">
                    <input
                      className={inputClass}
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addImageUrl();
                        }
                      }}
                      disabled={remainingSlots <= 0}
                      placeholder="https://..."
                      inputMode="url"
                    />
                    <button
                      type="button"
                      onClick={addImageUrl}
                      disabled={remainingSlots <= 0 || !imageInput.trim()}
                      className="shrink-0 rounded-xl border border-white/15 px-4 text-sm font-semibold text-slate-200 hover:bg-white/5 disabled:opacity-40"
                    >
                      추가
                    </button>
                  </div>
                </div>
              </Section>

              <Section n={5} title="소유자 검증 · 설명 · 태그">
                <div className="grid gap-3 md:grid-cols-2">
                  {fieldsByStep[4].map((field) => (
                    <DynamicField
                      key={`4-${field.field_name}`}
                      field={field}
                      form={form}
                      dealType={dealType}
                      setField={setField}
                      toggleMulti={toggleMulti}
                    />
                  ))}
                  <Field label="태그" className="md:col-span-2">
                    <div className="flex flex-wrap gap-2">
                      {PROPERTY_TAGS.map((tag) => (
                        <ChipButton
                          key={tag}
                          active={((form.tags as string[]) ?? []).includes(tag)}
                          label={tag}
                          onClick={() => toggleTag(tag)}
                        />
                      ))}
                    </div>
                  </Field>
                </div>
                {adWarnings.length > 0 ? (
                  <p className="mt-3 flex items-center gap-1.5 rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
                    <CircleAlert className="h-3.5 w-3.5 shrink-0" />
                    부당 표시·광고 우려 문구: {adWarnings.join(", ")}
                  </p>
                ) : null}
              </Section>
            </>
          )}

          <div className="flex flex-wrap justify-between gap-2">
            <button
              type="button"
              disabled={wizardStep === 1}
              onClick={() => setWizardStep((s) => Math.max(1, s - 1))}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-4 py-2 text-sm font-bold text-slate-300 disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" />
              이전
            </button>
            {wizardStep < 5 ? (
              <button
                type="button"
                onClick={() => setWizardStep((s) => Math.min(5, s + 1))}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-4 py-2 text-sm font-bold text-white"
              >
                다음
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>

        <aside className="space-y-3 lg:sticky lg:top-4 lg:self-start">
          <GlassCard className="p-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-[#ddd6fe]">
              <ShieldCheck className="h-3.5 w-3.5" />
              법적 필수 체크리스트
            </p>
            <p className="mb-3 text-[11px] text-white/40">
              {checklistOk}/{legalChecklist.length} 충족
            </p>
            <ul className="space-y-1.5">
              {legalChecklist.map((c) => (
                <li
                  key={c.id}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] ${
                    c.ok ? "bg-emerald-500/10 text-emerald-100/90" : "bg-rose-500/10 text-rose-100/90"
                  }`}
                >
                  {c.ok ? <Check className="h-3 w-3 shrink-0" /> : <CircleAlert className="h-3 w-3 shrink-0" />}
                  {c.label}
                </li>
              ))}
            </ul>
          </GlassCard>
        </aside>
      </div>

      <div className="fixed bottom-[calc(3.75rem+env(safe-area-inset-bottom))] left-0 right-0 z-40 border-t border-white/10 bg-[#0B0F19]/92 px-4 py-3 backdrop-blur-md md:bottom-0 md:left-56">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            {isEdit ? (
              <span className="inline-flex items-center gap-1 text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" /> 수정 모드
              </span>
            ) : (
              "입력 후 등록 저장하세요"
            )}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {isEdit ? "되돌리기" : "초기화"}
            </button>
            <button
              type="button"
              disabled={!isEdit || loading}
              onClick={openFlyerPreview}
              title={isEdit ? "광고전단지(배포용) 미리보기" : "저장 후 수정 화면에서 생성할 수 있습니다"}
              className="inline-flex items-center gap-1.5 rounded-xl border border-orange-400/40 bg-orange-500/20 px-3 py-2 text-sm font-bold text-orange-100 disabled:opacity-40"
            >
              <FileImage className="h-3.5 w-3.5" />
              광고전단지
            </button>
            <button
              type="button"
              disabled={!isEdit || loading}
              onClick={openWindowFlyerPreview}
              title={isEdit ? "창문전단지(창부착용) 미리보기" : "저장 후 수정 화면에서 생성할 수 있습니다"}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300/45 bg-amber-500/20 px-3 py-2 text-sm font-bold text-amber-100 disabled:opacity-40"
            >
              <FileImage className="h-3.5 w-3.5" />
              창문전단지
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => void handleSubmit()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-5 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              {isEdit ? "수정 저장" : "등록 저장"}
            </button>
          </div>
        </div>
      </div>

      <FlyerPreviewModal
        open={flyerOpen}
        onClose={() => setFlyerOpen(false)}
        data={flyerData}
      />
      <WindowFlyerPreviewModal
        open={windowFlyerOpen}
        onClose={() => setWindowFlyerOpen(false)}
        data={windowFlyerData}
      />
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
  children: ReactNode;
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
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`block text-xs text-slate-400 ${className}`}>
      <span className="block">{label}</span>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function ChipButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        active
          ? "border-[#913dff]/50 bg-[#913dff]/20 font-semibold text-[#d4bfff]"
          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

function DynamicField({
  field,
  form,
  dealType,
  setField,
  toggleMulti,
  onSuggestTitle,
}: {
  field: FieldSpec;
  form: FormState;
  dealType: PropertyType;
  setField: (key: string, value: FormState[string]) => void;
  toggleMulti: (field: string, option: string) => void;
  onSuggestTitle?: () => void;
}) {
  if (field.field_name === "price" && (dealType === "RENT" || dealType === "SHORT_TERM")) return null;
  if (field.field_name === "deposit" && dealType !== "RENT" && dealType !== "SHORT_TERM") return null;
  if (field.field_name === "monthlyRent") {
    if (dealType !== "RENT" && dealType !== "SHORT_TERM") return null;
    if (dealType === "RENT" && form.dealSubType === "JEONSE") return null;
  }
  if (field.field_name === "moveInDate" && form.moveInType !== "지정일") return null;
  if (field.field_name === "clientName" && form.ownerRelation !== "대리인") return null;

  const value = form[field.field_name];
  const hint = field.naver_sync_note;
  const spanClass =
    field.field_name === "title" || field.field_name === "description" || field.field_name === "address"
      ? "md:col-span-2"
      : "";

  if (field.data_type === "Boolean") {
    return (
      <label className={`flex items-center gap-2 text-sm text-slate-300 ${spanClass}`}>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => setField(field.field_name, e.target.checked)}
        />
        {field.label}
        {field.is_required ? " *" : ""}
      </label>
    );
  }

  if (field.data_type === "MultiSelect") {
    const selected = Array.isArray(value) ? (value as string[]) : [];
    return (
      <Field label={`${field.label}${field.is_required ? " *" : ""}`} className={spanClass}>
        <div className="flex flex-wrap gap-2">
          {(field.options ?? []).map((opt) => (
            <ChipButton
              key={opt}
              active={selected.includes(opt)}
              label={opt}
              onClick={() => toggleMulti(field.field_name, opt)}
            />
          ))}
        </div>
        {hint ? <span className="mt-1 block text-[11px] text-slate-500">{hint}</span> : null}
      </Field>
    );
  }

  if (field.data_type === "Select") {
    return (
      <Field label={`${field.label}${field.is_required ? " *" : ""}`} className={spanClass}>
        <select
          value={String(value ?? "")}
          onChange={(e) => {
            const next = e.target.value;
            setField(field.field_name, next);
            if (field.field_name === "moveInType" && next !== "지정일") {
              setField("moveInDate", "");
            }
          }}
          className={inputClass}
        >
          <option value="">선택</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {hint ? <span className="mt-1 block text-[11px] text-slate-500">{hint}</span> : null}
      </Field>
    );
  }

  if (field.data_type === "Date") {
    return (
      <Field label={`${field.label}${field.is_required ? " *" : ""}`} className={spanClass}>
        <input
          type="date"
          value={String(value ?? "")}
          onChange={(e) => setField(field.field_name, e.target.value)}
          className={inputClass}
        />
      </Field>
    );
  }

  if (field.field_name === "description") {
    return (
      <Field label={`${field.label}${field.is_required ? " *" : ""}`} className={spanClass}>
        <textarea
          rows={5}
          value={String(value ?? "")}
          onChange={(e) => setField(field.field_name, e.target.value)}
          className={`${inputClass} min-h-[120px]`}
        />
        {hint ? <span className="mt-1 block text-[11px] text-slate-500">{hint}</span> : null}
      </Field>
    );
  }

  const showPyeong =
    field.data_type === "Number" &&
    (field.field_name === "exclusiveArea" ||
      field.field_name === "supplyArea" ||
      field.field_name === "contractArea" ||
      field.field_name === "landShareArea" ||
      field.field_name === "totalFloorArea");

  const num = value !== "" && value != null ? Number(value) : NaN;

  return (
    <Field label={`${field.label}${field.is_required ? " *" : ""}`} className={spanClass}>
      <div className="flex gap-2">
        <input
          type={field.data_type === "Number" ? "number" : "text"}
          value={value == null ? "" : String(value)}
          onChange={(e) => setField(field.field_name, e.target.value)}
          className={`${inputClass} tabular-nums`}
        />
        {onSuggestTitle && (
          <button
            type="button"
            onClick={onSuggestTitle}
            className="shrink-0 rounded-xl border border-white/15 px-3 text-sm text-slate-200 hover:bg-white/5"
          >
            자동 제안
          </button>
        )}
      </div>
      {showPyeong && Number.isFinite(num) && num > 0 && (
        <p className="mt-1 text-[11px] text-slate-500">약 {sqmToPyeong(num)}평</p>
      )}
      {hint ? <span className="mt-1 block text-[11px] text-slate-500">{hint}</span> : null}
    </Field>
  );
}
