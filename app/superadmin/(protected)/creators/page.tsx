'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Search, Loader2 } from 'lucide-react';

export default function SuperAdminCreatorsPage() {
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchCreators() {
      setLoading(true);
      const { data, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (data && !error) {
        setCreators(data);
      }
      setLoading(false);
    }
    fetchCreators();
  }, []);

  const filteredCreators = creators.filter(c => 
    (c.creator_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.primary_platform?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 text-[var(--text)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight">Creator Profiles</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Total {creators.length} creator profiles.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input 
            type="text" 
            placeholder="Search creators..." 
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
                <th className="px-6 py-4 font-medium">Creator</th>
                <th className="px-6 py-4 font-medium">Platform</th>
                <th className="px-6 py-4 font-medium">Followers</th>
                <th className="px-6 py-4 font-medium">AI Score</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--muted)]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading creators...
                  </td>
                </tr>
              ) : filteredCreators.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--muted)]">
                    No creators found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filteredCreators.map((creator) => (
                  <tr key={creator.id} className="hover:bg-[var(--card2)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--text)]">{creator.creator_name || 'Unnamed Creator'}</div>
                      <div className="text-[var(--muted)] text-xs mt-0.5">{creator.niche || 'Various'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-purple-500/10 border-purple-500/20 text-purple-400 capitalize">
                        {creator.primary_platform || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)]">
                      {creator.follower_count ? creator.follower_count.toLocaleString() : '0'}
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)]">
                      {creator.ai_total_score ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[var(--amber)]">★</span>
                          <span>{creator.ai_total_score}/100</span>
                        </div>
                      ) : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-medium text-[var(--muted)] hover:text-[var(--amber)] transition-colors">
                        View Profile
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
