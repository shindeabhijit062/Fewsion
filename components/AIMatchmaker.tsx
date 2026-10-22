'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Target,
  IndianRupee,
  Download,
  Zap,
  Check,
  Loader2,
  BrainCircuit,
  RotateCcw,
  Trophy,
} from 'lucide-react';

// ---------------------------------------------------------------------
// AI Matchmaker: the brand describes the campaign, /api/match scores
// every creator profile against it and the AI explains each pick.
// Nobody is listed until a match has been run.
// ---------------------------------------------------------------------

export interface CreatorMatch {
  id: string;
  name: string;
  niche: string | null;
  platform: string | null;
  followers: string | null;
  engagementRate: number | null;
  score: number | null;
  rate: string | null;
  bio: string | null;
  matchScore: number;
  reason: string;
  signals: { niche: number; budget: number; engagement: number; reach: number; score: number };
}

// Same niche list creators pick from on their dashboard
export const NICHES = [
  'Any',
  'Tech & gadgets',
  'Beauty & skincare',
  'Finance & investing',
  'Fitness & health',
  'Food & recipes',
  'Travel & lifestyle',
  'Gaming',
  'Education',
  'Fashion',
  'Parenting',
];

const GOALS = [
  { value: 'Conversions', hint: 'Prioritises engagement' },
  { value: 'Awareness', hint: 'Prioritises reach' },
  { value: 'Retention', hint: 'Prioritises trust & score' },
  { value: 'Brand Launch', hint: 'Balanced reach & quality' },
];

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #F5A623, #FF6B35)',
  'linear-gradient(135deg, #a855f7, #ec4899)',
  'linear-gradient(135deg, #3b82f6, #06b6d4)',
  'linear-gradient(135deg, #22c55e, #14b8a6)',
  'linear-gradient(135deg, #ec4899, #8b5cf6)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
];

// The same creator always gets the same avatar colour
const pickGradient = (id: string) => {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
};

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Phase = 'idle' | 'running' | 'done' | 'error';

interface AIMatchmakerProps {
  onSelectCreator?: (creator: CreatorMatch) => void;
  title?: string;
  subtitle?: string;
  /** Label to show instead of "Connect" for creators you already have a deal with, keyed by creator id */
  creatorStatus?: Record<string, string>;
}

export function AIMatchmaker({ onSelectCreator, title, subtitle, creatorStatus }: AIMatchmakerProps) {
  const [niche, setNiche] = useState('Any');
  const [goal, setGoal] = useState('Conversions');
  const [budget, setBudget] = useState(15000);

  const [phase, setPhase] = useState<Phase>('idle');
  const [step, setStep] = useState(0);
  const [matches, setMatches] = useState<CreatorMatch[]>([]);
  const [scanned, setScanned] = useState<number | null>(null);
  const [aiExplained, setAiExplained] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [briefChanged, setBriefChanged] = useState(false);
  const runId = useRef(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  const budgetLabel = `₹${budget.toLocaleString('en-IN')}`;

  const steps = [
    'Reading your campaign brief',
    scanned != null ? `Scanning ${scanned} creator profiles` : 'Scanning creator profiles',
    niche === 'Any' ? 'Scoring content fit across all niches' : `Scoring niche fit for ${niche}`,
    `Weighting signals for ${goal.toLowerCase()}`,
    `Checking creator rates against ${budgetLabel}`,
    'Ranking matches & writing explanations',
  ];

  // Mark results as stale when the brief changes after a run
  useEffect(() => {
    if (phase === 'done') setBriefChanged(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [niche, goal, budget]);

  const runMatch = async () => {
    const id = ++runId.current;
    setPhase('running');
    setStep(0);
    setMatches([]);
    setScanned(null);
    setErrorMsg('');
    setBriefChanged(false);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const request = fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ niche, goal, budget }),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Matching failed');
      return data as { matches: CreatorMatch[]; scanned: number; aiExplained: boolean };
    });

    // Learn how many profiles are being scanned as soon as we know it
    request.then((d) => id === runId.current && setScanned(d.scanned)).catch(() => {});

    try {
      // Walk through the analysis steps; the last one waits for the API
      for (let i = 0; i < steps.length - 1; i++) {
        if (id !== runId.current) return;
        setStep(i);
        await sleep(520 + Math.random() * 260);
      }
      if (id !== runId.current) return;
      setStep(steps.length - 1);
      const data = await request;
      await sleep(400);
      if (id !== runId.current) return;

      setMatches(data.matches);
      setScanned(data.scanned);
      setAiExplained(data.aiExplained);
      setStep(steps.length);
      await sleep(350);
      if (id !== runId.current) return;
      setPhase('done');
    } catch (e) {
      if (id !== runId.current) return;
      setErrorMsg(e instanceof Error ? e.message : 'Matching failed');
      setPhase('error');
    }
  };

  const handleExport = () => {
    const data = JSON.stringify({ brief: { niche, goal, budget }, matches }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fewsion-ai-matches-${niche.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const leadMatch = matches[0];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--border2)] bg-[var(--black)] p-4 sm:p-6 lg:p-10 shadow-2xl">
      {/* Background glow */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[rgba(245,166,35,0.10)] blur-[100px] pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#FF6B35]/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 mb-6 sm:mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(245,166,35,0.30)] bg-[rgba(245,166,35,0.10)] px-3.5 py-1.5 text-xs font-semibold text-[var(--amber)] mb-3">
          <Zap size={14} />
          <span>Fewsion AI Neural Matchmaker</span>
        </div>
        <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-[var(--text)] tracking-tight">
          {title || 'Match Brands & Creators'}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {subtitle || 'Describe your campaign and Fewsion AI will rank the creators who fit it best.'}
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] gap-4 sm:gap-6">
        {/* ── Brief ── */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card2)] p-4 sm:p-6 space-y-6">
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted2)]">Your campaign brief</div>

          {/* Niche */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--amber)]">
              <Target size={14} />
              <span>Niche</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {NICHES.map((n) => (
                <button
                  key={n}
                  onClick={() => setNiche(n)}
                  disabled={phase === 'running'}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all disabled:cursor-not-allowed ${niche === n
                    ? 'bg-[var(--amber)] text-black font-bold shadow-lg shadow-[rgba(245,166,35,0.20)]'
                    : 'bg-[var(--card)] text-[var(--muted)] border border-[var(--border)] hover:border-[rgba(245,166,35,0.40)] hover:text-[var(--text)]'
                    }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--amber)]">
              <Sparkles size={14} />
              <span>Campaign goal</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {GOALS.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setGoal(g.value)}
                  disabled={phase === 'running'}
                  className={`min-w-0 rounded-xl border px-3 py-2.5 text-left transition-all disabled:cursor-not-allowed ${goal === g.value
                    ? 'border-[var(--amber)] bg-[rgba(245,166,35,0.10)]'
                    : 'border-[var(--border)] bg-[var(--card)] hover:border-[rgba(245,166,35,0.40)]'
                    }`}
                >
                  <div className={`text-xs font-bold ${goal === g.value ? 'text-[var(--amber)]' : 'text-[var(--text)]'}`}>{g.value}</div>
                  <div className="text-[10px] text-[var(--muted2)] mt-0.5">{g.hint}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--amber)]">
                <IndianRupee size={14} />
                <span>Budget per creator</span>
              </label>
              <span className="rounded-lg border border-[rgba(245,166,35,0.30)] bg-[rgba(245,166,35,0.10)] px-2.5 py-0.5 text-xs font-extrabold text-[var(--amber)]">
                {budgetLabel}
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="50000"
              step="2500"
              value={budget}
              disabled={phase === 'running'}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-[var(--amber)] cursor-pointer h-2 bg-[var(--card2)] rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-semibold text-[var(--muted2)]">
              <span>₹5K Micro</span>
              <span>₹25K Pro</span>
              <span>₹50K+ Scale</span>
            </div>
          </div>

          <button
            onClick={runMatch}
            disabled={phase === 'running'}
            className="relative w-full overflow-hidden py-3.5 rounded-xl bg-gradient-to-r from-[var(--amber)] to-[#FF6B35] text-black font-extrabold text-sm hover:opacity-95 shadow-lg shadow-[rgba(245,166,35,0.20)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-wait"
          >
            {phase === 'running' ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>AI is matching…</span>
              </>
            ) : phase === 'done' ? (
              <>
                <RotateCcw size={16} />
                <span>{briefChanged ? 'Update matches' : 'Run match again'}</span>
              </>
            ) : (
              <>
                <BrainCircuit size={16} />
                <span>Find my AI matches</span>
              </>
            )}
            {phase === 'idle' && (
              <motion.span
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                initial={{ x: '-150%' }}
                animate={{ x: '350%' }}
                transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
              />
            )}
          </button>
          {briefChanged && phase === 'done' && (
            <p className="-mt-3 text-center text-[11px] text-[var(--amber)]">Brief changed. Update to re-rank creators.</p>
          )}
        </div>

        {/* ── Results stage ── */}
        <div ref={resultsRef} className="relative min-h-[420px] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {phase === 'idle' && <IdleStage key="idle" />}

            {phase === 'running' && (
              <motion.div
                key="running"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex h-full min-h-[380px] flex-col items-center justify-center gap-8"
              >
                <NeuralScanner />
                <div className="w-full max-w-sm space-y-2.5">
                  {steps.map((label, i) => {
                    const state = i < step ? 'done' : i === step ? 'active' : 'pending';
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: state === 'pending' ? 0.35 : 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 text-xs"
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${state === 'done'
                            ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                            : state === 'active'
                              ? 'border-[rgba(245,166,35,0.50)] bg-[rgba(245,166,35,0.10)] text-[var(--amber)]'
                              : 'border-[var(--border2)] text-[var(--muted2)]'
                            }`}
                        >
                          {state === 'done' ? <Check size={11} strokeWidth={3} /> : state === 'active' ? <Loader2 size={11} className="animate-spin" /> : null}
                        </span>
                        <span className={state === 'active' ? 'font-semibold text-[var(--text)]' : 'text-[var(--muted)]'}>{label}</span>
                      </motion.div>
                    );
                  })}
                  <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-[var(--card2)]">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--amber)] to-[#FF6B35]"
                      animate={{ width: `${Math.min(100, (step / steps.length) * 100 + 6)}%` }}
                      transition={{ ease: 'easeOut', duration: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {phase === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[380px] flex-col items-center justify-center gap-3 text-center"
              >
                <p className="text-sm text-red-400">Couldn&apos;t run the match: {errorMsg}</p>
                <button onClick={runMatch} className="text-xs font-bold text-[var(--amber)] hover:underline">
                  Try again
                </button>
              </motion.div>
            )}

            {phase === 'done' && (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-[var(--text)]">
                      <BrainCircuit size={16} className="text-[var(--amber)]" />
                      {matches.length > 1 ? `Top ${matches.length} AI matches` : matches.length ? 'Your AI match' : 'No matches yet'}
                    </div>
                    <div className="mt-0.5 text-[11px] text-[var(--muted2)]">
                      {scanned} creator profile{scanned === 1 ? '' : 's'} analysed · {niche === 'Any' ? 'all niches' : niche} · {goal} · {budgetLabel}
                    </div>
                  </div>
                  {matches.length > 0 && (
                    <button
                      onClick={handleExport}
                      className="flex items-center gap-1.5 rounded-full border border-[var(--border2)] bg-[var(--card)] px-3 py-1 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--amber)] transition"
                    >
                      <Download size={13} /> Export shortlist
                    </button>
                  )}
                </div>

                {matches.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[var(--border2)] p-5 sm:p-8 text-center text-sm text-[var(--muted)]">
                    {niche === 'Any'
                      ? 'No creators have completed their profile yet, so there is nothing to match against.'
                      : `No creators in ${niche} yet. Try "Any" to match across every niche.`}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
                      {matches.map((c, i) => (
                        <MatchCard key={c.id} creator={c} rank={i} onSelect={onSelectCreator} status={creatorStatus?.[c.id]} />
                      ))}
                    </div>

                    {leadMatch && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 + matches.length * 0.12 }}
                        className="mt-5 rounded-2xl border border-[rgba(245,166,35,0.20)] bg-[rgba(245,166,35,0.05)] p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[var(--amber)]">
                            <Trophy size={14} />
                            <span>AI recommendation</span>
                          </div>
                          <p className="text-xs text-[var(--text)] mt-1">
                            <strong className="text-[var(--amber)]">{leadMatch.name}</strong> is your strongest fit at{' '}
                            {leadMatch.matchScore}% for this {goal.toLowerCase()} campaign.
                          </p>
                        </div>
                        <button
                          onClick={() => onSelectCreator?.(leadMatch)}
                          className="shrink-0 rounded-full bg-[var(--amber)] px-5 py-2 text-xs font-extrabold text-black hover:opacity-90 transition-all cursor-pointer"
                        >
                          {creatorStatus?.[leadMatch.id] ? `${creatorStatus[leadMatch.id]} →` : 'Send offer →'}
                        </button>
                      </motion.div>
                    )}

                    <p className="mt-4 text-center text-[10px] text-[var(--muted2)]">
                      Match % combines niche fit, rate vs budget, engagement, reach and Creator Score, weighted for your goal.
                      {aiExplained ? ' Explanations written by Fewsion AI.' : ''}
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// Stage pieces
// ---------------------------------------------------------------------

function IdleStage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full min-h-[380px] flex-col items-center justify-center gap-5 text-center"
    >
      <div className="relative flex h-24 w-24 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full border border-[rgba(245,166,35,0.30)]"
          animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.span
          className="absolute inset-0 rounded-full border border-[rgba(245,166,35,0.30)]"
          animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 1 }}
        />
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(245,166,35,0.30)] bg-[rgba(245,166,35,0.10)]">
          <BrainCircuit size={30} className="text-[var(--amber)]" />
        </div>
      </div>
      <div>
        <div className="text-sm font-bold text-[var(--text)]">Your matches will appear here</div>
        <p className="mt-1 max-w-xs text-xs text-[var(--muted)]">
          Set your niche, goal and budget, then let Fewsion AI score every creator profile and rank the best fits.
        </p>
      </div>
    </motion.div>
  );
}

// Animated "network" of nodes lighting up while the match runs
export function NeuralScanner() {
  const nodes = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * Math.PI * 2;
    const r = i % 2 ? 38 : 54;
    return { x: 70 + Math.cos(angle) * r, y: 70 + Math.sin(angle) * r, delay: (i % 6) * 0.18 };
  });
  return (
    <div className="relative h-[140px] w-[140px]">
      <svg viewBox="0 0 140 140" className="absolute inset-0 h-full w-full">
        {nodes.map((n, i) => (
          <motion.line
            key={`l${i}`}
            x1="70"
            y1="70"
            x2={n.x}
            y2={n.y}
            stroke="var(--amber)"
            strokeWidth="0.6"
            animate={{ opacity: [0.05, 0.5, 0.05] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: n.delay }}
          />
        ))}
        {nodes.map((n, i) => (
          <motion.circle
            key={`c${i}`}
            cx={n.x}
            cy={n.y}
            r="2.6"
            fill="var(--amber)"
            animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: n.delay }}
          />
        ))}
      </svg>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(245,166,35,0.25) 60deg, transparent 90deg)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--amber)] to-[#FF6B35] shadow-lg shadow-[rgba(245,166,35,0.30)]">
        <BrainCircuit size={22} className="text-black" />
      </div>
    </div>
  );
}

export function ScoreRing({ value, delay }: { value: number; delay: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now() + delay * 1000;
    const tick = (now: number) => {
      const t = Math.max(0, Math.min(1, (now - start) / 900));
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, delay]);

  return (
    <div className="relative h-14 w-14 shrink-0">
      <svg viewBox="0 0 48 48" className="h-full w-full -rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" stroke="var(--card2)" strokeWidth="4" />
        <motion.circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="var(--amber)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - value / 100) }}
          transition={{ duration: 0.9, delay, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[13px] font-extrabold leading-none text-[var(--text)]">{shown}%</span>
        <span className="mt-0.5 text-[7px] font-bold uppercase tracking-wider text-[var(--muted2)]">match</span>
      </div>
    </div>
  );
}

function MatchCard({
  creator,
  rank,
  onSelect,
  status,
}: {
  creator: CreatorMatch;
  rank: number;
  onSelect?: (c: CreatorMatch) => void;
  status?: string;
}) {
  const delay = 0.1 + rank * 0.12;
  const subline = [creator.platform, creator.niche].filter(Boolean).join(' • ') || 'Fewsion creator';
  const bars = [
    { label: 'Niche', value: creator.signals.niche },
    { label: 'Budget', value: creator.signals.budget },
    { label: 'Engage', value: creator.signals.engagement },
    { label: 'Reach', value: creator.signals.reach },
  ];
  const stats = [
    { label: 'Followers', value: creator.followers },
    { label: 'Eng. rate', value: creator.engagementRate != null ? `${creator.engagementRate}%` : null },
    { label: 'Score', value: creator.score != null ? `${creator.score}/100` : null },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ delay, duration: 0.45, ease: 'easeOut' }}
      className={`group relative flex flex-col rounded-2xl border bg-[var(--card)] p-4 transition-colors hover:border-[rgba(245,166,35,0.40)] ${rank === 0 ? 'border-[rgba(245,166,35,0.40)] shadow-lg shadow-[rgba(245,166,35,0.10)]' : 'border-[var(--border)]'
        }`}
    >
      {rank === 0 && (
        <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-[var(--amber)] px-2 py-0.5 text-[10px] font-extrabold text-black">
          <Trophy size={10} /> Best match
        </span>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black text-black"
            style={{ background: pickGradient(creator.id) }}
          >
            {initials(creator.name)}
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-bold text-[var(--text)] group-hover:text-[var(--amber)] transition-colors">
              {creator.name}
            </h4>
            <div className="truncate text-[11px] text-[var(--muted)]">{subline}</div>
          </div>
        </div>
        <ScoreRing value={creator.matchScore} delay={delay + 0.15} />
      </div>

      {/* Why the AI picked them */}
      <div className="mt-3 flex gap-2 rounded-xl border border-[rgba(245,166,35,0.15)] bg-[rgba(245,166,35,0.05)] p-2.5">
        <Sparkles size={13} className="mt-0.5 shrink-0 text-[var(--amber)]" />
        <p className="text-[11px] leading-relaxed text-[var(--text)]">{creator.reason}</p>
      </div>

      {/* Signal breakdown */}
      <div className="mt-3 grid grid-cols-4 gap-2">
        {bars.map((b, i) => (
          <div key={b.label} className="min-w-0">
            <div className="h-1 overflow-hidden rounded-full bg-[var(--card2)]">
              <motion.div
                className="h-full rounded-full bg-[var(--amber)]"
                initial={{ width: 0 }}
                animate={{ width: `${b.value}%` }}
                transition={{ delay: delay + 0.25 + i * 0.06, duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <div className="mt-1 truncate text-[9px] uppercase tracking-wider text-[var(--muted2)]">{b.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        {stats.map((s) => (
          <div key={s.label} className="min-w-0 rounded-lg border border-[var(--border)] bg-[var(--card2)] p-1.5">
            <div className="truncate text-xs font-extrabold text-[var(--text)]">{s.value ?? '—'}</div>
            <div className="truncate text-[9px] text-[var(--muted2)] uppercase">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
        <div className="text-xs font-extrabold text-[var(--text)]">
          {creator.rate ?? <span className="font-medium text-[var(--muted2)]">Rate not set</span>}
        </div>
        {status ? (
          <button
            onClick={() => onSelect?.(creator)}
            className="rounded-full bg-[rgba(245,166,35,0.12)] px-2.5 py-1 text-[11px] font-bold text-[var(--amber)] hover:bg-[rgba(245,166,35,0.2)]"
          >
            {status}
          </button>
        ) : (
          <button
            onClick={() => onSelect?.(creator)}
            className="flex items-center gap-1 text-xs font-bold text-[var(--amber)] hover:underline"
          >
            <span>Connect</span>
            <ArrowRight size={13} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
