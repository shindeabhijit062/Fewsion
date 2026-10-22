import { NextResponse } from 'next/server';
import { getRequestUser, getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { explainMatches } from '@/lib/aiExplain';

// AI campaign matching for creators.
// Scores every live brand campaign against the creator's profile (niche,
// platform, rate, engagement), then asks the AI to explain the top picks.
// Signed-in creators are matched on their saved profile; the niche/platform
// in the request body can narrow or override it (also used by visitors).

export const dynamic = 'force-dynamic';

const MAX_RESULTS = 6;

const words = (s: string) =>
  s
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((w) => w.length > 3);

const parseRate = (raw: unknown): number | null => {
  if (raw == null) return null;
  const s = String(raw).toLowerCase().replace(/[₹,\s]/g, '');
  const m = s.match(/(\d+(?:\.\d+)?)(k|l|lakh)?/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return Math.round(n * (m[2] === 'k' ? 1_000 : m[2] ? 100_000 : 1));
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export async function POST(req: Request) {
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: 'Matching is not configured.' }, { status: 500 });

  try {
    const body = await req.json().catch(() => ({}));

    // The creator's own profile, when signed in as a creator
    const user = await getRequestUser(req);
    let profile: any = null;
    if (user) {
      const { data } = await admin.from('creator_profiles').select('*').eq('user_id', user.id).maybeSingle();
      profile = data;
    }

    const niche: string = (typeof body.niche === 'string' && body.niche !== 'Any' && body.niche) || profile?.primary_niche || 'Any';
    const platform: string = (typeof body.platform === 'string' && body.platform !== 'Any' && body.platform) || profile?.primary_platform || 'Any';
    const minBudget = Math.max(0, Number(body.minBudget) || 0);
    const rate = parseRate(profile?.rate_per_integration);
    const engagement = profile?.engagement_rate != null ? Number(profile.engagement_rate) : null;

    const { data: campaigns, error } = await admin
      .from('campaign_briefs')
      .select('*')
      .ilike('status_state', 'live')
      .order('created_at', { ascending: false })
      .limit(300);
    if (error) return NextResponse.json({ error: 'Could not load campaigns.' }, { status: 500 });

    const brandIds = Array.from(new Set((campaigns ?? []).map((c) => c.brand_id).filter(Boolean)));
    const { data: brands } = brandIds.length
      ? await admin.from('brand_profiles').select('*').in('user_id', brandIds)
      : { data: [] as any[] };
    const brandBy = new Map((brands ?? []).map((b: any) => [b.user_id, b]));

    // Campaigns this creator already applied to
    let applied = new Set<string>();
    if (user) {
      const { data: apps } = await admin.from('applications').select('campaign_id').eq('creator_id', user.id);
      applied = new Set((apps ?? []).map((a: any) => a.campaign_id));
    }

    const now = Date.now();
    const ranked = (campaigns ?? [])
      .filter((c) => Number(c.budget_allocated || 0) >= minBudget)
      .map((c) => {
        const brand: any = brandBy.get(c.brand_id) || {};
        const budget = c.budget_allocated != null ? Number(c.budget_allocated) : null;

        // Niche: brand's preferred creator niches, else its industry
        let nicheFit = 0.6;
        if (niche !== 'Any') {
          const wanted: string[] = Array.isArray(brand.creator_niches) ? brand.creator_niches : [];
          const pool = wanted.length ? wanted.join(' ') : `${brand.industry || ''} ${c.campaign_title || ''}`;
          const shared = words(niche).filter((w) => words(pool).includes(w)).length;
          nicheFit = shared ? Math.min(1, 0.6 + shared * 0.4) : wanted.length ? 0.15 : 0.35;
        }

        // Platform: does the campaign's target mention the creator's platform?
        let platformFit = 0.6;
        if (platform !== 'Any') {
          const target = String(c.target_platform || '').toLowerCase();
          const mine = platform.toLowerCase() === 'both' ? ['instagram', 'youtube'] : [platform.toLowerCase()];
          platformFit = mine.some((p) => target.includes(p)) ? 1 : target ? 0.2 : 0.6;
        }

        // Budget vs the creator's rate
        const budgetFit = budget == null || rate == null ? 0.6 : budget >= rate ? 1 : clamp01(budget / rate);

        // Engagement vs the brand's minimum
        const minEng = brand.min_engagement_rate != null ? Number(brand.min_engagement_rate) : null;
        const engagementFit = minEng == null || engagement == null ? 0.6 : engagement >= minEng ? 1 : clamp01(engagement / minEng);

        // Newer campaigns rank slightly higher
        const ageDays = c.created_at ? (now - new Date(c.created_at).getTime()) / 86_400_000 : 60;
        const freshness = clamp01(1 - ageDays / 90);

        const total = nicheFit * 35 + platformFit * 20 + budgetFit * 25 + engagementFit * 15 + freshness * 5;
        return {
          id: c.id as string,
          title: c.campaign_title || 'Untitled campaign',
          brandId: c.brand_id,
          brandName: brand.brand_name || 'Fewsion brand',
          industry: brand.industry || null,
          description: brand.brand_description || null,
          platform: c.target_platform || null,
          budget,
          postedAt: c.created_at,
          minEngagement: minEng,
          applied: applied.has(c.id),
          matchScore: Math.round(total),
          signals: {
            niche: Math.round(nicheFit * 100),
            platform: Math.round(platformFit * 100),
            budget: Math.round(budgetFit * 100),
            engagement: Math.round(engagementFit * 100),
          },
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, MAX_RESULTS);

    // AI explanations
    let reasons: Record<string, string> | null = null;
    if (ranked.length) {
      const payload = ranked.map((m) => ({
        id: m.id,
        campaign: m.title,
        brand: m.brandName,
        industry: m.industry,
        about_brand: m.description,
        platforms: m.platform,
        budget_inr: m.budget,
        min_engagement_rate: m.minEngagement,
      }));
      reasons = await explainMatches(`A creator on Fewsion is looking for brand campaigns.
Creator: niche ${niche}, platform ${platform}, rate per video ${rate ? `₹${rate.toLocaleString('en-IN')}` : 'not set'}, engagement rate ${engagement ?? 'not set'}%.

These live campaigns were ranked by our matching model (best first):
${JSON.stringify(payload)}

For each campaign, write ONE short sentence (max 22 words) telling the creator why it suits them: connect the brand, platforms and budget to their niche, platform and rate. Mention a drawback only if it matters (e.g. budget below their rate, different platform). Do not mention match percentages or rankings. Use only the facts given; never invent any.
Reply with JSON only, in this shape: {"<id>": "<reason>", ...}`);
    }

    const fallback = (m: (typeof ranked)[number]) => {
      const parts: string[] = [];
      if (m.signals.niche >= 80) parts.push(`fits your ${niche} content`);
      if (m.signals.platform === 100 && platform !== 'Any') parts.push(`wants ${platform} content`);
      if (m.signals.budget === 100 && m.budget) parts.push(`budget of ₹${m.budget.toLocaleString('en-IN')} covers your rate`);
      if (!parts.length) return `A live ${m.industry ? `${m.industry} ` : ''}campaign from ${m.brandName}.`;
      const t = parts.join(', ');
      return `${t[0].toUpperCase()}${t.slice(1)}.`;
    };

    return NextResponse.json({
      matches: ranked.map((m) => ({ ...m, reason: reasons?.[m.id] || fallback(m) })),
      scanned: campaigns?.length ?? 0,
      aiExplained: !!reasons,
      profile: profile
        ? { niche: profile.primary_niche, platform: profile.primary_platform, rate, engagement }
        : null,
    });
  } catch (e) {
    console.error('Campaign match error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
