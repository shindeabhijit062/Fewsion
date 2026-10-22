// Instagram Login (Meta "Instagram API with Instagram Login").
// Server-only: uses the app secret. Works for Instagram Business and
// Creator accounts.
//
// Env:
//   INSTAGRAM_APP_ID       – "Instagram app ID" from Meta App Dashboard
//   INSTAGRAM_APP_SECRET   – "Instagram app secret"
//   INSTAGRAM_REDIRECT_URI – optional; defaults to <site>/api/auth/instagram/callback
//                            (must exactly match a "Valid OAuth Redirect URI" in Meta)

const GRAPH = 'https://graph.instagram.com/v22.0';

export const INSTAGRAM_STATE_COOKIE = 'fewsion_ig_oauth';

export function instagramConfig(origin: string) {
  const appId = process.env.INSTAGRAM_APP_ID;
  const appSecret = process.env.INSTAGRAM_APP_SECRET;
  if (!appId || !appSecret) return null;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || `${origin}/api/auth/instagram/callback`;
  return { appId, appSecret, redirectUri };
}

export function instagramAuthorizeUrl(cfg: { appId: string; redirectUri: string }, state: string) {
  const params = new URLSearchParams({
    client_id: cfg.appId,
    redirect_uri: cfg.redirectUri,
    response_type: 'code',
    scope: 'instagram_business_basic',
    state,
  });
  return `https://www.instagram.com/oauth/authorize?${params}`;
}

/** Swap the one-time code for a short-lived access token */
export async function exchangeInstagramCode(
  cfg: { appId: string; appSecret: string; redirectUri: string },
  code: string
): Promise<string> {
  const res = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: cfg.appId,
      client_secret: cfg.appSecret,
      grant_type: 'authorization_code',
      redirect_uri: cfg.redirectUri,
      // Instagram appends "#_" to the code in some browsers
      code: code.replace(/#_$/, ''),
    }),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  const token = data?.access_token ?? data?.data?.[0]?.access_token;
  if (!res.ok || !token) {
    throw new Error(data?.error_message || data?.error?.message || 'Instagram did not return an access token.');
  }
  return token;
}

export interface InstagramProfile {
  id: string;
  username: string;
  name: string | null;
  profilePictureUrl: string | null;
  followersCount: number | null;
  mediaCount: number | null;
  accountType: string | null;
}

export async function fetchInstagramProfile(accessToken: string): Promise<InstagramProfile> {
  const fields = 'id,user_id,username,name,profile_picture_url,followers_count,media_count,account_type';
  const res = await fetch(`${GRAPH}/me?fields=${fields}&access_token=${encodeURIComponent(accessToken)}`, {
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.id) {
    throw new Error(data?.error?.message || 'Could not read your Instagram profile.');
  }
  return {
    // `id` is a string; the numeric user_id can lose precision in JSON, so don't use it
    id: String(data.id),
    username: data.username,
    name: data.name || null,
    profilePictureUrl: data.profile_picture_url || null,
    followersCount: typeof data.followers_count === 'number' ? data.followers_count : null,
    mediaCount: typeof data.media_count === 'number' ? data.media_count : null,
    accountType: data.account_type || null,
  };
}

/** Instagram doesn't share emails, so each Instagram account gets a stable internal address */
export const instagramEmail = (igId: string) => `instagram_${igId}@instagram.fewsion.invalid`;
