import { NextResponse } from 'next/server';
import { getRequestUser, getSupabaseAdmin } from '@/lib/supabaseAdmin';
import {
  NEGOTIATING,
  OFFER_PREFIX,
  OFFER_STATUS,
  OfferEvent,
  describeOfferEvent,
  encodeOfferEvent,
  parseOfferEvent,
} from '@/lib/offers';

// Collaboration offers between brands and creators.
//
// POST { action: 'create', creatorId, campaignId?, amount, deadline?, deliverables, note? }
//   Brand sends an offer. Creates (or reopens a declined) collaboration.
// POST { action: 'accept' | 'decline' | 'counter', collabId, amount?, deadline?, deliverables?, note? }
//   The side that did NOT make the latest proposal responds.
//
// Runs with the service role so it doesn't depend on table RLS, and checks
// that the caller is a party to the collaboration before changing anything.

export const dynamic = 'force-dynamic';

const json = (body: unknown, status = 200) => NextResponse.json(body, { status });

const cleanDeliverables = (v: unknown): string[] =>
  Array.isArray(v)
    ? v
        .filter((d) => typeof d === 'string')
        .map((d) => d.trim().slice(0, 100))
        .filter(Boolean)
        .slice(0, 10)
    : [];

const cleanAmount = (v: unknown): number | null => {
  if (v === null || v === undefined || v === '') return null;
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= 0 && n <= 100_000_000 ? n : NaN;
};

const cleanDate = (v: unknown): string | null => {
  if (typeof v !== 'string' || !v) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;
};

const cleanNote = (v: unknown) => (typeof v === 'string' ? v.trim().slice(0, 1000) : '') || null;

export async function POST(req: Request) {
  const admin = getSupabaseAdmin();
  if (!admin) return json({ error: 'Offers are not configured on the server (missing service role key).' }, 500);

  const user = await getRequestUser(req);
  if (!user) return json({ error: 'Please sign in again.' }, 401);

  const body = await req.json().catch(() => ({}));

  const nameOf = async (userId: string, side: 'brand' | 'creator') => {
    if (side === 'brand') {
      const { data } = await admin.from('brand_profiles').select('brand_name').eq('user_id', userId).maybeSingle();
      return data?.brand_name || 'A brand';
    }
    const { data } = await admin.from('creator_profiles').select('creator_name').eq('user_id', userId).maybeSingle();
    return data?.creator_name || 'A creator';
  };

  const notify = async (userId: string, title: string, message: string) => {
    const { error } = await admin.from('notifications').insert({ user_id: userId, title, message, is_read: false });
    if (error) console.warn('Offer notification failed:', error.message);
  };

  const postEvent = async (collabId: string, senderId: string, event: OfferEvent) => {
    const { error } = await admin
      .from('messages')
      .insert({ collaboration_id: collabId, sender_id: senderId, content: encodeOfferEvent(event) });
    if (error) throw new Error(`Could not record the offer: ${error.message}`);
  };

  try {
    // -----------------------------------------------------------------
    // Brand sends a new offer
    // -----------------------------------------------------------------
    if (body.action === 'create') {
      const { data: brand } = await admin.from('brand_profiles').select('brand_name').eq('user_id', user.id).maybeSingle();
      if (!brand) return json({ error: 'Only brands can send collaboration offers.' }, 403);

      const creatorId = typeof body.creatorId === 'string' ? body.creatorId : '';
      const { data: creator } = await admin
        .from('creator_profiles')
        .select('creator_name')
        .eq('user_id', creatorId)
        .maybeSingle();
      if (!creator) return json({ error: 'Creator not found.' }, 404);

      const amount = cleanAmount(body.amount);
      if (amount === null || Number.isNaN(amount) || amount <= 0) return json({ error: 'Enter a valid offer amount.' }, 400);
      const deliverables = cleanDeliverables(body.deliverables);
      if (!deliverables.length) return json({ error: 'Add at least one deliverable.' }, 400);
      const deadline = cleanDate(body.deadline);
      const note = cleanNote(body.note);

      let campaignTitle: string | null = null;
      const campaignId = typeof body.campaignId === 'string' && body.campaignId ? body.campaignId : null;
      if (campaignId) {
        const { data: campaign } = await admin
          .from('campaign_briefs')
          .select('campaign_title, brand_id')
          .eq('id', campaignId)
          .maybeSingle();
        if (!campaign || campaign.brand_id !== user.id) return json({ error: 'Campaign not found.' }, 404);
        campaignTitle = campaign.campaign_title;
      }

      // One open deal per brand + creator + campaign
      let existingQuery = admin
        .from('collaborations')
        .select('id, status')
        .eq('brand_id', user.id)
        .eq('creator_id', creatorId);
      existingQuery = campaignId ? existingQuery.eq('campaign_id', campaignId) : existingQuery.is('campaign_id', null);
      const { data: existing } = await existingQuery.order('created_at', { ascending: false }).limit(1).maybeSingle();

      if (existing && existing.status !== OFFER_STATUS.declined) {
        return json({ error: 'You already have an open collaboration with this creator for this campaign.', collabId: existing.id }, 409);
      }

      const values = {
        brand_id: user.id,
        creator_id: creatorId,
        campaign_id: campaignId,
        status: OFFER_STATUS.pending,
        payment: amount,
        deadline: deadline ? `${deadline}T00:00:00` : null,
      };
      const { data: collab, error } = existing
        ? await admin.from('collaborations').update(values).eq('id', existing.id).select().single()
        : await admin.from('collaborations').insert(values).select().single();
      if (error || !collab) return json({ error: error?.message || 'Could not create the offer.' }, 400);

      const event: OfferEvent = { type: 'offer', amount, deadline, deliverables, note, campaignTitle };
      await postEvent(collab.id, user.id, event);
      await notify(creatorId, `New collaboration offer from ${brand.brand_name || 'a brand'}`, describeOfferEvent(event));

      return json({ collab });
    }

    // -----------------------------------------------------------------
    // Accept / decline / counter
    // -----------------------------------------------------------------
    if (!['accept', 'decline', 'counter'].includes(body.action)) return json({ error: 'Unknown action.' }, 400);

    const { data: collab } = await admin.from('collaborations').select('*').eq('id', body.collabId).maybeSingle();
    if (!collab) return json({ error: 'Collaboration not found.' }, 404);

    const side = collab.brand_id === user.id ? 'brand' : collab.creator_id === user.id ? 'creator' : null;
    if (!side) return json({ error: 'This offer is not yours.' }, 403);
    if (!NEGOTIATING.has(collab.status)) return json({ error: 'This offer is no longer open.' }, 409);

    // The latest proposal decides whose turn it is
    const { data: history } = await admin
      .from('messages')
      .select('sender_id, content')
      .eq('collaboration_id', collab.id)
      .like('content', `${OFFER_PREFIX}%`)
      .order('created_at', { ascending: false })
      .limit(20);
    const latest = (history ?? [])
      .map((m) => ({ sender: m.sender_id, event: parseOfferEvent(m.content) }))
      .find((m) => m.event && (m.event.type === 'offer' || m.event.type === 'counter'));
    if (latest && latest.sender === user.id) {
      return json({ error: 'Waiting for the other side to respond to your proposal.' }, 409);
    }

    const otherId = side === 'brand' ? collab.creator_id : collab.brand_id;
    const myName = await nameOf(user.id, side);
    const lastTerms = latest?.event;
    const currentDeadline = collab.deadline ? String(collab.deadline).slice(0, 10) : null;

    if (body.action === 'accept') {
      const { data: updated, error } = await admin
        .from('collaborations')
        .update({ status: OFFER_STATUS.active })
        .eq('id', collab.id)
        .select()
        .single();
      if (error) return json({ error: error.message }, 400);
      const event: OfferEvent = {
        type: 'accepted',
        amount: collab.payment != null ? Number(collab.payment) : null,
        deadline: currentDeadline,
        deliverables: lastTerms?.deliverables ?? [],
        note: cleanNote(body.note),
      };
      await postEvent(collab.id, user.id, event);
      await notify(otherId, `${myName} accepted the offer`, 'The collaboration is now active. Chat is open and the contract can be generated.');
      return json({ collab: updated });
    }

    if (body.action === 'decline') {
      const { data: updated, error } = await admin
        .from('collaborations')
        .update({ status: OFFER_STATUS.declined })
        .eq('id', collab.id)
        .select()
        .single();
      if (error) return json({ error: error.message }, 400);
      const note = cleanNote(body.note);
      await postEvent(collab.id, user.id, { type: 'declined', note });
      await notify(otherId, `${myName} declined the offer`, note || 'The offer was declined.');
      return json({ collab: updated });
    }

    // counter
    const amount = cleanAmount(body.amount);
    if (amount === null || Number.isNaN(amount) || amount <= 0) return json({ error: 'Enter a valid amount.' }, 400);
    const deliverables = cleanDeliverables(body.deliverables);
    const finalDeliverables = deliverables.length ? deliverables : lastTerms?.deliverables ?? [];
    const deadline = cleanDate(body.deadline) ?? currentDeadline;

    const { data: updated, error } = await admin
      .from('collaborations')
      .update({
        status: OFFER_STATUS.countered,
        payment: amount,
        deadline: deadline ? `${deadline}T00:00:00` : null,
      })
      .eq('id', collab.id)
      .select()
      .single();
    if (error) return json({ error: error.message }, 400);

    const event: OfferEvent = { type: 'counter', amount, deadline, deliverables: finalDeliverables, note: cleanNote(body.note) };
    await postEvent(collab.id, user.id, event);
    await notify(otherId, `${myName} sent a counter-offer`, describeOfferEvent(event));
    return json({ collab: updated });
  } catch (e) {
    console.error('Offers API error:', e);
    return json({ error: e instanceof Error ? e.message : 'Something went wrong.' }, 500);
  }
}
