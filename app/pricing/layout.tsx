import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Free for creators and editors. Brands pay a 10-15% fee on completed projects. See worked examples in rupees.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
