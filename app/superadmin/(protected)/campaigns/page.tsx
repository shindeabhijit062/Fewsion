'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Search, Loader2 } from 'lucide-react';

export default function SuperAdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchCampaigns() {
      setLoading(true);
      const { data, error } = await supabase
        .from('campaign_briefs')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (data && !error) {
        setCampaigns(data);
      }
      setLoading(false);
    }
    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter(c => 
    (c.campaign_title?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 text-[var(--text)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight">Campaigns</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Total {campaigns.length} campaigns created.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input 
            type="text" 
            placeholder="Search campaigns..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--amber)]"
          />
        </div>
      </div>
      
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-[var(--card2)] text-[var(--muted2)] border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-4 font-medium">Campaign Title</th>
                <th className="px-6 py-4 font-medium">Platform</th>
                <th className="px-6 py-4 font-medium">Budget</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--muted)]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading campaigns...
                  </td>
                </tr>
              ) : filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--muted)]">
                    No campaigns found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-[var(--card2)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--text)]">{campaign.campaign_title || 'Untitled Campaign'}</div>
                      <div className="text-[var(--muted)] text-xs mt-0.5">{new Date(campaign.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-[var(--card2)] border-[var(--border)] text-[var(--muted)] capitalize">
                        {campaign.platform || 'Multiple'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--text)] font-medium">
                      ₹{(campaign.budget || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
                        campaign.status === 'active' || campaign.status === 'open' 
                          ? 'bg-[var(--green-glow)] border-[var(--green)]/20 text-[var(--green)]'
                          : 'bg-[var(--amber)]/10 border-[var(--amber)]/20 text-[var(--amber)]'
                      }`}>
                        {campaign.status || 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-medium text-[var(--muted)] hover:text-[var(--amber)] transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
