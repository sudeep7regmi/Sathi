"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import PlayerSearch from "@/components/PlayerSearch";
import { navLinks } from "./PlayerSidebar";
import { Menu, User, ChevronDown, LogOut } from "lucide-react";

interface PlayerNavbarProps {
  userName: string;
  onOpenSidebar: () => void;
  onLogout: () => void;
}

export default function PlayerNavbar({
  userName,
  onOpenSidebar,
  onLogout,
}: PlayerNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close profile menu on pathname change

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

  const currentRouteName =
    navLinks.find((l) => l.path === pathname)?.name || "Dashboard";

  return (
    <header
      /* Fixed to top using dynamic sticky positioning with high z-index and explicit backdrop support */
      className="sticky top-0 z-40 h-20 border-b flex items-center justify-between px-4 md:px-8 shadow-xs gap-4 backdrop-blur-md"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Left Section: Mobile Menu Button & Heading */}
      <div className="flex items-center shrink-0">
        <button
          onClick={onOpenSidebar}
          className="text-slate-700 focus:outline-none md:hidden w-9 h-9 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-100 cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>
        <h2 className="hidden xl:block text-xl font-bold uppercase tracking-wide text-slate-900 ml-2 md:ml-0">
          {currentRouteName}
        </h2>
      </div>

      {/* Center Section: Search */}
      <div className="flex-1 max-w-md mx-2 md:mx-4">
        <PlayerSearch className="w-full" limit={5} />
      </div>

      {/* Right Section: Identity Profile Badge */}
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

        {/* Profile Dropdown */}
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
                  onLogout();
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
  );
}