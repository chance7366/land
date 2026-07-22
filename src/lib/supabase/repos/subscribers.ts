import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type CreateSubscriberInput = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  subscriptionType: string;
  channels: string[];
  preferences: Record<string, unknown>;
  isPrivacyAgreed: boolean;
};

export type SubscriberRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  subscription_type: string;
  channels: unknown;
  preferences: unknown;
  status: string;
  admin_note: string | null;
  is_privacy_agreed: boolean;
  unsubscribe_token: string;
  created_at: string;
  updated_at: string;
};

export async function createSubscriberSupabase(input: CreateSubscriberInput) {
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("subscribers")
    .insert({
      name: input.name ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      subscription_type: input.subscriptionType,
      channels: input.channels,
      preferences: input.preferences,
      is_privacy_agreed: input.isPrivacyAgreed,
      status: "PENDING",
    })
    .select("id, unsubscribe_token")
    .single();

  if (error) throw error;
  return data;
}

export async function findSubscriberSupabase(opts: {
  email?: string | null;
  phone?: string | null;
  subscriptionType: string;
}) {
  const sb = createSupabaseAdminClient();
  let q = sb
    .from("subscribers")
    .select("*")
    .eq("subscription_type", opts.subscriptionType);

  if (opts.email) q = q.eq("email", opts.email);
  else if (opts.phone) q = q.eq("phone", opts.phone);
  else return null;

  const { data, error } = await q.limit(1).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listSubscribersSupabase(opts?: {
  status?: string;
  subscriptionType?: string;
}): Promise<SubscriberRow[]> {
  const sb = createSupabaseAdminClient();
  let q = sb.from("subscribers").select("*").order("created_at", { ascending: false });
  if (opts?.status) q = q.eq("status", opts.status);
  if (opts?.subscriptionType) q = q.eq("subscription_type", opts.subscriptionType);
  const { data, error } = await q.limit(2000);
  if (error) throw error;
  return (data ?? []) as SubscriberRow[];
}

export async function updateSubscriberSupabase(
  id: string,
  patch: { status?: string; adminNote?: string | null },
) {
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb
    .from("subscribers")
    .update({
      ...(patch.status ? { status: patch.status } : {}),
      ...(patch.adminNote !== undefined ? { admin_note: patch.adminNote } : {}),
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as SubscriberRow;
}

export async function deleteSubscriberSupabase(id: string) {
  const sb = createSupabaseAdminClient();
  const { error } = await sb.from("subscribers").delete().eq("id", id);
  if (error) throw error;
}
