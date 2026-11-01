import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editor portal',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
