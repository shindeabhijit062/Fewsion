'use client';

import React, { useState } from 'react';

interface ScoreResult {
  aiScore: number;
  metrics: {
    followers: number;
    accounts_reached: number;
    engagement_rate: number;
    authenticity_rating: string;
  };
}

export default function AIScoreWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('screenshot', file);

      const res = await fetch('/api/ai-score', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setResult(data);
      }
    } catch (err) {
      console.error('AI Analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', maxWidth: '560px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span className="badge-amber" style={{ marginBottom: '12px', display: 'inline-block' }}>⚡ AI PROFILE SCORER</span>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: '#fff' }}>Get Your Instagram AI Authenticity Score (0-100)</h3>
        <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginTop: '8px' }}>
          Upload a screenshot of your Instagram Professional Dashboard to calculate your profile reach, engagement, and Fewsion rank.
        </p>
      </div>

      <div 
        style={{ 
          border: '2px dashed var(--border-amber)', 
          borderRadius: '16px', 
          padding: '32px 16px', 
          textAlign: 'center',
          background: 'rgba(245, 166, 35, 0.03)',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
        onClick={() => document.getElementById('screenshot-input')?.click()}
      >
        <input 
          id="screenshot-input" 
          type="file" 
          accept="image/*" 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
        />
        
        {previewUrl ? (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={previewUrl} 
              alt="Screenshot Preview" 
              style={{ maxHeight: '180px', borderRadius: '8px', marginBottom: '12px' }} 
            />
            <p style={{ fontSize: '13px', color: 'var(--color-green)' }}>✓ Screenshot Selected: {file?.name}</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>📸</div>
            <p style={{ fontSize: '15px', color: 'var(--color-white)', fontWeight: 600 }}>Click or Drag & Drop Instagram Screenshot</p>
            <p style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px' }}>Supports PNG, JPG, WEBP</p>
          </div>
        )}
      </div>

      {file && !result && (
        <button 
          onClick={handleAnalyze} 
          disabled={loading}
          className="btn-primary" 
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {loading ? '🤖 AI Analyzing Screenshot...' : 'Calculate My Fewsion Score'}
        </button>
      )}

      {result && (
        <div style={{ background: 'rgba(20, 20, 20, 0.9)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-green)', marginTop: '16px' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Fewsion AI Score</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '54px', fontWeight: 800, color: 'var(--color-amber)', lineHeight: 1 }}>
              {result.aiScore}<span style={{ fontSize: '24px', color: 'var(--color-muted)' }}>/100</span>
            </div>
            <span className="badge-green" style={{ marginTop: '8px', display: 'inline-block' }}>Authenticity Verified: {result.metrics.authenticity_rating}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: 'var(--color-muted)' }}>
            <div>Followers: <strong style={{ color: '#fff' }}>{result.metrics.followers.toLocaleString()}</strong></div>
            <div>Accounts Reached: <strong style={{ color: '#fff' }}>{result.metrics.accounts_reached.toLocaleString()}</strong></div>
            <div>Engagement Rate: <strong style={{ color: '#fff' }}>{result.metrics.engagement_rate}%</strong></div>
            <div>Status: <strong style={{ color: 'var(--color-green)' }}>Top 5% Creator</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}
