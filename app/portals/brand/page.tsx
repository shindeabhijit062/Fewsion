// 'use client';
// 
// import React, { useState } from 'react';
// import Link from 'next/link';
// 
// export default function BrandPortalPage() {
//   const [activeTab, setActiveTab] = useState<'campaigns' | 'creators' | 'escrow'>('campaigns');
// 
//   return (
//     <main className="min-h-screen bg-[oklch(0.12_0.01_80)] text-white pt-24 pb-20">
//       {/* Portal Top Bar */}
//       <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[oklch(0.25_0.02_80)] pb-6 gap-4">
//           <div>
//             <div className="text-xs uppercase tracking-wider text-[oklch(0.8_0.16_75)] font-bold">Brand Portal</div>
//             <h1 className="text-3xl font-bold font-display text-white mt-1">D2C Brand Command Center</h1>
//           </div>
//           <div className="flex gap-3">
//             <Link href="/creators" className="rounded-full bg-[oklch(0.8_0.16_75)] px-5 py-2.5 text-xs font-bold text-black hover:bg-[oklch(0.85_0.16_75)] transition-all">
//               + New Campaign
//             </Link>
//             <Link href="/" className="rounded-full border border-[oklch(0.3_0.02_80)] bg-[oklch(0.15_0.02_80)] px-5 py-2.5 text-xs font-bold text-white hover:border-[oklch(0.8_0.16_75)]">
//               Exit Portal
//             </Link>
//           </div>
//         </div>
// 
//         {/* Navigation Tabs */}
//         <div className="mt-6 flex gap-3 border-b border-[oklch(0.22_0.02_80)] pb-3 text-sm font-semibold">
//           {[
//             { id: 'campaigns', label: 'Active Campaigns (4)' },
//             { id: 'creators', label: 'Matched Creators (18)' },
//             { id: 'escrow', label: 'Escrow Funds (₹2,50,000)' }
//           ].map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id as any)}
//               className={`pb-2 border-b-2 transition-all ${
//                 activeTab === tab.id
//                   ? 'border-[oklch(0.8_0.16_75)] text-[oklch(0.8_0.16_75)] font-bold'
//                   : 'border-transparent text-gray-400 hover:text-white'
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </section>
// 
//       {/* Main Content Area */}
//       <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
//         {activeTab === 'campaigns' && (
//           <div className="space-y-4">
//             {[
//               { name: 'Summer Skincare Reel Challenge', budget: '₹75,000', applicants: '12 Creators', status: 'In Progress' },
//               { name: 'Wireless Earbuds UGC Unboxing', budget: '₹1,20,000', applicants: '24 Creators', status: 'Reviewing Scripts' },
//               { name: 'Fintech App Download Campaign', budget: '₹2,00,000', applicants: '30 Creators', status: 'Escrow Locked' }
//             ].map((camp, i) => (
//               <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.15_0.02_80)] p-6 gap-4">
//                 <div>
//                   <h3 className="text-lg font-bold font-display text-white">{camp.name}</h3>
//                   <div className="mt-1 flex gap-4 text-xs text-[oklch(0.68_0.015_85)]">
//                     <span>Budget: <strong className="text-[oklch(0.8_0.16_75)]">{camp.budget}</strong></span>
//                     <span>Applicants: <strong>{camp.applicants}</strong></span>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
//                     {camp.status}
//                   </span>
//                   <button className="rounded-xl border border-[oklch(0.3_0.02_80)] bg-[oklch(0.2_0.02_80)] px-4 py-2 text-xs font-bold text-white hover:border-[oklch(0.8_0.16_75)]">
//                     Manage &rarr;
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
// 
//         {activeTab === 'creators' && (
//           <div className="rounded-2xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.15_0.02_80)] p-8 text-center text-sm text-[oklch(0.68_0.015_85)]">
//             18 Verified Creators matched based on your active campaign briefs.
//           </div>
//         )}
// 
//         {activeTab === 'escrow' && (
//           <div className="rounded-2xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.15_0.02_80)] p-8 text-center text-sm text-[oklch(0.68_0.015_85)]">
//             Razorpay Escrow Vault: ₹2,50,000 currently locked safely until milestone approvals.
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }

'use client';

/**
 * Brand Dashboard — ported from the static Fewsion HTML brand dashboard into
 * this Next.js app, using the same design language as your creator dashboard.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Megaphone,
  Users,
  Wallet,
  MessageSquare,
  Bell,
  LogOut,
  ArrowLeft,
  Send as SendIcon,
  FileText,
} from 'lucide-react';
import { supabase } from '@/utils/supabase';

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------
type TabId = 'overview' | 'campaigns' | 'applications' | 'payments' | 'messages';

interface BrandProfile {
  brand_name?: string;
  industry?: string;
  website_url?: string;
  brand_description?: string;
  primary_market?: string;
  brand_tone?: string[];
}

interface CampaignBrief {
  id: string;
  brand_id: string;
  campaign_title?: string;
  target_platform?: string;
  budget_allocated?: number;
  status_state?: string;
  created_at?: string;
}

interface Application {
  id: string;
  campaign_id: string;
  creator_id: string;
  applied_at?: string;
  status?: string;
  users?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    role?: string;
  } | null;
}

interface Collaboration {
  id: string;
  campaign_id: string;
  creator_id: string;
  brand_id: string;
  status?: string;
  payment?: number;
}

interface Payment {
  id: string;
  collaboration_id: string;
  amount?: number;
  status?: string;
  released_at?: string;
}

interface MessageRow {
  id: string;
  collaboration_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface NotificationRow {
  id: string;
  user_id: string;
  title?: string;
  message?: string;
  created_at?: string;
  is_read?: boolean;
}

interface Contract {
  id: string;
  collaboration_id: string;
  contract_text: string;
  status?: string;
  brand_signed_at?: string | null;
  counterparty_signed_at?: string | null;
  brand_signature_name?: string | null;
  counterparty_signature_name?: string | null;
}

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
  { id: 'applications', label: 'Applications', icon: Users },
  { id: 'payments', label: 'Payments', icon: Wallet },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
];

const TAB_COPY: Record<TabId, { title: string; subtitle: string }> = {
  overview: { title: 'Overview', subtitle: 'Monitor your active UGC content and applications.' },
  campaigns: { title: 'Campaigns', subtitle: 'All your brief campaigns, live and past.' },
  applications: { title: 'Applications', subtitle: 'Review and respond to creator applications.' },
  payments: { title: 'Payments', subtitle: 'Track spend across all active collaborations.' },
  messages: { title: 'Messages', subtitle: 'Conversations with your active creators.' },
};

const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString() : '—');
const fmtTime = (d?: string) => (d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');
const fmtINR = (n?: number) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function BrandPortalPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [userId, setUserId] = useState<string | null>(null);

  const [profile, setProfile] = useState<BrandProfile | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignBrief[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);

  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<MessageRow[]>([]);
  const [threadInput, setThreadInput] = useState('');
  const [contractModal, setContractModal] = useState<Contract | null>(null);
  const [generatingCollabId, setGeneratingCollabId] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);

  // ---------------------------------------------------------------------
  // Load everything
  // ---------------------------------------------------------------------
  const loadAll = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    setUserId(user.id);

    const [profileRes, campaignsRes, collabRes, notifRes] = await Promise.all([
      supabase.from('brand_profiles').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('campaign_briefs').select('*').eq('brand_id', user.id).order('created_at', { ascending: false }),
      supabase.from('collaborations').select('*').eq('brand_id', user.id),
      supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]);

    setProfile(profileRes.data ?? null);
    const briefData: CampaignBrief[] = campaignsRes.data ?? [];
    setCampaigns(briefData);
    setCollaborations(collabRes.data ?? []);
    setNotifications(notifRes.data ?? []);

    const campaignIds = briefData.map((c) => c.id);
    if (campaignIds.length) {
      const [appsRes, paymentsRes] = await Promise.all([
        supabase
          .from('applications')
          .select('*, users(first_name, last_name, email, role)')
          .in('campaign_id', campaignIds)
          .order('applied_at', { ascending: false }),
        supabase
          .from('payments')
          .select('*')
          .in('collaboration_id', collabRes.data?.map((col) => col.id) || [])
          .order('released_at', { ascending: false }),
      ]);
      setApplications(appsRes.data ?? []);
      setPayments(paymentsRes.data ?? []);
    } else {
      setApplications([]);
      setPayments([]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Realtime subscriptions
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`brand-live-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        () => loadAll()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'applications' },
        () => loadAll()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'collaborations', filter: `brand_id=eq.${userId}` },
        () => loadAll()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payments' },
        () => loadAll()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, loadAll]);

  // ---------------------------------------------------------------------
  // Derived values
  // ---------------------------------------------------------------------
  const totalSpend = useCallback(
    (releasedOnly = false) =>
      payments
        .filter((p) => !releasedOnly || p.status === 'released')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0),
    [payments]
  );

  const unreadCount = useMemo(() => notifications.filter((n) => !n.is_read).length, [notifications]);

  const initials = useMemo(() => {
    const name = profile?.brand_name || 'Brand';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [profile]);

  // ---------------------------------------------------------------------
  // Notifications
  // ---------------------------------------------------------------------
  const markNotificationsRead = useCallback(async () => {
    const unread = notifications.filter((n) => !n.is_read);
    if (!unread.length) return;
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .in('id', unread.map((n) => n.id));
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }, [notifications]);

  const toggleNotifPanel = useCallback(() => {
    setNotifOpen((open) => {
      const next = !open;
      if (next) markNotificationsRead();
      return next;
    });
  }, [markNotificationsRead]);

  // ---------------------------------------------------------------------
  // Applications
  // ---------------------------------------------------------------------
  const updateApplicationStatus = useCallback(async (applicationId: string, newStatus: string) => {
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', applicationId);
    if (error) {
      alert("Failed to update status: " + error.message);
      return;
    }

    setApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app))
    );

    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;

    const campaign = campaigns.find((c) => c.id === app.campaign_id);
    const campaignTitle = campaign?.campaign_title || 'a campaign';

    if (newStatus === 'approved') {
      const { data: collab, error: collabError } = await supabase
        .from('collaborations')
        .insert({
          campaign_id: app.campaign_id,
          creator_id: app.creator_id,
          brand_id: userId,
          status: 'active',
          payment: campaign?.budget_allocated || null,
        })
        .select()
        .single();

      if (collabError) {
        console.error('Failed to create collaboration:', collabError);
      } else if (collab) {
        setCollaborations((prev) => [collab, ...prev]);
      }

      await supabase.from('notifications').insert({
        user_id: app.creator_id,
        title: 'Application approved',
        message: `Your application for "${campaignTitle}" was approved!`,
        is_read: false,
      });
    } else if (newStatus === 'rejected') {
      await supabase.from('notifications').insert({
        user_id: app.creator_id,
        title: 'Application update',
        message: `Your application for "${campaignTitle}" was not approved this time.`,
        is_read: false,
      });
    }

    alert(`Application ${newStatus} successfully.`);
  }, [applications, campaigns, userId]);

  // ---------------------------------------------------------------------
  // Messages
  // ---------------------------------------------------------------------
  const openThread = useCallback(async (collabId: string) => {
    setSelectedCollabId(collabId);
    setActiveTab('messages');
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('collaboration_id', collabId)
      .order('created_at', { ascending: true });
    setThreadMessages(data ?? []);
  }, []);

  useEffect(() => {
    if (!selectedCollabId) return;
    const channel = supabase
      .channel(`messages-${selectedCollabId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `collaboration_id=eq.${selectedCollabId}` },
        (payload) => {
          setThreadMessages((prev) => {
            if (prev.some((m) => m.id === payload.new.id)) return prev;
            return [...prev, payload.new as MessageRow];
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedCollabId]);

  const sendMessage = useCallback(async () => {
    const content = threadInput.trim();
    if (!content || !selectedCollabId || !userId) return;
    setThreadInput('');
    const { error } = await supabase
      .from('messages')
      .insert({ collaboration_id: selectedCollabId, sender_id: userId, content });
    if (error) {
      console.error(error);
      alert('Message failed to send.');
    }
  }, [threadInput, selectedCollabId, userId]);

  // ---------------------------------------------------------------------
  // Contracts
  // ---------------------------------------------------------------------
  const generateContract = useCallback(async (collabId: string) => {
    setGeneratingCollabId(collabId);
    try {
      const { data, error } = await supabase.functions.invoke('generate-contract', {
        body: { collaboration_id: collabId },
      });
      if (error) throw error;
      setContractModal(data.contract);
    } catch (err: any) {
      alert("Couldn't generate contract: " + err.message);
    } finally {
      setGeneratingCollabId(null);
    }
  }, []);

  const handleContractAction = useCallback(async (collabId: string) => {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('collaboration_id', collabId)
      .maybeSingle();
    if (error) {
      alert("Error loading contract: " + error.message);
      return;
    }
    if (data) {
      setContractModal(data);
    } else {
      if (window.confirm("No contract has been generated for this collaboration yet. Would you like to generate one now?")) {
        generateContract(collabId);
      }
    }
  }, [generateContract]);

  const signContract = useCallback(async () => {
    if (!contractModal) return;
    const name = window.prompt('Type your full legal name to sign:');
    if (!name) return;
    setSigning(true);
    const { data: updated, error } = await supabase
      .from('contracts')
      .update({
        brand_signed_at: new Date().toISOString(),
        brand_signature_name: name,
      })
      .eq('id', contractModal.id)
      .select()
      .single();
    setSigning(false);
    if (error) {
      alert("Couldn't sign: " + error.message);
      return;
    }
    if (updated?.brand_signed_at && updated?.counterparty_signed_at) {
      await supabase.from('contracts').update({ status: 'signed_both' }).eq('id', contractModal.id);
    }
    alert('Signed successfully. Once the creator also signs, the contract is finalized.');
    setContractModal(null);
  }, [contractModal]);

  // ---------------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------------
  const handleLogout = useCallback(async () => {
    if (!window.confirm('Are you sure you want to log out of Fewsion?')) return;
    await supabase.auth.signOut();
    window.location.href = '/login';
  }, []);

  // ---------------------------------------------------------------------
  // Presentational helpers
  // ---------------------------------------------------------------------
  const statusTagClasses = (status?: string) => {
    const s = (status || 'pending').toLowerCase();
    if (['accepted', 'approved', 'active', 'released', 'live', 'signed_both'].includes(s))
      return 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400';
    if (s === 'rejected') return 'bg-red-500/10 border-red-500/20 text-red-400';
    return 'bg-[oklch(0.8_0.16_75_/_0.1)] border-[oklch(0.8_0.16_75_/_0.2)] text-[oklch(0.8_0.16_75)]';
  };

  const emptyBox = (text: string) => (
    <div className="rounded-xl border border-dashed border-[oklch(0.3_0.02_80)] p-8 text-center text-sm text-[oklch(0.6_0.015_85)]">
      {text}
    </div>
  );

  // ---------------------------------------------------------------------
  // Render loading / error
  // ---------------------------------------------------------------------
  if (loading) {
    return (
      <main className="min-h-screen bg-[oklch(0.12_0.01_80)] text-white flex items-center justify-center">
        <p className="text-sm text-[oklch(0.68_0.015_85)]">Loading your workspace...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[oklch(0.12_0.01_80)] text-white flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-[oklch(0.68_0.015_85)]">
          We couldn&apos;t find a brand profile for your account yet.
        </p>
        <Link
          href="/signup?role=brand"
          className="rounded-full bg-[oklch(0.8_0.16_75)] px-5 py-2.5 text-xs font-bold text-black hover:bg-[oklch(0.85_0.16_75)] transition-all"
        >
          Set up Brand Profile
        </Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(0.12_0.01_80)] text-white flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col gap-10 border-r border-[oklch(0.25_0.02_80)] bg-[oklch(0.1_0.01_80)] px-6 py-8 fixed top-0 bottom-0 left-0 z-10">
        <Link href="/" className="font-display text-xl font-extrabold text-white">
          Few<span className="text-[oklch(0.8_0.16_75)]">sion</span>
        </Link>

        <nav className="flex flex-col gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id && selectedCampaignId === null;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedCampaignId(null);
                  if (tab.id !== 'messages') setSelectedCollabId(null);
                }}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors text-left ${active
                    ? 'bg-[oklch(0.16_0.02_80)] text-white border-l-2 border-[oklch(0.8_0.16_75)]'
                    : 'text-[oklch(0.62_0.015_85)] hover:bg-[oklch(0.16_0.02_80)] hover:text-white'
                  }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-5 border-t border-[oklch(0.25_0.02_80)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.8_0.16_75)] to-[oklch(0.72_0.18_45)] font-display text-xs font-extrabold text-black">
              {initials || 'B'}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{profile.brand_name || 'Brand Partner'}</div>
              <div className="text-xs font-medium text-[oklch(0.62_0.015_85)]">
                {profile.industry || 'D2C Brand'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 md:ml-64 px-4 sm:px-6 lg:px-10 py-10 max-w-7xl">
        <header className="flex items-start justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {selectedCampaignId ? 'Campaign Detail' : TAB_COPY[activeTab].title}
            </h1>
            <p className="mt-1 text-sm text-[oklch(0.68_0.015_85)]">
              {selectedCampaignId ? 'Review metrics, creator applicants and escrow status' : TAB_COPY[activeTab].subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={toggleNotifPanel}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[oklch(0.3_0.02_80)] bg-[oklch(0.15_0.02_80)] text-white"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-[oklch(0.8_0.16_75)]" />
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 z-30 w-80 max-h-96 overflow-y-auto rounded-xl border border-[oklch(0.3_0.02_80)] bg-[oklch(0.15_0.02_80)] p-3 shadow-2xl">
                  {notifications.length === 0
                    ? emptyBox('No notifications yet.')
                    : notifications.slice(0, 15).map((n) => (
                      <div key={n.id} className="flex gap-3 border-b border-[oklch(0.22_0.02_80)] py-3 text-sm last:border-none">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[oklch(0.8_0.16_75_/_0.1)] text-xs text-[oklch(0.8_0.16_75)]">
                          {n.is_read ? '✓' : '●'}
                        </div>
                        <div>
                          <span className="font-medium text-white">{n.title || 'Notification'}</span>
                          {n.message ? ` — ${n.message}` : ''}
                          <div className="mt-0.5 text-xs text-[oklch(0.5_0.01_85)]">
                            {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            {/* ✨ New AI Campaign Button redirects to onboarding html form with parameter */}
            <Link
              href="../Brand/fewsion_brand_portal.html?new=true"
              className="rounded-full bg-[oklch(0.8_0.16_75)] px-5 py-2.5 text-xs font-bold text-black hover:bg-[oklch(0.85_0.16_75)] transition-all"
            >
              ✨ New AI Campaign
            </Link>
          </div>
        </header>

        {/* Mobile Tab Switcher */}
        <div className="md:hidden mb-8 flex gap-2 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedCampaignId(null);
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${activeTab === tab.id && selectedCampaignId === null
                  ? 'bg-[oklch(0.8_0.16_75)] text-black'
                  : 'bg-[oklch(0.15_0.02_80)] text-[oklch(0.68_0.015_85)] border border-[oklch(0.25_0.02_80)]'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Campaign Detail View */}
        {selectedCampaignId !== null && (
          (() => {
            const campaign = campaigns.find((c) => c.id === selectedCampaignId);
            if (!campaign) return emptyBox('Campaign not found.');
            const campaignApps = applications.filter((a) => a.campaign_id === selectedCampaignId);
            const campaignCollabs = collaborations.filter((c) => c.campaign_id === selectedCampaignId);
            const campaignSpend = campaignCollabs.reduce((sum, c) => {
              const collabPayments = payments.filter((p) => p.collaboration_id === c.id);
              return sum + collabPayments.reduce((s, p) => s + Number(p.amount || 0), 0);
            }, 0);

            return (
              <div className="space-y-8">
                <button
                  onClick={() => setSelectedCampaignId(null)}
                  className="flex items-center gap-2 text-xs text-[oklch(0.6_0.015_85)] hover:text-white"
                >
                  <ArrowLeft size={14} /> Back to campaigns
                </button>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="rounded-2xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.15_0.02_80)] p-6">
                    <div className="text-xs uppercase tracking-wide text-[oklch(0.6_0.015_85)]">Status</div>
                    <div className="mt-2 font-display text-lg font-extrabold capitalize text-white">
                      {campaign.status_state || 'Live'}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.15_0.02_80)] p-6">
                    <div className="text-xs uppercase tracking-wide text-[oklch(0.6_0.015_85)]">Platform</div>
                    <div className="mt-2 font-display text-lg font-extrabold text-white">
                      {campaign.target_platform || 'Multi-platform'}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.15_0.02_80)] p-6">
                    <div className="text-xs uppercase tracking-wide text-[oklch(0.6_0.015_85)]">Budget</div>
                    <div className="mt-2 font-display text-lg font-extrabold text-[oklch(0.8_0.16_75)]">
                      {campaign.budget_allocated ? fmtINR(campaign.budget_allocated) : '—'}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.15_0.02_80)] p-6">
                    <div className="text-xs uppercase tracking-wide text-[oklch(0.6_0.015_85)]">Spend so far</div>
                    <div className="mt-2 font-display text-lg font-extrabold text-emerald-400">
                      {fmtINR(campaignSpend)}
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
                  <div className="rounded-2xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.15_0.02_80)] p-7">
                    <h2 className="font-display text-lg font-bold text-white mb-5">Applications ({campaignApps.length})</h2>
                    {campaignApps.length === 0
                      ? emptyBox('No applications yet.')
                      : (
                        <div className="space-y-3">
                          {campaignApps.map((a) => (
                            <ApplicationRow key={a.id} app={a} campaignTitle={campaign.campaign_title || 'This campaign'} onAction={updateApplicationStatus} statusTagClasses={statusTagClasses} />
                          ))}
                        </div>
                      )}
                  </div>

                  <div className="rounded-2xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.15_0.02_80)] p-7">
                    <h2 className="font-display text-lg font-bold text-white mb-5">Active collaborations ({campaignCollabs.length})</h2>
                    {campaignCollabs.length === 0
                      ? emptyBox('No active collaborations yet.')
                      : (
                        <div className="space-y-3">
                          {campaignCollabs.map((c) => (
                            <div key={c.id} className="rounded-xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.11_0.01_80)] p-4 flex flex-col gap-3">
                              <div>
                                <h4 className="text-sm font-semibold text-white">Collaboration {c.id.slice(0, 8)}…</h4>
                                <div className="mt-1 flex gap-3 text-xs text-[oklch(0.6_0.015_85)]">
                                  <span>Status: {c.status || 'active'}</span>
                                  <span>Payment: {c.payment ? fmtINR(c.payment) : '—'}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openThread(c.id)}
                                  className="flex-1 rounded-full border border-[oklch(0.3_0.02_80)] bg-[oklch(0.15_0.02_80)] py-1.5 text-xs font-semibold text-white hover:border-[oklch(0.8_0.16_75)]"
                                >
                                  Message
                                </button>
                                <button
                                  disabled={generatingCollabId === c.id}
                                  onClick={() => handleContractAction(c.id)}
                                  className="flex-1 rounded-full border border-[oklch(0.3_0.02_80)] bg-[oklch(0.15_0.02_80)] py-1.5 text-xs font-semibold text-white hover:border-[oklch(0.8_0.16_75)] disabled:opacity-50"
                                >
                                  {generatingCollabId === c.id ? 'Generating…' : 'Contract'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            );
          })()
        )}

        {/* Overview Tab */}
        {selectedCampaignId === null && activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: 'Active campaigns', value: String(campaigns.length) },
                { label: 'Applications received', value: String(applications.length), accent: true },
                { label: 'Active collaborations', value: String(collaborations.length) },
                { label: 'Total spend', value: fmtINR(totalSpend()), accent: true },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.15_0.02_80)] p-6">
                  <div className="text-xs uppercase tracking-wide text-[oklch(0.6_0.015_85)]">{stat.label}</div>
                  <div className={`mt-2 font-display text-2xl font-extrabold ${stat.accent ? 'text-[oklch(0.8_0.16_75)]' : 'text-white'}`}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
              <div className="rounded-2xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.15_0.02_80)] p-7">
                <h2 className="font-display text-lg font-bold text-white mb-5">Active brief campaigns</h2>
                {campaigns.length === 0
                  ? emptyBox('No live brief campaigns active. Click "+ New AI Campaign" to get started.')
                  : (
                    <div className="space-y-3">
                      {campaigns.slice(0, 5).map((c) => (
                        <div
                          key={c.id}
                          onClick={() => setSelectedCampaignId(c.id)}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.11_0.01_80)] p-5 cursor-pointer hover:border-[oklch(0.3_0.02_80)] transition-all"
                        >
                          <div>
                            <h3 className="text-sm font-semibold text-white">{c.campaign_title || 'Untitled Campaign'}</h3>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[oklch(0.6_0.015_85)]">
                              <span>Platform: {c.target_platform || 'Multi-platform'}</span>
                              <span>Budget: {c.budget_allocated ? fmtINR(c.budget_allocated) : '—'}</span>
                              <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${statusTagClasses(c.status_state)}`}>
                                {c.status_state || 'live'}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-[oklch(0.6_0.015_85)] font-medium">View dashboard &rarr;</div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              <div className="rounded-2xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.15_0.02_80)] p-7">
                <h2 className="font-display text-lg font-bold text-white mb-5">Recent system actions</h2>
                <div className="space-y-4 text-sm">
                  {notifications.length === 0 ? (
                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[oklch(0.8_0.16_75_/_0.1)] text-xs text-[oklch(0.8_0.16_75)]">
                        🔒
                      </div>
                      <div>
                        <span className="font-medium text-white">Supabase infrastructure connected</span>
                        <div className="mt-0.5 text-xs text-[oklch(0.5_0.01_85)]">Active session</div>
                      </div>
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((n) => (
                      <div key={n.id} className="flex gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[oklch(0.8_0.16_75_/_0.1)] text-xs text-[oklch(0.8_0.16_75)]">
                          {n.is_read ? '✓' : '●'}
                        </div>
                        <div>
                          <span className="font-medium text-white">{n.title || 'Notification'}</span>
                          {n.message ? ` — ${n.message}` : ''}
                          <div className="mt-0.5 text-xs text-[oklch(0.5_0.01_85)]">
                            {n.created_at ? new Date(n.created_at).toLocaleDateString() : ''}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Campaigns Tab */}
        {selectedCampaignId === null && activeTab === 'campaigns' && (
          <div className="rounded-2xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.15_0.02_80)] p-7">
            <h2 className="font-display text-lg font-bold text-white mb-5">All campaigns</h2>
            {campaigns.length === 0
              ? emptyBox('No campaigns created yet.')
              : (
                <div className="space-y-3">
                  {campaigns.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCampaignId(c.id)}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.11_0.01_80)] p-5 cursor-pointer hover:border-[oklch(0.3_0.02_80)] transition-all"
                    >
                      <div>
                        <h3 className="text-sm font-semibold text-white">{c.campaign_title || 'Untitled Campaign'}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[oklch(0.6_0.015_85)]">
                          <span>Platform: {c.target_platform || 'Multi-platform'}</span>
                          <span>Budget: {c.budget_allocated ? fmtINR(c.budget_allocated) : '—'}</span>
                          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${statusTagClasses(c.status_state)}`}>
                            {c.status_state || 'live'}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-[oklch(0.6_0.015_85)] font-medium">View dashboard &rarr;</div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* Applications Tab */}
        {selectedCampaignId === null && activeTab === 'applications' && (
          <div className="rounded-2xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.15_0.02_80)] p-7">
            <h2 className="font-display text-lg font-bold text-white mb-5">All applications</h2>
            {applications.length === 0
              ? emptyBox('No applications received yet.')
              : (
                <div className="space-y-3">
                  {applications.map((a) => {
                    const campaign = campaigns.find((c) => c.id === a.campaign_id);
                    const campaignTitle = campaign?.campaign_title || 'Untitled campaign';
                    return (
                      <ApplicationRow
                        key={a.id}
                        app={a}
                        campaignTitle={campaignTitle}
                        onAction={updateApplicationStatus}
                        statusTagClasses={statusTagClasses}
                      />
                    );
                  })}
                </div>
              )}
          </div>
        )}

        {/* Payments Tab */}
        {selectedCampaignId === null && activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-5">
              <StatCard label="Total logged" value={fmtINR(totalSpend())} className="text-[oklch(0.8_0.16_75)]" />
              <StatCard label="Released" value={fmtINR(totalSpend(true))} className="text-emerald-400" />
              <StatCard label="Pending" value={fmtINR(totalSpend() - totalSpend(true))} />
            </div>
            <div className="rounded-2xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.15_0.02_80)] p-7">
              <h2 className="font-display text-lg font-bold text-white mb-5">Payment history</h2>
              {payments.length === 0
                ? emptyBox('No spend logged yet.')
                : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-wide text-[oklch(0.55_0.01_85)] border-b border-[oklch(0.25_0.02_80)]">
                          <th className="py-2.5 pr-3">Amount</th>
                          <th className="py-2.5 pr-3">Status</th>
                          <th className="py-2.5 pr-3">Collaboration ID</th>
                          <th className="py-2.5 pr-3">Released</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p) => (
                          <tr key={p.id} className="border-b border-[oklch(0.2_0.02_80)] last:border-none">
                            <td className="py-3 pr-3 text-white">{fmtINR(p.amount)}</td>
                            <td className="py-3 pr-3">
                              <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${statusTagClasses(p.status)}`}>
                                {p.status || 'pending'}
                              </span>
                            </td>
                            <td className="py-3 pr-3 text-[oklch(0.75_0.01_85)]">{p.collaboration_id.slice(0, 8)}…</td>
                            <td className="py-3 pr-3 text-[oklch(0.6_0.015_85)]">{fmtDate(p.released_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {selectedCampaignId === null && activeTab === 'messages' && (
          <>
            {!selectedCollabId ? (
              <div className="rounded-2xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.15_0.02_80)] p-7">
                <h2 className="font-display text-lg font-bold text-white mb-5">Conversations</h2>
                {collaborations.length === 0
                  ? emptyBox('Messages open up once you approve a creator into an active collaboration.')
                  : (
                    <div className="space-y-2">
                      {collaborations.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => openThread(c.id)}
                          className="w-full flex items-center justify-between rounded-xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.11_0.01_80)] px-4 py-3.5 text-left hover:border-[oklch(0.3_0.02_80)]"
                        >
                          <div>
                            <div className="text-sm font-semibold text-white">Collaboration {c.id.slice(0, 8)}…</div>
                            <div className="text-xs text-[oklch(0.6_0.015_85)]">Status: {c.status || 'active'}</div>
                          </div>
                          <span className="text-xs text-[oklch(0.6_0.015_85)]">Open &rarr;</span>
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setSelectedCollabId(null)}
                  className="mb-5 flex items-center gap-2 text-xs text-[oklch(0.6_0.015_85)] hover:text-white"
                >
                  <ArrowLeft size={14} /> All conversations
                </button>
                <div className="flex h-[480px] flex-col overflow-hidden rounded-xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.11_0.01_80)]">
                  <div className="flex-1 space-y-2.5 overflow-y-auto p-5">
                    {threadMessages.length === 0
                      ? emptyBox('No messages yet. Say hello!')
                      : threadMessages.map((m) => (
                        <div
                          key={m.id}
                          className={`max-w-[70%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.sender_id === userId
                              ? 'ml-auto bg-[oklch(0.8_0.16_75)] text-black'
                              : 'bg-[oklch(0.18_0.02_80)] text-white'
                            }`}
                        >
                          {m.content}
                          <div className="mt-1 text-[10px] opacity-60">{fmtTime(m.created_at)}</div>
                        </div>
                      ))}
                  </div>
                  <div className="flex gap-2 border-t border-[oklch(0.25_0.02_80)] p-3.5">
                    <input
                      value={threadInput}
                      onChange={(e) => setThreadInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 rounded-full border border-[oklch(0.3_0.02_80)] bg-[oklch(0.16_0.02_80)] px-4 py-2.5 text-sm text-white outline-none placeholder:text-[oklch(0.5_0.01_85)]"
                    />
                    <button
                      onClick={sendMessage}
                      className="flex items-center gap-1.5 rounded-full bg-[oklch(0.8_0.16_75)] px-5 py-2.5 text-xs font-bold text-black hover:bg-[oklch(0.85_0.16_75)]"
                    >
                      <SendIcon size={13} /> Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Contract modal */}
      {contractModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setContractModal(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[oklch(0.28_0.02_80)] bg-[oklch(0.14_0.02_80)] p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-lg font-bold text-white">Collaboration Agreement</h2>
            <p className="mt-1 mb-4 text-xs text-[oklch(0.55_0.01_85)]">
              Auto-generated from the campaign terms. Not a substitute for legal advice — review before signing.
            </p>
            <pre className="mb-5 whitespace-pre-wrap rounded-lg bg-[oklch(0.1_0.01_80)] p-4 text-sm leading-relaxed text-[oklch(0.9_0.01_85)]">
              {contractModal.contract_text}
            </pre>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setContractModal(null)}
                className="rounded-full border border-[oklch(0.3_0.02_80)] px-5 py-2.5 text-xs font-semibold text-white"
              >
                Close
              </button>
              <button
                onClick={signContract}
                disabled={signing || !!contractModal.brand_signed_at}
                className="rounded-full bg-[oklch(0.8_0.16_75)] px-5 py-2.5 text-xs font-bold text-black hover:bg-[oklch(0.85_0.16_75)] disabled:opacity-50"
              >
                {contractModal.brand_signed_at ? 'Already Signed' : signing ? 'Signing…' : 'Sign & Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------------------
interface ApplicationRowProps {
  app: Application;
  campaignTitle: string;
  onAction: (id: string, status: string) => Promise<void>;
  statusTagClasses: (s?: string) => string;
}

function ApplicationRow({
  app,
  campaignTitle,
  onAction,
  statusTagClasses,
}: ApplicationRowProps) {
  const applicant = app.users || {};
  const applicantName =
    [applicant.first_name, applicant.last_name].filter(Boolean).join(' ') ||
    applicant.email ||
    'Unknown creator';
  const status = (app.status || 'pending').toLowerCase();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.11_0.01_80)] p-4">
      <div>
        <h3 className="text-sm font-semibold text-white">
          {applicantName}{' '}
          {applicant.role && (
            <span className="text-xs text-[oklch(0.6_0.015_85)] font-normal">
              ({applicant.role})
            </span>
          )}
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[oklch(0.6_0.015_85)]">
          <span>Campaign: {campaignTitle}</span>
          <span>Applied: {fmtDate(app.applied_at)}</span>
          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${statusTagClasses(status)}`}>
            {status}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          disabled={status === 'approved'}
          onClick={() => onAction(app.id, 'approved')}
          className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Approve
        </button>
        <button
          disabled={status === 'rejected'}
          onClick={() => onAction(app.id, 'rejected')}
          className="rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, className = 'text-white' }: { label: string; value: string; className?: string }) {
  return (
    <div className="rounded-2xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.15_0.02_80)] p-6">
      <div className="text-xs uppercase tracking-wide text-[oklch(0.6_0.015_85)]">{label}</div>
      <div className={`mt-2 font-display text-xl font-extrabold ${className}`}>{value}</div>
    </div>
  );
}
