'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';
import axios from 'axios';

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
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await apiClient.get('/api/admin/dashboard');
        if (response.data.success) setMetrics(response.data.metrics);
      } catch (err: unknown) {
        console.error('Admin data fetch failed');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0B0C10] text-[#F0EDE6] min-h-screen flex items-center justify-center font-bold tracking-wider uppercase text-sm" style={DISPLAY}>
        <span className="text-[#C8F55A] animate-pulse">Loading System Data...</span>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-[#0B0C10] text-[#F0EDE6] min-h-screen flex items-center justify-center p-6">
        <div className="text-sm font-medium text-red-400 text-center bg-red-500/10 border border-red-500/20 px-6 py-3 rounded-xl max-w-md uppercase tracking-wider" style={DISPLAY}>
          Failed to load metrics.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0C10] text-[#F0EDE6] min-h-screen p-6 relative overflow-hidden selection:bg-[#C8F55A] selection:text-black">
      {/* Ambient background accent glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#C8F55A]/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header Title Section */}
        <div>
          <h1 className="text-4xl text-[#F0EDE6] uppercase tracking-wide mb-2" style={DISPLAY}>
            SATHI Global Command Center
          </h1>
          <p className="text-white/50 text-sm">Real-time system telemetry and platform metrics monitor.</p>
        </div>

        {/* Dashboard Metrics Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {/* Registered Players Card */}
          <div className="bg-[#12161A] border border-white/5 hover:border-[#C8F55A]/20 rounded-2xl p-6 transition-all duration-300 group shadow-xl">
            <h3 className="text-white/40 text-xs uppercase font-bold tracking-widest transition-colors group-hover:text-white/60">
              Registered Players
            </h3>
            <p className="text-5xl font-black text-white mt-3 group-hover:text-[#C8F55A] transition-colors" style={DISPLAY}>
              {metrics.totalPlayers}
            </p>
          </div>

          {/* Futsal Owners Card */}
          <div className="bg-[#12161A] border border-white/5 hover:border-[#C8F55A]/20 rounded-2xl p-6 transition-all duration-300 group shadow-xl">
            <h3 className="text-white/40 text-xs uppercase font-bold tracking-widest transition-colors group-hover:text-white/60">
              Futsal Owners
            </h3>
            <p className="text-5xl font-black text-white mt-3 group-hover:text-[#C8F55A] transition-colors" style={DISPLAY}>
              {metrics.totalOwners}
            </p>
          </div>

          {/* Total Matches Card */}
          <div className="bg-[#12161A] border border-white/5 hover:border-[#C8F55A]/20 rounded-2xl p-6 transition-all duration-300 group shadow-xl">
            <h3 className="text-white/40 text-xs uppercase font-bold tracking-widest transition-colors group-hover:text-white/60">
              Total Matches Created
            </h3>
            <p className="text-5xl font-black text-white mt-3 group-hover:text-[#C8F55A] transition-colors" style={DISPLAY}>
              {metrics.totalMatches}
            </p>
          </div>

          {/* Arenas Listed Card */}
          <div className="bg-[#12161A] border border-white/5 hover:border-[#C8F55A]/20 rounded-2xl p-6 transition-all duration-300 group shadow-xl">
            <h3 className="text-white/40 text-xs uppercase font-bold tracking-widest transition-colors group-hover:text-white/60">
              Arenas Listed
            </h3>
            <p className="text-5xl font-black text-white mt-3 group-hover:text-[#C8F55A] transition-colors" style={DISPLAY}>
              {metrics.totalGrounds}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}