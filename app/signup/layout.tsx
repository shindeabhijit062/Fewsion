import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign up free',
  description: 'Create a free Fewsion account as a brand, creator or editor. Takes about 5 minutes.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
