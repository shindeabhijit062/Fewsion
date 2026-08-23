'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AIChatbotWidget from '@/components/AIChatbotWidget';
import AnimatedCounter from '@/components/AnimatedCounter';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'global' | 'india' | 'gap'>('global');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => {
      document.querySelectorAll('.reveal:not(.visible), .roadmap-item:not(.visible)').forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Reveal when element is 50px above the bottom of the viewport
        if (rect.top < window.innerHeight - 50) {
          el.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount to show elements already in view
    const timeout = setTimeout(handleScroll, 150);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <main>
      {/* ── HERO SECTION ── */}
      <section id="hero" className={`relative flex min-h-screen flex-col justify-center overflow-hidden bg-grid pt-28 lg:pt-24 bg-[var(--black)] ${isLoaded ? 'hero-loaded' : ''}`}>
        {/* Ambient floating glowing backdrops */}
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-[var(--amber)]/10 blur-[120px]"></div>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr] overflow-visible">
          {/* Copy */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="hero-reveal-1 mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--amber)]/50 bg-[var(--amber)]/15 px-5 py-2 text-sm font-semibold text-[var(--amber)] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--amber)] animate-ping"></span>
              India&apos;s First Performance-First Creator Marketplace
            </div>

            <h1 className="hero-reveal-1 font-display font-bold leading-[0.95] tracking-tighter text-[clamp(36px,4.5vw,80px)] xl:text-[80px] mb-2 text-[var(--text)]">
              <span className="whitespace-nowrap">Where <span className="text-shimmer">Brands</span></span><br />
              <span className="whitespace-nowrap">Meet <span className="text-shimmer">Creators</span></span>
            </h1>

            <p className="hero-reveal-2 mt-7 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              Fewsion connects D2C brands, UGC content creators, and video editors — powered by AI matching, verified performance data, and built-in escrow payments.
            </p>

            <div className="hero-reveal-3 mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Link href="/signup" className="hero-btn-primary group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Join the waitlist
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
                </span>
              </Link>
              <a href="#solution" className="btn-ghost flex items-center gap-2">
                <svg className="w-4 h-4 fill-current text-[var(--amber)]" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                See how it works
              </a>
            </div>
          </div>

          {/* Orbital Graphic & Floating Mockups */}
          <div className="hero-reveal-4 relative mx-auto aspect-square w-full max-w-[480px] overflow-visible select-none">
            {/* Ambient glows behind the orbit */}
            <div className="absolute inset-0 rounded-full bg-[var(--amber)]/5 blur-[60px] pointer-events-none"></div>

            {/* Static Status Badge 1: Top-Left */}
            <div className="absolute top-[6%] left-[-4%] md:left-[-10%] z-40 float-1 flex items-center gap-1.5 rounded-full border border-[var(--border2)] bg-[var(--deep)] px-3 py-1.5 text-[10px] md:text-xs text-[var(--text)] shadow-[0_4px_20px_rgba(0,0,0,0.15)] backdrop-blur-md">
              <svg className="w-3.5 h-3.5 text-[var(--amber)] fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="font-semibold">AI matched: 96% fit</span>
            </div>

            {/* Static Status Badge 2: Bottom-Left */}
            <div className="absolute bottom-[12%] left-[-6%] md:left-[-12%] z-40 float-2 flex items-center gap-1.5 rounded-full border border-[var(--border2)] bg-[var(--deep)] px-3 py-1.5 text-[10px] md:text-xs text-[var(--text)] shadow-[0_4px_20px_rgba(0,0,0,0.15)] backdrop-blur-md">
              <span className="font-extrabold text-[var(--amber)] text-[11px] leading-none">₹</span>
              <span className="font-semibold">Escrow released ₹45,000</span>
            </div>

            {/* Static Status Badge 3: Mid-Right */}
            <div className="absolute bottom-[32%] right-[-6%] md:right-[-12%] z-40 float-3 flex items-center gap-1.5 rounded-full border border-[var(--border2)] bg-[var(--deep)] px-3 py-1.5 text-[10px] md:text-xs text-[var(--text)] shadow-[0_4px_20px_rgba(0,0,0,0.15)] backdrop-blur-md">
              <svg className="w-3.5 h-3.5 text-[var(--amber)] fill-none stroke-current" strokeWidth="3" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="font-semibold">Verified: 2.4M views delivered</span>
            </div>

            {/* Rotating Container (contains connecting lines and orbiting node cards) */}
            <div className="absolute inset-0 animate-orbit-sync">
              <svg viewBox="0 0 480 480" className="absolute inset-0 h-full w-full">
                {/* Outer orbit circle */}
                <circle cx="240" cy="240" r="170" fill="none" stroke="var(--amber)" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="6 4"></circle>
                {/* Inner orbit circle */}
                <circle cx="240" cy="240" r="110" fill="none" stroke="var(--amber)" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 4"></circle>

                {/* Connecting lines */}
                <line x1="240" y1="240" x2="240" y2="70" stroke="var(--amber)" strokeOpacity="0.45" strokeWidth="1.75" strokeDasharray="5 3" className="animate-dash-flow"></line>
                {/* 120deg line */}
                <line x1="240" y1="240" x2="387" y2="325" stroke="var(--amber)" strokeOpacity="0.45" strokeWidth="1.75" strokeDasharray="5 3" className="animate-dash-flow"></line>
                {/* 240deg line */}
                <line x1="240" y1="240" x2="93" y2="325" stroke="var(--amber)" strokeOpacity="0.45" strokeWidth="1.75" strokeDasharray="5 3" className="animate-dash-flow"></line>
              </svg>

              {/* Node 1: D2C Brands (placed at top-left/top) */}
              <div className="absolute left-[50%] top-[14.6%] -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="animate-orbit-reverse-sync flex flex-col items-center relative">
                  {/* Template Node Card */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border2)] bg-[var(--card)] shadow-[0_0_24px_-6px_var(--amber-glow)] sm:h-16 sm:w-16">
                    <svg className="w-6 h-6 text-[var(--amber)] sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  {/* Node Label */}
                  <span className="text-[10px] md:text-[11px] font-semibold text-[var(--text)] mt-2 bg-[var(--card)] border border-border px-2.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                    D2C Brands
                  </span>
                </div>
              </div>

              {/* Node 2: Creators */}
              <div className="absolute left-[80.6%] top-[67.7%] -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="animate-orbit-reverse-sync flex flex-col items-center relative">
                  {/* Template Node Card */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border2)] bg-[var(--card)] shadow-[0_0_24px_-6px_var(--amber-glow)] sm:h-16 sm:w-16">
                    <svg className="w-6 h-6 text-[var(--amber)] sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  {/* Node Label */}
                  <span className="text-[10px] md:text-[11px] font-semibold text-[var(--text)] mt-2 bg-[var(--card)] border border-border px-2.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                    Creators
                  </span>
                </div>
              </div>

              {/* Node 3: Video Editors */}
              <div className="absolute left-[19.3%] top-[67.7%] -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="animate-orbit-reverse-sync flex flex-col items-center relative">
                  {/* Template Node Card */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border2)] bg-[var(--card)] shadow-[0_0_24px_-6px_var(--amber-glow)] sm:h-16 sm:w-16">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scissors h-6 w-6 text-[var(--amber)] sm:h-7 sm:w-7" aria-hidden="true">
                      <circle cx="6" cy="6" r="3"></circle>
                      <path d="M8.12 8.12 12 12"></path>
                      <path d="M20 4 8.12 15.88"></path>
                      <circle cx="6" cy="18" r="3"></circle>
                      <path d="M14.8 14.8 20 20"></path>
                    </svg>
                  </div>
                  {/* Node Label */}
                  <span className="text-[10px] md:text-[11px] font-semibold text-[var(--text)] mt-2 bg-[var(--card)] border border-border px-2.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                    Video Editors
                  </span>
                </div>
              </div>
            </div>

            {/* Glowing Center AI Core */}
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <div className="animate-core-glow flex h-24 w-24 flex-col items-center justify-center rounded-full bg-[var(--core-bg)] shadow-[0_0_30px_rgba(245,166,35,0.2)]">
                <span className="text-lg font-bold text-[var(--core-text)]">Few<span className="text-[var(--amber)]">sion</span></span>
                <span className="text-[10px] uppercase tracking-widest text-[#999]">AI Core</span>
              </div>
            </div>

            {/* Rotating Nodes */}
            <div className="animate-orbit absolute inset-0">
              <div className="absolute inset-0 rotate-0">
                <div className="orbit-node absolute left-1/2 top-[4.5%] -translate-x-1/2">
                  <div className="animate-counter-orbit">
                    <div style={{ transform: 'rotate(0deg)' }}>
                      <span className="rounded-full px-3 py-1 text-xs bg-[var(--card)] text-[var(--text)] whitespace-nowrap shadow-sm border border-border">D2C Brands</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rotate-[120deg]">
                <div className="orbit-node absolute left-1/2 top-[4.5%] -translate-x-1/2">
                  <div className="animate-counter-orbit">
                    <div style={{ transform: 'rotate(-120deg)' }}>
                      <span className="rounded-full px-3 py-1 text-xs bg-[var(--card)] text-[var(--text)] whitespace-nowrap shadow-sm border border-border">UGC Creators</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rotate-[240deg]">
                <div className="orbit-node absolute left-1/2 top-[4.5%] -translate-x-1/2">
                  <div className="animate-counter-orbit">
                    <div style={{ transform: 'rotate(-240deg)' }}>
                      <span className="rounded-full px-3 py-1 text-xs bg-[var(--card)] text-[var(--text)] whitespace-nowrap shadow-sm border border-border">Video Editors</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Floating Card 1 */}
            <div className="hero-floating-card float-1 -top-[5%] left-1/2 -translate-x-1/2 hidden md:flex">
              <div className="floating-card-icon-amber">🤖</div>
              <div>
                <div className="text-[11px] font-bold text-[var(--text)] leading-tight">AI Matching</div>
                <div className="text-[9px] text-[var(--muted)] leading-none mt-0.5">Found 12 creators (98%)</div>
              </div>
            </div>

            {/* Premium Floating Card 2 */}
            <div className="hero-floating-card float-2 bottom-[10%] -left-[5%] hidden md:flex">
              <div className="floating-card-icon-green">🛡️</div>
              <div>
                <div className="text-[11px] font-bold text-[var(--text)] leading-tight">Escrow Secured</div>
                <div className="text-[9px] text-[var(--muted)] leading-none mt-0.5">₹2,50,000 Milestone</div>
              </div>
            </div>

            {/* Premium Floating Card 3 */}
            <div className="hero-floating-card float-3 bottom-[10%] -right-[5%] hidden md:flex">
              <div className="floating-card-icon-amber">📈</div>
              <div>
                <div className="text-[11px] font-bold text-[var(--text)] leading-tight">UGC CTR: +8.4%</div>
                <div className="text-[9px] text-[var(--muted)] leading-none mt-0.5">Verified Performance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 mx-auto mt-24 grid w-full max-w-5xl grid-cols-2 gap-x-4 gap-y-10 px-4 pb-16 sm:px-6 lg:mt-32 lg:grid-cols-4 text-center">
          <div>
            <span className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              <AnimatedCounter value={3500} prefix="₹" suffix="Cr" />
            </span>
            <p className="mt-2 text-sm text-muted-foreground">Indian Market Size</p>
          </div>
          <div>
            <span className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              <AnimatedCounter value={4.5} decimals={1} suffix="M+" />
            </span>
            <p className="mt-2 text-sm text-muted-foreground">Indian Creators</p>
          </div>
          <div>
            <span className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              <AnimatedCounter value={323} prefix="$" suffix="B" />
            </span>
            <p className="mt-2 text-sm text-muted-foreground">Global Creator Economy</p>
          </div>
          <div>
            <span className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              <AnimatedCounter value={26} suffix="%" />
            </span>
            <p className="mt-2 text-sm text-muted-foreground">Annual Growth Rate</p>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" className="py-[90px] px-[5%] md:py-[100px] bg-deep group/problem">
        <div className="flex items-center gap-3 mb-5 reveal">
          <div className="w-5 h-[2px] bg-amber"></div>
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-amber">The Problem</span>
        </div>
        <h2 className="text-[32px] md:text-[56px] font-display font-extrabold leading-[1.1] tracking-[-1.5px] mb-6 reveal">
          <span className="text-[var(--text)]">The creator economy is broken</span><br />
          <span className="text-amber">for everyone involved</span>
        </h2>
        <p className="text-[16px] md:text-[18px] text-text-muted max-w-[550px] leading-[1.6] mb-14 reveal reveal-delay-1">
          Brands, creators, and editors all face painful friction — and no existing platform solves all three.
        </p>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-[1px] bg-border border border-border rounded-2xl overflow-hidden">
          {/* For Brands */}
          <div className="bg-card p-8 lg:p-[40px_32px] relative transition-colors duration-300 hover:bg-card2 group reveal">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber to-amber2 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
            <div className="w-10 h-10 bg-amber-glow border border-amber/20 rounded-lg flex items-center justify-center text-[18px] mb-5">🏢</div>
            <h3 className="text-[18px] font-display font-bold mb-3 tracking-[-0.3px] text-[var(--text)]">For Brands</h3>
            <p className="text-text-muted leading-[1.7] text-[13px]">No reliable way to find quality UGC creators at scale. Brands hire based on follower count with zero performance data. Contracts and payments scattered across WhatsApp, email, Notion — high drop-off, no accountability.</p>
          </div>

          {/* For Creators */}
          <div className="bg-card p-8 lg:p-[40px_32px] relative transition-colors duration-300 hover:bg-card2 group reveal reveal-delay-1">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber to-amber2 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
            <div className="w-10 h-10 bg-amber-glow border border-amber/20 rounded-lg flex items-center justify-center text-[18px] mb-5">🎬</div>
            <h3 className="text-[18px] font-display font-bold mb-3 tracking-[-0.3px] text-[var(--text)]">For Creators</h3>
            <p className="text-text-muted leading-[1.7] text-[13px]">No professional portfolio built for UGC or short-form content. Hard to discover what brands actually want. Payment delays with no escrow protection. No easy way to collaborate with editors.</p>
          </div>

          {/* For Editors */}
          <div className="bg-card p-8 lg:p-[40px_32px] relative transition-colors duration-300 hover:bg-card2 group reveal reveal-delay-2">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber to-amber2 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
            <div className="w-10 h-10 bg-amber-glow border border-amber/20 rounded-lg flex items-center justify-center text-[18px] mb-5">🎞️</div>
            <h3 className="text-[18px] font-display font-bold mb-3 tracking-[-0.3px] text-[var(--text)]">For Editors</h3>
            <p className="text-text-muted leading-[1.7] text-[13px]">Invisible to brands — editors only get hired through personal connections. No platform to showcase reel, ad, or short-form editing work. Inconsistent income, no long-term client relationships.</p>
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section id="solution" className="py-[90px] px-[5%] md:py-[120px] bg-[var(--black)]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="max-w-[600px] reveal">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-5 h-[2px] bg-amber"></div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-amber">The Solution</span>
            </div>
            <h2 className="text-[clamp(32px,5vw,56px)] font-display font-extrabold leading-[1.1] tracking-[-1.5px] text-[var(--text)]">
              One platform.<br />
              <span className="text-amber not-italic">Three portals.</span><br />
              One AI brain.
            </h2>
          </div>
          <p className="text-[14px] md:text-[15px] text-text-muted max-w-[420px] leading-[1.7] lg:mb-0 reveal reveal-delay-1">
            Fewsion unifies every stakeholder in the creator economy — with AI-powered matching, performance tracking, escrow payments, and built-in collaboration tools.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[var(--card)] border border-border rounded-2xl p-8 lg:p-[40px_32px] transition-colors duration-300 hover:border-border2 reveal">
            <div className="w-10 h-10 bg-amber-glow border border-amber/20 rounded-lg flex items-center justify-center text-[18px] mb-6">🎬</div>
            <h3 className="text-[18px] font-display font-bold mb-5 tracking-[-0.3px] text-[var(--text)]">Creator Portal</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-3.5">
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Performance-backed portfolio & niche tagging</li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Real CTR and engagement stats on every piece</li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Invite editors directly into your projects</li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Browse & apply to brand campaigns</li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Escrow-protected payments</li>
            </ul>
          </div>

          <div className="bg-[var(--card)] border border-border rounded-2xl p-8 lg:p-[40px_32px] transition-colors duration-300 hover:border-border2 reveal reveal-delay-1">
            <div className="w-10 h-10 bg-amber-glow border border-amber/20 rounded-lg flex items-center justify-center text-[18px] mb-6">🏢</div>
            <h3 className="text-[18px] font-display font-bold mb-5 tracking-[-0.3px] text-[var(--text)]">Brand Portal</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-3.5">
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> AI-powered brief builder in seconds</li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Discover creators by proven performance, not followers</li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Post UGC, ad video, and content campaigns</li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> AI chatbot to find the right creator instantly</li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Public brand storefront with creator reviews</li>
            </ul>
          </div>

          <div className="bg-[var(--card)] border border-border rounded-2xl p-8 lg:p-[40px_32px] transition-colors duration-300 hover:border-border2 reveal reveal-delay-2">
            <div className="w-10 h-10 bg-amber-glow border border-amber/20 rounded-lg flex items-center justify-center text-[18px] mb-6">🎞️</div>
            <h3 className="text-[18px] font-display font-bold mb-5 tracking-[-0.3px] text-[var(--text)]">Editor Portal</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-3.5">
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> First Indian platform with a dedicated editor marketplace</li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Showcase reels, ad edits, short-form work</li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Get hired by brands directly — not just creators</li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Receive collab invites from creators on projects</li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Performance rating builds long-term reputation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section id="differentiators" className="py-[90px] px-[5%] md:py-[100px] bg-[var(--black)]">
        <div className="flex items-center gap-3 mb-5 reveal">
          <div className="w-5 h-[2px] bg-amber"></div>
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-amber">What Makes Us Different</span>
        </div>
        <h2 className="text-[clamp(32px,5vw,56px)] font-display font-extrabold leading-[1.1] tracking-[-1.5px] mb-4 reveal">
          <span className="text-[var(--text)]">8 features no Indian</span><br />
          <span className="text-amber">platform has today</span>
        </h2>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 bg-[var(--deep)] border border-border rounded-2xl overflow-hidden reveal reveal-delay-1">

          {/* Item 01 */}
          <div className="flex gap-5 p-8 border-b border-border lg:border-r transition-colors duration-300 hover:bg-[var(--card2)]">
            <div className="text-amber text-[14px] font-bold font-display mt-1">01</div>
            <div>
              <h4 className="text-[16px] md:text-[18px] font-bold text-[var(--text)] mb-2 tracking-[-0.3px]">Performance-Based Creator Score</h4>
              <p className="text-text-muted text-[13px] leading-[1.6]">A public trust score built on on-time delivery, brand satisfaction, content CTR, and repeat hire rate — not follower count.</p>
            </div>
          </div>

          {/* Item 02 */}
          <div className="flex gap-5 p-8 border-b border-border transition-colors duration-300 hover:bg-[var(--card2)]">
            <div className="text-amber text-[14px] font-bold font-display mt-1">02</div>
            <div>
              <h4 className="text-[16px] md:text-[18px] font-bold text-[var(--text)] mb-2 tracking-[-0.3px]">AI Campaign Brief Builder</h4>
              <p className="text-text-muted text-[13px] leading-[1.6]">Brands auto-generate structured, professional campaign briefs in seconds. Reduces back-and-forth and creator drop-off dramatically.</p>
            </div>
          </div>

          {/* Item 03 */}
          <div className="flex gap-5 p-8 border-b border-border lg:border-r transition-colors duration-300 hover:bg-[var(--card2)]">
            <div className="text-amber text-[14px] font-bold font-display mt-1">03</div>
            <div>
              <h4 className="text-[16px] md:text-[18px] font-bold text-[var(--text)] mb-2 tracking-[-0.3px]">Content Performance Tracker</h4>
              <p className="text-text-muted text-[13px] leading-[1.6]">Track real ad performance after delivery — views, clicks, CTR, conversions. Creators build data-backed portfolios, brands get proof of ROI.</p>
            </div>
          </div>

          {/* Item 04 */}
          <div className="flex gap-5 p-8 border-b border-border transition-colors duration-300 hover:bg-[var(--card2)]">
            <div className="text-amber text-[14px] font-bold font-display mt-1">04</div>
            <div>
              <h4 className="text-[16px] md:text-[18px] font-bold text-[var(--text)] mb-2 tracking-[-0.3px]">Escrow Payment Protection</h4>
              <p className="text-text-muted text-[13px] leading-[1.6]">Brand deposits money upfront via Razorpay escrow. Creator gets paid only after approval. Eliminates payment disputes for both sides.</p>
            </div>
          </div>

          {/* Item 05 */}
          <div className="flex gap-5 p-8 border-b border-border lg:border-r transition-colors duration-300 hover:bg-[var(--card2)]">
            <div className="text-amber text-[14px] font-bold font-display mt-1">05</div>
            <div>
              <h4 className="text-[16px] md:text-[18px] font-bold text-[var(--text)] mb-2 tracking-[-0.3px]">Creator ↔ Editor In-Platform Collab</h4>
              <p className="text-text-muted text-[13px] leading-[1.6]">Creators invite editors directly inside any live project. No more WhatsApp back-and-forth. Everything stays on Fewsion.</p>
            </div>
          </div>

          {/* Item 06 */}
          <div className="flex gap-5 p-8 border-b border-border transition-colors duration-300 hover:bg-[var(--card2)]">
            <div className="text-amber text-[14px] font-bold font-display mt-1">06</div>
            <div>
              <h4 className="text-[16px] md:text-[18px] font-bold text-[var(--text)] mb-2 tracking-[-0.3px]">Brand Storefront with Creator Reviews</h4>
              <p className="text-text-muted text-[13px] leading-[1.6]">Each company gets a public page with past campaigns and creator reviews. Creators apply to brands they actually want to work with.</p>
            </div>
          </div>

          {/* Item 07 */}
          <div className="flex gap-5 p-8 lg:border-r border-border transition-colors duration-300 hover:bg-[var(--card2)]">
            <div className="text-amber text-[14px] font-bold font-display mt-1">07</div>
            <div>
              <h4 className="text-[16px] md:text-[18px] font-bold text-[var(--text)] mb-2 tracking-[-0.3px]">AI Matching Chatbot</h4>
              <p className="text-text-muted text-[13px] leading-[1.6]">Brands type what they need — niche, budget, platform, language — and AI returns the best matched, verified creators instantly.</p>
            </div>
          </div>

          {/* Item 08 */}
          <div className="flex gap-5 p-8 transition-colors duration-300 hover:bg-[var(--card2)]">
            <div className="text-amber text-[14px] font-bold font-display mt-1">08</div>
            <div>
              <h4 className="text-[16px] md:text-[18px] font-bold text-[var(--text)] mb-2 tracking-[-0.3px]">One-Click AI Contract Generator</h4>
              <p className="text-text-muted text-[13px] leading-[1.6]">Auto-generated contracts covering usage rights, deadlines, and payment terms. No lawyer, no back-and-forth — just one click.</p>
            </div>
          </div>

        </div>
      </section>

      {/* MARKET OPPORTUNITY */}
      <section id="market" className="py-[90px] px-[5%] md:py-[120px] bg-[var(--black)]">
        <div className="flex items-center gap-3 mb-5 reveal">
          <div className="w-5 h-[2px] bg-amber"></div>
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-amber">Market Opportunity</span>
        </div>
        <h2 className="text-[clamp(32px,5vw,56px)] font-display font-extrabold leading-[1.1] tracking-[-1.5px] mb-4 reveal">
          <span className="text-[var(--text)]">A </span>
          <span className="text-amber">₹3,500 Cr</span>
          <span className="text-[var(--text)]"> industry</span><br />
          <span className="text-[var(--text)]">with no dominant self-serve player</span>
        </h2>

        <div className="mt-16 flex flex-col lg:flex-row gap-10 lg:gap-16">

          {/* Left Column: Metrics Cards */}
          <div className="flex-1 flex flex-col gap-4 reveal reveal-delay-1">
            <div className="bg-[#1a1405] border border-amber/10 rounded-2xl p-6 lg:p-8">
              <div className="text-[#888] uppercase text-[10px] tracking-[0.15em] mb-4 font-bold">Global Creator Economy (2026)</div>
              <div className="text-amber text-[36px] lg:text-[48px] font-extrabold font-display leading-[1] mb-2 tracking-[-1px]">$323 Billion</div>
              <div className="text-[#666] text-[12px]">Growing at 26.2% CAGR — projected to reach $820B by 2030</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[var(--card)] border border-border rounded-xl p-6">
                <div className="text-[#888] uppercase text-[10px] tracking-[0.15em] mb-4 font-bold">India Market (2026)</div>
                <div className="text-[var(--text)] text-[28px] lg:text-[32px] font-extrabold font-display leading-[1] mb-2 tracking-[-1px]">$15B</div>
                <div className="text-[#666] text-[12px]">Expected to reach $61.87B by 2033</div>
              </div>
              <div className="bg-[var(--card)] border border-border rounded-xl p-6">
                <div className="text-[#888] uppercase text-[10px] tracking-[0.15em] mb-4 font-bold">India Growth Rate</div>
                <div className="text-[var(--text)] text-[28px] lg:text-[32px] font-extrabold font-display leading-[1] mb-2 tracking-[-1px]">22.4%</div>
                <div className="text-[#666] text-[12px]">CAGR — one of the fastest in Asia</div>
              </div>
              <div className="bg-[var(--card)] border border-border rounded-xl p-6">
                <div className="text-[#888] uppercase text-[10px] tracking-[0.15em] mb-4 font-bold">Indian Creators</div>
                <div className="text-[var(--text)] text-[28px] lg:text-[32px] font-extrabold font-display leading-[1] mb-2 tracking-[-1px]">4-5M+</div>
                <div className="text-[#666] text-[12px]">Active creators across platforms</div>
              </div>
              <div className="bg-[var(--card)] border border-border rounded-xl p-6">
                <div className="text-[#888] uppercase text-[10px] tracking-[0.15em] mb-4 font-bold">Influencer Marketing India</div>
                <div className="text-[var(--text)] text-[28px] lg:text-[32px] font-extrabold font-display leading-[1] mb-2 tracking-[-1px]">₹3,500Cr</div>
                <div className="text-[#666] text-[12px]">2025 industry value, growing fast</div>
              </div>
            </div>
          </div>

          {/* Right Column: Text Content */}
          <div className="flex-1 flex flex-col gap-6 justify-center lg:pt-12 text-text-muted text-[13px] md:text-[14px] leading-[1.8] reveal reveal-delay-2">
            <p>India's creator economy is exploding — fuelled by 900M+ smartphone users, affordable data, and a massive shift in how D2C brands acquire customers. Brands are moving away from expensive celebrity endorsements and toward authentic, performance-driven UGC content.</p>
            <p>Yet every existing Indian platform — Kofluence, Qoruz, Good Creator Co. — serves enterprise brands through agency-style models. There is no self-serve, performance-first marketplace where a small D2C brand can find a quality creator in minutes.</p>

            <div className="bg-[#1a1405] border-l-[3px] border-amber rounded-r-lg p-5 mt-2">
              <p className="text-[#e0e0e0] text-[13px] italic mb-0">"Even capturing 0.1% of the Indian market puts Fewsion at ₹35 Cr GMV — a realistic Year 2 target."</p>
            </div>
          </div>

        </div>
      </section>

      {/* COMPETITORS */}
      <section id="competitors" className="py-[90px] px-[5%] md:py-[120px] bg-[var(--black)]">
        <div className="flex items-center gap-3 mb-5 reveal">
          <div className="w-5 h-[2px] bg-amber"></div>
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-amber">Competitive Landscape</span>
        </div>
        <h2 className="text-[clamp(32px,5vw,56px)] font-display font-extrabold leading-[1.1] tracking-[-1.5px] mb-12 text-left text-[var(--text)] reveal">
          We're not competing.<br />
          <span className="text-amber">We're filling a gap</span> they left open.
        </h2>

        <div className="flex gap-8 mb-8 border-b border-border overflow-x-auto whitespace-nowrap">
          <button className={`text-[13px] md:text-[14px] font-bold pb-3 cursor-pointer transition-colors duration-300 ${activeTab === 'global' ? 'text-amber border-b-2 border-amber' : 'text-text-muted hover:text-foreground border-b-2 border-transparent'}`} onClick={() => setActiveTab('global')}>Global Platforms</button>
          <button className={`text-[13px] md:text-[14px] font-bold pb-3 cursor-pointer transition-colors duration-300 ${activeTab === 'india' ? 'text-amber border-b-2 border-amber' : 'text-text-muted hover:text-foreground border-b-2 border-transparent'}`} onClick={() => setActiveTab('india')}>Indian Players</button>
          <button className={`text-[13px] md:text-[14px] font-bold pb-3 cursor-pointer transition-colors duration-300 ${activeTab === 'gap' ? 'text-amber border-b-2 border-amber' : 'text-text-muted hover:text-foreground border-b-2 border-transparent'}`} onClick={() => setActiveTab('gap')}>The Gap We Fill</button>
        </div>

        {activeTab === 'global' && (
          <div className="block animate-[fadeIn_0.4s_ease]" id="tab-global">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px] border-collapse whitespace-nowrap min-w-[700px]">
                <thead>
                  <tr>
                    <th className="py-[20px] pr-[24px] pl-0 font-bold text-text-muted uppercase text-[10px] tracking-[0.1em] border-b border-border w-[15%]">Platform</th>
                    <th className="p-[20px_24px] font-bold text-text-muted uppercase text-[10px] tracking-[0.1em] border-b border-border w-[14%]">Creators</th>
                    <th className="p-[20px_24px] font-bold text-text-muted uppercase text-[10px] tracking-[0.1em] border-b border-border w-[14%]">Brands</th>
                    <th className="p-[20px_24px] font-bold text-text-muted uppercase text-[10px] tracking-[0.1em] border-b border-border w-[14%]">Editors</th>
                    <th className="p-[20px_24px] font-bold text-text-muted uppercase text-[10px] tracking-[0.1em] border-b border-border w-[14%]">AI Matching</th>
                    <th className="p-[20px_24px] font-bold text-text-muted uppercase text-[10px] tracking-[0.1em] border-b border-border w-[14%]">India Focus</th>
                    <th className="p-[20px_24px] font-bold text-text-muted uppercase text-[10px] tracking-[0.1em] border-b border-border w-[15%]">Escrow</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-[20px] pr-[24px] pl-0 border-b border-border text-foreground font-medium">Collabstr</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground font-bold">✓</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground font-bold">✓</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗</td>
                  </tr>
                  <tr>
                    <td className="py-[20px] pr-[24px] pl-0 border-b border-border text-foreground font-medium">Billo</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground font-bold">✓</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground font-bold">✓</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗</td>
                  </tr>
                  <tr>
                    <td className="py-[20px] pr-[24px] pl-0 border-b border-border text-foreground font-medium">Fiverr</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground font-bold">✓</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground font-bold">✓</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground font-bold">✓</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground font-bold">✓</td>
                  </tr>
                  <tr>
                    <td className="py-[20px] pr-[24px] pl-0 border-b border-border text-foreground font-medium">Contra</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground font-bold">✓</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground font-bold">✓</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗</td>
                  </tr>
                  <tr className="bg-card2">
                    <td className="py-[20px] pr-[24px] pl-4 border-b-0 text-amber font-bold rounded-l-lg">Fewsion</td>
                    <td className="p-[20px_24px] border-b-0 text-foreground font-bold">✓</td>
                    <td className="p-[20px_24px] border-b-0 text-foreground font-bold">✓</td>
                    <td className="p-[20px_24px] border-b-0 text-foreground font-bold">✓</td>
                    <td className="p-[20px_24px] border-b-0 text-foreground font-bold">✓</td>
                    <td className="p-[20px_24px] border-b-0 text-foreground font-bold">✓</td>
                    <td className="p-[20px_24px] border-b-0 text-foreground font-bold rounded-r-lg">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'india' && (
          <div className="block animate-[fadeIn_0.4s_ease]" id="tab-india">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px] border-collapse whitespace-nowrap min-w-[700px]">
                <thead>
                  <tr>
                    <th className="py-[20px] pr-[24px] pl-0 font-bold text-text-muted uppercase text-[10px] tracking-[0.1em] border-b border-border w-[20%]">Company</th>
                    <th className="p-[20px_24px] font-bold text-text-muted uppercase text-[10px] tracking-[0.1em] border-b border-border w-[16%]">Funding</th>
                    <th className="p-[20px_24px] font-bold text-text-muted uppercase text-[10px] tracking-[0.1em] border-b border-border w-[16%]">Revenue FY25</th>
                    <th className="p-[20px_24px] font-bold text-text-muted uppercase text-[10px] tracking-[0.1em] border-b border-border w-[16%]">Valuation</th>
                    <th className="p-[20px_24px] font-bold text-text-muted uppercase text-[10px] tracking-[0.1em] border-b border-border w-[16%]">Self-Serve</th>
                    <th className="p-[20px_24px] font-bold text-text-muted uppercase text-[10px] tracking-[0.1em] border-b border-border w-[16%]">Editor Mkt.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-[20px] pr-[24px] pl-0 border-b border-border text-foreground font-medium">Good Creator Co.</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground/80">$306M (group)</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground/80">~₹252 Cr</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground/80">$1.2B unicorn</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗ Agency</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗</td>
                  </tr>
                  <tr>
                    <td className="py-[20px] pr-[24px] pl-0 border-b border-border text-foreground font-medium">Kofluence</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground/80">₹29.91 Cr</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground/80">₹52.5 Cr</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground/80">Undisclosed</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗ Agency</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗</td>
                  </tr>
                  <tr>
                    <td className="py-[20px] pr-[24px] pl-0 border-b border-border text-foreground font-medium">Qoruz</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground/80">$1.03M</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground/80">₹56.4 Cr</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground/80">~$21–38M</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗ Analytics</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗</td>
                  </tr>
                  <tr>
                    <td className="py-[20px] pr-[24px] pl-0 border-b border-border text-foreground font-medium">Chtrbox</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground/80">~$158K</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground/80">Undisclosed</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground/80">Acquired</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗ Agency</td>
                    <td className="p-[20px_24px] border-b border-border text-text-muted">✗</td>
                  </tr>
                  <tr className="bg-card2">
                    <td className="py-[20px] pr-[24px] pl-4 border-b-0 text-amber font-bold rounded-l-lg">Fewsion</td>
                    <td className="p-[20px_24px] border-b-0 text-foreground font-bold">Raising seed</td>
                    <td className="p-[20px_24px] border-b-0 text-foreground font-bold">Launching 2026</td>
                    <td className="p-[20px_24px] border-b-0 text-foreground font-bold">—</td>
                    <td className="p-[20px_24px] border-b-0 text-foreground font-bold">✓ Self-serve</td>
                    <td className="p-[20px_24px] border-b-0 text-foreground font-bold rounded-r-lg">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'gap' && (
          <div className="block animate-[fadeIn_0.4s_ease]" id="tab-gap">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px] border-collapse min-w-[700px]">
                <thead>
                  <tr>
                    <th className="py-[20px] pr-[24px] pl-0 font-bold text-text-muted uppercase text-[10px] tracking-[0.1em] border-b border-border w-[30%]">Gap in Indian Market</th>
                    <th className="p-[20px_24px] font-bold text-text-muted uppercase text-[10px] tracking-[0.1em] border-b border-border w-[70%]">What Fewsion Does Instead</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-[20px] pr-[24px] pl-0 border-b border-border text-foreground/80 font-medium">All enterprise / agency tools only</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground/80">Self-serve — any brand posts a campaign in minutes, no sales call</td>
                  </tr>
                  <tr>
                    <td className="py-[20px] pr-[24px] pl-0 border-b border-border text-foreground/80 font-medium">Hire by follower count</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground/80">Hire by Creator Score and proven CTR — data beats vanity metrics</td>
                  </tr>
                  <tr>
                    <td className="py-[20px] pr-[24px] pl-0 border-b border-border text-foreground/80 font-medium">No editor marketplace</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground/80">First Indian platform where editors get a dedicated portfolio and job listings</td>
                  </tr>
                  <tr>
                    <td className="py-[20px] pr-[24px] pl-0 border-b border-border text-foreground/80 font-medium">No escrow payments</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground/80">Razorpay escrow on every deal — money released only after content approved</td>
                  </tr>
                  <tr>
                    <td className="py-[20px] pr-[24px] pl-0 border-b border-border text-foreground/80 font-medium">No AI brief builder</td>
                    <td className="p-[20px_24px] border-b border-border text-foreground/80">AI generates structured campaign briefs in seconds</td>
                  </tr>
                  <tr className="bg-card2">
                    <td className="py-[20px] pr-[24px] pl-4 border-b-0 text-amber font-bold rounded-l-lg">No Creator–Editor collaboration</td>
                    <td className="p-[20px_24px] border-b-0 text-foreground font-bold rounded-r-lg">Creators invite editors directly inside a project on the same platform</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* REVENUE */}
      <section id="revenue" className="py-[90px] px-[5%] md:py-[120px] bg-[var(--black)]">
        <div className="flex items-center gap-3 mb-5 reveal">
          <div className="w-5 h-[2px] bg-amber"></div>
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-amber">Business Model</span>
        </div>
        <h2 className="text-[clamp(32px,5vw,56px)] font-display font-extrabold leading-[1.1] tracking-[-1.5px] mb-12 text-left text-[var(--text)] reveal">
          Multiple revenue streams<br />
          <span className="text-amber">built to scale</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[var(--card)] border border-border border-b-[2px] border-b-amber p-8 rounded-2xl reveal">
            <div className="text-[clamp(24px,3vw,28px)] font-extrabold font-display text-amber mb-3 tracking-[-1px]">10-15%</div>
            <h3 className="text-[16px] md:text-[18px] text-[var(--text)] font-bold mb-3">Transaction Commission</h3>
            <p className="text-[13px] md:text-[14px] text-[#888] leading-[1.6]">A percentage cut on every paid project completed through the platform. Primary revenue driver at scale.</p>
          </div>
          <div className="bg-[var(--card)] border border-[rgba(255,255,255,0.05)] border-b-[2px] border-b-amber p-8 rounded-2xl reveal reveal-delay-1">
            <div className="text-[clamp(24px,3vw,28px)] font-extrabold font-display text-amber mb-3 tracking-[-1px]">₹499/mo</div>
            <h3 className="text-[16px] md:text-[18px] text-[var(--text)] font-bold mb-3">Creator Pro Subscription</h3>
            <p className="text-[13px] md:text-[14px] text-[#888] leading-[1.6]">Advanced analytics, priority search ranking, featured profile placement, and AI-powered career insights.</p>
          </div>
          <div className="bg-[var(--card)] border border-[rgba(255,255,255,0.05)] border-b-[2px] border-b-amber p-8 rounded-2xl reveal reveal-delay-2">
            <div className="text-[clamp(24px,3vw,28px)] font-extrabold font-display text-amber mb-3 tracking-[-1px]">₹2,999/mo</div>
            <h3 className="text-[16px] md:text-[18px] text-[var(--text)] font-bold mb-3">Brand Premium Plan</h3>
            <p className="text-[13px] md:text-[14px] text-[#888] leading-[1.6]">Unlimited campaign briefs, AI chatbot access, bulk creator outreach, and priority matching.</p>
          </div>
          <div className="bg-[var(--card)] border border-border border-b-[2px] border-b-amber p-8 rounded-2xl reveal">
            <div className="text-[clamp(24px,3vw,28px)] font-extrabold font-display text-amber mb-3 tracking-[-1px]">₹999</div>
            <h3 className="text-[16px] md:text-[18px] text-[var(--text)] font-bold mb-3">Featured Brand Listings</h3>
            <p className="text-[13px] md:text-[14px] text-[#888] leading-[1.6]">Brands pay to be highlighted to relevant creators, driving faster applications and better talent.</p>
          </div>
          <div className="bg-[var(--card)] border border-[rgba(255,255,255,0.05)] border-b-[2px] border-b-amber p-8 rounded-2xl reveal reveal-delay-1">
            <div className="text-[clamp(24px,3vw,28px)] font-extrabold font-display text-amber mb-3 tracking-[-1px]">₹99</div>
            <h3 className="text-[16px] md:text-[18px] text-[var(--text)] font-bold mb-3">AI Contract Generator</h3>
            <p className="text-[13px] md:text-[14px] text-[#888] leading-[1.6]">Per-contract fee for auto-generated usage rights, deadline, and payment agreements — no lawyer needed.</p>
          </div>
          <div className="bg-[var(--card)] border border-[rgba(255,255,255,0.05)] border-b-[2px] border-b-amber p-8 rounded-2xl reveal reveal-delay-2">
            <div className="text-[clamp(24px,3vw,28px)] font-extrabold font-display text-amber mb-3 tracking-[-1px]">Custom</div>
            <h3 className="text-[16px] md:text-[18px] text-[var(--text)] font-bold mb-3">Enterprise Packages</h3>
            <p className="text-[13px] md:text-[14px] text-[#888] leading-[1.6]">White-glove matching, dedicated account management, and bulk campaign tooling for large brands.</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[var(--card)] border border-border p-6 rounded-2xl text-center reveal">
            <div className="text-[11px] uppercase tracking-[0.1em] font-bold text-[#666] mb-4">Month 1–3</div>
            <div className="text-[clamp(24px,3vw,28px)] font-extrabold font-display text-[var(--text)] mb-1 tracking-[-1px]">500</div>
            <div className="text-[12px] text-[#666]">Creators onboarded</div>
          </div>
          <div className="bg-[var(--card)] border border-[rgba(255,255,255,0.05)] p-6 rounded-2xl text-center reveal reveal-delay-1">
            <div className="text-[11px] uppercase tracking-[0.1em] font-bold text-[#666] mb-4">Month 6</div>
            <div className="text-[clamp(24px,3vw,28px)] font-extrabold font-display text-[var(--text)] mb-1 tracking-[-1px]">₹15–20L</div>
            <div className="text-[12px] text-[#666]">Monthly GMV target</div>
          </div>
          <div className="bg-[var(--card)] border border-[rgba(255,255,255,0.05)] p-6 rounded-2xl text-center reveal reveal-delay-2">
            <div className="text-[11px] uppercase tracking-[0.1em] font-bold text-[#666] mb-4">Month 6</div>
            <div className="text-[clamp(24px,3vw,28px)] font-extrabold font-display text-amber mb-1 tracking-[-1px]">₹2–3L</div>
            <div className="text-[12px] text-[#666]">Monthly revenue</div>
          </div>
          <div className="bg-[var(--card)] border border-[rgba(255,255,255,0.05)] p-6 rounded-2xl text-center reveal reveal-delay-3">
            <div className="text-[11px] uppercase tracking-[0.1em] font-bold text-[#666] mb-4">Year 2</div>
            <div className="text-[clamp(24px,3vw,28px)] font-extrabold font-display text-amber mb-1 tracking-[-1px]">₹35Cr+</div>
            <div className="text-[12px] text-[#666]">GMV milestone</div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="py-[90px] px-[5%] md:py-[120px] bg-[var(--black)]">
        <div className="flex items-center gap-3 mb-5 reveal">
          <div className="w-5 h-[2px] bg-amber"></div>
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-amber">Roadmap</span>
        </div>
        <h2 className="text-[clamp(32px,5vw,56px)] font-display font-extrabold leading-[1.1] tracking-[-1.5px] mb-12 text-left text-[var(--text)] reveal">
          From MVP to<br />
          <span className="text-amber">market leader</span>
        </h2>

        <div className="relative ml-3 md:ml-6 pl-8 md:pl-10 py-4 flex flex-col gap-14 mt-16">
          {/* Timeline Line */}
          <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-amber via-amber to-[rgba(255,255,255,0.1)] via-[30%]"></div>

          {/* Q3 2026 */}
          <div className="relative reveal">
            <div className="absolute -left-[39px] md:-left-[47px] top-1 w-4 h-4 rounded-full border-2 border-amber bg-[var(--black)] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-amber rounded-full"></div>
            </div>
            <div className="text-amber text-[11px] uppercase tracking-[0.1em] font-bold mb-3">Q3 2026 — LAUNCH</div>
            <h3 className="text-[20px] md:text-[22px] font-bold text-[var(--text)] mb-5">MVP — Core Platform</h3>
            <div className="flex flex-wrap gap-3">
              <span className="bg-[rgba(245,166,35,0.05)] border border-[rgba(245,166,35,0.2)] text-amber py-2 px-4 rounded-full text-[13px]">Creator profiles</span>
              <span className="bg-[rgba(245,166,35,0.05)] border border-[rgba(245,166,35,0.2)] text-amber py-2 px-4 rounded-full text-[13px]">Brand job listings</span>
              <span className="bg-[rgba(245,166,35,0.05)] border border-[rgba(245,166,35,0.2)] text-amber py-2 px-4 rounded-full text-[13px]">Basic AI matching</span>
              <span className="bg-[rgba(245,166,35,0.05)] border border-[rgba(245,166,35,0.2)] text-amber py-2 px-4 rounded-full text-[13px]">Niche categories</span>
            </div>
          </div>

          {/* Q4 2026 */}
          <div className="relative reveal">
            <div className="absolute -left-[39px] md:-left-[47px] top-1 w-4 h-4 rounded-full border-2 border-amber bg-[var(--black)] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-amber rounded-full"></div>
            </div>
            <div className="text-amber text-[11px] uppercase tracking-[0.1em] font-bold mb-3">Q4 2026 — TRUST LAYER</div>
            <h3 className="text-[20px] md:text-[22px] font-bold text-[var(--text)] mb-5">Payments + Creator Score</h3>
            <div className="flex flex-wrap gap-3">
              <span className="bg-[rgba(245,166,35,0.05)] border border-[rgba(245,166,35,0.2)] text-amber py-2 px-4 rounded-full text-[13px]">Razorpay escrow</span>
              <span className="bg-[rgba(245,166,35,0.05)] border border-[rgba(245,166,35,0.2)] text-amber py-2 px-4 rounded-full text-[13px]">Creator Score system</span>
              <span className="bg-[rgba(245,166,35,0.05)] border border-[rgba(245,166,35,0.2)] text-amber py-2 px-4 rounded-full text-[13px]">Editor marketplace</span>
              <span className="bg-[rgba(245,166,35,0.05)] border border-[rgba(245,166,35,0.2)] text-amber py-2 px-4 rounded-full text-[13px]">Brand reviews</span>
            </div>
          </div>

          {/* Q1 2027 */}
          <div className="relative reveal">
            <div className="absolute -left-[39px] md:-left-[47px] top-1 w-4 h-4 rounded-full border-2 border-[#555] bg-[var(--black)]"></div>
            <div className="text-[#888] text-[11px] uppercase tracking-[0.1em] font-bold mb-3">Q1 2027 — AI LAYER</div>
            <h3 className="text-[20px] md:text-[22px] font-bold text-[var(--text)] mb-5">Intelligence Features</h3>
            <div className="flex flex-wrap gap-3">
              <span className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-[#888] py-2 px-4 rounded-full text-[13px]">AI brief builder</span>
              <span className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-[#888] py-2 px-4 rounded-full text-[13px]">AI contract generator</span>
              <span className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-[#888] py-2 px-4 rounded-full text-[13px]">Performance tracker</span>
              <span className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-[#888] py-2 px-4 rounded-full text-[13px]">Creator–Editor collab</span>
            </div>
          </div>

          {/* Q2 2027 */}
          <div className="relative reveal">
            <div className="absolute -left-[39px] md:-left-[47px] top-1 w-4 h-4 rounded-full border-2 border-[#555] bg-[var(--black)]"></div>
            <div className="text-[#888] text-[11px] uppercase tracking-[0.1em] font-bold mb-3">Q2 2027 — SCALE</div>
            <h3 className="text-[20px] md:text-[22px] font-bold text-[var(--text)] mb-5">Mobile + Growth</h3>
            <div className="flex flex-wrap gap-3">
              <span className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-[#888] py-2 px-4 rounded-full text-[13px]">iOS + Android app</span>
              <span className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-[#888] py-2 px-4 rounded-full text-[13px]">Referral program</span>
              <span className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-[#888] py-2 px-4 rounded-full text-[13px]">SEA market entry</span>
              <span className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-[#888] py-2 px-4 rounded-full text-[13px]">Brand storefront V2</span>
            </div>
          </div>

          {/* Q3 2027 */}
          <div className="relative reveal">
            <div className="absolute -left-[39px] md:-left-[47px] top-1 w-4 h-4 rounded-full border-2 border-[#555] bg-[var(--black)]"></div>
            <div className="text-[#888] text-[11px] uppercase tracking-[0.1em] font-bold mb-3">Q3 2027 — FUNDING</div>
            <h3 className="text-[20px] md:text-[22px] font-bold text-[var(--text)] mb-5">Seed Round + 10K Users</h3>
            <div className="flex flex-wrap gap-3">
              <span className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-[#888] py-2 px-4 rounded-full text-[13px]">₹3–5 Cr seed raise</span>
              <span className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-[#888] py-2 px-4 rounded-full text-[13px]">10,000 active users</span>
              <span className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-[#888] py-2 px-4 rounded-full text-[13px]">Enterprise tier launch</span>
              <span className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-[#888] py-2 px-4 rounded-full text-[13px]">Social API integrations</span>
            </div>
          </div>

        </div>
      </section>

      {/* VISION */}
      <section id="vision" className="py-[120px] px-[5%] text-center bg-[var(--black)]">
        <div className="max-w-[900px] mx-auto flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 mb-8 reveal">
            <div className="w-5 h-[2px] bg-amber"></div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-amber">Our Vision</span>
          </div>

          <h2 className="text-[clamp(22px,3.5vw,40px)] font-display font-bold leading-[1.25] tracking-[-1px] mb-8 text-[var(--text)] reveal max-w-[800px]">
            "The only platform where creators are hired based on <span className="text-amber">proven performance,</span> not follower count."
          </h2>

          <p className="text-[14px] md:text-[16px] text-[#888] leading-[1.8] mb-12 max-w-[650px] reveal reveal-delay-1">
            Fewsion aims to become the default infrastructure for the creator economy in India and Southeast Asia — the place where every brand finds its best creator, every creator builds their legacy, and every editor finally gets the recognition they deserve.
          </p>

          <a href="#cta" className="inline-flex items-center justify-center bg-gradient-to-r from-amber to-[#FF6B35] text-black font-bold text-[14px] rounded-full px-8 py-3.5 transition-transform hover:scale-105 hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] reveal reveal-delay-2">
            Be part of the story →
          </a>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-[100px] px-[5%] text-center bg-gradient-to-br from-[rgba(245,166,35,0.1)] via-[rgba(255,107,53,0.08)] to-transparent border-y border-border">
        <div className="inline-flex items-center justify-center gap-2 mb-4 reveal">
          <div className="w-5 h-[1.5px] bg-amber"></div>
          <span className="text-[12px] uppercase tracking-[0.12em] font-semibold text-amber">Join Fewsion</span>
        </div>

        <h2 className="text-[clamp(32px,4.5vw,56px)] font-display font-extrabold tracking-[-1.5px] leading-[1.1] text-[var(--text)] text-center mb-3 reveal">
          Ready to grow with<br />
          <em className="text-amber not-italic">India's creator economy?</em>
        </h2>

        <p className="text-[17px] text-[#888] font-light leading-[1.7] max-w-[460px] mx-auto mb-10 reveal reveal-delay-1">
          Whether you're a brand, creator, or editor — Fewsion is building for you. Join the waitlist and be among the first to experience it.
        </p>

        <div className="flex flex-wrap justify-center gap-3.5 reveal reveal-delay-2">
          <Link href="/creators" className="btn-primary !px-5 !py-2.5 text-[14px]">
            I&apos;m a Creator &rarr;
          </Link>
          <Link href="/brands" className="btn-primary !bg-[var(--amber2)] !px-5 !py-2.5 text-[14px]">
            I&apos;m a Brand &rarr;
          </Link>
          <Link href="/editors" className="btn-ghost !px-5 !py-2.5 text-[14px]">
            I&apos;m an Editor
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      {/* 🤖 AI CHATBOT FLOATING WIDGET */}
      <AIChatbotWidget />
    </main>
  );
}

