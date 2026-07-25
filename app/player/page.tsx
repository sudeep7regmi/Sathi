'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';
import axios from 'axios';
import { 
  Trophy, 
  Tv, 
  User, 
  Activity, 
  Calendar, 
  MapPin, 
  Clock, 
  Gamepad2, 
  Loader2 
} from 'lucide-react';

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
        if (axios.isAxiosError(err)) {
          console.error("Dashboard fetch error:", err.response?.data?.message || err.message);
        } else {
          console.error(err);
        }
      } finally { 
        setLoading(false); 
      }
    };
    fetchDashboardMetrics();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]" style={{ backgroundColor: "var(--bcolor)" }}>
      <Loader2 className="animate-spin h-10 w-10 text-emerald-600" />
    </div>
  );

  if (!profile) return null;

  return (
    <div 
      className="space-y-8 pb-12 min-h-screen"
      style={{ backgroundColor: "var(--bcolor)", color: "var(--tcolor)" }}
    >
      {/* Hero Banner */}
      <div 
        className="relative overflow-hidden border rounded-3xl p-8 md:p-10 shadow-sm"
        style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
      >
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-slate-900 mb-3">
            Welcome back, {profile.fullName.split(' ')[0]}!
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
            You are currently ranked as an <span className="text-emerald-600 font-bold uppercase">{profile.skillLevel}</span> player in <span className="text-slate-900 font-semibold">{profile.location}</span>. Ready to hit the pitch?
          </p>
        </div>
        {/* Soft background glow decoration */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-100 rounded-full blur-3xl pointer-events-none opacity-60"></div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Matches Played', value: profile.matchesPlayed, icon: Tv },
          { label: 'Goals Scored', value: profile.goals, icon: Activity },
          { label: 'Preferred Role', value: profile.preferredPosition, icon: User },
          { label: 'Win Record', value: `${profile.wins}W - ${profile.losses}L`, icon: Trophy },
        ].map((stat, i) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={i} 
              className="border p-6 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md group"
              style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
            >
              <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <IconComponent className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black mt-1 text-slate-900 group-hover:text-emerald-600 transition-colors">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Matches Column */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wide text-slate-900 flex items-center">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3"></span>
            Your Upcoming Games
          </h2>

          {matches?.length === 0 ? (
            <div 
              className="rounded-2xl p-12 border text-center flex flex-col items-center justify-center shadow-sm"
              style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
            >
              <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center mb-4 text-slate-400">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 uppercase tracking-wide text-sm">No games scheduled</h3>
              <p className="text-slate-500 text-xs mt-1">Join an available match from the global squad hub to lock in.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches?.map((match) => (
                <div 
                  key={match.id} 
                  className="p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 shadow-sm hover:shadow-md group"
                  style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        {new Date(match.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg font-black leading-none text-slate-900 mt-0.5">
                        {new Date(match.date).getDate()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors text-sm sm:text-base uppercase tracking-tight">
                        {match.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium mt-1">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {match.ground?.name || match.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {match.startTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 uppercase tracking-wider self-start sm:self-auto">
                    {match.matchType}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar Attributes panel */}
        <div 
          className="p-6 rounded-2xl border h-fit shadow-sm"
          style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
        >
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-100 pb-4 mb-5 flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-emerald-600" /> Player Performance Attributes
          </h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs uppercase tracking-wider font-bold mb-2">
                <span className="text-slate-500">Attacking</span>
                <span className="text-emerald-600">85%</span>
              </div>
              <div className="w-full bg-slate-100 border border-slate-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full w-[85%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs uppercase tracking-wider font-bold mb-2">
                <span className="text-slate-500">Defending</span>
                <span className="text-emerald-600">60%</span>
              </div>
              <div className="w-full bg-slate-100 border border-slate-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full w-[60%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs uppercase tracking-wider font-bold mb-2">
                <span className="text-slate-500">Playmaking</span>
                <span className="text-emerald-600">75%</span>
              </div>
              <div className="w-full bg-slate-100 border border-slate-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full w-[75%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}