'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

export default function SuperAdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | '' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | '') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogin = async () => {
    let valid = true;
    setEmailError('');
    setPassError('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }
    if (!password || password.length < 6) {
      setPassError('Password must be at least 6 characters');
      valid = false;
    }
    if (!valid) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        showToast(error.message, 'error');
        return;
      }

      if (data.user) {
        // Fetch user role
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();

        let userRole = profile?.role || data.user.user_metadata?.role;

        if (userRole !== 'superadmin') {
          showToast(`Access Denied. You do not have super admin privileges.`, 'error');
          // Optionally sign them out immediately
          await supabase.auth.signOut();
          return;
        }

        showToast('Authentication successful. Initializing dashboard...', 'success');
        setTimeout(() => {
          window.location.href = `/superadmin/dashboard`;
        }, 1200);
      }
    } catch (err) {
      showToast('Authentication failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="grid min-h-screen"
      style={{ gridTemplateColumns: '1fr 1fr' }}
    >
      {/* ── LEFT panel ── */}
      <div
        className="relative flex flex-col justify-between p-12 overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, var(--deep) 0%, var(--black) 100%)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* Decorative radials */}
        <div className="absolute pointer-events-none" style={{ top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(74, 222, 128, 0.08) 0%, transparent 65%)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '-20%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 65%)' }} />

        <Link href="/" className="relative z-10 font-display text-[24px] font-extrabold text-[color:var(--text)] no-underline mt-4" style={{ letterSpacing: '-0.5px' }}>
          Few<span style={{ color: 'var(--amber)' }}>sion</span><span className="text-[var(--text)] text-sm ml-2 tracking-widest uppercase">Admin</span>
        </Link>

        <div className="relative z-10">
          <div className="text-[12px] font-semibold uppercase mb-5" style={{ letterSpacing: '0.1em', color: 'var(--green)' }}>
            Restricted Area
          </div>
          <h2
            className="font-display font-extrabold text-[color:var(--text)]"
            style={{ fontSize: 'clamp(32px,3.5vw,48px)', letterSpacing: '-1.5px', lineHeight: '1.1', marginBottom: '20px' }}
          >
            Platform Control<br />
            <em className="text-gradient-green" style={{ fontStyle: 'normal' }}>Center</em>
          </h2>
          <p className="text-[15px] text-[var(--muted)] leading-[1.7] max-w-[380px]">
            Manage users, monitor platform metrics, and oversee operations across the Fewsion ecosystem.
          </p>
        </div>

        <div className="relative z-10 flex gap-8">
          <div className="flex items-center gap-2 text-[13px] text-[var(--muted)]">
            <span className="w-2 h-2 rounded-full bg-[var(--green)]"></span>
            All systems operational
          </div>
        </div>
      </div>

      {/* ── RIGHT panel ── */}
      <div
        className="flex items-center justify-center px-10 py-12"
        style={{ background: 'var(--black)' }}
      >
        <div className="w-full max-w-[400px]">
          <h1 className="font-display text-[28px] font-extrabold text-[color:var(--text)] mb-[6px]" style={{ letterSpacing: '-0.8px' }}>
            Super Admin Login
          </h1>
          <p className="text-[14px] text-[var(--muted)] mb-8">
            Please authenticate to access the admin portal.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            {/* Email */}
            <div className="mb-[18px]">
              <label className="form-label">Email address</label>
              <input
                type="email"
                placeholder="admin@fewsion.in"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                className={`form-input ${emailError ? 'error' : ''}`}
                autoComplete="email"
              />
              {emailError && <div className="form-error" style={{ display: 'block' }}>{emailError}</div>}
            </div>

            {/* Password */}
            <div className="mb-[24px]">
              <div className="flex justify-between items-center mb-2">
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPassError(''); }}
                className={`form-input ${passError ? 'error' : ''}`}
                autoComplete="current-password"
              />
              {passError && <div className="form-error" style={{ display: 'block' }}>{passError}</div>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
              style={{ padding: '14px' }}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-[var(--black)] border-t-transparent animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast show ${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
}
