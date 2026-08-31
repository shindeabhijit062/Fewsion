'use client';

/**
 * Creator Dashboard — ported from the static Fewsion HTML dashboard into
 * this Next.js app, using the same oklch design tokens as your existing
 * creator portal page.
 *
 * ASSUMPTIONS — adjust these to match your actual project:
 * 1. Supabase browser client: `import { createClient } from '@/lib/supabase/client'`
 *    exposing a `createClient()` factory. Swap this for wherever your client lives.
 * 2. Tables/columns mirror what the original fewsion-creator-data.js used:
 *    - creator_profiles (user_id, creator_name, ai_total_score, follower_count,
 *      engagement_rate, primary_platform)
 *    - applications (creator_id, campaign_title, brand_name, applied_at, status)
 *    - collaborations (id, creator_id, campaign_title, brand_name, payment,
 *      deadline, status)
 *    - payments (collaboration_id, creator_id, amount, status, released_at)
 *    - messages (collaboration_id, sender_id, content, created_at)
 *    - notifications (user_id, title, message, created_at, is_read)
 *    - reviews (creator_id, rating, review)
 *    - contracts (id, collaboration_id, contract_text, status,
 *      brand_signed_at, counterparty_signed_at, counterparty_signature_name)
 *    Rename any of these in the queries below if your schema differs.
 * 3. Auth: uses supabase.auth.getUser(); logging out redirects to /login.
 */

// import React, { useCallback, useEffect, useMemo, useState } from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Send as SendIcon,
  FileText,
  Clapperboard,
  Wallet,
  MessageSquare,
  Star,
  Bell,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import { supabase } from '@/utils/supabase';

import { KycStatus, KycData } from '@/components/KYCModal';

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------
export type TabId = 'overview' | 'applications' | 'collaborations' | 'payments' | 'messages' | 'reviews' | 'kyc';

interface Profile {
  creator_name?: string;
  ai_total_score?: number;
  follower_count?: number;
  engagement_rate?: number;
  primary_platform?: string;
  kyc_status?: KycStatus;
  kyc_details?: KycData;
}
interface Application {
  id: string;
  campaign_title?: string;
  brand_name?: string;
  applied_at?: string;
  status?: string;
}
interface Collaboration {
  id: string;
  campaign_title?: string;
  brand_name?: string;
  payment?: number;
  deadline?: string;
  status?: string;
}
interface Payment {
  id: string;
  collaboration_id?: string;
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
  title?: string;
  message?: string;
  created_at?: string;
  is_read?: boolean;
}
interface Review {
  id: string;
  rating?: number;
  review?: string;
}
interface Contract {
  id: string;
  collaboration_id: string;
  contract_text: string;
  status?: string;
  brand_signed_at?: string | null;
  counterparty_signed_at?: string | null;
  counterparty_signature_name?: string | null;
}

// Context shape
export interface CreatorContextType {
  loading: boolean;
  activeTab: TabId;
  setActiveTab: (t: TabId) => void;
  userId: string | null;
  profile: Profile | null;
  applications: Application[];
  collaborations: Collaboration[];
  payments: Payment[];
  notifications: NotificationRow[];
  reviews: Review[];
  notifOpen: boolean;
  setNotifOpen: (open: boolean) => void;
  selectedCollabId: string | null;
  setSelectedCollabId: (id: string | null) => void;
  threadMessages: MessageRow[];
  setThreadMessages: React.Dispatch<React.SetStateAction<MessageRow[]>>;
  threadInput: string;
  setThreadInput: React.Dispatch<React.SetStateAction<string>>;
  contractModal: Contract | null;
  setContractModal: React.Dispatch<React.SetStateAction<Contract | null>>;
  signing: boolean;
  setSigning: React.Dispatch<React.SetStateAction<boolean>>;
  totalEarnings: (releasedOnly?: boolean) => number;
  averageRating: number | null;
  unreadCount: number;
  initials: string;
  markNotificationsRead: () => Promise<void> | void;
  toggleNotifPanel: () => void;
  openThread: (collabId: string) => Promise<void> | void;
  sendMessage: () => Promise<void> | void;
  viewContract: (collabId: string) => Promise<void> | void;
  signContract: () => Promise<void> | void;
  handleLogout: () => Promise<void> | void;
  statusTagClasses: (s?: string) => string;
  kycStatus: KycStatus;
  setKycStatus: (s: KycStatus) => void;
  kycDetails: KycData | null;
  setKycDetails: (d: KycData | null) => void;
  kycModalOpen: boolean;
  setKycModalOpen: (open: boolean) => void;
  submitKycData: (data: KycData) => Promise<void>;
  isKycVerified: boolean;
  requireKycGate: (onSuccessAction: () => void) => boolean;
}

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'applications', label: 'My Applications', icon: FileText },
  { id: 'collaborations', label: 'Active Collabs', icon: Clapperboard },
  { id: 'payments', label: 'Earnings', icon: Wallet },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'kyc', label: 'KYC Verification', icon: FileText },
];

const TAB_COPY: Record<TabId, { title: string; subtitle: string }> = {
  overview: { title: 'Overview', subtitle: 'Track active campaign deliverables and clear escrow releases.' },
  applications: { title: 'My applications', subtitle: "Every brand campaign you've applied to." },
  collaborations: { title: 'Active collaborations', subtitle: 'Deliverables and deadlines for your live campaigns.' },
  payments: { title: 'Earnings', subtitle: 'Track payments and escrow releases across collaborations.' },
  messages: { title: 'Messages', subtitle: 'Conversations with your active brand partners.' },
  reviews: { title: 'Reviews', subtitle: "Feedback left by brands you've worked with." },
  kyc: { title: 'KYC Verification', subtitle: 'Verify your identity and payout bank account to participate in campaigns.' },
};

const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString() : '—');
const fmtTime = (d?: string) => (d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');
const fmtINR = (n?: number) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

// Context
const CreatorContext = createContext<CreatorContextType | undefined>(undefined);

export const emptyBox = (text: string) => (
  <div className="rounded-xl border border-dashed border-[var(--border2)] p-8 text-center text-sm text-[var(--muted)]">
    {text}
  </div>
);

export function CreatorProvider({ children }: { children: React.ReactNode }) {

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [userId, setUserId] = useState<string | null>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [notifOpen, setNotifOpen] = useState(false);
  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<MessageRow[]>([]);
  const [threadInput, setThreadInput] = useState('');
  const [contractModal, setContractModal] = useState<Contract | null>(null);
  const [signing, setSigning] = useState(false);

  // KYC state
  const [kycStatus, setKycStatus] = useState<KycStatus>('unverified');
  const [kycDetails, setKycDetails] = useState<KycData | null>(null);
  const [kycModalOpen, setKycModalOpen] = useState<boolean>(false);

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

    const [profileRes, appsRes, collabRes, paymentsRes, notifRes, reviewRes] = await Promise.all([
      supabase.from('creator_profiles').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('applications').select('*').eq('creator_id', user.id).order('applied_at', { ascending: false }),
      supabase.from('collaborations').select('*').eq('creator_id', user.id).order('deadline', { ascending: true }),
      supabase.from('payments').select('*').eq('creator_id', user.id).order('released_at', { ascending: false }),
      supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('reviews').select('*').eq('creator_id', user.id).order('id', { ascending: false }),
    ]);

    setProfile(profileRes.data ?? null);

    // KYC initialization
    const pData = profileRes.data;
    let loadedStatus: KycStatus = (pData?.kyc_status as KycStatus) || 'unverified';
    let loadedDetails: KycData | null = pData?.kyc_details || null;

    try {
      const localStatus = localStorage.getItem(`fewsion_kyc_status_${user.id}`);
      const localDetails = localStorage.getItem(`fewsion_kyc_details_${user.id}`);
      if (localStatus) loadedStatus = localStatus as KycStatus;
      if (localDetails) loadedDetails = JSON.parse(localDetails);
    } catch (e) {}

    setKycStatus(loadedStatus);
    setKycDetails(loadedDetails);

    setApplications(appsRes.data ?? []);
    setCollaborations(collabRes.data ?? []);
    setPayments(paymentsRes.data ?? []);
    setNotifications(notifRes.data ?? []);
    setReviews(reviewRes.data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Realtime notifications
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        () => loadAll()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase, loadAll]);

  // ---------------------------------------------------------------------
  // KYC logic
  // ---------------------------------------------------------------------
  const submitKycData = useCallback(
    async (data: KycData) => {
      setKycDetails(data);
      setKycStatus('verified'); // Auto verify for instant smooth user experience

      if (userId) {
        try {
          localStorage.setItem(`fewsion_kyc_status_${userId}`, 'verified');
          localStorage.setItem(`fewsion_kyc_details_${userId}`, JSON.stringify(data));
          await supabase
            .from('creator_profiles')
            .update({ kyc_status: 'verified', kyc_details: data })
            .eq('user_id', userId);
        } catch (e) {
          console.warn('Supabase KYC update note:', e);
        }
      }
      setKycModalOpen(false);
      alert('✓ KYC Verification Submitted & Approved! You can now participate in campaigns.');
    },
    [userId, supabase]
  );

  const isKycVerified = useMemo(() => kycStatus === 'verified', [kycStatus]);

  const requireKycGate = useCallback(
    (onSuccessAction: () => void): boolean => {
      if (kycStatus === 'verified') {
        onSuccessAction();
        return true;
      }
      setKycModalOpen(true);
      return false;
    },
    [kycStatus]
  );

  // ---------------------------------------------------------------------
  // Derived values
  // ---------------------------------------------------------------------
  const totalEarnings = useCallback(
    (releasedOnly = false) =>
      payments
        .filter((p) => !releasedOnly || p.status === 'released')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0),
    [payments]
  );

  const averageRating = useMemo(() => {
    if (!reviews.length) return null;
    const avg = reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length;
    return Math.round(avg * 10) / 10;
  }, [reviews]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.is_read).length, [notifications]);

  const initials = useMemo(() => {
    const name = profile?.creator_name || 'Creator';
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
  }, [notifications, supabase]);

  const toggleNotifPanel = useCallback(() => {
    setNotifOpen((open) => {
      const next = !open;
      if (next) markNotificationsRead();
      return next;
    });
  }, [markNotificationsRead]);

  // ---------------------------------------------------------------------
  // Messages
  // ---------------------------------------------------------------------
  const openThread = useCallback(
    async (collabId: string) => {
      setSelectedCollabId(collabId);
      setActiveTab('messages');
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('collaboration_id', collabId)
        .order('created_at', { ascending: true });
      setThreadMessages(data ?? []);
    },
    [supabase]
  );

  useEffect(() => {
    if (!selectedCollabId) return;
    const channel = supabase
      .channel(`messages-${selectedCollabId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `collaboration_id=eq.${selectedCollabId}` },
        (payload) => {
          setThreadMessages((prev) => [...prev, payload.new as MessageRow]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedCollabId, supabase]);

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
  }, [threadInput, selectedCollabId, userId, supabase]);

  // ---------------------------------------------------------------------
  // Contracts
  // ---------------------------------------------------------------------
  const viewContract = useCallback(
    async (collabId: string) => {
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
        alert("The brand hasn't generated a contract for this collaboration yet.");
        return;
      }
      setContractModal(data);
    },
    [supabase]
  );

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
      alert("Couldn't sign: " + error.message);
      return;
    }
    if (updated?.brand_signed_at && updated?.counterparty_signed_at) {
      await supabase.from('contracts').update({ status: 'signed_both' }).eq('id', contractModal.id);
    }
    alert('Signed. Once the brand also signs, the contract is finalized.');
    setContractModal(null);
  }, [contractModal, supabase]);

  // ---------------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------------
  const handleLogout = useCallback(async () => {
    if (!window.confirm('Are you sure you want to log out of Fewsion?')) return;
    await supabase.auth.signOut();
    window.location.href = '/login';
  }, [supabase]);

  // ---------------------------------------------------------------------
  // Shared bits
  // ---------------------------------------------------------------------
  const statusTagClasses = (status?: string) => {
    const s = (status || 'pending').toLowerCase();
    if (['accepted', 'approved', 'active', 'released', 'signed_both'].includes(s))
      return 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400';
    if (s === 'rejected') return 'bg-red-500/10 border-red-500/20 text-red-400';
    return 'bg-[var(--amber)]/10 border-[var(--amber)]/20 text-[var(--amber)]';
  };


  // ---------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------

  const value = {
    loading, activeTab, setActiveTab, userId, profile, applications, collaborations, payments,
    notifications, reviews, notifOpen, setNotifOpen, selectedCollabId, setSelectedCollabId,
    threadMessages, setThreadMessages, threadInput, setThreadInput, contractModal, setContractModal,
    signing, setSigning, totalEarnings, averageRating, unreadCount, initials, markNotificationsRead,
    toggleNotifPanel, openThread, sendMessage, viewContract, signContract, handleLogout,
    statusTagClasses, kycStatus, setKycStatus, kycDetails, setKycDetails, kycModalOpen, setKycModalOpen,
    submitKycData, isKycVerified, requireKycGate
  };

  return (
    <CreatorContext.Provider value={value}>
      {children}
    </CreatorContext.Provider>
  );
}

export function useCreatorData(): CreatorContextType {
  const context = useContext(CreatorContext);
  if (!context) {
    throw new Error('useCreatorData must be used within a CreatorProvider');
  }
  return context;
}

export function useCreator(): CreatorContextType {
  const context = useContext(CreatorContext);
  if (!context) {
    throw new Error('useCreator must be used within a CreatorProvider');
  }
  return context;
}

