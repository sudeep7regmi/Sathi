
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

  if (loading) return <div className="p-10 font-bold">Loading System Data...</div>;
  if (!metrics) return <div className="p-10 text-red-500">Failed to load metrics.</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-800">SATHI Global Command Center</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border-t-4 border-blue-500">
          <h3 className="text-sm font-bold text-gray-500">Registered Players</h3>
          <p className="text-4xl font-black text-gray-900 mt-2">{metrics.totalPlayers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-t-4 border-emerald-500">
          <h3 className="text-sm font-bold text-gray-500">Futsal Owners</h3>
          <p className="text-4xl font-black text-gray-900 mt-2">{metrics.totalOwners}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-t-4 border-amber-500">
          <h3 className="text-sm font-bold text-gray-500">Total Matches Created</h3>
          <p className="text-4xl font-black text-gray-900 mt-2">{metrics.totalMatches}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-t-4 border-purple-500">
          <h3 className="text-sm font-bold text-gray-500">Arenas Listed</h3>
          <p className="text-4xl font-black text-gray-900 mt-2">{metrics.totalGrounds}</p>
        </div>
      </div>
    </div>
  );
}