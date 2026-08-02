'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/axios';
import { 
  User as UserIcon, 
  Trophy, 
  Target, 
  Flame, 
  Activity, 
  Phone, 
  Mail, 
  ArrowLeft, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';

interface PublicPlayerProfile {
  id: string;
  fullName: string;
  phoneNumber?: string;
  preferredPosition: string;
  skillLevel: string;
  goals: number;
  assists: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  user?: {
    email: string;
    isVerified: boolean;
  };
}

export default function PlayerPublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [profile, setProfile] = useState<PublicPlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await apiClient.get(`/api/players/${id}`);
        if (res.data.success) {
          setProfile(res.data.player);
        }
      } catch (err) {
        console.error('Failed to load player profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-bold text-slate-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
        <span>Loading Player Profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-500 font-bold">Player profile not found.</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
        >
          Go Back
        </button>
      </div>
    );
  }

  const winRate = profile.matchesPlayed > 0 
    ? Math.round((profile.wins / profile.matchesPlayed) * 100) 
    : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Main Header Banner */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-800 font-black text-2xl flex items-center justify-center shrink-0">
            {profile.fullName?.[0]?.toUpperCase() || <UserIcon className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase">
                {profile.fullName || 'Player'}
              </h1>
              {profile.user?.isVerified && (
                <ShieldCheck className="w-5 h-5 text-emerald-600" aria-label="Verified Player" />
              )}
            </div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mt-1">
              {profile.preferredPosition || 'Forward'} • {profile.skillLevel || 'BEGINNER'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-200">
            Win Rate: {winRate}%
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Goals</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{profile.goals || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Assists</span>
            <Flame className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{profile.assists || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Matches</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-3xl font-black text-slate-900">{profile.matchesPlayed || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Wins</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">{profile.wins || 0}</p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase text-slate-900 tracking-wider">
          Contact Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Email Address</p>
              <p className="text-xs font-bold text-slate-800">{profile.user?.email || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Phone Number</p>
              <p className="text-xs font-bold text-slate-800">{profile.phoneNumber || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}