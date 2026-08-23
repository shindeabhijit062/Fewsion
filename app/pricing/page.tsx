'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type PlanTab = 'brand' | 'creator' | 'editor';

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<PlanTab>('brand');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    // Add a small delay to ensure DOM is updated before observing
    const timeoutId = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    }, 50);
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [activeTab]);

  return (
    <main className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section
        className="relative text-center overflow-hidden"
        style={{ padding: '140px 5% 80px' }}
      >
        {/* BG gradient */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(245,166,35,0.1) 0%, transparent 60%)' }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 bg-grid"
          style={{ maskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, black 30%, transparent 100%)' }}
        />
        <div className="relative z-10 max-w-[720px] mx-auto">
          <div
            className="inline-flex items-center gap-2 rounded-full px-[18px] py-[7px] text-[13px] font-medium mb-7"
            style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)', color: 'var(--amber)', letterSpacing: '0.03em' }}
          >
            Simple, Transparent Pricing
          </div>
          <h1
            className="font-display font-extrabold text-white"
            style={{ fontSize: 'clamp(40px,6vw,76px)', letterSpacing: '-2px', lineHeight: '1.05', marginBottom: '20px' }}
          >
            Pay for what<br />
            <em className="text-gradient-amber" style={{ fontStyle: 'normal' }}>you actually use</em>
          </h1>
          <p className="text-[19px] text-[#888] font-light max-w-[520px] mx-auto leading-[1.7]">
            No hidden fees. No agency markups. Start free and upgrade as your campaigns scale.
          </p>
        </div>
      </section>

      {/* ── TABS + PLANS ── */}
      <section className="px-[5%] pb-[80px]">

        {/* Tab pills */}
        <div
          className="flex gap-0 justify-center mb-12 mx-auto w-fit rounded-full p-1"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          {(['brand', 'creator', 'editor'] as PlanTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="font-display text-[14px] font-semibold px-7 py-[10px] rounded-full border-none cursor-pointer transition-all duration-250"
              style={{
                background: activeTab === tab ? 'var(--amber)' : 'transparent',
                color: activeTab === tab ? '#000' : 'var(--muted)',
              }}
            >
              For {tab.charAt(0).toUpperCase() + tab.slice(1)}s
            </button>
          ))}
        </div>

        {/* Brand Plans */}
        {activeTab === 'brand' && <PlansGrid plans={brandPlans} />}
        {activeTab === 'creator' && <PlansGrid plans={creatorPlans} />}
        {activeTab === 'editor' && <PlansGrid plans={editorPlans} twoCol />}
      </section>

      {/* ── ADD-ONS ── */}
      <section id="addons" className="px-[5%] py-[80px]" style={{ background: 'var(--deep)' }}>
        <div className="section-tag">Add-ons</div>
        <h2 className="section-title reveal">Pay only for<br /><em>what you need</em></h2>
        <p className="section-sub reveal reveal-delay-1">One-time tools and boosts available across all plan tiers.</p>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {addons.map((a, i) => (
            <div
              key={a.name}
              className={`reveal ${i === 1 ? 'reveal-delay-1' : i === 2 ? 'reveal-delay-2' : ''} relative overflow-hidden rounded-2xl p-7 cursor-default`}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                transition: 'border-color 0.3s, transform 0.3s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(245,166,35,0.25)';
                el.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--border)';
                el.style.transform = 'translateY(0)';
              }}
            >
              {/* bottom accent bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: 'linear-gradient(90deg, var(--amber), var(--amber2))' }}
              />
              <div className="font-display text-[26px] font-extrabold mb-1" style={{ color: 'var(--amber)', letterSpacing: '-0.5px' }}>
                {a.price}
              </div>
              <div className="font-display text-[15px] font-bold text-white mb-2">{a.name}</div>
              <div className="text-[13.5px] text-[#888] leading-[1.6]">{a.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="px-[5%] py-[80px]" style={{ background: 'var(--black)' }}>
        <div className="section-tag">Frequently Asked</div>
        <h2 className="section-title reveal">Got questions?<br /><em>We&apos;ve got answers.</em></h2>
        <div className="grid gap-4 mt-12" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} delay={i % 2 === 1 ? 'reveal-delay-1' : ''} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        id="page-cta"
        className="text-center px-[5%] py-[100px]"
        style={{
          background: 'linear-gradient(135deg, rgba(245,166,35,0.1) 0%, rgba(255,107,53,0.08) 50%, transparent 100%)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div className="section-tag" style={{ justifyContent: 'center', display: 'flex' }}>Get Started</div>
        <h2
          className="font-display font-extrabold text-white"
          style={{ fontSize: 'clamp(32px,5vw,60px)', letterSpacing: '-2px', marginBottom: '16px', lineHeight: '1.1' }}
        >
          Start free.<br />
          <em style={{ fontStyle: 'normal', color: 'var(--amber)' }}>Scale when ready.</em>
        </h2>
        <p className="text-[18px] text-[#888] max-w-[480px] mx-auto mb-10 font-light">
          No credit card needed. Launch your first campaign or portfolio in minutes.
        </p>
        <div className="flex gap-[14px] justify-center flex-wrap">
          <Link href="/signup?role=brand" className="btn-primary">I&apos;m a Brand →</Link>
          <Link href="/creators" className="btn-ghost">I&apos;m a Creator</Link>
        </div>
      </section>

    </main>
  );
}

/* ── Sub-components ── */

function PlansGrid({ plans, twoCol }: { plans: Plan[]; twoCol?: boolean }) {
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: twoCol ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        maxWidth: twoCol ? '700px' : undefined,
        margin: twoCol ? '0 auto' : undefined,
      }}
    >
      {plans.map((plan, i) => (
        <PlanCard key={plan.name} plan={plan} index={i} />
      ))}
    </div>
  );
}

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  const delay = index === 1 ? 'reveal-delay-1' : index === 2 ? 'reveal-delay-2' : '';
  return (
    <div
      className={`relative reveal ${delay} rounded-2xl p-[36px_32px] transition-transform duration-300`}
      style={{
        background: plan.featured
          ? 'linear-gradient(160deg, rgba(245,166,35,0.07) 0%, rgba(255,107,53,0.04) 100%)'
          : 'var(--card)',
        border: `1px solid ${plan.featured ? 'rgba(245,166,35,0.4)' : 'var(--border)'}`,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
    >
      {plan.featured && (
        <div
          className="absolute font-display text-[11px] font-extrabold text-black px-[18px] py-[5px] rounded-full whitespace-nowrap"
          style={{
            top: '-13px', left: '50%', transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, var(--amber), var(--amber2))',
            letterSpacing: '0.05em',
          }}
        >
          Most Popular
        </div>
      )}
      <div className="font-display text-[14px] font-bold uppercase text-[#888] mb-3" style={{ letterSpacing: '0.08em' }}>
        {plan.name}
      </div>
      <div
        className="font-display font-extrabold leading-none mb-1"
        style={{ fontSize: '48px', letterSpacing: '-2px', color: plan.freeColor ? 'var(--amber)' : 'var(--white)' }}
      >
        {plan.price === 'Free' || plan.price === 'Custom' || plan.price === 'Coming' ? (
          plan.price
        ) : (
          <><sup className="text-[24px]" style={{ verticalAlign: 'super', letterSpacing: 0 }}>₹</sup>{plan.price}</>
        )}
      </div>
      <div className="text-[13px] text-[#888] mb-2">{plan.period}</div>
      <div
        className="text-[14px] text-[#888] leading-[1.6] mb-7 pb-7"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {plan.desc}
      </div>
      <a
        href={plan.ctaHref ?? '#'}
        className={`block text-center w-full py-[13px] rounded-full font-display text-[14px] font-bold no-underline mb-7 transition-all duration-200 ${plan.ctaStyle === 'primary' ? 'plan-btn-primary' : 'plan-btn-ghost'}`}
        style={
          plan.ctaStyle === 'primary'
            ? { background: 'var(--amber)', color: '#000' }
            : { background: 'transparent', color: 'var(--text)', border: '1px solid var(--border2)' }
        }
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          if (plan.ctaStyle === 'primary') {
            el.style.boxShadow = '0 8px 30px rgba(245,166,35,0.4)';
            el.style.transform = 'translateY(-1px)';
          } else {
            el.style.borderColor = 'rgba(255,255,255,0.3)';
            el.style.background = 'rgba(255,255,255,0.04)';
          }
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.boxShadow = '';
          el.style.transform = '';
          if (plan.ctaStyle !== 'primary') el.style.background = 'transparent';
          if (plan.ctaStyle !== 'primary') el.style.borderColor = 'var(--border2)';
        }}
      >
        {plan.cta}
      </a>
      <ul className="flex flex-col gap-3 list-none">
        {plan.features.map((f) => (
          <li key={f.text} className={`flex items-start gap-[10px] text-[14px] leading-[1.5] ${f.included ? 'text-[var(--text)]' : 'text-[var(--muted2)]'}`}>
            {f.included ? (
              <div className="flex-shrink-0 mt-[2px] flex items-center justify-center w-4 h-4 rounded-full border border-[rgba(74,222,128,0.3)] bg-[rgba(74,222,128,0.15)]">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 4L3.5 6.5L9 1" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ) : (
              <div className="flex-shrink-0 mt-[2px] flex items-center justify-center w-4 h-4 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.04)]">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L7 7M7 1L1 7" stroke="#555" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            )}
            {f.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FaqItem({ q, a, delay }: { q: string; a: string; delay: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`reveal ${delay} cursor-pointer rounded-[10px] px-7 py-6 transition-all duration-200`}
      style={{ background: 'var(--card)', border: `1px solid ${open ? 'rgba(245,166,35,0.25)' : 'var(--border)'}` }}
      onClick={() => setOpen(!open)}
    >
      <div className="font-display text-[15px] font-bold text-white mb-0 flex justify-between items-start gap-3">
        {q}
        <span className="text-[20px] font-normal flex-shrink-0 transition-transform duration-200" style={{ color: 'var(--amber)', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </div>
      {open && (
        <div className="text-[14px] text-[#888] leading-[1.7] mt-[10px]">{a}</div>
      )}
    </div>
  );
}

/* ── DATA ── */
interface Feature { text: string; included: boolean }
interface Plan {
  name: string; price: string; period: string; desc: string;
  cta: string; ctaHref?: string; ctaStyle: 'primary' | 'ghost';
  features: Feature[]; featured?: boolean; freeColor?: boolean;
}

const brandPlans: Plan[] = [
  {
    name: 'Starter', price: 'Free', period: 'Always free', freeColor: true,
    desc: 'For D2C brands testing creator marketing for the first time. No commitment needed.',
    cta: 'Get started free', ctaStyle: 'ghost',
    features: [
      { text: 'Up to 3 active campaigns', included: true },
      { text: 'Standard creator search & filters', included: true },
      { text: 'AI basic matching', included: true },
      { text: 'Razorpay escrow on all deals', included: true },
      { text: 'AI contract generator (₹99/contract)', included: true },
      { text: '10–15% transaction commission', included: true },
      { text: 'AI brief builder', included: false },
      { text: 'Brand storefront', included: false },
      { text: 'Performance tracker', included: false },
      { text: 'Bulk creator outreach', included: false },
    ],
  },
  {
    name: 'Brand Premium', price: '2,999', period: 'per month', featured: true,
    desc: 'For growing brands running consistent UGC campaigns. Everything in Starter, plus AI tools and analytics.',
    cta: 'Start Premium →', ctaStyle: 'primary',
    features: [
      { text: 'Unlimited active campaigns', included: true },
      { text: 'Advanced search with Creator Score filter', included: true },
      { text: 'AI chatbot creator matching', included: true },
      { text: 'AI brief builder (unlimited)', included: true },
      { text: 'Performance tracker dashboard', included: true },
      { text: 'Brand storefront with creator reviews', included: true },
      { text: 'Bulk creator outreach', included: true },
      { text: 'AI contract generator (included)', included: true },
      { text: 'Priority support', included: true },
      { text: '10–15% transaction commission', included: true },
    ],
  },
  {
    name: 'Enterprise', price: 'Custom', period: 'contact us',
    desc: 'For large brands and agencies managing multiple campaigns and creator relationships at scale.',
    cta: 'Talk to our team', ctaStyle: 'ghost',
    features: [
      { text: 'Everything in Brand Premium', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'White-glove creator matching', included: true },
      { text: 'Custom contract templates', included: true },
      { text: 'API access for CRM integration', included: true },
      { text: 'Multi-brand / multi-team access', included: true },
      { text: 'Volume discounts on commissions', included: true },
      { text: 'Custom SLA & onboarding', included: true },
      { text: 'Invoicing & credit-based billing', included: true },
    ],
  },
];

const creatorPlans: Plan[] = [
  {
    name: 'Creator Free', price: 'Free', period: 'Always free', freeColor: true,
    desc: 'Build your portfolio and apply to campaigns — no subscription needed.',
    cta: 'Create profile', ctaStyle: 'ghost',
    features: [
      { text: 'Full performance portfolio', included: true },
      { text: 'Apply to unlimited campaigns', included: true },
      { text: 'Creator Score (public)', included: true },
      { text: 'Escrow-protected payments', included: true },
      { text: 'AI contract on every project', included: true },
      { text: 'Editor collaboration invites', included: true },
      { text: 'Priority search ranking', included: false },
      { text: 'Advanced analytics & CTR data', included: false },
      { text: 'Featured profile placement', included: false },
      { text: 'AI-powered career insights', included: false },
    ],
  },
  {
    name: 'Creator Pro', price: '499', period: 'per month', featured: true,
    desc: 'For serious creators who want more visibility, better data, and faster growth.',
    cta: 'Go Pro →', ctaStyle: 'primary',
    features: [
      { text: 'Everything in Creator Free', included: true },
      { text: 'Priority ranking in search results', included: true },
      { text: 'Full CTR & conversion analytics', included: true },
      { text: 'Featured profile placement', included: true },
      { text: 'AI career insights & rate benchmarks', included: true },
      { text: 'Early access to premium campaigns', included: true },
      { text: 'Creator Pro badge on profile', included: true },
      { text: 'Dedicated support', included: true },
    ],
  },
  {
    name: 'Creator Team', price: 'Coming', period: 'Q2 2027',
    desc: 'For creator studios and talent agencies managing multiple creator profiles.',
    cta: 'Join waitlist', ctaStyle: 'ghost',
    features: [
      { text: 'Manage up to 20 creator profiles', included: true },
      { text: 'Centralized earnings dashboard', included: true },
      { text: 'Agency storefront page', included: true },
      { text: 'Bulk campaign applications', included: true },
      { text: 'Priority enterprise brand matching', included: true },
    ],
  },
];

const editorPlans: Plan[] = [
  {
    name: 'Editor Free', price: 'Free', period: 'Always free', freeColor: true,
    desc: 'List your portfolio, receive collab invites, and get paid — no upfront cost.',
    cta: 'Create portfolio', ctaStyle: 'ghost',
    features: [
      { text: 'Full reel & portfolio showcase', included: true },
      { text: 'Receive creator collab invites', included: true },
      { text: 'Apply to brand editing jobs', included: true },
      { text: 'Performance rating system', included: true },
      { text: 'Escrow-protected payments', included: true },
      { text: 'AI contract on every project', included: true },
      { text: 'Priority search ranking', included: false },
      { text: 'Featured editor placement', included: false },
      { text: 'Advanced project analytics', included: false },
    ],
  },
  {
    name: 'Editor Pro', price: '299', period: 'per month', featured: true,
    desc: 'Get discovered faster and build a reputation that brings inbound work to you.',
    cta: 'Go Pro →', ctaStyle: 'primary',
    features: [
      { text: 'Everything in Editor Free', included: true },
      { text: 'Priority ranking in editor search', included: true },
      { text: 'Featured placement in creator matching', included: true },
      { text: 'Full project analytics', included: true },
      { text: 'Editor Pro badge on profile', included: true },
      { text: 'Early access to high-budget jobs', included: true },
      { text: 'Rate benchmarking tool', included: true },
      { text: 'Dedicated support', included: true },
    ],
  },
];

const addons = [
  {
    price: '₹99',
    name: 'AI Contract',
    desc: 'One-click contract generation for any project. Covers usage rights, revisions, deadlines, and payment terms. Included free in Premium plans.',
  },
  {
    price: '₹999',
    name: 'Featured Brand Listing',
    desc: 'Boost your brand storefront to appear at the top of creator discovery for 30 days. Drives faster applications from relevant creators.',
  },
  {
    price: '₹499',
    name: 'Creator Profile Boost',
    desc: 'Pin your creator profile to the top of brand search results for 14 days. Best for launching a new niche or re-entering the market.',
  },
];

const faqs = [
  { q: 'How does the transaction commission work?', a: 'Fewsion charges 10–15% on every completed project. This is paid by the brand on top of the creator\'s agreed fee — creators and editors keep their full quoted amount.' },
  { q: 'Do creators and editors pay to join?', a: 'No. Creator and Editor Free tiers are genuinely free — no hidden charges. Brands pay the platform commission. Creators and editors can upgrade to Pro for extra visibility, but it\'s never required.' },
  { q: 'How does escrow work exactly?', a: 'When a brand approves a creator for a campaign, they deposit the full agreed amount via Razorpay into escrow. This is held safely until the creator delivers approved content. No content, no release.' },
  { q: 'Can I cancel my subscription anytime?', a: 'Yes. All subscriptions are month-to-month with no lock-in. You can downgrade or cancel at any time — you keep access until the end of the billing period.' },
  { q: 'Is there a minimum spend for brands?', a: 'None at all. You can post a campaign with a budget as low as ₹5,000. Fewsion is built for D2C brands of all sizes, including those just starting with UGC.' },
  { q: 'When does my Creator or Editor get paid?', a: 'Escrow releases within 24 hours of brand approval. Payment hits the creator or editor\'s linked bank account or UPI within 1–2 business days via Razorpay.' },
];
