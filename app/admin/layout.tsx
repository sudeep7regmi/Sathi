'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiClient } from '@/lib/axios';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Removed useEffect to avoid cascading renders

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
      router.push('/login');
    } catch (error) { console.error('Logout failed'); }
  };

  const navLinks = [
    { name: 'Global Metrics', path: '/admin', icon: '🌍' },
    { name: 'User Directory', path: '/admin/users', icon: '👥' },
    { name: 'Arena Registry', path: '/admin/grounds', icon: '🏟️' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans">
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}

      {/* Admin Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-full md:w-72 bg-[#0a0a0a] text-slate-300 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:relative`}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-red-600/20">S</div>
            <span className="text-2xl font-black text-white tracking-wide">COMMAND</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 p-2 rounded-lg">✕</button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <button 
                key={link.path} onClick={() => { setIsSidebarOpen(false); router.push(link.path); }} 
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 text-left
                  ${isActive ? 'bg-red-600 text-white shadow-md shadow-red-600/20' : 'hover:bg-white/5 hover:text-white'}`}
              >
                <span className="text-lg">{link.icon}</span><span>{link.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3.5 text-red-400 hover:bg-white/5 rounded-xl text-sm font-medium transition-colors text-left">
            <span className="text-lg">🚪</span><span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 h-20 border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 hover:bg-slate-100 rounded-lg mr-4">📋</button>
            <h2 className="hidden sm:block text-xl font-bold text-slate-800">{navLinks.find(l => l.path === pathname)?.name || 'Admin'}</h2>
          </div>
          <span className="text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">God Mode Enabled</span>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}