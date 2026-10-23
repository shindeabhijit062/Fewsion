'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LogOut, ChevronDown, User } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { ProfileAvatar } from '@/components/ProfileAvatar';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auth User State
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('creator');
  const [profileName, setProfileName] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auth listener to check logged-in status
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        
        // Try fetching user profile from 'users' table
        const { data: profile } = await supabase
          .from('users')
          .select('role, first_name, last_name')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile) {
          if (profile.role) setUserRole(profile.role);
          if (profile.first_name) setProfileName(profile.first_name);
        } else if (session.user.user_metadata?.role) {
          setUserRole(session.user.user_metadata.role);
          if (session.user.user_metadata.full_name) {
            setProfileName(session.user.user_metadata.full_name.split(' ')[0]);
          }
        } else if (session.user.email) {
          setProfileName(session.user.email.split('@')[0]);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        checkUser();
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  const isActive = (href: string) => pathname === href;

  const getPortalPath = (role: string) => {
    if (role === 'brand') return '/portals/brand';
    if (role === 'editor') return '/portals/editor';
    if (role === 'superadmin') return '/superadmin/dashboard';
    return '/portals/creator';
  };

  const navLinks = [
    // Labels say what you can DO there. /creators is the directory brands browse,
    // /brands is the campaign board creators browse.
    { href: '/creators', label: 'Find creators' },
    { href: '/brands', label: 'Find campaigns' },
    { href: '/editors', label: 'For editors' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
  ];

  if (
    pathname === '/' || // the landing page renders its own nav
    pathname?.startsWith('/portals/') ||
    pathname?.startsWith('/superadmin') || 
    pathname?.startsWith('/sign-in') || 
    pathname?.startsWith('/sign-up')
  ) {
    return null;
  }

  const userInitial = (profileName || user?.email || 'U')[0].toUpperCase();

  return (
    <>
      <nav
        id="navbar"
        className={scrolled || mobileOpen ? 'scrolled' : ''}
      >
        <Link href="/" className="flex items-center gap-2 md:gap-3 transition-opacity hover:opacity-80">
          <img src="/logo.png" alt="Fewsion Logo" className="h-8 md:h-10 w-auto object-contain" />
          <span className="text-xl md:text-2xl font-black tracking-[-0.04em] text-[var(--text)]">
            Few<span className="text-[var(--amber)]">sion</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className={`nav-links ${mobileOpen ? 'open' : ''}`} id="navLinks">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={isActive(href) ? 'active' : ''}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}

          {/* User Auth Section */}
          {user ? (
            <li className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2.5 rounded-full bg-[var(--card2)] border border-[var(--border2)] px-3 py-1.5 transition-all duration-200 hover:border-[var(--amber)] cursor-pointer"
              >
                <ProfileAvatar
                  key={user.id}
                  initials={userInitial}
                  size={28}
                  className="bg-gradient-to-tr from-[var(--amber)] to-amber-300 text-black shadow-sm"
                />
                <span className="text-xs font-bold text-[var(--text)] max-w-[100px] truncate hidden sm:inline-block">
                  {profileName || 'Profile'}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 text-[var(--muted)] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[var(--border2)] bg-[var(--card)] p-3 shadow-2xl z-50 space-y-2 font-display">
                    <div className="px-3 py-2 border-b border-[var(--border)]">
                      <div className="text-xs font-bold text-[var(--text)] truncate">
                        {profileName ? `Hello, ${profileName}` : user.email}
                      </div>
                      <div className="mt-1 inline-block rounded-full bg-[var(--amber)]/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[var(--amber)]">
                        {userRole} Portal
                      </div>
                    </div>

                    <Link
                      href={getPortalPath(userRole)}
                      onClick={() => { setDropdownOpen(false); setMobileOpen(false); }}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-[var(--text)] hover:bg-[var(--card2)] transition-all"
                    >
                      <LayoutDashboard size={14} className="text-[var(--amber)]" />
                      Go to Portal Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all text-left"
                    >
                      <LogOut size={14} />
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </li>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-[14px] text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-200"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="nav-cta"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up free
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Hamburger */}
        <button
          type="button"
          className="nav-hamburger"
          id="hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileOpen}
          aria-controls="navLinks"
        >
          <span
            className={`block w-6 h-[2px] rounded-sm transition-all duration-300 origin-center
              ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}
            `}
            style={{ background: 'var(--text)' }}
          />
          <span
            className={`block w-6 h-[2px] rounded-sm transition-all duration-300
              ${mobileOpen ? 'opacity-0' : ''}
            `}
            style={{ background: 'var(--text)' }}
          />
          <span
            className={`block w-6 h-[2px] rounded-sm transition-all duration-300 origin-center
              ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}
            `}
            style={{ background: 'var(--text)' }}
          />
        </button>
      </nav>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
