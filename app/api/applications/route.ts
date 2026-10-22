import { NextResponse } from 'next/server';
import { getRequestUser, getSupabaseAdmin } from '@/lib/supabaseAdmin';

// Creator applications to brand campaigns.
// GET  -> ids of campaigns the signed-in creator has applied to
// POST { campaignId } -> apply (creators only, live campaigns, once each);
//                        the brand gets a notification.

export const dynamic = 'force-dynamic';

const json = (body: unknown, status = 200) => NextResponse.json(body, { status });

export async function GET(req: Request) {
  const admin = getSupabaseAdmin();
  const user = await getRequestUser(req);
  if (!admin || !user) return json({ campaignIds: [] });
  const { data } = await admin.from('applications').select('campaign_id').eq('creator_id', user.id);
  return json({ campaignIds: (data ?? []).map((a) => a.campaign_id) });
}

export async function POST(req: Request) {
  const admin = getSupabaseAdmin();
  if (!admin) return json({ error: 'Applications are not configured on the server.' }, 500);

  const user = await getRequestUser(req);
  if (!user) return json({ error: 'Please sign in as a creator to apply.' }, 401);

  const { data: creator } = await admin
    .from('creator_profiles')
    .select('creator_name')
    .eq('user_id', user.id)
    .maybeSingle();
  if (!creator) return json({ error: 'Only creators with a completed profile can apply to campaigns.' }, 403);

  const body = await req.json().catch(() => ({}));
  const campaignId = typeof body.campaignId === 'string' ? body.campaignId : '';
  const { data: campaign } = await admin
    .from('campaign_briefs')
    .select('id, brand_id, campaign_title, status_state')
    .eq('id', campaignId)
    .maybeSingle();
  if (!campaign) return json({ error: 'Campaign not found.' }, 404);
  if (String(campaign.status_state || '').toLowerCase() !== 'live') {
    return json({ error: 'This campaign is no longer accepting applications.' }, 409);
  }

  const { data: existing } = await admin
    .from('applications')
    .select('id, status')
    .eq('campaign_id', campaignId)
    .eq('creator_id', user.id)
    .maybeSingle();
  if (existing) return json({ application: existing, alreadyApplied: true });

  const { data: application, error } = await admin
    .from('applications')
    .insert({ campaign_id: campaignId, creator_id: user.id, status: 'pending' })
    .select()
    .single();
  if (error) return json({ error: error.message }, 400);

  if (campaign.brand_id) {
    const { error: nErr } = await admin.from('notifications').insert({
      user_id: campaign.brand_id,
      title: 'New campaign application',
      message: `${creator.creator_name || 'A creator'} applied to "${campaign.campaign_title || 'your campaign'}".`,
      is_read: false,
    });
    if (nErr) console.warn('Application notification failed:', nErr.message);
  }

  return json({ application });
}
