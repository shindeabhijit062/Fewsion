import { supabase } from '@/utils/supabase';

// Browser helper for /api/offers (sends the signed-in user's access token)

export interface OfferInput {
  amount: number;
  deadline?: string | null;
  deliverables: string[];
  note?: string | null;
}

async function post<T>(body: Record<string, unknown>): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const res = await fetch('/api/offers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token ?? ''}` },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`) as Error & { collabId?: string };
    err.collabId = data?.collabId;
    throw err;
  }
  return data as T;
}

export const offersApi = {
  create: (input: OfferInput & { creatorId: string; campaignId?: string | null }) =>
    post<{ collab: any }>({ action: 'create', ...input }),
  accept: (collabId: string, note?: string) => post<{ collab: any }>({ action: 'accept', collabId, note }),
  decline: (collabId: string, note?: string) => post<{ collab: any }>({ action: 'decline', collabId, note }),
  counter: (collabId: string, input: OfferInput) => post<{ collab: any }>({ action: 'counter', collabId, ...input }),
};
