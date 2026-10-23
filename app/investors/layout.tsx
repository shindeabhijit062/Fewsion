import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For investors',
  description: 'Fewsion market opportunity, business model and product roadmap.',
};

export default function InvestorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
