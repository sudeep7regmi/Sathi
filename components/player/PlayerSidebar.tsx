"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Flame,
  Inbox,
  Layers,
  MessageSquare,
  LogOut,
  X,
  TicketX,
} from "lucide-react";

interface PlayerSidebarProps {
  isSidebarOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const navLinks = [
  { name: "Dashboard Overview", path: "/player", icon: LayoutDashboard },
  { name: "Matchmaking Hub", path: "/player/matches", icon: Flame },
  { name: "Requests", path: "/player/requests", icon: Inbox },
  { name: "Book Futsal Grounds", path: "/player/grounds", icon: Layers },
  { name: "Messenger", path: "/player/chat", icon: MessageSquare },
  { name: "Refunds", path: "/refunds", icon: TicketX },

];

export default function PlayerSidebar({
  isSidebarOpen,
  onClose,
  onLogout,
}: PlayerSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      {/* MOBILE OVERLAY BACKDROP */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* SIDEBAR PANEL */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-full md:w-72 border-r flex flex-col transition-transform duration-300 ease-in-out shadow-sm
        ${
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        } md:sticky top-0 h-screen`}
        style={{
          backgroundColor: "var(--ccolor)",
          borderColor: "var(--border-color)",
        }}
      >
        {/* Sidebar Header Branding */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-md"
              style={{ backgroundColor: "var(--pcolor)" }}
            >
              S
            </div>
            <span className="text-2xl font-black tracking-wide uppercase text-slate-900">
              SATHI
            </span>
          </div>

          {/* Close Button (Mobile Only) */}
          <button
            onClick={onClose}
            className="md:hidden text-slate-500 hover:text-slate-800 bg-slate-100 p-2 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Link Stack */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            const IconComponent = link.icon;
            return (
              <button
                key={link.path}
                onClick={() => router.push(link.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 text-left cursor-pointer group
                  ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                  }`}
              >
                <IconComponent
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? "text-white"
                      : "text-emerald-600 group-hover:scale-110 transition-transform"
                  }`}
                />
                <span>{link.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Container */}
        {/* <div
          className="p-4 border-t"
          style={{ borderColor: "var(--border-color)" }}
        >
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3.5 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out Session</span>
          </button>
        </div> */}
      </aside>
    </>
  );
}