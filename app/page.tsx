'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AIChatbotWidget from '@/components/AIChatbotWidget';
import StatusChip from '@/components/StatusChip';

export default function HomePage() {
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
              Tell us what you sell and what you can spend. Fewsion&apos;s AI shortlists the UGC creators and video editors who fit, and explains why.
            </p>

            <div className="hero-reveal-3 mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Link href="/signup" className="hero-btn-primary group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Sign up free
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
                </span>
              </Link>
              <a href="#how-it-works" className="btn-ghost flex items-center gap-2">
                <svg className="w-4 h-4 fill-current text-[var(--amber)]" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                See how it works
              </a>
            </div>
            <p className="hero-reveal-3 mt-4 text-sm text-[var(--muted)]">Free to start · No credit card needed · Takes about 5 minutes</p>
          </div>

          {/* Orbital Graphic & Floating Mockups */}
          <div className="hero-reveal-4 relative mx-auto aspect-square w-full max-w-[480px] overflow-visible select-none">
            {/* Ambient glows behind the orbit */}
            <div className="absolute inset-0 rounded-full bg-[var(--amber)]/5 blur-[60px] pointer-events-none"></div>

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
                <span className="text-[10px] uppercase tracking-widest text-[var(--muted)]">AI Core</span>
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
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-[80px] px-[5%] md:py-[100px] bg-[var(--black)]">
        <div className="flex items-center gap-3 mb-5 reveal">
          <div className="w-5 h-[2px] bg-amber"></div>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-amber">How it works</span>
        </div>
        <h2 className="text-[clamp(28px,4.5vw,48px)] font-display font-extrabold leading-[1.1] tracking-[-1.2px] mb-10 text-[var(--text)] reveal">
          From brief to creator<br />
          <span className="text-amber">in three steps</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { n: '1', t: 'Tell us what you need', d: 'Pick your niche, your goal (sales, awareness, repeat buyers or a launch) and a budget per creator. It takes about a minute.' },
            { n: '2', t: 'Get a shortlist, with reasons', d: 'AI ranks creators on niche fit, rate, engagement and reach, and tells you in plain words why each one was picked.' },
            { n: '3', t: 'Send an offer and work together', d: 'Open a profile, send an offer for your campaign, and keep the whole conversation in one place instead of scattered DMs.' },
          ].map((s, i) => (
            <div key={s.n} className={`bg-[var(--card)] border border-border rounded-2xl p-7 reveal ${i ? 'reveal-delay-' + i : ''}`}>
              <div className="w-10 h-10 rounded-full bg-amber-glow border border-amber/30 flex items-center justify-center text-base font-extrabold text-amber mb-4">{s.n}</div>
              <h3 className="text-lg font-display font-bold mb-2 text-[var(--text)]">{s.t}</h3>
              <p className="text-sm md:text-[15px] text-text-muted leading-[1.7]">{s.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-text-muted reveal">
          Payments held in escrow until you approve the work are <strong className="text-[var(--text)]">coming Q4 2026</strong>. Until then,
          agree payment terms inside the offer. <Link href="/pricing" className="font-semibold text-[var(--text)] underline">See pricing</Link>.
        </p>
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
            One home for brands, creators and editors. Every feature below is labelled Live, Beta or Coming soon, so you know exactly what you can use today.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[var(--card)] border border-border rounded-2xl p-8 lg:p-[40px_32px] transition-colors duration-300 hover:border-border2 reveal">
            <div className="w-10 h-10 bg-amber-glow border border-amber/20 rounded-lg flex items-center justify-center text-[18px] mb-6">🎬</div>
            <h3 className="text-[18px] font-display font-bold mb-5 tracking-[-0.3px] text-[var(--text)]">Creator Portal</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-3.5">
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Performance-backed portfolio & niche tagging<StatusChip feature="creatorScore" /></li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Real CTR and engagement stats on every piece<StatusChip feature="performanceTracker" /></li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Invite editors directly into your projects<StatusChip feature="creatorEditorCollab" /></li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Browse & apply to brand campaigns</li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Escrow-protected payments<StatusChip feature="escrow" /></li>
            </ul>
          </div>

          <div className="bg-[var(--card)] border border-border rounded-2xl p-8 lg:p-[40px_32px] transition-colors duration-300 hover:border-border2 reveal reveal-delay-1">
            <div className="w-10 h-10 bg-amber-glow border border-amber/20 rounded-lg flex items-center justify-center text-[18px] mb-6">🏢</div>
            <h3 className="text-[18px] font-display font-bold mb-5 tracking-[-0.3px] text-[var(--text)]">Brand Portal</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-3.5">
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> AI-powered brief builder in seconds<StatusChip feature="briefBuilder" /></li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Discover creators by proven performance, not followers</li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Post UGC, ad video, and content campaigns</li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> AI matchmaker to find the right creator<StatusChip feature="aiMatching" /></li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Public brand storefront with creator reviews<StatusChip feature="brandReviews" /></li>
            </ul>
          </div>

          <div className="bg-[var(--card)] border border-border rounded-2xl p-8 lg:p-[40px_32px] transition-colors duration-300 hover:border-border2 reveal reveal-delay-2">
            <div className="w-10 h-10 bg-amber-glow border border-amber/20 rounded-lg flex items-center justify-center text-[18px] mb-6">🎞️</div>
            <h3 className="text-[18px] font-display font-bold mb-5 tracking-[-0.3px] text-[var(--text)]">Editor Portal</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-3.5">
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> A marketplace built for video editors<StatusChip feature="editorMarketplace" /></li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Showcase reels, ad edits, short-form work</li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Get hired by brands directly — not just creators</li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Receive collab invites from creators on projects<StatusChip feature="creatorEditorCollab" /></li>
              <li className="flex items-start gap-3 text-text-muted text-[13px] leading-[1.6]"><span className="text-amber mt-[2px] text-[12px]">➔</span> Performance rating builds long-term reputation<StatusChip feature="creatorScore" /></li>
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
          <span className="text-[var(--text)]">What Fewsion does</span><br />
          <span className="text-amber">differently</span>
        </h2>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 bg-[var(--deep)] border border-border rounded-2xl overflow-hidden reveal reveal-delay-1">

          {/* Item 01 */}
          <div className="flex gap-5 p-8 border-b border-border lg:border-r transition-colors duration-300 hover:bg-[var(--card2)]">
            <div className="text-amber text-[14px] font-bold font-display mt-1">01</div>
            <div>
              <h4 className="text-[16px] md:text-[18px] font-bold text-[var(--text)] mb-2 tracking-[-0.3px]">Performance-Based Creator Score<StatusChip feature="creatorScore" /></h4>
              <p className="text-text-muted text-[13px] leading-[1.6]">A public trust score built on on-time delivery, brand satisfaction, content CTR, and repeat hire rate — not follower count.</p>
            </div>
          </div>

          {/* Item 02 */}
          <div className="flex gap-5 p-8 border-b border-border transition-colors duration-300 hover:bg-[var(--card2)]">
            <div className="text-amber text-[14px] font-bold font-display mt-1">02</div>
            <div>
              <h4 className="text-[16px] md:text-[18px] font-bold text-[var(--text)] mb-2 tracking-[-0.3px]">AI Campaign Brief Builder<StatusChip feature="briefBuilder" /></h4>
              <p className="text-text-muted text-[13px] leading-[1.6]">Brands auto-generate structured, professional campaign briefs in seconds. Aims to cut the back-and-forth between brands and creators.</p>
            </div>
          </div>

          {/* Item 03 */}
          <div className="flex gap-5 p-8 border-b border-border lg:border-r transition-colors duration-300 hover:bg-[var(--card2)]">
            <div className="text-amber text-[14px] font-bold font-display mt-1">03</div>
            <div>
              <h4 className="text-[16px] md:text-[18px] font-bold text-[var(--text)] mb-2 tracking-[-0.3px]">Content Performance Tracker<StatusChip feature="performanceTracker" /></h4>
              <p className="text-text-muted text-[13px] leading-[1.6]">Track real ad performance after delivery — views, clicks, CTR, conversions. So creators build data-backed portfolios and brands can see what they got for their money.</p>
            </div>
          </div>

          {/* Item 04 */}
          <div className="flex gap-5 p-8 border-b border-border transition-colors duration-300 hover:bg-[var(--card2)]">
            <div className="text-amber text-[14px] font-bold font-display mt-1">04</div>
            <div>
              <h4 className="text-[16px] md:text-[18px] font-bold text-[var(--text)] mb-2 tracking-[-0.3px]">Escrow Payment Protection<StatusChip feature="escrow" /></h4>
              <p className="text-text-muted text-[13px] leading-[1.6]">The brand funds the work upfront through Razorpay, and the creator is paid after the brand approves it. Review windows, revisions and refunds will be published before launch.</p>
            </div>
          </div>

          {/* Item 05 */}
          <div className="flex gap-5 p-8 border-b border-border lg:border-r transition-colors duration-300 hover:bg-[var(--card2)]">
            <div className="text-amber text-[14px] font-bold font-display mt-1">05</div>
            <div>
              <h4 className="text-[16px] md:text-[18px] font-bold text-[var(--text)] mb-2 tracking-[-0.3px]">Creator ↔ Editor In-Platform Collab<StatusChip feature="creatorEditorCollab" /></h4>
              <p className="text-text-muted text-[13px] leading-[1.6]">Creators invite editors directly inside any live project. No more WhatsApp back-and-forth. Everything stays on Fewsion.</p>
            </div>
          </div>

          {/* Item 06 */}
          <div className="flex gap-5 p-8 border-b border-border transition-colors duration-300 hover:bg-[var(--card2)]">
            <div className="text-amber text-[14px] font-bold font-display mt-1">06</div>
            <div>
              <h4 className="text-[16px] md:text-[18px] font-bold text-[var(--text)] mb-2 tracking-[-0.3px]">Brand Storefront with Creator Reviews<StatusChip feature="brandReviews" /></h4>
              <p className="text-text-muted text-[13px] leading-[1.6]">Each company gets a public page with past campaigns and creator reviews. Creators apply to brands they actually want to work with.</p>
            </div>
          </div>

          {/* Item 07 */}
          <div className="flex gap-5 p-8 lg:border-r border-border transition-colors duration-300 hover:bg-[var(--card2)]">
            <div className="text-amber text-[14px] font-bold font-display mt-1">07</div>
            <div>
              <h4 className="text-[16px] md:text-[18px] font-bold text-[var(--text)] mb-2 tracking-[-0.3px]">AI Matching Chatbot<StatusChip feature="aiMatching" /></h4>
              <p className="text-text-muted text-[13px] leading-[1.6]">Brands type what they need — niche, budget, platform, language — and AI returns the best matched, verified creators instantly.</p>
            </div>
          </div>

          {/* Item 08 */}
          <div className="flex gap-5 p-8 transition-colors duration-300 hover:bg-[var(--card2)]">
            <div className="text-amber text-[14px] font-bold font-display mt-1">08</div>
            <div>
              <h4 className="text-[16px] md:text-[18px] font-bold text-[var(--text)] mb-2 tracking-[-0.3px]">One-Click AI Contract Generator<StatusChip feature="contractGenerator" /></h4>
              <p className="text-text-muted text-[13px] leading-[1.6]">Auto-generated contracts covering usage rights, deadlines, and payment terms. Fewer messages back and forth before work starts.</p>
            </div>
          </div>

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

        <p className="text-[17px] text-[var(--muted)] font-light leading-[1.7] max-w-[460px] mx-auto mb-10 reveal reveal-delay-1">
          Whether you are a brand, a creator or an editor, you can create a free account and try the AI matchmaker today.
        </p>

        <div className="flex flex-wrap justify-center gap-3.5 reveal reveal-delay-2">
          <Link href="/signup?role=creator" className="btn-primary !px-5 !py-2.5 text-[14px]">
            I&apos;m a Creator &rarr;
          </Link>
          <Link href="/signup?role=brand" className="btn-primary !bg-[var(--amber2)] !px-5 !py-2.5 text-[14px]">
            I&apos;m a Brand &rarr;
          </Link>
          <Link href="/signup?role=editor" className="btn-ghost !px-5 !py-2.5 text-[14px]">
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

