'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/utils/supabase';
import { logAuditAction } from '@/lib/audit';
import ConfirmModal from '@/components/superadmin/ConfirmModal';
import CSVExporter from '@/components/superadmin/CSVExporter';
import { 
  Building2, 
  Search, 
  Filter, 
  Loader2, 
  ExternalLink, 
  CheckCircle, 
  Eye, 
  XCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface BrandRecord {
  id: string;
  user_id: string;
  company_name: string;
  website?: string;
  industry?: string;
  created_at: string;
  user?: {
    email: string;
    full_name: string;
    is_verified?: boolean;
  };
}

export default function SuperAdminBrandsPage() {
  const [brands, setBrands] = useState<BrandRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedBrand, setSelectedBrand] = useState<BrandRecord | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      // Query brand profiles with linked user account info
      const { data: brandData, error: brandErr } = await supabase
        .from('brand_profiles')
        .select(`
          *,
          user:users(email, full_name, is_verified)
        `)
        .order('created_at', { ascending: false });

      if (brandErr) {
        showToast(`Error loading brand profiles: ${brandErr.message}`, 'error');
      } else {
        setBrands(brandData || []);
      }
    } catch (err: any) {
      showToast('Error connecting to database', 'error');
    } fontally: {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // Extract unique industries for filter dropdown
  const industries = Array.from(
    new Set(brands.map((b) => b.industry).filter(Boolean))
  ) as string[];

  // Filter logic
  const filteredBrands = brands.filter((b) => {
    const matchesSearch =
      b.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIndustry = industryFilter === 'all' || b.industry === industryFilter;

    return matchesSearch && matchesIndustry;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage) || 1;
  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Toggle Verification Action
  const handleToggleVerifyBrand = async () => {
    if (!selectedBrand || !selectedBrand.user_id) return;
    setActionLoading(true);

    try {
      const nextStatus = !selectedBrand.user?.is_verified;
      const { error } = await supabase
        .from('users')
        .update({ is_verified: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', selectedBrand.user_id);

      if (error) throw error;

      const { data: { user: currentUser } } = await supabase.auth.getUser();

      await logAuditAction(
        currentUser?.id || null,
        nextStatus ? 'BRAND_VERIFIED' : 'BRAND_UNVERIFIED',
        'brand_profiles',
        selectedBrand.id,
        { company_name: selectedBrand.company_name, actor_email: currentUser?.email }
      );

      showToast(`Brand "${selectedBrand.company_name}" status updated.`, 'success');
      await fetchBrands();
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
          <h1 className="text-2xl font-extrabold font-display tracking-tight">Brand Profiles</h1>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
            Total {brands.length} brand organizations registered on the Fewsion marketplace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CSVExporter 
            data={filteredBrands.map(b => ({
              ID: b.id,
              CompanyName: b.company_name,
              Industry: b.industry || 'N/A',
              Website: b.website || 'N/A',
              ContactEmail: b.user?.email || 'N/A',
              Verified: b.user?.is_verified ? 'Yes' : 'No',
              JoinedDate: b.created_at,
            }))} 
            filename="fewsion-brands.csv" 
          />
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
            {industries.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Brand Table */}
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
                    No brand profiles match your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedBrands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-[var(--card2)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[var(--green-glow)] border border-[var(--green)]/30 flex items-center justify-center font-bold text-xs text-[var(--green)]">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-[var(--text)]">{brand.company_name || 'Unnamed Brand'}</div>
                          <div className="text-[var(--muted)] text-xs">{brand.user?.email || 'No contact email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-blue-500/10 border-blue-500/30 text-blue-400 capitalize">
                        {brand.industry || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)]">
                      {brand.website ? (
                        <a
                          href={brand.website.startsWith('http') ? brand.website : `https://${brand.website}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 hover:text-[var(--amber)] transition-colors underline decoration-[var(--border)] underline-offset-4"
                        >
                          <span className="truncate max-w-[140px]">{brand.website}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        brand.user?.is_verified
                          ? 'bg-[var(--green-glow)] border-[var(--green)]/20 text-[var(--green)]'
                          : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                      }`}>
                        {brand.user?.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedBrand(brand); setViewModalOpen(true); }}
                          className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)] transition-colors"
                          title="View Profile Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBrand(brand);
                            setConfirmModalOpen(true);
                          }}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-colors ${
                            brand.user?.is_verified
                              ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                              : 'border-[var(--green)]/30 text-[var(--green)] hover:bg-[var(--green-glow)]'
                          }`}
                        >
                          {brand.user?.is_verified ? 'Unverify' : 'Approve Brand'}
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

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title={selectedBrand?.user?.is_verified ? 'Unverify Brand' : 'Approve & Verify Brand'}
        message={`Are you sure you want to change verification status for brand "${selectedBrand?.company_name}"?`}
        confirmText={selectedBrand?.user?.is_verified ? 'Unverify' : 'Approve Brand'}
        isDestructive={selectedBrand?.user?.is_verified}
        loading={actionLoading}
        onConfirm={handleToggleVerifyBrand}
        onClose={() => setConfirmModalOpen(false)}
      />

      {/* Brand Detail Modal */}
      {viewModalOpen && selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setViewModalOpen(false)}
          />
          <div className="relative bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 max-w-md w-full z-10 space-y-4">
            <div className="border-b border-[var(--border)] pb-4">
              <h3 className="text-lg font-bold text-[var(--text)]">{selectedBrand.company_name}</h3>
              <p className="text-xs text-[var(--muted)]">{selectedBrand.user?.email}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[var(--card2)] rounded-xl border border-[var(--border)]">
                <div className="text-[var(--muted2)] mb-1">Industry</div>
                <div className="font-semibold text-[var(--text)]">{selectedBrand.industry || 'General Marketing'}</div>
              </div>
              <div className="p-3 bg-[var(--card2)] rounded-xl border border-[var(--border)]">
                <div className="text-[var(--muted2)] mb-1">Website URL</div>
                <div className="text-[var(--text)]">{selectedBrand.website || 'No website provided'}</div>
              </div>
              <div className="p-3 bg-[var(--card2)] rounded-xl border border-[var(--border)]">
                <div className="text-[var(--muted2)] mb-1">Registered Date</div>
                <div className="text-[var(--text)]">{new Date(selectedBrand.created_at).toLocaleString()}</div>
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
