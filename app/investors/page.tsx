'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Market size, competitor comparison, business model and roadmap.
// This used to sit on the landing page, where brands, creators and editors
// read it as "this is pitched at investors, not at me". It lives here now.

export default function InvestorsPage() {
  const [activeTab, setActiveTab] = useState<'global' | 'india' | 'gap'>('global');

  useEffect(() => {
    const handleScroll = () => {
      document.querySelectorAll('.reveal:not(.visible), .roadmap-item:not(.visible)').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) el.classList.add('visible');
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    const timeout = setTimeout(handleScroll, 150);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <main>
      <section className="pt-32 pb-4 px-[5%] bg-[var(--black)]">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-5 h-[2px] bg-amber"></div>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-amber">For investors and partners</span>
        </div>
        <h1 className="text-[clamp(28px,4vw,44px)] font-display font-extrabold leading-[1.15] tracking-[-1px] text-[var(--text)] mb-4">
          Fewsion: market, model and roadmap
        </h1>
        <p className="text-base text-[var(--muted)] max-w-[620px] leading-[1.7] mb-6">
          Market figures are estimates from public industry reports. Dates in the roadmap are plans, not promises.
          Looking for the product instead? <Link href="/" className="font-semibold text-[var(--text)] underline">Go to the homepage</Link> or{' '}
          <Link href="/signup" className="font-semibold text-[var(--text)] underline">sign up free</Link>.
        </p>
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
            <div className="bg-[var(--amber-glow)] border border-amber/10 rounded-2xl p-6 lg:p-8">
              <div className="text-[var(--muted)] uppercase text-[10px] tracking-[0.15em] mb-4 font-bold">Global Creator Economy (2026)</div>
              <div className="text-amber text-[36px] lg:text-[48px] font-extrabold font-display leading-[1] mb-2 tracking-[-1px]">$323 Billion</div>
              <div className="text-[var(--muted2)] text-[12px]">Growing at 26.2% CAGR — projected to reach $820B by 2030</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[var(--card)] border border-border rounded-xl p-6">
                <div className="text-[var(--muted)] uppercase text-[10px] tracking-[0.15em] mb-4 font-bold">India Market (2026)</div>
                <div className="text-[var(--text)] text-[28px] lg:text-[32px] font-extrabold font-display leading-[1] mb-2 tracking-[-1px]">$15B</div>
                <div className="text-[var(--muted2)] text-[12px]">Expected to reach $61.87B by 2033</div>
              </div>
              <div className="bg-[var(--card)] border border-border rounded-xl p-6">
                <div className="text-[var(--muted)] uppercase text-[10px] tracking-[0.15em] mb-4 font-bold">India Growth Rate</div>
                <div className="text-[var(--text)] text-[28px] lg:text-[32px] font-extrabold font-display leading-[1] mb-2 tracking-[-1px]">22.4%</div>
                <div className="text-[var(--muted2)] text-[12px]">CAGR — one of the fastest in Asia</div>
              </div>
              <div className="bg-[var(--card)] border border-border rounded-xl p-6">
                <div className="text-[var(--muted)] uppercase text-[10px] tracking-[0.15em] mb-4 font-bold">Indian Creators</div>
                <div className="text-[var(--text)] text-[28px] lg:text-[32px] font-extrabold font-display leading-[1] mb-2 tracking-[-1px]">4-5M+</div>
                <div className="text-[var(--muted2)] text-[12px]">Active creators across platforms</div>
              </div>
              <div className="bg-[var(--card)] border border-border rounded-xl p-6">
                <div className="text-[var(--muted)] uppercase text-[10px] tracking-[0.15em] mb-4 font-bold">Influencer Marketing India</div>
                <div className="text-[var(--text)] text-[28px] lg:text-[32px] font-extrabold font-display leading-[1] mb-2 tracking-[-1px]">₹3,500Cr</div>
                <div className="text-[var(--muted2)] text-[12px]">2025 industry value, growing fast</div>
              </div>
            </div>
          </div>

          {/* Right Column: Text Content */}
          <div className="flex-1 flex flex-col gap-6 justify-center lg:pt-12 text-text-muted text-[13px] md:text-[14px] leading-[1.8] reveal reveal-delay-2">
            <p>India's creator economy is exploding — fuelled by 900M+ smartphone users, affordable data, and a massive shift in how D2C brands acquire customers. Brands are moving away from expensive celebrity endorsements and toward authentic, performance-driven UGC content.</p>
            <p>Yet every existing Indian platform — Kofluence, Qoruz, Good Creator Co. — serves enterprise brands through agency-style models. There is no self-serve, performance-first marketplace where a small D2C brand can find a quality creator in minutes.</p>

            <div className="bg-[var(--amber-glow)] border-l-[3px] border-amber rounded-r-lg p-5 mt-2">
              <p className="text-[var(--text)] text-[13px] italic mb-0">"Capturing 1% of India's ₹3,500 Cr influencer-marketing industry would be ₹35 Cr GMV — our Year 2 target."</p>
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
            <p className="text-[13px] md:text-[14px] text-[var(--muted)] leading-[1.6]">A percentage cut on every paid project completed through the platform. Primary revenue driver at scale.</p>
          </div>
          <div className="bg-[var(--card)] border border-[rgba(15, 23, 42, 0.05)] border-b-[2px] border-b-amber p-8 rounded-2xl reveal reveal-delay-1">
            <div className="text-[clamp(24px,3vw,28px)] font-extrabold font-display text-amber mb-3 tracking-[-1px]">₹499/mo</div>
            <h3 className="text-[16px] md:text-[18px] text-[var(--text)] font-bold mb-3">Creator Pro Subscription</h3>
            <p className="text-[13px] md:text-[14px] text-[var(--muted)] leading-[1.6]">Advanced analytics, priority search ranking, featured profile placement, and AI-powered career insights.</p>
          </div>
          <div className="bg-[var(--card)] border border-[rgba(15, 23, 42, 0.05)] border-b-[2px] border-b-amber p-8 rounded-2xl reveal reveal-delay-2">
            <div className="text-[clamp(24px,3vw,28px)] font-extrabold font-display text-amber mb-3 tracking-[-1px]">₹2,999/mo</div>
            <h3 className="text-[16px] md:text-[18px] text-[var(--text)] font-bold mb-3">Brand Premium Plan</h3>
            <p className="text-[13px] md:text-[14px] text-[var(--muted)] leading-[1.6]">Unlimited campaign briefs, AI chatbot access, bulk creator outreach, and priority matching.</p>
          </div>
          <div className="bg-[var(--card)] border border-border border-b-[2px] border-b-amber p-8 rounded-2xl reveal">
            <div className="text-[clamp(24px,3vw,28px)] font-extrabold font-display text-amber mb-3 tracking-[-1px]">₹999</div>
            <h3 className="text-[16px] md:text-[18px] text-[var(--text)] font-bold mb-3">Featured Brand Listings</h3>
            <p className="text-[13px] md:text-[14px] text-[var(--muted)] leading-[1.6]">Brands pay to be highlighted to relevant creators, driving faster applications and better talent.</p>
          </div>
          <div className="bg-[var(--card)] border border-[rgba(15, 23, 42, 0.05)] border-b-[2px] border-b-amber p-8 rounded-2xl reveal reveal-delay-1">
            <div className="text-[clamp(24px,3vw,28px)] font-extrabold font-display text-amber mb-3 tracking-[-1px]">₹99</div>
            <h3 className="text-[16px] md:text-[18px] text-[var(--text)] font-bold mb-3">AI Contract Generator <span className="text-xs font-semibold text-[var(--muted)]">(planned, Q1 2027)</span></h3>
            <p className="text-[13px] md:text-[14px] text-[var(--muted)] leading-[1.6]">Per-contract fee for auto-generated usage rights, deadline, and payment agreements — no lawyer needed.</p>
          </div>
          <div className="bg-[var(--card)] border border-[rgba(15, 23, 42, 0.05)] border-b-[2px] border-b-amber p-8 rounded-2xl reveal reveal-delay-2">
            <div className="text-[clamp(24px,3vw,28px)] font-extrabold font-display text-amber mb-3 tracking-[-1px]">Custom</div>
            <h3 className="text-[16px] md:text-[18px] text-[var(--text)] font-bold mb-3">Enterprise Packages</h3>
            <p className="text-[13px] md:text-[14px] text-[var(--muted)] leading-[1.6]">White-glove matching, dedicated account management, and bulk campaign tooling for large brands.</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[var(--card)] border border-border p-6 rounded-2xl text-center reveal">
            <div className="text-[11px] uppercase tracking-[0.1em] font-bold text-[var(--muted2)] mb-4">Month 1–3</div>
            <div className="text-[clamp(24px,3vw,28px)] font-extrabold font-display text-[var(--text)] mb-1 tracking-[-1px]">500</div>
            <div className="text-[12px] text-[var(--muted2)]">Creators onboarded</div>
          </div>
          <div className="bg-[var(--card)] border border-[rgba(15, 23, 42, 0.05)] p-6 rounded-2xl text-center reveal reveal-delay-1">
            <div className="text-[11px] uppercase tracking-[0.1em] font-bold text-[var(--muted2)] mb-4">Month 6</div>
            <div className="text-[clamp(24px,3vw,28px)] font-extrabold font-display text-[var(--text)] mb-1 tracking-[-1px]">₹15–20L</div>
            <div className="text-[12px] text-[var(--muted2)]">Monthly GMV target</div>
          </div>
          <div className="bg-[var(--card)] border border-[rgba(15, 23, 42, 0.05)] p-6 rounded-2xl text-center reveal reveal-delay-2">
            <div className="text-[11px] uppercase tracking-[0.1em] font-bold text-[var(--muted2)] mb-4">Month 6</div>
            <div className="text-[clamp(24px,3vw,28px)] font-extrabold font-display text-amber mb-1 tracking-[-1px]">₹2–3L</div>
            <div className="text-[12px] text-[var(--muted2)]">Monthly revenue</div>
          </div>
          <div className="bg-[var(--card)] border border-[rgba(15, 23, 42, 0.05)] p-6 rounded-2xl text-center reveal reveal-delay-3">
            <div className="text-[11px] uppercase tracking-[0.1em] font-bold text-[var(--muted2)] mb-4">Year 2</div>
            <div className="text-[clamp(24px,3vw,28px)] font-extrabold font-display text-amber mb-1 tracking-[-1px]">₹35Cr+</div>
            <div className="text-[12px] text-[var(--muted2)]">GMV milestone</div>
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
          <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-amber via-amber to-[var(--border)] via-[30%]"></div>

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
            <div className="absolute -left-[39px] md:-left-[47px] top-1 w-4 h-4 rounded-full border-2 border-[var(--border2)] bg-[var(--black)]"></div>
            <div className="text-[var(--muted)] text-[11px] uppercase tracking-[0.1em] font-bold mb-3">Q1 2027 — AI LAYER</div>
            <h3 className="text-[20px] md:text-[22px] font-bold text-[var(--text)] mb-5">Intelligence Features</h3>
            <div className="flex flex-wrap gap-3">
              <span className="bg-[rgba(15, 23, 42, 0.02)] border border-[rgba(15, 23, 42, 0.05)] text-[var(--muted)] py-2 px-4 rounded-full text-[13px]">AI brief builder</span>
              <span className="bg-[rgba(15, 23, 42, 0.02)] border border-[rgba(15, 23, 42, 0.05)] text-[var(--muted)] py-2 px-4 rounded-full text-[13px]">AI contract generator</span>
              <span className="bg-[rgba(15, 23, 42, 0.02)] border border-[rgba(15, 23, 42, 0.05)] text-[var(--muted)] py-2 px-4 rounded-full text-[13px]">Performance tracker</span>
              <span className="bg-[rgba(15, 23, 42, 0.02)] border border-[rgba(15, 23, 42, 0.05)] text-[var(--muted)] py-2 px-4 rounded-full text-[13px]">Creator–Editor collab</span>
            </div>
          </div>

          {/* Q2 2027 */}
          <div className="relative reveal">
            <div className="absolute -left-[39px] md:-left-[47px] top-1 w-4 h-4 rounded-full border-2 border-[var(--border2)] bg-[var(--black)]"></div>
            <div className="text-[var(--muted)] text-[11px] uppercase tracking-[0.1em] font-bold mb-3">Q2 2027 — SCALE</div>
            <h3 className="text-[20px] md:text-[22px] font-bold text-[var(--text)] mb-5">Mobile + Growth</h3>
            <div className="flex flex-wrap gap-3">
              <span className="bg-[rgba(15, 23, 42, 0.02)] border border-[rgba(15, 23, 42, 0.05)] text-[var(--muted)] py-2 px-4 rounded-full text-[13px]">iOS + Android app</span>
              <span className="bg-[rgba(15, 23, 42, 0.02)] border border-[rgba(15, 23, 42, 0.05)] text-[var(--muted)] py-2 px-4 rounded-full text-[13px]">Referral program</span>
              <span className="bg-[rgba(15, 23, 42, 0.02)] border border-[rgba(15, 23, 42, 0.05)] text-[var(--muted)] py-2 px-4 rounded-full text-[13px]">SEA market entry</span>
              <span className="bg-[rgba(15, 23, 42, 0.02)] border border-[rgba(15, 23, 42, 0.05)] text-[var(--muted)] py-2 px-4 rounded-full text-[13px]">Brand storefront V2</span>
            </div>
          </div>

          {/* Q3 2027 */}
          <div className="relative reveal">
            <div className="absolute -left-[39px] md:-left-[47px] top-1 w-4 h-4 rounded-full border-2 border-[var(--border2)] bg-[var(--black)]"></div>
            <div className="text-[var(--muted)] text-[11px] uppercase tracking-[0.1em] font-bold mb-3">Q3 2027 — FUNDING</div>
            <h3 className="text-[20px] md:text-[22px] font-bold text-[var(--text)] mb-5">Seed Round + 10K Users</h3>
            <div className="flex flex-wrap gap-3">
              <span className="bg-[rgba(15, 23, 42, 0.02)] border border-[rgba(15, 23, 42, 0.05)] text-[var(--muted)] py-2 px-4 rounded-full text-[13px]">₹3–5 Cr seed raise</span>
              <span className="bg-[rgba(15, 23, 42, 0.02)] border border-[rgba(15, 23, 42, 0.05)] text-[var(--muted)] py-2 px-4 rounded-full text-[13px]">10,000 active users</span>
              <span className="bg-[rgba(15, 23, 42, 0.02)] border border-[rgba(15, 23, 42, 0.05)] text-[var(--muted)] py-2 px-4 rounded-full text-[13px]">Enterprise tier launch</span>
              <span className="bg-[rgba(15, 23, 42, 0.02)] border border-[rgba(15, 23, 42, 0.05)] text-[var(--muted)] py-2 px-4 rounded-full text-[13px]">Social API integrations</span>
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

          <p className="text-[14px] md:text-[16px] text-[var(--muted)] leading-[1.8] mb-12 max-w-[650px] reveal reveal-delay-1">
            Fewsion aims to become the default infrastructure for the creator economy in India and Southeast Asia — the place where every brand finds its best creator, every creator builds their legacy, and every editor finally gets the recognition they deserve.
          </p>

          <a href="mailto:founders@fewsion.in" className="inline-flex items-center justify-center bg-gradient-to-r from-amber to-[#FF6B35] text-black font-bold text-[14px] rounded-full px-8 py-3.5 transition-transform hover:scale-105 hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] reveal reveal-delay-2">
            Talk to the founders →
          </a>
        </div>
      </section>
    </main>
  );
}
