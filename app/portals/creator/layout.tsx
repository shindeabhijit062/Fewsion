'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Send as SendIcon,
  Clapperboard,
  Wallet,
  MessageSquare,
  Star,
  LogOut,
  Bell
} from 'lucide-react';
import { CreatorProvider, useCreatorData, TabId } from './CreatorContext';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'applications', label: 'My Applications', icon: SendIcon },
  { id: 'collaborations', label: 'Active Collabs', icon: Clapperboard },
  { id: 'payments', label: 'Earnings', icon: Wallet },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'reviews', label: 'Reviews', icon: Star },
];

function CreatorLayoutInner({ children }: { children: React.ReactNode }) {
  const {
    loading,
    profile,
    initials,
    activeTab,
    setActiveTab,
    setSelectedCollabId,
    handleLogout,
  } = useCreatorData();

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--black)] text-[var(--text)] flex items-center justify-center">
        <p className="text-sm text-[var(--muted)]">Loading your workspace...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[var(--black)] text-[var(--text)] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-[var(--muted)]">
          We couldn&apos;t find a creator profile for your account yet.
        </p>
        <Link
          href="/creators"
          className="rounded-full bg-[var(--amber)] px-5 py-2.5 text-xs font-bold text-black hover:opacity-90 transition-all"
        >
          Set up AI Profile
        </Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--black)] text-[var(--text)] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col gap-10 border-r border-[var(--border)] bg-[var(--black)] px-6 py-8 fixed top-0 bottom-0 left-0 z-10">
        <Link href="/" className="font-display text-xl font-extrabold text-[var(--text)]">
          Few<span className="text-[var(--amber)]">sion</span>
        </Link>

        <nav className="flex flex-col gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== 'messages') setSelectedCollabId(null);
                }}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors text-left ${active
                    ? 'bg-[var(--card)] text-[var(--text)] border-l-2 border-[oklch(0.8_0.16_75)]'
                    : 'text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--text)]'
                  }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-5 border-t border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.8_0.16_75)] to-[oklch(0.72_0.18_45)] font-display text-xs font-extrabold text-black">
              {initials || 'C'}
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">{profile.creator_name || 'Creator'}</div>
              <div className="text-xs font-medium text-[var(--amber)]">
                ★ Score {profile.ai_total_score ?? '--'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main */}

      {/* Main Container */}
      <div className="flex-1 md:ml-64 w-full">
        {children}
      </div>
    </div>
  );
}

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <CreatorProvider>
      <CreatorLayoutInner>{children}</CreatorLayoutInner>
    </CreatorProvider>
  );
}
