import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy - Fewsion',
  description: 'Cookie Policy for Fewsion',
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen pt-[120px] pb-[80px] px-[5%] bg-[var(--core-bg)] text-[var(--text)]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-[clamp(32px,5vw,48px)] font-display font-extrabold mb-8 tracking-tight">Cookie Policy</h1>
        <div className="text-[16px] md:text-[18px] leading-[1.8] text-[var(--muted2)]">
          <p className="mb-8">Last updated: August 2026</p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-[var(--text)] font-display">1. What Are Cookies?</h2>
          <p className="mb-6">
            Cookies are small text files that are stored on your device when you visit our website. They help us remember your preferences, keep you logged in securely, and understand how you interact with our platform.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-[var(--text)] font-display">2. How We Use Cookies</h2>
          <p className="mb-6">
            We use cookies for essential platform operations, such as authentication and security. We also use analytics cookies to measure site performance, track user behavior, and continuously improve our creator matching algorithms and user experience.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-[var(--text)] font-display">3. Third-Party Cookies</h2>
          <p className="mb-6">
            Some of our trusted partners (such as payment providers and analytics services) may also place cookies on your device when you use Fewsion. We do not control these third-party cookies and recommend reviewing their respective privacy policies.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-[var(--text)] font-display">4. Managing Cookies</h2>
          <p className="mb-6">
            You can manage or disable cookies through your browser settings at any time. However, please note that disabling essential cookies may impact your ability to log in, accept contracts, or process payments on the Fewsion platform.
          </p>
        </div>
      </div>
    </main>
  );
}
