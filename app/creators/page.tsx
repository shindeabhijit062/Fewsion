import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { AIMatchmaker } from '@/components/AIMatchmaker';

const NICHES = ['All', 'Beauty', 'Fitness', 'Tech', 'Food', 'Travel', 'Finance', 'Gaming', 'Fashion'];
const PLATFORMS = ['All', 'Instagram', 'YouTube', 'Multi-platform'];

function formatFollowers(count: number | null | undefined): string {
  if (!count) return '—';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${Math.round(count / 1000)}K`;
  return count.toString();
}

function formatCTR(rate: number | null | undefined): string {
  if (rate === null || rate === undefined) return '0%';
  return `${Number(rate).toFixed(1)}%`;
}

function getNicheColors(niche: string) {
  const n = niche.toLowerCase();
  if (n.includes('beauty')) return { colorA: '#a855f7', colorB: '#ec4899' };
  if (n.includes('fitness')) return { colorA: '#F5A623', colorB: '#FF6B35' };
  if (n.includes('tech')) return { colorA: '#3b82f6', colorB: '#06b6d4' };
  if (n.includes('food')) return { colorA: '#22c55e', colorB: '#14b8a6' };
  if (n.includes('travel')) return { colorA: '#f59e0b', colorB: '#d97706' };
  if (n.includes('fashion')) return { colorA: '#ec4899', colorB: '#8b5cf6' };
  if (n.includes('gaming')) return { colorA: '#10b981', colorB: '#06b6d4' };
  if (n.includes('finance')) return { colorA: '#6366f1', colorB: '#8b5cf6' };
  return { colorA: '#F5A623', colorB: '#FF6B35' }; // default
}

export default function CreatorsPage() {
  const [activeNiche, setActiveNiche] = useState('All');
  const [activePlatform, setActivePlatform] = useState('All');
  const [search, setSearch] = useState('');
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [creators]); // Run observer when creators change

  useEffect(() => {
    async function getCreators() {
      try {
        const { data, error } = await supabase
          .from('creator_profiles')
          .select('*')
          .order('ai_total_score', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          const mapped: Creator[] = data.map((c) => {
            const colors = getNicheColors(c.primary_niche || 'General');
            return {
              id: c.id,
              name: c.creator_name || 'Creator Name',
              platform: c.primary_platform || 'Instagram',
              niche: c.primary_niche || 'General',
              followers: formatFollowers(c.follower_count),
              ctr: formatCTR(c.engagement_rate),
              rate: c.rate_per_integration ? `₹${Number(c.rate_per_integration).toLocaleString('en-IN')}` : '₹8K',
              score: c.ai_total_score || 70,
              verified: true,
              colorA: colors.colorA,
              colorB: colors.colorB,
            };
          });
          setCreators(mapped);
        } else {
          // Fallback to mock data if table is empty
          setCreators(mockCreators);
        }
      } catch (err) {
        console.error('Error loading creators:', err);
        setCreators(mockCreators);
      } finally {
        setLoading(false);
      }
    }
    getCreators();
  }, []);

  const filtered = creators.filter((c) => {
    const matchNiche = activeNiche === 'All' || c.niche === activeNiche;
    const matchPlatform = activePlatform === 'All' || c.platform === activePlatform;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.niche.toLowerCase().includes(search.toLowerCase());
    return matchNiche && matchPlatform && matchSearch;
  });

  return (
    <main className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section
        className="relative text-center overflow-hidden"
        style={{ padding: '130px 5% 60px' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(245,166,35,0.1) 0%, transparent 60%)' }}
        />
        <div
          className="absolute inset-0 bg-grid pointer-events-none"
          style={{ maskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, black 20%, transparent 100%)' }}
        />

        <div className="relative z-10 max-w-[720px] mx-auto">
          <div
            className="inline-flex items-center gap-2 rounded-full px-[18px] py-[7px] text-[13px] font-medium mb-7"
            style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)', color: 'var(--amber)', letterSpacing: '0.03em' }}
          >
            Discover Creators
          </div>
          <h1
            className="font-display font-extrabold text-white mb-5"
            style={{ fontSize: 'clamp(40px,6vw,76px)', letterSpacing: '-2px', lineHeight: '1.05' }}
          >
            India&apos;s best{' '}
            <em className="text-gradient-amber" style={{ fontStyle: 'normal' }}>UGC creators,</em>
            <br />ranked by real results.
          </h1>
          <p className="text-[19px] text-[#888] font-light max-w-[540px] mx-auto leading-[1.7] mb-10">
            Every creator on Fewsion is verified by performance — not follower count. Find your match by niche,
            platform, and Creator Score.
          </p>
          <div className="flex gap-[14px] justify-center flex-wrap">
            <Link href="/signup?role=brand" className="btn-primary">Find creators for my brand →</Link>
            <Link href="/signup?role=creator" className="btn-ghost">Join as a Creator</Link>
          </div>
        </div>
      </section>

      {/* ── AI MATCHMAKER DEMO SECTION ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
        <AIMatchmaker
          title="Match Talent with Fewsion AI Engine"
          subtitle="Real-time neural recommendation system matching brands and creators by niche, engagement VTR, and budget."
        />
      </section>

      {/* ── SEARCH + FILTERS ── */}
      <section className="px-[5%] pb-10 relative z-10">
        {/* Search */}
        <div className="max-w-[560px] mx-auto mb-7 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] pointer-events-none">🔍</span>
          <input
            type="text"
            placeholder="Search by name or niche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-5 py-[13px] rounded-full text-[14px] outline-none"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontFamily: 'var(--font-body)',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(245,166,35,0.4)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
          />
        </div>

        {/* Niche filters */}
        <div className="flex gap-2 justify-center flex-wrap mb-4">
          {NICHES.map((n) => (
            <button
              key={n}
              onClick={() => setActiveNiche(n)}
              className="text-[13px] font-medium px-[18px] py-[8px] rounded-full border-none cursor-pointer transition-all duration-200"
              style={{
                background: activeNiche === n ? 'var(--amber)' : 'var(--card)',
                color: activeNiche === n ? '#000' : 'var(--muted)',
                border: `1px solid ${activeNiche === n ? 'var(--amber)' : 'var(--border)'}`,
                fontFamily: 'var(--font-body)',
              }}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Platform filters */}
        <div className="flex gap-2 justify-center flex-wrap">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setActivePlatform(p)}
              className="text-[12px] px-[15px] py-[6px] rounded-full border-none cursor-pointer transition-all duration-200"
              style={{
                background: activePlatform === p ? 'rgba(255,107,53,0.15)' : 'transparent',
                color: activePlatform === p ? 'var(--amber2)' : 'var(--muted)',
                border: `1px solid ${activePlatform === p ? 'rgba(255,107,53,0.3)' : 'var(--border)'}`,
                fontFamily: 'var(--font-body)',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      {/* ── CREATOR GRID ── */}
      <section className="px-[5%] pb-[100px] relative z-10">
        {loading ? (
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-6 animate-pulse"
                style={{ background: 'var(--card)', border: '1px solid var(--border)', minHeight: '220px' }}
              >
                <div className="flex items-center gap-3 mb-[18px]">
                  <div className="w-11 h-11 rounded-full bg-neutral-800" />
                  <div className="flex-1">
                    <div className="h-4 bg-neutral-800 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-neutral-800 rounded w-1/3" />
                  </div>
                  <div className="w-8 h-6 bg-neutral-800 rounded-full" />
                </div>
                <div className="grid grid-cols-3 gap-[6px] mb-4">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="rounded-lg py-[10px] bg-neutral-800 h-12" />
                  ))}
                </div>
                <div className="h-6 bg-neutral-800 rounded-full w-24" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state-box">
            <div className="text-[32px] mb-3">🔎</div>
            No creators found for this combination. Try clearing the filters.
          </div>
        ) : (
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
          >
            {filtered.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        )}
      </section>

      {/* ── HOW MATCHING WORKS ── */}
      <section className="px-[5%] py-[100px]" style={{ background: 'var(--deep)' }}>
        <div className="section-tag reveal">AI Matching</div>
        <h2 className="section-title reveal">
          We match brands to creators<br />
          <em>by performance, not popularity.</em>
        </h2>
        <p className="section-sub reveal reveal-delay-1">
          Fewsion&apos;s Creator Score combines view-through rate, CTR, engagement rate, posting consistency,
          and brand collaboration history into a single verifiable metric.
        </p>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {howCards.map((card, i) => (
            <div
              key={card.title}
              className={`reveal ${i === 1 ? 'reveal-delay-1' : i === 2 ? 'reveal-delay-2' : ''} card-base p-7`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] mb-5"
                style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)' }}
              >
                {card.icon}
              </div>
              <h3 className="font-display text-[16px] font-bold text-white mb-2">{card.title}</h3>
              <p className="text-[14px] text-[#888] leading-[1.7]">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="text-center px-[5%] py-[100px]"
        style={{
          background: 'linear-gradient(135deg, rgba(245,166,35,0.1) 0%, rgba(255,107,53,0.08) 50%, transparent 100%)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <h2
          className="font-display font-extrabold text-white"
          style={{ fontSize: 'clamp(32px,5vw,60px)', letterSpacing: '-2px', marginBottom: '16px', lineHeight: '1.1' }}
        >
          Find your next<br />
          <em style={{ fontStyle: 'normal', color: 'var(--amber)' }}>high-performing creator.</em>
        </h2>
        <p className="text-[18px] text-[#888] max-w-[480px] mx-auto mb-10 font-light">
          Access 1,200+ verified creators and launch your first campaign — free to start.
        </p>
        <div className="flex gap-[14px] justify-center flex-wrap">
          <Link href="/signup?role=brand" className="btn-primary">Start your first campaign →</Link>
          <Link href="/pricing" className="btn-ghost">View pricing</Link>
        </div>
      </section>

    </main>
  );
}

function CreatorCard({ creator }: { creator: Creator }) {
  const scoreColor = creator.score >= 80 ? '#4ade80' : creator.score >= 60 ? 'var(--amber)' : '#888';

  return (
    <div
      className="rounded-2xl p-6 transition-all duration-300 cursor-default"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'rgba(245,166,35,0.25)';
        el.style.transform = 'translateY(-4px)';
        el.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'var(--border)';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-[18px]">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center font-display font-extrabold text-black text-[16px] flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${creator.colorA}, ${creator.colorB})` }}
        >
          {creator.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-[15px] font-bold text-white truncate">{creator.name}</div>
          <div className="text-[12px] text-[#888]">{creator.platform}</div>
        </div>
        <div
          className="flex-shrink-0 font-display text-[12px] font-bold px-3 py-[5px] rounded-full"
          style={{
            background: `${scoreColor}15`,
            color: scoreColor,
            border: `1px solid ${scoreColor}35`,
          }}
        >
          {creator.score}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-[6px] mb-4">
        {[
          { label: 'Followers', val: creator.followers },
          { label: 'CTR', val: creator.ctr },
          { label: 'Collab', val: creator.rate },
        ].map((s) => (
          <div
            key={s.label}
            className="text-center rounded-lg py-[10px] px-2"
            style={{ background: 'var(--card2)', border: '1px solid var(--border)' }}
          >
            <div className="font-display text-[15px] font-extrabold text-white">{s.val}</div>
            <div className="text-[10px] text-[#555] mt-[2px]" style={{ letterSpacing: '0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Niche chip */}
      <div className="flex flex-wrap gap-[6px] mb-4">
        <span
          className="text-[11px] px-3 py-[5px] rounded-full"
          style={{ color: 'var(--amber)', background: 'var(--amber-glow)', border: '1px solid rgba(245,166,35,0.2)' }}
        >
          {creator.niche}
        </span>
        {creator.verified && (
          <span
            className="text-[11px] px-3 py-[5px] rounded-full"
            style={{ color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}
          >
            ✓ Verified
          </span>
        )}
      </div>

      <Link
        href="/signup?role=brand"
        className="block text-center w-full py-[10px] rounded-full font-display text-[13px] font-bold no-underline transition-all duration-200"
        style={{ background: 'var(--amber)', color: '#000' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
      >
        Request collab
      </Link>
    </div>
  );
}

interface Creator {
  id: number | string; name: string; platform: string; niche: string;
  followers: string; ctr: string; rate: string; score: number;
  verified: boolean; colorA: string; colorB: string;
}

const mockCreators: Creator[] = [
  { id: 1, name: 'Aarav Mehta', platform: 'Instagram', niche: 'Fitness', followers: '68K', ctr: '6.4%', rate: '₹12K', score: 88, verified: true, colorA: '#F5A623', colorB: '#FF6B35' },
  { id: 2, name: 'Priya Singh', platform: 'Instagram', niche: 'Beauty', followers: '142K', ctr: '5.8%', rate: '₹22K', score: 84, verified: true, colorA: '#a855f7', colorB: '#ec4899' },
  { id: 3, name: 'Rohan Kumar', platform: 'YouTube', niche: 'Tech', followers: '89K', ctr: '7.2%', rate: '₹18K', score: 91, verified: true, colorA: '#3b82f6', colorB: '#06b6d4' },
  { id: 4, name: 'Sneha Joshi', platform: 'Instagram', niche: 'Food', followers: '54K', ctr: '8.1%', rate: '₹9K', score: 79, verified: true, colorA: '#22c55e', colorB: '#14b8a6' },
  { id: 5, name: 'Dev Kapoor', platform: 'Multi-platform', niche: 'Travel', followers: '210K', ctr: '4.9%', rate: '₹35K', score: 72, verified: false, colorA: '#f59e0b', colorB: '#d97706' },
  { id: 6, name: 'Ananya Rao', platform: 'Instagram', niche: 'Fashion', followers: '95K', ctr: '6.0%', rate: '₹16K', score: 82, verified: true, colorA: '#ec4899', colorB: '#8b5cf6' },
  { id: 7, name: 'Karan Sharma', platform: 'YouTube', niche: 'Gaming', followers: '177K', ctr: '5.5%', rate: '₹28K', score: 76, verified: true, colorA: '#10b981', colorB: '#06b6d4' },
  { id: 8, name: 'Pooja Nair', platform: 'Instagram', niche: 'Fitness', followers: '32K', ctr: '9.4%', rate: '₹7K', score: 93, verified: true, colorA: '#f97316', colorB: '#eab308' },
  { id: 9, name: 'Vikram Desai', platform: 'Multi-platform', niche: 'Finance', followers: '63K', ctr: '4.2%', rate: '₹11K', score: 68, verified: false, colorA: '#6366f1', colorB: '#8b5cf6' },
];

const howCards = [
  { icon: '📊', title: 'Creator Score', desc: 'A composite performance metric combining CTR, engagement, consistency, and brand collab history. Ranges 0–100.' },
  { icon: '🤖', title: 'AI Matching', desc: 'Our matching engine pairs brands with creators based on niche overlap, audience demographics, and historical campaign fit.' },
  { icon: '🔒', title: 'Escrow Protection', desc: 'Every collaboration is escrow-protected. The brand\'s payment is locked before creators start work — guaranteed release upon approval.' },
];
