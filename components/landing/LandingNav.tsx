'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, LayoutDashboard, Menu, X } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { CTA_LABEL, NAV_LINKS, SIGNUP } from './content';

const PORTAL: Record<string, string> = { brand: '/portals/brand', editor: '/portals/editor', creator: '/portals/creator' };

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [portal, setPortal] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Signed-in visitors get a way back to their portal instead of "Log in".
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) return;
      const role = (session.user.user_metadata?.role as string) || 'creator';
      setPortal(PORTAL[role] ?? PORTAL.creator);
    });
  }, []);

  useEffect(() => {
    document.documentElement.toggleAttribute('data-fx-menu', open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="fx-nav" data-scrolled={scrolled || open ? '' : undefined}>
      <div className="fx-nav__inner">
        <Link href="/" className="fx-nav__brand" aria-label="Fewsion home">
          <img src="/logo.png" alt="" width={34} height={34} />
          <span>
            Few<em>sion</em>
          </span>
        </Link>

        <nav aria-label="Main" className="fx-nav__links">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="fx-nav__actions">
          {portal ? (
            <Link href={portal} className="fx-btn fx-btn--ghost fx-btn--sm">
              <LayoutDashboard size={16} aria-hidden="true" /> Dashboard
            </Link>
          ) : (
            <Link href="/login" className="fx-nav__login">
              Log in
            </Link>
          )}
          <Link href={SIGNUP.any} className="fx-btn fx-btn--primary fx-btn--sm fx-nav__cta">
            {CTA_LABEL} <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="fx-nav__toggle"
            aria-expanded={open}
            aria-controls="fx-mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div id="fx-mobile-menu" className="fx-nav__sheet" hidden={!open}>
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <div className="fx-nav__sheet-actions">
          {portal ? (
            <Link href={portal} className="fx-btn fx-btn--ghost">
              Go to dashboard
            </Link>
          ) : (
            <Link href="/login" className="fx-btn fx-btn--ghost">
              Log in
            </Link>
          )}
          <Link href={SIGNUP.any} className="fx-btn fx-btn--primary">
            {CTA_LABEL} <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}
