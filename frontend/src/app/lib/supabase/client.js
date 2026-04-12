"use client";
import { createBrowserClient } from "@supabase/ssr";

let _client = null;

export function getSupabaseClient() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Add them to frontend/.env.local."
    );
  }
  _client = createBrowserClient(url, anonKey);
  return _client;
}
