'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../utils/supabase';

type Role = 'brand' | 'creator' | 'editor';
type Step = 0 | 1 | 2 | 3;

const roleData = {
  brand: {
    label: 'Brand',
    icon: '🏢',
    desc: 'Post campaigns, discover creators, run UGC at scale',
    perks: [
      { icon: '🤖', title: 'AI Brief Builder', desc: 'Generate campaign briefs in 3 minutes' },
      { icon: '🎯', title: 'Performance Creator Search', desc: 'Filter by verified CTR, not follower count' },
      { icon: '🔒', title: 'Escrow-Protected Campaigns', desc: 'Only pay when you approve content' },
    ],
  },
  creator: {
    label: 'Creator',
    icon: '🎬',
    desc: 'Get matched to brand deals, build your performance portfolio',
    perks: [
      { icon: '📊', title: 'Performance Portfolio', desc: 'Showcase real CTR and engagement to brands' },
      { icon: '💰', title: 'Guaranteed Payments', desc: 'Escrow-protected, released within 24hrs' },
      { icon: '🤖', title: 'AI Brand Matching', desc: 'Get matched to campaigns that fit your niche' },
    ],
  },
  editor: {
    label: 'Editor',
    icon: '✂️',
    desc: 'Find editing projects from brands and creators',
    perks: [
      { icon: '🎬', title: 'Editor Portfolio', desc: 'Showcase your showreel to brands and creators' },
      { icon: '🤝', title: 'Creator Collaboration', desc: 'Get invited into live projects in-platform' },
      { icon: '💰', title: 'Escrow-Protected Pay', desc: 'Get paid within 24hrs of project approval' },
    ],
  },
};

const niches = ['Beauty', 'Fitness', 'Tech', 'Food', 'Travel', 'Finance', 'Gaming', 'Fashion', 'Parenting', 'Education'];
const editorSpecials = ['UGC Edits', 'Ad Videos', 'Reels', 'Motion Graphics', 'Color Grading', 'Captions', 'Thumbnails'];
const software = ['Premiere Pro', 'Final Cut', 'DaVinci Resolve', 'CapCut', 'After Effects'];

export default function SignupPage() {
  const [step, setStep] = useState<Step>(0);
  const [role, setRole] = useState<Role>('brand');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passStrength, setPassStrength] = useState(0);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedSoftware, setSelectedSoftware] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; error: boolean } | null>(null);

  const showToast = (msg: string, error = false) => {
    setToast({ msg, error });
    setTimeout(() => setToast(null), 4000);
  };

  const checkPassStrength = (v: string) => {
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^a-zA-Z0-9]/.test(v)) score++;
    setPassStrength(score);
  };

  const strengthConfig = [
    { width: '0%', color: '#555', text: 'Enter a password' },
    { width: '25%', color: '#ef4444', text: 'Too weak' },
    { width: '50%', color: '#f59e0b', text: 'Moderate' },
    { width: '75%', color: '#3b82f6', text: 'Strong' },
    { width: '100%', color: '#4ade80', text: 'Very strong ✓' },
  ];

  const toggleChip = (val: string, arr: string[], setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const validateStep1 = () => {
    if (!firstName.trim()) { showToast('First name is required', true); return false; }
    if (!lastName.trim()) { showToast('Last name is required', true); return false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('A valid email is required', true); return false; }
    if (password.length < 6) { showToast('Password must be at least 6 characters', true); return false; }
    return true;
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      if (error) {
        showToast(error.message, true);
      }
    } catch {
      showToast('Authentication failed. Please try again.', true);
    }
  };

  const goStep = (n: Step) => {
    if (n > step && step === 1 && !validateStep1()) return;
    setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completeSignup = async () => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
            role: role
          }
        }
      });

      if (authError) {
        showToast(authError.message, true);
        return;
      }

      if (authData?.user?.id) {
        // Insert into public.users table
        const { error: profileError } = await supabase.from('users').insert({
          id: authData.user.id,
          email: email,
          role: role,
          first_name: firstName,
          last_name: lastName,
          created_at: new Date().toISOString()
        });

        if (profileError) {
          console.error("Profile creation error:", profileError);
        }
      }

      showToast('Account created! Redirecting to setup portal...', false);
      setTimeout(() => {
        window.location.href = `/portals/${role}`;
      }, 1500);
    } catch {
      showToast('Signup failed. Please try again.', true);
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 4;
  const progress = (step / (totalSteps - 1)) * 100;

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: 'var(--black)' }}>

      {/* Background glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,166,35,0.09) 0%, transparent 70%)' }}
      />

      {/* Top nav */}
      <div
        className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-[5%] z-50"
        style={{ backgroundColor: 'var(--black)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)' }}
      >
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 no-underline">
          <img src="/logo.png" alt="Fewsion Logo" className="h-8 w-auto object-contain" />
          <span className="font-display text-[22px] font-extrabold text-[color:var(--text)]" style={{ letterSpacing: '-0.5px' }}>
            Few<span style={{ color: 'var(--amber)' }}>sion</span>
          </span>
        </Link>
        <Link href="/login" className="text-[13px] text-[var(--muted)] no-underline hover:text-[var(--text)] transition-colors">
          Already have an account? <strong style={{ color: 'var(--amber)' }}>Sign in →</strong>
        </Link>
      </div>

      {/* Page content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5 py-10">

        {/* Progress dots */}
        <div className="flex items-center gap-0 mb-10 mt-20">
          {[0, 1, 2, 3].map((i) => (
            <React.Fragment key={i}>
              <div
                className="transition-all duration-300 rounded-full"
                style={{
                  width: step === i ? '24px' : '8px',
                  height: '8px',
                  background: step > i ? 'var(--amber)' : step === i ? 'var(--amber)' : 'var(--border2)',
                  borderRadius: step === i ? '4px' : '50%',
                }}
              />
              {i < 3 && (
                <div
                  className="w-8 h-[2px] transition-all duration-300"
                  style={{ background: step > i ? 'var(--amber)' : 'var(--border)' }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="w-full max-w-[520px]" style={{ animation: 'fadeUp 0.4s ease' }}>

          {/* ── STEP 0: Role ── */}
          {step === 0 && (
            <div>
              <div className="text-[12px] font-semibold uppercase mb-3" style={{ color: 'var(--amber)', letterSpacing: '0.1em' }}>Step 1 of 4</div>
              <h1
                className="font-display font-extrabold text-[color:var(--text)] mb-2"
                style={{ fontSize: 'clamp(24px,4vw,36px)', letterSpacing: '-0.8px', lineHeight: '1.1' }}
              >
                I want to join<br />Fewsion as a{' '}
                <em style={{ fontStyle: 'normal', color: 'var(--amber)' }}>{roleData[role].label}</em>
              </h1>
              <p className="text-[14px] text-[var(--muted)] mb-8 leading-[1.6]">Choose the role that best describes you. You can add other roles later.</p>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {(Object.entries(roleData) as [Role, typeof roleData.brand][]).map(([r, rd]) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className="text-center rounded-2xl p-6 cursor-pointer border-none transition-all duration-200"
                    style={{
                      background: 'var(--card)',
                      border: `2px solid ${role === r ? 'var(--amber)' : 'var(--border)'}`,
                      backgroundColor: role === r ? 'rgba(245,166,35,0.05)' : 'var(--card)',
                      transform: 'translateY(0)',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { if (role !== r) (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                  >
                    <div className="text-[32px] mb-[10px]">{rd.icon}</div>
                    <div className="font-display text-[14px] font-bold mb-1" style={{ color: role === r ? 'var(--amber)' : 'var(--text)' }}>{rd.label}</div>
                    <div className="text-[11px] leading-[1.5]" style={{ color: 'var(--muted)' }}>{rd.desc}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => goStep(1)}
                className="w-full font-display text-[15px] font-bold py-[15px] rounded-full border-none cursor-pointer flex items-center justify-center gap-2 transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, var(--amber), var(--amber2))', color: '#000' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(245,166,35,0.3)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
              >
                Continue as {roleData[role].label} →
              </button>
            </div>
          )}

          {/* ── STEP 1: Account Info ── */}
          {step === 1 && (
            <div>
              <div className="text-[12px] font-semibold uppercase mb-3" style={{ color: 'var(--amber)', letterSpacing: '0.1em' }}>Step 2 of 4</div>
              <h1 className="font-display font-extrabold text-[color:var(--text)] mb-2" style={{ fontSize: 'clamp(24px,4vw,36px)', letterSpacing: '-0.8px', lineHeight: '1.1' }}>
                Create your<br /><em style={{ fontStyle: 'normal', color: 'var(--amber)' }}>account</em>
              </h1>
              <p className="text-[14px] text-[var(--muted)] mb-8 leading-[1.6]">Your profile is free forever. No credit card needed.</p>

              <div className="mb-5">
                <button
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-2 rounded-[10px] w-full p-3 text-[13px] font-medium cursor-pointer border-none transition-all duration-200"
                  style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-body)' }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border2)'; el.style.background = 'var(--card2)'; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.background = 'var(--card)'; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>
              </div>

              <div className="flex items-center gap-3 mb-5 text-[12px]" style={{ color: 'var(--muted)' }}>
                <div className="flex-1 h-[1px]" style={{ background: 'var(--border)' }} />
                or continue with email
                <div className="flex-1 h-[1px]" style={{ background: 'var(--border)' }} />
              </div>

              <div className="grid grid-cols-2 gap-[14px] mb-4">
                <div>
                  <label className="form-label">First name</label>
                  <input type="text" placeholder="Arjun" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Last name</label>
                  <input type="text" placeholder="Desai" value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-input" />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">Email address</label>
                <input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" autoComplete="email" />
              </div>

              <div className="mb-6">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); checkPassStrength(e.target.value); }}
                  className="form-input"
                  autoComplete="new-password"
                />
                {/* Strength bar */}
                <div className="mt-2">
                  <div className="h-[3px] rounded-full overflow-hidden mb-1" style={{ background: 'var(--border)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: strengthConfig[passStrength].width,
                        background: strengthConfig[passStrength].color,
                      }}
                    />
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--muted2)' }}>{strengthConfig[passStrength].text}</div>
                </div>
              </div>

              <button onClick={() => goStep(2)} className="btn-submit mb-2">Continue →</button>
              <button
                onClick={() => goStep(0)}
                className="w-full py-3 rounded-full text-[14px] cursor-pointer border-none transition-all duration-200"
                style={{ background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', fontFamily: 'var(--font-body)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}
              >
                ← Back
              </button>
            </div>
          )}

          {/* ── STEP 2: Profile Details ── */}
          {step === 2 && (
            <div>
              <div className="text-[12px] font-semibold uppercase mb-3" style={{ color: 'var(--amber)', letterSpacing: '0.1em' }}>Step 3 of 4</div>
              <h1 className="font-display font-extrabold text-[color:var(--text)] mb-2" style={{ fontSize: 'clamp(24px,4vw,36px)', letterSpacing: '-0.8px', lineHeight: '1.1' }}>
                Tell us about<br />
                <em style={{ fontStyle: 'normal', color: 'var(--amber)' }}>
                  {role === 'brand' ? 'your brand' : role === 'creator' ? 'your content' : 'your editing work'}
                </em>
              </h1>
              <p className="text-[14px] text-[var(--muted)] mb-8 leading-[1.6]">
                {role === 'brand' ? 'This helps creators find and trust you.' : role === 'creator' ? 'This helps brands find you for the right campaigns.' : 'This helps brands and creators find you.'}
              </p>

              {role === 'creator' && (
                <div className="mb-6">
                  <label className="form-label">Primary content niche</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {niches.map((n) => (
                      <button
                        key={n}
                        onClick={() => toggleChip(n, selectedNiches, setSelectedNiches)}
                        className="text-[12px] px-[14px] py-[7px] rounded-full cursor-pointer border-none transition-all duration-200"
                        style={{
                          border: `1.5px solid ${selectedNiches.includes(n) ? 'var(--amber)' : 'var(--border)'}`,
                          color: selectedNiches.includes(n) ? 'var(--amber)' : 'var(--muted)',
                          background: selectedNiches.includes(n) ? 'var(--amber-glow)' : 'var(--card)',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {role === 'editor' && (
                <>
                  <div className="mb-4">
                    <label className="form-label">Editing specialisation</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editorSpecials.map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleChip(s, selectedNiches, setSelectedNiches)}
                          className="text-[12px] px-[14px] py-[7px] rounded-full cursor-pointer border-none transition-all duration-200"
                          style={{
                            border: `1.5px solid ${selectedNiches.includes(s) ? 'var(--amber)' : 'var(--border)'}`,
                            color: selectedNiches.includes(s) ? 'var(--amber)' : 'var(--muted)',
                            background: selectedNiches.includes(s) ? 'var(--amber-glow)' : 'var(--card)',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Software you use</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {software.map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleChip(s, selectedSoftware, setSelectedSoftware)}
                          className="text-[12px] px-[14px] py-[7px] rounded-full cursor-pointer border-none transition-all duration-200"
                          style={{
                            border: `1.5px solid ${selectedSoftware.includes(s) ? 'var(--amber)' : 'var(--border)'}`,
                            color: selectedSoftware.includes(s) ? 'var(--amber)' : 'var(--muted)',
                            background: selectedSoftware.includes(s) ? 'var(--amber-glow)' : 'var(--card)',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {role === 'brand' && (
                <div className="mb-4">
                  <label className="form-label">Industry / Niche</label>
                  <select
                    className="form-input"
                    style={{ appearance: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' fill='none' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
                  >
                    <option value="">Select your industry</option>
                    {['Skincare / Beauty', 'Food & Beverage', 'Tech / Gadgets', 'Fitness / Health', 'Fashion', 'Home & Lifestyle', 'Finance / FinTech', 'E-commerce', 'Other'].map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              )}

              <button onClick={() => goStep(3)} className="btn-submit mb-2">Continue →</button>
              <button
                onClick={() => goStep(1)}
                className="w-full py-3 rounded-full text-[14px] cursor-pointer border-none transition-all duration-200"
                style={{ background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', fontFamily: 'var(--font-body)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}
              >
                ← Back
              </button>
            </div>
          )}

          {/* ── STEP 3: Done / Perks ── */}
          {step === 3 && (
            <div>
              <div className="text-[12px] font-semibold uppercase mb-3" style={{ color: 'var(--amber)', letterSpacing: '0.1em' }}>Almost there! 🎉</div>
              <h1 className="font-display font-extrabold text-[color:var(--text)] mb-2" style={{ fontSize: 'clamp(24px,4vw,36px)', letterSpacing: '-0.8px', lineHeight: '1.1' }}>
                Welcome to<br /><em style={{ fontStyle: 'normal', color: 'var(--amber)' }}>Fewsion</em>
              </h1>
              <p className="text-[14px] text-[var(--muted)] mb-8 leading-[1.6]">Here&apos;s what&apos;s waiting for you inside your dashboard.</p>

              <div className="flex flex-col gap-[10px] mb-8">
                {roleData[role].perks.map((perk) => (
                  <div key={perk.title} className="flex gap-3 items-center">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[14px] flex-shrink-0"
                      style={{ background: 'var(--amber-glow)', border: '1px solid rgba(245,166,35,0.2)' }}
                    >
                      {perk.icon}
                    </div>
                    <div className="text-[13px] leading-[1.5]" style={{ color: 'var(--muted)' }}>
                      <strong className="text-[color:var(--text)] font-semibold">{perk.title}</strong> — {perk.desc}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={completeSignup}
                disabled={loading}
                className="btn-submit flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-[rgba(0,0,0,0.3)] border-t-black animate-spin" />
                    Creating account...
                  </>
                ) : 'Create my account →'}
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast show ${toast.error ? 'error' : 'success'}`}>{toast.msg}</div>
      )}
    </div>
  );
}
