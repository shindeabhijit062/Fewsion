'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../utils/supabase';

type Role = 'brand' | 'creator' | 'editor';

export default function LoginPage() {
  const [role, setRole] = useState<Role>('brand');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | '' } | null>(null);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      if (error) {
        showToast(error.message, 'error');
      }
    } catch {
      showToast('Authentication failed. Please try again.', 'error');
    }
  };

  const showToast = (msg: string, type: 'success' | 'error' | '') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogin = async () => {
    let valid = true;
    setEmailError('');
    setPassError('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
        email,
        password,
      });

      if (error) {
        showToast(error.message, 'error');
        return;
      }

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();

        let userRole = profile?.role;

        if (profileError || !profile) {
          // Auto-recover missing profile (e.g. from early signups)
          const metaRole = data.user.user_metadata?.role || role;
          const { error: insertErr } = await supabase.from('users').insert({
            id: data.user.id,
            email: data.user.email,
            role: metaRole,
            first_name: data.user.user_metadata?.full_name?.split(' ')[0] || '',
            last_name: data.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
            created_at: new Date().toISOString()
          });

          if (insertErr) {
            showToast('User profile not found and could not be recovered.', 'error');
            return;
          }
          userRole = metaRole;
        }

        if (userRole !== role) {
          showToast(`This account is registered as a ${userRole}. Please select the correct role.`, 'error');
          return;
        }

        let tableName = '';
        if (role === 'brand') tableName = 'brand_profiles';
        else if (role === 'creator') tableName = 'creator_profiles';
        else if (role === 'editor') tableName = 'editor_profiles';

        let hasSubProfile = false;
        if (tableName) {
          const { data: subProfile } = await supabase
            .from(tableName)
            .select('id')
            .eq('user_id', data.user.id)
            .maybeSingle();

          if (subProfile) {
            hasSubProfile = true;
          }
        }

        showToast('Welcome back! Redirecting...', 'success');
        setTimeout(() => {
          if (hasSubProfile) {
            window.location.href = `/portals/${role}`;
          } else {
            window.location.href = `/${role}/dashboard`;
          }
        }, 1200);
      }
    } catch {
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
        <div className="absolute pointer-events-none" style={{ top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 65%)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '-20%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,107,53,0.07) 0%, transparent 65%)' }} />

        <Link href="/" className="relative z-10 font-display text-[24px] font-extrabold text-[color:var(--text)] no-underline" style={{ letterSpacing: '-0.5px' }}>
          Few<span style={{ color: 'var(--amber)' }}>sion</span>
        </Link>

        <div className="relative z-10">
          <div className="text-[12px] font-semibold uppercase mb-5" style={{ letterSpacing: '0.1em', color: 'var(--amber)' }}>
            Welcome back
          </div>
          <h2
            className="font-display font-extrabold text-[color:var(--text)]"
            style={{ fontSize: 'clamp(32px,3.5vw,48px)', letterSpacing: '-1.5px', lineHeight: '1.1', marginBottom: '20px' }}
          >
            India&apos;s performance-<br />first{' '}
            <em className="text-gradient-amber" style={{ fontStyle: 'normal' }}>creator platform</em>
          </h2>
          <p className="text-[15px] text-[var(--muted)] leading-[1.7] max-w-[380px]">
            Connect brands with verified UGC creators and editors — powered by AI matching and escrow-protected payments.
          </p>
        </div>

        <div className="relative z-10 flex gap-8">
          {[{ n: '4.5', s: 'M+', l: 'Active Creators' }, { n: '2,400', s: '+', l: 'Brand Campaigns' }, { n: '4.8', s: '★', l: 'Avg Rating' }].map((stat) => (
            <div key={stat.l}>
              <div className="font-display text-[28px] font-extrabold text-[color:var(--text)]" style={{ letterSpacing: '-1px' }}>
                {stat.n}<span style={{ color: 'var(--amber)' }}>{stat.s}</span>
              </div>
              <div className="text-[12px] text-[var(--muted)] mt-[2px]">{stat.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT panel ── */}
      <div
        className="flex items-center justify-center px-10 py-12"
        style={{ background: 'var(--black)' }}
      >
        <div className="w-full max-w-[440px]">
          <h1 className="font-display text-[28px] font-extrabold text-[color:var(--text)] mb-[6px]" style={{ letterSpacing: '-0.8px' }}>
            Sign in to Fewsion
          </h1>
          <p className="text-[14px] text-[var(--muted)] mb-8">
            New here?{' '}
            <Link href="/signup" style={{ color: 'var(--amber)' }}>Create a free account →</Link>
          </p>

          {/* Role picker */}
          <div className="grid grid-cols-3 gap-[10px] mb-7">
            {([
              { r: 'brand', icon: '🏢', label: 'Brand' },
              { r: 'creator', icon: '🎬', label: 'Creator' },
              { r: 'editor', icon: '✂️', label: 'Editor' },
            ] as { r: Role; icon: string; label: string }[]).map(({ r, icon, label }) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="relative text-center rounded-[14px] p-4 cursor-pointer border-none transition-all duration-200"
                style={{
                  background: 'var(--card)',
                  border: `1.5px solid ${role === r ? 'var(--amber)' : 'var(--border)'}`,
                  backgroundColor: role === r ? 'rgba(245,166,35,0.06)' : 'var(--card)',
                }}
              >
                {role === r && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-black" style={{ background: 'var(--amber)' }}>✓</div>
                )}
                <div className="text-[22px] mb-[6px]">{icon}</div>
                <div className="font-display text-[12px] font-bold" style={{ color: role === r ? 'var(--amber)' : 'var(--muted)', letterSpacing: '0.03em' }}>{label}</div>
              </button>
            ))}
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-[10px] mb-5">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 rounded-[10px] p-3 text-[13px] font-medium cursor-pointer border-none transition-all duration-200"
              style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-body)' }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border2)'; el.style.background = 'var(--card2)'; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.background = 'var(--card)'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-[10px] p-3 text-[13px] font-medium cursor-pointer border-none transition-all duration-200"
              style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-body)' }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border2)'; el.style.background = 'var(--card2)'; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.background = 'var(--card)'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </button>
          </div>
          <div className="flex items-center gap-3 my-5 text-[12px] text-[#555]">
            <div className="flex-1 h-[1px]" style={{ background: 'var(--border)' }} />
            or continue with email
            <div className="flex-1 h-[1px]" style={{ background: 'var(--border)' }} />
          </div>

          {/* Email */}
          <div className="mb-[18px]">
            <label className="form-label">Email address</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
              className={`form-input ${emailError ? 'error' : ''}`}
              autoComplete="email"
            />
            {emailError && <div className="form-error" style={{ display: 'block' }}>{emailError}</div>}
          </div>

          {/* Password */}
          <div className="mb-[20px]">
            <div className="flex justify-between items-center mb-2">
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <Link href="/forgot-password" className="text-[12px] text-[var(--muted)] no-underline hover:text-[var(--text)] transition-colors">Forgot password?</Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPassError(''); }}
              className={`form-input ${passError ? 'error' : ''}`}
              autoComplete="current-password"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            {passError && <div className="form-error" style={{ display: 'block' }}>{passError}</div>}
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-[10px] mb-5">
            <input type="checkbox" id="remember" defaultChecked style={{ accentColor: 'var(--amber)', width: '15px', height: '15px' }} />
            <label htmlFor="remember" className="text-[13px] text-[var(--muted)]">Keep me signed in for 30 days</label>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn-submit"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-[rgba(0,0,0,0.3)] border-t-black animate-spin" />
                Signing in...
              </span>
            ) : 'Sign in →'}
          </button>

          <p className="text-[12px] text-center mt-5" style={{ color: 'var(--muted2)' }}>
            By signing in you agree to our{' '}
            <Link href="/terms" style={{ color: 'var(--muted)', textDecoration: 'underline' }}>Terms</Link>{' '}and{' '}
            <Link href="/privacy" style={{ color: 'var(--muted)', textDecoration: 'underline' }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast show ${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
}
