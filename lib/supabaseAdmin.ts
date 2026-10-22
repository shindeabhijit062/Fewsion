// Only import this from API routes (server code).
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Server-only Supabase client using the service role key. It bypasses Row
// Level Security, so it must never be imported into client components.
// Every route that uses it has to check the caller's permissions first.

let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

export type AdminRole = 'super_admin' | 'admin';

/**
 * Checks the bearer token on a request and returns the caller if their
 * role in public.users is super_admin or admin. The role is read from the
 * database only (never from user_metadata, which users can edit themselves).
 */
export async function getAdminCaller(
  req: Request
): Promise<{ id: string; email: string | null; role: AdminRole } | null> {
  const admin = getSupabaseAdmin();
  if (!admin) return null;

  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return null;

  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return null;

  const { data: row } = await admin.from('users').select('role').eq('id', data.user.id).maybeSingle();
  const role = String(row?.role || '').toLowerCase();
  if (role !== 'super_admin' && role !== 'admin') return null;

  return { id: data.user.id, email: data.user.email ?? null, role };
}
