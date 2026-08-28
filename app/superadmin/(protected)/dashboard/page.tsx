'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/utils/supabase';
import StatCard from '@/components/superadmin/StatCard';
import { 
  Users, 
  Clapperboard, 
  Building2, 
  Handshake, 
  CircleCheck, 
  AlertCircle, 
  Activity, 
  ArrowRight,
  ShieldAlert,
  Loader2,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface OverviewStats {
  totalUsers: number;
  totalCreators: number;
  totalBrands: number;
  activeCampaigns: number;
  pendingApprovals: number;
  totalAgreements: number;
}

interface ActivityLogItem {
  id: string;
  user_name: string;
  action: string;
  created_at: string;
  status: string;
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<OverviewStats>({
    totalUsers: 0,
    totalCreators: 0,
    totalBrands: 0,
    activeCampaigns: 0,
    pendingApprovals: 0,
    totalAgreements: 0,
  });
  const [activities, setActivities] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Execute all counts in parallel from Supabase
      const [
        usersRes,
        creatorsRes,
        brandsRes,
        campaignsRes,
        pendingRes,
        agreementsRes,
        auditRes,
      ] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('creator_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('brand_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('campaigns').select('id', { count: 'exact', head: true }).in('status', ['open', 'in_progress']),
        supabase.from('users').select('id', { count: 'exact', head: true }).eq('is_verified', false),
        supabase.from('agreements').select('id', { count: 'exact', head: true }),
        supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(6),
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalCreators: creatorsRes.count || 0,
        totalBrands: brandsRes.count || 0,
        activeCampaigns: campaignsRes.count || 0,
        pendingApprovals: pendingRes.count || 0,
        totalAgreements: agreementsRes.count || 0,
      });

      // Process activity log if present, else build recent activity from newest users
      if (auditRes.data && auditRes.data.length > 0) {
        setActivities(
          auditRes.data.map((item: any) => ({
            id: item.id,
            user_name: item.metadata?.actor_email || item.actor_user_id || 'Admin System',
            action: item.action,
            created_at: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'Success',
          }))
        );
      } else {
        // Fallback to recent user signups if audit_logs table is empty
        const { data: recentUsers } = await supabase
          .from('users')
          .select('full_name, email, role, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentUsers) {
          setActivities(
            recentUsers.map((u, i) => ({
              id: String(i),
              user_name: u.full_name || u.email,
              action: `Joined as ${u.role}`,
              created_at: new Date(u.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'Success',
            }))
          );
        }
      }
    } catch (err: any) {
      console.error('Failed to load dashboard statistics:', err);
      setError('Unable to calculate real-time platform statistics from database.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      
      {/* Welcome Banner */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--amber)] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--amber)] mb-1">
              Command Overview
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text)] tracking-tight">
              Welcome back, Super Admin 👋
            </h2>
            <p className="text-sm text-[var(--muted)] mt-1 max-w-xl">
              Real-time platform control center for overseeing users, brands, creators, collaborations, and system security.
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--card2)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--amber)] transition-all shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Metrics
          </button>
        </div>
      </div>

      {/* Error state alert if any query failed */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="underline hover:text-red-300 font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Cards Grid (6 real Supabase metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard 
          label="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="text-blue-400"
          bg="bg-blue-500/10"
          loading={loading}
          subtext="All registered accounts"
        />
        <StatCard 
          label="Active Creators"
          value={stats.totalCreators}
          icon={Clapperboard}
          color="text-[var(--amber)]"
          bg="bg-[var(--amber)]/10"
          loading={loading}
          subtext="Verified UGC Creators"
        />
        <StatCard 
          label="Total Brands"
          value={stats.totalBrands}
          icon={Building2}
          color="text-[var(--green)]"
          bg="bg-[var(--green-glow)]"
          loading={loading}
          subtext="Brand organizations"
        />
        <StatCard 
          label="Active Campaigns"
          value={stats.activeCampaigns}
          icon={Activity}
          color="text-purple-400"
          bg="bg-purple-500/10"
          loading={loading}
          subtext="Open/live campaigns"
        />
        <StatCard 
          label="Pending Approvals"
          value={stats.pendingApprovals}
          icon={AlertCircle}
          color="text-yellow-400"
          bg="bg-yellow-500/10"
          loading={loading}
          subtext="Unverified users"
        />
        <StatCard 
          label="Agreements"
          value={stats.totalAgreements}
          icon={Handshake}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
          loading={loading}
          subtext="Executed contracts"
        />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col - Activity Table */}
        <div className="lg:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--card)]">
            <h3 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--amber)]" />
              Recent Platform Activity
            </h3>
            <Link 
              href="/superadmin/audit-logs" 
              className="text-xs text-[var(--amber)] hover:underline flex items-center gap-1 font-semibold"
            >
              View Audit Logs
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-0 flex-1 overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-xs text-[var(--muted)] flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[var(--amber)]" />
                Fetching live audit feed...
              </div>
            ) : activities.length === 0 ? (
              <div className="p-12 text-center text-xs text-[var(--muted)]">
                No recent activity recorded yet.
              </div>
            ) : (
              <table className="w-full text-left text-xs sm:text-sm text-[var(--muted)]">
                <thead className="text-[11px] uppercase bg-[var(--card2)] text-[var(--muted2)] border-b border-[var(--border)]">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-[var(--text)]">Actor</th>
                    <th className="px-6 py-3 font-semibold text-[var(--text)]">Action</th>
                    <th className="px-6 py-3 font-semibold text-[var(--text)]">Time</th>
                    <th className="px-6 py-3 font-semibold text-[var(--text)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {activities.map((act) => (
                    <tr key={act.id} className="hover:bg-[var(--card2)] transition-colors">
                      <td className="px-6 py-3.5 font-medium text-[var(--text)] truncate max-w-[180px]">
                        {act.user_name}
                      </td>
                      <td className="px-6 py-3.5 capitalize">{act.action}</td>
                      <td className="px-6 py-3.5 text-xs text-[var(--muted2)]">{act.created_at}</td>
                      <td className="px-6 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--green-glow)] text-[var(--green)]">
                          {act.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Col - System Health & Quick Actions */}
        <div className="flex flex-col gap-6">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
            <h3 className="text-base font-bold text-[var(--text)] mb-4">System Operations</h3>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--card2)] border border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <CircleCheck className="w-4 h-4 text-[var(--green)]" />
                  <span className="text-xs font-medium text-[var(--text)]">Supabase Database</span>
                </div>
                <span className="text-[10px] font-bold bg-[var(--green-glow)] text-[var(--green)] px-2 py-0.5 rounded-full">
                  Operational
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--card2)] border border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <CircleCheck className="w-4 h-4 text-[var(--green)]" />
                  <span className="text-xs font-medium text-[var(--text)]">Supabase Auth SSR</span>
                </div>
                <span className="text-[10px] font-bold bg-[var(--green-glow)] text-[var(--green)] px-2 py-0.5 rounded-full">
                  Operational
                </span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--card2)] border border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <CircleCheck className="w-4 h-4 text-[var(--green)]" />
                  <span className="text-xs font-medium text-[var(--text)]">AI Engine API</span>
                </div>
                <span className="text-[10px] font-bold bg-[var(--green-glow)] text-[var(--green)] px-2 py-0.5 rounded-full">
                  Operational
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--amber)] opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-base font-bold text-[var(--text)] mb-1 relative z-10">User Verification</h3>
            <p className="text-xs text-[var(--muted)] mb-4 relative z-10">
              You have <span className="text-[var(--amber)] font-bold">{stats.pendingApprovals}</span> unverified accounts awaiting review.
            </p>
            <Link 
              href="/superadmin/users" 
              className="btn-primary w-full justify-center py-2.5 text-xs relative z-10"
            >
              Manage Users
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
