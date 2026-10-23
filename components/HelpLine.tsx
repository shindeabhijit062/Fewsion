import React from 'react';
import { COMPANY } from '@/lib/company';

/** "Talk to a person" strip: phone, WhatsApp and email. Empty fields are skipped. */
export default function HelpLine({ className = '' }: { className?: string }) {
  const { phone, whatsapp, email, hours } = COMPANY;
  const digits = phone.replace(/[^\d+]/g, '');
  return (
    <p className={`text-sm text-[var(--muted)] ${className}`}>
      Need help? Talk to a person:{' '}
      {phone && (
        <>
          <a className="font-semibold text-[var(--text)] underline" href={`tel:${digits}`}>{phone}</a>
          {' · '}
        </>
      )}
      {whatsapp && (
        <>
          <a className="font-semibold text-[var(--text)] underline" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          {' · '}
        </>
      )}
      <a className="font-semibold text-[var(--text)] underline" href={`mailto:${email}`}>{email}</a>
      {hours && <span> ({hours})</span>}
    </p>
  );
}
