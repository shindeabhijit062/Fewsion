'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/lib/adminApi';
import ConfirmModal from '@/components/superadmin/ConfirmModal';
import CSVExporter from '@/components/superadmin/CSVExporter';
import RecordEditor from '@/components/superadmin/RecordEditor';
import {
  Search,
  Filter,
  Loader2,
  Eye,
  Star,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Plus,
} from 'lucide-react';

// Matches the live creator_profiles table
interface CreatorRecord {
  id: string;
  user_id: string;
  creator_name?: string | null;
  primary_niche?: string | null;
  primary_platform?: string | null;
  follower_count?: number | null;
  engagement_rate?: number | null;
  avg_views_per_post?: number | null;
  rate_per_integration?: string | null;
  content_style_desc?: string | null;
  portfolio_url?: string | null;
  ai_total_score?: number | null;
  ai_grade?: string | null;
  created_at: string;
  user?: {
    email?: string;
    first_name?: string;
    last_name?: string;
    is_verified?: boolean;
  };
  [key: string]: any;
}

const displayName = (c: CreatorRecord) =>
  c.creator_name || [c.user?.first_name, c.user?.last_name].filter(Boolean).join(' ') || 'Unnamed Creator';

const initialsOf = (name: string) =>
  name.split(' ').filter(Boolean).map((w) => w[0]).join('').toUpperCase().slice(0, 2) || 'C';

export default function SuperAdminCreatorsPage() {
  const [creators, setCreators] = useState<CreatorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [nicheFilter, setNicheFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedCreator, setSelectedCreator] = useState<CreatorRecord | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<CreatorRecord | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchCreators = useCallback(async () => {
    setLoading(true);
    try {
      const [{ rows: creatorRows }, { rows: userRows }] = await Promise.all([
        adminApi.list('creator_profiles', { limit: 500 }),
        adminApi.list('users', { limit: 500 }),
      ]);
      const userMap = new Map(userRows.map((u) => [u.id, u]));
      setCreators(creatorRows.map((c) => ({ ...(c as CreatorRecord), user: userMap.get(c.user_id) })));
    } catch (err) {
      showToast(`Error loading creators: ${(err as Error).message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCreators();
  }, [fetchCreators]);

  const niches = Array.from(new Set(creators.map((c) => c.primary_niche).filter(Boolean))) as string[];

  const term = searchTerm.toLowerCase();
  const filteredCreators = creators.filter((c) => {
    const matchesSearch =
      !term ||
      displayName(c).toLowerCase().includes(term) ||
      c.primary_niche?.toLowerCase().includes(term) ||
      c.primary_platform?.toLowerCase().includes(term) ||
      c.user?.email?.toLowerCase().includes(term);
    const matchesNiche = nicheFilter === 'all' || c.primary_niche === nicheFilter;
    return matchesSearch && matchesNiche;
  });

  const totalPages = Math.ceil(filteredCreators.length / itemsPerPage) || 1;
  const paginatedCreators = filteredCreators.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleToggleVerify = async () => {
    if (!selectedCreator?.user_id) return;
    setActionLoading(true);
    try {
      await adminApi.update('users', selectedCreator.user_id, { is_verified: !selectedCreator.user?.is_verified });
      showToast('Creator verification updated.', 'success');
      setVerifyModalOpen(false);
      await fetchCreators();
    } catch (err) {
      showToast(`Action failed: ${(err as Error).message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCreator) return;
    setActionLoading(true);
    try {
      await adminApi.remove('creator_profiles', selectedCreator.id);
      showToast('Creator profile deleted.', 'success');
      setDeleteModalOpen(false);
      await fetchCreators();
    } catch (err) {
      showToast(`Delete failed: ${(err as Error).message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-[var(--text)] max-w-7xl mx-auto w-full">
      {toast && <div className={`toast show ${toast.type}`}>{toast.msg}</div>}

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
            data={filteredCreators.map((c) => ({
              ID: c.id,
              Name: displayName(c),
              Email: c.user?.email || 'N/A',
              Platform: c.primary_platform || 'N/A',
              PrimaryNiche: c.primary_niche || 'N/A',
              CreatorScore: c.ai_total_score ?? 'N/A',
              Grade: c.ai_grade || 'N/A',
              Followers: c.follower_count ?? 0,
              EngagementRate: c.engagement_rate != null ? `${c.engagement_rate}%` : 'N/A',
              Rate: c.rate_per_integration || 'N/A',
              Verified: c.user?.is_verified ? 'Yes' : 'No',
              JoinedDate: c.created_at,
            }))}
            filename="fewsion-creators.csv"
          />
          <button
            onClick={() => {
              setEditing(null);
              setEditorOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-[var(--amber)] px-3.5 py-2 text-xs font-bold text-black hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" /> Add creator
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search by name, email, platform or niche..."
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
                <th className="px-6 py-4 font-semibold">Creator Score</th>
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
                paginatedCreators.map((creator) => {
                  const name = displayName(creator);
                  const verified = !!creator.user?.is_verified;
                  return (
                    <tr key={creator.id} className="hover:bg-[var(--card2)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 shrink-0 rounded-xl bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.3)] flex items-center justify-center font-bold text-xs text-[var(--amber)]">
                            {initialsOf(name)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-[var(--text)] truncate">{name}</div>
                            <div className="text-[var(--muted)] text-xs truncate">
                              {[creator.primary_platform, creator.user?.email].filter(Boolean).join(' · ') || '—'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-[rgba(245,166,35,0.1)] border-[rgba(245,166,35,0.3)] text-[var(--amber)] whitespace-nowrap">
                          {creator.primary_niche || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {creator.ai_total_score != null ? (
                          <div className="flex items-center gap-1.5 font-bold text-xs text-[var(--green)] bg-[var(--green-glow)] px-2.5 py-1 rounded-lg w-fit">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{creator.ai_total_score} / 100</span>
                            {creator.ai_grade && <span className="font-semibold opacity-80">· {creator.ai_grade}</span>}
                          </div>
                        ) : (
                          <span className="text-xs text-[var(--muted2)]">Not scored</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[var(--muted)]">
                        <div className="font-semibold text-[var(--text)]">{(creator.follower_count || 0).toLocaleString('en-IN')} followers</div>
                        <div className="text-[11px] text-[var(--muted2)]">
                          {creator.engagement_rate != null ? `${creator.engagement_rate}% engagement` : 'Engagement not set'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${verified
                          ? 'bg-[var(--green-glow)] border-emerald-500/20 text-[var(--green)]'
                          : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                          }`}>
                          {verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => { setSelectedCreator(creator); setViewModalOpen(true); }}
                            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)] transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setEditing(creator); setEditorOpen(true); }}
                            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--amber)] hover:bg-[rgba(245,166,35,0.1)] transition-colors"
                            title="Edit profile"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setSelectedCreator(creator); setDeleteModalOpen(true); }}
                            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete profile"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setSelectedCreator(creator); setVerifyModalOpen(true); }}
                            className={`ml-1 px-3 py-1 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${verified
                              ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                              : 'border-emerald-500/30 text-[var(--green)] hover:bg-[var(--green-glow)]'
                              }`}
                          >
                            {verified ? 'Unverify' : 'Approve'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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

      {/* Verify / unverify */}
      <ConfirmModal
        isOpen={verifyModalOpen}
        title={selectedCreator?.user?.is_verified ? 'Unverify Creator' : 'Approve & Verify Creator'}
        message={`Change verification status for ${selectedCreator ? displayName(selectedCreator) : 'this creator'}?`}
        confirmText={selectedCreator?.user?.is_verified ? 'Unverify' : 'Approve Creator'}
        isDestructive={!!selectedCreator?.user?.is_verified}
        loading={actionLoading}
        onConfirm={handleToggleVerify}
        onClose={() => setVerifyModalOpen(false)}
      />

      {/* Delete */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete creator profile"
        message={`Permanently delete the creator profile of ${selectedCreator ? displayName(selectedCreator) : 'this creator'}? Their login account is kept; delete the user from the Users page to remove it too.`}
        confirmText="Delete"
        isDestructive
        loading={actionLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleteModalOpen(false)}
      />

      {/* Create / edit */}
      <RecordEditor
        isOpen={editorOpen}
        table="creator_profiles"
        record={editing}
        title={editing ? `Edit ${displayName(editing)}` : 'Add creator profile'}
        onClose={() => setEditorOpen(false)}
        onSaved={() => {
          setEditorOpen(false);
          showToast(editing ? 'Creator profile updated.' : 'Creator profile created.', 'success');
          fetchCreators();
        }}
      />

      {/* Details */}
      {viewModalOpen && selectedCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setViewModalOpen(false)} />
          <div className="relative bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 max-w-md w-full z-10 space-y-4">
            <div className="border-b border-[var(--border)] pb-4">
              <h3 className="text-lg font-bold text-[var(--text)]">{displayName(selectedCreator)}</h3>
              <p className="text-xs text-[var(--amber)] font-semibold">
                {[selectedCreator.primary_platform, selectedCreator.primary_niche].filter(Boolean).join(' · ')}
              </p>
              {selectedCreator.user?.email && <p className="text-xs text-[var(--muted)] mt-0.5">{selectedCreator.user.email}</p>}
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[var(--card2)] rounded-xl border border-[var(--border)]">
                <div className="text-[var(--muted2)] mb-1">Content style</div>
                <div className="text-[var(--text)] leading-relaxed">{selectedCreator.content_style_desc || 'Not specified.'}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Followers', value: (selectedCreator.follower_count || 0).toLocaleString('en-IN') },
                  { label: 'Engagement rate', value: selectedCreator.engagement_rate != null ? `${selectedCreator.engagement_rate}%` : '—' },
                  { label: 'Avg views / post', value: selectedCreator.avg_views_per_post?.toLocaleString('en-IN') ?? '—' },
                  { label: 'Rate per video', value: selectedCreator.rate_per_integration ? (/^\d/.test(String(selectedCreator.rate_per_integration)) ? `₹${selectedCreator.rate_per_integration}` : String(selectedCreator.rate_per_integration)) : '—' },
                  { label: 'Creator score', value: selectedCreator.ai_total_score != null ? `${selectedCreator.ai_total_score}/100` : '—' },
                  { label: 'Grade', value: selectedCreator.ai_grade || '—' },
                ].map((s) => (
                  <div key={s.label} className="p-3 bg-[var(--card2)] rounded-xl border border-[var(--border)]">
                    <div className="text-[var(--muted2)] mb-1">{s.label}</div>
                    <div className="font-bold text-[var(--text)]">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border)]">
              <button
                onClick={() => { setViewModalOpen(false); setEditing(selectedCreator); setEditorOpen(true); }}
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--text)] hover:border-[var(--amber)]"
              >
                Edit
              </button>
              <button onClick={() => setViewModalOpen(false)} className="btn-primary py-2 px-5 text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
