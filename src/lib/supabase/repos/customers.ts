import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  normalizePhone,
  phonesMatch,
  type CustomerCardDTO,
  type CustomerInteractionDTO,
  type CustomerRelatedConsultation,
  type CustomerRelatedSubscriber,
  type CustomerWriteInput,
  type SeedCustomerSpec,
} from "@/lib/customers/types";

type SbCard = Record<string, unknown>;
type SbIx = Record<string, unknown>;

function mapInteraction(row: SbIx): CustomerInteractionDTO {
  return {
    id: String(row.id),
    customerId: String(row.customer_id),
    occurredAt: String(row.occurred_at ?? row.created_at),
    channel: String(row.channel ?? "phone"),
    title: String(row.title ?? ""),
    body: String(row.body ?? ""),
    createdAt: String(row.created_at),
  };
}

function mapCard(row: SbCard, interactions?: CustomerInteractionDTO[]): CustomerCardDTO {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    phone: String(row.phone ?? ""),
    email: row.email != null ? String(row.email) : null,
    currentAddress: row.current_address != null ? String(row.current_address) : null,
    profileImage: row.profile_image != null ? String(row.profile_image) : null,
    primaryContactMethod: String(row.primary_contact_method ?? "phone"),
    hasTraded: Boolean(row.has_traded),
    isSubscribed: Boolean(row.is_subscribed),
    pipelineStage: String(row.pipeline_stage ?? "new"),
    budgetRange: row.budget_range != null ? String(row.budget_range) : null,
    needsLoan: Boolean(row.needs_loan),
    purpose: String(row.purpose ?? "reside"),
    moveUrgency: String(row.move_urgency ?? "mid"),
    moveDate: row.move_date != null ? String(row.move_date).slice(0, 10) : null,
    familyMembers: row.family_members != null ? String(row.family_members) : null,
    preferredBrand: row.preferred_brand != null ? String(row.preferred_brand) : null,
    decisionMaker: row.decision_maker != null ? String(row.decision_maker) : null,
    inquiryDetails: String(row.inquiry_details ?? ""),
    requestNotes: String(row.request_notes ?? ""),
    specialNotes: String(row.special_notes ?? ""),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    interactions,
  };
}

function toRow(input: CustomerWriteInput, partial = false) {
  const row: Record<string, unknown> = {};
  const set = (key: string, value: unknown) => {
    if (value !== undefined) row[key] = value;
  };

  if (!partial || input.name !== undefined) set("name", input.name?.trim() ?? "");
  if (input.phone !== undefined) set("phone", input.phone.trim());
  if (input.email !== undefined) set("email", input.email?.trim() || null);
  if (input.currentAddress !== undefined)
    set("current_address", input.currentAddress?.trim() || null);
  if (input.profileImage !== undefined)
    set("profile_image", input.profileImage?.trim() || null);
  if (input.primaryContactMethod !== undefined)
    set("primary_contact_method", input.primaryContactMethod);
  if (input.hasTraded !== undefined) set("has_traded", input.hasTraded);
  if (input.isSubscribed !== undefined) set("is_subscribed", input.isSubscribed);
  if (input.pipelineStage !== undefined) set("pipeline_stage", input.pipelineStage);
  if (input.budgetRange !== undefined) set("budget_range", input.budgetRange?.trim() || null);
  if (input.needsLoan !== undefined) set("needs_loan", input.needsLoan);
  if (input.purpose !== undefined) set("purpose", input.purpose);
  if (input.moveUrgency !== undefined) set("move_urgency", input.moveUrgency);
  if (input.moveDate !== undefined) set("move_date", input.moveDate || null);
  if (input.familyMembers !== undefined)
    set("family_members", input.familyMembers?.trim() || null);
  if (input.preferredBrand !== undefined)
    set("preferred_brand", input.preferredBrand?.trim() || null);
  if (input.decisionMaker !== undefined)
    set("decision_maker", input.decisionMaker?.trim() || null);
  if (input.inquiryDetails !== undefined) set("inquiry_details", input.inquiryDetails);
  if (input.requestNotes !== undefined) set("request_notes", input.requestNotes);
  if (input.specialNotes !== undefined) set("special_notes", input.specialNotes);
  set("updated_at", new Date().toISOString());
  return row;
}

export async function listCustomerCardsFromSupabase(): Promise<CustomerCardDTO[]> {
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("customer_cards")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    if (
      error.code === "PGRST205" ||
      /schema cache|does not exist/i.test(error.message)
    ) {
      console.warn("[customers] customer_cards 없음 — 004_customer_crm.sql 을 Run 하세요.");
      return [];
    }
    throw error;
  }
  return (data ?? []).map((r) => mapCard(r as SbCard));
}

export async function getCustomerCardFromSupabase(
  id: string,
): Promise<CustomerCardDTO | null> {
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb.from("customer_cards").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const { data: ixs, error: ixErr } = await sb
    .from("customer_interactions")
    .select("*")
    .eq("customer_id", id)
    .order("occurred_at", { ascending: false });
  if (ixErr) throw ixErr;

  return mapCard(
    data as SbCard,
    (ixs ?? []).map((r) => mapInteraction(r as SbIx)),
  );
}

export async function createCustomerCardSupabase(
  input: CustomerWriteInput,
): Promise<CustomerCardDTO> {
  if (!input.name?.trim()) throw new Error("이름을 입력하세요.");
  const sb = createSupabaseAdminClient();
  const row = {
    name: input.name.trim(),
    phone: (input.phone ?? "").trim(),
    email: input.email?.trim() || null,
    current_address: input.currentAddress?.trim() || null,
    profile_image: input.profileImage?.trim() || null,
    primary_contact_method: input.primaryContactMethod ?? "phone",
    has_traded: input.hasTraded ?? false,
    is_subscribed: input.isSubscribed ?? false,
    pipeline_stage: input.pipelineStage ?? "new",
    budget_range: input.budgetRange?.trim() || null,
    needs_loan: input.needsLoan ?? false,
    purpose: input.purpose ?? "reside",
    move_urgency: input.moveUrgency ?? "mid",
    move_date: input.moveDate || null,
    family_members: input.familyMembers?.trim() || null,
    preferred_brand: input.preferredBrand?.trim() || null,
    decision_maker: input.decisionMaker?.trim() || null,
    inquiry_details: input.inquiryDetails ?? "",
    request_notes: input.requestNotes ?? "",
    special_notes: input.specialNotes ?? "",
  };
  const { data, error } = await sb.from("customer_cards").insert(row).select("*").single();
  if (error) throw new Error(error.message);
  return mapCard(data as SbCard);
}

export async function updateCustomerCardSupabase(
  id: string,
  input: CustomerWriteInput,
): Promise<CustomerCardDTO> {
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("customer_cards")
    .update(toRow(input, true))
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return mapCard(data as SbCard);
}

export async function deleteCustomerCardSupabase(id: string) {
  const sb = createSupabaseAdminClient();
  const { error } = await sb.from("customer_cards").delete().eq("id", id);
  if (error) throw error;
}

export async function findCustomerCardsByPhoneSupabase(
  phone: string,
): Promise<CustomerCardDTO[]> {
  const digits = normalizePhone(phone);
  if (!digits) return [];
  const all = await listCustomerCardsFromSupabase();
  return all.filter((c) => phonesMatch(c.phone, digits));
}

/** 샘플 시드 전화와 일치하는 카드 일괄 삭제 */
export async function deleteCustomerCardsByPhonesSupabase(phones: string[]) {
  const targets = new Set(phones.map(normalizePhone).filter(Boolean));
  if (!targets.size) return 0;
  const all = await listCustomerCardsFromSupabase();
  const ids = all.filter((c) => targets.has(normalizePhone(c.phone))).map((c) => c.id);
  if (!ids.length) return 0;
  const sb = createSupabaseAdminClient();
  const { error } = await sb.from("customer_cards").delete().in("id", ids);
  if (error) throw new Error(error.message);
  return ids.length;
}

export async function addCustomerInteractionSupabase(
  customerId: string,
  input: { occurredAt?: string; channel?: string; title: string; body?: string },
): Promise<CustomerInteractionDTO> {
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("customer_interactions")
    .insert({
      customer_id: customerId,
      occurred_at: input.occurredAt || new Date().toISOString(),
      channel: input.channel ?? "phone",
      title: input.title.trim(),
      body: input.body?.trim() ?? "",
    })
    .select("*")
    .single();
  if (error) throw error;
  return mapInteraction(data as SbIx);
}

export async function findRelatedByPhoneSupabase(phone: string): Promise<{
  consultations: CustomerRelatedConsultation[];
  subscribers: CustomerRelatedSubscriber[];
}> {
  const digits = normalizePhone(phone);
  if (!digits) return { consultations: [], subscribers: [] };

  const sb = createSupabaseAdminClient();
  const [cRes, sRes] = await Promise.all([
    sb
      .from("consultations")
      .select("id, client_name, category, status, created_at, phone")
      .order("created_at", { ascending: false })
      .limit(200),
    sb
      .from("subscribers")
      .select("id, name, subscription_type, status, created_at, phone")
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  if (cRes.error) throw cRes.error;
  if (sRes.error) throw sRes.error;

  const consultations = (cRes.data ?? [])
    .filter((r) => phonesMatch(String(r.phone ?? ""), digits))
    .slice(0, 10)
    .map((r) => ({
      id: String(r.id),
      clientName: String(r.client_name ?? ""),
      category: String(r.category ?? ""),
      status: String(r.status ?? ""),
      createdAt: String(r.created_at),
    }));

  const subscribers = (sRes.data ?? [])
    .filter((r) => phonesMatch(r.phone != null ? String(r.phone) : "", digits))
    .slice(0, 10)
    .map((r) => ({
      id: String(r.id),
      name: r.name != null ? String(r.name) : null,
      subscriptionType: String(r.subscription_type ?? ""),
      status: String(r.status ?? ""),
      createdAt: String(r.created_at),
    }));

  return { consultations, subscribers };
}

export async function seedCustomerCardsSupabase(specs: SeedCustomerSpec[]) {
  const created: CustomerCardDTO[] = [];
  for (const spec of specs) {
    const { interactions, ...card } = spec;
    const row = await createCustomerCardSupabase(card);
    for (const ix of interactions ?? []) {
      const at = new Date(Date.now() - ix.daysAgo * 24 * 60 * 60 * 1000).toISOString();
      await addCustomerInteractionSupabase(row.id, {
        occurredAt: at,
        channel: ix.channel,
        title: ix.title,
        body: ix.body,
      });
    }
    const full = await getCustomerCardFromSupabase(row.id);
    if (full) created.push(full);
  }
  return created;
}
