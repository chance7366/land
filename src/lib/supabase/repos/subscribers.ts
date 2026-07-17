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
