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

// Which kind of Supabase key is configured: new-style keys have a prefix,
// legacy keys are JWTs whose payload carries the role.
function keyKind(key: string): 'service' | 'public' | 'unknown' {
  if (key.startsWith('sb_secret_')) return 'service';
  if (key.startsWith('sb_publishable_')) return 'public';
  try {
    const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64').toString('utf8'));
    if (payload.role === 'service_role') return 'service';
    if (payload.role === 'anon') return 'public';
  } catch {}
  return 'unknown';
}

const SUPER_ROLES = ['super_admin', 'superadmin'];
const ADMIN_ROLES = ['admin'];

export type AdminCheck =
  | { ok: true; caller: { id: string; email: string | null; role: AdminRole } }
  | { ok: false; reason: string };

/**
 * Checks the bearer token on a request and returns the caller if they are a
 * super admin or admin. The role comes from public.users (matched by id, then
 * by email, like the Super Admin login) or from app_metadata. user_metadata
 * is ignored on purpose: any signed-in user can edit it themselves.
 */
export async function checkAdminCaller(req: Request): Promise<AdminCheck> {
  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, reason: 'Server is missing SUPABASE_SERVICE_ROLE_KEY.' };
  if (keyKind(process.env.SUPABASE_SERVICE_ROLE_KEY || '') === 'public') {
    return {
      ok: false,
      reason:
        'SUPABASE_SERVICE_ROLE_KEY is set to the public anon key. Replace it in Vercel with the secret "service_role" key from Supabase → Project Settings → API Keys, then redeploy.',
    };
  }

  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return { ok: false, reason: 'You are not signed in. Sign in again from the Super Admin login.' };

  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) {
    return { ok: false, reason: 'Your session has expired. Sign out and sign in again.' };
  }
  const user = data.user;

  let rawRole: unknown = null;
  const { data: byId, error: idErr } = await admin.from('users').select('role').eq('id', user.id).maybeSingle();
  if (idErr) return { ok: false, reason: `Could not read the users table: ${idErr.message}` };
  rawRole = byId?.role;
  if (!rawRole && user.email) {
    const { data: byEmail, error: emailErr } = await admin
      .from('users')
      .select('role')
      .ilike('email', user.email)
      .limit(1)
      .maybeSingle();
    if (emailErr) return { ok: false, reason: `Could not read the users table: ${emailErr.message}` };
    rawRole = byEmail?.role;
  }
  if (!rawRole) rawRole = user.app_metadata?.role;

  const role = String(rawRole || '').toLowerCase();
  if (SUPER_ROLES.includes(role)) return { ok: true, caller: { id: user.id, email: user.email ?? null, role: 'super_admin' } };
  if (ADMIN_ROLES.includes(role)) return { ok: true, caller: { id: user.id, email: user.email ?? null, role: 'admin' } };

  return {
    ok: false,
    reason: rawRole
      ? `Account ${user.email} has role "${rawRole}", not super_admin.`
      : `Account ${user.email} has no role in the users table. Set its role to super_admin in Supabase (Table Editor → users).`,
  };
}

/** The signed-in user behind a request's bearer token, or null */
export async function getRequestUser(req: Request) {
  const admin = getSupabaseAdmin();
  if (!admin) return null;
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const { data, error } = await admin.auth.getUser(token);
  return error ? null : data.user;
}
