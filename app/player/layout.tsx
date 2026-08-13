"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiClient } from "@/lib/axios";
import { SocketProvider } from "@/components/providers/SocketProvider";
import PlayerSidebar from "@/components/player/PlayerSidebar";
import PlayerNavbar from "@/components/player/PlayerNavbar";
import axios from "axios";

interface PlayerLayoutProps {
  children: ReactNode;
}

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
        if (axios.isAxiosError(err))
          console.warn("Could not populate header profile.");
      }
    };
    fetchHeaderProfile();
  }, []);

  // Close mobile sidebar on route change

  const handleLogout = async () => {
    try {
      await apiClient.post("/api/logout");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <SocketProvider>
      <div
        className="min-h-screen flex antialiased"
        style={{ backgroundColor: "var(--bcolor)", color: "var(--tcolor)" }}
      >
        {/* Navigation Sidebar */}
        <PlayerSidebar
          isSidebarOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
        />

        {/* Display Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden relative ">
          {/* Header Navbar */}
          <PlayerNavbar
            userName={userName}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onLogout={handleLogout}
          />

          {/* Core Page Content Container */}
          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto relative z-10">
            {children}
          </main>
        </div>
      </div>
    </SocketProvider>
  );
}