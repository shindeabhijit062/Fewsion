'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/utils/supabase';
import { logAuditAction } from '@/lib/audit';
import ConfirmModal from '@/components/superadmin/ConfirmModal';
import CSVExporter from '@/components/superadmin/CSVExporter';
import { 
  Clapperboard, 
  Search, 
  Filter, 
  Loader2, 
  Eye, 
  Star,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface CreatorRecord {
  id: string;
  user_id: string;
  instagram_handle?: string;
  bio?: string;
  primary_niche: string;
  follower_count: number;
  engagement_rate: number;
  ai_score: number;
  screenshot_url?: string;
  created_at: string;
  user?: {
    email: string;
    full_name: string;
    is_verified?: boolean;
  };
}

export default function SuperAdminCreatorsPage() {
  const [creators, setCreators] = useState<CreatorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [nicheFilter, setNicheFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedCreator, setSelectedCreator] = useState<CreatorRecord | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchCreators = useCallback(async () => {
    setLoading(true);
    try {
      const { data: creatorData, error: creatorErr } = await supabase
        .from('creator_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (creatorErr) {
        showToast(`Error fetching creators: ${creatorErr.message}`, 'error');
        return;
      }

      if (creatorData && creatorData.length > 0) {
        const userIds = creatorData.map((c) => c.user_id).filter(Boolean);
        const { data: userData, error: userErr } = await supabase
          .from('users')
          .select('id, email, full_name, is_verified')
          .in('id', userIds);

        if (userErr) {
          showToast(`Error fetching associated users: ${userErr.message}`, 'error');
          return;
        }

        const userMap = new Map(userData?.map((u) => [u.id, u]) || []);
        const enrichedCreators = creatorData.map((c) => ({
          ...c,
          user: userMap.get(c.user_id),
        }));
        setCreators(enrichedCreators);
      } else {
        setCreators([]);
      }
    } catch (err: any) {
      showToast('Error connecting to database', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCreators();
  }, [fetchCreators]);

  // Extract unique niches
  const niches = Array.from(
    new Set(creators.map((c) => c.primary_niche).filter(Boolean))
  ) as string[];

  // Filter
  const filteredCreators = creators.filter((c) => {
    const matchesSearch =
      c.instagram_handle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.primary_niche?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesNiche = nicheFilter === 'all' || c.primary_niche === nicheFilter;

    return matchesSearch && matchesNiche;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCreators.length / itemsPerPage) || 1;
  const paginatedCreators = filteredCreators.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Verification Toggle Action
  const handleToggleVerifyCreator = async () => {
    if (!selectedCreator || !selectedCreator.user_id) return;
    setActionLoading(true);

    try {
      const nextStatus = !selectedCreator.user?.is_verified;
      const { error } = await supabase
        .from('users')
        .update({ is_verified: nextStatus })
        .eq('id', selectedCreator.user_id);

      if (error) throw error;

      const { data: { user: currentUser } } = await supabase.auth.getUser();

      await logAuditAction(
        currentUser?.id || null,
        nextStatus ? 'CREATOR_VERIFIED' : 'CREATOR_UNVERIFIED',
        'creator_profiles',
        selectedCreator.id,
        { handle: selectedCreator.instagram_handle, actor_email: currentUser?.email }
      );

      showToast(`Creator verification updated successfully.`, 'success');
      await fetchCreators();
      setConfirmModalOpen(false);
    } catch (err: any) {
      showToast(`Action failed: ${err.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-[var(--text)] max-w-7xl mx-auto w-full">
      {toast && (
        <div className={`toast show ${toast.type}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display tracking-tight">Creator Profiles</h1>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
            Total {creators.length} verified and unverified UGC creators on the platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CSVExporter 
            data={filteredCreators.map(c => ({
              ID: c.id,
              FullName: c.user?.full_name || 'N/A',
              InstagramHandle: c.instagram_handle || 'N/A',
              PrimaryNiche: c.primary_niche,
              AIScore: c.ai_score,
              Followers: c.follower_count,
              EngagementRate: `${c.engagement_rate}%`,
              Verified: c.user?.is_verified ? 'Yes' : 'No',
              JoinedDate: c.created_at,
            }))} 
            filename="fewsion-creators.csv" 
          />
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search by creator handle, name, email, or niche..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-[var(--card2)] border border-[var(--border)] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[var(--amber)] text-[var(--text)] placeholder-[var(--muted)]"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)] font-medium">
            <Filter className="w-3.5 h-3.5 text-[var(--amber)]" />
            <span>Niche:</span>
          </div>
          <select
            value={nicheFilter}
            onChange={(e) => { setNicheFilter(e.target.value); setCurrentPage(1); }}
            className="bg-[var(--card2)] border border-[var(--border)] text-xs rounded-xl px-3 py-2 text-[var(--text)] focus:outline-none focus:border-[var(--amber)]"
          >
            <option value="all">All Niches</option>
            {niches.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Creators Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="text-[11px] uppercase bg-[var(--card2)] text-[var(--muted2)] border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-4 font-semibold">Creator</th>
                <th className="px-6 py-4 font-semibold">Niche</th>
                <th className="px-6 py-4 font-semibold">AI Match Score</th>
                <th className="px-6 py-4 font-semibold">Followers & Engagement</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--muted)]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[var(--amber)]" />
                    Loading creator profiles...
                  </td>
                </tr>
              ) : paginatedCreators.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--muted)]">
                    No creators found matching search criteria.
                  </td>
                </tr>
              ) : (
                paginatedCreators.map((creator) => (
                  <tr key={creator.id} className="hover:bg-[var(--card2)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[var(--amber)]/10 border border-[var(--amber)]/30 flex items-center justify-center font-bold text-xs text-[var(--amber)]">
                          <Clapperboard className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-[var(--text)]">{creator.user?.full_name || 'Unnamed Creator'}</div>
                          <div className="text-[var(--muted)] text-xs flex items-center gap-1">
                            <svg className="w-3 h-3 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                            <span>@{creator.instagram_handle || 'no_handle'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-[var(--amber)]/10 border-[var(--amber)]/30 text-[var(--amber)] capitalize">
                        {creator.primary_niche || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-[var(--green)] bg-[var(--green-glow)] px-2.5 py-1 rounded-lg w-fit">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{creator.ai_score || 85} / 100</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)]">
                      <div className="font-semibold text-[var(--text)]">{(creator.follower_count || 0).toLocaleString()} followers</div>
                      <div className="text-[11px] text-[var(--muted2)]">{creator.engagement_rate || 3.5}% engagement</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        creator.user?.is_verified
                          ? 'bg-[var(--green-glow)] border-[var(--green)]/20 text-[var(--green)]'
                          : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                      }`}>
                        {creator.user?.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedCreator(creator); setViewModalOpen(true); }}
                          className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)] transition-colors"
                          title="View Profile Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCreator(creator);
                            setConfirmModalOpen(true);
                          }}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-colors ${
                            creator.user?.is_verified
                              ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                              : 'border-[var(--green)]/30 text-[var(--green)] hover:bg-[var(--green-glow)]'
                          }`}
                        >
                          {creator.user?.is_verified ? 'Unverify' : 'Approve Creator'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between bg-[var(--card)]">
          <div className="text-xs text-[var(--muted)]">
            Showing Page <span className="font-bold text-[var(--text)]">{currentPage}</span> of <span className="font-bold text-[var(--text)]">{totalPages}</span> ({filteredCreators.length} total)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title={selectedCreator?.user?.is_verified ? 'Unverify Creator' : 'Approve & Verify Creator'}
        message={`Are you sure you want to change status for @${selectedCreator?.instagram_handle || 'creator'}?`}
        confirmText={selectedCreator?.user?.is_verified ? 'Unverify' : 'Approve Creator'}
        isDestructive={selectedCreator?.user?.is_verified}
        loading={actionLoading}
        onConfirm={handleToggleVerifyCreator}
        onClose={() => setConfirmModalOpen(false)}
      />

      {/* Creator Detail Modal */}
      {viewModalOpen && selectedCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setViewModalOpen(false)}
          />
          <div className="relative bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 max-w-md w-full z-10 space-y-4">
            <div className="border-b border-[var(--border)] pb-4">
              <h3 className="text-lg font-bold text-[var(--text)]">{selectedCreator.user?.full_name || 'Creator Details'}</h3>
              <p className="text-xs text-[var(--amber)] font-semibold">@{selectedCreator.instagram_handle || 'no_handle'}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[var(--card2)] rounded-xl border border-[var(--border)]">
                <div className="text-[var(--muted2)] mb-1">Bio</div>
                <div className="text-[var(--text)] leading-relaxed">{selectedCreator.bio || 'No bio specified.'}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[var(--card2)] rounded-xl border border-[var(--border)]">
                  <div className="text-[var(--muted2)] mb-1">Followers</div>
                  <div className="font-bold text-[var(--text)]">{(selectedCreator.follower_count || 0).toLocaleString()}</div>
                </div>
                <div className="p-3 bg-[var(--card2)] rounded-xl border border-[var(--border)]">
                  <div className="text-[var(--muted2)] mb-1">Engagement Rate</div>
                  <div className="font-bold text-[var(--text)]">{selectedCreator.engagement_rate || 0}%</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[var(--border)]">
              <button
                onClick={() => setViewModalOpen(false)}
                className="btn-primary py-2 px-5 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
