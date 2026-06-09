'use client';

import { useState, ChangeEvent, FormEvent, SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/axios';
import Link from 'next/link';
import axios from 'axios';

export default function RegisterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'PLAYER' | 'OWNER'>('PLAYER');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Separate explicit state objects for clean mapping
  const [playerData, setPlayerData] = useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    location: '',
    age: 22,
    preferredPosition: 'Midfielder',
    skillLevel: 'INTERMEDIATE',
  });

  const [ownerData, setOwnerData] = useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    futsalName: '',
    futsalLocation: '',
  });

  // 2. State tracking handlers
  const handlePlayerChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPlayerData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
  };

  const handleOwnerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOwnerData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Form Submission
  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Package up the exact state payload depending on which tab is active
      const payload = activeTab === 'PLAYER' 
        ? { ...playerData, role: 'PLAYER' } 
        : { ...ownerData, role: 'OWNER' };

      const response = await apiClient.post('/api/auth/register', payload);
      if (response.data.success) {
        router.push('/login');
      }
    }catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message || "Invalid email or password."
          );
        } else {
          setError("Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 py-12">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Join SATHI</h1>
          <p className="text-sm text-gray-500 mt-2">Select your profile category to sign up</p>
        </div>

        {/* Tab Selection Row */}
        <div className="flex rounded-md bg-gray-100 p-1 mb-8">
          <button
            type="button"
            onClick={() => { setActiveTab('PLAYER'); setError(null); }}
            className={`flex-1 py-2 text-sm font-medium rounded-sm transition-all ${
              activeTab === 'PLAYER' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Join as Player
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('OWNER'); setError(null); }}
            className={`flex-1 py-2 text-sm font-medium rounded-sm transition-all ${
              activeTab === 'OWNER' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Register Futsal Arena
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* PLAYER DYNAMIC ENTRY FIELDS */}
          {activeTab === 'PLAYER' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" name="fullName" required value={playerData.fullName} onChange={handlePlayerChange} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="text" name="phoneNumber" required value={playerData.phoneNumber} onChange={handlePlayerChange} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" required value={playerData.email} onChange={handlePlayerChange} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input type="password" name="password" required value={playerData.password} onChange={handlePlayerChange} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input type="number" name="age" required value={playerData.age} onChange={handlePlayerChange} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City / Location</label>
                  <input type="text" name="location" required value={playerData.location} onChange={handlePlayerChange} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Position</label>
                  <select name="preferredPosition" value={playerData.preferredPosition} onChange={handlePlayerChange} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900">
                    <option value="Goalkeeper">Goalkeeper</option>
                    <option value="Defender">Defender</option>
                    <option value="Midfielder">Midfielder</option>
                    <option value="Forward">Forward</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skill Level</label>
                  <select name="skillLevel" value={playerData.skillLevel} onChange={handlePlayerChange} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900">
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                    <option value="PRO">Pro</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* OWNER DYNAMIC ENTRY FIELDS */}
          {activeTab === 'OWNER' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Full Name</label>
                  <input type="text" name="fullName" required value={ownerData.fullName} onChange={handleOwnerChange} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input type="text" name="phoneNumber" required value={ownerData.phoneNumber} onChange={handleOwnerChange} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
                  <input type="email" name="email" required value={ownerData.email} onChange={handleOwnerChange} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input type="password" name="password" required value={ownerData.password} onChange={handleOwnerChange} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
              </div>

              <div className="space-y-4 pt-5 border-t border-gray-200 mt-5">
                <h3 className="font-semibold text-sm text-gray-800">Futsal Arena Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Futsal Name</label>
                  <input type="text" name="futsalName" required value={ownerData.futsalName} onChange={handleOwnerChange} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
                  <input type="text" name="futsalLocation" required value={ownerData.futsalLocation} onChange={handleOwnerChange} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
              </div>
            </>
          )}

          {error && <p className="text-sm font-medium text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Processing...' : 'Create SATHI Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}