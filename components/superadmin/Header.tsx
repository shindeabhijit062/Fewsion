'use client';

import React, { useState } from 'react';
import { Search, Bell, UserCircle, Menu, LogOut, ExternalLink, Settings, Shield } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

interface HeaderProps {
  title: string;
  adminProfile?: { email?: string; full_name?: string; role?: string } | null;
  onToggleMobileMenu?: () => void;
}

export default function Header({ title, adminProfile, onToggleMobileMenu }: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/superadmin/login';
  };

  const dummyNotifs = [
    { id: 1, title: 'New Creator Signup', time: '5m ago', unread: true },
    { id: 2, title: 'Campaign Escrow Payout Pushed', time: '1h ago', unread: true },
    { id: 3, title: 'System Security Check Complete', time: '4h ago', unread: false },
  ];

  return (
    <header className="h-16 bg-[var(--card)] border-b border-[var(--border)] flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button 
            onClick={onToggleMobileMenu}
            className="lg:hidden text-[var(--muted)] hover:text-[var(--text)] p-1 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <div>
          <div className="text-[11px] font-semibold text-[var(--muted2)] tracking-wide uppercase hidden sm:block">
            Super Admin Portal
          </div>
          <h1 className="text-base sm:text-lg font-bold text-[var(--text)] tracking-tight leading-tight">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        {/* Search Bar */}
        <div className="relative group hidden md:block">
          <Search className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--amber)] transition-colors" />
          <input 
            type="text" 
            placeholder="Search platform..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[var(--card2)] border border-[var(--border)] text-xs sm:text-sm rounded-full pl-9 pr-4 py-1.5 focus:outline-none focus:border-[var(--amber)] text-[var(--text)] placeholder-[var(--muted)] w-[180px] lg:w-[260px] transition-all"
          />
        </div>

        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative p-2 text-[var(--muted)] hover:text-[var(--text)] transition-colors rounded-lg hover:bg-[var(--card2)]"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--amber)] rounded-full ring-2 ring-[var(--card)]"></span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl py-3 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 pb-2 border-b border-[var(--border)] flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">Notifications</span>
                <span className="text-[10px] bg-[var(--amber)]/10 text-[var(--amber)] font-semibold px-2 py-0.5 rounded-full">3 New</span>
              </div>
              <div className="divide-y divide-[var(--border)] max-h-60 overflow-y-auto">
                {dummyNotifs.map((n) => (
                  <div key={n.id} className="p-3 text-xs hover:bg-[var(--card2)] transition-colors cursor-pointer">
                    <div className="font-semibold text-[var(--text)] flex justify-between">
                      <span>{n.title}</span>
                      {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[var(--amber)]"></span>}
                    </div>
                    <div className="text-[var(--muted)] text-[10px] mt-1">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button 
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-3 pl-3 sm:pl-6 border-l border-[var(--border)] hover:opacity-80 transition-opacity"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs sm:text-sm font-semibold text-[var(--text)] leading-tight">
                {adminProfile?.full_name || 'Super Admin'}
              </div>
              <div className="text-[10px] text-[var(--amber)] font-bold tracking-wider uppercase">
                {adminProfile?.role || 'SUPER ADMIN'}
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[var(--amber)]/10 border border-[var(--amber)]/30 flex items-center justify-center text-[var(--amber)] font-bold text-xs">
              SA
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-2 border-b border-[var(--border)]">
                <div className="text-xs font-semibold text-[var(--text)] truncate">{adminProfile?.full_name}</div>
                <div className="text-[11px] text-[var(--muted)] truncate">{adminProfile?.email}</div>
              </div>
              <Link 
                href="/" 
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 text-xs text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card2)] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Main Website
              </Link>
              <Link 
                href="/superadmin/settings" 
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card2)] transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                Settings
              </Link>
              <div className="border-t border-[var(--border)] mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
