'use client';

import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BrainCircuit,
  Check,
  Loader2,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  IndianRupee,
  MonitorPlay,
  CalendarDays,
  Send,
  Zap,
} from 'lucide-react';
import { NICHES, NeuralScanner, ScoreRing } from '@/components/AIMatchmaker';
import { applicationsApi, matchCampaigns } from '@/lib/applicationsApi';

// AI Campaign Matchmaker — for creators. Ranks live brand campaigns against
// the creator's profile and lets them apply in one click.

export interface CampaignMatch {
  id: string;
  title: string;
  brandId: string;
  brandName: string;
  industry: string | null;
  description: string | null;
  platform: string | null;
  budget: number | null;
  postedAt: string | null;
  applied: boolean;
  matchScore: number;
  reason: string;
  signals: { niche: number; platform: number; budget: number; engagement: number };
}

const PLATFORMS = ['Any', 'Instagram', 'YouTube', 'Both'];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const inr = (n: number | null) => (n == null ? '—' : `₹${n.toLocaleString('en-IN')}`);

type Phase = 'idle' | 'running' | 'done' | 'error';

interface CampaignMatchmakerProps {
  title?: string;
  subtitle?: string;
  /** Not signed in as a creator: Apply sends them to log in instead */
  canApply?: boolean;
  /** Runs before applying (e.g. a KYC check). Return false to stop. */
  beforeApply?: (campaign: CampaignMatch) => boolean | Promise<boolean>;
  onApplied?: (campaign: CampaignMatch) => void;
}

export function CampaignMatchmaker({ title, subtitle, canApply = true, beforeApply, onApplied }: CampaignMatchmakerProps) {
  const [niche, setNiche] = useState('Any');
  const [platform, setPlatform] = useState('Any');
  const [minBudget, setMinBudget] = useState(0);

  const [phase, setPhase] = useState<Phase>('idle');
  const [step, setStep] = useState(0);
  const [matches, setMatches] = useState<CampaignMatch[]>([]);
  const [scanned, setScanned] = useState<number | null>(null);
  const [aiExplained, setAiExplained] = useState(false);
  const [profileUsed, setProfileUsed] = useState<{ niche?: string; platform?: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const runId = useRef(0);

  const steps = [
    'Reading your creator profile',
    scanned != null ? `Scanning ${scanned} live campaign${scanned === 1 ? '' : 's'}` : 'Scanning live campaigns',
    niche === 'Any' ? 'Matching brands to your niche' : `Matching brands looking for ${niche}`,
    'Checking platforms and budgets against your rate',
    'Ranking campaigns & writing explanations',
  ];

  const run = async () => {
    const id = ++runId.current;
    setPhase('running');
    setStep(0);
    setMatches([]);
    setScanned(null);
    setErrorMsg('');

    const request = matchCampaigns({ niche, platform, minBudget });
    request.then((d) => id === runId.current && setScanned(d.scanned)).catch(() => {});

    try {
      for (let i = 0; i < steps.length - 1; i++) {
        if (id !== runId.current) return;
        setStep(i);
        await sleep(520 + Math.random() * 260);
      }
      setStep(steps.length - 1);
      const data = await request;
      await sleep(400);
      if (id !== runId.current) return;
      setMatches(data.matches);
      setScanned(data.scanned);
      setAiExplained(data.aiExplained);
      setProfileUsed(data.profile);
      setStep(steps.length);
      await sleep(300);
      if (id !== runId.current) return;
      setPhase('done');
    } catch (e) {
      if (id !== runId.current) return;
      setErrorMsg(e instanceof Error ? e.message : 'Matching failed');
      setPhase('error');
    }
  };

  const markApplied = (cid: string) => setMatches((prev) => prev.map((m) => (m.id === cid ? { ...m, applied: true } : m)));

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--border2)] bg-[var(--black)] p-4 sm:p-6 lg:p-10 shadow-2xl">
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[rgba(245,166,35,0.10)] blur-[100px]" />

      <div className="relative z-10 mx-auto mb-8 max-w-2xl text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgba(245,166,35,0.30)] bg-[rgba(245,166,35,0.10)] px-3.5 py-1.5 text-xs font-semibold text-[var(--amber)]">
          <Zap size={14} />
          <span>Fewsion AI Campaign Matchmaker</span>
        </div>
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-[var(--text)] sm:text-3xl">
          {title || 'Brand campaigns picked for you'}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {subtitle || 'Fewsion AI compares live brand campaigns with your profile and ranks the ones you are most likely to win.'}
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        {/* Preferences */}
        <div className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--card2)] p-4 sm:p-6">
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted2)]">What you&apos;re looking for</div>
          <p className="-mt-3 text-[11px] text-[var(--muted)]">
            Leave on &ldquo;Any&rdquo; to use your creator profile automatically.
          </p>

          <div className="space-y-2.5">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--amber)]">
              <Target size={14} /> Niche
            </label>
            <div className="flex flex-wrap gap-1.5">
              {NICHES.map((n) => (
                <button
                  key={n}
                  onClick={() => setNiche(n)}
                  disabled={phase === 'running'}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${niche === n
                    ? 'bg-[var(--amber)] font-bold text-black'
                    : 'border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--text)]'
                    }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--amber)]">
              <MonitorPlay size={14} /> Platform
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  disabled={phase === 'running'}
                  className={`rounded-xl border px-2 py-2 text-xs font-semibold ${platform === p
                    ? 'border-[var(--amber)] bg-[rgba(245,166,35,0.10)] text-[var(--amber)]'
                    : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--text)]'
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--amber)]">
                <IndianRupee size={14} /> Minimum budget
              </label>
              <span className="rounded-lg border border-[rgba(245,166,35,0.30)] bg-[rgba(245,166,35,0.10)] px-2.5 py-0.5 text-xs font-extrabold text-[var(--amber)]">
                {minBudget ? inr(minBudget) : 'Any'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200000"
              step="5000"
              value={minBudget}
              disabled={phase === 'running'}
              onChange={(e) => setMinBudget(Number(e.target.value))}
              className="w-full cursor-pointer accent-[var(--amber)]"
            />
          </div>

          <button
            onClick={run}
            disabled={phase === 'running'}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F5A623] to-[#FF6B35] py-3.5 text-sm font-extrabold text-black shadow-lg hover:opacity-95 disabled:cursor-wait"
          >
            {phase === 'running' ? (
              <>
                <Loader2 size={16} className="animate-spin" /> AI is matching…
              </>
            ) : phase === 'done' ? (
              <>
                <RotateCcw size={16} /> Run match again
              </>
            ) : (
              <>
                <BrainCircuit size={16} /> Find campaigns for me
              </>
            )}
          </button>
        </div>

        {/* Results */}
        <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6">
          <AnimatePresence mode="wait">
            {phase === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-[380px] flex-col items-center justify-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(245,166,35,0.30)] bg-[rgba(245,166,35,0.10)]">
                  <BrainCircuit size={30} className="text-[var(--amber)]" />
                </div>
                <div className="text-sm font-bold text-[var(--text)]">Your campaign matches will appear here</div>
                <p className="max-w-xs text-xs text-[var(--muted)]">Fewsion AI reads your niche, platform and rate, then ranks every live brand campaign.</p>
              </motion.div>
            )}

            {phase === 'running' && (
              <motion.div key="running" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-[380px] flex-col items-center justify-center gap-8">
                <NeuralScanner />
                <div className="w-full max-w-sm space-y-2.5">
                  {steps.map((label, i) => {
                    const state = i < step ? 'done' : i === step ? 'active' : 'pending';
                    return (
                      <div key={i} className={`flex items-center gap-3 text-xs ${state === 'pending' ? 'opacity-40' : ''}`}>
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${state === 'done' ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-600' : state === 'active' ? 'border-[var(--amber)] text-[var(--amber)]' : 'border-[var(--border2)]'}`}>
                          {state === 'done' ? <Check size={11} strokeWidth={3} /> : state === 'active' ? <Loader2 size={11} className="animate-spin" /> : null}
                        </span>
                        <span className={state === 'active' ? 'font-semibold text-[var(--text)]' : 'text-[var(--muted)]'}>{label}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {phase === 'error' && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-[380px] flex-col items-center justify-center gap-3 text-center">
                <p className="text-sm text-red-500">Couldn&apos;t run the match: {errorMsg}</p>
                <button onClick={run} className="text-xs font-bold text-[var(--amber)] hover:underline">Try again</button>
              </motion.div>
            )}

            {phase === 'done' && (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-5">
                  <div className="flex items-center gap-2 text-sm font-bold text-[var(--text)]">
                    <BrainCircuit size={16} className="text-[var(--amber)]" />
                    {matches.length ? `Top ${matches.length} campaign match${matches.length === 1 ? '' : 'es'}` : 'No matches yet'}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[var(--muted2)]">
                    {scanned} live campaign{scanned === 1 ? '' : 's'} analysed
                    {profileUsed ? ` · using your profile (${[profileUsed.niche, profileUsed.platform].filter(Boolean).join(', ')})` : ''}
                  </div>
                </div>

                {matches.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[var(--border2)] p-8 text-center text-sm text-[var(--muted)]">
                    No live campaigns match these filters right now. Try &ldquo;Any&rdquo; or a lower minimum budget.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {matches.map((c, i) => (
                      <CampaignCard
                        key={c.id}
                        campaign={c}
                        rank={i}
                        canApply={canApply}
                        beforeApply={beforeApply}
                        onApplied={(m) => {
                          markApplied(m.id);
                          onApplied?.(m);
                        }}
                      />
                    ))}
                  </div>
                )}
                {matches.length > 0 && (
                  <p className="mt-4 text-center text-[10px] text-[var(--muted2)]">
                    Match % combines niche, platform, budget vs your rate and the brand&apos;s engagement bar. 75% and above is a strong fit, 60–74% is fair, below 60% is weak.
                    {aiExplained ? ' Explanations written by Fewsion AI.' : ''}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function CampaignCard({
  campaign,
  rank,
  canApply,
  beforeApply,
  onApplied,
}: {
  campaign: CampaignMatch;
  rank: number;
  canApply: boolean;
  beforeApply?: (c: CampaignMatch) => boolean | Promise<boolean>;
  onApplied: (c: CampaignMatch) => void;
}) {
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const delay = 0.1 + rank * 0.12;

  const apply = async () => {
    if (!canApply) {
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    setError('');
    if (beforeApply && !(await beforeApply(campaign))) return;
    setApplying(true);
    try {
      await applicationsApi.apply(campaign.id);
      onApplied(campaign);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setApplying(false);
    }
  };

  const bars = [
    { label: 'Niche', value: campaign.signals.niche },
    { label: 'Platform', value: campaign.signals.platform },
    { label: 'Budget', value: campaign.signals.budget },
    { label: 'Engage', value: campaign.signals.engagement },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ delay, duration: 0.45 }}
      className={`relative flex flex-col rounded-2xl border bg-[var(--card)] p-4 ${rank === 0 ? 'border-[var(--amber)] shadow-lg' : 'border-[var(--border)]'}`}
    >
      {rank === 0 && (
        <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-[var(--amber)] px-2 py-0.5 text-[10px] font-extrabold text-black">
          <Trophy size={10} /> {campaign.matchScore >= 75 ? 'Best match' : 'Closest fit'}
        </span>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="truncate text-sm font-bold text-[var(--text)]">{campaign.title}</h4>
          <div className="truncate text-[11px] text-[var(--muted)]">
            {campaign.brandName}
            {campaign.industry ? ` · ${campaign.industry}` : ''}
          </div>
        </div>
        <ScoreRing value={campaign.matchScore} delay={delay + 0.15} />
      </div>

      <div className="mt-3 flex gap-2 rounded-xl border border-[rgba(245,166,35,0.15)] bg-[rgba(245,166,35,0.05)] p-2.5">
        <Sparkles size={13} className="mt-0.5 shrink-0 text-[var(--amber)]" />
        <p className="text-[11px] leading-relaxed text-[var(--text)]">{campaign.reason}</p>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {bars.map((b, i) => (
          <div key={b.label}>
            <div className="h-1 overflow-hidden rounded-full bg-[var(--card2)]">
              <motion.div className="h-full rounded-full bg-[var(--amber)]" initial={{ width: 0 }} animate={{ width: `${b.value}%` }} transition={{ delay: delay + 0.25 + i * 0.06, duration: 0.6 }} />
            </div>
            <div className="mt-1 text-[9px] uppercase tracking-wider text-[var(--muted2)]">{b.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 space-y-1 text-[11px] text-[var(--muted)]">
        {campaign.platform && (
          <div className="flex items-start gap-1.5">
            <MonitorPlay size={12} className="mt-0.5 shrink-0" /> <span className="line-clamp-2">{campaign.platform}</span>
          </div>
        )}
        {campaign.postedAt && (
          <div className="flex items-center gap-1.5">
            <CalendarDays size={12} /> Posted {new Date(campaign.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-3">
        <div>
          <div className="text-[9px] uppercase tracking-wider text-[var(--muted2)]">Budget</div>
          <div className="text-sm font-extrabold text-[var(--text)]">{inr(campaign.budget)}</div>
        </div>
        {campaign.applied ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600">
            <Check size={13} /> Applied
          </span>
        ) : (
          <button
            onClick={apply}
            disabled={applying}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--amber)] px-4 py-1.5 text-xs font-bold text-black hover:opacity-90 disabled:opacity-60"
          >
            {applying ? <Loader2 size={13} className="animate-spin" /> : <Send size={12} />}
            {canApply ? 'Apply' : 'Sign in to apply'}
          </button>
        )}
      </div>
      {error && <p className="mt-2 text-[11px] text-red-500">{error}</p>}
    </motion.div>
  );
}
