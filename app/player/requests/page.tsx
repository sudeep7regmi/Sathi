'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';
import axios from 'axios';
import { 
  Inbox, 
  UserCheck, 
  ShieldCheck, 
  Calendar, 
  Loader2, 
  X, 
  Target, 
  Flame, 
  User 
} from 'lucide-react';

interface RequestPlayer {
  id: string;
  fullName: string;
  preferredPosition: string;
  skillLevel: string;
  goals?: number;
  assists?: number;
  user?: {
    isVerified?: boolean;
  };
}

interface JoinRequest {
  id: string;
  createdAt?: string;
  match: { id: string; title: string; date: string; location?: string };
  player: RequestPlayer;
}

export default function MatchRequestsPage() {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

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
    setProcessingId(requestId);
    try {
      const res = await apiClient.put('/api/player/matches/requests', { requestId, action });
      if (res.data.success) {
        setRequests(prev => prev.filter(req => req.id !== requestId));
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || 'Error processing request');
      }
    } finally {
      setProcessingId(null);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

  if (loading) {
    return (
      <div 
        className="p-12 flex flex-col items-center justify-center gap-3 text-slate-500 min-h-[500px]"
        style={{ backgroundColor: "var(--bcolor)" }}
      >
        <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
        <span className="text-xs uppercase tracking-wider font-bold">Loading Match Requests...</span>
      </div>
    );
  }

  return (
    <div 
      className="space-y-6 pb-12 min-h-screen"
      style={{ backgroundColor: "var(--bcolor)", color: "var(--tcolor)" }}
    >
      {/* Page Header */}
      <div className="border-b border-slate-200/80 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
            <span className="w-2 h-7 bg-emerald-500 rounded-full"></span>
            Incoming Requests
          </h1>
          <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mt-1">
            Review player applications for your upcoming matches.
          </p>
        </div>

        {/* Pending Counter */}
        <div className="self-start sm:self-auto bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{requests.length} Pending {requests.length === 1 ? 'Request' : 'Requests'}</span>
        </div>
      </div>

      {/* Main Request Grid */}
      {requests.length === 0 ? (
        <div 
          className="border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3 shadow-xs"
          style={{ backgroundColor: "var(--ccolor)" }}
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Inbox className="w-6 h-6" />
          </div>
          <p className="text-sm uppercase tracking-wider font-bold text-slate-600">
            No pending join requests in your inbox right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {requests.map((req) => {
            const isProcessing = processingId === req.id;
            return (
              <div 
                key={req.id} 
                className="p-6 rounded-2xl border bg-white shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-200"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div>
                  {/* Match Info Banner */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
                      <Calendar className="w-3 h-3 text-emerald-600" /> Match: {req.match.title}
                    </span>
                    {req.createdAt && (
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Player Overview */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 font-extrabold text-base flex items-center justify-center shrink-0 shadow-xs">
                      {getInitials(req.player.fullName) || <User className="w-5 h-5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-lg text-slate-900 uppercase tracking-tight truncate">
                          {req.player.fullName}
                        </h3>
                        {req.player.user?.isVerified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" aria-label="Verified Player" />
                        )}
                      </div>

                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                        {req.player.preferredPosition || 'Forward'} • <span className="text-emerald-600">{req.player.skillLevel || 'Intermediate'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Player Performance Stats */}
                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Goals Scored</span>
                      <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                        <Target className="w-3.5 h-3.5 text-emerald-600" /> {req.player.goals ?? 0}
                      </span>
                    </div>

                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assists</span>
                      <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" /> {req.player.assists ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                  <button 
                    disabled={isProcessing}
                    onClick={() => handleProcessRequest(req.id, 'APPROVE')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-colors text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" /> Approve
                      </>
                    )}
                  </button>

                  <button 
                    disabled={isProcessing}
                    onClick={() => handleProcessRequest(req.id, 'REJECT')}
                    className="flex-1 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-700 hover:text-red-600 font-bold py-2.5 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <X className="w-4 h-4" /> Dismiss
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}