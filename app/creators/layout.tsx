import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find creators',
  description: 'Browse UGC creators by niche, platform, engagement and rate.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
