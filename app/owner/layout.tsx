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

export default function OwnerLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div 
      className="min-h-screen flex antialiased"
      style={{ backgroundColor: "var(--bcolor)", color: "var(--tcolor)" }}
    >
      
      {/* Mobile Sidebar Overlay Curtain */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Persistent / Responsive Dashboard Sidebar */}
      <aside 
        className={`w-64 min-h-screen p-5 flex flex-col justify-between fixed md:sticky top-0 transition-transform duration-300 border-r z-50 shadow-sm ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
      >
        <div>
          {/* Header Branding node */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center font-black text-white text-xl shadow-xs">
                S
              </div>
              <span className="text-lg font-black tracking-wide text-slate-900 uppercase">
                SATHI Hub
              </span>
            </div>
            
            {/* Mobile close interactive node */}
            <button className="md:hidden text-slate-500 hover:text-slate-800 bg-slate-100 p-1.5 rounded-lg" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation link architecture */}
          <nav className="space-y-1.5">
            <button 
              onClick={() => { router.push('/owner'); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 group cursor-pointer ${
                isActive('/owner') 
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/10' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BarChart3 className={`w-4 h-4 shrink-0 ${isActive('/owner') ? 'text-white' : 'text-emerald-600 group-hover:scale-110 transition-transform'}`} />
              <span>Business Overview</span>
            </button>

            <button 
              onClick={() => { router.push('/owner/grounds'); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 group cursor-pointer ${
                isActive('/owner/grounds') 
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/10' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Layers className={`w-4 h-4 shrink-0 ${isActive('/owner/grounds') ? 'text-white' : 'text-emerald-600 group-hover:scale-110 transition-transform'}`} />
              <span>Manage Grounds</span>
            </button>

            <button 
              onClick={() => { router.push('/owner/bookings'); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 group cursor-pointer ${
                isActive('/owner/bookings') 
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/10' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <CalendarDays className={`w-4 h-4 shrink-0 ${isActive('/owner/bookings') ? 'text-white' : 'text-emerald-600 group-hover:scale-110 transition-transform'}`} />
              <span>Manage Bookings</span>
            </button>
          </nav>
        </div>

        {/* Profile Termination / Signout Section */}
        <div className="pt-4 border-t border-slate-200">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Upper Portal Header bar */}
        <header 
          className="backdrop-blur-md h-16 border-b flex items-center px-6 sticky top-0 justify-between md:justify-end z-40 shadow-xs"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.85)", borderColor: "var(--border-color)" }}
        >
           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
             className="md:hidden w-9 h-9 border border-slate-200 rounded-xl flex items-center justify-center text-slate-700 hover:text-slate-900 active:scale-95 transition-all bg-white shadow-xs cursor-pointer"
           >
             <Menu className="w-4 h-4" />
           </button>
           
           <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
             <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
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