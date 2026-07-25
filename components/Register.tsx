"use client";

import { useState, ChangeEvent, SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/axios';
import Link from 'next/link';
import axios from 'axios';

const DISPLAY = { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 };

const INPUT_CLASS = "w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all";
const SELECT_CLASS = "w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all appearance-none cursor-pointer";
const LABEL_CLASS = "block text-gray-600 text-xs uppercase font-bold tracking-wider mb-2";

export default function RegisterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'PLAYER' | 'OWNER'>('PLAYER');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [playerData, setPlayerData] = useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    location: '',
    age: '',
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

  const handlePlayerChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPlayerData(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value) || 0 : value }));
  };

  const handleOwnerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOwnerData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate clicks
  
    setError(null);
    setLoading(true);
  
    try {
      // Format payload and ensure numeric types are cast correctly
      const payload = activeTab === "PLAYER"
        ? {
            ...playerData,
            age: Number(playerData.age) || 0,
            role: "PLAYER",
          }
        : {
            ...ownerData,
            role: "OWNER",
          };
  
      const response = await apiClient.post("/api/register", payload);
  
      if (response.data?.success) {
        router.push("/login");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const resData = err.response?.data;
  
        let errorMessage = "Registration failed. Please check your details.";
  
        if (typeof resData?.message === "string") {
          errorMessage = resData.message;
        } else if (typeof resData?.errors === "string") {
          errorMessage = resData.errors;
        } else if (resData?.errors && typeof resData.errors === "object") {
          // Grab first field error from Zod or validation map
          const firstKey = Object.keys(resData.errors)[0];
          const val = resData.errors[firstKey];
          errorMessage = Array.isArray(val) ? val[0] : String(val);
        }
  
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F0FDF4] min-h-screen flex flex-col items-center justify-center p-6 selection:bg-[#C8F55A] selection:text-black relative overflow-hidden py-16">
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-50 rounded-full blur-3xl opacity-80 pointer-events-none" />

      <Link href="/" className="text-green-700 text-2xl tracking-tight mb-6 z-10" style={DISPLAY}>
        SATHI<span className="text-gray-400">.app</span>
      </Link>

      <div className="relative z-10 bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl text-gray-900 uppercase tracking-wide mb-2" style={DISPLAY}>
            Join SATHI
          </h1>
          <p className="text-gray-500 text-sm">Select your profile category to sign up</p>
        </div>

        {/* Tab Selection */}
        <div className="flex rounded-xl bg-gray-100 p-1.5 mb-8 border border-gray-200">
          <button
            type="button"
            onClick={() => { setActiveTab('PLAYER'); setError(null); }}
            className={`flex-1 py-3 text-xs uppercase tracking-wider font-bold rounded-lg transition-all ${
              activeTab === 'PLAYER'
                ? 'bg-[#C8F55A] text-black shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={DISPLAY}
          >
            Join as Player
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('OWNER'); setError(null); }}
            className={`flex-1 py-3 text-xs uppercase tracking-wider font-bold rounded-lg transition-all ${
              activeTab === 'OWNER'
                ? 'bg-[#C8F55A] text-black shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={DISPLAY}
          >
            Register Futsal Arena
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {activeTab === 'PLAYER' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLASS}>Full Name</label>
                  <input type="text" name="fullName" required value={playerData.fullName} onChange={handlePlayerChange} placeholder="Sudeep Regmi" className={INPUT_CLASS} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Phone Number</label>
                  <input type="text" name="phoneNumber" required value={playerData.phoneNumber} onChange={handlePlayerChange} placeholder="9851******" className={INPUT_CLASS} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLASS}>Email</label>
                  <input type="email" name="email" required value={playerData.email} onChange={handlePlayerChange} placeholder="name@example.com" className={INPUT_CLASS} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Password</label>
                  <input type="password" name="password" required value={playerData.password} onChange={handlePlayerChange} placeholder="********" className={INPUT_CLASS} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLASS}>Age</label>
                  <input type="number" name="age" required value={playerData.age} onChange={handlePlayerChange} className={INPUT_CLASS} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>City / Location</label>
                  <input type="text" name="location" required value={playerData.location} onChange={handlePlayerChange} placeholder="Koteshwor, Kathmandu" className={INPUT_CLASS} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLASS}>Preferred Position</label>
                  <select name="preferredPosition" value={playerData.preferredPosition} onChange={handlePlayerChange} className={SELECT_CLASS}>
                    <option value="Goalkeeper">Goalkeeper</option>
                    <option value="Defender">Defender</option>
                    <option value="Midfielder">Midfielder</option>
                    <option value="Forward">Forward</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLASS}>Skill Level</label>
                  <select name="skillLevel" value={playerData.skillLevel} onChange={handlePlayerChange} className={SELECT_CLASS}>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                    <option value="PRO">Pro</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {activeTab === 'OWNER' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLASS}>Owner Full Name</label>
                  <input type="text" name="fullName" required value={ownerData.fullName} onChange={handleOwnerChange} placeholder="Enter your full name" className={INPUT_CLASS} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Contact Number</label>
                  <input type="text" name="phoneNumber" required value={ownerData.phoneNumber} onChange={handleOwnerChange} placeholder="Contact number" className={INPUT_CLASS} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLASS}>Business Email</label>
                  <input type="email" name="email" required value={ownerData.email} onChange={handleOwnerChange} placeholder="business@futsal.com" className={INPUT_CLASS} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Password</label>
                  <input type="password" name="password" required value={ownerData.password} onChange={handleOwnerChange} placeholder="********" className={INPUT_CLASS} />
                </div>
              </div>

              <div className="space-y-4 pt-5 border-t border-gray-200 mt-6">
                <h3 className="text-green-600 text-sm uppercase font-bold tracking-widest mb-3" style={DISPLAY}>Futsal Arena Details</h3>
                <div>
                  <label className={LABEL_CLASS}>Futsal Name</label>
                  <input type="text" name="futsalName" required value={ownerData.futsalName} onChange={handleOwnerChange} placeholder="e.g., Lalitpur Sports Arena" className={INPUT_CLASS} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Physical Address</label>
                  <input type="text" name="futsalLocation" required value={ownerData.futsalLocation} onChange={handleOwnerChange} placeholder="e.g., Pulchowk, Lalitpur" className={INPUT_CLASS} />
                </div>
              </div>
            </>
          )}

          {error && (
            <p className="text-sm font-medium text-red-600 text-center bg-red-50 border border-red-200 py-2 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C8F55A] text-[#111] py-3.5 rounded-xl text-base font-bold tracking-wider uppercase hover:bg-[#A8D448] active:scale-[0.99] disabled:opacity-40 transition-all cursor-pointer shadow-md shadow-green-200 mt-4"
            style={DISPLAY}
          >
            {loading ? 'Processing...' : 'Create SATHI Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-500">Already have an account? </span>
          <Link href="/login" className="text-green-600 font-semibold hover:underline decoration-1 underline-offset-4 transition-colors">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
