// Collaboration offers.
//
// The current terms live on the collaborations row (status, payment,
// deadline). Every step of the negotiation is also stored as a message whose
// content is OFFER_PREFIX + JSON, so the conversation shows the full history
// as cards. Used by both the browser and the /api/offers route.

export const OFFER_PREFIX = '__fewsion_offer__:';

export type OfferEventType = 'offer' | 'counter' | 'accepted' | 'declined';

export interface OfferTerms {
  amount: number | null;
  deadline: string | null; // YYYY-MM-DD
  deliverables: string[];
}

export interface OfferEvent extends Partial<OfferTerms> {
  type: OfferEventType;
  note?: string | null;
  campaignTitle?: string | null;
}

/** Collaboration statuses used by the offer flow */
export const OFFER_STATUS = {
  pending: 'offer_pending', // brand made an offer, creator to respond
  countered: 'offer_countered', // someone countered, the other side responds
  active: 'active',
  declined: 'declined',
} as const;

export const NEGOTIATING = new Set<string>([OFFER_STATUS.pending, OFFER_STATUS.countered]);

/** Statuses where free chat is open */
export const isChatOpen = (status?: string | null) =>
  !status || !['offer_pending', 'offer_countered', 'declined'].includes(status);

export const DELIVERABLE_PRESETS = [
  '1 Instagram Reel',
  '2 Instagram Stories',
  '1 YouTube video',
  '1 YouTube Short',
  '1 static post',
  'UGC video (no posting)',
  'Product review',
];

export const encodeOfferEvent = (e: OfferEvent) => OFFER_PREFIX + JSON.stringify(e);

export function parseOfferEvent(content: string | null | undefined): OfferEvent | null {
  if (!content || !content.startsWith(OFFER_PREFIX)) return null;
  try {
    const e = JSON.parse(content.slice(OFFER_PREFIX.length));
    return e && typeof e.type === 'string' ? (e as OfferEvent) : null;
  } catch {
    return null;
  }
}

export const formatINR = (n: number | null | undefined) =>
  n == null ? '—' : `₹${Number(n).toLocaleString('en-IN')}`;

export const formatDeadline = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Flexible';

/** One-line summary for inbox previews, toasts and notifications */
export function describeOfferEvent(e: OfferEvent): string {
  const terms = [e.amount != null ? formatINR(e.amount) : null, e.deliverables?.length ? e.deliverables.join(', ') : null]
    .filter(Boolean)
    .join(' · ');
  switch (e.type) {
    case 'offer':
      return `📄 Collaboration offer${terms ? `: ${terms}` : ''}`;
    case 'counter':
      return `↔️ Counter-offer${terms ? `: ${terms}` : ''}`;
    case 'accepted':
      return '✅ Offer accepted';
    case 'declined':
      return '❌ Offer declined';
  }
}

/** Plain text for any message, offer or not */
export const messagePreview = (content: string) => {
  const e = parseOfferEvent(content);
  return e ? describeOfferEvent(e) : content;
};

export const STATUS_LABEL: Record<string, string> = {
  offer_pending: 'Offer pending',
  offer_countered: 'Counter-offer',
  active: 'Active',
  declined: 'Declined',
  requested: 'Requested',
  approved: 'Active',
  completed: 'Completed',
};
