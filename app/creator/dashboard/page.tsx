import React from 'react';
import AIScoreWidget from '@/components/AIScoreWidget';

export const metadata = {
  title: 'Creator Portal — Fewsion Marketplace',
  description: 'Manage your AI profile score, view brand campaign matches, and track digital agreement payouts.'
};

export default function CreatorDashboardPage() {
  return (
    <main style={{ paddingTop: '120px', paddingBottom: '80px', paddingLeft: '5%', paddingRight: '5%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge-amber">CREATOR PORTAL</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: '#fff', marginTop: '8px' }}>Creator Dashboard</h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-ghost" style={{ fontSize: '13px', padding: '8px 18px' }}>Update Niche</button>
            <button className="btn-primary" style={{ fontSize: '13px', padding: '8px 18px' }}>Browse Campaigns</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
          <div>
            <AIScoreWidget />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-card" style={{ padding: '28px', borderRadius: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#fff' }}>Recommended Brand Campaigns</h3>
                <span className="badge-green">AI Matched (95%+ Fit)</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '16px' }}>Nike India — Summer Fitness UGC Reel</h4>
                    <p style={{ color: 'var(--color-muted)', fontSize: '13px', marginTop: '4px' }}>Budget: <strong>₹25,000</strong> • Deliverables: 1 Reel + 2 Stories</p>
                  </div>
                  <button className="btn-primary" style={{ fontSize: '12px', padding: '8px 16px' }}>Apply & Pitch</button>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '16px' }}>BoAt Audio — Wireless Earbuds Unboxing</h4>
                    <p style={{ color: 'var(--color-muted)', fontSize: '13px', marginTop: '4px' }}>Budget: <strong>₹40,000</strong> • Deliverables: 2 Short Videos</p>
                  </div>
                  <button className="btn-primary" style={{ fontSize: '12px', padding: '8px 16px' }}>Apply & Pitch</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
