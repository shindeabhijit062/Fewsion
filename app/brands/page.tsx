'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { CampaignMatchmaker } from '@/components/CampaignMatchmaker';
import { applicationsApi } from '@/lib/applicationsApi';
import { KYCModal, KycStatus, KycData } from '@/components/KYCModal';

export default function BrandsPage() {
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // KYC Gate state
  const [kycStatus, setKycStatus] = useState<KycStatus>('unverified');
  const [kycDetails, setKycDetails] = useState<KycData | null>(null);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [pendingCampaignId, setPendingCampaignId] = useState<number | string | null>(null);
  const [appliedMap, setAppliedMap] = useState<Record<string | number, boolean>>({});
  // Who is viewing: only creators can apply; brands see campaigns read-only
  const [viewer, setViewer] = useState<'loading' | 'guest' | 'creator' | 'brand' | 'other'>('loading');
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4500);
  };

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setViewer('guest');
      const [{ data: row }, { data: creator }] = await Promise.all([
        supabase.from('users').select('role').eq('id', user.id).maybeSingle(),
        supabase.from('creator_profiles').select('id').eq('user_id', user.id).maybeSingle(),
      ]);
      const role = creator ? 'creator' : row?.role === 'brand' ? 'brand' : row?.role === 'creator' ? 'creator' : 'other';
      setViewer(role);
      if (role === 'creator') {
        const ids = await applicationsApi.mine();
        setAppliedMap(Object.fromEntries(ids.map((id) => [id, true])));
      }
    })();
  }, []);

  // Save the application for real
  const submitApplication = async (campaignId: number | string) => {
    try {
      await applicationsApi.apply(String(campaignId));
      setAppliedMap((prev) => ({ ...prev, [campaignId]: true }));
      showNotice('✓ Application sent. The brand has been notified.');
    } catch (e) {
      showNotice((e as Error).message);
    }
  };

  useEffect(() => {
    async function checkKyc() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        let loadedStatus: KycStatus = 'unverified';
        let loadedDetails: KycData | null = null;
        try {
          const localStatus = localStorage.getItem(`fewsion_kyc_status_${user.id}`);
          const localDetails = localStorage.getItem(`fewsion_kyc_details_${user.id}`);
          if (localStatus) loadedStatus = localStatus as KycStatus;
          if (localDetails) loadedDetails = JSON.parse(localDetails);
        } catch (e) {}
        setKycStatus(loadedStatus);
        setKycDetails(loadedDetails);
      }
    }
    checkKyc();
  }, []);

  const handleKycSubmit = async (data: KycData) => {
    setKycDetails(data);
    setKycStatus('verified');
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      localStorage.setItem(`fewsion_kyc_status_${user.id}`, 'verified');
      localStorage.setItem(`fewsion_kyc_details_${user.id}`, JSON.stringify(data));
    }
    setKycModalOpen(false);

    if (pendingCampaignId) {
      const id = pendingCampaignId;
      setPendingCampaignId(null);
      await submitApplication(id);
    }
  };

  const handleApplyClick = (campaignId: number | string) => {
    if (viewer === 'guest') {
      window.location.href = `/login?next=${encodeURIComponent('/brands')}`;
      return;
    }
    if (viewer !== 'creator') {
      showNotice('Only creators can apply to campaigns.');
      return;
    }
    if (kycStatus !== 'verified') {
      setPendingCampaignId(campaignId);
      setKycModalOpen(true);
      return;
    }
    submitApplication(campaignId);
  };

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
          className="font-display font-extrabold text-[var(--text)]"
          style={{ fontSize: 'clamp(32px,4.5vw,52px)', letterSpacing: '-1.5px', lineHeight: '1.1', marginBottom: '14px' }}
        >
          Brands are hiring<br />
          <em style={{ fontStyle: 'normal', color: 'var(--amber)' }}>right now.</em>
        </h1>
        <p className="text-[16px] text-[var(--muted)] max-w-[560px] font-light">
          Browse live campaigns from verified D2C brands and apply directly. Mandatory KYC verification ensures trust and fast escrow payouts.
        </p>

        {/* Stats */}
        <div className="flex gap-8 mt-7 flex-wrap">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[26px] font-extrabold" style={{ color: 'var(--amber)' }}>
              {campaigns.length}
            </span>
            <span className="text-[13px] text-[var(--muted)]">live campaigns</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[26px] font-extrabold" style={{ color: 'var(--amber)' }}>
              {platforms.length}
            </span>
            <span className="text-[13px] text-[var(--muted)]">brands hiring</span>
          </div>
        </div>
      </div>

      {/* ── AI CAMPAIGN MATCHMAKER (for creators and visitors, not brands) ── */}
      {viewer !== 'brand' && viewer !== 'loading' && (
        <div className="mb-14">
          <CampaignMatchmaker
            title="AI Campaign Neural Matchmaker"
            subtitle="Fewsion AI ranks live brand campaigns against your creator profile: niche, platform, rate and engagement."
            canApply={viewer === 'creator'}
            beforeApply={(c) => {
              if (kycStatus === 'verified') return true;
              setPendingCampaignId(c.id);
              setKycModalOpen(true);
              return false;
            }}
            onApplied={(c) => setAppliedMap((prev) => ({ ...prev, [c.id]: true }))}
          />
        </div>
      )}

      {/* ── FILTERS ── */}
      <div className="flex gap-3 mb-7 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by brand or campaign title..."
          className="flex-1 min-w-0 basis-full sm:basis-auto sm:min-w-[200px] box-border"
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
          className="w-full sm:w-auto max-w-full box-border"
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
                <div className="w-10 h-10 rounded-full bg-[var(--card2)]" />
                <div className="flex-1">
                  <div className="h-4 bg-[var(--card2)] rounded w-2/3 mb-2" />
                  <div className="h-3 bg-[var(--card2)] rounded w-1/3" />
                </div>
                <div className="ml-auto w-12 h-5 bg-[var(--card2)] rounded-full" />
              </div>
              <div className="h-5 bg-[var(--card2)] rounded w-full my-1" />
              <div className="flex gap-[16px]">
                <div className="w-20 h-4 bg-[var(--card2)] rounded" />
                <div className="w-24 h-4 bg-[var(--card2)] rounded" />
              </div>
              <div className="h-10 bg-[var(--card2)] rounded-xl w-full mt-auto" />
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
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              isApplied={Boolean(appliedMap[campaign.id])}
              onApply={() => handleApplyClick(campaign.id)}
              blockedLabel={viewer === 'brand' || viewer === 'other' ? 'Creators only' : undefined}
            />
          ))}
        </div>
      )}

      {/* KYC Modal Gate */}
      {notice && (
        <div className="fixed bottom-5 left-1/2 z-[200] -translate-x-1/2 rounded-full border border-[var(--border2)] bg-[var(--card)] px-5 py-2.5 text-sm font-medium text-[var(--text)] shadow-xl">
          {notice}
        </div>
      )}

      <KYCModal
        isOpen={kycModalOpen}
        onClose={() => setKycModalOpen(false)}
        kycStatus={kycStatus}
        kycDetails={kycDetails}
        onSubmitKyc={handleKycSubmit}
      />
    </main>
  );
}

function CampaignCard({
  campaign,
  isApplied,
  onApply,
  blockedLabel,
}: {
  campaign: Campaign;
  isApplied?: boolean;
  onApply?: () => void;
  /** Shown instead of "Apply now" for viewers who can't apply (brands) */
  blockedLabel?: string;
}) {
  const [internalApplied, setInternalApplied] = useState(false);
  const applied = isApplied || internalApplied;

  const initials = (name: string) =>
    name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

  const handleApply = () => {
    if (onApply) {
      onApply();
    } else {
      setInternalApplied(true);
    }
  };

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
          <div className="text-[14px] font-semibold text-[var(--text)]">{campaign.brand}</div>
          <div className="text-[11.5px] text-[var(--muted)]">{campaign.industry}</div>
        </div>
        <div className="ml-auto status-live">Live</div>
      </div>

      {/* Title */}
      <div className="font-display text-[17px] font-bold text-[var(--text)] leading-[1.3]">{campaign.title}</div>

      {/* Meta */}
      <div className="flex flex-wrap gap-[10px_16px] text-[12.5px] text-[var(--muted)]">
        <span className="flex items-center gap-[5px]">📱 {campaign.platform}</span>
        <span className="flex items-center gap-[5px]">🗓️ Posted {campaign.posted}</span>
      </div>

      {/* Budget */}
      <div
        className="flex justify-between items-center rounded-[10px] px-[14px] py-3"
        style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.15)' }}
      >
        <span className="text-[11px] text-[var(--muted)] uppercase" style={{ letterSpacing: '0.05em' }}>Budget</span>
        <span className="font-display text-[18px] font-extrabold" style={{ color: 'var(--amber)' }}>
          ₹{campaign.budget.toLocaleString('en-IN')}
        </span>
      </div>

      {/* Apply button */}
      <button
        onClick={handleApply}
        disabled={applied || !!blockedLabel}
        className="w-full font-display text-[13.5px] font-bold py-[11px] rounded-full border-none cursor-pointer transition-all duration-200"
        style={{
          background: applied ? 'rgba(74,222,128,0.12)' : 'var(--amber)',
          color: applied ? '#4ade80' : '#000',
        }}
        onMouseEnter={(e) => { if (!applied) { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; } }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; (e.currentTarget as HTMLButtonElement).style.transform = ''; }}
      >
        {applied ? '✓ Applied' : blockedLabel || 'Apply now'}
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
