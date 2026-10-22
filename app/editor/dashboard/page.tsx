import React from 'react';

export const metadata = {
  title: 'Editor Portal — Fewsion Marketplace',
  description: 'View video editing assignments, upload draft cuts, and track commission earnings.'
};

export default function EditorDashboardPage() {
  return (
    <main className="px-4 sm:px-[5%] pt-28 sm:pt-[120px] pb-16 sm:pb-20">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge-amber">EDITOR PORTAL</span>
            <h1 className="text-2xl sm:text-[32px]" style={{ fontFamily: 'var(--font-display)', color: '#fff', marginTop: '8px' }}>Video Editor Workspace</h1>
          </div>
          <button className="btn-primary" style={{ fontSize: '13px', padding: '10px 22px' }}>Browse Editing Jobs</button>
        </div>

        <div className="glass-card p-5 sm:p-8" style={{ borderRadius: '20px' }}>
          <h3 className="text-lg sm:text-xl" style={{ fontFamily: 'var(--font-display)', color: '#fff', marginBottom: '20px' }}>Assigned Editing Projects</h3>
          <p style={{ color: 'var(--color-muted)', fontSize: '14px' }}>No active editing jobs assigned yet. Browse open jobs to send pitches!</p>
        </div>
      </div>
    </main>
  );
}
