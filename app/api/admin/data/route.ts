import { NextResponse } from 'next/server';
import { checkAdminCaller, getSupabaseAdmin } from '@/lib/supabaseAdmin';

// Super admin data API: read, create, update and delete rows in any public
// table. Every request must carry the caller's Supabase access token, and
// the caller must have role super_admin (admins may only read). Writes are
// recorded in audit_logs.

export const dynamic = 'force-dynamic';

export interface ColumnInfo {
  name: string;
  format: string; // Postgres type, e.g. uuid, text, integer, jsonb, boolean
  type: string; // JSON type: string, integer, number, boolean, array, object
  required: boolean;
  hasDefault: boolean;
  isPrimaryKey: boolean;
  enum?: string[];
}

export interface TableInfo {
  name: string;
  primaryKey: string | null;
  columns: ColumnInfo[];
}

// Tables hidden from the data manager
const HIDDEN_TABLES = new Set<string>([]);

let schemaCache: { at: number; tables: TableInfo[] } | null = null;

async function loadSchema(): Promise<TableInfo[]> {
  if (schemaCache && Date.now() - schemaCache.at < 5 * 60_000) return schemaCache.tables;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const res = await fetch(`${url}/rest/v1/`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/openapi+json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Could not read database schema (${res.status})`);
  const spec = await res.json();

  const tables: TableInfo[] = Object.entries<any>(spec.definitions || {})
    .filter(([name]) => !HIDDEN_TABLES.has(name))
    .map(([name, def]) => {
      const required = new Set<string>(def.required || []);
      const columns: ColumnInfo[] = Object.entries<any>(def.properties || {}).map(([col, p]) => ({
        name: col,
        format: p.format || p.type || 'text',
        type: p.type || 'string',
        required: required.has(col),
        hasDefault: p.default !== undefined,
        isPrimaryKey: String(p.description || '').includes('<pk/>'),
        enum: Array.isArray(p.enum) ? p.enum : undefined,
      }));
      const pk = columns.find((c) => c.isPrimaryKey)?.name ?? (columns.some((c) => c.name === 'id') ? 'id' : null);
      return { name, primaryKey: pk, columns };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  schemaCache = { at: Date.now(), tables };
  return tables;
}

const json = (body: unknown, status = 200) => NextResponse.json(body, { status });

async function guard(req: Request, needsWrite: boolean) {
  if (!getSupabaseAdmin()) {
    return {
      error: json(
        { error: 'SUPABASE_SERVICE_ROLE_KEY is not set on the server. Add it to your environment variables to enable admin editing.' },
        500
      ),
    };
  }
  const check = await checkAdminCaller(req);
  if (!check.ok) return { error: json({ error: `Not authorised: ${check.reason}` }, 401) };
  const caller = check.caller;
  if (needsWrite && caller.role !== 'super_admin') {
    return { error: json({ error: 'Only Super Admins can change data.' }, 403) };
  }
  return { caller };
}

async function findTable(name: unknown) {
  const tables = await loadSchema();
  return tables.find((t) => t.name === name) ?? null;
}

// Drop keys that aren't real columns so nothing unexpected is written
function cleanValues(table: TableInfo, values: Record<string, unknown>) {
  const allowed = new Set(table.columns.map((c) => c.name));
  return Object.fromEntries(Object.entries(values || {}).filter(([k]) => allowed.has(k)));
}

async function audit(actorId: string, action: string, table: string, targetId: unknown, metadata: Record<string, unknown>) {
  const admin = getSupabaseAdmin()!;
  const { error } = await admin.from('audit_logs').insert({
    actor_user_id: actorId,
    action,
    target_type: table,
    target_id: targetId != null ? String(targetId) : null,
    metadata,
  });
  if (error) console.warn('Audit log failed:', error.message);
}

// ---------------------------------------------------------------------
// GET  ?schema=1                       -> tables + columns + row counts
// GET  ?table=x&limit=50&offset=0&q=.. -> rows
// ---------------------------------------------------------------------
export async function GET(req: Request) {
  const g = await guard(req, false);
  if (g.error) return g.error;
  const admin = getSupabaseAdmin()!;
  const { searchParams } = new URL(req.url);

  try {
    if (searchParams.get('schema')) {
      const tables = await loadSchema();
      const counts = await Promise.all(
        tables.map(async (t) => {
          const { count } = await admin.from(t.name).select('*', { count: 'exact', head: true });
          return count ?? 0;
        })
      );
      return json({
        role: g.caller!.role,
        tables: tables.map((t, i) => ({ ...t, count: counts[i] })),
      });
    }

    const table = await findTable(searchParams.get('table'));
    if (!table) return json({ error: 'Unknown table' }, 400);

    const limit = Math.min(500, Math.max(1, Number(searchParams.get('limit')) || 50));
    const offset = Math.max(0, Number(searchParams.get('offset')) || 0);
    const q = (searchParams.get('q') || '').trim();

    let query = admin.from(table.name).select('*', { count: 'exact' });

    // Search across text-like columns
    if (q) {
      const safe = q.replace(/[,()*%]/g, ' ').trim();
      const textCols = table.columns.filter((c) =>
        ['text', 'character varying', 'citext'].includes(c.format) || c.format.startsWith('public.')
      );
      const conditions = textCols.map((c) => `${c.name}.ilike.*${safe}*`);
      if (/^[0-9a-f-]{36}$/i.test(safe)) {
        table.columns.filter((c) => c.format === 'uuid').forEach((c) => conditions.push(`${c.name}.eq.${safe}`));
      }
      if (conditions.length) query = query.or(conditions.join(','));
    }

    const orderCol = table.columns.find((c) => c.name === 'created_at')
      ? 'created_at'
      : table.primaryKey || table.columns[0]?.name;
    if (orderCol) query = query.order(orderCol, { ascending: false });

    const { data, error, count } = await query.range(offset, offset + limit - 1);
    if (error) return json({ error: error.message }, 400);
    return json({ rows: data ?? [], count: count ?? 0 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Request failed' }, 500);
  }
}

// ---------------------------------------------------------------------
// POST   { table, values }        -> create
// PATCH  { table, id, values }    -> update
// DELETE { table, id }            -> delete
// ---------------------------------------------------------------------
export async function POST(req: Request) {
  const g = await guard(req, true);
  if (g.error) return g.error;
  const admin = getSupabaseAdmin()!;
  try {
    const body = await req.json();
    const table = await findTable(body.table);
    if (!table) return json({ error: 'Unknown table' }, 400);

    const values = cleanValues(table, body.values);
    const { data, error } = await admin.from(table.name).insert(values).select().single();
    if (error) return json({ error: error.message }, 400);

    await audit(g.caller!.id, 'ADMIN_CREATE', table.name, table.primaryKey ? data?.[table.primaryKey] : null, {
      actor_email: g.caller!.email,
      fields: Object.keys(values),
    });
    return json({ row: data });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Create failed' }, 500);
  }
}

export async function PATCH(req: Request) {
  const g = await guard(req, true);
  if (g.error) return g.error;
  const admin = getSupabaseAdmin()!;
  try {
    const body = await req.json();
    const table = await findTable(body.table);
    if (!table?.primaryKey) return json({ error: 'Unknown table or table has no primary key' }, 400);
    if (body.id == null) return json({ error: 'Missing id' }, 400);

    const values = cleanValues(table, body.values);
    delete values[table.primaryKey];
    if (!Object.keys(values).length) return json({ error: 'Nothing to update' }, 400);

    const { data, error } = await admin.from(table.name).update(values).eq(table.primaryKey, body.id).select().maybeSingle();
    if (error) return json({ error: error.message }, 400);
    if (!data) return json({ error: 'Record not found' }, 404);

    await audit(g.caller!.id, 'ADMIN_UPDATE', table.name, body.id, {
      actor_email: g.caller!.email,
      fields: Object.keys(values),
    });
    return json({ row: data });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Update failed' }, 500);
  }
}

export async function DELETE(req: Request) {
  const g = await guard(req, true);
  if (g.error) return g.error;
  const admin = getSupabaseAdmin()!;
  try {
    const body = await req.json();
    const table = await findTable(body.table);
    if (!table?.primaryKey) return json({ error: 'Unknown table or table has no primary key' }, 400);
    if (body.id == null) return json({ error: 'Missing id' }, 400);

    if (table.name === 'users' && body.id === g.caller!.id) {
      return json({ error: "You can't delete your own account." }, 400);
    }

    const { data: before } = await admin.from(table.name).select('*').eq(table.primaryKey, body.id).maybeSingle();
    if (!before) return json({ error: 'Record not found' }, 404);

    const { error } = await admin.from(table.name).delete().eq(table.primaryKey, body.id);
    if (error) return json({ error: error.message }, 400);

    // Deleting a user also removes their login, so they can't sign back in
    let authDeleted = false;
    if (table.name === 'users') {
      const { error: authErr } = await admin.auth.admin.deleteUser(String(body.id));
      authDeleted = !authErr;
      if (authErr) console.warn('Auth user delete failed:', authErr.message);
    }

    await audit(g.caller!.id, 'ADMIN_DELETE', table.name, body.id, {
      actor_email: g.caller!.email,
      ...(table.name === 'users' ? { auth_account_deleted: authDeleted } : {}),
    });
    return json({ ok: true });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Delete failed' }, 500);
  }
}
