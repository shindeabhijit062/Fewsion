import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { INSTAGRAM_STATE_COOKIE, instagramAuthorizeUrl, instagramConfig } from '@/lib/instagram';

// Starts "Sign in with Instagram": remembers the chosen role in a short-lived
// cookie together with a random state value, then sends the user to Instagram.

export const dynamic = 'force-dynamic';

const ROLES = ['brand', 'creator', 'editor'];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const cfg = instagramConfig(url.origin);
  if (!cfg) {
    return NextResponse.redirect(
      `${url.origin}/login?error=${encodeURIComponent('Instagram sign-in is not configured yet.')}`
    );
  }

  const role = ROLES.includes(url.searchParams.get('role') || '') ? url.searchParams.get('role')! : 'creator';
  const next = url.searchParams.get('next');
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : null;
  const state = randomBytes(24).toString('hex');

  const res = NextResponse.redirect(instagramAuthorizeUrl(cfg, state));
  res.cookies.set(INSTAGRAM_STATE_COOKIE, JSON.stringify({ state, role, next: safeNext }), {
    httpOnly: true,
    secure: url.protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });
  return res;
}
