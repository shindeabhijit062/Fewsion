import { supabase } from '@/utils/supabase';

// Browser helper for /api/applications (sends the signed-in user's token)

async function authHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token ?? ''}` };
}

export const applicationsApi = {
  /** Campaign ids the signed-in creator has applied to */
  mine: async (): Promise<string[]> => {
    const res = await fetch('/api/applications', { headers: await authHeaders() });
    const data = await res.json().catch(() => ({}));
    return data?.campaignIds ?? [];
  },
  apply: async (campaignId: string) => {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ campaignId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
    return data as { application: any; alreadyApplied?: boolean };
  },
};

/** POST helper for the AI campaign matcher (token optional) */
export async function matchCampaigns(body: { niche?: string; platform?: string; minBudget?: number }) {
  const res = await fetch('/api/match-campaigns', {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'Matching failed');
  return data;
}
