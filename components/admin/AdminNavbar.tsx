"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { adminNavLinks } from "./AdminSidebar";
import {
  Menu,
  ShieldCheck,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Sliders,
} from "lucide-react";

interface AdminNavbarProps {
  onOpenSidebar: () => void;
  onLogout: () => void;
}

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
};

export default function AdminNavbar({
  onOpenSidebar,
  onLogout,
}: AdminNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentNav = adminNavLinks.find((l) => l.path === pathname);

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

  return (
    <header className="bg-[#12161A]/80 backdrop-blur-md sticky top-0 z-30 h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 transition-colors">
      {/* Left Section: Mobile Menu Trigger & Route Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2.5 hover:bg-white/5 rounded-xl border border-white/10 bg-white/5 text-white flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-white/30 text-sm hidden sm:inline-block font-mono">
            /
          </span>
          <h2
            className="text-xl md:text-2xl font-black text-[#F0EDE6] uppercase tracking-wider"
            style={DISPLAY}
          >
            {currentNav?.name || "Admin Command"}
          </h2>
        </div>
      </div>

      {/* Right Section: Superadmin Dropdown Badge */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsProfileMenuOpen((prev) => !prev)}
          className="flex items-center gap-2.5 bg-[#0B0C10] hover:bg-white/5 px-3.5 py-1.5 rounded-xl border border-[#C8F55A]/30 text-[#C8F55A] shadow-sm transition-all cursor-pointer focus:outline-none"
          style={DISPLAY}
        >
          <div className="w-7 h-7 rounded-lg bg-[#C8F55A]/10 border border-[#C8F55A]/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#C8F55A]" />
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-black uppercase tracking-widest leading-none text-white">
              Superadmin
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#C8F55A]/80 mt-0.5">
              Command Access
            </span>
          </div>

          <ChevronDown
            className={`w-3.5 h-3.5 text-white/50 transition-transform duration-200 ${
              isProfileMenuOpen ? "rotate-180 text-[#C8F55A]" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu Container */}
        {isProfileMenuOpen && (
          <div className="absolute right-0 mt-2 w-60 bg-[#12161A] rounded-2xl border border-white/10 shadow-2xl py-2 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Account Info Header */}
            <div className="px-4 py-2.5 border-b border-white/5">
              <p
                className="text-xs font-black text-white uppercase tracking-wider"
                style={DISPLAY}
              >
                System Administrator
              </p>
              <p className="text-[10px] text-[#C8F55A] uppercase tracking-widest font-bold mt-0.5">
                Full Root Authority
              </p>
            </div>

            {/* Quick Action Links */}
            <div className="py-1">
              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  router.push("/admin/users");
                }}
                className="w-full px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-white/70 hover:bg-white/5 hover:text-white flex items-center space-x-2.5 transition-colors cursor-pointer"
                style={DISPLAY}
              >
                <User className="w-3.5 h-3.5 text-[#C8F55A]" />
                <span>User Directory</span>
              </button>

              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  router.push("/admin/grounds");
                }}
                className="w-full px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-white/70 hover:bg-white/5 hover:text-white flex items-center space-x-2.5 transition-colors cursor-pointer"
                style={DISPLAY}
              >
                <Sliders className="w-3.5 h-3.5 text-[#C8F55A]" />
                <span>Manage Arenas</span>
              </button>
            </div>

            {/* Session Termination Button */}
            <div className="border-t border-white/5 pt-1">
            <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/20 border border-white/5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left cursor-pointer active:scale-98"
            style={DISPLAY}
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate Session</span>
          </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}