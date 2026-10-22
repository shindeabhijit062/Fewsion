'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, X, KeyRound } from 'lucide-react';
import { adminApi, getAdminSchema, TableInfo, ColumnInfo } from '@/lib/adminApi';

// Create / edit form for any database row. The fields are generated from
// the table's real columns, so it works for every table.

interface RecordEditorProps {
  isOpen: boolean;
  table: string;
  /** Existing row to edit. Omit to create a new row. */
  record?: Record<string, any> | null;
  /** Optional title override */
  title?: string;
  onClose: () => void;
  onSaved: (row: Record<string, any>) => void;
}

const SYSTEM_COLUMNS = new Set(['created_at', 'updated_at']);

const isJsonCol = (c: ColumnInfo) => c.type === 'array' || c.type === 'object' || ['json', 'jsonb'].includes(c.format) || c.format.endsWith('[]');
const isNumberCol = (c: ColumnInfo) => c.type === 'integer' || c.type === 'number';
const isBoolCol = (c: ColumnInfo) => c.type === 'boolean';
const isDateCol = (c: ColumnInfo) => c.format.startsWith('timestamp') || c.format === 'date';
const isLongText = (c: ColumnInfo, v: string) =>
  c.format === 'text' && (v.length > 60 || /desc|bio|text|content|message|notes|review|style|dos|donts/i.test(c.name));

const toInput = (c: ColumnInfo, v: any): string => {
  if (v === null || v === undefined) return '';
  if (isJsonCol(c)) return JSON.stringify(v, null, 2);
  if (isDateCol(c) && c.format !== 'date') {
    const d = new Date(v);
    if (isNaN(d.getTime())) return String(v);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  return String(v);
};

const fromInput = (c: ColumnInfo, raw: string): any => {
  if (raw.trim() === '') return null;
  if (isJsonCol(c)) return JSON.parse(raw);
  if (isNumberCol(c)) {
    const n = Number(raw);
    if (isNaN(n)) throw new Error(`${c.name} must be a number`);
    return n;
  }
  if (isDateCol(c) && c.format !== 'date') return new Date(raw).toISOString();
  return raw;
};

const prettyName = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());

export default function RecordEditor({ isOpen, table, record, title, onClose, onSaved }: RecordEditorProps) {
  const [info, setInfo] = useState<TableInfo | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [bools, setBools] = useState<Record<string, boolean | null>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');

  const isEdit = !!record;

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    getAdminSchema()
      .then((tables) => {
        const t = tables.find((x) => x.name === table) || null;
        if (!t) setLoadError(`Table "${table}" not found.`);
        setInfo(t);
      })
      .catch((e) => setLoadError(e.message));
  }, [isOpen, table]);

  // Fill the form from the record (or blank for a new one)
  useEffect(() => {
    if (!info || !isOpen) return;
    const v: Record<string, string> = {};
    const b: Record<string, boolean | null> = {};
    info.columns.forEach((c) => {
      const current = record?.[c.name];
      if (isBoolCol(c)) b[c.name] = current ?? null;
      else v[c.name] = toInput(c, current);
    });
    setValues(v);
    setBools(b);
  }, [info, record, isOpen]);

  // Columns shown in the form
  const fields = useMemo(() => {
    if (!info) return [];
    return info.columns.filter((c) => {
      if (SYSTEM_COLUMNS.has(c.name)) return false;
      // A generated primary key is shown read-only when editing and hidden when creating
      if (c.isPrimaryKey && c.hasDefault && !isEdit) return false;
      return true;
    });
  }, [info, isEdit]);

  if (!isOpen) return null;

  const save = async () => {
    if (!info) return;
    setError('');
    const out: Record<string, any> = {};
    try {
      for (const c of fields) {
        if (c.isPrimaryKey && isEdit) continue;
        if (isBoolCol(c)) {
          const val = bools[c.name];
          if (isEdit ? val !== (record?.[c.name] ?? null) : val !== null) out[c.name] = val;
          continue;
        }
        const raw = values[c.name] ?? '';
        if (isEdit && raw === toInput(c, record?.[c.name])) continue; // unchanged
        if (!isEdit && raw.trim() === '') {
          if (c.required && !c.hasDefault) throw new Error(`${prettyName(c.name)} is required`);
          continue;
        }
        try {
          out[c.name] = fromInput(c, raw);
        } catch (e) {
          throw new Error(isJsonCol(c) ? `${prettyName(c.name)} must be valid JSON` : (e as Error).message);
        }
      }
    } catch (e) {
      setError((e as Error).message);
      return;
    }

    if (isEdit && !Object.keys(out).length) {
      onClose();
      return;
    }

    setSaving(true);
    try {
      const res = isEdit
        ? await adminApi.update(table, record![info.primaryKey!], out)
        : await adminApi.create(table, out);
      onSaved(res.row);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-[var(--border)] bg-[var(--card2)] px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--amber)] disabled:opacity-60';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !saving && onClose()} />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-[var(--text)]">
              {title || `${isEdit ? 'Edit' : 'New'} ${prettyName(table).replace(/s$/, '')}`}
            </h3>
            <p className="text-[11px] text-[var(--muted)]">
              Table <span className="font-mono text-[var(--amber)]">{table}</span>
              {isEdit && info?.primaryKey ? ` · ${String(record?.[info.primaryKey]).slice(0, 13)}…` : ''}
            </p>
          </div>
          <button onClick={onClose} disabled={saving} className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--card2)] hover:text-[var(--text)]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loadError ? (
            <p className="text-sm text-red-400">{loadError}</p>
          ) : !info ? (
            <div className="flex items-center justify-center py-10 text-[var(--muted)]">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--amber)]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {fields.map((c) => {
                const v = values[c.name] ?? '';
                const readOnly = c.isPrimaryKey && isEdit;
                const wide = isJsonCol(c) || isLongText(c, v);
                return (
                  <div key={c.name} className={wide ? 'sm:col-span-2' : ''}>
                    <label className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-[var(--muted)]">
                      {c.isPrimaryKey && <KeyRound className="h-3 w-3 text-[var(--amber)]" />}
                      {prettyName(c.name)}
                      {c.required && !c.hasDefault && !readOnly && <span className="text-red-400">*</span>}
                      <span className="ml-auto font-mono text-[10px] font-normal text-[var(--muted2)]">{c.format}</span>
                    </label>

                    {isBoolCol(c) ? (
                      <div className="flex gap-1.5">
                        {[
                          { label: 'True', val: true },
                          { label: 'False', val: false },
                          { label: 'Null', val: null },
                        ].map((o) => (
                          <button
                            key={o.label}
                            type="button"
                            onClick={() => setBools((p) => ({ ...p, [c.name]: o.val }))}
                            className={`flex-1 rounded-lg border px-2 py-1.5 text-[11px] font-semibold transition-colors ${bools[c.name] === o.val
                              ? 'border-[var(--amber)] bg-[rgba(245,166,35,0.12)] text-[var(--amber)]'
                              : 'border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]'
                              }`}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    ) : c.enum ? (
                      <select
                        value={v}
                        onChange={(e) => setValues((p) => ({ ...p, [c.name]: e.target.value }))}
                        className={inputClass}
                      >
                        <option value="">— none —</option>
                        {c.enum.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : wide ? (
                      <textarea
                        value={v}
                        onChange={(e) => setValues((p) => ({ ...p, [c.name]: e.target.value }))}
                        rows={isJsonCol(c) ? 5 : 3}
                        className={`${inputClass} resize-y ${isJsonCol(c) ? 'font-mono' : ''}`}
                        placeholder={isJsonCol(c) ? (c.type === 'array' || c.format.endsWith('[]') ? '["value"]' : '{ }') : ''}
                      />
                    ) : (
                      <input
                        type={isNumberCol(c) ? 'number' : isDateCol(c) ? (c.format === 'date' ? 'date' : 'datetime-local') : 'text'}
                        step={c.type === 'number' ? 'any' : undefined}
                        value={v}
                        disabled={readOnly}
                        onChange={(e) => setValues((p) => ({ ...p, [c.name]: e.target.value }))}
                        className={`${inputClass} ${c.format === 'uuid' ? 'font-mono' : ''}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] px-6 py-4">
          <p className="min-w-0 flex-1 truncate text-xs text-red-400">{error}</p>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)]"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving || !info}
              className="flex items-center gap-1.5 rounded-xl bg-[var(--amber)] px-4 py-2 text-xs font-bold text-black hover:opacity-90 disabled:opacity-50"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isEdit ? 'Save changes' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
