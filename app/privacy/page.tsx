import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Fewsion',
  description: 'Privacy Policy for Fewsion',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen pt-[120px] pb-[80px] px-[5%] bg-[var(--core-bg)] text-[var(--text)]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-[clamp(32px,5vw,48px)] font-display font-extrabold mb-8 tracking-tight">Privacy Policy</h1>
        <div className="text-[16px] md:text-[18px] leading-[1.8] text-[var(--muted2)]">
          <p className="mb-8">Last updated: August 2026</p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-[var(--text)] font-display">1. Information We Collect</h2>
          <p className="mb-6">
            We collect information that you provide directly to us when you use our platform, create an account, verify your identity, or communicate with us. This includes personal information such as your name, email address, phone number, and financial details for payouts.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-[var(--text)] font-display">2. How We Use Your Information</h2>
          <p className="mb-6">
            We use the information we collect to operate, maintain, and improve our services, facilitate matches between brands and creators, process transactions via Escrow, communicate with you, and personalize your experience on the Fewsion platform.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-[var(--text)] font-display">3. Data Sharing and Disclosure</h2>
          <p className="mb-6">
            We do not sell your personal data. We may share information with trusted third-party service providers (like payment processors) to facilitate our services. Public profile data and performance scores are visible to other users on the platform to facilitate collaboration.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-[var(--text)] font-display">4. Data Security</h2>
          <p className="mb-6">
            We implement industry-standard security measures to protect your personal information from unauthorized access, loss, misuse, or alteration. However, no data transmission over the Internet can be guaranteed to be 100% secure.
          </p>
          
          <h2 className="text-2xl font-bold mt-12 mb-4 text-[var(--text)] font-display">5. Contact Us</h2>
          <p className="mb-6">
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at support@fewsion.in.
          </p>
        </div>
      </div>
    </main>
  );
}
