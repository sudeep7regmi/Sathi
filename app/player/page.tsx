'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';
import axios from 'axios';

interface PlayerProfile {
  fullName: string;
  preferredPosition: string;
  skillLevel: string;
  rating: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  goals: number;
  assists: number;
  location: string;
}

interface Match {
  id: string;
  title: string;
  date: string;
  startTime: string;
  matchType: string;
  location: string;
  ground?: {
    name: string;
    address: string;
  };
}

export default function PlayerDashboardHome() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        const response = await apiClient.get('/api/player/dashboard');
        if (response.data.success) {
          setProfile(response.data.profile);
          setMatches(response.data.matches);
        }
      } catch (err: unknown) {
        console.error(err);
      } finally { setLoading(false); }
    };
    fetchDashboardMetrics();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!profile) return null;

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl p-8 md:p-10 shadow-xl shadow-indigo-900/10">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Welcome back, {profile.fullName.split(' ')[0]}!</h1>
          <p className="text-indigo-200 text-sm md:text-base max-w-xl">
            You are currently ranked as a <span className="text-white font-bold">{profile.skillLevel}</span> player in <span className="text-white font-bold">{profile.location}</span>. Ready to hit the pitch?
          </p>
        </div>
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-24 right-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Matches Played', value: profile.matchesPlayed, icon: '🏟️', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Goals Scored', value: profile.goals, icon: '⚽', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Preferred Role', value: profile.preferredPosition, icon: '🏃', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Win Record', value: `${profile.wins}W - ${profile.losses}L`, icon: '🏆', color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group cursor-default">
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Matches Column */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <span className="w-2 h-6 bg-indigo-600 rounded-full mr-3"></span>
            Your Upcoming Games
          </h2>

          {matches.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-2xl mb-3">📅</div>
              <h3 className="font-bold text-slate-800 text-lg">No games scheduled</h3>
              <p className="text-slate-500 text-sm mt-1">Join a match from the global hub to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <div key={match.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-200 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold uppercase">{new Date(match.date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-lg font-black leading-none">{new Date(match.date).getDate()}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{match.title}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">📍 {match.ground?.name || match.location} • {match.startTime}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg self-start sm:self-auto">
                    {match.matchType}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-fit">
          <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-4 mb-4">Player Attributes</h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-slate-500 font-medium">Attacking</span><span className="font-bold">85%</span></div>
              <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-indigo-500 h-2 rounded-full w-[85%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-slate-500 font-medium">Defending</span><span className="font-bold">60%</span></div>
              <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full w-[60%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-slate-500 font-medium">Playmaking</span><span className="font-bold">75%</span></div>
              <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full w-[75%]"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}