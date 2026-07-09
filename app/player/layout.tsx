"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiClient } from "@/lib/axios";
import { SocketProvider } from "@/components/providers/SocketProvider";
import axios from "axios";
import {
  LayoutDashboard,
  Flame,
  Inbox,
  Layers,
  MessageSquare,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";

interface PlayerLayoutProps {
  children: ReactNode;
}

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
};

export default function PlayerLayout({ children }: PlayerLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("Player");

  useEffect(() => {
    const fetchHeaderProfile = async () => {
      try {
        const response = await apiClient.get("/api/player/dashboard");
        if (response.data.success && response.data.profile) {
          setUserName(response.data.profile.fullName);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) console.warn("Could not populate header.");
      }
    };
    fetchHeaderProfile();
  }, []);

  useEffect(() => {
    const handlePathChange = () => setIsSidebarOpen(false);
    handlePathChange();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await apiClient.post("/api/logout");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

  const navLinks = [
    { name: "Dashboard Overview", path: "/player", icon: LayoutDashboard },
    { name: "Matchmaking Hub", path: "/player/matches", icon: Flame },
    { name: "Incoming Requests", path: "/player/requests", icon: Inbox },
    { name: "Book Futsal Grounds", path: "/player/grounds", icon: Layers },
    { name: "Team Messenger", path: "/player/chat", icon: MessageSquare },
  ];

  return (
    <SocketProvider>
      <div className="min-h-screen bg-[#0B0C10] flex text-[#F0EDE6] antialiased selection:bg-[#C8F55A] selection:text-black">
        {/* MOBILE OVERLAY BACKDROP */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR NAVIGATION PANEL */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-full md:w-72 bg-[#12161A] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out 
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          } md:sticky top-0 h-screen`}
        >
          {/* Sidebar Header branding */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 bg-[#C8F55A] rounded-xl flex items-center justify-center font-black text-black text-xl shadow-lg shadow-[#C8F55A]/10"
                style={DISPLAY}
              >
                S
              </div>
              <span
                className="text-2xl font-black text-white tracking-wide uppercase"
                style={DISPLAY}
              >
                SATHI
              </span>
            </div>
            {/* Close Button (Mobile Only) */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-white/50 hover:text-white bg-white/5 border border-white/5 p-2 rounded-xl cursor-pointer"
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
                        ? "bg-[#C8F55A] text-black shadow-lg shadow-[#C8F55A]/5"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  style={DISPLAY}
                >
                  <IconComponent
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? "text-black"
                        : "text-[#C8F55A] group-hover:scale-110 transition-transform"
                    }`}
                  />
                  <span>{link.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer Container */}
          <div className="p-4 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3.5 text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left cursor-pointer"
              style={DISPLAY}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out Session</span>
            </button>
          </div>
        </aside>

        {/* MAIN DISPLAY PORTAL CONTAINER */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden relative">
          {/* Top Navbar Header bar */}
          <header className="bg-[#12161A]/80 backdrop-blur-md sticky top-0 z-30 h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-white focus:outline-none md:hidden w-9 h-9 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/5 cursor-pointer"
              >
                <Menu className="w-4 h-4" />
              </button>
              <h2
                className="hidden sm:block text-2xl font-black text-[#F0EDE6] uppercase tracking-wider"
                style={DISPLAY}
              >
                {navLinks.find((l) => l.path === pathname)?.name || "Dashboard"}
              </h2>
            </div>

            {/* Identity badge profile widget */}
            <div className="flex items-center space-x-3 bg-[#0B0C10] pl-4 pr-1.5 py-1.5 rounded-full border border-white/5">
              <span
                className="text-xs font-bold uppercase text-white/80 hidden sm:inline tracking-wider"
                style={DISPLAY}
              >
                {userName}
              </span>
              <div
                className="w-8 h-8 rounded-full bg-[#A1DB13]/10 border border-[#C8F55A]/30 text-[#C8F55A] font-bold flex items-center justify-center text-xs tracking-wider"
                style={DISPLAY}
              >
                {getInitials(userName) || <User className="w-3 h-3" />}
              </div>
            </div>
          </header>

          {/* Core Dynamic Screen Content Injection point */}
          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto relative z-10">
            {children}
          </main>
        </div>
      </div>
    </SocketProvider>
  );
}
