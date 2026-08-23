'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Clapperboard, 
  Megaphone, 
  Settings, 
  LogOut,
  Database
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/superadmin/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/superadmin/users', icon: Users },
  { name: 'Brands', href: '/superadmin/brands', icon: Building2 },
  { name: 'Creators', href: '/superadmin/creators', icon: Clapperboard },
  { name: 'Campaigns', href: '/superadmin/campaigns', icon: Megaphone },
  { name: 'AI Knowledge', href: '/superadmin/ai-knowledge', icon: Database },
  { name: 'Settings', href: '/superadmin/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/superadmin/login';
  };

  return (
    <aside className="w-64 bg-[var(--card)] border-r border-[var(--border)] flex flex-col min-h-screen fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-[var(--border)]">
        <Link href="/superadmin/dashboard" className="font-display text-xl font-extrabold text-[color:var(--text)] no-underline tracking-tight">
          Few<span style={{ color: 'var(--amber)' }}>sion</span><span className="text-[var(--text)] text-xs ml-2 uppercase tracking-wider">Admin</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-3">
        <div className="text-[11px] font-bold text-[var(--muted2)] uppercase tracking-wider mb-2 px-3">
          Overview
        </div>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive 
                  ? 'bg-[var(--green-glow)] text-[var(--green)]' 
                  : 'text-[var(--muted)] hover:bg-[var(--card2)] hover:text-[var(--text)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-[var(--border)]">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--muted)] hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
