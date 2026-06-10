'use client';

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/axios';

interface PlayerLayoutProps {
  children: ReactNode;
}

export default function PlayerLayout({ children }: PlayerLayoutProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex text-gray-900">
      {/* SIDEBAR COMPONENT */}
      <aside className={`bg-slate-900 text-white w-64 min-h-screen p-5 flex flex-col justify-between fixed md:relative transition-transform duration-300 z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div>
          {/* SATHI Brand Logo Header */}
          <div className="flex items-center space-x-2 pb-6 border-b border-slate-800 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-xl">S</div>
            <span className="text-xl font-bold tracking-wider">SATHI</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button onClick={() => router.push('/player')} className="w-full flex items-center space-x-3 px-4 py-3 bg-slate-800 text-white rounded-md text-sm font-medium transition-colors text-left">
              <span>🏠</span>
              <span>Dashboard Overview</span>
            </button>
            <button onClick={() => router.push('/player/matches')} className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-md text-sm font-medium transition-colors text-left">
              <span>⚽</span>
              <span>Find & Host Matches</span>
            </button>
            <button onClick={() => router.push('/player/grounds')} className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-md text-sm font-medium transition-colors text-left">
              <span>🏟️</span>
              <span>Book Futsal Grounds</span>
            </button>
            <button onClick={() => router.push('/player/chat')} className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-md text-sm font-medium transition-colors text-left">
              <span>💬</span>
              <span>Team Messenger</span>
            </button>
          </nav>
        </div>

        {/* Foot Profile Info & Logout Utility */}
        <div className="pt-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-950/40 rounded-md text-sm font-medium transition-colors text-left"
          >
            <span>🚪</span>
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* VIEWPORT CONTROLLER VIEW CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top bar overhead header utility layout */}
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-600 focus:outline-none md:hidden p-1 hover:bg-gray-100 rounded"
          >
            📋
          </button>
        
        </header>

        {/* MAIN DISPLAY PAGE GRID SPACE */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}