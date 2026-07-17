import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/** 공개 조회 — service role 우선, 없으면 anon(RLS) */
export function createSupabaseDataClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (url && service) return createSupabaseAdminClient();
  if (url && anon) {
    return createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  throw new Error("Supabase URL/키가 설정되지 않았습니다.");
}
