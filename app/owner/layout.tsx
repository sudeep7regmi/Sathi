'use client';

import { ReactNode, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiClient } from '@/lib/axios';
import { 
  BarChart3, 
  Layers, 
  CalendarDays, 
  LogOut, 
  Menu, 
  X,
  ShieldAlert
} from 'lucide-react';

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
};

export default function OwnerLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Defaulting mobile to closed for cleaner entrance

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed');
    }
  };

  // Helper system to track dynamic neon highlights
  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-[#0B0C10] flex text-[#F0EDE6] antialiased selection:bg-[#C8F55A] selection:text-black">
      
      {/* Mobile Sidebar Overlay Curtain */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Persistent / Responsive Dashboard Sidebar */}
      <aside className={`bg-[#12161A] w-64 min-h-screen p-5 flex flex-col justify-between fixed md:sticky top-0 transition-transform duration-300 border-r border-white/5 z-50 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div>
          {/* Header Branding node */}
          <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#C8F55A] rounded-lg flex items-center justify-center font-black text-black text-xl" style={DISPLAY}>
                S
              </div>
              <span className="text-lg font-black tracking-wider text-white uppercase" style={DISPLAY}>
                SATHI Hub
              </span>
            </div>
            
            {/* Mobile close interactive node */}
            <button className="md:hidden text-white/50 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation link architecture */}
          <nav className="space-y-1.5">
            <button 
              onClick={() => { router.push('/owner'); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 group ${
                isActive('/owner') 
                  ? 'bg-[#C8F55A] text-black shadow-lg shadow-[#C8F55A]/10' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
              style={DISPLAY}
            >
              <BarChart3 className={`w-4 h-4 shrink-0 ${isActive('/owner') ? 'text-black' : 'text-[#C8F55A] group-hover:scale-110 transition-transform'}`} />
              <span>Business Overview</span>
            </button>

            <button 
              onClick={() => { router.push('/owner/grounds'); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 group ${
                isActive('/owner/grounds') 
                  ? 'bg-[#C8F55A] text-black shadow-lg shadow-[#C8F55A]/10' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
              style={DISPLAY}
            >
              <Layers className={`w-4 h-4 shrink-0 ${isActive('/owner/grounds') ? 'text-black' : 'text-[#C8F55A] group-hover:scale-110 transition-transform'}`} />
              <span>Manage Grounds</span>
            </button>

            <button 
              onClick={() => { router.push('/owner/bookings'); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 group ${
                isActive('/owner/bookings') 
                  ? 'bg-[#C8F55A] text-black shadow-lg shadow-[#C8F55A]/10' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
              style={DISPLAY}
            >
              <CalendarDays className={`w-4 h-4 shrink-0 ${isActive('/owner/bookings') ? 'text-black' : 'text-[#C8F55A] group-hover:scale-110 transition-transform'}`} />
              <span>Manage Bookings</span>
            </button>
          </nav>
        </div>

        {/* Profile Termination / Signout Section */}
        <div className="pt-4 border-t border-white/5">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            style={DISPLAY}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Viewport viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Upper Portal Header bar */}
        <header className="bg-[#12161A]/80 backdrop-blur-md h-16 border-b border-white/5 flex items-center px-6 sticky top-0 justify-between md:justify-end z-40">
           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
             className="md:hidden w-9 h-9 border border-white/10 rounded-xl flex items-center justify-center text-white/80 hover:text-white active:scale-95 transition-all bg-[#0B0C10]"
           >
             <Menu className="w-4 h-4" />
           </button>
           
           <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40" style={DISPLAY}>
             <ShieldAlert className="w-3.5 h-3.5 text-[#C8F55A]" />
             <span>Owner Portal</span>
           </div>
        </header>

        {/* Layout Context Child Rendering Nodes */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}