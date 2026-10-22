import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import {
  INSTAGRAM_STATE_COOKIE,
  exchangeInstagramCode,
  fetchInstagramProfile,
  instagramConfig,
  instagramEmail,
} from '@/lib/instagram';

// Instagram redirects here after the user approves.
// 1. Check the state cookie, swap the code for a token, read the profile.
// 2. Find or create the matching Supabase user (keyed on the Instagram id).
// 3. Hand the browser a one-time sign-in token; /auth/callback turns it into
//    a normal Supabase session and routes the user like Google sign-in does.

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const fail = (msg: string) => {
    const res = NextResponse.redirect(`${url.origin}/login?error=${encodeURIComponent(msg)}`);
    res.cookies.delete(INSTAGRAM_STATE_COOKIE);
    return res;
  };

  // User pressed "Cancel" on Instagram
  if (url.searchParams.get('error')) {
    return fail(url.searchParams.get('error_description') || 'Instagram sign-in was cancelled.');
  }

  let saved: { state?: string; role?: string; next?: string | null } = {};
  try {
    saved = JSON.parse(cookies().get(INSTAGRAM_STATE_COOKIE)?.value || '{}');
  } catch {}
  const state = url.searchParams.get('state');
  if (!state || !saved.state || state !== saved.state) {
    return fail('Your Instagram sign-in expired. Please try again.');
  }

  const cfg = instagramConfig(url.origin);
  const admin = getSupabaseAdmin();
  const code = url.searchParams.get('code');
  if (!cfg || !admin) return fail('Instagram sign-in is not configured yet.');
  if (!code) return fail('Instagram did not return a sign-in code.');

  try {
    const token = await exchangeInstagramCode(cfg, code);
    const ig = await fetchInstagramProfile(token);
    const email = instagramEmail(ig.id);
    const role = saved.role || 'creator';
    const displayName = ig.name || ig.username;

    const instagramMeta = {
      instagram_id: ig.id,
      instagram_username: ig.username,
      instagram_followers: ig.followersCount,
      instagram_media_count: ig.mediaCount,
      instagram_account_type: ig.accountType,
      instagram_synced_at: new Date().toISOString(),
    };

    // ---- Find or create the Supabase user ----
    let userId: string | null = null;
    const { data: existingRow } = await admin.from('users').select('id').eq('email', email).maybeSingle();
    userId = existingRow?.id ?? null;

    if (!userId) {
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name: displayName, role, avatar_url: ig.profilePictureUrl, ...instagramMeta },
        app_metadata: { provider: 'instagram', providers: ['instagram'] },
      });
      if (created?.user) {
        userId = created.user.id;
      } else if (createErr && /already|registered|exists/i.test(createErr.message)) {
        // Auth user exists but has no users row yet: look it up
        for (let page = 1; page <= 20 && !userId; page++) {
          const { data } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
          const users: { id: string; email?: string }[] = data?.users ?? [];
          userId = users.find((u) => u.email === email)?.id ?? null;
          if (users.length < 1000) break;
        }
      }
      if (!userId) return fail(createErr?.message || 'Could not create your Fewsion account.');
    } else {
      // Returning user: refresh their Instagram details (merge, don't replace)
      const { data: current } = await admin.auth.admin.getUserById(userId);
      await admin.auth.admin.updateUserById(userId, {
        user_metadata: { ...(current?.user?.user_metadata || {}), ...instagramMeta },
      });
    }

    // ---- Make sure the users row exists ----
    const { data: row } = await admin.from('users').select('id, avatar_url').eq('id', userId).maybeSingle();
    if (!row) {
      const { error: insertErr } = await admin.from('users').insert({
        id: userId,
        email,
        role,
        first_name: displayName.split(' ')[0] || '',
        last_name: displayName.split(' ').slice(1).join(' ') || '',
        full_name: displayName,
      });
      if (insertErr) return fail(`Could not create your Fewsion account: ${insertErr.message}`);
    }

    // ---- Keep their Instagram photo (Instagram's own links expire) ----
    if (!row?.avatar_url && ig.profilePictureUrl) {
      try {
        const img = await fetch(ig.profilePictureUrl);
        if (img.ok) {
          const contentType = img.headers.get('content-type') || 'image/jpeg';
          const path = `${userId}/instagram-${Date.now()}.jpg`;
          const { error: upErr } = await admin.storage
            .from('avatars')
            .upload(path, Buffer.from(await img.arrayBuffer()), { contentType, upsert: true });
          if (!upErr) {
            const { data: pub } = admin.storage.from('avatars').getPublicUrl(path);
            await admin.from('users').update({ avatar_url: pub.publicUrl }).eq('id', userId);
          }
        }
      } catch (e) {
        console.warn('Instagram avatar copy failed:', e);
      }
    }

    // ---- One-time sign-in token for the browser ----
    const { data: link, error: linkErr } = await admin.auth.admin.generateLink({ type: 'magiclink', email });
    const hashed = link?.properties?.hashed_token;
    if (linkErr || !hashed) return fail(linkErr?.message || 'Could not sign you in.');

    const params = new URLSearchParams({ ig_token: hashed, role });
    if (saved.next) params.set('next', saved.next);
    const res = NextResponse.redirect(`${url.origin}/auth/callback?${params}`);
    res.cookies.delete(INSTAGRAM_STATE_COOKIE);
    return res;
  } catch (e) {
    console.error('Instagram callback error:', e);
    return fail(e instanceof Error ? e.message : 'Instagram sign-in failed.');
  }
}
