'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/utils/supabase';
import CSVExporter from '@/components/superadmin/CSVExporter';
import { 
  Handshake, 
  Search, 
  Filter, 
  Loader2, 
  Eye, 
  IndianRupee,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface CampaignRecord {
  id: string;
  brand_id: string;
  title: string;
  description: string;
  niche: string;
  budget_inr: number;
  status: string;
  created_at: string;
  brand?: {
    full_name?: string;
    email?: string;
  };
}

export default function SuperAdminCollaborationsPage() {
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedCampaign, setSelectedCampaign] = useState<CampaignRecord | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      // Query campaigns table with brand info
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          brand:users(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        showToast(`Error loading campaigns: ${error.message}`, 'error');
      } else {
        setCampaigns(data || []);
      }
    } catch (err: any) {
      showToast('Error connecting to database', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Filter
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.niche?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.brand?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage) || 1;
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          <h1 className="text-2xl font-extrabold font-display tracking-tight">Collaboration Management</h1>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
            Total {campaigns.length} brand campaigns and escrow collaborations recorded in Supabase.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CSVExporter 
            data={filteredCampaigns.map(c => ({
              ID: c.id,
              Title: c.title,
              Niche: c.niche,
              BudgetINR: c.budget_inr,
              Status: c.status,
              BrandEmail: c.brand?.email || 'N/A',
              CreatedDate: c.created_at,
            }))} 
            filename="fewsion-collaborations.csv" 
          />
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search campaign title, niche, or brand..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-[var(--card2)] border border-[var(--border)] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[var(--amber)] text-[var(--text)] placeholder-[var(--muted)]"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)] font-medium">
            <Filter className="w-3.5 h-3.5 text-[var(--amber)]" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-[var(--card2)] border border-[var(--border)] text-xs rounded-xl px-3 py-2 text-[var(--text)] focus:outline-none focus:border-[var(--amber)]"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="text-[11px] uppercase bg-[var(--card2)] text-[var(--muted2)] border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-4 font-semibold">Campaign Title</th>
                <th className="px-6 py-4 font-semibold">Niche</th>
                <th className="px-6 py-4 font-semibold">Budget (INR)</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Created Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--muted)]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[var(--amber)]" />
                    Loading campaigns & agreements...
                  </td>
                </tr>
              ) : paginatedCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--muted)]">
                    No active campaigns match your query filters.
                  </td>
                </tr>
              ) : (
                paginatedCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-[var(--card2)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[var(--text)]">{campaign.title || 'Untitled Campaign'}</div>
                      <div className="text-[var(--muted)] text-xs">{campaign.brand?.email || 'Brand account'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-[var(--amber)]/10 border-[var(--amber)]/30 text-[var(--amber)] capitalize">
                        {campaign.niche || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[var(--text)]">
                      ₹{Number(campaign.budget_inr || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                        campaign.status === 'completed'
                          ? 'bg-[var(--green-glow)] border-[var(--green)]/30 text-[var(--green)]'
                          : campaign.status === 'in_progress' || campaign.status === 'open'
                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                          : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                      }`}>
                        {campaign.status || 'draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)]">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => { setSelectedCampaign(campaign); setViewModalOpen(true); }}
                        className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card2)] transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Inspect</span>
                      </button>
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
            Showing Page <span className="font-bold text-[var(--text)]">{currentPage}</span> of <span className="font-bold text-[var(--text)]">{totalPages}</span> ({filteredCampaigns.length} total)
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

      {/* Campaign Detail Modal */}
      {viewModalOpen && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setViewModalOpen(false)}
          />
          <div className="relative bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 max-w-lg w-full z-10 space-y-4">
            <div className="border-b border-[var(--border)] pb-4">
              <h3 className="text-lg font-bold text-[var(--text)]">{selectedCampaign.title}</h3>
              <p className="text-xs text-[var(--muted)]">{selectedCampaign.brand?.email}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[var(--card2)] rounded-xl border border-[var(--border)]">
                <div className="text-[var(--muted2)] mb-1">Brief & Description</div>
                <div className="text-[var(--text)] leading-relaxed">{selectedCampaign.description || 'No description provided.'}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[var(--card2)] rounded-xl border border-[var(--border)]">
                  <div className="text-[var(--muted2)] mb-1">Campaign Budget</div>
                  <div className="font-bold text-[var(--text)] text-sm">₹{Number(selectedCampaign.budget_inr || 0).toLocaleString('en-IN')}</div>
                </div>
                <div className="p-3 bg-[var(--card2)] rounded-xl border border-[var(--border)]">
                  <div className="text-[var(--muted2)] mb-1">Niche / Category</div>
                  <div className="font-bold text-[var(--amber)]">{selectedCampaign.niche}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[var(--border)]">
              <button
                onClick={() => setViewModalOpen(false)}
                className="btn-primary py-2 px-5 text-xs"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
