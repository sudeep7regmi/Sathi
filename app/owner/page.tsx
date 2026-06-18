'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';
import axios from 'axios';
import { 
  BadgeCheck, 
  Clock, 
  Coins, 
  Layers, 
  MapPin, 
  ShieldAlert, 
  Loader2 
} from 'lucide-react';

// TypeScript Interfaces for Dynamic Data
interface OwnerProfile {
  futsalName: string;
  futsalLocation: string;
  isVerified: boolean;
}

interface OwnerMetrics {
  totalGrounds: number;
  totalRevenue: number;
  totalCompletedBookings: number;
}

interface Ground {
  id: string;
  name: string;
  pricePerHour: number;
}

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
};

export default function OwnerDashboard() {
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [metrics, setMetrics] = useState<OwnerMetrics | null>(null);
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        const response = await apiClient.get('/api/owner/dashboard');
        if (response.data.success) {
          setProfile(response.data.profile);
          setMetrics(response.data.metrics);
          setGrounds(response.data.grounds);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load business data.');
        } else {
          setError('Unexpected error loading data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicData();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0B0C10] text-[#F0EDE6] min-h-[60vh] flex items-center justify-center font-bold tracking-wider uppercase text-sm" style={DISPLAY}>
        <Loader2 className="animate-spin h-8 w-8 text-[#C8F55A] mr-3" />
        <span>Loading live business metrics...</span>
      </div>
    );
  }

  if (error || !profile || !metrics) {
    return (
      <div className="bg-[#0B0C10] text-[#F0EDE6] min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-sm font-medium text-red-400 text-center bg-red-500/10 border border-red-500/20 px-6 py-3 rounded-xl max-w-md uppercase tracking-wider" style={DISPLAY}>
          {error || 'Unexpected configuration error.'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-[#0B0C10] text-[#F0EDE6] min-h-screen selection:bg-[#C8F55A] selection:text-black relative overflow-hidden">
      {/* Background glow node matching ecosystem */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-[#C8F55A]/5 blur-[120px] pointer-events-none" />

      {/* Profile Header Banner */}
      <div className="bg-[#12161A] p-6 rounded-2xl border border-white/5 shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-wide" style={DISPLAY}>
              {profile.futsalName}
            </h1>
            <p className="text-white/50 text-sm flex items-center mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1 text-white/30" /> {profile.futsalLocation}
            </p>
          </div>
          
          <span 
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-xl uppercase tracking-widest border ${
              profile.isVerified 
                ? 'bg-[#C8F55A]/10 border-[#C8F55A]/20 text-[#C8F55A]' 
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            }`}
            style={DISPLAY}
          >
            {profile.isVerified ? (
              <>
                <BadgeCheck className="w-3.5 h-3.5" /> Verified Business
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5" /> Pending Verification
              </>
            )}
          </span>
        </div>
      </div>

      {/* Metrics Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue Card */}
        <div className="bg-[#12161A] p-6 rounded-2xl border border-white/5 shadow-xl group hover:border-[#C8F55A]/20 transition-all duration-300">
          <div className="w-9 h-9 bg-[#0A1F1A] border border-white/5 rounded-xl flex items-center justify-center mb-3">
            <Coins className="w-4 h-4 text-[#C8F55A]" />
          </div>
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Total Revenue</h3>
          <p className="text-3xl font-black text-[#C8F55A] mt-2 group-hover:scale-[1.01] transition-transform" style={DISPLAY}>
            Rs. {metrics.totalRevenue}
          </p>
        </div>

        {/* Completed Bookings Card */}
        <div className="bg-[#12161A] p-6 rounded-2xl border border-white/5 shadow-xl group hover:border-[#C8F55A]/20 transition-all duration-300">
          <div className="w-9 h-9 bg-[#0A1F1A] border border-white/5 rounded-xl flex items-center justify-center mb-3">
            <Clock className="w-4 h-4 text-[#C8F55A]" />
          </div>
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Completed Bookings</h3>
          <p className="text-3xl font-black text-white mt-2" style={DISPLAY}>
            {metrics.totalCompletedBookings}
          </p>
        </div>

        {/* Active Grounds Card */}
        <div className="bg-[#12161A] p-6 rounded-2xl border border-white/5 shadow-xl group hover:border-[#C8F55A]/20 transition-all duration-300">
          <div className="w-9 h-9 bg-[#0A1F1A] border border-white/5 rounded-xl flex items-center justify-center mb-3">
            <Layers className="w-4 h-4 text-[#C8F55A]" />
          </div>
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Active Grounds</h3>
          <p className="text-3xl font-black text-white mt-2" style={DISPLAY}>
            {metrics.totalGrounds}
          </p>
        </div>
      </div>

      {/* Registered Arenas Data List */}
      <div className="bg-[#12161A] p-6 rounded-2xl border border-white/5 shadow-2xl">
        <h2 className="text-xl font-bold uppercase tracking-wider mb-4 border-b border-white/5 pb-3 text-white" style={DISPLAY}>
          Your Registered Grounds
        </h2>
        
        {grounds.length === 0 ? (
          <p className="text-sm text-white/40 py-4">No grounds added yet. Navigate to &quot;Manage Grounds&quot; to configure your registry.</p>
        ) : (
          <ul className="space-y-3">
            {grounds.map(ground => (
              <li key={ground.id} className="flex justify-between items-center p-4 bg-[#0A1F1A]/40 border border-white/5 rounded-xl hover:border-white/10 transition-colors group">
                <span className="font-semibold text-white/90 text-sm group-hover:text-white transition-colors">
                  {ground.name}
                </span>
                <span className="text-sm font-black text-[#C8F55A]" style={DISPLAY}>
                  Rs. {ground.pricePerHour} / hr
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}