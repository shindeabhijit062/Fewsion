'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { DELIVERABLE_PRESETS } from '@/lib/offers';

export interface OfferFormValue {
  amount: string;
  deadline: string; // YYYY-MM-DD
  deliverables: string[];
  note: string;
}

export const emptyOffer = (amount?: number | null): OfferFormValue => ({
  amount: amount ? String(amount) : '',
  deadline: '',
  deliverables: [],
  note: '',
});

/** Returns an error message, or null if the offer is complete */
export function validateOffer(v: OfferFormValue): string | null {
  const n = Number(v.amount);
  if (!v.amount || !Number.isFinite(n) || n <= 0) return 'Enter the amount you are offering.';
  if (!v.deliverables.length) return 'Pick at least one deliverable.';
  if (v.deadline && new Date(v.deadline) < new Date(new Date().toDateString())) return 'The deadline is in the past.';
  return null;
}

export function OfferForm({
  value,
  onChange,
  disabled,
  noteLabel = 'Note (optional)',
  notePlaceholder = 'Anything the other side should know…',
}: {
  value: OfferFormValue;
  onChange: (v: OfferFormValue) => void;
  disabled?: boolean;
  noteLabel?: string;
  notePlaceholder?: string;
}) {
  const [custom, setCustom] = useState('');
  const set = (patch: Partial<OfferFormValue>) => onChange({ ...value, ...patch });

  const toggle = (d: string) =>
    set({
      deliverables: value.deliverables.includes(d)
        ? value.deliverables.filter((x) => x !== d)
        : [...value.deliverables, d].slice(0, 10),
    });

  const addCustom = () => {
    const d = custom.trim();
    if (d && !value.deliverables.includes(d)) set({ deliverables: [...value.deliverables, d].slice(0, 10) });
    setCustom('');
  };

  const label = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]';
  const input =
    'w-full rounded-xl border border-[var(--border2)] bg-[var(--black)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--amber)] disabled:opacity-60';
  const extras = value.deliverables.filter((d) => !DELIVERABLE_PRESETS.includes(d));

  return (
    <div className="space-y-4">
      <div>
        <span className={label}>Deliverables</span>
        <div className="flex flex-wrap gap-1.5">
          {[...DELIVERABLE_PRESETS, ...extras].map((d) => {
            const on = value.deliverables.includes(d);
            return (
              <button
                key={d}
                type="button"
                disabled={disabled}
                onClick={() => toggle(d)}
                className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${on
                  ? 'border-[var(--amber)] bg-[rgba(245,166,35,0.12)] text-[var(--amber)]'
                  : 'border-[var(--border)] text-[var(--muted)] hover:border-[rgba(245,166,35,0.4)] hover:text-[var(--text)]'
                  }`}
              >
                {d}
                {on && <X size={11} />}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            value={custom}
            disabled={disabled}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustom();
              }
            }}
            maxLength={100}
            placeholder="Add a custom deliverable…"
            className={`${input} py-2 text-xs`}
          />
          <button
            type="button"
            onClick={addCustom}
            disabled={disabled || !custom.trim()}
            className="flex shrink-0 items-center gap-1 rounded-xl border border-[var(--border2)] px-3 text-xs font-semibold text-[var(--text)] hover:border-[var(--amber)] disabled:opacity-40"
          >
            <Plus size={12} /> Add
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Amount (₹)</label>
          <input
            type="number"
            min={1}
            inputMode="numeric"
            value={value.amount}
            disabled={disabled}
            onChange={(e) => set({ amount: e.target.value })}
            placeholder="e.g. 15000"
            className={input}
          />
        </div>
        <div>
          <label className={label}>Deadline</label>
          <input
            type="date"
            value={value.deadline}
            disabled={disabled}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => set({ deadline: e.target.value })}
            className={input}
          />
        </div>
      </div>

      <div>
        <label className={label}>{noteLabel}</label>
        <textarea
          value={value.note}
          disabled={disabled}
          onChange={(e) => set({ note: e.target.value })}
          rows={3}
          maxLength={1000}
          placeholder={notePlaceholder}
          className={`${input} resize-none`}
        />
      </div>
    </div>
  );
}
