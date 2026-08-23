'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../utils/supabase';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Optionally check if we have a session, if not we could show a warning
    // But Supabase client handles setting the session from the URL hash automatically.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // We might not have a session right away if it's still parsing, but usually it works.
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5 overflow-x-hidden"
      style={{ background: 'var(--black)' }}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(245,166,35,0.07) 0%, transparent 60%)' }}
      />

      <div
        className="relative z-10 w-full max-w-[420px] rounded-xl px-8 py-10"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.7)',
        }}
      >
        <Link
          href="/"
          className="block text-center font-display text-[24px] font-extrabold text-[var(--text)] no-underline mb-8"
          style={{ letterSpacing: '-0.5px' }}
        >
          Few<span style={{ color: 'var(--amber)' }}>sion</span>
        </Link>

        <h1 className="font-display text-[22px] font-extrabold text-[var(--text)] text-center mb-2">
          Set New Password
        </h1>
        <p className="text-[14px] text-[var(--muted)] text-center leading-[1.5] mb-7">
          Please enter your new password below.
        </p>

        {success ? (
          <div
            className="rounded-lg p-4 mb-5 text-[14px] leading-[1.5] text-center"
            style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80' }}
          >
            <div className="text-[24px] mb-2">✅</div>
            <strong>Password updated successfully!</strong>
            <p className="mt-2 text-[13px] opacity-80">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4 relative">
              <label className="form-label">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                required
                className="form-input"
                style={{ background: 'var(--black)', border: `1px solid ${error ? 'rgba(255,107,53,0.5)' : 'var(--border2)'}`, borderRadius: '8px' }}
                onFocus={(e) => { if (!error) e.target.style.borderColor = 'var(--amber)'; e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.08)'; }}
                onBlur={(e) => { if (!error) e.target.style.borderColor = 'var(--border2)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div className="mb-5 relative">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                required
                className="form-input"
                style={{ background: 'var(--black)', border: `1px solid ${error ? 'rgba(255,107,53,0.5)' : 'var(--border2)'}`, borderRadius: '8px' }}
                onFocus={(e) => { if (!error) e.target.style.borderColor = 'var(--amber)'; e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.08)'; }}
                onBlur={(e) => { if (!error) e.target.style.borderColor = 'var(--border2)'; e.target.style.boxShadow = 'none'; }}
              />
              {error && (
                <div className="text-[13px] mt-[6px]" style={{ color: '#FF6B35' }}>{error}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-display text-[15px] font-bold py-3 rounded-full border-none cursor-pointer mt-2 transition-all duration-200"
              style={{ background: 'var(--amber)', color: '#000' }}
              onMouseEnter={(e) => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(245,166,35,0.25)'; } }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = ''; (e.currentTarget as HTMLButtonElement).style.boxShadow = ''; }}
            >
              {loading ? 'Updating...' : 'Update Password →'}
            </button>
          </form>
        )}

        <Link
          href="/login"
          className="block text-center mt-6 text-[13px] no-underline transition-colors duration-200 hover:text-[var(--text)]"
          style={{ color: 'var(--muted)' }}
        >
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
}
