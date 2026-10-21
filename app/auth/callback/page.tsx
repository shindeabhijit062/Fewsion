'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase';

type Role = 'brand' | 'creator' | 'editor';
const ROLES: Role[] = ['brand', 'creator', 'editor'];
const PROFILE_TABLES: Record<Role, string> = {
  brand: 'brand_profiles',
  creator: 'creator_profiles',
  editor: 'editor_profiles',
};

function CallbackInner() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Signing you in...');

  useEffect(() => {
    async function finishSignIn() {
      const oauthError = searchParams?.get('error_description');
      if (oauthError) {
        setMessage(oauthError);
        return;
      }

      let { data: { session } } = await supabase.auth.getSession();
      const code = searchParams?.get('code');
      if (!session && code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMessage(error.message);
          return;
        }
        session = data.session;
      }
      if (!session) {
        setMessage('Sign-in failed. Please try again.');
        setTimeout(() => (window.location.href = '/login'), 2000);
        return;
      }

      const user = session.user;
      const roleParam = searchParams?.get('role') as Role | null;
      const pickedRole: Role = roleParam && ROLES.includes(roleParam) ? roleParam : 'creator';

      const { data: existing } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      let role = existing?.role as Role | undefined;

      if (!existing) {
        const fullName: string =
          user.user_metadata?.full_name || user.user_metadata?.name || '';
        const { error: insertErr } = await supabase.from('users').insert({
          id: user.id,
          email: user.email,
          role: pickedRole,
          first_name: fullName.split(' ')[0] || '',
          last_name: fullName.split(' ').slice(1).join(' ') || '',
          created_at: new Date().toISOString(),
        });
        if (insertErr) {
          setMessage(`Could not create your account: ${insertErr.message}`);
          return;
        }
        role = pickedRole;
      }

      if (!role || !ROLES.includes(role)) {
        window.location.href = '/';
        return;
      }

      const { data: subProfile } = await supabase
        .from(PROFILE_TABLES[role])
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      window.location.href = subProfile ? `/portals/${role}` : `/${role}/dashboard`;
    }

    finishSignIn();
  }, [searchParams]);

  return <p className="text-sm text-[var(--muted)]">{message}</p>;
}

export default function AuthCallbackPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--black)] px-6 text-center">
      <Suspense fallback={<p className="text-sm text-[var(--muted)]">Signing you in...</p>}>
        <CallbackInner />
      </Suspense>
    </main>
  );
}
