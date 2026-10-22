import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// AI creator matching.
// 1. Every creator in creator_profiles is scored against the brief
//    (niche, campaign goal, budget) using their real profile numbers.
// 2. The top matches are sent to the AI model, which writes a short
//    reason for each pick. If the AI is unavailable, a plain reason
//    built from the same numbers is used instead.

const GOALS = ['Conversions', 'Retention', 'Awareness', 'Brand Launch'] as const;
type Goal = (typeof GOALS)[number];

// How much each signal counts towards the match, per campaign goal
const GOAL_WEIGHTS: Record<Goal, { niche: number; budget: number; engagement: number; reach: number; score: number }> = {
  Conversions: { niche: 30, budget: 20, engagement: 30, reach: 5, score: 15 },
  Retention: { niche: 30, budget: 20, engagement: 25, reach: 5, score: 20 },
  Awareness: { niche: 25, budget: 20, engagement: 10, reach: 35, score: 10 },
  'Brand Launch': { niche: 30, budget: 15, engagement: 15, reach: 20, score: 20 },
};

const MAX_RESULTS = 6;

interface Signals {
  niche: number;
  budget: number;
  engagement: number;
  reach: number;
  score: number;
}

// "8000", "₹8,000", "8k", "1.2L" -> rupees
const parseRate = (raw: unknown): number | null => {
  if (raw == null) return null;
  const s = String(raw).toLowerCase().replace(/[₹,\s]/g, '');
  const m = s.match(/(\d+(?:\.\d+)?)(k|l|lakh)?/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  const mult = m[2] === 'k' ? 1_000 : m[2] ? 100_000 : 1;
  return Math.round(n * mult);
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const normaliseNiche = (n: string) => n.toLowerCase().replace(/[^a-z]/g, '');

function scoreCreator(c: any, niche: string, budget: number): Signals {
  // Niche: exact match is full marks, a shared word (e.g. "fitness") is partial
  let nicheFit = niche === 'Any' ? 0.7 : 0;
  if (niche !== 'Any' && c.primary_niche) {
    if (normaliseNiche(c.primary_niche) === normaliseNiche(niche)) nicheFit = 1;
    else {
      const words = (s: string) => s.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3);
      const shared = words(niche).some((w) => words(c.primary_niche).includes(w));
      nicheFit = shared ? 0.6 : 0;
    }
  }

  // Budget: full marks if the creator's rate fits, falling off as it goes over
  const rate = parseRate(c.rate_per_integration);
  const budgetFit = rate == null ? 0.5 : rate <= budget ? 1 : clamp01(1 - (rate - budget) / budget);

  // Engagement: 8%+ is treated as excellent
  const engagement = clamp01(Number(c.engagement_rate || 0) / 8);

  // Reach: log scale so 1M doesn't drown out everyone else (100 -> 0, 1M -> 1)
  const followers = Number(c.follower_count || 0);
  const reach = followers > 0 ? clamp01((Math.log10(followers) - 2) / 4) : 0;

  const score = clamp01(Number(c.ai_total_score || 0) / 100);

  return { niche: nicheFit, budget: budgetFit, engagement, reach, score };
}

const formatFollowers = (n: number | null) => {
  if (!n) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
};

function fallbackReason(m: any, goal: Goal, niche: string): string {
  const parts: string[] = [];
  if (m.signals.niche === 1 && niche !== 'Any') parts.push(`creates ${m.niche} content`);
  if (m.signals.engagement >= 0.6) parts.push(`strong ${m.engagementRate}% engagement`);
  if (m.signals.reach >= 0.6 && m.followers) parts.push(`${m.followers} followers`);
  if (m.signals.budget === 1 && m.rateValue) parts.push('fits your budget');
  if (!parts.length) return `The closest overall fit for a ${goal.toLowerCase()} campaign.`;
  const text = parts.join(', ');
  return `${text[0].toUpperCase()}${text.slice(1)}.`;
}

async function aiReasons(matches: any[], brief: { niche: string; goal: Goal; budget: number }): Promise<Record<string, string> | null> {
  const apiKey = process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY;
  if (!apiKey || !matches.length) return null;

  const baseUrl = process.env.AI_BASE_URL || 'https://api.tokenrouter.com/v1';
  const models = (process.env.AI_MODEL || 'deepseek/deepseek-v4.1-flash')
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean);

  const payload = matches.map((m) => ({
    id: m.id,
    name: m.name,
    niche: m.niche,
    platform: m.platform,
    followers: m.followers,
    engagement_rate: m.engagementRate,
    rate: m.rate,
    creator_score: m.score,
    content_style: m.contentStyle,
  }));

  const prompt = `A brand on Fewsion wants creators for this campaign:
- Niche: ${brief.niche}
- Goal: ${brief.goal}
- Budget per creator: ₹${brief.budget.toLocaleString('en-IN')}

These creators were ranked by our matching model (highest match first):
${JSON.stringify(payload)}

For each creator, write ONE short sentence (max 22 words) explaining why they suit a ${brief.goal.toLowerCase()} campaign: connect their content style, niche, engagement or reach to the goal. Mention a weakness only if it matters (e.g. over budget, different niche). Do not mention match percentages or rankings. Use only the facts given; never invent any.
Reply with JSON only, in this shape: {"<id>": "<reason>", ...}`;

  for (const model of models) {
    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          temperature: 0.3,
          messages: [{ role: 'user', content: prompt }],
        }),
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) {
        console.error('Match AI error:', model, res.status);
        if ([404, 429, 500, 502, 503, 504].includes(res.status)) continue;
        return null;
      }
      const data = await res.json();
      const text: string = data?.choices?.[0]?.message?.content ?? '';
      const json = text.match(/\{[\s\S]*\}/);
      if (!json) return null;
      return JSON.parse(json[0]);
    } catch (e) {
      console.error('Match AI request failed:', model, e);
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const niche = typeof body.niche === 'string' && body.niche.trim() ? body.niche.trim() : 'Any';
    const goal: Goal = GOALS.includes(body.goal) ? body.goal : 'Conversions';
    const budget = Math.max(1000, Math.min(10_000_000, Number(body.budget) || 15000));

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Matching is not configured.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('creator_profiles').select('*').limit(500);
    if (error) {
      console.error('Match: creator_profiles', error.message);
      return NextResponse.json({ error: 'Could not load creators.' }, { status: 500 });
    }

    const creators = data ?? [];
    const weights = GOAL_WEIGHTS[goal];

    const ranked = creators
      .map((c: any) => {
        const signals = scoreCreator(c, niche, budget);
        const total =
          signals.niche * weights.niche +
          signals.budget * weights.budget +
          signals.engagement * weights.engagement +
          signals.reach * weights.reach +
          signals.score * weights.score;
        const rateValue = parseRate(c.rate_per_integration);
        return {
          id: c.user_id || c.id,
          name: c.creator_name || 'Fewsion creator',
          niche: c.primary_niche || null,
          platform: c.primary_platform || null,
          followers: formatFollowers(Number(c.follower_count) || null),
          engagementRate: c.engagement_rate != null ? Number(c.engagement_rate) : null,
          score: c.ai_total_score != null ? Number(c.ai_total_score) : null,
          rate: rateValue ? `₹${rateValue.toLocaleString('en-IN')}` : null,
          rateValue,
          contentStyle: c.content_style_desc || null,
          bio: c.content_style_desc || c.bio || null,
          matchScore: Math.round(total),
          signals,
        };
      })
      // When a niche is picked, drop creators with nothing in common with it
      .filter((m) => niche === 'Any' || m.signals.niche > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, MAX_RESULTS);

    const reasons = await aiReasons(ranked, { niche, goal, budget });

    const matches = ranked.map((m) => ({
      ...m,
      signals: {
        niche: Math.round(m.signals.niche * 100),
        budget: Math.round(m.signals.budget * 100),
        engagement: Math.round(m.signals.engagement * 100),
        reach: Math.round(m.signals.reach * 100),
        score: Math.round(m.signals.score * 100),
      },
      reason: reasons?.[m.id] || fallbackReason(m, goal, niche),
    }));

    return NextResponse.json({
      matches,
      scanned: creators.length,
      aiExplained: !!reasons,
    });
  } catch (e) {
    console.error('Match API error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
