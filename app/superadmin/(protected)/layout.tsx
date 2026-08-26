'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/superadmin/Sidebar';
import Header from '@/components/superadmin/Header';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { ShieldAlert, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [adminProfile, setAdminProfile] = useState<{ email?: string; full_name?: string; role?: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function verifySuperAdmin() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          setLoading(false);
          setAuthorized(false);
          router.replace('/superadmin/login');
          return;
        }

        // Check user role from Supabase DB (by ID or email)
        const { data: profileById } = await supabase
          .from('users')
          .select('role, full_name, email')
          .eq('id', user.id)
          .maybeSingle();

        let profile = profileById;

        if (!profile && user.email) {
          const { data: profileByEmail } = await supabase
            .from('users')
            .select('role, full_name, email')
            .eq('email', user.email)
            .maybeSingle();
          profile = profileByEmail;
        }

        const rawRole = profile?.role || user.user_metadata?.role;
        const normalizedRole = String(rawRole || '').toLowerCase();
        const isSuperAdmin = ['super_admin', 'superadmin', 'admin'].includes(normalizedRole);

        if (isSuperAdmin) {
          setAuthorized(true);
          setAdminProfile({
            email: user.email,
            full_name: profile?.full_name || user.user_metadata?.full_name || 'Super Admin',
            role: normalizedRole === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN',
          });
        } else {
          setAuthorized(false);
        }
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    verifySuperAdmin();
  }, [router]);

  // Determine Title based on subpage
  let title = 'Overview Dashboard';
  if (pathname?.includes('/users')) title = 'User Management';
  if (pathname?.includes('/brands')) title = 'Brand Profiles';
  if (pathname?.includes('/creators')) title = 'Creator Profiles';
  if (pathname?.includes('/collaborations') || pathname?.includes('/campaigns')) title = 'Collaborations & Campaigns';
  if (pathname?.includes('/reports')) title = 'Reports & Analytics';
  if (pathname?.includes('/audit-logs')) title = 'Audit Logs';
  if (pathname?.includes('/settings')) title = 'Platform Settings';
  if (pathname?.includes('/ai-knowledge')) title = 'AI Knowledge Base';

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--black)] flex items-center justify-center text-[var(--text)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--amber)]" />
          <p className="text-sm font-medium text-[var(--muted)]">Authenticating Super Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[var(--black)] flex items-center justify-center p-6 text-[var(--text)]">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 max-w-md w-full text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-[var(--text)]">Access Restricted</h1>
            <p className="text-sm text-[var(--muted)] mt-2">
              You must be logged in with a Super Admin account to access this area.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/superadmin/login"
              className="btn-primary w-full justify-center py-2.5 text-sm"
            >
              Sign In to Super Admin
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--text)] py-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--black)] text-[var(--text)]">
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
      
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header 
          title={title} 
          adminProfile={adminProfile} 
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} 
        />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
