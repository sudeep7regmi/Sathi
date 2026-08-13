'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  ShieldAlert, 
  User, 
  ChevronDown, 
  Building2, 
  LogOut 
} from 'lucide-react';

interface OwnerHeaderProps {
  ownerName: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export function OwnerHeader({
  ownerName,
  isSidebarOpen,
  setIsSidebarOpen,
  onNavigate,
  onLogout,
}: OwnerHeaderProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

  return (
    <header
      className="backdrop-blur-md h-20 border-b flex items-center px-6  top-0 justify-between z-30 shadow-2xs transition-all"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', borderColor: 'var(--border-color)' }}
    >
      {/* Sidebar Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="md:hidden w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-50 active:scale-95 transition-all bg-white shadow-2xs cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/60 text-xs font-bold uppercase tracking-wider text-slate-600">
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
          <span>Owner Portal</span>
        </div>
      </div>

      {/* Profile Dropdown */}
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setIsProfileMenuOpen((prev) => !prev)}
          className="flex items-center space-x-3 bg-white pl-4 pr-2.5 py-1.5 rounded-full border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs active:scale-[0.98] transition-all cursor-pointer focus:outline-none ring-2 ring-transparent focus:ring-emerald-500/20"
        >
          <span className="text-xs font-bold uppercase text-slate-800 hidden sm:inline tracking-wider max-w-[140px] truncate">
            {ownerName}
          </span>
          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold flex items-center justify-center text-xs tracking-wider shrink-0 shadow-2xs">
            {getInitials(ownerName) || <User className="w-3.5 h-3.5" />}
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isProfileMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isProfileMenuOpen && (
          <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
            <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
              <p className="text-xs font-bold text-slate-900 truncate">
                {ownerName}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-0.5">
                Venue Owner
              </p>
            </div>

            <div className="py-1 px-1">
              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  onNavigate('/owner/profile');
                }}
                className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 flex items-center space-x-2.5 transition-colors cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Business Profile</span>
              </button>
            </div>

            <div className="border-t border-slate-100 pt-1 px-1">
              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  onLogout();
                }}
                className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 flex items-center space-x-2.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-600 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}