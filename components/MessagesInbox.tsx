'use client';

/**
 * Shared messaging for the brand and creator portals.
 *
 * useInbox()      – loads every conversation (one per collaboration), the
 *                   other person's name/photo and the campaign title, keeps
 *                   messages live (Supabase realtime, with a short poll as a
 *                   safety net) and raises alerts for incoming messages.
 * <MessagesInbox> – two-pane inbox UI (conversation list + chat).
 * <MessageToasts> – pop-up alerts shown on any tab when a message arrives.
 *
 * Read state is kept per browser in localStorage (the messages table has no
 * read column).
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Bell, FileText, MessageSquare, Search, Send, X } from 'lucide-react';
import { supabase } from '@/utils/supabase';

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------
export interface InboxCollab {
  id: string;
  status?: string | null;
  campaign_id?: string | null;
  creator_id?: string | null;
  brand_id?: string | null;
  campaign_title?: string | null;
  brand_name?: string | null;
}

export interface InboxMessage {
  id: string;
  collaboration_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  pending?: boolean;
  failed?: boolean;
}

interface Person {
  name: string;
  avatarUrl: string | null;
}

export interface Conversation {
  collab: InboxCollab;
  otherId: string | null;
  name: string;
  avatarUrl: string | null;
  campaignTitle: string;
  lastMessage: InboxMessage | null;
  unread: number;
}

export interface MessageToast {
  id: string;
  collabId: string;
  name: string;
  avatarUrl: string | null;
  content: string;
}

type Role = 'brand' | 'creator';

const POLL_MS = 5000;
const NOTIFY_GAP_MS = 10 * 60 * 1000; // only re-notify after 10 min of quiet

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------
const GRADIENTS = [
  'linear-gradient(135deg, #F5A623, #FF6B35)',
  'linear-gradient(135deg, #a855f7, #ec4899)',
  'linear-gradient(135deg, #3b82f6, #06b6d4)',
  'linear-gradient(135deg, #22c55e, #14b8a6)',
  'linear-gradient(135deg, #ec4899, #8b5cf6)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
];

const gradientFor = (id: string) => {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
};

const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

const timeOf = (d: string) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const listTime = (d: string) => {
  const date = new Date(d);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) return timeOf(d);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const dayLabel = (d: string) => {
  const t = listTime(d);
  if (t === 'Yesterday') return t;
  if (new Date(d).toDateString() === new Date().toDateString()) return 'Today';
  return new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

const readKey = (userId: string) => `fewsion_msg_read_${userId}`;

const loadReadMap = (userId: string): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem(readKey(userId)) || '{}');
  } catch {
    return {};
  }
};

const sortByTime = (a: InboxMessage, b: InboxMessage) => a.created_at.localeCompare(b.created_at);

// ---------------------------------------------------------------------
// Hook: all inbox data + live updates
// ---------------------------------------------------------------------
export function useInbox({
  userId,
  role,
  myName,
  collaborations,
  activeCollabId,
}: {
  userId: string | null;
  role: Role;
  myName: string;
  collaborations: InboxCollab[];
  /** The conversation currently open on screen (null if the inbox isn't visible) */
  activeCollabId: string | null;
}) {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [people, setPeople] = useState<Record<string, Person>>({});
  const [campaignTitles, setCampaignTitles] = useState<Record<string, string>>({});
  const [readMap, setReadMap] = useState<Record<string, string>>({});
  const [toasts, setToasts] = useState<MessageToast[]>([]);
  const [loaded, setLoaded] = useState(false);

  const collabIds = useMemo(() => collaborations.map((c) => c.id).sort(), [collaborations]);
  const collabKey = collabIds.join(',');

  // Refs so realtime/poll callbacks always see current values
  const activeRef = useRef(activeCollabId);
  activeRef.current = activeCollabId;
  const peopleRef = useRef(people);
  peopleRef.current = people;
  const collabsRef = useRef(collaborations);
  collabsRef.current = collaborations;
  const seenIds = useRef<Set<string>>(new Set());

  const otherIdOf = useCallback(
    (c: InboxCollab) => (role === 'brand' ? c.creator_id : c.brand_id) ?? null,
    [role]
  );

  useEffect(() => {
    if (userId) setReadMap(loadReadMap(userId));
  }, [userId]);

  const markRead = useCallback(
    (collabId: string) => {
      if (!userId) return;
      setReadMap((prev) => {
        const next = { ...prev, [collabId]: new Date().toISOString() };
        try {
          localStorage.setItem(readKey(userId), JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [userId]
  );

  // Names, photos and campaign titles for every conversation
  useEffect(() => {
    if (!collabIds.length) return;
    let cancelled = false;
    (async () => {
      const otherIds = Array.from(new Set(collaborations.map(otherIdOf).filter(Boolean))) as string[];
      const campaignIds = Array.from(new Set(collaborations.map((c) => c.campaign_id).filter(Boolean))) as string[];

      const [usersRes, profilesRes, campaignsRes] = await Promise.all([
        otherIds.length
          ? supabase.from('users').select('id, first_name, last_name, avatar_url').in('id', otherIds)
          : Promise.resolve({ data: [] as any[] }),
        otherIds.length
          ? role === 'brand'
            ? supabase.from('creator_profiles').select('user_id, creator_name').in('user_id', otherIds)
            : supabase.from('brand_profiles').select('user_id, brand_name').in('user_id', otherIds)
          : Promise.resolve({ data: [] as any[] }),
        campaignIds.length
          ? supabase.from('campaign_briefs').select('id, campaign_title').in('id', campaignIds)
          : Promise.resolve({ data: [] as any[] }),
      ]);
      if (cancelled) return;

      const map: Record<string, Person> = {};
      for (const id of otherIds) {
        const u = (usersRes.data ?? []).find((r: any) => r.id === id);
        const p = (profilesRes.data ?? []).find((r: any) => r.user_id === id);
        const profileName = role === 'brand' ? p?.creator_name : p?.brand_name;
        const userName = [u?.first_name, u?.last_name].filter(Boolean).join(' ');
        map[id] = {
          name: profileName || userName || (role === 'brand' ? 'Creator' : 'Brand partner'),
          avatarUrl: u?.avatar_url || null,
        };
      }
      setPeople(map);

      const titles: Record<string, string> = {};
      (campaignsRes.data ?? []).forEach((c: any) => {
        if (c.campaign_title) titles[c.id] = c.campaign_title;
      });
      setCampaignTitles(titles);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collabKey, role]);

  // Handle messages that arrived from realtime or polling
  const ingest = useCallback(
    (incoming: InboxMessage[], alert: boolean) => {
      const fresh = incoming.filter((m) => !seenIds.current.has(m.id));
      if (!fresh.length) return;
      fresh.forEach((m) => seenIds.current.add(m.id));

      setMessages((prev) => {
        // Drop optimistic copies of messages we sent that have now come back
        const withoutTemps = prev.filter(
          (p) =>
            !p.pending ||
            !fresh.some((f) => f.sender_id === p.sender_id && f.collaboration_id === p.collaboration_id && f.content === p.content)
        );
        const ids = new Set(withoutTemps.map((m) => m.id));
        return [...withoutTemps, ...fresh.filter((f) => !ids.has(f.id))].sort(sortByTime);
      });

      if (!alert) return;
      for (const m of fresh) {
        if (m.sender_id === userId) continue;
        const viewing = activeRef.current === m.collaboration_id && !document.hidden;
        if (viewing) {
          markRead(m.collaboration_id);
          continue;
        }
        const collab = collabsRef.current.find((c) => c.id === m.collaboration_id);
        const otherId = collab ? (role === 'brand' ? collab.creator_id : collab.brand_id) : null;
        const person = otherId ? peopleRef.current[otherId] : undefined;
        const name = person?.name || (role === 'brand' ? 'A creator' : 'A brand');

        setToasts((prev) => [
          ...prev.slice(-2),
          { id: m.id, collabId: m.collaboration_id, name, avatarUrl: person?.avatarUrl ?? null, content: m.content },
        ]);

        // Desktop notification when the tab is in the background
        if (document.hidden && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          try {
            const n = new Notification(`New message from ${name}`, { body: m.content.slice(0, 140), tag: m.collaboration_id });
            n.onclick = () => window.focus();
          } catch {}
        }
      }
    },
    [userId, role, markRead]
  );

  // Initial load of all messages
  useEffect(() => {
    if (!userId) return;
    if (!collabIds.length) {
      setLoaded(true);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .in('collaboration_id', collabIds)
        .order('created_at', { ascending: true })
        .limit(2000);
      if (cancelled) return;
      if (error) console.error('Inbox: messages', error.message);
      ingest((data ?? []) as InboxMessage[], false);
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, collabKey]);

  // Live updates: realtime first, with a light poll in case realtime is off
  useEffect(() => {
    if (!userId || !collabIds.length) return;

    const channel = supabase
      .channel(`inbox-${userId}-${collabIds.length}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `collaboration_id=in.(${collabIds.join(',')})` },
        (payload) => ingest([payload.new as InboxMessage], true)
      )
      .subscribe();

    const poll = setInterval(async () => {
      const since = new Date(Date.now() - 60_000).toISOString();
      const { data } = await supabase
        .from('messages')
        .select('*')
        .in('collaboration_id', collabIds)
        .gt('created_at', since)
        .order('created_at', { ascending: true });
      if (data?.length) ingest(data as InboxMessage[], true);
    }, POLL_MS);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(poll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, collabKey, ingest]);

  // Opening a conversation marks it read
  useEffect(() => {
    if (activeCollabId) markRead(activeCollabId);
  }, [activeCollabId, messages.length, markRead]);

  // Toasts disappear on their own
  useEffect(() => {
    if (!toasts.length) return;
    const t = setTimeout(() => setToasts((prev) => prev.slice(1)), 6000);
    return () => clearTimeout(t);
  }, [toasts]);

  const dismissToast = useCallback((id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  const conversations: Conversation[] = useMemo(() => {
    return collaborations
      .map((c) => {
        const thread = messages.filter((m) => m.collaboration_id === c.id);
        const otherId = otherIdOf(c);
        const person = otherId ? people[otherId] : undefined;
        const lastRead = readMap[c.id] || '';
        return {
          collab: c,
          otherId,
          name: person?.name || (role === 'creator' && c.brand_name) || (role === 'brand' ? 'Creator' : 'Brand partner'),
          avatarUrl: person?.avatarUrl ?? null,
          campaignTitle: (c.campaign_id && campaignTitles[c.campaign_id]) || c.campaign_title || 'Campaign',
          lastMessage: thread[thread.length - 1] ?? null,
          unread: thread.filter((m) => m.sender_id !== userId && m.created_at > lastRead).length,
        };
      })
      .sort((a, b) => (b.lastMessage?.created_at || '').localeCompare(a.lastMessage?.created_at || ''));
  }, [collaborations, messages, people, campaignTitles, readMap, userId, role, otherIdOf]);

  const totalUnread = useMemo(() => conversations.reduce((s, c) => s + c.unread, 0), [conversations]);

  const send = useCallback(
    async (collabId: string, text: string) => {
      const content = text.trim();
      if (!content || !userId) return;

      const thread = messages.filter((m) => m.collaboration_id === collabId);
      const last = thread[thread.length - 1];
      const tempId = `temp-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: tempId, collaboration_id: collabId, sender_id: userId, content, created_at: new Date().toISOString(), pending: true },
      ]);

      const { data, error } = await supabase
        .from('messages')
        .insert({ collaboration_id: collabId, sender_id: userId, content })
        .select()
        .single();

      if (error || !data) {
        console.error('Send failed:', error);
        setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, pending: false, failed: true } : m)));
        return;
      }

      seenIds.current.add(data.id);
      setMessages((prev) => {
        const without = prev.filter((m) => m.id !== tempId && m.id !== data.id);
        return [...without, data as InboxMessage].sort(sortByTime);
      });
      markRead(collabId);

      // Notify the other person (once per burst, not for every message)
      const collab = collaborations.find((c) => c.id === collabId);
      const otherId = collab ? otherIdOf(collab) : null;
      const startsBurst =
        !last || last.sender_id !== userId || Date.now() - new Date(last.created_at).getTime() > NOTIFY_GAP_MS;
      if (otherId && startsBurst) {
        const { error: nErr } = await supabase.from('notifications').insert({
          user_id: otherId,
          title: `New message from ${myName}`,
          message: content.length > 120 ? `${content.slice(0, 117)}…` : content,
          is_read: false,
        });
        if (nErr) console.error('Message notification failed:', nErr.message);
      }
    },
    [userId, messages, collaborations, otherIdOf, myName, markRead]
  );

  const retry = useCallback(
    (msg: InboxMessage) => {
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      send(msg.collaboration_id, msg.content);
    },
    [send]
  );

  return { conversations, messages, totalUnread, toasts, dismissToast, send, retry, loaded };
}

export type InboxState = ReturnType<typeof useInbox>;

// ---------------------------------------------------------------------
// UI pieces
// ---------------------------------------------------------------------
function Avatar({ id, name, url, size = 40 }: { id: string; name: string; url: string | null; size?: number }) {
  const [failed, setFailed] = useState(false);
  if (url && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name}
        onError={() => setFailed(true)}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-black text-black"
      style={{ width: size, height: size, background: gradientFor(id), fontSize: size * 0.34 }}
    >
      {initialsOf(name)}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  requested: 'bg-[rgba(245,166,35,0.12)] text-[var(--amber)]',
  active: 'bg-emerald-500/10 text-emerald-400',
  approved: 'bg-emerald-500/10 text-emerald-400',
  completed: 'bg-sky-500/10 text-sky-400',
  rejected: 'bg-red-500/10 text-red-400',
};

function StatusPill({ status }: { status?: string | null }) {
  const s = (status || 'active').toLowerCase();
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${STATUS_STYLES[s] || 'bg-white/5 text-[var(--muted)]'}`}>
      {s}
    </span>
  );
}

export function MessagesInbox({
  inbox,
  userId,
  selectedId,
  onSelect,
  onContract,
  emptyText,
}: {
  inbox: InboxState;
  userId: string | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onContract?: (collabId: string) => void;
  emptyText: string;
}) {
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [notifPermission, setNotifPermission] = useState<string>('granted');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof Notification !== 'undefined') setNotifPermission(Notification.permission);
  }, []);

  const selected = inbox.conversations.find((c) => c.collab.id === selectedId) || null;
  const thread = useMemo(
    () => (selectedId ? inbox.messages.filter((m) => m.collaboration_id === selectedId) : []),
    [inbox.messages, selectedId]
  );

  const filtered = inbox.conversations.filter((c) => {
    const q = query.trim().toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.campaignTitle.toLowerCase().includes(q);
  });

  // Keep the newest message in view
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [thread.length, selectedId]);

  useEffect(() => {
    setDraft('');
    if (selectedId) inputRef.current?.focus();
  }, [selectedId]);

  const submit = () => {
    if (!selectedId || !draft.trim()) return;
    inbox.send(selectedId, draft);
    setDraft('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
  };

  const enableDesktopAlerts = async () => {
    if (typeof Notification === 'undefined') return;
    setNotifPermission(await Notification.requestPermission());
  };

  if (!inbox.conversations.length) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(245,166,35,0.1)] text-[var(--amber)]">
          <MessageSquare size={26} />
        </div>
        <p className="max-w-sm text-sm text-[var(--muted)]">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="grid h-[calc(100vh-220px)] min-h-[520px] grid-cols-1 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] md:grid-cols-[320px_minmax(0,1fr)]">
      {/* ── Conversation list ── */}
      <aside className={`flex min-h-0 flex-col border-r border-[var(--border)] ${selectedId ? 'hidden md:flex' : 'flex'}`}>
        <div className="border-b border-[var(--border)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-[var(--text)]">Inbox</h2>
            {inbox.totalUnread > 0 && (
              <span className="rounded-full bg-[var(--amber)] px-2 py-0.5 text-[10px] font-extrabold text-black">
                {inbox.totalUnread} unread
              </span>
            )}
          </div>
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people or campaigns"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--black)] py-2 pl-9 pr-3 text-xs text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-[rgba(245,166,35,0.5)]"
            />
          </div>
          {notifPermission === 'default' && (
            <button
              onClick={enableDesktopAlerts}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[rgba(245,166,35,0.35)] py-1.5 text-[11px] font-semibold text-[var(--amber)] hover:bg-[rgba(245,166,35,0.06)]"
            >
              <Bell size={12} /> Turn on desktop alerts for new messages
            </button>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {filtered.length === 0 && <p className="p-4 text-center text-xs text-[var(--muted)]">No conversations match.</p>}
          {filtered.map((c) => {
            const active = c.collab.id === selectedId;
            const last = c.lastMessage;
            const preview = last ? `${last.sender_id === userId ? 'You: ' : ''}${last.content}` : 'No messages yet. Say hello 👋';
            return (
              <button
                key={c.collab.id}
                onClick={() => onSelect(c.collab.id)}
                className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${active ? 'bg-[rgba(245,166,35,0.1)]' : 'hover:bg-white/[0.03]'
                  }`}
              >
                <div className="relative">
                  <Avatar id={c.otherId || c.collab.id} name={c.name} url={c.avatarUrl} size={42} />
                  {c.unread > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[var(--card)] bg-[var(--amber)]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`truncate text-sm ${c.unread ? 'font-bold text-[var(--text)]' : 'font-semibold text-[var(--text)]'}`}>
                      {c.name}
                    </span>
                    {last && <span className="shrink-0 text-[10px] text-[var(--muted)]">{listTime(last.created_at)}</span>}
                  </div>
                  <div className="truncate text-[11px] text-[rgba(245,166,35,0.8)]">
                    {c.campaignTitle}
                  </div>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <span className={`truncate text-xs ${c.unread ? 'font-medium text-[var(--text)]' : 'text-[var(--muted)]'}`}>
                      {preview}
                    </span>
                    {c.unread > 0 && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[var(--amber)] px-1.5 text-[10px] font-extrabold text-black">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── Chat ── */}
      <section className={`min-h-0 flex-col ${selectedId ? 'flex' : 'hidden md:flex'}`}>
        {!selected ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(245,166,35,0.1)] text-[var(--amber)]">
              <MessageSquare size={28} />
            </div>
            <div className="text-sm font-semibold text-[var(--text)]">Pick a conversation</div>
            <p className="max-w-xs text-xs text-[var(--muted)]">Messages update live, with no need to refresh.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <header className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
              <button
                onClick={() => onSelect(null)}
                className="rounded-full p-1.5 text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)] md:hidden"
                aria-label="Back to conversations"
              >
                <ArrowLeft size={16} />
              </button>
              <Avatar id={selected.otherId || selected.collab.id} name={selected.name} url={selected.avatarUrl} size={38} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-bold text-[var(--text)]">{selected.name}</span>
                  <StatusPill status={selected.collab.status} />
                </div>
                <div className="truncate text-[11px] text-[var(--muted)]">{selected.campaignTitle}</div>
              </div>
              {onContract && (
                <button
                  onClick={() => onContract(selected.collab.id)}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--border2)] px-3 py-1.5 text-[11px] font-semibold text-[var(--text)] hover:border-[var(--amber)]"
                >
                  <FileText size={12} /> Contract
                </button>
              )}
            </header>

            {/* Messages */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5" style={{ background: 'radial-gradient(ellipse at top, rgba(245,166,35,0.04), transparent 60%)' }}>
              {thread.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                  <Avatar id={selected.otherId || selected.collab.id} name={selected.name} url={selected.avatarUrl} size={56} />
                  <div className="mt-1 text-sm font-semibold text-[var(--text)]">Start the conversation with {selected.name}</div>
                  <p className="text-xs text-[var(--muted)]">About {selected.campaignTitle}</p>
                </div>
              )}
              <AnimatePresence initial={false}>
                {thread.map((m, i) => {
                  const mine = m.sender_id === userId;
                  const prev = thread[i - 1];
                  const next = thread[i + 1];
                  const newDay = !prev || new Date(prev.created_at).toDateString() !== new Date(m.created_at).toDateString();
                  const groupedWithPrev = !newDay && prev?.sender_id === m.sender_id;
                  const lastInGroup = !next || next.sender_id !== m.sender_id ||
                    new Date(next.created_at).toDateString() !== new Date(m.created_at).toDateString();
                  return (
                    <React.Fragment key={m.id}>
                      {newDay && (
                        <div className="my-4 flex items-center gap-3">
                          <div className="h-px flex-1 bg-[var(--border)]" />
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">{dayLabel(m.created_at)}</span>
                          <div className="h-px flex-1 bg-[var(--border)]" />
                        </div>
                      )}
                      <motion.div
                        layout="position"
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.18 }}
                        className={`flex items-end gap-2 ${mine ? 'justify-end' : 'justify-start'} ${groupedWithPrev ? 'mt-0.5' : 'mt-3'}`}
                      >
                        {!mine && (
                          <div className="w-7 shrink-0">
                            {lastInGroup && <Avatar id={selected.otherId || selected.collab.id} name={selected.name} url={selected.avatarUrl} size={28} />}
                          </div>
                        )}
                        <div
                          className={`max-w-[75%] whitespace-pre-wrap break-words px-3.5 py-2 text-sm leading-relaxed ${mine
                            ? `bg-gradient-to-br from-[#F5A623] to-[#FF8A3D] text-black ${lastInGroup ? 'rounded-2xl rounded-br-md' : 'rounded-2xl'}`
                            : `border border-[var(--border)] bg-[var(--card2)] text-[var(--text)] ${lastInGroup ? 'rounded-2xl rounded-bl-md' : 'rounded-2xl'}`
                            } ${m.pending ? 'opacity-70' : ''}`}
                        >
                          {m.content}
                          <div className={`mt-0.5 text-right text-[10px] ${mine ? 'text-black/60' : 'text-[var(--muted)]'}`}>
                            {m.failed ? (
                              <button onClick={() => inbox.retry(m)} className="font-semibold text-red-700 underline">
                                Not sent · Retry
                              </button>
                            ) : m.pending ? (
                              'Sending…'
                            ) : (
                              timeOf(m.created_at)
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </React.Fragment>
                  );
                })}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Composer */}
            <div className="border-t border-[var(--border)] p-3">
              <div className="flex items-end gap-2 rounded-2xl border border-[var(--border2)] bg-[var(--black)] p-1.5 pl-4 focus-within:border-[rgba(245,166,35,0.5)]">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={draft}
                  maxLength={2000}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  placeholder={`Message ${selected.name}…`}
                  className="max-h-[120px] flex-1 resize-none bg-transparent py-2 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
                />
                <button
                  onClick={submit}
                  disabled={!draft.trim()}
                  aria-label="Send message"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--amber)] text-black transition-all hover:opacity-90 disabled:opacity-30"
                >
                  <Send size={15} />
                </button>
              </div>
              <p className="mt-1.5 px-1 text-[10px] text-[var(--muted)]">Enter to send · Shift + Enter for a new line</p>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

/** Pop-up alerts for new messages, shown on whatever tab the user is on */
export function MessageToasts({
  toasts,
  onOpen,
  onDismiss,
}: {
  toasts: MessageToast[];
  onOpen: (collabId: string) => void;
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[200] flex w-[340px] max-w-[calc(100vw-40px)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            className="pointer-events-auto flex cursor-pointer items-start gap-3 rounded-2xl border border-[rgba(245,166,35,0.3)] bg-[#141414] p-3.5 shadow-2xl shadow-black/50"
            onClick={() => {
              onOpen(t.collabId);
              onDismiss(t.id);
            }}
          >
            <Avatar id={t.collabId} name={t.name} url={t.avatarUrl} size={36} />
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--amber)]">New message</div>
              <div className="truncate text-sm font-bold text-white">{t.name}</div>
              <div className="line-clamp-2 text-xs text-[#aaa]">{t.content}</div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(t.id);
              }}
              className="rounded-full p-1 text-[#888] hover:bg-white/5 hover:text-white"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
