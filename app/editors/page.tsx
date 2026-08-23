'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

interface Editor {
  id: string | number;
  name: string;
  cityState: string;
  oneLineBio: string;
  experience: string;
  formats: string[];
  software: string[];
  skills: string[];
  rate: string;
  score: number;
  turnaround: string;
  availability: string;
}

const FORMATS = ['All', 'Reels', 'YouTube Shorts', 'Long-form', 'Ad Edits', 'Vlogs'];
const SOFTWARE = ['All', 'Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Final Cut Pro', 'CapCut Pro'];

const mockEditors: Editor[] = [
  {
    id: 1,
    name: 'Vikram Sharma',
    cityState: 'Mumbai, MH',
    oneLineBio: 'High-energy short-form specialist. CapCut Pro & Premiere.',
    experience: '2–3 years',
    formats: ['Reels', 'YouTube Shorts', 'Ad Edits'],
    software: ['Premiere Pro', 'CapCut Pro'],
    skills: ['Color Grading', 'Sound Design'],
    rate: '₹3,500/video',
    score: 92,
    turnaround: '24–48 hours',
    availability: 'Part-time'
  },
  {
    id: 2,
    name: 'Aisha Patel',
    cityState: 'Bangalore, KA',
    oneLineBio: 'Long-form documentary and YouTube essay editor.',
    experience: '3–5 years',
    formats: ['Long-form', 'Vlogs'],
    software: ['DaVinci Resolve', 'Premiere Pro'],
    skills: ['Audio Mixing', 'Storytelling'],
    rate: '₹12,000/video',
    score: 89,
    turnaround: '3–5 days',
    availability: 'Full-time'
  },
  {
    id: 3,
    name: 'Kabir Verma',
    cityState: 'Delhi, DL',
    oneLineBio: 'Motion graphics wizard & commercial video editor.',
    experience: '5+ years',
    formats: ['Ad Edits', 'Reels'],
    software: ['After Effects', 'Premiere Pro'],
    skills: ['Motion Graphics', 'Visual Effects'],
    rate: '₹8,000/video',
    score: 95,
    turnaround: '2–3 days',
    availability: 'Full-time'
  }
];

export default function EditorsPage() {
  const [editors, setEditors] = useState<Editor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFormat, setActiveFormat] = useState('All');
  const [activeSoftware, setActiveSoftware] = useState('All');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [editors]); // Re-run when editors change

  useEffect(() => {
    async function loadEditors() {
      try {
        const { data, error } = await supabase
          .from('editor_profiles')
          .select('*')
          .order('ai_total_score', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped: Editor[] = data.map((e) => ({
            id: e.id,
            name: e.editor_name || 'Editor Name',
            cityState: e.city_state || 'India',
            oneLineBio: e.one_line_bio || 'Professional Video Editor',
            experience: e.experience_duration || '1-2 years',
            formats: e.specialised_formats || [],
            software: e.primary_software || [],
            skills: e.special_skills || [],
            rate: e.rate_short_form || '₹3,000/video',
            score: e.ai_total_score || 70,
            turnaround: e.turnaround_time || '2-3 days',
            availability: e.availability_status || 'Open to collabs'
          }));
          setEditors(mapped);
        } else {
          setEditors(mockEditors);
        }
      } catch (err) {
        console.error('Error loading editors:', err);
        setEditors(mockEditors);
      } finally {
        setLoading(false);
      }
    }
    loadEditors();
  }, []);

  const filtered = editors.filter((e) => {
    const matchSearch = !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.oneLineBio.toLowerCase().includes(search.toLowerCase()) ||
      e.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));

    const matchFormat = activeFormat === 'All' ||
      e.formats.some(f => f.toLowerCase().includes(activeFormat.toLowerCase()));

    const matchSoftware = activeSoftware === 'All' ||
      e.software.some(sw => sw.toLowerCase().includes(activeSoftware.toLowerCase()));

    return matchSearch && matchFormat && matchSoftware;
  });

  return (
    <main className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{ minHeight: '90vh', padding: '120px 5% 80px' }}
      >
        {/* BG radial — green tint for editors */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 30% 50%, rgba(74,222,128,0.07) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(245,166,35,0.06) 0%, transparent 50%)' }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 bg-grid"
          style={{ maskImage: 'radial-gradient(ellipse 80% 80% at 30% 50%, black 30%, transparent 100%)' }}
        />

        <div className="relative z-10 max-w-[580px]">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-[18px] py-[7px] text-[13px] font-medium mb-7"
            style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80', letterSpacing: '0.03em' }}
          >
            <span
              className="w-[6px] h-[6px] rounded-full"
              style={{ background: '#4ade80', animation: 'pulse 2s infinite' }}
            />
            Editor Portal · India&apos;s First
          </div>

          <h1
            className="font-display font-extrabold text-white"
            style={{ fontSize: 'clamp(40px,6vw,76px)', letterSpacing: '-2px', lineHeight: '1.05', marginBottom: '24px' }}
          >
            Editors finally<br />get a{' '}
            <em className="text-gradient-amber" style={{ fontStyle: 'normal' }}>platform</em>
            <br />of their own.
          </h1>
          <p className="text-[#888] font-light leading-[1.7] mb-10" style={{ fontSize: 'clamp(16px,2vw,19px)' }}>
            India&apos;s creator economy runs on video. But every editing tool, every marketplace, every job board
            treats editors like an afterthought. Fewsion is the first platform built for you.
          </p>
          <div className="flex gap-[14px] flex-wrap">
            <Link href="/signup?role=editor" className="btn-primary">Claim your editor profile →</Link>
            <Link href="/pricing" className="btn-ghost">See pricing</Link>
          </div>
        </div>

        {/* Hero visual — editor preview card */}
        <div
          className="absolute right-[5%] top-1/2 -translate-y-1/2 z-10 lg:block hidden"
          style={{ width: 'min(420px, 40vw)' }}
        >
          <EditorPreviewCard />
        </div>
      </section>

      {/* ── DISCOVER EDITORS ── */}
      <section id="explore" className="px-[5%] py-[80px] relative z-10 border-t border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-[720px] mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium mb-4" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)', color: '#4ade80' }}>
            Explore Talent
          </div>
          <h2 className="font-display font-extrabold text-white mb-4" style={{ fontSize: 'clamp(28px,3.5vw,44px)', letterSpacing: '-1.5px', lineHeight: '1.15' }}>
            Browse verified video editors<br />
            <em style={{ fontStyle: 'normal', color: '#4ade80' }}>by skills and software.</em>
          </h2>
          <p className="text-[16px] text-[#888] font-light max-w-[500px] mx-auto">
            Find the perfect editor to level up your content. Filter by specialty formats, tools, and experience.
          </p>
        </div>

        {/* Search & Select Grid */}
        <div className="max-w-[800px] mx-auto mb-10">
          <div className="flex gap-3 mb-6 flex-wrap">
            {/* Search Input */}
            <div className="flex-1 min-w-[280px] relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] pointer-events-none">🔍</span>
              <input
                type="text"
                placeholder="Search by name, software, or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-5 py-[12px] rounded-full text-[13.5px] outline-none"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  fontFamily: 'var(--font-body)',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(74,222,128,0.4)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
              />
            </div>

            {/* Software Select Dropdown */}
            <select
              value={activeSoftware}
              onChange={(e) => setActiveSoftware(e.target.value)}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '50px',
                color: 'var(--text)',
                padding: '10px 22px',
                fontSize: '13.5px',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(74,222,128,0.4)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            >
              <option value="All">All software</option>
              {SOFTWARE.filter(s => s !== 'All').map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Format quick filters */}
          <div className="flex gap-2 justify-center flex-wrap">
            {FORMATS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFormat(f)}
                className="text-[12.5px] font-medium px-[16px] py-[7px] rounded-full border-none cursor-pointer transition-all duration-200"
                style={{
                  background: activeFormat === f ? '#4ade80' : 'var(--card)',
                  color: activeFormat === f ? '#000' : 'var(--muted)',
                  border: `1px solid ${activeFormat === f ? '#4ade80' : 'var(--border)'}`,
                  fontFamily: 'var(--font-body)',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Editor Grid & Loading State */}
        {loading ? (
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-[20px] p-7 animate-pulse"
                style={{ background: 'var(--card)', border: '1px solid var(--border)', minHeight: '320px' }}
              >
                <div className="flex items-center gap-[14px] mb-[22px]">
                  <div className="w-12 h-12 rounded-full bg-neutral-800" />
                  <div className="flex-1">
                    <div className="h-4 bg-neutral-800 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-neutral-800 rounded w-1/3" />
                  </div>
                  <div className="w-10 h-6 bg-neutral-800 rounded-full" />
                </div>
                <div className="h-4 bg-neutral-800 rounded w-full mb-6" />
                <div className="grid grid-cols-3 gap-[6px] mb-4">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="rounded-lg bg-neutral-800 h-16" />
                  ))}
                </div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-neutral-800 rounded-full w-16" />
                  <div className="h-6 bg-neutral-800 rounded-full w-20" />
                </div>
                <div className="h-10 bg-neutral-800 rounded-full w-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state-box">
            <div className="text-[32px] mb-3">🔎</div>
            No editors found matching your criteria. Try resetting filters or search terms.
          </div>
        ) : (
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}
          >
            {filtered.map((editor) => (
              <EditorCard key={editor.id} editor={editor} />
            ))}
          </div>
        )}
      </section>

      {/* ── FEATURES ── */}
      <section className="px-[5%] py-[100px]">
        <div className="section-tag reveal">Why Fewsion for Editors</div>
        <h2 className="section-title reveal">
          Everything you need<br />
          <em>to earn from your craft.</em>
        </h2>
        <p className="section-sub reveal reveal-delay-1">
          We built the infrastructure editors always deserved — portfolio, marketplace, payments, and AI contracts.
        </p>

        <div
          className="grid gap-[1px] rounded-2xl overflow-hidden"
          style={{ gridTemplateColumns: 'repeat(3, 1fr)', background: 'var(--border)', border: '1px solid var(--border)' }}
        >
          {editorFeatures.map((feat) => (
            <FeatureCard key={feat.title} feat={feat} />
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="px-[5%] py-[100px]" style={{ background: 'var(--deep)' }}>
        <div className="section-tag reveal">How It Works</div>
        <h2 className="section-title reveal">From profile to<br /><em>paid, in 4 steps.</em></h2>
        <p className="section-sub reveal reveal-delay-1">
          Fewsion makes it simple to go from zero to earning as an editor.
        </p>
        <div className="relative flex flex-col gap-0 mt-14">
          {/* Vertical line */}
          <div
            className="absolute left-[23px] top-6 bottom-6 w-[2px]"
            style={{ background: 'linear-gradient(to bottom, #4ade80, var(--amber), transparent)' }}
          />
          {steps.map((step, i) => (
            <div
              key={step.title}
              className={`flex gap-7 items-start py-9 reveal ${i > 0 ? 'reveal-delay-' + Math.min(i, 2) : ''}`}
              style={{ borderBottom: i < steps.length - 1 ? '1px solid var(--border)' : 'none' }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-display text-[16px] font-extrabold text-black flex-shrink-0 relative z-10"
                style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)' }}
              >
                {i + 1}
              </div>
              <div>
                <h3 className="font-display text-[20px] font-bold text-white mb-2" style={{ letterSpacing: '-0.4px' }}>{step.title}</h3>
                <p className="text-[15px] text-[#888] leading-[1.7] max-w-[600px]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INCOME ── */}
      <section id="income" className="px-[5%] py-[100px]" style={{ background: 'var(--black)' }}>
        <div
          className="grid gap-[60px] items-center"
          style={{ gridTemplateColumns: '1fr 1fr' }}
        >
          {/* Income cards */}
          <div className="grid grid-cols-2 gap-4">
            {incomeCards.map((card) => (
              <div
                key={card.label}
                className={`rounded-2xl p-7 reveal ${card.featured ? 'col-span-2' : ''}`}
                style={{
                  background: card.featured
                    ? 'linear-gradient(135deg, rgba(74,222,128,0.06), rgba(245,166,35,0.04))'
                    : 'var(--card)',
                  border: `1px solid ${card.featured ? 'rgba(74,222,128,0.15)' : 'var(--border)'}`,
                  transition: 'border-color 0.3s, transform 0.3s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(74,222,128,0.25)';
                  el.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = card.featured ? 'rgba(74,222,128,0.15)' : 'var(--border)';
                  el.style.transform = 'translateY(0)';
                }}
              >
                <div className="text-[11px] uppercase text-[#888] mb-2" style={{ letterSpacing: '0.08em' }}>{card.label}</div>
                <div className="font-display font-extrabold" style={{ fontSize: '32px', color: '#4ade80', letterSpacing: '-1px', marginBottom: '4px' }}>
                  {card.val}
                </div>
                <div className="text-[13px] text-[#888]">{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Text */}
          <div>
            <h2
              className="font-display font-extrabold text-white"
              style={{ fontSize: 'clamp(28px,3.5vw,44px)', letterSpacing: '-1.5px', marginBottom: '20px', lineHeight: '1.15' }}
            >
              Turn your editing skills<br />
              into <em style={{ fontStyle: 'normal', color: 'var(--amber)' }}>reliable income.</em>
            </h2>
            <p className="text-[16px] text-[#888] leading-[1.8] mb-4 font-light">
              Top editors on Fewsion earn ₹50,000–₹2L/month working with D2C brands across beauty,
              food, fitness, and fashion. Every project comes with an AI-generated contract and escrow payment.
            </p>
            <p className="text-[16px] text-[#888] leading-[1.8] mb-6 font-light">
              No chasing invoices. No awkward rate negotiations. Just create, deliver, get paid.
            </p>
            <ul className="list-none flex flex-col gap-3">
              {['Escrow payment before you start editing', 'Automatic contract on every project', 'Rate benchmarking vs. market averages', 'AI-powered inbound project matching'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] text-[#f0ece4]">
                  <span
                    className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                    style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80' }}
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        id="page-cta"
        className="text-center px-[5%] py-[100px]"
        style={{
          background: 'linear-gradient(135deg, rgba(74,222,128,0.08) 0%, rgba(245,166,35,0.07) 50%, transparent 100%)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <h2
          className="font-display font-extrabold text-white"
          style={{ fontSize: 'clamp(32px,5vw,60px)', letterSpacing: '-2px', marginBottom: '16px', lineHeight: '1.1' }}
        >
          Ready to make editing<br />
          <em style={{ fontStyle: 'normal', color: 'var(--amber)' }}>your main income?</em>
        </h2>
        <p className="text-[18px] text-[#888] max-w-[480px] mx-auto mb-10 font-light">
          Join thousands of Indian editors already on the waitlist. Free forever to join.
        </p>
        <div className="flex gap-[14px] justify-center flex-wrap">
          <Link href="/signup?role=editor" className="btn-primary">Claim your editor profile →</Link>
          <Link href="/pricing" className="btn-ghost">See pricing</Link>
        </div>
      </section>

    </main>
  );
}

function EditorCard({ editor }: { editor: Editor }) {
  return (
    <div
      className="rounded-[20px] p-7 transition-all duration-300 cursor-default flex flex-col justify-between"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'rgba(74,222,128,0.3)';
        el.style.transform = 'translateY(-4px)';
        el.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'var(--border)';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
      }}
    >
      <div>
        {/* Header */}
        <div className="flex items-center gap-[14px] mb-[18px]">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-display font-extrabold text-[16px] text-black flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)' }}
          >
            {editor.name[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-[15px] font-bold text-white truncate">{editor.name}</div>
            <div className="text-[12px] text-[#888] truncate">{editor.cityState}</div>
          </div>
          <div
            className="flex-shrink-0 font-display text-[12px] font-bold px-3 py-[5px] rounded-full"
            style={{
              background: 'rgba(74,222,128,0.1)',
              color: '#4ade80',
              border: '1px solid rgba(74,222,128,0.2)',
            }}
          >
            {editor.score} Score
          </div>
        </div>

        {/* Bio */}
        <p className="text-[13px] text-[#aaa] leading-[1.6] mb-5 min-h-[40px]">
          {editor.oneLineBio}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-[6px] mb-5">
          {[
            { label: 'Experience', val: editor.experience },
            { label: 'Turnaround', val: editor.turnaround },
            { label: 'Rate (Short)', val: editor.rate },
          ].map((s) => (
            <div
              key={s.label}
              className="text-center rounded-lg py-[8px] px-2 flex flex-col justify-center"
              style={{ background: 'var(--card2)', border: '1px solid var(--border)' }}
            >
              <div className="font-display text-[12px] font-extrabold text-white truncate">{s.val}</div>
              <div className="text-[9px] text-[#555] mt-[2px]" style={{ letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Software & Skills */}
        <div className="flex flex-wrap gap-[6px] mb-6">
          {editor.software.slice(0, 2).map((sw) => (
            <span
              key={sw}
              className="text-[11px] px-2.5 py-[4px] rounded-full"
              style={{ color: 'var(--amber)', background: 'var(--amber-glow)', border: '1px solid rgba(245,166,35,0.2)' }}
            >
              {sw}
            </span>
          ))}
          {editor.formats.slice(0, 2).map((f) => (
            <span
              key={f}
              className="text-[11px] px-2.5 py-[4px] rounded-full"
              style={{ color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Action */}
      <Link
        href="/signup?role=brand"
        className="block text-center w-full py-[10px] rounded-full font-display text-[13px] font-bold no-underline transition-all duration-200"
        style={{ background: '#4ade80', color: '#000' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
      >
        Request collab
      </Link>
    </div>
  );
}

function EditorPreviewCard() {
  return (
    <div
      className="rounded-[20px] p-7"
      style={{
        background: 'var(--card)',
        border: '1px solid rgba(74,222,128,0.15)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
      }}
    >
      <div className="flex items-center gap-[14px] mb-[22px]">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center font-display font-extrabold text-[16px] text-black flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)' }}
        >
          R
        </div>
        <div>
          <div className="font-display text-[15px] font-bold text-white">Rohan Mehta</div>
          <div className="text-[12px] text-[#888]">Video Editor · Mumbai</div>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="font-display text-[14px] font-bold" style={{ color: 'var(--amber)' }}>4.9</span>
          <span className="text-[14px]">⭐</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-[6px] mb-[18px]">
        {['🎬', '✂️', '🎵'].map((em, i) => (
          <div
            key={i}
            className="rounded-lg flex items-center justify-center text-[22px] relative overflow-hidden"
            style={{ aspectRatio: '9/16', background: '#1a1a1a', border: '1px solid var(--border)' }}
          >
            {em}
            <span
              className="absolute bottom-[6px] right-[6px] text-[10px] px-[6px] py-[3px] rounded"
              style={{ background: 'rgba(0,0,0,0.6)', color: 'var(--white)' }}
            >
              ▶
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-[6px] mb-4">
        {['Reels', 'Color Grading', 'Motion Graphics'].map((skill) => (
          <span
            key={skill}
            className="text-[12px] px-3 py-[5px] rounded-full"
            style={{ color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}
          >
            {skill}
          </span>
        ))}
      </div>
      <div
        className="flex items-center justify-between rounded-xl px-4 py-[14px]"
        style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.2)' }}
      >
        <div>
          <div className="text-[13px] font-medium text-[#f0ece4]">Collab Invite — BeautyBrand</div>
          <div className="text-[11px] text-[#888] mt-[2px]">₹8,000 · 3 Reels · 7-day deadline</div>
        </div>
        <button
          className="font-display text-[12px] font-bold text-black px-4 py-2 rounded-full border-none cursor-pointer"
          style={{ background: 'var(--amber)' }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}

function FeatureCard({ feat }: { feat: { icon: string; title: string; desc: string } }) {
  return (
    <div
      className="relative p-[36px_30px] transition-all duration-300"
      style={{ background: 'var(--card)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--card2)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--card)'; }}
    >
      {/* top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"
        style={{ background: 'linear-gradient(90deg, #4ade80, var(--amber))' }}
      />
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-[22px] mb-[18px]"
        style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.15)' }}
      >
        {feat.icon}
      </div>
      <h3 className="font-display text-[17px] font-bold text-white mb-[10px]">{feat.title}</h3>
      <p className="text-[14px] text-[#888] leading-[1.7]">{feat.desc}</p>
    </div>
  );
}

const editorFeatures = [
  { icon: '🎬', title: 'Editor Portfolio', desc: 'Showcase your reels, long-form edits, and brand collabs in a beautiful, shareable portfolio that brands and creators actually look at.' },
  { icon: '💰', title: 'Escrow Payments', desc: 'Get paid before you start editing. The full project fee is locked in escrow — you deliver the work, the money releases automatically.' },
  { icon: '📋', title: 'AI Contracts', desc: 'Every project comes with a legally sound AI-generated contract covering revision rounds, usage rights, deadlines, and kill fees.' },
  { icon: '🤖', title: 'AI Project Matching', desc: 'Our algorithm matches you with brands and creators who need exactly your style — Reels, long-form, motion graphics, or multi-format.' },
  { icon: '📊', title: 'Performance Ratings', desc: 'Build a verified track record of on-time delivery and quality scores. High ratings unlock better projects at higher rates.' },
  { icon: '🔗', title: 'Creator Collabs', desc: 'Get direct collab invites from creators who need editing for brand campaigns. No cold pitching, no chasing leads.' },
];

const steps = [
  { title: 'Build your portfolio', desc: 'Upload your best reels, short-form videos, and brand case studies. Set your rate card, availability, and editing specialties.' },
  { title: 'Get matched to projects', desc: 'Our AI finds you editing projects from creators running brand campaigns that match your style and rate expectations.' },
  { title: 'Accept and start working', desc: 'Review the AI-generated contract, confirm project scope, and get started. The budget is already in escrow before you touch a frame.' },
  { title: 'Deliver, get rated, get paid', desc: 'Submit your deliverables through the platform. Approval triggers automatic escrow release — payment in 24 hours.' },
];

const incomeCards = [
  { label: 'Average monthly earning', val: '₹45,000', sub: 'Top editors on platform' },
  { label: 'Projects per month', val: '8–12', sub: 'For full-time editors' },
  { label: 'Average project value', val: '₹5,000–₹25,000', sub: 'Across all categories', featured: true },
  { label: 'Payment speed', val: '< 24hr', sub: 'After client approval' },
];
