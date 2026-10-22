'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Menu, X } from 'lucide-react';

// Mobile navigation for the portals (hidden from md up, where the fixed
// sidebar takes over): a sticky top bar with logo, profile and a menu button
// that opens a slide-in drawer with the same items as the sidebar.

export interface PortalNavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  badge?: number;
}

export function PortalMobileNav({
  items,
  onSelect,
  name,
  subtitle,
  avatar,
  avatarLarge,
  onLogout,
}: {
  items: PortalNavItem[];
  onSelect: (id: string) => void;
  name: string;
  subtitle?: string | null;
  /** Small avatar for the top bar */
  avatar: React.ReactNode;
  /** Larger (editable) avatar for the drawer */
  avatarLarge: React.ReactNode;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const totalBadge = items.reduce((s, i) => s + (i.badge || 0), 0);
  const current = items.find((i) => i.active);

  // Lock page scroll and close on Escape while the drawer is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      {/* Top bar */}
      <div className="md:hidden sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--border)] bg-[rgba(10,10,10,0.85)] px-4 py-3 backdrop-blur-md">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border2)] bg-[var(--card)] text-[var(--text)]"
        >
          <Menu size={18} />
          {totalBadge > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--amber)] px-1 text-[9px] font-extrabold text-black">
              {totalBadge}
            </span>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <Link href="/" className="font-display text-lg font-extrabold leading-none text-[var(--text)]">
            Few<span className="text-[var(--amber)]">sion</span>
          </Link>
          {current && <div className="mt-0.5 truncate text-[11px] text-[var(--muted)]">{current.label}</div>}
        </div>

        <button onClick={() => setOpen(true)} className="flex min-w-0 items-center gap-2" aria-label="Open profile menu">
          <div className="hidden min-w-0 text-right min-[380px]:block">
            <div className="max-w-[120px] truncate text-xs font-semibold text-[var(--text)]">{name}</div>
            {subtitle && <div className="max-w-[120px] truncate text-[10px] text-[var(--muted)]">{subtitle}</div>}
          </div>
          {avatar}
        </button>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[90] bg-black/60 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              key="drawer"
              className="fixed inset-y-0 left-0 z-[91] flex w-[82vw] max-w-[300px] flex-col border-r border-[var(--border)] bg-[var(--black)] px-5 py-6 md:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <Link href="/" className="font-display text-xl font-extrabold text-[var(--text)]">
                  Few<span className="text-[var(--amber)]">sion</span>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="rounded-full p-1.5 text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Profile */}
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3">
                {avatarLarge}
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-[var(--text)]">{name}</div>
                  {subtitle && <div className="truncate text-xs text-[var(--muted)]">{subtitle}</div>}
                </div>
              </div>

              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelect(item.id);
                        setOpen(false);
                      }}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${item.active
                        ? 'border-l-2 border-[var(--amber)] bg-[var(--card)] text-[var(--text)]'
                        : 'text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--text)]'
                        }`}
                    >
                      <Icon size={16} />
                      {item.label}
                      {!!item.badge && (
                        <span className="ml-auto rounded-full bg-[var(--amber)] px-2 py-0.5 text-[10px] font-extrabold text-black">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <button
                onClick={onLogout}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
              >
                <LogOut size={14} /> Log Out
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
