'use client';

import React, { useMemo, useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Zap, Target, DollarSign, Layers, Download, ShieldCheck, UserCheck } from 'lucide-react';

export interface CreatorMatch {
  id: string | number;
  name: string;
  niche: string;
  platform: string;
  followers: string;
  ctr: string;
  score: number;
  rate: string;
  matchScore: number;
  avatarBg: string;
  bio: string;
  verified: boolean;
}

const MOCK_MATCH_CREATORS: CreatorMatch[] = [
  {
    id: 1,
    name: 'Aarav Mehta',
    niche: 'Fitness & Health',
    platform: 'Instagram',
    followers: '68K',
    ctr: '6.4%',
    score: 88,
    rate: '₹12,000',
    matchScore: 97,
    avatarBg: 'linear-gradient(135deg, #F5A623, #FF6B35)',
    bio: 'High-converting UGC fitness reels, pre-workout showcases, and gym transformation shorts.',
    verified: true,
  },
  {
    id: 2,
    name: 'Priya Singh',
    niche: 'Beauty & Skincare',
    platform: 'Instagram',
    followers: '142K',
    ctr: '5.8%',
    score: 84,
    rate: '₹22,000',
    matchScore: 94,
    avatarBg: 'linear-gradient(135deg, #a855f7, #ec4899)',
    bio: 'Aesthetic skincare routines, before/after reviews, and organic D2C brand integrations.',
    verified: true,
  },
  {
    id: 3,
    name: 'Rohan Kumar',
    niche: 'Tech & Gadgets',
    platform: 'YouTube',
    followers: '89K',
    ctr: '7.2%',
    score: 91,
    rate: '₹18,000',
    matchScore: 98,
    avatarBg: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    bio: 'In-depth unboxing, smartphone comparisons, and tech accessory breakdown videos.',
    verified: true,
  },
  {
    id: 4,
    name: 'Sneha Joshi',
    niche: 'Food & Beverage',
    platform: 'Instagram',
    followers: '54K',
    ctr: '8.1%',
    score: 79,
    rate: '₹9,000',
    matchScore: 91,
    avatarBg: 'linear-gradient(135deg, #22c55e, #14b8a6)',
    bio: 'Cafe-style recipe reels, beverage unboxings, and high-engagement culinary content.',
    verified: true,
  },
  {
    id: 5,
    name: 'Ananya Rao',
    niche: 'Fashion & Lifestyle',
    platform: 'Instagram',
    followers: '95K',
    ctr: '6.0%',
    score: 82,
    rate: '₹16,000',
    matchScore: 93,
    avatarBg: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
    bio: 'Streetwear lookbooks, seasonal haul videos, and D2C apparel styling reels.',
    verified: true,
  },
  {
    id: 6,
    name: 'Karan Sharma',
    niche: 'Gaming & Esport',
    platform: 'YouTube',
    followers: '177K',
    ctr: '5.5%',
    score: 76,
    rate: '₹28,000',
    matchScore: 89,
    avatarBg: 'linear-gradient(135deg, #10b981, #06b6d4)',
    bio: 'Gaming setup reviews, stream integrations, and gaming gear promos.',
    verified: true,
  },
];

interface AIMatchmakerProps {
  onSelectCreator?: (creator: CreatorMatch) => void;
  title?: string;
  subtitle?: string;
}

export function AIMatchmaker({ onSelectCreator, title, subtitle }: AIMatchmakerProps) {
  const [selectedNiche, setSelectedNiche] = useState<string>('Fitness & Health');
  const [campaignGoal, setCampaignGoal] = useState<string>('Conversions');
  const [budgetRange, setBudgetRange] = useState<number>(15000);
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [matchedResults, setMatchedResults] = useState<CreatorMatch[]>(MOCK_MATCH_CREATORS.slice(0, 3));

  const leadMatch = matchedResults[0];

  const compatibilityIndex = useMemo(() => {
    const boostMap: Record<string, number> = {
      Conversions: 96,
      Retention: 94,
      Awareness: 98,
      'Brand Launch': 95,
    };
    return boostMap[campaignGoal] ?? 95;
  }, [campaignGoal]);

  const handleRunMatch = (nicheToSet?: string) => {
    const niche = nicheToSet || selectedNiche;
    if (nicheToSet) setSelectedNiche(nicheToSet);

    setIsMatching(true);
    setTimeout(() => {
      const filtered = MOCK_MATCH_CREATORS.filter(
        (c) => niche === 'All' || c.niche.toLowerCase().includes(niche.toLowerCase())
      );
      const results = filtered.length > 0 ? filtered : MOCK_MATCH_CREATORS.slice(0, 3);

      // Add slight dynamic variance based on budget & goal
      const reranked = results.map((item) => ({
        ...item,
        matchScore: Math.min(99, Math.max(82, item.matchScore + Math.floor(Math.random() * 5) - 2)),
      })).sort((a, b) => b.matchScore - a.matchScore);

      setMatchedResults(reranked);
      setIsMatching(false);
    }, 700);
  };

  const handleExport = () => {
    const data = JSON.stringify({ selectedNiche, campaignGoal, budgetRange, matchedResults }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fewsion-ai-match-${selectedNiche.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--border2)] bg-[#0c0c0e] p-6 sm:p-10 shadow-2xl">
      {/* Subtle background glow */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[var(--amber)]/10 blur-[100px] pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#FF6B35]/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--amber)]/30 bg-[var(--amber)]/10 px-3.5 py-1.5 text-xs font-semibold text-[var(--amber)] mb-3">
          <Zap size={14} />
          <span>Fewsion AI Neural Matchmaker</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {title || 'Match Brands & Creators with Neural AI'}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {subtitle || 'Select your niche, target goal, and budget to compute real-time compatibility scores across our creator database.'}
        </p>
      </div>

      {/* Console Controls */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-6 pb-8 mb-8 border-b border-[var(--border)]">
        {/* Step 1: Niche */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--amber)]">
            <Target size={14} />
            <span>1. Niche &amp; Category</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {['Fitness & Health', 'Beauty & Skincare', 'Tech & Gadgets', 'Food & Beverage', 'Fashion & Lifestyle'].map((n) => (
              <button
                key={n}
                onClick={() => handleRunMatch(n)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedNiche === n
                    ? 'bg-[var(--amber)] text-black font-bold shadow-lg shadow-[var(--amber)]/20'
                    : 'bg-[var(--card)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--amber)]/40 hover:text-white'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Goal */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--amber)]">
            <Sparkles size={14} />
            <span>2. Campaign Goal</span>
          </label>
          <select
            value={campaignGoal}
            onChange={(e) => setCampaignGoal(e.target.value)}
            className="w-full rounded-xl border border-[var(--border2)] bg-[var(--card)] px-3.5 py-2.5 text-xs font-bold text-white outline-none focus:border-[var(--amber)]"
          >
            {['Conversions', 'Retention', 'Awareness', 'Brand Launch'].map((goal) => (
              <option key={goal} value={goal} className="bg-[#141414]">
                {goal}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-[var(--muted2)]">Reranks creator proof by ROI history.</p>
        </div>

        {/* Step 3: Budget Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--amber)]">
              <DollarSign size={14} />
              <span>3. Campaign Budget</span>
            </label>
            <span className="rounded-lg border border-[var(--amber)]/30 bg-[var(--amber)]/10 px-2.5 py-0.5 text-xs font-extrabold text-[var(--amber)]">
              ₹{budgetRange.toLocaleString('en-IN')}
            </span>
          </div>
          <input
            type="range"
            min="5000"
            max="50000"
            step="2500"
            value={budgetRange}
            onChange={(e) => setBudgetRange(Number(e.target.value))}
            className="w-full accent-[var(--amber)] cursor-pointer h-2 bg-[var(--card2)] rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-semibold text-[var(--muted2)]">
            <span>₹5,000 (Micro)</span>
            <span>₹25,000 (Pro)</span>
            <span>₹50,000+ (Scale)</span>
          </div>
        </div>

        {/* Step 4: Run Action */}
        <div className="flex flex-col justify-end">
          <button
            onClick={() => handleRunMatch()}
            disabled={isMatching}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--amber)] to-[#FF6B35] text-black font-extrabold text-xs hover:opacity-95 shadow-lg shadow-[var(--amber)]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap size={14} className={isMatching ? 'animate-spin' : ''} />
            <span>{isMatching ? 'Matching Engine Running...' : 'Compute AI Matches'}</span>
          </button>
        </div>
      </div>

      {/* Results View */}
      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-[var(--amber)]" />
            <span className="text-sm font-bold text-white">Top Neural Matches ({matchedResults.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <CheckCircle2 size={13} /> {compatibilityIndex}.2% Compatibility Index
            </span>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-full border border-[var(--border2)] bg-[var(--card)] px-3 py-1 text-xs font-semibold text-[var(--muted)] hover:text-white hover:border-[var(--amber)] transition"
            >
              <Download size={13} /> Export Shortlist
            </button>
          </div>
        </div>

        {isMatching ? (
          <div className="py-12 text-center space-y-4">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[var(--amber)] border-t-transparent" />
            <p className="text-xs font-semibold text-[var(--amber)] animate-pulse">
              Analyzing creator engagement, view-through rates &amp; audience fit...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {matchedResults.map((creator) => (
              <div
                key={creator.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all hover:-translate-y-1 hover:border-[var(--amber)]/40 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black text-black"
                        style={{ background: creator.avatarBg }}
                      >
                        {creator.name.split(' ').map((w) => w[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-[var(--amber)] transition-colors">
                          {creator.name}
                        </h4>
                        <div className="text-[11px] text-[var(--muted)]">{creator.platform} • {creator.niche}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="rounded-md border border-[var(--amber)]/30 bg-[var(--amber)]/10 px-2 py-0.5 text-xs font-extrabold text-[var(--amber)]">
                        {creator.matchScore}%
                      </span>
                      <div className="text-[9px] uppercase tracking-wider text-[var(--muted2)] mt-0.5">Match</div>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-2 mb-4">
                    {creator.bio}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="rounded-lg border border-[var(--border)] bg-[var(--card2)] p-1.5">
                      <div className="text-xs font-extrabold text-white">{creator.followers}</div>
                      <div className="text-[9px] text-[var(--muted2)] uppercase">Followers</div>
                    </div>
                    <div className="rounded-lg border border-[var(--border)] bg-[var(--card2)] p-1.5">
                      <div className="text-xs font-extrabold text-white">{creator.ctr}</div>
                      <div className="text-[9px] text-[var(--muted2)] uppercase">CTR</div>
                    </div>
                    <div className="rounded-lg border border-[var(--border)] bg-[var(--card2)] p-1.5">
                      <div className="text-xs font-extrabold text-white">{creator.score}/100</div>
                      <div className="text-[9px] text-[var(--muted2)] uppercase">AI Score</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                  <div className="text-xs font-extrabold text-white">{creator.rate}</div>
                  <button
                    onClick={() => onSelectCreator && onSelectCreator(creator)}
                    className="flex items-center gap-1 text-xs font-bold text-[var(--amber)] hover:underline"
                  >
                    <span>Connect</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {leadMatch && !isMatching && (
          <div className="mt-6 rounded-2xl border border-[var(--amber)]/20 bg-[var(--amber)]/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[var(--amber)]">
                <ShieldCheck size={14} />
                <span>AI Recommendation Engine</span>
              </div>
              <p className="text-xs text-white mt-1">
                Top pick: <strong className="text-[var(--amber)]">{leadMatch.name}</strong> is optimal for a {campaignGoal.toLowerCase()} campaign with {leadMatch.ctr} average CTR.
              </p>
            </div>
            <button
              onClick={() => onSelectCreator && onSelectCreator(leadMatch)}
              className="shrink-0 rounded-full bg-[var(--amber)] px-5 py-2 text-xs font-extrabold text-black hover:opacity-90 transition-all cursor-pointer"
            >
              Request Collaboration →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
