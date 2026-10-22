'use client';

import React from 'react';
import { LucideIcon, ArrowUpRight, Loader2 } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  subtext?: string;
  color?: string;
  bg?: string;
  loading?: boolean;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  change,
  subtext,
  color = 'text-[var(--amber)]',
  bg = 'bg-[var(--amber)]/10',
  loading = false,
}: StatCardProps) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 min-w-0 hover:border-[var(--border2)] transition-all">
      <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl flex items-center justify-center ${bg} ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <div className="flex items-center gap-1 whitespace-nowrap text-[11px] font-semibold text-[var(--green)] bg-[var(--green-glow)] px-2 py-0.5 rounded-full">
            <ArrowUpRight className="w-3 h-3" />
            {change}
          </div>
        )}
      </div>
      <div className="text-[var(--muted)] text-xs sm:text-sm font-medium mb-1">{label}</div>
      <div className="text-xl sm:text-2xl font-display font-extrabold text-[var(--text)] tracking-tight break-words">
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin text-[var(--muted)]" />
        ) : (
          value
        )}
      </div>
      {subtext && <div className="text-[11px] text-[var(--muted2)] mt-1">{subtext}</div>}
    </div>
  );
}
