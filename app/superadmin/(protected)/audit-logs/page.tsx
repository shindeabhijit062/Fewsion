'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/utils/supabase';
import CSVExporter from '@/components/superadmin/CSVExporter';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Loader2, 
  Clock, 
  UserCheck, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Code
} from 'lucide-react';

interface AuditRecord {
  id: string;
  actor_user_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
  actor?: {
    email?: string;
    full_name?: string;
    role?: string;
  };
}

export default function SuperAdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedLog, setSelectedLog] = useState<AuditRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchAuditLogs = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch audit logs with actor user details
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          actor:users(email, full_name, role)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        // Table might not be migrated yet or empty
        console.warn('Audit logs read warning:', error.message);
        setLogs([]);
      } else {
        setLogs(data || []);
      }
    } catch (err: any) {
      showToast('Error connecting to database', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  // Extract unique actions for filter dropdown
  const uniqueActions = Array.from(
    new Set(logs.map((l) => l.action).filter(Boolean))
  );

  // Filter logic
  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.target_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.actor?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(l.metadata).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === 'all' || l.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice(
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
          <h1 className="text-2xl font-extrabold font-display tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[var(--green)]" />
            Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
            Immutable system activity log recording all critical Super Admin and security events.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CSVExporter 
            data={filteredLogs.map(l => ({
              ID: l.id,
              Action: l.action,
              ActorEmail: l.actor?.email || l.actor_user_id || 'System',
              TargetType: l.target_type || 'N/A',
              TargetID: l.target_id || 'N/A',
              Metadata: JSON.stringify(l.metadata),
              Timestamp: l.created_at,
            }))} 
            filename="fewsion-audit-logs.csv" 
          />
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search action, actor, target type, or metadata..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-[var(--card2)] border border-[var(--border)] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[var(--amber)] text-[var(--text)] placeholder-[var(--muted)]"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)] font-medium">
            <Filter className="w-3.5 h-3.5 text-[var(--amber)]" />
            <span>Action Type:</span>
          </div>
          <select
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setCurrentPage(1); }}
            className="bg-[var(--card2)] border border-[var(--border)] text-xs rounded-xl px-3 py-2 text-[var(--text)] focus:outline-none focus:border-[var(--amber)]"
          >
            <option value="all">All Actions</option>
            {uniqueActions.map((act) => (
              <option key={act} value={act}>{act}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="text-[11px] uppercase bg-[var(--card2)] text-[var(--muted2)] border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-4 font-semibold">Action</th>
                <th className="px-6 py-4 font-semibold">Actor</th>
                <th className="px-6 py-4 font-semibold">Target Entity</th>
                <th className="px-6 py-4 font-semibold">Timestamp</th>
                <th className="px-6 py-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--muted)]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[var(--amber)]" />
                    Fetching audit trail...
                  </td>
                </tr>
              ) : paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--muted)]">
                    No audit records match your query filters.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--card2)] transition-colors">
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border bg-[var(--green-glow)] border-[var(--green)]/30 text-[var(--green)]">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[var(--text)]">{log.actor?.full_name || log.actor?.email || 'Super Admin'}</div>
                      <div className="text-[var(--muted)] text-[11px]">{log.actor?.email || log.actor_user_id || 'System'}</div>
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)]">
                      <div className="font-medium text-[var(--text)] uppercase text-[11px]">{log.target_type || 'System'}</div>
                      <div className="text-[11px] font-mono text-[var(--muted2)] truncate max-w-[140px]">{log.target_id || '—'}</div>
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)] text-xs">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => { setSelectedLog(log); setModalOpen(true); }}
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
            Showing Page <span className="font-bold text-[var(--text)]">{currentPage}</span> of <span className="font-bold text-[var(--text)]">{totalPages}</span> ({filteredLogs.length} total)
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

      {/* Metadata Detail Modal */}
      {modalOpen && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 max-w-lg w-full z-10 space-y-4">
            <div className="border-b border-[var(--border)] pb-4 flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-[var(--text)]">{selectedLog.action}</h3>
                <p className="text-xs text-[var(--muted)]">{new Date(selectedLog.created_at).toLocaleString()}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[var(--card2)] text-[var(--amber)] border border-[var(--border)]">
                {selectedLog.target_type || 'SYSTEM'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[var(--card2)] rounded-xl border border-[var(--border)]">
                <div className="text-[var(--muted2)] mb-1">Actor Email</div>
                <div className="font-semibold text-[var(--text)]">{selectedLog.actor?.email || selectedLog.actor_user_id || 'System Routine'}</div>
              </div>

              <div className="p-3 bg-[var(--card2)] rounded-xl border border-[var(--border)]">
                <div className="text-[var(--muted2)] mb-1 flex items-center gap-1">
                  <Code className="w-3.5 h-3.5 text-[var(--amber)]" />
                  <span>Log Metadata (JSON)</span>
                </div>
                <pre className="font-mono text-[11px] text-[var(--green)] overflow-x-auto p-2 bg-[var(--black)] rounded-lg border border-[var(--border)] mt-1">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[var(--border)]">
              <button
                onClick={() => setModalOpen(false)}
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
