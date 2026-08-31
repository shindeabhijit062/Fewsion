import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Fewsion — Where Brands Meet Creators',
  description: 'Connect Brands, Creators, and Editors with AI-driven contracts, Instagram screenshot 0-100 authenticity scoring, and performance payouts.',
  keywords: ['Fewsion', 'creator marketplace', 'india influencer marketing', 'UGC creators', 'video editors', 'AI creator score'],
  authors: [{ name: 'Fewsion Team' }],
  metadataBase: new URL('https://fewsion.in'),
  openGraph: {
    title: 'Fewsion — Where Brands Meet Creators',
    description: 'Connect Brands, Creators, and Editors with AI-driven contracts and performance payouts.',
    url: 'https://fewsion.in',
    siteName: 'Fewsion',
    images: [
      {
        url: '/assets/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Fewsion Marketplace'
      }
    ],
    locale: 'en_IN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fewsion — Performance-First Creator Marketplace',
    description: 'AI Matchmaking & Agreements for Brands, Creators, and Editors.'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Fewsion',
    url: 'https://fewsion.in',
    description: 'India\'s first performance-first creator marketplace connecting brands, creators, and editors.',
    sameAs: ['https://instagram.com/fewsion.in']
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Outfit:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('fewsion_theme');
                  if (t === 'white') {
                    document.documentElement.setAttribute('data-theme', 'light');
                    document.documentElement.classList.add('light-theme');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
