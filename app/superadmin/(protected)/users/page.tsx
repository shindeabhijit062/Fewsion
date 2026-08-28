'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/utils/supabase';
import { logAuditAction } from '@/lib/audit';
import ConfirmModal from '@/components/superadmin/ConfirmModal';
import CSVExporter from '@/components/superadmin/CSVExporter';
import { 
  Search, 
  Filter, 
  Loader2, 
  UserCheck, 
  UserX, 
  Shield, 
  MoreVertical, 
  Eye, 
  CircleCheck, 
  CircleX,
  ChevronLeft,
  ChevronRight,
  UserPlus
} from 'lucide-react';

interface UserRecord {
  id: string;
  email: string;
  role: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  city?: string;
  country?: string;
  is_verified?: boolean;
  created_at: string;
  updated_at?: string;
}

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selected User Modal / Action State
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    actionType: 'toggle_verify' | 'change_role';
    newRole?: string;
    newVerify?: boolean;
    isDestructive?: boolean;
  }>({
    open: false,
    title: '',
    message: '',
    actionType: 'toggle_verify',
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        showToast(`Failed to fetch users: ${error.message}`, 'error');
      } else {
        setUsers(data || []);
      }
    } catch (err: any) {
      showToast('Error connecting to database', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filtering
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'verified' && u.is_verified) ||
      (statusFilter === 'unverified' && !u.is_verified);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Execute Action
  const handleExecuteAction = async () => {
    if (!selectedUser) return;
    setActionLoading(true);

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (confirmModal.actionType === 'toggle_verify') {
        const nextStatus = !selectedUser.is_verified;
        const { error } = await supabase
          .from('users')
          .update({ is_verified: nextStatus })
          .eq('id', selectedUser.id);

        if (error) throw error;

        // Record Audit Log
        await logAuditAction(
          currentUser?.id || null,
          nextStatus ? 'USER_VERIFIED' : 'USER_UNVERIFIED',
          'users',
          selectedUser.id,
          { target_email: selectedUser.email, actor_email: currentUser?.email }
        );

        showToast(
          `User ${selectedUser.email} status updated to ${nextStatus ? 'Verified' : 'Unverified'}`,
          'success'
        );
      } else if (confirmModal.actionType === 'change_role' && confirmModal.newRole) {
        const { error } = await supabase
          .from('users')
          .update({ role: confirmModal.newRole })
          .eq('id', selectedUser.id);

        if (error) throw error;

        // Record Audit Log
        await logAuditAction(
          currentUser?.id || null,
          'USER_ROLE_CHANGED',
          'users',
          selectedUser.id,
          {
            old_role: selectedUser.role,
            new_role: confirmModal.newRole,
            target_email: selectedUser.email,
            actor_email: currentUser?.email,
          }
        );

        showToast(
          `Role for ${selectedUser.email} changed to ${confirmModal.newRole.toUpperCase()}`,
          'success'
        );
      }

      await fetchUsers();
      setConfirmModal((prev) => ({ ...prev, open: false }));
    } catch (err: any) {
      showToast(`Action failed: ${err.message || 'Unknown error'}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-[var(--text)] max-w-7xl mx-auto w-full">
      {/* Toast Alert */}
      {toast && (
        <div className={`toast show ${toast.type}`}>
          {toast.msg}
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display tracking-tight">User Management</h1>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
            Total {users.length} registered accounts across creators, brands, editors, and administrators.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <CSVExporter 
            data={filteredUsers.map(u => ({
              ID: u.id,
              FullName: u.full_name,
              Email: u.email,
              Role: u.role,
              Verified: u.is_verified ? 'Yes' : 'No',
              JoinedDate: u.created_at,
            }))} 
            filename="fewsion-users.csv" 
          />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search by user name or email..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-[var(--card2)] border border-[var(--border)] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[var(--amber)] text-[var(--text)] placeholder-[var(--muted)]"
          />
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)] font-medium">
            <Filter className="w-3.5 h-3.5 text-[var(--amber)]" />
            <span>Role:</span>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
            className="bg-[var(--card2)] border border-[var(--border)] text-xs rounded-xl px-3 py-2 text-[var(--text)] focus:outline-none focus:border-[var(--amber)]"
          >
            <option value="all">All Roles</option>
            <option value="creator">Creator</option>
            <option value="brand">Brand</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-[var(--card2)] border border-[var(--border)] text-xs rounded-xl px-3 py-2 text-[var(--text)] focus:outline-none focus:border-[var(--amber)]"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="text-[11px] uppercase bg-[var(--card2)] text-[var(--muted2)] border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-4 font-semibold">User Details</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Joined Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--muted)]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[var(--amber)]" />
                    Loading platform users...
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--muted)]">
                    No users found matching query filters.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--card2)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--amber)]/10 border border-[var(--amber)]/20 flex items-center justify-center font-bold text-xs text-[var(--amber)]">
                          {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-[var(--text)]">{user.full_name || 'No Name'}</div>
                          <div className="text-[var(--muted)] text-xs">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                        user.role === 'super_admin'
                          ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                          : user.role === 'admin'
                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                          : user.role === 'brand'
                          ? 'bg-[var(--green-glow)] border-[var(--green)]/30 text-[var(--green)]'
                          : 'bg-[var(--amber)]/10 border-[var(--amber)]/30 text-[var(--amber)]'
                      }`}>
                        {user.role || 'creator'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.is_verified 
                          ? 'bg-[var(--green-glow)] border-[var(--green)]/20 text-[var(--green)]'
                          : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                      }`}>
                        {user.is_verified ? (
                          <>
                            <CircleCheck className="w-3 h-3" />
                            Verified
                          </>
                        ) : (
                          <>
                            <CircleX className="w-3 h-3" />
                            Unverified
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)]">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Quick View */}
                        <button
                          onClick={() => { setSelectedUser(user); setViewModalOpen(true); }}
                          className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Toggle Verify */}
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setConfirmModal({
                              open: true,
                              title: user.is_verified ? 'Unverify Account' : 'Verify Account',
                              message: `Are you sure you want to ${user.is_verified ? 'unverify' : 'verify'} ${user.email}?`,
                              actionType: 'toggle_verify',
                              isDestructive: user.is_verified,
                            });
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.is_verified 
                              ? 'text-red-400 hover:bg-red-500/10' 
                              : 'text-[var(--green)] hover:bg-[var(--green-glow)]'
                          }`}
                          title={user.is_verified ? 'Unverify User' : 'Verify User'}
                        >
                          {user.is_verified ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>

                        {/* Change Role Selector */}
                        <select
                          value={user.role || 'creator'}
                          onChange={(e) => {
                            const newRole = e.target.value;
                            if (newRole === user.role) return;
                            setSelectedUser(user);
                            setConfirmModal({
                              open: true,
                              title: 'Change User Role',
                              message: `Are you sure you want to change role of ${user.email} from ${user.role} to ${newRole.toUpperCase()}?`,
                              actionType: 'change_role',
                              newRole,
                              isDestructive: newRole === 'super_admin',
                            });
                          }}
                          className="bg-[var(--card2)] border border-[var(--border)] text-[11px] rounded-lg px-2 py-1 text-[var(--muted)] hover:text-[var(--text)] focus:outline-none"
                        >
                          <option value="creator">Creator</option>
                          <option value="brand">Brand</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between bg-[var(--card)]">
          <div className="text-xs text-[var(--muted)]">
            Showing Page <span className="font-bold text-[var(--text)]">{currentPage}</span> of <span className="font-bold text-[var(--text)]">{totalPages}</span> ({filteredUsers.length} total)
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

      {/* Action Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        isDestructive={confirmModal.isDestructive}
        loading={actionLoading}
        onConfirm={handleExecuteAction}
        onClose={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
      />

      {/* User Details Modal */}
      {viewModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setViewModalOpen(false)}
          />
          <div className="relative bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 max-w-lg w-full z-10 space-y-4">
            <div className="flex justify-between items-start border-b border-[var(--border)] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[var(--text)]">{selectedUser.full_name || 'User Details'}</h3>
                <p className="text-xs text-[var(--muted)]">{selectedUser.email}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--amber)]/10 text-[var(--amber)] border border-[var(--amber)]/20">
                {selectedUser.role}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[var(--card2)] rounded-xl border border-[var(--border)]">
                <div className="text-[var(--muted2)] mb-1">User ID</div>
                <div className="font-mono text-[var(--text)] truncate">{selectedUser.id}</div>
              </div>
              <div className="p-3 bg-[var(--card2)] rounded-xl border border-[var(--border)]">
                <div className="text-[var(--muted2)] mb-1">Verification</div>
                <div className="font-semibold text-[var(--text)]">
                  {selectedUser.is_verified ? 'Verified' : 'Unverified'}
                </div>
              </div>
              <div className="p-3 bg-[var(--card2)] rounded-xl border border-[var(--border)]">
                <div className="text-[var(--muted2)] mb-1">Joined Date</div>
                <div className="text-[var(--text)]">{new Date(selectedUser.created_at).toLocaleString()}</div>
              </div>
              <div className="p-3 bg-[var(--card2)] rounded-xl border border-[var(--border)]">
                <div className="text-[var(--muted2)] mb-1">Country</div>
                <div className="text-[var(--text)]">{selectedUser.country || 'India'}</div>
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
