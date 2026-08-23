'use client';

import React, { useState } from 'react';
import { Save, Loader2, Key, Shield, Globe, Bell } from 'lucide-react';

export default function SuperAdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  
  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-8 text-[var(--text)] max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight">Platform Settings</h1>
        <p className="text-sm text-[var(--muted)] mt-1">Configure global platform behavior, integrations, and security rules.</p>
      </div>
      
      <div className="grid gap-6">
        {/* API & Integrations */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border)] flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">API & Integrations</h2>
              <p className="text-sm text-[var(--muted)]">Manage third-party API keys and webhooks.</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">Stripe Secret Key</label>
              <input type="password" value="sk_test_••••••••••••••••••••••••" readOnly className="w-full px-4 py-2 bg-[var(--card2)] border border-[var(--border)] rounded-lg text-sm text-[var(--muted)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">OpenAI API Key (Used by AI features)</label>
              <input type="password" value="sk-••••••••••••••••••••••••" readOnly className="w-full px-4 py-2 bg-[var(--card2)] border border-[var(--border)] rounded-lg text-sm text-[var(--muted)]" />
            </div>
          </div>
        </div>

        {/* Platform Configuration */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border)] flex items-center gap-3">
            <div className="p-2 bg-[var(--amber)]/10 text-[var(--amber)] rounded-lg">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Platform Rules</h2>
              <p className="text-sm text-[var(--muted)]">Global configuration and feature flags.</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">New User Registration</div>
                <div className="text-sm text-[var(--muted)]">Allow new creators and brands to sign up.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-[var(--card2)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--green)]"></div>
              </label>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <div>
                <div className="font-medium">Maintenance Mode</div>
                <div className="text-sm text-[var(--muted)]">Disable platform access for non-admins.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-[var(--card2)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--amber)]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-[var(--amber)] text-black rounded-lg text-sm font-bold hover:bg-[var(--amber)]/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
