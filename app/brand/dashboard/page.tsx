import React from 'react';

export const metadata = {
  title: 'Brand Portal — Fewsion Marketplace',
  description: 'Manage brand campaigns, review AI-scored creator applications, and execute smart agreements.'
};

export default function BrandDashboardPage() {
  return (
    <main style={{ paddingTop: '120px', paddingBottom: '80px', paddingLeft: '5%', paddingRight: '5%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge-green">BRAND PORTAL</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: '#fff', marginTop: '8px' }}>Brand Campaign Manager</h1>
          </div>
          <button className="btn-primary" style={{ fontSize: '13px', padding: '10px 22px' }}>+ Create New Campaign</button>
        </div>

        <div className="glass-card" style={{ padding: '32px', borderRadius: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#fff', marginBottom: '20px' }}>Active Campaigns</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span className="badge-amber" style={{ marginBottom: '8px', display: 'inline-block' }}>STATUS: OPEN FOR PROPOSALS</span>
                <h4 style={{ color: '#fff', fontSize: '18px' }}>Summer Skincare Influencer Campaign</h4>
                <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginTop: '4px' }}>Budget: <strong>₹1,50,000</strong> • Total Applicants: <strong>14 Creators</strong></p>
              </div>
              <button className="btn-ghost" style={{ fontSize: '13px', padding: '8px 18px' }}>Review AI Score Rankings</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
