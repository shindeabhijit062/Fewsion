'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/utils/supabase';
import StatCard from '@/components/superadmin/StatCard';
import CSVExporter from '@/components/superadmin/CSVExporter';
import { 
  BarChart3, 
  Users, 
  Clapperboard, 
  Building2, 
  Handshake, 
  Calendar, 
  TrendingUp, 
  PieChart, 
  Loader2,
  Download
} from 'lucide-react';

interface ReportMetrics {
  totalUsers: number;
  newUsersPeriod: number;
  totalCreators: number;
  totalBrands: number;
  totalCampaigns: number;
  totalEscrowINR: number;
  roleBreakdown: { role: string; count: number }[];
  nicheBreakdown: { niche: string; count: number }[];
}

export default function SuperAdminReportsPage() {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [metrics, setMetrics] = useState<ReportMetrics>({
    totalUsers: 0,
    newUsersPeriod: 0,
    totalCreators: 0,
    totalBrands: 0,
    totalCampaigns: 0,
    totalEscrowINR: 0,
    roleBreakdown: [],
    nicheBreakdown: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      // Calculate date cutoff based on timeframe selector
      let cutoffDate: string | null = null;
      const now = new Date();
      if (timeframe === '7d') {
        now.setDate(now.getDate() - 7);
        cutoffDate = now.toISOString();
      } else if (timeframe === '30d') {
        now.setDate(now.getDate() - 30);
        cutoffDate = now.toISOString();
      } else if (timeframe === '90d') {
        now.setDate(now.getDate() - 90);
        cutoffDate = now.toISOString();
      }

      // Query data from Supabase
      let usersQuery = supabase.from('users').select('*');
      let campaignsQuery = supabase.from('campaigns').select('*');
      let creatorsQuery = supabase.from('creator_profiles').select('*');
      let brandsQuery = supabase.from('brand_profiles').select('*');

      if (cutoffDate) {
        usersQuery = usersQuery.gte('created_at', cutoffDate);
        campaignsQuery = campaignsQuery.gte('created_at', cutoffDate);
        creatorsQuery = creatorsQuery.gte('created_at', cutoffDate);
        brandsQuery = brandsQuery.gte('created_at', cutoffDate);
      }

      const [usersRes, campaignsRes, creatorsRes, brandsRes, allUsersCount] = await Promise.all([
        usersQuery,
        campaignsQuery,
        creatorsQuery,
        brandsQuery,
        supabase.from('users').select('id', { count: 'exact', head: true }),
      ]);

      const usersList = usersRes.data || [];
      const campaignsList = campaignsRes.data || [];
      const creatorsList = creatorsRes.data || [];
      const brandsList = brandsRes.data || [];

      // Calculate escrow / budget total
      const totalBudget = campaignsList.reduce((sum, c) => sum + Number(c.budget_inr || 0), 0);

      // Role breakdown
      const rolesMap: Record<string, number> = {};
      usersList.forEach((u) => {
        const r = u.role || 'creator';
        rolesMap[r] = (rolesMap[r] || 0) + 1;
      });

      // Niche breakdown
      const nicheMap: Record<string, number> = {};
      creatorsList.forEach((c) => {
        const n = c.primary_niche || 'General';
        nicheMap[n] = (nicheMap[n] || 0) + 1;
      });

      setMetrics({
        totalUsers: allUsersCount.count || usersList.length,
        newUsersPeriod: usersList.length,
        totalCreators: creatorsList.length,
        totalBrands: brandsList.length,
        totalCampaigns: campaignsList.length,
        totalEscrowINR: totalBudget,
        roleBreakdown: Object.entries(rolesMap).map(([role, count]) => ({ role, count })),
        nicheBreakdown: Object.entries(nicheMap).map(([niche, count]) => ({ niche, count })),
      });
    } catch (err) {
      console.error('Error computing report metrics:', err);
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div className="space-y-6 text-[var(--text)] max-w-7xl mx-auto w-full">
      {/* Header & Date Range Picker */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display tracking-tight">Reports & Analytics</h1>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
            Aggregated ecosystem growth and financial metrics directly from Supabase.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 bg-[var(--card)] border border-[var(--border)] p-1 rounded-xl">
            {(['7d', '30d', '90d', 'all'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  timeframe === t
                    ? 'bg-[var(--amber)] text-black font-bold'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <CSVExporter 
            data={[
              { Metric: 'Total Registered Users', Value: metrics.totalUsers },
              { Metric: `New Signups (${timeframe})`, Value: metrics.newUsersPeriod },
              { Metric: `Active Creators (${timeframe})`, Value: metrics.totalCreators },
              { Metric: `Active Brands (${timeframe})`, Value: metrics.totalBrands },
              { Metric: `Campaigns (${timeframe})`, Value: metrics.totalCampaigns },
              { Metric: `Total Budget INR (${timeframe})`, Value: metrics.totalEscrowINR },
            ]}
            filename={`fewsion-analytics-report-${timeframe}.csv`}
          />
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label={`New Signups (${timeframe.toUpperCase()})`}
          value={metrics.newUsersPeriod}
          icon={Users}
          color="text-blue-400"
          bg="bg-blue-500/10"
          loading={loading}
          subtext="New account registrations"
        />
        <StatCard 
          label={`New Creators (${timeframe.toUpperCase()})`}
          value={metrics.totalCreators}
          icon={Clapperboard}
          color="text-[var(--amber)]"
          bg="bg-[var(--amber)]/10"
          loading={loading}
          subtext="New creator onboarding"
        />
        <StatCard 
          label={`New Brands (${timeframe.toUpperCase()})`}
          value={metrics.totalBrands}
          icon={Building2}
          color="text-[var(--green)]"
          bg="bg-[var(--green-glow)]"
          loading={loading}
          subtext="New brand signups"
        />
        <StatCard 
          label={`Campaign Volume (${timeframe.toUpperCase()})`}
          value={`₹${(metrics.totalEscrowINR / 1000).toFixed(1)}k`}
          icon={Handshake}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
          loading={loading}
          subtext={`Total budget in ${timeframe}`}
        />
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* User Role Distribution */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[var(--amber)]" />
              Role Distribution ({timeframe.toUpperCase()})
            </h3>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-[var(--muted)] flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[var(--amber)]" />
              Computing distribution...
            </div>
          ) : metrics.roleBreakdown.length === 0 ? (
            <div className="p-12 text-center text-xs text-[var(--muted)]">
              No user data for selected period.
            </div>
          ) : (
            <div className="space-y-4">
              {metrics.roleBreakdown.map((item) => {
                const percentage = Math.round((item.count / (metrics.newUsersPeriod || 1)) * 100);
                return (
                  <div key={item.role} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="capitalize text-[var(--text)] font-semibold">{item.role}</span>
                      <span className="text-[var(--muted)]">{item.count} users ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--card2)] overflow-hidden border border-[var(--border)]">
                      <div 
                        className="h-full bg-[var(--amber)] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Creator Niche Breakdown */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--green)]" />
              Creator Niche Popularity
            </h3>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-[var(--muted)] flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[var(--amber)]" />
              Computing niche data...
            </div>
          ) : metrics.nicheBreakdown.length === 0 ? (
            <div className="p-12 text-center text-xs text-[var(--muted)]">
              No creator profiles for selected period.
            </div>
          ) : (
            <div className="space-y-4">
              {metrics.nicheBreakdown.map((item) => {
                const percentage = Math.round((item.count / (metrics.totalCreators || 1)) * 100);
                return (
                  <div key={item.niche} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="capitalize text-[var(--text)] font-semibold">{item.niche}</span>
                      <span className="text-[var(--muted)]">{item.count} creators ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--card2)] overflow-hidden border border-[var(--border)]">
                      <div 
                        className="h-full bg-[var(--green)] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
