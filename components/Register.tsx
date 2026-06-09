"use client";

import { useState, ChangeEvent, SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/axios'; // Keeps your custom configuration instance
import Link from 'next/link';
import axios from 'axios';

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
};

export default function RegisterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'PLAYER' | 'OWNER'>('PLAYER');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Player State Object
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

  // Owner State Object
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
    setPlayerData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
  };

  const handleOwnerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOwnerData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = activeTab === 'PLAYER' 
        ? { ...playerData, role: 'PLAYER' } 
        : { ...ownerData, role: 'OWNER' };

      // Using your configured API client point
      const response = await apiClient.post('/api/register', payload);
      if (response.data.success) {
        router.push('/login');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Registration failed. Please check your details."
        );
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0B0C10] text-[#F0EDE6] min-h-screen flex flex-col items-center justify-center p-6 selection:bg-[#C8F55A] selection:text-black relative overflow-hidden py-16">
      {/* Background glow node matching home environment */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#C8F55A]/5 blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <Link href="/" className="text-[#C8F55A] text-2xl tracking-tight mb-6 z-10" style={DISPLAY}>
        SATHI<span className="text-white/40">.app</span>
      </Link>

      <div className="relative z-10 bg-[#12161A] border border-white/5 rounded-2xl p-8 w-full max-w-xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl text-[#F0EDE6] uppercase tracking-wide mb-2" style={DISPLAY}>
            Join SATHI
          </h1>
          <p className="text-white/50 text-sm">Select your profile category to sign up</p>
        </div>

        {/* Tab Selection Row - Redesigned for Cyberpunk aesthetic */}
        <div className="flex rounded-xl bg-[#0A1F1A] p-1.5 mb-8 border border-white/5">
          <button
            type="button"
            onClick={() => { setActiveTab('PLAYER'); setError(null); }}
            className={`flex-1 py-3 text-xs uppercase tracking-wider font-bold rounded-lg transition-all ${
              activeTab === 'PLAYER' 
                ? 'bg-[#C8F55A] text-black shadow-lg shadow-[#C8F55A]/5' 
                : 'text-white/40 hover:text-white/70'
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
                ? 'bg-[#C8F55A] text-black shadow-lg shadow-[#C8F55A]/5' 
                : 'text-white/40 hover:text-white/70'
            }`}
            style={DISPLAY}
          >
            Register Futsal Arena
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* PLAYER DYNAMIC ENTRY FIELDS */}
          {activeTab === 'PLAYER' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-xs uppercase font-bold tracking-wider mb-2">Full Name</label>
                  <input type="text" name="fullName" required value={playerData.fullName} onChange={handlePlayerChange} placeholder="Sujal Shrestha" className="w-full bg-[#0A1F1A]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C8F55A] focus:ring-1 focus:ring-[#C8F55A] transition-all" />
                </div>
                <div>
                  <label className="block text-white/70 text-xs uppercase font-bold tracking-wider mb-2">Phone Number</label>
                  <input type="text" name="phoneNumber" required value={playerData.phoneNumber} onChange={handlePlayerChange} placeholder="9851******" className="w-full bg-[#0A1F1A]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C8F55A] focus:ring-1 focus:ring-[#C8F55A] transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-xs uppercase font-bold tracking-wider mb-2">Email</label>
                  <input type="email" name="email" required value={playerData.email} onChange={handlePlayerChange} placeholder="name@example.com" className="w-full bg-[#0A1F1A]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C8F55A] focus:ring-1 focus:ring-[#C8F55A] transition-all" />
                </div>
                <div>
                  <label className="block text-white/70 text-xs uppercase font-bold tracking-wider mb-2">Password</label>
                  <input type="password" name="password" required value={playerData.password} onChange={handlePlayerChange} placeholder="********" className="w-full bg-[#0A1F1A]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C8F55A] focus:ring-1 focus:ring-[#C8F55A] transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-xs uppercase font-bold tracking-wider mb-2">Age</label>
                  <input type="number" name="age" required value={playerData.age} onChange={handlePlayerChange} className="w-full bg-[#0A1F1A]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C8F55A] focus:ring-1 focus:ring-[#C8F55A] transition-all" />
                </div>
                <div>
                  <label className="block text-white/70 text-xs uppercase font-bold tracking-wider mb-2">City / Location</label>
                  <input type="text" name="location" required value={playerData.location} onChange={handlePlayerChange} placeholder="Koteshwor, Kathmandu" className="w-full bg-[#0A1F1A]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C8F55A] focus:ring-1 focus:ring-[#C8F55A] transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-xs uppercase font-bold tracking-wider mb-2">Preferred Position</label>
                  <select name="preferredPosition" value={playerData.preferredPosition} onChange={handlePlayerChange} className="w-full bg-[#0A1F1A]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C8F55A] focus:ring-1 focus:ring-[#C8F55A] transition-all appearance-none cursor-pointer">
                    <option value="Goalkeeper" className="bg-[#12161A]">Goalkeeper</option>
                    <option value="Defender" className="bg-[#12161A]">Defender</option>
                    <option value="Midfielder" className="bg-[#12161A]">Midfielder</option>
                    <option value="Forward" className="bg-[#12161A]">Forward</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 text-xs uppercase font-bold tracking-wider mb-2">Skill Level</label>
                  <select name="skillLevel" value={playerData.skillLevel} onChange={handlePlayerChange} className="w-full bg-[#0A1F1A]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C8F55A] focus:ring-1 focus:ring-[#C8F55A] transition-all appearance-none cursor-pointer">
                    <option value="BEGINNER" className="bg-[#12161A]">Beginner</option>
                    <option value="INTERMEDIATE" className="bg-[#12161A]">Intermediate</option>
                    <option value="ADVANCED" className="bg-[#12161A]">Advanced</option>
                    <option value="PRO" className="bg-[#12161A]">Pro</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* OWNER DYNAMIC ENTRY FIELDS */}
          {activeTab === 'OWNER' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-xs uppercase font-bold tracking-wider mb-2">Owner Full Name</label>
                  <input type="text" name="fullName" required value={ownerData.fullName} onChange={handleOwnerChange} placeholder="Enter your full name" className="w-full bg-[#0A1F1A]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C8F55A] focus:ring-1 focus:ring-[#C8F55A] transition-all" />
                </div>
                <div>
                  <label className="block text-white/70 text-xs uppercase font-bold tracking-wider mb-2">Contact Number</label>
                  <input type="text" name="phoneNumber" required value={ownerData.phoneNumber} onChange={handleOwnerChange} placeholder="Contact number" className="w-full bg-[#0A1F1A]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C8F55A] focus:ring-1 focus:ring-[#C8F55A] transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-xs uppercase font-bold tracking-wider mb-2">Business Email</label>
                  <input type="email" name="email" required value={ownerData.email} onChange={handleOwnerChange} placeholder="business@futsal.com" className="w-full bg-[#0A1F1A]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C8F55A] focus:ring-1 focus:ring-[#C8F55A] transition-all" />
                </div>
                <div>
                  <label className="block text-white/70 text-xs uppercase font-bold tracking-wider mb-2">Password</label>
                  <input type="password" name="password" required value={ownerData.password} onChange={handleOwnerChange} placeholder="********" className="w-full bg-[#0A1F1A]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C8F55A] focus:ring-1 focus:ring-[#C8F55A] transition-all" />
                </div>
              </div>

              <div className="space-y-4 pt-5 border-t border-white/5 mt-6">
                <h3 className="text-[#C8F55A] text-sm uppercase font-bold tracking-widest mb-3" style={DISPLAY}>Futsal Arena Details</h3>
                <div>
                  <label className="block text-white/70 text-xs uppercase font-bold tracking-wider mb-2">Futsal Name</label>
                  <input type="text" name="futsalName" required value={ownerData.futsalName} onChange={handleOwnerChange} placeholder="e.g., Lalitpur Sports Arena" className="w-full bg-[#0A1F1A]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C8F55A] focus:ring-1 focus:ring-[#C8F55A] transition-all" />
                </div>
                <div>
                  <label className="block text-white/70 text-xs uppercase font-bold tracking-wider mb-2">Physical Address</label>
                  <input type="text" name="futsalLocation" required value={ownerData.futsalLocation} onChange={handleOwnerChange} placeholder="e.g., Pulchowk, Lalitpur" className="w-full bg-[#0A1F1A]/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C8F55A] focus:ring-1 focus:ring-[#C8F55A] transition-all" />
                </div>
              </div>
            </>
          )}

          {error && <p className="text-sm font-medium text-red-400 text-center bg-red-500/10 border border-red-500/20 py-2 rounded-xl">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C8F55A] text-[#111] py-3.5 rounded-xl text-base font-bold tracking-wider uppercase hover:bg-[#A8D448] active:scale-[0.99] disabled:opacity-40 transition-all cursor-pointer shadow-lg shadow-[#C8F55A]/5 mt-4"
            style={DISPLAY}
          >
            {loading ? 'Processing...' : 'Create SATHI Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-white/40">Already have an account? </span>
          <Link href="/login" className="text-[#C8F55A] font-semibold hover:underline decoration-1 underline-offset-4 transition-colors">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}