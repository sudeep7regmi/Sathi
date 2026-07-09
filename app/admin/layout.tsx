"use client";

import { ReactNode, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiClient } from "@/lib/axios";
import {
  Globe,
  Users,
  Layers,
  LogOut,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await apiClient.post("/api/logout");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed");
    }
  };

  const navLinks = [
    { name: "Global Metrics", path: "/admin", icon: Globe },
    { name: "User Directory", path: "/admin/users", icon: Users },
    { name: "Arena Registry", path: "/admin/grounds", icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-[#0B0C10] flex text-[#F0EDE6] selection:bg-[#C8F55A] selection:text-black relative overflow-hidden">
      {/* Background glow node matching ecosystem */}
      <div className="absolute top-1/2 left-0 w-125 h-125 rounded-full bg-[#C8F55A]/5 blur-[120px] pointer-events-none" />

      {/* Responsive Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0B0C10]/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-full md:w-72 bg-[#12161A] border-r border-white/5 flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:relative`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 bg-[#C8F55A] rounded-xl flex items-center justify-center font-black text-black text-xl shadow-lg shadow-[#C8F55A]/10"
              style={DISPLAY}
            >
              S
            </div>
            <span
              className="text-2xl font-black text-white tracking-wide"
              style={DISPLAY}
            >
              Sathi
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-white/50 hover:text-white p-2 rounded-xl border border-white/5 bg-white/5 cursor-pointer flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            const IconComponent = link.icon;

            return (
              <button
                key={link.path}
                onClick={() => {
                  setIsSidebarOpen(false);
                  router.push(link.path);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 text-left cursor-pointer
                  ${
                    isActive
                      ? "bg-[#C8F55A] text-black shadow-lg shadow-[#C8F55A]/5"
                      : "text-white/50 hover:bg-white/5 hover:text-white"
                  }`}
                style={DISPLAY}
              >
                <IconComponent
                  className={`w-5 h-5 ${
                    isActive ? "text-black" : "text-white/50"
                  }`}
                />
                <span>{link.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3.5 text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left cursor-pointer"
            style={DISPLAY}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <header className="bg-[#12161A]/80 backdrop-blur-md sticky top-0 z-30 h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-white/5 rounded-xl mr-4 text-white flex items-center justify-center cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2
              className="hidden sm:block text-2xl font-black text-[#F0EDE6] uppercase tracking-wider"
              style={DISPLAY}
            >
              {navLinks.find((l) => l.path === pathname)?.name || "Admin"}
            </h2>
          </div>

          <span
            className="text-[10px] flex items-center gap-2 font-bold bg-[#C8F55A]/10 border border-[#C8F55A]/20 text-[#C8F55A] px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-sm"
            style={DISPLAY}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Admin
          </span>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
