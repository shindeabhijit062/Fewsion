import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find campaigns',
  description: 'Browse brand campaigns open to creators and apply.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
