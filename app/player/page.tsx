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

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
};

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
    <div className="flex items-center justify-center min-h-[60vh] bg-[#0B0C10]">
      <Loader2 className="animate-spin h-10 w-10 text-[#C8F55A]" />
    </div>
  );

  if (!profile) return null;

  return (
    <div className="space-y-8 pb-10 bg-[#0B0C10] text-[#F0EDE6] selection:bg-[#C8F55A] selection:text-black min-h-screen relative overflow-hidden">
      {/* Background glow node matching ecosystem */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-[#C8F55A]/5 blur-[120px] pointer-events-none" />

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-[#12161A] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl uppercase tracking-wide text-white mb-3" style={DISPLAY}>
            Welcome back, {profile.fullName.split(' ')[0]}!
          </h1>
          <p className="text-white/60 text-sm md:text-base leading-relaxed">
            You are currently ranked as an <span className="text-[#C8F55A] font-bold uppercase">{profile.skillLevel}</span> player in <span className="text-white font-semibold">{profile.location}</span>. Ready to hit the pitch?
          </p>
        </div>
        {/* Neon Aesthetic Background Node */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#C8F55A]/10 rounded-full blur-3xl pointer-events-none"></div>
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
            <div key={i} className="bg-[#12161A] border border-white/5 p-6 rounded-2xl hover:border-[#C8F55A]/20 shadow-xl transition-all duration-300 group">
              <div className="w-10 h-10 bg-[#0A1F1A] border border-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <IconComponent className="w-5 h-5 text-[#C8F55A]" />
              </div>
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black mt-1 text-white group-hover:text-[#C8F55A] transition-colors" style={DISPLAY}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Matches Column */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl uppercase tracking-wider font-bold text-white flex items-center" style={DISPLAY}>
            <span className="w-1.5 h-5 bg-[#C8F55A] rounded-full mr-3"></span>
            Your Upcoming Games
          </h2>

          {matches.length === 0 ? (
            <div className="bg-[#12161A] rounded-2xl p-12 border border-white/5 text-center flex flex-col items-center justify-center shadow-xl">
              <div className="w-14 h-14 bg-[#0A1F1A] border border-white/5 rounded-xl flex items-center justify-center text-2xl mb-4">
                <Calendar className="w-6 h-6 text-white/30" />
              </div>
              <h3 className="font-bold text-white/80 uppercase tracking-wide text-md" style={DISPLAY}>No games scheduled</h3>
              <p className="text-white/40 text-xs mt-1">Join an available match from the global squad hub to lock in.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <div key={match.id} className="bg-[#12161A] p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#C8F55A]/20 transition-all duration-300 shadow-xl group">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#0A1F1A] border border-white/5 rounded-xl flex flex-col items-center justify-center shrink-0" style={DISPLAY}>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8F55A]">
                        {new Date(match.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg font-black leading-none text-white mt-0.5">
                        {new Date(match.date).getDate()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-[#C8F55A] transition-colors text-sm sm:text-base">{match.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/50 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-white/30" />
                          {match.ground?.name || match.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-white/30" />
                          {match.startTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span 
                    className="text-[10px] font-bold bg-white/5 text-white/70 px-3 py-1.5 rounded-lg border border-white/5 uppercase tracking-wider self-start sm:self-auto"
                    style={DISPLAY}
                  >
                    {match.matchType}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar Attributes panel */}
        <div className="bg-[#12161A] p-6 rounded-2xl border border-white/5 h-fit shadow-2xl">
          <h3 className="font-bold text-white text-md uppercase tracking-wider border-b border-white/5 pb-4 mb-5 flex items-center gap-2" style={DISPLAY}>
            <Gamepad2 className="w-4 h-4 text-[#C8F55A]" /> Player Performance Attributes
          </h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs uppercase tracking-wider mb-2" style={DISPLAY}>
                <span className="text-white/60">Attacking</span>
                <span className="text-[#C8F55A]">85%</span>
              </div>
              <div className="w-full bg-[#0A1F1A] border border-white/5 rounded-full h-1.5">
                <div className="bg-[#C8F55A] shadow-sm h-1.5 rounded-full w-[85%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs uppercase tracking-wider mb-2" style={DISPLAY}>
                <span className="text-white/60">Defending</span>
                <span className="text-[#C8F55A]">60%</span>
              </div>
              <div className="w-full bg-[#0A1F1A] border border-white/5 rounded-full h-1.5">
                <div className="bg-[#C8F55A] shadow-sm h-1.5 rounded-full w-[60%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs uppercase tracking-wider mb-2" style={DISPLAY}>
                <span className="text-white/60">Playmaking</span>
                <span className="text-[#C8F55A]">75%</span>
              </div>
              <div className="w-full bg-[#0A1F1A] border border-white/5 rounded-full h-1.5">
                <div className="bg-[#C8F55A] shadow-sm h-1.5 rounded-full w-[75%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}