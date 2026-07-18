import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";

/** 공개 조회 — service role 우선, 없으면 anon(RLS) */
export function createSupabaseDataClient(): SupabaseClient {
  const url = getSupabaseUrl();
  const anon = getSupabaseAnonKey();
  const service = getSupabaseServiceRoleKey();

  if (url && service) return createSupabaseAdminClient();
  if (url && anon) {
    return createClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  throw new Error("Supabase URL/키가 설정되지 않았습니다.");
}
