'use client';

import React from 'react';
import { Users, Clapperboard, Building2, Megaphone, DollarSign, ArrowUpRight, Activity } from 'lucide-react';

const stats = [
  { label: 'Total Users', value: '14,209', change: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Active Creators', value: '4,512', change: '+8%', icon: Clapperboard, color: 'text-[var(--amber)]', bg: 'bg-[var(--amber)]/10' },
  { label: 'Brand Profiles', value: '2,841', change: '+15%', icon: Building2, color: 'text-[var(--green)]', bg: 'bg-[var(--green)]/10' },
  { label: 'Live Campaigns', value: '432', change: '+5%', icon: Megaphone, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { label: 'Total Revenue', value: '₹1.2M', change: '+22%', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
];

const recentActivity = [
  { id: 1, user: 'Piyush Rastogi', action: 'Created a new brand account', time: '2 mins ago', status: 'Success' },
  { id: 2, user: 'Aman Gupta', action: 'Published campaign "Diwali Tech"', time: '15 mins ago', status: 'Success' },
  { id: 3, user: 'Riya Sharma', action: 'Requested escrow payout', time: '1 hour ago', status: 'Pending' },
  { id: 4, user: 'Techify India', action: 'Upgraded to Enterprise plan', time: '3 hours ago', status: 'Success' },
  { id: 5, user: 'System', action: 'Daily database backup completed', time: '5 hours ago', status: 'Success' },
];

export default function SuperAdminDashboard() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-300">
      
      {/* Welcome Banner */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--green)] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-[var(--text)] mb-2">Welcome back, Admin! 👋</h2>
          <p className="text-[var(--muted)] max-w-xl">
            Here's what's happening on Fewsion today. Platform engagement is up by 12% this week.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--border2)] transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-[var(--green)] bg-[var(--green-glow)] px-2 py-1 rounded-full">
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </div>
              </div>
              <div className="text-[var(--muted)] text-sm font-medium mb-1">{stat.label}</div>
              <div className="text-2xl font-display font-extrabold text-[var(--text)]">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col - Activity */}
        <div className="lg:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl flex flex-col overflow-hidden">
          <div className="px-6 py-5 border-b border-[var(--border)] flex justify-between items-center bg-[var(--card)]">
            <h3 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[var(--amber)]" />
              Recent Activity
            </h3>
            <button className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors">
              View All
            </button>
          </div>
          <div className="p-0 flex-1">
            <table className="w-full text-left text-sm text-[var(--muted)]">
              <thead className="text-xs uppercase bg-[var(--card2)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-6 py-4 font-semibold text-[var(--text)]">User</th>
                  <th className="px-6 py-4 font-semibold text-[var(--text)]">Action</th>
                  <th className="px-6 py-4 font-semibold text-[var(--text)]">Time</th>
                  <th className="px-6 py-4 font-semibold text-[var(--text)]">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((act) => (
                  <tr key={act.id} className="border-b border-[var(--border)] hover:bg-[var(--card2)] transition-colors">
                    <td className="px-6 py-4 font-medium text-[var(--text)]">{act.user}</td>
                    <td className="px-6 py-4">{act.action}</td>
                    <td className="px-6 py-4 text-xs">{act.time}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        act.status === 'Success' 
                          ? 'bg-[var(--green-glow)] text-[var(--green)]' 
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {act.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col - Quick Actions or System Status */}
        <div className="flex flex-col gap-6">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-4">System Status</h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--muted)]">API Servers</span>
                <span className="text-xs font-semibold bg-[var(--green-glow)] text-[var(--green)] px-2 py-1 rounded-full">Operational</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--muted)]">Database (Supabase)</span>
                <span className="text-xs font-semibold bg-[var(--green-glow)] text-[var(--green)] px-2 py-1 rounded-full">Operational</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--muted)]">Payment Gateway</span>
                <span className="text-xs font-semibold bg-[var(--green-glow)] text-[var(--green)] px-2 py-1 rounded-full">Operational</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--amber)] opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
             <h3 className="text-lg font-semibold text-[var(--text)] mb-2 relative z-10">Pending Approvals</h3>
             <p className="text-sm text-[var(--muted)] mb-4 relative z-10">You have 12 creators waiting for profile verification.</p>
             <button className="btn-primary w-full justify-center relative z-10 py-2.5 text-sm">
               Review Profiles
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
