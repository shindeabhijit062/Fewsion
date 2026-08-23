'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

export default function BrandsPage() {
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
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
  }, [campaigns]); // Trigger when campaigns change

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const { data: campaignsData, error: campaignsError } = await supabase
          .from('campaign_briefs')
          .select('*')
          .eq('status_state', 'Live')
          .order('created_at', { ascending: false });

        if (campaignsError) throw campaignsError;

        if (campaignsData && campaignsData.length > 0) {
          const brandIds = [...new Set(campaignsData.map(c => c.brand_id).filter(Boolean))];
          let brandsMap: Record<string, { brand_name: string; industry: string }> = {};

          if (brandIds.length > 0) {
            const { data: brandsData, error: brandsError } = await supabase
              .from('brand_profiles')
              .select('user_id, brand_name, industry')
              .in('user_id', brandIds);

            if (brandsError) console.error('Error fetching brand profiles:', brandsError);
            else if (brandsData) {
              brandsData.forEach(b => {
                brandsMap[b.user_id] = { brand_name: b.brand_name, industry: b.industry };
              });
            }
          }

          const mapped: Campaign[] = campaignsData.map((c) => {
            const brandInfo = brandsMap[c.brand_id] || { brand_name: 'Fewsion Brand', industry: 'D2C Brand' };
            let postedDate = 'Recently';
            if (c.created_at) {
              const d = new Date(c.created_at);
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              postedDate = `${d.getDate()} ${months[d.getMonth()]}`;
            }
            return {
              id: c.id,
              brand: brandInfo.brand_name,
              industry: brandInfo.industry,
              title: c.campaign_title || 'Marketing Campaign',
              platform: c.target_platform || 'Instagram',
              budget: Number(c.budget_allocated) || 10000,
              posted: postedDate
            };
          });
          setCampaigns(mapped);
        } else {
          setCampaigns(mockCampaigns);
        }
      } catch (err) {
        console.error('Error loading campaigns:', err);
        setCampaigns(mockCampaigns);
      } finally {
        setLoading(false);
      }
    }
    loadCampaigns();
  }, []);

  const filtered = campaigns.filter((c) => {
    const matchSearch = !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.brand.toLowerCase().includes(search.toLowerCase());
    const matchPlatform = !platform || c.platform === platform;
    return matchSearch && matchPlatform;
  });

  const platforms = Array.from(new Set(campaigns.map((c) => c.platform)));

  return (
    <main
      className="overflow-x-hidden mx-auto"
      style={{ padding: '130px 5% 100px', maxWidth: '1200px' }}
    >
      {/* ── HERO ── */}
      <div className="mb-10">
        <div className="section-tag">Live Campaigns</div>
        <h1
          className="font-display font-extrabold text-white"
          style={{ fontSize: 'clamp(32px,4.5vw,52px)', letterSpacing: '-1.5px', lineHeight: '1.1', marginBottom: '14px' }}
        >
          Brands are hiring<br />
          <em style={{ fontStyle: 'normal', color: 'var(--amber)' }}>right now.</em>
        </h1>
        <p className="text-[16px] text-[#888] max-w-[560px] font-light">
          Browse live campaigns from verified D2C brands and apply directly. No cold DMs,
          no guesswork — every brief includes budget, platform, and scope up front.
        </p>

        {/* Stats */}
        <div className="flex gap-8 mt-7 flex-wrap">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[26px] font-extrabold" style={{ color: 'var(--amber)' }}>
              {campaigns.length}
            </span>
            <span className="text-[13px] text-[#888]">live campaigns</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[26px] font-extrabold" style={{ color: 'var(--amber)' }}>
              {platforms.length}
            </span>
            <span className="text-[13px] text-[#888]">brands hiring</span>
          </div>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="flex gap-3 mb-7 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by brand or campaign title..."
          className="flex-1 min-w-[200px]"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '50px',
            color: 'var(--text)',
            padding: '10px 18px',
            fontSize: '13.5px',
            fontFamily: 'var(--font-body)',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'rgba(245,166,35,0.4)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
        />
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '50px',
            color: 'var(--text)',
            padding: '10px 18px',
            fontSize: '13.5px',
            fontFamily: 'var(--font-body)',
            outline: 'none',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'rgba(245,166,35,0.4)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
        >
          <option value="">All platforms</option>
          {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* ── CAMPAIGN GRID ── */}
      {loading ? (
        <div
          className="grid gap-[18px]"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-[14px] p-6 rounded-2xl animate-pulse"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', minHeight: '220px' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-800" />
                <div className="flex-1">
                  <div className="h-4 bg-neutral-800 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-neutral-800 rounded w-1/3" />
                </div>
                <div className="ml-auto w-12 h-5 bg-neutral-800 rounded-full" />
              </div>
              <div className="h-5 bg-neutral-800 rounded w-full my-1" />
              <div className="flex gap-[16px]">
                <div className="w-20 h-4 bg-neutral-800 rounded" />
                <div className="w-24 h-4 bg-neutral-800 rounded" />
              </div>
              <div className="h-10 bg-neutral-800 rounded-xl w-full mt-auto" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state-box">
          <div className="text-[32px] mb-3">🔍</div>
          No live campaigns match right now. Check back soon or clear your filters.
        </div>
      ) : (
        <div
          className="grid gap-[18px]"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}
        >
          {filtered.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </main>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [applied, setApplied] = useState(false);

  const initials = (name: string) =>
    name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

  return (
    <div
      className="flex flex-col gap-[14px] p-6 rounded-2xl"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        transition: 'border-color 0.25s, transform 0.25s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'rgba(245,166,35,0.25)';
        el.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'var(--border)';
        el.style.transform = 'translateY(0)';
      }}
    >
      {/* Brand row */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-display font-extrabold text-black text-[14px] flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--amber2), var(--amber))' }}
        >
          {initials(campaign.brand)}
        </div>
        <div>
          <div className="text-[14px] font-semibold text-white">{campaign.brand}</div>
          <div className="text-[11.5px] text-[#888]">{campaign.industry}</div>
        </div>
        <div className="ml-auto status-live">Live</div>
      </div>

      {/* Title */}
      <div className="font-display text-[17px] font-bold text-white leading-[1.3]">{campaign.title}</div>

      {/* Meta */}
      <div className="flex flex-wrap gap-[10px_16px] text-[12.5px] text-[#888]">
        <span className="flex items-center gap-[5px]">📱 {campaign.platform}</span>
        <span className="flex items-center gap-[5px]">🗓️ Posted {campaign.posted}</span>
      </div>

      {/* Budget */}
      <div
        className="flex justify-between items-center rounded-[10px] px-[14px] py-3"
        style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.15)' }}
      >
        <span className="text-[11px] text-[#888] uppercase" style={{ letterSpacing: '0.05em' }}>Budget</span>
        <span className="font-display text-[18px] font-extrabold" style={{ color: 'var(--amber)' }}>
          ₹{campaign.budget.toLocaleString('en-IN')}
        </span>
      </div>

      {/* Apply button */}
      <button
        onClick={() => { if (!applied) setApplied(true); }}
        disabled={applied}
        className="w-full font-display text-[13.5px] font-bold py-[11px] rounded-full border-none cursor-pointer transition-all duration-200"
        style={{
          background: applied ? 'rgba(74,222,128,0.12)' : 'var(--amber)',
          color: applied ? '#4ade80' : '#000',
        }}
        onMouseEnter={(e) => { if (!applied) { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; } }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; (e.currentTarget as HTMLButtonElement).style.transform = ''; }}
      >
        {applied ? '✓ Applied' : 'Apply now'}
      </button>
    </div>
  );
}

interface Campaign {
  id: number | string; brand: string; industry: string;
  title: string; platform: string; budget: number; posted: string;
}

const mockCampaigns: Campaign[] = [
  { id: 1, brand: 'BrewBox India', industry: 'Food & Beverage', title: 'Summer Cold Brew Campaign — Reels Series', platform: 'Instagram', budget: 15000, posted: '28 Jul' },
  { id: 2, brand: 'GlowNest', industry: 'Skincare', title: 'Skincare Routine UGC — 5 Short Videos', platform: 'Instagram', budget: 22000, posted: '27 Jul' },
  { id: 3, brand: 'FitFuel', industry: 'Health & Fitness', title: 'Pre-Workout Review Shorts', platform: 'YouTube', budget: 18000, posted: '26 Jul' },
  { id: 4, brand: 'HomeNest Decor', industry: 'Home & Living', title: 'Room Transformation Before/After Reel', platform: 'Instagram', budget: 12000, posted: '25 Jul' },
  { id: 5, brand: 'NomadPacks', industry: 'Travel Accessories', title: 'Backpack Unboxing & Travel Vlog', platform: 'YouTube', budget: 25000, posted: '24 Jul' },
  { id: 6, brand: 'DesiDrip Coffee', industry: 'Food & Beverage', title: 'Morning Ritual — Cafe-style Coffee Reels', platform: 'Instagram', budget: 9000, posted: '23 Jul' },
];
