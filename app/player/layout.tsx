"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiClient } from "@/lib/axios";
import { SocketProvider } from "@/components/providers/SocketProvider";
import PlayerSearch from "@/components/PlayerSearch"; // Adjust import path if needed
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
  ChevronDown,
} from "lucide-react";

interface PlayerLayoutProps {
  children: ReactNode;
}

export default function PlayerLayout({ children }: PlayerLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("Player");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHeaderProfile = async () => {
      try {
        const response = await apiClient.get("/api/player/dashboard");
        if (response.data.success && response.data.profile) {
          setUserName(response.data.profile.fullName);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err))
          console.warn("Could not populate header profile.");
      }
    };
    fetchHeaderProfile();
  }, []);

  useEffect(() => {
    const handlePathChange = () => {
      setIsSidebarOpen(false);
      setIsProfileMenuOpen(false);
    };
    handlePathChange();
  }, [pathname]);

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
    { name: "Requests", path: "/player/requests", icon: Inbox },
    { name: "Book Futsal Grounds", path: "/player/grounds", icon: Layers },
    { name: "Messenger", path: "/player/chat", icon: MessageSquare },
  ];

  return (
    <SocketProvider>
      <div
        className="min-h-screen flex antialiased"
        style={{ backgroundColor: "var(--bcolor)", color: "var(--tcolor)" }}
      >
        {/* MOBILE OVERLAY BACKDROP */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-xs transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR NAVIGATION PANEL */}
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
          {/* Sidebar Header branding */}
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
              onClick={() => setIsSidebarOpen(false)}
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
          <div
            className="p-4 border-t"
            style={{ borderColor: "var(--border-color)" }}
          >
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3.5 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out Session</span>
            </button>
          </div>
        </aside>

        {/* MAIN DISPLAY PORTAL CONTAINER */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden relative">
          {/* Top Navbar Header bar */}
          <header
            className="backdrop-blur-md sticky top-0 z-30 h-20 border-b flex items-center justify-between px-4 md:px-8 shadow-xs gap-4"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              borderColor: "var(--border-color)",
            }}
          >
            {/* Left Section: Mobile Menu Button & Current Page Heading */}
            <div className="flex items-center shrink-0">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-slate-700 focus:outline-none md:hidden w-9 h-9 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-100 cursor-pointer"
              >
                <Menu className="w-4 h-4" />
              </button>
              <h2 className="hidden xl:block text-xl font-bold uppercase tracking-wide text-slate-900 ml-2 md:ml-0">
                {navLinks.find((l) => l.path === pathname)?.name || "Dashboard"}
              </h2>
            </div>

            {/* Center Section: Player Search Bar */}
            <div className="flex-1 max-w-md mx-2 md:mx-4">
              <PlayerSearch className="w-full" limit={5} />
            </div>

            {/* Right Section: Identity badge profile widget with Dropdown */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="flex items-center space-x-2.5 bg-white pl-4 pr-2.5 py-1.5 rounded-full border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer focus:outline-none"
              >
                <span className="text-xs font-bold uppercase text-slate-700 hidden sm:inline tracking-wider">
                  {userName}
                </span>
                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-xs tracking-wider shrink-0">
                  {getInitials(userName) || <User className="w-3.5 h-3.5" />}
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                    isProfileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {userName}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      Player Account
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        router.push("/player/profile");
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center space-x-2 transition-colors cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      <span>View Profile</span>
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

          {/* Core Dynamic Screen Content Injection point */}
          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto relative z-10">
            {children}
          </main>
        </div>
      </div>
    </SocketProvider>
  );
}
