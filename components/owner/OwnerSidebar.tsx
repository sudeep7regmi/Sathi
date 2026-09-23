'use client';

import { LucideIcon, BarChart3, Layers, CalendarDays, LogOut, X } from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: 'Business Overview', path: '/owner', icon: BarChart3 },
  { label: 'Manage Grounds', path: '/owner/grounds', icon: Layers },
  { label: 'Manage Bookings', path: '/owner/bookings', icon: CalendarDays },
];

interface OwnerSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  pathname: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export function OwnerSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  pathname,
  onNavigate,
  onLogout,
}: OwnerSidebarProps) {
  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`w-[min(88vw,17rem)] h-screen p-4 fixed md:sticky top-0 flex flex-col justify-between transition-transform duration-300 border-r z-50 shadow-2xl md:shadow-sm ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ backgroundColor: 'rgba(255,255,255,.94)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200/80 shrink-0">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => onNavigate('/owner')}
            >
              <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-emerald-600/20 ring-4 ring-emerald-100">
                S
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-wide text-slate-900 uppercase leading-none">
                  SATHI Hub
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">
                  Partner Portal
                </span>
              </div>
            </div>

            <button
              className="md:hidden text-slate-500 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-xl transition-colors cursor-pointer"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-6 overflow-y-auto flex-1 pr-1">
            <p className="app-kicker px-4 mb-3">Venue workspace</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 group relative cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                      : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-900'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      active ? 'text-white' : 'text-emerald-600 group-hover:scale-110'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Action */}
        {/* <div className="pt-4 mt-auto border-t border-slate-200/80 shrink-0">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 text-red-600 hover:bg-red-50/80 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer group"
          >
            <LogOut className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
            <span>Sign Out Session</span>
          </button>
        </div> */}
      </aside>
    </>
  );
}