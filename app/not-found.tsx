import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-28 pb-16 text-center">
      <img src="/logo.png" alt="Fewsion" className="mb-6 h-14 w-auto" />
      <h1 className="font-display text-3xl font-extrabold text-[var(--text)] md:text-4xl">We can&apos;t find that page</h1>
      <p className="mt-3 max-w-[420px] text-base text-[var(--muted)]">
        The link may be old or mistyped. Here is where most people want to go:
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">Go to the homepage</Link>
        <Link href="/pricing" className="btn-ghost">See pricing</Link>
        <Link href="/login" className="btn-ghost">Sign in</Link>
      </div>
    </main>
  );
}
