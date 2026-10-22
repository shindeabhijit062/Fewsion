import { supabase } from '@/utils/supabase';

// Browser helper for the super admin data API (/api/admin/data).
// Sends the signed-in admin's access token with every request.

export interface ColumnInfo {
  name: string;
  format: string;
  type: string;
  required: boolean;
  hasDefault: boolean;
  isPrimaryKey: boolean;
  enum?: string[];
}

export interface TableInfo {
  name: string;
  primaryKey: string | null;
  columns: ColumnInfo[];
  count?: number;
}

async function call<T>(method: string, params: Record<string, string> | null, body?: unknown): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const qs = params ? `?${new URLSearchParams(params)}` : '';
  const res = await fetch(`/api/admin/data${qs}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token ?? ''}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data as T;
}

export const adminApi = {
  schema: () => call<{ role: string; tables: TableInfo[] }>('GET', { schema: '1' }),
  list: (table: string, opts: { limit?: number; offset?: number; q?: string } = {}) =>
    call<{ rows: Record<string, any>[]; count: number }>('GET', {
      table,
      limit: String(opts.limit ?? 50),
      offset: String(opts.offset ?? 0),
      ...(opts.q ? { q: opts.q } : {}),
    }),
  create: (table: string, values: Record<string, unknown>) =>
    call<{ row: Record<string, any> }>('POST', null, { table, values }),
  update: (table: string, id: unknown, values: Record<string, unknown>) =>
    call<{ row: Record<string, any> }>('PATCH', null, { table, id, values }),
  remove: (table: string, id: unknown) => call<{ ok: true }>('DELETE', null, { table, id }),
};

let schemaPromise: Promise<TableInfo[]> | null = null;

/** Table definitions, fetched once per page load */
export function getAdminSchema(): Promise<TableInfo[]> {
  if (!schemaPromise) {
    schemaPromise = adminApi
      .schema()
      .then((r) => r.tables)
      .catch((e) => {
        schemaPromise = null;
        throw e;
      });
  }
  return schemaPromise;
}
