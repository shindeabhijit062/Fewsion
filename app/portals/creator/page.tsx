'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, Send as SendIcon, ShieldCheck, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { useCreatorData, TabId, emptyBox } from './CreatorContext';
import { KYCModal } from '@/components/KYCModal';
import { AIMatchmaker } from '@/components/AIMatchmaker';
import { MessagesInbox } from '@/components/MessagesInbox';

const TAB_COPY: Record<TabId, { title: string; subtitle: string }> = {
  overview: { title: 'Overview', subtitle: 'Track active campaign deliverables and clear escrow releases.' },
  applications: { title: 'My applications', subtitle: "Every brand campaign you've applied to." },
  collaborations: { title: 'Active collaborations', subtitle: 'Deliverables and deadlines for your live campaigns.' },
  payments: { title: 'Earnings', subtitle: 'Track payments and escrow releases across collaborations.' },
  messages: { title: 'Messages', subtitle: 'Conversations with your active brand partners.' },
  reviews: { title: 'Reviews', subtitle: "Feedback left by brands you've worked with." },
  kyc: { title: 'KYC Verification', subtitle: 'Verify identity and bank payout account to participate in campaigns.' },
};

const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString() : '—');
const fmtTime = (d?: string) => (d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');
const fmtINR = (n?: number) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

function StatCard({ label, value, className = 'text-white' }: { label: string; value: string; className?: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.1_0.01_80)] p-5 sm:p-6">
      <div className="text-xs uppercase tracking-wide text-[oklch(0.68_0.015_85)]">{label}</div>
      <div className={`mt-2 font-display text-2xl font-extrabold ${className}`}>{value}</div>
    </div>
  );
}

function ApplicationRow({ app, statusTagClasses }: { app: any; statusTagClasses: (s?: string) => string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.1_0.01_80)] p-4 hover:border-[oklch(0.35_0.02_80)] transition-colors">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-white break-words">{app.campaign_title || 'Untitled campaign'}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[oklch(0.68_0.015_85)]">
          <span>Brand: {app.brand_name || 'Brand partner'}</span>
          <span>•</span>
          <span>Applied: {fmtDate(app.applied_at)}</span>
        </div>
      </div>
      <span className={`self-start sm:self-auto shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusTagClasses(app.status)}`}>
        {app.status || 'pending'}
      </span>
    </div>
  );
}

function SnapshotRow({ icon, main, sub }: { icon: string; main: string; sub: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div className="min-w-0">
        <div className="font-semibold text-white">{main}</div>
        <div className="text-xs text-[oklch(0.68_0.015_85)]">{sub}</div>
      </div>
    </div>
  );
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'applications', label: 'My Applications' },
  { id: 'collaborations', label: 'Active Collabs' },
  { id: 'payments', label: 'Earnings' },
  { id: 'messages', label: 'Messages' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'kyc', label: 'KYC Verification' },
];

export default function CreatorDashboardPage() {
  const {
    activeTab, setActiveTab, profile, applications, collaborations, payments,
    notifications, reviews, notifOpen, toggleNotifPanel, unreadCount,
    selectedCollabId, setSelectedCollabId, threadMessages, threadInput, setThreadInput,
    sendMessage, openThread, viewContract, signContract, contractModal, setContractModal, signing,
    totalEarnings, averageRating, userId, statusTagClasses,
    kycStatus, kycDetails, kycModalOpen, setKycModalOpen, submitKycData, requireKycGate, inbox
  } = useCreatorData();

  return (
      <main className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 w-full min-w-0">
        <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 sm:mb-10">
          <div className="min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight">
              {TAB_COPY[activeTab].title}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">{TAB_COPY[activeTab].subtitle}</p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <div className="relative">
              <button
                onClick={toggleNotifPanel}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border2)] bg-[var(--card)] text-[var(--text)]"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-[var(--amber)]" />
                )}
              </button>
              {notifOpen && (
                <div className="absolute left-0 sm:left-auto sm:right-0 top-12 z-30 w-[calc(100vw-2rem)] max-w-80 sm:w-80 max-h-96 overflow-y-auto rounded-xl border border-[var(--border2)] bg-[var(--card)] p-3 shadow-2xl">
                  {notifications.length === 0
                    ? emptyBox('No notifications yet.')
                    : notifications.slice(0, 15).map((n) => (
                      <div key={n.id} className="flex gap-3 border-b border-[var(--border)] py-3 text-sm last:border-none">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--amber)]/10 text-xs text-[var(--amber)]">
                          {n.is_read ? '✓' : '●'}
                        </div>
                        <div className="min-w-0 break-words">
                          <span className="font-medium text-[var(--text)]">{n.title || 'Notification'}</span>
                          {n.message ? ` — ${n.message}` : ''}
                          <div className="mt-0.5 text-xs text-[var(--muted)]">
                            {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            <Link
              href="/brands"
              className="rounded-full bg-[var(--amber)] px-5 py-2.5 text-xs font-bold text-black hover:opacity-90 transition-all"
            >
              Find Collaboration
            </Link>
          </div>
        </header>

        {/* Mobile tab switcher */}
        <div className="md:hidden mb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 flex gap-2 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${activeTab === tab.id
                  ? 'bg-[var(--amber)] text-black'
                  : 'bg-[var(--card)] text-[var(--muted)] border border-[var(--border)]'
                }`}
            >
              {tab.label}
              {tab.id === 'messages' && inbox.totalUnread > 0 ? ` (${inbox.totalUnread})` : ''}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KYC Warning Banner */}
            {kycStatus !== 'verified' && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--amber)]/20 text-[var(--amber)]">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">KYC Verification Required</div>
                    <div className="text-xs text-[var(--muted)]">
                      Complete your 2-minute KYC verification to participate in live campaigns &amp; unlock escrow payouts.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setKycModalOpen(true)}
                  className="w-full sm:w-auto shrink-0 rounded-full bg-[var(--amber)] px-5 py-2.5 text-xs font-bold text-black hover:opacity-90 transition-all cursor-pointer"
                >
                  Verify KYC Now →
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {[
                { label: 'Creator score', value: `${profile?.ai_total_score ?? '--'}/100` },
                { label: 'Follower scale', value: (profile?.follower_count ?? 0).toLocaleString() },
                { label: 'Engagement rate', value: profile?.engagement_rate ? `${profile?.engagement_rate}%` : '--%' },
                { label: 'Total earnings', value: fmtINR(totalEarnings()), accent: true },
              ].map((stat) => (
                <div key={stat.label} className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6">
                  <div className="text-xs uppercase tracking-wide text-[var(--muted)]">{stat.label}</div>
                  <div className={`mt-2 font-display text-2xl font-extrabold ${stat.accent ? 'text-[var(--amber)]' : 'text-[var(--text)]'}`}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                <h2 className="font-display text-lg font-bold text-[var(--text)] mb-5">Recent applications</h2>
                {applications.length === 0
                  ? emptyBox('You haven\u2019t applied to any campaigns yet. Click "Find Collaboration" above to get started.')
                  : (
                    <div className="space-y-3">
                      {applications.slice(0, 5).map((a) => (
                        <ApplicationRow key={a.id} app={a} statusTagClasses={statusTagClasses} />
                      ))}
                    </div>
                  )}
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                <h2 className="font-display text-lg font-bold text-[var(--text)] mb-5">Snapshot</h2>
                <div className="space-y-4 text-sm">
                  <SnapshotRow icon="📁" main={`${applications.length} total applications submitted`} sub={`${collaborations.length} active collaborations`} />
                  <SnapshotRow icon="⭐" main={averageRating ? `${averageRating} average rating` : 'No ratings yet'} sub={`${reviews.length} review(s)`} />
                  <SnapshotRow icon="🛡️" main={kycStatus === 'verified' ? 'KYC Verified ✓' : 'KYC Pending'} sub={kycStatus === 'verified' ? 'Unlocked for campaigns' : 'Action required'} />
                </div>
              </div>
            </div>

            {/* AI Matchmaker embedded section */}
            <div className="mt-6 sm:mt-10">
              <AIMatchmaker
                title="AI Campaign Matchmaker"
                subtitle="Find top compatible brand campaigns and creators tuned to your niche and engagement metrics."
                onSelectCreator={() => {
                  requireKycGate(() => {
                    alert('Connecting with campaign...');
                  });
                }}
              />
            </div>
          </div>
        )}

        {/* Applications */}
        {activeTab === 'applications' && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
            <h2 className="font-display text-lg font-bold text-[var(--text)] mb-5">All applications</h2>
            {applications.length === 0
              ? emptyBox('No applications yet. Browse open campaigns to apply.')
              : (
                <div className="space-y-3">
                  {applications.map((a) => (
                    <ApplicationRow key={a.id} app={a} statusTagClasses={statusTagClasses} />
                  ))}
                </div>
              )}
          </div>
        )}

        {/* Collaborations */}
        {activeTab === 'collaborations' && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
            <h2 className="font-display text-lg font-bold text-[var(--text)] mb-5">Active &amp; past collaborations</h2>
            {collaborations.length === 0
              ? emptyBox("No collaborations yet. They'll show up here once a brand approves your application.")
              : (
                <div className="space-y-3">
                  {collaborations.map((c) => (
                    <div
                      key={c.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5"
                    >
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-[var(--text)] break-words">{c.campaign_title || 'Untitled campaign'}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[var(--muted)]">
                          <span>Brand: {c.brand_name || 'Brand partner'}</span>
                          <span>Payment: {c.payment ? fmtINR(c.payment) : '—'}</span>
                          <span>Deadline: {fmtDate(c.deadline)}</span>
                          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${statusTagClasses(c.status)}`}>
                            {c.status || 'active'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button
                          onClick={() => openThread(c.id)}
                          className="rounded-full border border-[var(--border2)] bg-[var(--card)] px-4 py-2 text-xs font-semibold text-[var(--text)] hover:border-[var(--amber)]"
                        >
                          Message
                        </button>
                        <button
                          onClick={() => viewContract(c.id)}
                          className="rounded-full border border-[var(--border2)] bg-[var(--card)] px-4 py-2 text-xs font-semibold text-[var(--text)] hover:border-[var(--amber)]"
                        >
                          View Contract
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* Payments */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              <StatCard label="Total logged" value={fmtINR(totalEarnings())} className="text-[var(--amber)]" />
              <StatCard label="Released" value={fmtINR(totalEarnings(true))} className="text-emerald-400" />
              <StatCard label="Pending" value={fmtINR(totalEarnings() - totalEarnings(true))} />
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
              <h2 className="font-display text-lg font-bold text-[var(--text)] mb-5">Payment history</h2>
              {payments.length === 0
                ? emptyBox('No payments logged yet.')
                : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[480px] text-sm">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-wide text-[var(--muted)] border-b border-[var(--border)]">
                          <th className="py-2.5 pr-3">Amount</th>
                          <th className="py-2.5 pr-3">Status</th>
                          <th className="py-2.5 pr-3">Campaign</th>
                          <th className="py-2.5 pr-3">Released</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p) => {
                          const collab = collaborations.find((c) => c.id === p.collaboration_id);
                          return (
                            <tr key={p.id} className="border-b border-[var(--border)] last:border-none">
                              <td className="py-3 pr-3 text-[var(--text)]">{fmtINR(p.amount)}</td>
                              <td className="py-3 pr-3">
                                <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${statusTagClasses(p.status)}`}>
                                  {p.status || 'pending'}
                                </span>
                              </td>
                              <td className="py-3 pr-3 text-[var(--muted)]">{collab?.campaign_title || '—'}</td>
                              <td className="py-3 pr-3 text-[var(--muted)]">{fmtDate(p.released_at)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Messages */}
        {activeTab === 'messages' && (
          <MessagesInbox
            inbox={inbox}
            userId={userId}
            selectedId={selectedCollabId}
            onSelect={setSelectedCollabId}
            onContract={viewContract}
            emptyText="No conversations yet. They start when a brand sends you a collaboration request or approves your application."
          />
        )}

        {/* Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              <StatCard label="Average rating" value={averageRating ? `${averageRating}/5` : '--'} />
              <StatCard label="Total reviews" value={String(reviews.length)} />
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
              <h2 className="font-display text-lg font-bold text-[var(--text)] mb-5">All reviews</h2>
              {reviews.length === 0
                ? emptyBox("No reviews yet. They'll appear here after you complete a collaboration.")
                : (
                  <div className="space-y-3">
                    {reviews.map((r) => (
                      <div key={r.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                        <div className="text-[var(--amber)] text-sm">
                          {'★'.repeat(r.rating || 0)}
                          {'☆'.repeat(5 - (r.rating || 0))}
                        </div>
                        <p className="mt-2 text-sm text-[var(--muted2)]">{r.review || 'No written feedback provided.'}</p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        )}

        {/* KYC Verification Tab */}
        {activeTab === 'kyc' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-display text-lg sm:text-xl font-extrabold text-[var(--text)]">KYC &amp; Identity Verification</h2>
                  <p className="mt-1 text-xs text-[var(--muted)]">Governed by Fewsion Creator Escrow &amp; Compliance Policy</p>
                </div>

                <div className="flex items-center gap-2">
                  {kycStatus === 'verified' ? (
                    <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-extrabold text-emerald-400">
                      <CheckCircle2 size={14} /> KYC Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-extrabold text-amber-300">
                      <AlertTriangle size={14} /> Verification Required
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status breakdown card */}
                <div className="rounded-xl border border-[var(--border2)] bg-[var(--card2)] p-4 sm:p-5 space-y-3 break-words">
                  <div className="text-xs uppercase tracking-wider font-bold text-[var(--amber)]">Verification Details</div>
                  <div className="text-sm text-[var(--text)]">
                    <span className="text-[var(--muted)]">Legal Name: </span>
                    <strong>{kycDetails?.legalName || profile?.creator_name || 'Not provided'}</strong>
                  </div>
                  <div className="text-sm text-[var(--text)]">
                    <span className="text-[var(--muted)]">Document Type: </span>
                    <strong className="uppercase">{kycDetails?.idType || 'PAN / Aadhaar'}</strong>
                  </div>
                  <div className="text-sm text-[var(--text)]">
                    <span className="text-[var(--muted)]">ID Number: </span>
                    <strong>{kycDetails?.idNumber ? `•••• ${kycDetails.idNumber.slice(-4)}` : 'Not submitted'}</strong>
                  </div>
                  <div className="text-sm text-[var(--text)]">
                    <span className="text-[var(--muted)]">Submitted: </span>
                    <span>{kycDetails?.submittedAt ? new Date(kycDetails.submittedAt).toLocaleDateString() : 'Never'}</span>
                  </div>
                </div>

                {/* Bank payout card */}
                <div className="rounded-xl border border-[var(--border2)] bg-[var(--card2)] p-4 sm:p-5 space-y-3 break-words">
                  <div className="text-xs uppercase tracking-wider font-bold text-[var(--amber)]">Escrow Payout Account</div>
                  <div className="text-sm text-[var(--text)]">
                    <span className="text-[var(--muted)]">Bank Account: </span>
                    <strong>{kycDetails?.bankAccount ? `•••• ${kycDetails.bankAccount.slice(-4)}` : 'Not set'}</strong>
                  </div>
                  <div className="text-sm text-[var(--text)]">
                    <span className="text-[var(--muted)]">IFSC Code: </span>
                    <strong className="uppercase">{kycDetails?.ifscCode || 'Not set'}</strong>
                  </div>
                  <div className="text-sm text-[var(--text)]">
                    <span className="text-[var(--muted)]">UPI ID: </span>
                    <span>{kycDetails?.upiId || 'Not set'}</span>
                  </div>
                  <div className="text-xs text-emerald-400 font-semibold pt-1">
                    ✓ Escrow payout protection active
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[var(--border)] flex justify-end">
                <button
                  onClick={() => setKycModalOpen(true)}
                  className="w-full sm:w-auto rounded-full bg-[var(--amber)] px-6 py-2.5 text-xs font-bold text-black hover:opacity-90 transition-all cursor-pointer"
                >
                  {kycStatus === 'verified' ? 'Update KYC Details' : 'Complete KYC Verification Now'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contract modal */}
        {contractModal && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
            onClick={() => setContractModal(null)}
          >
            <div
              className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[var(--border2)] bg-[var(--card)] p-4 sm:p-7"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-display text-lg font-bold text-[var(--text)]">Collaboration Agreement</h2>
              <p className="mt-1 mb-4 text-xs text-[var(--muted)]">
                Auto-generated from the campaign terms. Not a substitute for legal advice — review before signing.
              </p>
              <pre className="mb-5 whitespace-pre-wrap rounded-lg bg-[var(--black)] p-3 sm:p-4 font-sans text-sm break-words leading-relaxed text-[var(--text)]">
                {contractModal.contract_text}
              </pre>

              <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { who: 'Brand', at: contractModal.brand_signed_at, name: null },
                  { who: 'You', at: contractModal.counterparty_signed_at, name: contractModal.counterparty_signature_name },
                ].map((s) => (
                  <div key={s.who} className="rounded-lg border border-[var(--border)] p-3">
                    <div className="text-[var(--muted)]">{s.who}</div>
                    {s.at ? (
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 font-semibold text-emerald-400">
                        <CheckCircle2 size={13} /> Signed {new Date(s.at).toLocaleDateString()}
                        {s.name ? ` · ${s.name}` : ''}
                      </div>
                    ) : (
                      <div className="mt-1 flex items-center gap-1.5 font-semibold text-[var(--amber)]">
                        <Clock size={13} /> Not signed yet
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-end gap-2.5">
                <button
                  onClick={() => setContractModal(null)}
                  className="rounded-full border border-[var(--border2)] px-5 py-2.5 text-xs font-semibold text-[var(--text)]"
                >
                  Close
                </button>
                <button
                  onClick={signContract}
                  disabled={signing || !!contractModal.counterparty_signed_at}
                  className="rounded-full bg-[var(--amber)] px-5 py-2.5 text-xs font-bold text-black hover:opacity-90 disabled:opacity-50"
                >
                  {contractModal.counterparty_signed_at ? 'Already Signed' : signing ? 'Signing…' : 'Sign Contract'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global KYC Verification Modal */}
        <KYCModal
          isOpen={kycModalOpen}
          onClose={() => setKycModalOpen(false)}
          kycStatus={kycStatus}
          kycDetails={kycDetails}
          onSubmitKyc={submitKycData}
        />
      </main>
  );
}
