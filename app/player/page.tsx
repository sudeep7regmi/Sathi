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
      }catch (err: unknown) {
        // PROPER TYPESCRIPT ERROR HANDLING
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg max-w-xl mx-auto text-center">
        ⚠️ {error || 'Profile structure mapping data breakdown anomaly generated.'}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* WELCOME BANNER HEADBOARD TITLE CARD */}
      <div className="bg-linear-to-r from-blue-700 to-indigo-800 text-white rounded-xl p-6 md:p-8 shadow-md">
        <h1 className="text-3xl font-black tracking-tight">Welcome to SATHI, {profile.fullName}!</h1>
        <p className="text-blue-100 mt-2 text-sm md:text-base max-w-xl">
          Your profile is indexed live at <strong className="text-white">{profile.location}</strong>. Find a match, organize your squad, and get on the ground.
        </p>
      </div>

      {/* STATISTICS MATRIX OVERVIEW LAYOUT PANELS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Matches Played</span>
          <span className="text-3xl font-black text-gray-900 mt-2">{profile.matchesPlayed}</span>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Goals Scored</span>
          <span className="text-3xl font-black text-green-600 mt-2">⚽ {profile.goals}</span>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Preferred Role</span>
          <span className="text-lg font-bold text-blue-600 mt-2">{profile.preferredPosition}</span>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Skill Level Rating</span>
          <span className="text-base font-black bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md self-start mt-2">
            ⭐ {profile.skillLevel}
          </span>
        </div>
      </div>

      {/* DOUBLE COMPONENT GRID CONTENT SECTION SPLIT ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COMPONENT COLUMN: UPCOMING MATCH CARDS */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <span>📅</span>
            <span>Your Scheduled Upcoming Matches</span>
          </h2>

          {matches.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-dashed border-gray-300 text-center text-gray-500 text-sm">
              You haven&apos;t joined any active game lineups yet. Open Match Maps to enlist.
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match) => (
                <div key={match.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-blue-200 transition-colors">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{match.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-center space-x-2">
                      <span>⏱️ {new Date(match.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>📍 {match.ground?.name || match.location}</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 self-start md:self-auto">
                    <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">{match.matchType}</span>
                    <button className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors">
                      View Hub
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR COLUMN PANEL: COMPACT MATCH RECORD ATTRIBUTES */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6 self-start">
          <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">Performance Log</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Wins Record</span>
              <span className="text-green-600 font-bold text-base">{profile.wins} Matches</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Losses Record</span>
              <span className="text-red-500 font-bold text-base">{profile.losses} Matches</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Goal Assists</span>
              <span className="text-slate-800 font-bold text-base">{profile.assists} Assists</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}