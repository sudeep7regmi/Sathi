'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiClient } from '@/lib/axios';
import axios from 'axios';
import { OwnerSidebar } from '@/components/owner/OwnerSidebar';
import { OwnerHeader } from '@/components/owner/OwnerHeader';

export default function OwnerLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [ownerName, setOwnerName] = useState('Owner');

  // Fetch Header Profile Data
  useEffect(() => {
    let isMounted = true;
    const fetchHeaderProfile = async () => {
      try {
        const response = await apiClient.get('/api/owner/dashboard');
        if (isMounted && response.data.success && response.data.profile) {
          setOwnerName(
            response.data.profile.fullName ||
              response.data.profile.businessName ||
              'Owner'
          );
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err))
          console.warn('Could not populate header profile.');
      }
    };

    fetchHeaderProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleNavigate = (path: string) => {
    setIsSidebarOpen(false);
    router.push(path);
  };

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/logout');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div
      className="min-h-screen flex antialiased selection:bg-emerald-500 selection:text-white"
      style={{ backgroundColor: 'var(--bcolor)', color: 'var(--tcolor)' }}
    >
      {/* Sidebar Component */}
      <OwnerSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        pathname={pathname}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <OwnerHeader
          ownerName={ownerName}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}