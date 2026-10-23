import type { Metadata } from 'next';
import Landing from '@/components/landing/Landing';

export const metadata: Metadata = {
  description:
    'Fewsion connects D2C brands, UGC content creators, and video editors — powered by AI matching, verified performance data, and built-in escrow payments.',
};

export default function HomePage() {
  return <Landing />;
}
