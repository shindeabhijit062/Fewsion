'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Database, Search, Plus, Pencil, Trash2, Loader2, ChevronLeft, ChevronRight, RefreshCw, AlertTriangle } from 'lucide-react';
import { adminApi, getAdminSchema, TableInfo } from '@/lib/adminApi';
import RecordEditor from '@/components/superadmin/RecordEditor';
import ConfirmModal from '@/components/superadmin/ConfirmModal';

const PAGE_SIZE = 25;

const cell = (v: any): string => {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'object') return JSON.stringify(v);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  const s = String(v);
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) {
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  }
  return s;
};

export default function SuperAdminDataManagerPage() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [schemaError, setSchemaError] = useState('');
  const [active, setActive] = useState<string>('');
  const [tableFilter, setTableFilter] = useState('');

  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [rowsError, setRowsError] = useState('');

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, any> | null>(null);
  const [deleting, setDeleting] = useState<Record<string, any> | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    getAdminSchema()
      .then((t) => {
        setTables(t);
        const first = t.find((x) => x.name === 'users') || t[0];
        if (first) setActive(first.name);
      })
      .catch((e) => setSchemaError(e.message));
  }, []);

  const table = tables.find((t) => t.name === active) || null;

  const loadRows = useCallback(async () => {
    if (!active) return;
    setLoading(true);
    setRowsError('');
    try {
      const res = await adminApi.list(active, { limit: PAGE_SIZE, offset: page * PAGE_SIZE, q: query });
      setRows(res.rows);
      setCount(res.count);
    } catch (e) {
      setRowsError((e as Error).message);
      setRows([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [active, page, query]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  // Debounced server-side search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(0);
      setQuery(search.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const switchTable = (name: string) => {
    setActive(name);
    setPage(0);
    setSearch('');
    setQuery('');
  };

  // Show the most useful columns first; JSON blobs and long ids last
  const columns = useMemo(() => {
    if (!table) return [];
    const score = (name: string, format: string) => {
      if (/name|title|email|handle/.test(name)) return 0;
      if (/status|role|niche|industry|amount|budget|score/.test(name)) return 1;
      if (format === 'uuid') return 3;
      if (format === 'jsonb' || format === 'json') return 4;
      return 2;
    };
    return [...table.columns].sort((a, b) => score(a.name, a.format) - score(b.name, b.format));
  }, [table]);

  const pk = table?.primaryKey;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const confirmDelete = async () => {
    if (!deleting || !pk) return;
    setDeleteLoading(true);
    try {
      await adminApi.remove(active, deleting[pk]);
      showToast('Record deleted.', 'success');
      setDeleting(null);
      setTables((prev) => prev.map((t) => (t.name === active ? { ...t, count: Math.max(0, (t.count || 1) - 1) } : t)));
      loadRows();
    } catch (e) {
      showToast((e as Error).message, 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const visibleTables = tables.filter((t) => t.name.toLowerCase().includes(tableFilter.toLowerCase()));

  if (schemaError) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-sm">
        <div className="mb-2 flex items-center gap-2 font-bold text-red-400">
          <AlertTriangle className="h-4 w-4" /> Data Manager unavailable
        </div>
        <p className="text-[var(--muted)]">{schemaError}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 text-[var(--text)]">
      {toast && <div className={`toast show ${toast.type}`}>{toast.msg}</div>}

      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">Data Manager</h1>
          <p className="mt-1 text-xs text-[var(--muted)] sm:text-sm">
            Create, edit and delete records in any table. Every change is recorded in the audit log.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Table list */}
        <aside className="h-fit rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3">
          <input
            value={tableFilter}
            onChange={(e) => setTableFilter(e.target.value)}
            placeholder="Filter tables…"
            className="mb-2 w-full rounded-lg border border-[var(--border)] bg-[var(--card2)] px-3 py-1.5 text-xs text-[var(--text)] outline-none focus:border-[var(--amber)]"
          />
          {!tables.length ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--amber)]" />
            </div>
          ) : (
            <nav className="flex max-h-[60vh] flex-col gap-0.5 overflow-y-auto">
              {visibleTables.map((t) => (
                <button
                  key={t.name}
                  onClick={() => switchTable(t.name)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${t.name === active
                    ? 'bg-[rgba(245,166,35,0.12)] font-bold text-[var(--amber)]'
                    : 'text-[var(--muted)] hover:bg-[var(--card2)] hover:text-[var(--text)]'
                    }`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Database className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate font-mono">{t.name}</span>
                  </span>
                  <span className="ml-2 shrink-0 text-[10px] text-[var(--muted2)]">{t.count ?? ''}</span>
                </button>
              ))}
            </nav>
          )}
        </aside>

        {/* Rows */}
        <section className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex flex-col gap-3 border-b border-[var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-[var(--amber)]">{active || '…'}</span>
              <span className="text-xs text-[var(--muted)]">{count} record{count === 1 ? '' : 's'}</span>
              {!pk && table && <span className="rounded bg-yellow-500/10 px-2 py-0.5 text-[10px] text-yellow-400">read-only (no primary key)</span>}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search text or exact id…"
                  className="w-56 rounded-xl border border-[var(--border)] bg-[var(--card2)] py-2 pl-9 pr-3 text-xs text-[var(--text)] outline-none focus:border-[var(--amber)]"
                />
              </div>
              <button
                onClick={loadRows}
                title="Refresh"
                className="rounded-xl border border-[var(--border)] p-2 text-[var(--muted)] hover:text-[var(--text)]"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => {
                  setEditing(null);
                  setEditorOpen(true);
                }}
                disabled={!table}
                className="flex items-center gap-1.5 rounded-xl bg-[var(--amber)] px-3.5 py-2 text-xs font-bold text-black hover:opacity-90 disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" /> Add record
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border)] bg-[var(--card2)] text-[10px] uppercase text-[var(--muted2)]">
                <tr>
                  {pk && <th className="sticky left-0 z-10 bg-[var(--card2)] px-4 py-3 font-semibold">Actions</th>}
                  {columns.map((c) => (
                    <th key={c.name} className="whitespace-nowrap px-4 py-3 font-semibold">
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {loading && !rows.length ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-[var(--muted)]">
                      <Loader2 className="mx-auto h-5 w-5 animate-spin text-[var(--amber)]" />
                    </td>
                  </tr>
                ) : rowsError ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-red-400">
                      {rowsError}
                    </td>
                  </tr>
                ) : !rows.length ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-[var(--muted)]">
                      {query ? 'No records match your search.' : 'This table is empty.'}
                    </td>
                  </tr>
                ) : (
                  rows.map((r, i) => (
                    <tr key={pk ? String(r[pk]) : i} className="group hover:bg-[var(--card2)]">
                      {pk && (
                        <td className="sticky left-0 z-10 bg-[var(--card)] px-4 py-2.5 group-hover:bg-[var(--card2)]">
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setEditing(r);
                                setEditorOpen(true);
                              }}
                              title="Edit"
                              className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[rgba(245,166,35,0.12)] hover:text-[var(--amber)]"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleting(r)}
                              title="Delete"
                              className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-red-500/10 hover:text-red-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                      {columns.map((c) => {
                        const text = cell(r[c.name]);
                        return (
                          <td
                            key={c.name}
                            title={text.length > 40 ? text : undefined}
                            className={`max-w-[260px] truncate whitespace-nowrap px-4 py-2.5 ${text === '—' ? 'text-[var(--muted2)]' : 'text-[var(--text)]'
                              } ${c.format === 'uuid' ? 'font-mono text-[11px]' : ''}`}
                          >
                            {text}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3">
            <span className="text-xs text-[var(--muted)]">
              Page <b className="text-[var(--text)]">{page + 1}</b> of <b className="text-[var(--text)]">{totalPages}</b>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded-xl border border-[var(--border)] p-2 text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="rounded-xl border border-[var(--border)] p-2 text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>

      <RecordEditor
        isOpen={editorOpen}
        table={active}
        record={editing}
        onClose={() => setEditorOpen(false)}
        onSaved={() => {
          setEditorOpen(false);
          showToast(editing ? 'Record updated.' : 'Record created.', 'success');
          if (!editing) setTables((prev) => prev.map((t) => (t.name === active ? { ...t, count: (t.count || 0) + 1 } : t)));
          loadRows();
        }}
      />

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete record"
        message={
          active === 'users'
            ? 'This permanently deletes the user and their login account. Records linked to them may also be removed. This cannot be undone.'
            : `This permanently deletes this record from "${active}". This cannot be undone.`
        }
        confirmText="Delete"
        isDestructive
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
