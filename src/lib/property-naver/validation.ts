import type { PropertyCategory, PropertyType } from "@prisma/client";
import { getCategoryGroup } from "./categories";
import { getFieldsForGroup, uniqueFields } from "./field-spec";
import type { FieldSpec } from "./types";

export type PropertyValidationResult =
  | { ok: true }
  | { ok: false; error: string; field?: string };

function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

function asNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function validatePropertyForm(
  body: Record<string, unknown>,
  specs: Record<string, unknown> = {},
): PropertyValidationResult {
  const category = body.category as PropertyCategory | undefined;
  const type = body.type as PropertyType | undefined;
  if (!category) return { ok: false, error: "물건 유형이 필요합니다.", field: "category" };
  if (!type) return { ok: false, error: "거래 유형이 필요합니다.", field: "type" };

  const group = getCategoryGroup(category);
  const fields = uniqueFields(getFieldsForGroup(group));

  const merged: Record<string, unknown> = { ...body, ...specs };

  for (const field of fields) {
    if (!field.is_required) continue;
    // Conditional requireds handled below
    if (field.field_name === "moveInDate") continue;
    if (field.field_name === "price") continue;
    if (field.field_name === "deposit") continue;
    if (field.field_name === "monthlyRent") continue;
    if (field.field_name === "clientName") continue;

    const value = field.storage === "specs" ? specs[field.field_name] : merged[field.field_name];
    if (isEmpty(value) && field.data_type !== "Boolean") {
      return { ok: false, error: `${field.label}은(는) 필수입니다.`, field: field.field_name };
    }
  }

  if (body.moveInType === "지정일" && isEmpty(body.moveInDate)) {
    return { ok: false, error: "입주 지정일을 입력하세요.", field: "moveInDate" };
  }

  if (type === "SALE" || type === "PRE_SALE") {
    const price = asNumber(body.price);
    if (price == null || price <= 0) {
      return { ok: false, error: "매매가/분양가는 0보다 커야 합니다.", field: "price" };
    }
  }

  if (type === "RENT" || type === "SHORT_TERM") {
    const deposit = asNumber(body.deposit);
    if (deposit == null || deposit < 0) {
      return { ok: false, error: "보증금을 입력하세요.", field: "deposit" };
    }
    const isJeonse = Boolean(body.isJeonse) || body.dealSubType === "JEONSE";
    if (!isJeonse || type === "SHORT_TERM") {
      const rent = asNumber(body.monthlyRent);
      if (rent == null || rent <= 0) {
        return { ok: false, error: "월세액을 입력하세요.", field: "monthlyRent" };
      }
    }
  }

  if (body.ownerRelation === "대리인" && isEmpty(body.clientName)) {
    return { ok: false, error: "대리인인 경우 의뢰인명을 입력하세요.", field: "clientName" };
  }

  // Type checks for filled numbers
  for (const field of fields) {
    const raw = field.storage === "specs" ? specs[field.field_name] : merged[field.field_name];
    if (isEmpty(raw)) continue;
    if (field.data_type === "Number") {
      const n = asNumber(raw);
      if (n == null) {
        return { ok: false, error: `${field.label}은(는) 숫자여야 합니다.`, field: field.field_name };
      }
      if (n < 0) {
        return { ok: false, error: `${field.label}은(는) 0 이상이어야 합니다.`, field: field.field_name };
      }
    }
    if (field.data_type === "Date" && typeof raw === "string") {
      if (field.field_name === "moveInDate" && body.moveInType !== "지정일") {
        continue;
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
        return { ok: false, error: `${field.label}은(는) YYYY-MM-DD 형식이어야 합니다.`, field: field.field_name };
      }
    }
    if (field.data_type === "Select" && field.options && typeof raw === "string") {
      if (!field.options.includes(raw)) {
        return { ok: false, error: `${field.label} 값이 올바르지 않습니다.`, field: field.field_name };
      }
    }
  }

  return { ok: true };
}

export function collectSpecsFromBody(
  body: Record<string, unknown>,
  category: PropertyCategory,
): Record<string, unknown> {
  const group = getCategoryGroup(category);
  const fields = getFieldsForGroup(group).filter((f) => f.storage === "specs");
  const existing =
    body.specs && typeof body.specs === "object" && !Array.isArray(body.specs)
      ? { ...(body.specs as Record<string, unknown>) }
      : {};

  for (const field of fields) {
    if (field.field_name in body) {
      existing[field.field_name] = normalizeSpecValue(field, body[field.field_name]);
    }
  }
  return existing;
}

function normalizeSpecValue(field: FieldSpec, value: unknown): unknown {
  if (field.data_type === "Number") return asNumber(value);
  if (field.data_type === "Boolean") return Boolean(value);
  if (field.data_type === "MultiSelect") {
    return Array.isArray(value) ? value : [];
  }
  if (value == null || value === "") return null;
  return value;
}

export function sqmToPyeong(sqm: number): number {
  return Math.round(sqm * 0.3025 * 100) / 100;
}
