import type { Metadata } from 'next';
import Landing from '@/components/landing/Landing';

export const metadata: Metadata = {
  description:
    'Paste a product link and Fewsion’s AI writes a brief creators can’t misread. Every draft is checked against it before you see it, and creators are paid only when you approve.',
};

export default function HomePage() {
  return <Landing />;
}
