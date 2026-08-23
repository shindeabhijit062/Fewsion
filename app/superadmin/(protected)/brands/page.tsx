'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Search, Loader2 } from 'lucide-react';

export default function SuperAdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchBrands() {
      setLoading(true);
      const { data, error } = await supabase
        .from('brand_profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (data && !error) {
        setBrands(data);
      }
      setLoading(false);
    }
    fetchBrands();
  }, []);

  const filteredBrands = brands.filter(b => 
    (b.brand_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.industry?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 text-[var(--text)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight">Brand Profiles</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Total {brands.length} brand profiles on the platform.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input 
            type="text" 
            placeholder="Search brands..." 
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
                <th className="px-6 py-4 font-medium">Brand</th>
                <th className="px-6 py-4 font-medium">Industry</th>
                <th className="px-6 py-4 font-medium">Website</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[var(--muted)]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading brands...
                  </td>
                </tr>
              ) : filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[var(--muted)]">
                    No brands found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filteredBrands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-[var(--card2)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--text)]">{brand.brand_name || 'Unnamed Brand'}</div>
                      <div className="text-[var(--muted)] text-xs mt-0.5">{brand.contact_name || 'No contact'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-blue-500/10 border-blue-500/20 text-blue-400 capitalize">
                        {brand.industry || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)]">
                      {brand.website_url ? (
                        <a href={brand.website_url} target="_blank" rel="noreferrer" className="hover:text-[var(--amber)] underline decoration-[var(--border)] underline-offset-4 transition-colors">
                          {brand.website_url}
                        </a>
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
