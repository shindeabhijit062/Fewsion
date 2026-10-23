'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { COMPANY } from '@/lib/company';

export default function Footer() {
  const pathname = usePathname();
  if (
    pathname?.startsWith('/portals/') || 
    pathname?.startsWith('/superadmin') || 
    pathname?.startsWith('/sign-in') || 
    pathname?.startsWith('/sign-up')
  ) {
    return null;
  }

  return (
    <footer>
      <div className="footer-top">
        {/* Brand col */}
        <div className="footer-brand">
          <Link href="/" className="flex items-center gap-3 mb-6 transition-opacity hover:opacity-80">
            <img src="/logo.png" alt="Fewsion Logo" className="h-10 w-auto object-contain" />
            <span className="text-2xl font-black tracking-[-0.04em] text-[var(--text)]">
              Few<span className="text-[var(--amber)]">sion</span>
            </span>
          </Link>
          <p>
            India&apos;s first performance-first creator marketplace. Connecting brands, creators, and editors — powered by AI.
          </p>
        </div>

        {/* Platform col */}
        <div className="footer-col">
          <h5>Platform</h5>
          <ul>
            <li><Link href="/creators">Find creators</Link></li>
            <li><Link href="/brands">Find campaigns</Link></li>
            <li><Link href="/editors">For editors</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
          </ul>
        </div>

        {/* Company col */}
        <div className="footer-col">
          <h5>Company</h5>
          <ul>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/careers">Careers</Link></li>
            <li><Link href="/investors">Investors</Link></li>
          </ul>
        </div>

        {/* Contact col: a real way to reach a human */}
        <div className="footer-col">
          <h5>Talk to us</h5>
          <ul>
            {COMPANY.phone && (
              <li><a href={`tel:${COMPANY.phone.replace(/[^\d+]/g, '')}`}>{COMPANY.phone}</a></li>
            )}
            {COMPANY.whatsapp && (
              <li><a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp us</a></li>
            )}
            <li><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
            {COMPANY.hours && <li><span>{COMPANY.hours}</span></li>}
            {COMPANY.address && <li><span>{COMPANY.address}</span></li>}
          </ul>
        </div>

        {/* Legal col */}
        <div className="footer-col">
          <h5>Legal</h5>
          <ul>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/cookie">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} {COMPANY.legalName || 'Fewsion'}. All rights reserved.
          {COMPANY.gstin ? ` GSTIN: ${COMPANY.gstin}.` : ''}
        </p>
      </div>
    </footer>
  );
}
