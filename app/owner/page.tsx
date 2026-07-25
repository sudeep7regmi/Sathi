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
      <div 
        className="min-h-[60vh] flex items-center justify-center font-bold tracking-wider uppercase text-sm text-slate-700"
        style={{ backgroundColor: "var(--bcolor)" }}
      >
        <Loader2 className="animate-spin h-8 w-8 text-emerald-600 mr-3" />
        <span>Loading live business metrics...</span>
      </div>
    );
  }

  if (error || !profile || !metrics) {
    return (
      <div 
        className="min-h-[60vh] flex items-center justify-center p-6"
        style={{ backgroundColor: "var(--bcolor)" }}
      >
        <div className="text-sm font-bold text-red-600 text-center bg-red-50 border border-red-200 px-6 py-4 rounded-xl max-w-md uppercase tracking-wider shadow-xs">
          {error || 'Unexpected configuration error.'}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="space-y-6 pb-12 min-h-screen"
      style={{ backgroundColor: "var(--bcolor)", color: "var(--tcolor)" }}
    >
      {/* Profile Header Banner */}
      <div 
        className="p-6 md:p-8 rounded-2xl border shadow-sm"
        style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 uppercase tracking-tight">
              {profile.futsalName}
            </h1>
            <p className="text-slate-500 text-xs font-medium flex items-center mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {profile.futsalLocation}
            </p>
          </div>
          
          <span 
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-xl uppercase tracking-wider border shadow-xs ${
              profile.isVerified 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}
          >
            {profile.isVerified ? (
              <>
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Business
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Pending Verification
              </>
            )}
          </span>
        </div>
      </div>

      {/* Metrics Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue Card */}
        <div 
          className="p-6 rounded-2xl border shadow-sm group hover:shadow-md transition-all duration-200"
          style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
        >
          <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center mb-3">
            <Coins className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Revenue</h3>
          <p className="text-3xl font-black text-emerald-600 mt-2 group-hover:scale-[1.01] transition-transform">
            Rs. {metrics.totalRevenue}
          </p>
        </div>

        {/* Completed Bookings Card */}
        <div 
          className="p-6 rounded-2xl border shadow-sm group hover:shadow-md transition-all duration-200"
          style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
        >
          <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center mb-3">
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Completed Bookings</h3>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {metrics.totalCompletedBookings}
          </p>
        </div>

        {/* Active Grounds Card */}
        <div 
          className="p-6 rounded-2xl border shadow-sm group hover:shadow-md transition-all duration-200"
          style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
        >
          <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center mb-3">
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Grounds</h3>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {metrics.totalGrounds}
          </p>
        </div>
      </div>

      {/* Registered Arenas Data List */}
      <div 
        className="p-6 md:p-8 rounded-2xl border shadow-sm"
        style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
      >
        <h2 className="text-lg font-extrabold uppercase tracking-tight mb-4 border-b border-slate-100 pb-3 text-slate-900">
          Your Registered Grounds
        </h2>
        
        {grounds.length === 0 ? (
          <p className="text-sm text-slate-500 font-medium py-4">
            No grounds added yet. Navigate to &quot;Manage Grounds&quot; to configure your registry.
          </p>
        ) : (
          <ul className="space-y-3">
            {grounds.map(ground => (
              <li 
                key={ground.id} 
                className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-emerald-300 transition-colors group shadow-xs"
              >
                <span className="font-bold text-slate-800 text-sm group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                  {ground.name}
                </span>
                <span className="text-sm font-black text-emerald-600">
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