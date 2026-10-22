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
  Globe,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Plus,
} from 'lucide-react';

// Matches the live brand_profiles table
interface BrandRecord {
  id: string;
  user_id: string;
  brand_name?: string | null;
  industry?: string | null;
  website_url?: string | null;
  brand_description?: string | null;
  primary_market?: string | null;
  budget_range?: string | null;
  campaign_name?: string | null;
  created_at: string;
  user?: {
    email?: string;
    first_name?: string;
    last_name?: string;
    is_verified?: boolean;
  };
  [key: string]: any;
}

const displayName = (b: BrandRecord) =>
  b.brand_name || [b.user?.first_name, b.user?.last_name].filter(Boolean).join(' ') || 'Unnamed Brand';

const initialsOf = (name: string) =>
  name.split(' ').filter(Boolean).map((w) => w[0]).join('').toUpperCase().slice(0, 2) || 'B';

export default function SuperAdminBrandsPage() {
  const [brands, setBrands] = useState<BrandRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedBrand, setSelectedBrand] = useState<BrandRecord | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<BrandRecord | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const [{ rows: brandRows }, { rows: userRows }] = await Promise.all([
        adminApi.list('brand_profiles', { limit: 500 }),
        adminApi.list('users', { limit: 500 }),
      ]);
      const userMap = new Map(userRows.map((u) => [u.id, u]));
      setBrands(brandRows.map((b) => ({ ...(b as BrandRecord), user: userMap.get(b.user_id) })));
    } catch (err) {
      showToast(`Error loading brands: ${(err as Error).message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const industries = Array.from(new Set(brands.map((b) => b.industry).filter(Boolean))) as string[];

  const term = searchTerm.toLowerCase();
  const filteredBrands = brands.filter((b) => {
    const matchesSearch =
      !term ||
      displayName(b).toLowerCase().includes(term) ||
      b.industry?.toLowerCase().includes(term) ||
      b.user?.email?.toLowerCase().includes(term);
    const matchesIndustry = industryFilter === 'all' || b.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage) || 1;
  const paginatedBrands = filteredBrands.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleToggleVerify = async () => {
    if (!selectedBrand?.user_id) return;
    setActionLoading(true);
    try {
      await adminApi.update('users', selectedBrand.user_id, { is_verified: !selectedBrand.user?.is_verified });
      showToast(`Brand "${displayName(selectedBrand)}" status updated.`, 'success');
      setVerifyModalOpen(false);
      await fetchBrands();
    } catch (err) {
      showToast(`Action failed: ${(err as Error).message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBrand) return;
    setActionLoading(true);
    try {
      await adminApi.remove('brand_profiles', selectedBrand.id);
      showToast('Brand profile deleted.', 'success');
      setDeleteModalOpen(false);
      await fetchBrands();
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
          <h1 className="text-2xl font-extrabold font-display tracking-tight">Brand Profiles</h1>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
            Total {brands.length} brand organizations registered on the Fewsion marketplace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CSVExporter
            data={filteredBrands.map((b) => ({
              ID: b.id,
              BrandName: displayName(b),
              Industry: b.industry || 'N/A',
              Website: b.website_url || 'N/A',
              PrimaryMarket: b.primary_market || 'N/A',
              ContactEmail: b.user?.email || 'N/A',
              Verified: b.user?.is_verified ? 'Yes' : 'No',
              JoinedDate: b.created_at,
            }))}
            filename="fewsion-brands.csv"
          />
          <button
            onClick={() => {
              setEditing(null);
              setEditorOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-[var(--amber)] px-3.5 py-2 text-xs font-bold text-black hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" /> Add brand
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search by brand name, industry, or email..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-[var(--card2)] border border-[var(--border)] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[var(--amber)] text-[var(--text)] placeholder-[var(--muted)]"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)] font-medium">
            <Filter className="w-3.5 h-3.5 text-[var(--amber)]" />
            <span>Industry:</span>
          </div>
          <select
            value={industryFilter}
            onChange={(e) => { setIndustryFilter(e.target.value); setCurrentPage(1); }}
            className="bg-[var(--card2)] border border-[var(--border)] text-xs rounded-xl px-3 py-2 text-[var(--text)] focus:outline-none focus:border-[var(--amber)]"
          >
            <option value="all">All Industries</option>
            {industries.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Brands Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="text-[11px] uppercase bg-[var(--card2)] text-[var(--muted2)] border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-4 font-semibold">Brand Organization</th>
                <th className="px-6 py-4 font-semibold">Industry</th>
                <th className="px-6 py-4 font-semibold">Website</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--muted)]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[var(--amber)]" />
                    Loading brand profiles...
                  </td>
                </tr>
              ) : paginatedBrands.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--muted)]">
                    No brands found matching search criteria.
                  </td>
                </tr>
              ) : (
                paginatedBrands.map((brand) => {
                  const name = displayName(brand);
                  const verified = !!brand.user?.is_verified;
                  return (
                    <tr key={brand.id} className="hover:bg-[var(--card2)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 shrink-0 rounded-xl bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.3)] flex items-center justify-center font-bold text-xs text-[var(--amber)]">
                            {initialsOf(name)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-[var(--text)] truncate">{name}</div>
                            <div className="text-[var(--muted)] text-xs truncate">{brand.user?.email || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-[rgba(245,166,35,0.1)] border-[rgba(245,166,35,0.3)] text-[var(--amber)] whitespace-nowrap">
                          {brand.industry || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {brand.website_url ? (
                          <a
                            href={/^https?:\/\//.test(brand.website_url) ? brand.website_url : `https://${brand.website_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--amber)]"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span className="max-w-[180px] truncate">{brand.website_url.replace(/^https?:\/\//, '')}</span>
                          </a>
                        ) : (
                          <span className="text-xs text-[var(--muted2)]">—</span>
                        )}
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
                            onClick={() => { setSelectedBrand(brand); setViewModalOpen(true); }}
                            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)] transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setEditing(brand); setEditorOpen(true); }}
                            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--amber)] hover:bg-[rgba(245,166,35,0.1)] transition-colors"
                            title="Edit brand"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setSelectedBrand(brand); setDeleteModalOpen(true); }}
                            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete brand"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setSelectedBrand(brand); setVerifyModalOpen(true); }}
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
            Showing Page <span className="font-bold text-[var(--text)]">{currentPage}</span> of <span className="font-bold text-[var(--text)]">{totalPages}</span> ({filteredBrands.length} total)
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
        title={selectedBrand?.user?.is_verified ? 'Unverify Brand' : 'Approve & Verify Brand'}
        message={`Change verification status for brand "${selectedBrand ? displayName(selectedBrand) : ''}"?`}
        confirmText={selectedBrand?.user?.is_verified ? 'Unverify' : 'Approve Brand'}
        isDestructive={!!selectedBrand?.user?.is_verified}
        loading={actionLoading}
        onConfirm={handleToggleVerify}
        onClose={() => setVerifyModalOpen(false)}
      />

      {/* Delete */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete brand profile"
        message={`Permanently delete the brand profile "${selectedBrand ? displayName(selectedBrand) : ''}"? Their login account is kept; delete the user from the Users page to remove it too.`}
        confirmText="Delete"
        isDestructive
        loading={actionLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleteModalOpen(false)}
      />

      {/* Create / edit */}
      <RecordEditor
        isOpen={editorOpen}
        table="brand_profiles"
        record={editing}
        title={editing ? `Edit ${displayName(editing)}` : 'Add brand profile'}
        onClose={() => setEditorOpen(false)}
        onSaved={() => {
          setEditorOpen(false);
          showToast(editing ? 'Brand profile updated.' : 'Brand profile created.', 'success');
          fetchBrands();
        }}
      />

      {/* Details */}
      {viewModalOpen && selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setViewModalOpen(false)} />
          <div className="relative bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 max-w-md w-full z-10 space-y-4">
            <div className="border-b border-[var(--border)] pb-4">
              <h3 className="text-lg font-bold text-[var(--text)]">{displayName(selectedBrand)}</h3>
              <p className="text-xs text-[var(--muted)]">{selectedBrand.user?.email}</p>
            </div>

            <div className="space-y-3 text-xs">
              {selectedBrand.brand_description && (
                <div className="p-3 bg-[var(--card2)] rounded-xl border border-[var(--border)]">
                  <div className="text-[var(--muted2)] mb-1">About</div>
                  <div className="text-[var(--text)] leading-relaxed">{selectedBrand.brand_description}</div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Industry', value: selectedBrand.industry || '—' },
                  { label: 'Primary market', value: selectedBrand.primary_market || '—' },
                  { label: 'Budget range', value: selectedBrand.budget_range || '—' },
                  { label: 'Website', value: selectedBrand.website_url || '—' },
                  { label: 'Registered', value: new Date(selectedBrand.created_at).toLocaleDateString('en-IN') },
                ].map((s) => (
                  <div key={s.label} className="p-3 bg-[var(--card2)] rounded-xl border border-[var(--border)] min-w-0">
                    <div className="text-[var(--muted2)] mb-1">{s.label}</div>
                    <div className="font-semibold text-[var(--text)] truncate">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border)]">
              <button
                onClick={() => { setViewModalOpen(false); setEditing(selectedBrand); setEditorOpen(true); }}
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
