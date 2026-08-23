'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Search, Loader2, Plus, Edit2, Trash2 } from 'lucide-react';

export default function SuperAdminAIKnowledgePage() {
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ topic: '', content: '', tags: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchKnowledge();
  }, []);

  async function fetchKnowledge() {
    setLoading(true);
    // Assuming table 'ai_knowledge' exists. If not, this will gracefully return error.
    const { data, error } = await supabase
      .from('ai_knowledge')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data && !error) {
      setKnowledge(data);
    } else if (error) {
      console.warn("Could not fetch ai_knowledge (table might not exist yet):", error.message);
    }
    setLoading(false);
  }

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ topic: item.topic || '', content: item.content || '', tags: item.tags || '' });
    } else {
      setEditingId(null);
      setFormData({ topic: '', content: '', tags: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      topic: formData.topic,
      content: formData.content,
      tags: formData.tags
    };

    if (editingId) {
      await supabase.from('ai_knowledge').update(payload).eq('id', editingId);
    } else {
      await supabase.from('ai_knowledge').insert([payload]);
    }
    
    setSaving(false);
    setIsModalOpen(false);
    fetchKnowledge();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this AI knowledge entry?')) {
      await supabase.from('ai_knowledge').delete().eq('id', id);
      fetchKnowledge();
    }
  };

  const filteredKnowledge = knowledge.filter(k => 
    (k.topic?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (k.content?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (k.tags?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 text-[var(--text)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight">AI Knowledge Base</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Manage the context data and rules that power the AI.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
            <input 
              type="text" 
              placeholder="Search knowledge..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--amber)]"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--amber)] text-black rounded-lg text-sm font-semibold hover:bg-[var(--amber)]/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>
      </div>
      
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-[var(--card2)] text-[var(--muted2)] border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-4 font-medium w-1/4">Topic</th>
                <th className="px-6 py-4 font-medium w-1/2">Content / Instructions</th>
                <th className="px-6 py-4 font-medium">Tags</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[var(--muted)]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading knowledge base...
                  </td>
                </tr>
              ) : filteredKnowledge.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[var(--muted)]">
                    {searchTerm ? `No entries found matching "${searchTerm}"` : 'No AI knowledge entries exist yet. Click "Add Entry" to create one.'}
                  </td>
                </tr>
              ) : (
                filteredKnowledge.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--card2)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--text)]">{item.topic || 'Untitled'}</div>
                      <div className="text-[var(--muted)] text-xs mt-0.5">{new Date(item.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[var(--muted)] line-clamp-2 max-w-lg">
                        {item.content || 'No content provided'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.tags ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-blue-500/10 border-blue-500/20 text-blue-400">
                          {item.tags}
                        </span>
                      ) : <span className="text-[var(--muted2)]">—</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleOpenModal(item)} className="text-[var(--muted)] hover:text-[var(--amber)] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="text-[var(--muted)] hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-bold font-display">{editingId ? 'Edit AI Knowledge' : 'Add AI Knowledge'}</h2>
              <p className="text-sm text-[var(--muted)] mt-1">This data will be used as context for the platform's AI features.</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Topic / Subject</label>
                <input 
                  type="text" 
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  className="w-full px-4 py-2 bg-[var(--card2)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--amber)] text-white"
                  placeholder="e.g., Pricing Tiers, Platform Rules..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Tags (Comma separated)</label>
                <input 
                  type="text" 
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full px-4 py-2 bg-[var(--card2)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--amber)] text-white"
                  placeholder="e.g., pricing, faq, system"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Content / AI Instructions</label>
                <textarea 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-3 bg-[var(--card2)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--amber)] text-white resize-none"
                  placeholder="Provide the exact text or rules the AI should know about this topic..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-[var(--border)] flex justify-end gap-3 bg-[var(--card2)]/50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-[var(--muted)] hover:text-white transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={saving || !formData.topic || !formData.content}
                className="px-6 py-2 bg-[var(--amber)] text-black rounded-lg text-sm font-bold hover:bg-[var(--amber)]/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Saving...' : 'Save Knowledge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
