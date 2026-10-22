'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Sparkles, Send, CheckCircle2, MessageSquare, Loader2, Trophy } from 'lucide-react';
import { OfferForm, OfferFormValue, emptyOffer, validateOffer } from '@/components/OfferForm';
import { offersApi } from '@/lib/offersApi';
import { STATUS_LABEL } from '@/lib/offers';

// Slide-in panel: creator details + "Send collaboration offer" form.
// Opened from the AI Matchmaker in the brand portal.

interface CampaignOption {
  id: string;
  campaign_title?: string;
  budget_allocated?: number;
  status_state?: string;
}

/** Creator shown in the drawer. AI fields are optional (not every entry point has them). */
export interface OfferCreator {
  id: string; // creator's user id
  name: string;
  niche?: string | null;
  platform?: string | null;
  followers?: string | null;
  engagementRate?: number | null;
  score?: number | null;
  rate?: string | null;
  bio?: string | null;
  matchScore?: number | null;
  reason?: string | null;
}

interface ExistingCollab {
  id: string;
  status?: string | null;
}

const rateNumber = (rate: string | null | undefined) => {
  if (!rate) return null;
  const n = Number(rate.replace(/[^\d.]/g, ''));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
};

const GRADIENTS = [
  'linear-gradient(135deg, #F5A623, #FF6B35)',
  'linear-gradient(135deg, #a855f7, #ec4899)',
  'linear-gradient(135deg, #3b82f6, #06b6d4)',
  'linear-gradient(135deg, #22c55e, #14b8a6)',
];
const gradientFor = (id: string) => {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
};

export function CreatorOfferDrawer({
  creator,
  campaigns,
  existing,
  brandName,
  onClose,
  onSent,
  onOpenConversation,
}: {
  creator: OfferCreator | null;
  campaigns: CampaignOption[];
  /** Latest collaboration with this creator, if any */
  existing: ExistingCollab | null;
  brandName: string;
  onClose: () => void;
  onSent: (collab: any) => void;
  onOpenConversation: (collabId: string) => void;
}) {
  const [campaignId, setCampaignId] = useState('');
  const [offer, setOffer] = useState<OfferFormValue>(emptyOffer());
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sentCollabId, setSentCollabId] = useState<string | null>(null);

  // Reset whenever a different creator is opened
  useEffect(() => {
    if (!creator) return;
    const live = campaigns.find((c) => c.status_state === 'Live') || campaigns[0];
    setCampaignId(live?.id || '');
    setOffer({
      ...emptyOffer(rateNumber(creator.rate) ?? null),
      note: `Hi ${creator.name}, we love your content and think you'd be a great fit for ${brandName}. Looking forward to working together!`,
    });
    setError('');
    setSentCollabId(null);
  }, [creator, campaigns, brandName]);

  // Close on Escape
  useEffect(() => {
    if (!creator) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !sending && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [creator, sending, onClose]);

  const send = async () => {
    if (!creator) return;
    const problem = validateOffer(offer);
    if (problem) {
      setError(problem);
      return;
    }
    setSending(true);
    setError('');
    try {
      const { collab } = await offersApi.create({
        creatorId: creator.id,
        campaignId: campaignId || null,
        amount: Number(offer.amount),
        deadline: offer.deadline || null,
        deliverables: offer.deliverables,
        note: offer.note.trim() || null,
      });
      setSentCollabId(collab.id);
      onSent(collab);
    } catch (e) {
      const err = e as Error & { collabId?: string };
      if (err.collabId) {
        onOpenConversation(err.collabId);
        return;
      }
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const open = existing && existing.status !== 'declined' ? existing : null;

  return (
    <AnimatePresence>
      {creator && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !sending && onClose()}
          />
          <motion.aside
            key="drawer"
            role="dialog"
            aria-label={`Offer for ${creator.name}`}
            className="fixed inset-y-0 right-0 z-[101] flex w-full max-w-[480px] flex-col border-l border-[var(--border2)] bg-[var(--card)] shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
          >
            {/* Header */}
            <div className="flex items-start gap-3 sm:gap-4 border-b border-[var(--border)] p-4 sm:p-6">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-black text-black"
                style={{ background: gradientFor(creator.id) }}
              >
                {creator.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-display text-lg font-extrabold text-[var(--text)]">{creator.name}</h2>
                <p className="truncate text-xs text-[var(--muted)]">
                  {[creator.platform, creator.niche].filter(Boolean).join(' · ') || 'Fewsion creator'}
                </p>
                {creator.matchScore != null && (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[rgba(245,166,35,0.12)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--amber)]">
                    <Trophy size={11} /> {creator.matchScore}% match
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                disabled={sending}
                aria-label="Close"
                className="shrink-0 rounded-full p-1.5 text-[var(--muted)] hover:bg-[var(--card2)] hover:text-[var(--text)]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                {[
                  { label: 'Followers', value: creator.followers },
                  { label: 'Eng. rate', value: creator.engagementRate != null ? `${creator.engagementRate}%` : null },
                  { label: 'Score', value: creator.score != null ? `${creator.score}` : null },
                  { label: 'Rate', value: creator.rate },
                ].map((s) => (
                  <div key={s.label} className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--card2)] px-1 py-2.5">
                    <div className="truncate text-sm font-extrabold text-[var(--text)]">{s.value ?? '—'}</div>
                    <div className="mt-0.5 text-[9px] uppercase tracking-wider text-[var(--muted2)]">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Why the AI picked them */}
              {creator.reason && (
              <div className="mt-4 flex gap-2.5 rounded-xl border border-[rgba(245,166,35,0.2)] bg-[rgba(245,166,35,0.05)] p-3.5">
                <Sparkles size={15} className="mt-0.5 shrink-0 text-[var(--amber)]" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--amber)]">Why Fewsion AI picked them</div>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text)]">{creator.reason}</p>
                </div>
              </div>
              )}

              {creator.bio && (
                <div className="mt-4">
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Content style</div>
                  <p className="text-xs leading-relaxed text-[var(--muted)]">{creator.bio}</p>
                </div>
              )}

              <div className="my-6 h-px bg-[var(--border)]" />

              {sentCollabId ? (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[var(--text)]">Offer sent to {creator.name}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-xs text-[var(--muted)]">
                    They&apos;ll be notified and can accept, counter or decline. Chat opens once they accept.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                    <button
                      onClick={onClose}
                      className="rounded-full border border-[var(--border2)] px-5 py-2.5 text-xs font-semibold text-[var(--text)]"
                    >
                      Keep browsing
                    </button>
                    <button
                      onClick={() => onOpenConversation(sentCollabId)}
                      className="flex items-center gap-1.5 rounded-full bg-[var(--amber)] px-5 py-2.5 text-xs font-bold text-black hover:opacity-90"
                    >
                      <MessageSquare size={13} /> View offer
                    </button>
                  </div>
                </div>
              ) : open ? (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card2)] p-5 text-center">
                  <div className="text-xs text-[var(--muted)]">You already have a collaboration with {creator.name}</div>
                  <div className="mt-2 inline-block rounded-full bg-[rgba(245,166,35,0.12)] px-3 py-1 text-xs font-bold text-[var(--amber)]">
                    {STATUS_LABEL[open.status || ''] || open.status || 'Active'}
                  </div>
                  <button
                    onClick={() => onOpenConversation(open.id)}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--amber)] py-2.5 text-xs font-bold text-black hover:opacity-90"
                  >
                    <MessageSquare size={13} /> Open conversation
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-base font-bold text-[var(--text)]">Send a collaboration offer</h3>
                  <p className="mb-5 mt-1 text-xs text-[var(--muted)]">
                    {existing?.status === 'declined'
                      ? 'Your previous offer was declined. You can send a new one.'
                      : 'The creator can accept, counter or decline.'}
                  </p>

                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Campaign</label>
                  <select
                    value={campaignId}
                    disabled={sending}
                    onChange={(e) => {
                      setCampaignId(e.target.value);
                      const c = campaigns.find((x) => x.id === e.target.value);
                      if (!offer.amount && c?.budget_allocated) setOffer((o) => ({ ...o, amount: String(c.budget_allocated) }));
                    }}
                    className="mb-4 w-full rounded-xl border border-[var(--border2)] bg-[var(--black)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--amber)]"
                  >
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.campaign_title || 'Untitled campaign'}
                        {c.status_state ? ` · ${c.status_state}` : ''}
                      </option>
                    ))}
                    <option value="">General collaboration (no campaign)</option>
                  </select>

                  <OfferForm value={offer} onChange={setOffer} disabled={sending} noteLabel="Message to creator" />
                </>
              )}
            </div>

            {!sentCollabId && !open && (
              <div className="border-t border-[var(--border)] p-4 sm:p-5">
                {error && <p className="mb-3 text-xs text-red-400">{error}</p>}
                <button
                  onClick={send}
                  disabled={sending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F5A623] to-[#FF6B35] py-3 text-sm font-extrabold text-black shadow-lg shadow-[rgba(245,166,35,0.2)] hover:opacity-95 disabled:opacity-60"
                >
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                  {sending ? 'Sending offer…' : `Send offer${offer.amount ? ` · ₹${Number(offer.amount).toLocaleString('en-IN')}` : ''}`}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
