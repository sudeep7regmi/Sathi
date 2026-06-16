'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiClient } from '@/lib/axios';
import { SocketProvider } from '@/components/providers/SocketProvider';
import axios from 'axios';

interface PlayerLayoutProps {
  children: ReactNode;
}

export default function PlayerLayout({ children }: PlayerLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile
  const [userName, setUserName] = useState('Player');

  useEffect(() => {
    const fetchHeaderProfile = async () => {
      try {
        const response = await apiClient.get('/api/player/dashboard');
        if (response.data.success && response.data.profile) {
          setUserName(response.data.profile.fullName);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) console.warn('Could not populate header.');
      }
    };
    fetchHeaderProfile();
  }, []);

  // Auto-close mobile sidebar when navigating to a new page
  useEffect(() => {
    const handlePathChange = () => setIsSidebarOpen(false);
    handlePathChange();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  const navLinks = [
    { name: 'Dashboard Overview', path: '/player', icon: '🏠' },
    { name: 'Matchmaking Hub', path: '/player/matches', icon: '⚽' },
    { name: 'Incoming Requests', path: '/player/requests', icon: '📥' },
    { name: 'Book Futsal Grounds', path: '/player/grounds', icon: '🏟️' },
    { name: 'Team Messenger', path: '/player/chat', icon: '💬' },
  ];

  return (
    <SocketProvider>
      <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900 font-sans">
        
        {/* MOBILE OVERLAY BACKDROP */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR: Full width on mobile (w-full), fixed width on desktop (md:w-72) */}
        <aside 
          className={`fixed inset-y-0 left-0 z-50 w-full md:w-72 bg-[#0B1121] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:relative`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800/60">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-600/20">
                S
              </div>
              <span className="text-2xl font-black text-white tracking-wide">SATHI</span>
            </div>
            {/* Close Button (Mobile Only) */}
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="md:hidden text-slate-400 hover:text-white bg-slate-800 p-2 rounded-lg"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <button 
                  key={link.path}
                  onClick={() => router.push(link.path)} 
                  className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 text-left
                    ${isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-800/60">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3.5 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-medium transition-colors text-left"
            >
              <span className="text-lg">🚪</span>
              <span>Sign Out Session</span>
            </button>
          </div>
        </aside>

        {/* MAIN VIEWPORT */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden relative">
          {/* Top Header */}
          <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 h-20 border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
            <div className="flex items-center">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="text-slate-600 focus:outline-none md:hidden p-2 hover:bg-slate-100 rounded-lg mr-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
              <h2 className="hidden sm:block text-xl font-bold text-slate-800">
                {navLinks.find(l => l.path === pathname)?.name || 'Dashboard'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
              <span className="text-sm font-bold text-slate-700 hidden sm:inline pl-2">
                {userName}
              </span>
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs tracking-wider shadow-sm">
                {getInitials(userName)}
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </SocketProvider>
  );
}