'use client';

import React from 'react';
import { Search, Bell, UserCircle } from 'lucide-react';

export default function Header({ title }: { title: string }) {
  return (
    <header className="h-16 bg-[var(--card)] border-b border-[var(--border)] flex items-center justify-between px-8 sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-semibold text-[var(--text)] tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative group hidden md:block">
          <Search className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--green)] transition-colors" />
          <input 
            type="text" 
            placeholder="Search across platform..." 
            className="bg-[var(--card2)] border border-[var(--border)] text-sm rounded-full pl-9 pr-4 py-1.5 focus:outline-none focus:border-[var(--green)] text-[var(--text)] placeholder-[var(--muted)] w-[240px] transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative text-[var(--muted)] hover:text-[var(--text)] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--green)] rounded-full ring-2 ring-[var(--card)]"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="flex items-center gap-3 pl-6 border-l border-[var(--border)] cursor-pointer hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-[var(--text)] leading-tight">Admin User</div>
            <div className="text-xs text-[var(--muted)] font-medium">Super Admin</div>
          </div>
          <UserCircle className="w-8 h-8 text-[var(--muted)]" />
        </div>
      </div>
    </header>
  );
}
