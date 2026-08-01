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
  ShieldCheck,
  Zap,
  ChevronRight,
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
    { name: "Global Metrics", path: "/admin", icon: Globe, badge: "Live" },
    { name: "User Directory", path: "/admin/users", icon: Users },
    { name: "Arena Registry", path: "/admin/grounds", icon: Layers },
  ];

  const currentNav = navLinks.find((l) => l.path === pathname);

  return (
    <div className="min-h-screen bg-[#0B0C10] flex text-[#F0EDE6] selection:bg-[#C8F55A] selection:text-black relative overflow-hidden">
      {/* Dynamic Background Radial Glows */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-[#C8F55A]/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#C8F55A]/3 blur-[120px] pointer-events-none" />

      {/* Backdrop Overlay for Mobile Drawer */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0B0C10]/80 z-40 md:hidden backdrop-blur-md transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation - Fixed & Non-Scrollable */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#12161A]/95 backdrop-blur-xl border-r border-white/10 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:relative md:z-auto shadow-2xl md:shadow-none`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
          <div className="flex items-center space-x-3.5">
            <div
              className="w-10 h-10 bg-[#C8F55A] rounded-xl flex items-center justify-center font-black text-black text-xl shadow-lg shadow-[#C8F55A]/20 transition-transform hover:scale-105"
              style={DISPLAY}
            >
              S
            </div>
            <div className="flex flex-col">
              <span
                className="text-2xl font-black text-white tracking-wide leading-none"
                style={DISPLAY}
              >
                SATHI
              </span>
              <span className="text-[10px] uppercase font-bold text-[#C8F55A] tracking-widest mt-1">
                Command Suite
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-white/50 hover:text-white p-2 rounded-xl border border-white/10 bg-white/5 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Item Links */}
        <nav className="px-4 py-6 space-y-2 shrink-0">
          <div
            className="text-[10px] uppercase font-bold text-white/30 tracking-widest px-4 mb-3"
            style={DISPLAY}
          >
            Core Console
          </div>

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
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 text-left cursor-pointer group relative overflow-hidden ${
                  isActive
                    ? "bg-[#C8F55A] text-black shadow-lg shadow-[#C8F55A]/10 font-extrabold"
                    : "text-white/60 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/5"
                }`}
                style={DISPLAY}
              >
                <div className="flex items-center space-x-3.5 relative z-10">
                  <IconComponent
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? "text-black" : "text-white/50 group-hover:text-[#C8F55A]"
                    }`}
                  />
                  <span>{link.name}</span>
                </div>

                {link.badge && !isActive && (
                  <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-[#C8F55A]/10 text-[#C8F55A] border border-[#C8F55A]/20">
                    {link.badge}
                  </span>
                )}

                {isActive && (
                  <ChevronRight className="w-4 h-4 text-black stroke-[3]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Fixed Footer Session Section (Pinned to Bottom) */}
        <div className="p-4 border-t border-white/5 space-y-3 mt-auto shrink-0 bg-[#12161A]">
          <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between border border-white/5">
            <div className="flex items-center space-x-2.5">
              <div className="w-2 h-2 rounded-full bg-[#C8F55A] animate-pulse" />
              <span
                className="text-[11px] font-bold text-white/70 uppercase tracking-wider"
                style={DISPLAY}
              >
                Server Status: Operational
              </span>
            </div>
            <Zap className="w-3.5 h-3.5 text-[#C8F55A]" />
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/20 border border-white/5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left cursor-pointer active:scale-98"
            style={DISPLAY}
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Sticky Top Bar */}
        <header className="bg-[#12161A]/80 backdrop-blur-md sticky top-0 z-30 h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 transition-colors">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2.5 hover:bg-white/5 rounded-xl border border-white/10 bg-white/5 text-white flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-white/30 text-sm hidden sm:inline-block font-mono">/</span>
              <h2
                className="text-xl md:text-2xl font-black text-[#F0EDE6] uppercase tracking-wider"
                style={DISPLAY}
              >
                {currentNav?.name || "Admin Command"}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span
              className="text-[11px] flex items-center gap-2 font-bold bg-[#C8F55A]/10 border border-[#C8F55A]/30 text-[#C8F55A] px-3.5 py-1.5 rounded-xl uppercase tracking-widest shadow-sm"
              style={DISPLAY}
            >
              <ShieldCheck className="w-4 h-4 text-[#C8F55A]" />
              Superadmin
            </span>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}