import { isSupabaseEnabled } from "@/lib/supabase/config";
import { CUSTOMER_SEED_PHONES, CUSTOMER_SEED_SPECS } from "@/lib/customers/seed-data";
import { normalizePhone, type CustomerWriteInput } from "@/lib/customers/types";
import {
  addCustomerInteractionPrisma,
  createCustomerCardPrisma,
  deleteCustomerCardPrisma,
  deleteCustomerCardsByPhonesPrisma,
  findCustomerCardsByPhonePrisma,
  findRelatedByPhonePrisma,
  getCustomerCardPrisma,
  listCustomerCardsPrisma,
  seedCustomerCardsPrisma,
  updateCustomerCardPrisma,
} from "@/lib/customers/prisma-customers";
import {
  addCustomerInteractionSupabase,
  createCustomerCardSupabase,
  deleteCustomerCardSupabase,
  deleteCustomerCardsByPhonesSupabase,
  findCustomerCardsByPhoneSupabase,
  findRelatedByPhoneSupabase,
  getCustomerCardFromSupabase,
  listCustomerCardsFromSupabase,
  seedCustomerCardsSupabase,
  updateCustomerCardSupabase,
} from "@/lib/supabase/repos/customers";

export async function listCustomers() {
  if (isSupabaseEnabled()) return listCustomerCardsFromSupabase();
  return listCustomerCardsPrisma();
}

export async function getCustomer(id: string) {
  if (isSupabaseEnabled()) return getCustomerCardFromSupabase(id);
  return getCustomerCardPrisma(id);
}

export async function findCustomersByPhone(phone: string) {
  if (isSupabaseEnabled()) return findCustomerCardsByPhoneSupabase(phone);
  return findCustomerCardsByPhonePrisma(phone);
}

export async function createCustomer(input: CustomerWriteInput) {
  const phone = (input.phone ?? "").trim();
  if (phone) {
    const dupes = await findCustomersByPhone(phone);
    if (dupes.length) {
      const names = dupes
        .slice(0, 3)
        .map((d) => d.name)
        .join(", ");
      throw new Error(
        `이미 등록된 전화번호입니다 (${normalizePhone(phone)}). 기존: ${names}. 리스트에서 검색해 주세요.`,
      );
    }
  }
  if (isSupabaseEnabled()) return createCustomerCardSupabase(input);
  return createCustomerCardPrisma(input);
}

export async function updateCustomer(id: string, input: CustomerWriteInput) {
  if (isSupabaseEnabled()) return updateCustomerCardSupabase(id, input);
  return updateCustomerCardPrisma(id, input);
}

export async function deleteCustomer(id: string) {
  if (isSupabaseEnabled()) return deleteCustomerCardSupabase(id);
  return deleteCustomerCardPrisma(id);
}

export async function addCustomerInteraction(
  customerId: string,
  input: { occurredAt?: string; channel?: string; title: string; body?: string },
) {
  if (isSupabaseEnabled()) return addCustomerInteractionSupabase(customerId, input);
  return addCustomerInteractionPrisma(customerId, input);
}

export async function findRelatedByPhone(phone: string) {
  if (isSupabaseEnabled()) return findRelatedByPhoneSupabase(phone);
  return findRelatedByPhonePrisma(phone);
}

export async function seedCustomers(opts?: { reset?: boolean }) {
  const reset = Boolean(opts?.reset);
  const phones = [...CUSTOMER_SEED_PHONES];

  if (!reset) {
    const existing = await listCustomers();
    const seedDigits = new Set(phones.map(normalizePhone));
    const already = existing.filter((c) => seedDigits.has(normalizePhone(c.phone)));
    if (already.length > 0) {
      // 전화번호당 1명만 대표로 반환 (중복 쌓인 상태 안내)
      const byPhone = new Map<string, (typeof already)[0]>();
      for (const row of already) {
        const d = normalizePhone(row.phone);
        if (!byPhone.has(d)) byPhone.set(d, row);
      }
      return {
        items: [...byPhone.values()],
        skipped: true as const,
        removed: 0,
        message: `샘플 전화번호가 이미 ${already.length}건 있습니다. 중복을 정리하려면 「샘플 초기화」를 사용하세요.`,
      };
    }
  }

  let removed = 0;
  if (isSupabaseEnabled()) {
    removed = await deleteCustomerCardsByPhonesSupabase(phones);
    const items = await seedCustomerCardsSupabase(CUSTOMER_SEED_SPECS);
    return { items, skipped: false as const, removed, message: null as string | null };
  }
  removed = await deleteCustomerCardsByPhonesPrisma(phones);
  const items = await seedCustomerCardsPrisma(CUSTOMER_SEED_SPECS);
  return { items, skipped: false as const, removed, message: null as string | null };
}
