'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../utils/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setSuccess(false);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
      
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setEmailError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5 overflow-x-hidden"
      style={{ background: 'var(--black)' }}
    >
      {/* Background radial */}
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
        {/* Logo */}
        <Link
          href="/"
          className="block text-center font-display text-[24px] font-extrabold text-[var(--text)] no-underline mb-8"
          style={{ letterSpacing: '-0.5px' }}
        >
          Few<span style={{ color: 'var(--amber)' }}>sion</span>
        </Link>

        <h1 className="font-display text-[22px] font-extrabold text-[var(--text)] text-center mb-2">
          Forgot Password?
        </h1>
        <p className="text-[14px] text-[var(--muted)] text-center leading-[1.5] mb-7">
          Enter your registered email address and we&apos;ll send you a link to reset your password.
        </p>

        {/* Success state */}
        {success && (
          <div
            className="rounded-lg p-3 mb-5 text-[14px] leading-[1.5]"
            style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80' }}
          >
            ✨ Reset link sent! Check your email inbox (and spam folder) to update your password.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5 relative">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
              required
              autoComplete="email"
              className="form-input"
              style={{ background: 'var(--black)', border: `1px solid ${emailError ? 'rgba(255,107,53,0.5)' : 'var(--border2)'}`, borderRadius: '8px' }}
              onFocus={(e) => { if (!emailError) e.target.style.borderColor = 'var(--amber)'; e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.08)'; }}
              onBlur={(e) => { if (!emailError) e.target.style.borderColor = 'var(--border2)'; e.target.style.boxShadow = 'none'; }}
            />
            {emailError && (
              <div className="text-[13px] mt-[6px]" style={{ color: '#FF6B35' }}>{emailError}</div>
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
            {loading ? 'Sending request...' : 'Send Reset Link →'}
          </button>
        </form>

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
