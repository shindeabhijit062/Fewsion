import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video editors',
  description: 'Find video editors by format, software and turnaround time.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
