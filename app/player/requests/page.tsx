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
        console.error('Failed to load requests', err);
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
      <div 
        className="p-12 flex flex-col items-center justify-center gap-3 text-slate-500 min-h-[500px]"
        style={{ backgroundColor: "var(--bcolor)" }}
      >
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        <span className="text-xs uppercase tracking-wider font-bold">Checking tactical inbox...</span>
      </div>
    );
  }

  return (
    <div 
      className="space-y-6 pb-12 min-h-screen"
      style={{ backgroundColor: "var(--bcolor)", color: "var(--tcolor)" }}
    >
      {/* Structural Headers */}
      <div className="border-b border-slate-200 pb-5 relative z-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 uppercase tracking-tight flex items-center gap-3">
          <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
          Incoming Match Requests
        </h1>
        <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mt-1">
          Review squad assets looking to deploy into your active arenas.
        </p>
      </div>

      {/* Primary Sandbox Views */}
      {requests.length === 0 ? (
        <div 
          className="border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3 relative z-10 shadow-xs"
          style={{ backgroundColor: "var(--ccolor)" }}
        >
          <Inbox className="w-8 h-8 text-slate-300" />
          <p className="text-sm uppercase tracking-wider font-bold text-slate-600">
            Your roster inbox is currently empty. No pending requests.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {requests.map((req) => (
            <div 
              key={req.id} 
              className="p-5 rounded-2xl border shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200 group"
              style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
            >
              <div>
                {/* Meta Indicator Block */}
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg uppercase tracking-wider mb-3.5">
                  <Calendar className="w-3 h-3 text-emerald-600" /> Arena: {req.match.title}
                </span>
                
                {/* Profile Metric Parameters */}
                <h3 className="font-extrabold text-lg text-slate-900 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                  {req.player.fullName}
                </h3>
                
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center shadow-xs">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Position</span>
                    <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                      <Activity className="w-3 h-3 text-blue-500" /> {req.player.preferredPosition}
                    </span>
                  </div>
                  
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center shadow-xs">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tier</span>
                    <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                      <ShieldAlert className="w-3 h-3 text-amber-500" /> {req.player.skillLevel}
                    </span>
                  </div>
                  
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center shadow-xs">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Rating</span>
                    <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                      <TrendingUp className="w-3 h-3 text-emerald-600" /> {req.player.rating}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Dynamic Action Slots */}
              <div className="flex space-x-3 mt-5 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => handleProcessRequest(req.id, 'APPROVE')}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-colors text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Approve
                </button>
                <button 
                  onClick={() => handleProcessRequest(req.id, 'REJECT')}
                  className="flex-1 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-700 hover:text-red-600 font-bold py-2.5 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
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