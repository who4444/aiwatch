import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Build-time / dev fallback: mock client that no-ops if env missing
function createMock() {
  const noop = async () => ({ data: null, error: null });
  return {
    from: () => ({ select: noop, insert: noop, upsert: noop, update: noop, delete: noop, eq: () => ({ select: noop }) }),
    rpc: noop,
  } as unknown as ReturnType<typeof createClient>;
}

export const supabase =
  url && anon ? createClient(url, anon) : createMock();

export const supabaseAdmin =
  url && service ? createClient(url, service) : supabase;

export const isSupabaseConfigured = Boolean(url && anon);
