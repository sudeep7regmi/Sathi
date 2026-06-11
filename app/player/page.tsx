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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        const response = await apiClient.get('/api/player/dashboard');
        if (response.data.success) {
          setProfile(response.data.profile);
          setMatches(response.data.matches);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to pull profile metrics.');
        } else {
          setError('Failed to pull profile metrics. Local network error.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute w-12 h-12 rounded-full border-4 border-blue-100 animate-pulse"></div>
          <div className="absolute w-12 h-12 rounded-full border-4 border-t-blue-600 animate-spin"></div>
        </div>
        <p className="text-sm font-medium text-gray-500 animate-pulse">Loading dashboard metrics...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6 bg-red-50/50 backdrop-blur-xs border border-red-200/60 text-red-700 rounded-2xl max-w-xl mx-auto text-center my-12 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h4 className="text-base font-bold text-gray-900 mb-1">Data Pipeline Interrupted</h4>
        <p className="text-sm text-gray-600">{error || 'Profile structure mapping data breakdown anomaly generated.'}</p>
      </div>
    );
  }

  // Calculate dynamic win percentage metrics for the sidebar UI
  const winRate = profile.matchesPlayed > 0 ? Math.round((profile.wins / profile.matchesPlayed) * 100) : 0;

  return (
    <div className="space-y-8 p-1 sm:p-2 max-w-7xl mx-auto">
      
      {/* WELCOME BANNER HERO CARD */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 text-white rounded-2xl p-6 md:p-10 shadow-lg shadow-indigo-950/10 border border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4 tracking-wide uppercase">
            Live Feed Active
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Welcome to SATHI, <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">{profile.fullName}</span>!
          </h1>
          <p className="text-slate-300 mt-3 text-sm md:text-base leading-relaxed">
            Your profile is indexed live at <span className="text-white font-semibold underline decoration-blue-500/50 underline-offset-4">{profile.location}</span>. Find a match, manage your lineup, and secure the pitch.
          </p>
        </div>
      </div>

      {/* STATISTICS MATRIX GRID OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Matches */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Matches Played</span>
            <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4 tracking-tight">{profile.matchesPlayed}</p>
        </div>

        {/* Goals Scored */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 hover:border-emerald-100 hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Goals Scored</span>
            <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
              <span className="text-xs">⚽</span>
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-600 mt-4 tracking-tight">{profile.goals}</p>
        </div>

        {/* Preferred Position */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preferred Role</span>
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
          </div>
          <p className="text-xl font-extrabold text-blue-600 mt-5 truncate tracking-tight">{profile.preferredPosition}</p>
        </div>

        {/* Skill Level */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 hover:border-amber-100 hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skill Level</span>
            <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center font-bold bg-amber-50 text-amber-800 text-sm px-3 py-1 rounded-lg border border-amber-200/50">
              {profile.skillLevel}
            </span>
          </div>
        </div>
      </div>

      {/* TWO COMPONENT SPLIT ROW LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT MAIN COLUMN: UPCOMING MATCHES */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Your Upcoming Fixtures</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2.5 py-0.5 rounded-full">
              {matches.length} Total
            </span>
          </div>

          {matches.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 border border-dashed border-slate-200 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                🧭
              </div>
              <p className="text-slate-500 text-sm font-medium">You haven&apos;t joined any active game lineups yet.</p>
              <button className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors">
                Explore Match Maps
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {matches.map((match) => (
                <div 
                  key={match.id} 
                  className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-950 transition-colors">
                      {match.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {new Date(match.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-slate-300 hidden sm:inline">•</span>
                      <span className="flex items-center gap-1 max-w-[240px] truncate">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {match.ground?.name || match.location}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t border-slate-50 sm:border-0">
                    <span className="text-xs font-semibold bg-slate-50 text-slate-600 px-3 py-1 rounded-lg border border-slate-200/50">
                      {match.matchType}
                    </span>
                    <button className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 px-4 py-2 rounded-xl transition-all shadow-2xs">
                      View Hub
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR COLUMN PANEL: PERFORMANCE LOG */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 space-y-6 self-start">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Performance Log</h3>
            <p className="text-xs text-slate-400 mt-0.5">Live tracking win/loss efficiency metrics</p>
          </div>

          {/* Dynamic Win Rate Indicator */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>WIN RATIO</span>
              <span className="text-indigo-600">{winRate}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${winRate}%` }}
              ></div>
            </div>
          </div>

          {/* Stats breakdown stack */}
          <div className="space-y-3.5 pt-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Wins Record
              </span>
              <span className="text-emerald-600 font-bold bg-emerald-50/70 px-2.5 py-0.5 rounded-lg border border-emerald-100/40 text-xs">
                {profile.wins} Matches
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Losses Record
              </span>
              <span className="text-rose-600 font-bold bg-rose-50/70 px-2.5 py-0.5 rounded-lg border border-rose-100/40 text-xs">
                {profile.losses} Matches
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span> Goal Assists
              </span>
              <span className="text-slate-800 font-bold bg-slate-50 px-2.5 py-0.5 rounded-lg border border-slate-200/50 text-xs">
                {profile.assists} Assists
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}