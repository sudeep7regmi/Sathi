'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';
import axios from 'axios';

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

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading live business metrics...</div>;
  if (error || !profile || !metrics) return <div className="text-red-500 font-bold p-6">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{profile.futsalName}</h1>
            <p className="text-gray-500 text-sm">📍 {profile.futsalLocation}</p>
          </div>
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${profile.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {profile.isVerified ? '✓ Verified Business' : 'Pending Verification'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-400 uppercase">Total Revenue</h3>
          <p className="text-3xl font-black text-emerald-600 mt-2">Rs. {metrics.totalRevenue}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-400 uppercase">Completed Bookings</h3>
          <p className="text-3xl font-black text-gray-900 mt-2">{metrics.totalCompletedBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-400 uppercase">Active Grounds</h3>
          <p className="text-3xl font-black text-gray-900 mt-2">{metrics.totalGrounds}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold mb-4 border-b pb-2">Your Registered Grounds</h2>
        {grounds.length === 0 ? (
          <p className="text-sm text-gray-500">No grounds added yet. Go to Manage Grounds to add one.</p>
        ) : (
          <ul className="space-y-3">
            {grounds.map(ground => (
              <li key={ground.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-800">{ground.name}</span>
                <span className="text-sm font-bold text-emerald-600">Rs. {ground.pricePerHour} / hr</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}