'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';
import axios from 'axios';
import { 
  Inbox, 
  UserCheck, 
  ShieldAlert, 
  Activity, 
  TrendingUp, 
  Calendar, 
  Loader2, 
  Check, 
  X 
} from 'lucide-react';

interface JoinRequest {
  id: string;
  match: { title: string; date: string; };
  player: { fullName: string; preferredPosition: string; skillLevel: string; rating: number; };
}

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
};

export default function MatchRequestsPage() {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await apiClient.get('/api/player/matches/requests');
        if (res.data.success) {
          setRequests(res.data.requests);
        }
      } catch (err) {
        console.error('Failed to load requests');
      } finally {
        setLoading(false);
      }
    }; 
    fetchRequests(); 
  }, []);

  const handleProcessRequest = async (requestId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await apiClient.put('/api/player/matches/requests', { requestId, action });
      if (res.data.success) {
        setRequests(requests.filter(req => req.id !== requestId));
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || 'Error processing request');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-3 text-white/40 min-h-[500px]">
        <Loader2 className="w-6 h-6 animate-spin text-[#C8F55A]" />
        <span className="text-xs uppercase tracking-widest font-bold" style={DISPLAY}>Checking tactical inbox...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 bg-[#0B0C10] text-[#F0EDE6] min-h-screen relative overflow-hidden selection:bg-[#C8F55A] selection:text-black">
      {/* Structural Headers */}
      <div className="border-b border-white/5 pb-5 relative z-10">
        <h1 className="text-3xl font-black text-white uppercase tracking-wider flex items-center gap-3" style={DISPLAY}>
          <span className="w-1.5 h-6 bg-[#C8F55A] rounded-full"></span>
          Incoming Match Requests
        </h1>
        <p className="text-white/40 text-xs uppercase tracking-widest font-bold mt-1" style={DISPLAY}>
          Review squad assets looking to deploy into your active arenas.
        </p>
      </div>

      {/* Primary Sandbox Views */}
      {requests.length === 0 ? (
        <div className="bg-[#12161A] border border-dashed border-white/10 rounded-2xl p-12 text-center text-white/30 flex flex-col items-center justify-center gap-3 relative z-10">
          <Inbox className="w-8 h-8 text-white/10" />
          <p className="text-sm uppercase tracking-wider font-bold" style={DISPLAY}>
            Your roster inbox is currently empty. No pending requests.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {requests.map((req) => (
            <div key={req.id} className="bg-[#12161A] p-5 rounded-2xl border border-white/5 shadow-xl flex flex-col justify-between hover:border-white/10 transition-colors group">
              <div>
                {/* Meta Indicator Block */}
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#C8F55A] bg-[#C8F55A]/10 border border-[#C8F55A]/20 px-2.5 py-1 rounded-lg uppercase tracking-wider mb-3.5" style={DISPLAY}>
                  <Calendar className="w-3 h-3" /> Arena: {req.match.title}
                </span>
                
                {/* Profile Metric Parameters */}
                <h3 className="font-bold text-xl text-white uppercase tracking-wide group-hover:text-[#C8F55A] transition-colors" style={DISPLAY}>
                  {req.player.fullName}
                </h3>
                
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="bg-[#0B0C10] p-2.5 rounded-xl border border-white/5 text-center">
                    <span className="block text-[8px] font-bold text-white/30 uppercase tracking-widest" style={DISPLAY}>Position</span>
                    <span className="text-xs font-bold text-white flex items-center justify-center gap-1 mt-0.5" style={DISPLAY}>
                      <Activity className="w-3 h-3 text-blue-400" /> {req.player.preferredPosition}
                    </span>
                  </div>
                  
                  <div className="bg-[#0B0C10] p-2.5 rounded-xl border border-white/5 text-center">
                    <span className="block text-[8px] font-bold text-white/30 uppercase tracking-widest" style={DISPLAY}>Tier</span>
                    <span className="text-xs font-bold text-white flex items-center justify-center gap-1 mt-0.5" style={DISPLAY}>
                      <ShieldAlert className="w-3 h-3 text-amber-400" /> {req.player.skillLevel}
                    </span>
                  </div>
                  
                  <div className="bg-[#0B0C10] p-2.5 rounded-xl border border-white/5 text-center">
                    <span className="block text-[8px] font-bold text-white/30 uppercase tracking-widest" style={DISPLAY}>Rating</span>
                    <span className="text-xs font-bold text-white flex items-center justify-center gap-1 mt-0.5" style={DISPLAY}>
                      <TrendingUp className="w-3 h-3 text-emerald-400" /> {req.player.rating}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Dynamic Action Slots */}
              <div className="flex space-x-3 mt-5 pt-4 border-t border-white/5">
                <button 
                  onClick={() => handleProcessRequest(req.id, 'APPROVE')}
                  className="flex-1 bg-[#C8F55A] hover:bg-[#bada52] text-black font-bold py-2.5 rounded-xl transition-colors text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer"
                  style={DISPLAY}
                >
                  <UserCheck className="w-3.5 h-3.5" /> Approve
                </button>
                <button 
                  onClick={() => handleProcessRequest(req.id, 'REJECT')}
                  className="flex-1 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-white hover:text-red-400 font-bold py-2.5 rounded-xl transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer"
                  style={DISPLAY}
                >
                  <X className="w-3.5 h-3.5" /> Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}