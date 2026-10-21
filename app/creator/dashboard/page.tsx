// import React from 'react';
// import AIScoreWidget from '@/components/AIScoreWidget';

// export const metadata = {
//   title: 'Creator Portal — Fewsion Marketplace',
//   description: 'Manage your AI profile score, view brand campaign matches, and track digital agreement payouts.'
// };

// export default function CreatorDashboardPage() {
//   return (
//     <main style={{ paddingTop: '120px', paddingBottom: '80px', paddingLeft: '5%', paddingRight: '5%' }}>
//       <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
//           <div>
//             <span className="badge-amber">CREATOR PORTAL</span>
//             <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: '#fff', marginTop: '8px' }}>Creator Dashboard</h1>
//           </div>
//           <div style={{ display: 'flex', gap: '12px' }}>
//             <button className="btn-ghost" style={{ fontSize: '13px', padding: '8px 18px' }}>Update Niche</button>
//             <button className="btn-primary" style={{ fontSize: '13px', padding: '8px 18px' }}>Browse Campaigns</button>
//           </div>
//         </div>

//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
//           <div>
//             <AIScoreWidget />
//           </div>

//           <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
//             <div className="glass-card" style={{ padding: '28px', borderRadius: '20px' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                 <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#fff' }}>Recommended Brand Campaigns</h3>
//                 <span className="badge-green">AI Matched (95%+ Fit)</span>
//               </div>

//               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//                 <div style={{ background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
//                   <div>
//                     <h4 style={{ color: '#fff', fontSize: '16px' }}>Nike India — Summer Fitness UGC Reel</h4>
//                     <p style={{ color: 'var(--color-muted)', fontSize: '13px', marginTop: '4px' }}>Budget: <strong>₹25,000</strong> • Deliverables: 1 Reel + 2 Stories</p>
//                   </div>
//                   <button className="btn-primary" style={{ fontSize: '12px', padding: '8px 16px' }}>Apply & Pitch</button>
//                 </div>

//                 <div style={{ background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
//                   <div>
//                     <h4 style={{ color: '#fff', fontSize: '16px' }}>BoAt Audio — Wireless Earbuds Unboxing</h4>
//                     <p style={{ color: 'var(--color-muted)', fontSize: '13px', marginTop: '4px' }}>Budget: <strong>₹40,000</strong> • Deliverables: 2 Short Videos</p>
//                   </div>
//                   <button className="btn-primary" style={{ fontSize: '12px', padding: '8px 16px' }}>Apply & Pitch</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

const NICHES = [
  'Tech & gadgets', 'Beauty & skincare', 'Finance & investing', 'Fitness & health',
  'Food & recipes', 'Travel & lifestyle', 'Gaming', 'Education', 'Fashion', 'Parenting',
];
const PLATFORMS = ['Instagram', 'YouTube', 'Both'];
const FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: '4-6/week', label: '4–6 times a week' },
  { value: '2-3/week', label: '2–3 times a week' },
  { value: 'weekly', label: 'Once a week' },
  { value: 'monthly', label: 'Monthly or less' },
];

// Same formula as the old HTML creator portal (generateFallbackScore),
// so scores match what's already in the database.
function calculateScore(followers: number, engRate: number, postFreq: string, pastBrands: string) {
  const reach = Math.min(100, Math.round((Math.log10(followers || 1) / 7) * 100));
  const eng = Math.min(100, Math.round(engRate * 12));
  const safety = 65;
  const consistency =
    postFreq === 'daily' ? 95 : postFreq === '4-6/week' ? 85 : postFreq === '2-3/week' ? 75 : 60;
  const collab = pastBrands ? 75 : 50;
  const total = Math.round(reach * 0.3 + eng * 0.25 + safety * 0.2 + consistency * 0.15 + collab * 0.1);
  const grade =
    total >= 90 ? 'A+' : total >= 80 ? 'A' : total >= 70 ? 'B+' : total >= 60 ? 'B' : total >= 50 ? 'C+' : 'C';
  return { total, grade };
}

export default function CreatorDashboardPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    niche: '',
    platform: 'Instagram',
    followers: '',
    engRate: '',
    avgViews: '',
    postFreq: '',
    rate: '',
    pastBrands: '',
    contentStyle: '',
  });

  const update = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  async function handleSave() {
    setError('');
    if (!form.name.trim() || !form.niche || !form.followers || !form.engRate || !form.contentStyle.trim()) {
      setError('Please fill in your name, niche, followers, engagement rate and content style.');
      return;
    }

    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      router.push('/login');
      return;
    }

    const followers = parseInt(form.followers, 10) || 0;
    const engRate = parseFloat(form.engRate) || 0;
    const { total, grade } = calculateScore(followers, engRate, form.postFreq, form.pastBrands);

    const { error: saveError } = await supabase
      .from('creator_profiles')
      .upsert(
        {
          user_id: user.id,
          creator_name: form.name.trim(),
          primary_niche: form.niche,
          primary_platform: form.platform,
          follower_count: followers,
          engagement_rate: engRate,
          avg_views_per_post: form.avgViews ? parseInt(form.avgViews, 10) : null,
          posting_frequency: form.postFreq || null,
          rate_per_integration: form.rate || null,
          past_brand_collaborations: form.pastBrands || null,
          content_style_desc: form.contentStyle.trim(),
          ai_total_score: total,
          ai_grade: grade,
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    router.push('/portals/creator');
  }

  const inputClass =
    'w-full rounded-lg border border-[var(--border2)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--amber)]';
  const labelClass = 'mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]';

  return (
    <main className="min-h-screen bg-[var(--black)] px-6 pb-20 pt-32 text-[var(--text)]">
      <div className="mx-auto max-w-xl">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--amber)]">AI Profile</span>
        <h1 className="mt-2 font-display text-3xl font-extrabold">Set up your creator profile</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Tell us about your account. We use this to calculate your Creator Score and match you with brands.
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <label className={labelClass}>Your name</label>
            <input className={inputClass} value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>

          <div>
            <label className={labelClass}>Primary niche</label>
            <div className="flex flex-wrap gap-2">
              {NICHES.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => update('niche', n)}
                  className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${form.niche === n
                      ? 'border-[var(--amber)] bg-[var(--amber)] text-black'
                      : 'border-[var(--border2)] text-[var(--muted)] hover:text-[var(--text)]'
                    }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Primary platform</label>
            <select className={inputClass} value={form.platform} onChange={(e) => update('platform', e.target.value)}>
              {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Followers</label>
              <input type="number" className={inputClass} value={form.followers} onChange={(e) => update('followers', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Engagement rate (%)</label>
              <input type="number" step="0.1" className={inputClass} value={form.engRate} onChange={(e) => update('engRate', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Avg views per post</label>
              <input type="number" className={inputClass} value={form.avgViews} onChange={(e) => update('avgViews', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Rate per video (₹)</label>
              <input className={inputClass} value={form.rate} onChange={(e) => update('rate', e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelClass}>How often do you post?</label>
            <select className={inputClass} value={form.postFreq} onChange={(e) => update('postFreq', e.target.value)}>
              <option value="">Select...</option>
              {FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Describe your content style</label>
            <textarea
              rows={3}
              placeholder="e.g. Honest product reviews, casual tone, short reels with voiceover"
              className={inputClass}
              value={form.contentStyle}
              onChange={(e) => update('contentStyle', e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Brands you&apos;ve worked with (optional)</label>
            <input className={inputClass} value={form.pastBrands} onChange={(e) => update('pastBrands', e.target.value)} />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-full bg-[var(--amber)] py-3 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save profile & open my portal'}
          </button>
        </div>
      </div>
    </main>
  );
}