'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiClient } from '@/lib/axios';
import axios from 'axios';
import { 
  BarChart3, 
  Layers, 
  CalendarDays, 
  LogOut, 
  Menu, 
  X,
  ShieldAlert,
  User,
  ChevronDown,
  Building2
} from 'lucide-react';

export default function OwnerLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [ownerName, setOwnerName] = useState("Owner");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchHeaderProfile = async () => {
      try {
        const response = await apiClient.get("/api/owner/dashboard");
        if (isMounted && response.data.success && response.data.profile) {
          setOwnerName(response.data.profile.fullName || response.data.profile.businessName || "Owner");
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) console.warn("Could not populate header profile.");
      }
    };
    fetchHeaderProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (path: string) => {
    setIsSidebarOpen(false);
    setIsProfileMenuOpen(false);
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

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

  const isActive = (path: string) => pathname === path;

  return (
    <div 
      className="min-h-screen flex antialiased"
      style={{ backgroundColor: "var(--bcolor)", color: "var(--tcolor)" }}
    >
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside 
        className={`w-64 h-screen p-5 fixed md:sticky top-0 flex flex-col justify-between transition-transform duration-300 border-r z-50 shadow-sm ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
      >
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between pb-6 border-b border-slate-200 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center font-black text-white text-xl shadow-xs">
                S
              </div>
              <span className="text-lg font-black tracking-wide text-slate-900 uppercase">
                SATHI Hub
              </span>
            </div>
            
            <button 
              className="md:hidden text-slate-500 hover:text-slate-800 bg-slate-100 p-1.5 rounded-lg cursor-pointer" 
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1.5 pt-6 overflow-y-auto flex-1 pr-1">
            <button 
              onClick={() => handleNavigate('/owner')} 
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
              onClick={() => handleNavigate('/owner/grounds')} 
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
              onClick={() => handleNavigate('/owner/bookings')} 
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

        <div className="pt-4 mt-auto border-t border-slate-200 shrink-0">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header 
          className="backdrop-blur-md h-20 border-b flex items-center px-6 sticky top-0 justify-between z-30 shadow-xs"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.85)", borderColor: "var(--border-color)" }}
        >
          <div className="flex items-center gap-3">
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
          </div>
           
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="flex items-center space-x-2.5 bg-white pl-4 pr-2.5 py-1.5 rounded-full border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer focus:outline-none"
            >
              <span className="text-xs font-bold uppercase text-slate-700 hidden sm:inline tracking-wider">
                {ownerName}
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-xs tracking-wider shrink-0">
                {getInitials(ownerName) || <User className="w-3.5 h-3.5" />}
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                  isProfileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {ownerName}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Venue Owner
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => handleNavigate("/owner/profile")}
                    className="w-full px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Business Profile</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}