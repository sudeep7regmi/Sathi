'use client';

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/axios';

export default function OwnerLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-gray-900">
      <aside className={`bg-emerald-900 text-white w-64 min-h-screen p-5 flex flex-col justify-between fixed md:relative transition-transform duration-300 z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div>
          <div className="flex items-center space-x-2 pb-6 border-b border-emerald-800 mb-6">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-white text-xl">S</div>
            <span className="text-xl font-bold tracking-wider">SATHI Hub</span>
          </div>
          <nav className="space-y-2">
            <button onClick={() => router.push('/owner')} className="w-full text-left px-4 py-3 bg-emerald-800 text-white rounded-md text-sm font-medium">📊 Business Overview</button>
            <button onClick={() => router.push('/owner/grounds')} className="w-full text-left px-4 py-3 text-emerald-100 hover:bg-emerald-800 rounded-md text-sm font-medium">🏟️ Manage Grounds</button>
            <button onClick={() => router.push('/owner/bookings')} className="w-full text-left px-4 py-3 text-emerald-100 hover:bg-emerald-800 rounded-md text-sm font-medium">📅 Manage Bookings</button>
          </nav>
        </div>
        <div className="pt-4 border-t border-emerald-800">
          <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-300 hover:bg-red-900/50 rounded-md text-sm font-medium">🚪 Sign Out</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white h-16 border-b border-gray-200 flex items-center px-6 shadow-sm justify-between md:justify-end">
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">📋</button>
           <span className="text-sm font-bold text-gray-600">Owner Portal</span>
        </header>
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}