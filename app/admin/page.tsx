"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/axios";
import {
  Users,
  Building2,
  Trophy,
  MapPin,
  Activity,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  Zap,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminMetrics {
  totalPlayers: number;
  totalOwners: number;
  totalMatches: number;
  totalGrounds: number;
}

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
};

export default function AdminDashboard() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/api/admin/dashboard");
        if (response.data.success) {
          setMetrics(response.data.metrics);
          setLastUpdated(new Date().toLocaleTimeString());
        }
      } catch (err: unknown) {
        console.error("Admin data fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  // Sleek Skeleton Loading State
  if (loading && !metrics) {
    return (
      <div className="bg-[#0B0C10] text-[#F0EDE6] min-h-screen p-6 md:p-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
          <div className="h-20 bg-white/5 rounded-2xl w-1/3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-[#12161A] border border-white/5 rounded-2xl p-6 h-40 flex flex-col justify-between"
              />
            ))}
          </div>
          <div className="h-64 bg-[#12161A] border border-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Polished Error State
  if (!metrics) {
    return (
      <div className="bg-[#0B0C10] text-[#F0EDE6] min-h-screen flex items-center justify-center p-6">
        <div className="bg-[#12161A] border border-red-500/30 p-8 rounded-3xl max-w-md text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto text-red-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3
              className="text-xl font-bold uppercase tracking-wide text-white"
              style={DISPLAY}
            >
              Telemetry Offline
            </h3>
            <p className="text-sm text-white/50 mt-1">
              Unable to establish connection to SATHI core servers.
            </p>
          </div>
          <button
            onClick={()=>router.push("/admin")}
            className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold uppercase tracking-wider text-xs rounded-xl transition-all border border-red-500/30"
            style={DISPLAY}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Calculate quick proportions for dashboard analytics
  const totalUsers = metrics.totalPlayers + metrics.totalOwners;
  const playerRatio =
    totalUsers > 0 ? Math.round((metrics.totalPlayers / totalUsers) * 100) : 0;

  return (
    <div className="bg-[#0B0C10] text-[#F0EDE6] min-h-screen p-6 md:p-10 relative overflow-hidden selection:bg-[#C8F55A] selection:text-black">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#C8F55A]/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] rounded-full bg-[#C8F55A]/3 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header Title & Controls Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            {/* <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2 w-2 rounded-full bg-[#C8F55A] animate-ping" />
              <span
                className="text-[11px] font-bold uppercase tracking-widest text-[#C8F55A]"
                style={DISPLAY}
              >
                Live Telemetry Feed
              </span>
            </div> */}
            <h1
              className="text-4xl md:text-5xl text-[#F0EDE6] uppercase tracking-wide font-black"
              style={DISPLAY}
            >
              SATHI Command Center
            </h1>
            <p className="text-white/50 text-xs md:text-sm mt-1">
              Real-time ecosystem metrics & match activity monitoring.
            </p>
          </div>

          {/* <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">
                Last Sync
              </span>
              <span className="text-xs font-mono text-[#C8F55A]">
                {lastUpdated || "Just now"}
              </span>
            </div>
            <button
               onClick={()=>router.push("/admin")}
              disabled={loading}
              className="p-3 bg-[#12161A] hover:bg-white/5 border border-white/10 hover:border-[#C8F55A]/40 rounded-xl transition-all group cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw
                className={`w-4 h-4 text-white/70 group-hover:text-[#C8F55A] transition-colors ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </button>
          </div> */}
        </div>

        {/* System Health Banner */}
        <div className="bg-[#12161A]/80 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#C8F55A]/10 text-[#C8F55A] rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p
                className="text-xs uppercase font-bold text-white tracking-wider"
                style={DISPLAY}
              >
                System Status
              </p>
              <p className="text-xs text-white/50">
                All services running with optimal response times.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-white/60">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#C8F55A]" />
              <span>
                Platform Uptime: <strong className="text-white">99.9%</strong>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#C8F55A]" />
              <span>
                Network: <strong className="text-white">Active</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Grid Cards Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Registered Players Card */}
          <div className="bg-[#12161A] border border-white/5 hover:border-[#C8F55A]/40 rounded-2xl p-6 transition-all duration-300 group shadow-xl hover:-translate-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-white/40 text-xs uppercase font-bold tracking-widest transition-colors group-hover:text-white/70">
                Registered Players
              </h3>
              <div className="p-2.5 bg-white/5 group-hover:bg-[#C8F55A]/10 rounded-xl transition-colors">
                <Users className="w-5 h-5 text-white/60 group-hover:text-[#C8F55A] transition-colors" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <p
                className="text-5xl font-black text-white group-hover:text-[#C8F55A] transition-colors"
                style={DISPLAY}
              >
                {metrics.totalPlayers.toLocaleString()}
              </p>
              <span className="flex items-center text-[10px] font-bold text-[#C8F55A] bg-[#C8F55A]/10 px-2 py-1 rounded-lg">
                <TrendingUp className="w-3 h-3 mr-1" /> Active
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-white/40 flex justify-between">
              <span>Player Community</span>
              <span className="text-white/70 font-bold">
                {playerRatio}% of accounts
              </span>
            </div>
          </div>

          {/* Futsal Owners Card */}
          <div className="bg-[#12161A] border border-white/5 hover:border-[#C8F55A]/40 rounded-2xl p-6 transition-all duration-300 group shadow-xl hover:-translate-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-white/40 text-xs uppercase font-bold tracking-widest transition-colors group-hover:text-white/70">
                Futsal Owners
              </h3>
              <div className="p-2.5 bg-white/5 group-hover:bg-[#C8F55A]/10 rounded-xl transition-colors">
                <Building2 className="w-5 h-5 text-white/60 group-hover:text-[#C8F55A] transition-colors" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <p
                className="text-5xl font-black text-white group-hover:text-[#C8F55A] transition-colors"
                style={DISPLAY}
              >
                {metrics.totalOwners.toLocaleString()}
              </p>
              <span className="text-[10px] font-bold text-white/50 bg-white/5 px-2 py-1 rounded-lg">
                Verified
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-white/40 flex justify-between">
              <span>Venue Partners</span>
              <span className="text-white/70 font-bold">
                {100 - playerRatio}% of accounts
              </span>
            </div>
          </div>

          {/* Total Matches Card */}
          <div className="bg-[#12161A] border border-white/5 hover:border-[#C8F55A]/40 rounded-2xl p-6 transition-all duration-300 group shadow-xl hover:-translate-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-white/40 text-xs uppercase font-bold tracking-widest transition-colors group-hover:text-white/70">
                Matches Created
              </h3>
              <div className="p-2.5 bg-white/5 group-hover:bg-[#C8F55A]/10 rounded-xl transition-colors">
                <Trophy className="w-5 h-5 text-white/60 group-hover:text-[#C8F55A] transition-colors" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <p
                className="text-5xl font-black text-white group-hover:text-[#C8F55A] transition-colors"
                style={DISPLAY}
              >
                {metrics.totalMatches.toLocaleString()}
              </p>
              <span className="flex items-center text-[10px] font-bold text-[#C8F55A] bg-[#C8F55A]/10 px-2 py-1 rounded-lg">
                <Activity className="w-3 h-3 mr-1" /> Live
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-white/40 flex justify-between">
              <span>Games Coordinated</span>
              <span className="text-[#C8F55A] font-bold">High Engagement</span>
            </div>
          </div>

          {/* Arenas Listed Card */}
          <div className="bg-[#12161A] border border-white/5 hover:border-[#C8F55A]/40 rounded-2xl p-6 transition-all duration-300 group shadow-xl hover:-translate-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-white/40 text-xs uppercase font-bold tracking-widest transition-colors group-hover:text-white/70">
                Arenas Listed
              </h3>
              <div className="p-2.5 bg-white/5 group-hover:bg-[#C8F55A]/10 rounded-xl transition-colors">
                <MapPin className="w-5 h-5 text-white/60 group-hover:text-[#C8F55A] transition-colors" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <p
                className="text-5xl font-black text-white group-hover:text-[#C8F55A] transition-colors"
                style={DISPLAY}
              >
                {metrics.totalGrounds.toLocaleString()}
              </p>
              <span className="text-[10px] font-bold text-[#C8F55A] bg-[#C8F55A]/10 px-2 py-1 rounded-lg">
                Active
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-white/40 flex justify-between">
              <span>Ground Network</span>
              <span className="text-white/70 font-bold">Nepal Coverage</span>
            </div>
          </div>
        </div>

        {/* Analytics Distribution Panel */}
        <div className="bg-[#12161A] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2
              className="text-xl uppercase text-white font-bold tracking-wide"
              style={DISPLAY}
            >
              Platform User Split
            </h2>
            <span className="text-xs text-white/40 uppercase font-mono tracking-widest">
              Ratio Analysis
            </span>
          </div>

          {/* Visual Distribution Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-white/60">
              <span className="text-[#C8F55A]">Players ({playerRatio}%)</span>
              <span className="text-white/40">
                Owners ({100 - playerRatio}%)
              </span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden flex p-0.5 border border-white/5">
              <div
                className="bg-[#C8F55A] h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(200,245,90,0.4)]"
                style={{ width: `${playerRatio}%` }}
              />
              <div
                className="bg-white/20 h-full rounded-full transition-all duration-500 ml-1"
                style={{ width: `${100 - playerRatio}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
