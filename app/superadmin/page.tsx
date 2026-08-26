'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { ShieldAlert, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminRootPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          router.replace('/superadmin/login');
          return;
        }

        // Fetch role from users table
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        const role = profile?.role || user.user_metadata?.role;

        if (role === 'super_admin' || role === 'admin' || role === 'superadmin') {
          router.replace('/superadmin/dashboard');
        } else {
          setUnauthorized(true);
          setChecking(false);
        }
      } catch {
        router.replace('/superadmin/login');
      }
    }

    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[var(--black)] flex items-center justify-center text-[var(--text)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--amber)]" />
          <p className="text-sm font-medium text-[var(--muted)]">Verifying Super Admin Authorization...</p>
        </div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-[var(--black)] flex items-center justify-center p-6 text-[var(--text)]">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 max-w-md w-full text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-[var(--text)]">Access Denied</h1>
            <p className="text-sm text-[var(--muted)] mt-2">
              Your account does not have Super Admin permissions to access the control panel.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/login"
              className="btn-primary w-full justify-center py-2.5 text-sm"
            >
              Sign In with Admin Account
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

  return null;
}
