// 'use client';
// 
// import React, { useState } from 'react';
// import Link from 'next/link';
// 
// export default function EditorPortalPage() {
//   const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'earnings'>('projects');
// 
//   return (
//     <main className="min-h-screen bg-[oklch(0.12_0.01_80)] text-white pt-24 pb-20">
//       <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[oklch(0.25_0.02_80)] pb-6 gap-4">
//           <div>
//             <div className="text-xs uppercase tracking-wider text-[oklch(0.8_0.16_75)] font-bold">Editor Portal</div>
//             <h1 className="text-3xl font-bold font-display text-white mt-1">Video Editor Workspace</h1>
//           </div>
//           <div className="flex gap-3">
//             <Link href="/editors" className="rounded-full bg-[oklch(0.8_0.16_75)] px-5 py-2.5 text-xs font-bold text-black hover:bg-[oklch(0.85_0.16_75)] transition-all">
//               Update Portfolio
//             </Link>
//             <Link href="/" className="rounded-full border border-[oklch(0.3_0.02_80)] bg-[oklch(0.15_0.02_80)] px-5 py-2.5 text-xs font-bold text-white hover:border-[oklch(0.8_0.16_75)]">
//               Exit Portal
//             </Link>
//           </div>
//         </div>
// 
//         {/* Tabs */}
//         <div className="mt-6 flex gap-3 border-b border-[oklch(0.22_0.02_80)] pb-3 text-sm font-semibold">
//           {[
//             { id: 'projects', label: 'Active Video Projects (2)' },
//             { id: 'services', label: 'My Packages (3)' },
//             { id: 'earnings', label: 'Cleared Income (₹42,000)' }
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
//       {/* Content */}
//       <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
//         {activeTab === 'projects' && (
//           <div className="space-y-4">
//             {[
//               { client: 'Rohan Sharma (Creator)', title: '5x Hook Animations + Captions Edit', status: 'Rendering V2 Draft', payout: '₹7,500' },
//               { client: 'Mamaearth Brand', title: '15-Sec D2C Facebook Ad Color Grade', status: 'Final Review', payout: '₹12,000' }
//             ].map((proj, i) => (
//               <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.15_0.02_80)] p-6 gap-4">
//                 <div>
//                   <span className="text-xs font-bold text-[oklch(0.8_0.16_75)] uppercase">{proj.client}</span>
//                   <h3 className="text-lg font-bold font-display text-white mt-0.5">{proj.title}</h3>
//                   <p className="text-xs text-[oklch(0.68_0.015_85)] mt-1">Status: {proj.status}</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className="text-base font-extrabold text-emerald-400 font-display">{proj.payout}</span>
//                   <button className="rounded-xl border border-[oklch(0.3_0.02_80)] bg-[oklch(0.2_0.02_80)] px-4 py-2 text-xs font-bold text-white hover:border-[oklch(0.8_0.16_75)]">
//                     Upload Draft &rarr;
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
// 
//         {activeTab === 'services' && (
//           <div className="rounded-2xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.15_0.02_80)] p-8 text-center text-sm text-[oklch(0.68_0.015_85)]">
//             3 Active service packages listed on the Fewsion Editor Marketplace.
//           </div>
//         )}
// 
//         {activeTab === 'earnings' && (
//           <div className="rounded-2xl border border-[oklch(0.25_0.02_80)] bg-[oklch(0.15_0.02_80)] p-8 text-center text-sm text-[oklch(0.68_0.015_85)]">
//             Total Cleared Income: ₹42,000 transferred via direct Razorpay Escrow to bank.
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }

'use client';

/**
 * Editor Dashboard — Ported from the static Fewsion HTML editor dashboard.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Target,
  Megaphone,
  Wallet,
  MessageSquare,
  Star,
  Settings,
  Bell,
  LogOut,
  ArrowLeft,
  Send as SendIcon,
  Plus,
  ExternalLink,
  Check,
  TrendingUp,
  FileText,
  Menu,
  X,
} from 'lucide-react';
import { supabase } from '@/utils/supabase';

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------
type TabId = 'overview' | 'portfolio' | 'campaigns' | 'payments' | 'messages' | 'reviews' | 'settings';

interface EditorProfile {
  id: string;
  user_id: string;
  editor_name?: string;
  city_state?: string;
  experience_duration?: string;
  one_line_bio?: string;
  languages?: string[];
  specialised_formats?: string[];
  primary_software?: string[];
  special_skills?: string[];
  edited_creator_niches?: string[];
  total_videos_edited?: number;
  turnaround_time?: string;
  availability_status?: string;
  rate_short_form?: string;
  portfolio_url?: string;
  ai_total_score?: number;
  ai_grade?: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  link: string;
  views: number;
  ctr: number;
  engagement: number;
  niche?: string;
}

interface Campaign {
  id: string;
  title: string;
  brand_name?: string;
  niches?: string[];
  budget?: number;
  already_applied?: boolean;
}

interface Collaboration {
  id: string;
  campaign_id: string;
  brand_id: string;
  editor_id: string;
  status?: string;
  deadline?: string;
  campaign_title?: string;
  brand_name?: string;
  editor_invite_status?: string;
}

interface Payment {
  id: string;
  collaboration_id: string;
  amount?: number;
  status?: string;
  released_at?: string;
}

interface Review {
  id: string;
  rating?: number;
  review?: string;
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
  { id: 'overview', label: 'Video Workspace', icon: LayoutDashboard },
  { id: 'portfolio', label: 'Portfolio & Niches', icon: Target },
  { id: 'campaigns', label: 'Browse Campaigns', icon: Megaphone },
  { id: 'payments', label: 'Payout History', icon: Wallet },
  { id: 'messages', label: 'Feedback Threads', icon: MessageSquare },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'settings', label: 'Profile Settings', icon: Settings },
];

const TAB_COPY: Record<TabId, { title: string; subtitle: string }> = {
  overview: { title: 'Editor Pipeline', subtitle: 'Grab newly uploaded raw assets and push final render links.' },
  portfolio: { title: 'Portfolio & Niches', subtitle: 'Your performance-backed showcase — this is what brands filter and match on.' },
  campaigns: { title: 'Browse Campaigns', subtitle: 'Open briefs from brands looking for an editor like you.' },
  payments: { title: 'Payout History', subtitle: 'Track earnings across every collaboration — funds are escrow-protected until milestones are approved.' },
  messages: { title: 'Feedback Threads', subtitle: "Conversations with the brands and creators you're editing for." },
  reviews: { title: 'Reviews', subtitle: "Feedback left by brands and creators you've worked with." },
  settings: { title: 'Profile Settings', subtitle: 'Your public editor profile, as brands and creators see it.' },
};

const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString() : '—');
const fmtTime = (d?: string) => (d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');
const fmtINR = (n?: number) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function EditorPortalPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [userId, setUserId] = useState<string | null>(null);

  const [profile, setProfile] = useState<EditorProfile | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Navigation and Interactive state
  const [notifOpen, setNotifOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<MessageRow[]>([]);
  const [threadInput, setThreadInput] = useState('');
  const [contractModal, setContractModal] = useState<Contract | null>(null);
  const [signing, setSigning] = useState(false);

  // Portfolio form fields
  const [pfTitle, setPfTitle] = useState('');
  const [pfLink, setPfLink] = useState('');
  const [pfViews, setPfViews] = useState('');
  const [pfCtr, setPfCtr] = useState('');
  const [pfEngagement, setPfEngagement] = useState('');
  const [pfNiche, setPfNiche] = useState('');
  const [pfErr, setPfErr] = useState('');
  const [addingPortfolio, setAddingPortfolio] = useState(false);

  const [applyingCampaignId, setApplyingCampaignId] = useState<string | null>(null);

  // ---------------------------------------------------------------------
  // Data enrichment helper
  // ---------------------------------------------------------------------
  const enrichWithCampaignAndBrand = useCallback(async (collabs: Collaboration[]) => {
    const campaignIds = Array.from(new Set(collabs.map((c) => c.campaign_id).filter(Boolean)));
    if (!campaignIds.length) return collabs;

    const { data: campaignBriefs, error: cErr } = await supabase
      .from('campaign_briefs')
      .select('*')
      .in('id', campaignIds);

    if (cErr) console.error('enrich failed on campaign_briefs:', cErr);

    const campaignsById: Record<string, any> = {};
    (campaignBriefs || []).forEach((c) => {
      campaignsById[c.id] = c;
    });

    const brandIds = Array.from(new Set((campaignBriefs || []).map((c) => c.brand_id).filter(Boolean)));
    let brandsById: Record<string, string> = {};
    if (brandIds.length) {
      const { data: brands, error: bErr } = await supabase
        .from('brand_profiles')
        .select('user_id, brand_name')
        .in('user_id', brandIds);
      if (bErr) console.error('enrich failed on brand_profiles:', bErr);
      (brands || []).forEach((b) => {
        brandsById[b.user_id] = b.brand_name || 'Brand partner';
      });
    }

    return collabs.map((collab) => {
      const campaign = campaignsById[collab.campaign_id];
      return {
        ...collab,
        campaign_title: campaign ? campaign.campaign_title : 'Untitled campaign',
        brand_name: campaign ? (brandsById[campaign.brand_id] || 'Brand partner') : 'Brand partner',
      };
    });
  }, []);

  // ---------------------------------------------------------------------
  // Load All Data
  // ---------------------------------------------------------------------
  const loadAll = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = '/login';
      return;
    }
    setUserId(user.id);

    const [profileRes, notifRes, collabRes, reviewsRes, portfolioRes] = await Promise.all([
      supabase.from('editor_profiles').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
      supabase.from('collaborations').select('*').eq('editor_id', user.id).order('created_at', { ascending: false }),
      supabase.from('reviews').select('*').eq('reviewee_id', user.id),
      supabase.from('portfolio_items').select('*').eq('editor_id', user.id).order('created_at', { ascending: false }),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data);
    }
    setNotifications(notifRes.data || []);
    setReviews(reviewsRes.data || []);
    setPortfolioItems(portfolioRes.data || []);

    const loadedCollabs = collabRes.data || [];
    const enrichedCollabs = await enrichWithCampaignAndBrand(loadedCollabs);
    setCollaborations(enrichedCollabs);

    const collabIds = enrichedCollabs.map((c) => c.id);
    if (collabIds.length) {
      const { data: paymentsRes } = await supabase
        .from('payments')
        .select('*')
        .in('collaboration_id', collabIds)
        .order('released_at', { ascending: false });
      setPayments(paymentsRes || []);
    } else {
      setPayments([]);
    }

    setLoading(false);
  }, [enrichWithCampaignAndBrand]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ---------------------------------------------------------------------
  // Realtime Subscriptions
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`editor-portal-live-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          setNotifications((prev) => [payload.new as NotificationRow, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'collaborations', filter: `editor_id=eq.${userId}` },
        async (payload) => {
          if (payload.eventType === 'DELETE') {
            setCollaborations((prev) => prev.filter((r) => r.id !== payload.old.id));
          } else {
            const enriched = await enrichWithCampaignAndBrand([payload.new as Collaboration]);
            const updated = enriched[0];
            setCollaborations((prev) => {
              const idx = prev.findIndex((r) => r.id === updated.id);
              if (idx > -1) {
                const copy = [...prev];
                copy[idx] = updated;
                return copy;
              } else {
                return [updated, ...prev];
              }
            });
          }
        }
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, (payload) => {
        const row = (payload.new || payload.old) as Payment;
        if (!row) return;
        setCollaborations((collabs) => {
          const collabIds = collabs.map((c) => c.id);
          if (collabIds.includes(row.collaboration_id)) {
            setPayments((prev) => {
              if (payload.eventType === 'DELETE') {
                return prev.filter((p) => p.id !== row.id);
              }
              const idx = prev.findIndex((p) => p.id === row.id);
              if (idx > -1) {
                const copy = [...prev];
                copy[idx] = row;
                return copy;
              } else {
                return [row, ...prev];
              }
            });
          }
          return collabs;
        });
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMsg = payload.new as MessageRow;
        setSelectedCollabId((currentCollabId) => {
          if (currentCollabId === newMsg.collaboration_id) {
            setThreadMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
          return currentCollabId;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, enrichWithCampaignAndBrand]);

  // ---------------------------------------------------------------------
  // Notifications Actions
  // ---------------------------------------------------------------------
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.is_read).length;
  }, [notifications]);

  const markNotificationsRead = useCallback(async () => {
    if (!userId) return;
    const unread = notifications.filter((n) => !n.is_read);
    if (!unread.length) return;
    const ids = unread.map((n) => n.id);
    const { error } = await supabase.from('notifications').update({ is_read: true }).in('id', ids);
    if (error) {
      console.error('Failed to mark notifications read:', error);
      return;
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }, [notifications, userId]);

  const toggleNotifPanel = useCallback(() => {
    setNotifOpen((prev) => {
      const next = !prev;
      if (next) {
        markNotificationsRead();
      }
      return next;
    });
  }, [markNotificationsRead]);

  // ---------------------------------------------------------------------
  // Message Thread Loader
  // ---------------------------------------------------------------------
  const loadMessages = useCallback(async (collabId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('collaboration_id', collabId)
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Failed to load messages:', error);
      setThreadMessages([]);
    } else {
      setThreadMessages(data || []);
    }
  }, []);

  const selectCollabThread = useCallback((collabId: string | null) => {
    setSelectedCollabId(collabId);
    if (collabId) {
      loadMessages(collabId);
    } else {
      setThreadMessages([]);
    }
  }, [loadMessages]);

  const sendMessage = useCallback(async () => {
    if (!selectedCollabId || !threadInput.trim() || !userId) return;
    const content = threadInput.trim();
    setThreadInput('');
    const { data, error } = await supabase
      .from('messages')
      .insert({ collaboration_id: selectedCollabId, sender_id: userId, content })
      .select()
      .single();
    if (error) {
      alert('Message failed to send: ' + error.message);
      setThreadInput(content);
    } else if (data) {
      setThreadMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });
    }
  }, [selectedCollabId, threadInput, userId]);

  // ---------------------------------------------------------------------
  // Invite Response Actions
  // ---------------------------------------------------------------------
  const respondToInvite = useCallback(async (collaborationId: string, accept: boolean) => {
    const newInviteStatus = accept ? 'accepted' : 'declined';
    const updates: Record<string, any> = { editor_invite_status: newInviteStatus };
    if (!accept) updates.editor_id = null;

    const { error } = await supabase.from('collaborations').update(updates).eq('id', collaborationId);
    if (error) {
      alert("Couldn't update invite status: " + error.message);
      return;
    }

    setCollaborations((prev) =>
      prev.map((c) => {
        if (c.id === collaborationId) {
          return { ...c, ...updates };
        }
        return c;
      })
    );
  }, []);

  // ---------------------------------------------------------------------
  // Campaigns Browse & Apply Actions
  // ---------------------------------------------------------------------
  const loadOpenCampaigns = useCallback(async () => {
    if (!userId) return;
    const { data: campaignList, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load campaigns:', error);
      return;
    }

    const { data: myApps, error: appErr } = await supabase
      .from('campaign_applications')
      .select('campaign_id')
      .eq('editor_id', userId);

    if (appErr) console.error('Failed to load campaign applications:', appErr);

    const appliedIds = new Set((myApps || []).map((a) => a.campaign_id));
    const enriched = (campaignList || []).map((c: any) => ({
      id: c.id,
      title: c.title,
      brand_name: c.brand_profiles?.company_name || 'Brand partner',
      niches: c.niche ? [c.niche] : [],
      budget: Number(c.budget_inr || 0),
      already_applied: appliedIds.has(c.id),
    }));

    setCampaigns(enriched);
  }, [userId]);

  const applyToCampaign = useCallback(async (campaignId: string) => {
    if (!userId) return;
    setApplyingCampaignId(campaignId);
    const { error } = await supabase
      .from('campaign_applications')
      .insert({ campaign_id: campaignId, editor_id: userId });

    setApplyingCampaignId(null);
    if (error) {
      alert("Couldn't apply: " + error.message);
      return;
    }

    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          return { ...c, already_applied: true };
        }
        return c;
      })
    );
  }, [userId]);

  useEffect(() => {
    if (activeTab === 'campaigns') {
      loadOpenCampaigns();
    }
  }, [activeTab, loadOpenCampaigns]);

  // ---------------------------------------------------------------------
  // Portfolio Actions
  // ---------------------------------------------------------------------
  const handleAddPortfolio = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (!pfTitle.trim() || !pfLink.trim()) {
      setPfErr('Title and link are required.');
      return;
    }
    setPfErr('');
    setAddingPortfolio(true);

    const { data, error } = await supabase
      .from('portfolio_items')
      .insert({
        editor_id: userId,
        title: pfTitle.trim(),
        link: pfLink.trim(),
        views: Number(pfViews) || 0,
        ctr: Number(pfCtr) || 0,
        engagement: Number(pfEngagement) || 0,
        niche: pfNiche.trim() || null,
      })
      .select()
      .single();

    setAddingPortfolio(false);
    if (error) {
      setPfErr(error.message);
      return;
    }

    if (data) {
      setPortfolioItems((prev) => [data, ...prev]);
      setPfTitle('');
      setPfLink('');
      setPfViews('');
      setPfCtr('');
      setPfEngagement('');
      setPfNiche('');
    }
  }, [pfTitle, pfLink, pfViews, pfCtr, pfEngagement, pfNiche, userId]);

  // ---------------------------------------------------------------------
  // Contract Actions
  // ---------------------------------------------------------------------
  const viewContract = useCallback(async (collabId: string) => {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('collaboration_id', collabId)
      .maybeSingle();

    if (error) {
      alert("Couldn't load contract: " + error.message);
      return;
    }
    if (!data) {
      alert('No contract has been generated for this collaboration yet.');
      return;
    }
    setContractModal(data);
  }, []);

  const signContract = useCallback(async () => {
    if (!contractModal) return;
    const name = window.prompt('Type your full legal name to sign:');
    if (!name) return;

    setSigning(true);
    const { data: updated, error } = await supabase
      .from('contracts')
      .update({
        counterparty_signed_at: new Date().toISOString(),
        counterparty_signature_name: name,
      })
      .eq('id', contractModal.id)
      .select()
      .single();

    setSigning(false);
    if (error) {
      alert("Couldn't sign contract: " + error.message);
      return;
    }

    if (updated?.brand_signed_at && updated?.counterparty_signed_at) {
      await supabase.from('contracts').update({ status: 'signed_both' }).eq('id', contractModal.id);
    }

    alert('Contract signed successfully. Once the brand also signs, the agreement is finalized.');
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
  // Calculations / Derived Stats
  // ---------------------------------------------------------------------
  const stats = useMemo(() => {
    const active = collaborations.filter((c) => {
      const s = (c.status || '').toLowerCase();
      return s !== 'completed' && s !== 'delivered';
    });
    const completed = collaborations.filter((c) => {
      const s = (c.status || '').toLowerCase();
      return s === 'completed' || s === 'delivered';
    });
    const totalRevenueVal = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const releasedRevenueVal = payments
      .filter((p) => p.status === 'released')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const pendingInvites = collaborations.filter((c) => c.editor_invite_status === 'pending');

    const withRating = reviews.filter((r) => r.rating != null);
    const avgRating = withRating.length
      ? (withRating.reduce((s, r) => s + (r.rating || 0), 0) / withRating.length).toFixed(1)
      : null;

    return {
      activeCount: active.length,
      completedCount: completed.length,
      totalRevenue: totalRevenueVal,
      releasedRevenue: releasedRevenueVal,
      pendingInvites,
      avgRating,
    };
  }, [collaborations, payments, reviews]);

  const initials = (name?: string) => {
    if (!name) return '--';
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm font-semibold">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#f0ece4] flex">
      {/* Sidebar Backdrop Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-[260px] bg-[#0e0e0e] border-r border-white/5 p-8 flex flex-col gap-10 z-40 transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-black text-white tracking-tight">
            Few<span className="text-[#F5A623]">sion</span>
          </Link>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <ul className="flex flex-col gap-2 flex-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <li key={tab.id}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    selectCollabThread(null);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                    active
                      ? 'bg-[#141414] text-white border-l-4 border-[#F5A623] rounded-l-none'
                      : 'text-gray-400 hover:text-white hover:bg-[#141414]/50'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#F5A623] to-[#FF6B35] rounded-full flex items-center justify-center text-black font-black text-xs">
              {initials(profile?.editor_name || 'Editor')}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">
                {profile?.editor_name || 'Loading editor...'}
              </div>
              <div className="text-[10px] text-[#F5A623] font-medium uppercase tracking-wider truncate">
                {profile?.city_state || 'City, State'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-4 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs font-bold font-display transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out Account</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 md:pl-[260px] min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 bg-[#080808]/80 backdrop-blur-md border-b border-white/5 px-6 py-5 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg bg-[#141414] border border-white/10 text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-black font-display text-white tracking-tight">
                {TAB_COPY[activeTab].title}
              </h1>
              <p className="text-xs text-gray-400 mt-1">{TAB_COPY[activeTab].subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={toggleNotifPanel}
                className="relative w-10 h-10 rounded-full bg-[#141414] border border-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#F5A623] rounded-full border-2 border-[#080808]"></span>
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-[#141414] border border-white/10 rounded-xl shadow-2xl z-50 p-4 space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">Notifications</h3>
                    <hr className="border-white/5" />
                    {notifications.length === 0 ? (
                      <div className="text-center text-xs text-gray-500 py-6">No notifications yet.</div>
                    ) : (
                      <div className="space-y-3">
                        {notifications.slice(0, 10).map((n) => (
                          <div key={n.id} className="text-xs border-b border-white/5 pb-2 last:border-none">
                            <div className="flex items-start gap-2">
                              <span className="text-[#F5A623] mt-0.5">•</span>
                              <div>
                                <span className="text-white font-bold">{n.title}</span>
                                {n.message && <p className="text-gray-400 mt-0.5">{n.message}</p>}
                                <span className="text-[10px] text-gray-500 block mt-1">{fmtDate(n.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <Link
              href="/creators"
              className="bg-[#F5A623] text-black font-extrabold text-xs px-5 py-3 rounded-full hover:bg-[#F5A623]/95 transition-all shadow-md"
            >
              Find Creator
            </Link>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto">
          {/* TAB 1: OVERVIEW / WORKSPACE */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Pending Invites */}
              {stats.pendingInvites.length > 0 && (
                <div className="bg-[#141414] border border-[#F5A623]/30 rounded-2xl p-6 space-y-4">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#F5A623] rounded-full animate-ping"></span>
                    <span>Pending Collaboration Invites ({stats.pendingInvites.length})</span>
                  </h2>
                  <div className="space-y-3">
                    {stats.pendingInvites.map((invite) => (
                      <div
                        key={invite.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#0e0e0e] border border-white/5 rounded-xl p-4 gap-4"
                      >
                        <div>
                          <h3 className="text-sm font-extrabold text-white">{invite.campaign_title}</h3>
                          <p className="text-xs text-gray-400 mt-1">Brand: {invite.brand_name}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => respondToInvite(invite.id, true)}
                            className="bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-extrabold px-4 py-2 rounded-full transition-all"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => respondToInvite(invite.id, false)}
                            className="bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-extrabold px-4 py-2 rounded-full transition-all"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Overview */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-2">Avg turnaround</span>
                  <div className="text-lg font-black text-white truncate">
                    {profile?.turnaround_time || '—'}
                  </div>
                  {profile?.availability_status && (
                    <div className="text-[10px] text-[#F5A623] font-bold mt-1 uppercase">
                      ● {profile.availability_status}
                    </div>
                  )}
                </div>

                <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-2">Active edits</span>
                  <div className="text-2xl font-black text-white">{stats.activeCount}</div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    {collaborations.length} total assigned
                  </div>
                </div>

                <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-2">Completed renders</span>
                  <div className="text-2xl font-black text-white">{stats.completedCount}</div>
                  {profile?.ai_grade && (
                    <div className="text-[10px] text-emerald-400 font-bold mt-1 uppercase">
                      Grade: {profile.ai_grade}
                    </div>
                  )}
                </div>

                <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-2">Revenue Cleared</span>
                  <div className="text-2xl font-black text-[#F5A623]">{fmtINR(stats.releasedRevenue)}</div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    of {fmtINR(stats.totalRevenue)} logged
                  </div>
                </div>
              </div>

              {/* Grid split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Timelines */}
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-sm font-black uppercase tracking-wider text-white">Active Video Timelines</h2>
                  {collaborations.length === 0 ? (
                    <div className="bg-[#141414] border border-white/5 rounded-2xl p-8 text-center text-xs text-gray-500">
                      No assigned edits yet. Once a brand assigns you to a collaboration, it will appear here.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {collaborations.map((collab) => {
                        const isDone = ['completed', 'delivered'].includes(collab.status || '');
                        return (
                          <div
                            key={collab.id}
                            className="bg-[#141414] border border-white/5 hover:border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                          >
                            <div className="space-y-1">
                              <h3 className="text-sm font-extrabold text-white leading-tight">
                                {collab.campaign_title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="text-gray-400">Brand: {collab.brand_name}</span>
                                <span className="text-gray-600">•</span>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    isDone
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                      : 'bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20'
                                  }`}
                                >
                                  {collab.status || 'Active'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center">
                              {collab.deadline && (
                                <span className="text-xs text-gray-400 mr-2">
                                  Due: {fmtDate(collab.deadline)}
                                </span>
                              )}
                              <button
                                onClick={() => {
                                  setActiveTab('messages');
                                  selectCollabThread(collab.id);
                                }}
                                className="bg-[#141414] border border-white/10 hover:border-white/20 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                              >
                                Message
                              </button>
                              <button
                                onClick={() => viewContract(collab.id)}
                                className="bg-[#141414] border border-white/10 hover:border-white/20 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                              >
                                View Contract
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Notifications Feed */}
                <div className="space-y-4">
                  <h2 className="text-sm font-black uppercase tracking-wider text-white">Project Notifications</h2>
                  <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-4">
                    {notifications.length === 0 ? (
                      <div className="text-center text-xs text-gray-500 py-8">No notifications yet.</div>
                    ) : (
                      <div className="space-y-4">
                        {notifications.slice(0, 6).map((notif) => (
                          <div key={notif.id} className="flex gap-3 text-xs leading-normal">
                            <span className="text-[#F5A623] mt-0.5">{notif.is_read ? '✓' : '🔔'}</span>
                            <div>
                              <span className="text-white font-bold block">{notif.title}</span>
                              {notif.message && <p className="text-gray-400 mt-0.5">{notif.message}</p>}
                              <span className="text-[10px] text-gray-500 block mt-1">{fmtDate(notif.created_at)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PORTFOLIO & NICHES */}
          {activeTab === 'portfolio' && (
            <div className="space-y-8">
              {/* Niches Box */}
              <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
                <h2 className="text-sm font-black uppercase tracking-wider text-white mb-4">Your niches</h2>
                <div className="flex flex-wrap gap-2">
                  {profile?.edited_creator_niches && profile.edited_creator_niches.length > 0 ? (
                    profile.edited_creator_niches.map((niche, idx) => (
                      <span
                        key={idx}
                        className="bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] text-xs font-semibold px-3 py-1.5 rounded-full"
                      >
                        🏷️ {niche}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">No niches tagged yet.</span>
                  )}
                </div>
              </div>

              {/* Add portfolio Piece form */}
              <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-black uppercase tracking-wider text-white">Add a portfolio piece</h2>
                <form onSubmit={handleAddPortfolio} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500">Video title</label>
                      <input
                        type="text"
                        placeholder="e.g. 5x Hook Animations + Captions"
                        value={pfTitle}
                        onChange={(e) => setPfTitle(e.target.value)}
                        className="w-full bg-[#0e0e0e] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#F5A623]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500">Link (YouTube/Drive/Reel)</label>
                      <input
                        type="url"
                        placeholder="https://youtu.be/..."
                        value={pfLink}
                        onChange={(e) => setPfLink(e.target.value)}
                        className="w-full bg-[#0e0e0e] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#F5A623]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500">Views</label>
                      <input
                        type="number"
                        placeholder="15000"
                        value={pfViews}
                        onChange={(e) => setPfViews(e.target.value)}
                        className="w-full bg-[#0e0e0e] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#F5A623]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500">CTR %</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="7.5"
                        value={pfCtr}
                        onChange={(e) => setPfCtr(e.target.value)}
                        className="w-full bg-[#0e0e0e] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#F5A623]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500">Engagement %</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="10.2"
                        value={pfEngagement}
                        onChange={(e) => setPfEngagement(e.target.value)}
                        className="w-full bg-[#0e0e0e] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#F5A623]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500">Niche tag</label>
                      <input
                        type="text"
                        placeholder="e.g. Fitness"
                        value={pfNiche}
                        onChange={(e) => setPfNiche(e.target.value)}
                        className="w-full bg-[#0e0e0e] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#F5A623]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-red-400">{pfErr}</p>
                    <button
                      type="submit"
                      disabled={addingPortfolio}
                      className="bg-[#F5A623] hover:bg-[#F5A623]/90 text-black font-extrabold text-xs px-5 py-3 rounded-full transition-all flex items-center gap-2"
                    >
                      {addingPortfolio ? 'Saving...' : 'Add to portfolio'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Portfolio Grid */}
              <div className="space-y-4">
                <h2 className="text-sm font-black uppercase tracking-wider text-white">Portfolio pieces ({portfolioItems.length})</h2>
                {portfolioItems.length === 0 ? (
                  <div className="bg-[#141414] border border-white/5 rounded-2xl p-8 text-center text-xs text-gray-500">
                    No portfolio pieces yet. Add your best work above — real CTR and engagement numbers here are what get you matched with brands.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolioItems.map((item) => (
                      <div key={item.id} className="bg-[#141414] border border-white/5 hover:border-white/10 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="text-sm font-bold text-white line-clamp-1">{item.title}</h3>
                            {item.niche && (
                              <span className="bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase flex-shrink-0">
                                {item.niche}
                              </span>
                            )}
                          </div>
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-[#F5A623] truncate flex items-center gap-1"
                          >
                            <span className="truncate">{item.link}</span>
                            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                          </a>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5 text-center">
                          <div>
                            <span className="text-[10px] text-gray-500 block">Views</span>
                            <strong className="text-xs text-white">{item.views.toLocaleString()}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500 block">CTR</span>
                            <strong className="text-xs text-white">{item.ctr}%</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500 block">Engagement</span>
                            <strong className="text-xs text-white">{item.engagement}%</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: BROWSE CAMPAIGNS */}
          {activeTab === 'campaigns' && (
            <div className="space-y-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-white">Open campaigns</h2>
              {campaigns.length === 0 ? (
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-8 text-center text-xs text-gray-500">
                  No open campaigns right now. Check back soon.
                </div>
              ) : (
                <div className="space-y-4">
                  {campaigns.map((camp) => (
                    <div
                      key={camp.id}
                      className="bg-[#141414] border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <h3 className="text-base font-extrabold text-white">{camp.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                          <span>{camp.brand_name}</span>
                          {camp.niches && camp.niches.length > 0 && (
                            <>
                              <span>•</span>
                              <span>{camp.niches.join(', ')}</span>
                            </>
                          )}
                        </div>
                        <div className="text-sm font-black text-[#F5A623] pt-1">
                          {fmtINR(camp.budget)}
                        </div>
                      </div>

                      <button
                        onClick={() => applyToCampaign(camp.id)}
                        disabled={camp.already_applied || applyingCampaignId === camp.id}
                        className={`text-xs font-bold px-5 py-3 rounded-full transition-all self-start sm:self-center ${
                          camp.already_applied
                            ? 'bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed'
                            : 'bg-[#F5A623] hover:bg-[#F5A623]/95 text-black'
                        }`}
                      >
                        {applyingCampaignId === camp.id ? 'Applying...' : camp.already_applied ? 'Applied ✓' : 'Apply'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PAYOUT HISTORY */}
          {activeTab === 'payments' && (
            <div className="space-y-8">
              {/* Payment Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-1">Total logged</span>
                  <div className="text-2xl font-black text-[#F5A623]">{fmtINR(stats.totalRevenue)}</div>
                </div>
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-1">Released</span>
                  <div className="text-2xl font-black text-emerald-400">{fmtINR(stats.releasedRevenue)}</div>
                </div>
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-1">Pending escrow</span>
                  <div className="text-2xl font-black text-white">
                    {fmtINR(stats.totalRevenue - stats.releasedRevenue)}
                  </div>
                </div>
              </div>

              {/* Payment Table */}
              <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-black uppercase tracking-wider text-white">Payment history</h2>
                {payments.length === 0 ? (
                  <div className="text-center text-xs text-gray-500 py-8">No payments logged yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-gray-500 border-b border-white/5">
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Campaign</th>
                          <th className="pb-3">Released Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {payments.map((p) => {
                          const collab = collaborations.find((c) => c.id === p.collaboration_id);
                          return (
                            <tr key={p.id}>
                              <td className="py-4 font-bold text-white">{fmtINR(p.amount)}</td>
                              <td className="py-4">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    p.status === 'released'
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                      : 'bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20'
                                  }`}
                                >
                                  {p.status || 'pending'}
                                </span>
                              </td>
                              <td className="py-4 text-gray-400">{collab?.campaign_title || '—'}</td>
                              <td className="py-4 text-gray-400">{fmtDate(p.released_at)}</td>
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

          {/* TAB 5: MESSAGES / FEEDBACK THREADS */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              {!selectedCollabId ? (
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-4">
                  <h2 className="text-sm font-black uppercase tracking-wider text-white">Conversations</h2>
                  {collaborations.length === 0 ? (
                    <div className="text-center text-xs text-gray-500 py-8">
                      Feedback threads open up once you are assigned to a collaboration.
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {collaborations.map((collab) => (
                        <div
                          key={collab.id}
                          onClick={() => selectCollabThread(collab.id)}
                          className="py-4 flex justify-between items-center cursor-pointer group"
                        >
                          <div>
                            <div className="font-extrabold text-white group-hover:text-[#F5A623] transition-colors">
                              {collab.brand_name}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">{collab.campaign_title}</div>
                          </div>
                          <span className="text-xs text-gray-500 group-hover:text-white transition-colors">
                            Open &rarr;
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col h-[520px] bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
                  {/* Message Header */}
                  <div className="bg-[#0e0e0e] px-6 py-4 flex items-center justify-between border-b border-white/5">
                    <button
                      onClick={() => selectCollabThread(null)}
                      className="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-bold"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>All conversations</span>
                    </button>
                    <span className="text-xs font-bold text-[#F5A623]">
                      {collaborations.find((c) => c.id === selectedCollabId)?.brand_name}
                    </span>
                  </div>

                  {/* Messages Bubble List */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0e0e0e]/50">
                    {threadMessages.length === 0 ? (
                      <div className="text-center text-xs text-gray-500 py-12">
                        No messages yet. Say hello!
                      </div>
                    ) : (
                      threadMessages.map((m) => {
                        const isMine = m.sender_id === userId;
                        return (
                          <div
                            key={m.id}
                            className={`flex flex-col max-w-[70%] ${isMine ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                          >
                            <div
                              className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                                isMine ? 'bg-[#F5A623] text-black font-medium' : 'bg-[#1a1a1a] text-white'
                              }`}
                            >
                              {m.content}
                            </div>
                            <span className="text-[9px] text-gray-500 mt-1">{fmtTime(m.created_at)}</span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Send Input Area */}
                  <div className="p-4 bg-[#0e0e0e] border-t border-white/5 flex gap-3">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={threadInput}
                      onChange={(e) => setThreadInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') sendMessage();
                      }}
                      className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-full px-5 py-3 text-xs outline-none focus:border-[#F5A623]"
                    />
                    <button
                      onClick={sendMessage}
                      className="w-10 h-10 bg-[#F5A623] rounded-full flex items-center justify-center text-black hover:bg-[#F5A623]/90 transition-all flex-shrink-0"
                    >
                      <SendIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Average Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-1">Average Rating</span>
                  <div className="text-3xl font-black text-white flex items-baseline gap-1">
                    <span>{stats.avgRating || '--'}</span>
                    <span className="text-xs text-gray-500 font-bold">/5</span>
                  </div>
                </div>
                <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-1">Total Reviews</span>
                  <div className="text-3xl font-black text-[#F5A623]">
                    {reviews.length}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-black uppercase tracking-wider text-white">All Reviews</h2>
                {reviews.length === 0 ? (
                  <div className="text-center text-xs text-gray-500 py-8">
                    No reviews yet. They will appear here after you complete a collaboration.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((r) => (
                      <div key={r.id} className="bg-[#0e0e0e] border border-white/5 rounded-xl p-4 space-y-2">
                        <div className="flex gap-1 text-[#F5A623]">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <span key={idx}>{idx < (r.rating || 0) ? '★' : '☆'}</span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          {r.review || 'No written feedback provided.'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: PROFILE SETTINGS */}
          {activeTab === 'settings' && profile && (
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-6">
              <h2 className="text-sm font-black uppercase tracking-wider text-white border-b border-white/5 pb-4">
                Your profile settings
              </h2>

              <div className="divide-y divide-white/5 text-xs">
                <div className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-500">Editor name</span>
                  <span className="font-bold text-white">{profile.editor_name || '—'}</span>
                </div>
                <div className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-500">City / State</span>
                  <span className="font-bold text-white">{profile.city_state || '—'}</span>
                </div>
                <div className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-500">Experience Duration</span>
                  <span className="font-bold text-white">{profile.experience_duration || '—'}</span>
                </div>
                <div className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-500">One-line Bio</span>
                  <span className="font-bold text-white">{profile.one_line_bio || '—'}</span>
                </div>
                <div className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-500">Languages</span>
                  <span className="font-bold text-white">
                    {profile.languages && profile.languages.length > 0 ? profile.languages.join(', ') : '—'}
                  </span>
                </div>
                <div className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-500">Specialised Formats</span>
                  <span className="font-bold text-white">
                    {profile.specialised_formats && profile.specialised_formats.length > 0
                      ? profile.specialised_formats.join(', ')
                      : '—'}
                  </span>
                </div>
                <div className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-500">Primary Software</span>
                  <span className="font-bold text-white">
                    {profile.primary_software && profile.primary_software.length > 0
                      ? profile.primary_software.join(', ')
                      : '—'}
                  </span>
                </div>
                <div className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-500">Special Skills</span>
                  <span className="font-bold text-white">
                    {profile.special_skills && profile.special_skills.length > 0 ? profile.special_skills.join(', ') : '—'}
                  </span>
                </div>
                <div className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-500">Niches Edited For</span>
                  <span className="font-bold text-white">
                    {profile.edited_creator_niches && profile.edited_creator_niches.length > 0
                      ? profile.edited_creator_niches.join(', ')
                      : '—'}
                  </span>
                </div>
                <div className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-500">Total Videos Edited</span>
                  <span className="font-bold text-white">{profile.total_videos_edited || 0}</span>
                </div>
                <div className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-500">Turnaround Time</span>
                  <span className="font-bold text-white">{profile.turnaround_time || '—'}</span>
                </div>
                <div className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-500">Availability</span>
                  <span className="font-bold text-white">{profile.availability_status || '—'}</span>
                </div>
                <div className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-500">Rate Short Form</span>
                  <span className="font-bold text-white">{profile.rate_short_form || '—'}</span>
                </div>
                <div className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-500">Portfolio Link</span>
                  {profile.portfolio_url ? (
                    <a
                      href={profile.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#F5A623] hover:underline flex items-center gap-1"
                    >
                      <span>{profile.portfolio_url}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="font-bold text-white">—</span>
                  )}
                </div>
                <div className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-500">AI Score</span>
                  <span className="font-bold text-white">
                    {profile.ai_total_score != null
                      ? `${profile.ai_total_score}/100 (${profile.ai_grade || '—'})`
                      : '—'}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Link
                  href="/editors"
                  className="bg-[#F5A623] hover:bg-[#F5A623]/90 text-black font-extrabold text-xs px-5 py-3 rounded-full transition-all"
                >
                  Edit Profile &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Contract Modal */}
      {contractModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-black font-display text-white tracking-tight">Collaboration Agreement</h2>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                Auto-generated from campaign terms. Please review prior to signing.
              </p>
            </div>

            <pre className="whitespace-pre-wrap font-sans text-xs bg-[#0e0e0e] border border-white/5 p-4 rounded-xl text-gray-300 leading-relaxed max-h-[40vh] overflow-y-auto">
              {contractModal.contract_text}
            </pre>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/5 pt-4">
              <div className="text-[10px] text-gray-500 uppercase font-bold space-y-1">
                <div>
                  Brand: {contractModal.brand_signature_name ? `Signed (${contractModal.brand_signature_name})` : 'Awaiting Signature'}
                </div>
                <div>
                  Editor: {contractModal.counterparty_signature_name ? `Signed (${contractModal.counterparty_signature_name})` : 'Awaiting Signature'}
                </div>
              </div>

              <div className="flex gap-2 self-end">
                <button
                  onClick={() => setContractModal(null)}
                  className="bg-transparent border border-white/20 hover:border-white/30 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all"
                >
                  Close
                </button>
                {!contractModal.counterparty_signature_name && (
                  <button
                    onClick={signContract}
                    disabled={signing}
                    className="bg-[#F5A623] hover:bg-[#F5A623]/95 text-black font-extrabold text-xs px-5 py-2.5 rounded-full transition-all"
                  >
                    {signing ? 'Signing...' : 'Sign & Send'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
