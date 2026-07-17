import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type CreateConsultationInput = {
  clientName: string;
  phone: string;
  email?: string | null;
  category: string;
  subCategory?: string | null;
  summary: string;
  detail: string;
  method?: string | null;
  preferredAt?: string | null;
  accessCode: string;
};

export async function createConsultationSupabase(input: CreateConsultationInput) {
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("consultations")
    .insert({
      client_name: input.clientName,
      phone: input.phone,
      email: input.email ?? null,
      category: input.category,
      sub_category: input.subCategory ?? null,
      summary: input.summary,
      detail: input.detail,
      method: input.method ?? null,
      preferred_at: input.preferredAt ?? null,
      access_code: input.accessCode,
      status: "PENDING",
    })
    .select("id, access_code")
    .single();

  if (error) throw error;
  return { id: data.id as string, accessCode: data.access_code as string };
}

export async function lookupConsultationSupabase(accessCode: string, clientName?: string) {
  const sb = createSupabaseAdminClient();
  let q = sb.from("consultations").select("*").eq("access_code", accessCode.trim());
  if (clientName?.trim()) {
    q = q.ilike("client_name", clientName.trim());
  }
  const { data, error } = await q.order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (error) throw error;
  return data;
}
