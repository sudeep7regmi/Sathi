"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/axios";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await apiClient.post("/api/logout");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] flex text-[#F0EDE6] selection:bg-[#C8F55A] selection:text-black relative overflow-hidden">
      {/* Background Ambient Glow FX */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-[#C8F55A]/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#C8F55A]/3 blur-[120px] pointer-events-none" />

      {/* Admin Sidebar Component */}
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Primary Display Portal */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Admin Navbar Component - Connected correctly here */}
        <AdminNavbar
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onLogout={handleLogout}
        />

        {/* Route Page Injector */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}