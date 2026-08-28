'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/utils/supabase';
import { logAuditAction } from '@/lib/audit';
import { 
  Settings, 
  ShieldAlert, 
  Bell, 
  Sliders, 
  Save, 
  Loader2, 
  AlertTriangle,
  Lock,
  Percent
} from 'lucide-react';

interface SettingsState {
  maintenance_mode: boolean;
  maintenance_message: string;
  commission_percentage: number;
  registration_open: boolean;
  notify_new_signups: boolean;
  notify_high_value_campaigns: boolean;
  notify_security_alerts: boolean;
  require_email_verification: boolean;
  session_timeout_minutes: number;
}

export default function SuperAdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({
    maintenance_mode: false,
    maintenance_message: 'System undergoing routine maintenance.',
    commission_percentage: 10,
    registration_open: true,
    notify_new_signups: true,
    notify_high_value_campaigns: true,
    notify_security_alerts: true,
    require_email_verification: true,
    session_timeout_minutes: 120,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('platform_settings').select('*');

      if (data && !error && data.length > 0) {
        const loadedSettings: Partial<SettingsState> = {};
        data.forEach((row) => {
          if (row.key === 'maintenance_mode') {
            loadedSettings.maintenance_mode = row.value?.enabled ?? false;
            loadedSettings.maintenance_message = row.value?.message || '';
          } else if (row.key === 'commission_rate') {
            loadedSettings.commission_percentage = row.value?.percentage ?? 10;
          } else if (row.key === 'registration_open') {
            loadedSettings.registration_open = row.value?.brand ?? true;
          } else if (row.key === 'notifications') {
            loadedSettings.notify_new_signups = row.value?.signups ?? true;
            loadedSettings.notify_high_value_campaigns = row.value?.campaigns ?? true;
            loadedSettings.notify_security_alerts = row.value?.security ?? true;
          } else if (row.key === 'security_policy') {
            loadedSettings.require_email_verification = row.value?.require_email_verification ?? true;
            loadedSettings.session_timeout_minutes = row.value?.session_timeout_minutes ?? 120;
          }
        });

        setSettings((prev) => ({ ...prev, ...loadedSettings }));
      }
    } catch (err) {
      console.warn('Unable to load persisted settings from Supabase:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const updates = [
        {
          key: 'maintenance_mode',
          value: { enabled: settings.maintenance_mode, message: settings.maintenance_message },
          updated_by: user?.id || null,
          updated_at: new Date().toISOString(),
        },
        {
          key: 'commission_rate',
          value: { percentage: settings.commission_percentage },
          updated_by: user?.id || null,
          updated_at: new Date().toISOString(),
        },
        {
          key: 'registration_open',
          value: { brand: settings.registration_open, creator: settings.registration_open },
          updated_by: user?.id || null,
          updated_at: new Date().toISOString(),
        },
        {
          key: 'notifications',
          value: {
            signups: settings.notify_new_signups,
            campaigns: settings.notify_high_value_campaigns,
            security: settings.notify_security_alerts,
          },
          updated_by: user?.id || null,
          updated_at: new Date().toISOString(),
        },
        {
          key: 'security_policy',
          value: {
            require_email_verification: settings.require_email_verification,
            session_timeout_minutes: settings.session_timeout_minutes,
          },
          updated_by: user?.id || null,
          updated_at: new Date().toISOString(),
        },
      ];

      const { error } = await supabase
        .from('platform_settings')
        .upsert(updates, { onConflict: 'key' });

      if (error) throw error;

      // Audit Log
      await logAuditAction(
        user?.id || null,
        'PLATFORM_SETTINGS_UPDATED',
        'platform_settings',
        'global',
        { settings, actor_email: user?.email }
      );

      showToast('Platform & Security settings successfully persisted to Supabase.', 'success');
    } catch (err: any) {
      showToast(`Failed to save settings: ${err.message || 'Check database permissions'}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-[var(--text)] max-w-5xl mx-auto w-full">
      {toast && (
        <div className={`toast show ${toast.type}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-[var(--amber)]" />
            Platform & Security Settings
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
            Configure system parameters, escrow commission %, notifications, and security policies.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={saving || loading}
          className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? 'Persisting...' : 'Save All Settings'}</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-[var(--muted)] flex flex-col items-center gap-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--amber)]" />
          Loading persisted configuration...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section 1: Platform Controls */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
              <Sliders className="w-5 h-5 text-[var(--amber)]" />
              <h2 className="text-base font-bold text-[var(--text)]">Platform Controls</h2>
            </div>

            {/* Maintenance Mode */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--card2)] border border-[var(--border)]">
              <div>
                <div className="text-xs font-semibold text-[var(--text)]">Maintenance Mode</div>
                <div className="text-[11px] text-[var(--muted)]">Pause public website signups and campaign creation</div>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenance_mode}
                onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
                className="w-4 h-4 accent-[var(--amber)] cursor-pointer"
              />
            </div>

            {/* Marketplace Commission % */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-[var(--card2)] border border-[var(--border)]">
              <div className="flex justify-between items-center text-xs font-semibold text-[var(--text)]">
                <span className="flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-[var(--amber)]" />
                  Default Fewsion Commission Rate
                </span>
                <span className="text-[var(--amber)] font-bold">{settings.commission_percentage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={settings.commission_percentage}
                onChange={(e) => setSettings({ ...settings, commission_percentage: Number(e.target.value) })}
                className="w-full accent-[var(--amber)] cursor-pointer"
              />
              <div className="text-[11px] text-[var(--muted)]">Calculated on escrow agreements</div>
            </div>

            {/* Registration Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--card2)] border border-[var(--border)]">
              <div>
                <div className="text-xs font-semibold text-[var(--text)]">Public User Signups</div>
                <div className="text-[11px] text-[var(--muted)]">Allow new creators and brands to register</div>
              </div>
              <input
                type="checkbox"
                checked={settings.registration_open}
                onChange={(e) => setSettings({ ...settings, registration_open: e.target.checked })}
                className="w-4 h-4 accent-[var(--green)] cursor-pointer"
              />
            </div>
          </div>

          {/* Section 2: Security Policies */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
              <Lock className="w-5 h-5 text-[var(--green)]" />
              <h2 className="text-base font-bold text-[var(--text)]">Security Policies</h2>
            </div>

            {/* Require Email Verification */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--card2)] border border-[var(--border)]">
              <div>
                <div className="text-xs font-semibold text-[var(--text)]">Require Email Verification</div>
                <div className="text-[11px] text-[var(--muted)]">Users must verify email before creating campaigns</div>
              </div>
              <input
                type="checkbox"
                checked={settings.require_email_verification}
                onChange={(e) => setSettings({ ...settings, require_email_verification: e.target.checked })}
                className="w-4 h-4 accent-[var(--green)] cursor-pointer"
              />
            </div>

            {/* Session Timeout */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-[var(--card2)] border border-[var(--border)]">
              <label className="text-xs font-semibold text-[var(--text)] block">Admin Session Timeout (Minutes)</label>
              <select
                value={settings.session_timeout_minutes}
                onChange={(e) => setSettings({ ...settings, session_timeout_minutes: Number(e.target.value) })}
                className="w-full bg-[var(--card)] border border-[var(--border)] text-xs rounded-xl px-3 py-2 text-[var(--text)] focus:outline-none focus:border-[var(--amber)]"
              >
                <option value={30}>30 Minutes</option>
                <option value={60}>60 Minutes (1 Hour)</option>
                <option value={120}>120 Minutes (2 Hours)</option>
                <option value={480}>480 Minutes (8 Hours)</option>
              </select>
            </div>
          </div>

          {/* Section 3: Notification Alerts */}
          <div className="md:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
              <Bell className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-[var(--text)]">Super Admin Notifications</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-[var(--card2)] border border-[var(--border)] flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text)]">New Signups Alert</span>
                <input
                  type="checkbox"
                  checked={settings.notify_new_signups}
                  onChange={(e) => setSettings({ ...settings, notify_new_signups: e.target.checked })}
                  className="w-4 h-4 accent-[var(--amber)] cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--card2)] border border-[var(--border)] flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text)]">High Value Campaigns (&gt; ₹1L)</span>
                <input
                  type="checkbox"
                  checked={settings.notify_high_value_campaigns}
                  onChange={(e) => setSettings({ ...settings, notify_high_value_campaigns: e.target.checked })}
                  className="w-4 h-4 accent-[var(--amber)] cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--card2)] border border-[var(--border)] flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text)]">Security Audit Alerts</span>
                <input
                  type="checkbox"
                  checked={settings.notify_security_alerts}
                  onChange={(e) => setSettings({ ...settings, notify_security_alerts: e.target.checked })}
                  className="w-4 h-4 accent-[var(--amber)] cursor-pointer"
                />
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
