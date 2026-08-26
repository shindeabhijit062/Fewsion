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
  Handshake, 
  BarChart3, 
  ShieldCheck, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/superadmin/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/superadmin/users', icon: Users },
  { name: 'Brands', href: '/superadmin/brands', icon: Building2 },
  { name: 'Creators', href: '/superadmin/creators', icon: Clapperboard },
  { name: 'Collaborations', href: '/superadmin/collaborations', icon: Handshake },
  { name: 'Reports', href: '/superadmin/reports', icon: BarChart3 },
  { name: 'Audit Logs', href: '/superadmin/audit-logs', icon: ShieldCheck },
  { name: 'Settings', href: '/superadmin/settings', icon: Settings },
];

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({ mobileOpen = false, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/superadmin/login';
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[var(--card)] border-r border-[var(--border)]">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border)]">
        <Link href="/superadmin/dashboard" className="font-display text-xl font-extrabold text-[color:var(--text)] no-underline tracking-tight flex items-center gap-2">
          <span>Few<span style={{ color: 'var(--amber)' }}>sion</span></span>
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-[var(--amber)]/10 text-[var(--amber)] border border-[var(--amber)]/20">
            Super Admin
          </span>
        </Link>
        {setMobileOpen && (
          <button 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-[var(--muted)] hover:text-[var(--text)]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Nav list */}
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-3">
        <div className="text-[11px] font-bold text-[var(--muted2)] uppercase tracking-wider mb-2 px-3">
          Control Panel
        </div>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/superadmin/dashboard' && pathname === '/superadmin');
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive 
                  ? 'bg-[var(--green-glow)] text-[var(--green)] border border-[var(--green)]/20 font-semibold' 
                  : 'text-[var(--muted)] hover:bg-[var(--card2)] hover:text-[var(--text)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Footer Sign Out */}
      <div className="p-4 border-t border-[var(--border)]">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-[var(--muted)] hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block w-64 fixed left-0 top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen && setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
