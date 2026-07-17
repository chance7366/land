"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  ImagePlus,
  Loader2,
  RefreshCw,
  Upload,
  X,
} from "lucide-react";
import type { PropertyCategory, PropertyType } from "@prisma/client";
import { GlassCard } from "@/components/ui/GlassCard";
import { PROPERTY_TAGS, suggestPropertyTitle } from "@/lib/property-fields";
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

const MAX_IMAGES = 5;

type FormState = Record<string, string | number | boolean | string[] | null | undefined>;

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#4dabff]/50 focus:ring-1 focus:ring-[#4dabff]/30";

const STEP_LABELS = [
  "기본·거래",
  "상세·면적",
  "시설·옵션",
  "사진",
  "소유자·태그",
] as const;

function emptyForm(): FormState {
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
    price: "",
    title: "",
    description: "",
    ownerRelation: "본인",
    keyMoneyHidden: false,
    vatIncluded: false,
  };
}

export function PropertyRegisterSampleClient() {
  const [form, setForm] = useState<FormState>(() => emptyForm());
  const [imageInput, setImageInput] = useState("");
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const category = form.category as PropertyCategory;
  const dealType = form.type as PropertyType;
  const group = useMemo(() => getCategoryGroup(category), [category]);
  const imageList = (form.images as string[]) ?? [];
  const remainingSlots = MAX_IMAGES - imageList.length;

  const fieldsByStep = useMemo(() => {
    const steps = [1, 2, 3, 4] as FormStep[];
    return Object.fromEntries(
      steps.map((s) => [s, uniqueFields(getFieldsForStep(group, s))]),
    ) as Record<FormStep, FieldSpec[]>;
  }, [group]);

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

  function addImageUrl() {
    if (!imageInput.trim()) return;
    if (imageList.length >= MAX_IMAGES) {
      setToast("사진은 최대 5장까지 등록할 수 있습니다.");
      return;
    }
    setField("images", [...imageList, imageInput.trim()]);
    setImageInput("");
  }

  function addLocalFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    if (remainingSlots <= 0) {
      setToast("사진은 최대 5장까지 등록할 수 있습니다.");
      return;
    }
    const selected = Array.from(fileList).slice(0, remainingSlots);
    const urls = selected.map((f) => URL.createObjectURL(f));
    setField("images", [...imageList, ...urls].slice(0, MAX_IMAGES));
    if (fileInputRef.current) fileInputRef.current.value = "";
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

  function handleReset() {
    setForm(emptyForm());
    setImageInput("");
    setToast("초기화했습니다. (샘플)");
  }

  function handleSave() {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setToast("샘플 · 실제 저장되지 않습니다. 승인 후 프로덕션에 적용합니다.");
    }, 600);
  }

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 4200);
    return () => window.clearTimeout(t);
  }, [toast]);

  return (
    <div className="mx-auto max-w-5xl pb-28 font-[family-name:var(--font-unifine),Outfit,sans-serif] text-slate-200">
      <p className="mb-4 text-sm text-slate-400">
        카테고리·거래유형을 선택한 뒤 항목을 입력하고 저장하세요. (법원 불러오기 없음)
      </p>
      <p className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200">
        <span className="text-slate-400">관리번호 · </span>
        <span className="font-medium tabular-nums text-[#d4bfff]">
          등록 저장 시 자동 생성 (매물_00000000)
        </span>
      </p>

      <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
        {STEP_LABELS.map((label, i) => (
          <span
            key={label}
            className="rounded-full border border-white/10 px-2.5 py-1 text-slate-400"
          >
            {i + 1}. {label}
          </span>
        ))}
        <span className="rounded-full border border-[#913dff]/40 bg-[#913dff]/15 px-2.5 py-1 font-semibold text-[#d4bfff]">
          {CATEGORY_GROUP_LABELS[group]}
        </span>
      </div>

      <div className="mt-6 space-y-5">
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

        <Section n={2} title="매물 상세 · 면적">
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
          </div>
          {fieldsByStep[2].length === 0 && (
            <p className="text-sm text-slate-500">이 유형에 해당하는 상세 필드가 없습니다.</p>
          )}
        </Section>

        <Section n={3} title="시설 · 옵션">
          <div className="grid gap-3 md:grid-cols-2">
            {fieldsByStep[3].map((field) => (
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
          {fieldsByStep[3].length === 0 && (
            <p className="text-sm text-slate-500">이 유형에 해당하는 시설·옵션 필드가 없습니다.</p>
          )}
        </Section>

        <Section n={4} title="사진" hint="최대 5장 · JPG/PNG/WEBP/GIF · 첫 번째가 대표 이미지">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => addLocalFiles(e.target.files)}
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
                <img src={url} alt="" className="h-full w-full object-cover" />
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
              disabled={remainingSlots <= 0}
              onClick={() => fileInputRef.current?.click()}
              className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/20 text-slate-400 hover:border-[#4dabff]/50 disabled:opacity-40"
            >
              <ImagePlus className="h-5 w-5" />
              <span className="text-[10px]">
                추가 ({imageList.length}/{MAX_IMAGES})
              </span>
            </button>
          </div>
          <Field label="또는 URL로 추가" className="mt-4">
            <div className="flex gap-2">
              <input
                className={inputClass}
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                disabled={remainingSlots <= 0}
                placeholder="https://..."
              />
              <button
                type="button"
                onClick={addImageUrl}
                disabled={remainingSlots <= 0}
                className="shrink-0 rounded-xl border border-white/15 px-4 text-sm text-slate-200 hover:bg-white/5 disabled:opacity-40"
              >
                추가
              </button>
            </div>
          </Field>
        </Section>

        <Section n={5} title="소유자 검증 · 태그">
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
        </Section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0B0F19]/92 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <p className="inline-flex items-center gap-1 text-xs text-emerald-300/90">
            <CheckCircle2 className="h-3.5 w-3.5" />
            디자인 샘플 · 저장되지 않음
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              초기화
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4dabff] to-[#913dff] px-5 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              등록 저장
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div
          className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/15 bg-[#121826] px-4 py-2 text-xs text-slate-100 shadow-xl"
          onAnimationEnd={() => undefined}
          role="status"
        >
          {toast}
          <button
            type="button"
            className="ml-2 text-slate-400 hover:text-white"
            onClick={() => setToast("")}
          >
            ✕
          </button>
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
