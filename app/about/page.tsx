'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="overflow-x-hidden">

      {/* ── HERO BG ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 10%, rgba(245,166,35,0.08) 0%, transparent 60%)',
        }}
      />

      {/* ── HERO ── */}
      <div
        className="relative z-10 mx-auto max-w-[800px] px-[5%] text-center"
        style={{ padding: '140px 5% 80px' }}
      >
        <div className="section-tag">Our Story</div>
        <h1
          className="font-display font-extrabold text-white"
          style={{ fontSize: 'clamp(36px,5vw,68px)', letterSpacing: '-2px', marginBottom: '24px' }}
        >
          Built for the people<br />
          who <em className="text-gradient-amber font-display" style={{ fontStyle: 'normal' }}>make the internet</em> move.
        </h1>
        <p className="text-[19px] text-[#888] font-light leading-[1.7] max-w-[600px] mx-auto">
          Fewsion started with a simple observation: India has 4.5 million creators, but no platform
          that actually treats them like professionals. We&apos;re here to fix that.
        </p>
      </div>

      {/* ── MISSION ── */}
      <section
        id="mission"
        className="px-[5%] py-[80px] relative z-10"
        style={{ background: 'var(--deep)' }}
      >
        <div className="max-w-[720px] mx-auto">
          <div className="section-tag reveal">Our Mission</div>
          <h2
            className="reveal font-display font-extrabold text-white"
            style={{ fontSize: 'clamp(24px,3vw,40px)', letterSpacing: '-1.2px', marginBottom: '16px', lineHeight: '1.15' }}
          >
            Give every Indian creator<br />
            <em style={{ fontStyle: 'normal', color: 'var(--amber)' }}>proof they can get paid for.</em>
          </h2>
          <p className="reveal text-[16px] text-[#888] leading-[1.8] mb-4 font-light">
            The creator economy in India is massive — ₹3,500 crore in market size and growing. But the
            infrastructure for creators is broken. Payment delays are common. Brands pick by follower count,
            not output quality. Editors have no marketplace at all.
          </p>
          <p className="reveal text-[16px] text-[#888] leading-[1.8] font-light">
            Fewsion is building the missing layer: a three-sided marketplace where brands find creators by
            real performance, creators get paid reliably through escrow, and editors finally have a platform
            that sees them.
          </p>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section id="values" className="px-[5%] py-[80px] relative z-10">
        <div className="section-tag reveal">What We Stand For</div>
        <h2
          className="reveal font-display font-extrabold text-white"
          style={{ fontSize: 'clamp(24px,3vw,40px)', letterSpacing: '-1.2px', marginBottom: '48px', lineHeight: '1.15' }}
        >
          Our values aren&apos;t<br />
          <em style={{ fontStyle: 'normal', color: 'var(--amber)' }}>just on a slide deck.</em>
        </h2>

        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
        >
          {values.map((v, i) => (
            <div
              key={v.title}
              className={`card-base p-7 reveal ${i % 3 === 1 ? 'reveal-delay-1' : i % 3 === 2 ? 'reveal-delay-2' : ''}`}
            >
              <div className="text-[28px] mb-[14px]">{v.icon}</div>
              <h3 className="font-display text-[16px] font-bold text-white mb-2">{v.title}</h3>
              <p className="text-[14px] text-[#888] leading-[1.7]">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TEAM ── */}
      <section id="team" className="px-[5%] py-[80px] relative z-10" style={{ background: 'var(--deep)' }}>
        <div className="section-tag reveal">The Team</div>
        <h2
          className="reveal font-display font-extrabold text-white"
          style={{ fontSize: 'clamp(24px,3vw,40px)', letterSpacing: '-1.2px', marginBottom: '48px', lineHeight: '1.15' }}
        >
          Founders who&apos;ve been<br />
          <em style={{ fontStyle: 'normal', color: 'var(--amber)' }}>on both sides of the brief.</em>
        </h2>

        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
        >
          {team.map((member, i) => (
            <div
              key={member.name}
              className={`text-center reveal ${i === 1 ? 'reveal-delay-1' : i === 2 ? 'reveal-delay-2' : ''}`}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '32px 24px',
                transition: 'border-color 0.3s, transform 0.3s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,166,35,0.2)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <div
                className="w-[72px] h-[72px] rounded-full flex items-center justify-center font-display text-[22px] font-extrabold text-black mx-auto mb-[18px]"
                style={{ background: 'linear-gradient(135deg, var(--amber), var(--amber2))' }}
              >
                {member.initial}
              </div>
              <div className="font-display text-[17px] font-bold text-white mb-1">{member.name}</div>
              <div className="text-[13px] font-medium mb-3" style={{ color: 'var(--amber)' }}>{member.role}</div>
              <div className="text-[13.5px] text-[#888] leading-[1.65]">{member.bio}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRACTION ── */}
      <section id="traction" className="px-[5%] py-[80px] relative z-10">
        <div className="section-tag reveal">Early Traction</div>
        <h2
          className="reveal font-display font-extrabold text-white"
          style={{ fontSize: 'clamp(24px,3vw,40px)', letterSpacing: '-1.2px', marginBottom: '48px', lineHeight: '1.15' }}
        >
          The numbers that<br />
          <em style={{ fontStyle: 'normal', color: 'var(--amber)' }}>tell the story.</em>
        </h2>

        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`reveal text-center ${i === 1 ? 'reveal-delay-1' : i === 2 ? 'reveal-delay-2' : ''}`}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '28px 20px',
              }}
            >
              <div
                className="font-display font-extrabold"
                style={{ fontSize: '36px', color: 'var(--amber)', letterSpacing: '-1px', marginBottom: '6px' }}
              >
                {s.val}
              </div>
              <div className="text-[13px] text-[#888] leading-[1.5]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        id="page-cta"
        className="relative z-10 text-center px-[5%] py-[100px]"
        style={{
          background: 'linear-gradient(135deg, rgba(245,166,35,0.1) 0%, rgba(255,107,53,0.08) 50%, transparent 100%)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <h2
          className="font-display font-extrabold text-white"
          style={{ fontSize: 'clamp(32px,5vw,56px)', letterSpacing: '-2px', marginBottom: '16px', lineHeight: '1.1' }}
        >
          Come build India&apos;s<br />
          <em style={{ fontStyle: 'normal', color: 'var(--amber)' }}>creator economy with us.</em>
        </h2>
        <p className="text-[18px] text-[#888] max-w-[460px] mx-auto mb-10 font-light">
          Join the waitlist, partner with us, or just follow what we&apos;re building.
        </p>
        <div className="flex gap-[14px] justify-center flex-wrap">
          <Link href="/signup" className="btn-primary">Join the waitlist →</Link>
          <a href="mailto:founders@fewsion.in" className="btn-ghost">Email the founders</a>
        </div>
      </section>

    </main>
  );
}

const values = [
  {
    icon: '📊',
    title: 'Performance over popularity',
    desc: 'A creator with 20K followers and a 6% CTR is worth more than one with 500K and 0.4%. We built our entire scoring system on this belief.',
  },
  {
    icon: '🔒',
    title: 'Creators always get paid',
    desc: 'Escrow is non-negotiable. No creator should work and then chase money. We hold brands accountable before a single frame is shot.',
  },
  {
    icon: '🇮🇳',
    title: 'Built for Bharat',
    desc: 'Rupees, Razorpay, regional languages, and the Indian creator context. We\'re not a Western platform with an Indian price tag.',
  },
  {
    icon: '🤝',
    title: 'Three sides, one platform',
    desc: 'Most marketplaces forget the editor. We built an editor-first marketplace because great content needs great editing, and editors deserve to be seen.',
  },
  {
    icon: '🤖',
    title: 'AI that does real work',
    desc: 'Our AI isn\'t a chatbot stuck on a landing page. It writes briefs, generates contracts, matches creators to campaigns, and surfaces insights brands can act on.',
  },
  {
    icon: '📈',
    title: 'Transparency as default',
    desc: 'Creator Scores are public. Commission rates are stated upfront. We don\'t believe in hidden markups or opaque "algorithm" decisions.',
  },
];

const team = [
  {
    initial: 'A',
    name: 'Aryan Desai',
    role: 'CEO & Co-founder',
    bio: 'Former D2C brand founder who ran 50+ creator campaigns and watched money disappear into bad hires. Built Fewsion to solve his own problem.',
  },
  {
    initial: 'P',
    name: 'Priya Nambiar',
    role: 'CTO & Co-founder',
    bio: 'Full-stack engineer with prior experience at a fintech startup. Built the escrow payment pipeline and Creator Score algorithm from scratch.',
  },
  {
    initial: 'R',
    name: 'Rahul Joshi',
    role: 'Head of Creators',
    bio: 'UGC creator with 180K followers across Instagram and YouTube Shorts. Knows exactly what creators need and how they actually work.',
  },
];

const stats = [
  { val: '1,200+', label: 'Creators on waitlist' },
  { val: '34', label: 'D2C brands signed LOIs' },
  { val: '₹8.2L', label: 'GMV in closed pilot campaigns' },
  { val: "Q3 '26", label: 'Public launch target' },
];
