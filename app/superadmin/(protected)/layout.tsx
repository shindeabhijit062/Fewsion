'use client';

import React from 'react';
import Sidebar from '@/components/superadmin/Sidebar';
import Header from '@/components/superadmin/Header';
import { usePathname } from 'next/navigation';

export default function SuperAdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Basic title logic based on pathname
  let title = 'Dashboard';
  if (pathname.includes('/users')) title = 'User Management';
  if (pathname.includes('/brands')) title = 'Brand Profiles';
  if (pathname.includes('/creators')) title = 'Creator Profiles';
  if (pathname.includes('/campaigns')) title = 'Campaigns';
  if (pathname.includes('/settings')) title = 'Platform Settings';

  return (
    <div className="flex min-h-screen bg-[var(--core-bg)]" style={{ backgroundColor: 'var(--black)' }}>
      <Sidebar />
      
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header title={title} />
        
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
