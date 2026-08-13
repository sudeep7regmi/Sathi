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
  User,
  CheckCircle2,
  XCircle,
  Send,
  MapPin,
  Clock,
  ChevronRight,
  Trash2
} from 'lucide-react';

export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

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
  status?: RequestStatus;
  statusNote?: string;
  match: { id: string; title: string; date: string; location?: string };
  player: RequestPlayer;
}

interface SentApplication {
  id: string;
  createdAt?: string;
  status: RequestStatus;
  statusNote?: string;
  match: {
    id: string;
    title: string;
    date: string;
    location?: string;
    startTime?: string;
    endTime?: string;
    matchType?: string;
    organizer?: {
      fullName?: string;
    };
  };
}

export default function MatchRequestsPage() {
  const [activeTab, setActiveTab] = useState<'INCOMING' | 'SENT'>('INCOMING');
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [sentApplications, setSentApplications] = useState<SentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllRequests = async () => {
      try {
        const [incomingRes, sentRes] = await Promise.allSettled([
          apiClient.get('/api/player/matches/requests'),
          apiClient.get('/api/player/matches/my-applications'),
        ]);

        if (incomingRes.status === 'fulfilled' && incomingRes.value.data.success) {
          const formattedRequests = incomingRes.value.data.requests.map((req: JoinRequest) => ({
            ...req,
            status: req.status || 'PENDING',
          }));
          setRequests(formattedRequests);
        }

        if (sentRes.status === 'fulfilled' && sentRes.value.data.success) {
          setSentApplications(sentRes.value.data.applications || []);
        }
      } catch (err) {
        console.error('Failed to load match requests data:', err);
      } fontFinally: {
        setLoading(false);
      }
    };

    fetchAllRequests();
  }, []);

  const handleProcessRequest = async (requestId: string, action: 'APPROVE' | 'REJECT') => {
    setProcessingId(requestId);
    try {
      const res = await apiClient.put('/api/player/matches/requests', { requestId, action });
      if (res.data.success) {
        const newStatus: RequestStatus = action === 'APPROVE' ? 'ACCEPTED' : 'REJECTED';
        const defaultNote = action === 'APPROVE' 
          ? 'You accepted this player. They have been added to the match roster.'
          : 'You rejected this player application.';

        setRequests(prev =>
          prev.map(req =>
            req.id === requestId
              ? {
                  ...req,
                  status: newStatus,
                  statusNote: res.data.message || defaultNote,
                }
              : req
          )
        );
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || 'Error processing request');
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancelSentApplication = async (requestId: string) => {
    if (!confirm('Are you sure you want to withdraw this match join request?')) return;
    setProcessingId(requestId);
    try {
      const res = await apiClient.delete(`/api/player/matches/requests/${requestId}`);
      if (res.data.success) {
        setSentApplications(prev => prev.filter(app => app.id !== requestId));
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || 'Failed to cancel request');
      }
    } finally {
      setProcessingId(null);
    }
  };

  const getInitials = (name: string) =>
    name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2)
      : 'PL';

  const pendingIncomingCount = requests.filter(r => r.status === 'PENDING').length;
  const pendingSentCount = sentApplications.filter(a => a.status === 'PENDING').length;

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
      <div className="border-b border-slate-200/80 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
            <span className="w-2 h-7 bg-emerald-500 rounded-full"></span>
            Match Applications & Requests
          </h1>
          <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mt-1">
            Manage incoming player applications and track your outgoing join requests.
          </p>
        </div>

        {/* Tab Navigation Switches */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('INCOMING')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'INCOMING'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Inbox className="w-4 h-4 text-emerald-600" />
            <span>Incoming</span>
            {pendingIncomingCount > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {pendingIncomingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('SENT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'SENT'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4 text-emerald-600" />
            <span>My Applications</span>
            {pendingSentCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {pendingSentCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: INCOMING REQUESTS FROM PLAYERS */}
      {activeTab === 'INCOMING' && (
        requests.length === 0 ? (
          <div 
            className="border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3 shadow-xs"
            style={{ backgroundColor: "var(--ccolor)" }}
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Inbox className="w-6 h-6" />
            </div>
            <p className="text-sm uppercase tracking-wider font-bold text-slate-600">
              No join requests found in your inbox.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {requests.map((req) => {
              const isProcessing = processingId === req.id;
              const isPending = req.status === 'PENDING';
              const isAccepted = req.status === 'ACCEPTED';
              const isRejected = req.status === 'REJECTED';

              return (
                <div 
                  key={req.id} 
                  className={`p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md ${
                    isAccepted
                      ? 'bg-emerald-50/20 border-emerald-200'
                      : isRejected
                      ? 'bg-rose-50/20 border-rose-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div>
                    {/* Match Info & Status Badge */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full uppercase tracking-wider">
                        <Calendar className="w-3 h-3 text-emerald-600" /> Match: {req.match.title}
                      </span>

                      {/* Dynamic Status Badges */}
                      {isPending && (
                        <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Pending
                        </span>
                      )}

                      {isAccepted && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Accepted
                        </span>
                      )}

                      {isRejected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-800 bg-rose-100 border border-rose-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          <XCircle className="w-3 h-3 text-rose-600" /> Rejected
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

                  {/* Conditional Action or Result Card Section */}
                  {isPending ? (
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
                  ) : (
                    <div className="mt-6 pt-4 border-t border-slate-200/60">
                      <div 
                        className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                          isAccepted 
                            ? 'bg-emerald-50 border-emerald-200/80 text-emerald-900' 
                            : 'bg-rose-50 border-rose-200/80 text-rose-900'
                        }`}
                      >
                        {isAccepted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        )}

                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between font-black uppercase tracking-wider mb-0.5">
                            <span>{isAccepted ? 'Request Accepted' : 'Request Declined'}</span>
                            <span className="text-[10px] font-bold opacity-75">
                              {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Just now'}
                            </span>
                          </div>
                          <p className="font-medium opacity-90 leading-relaxed">
                            {req.statusNote || (
                              isAccepted
                                ? 'This player has been accepted into your match line-up.'
                                : 'This player application was declined.'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}

      {/* TAB 2: SENT APPLICATIONS MADE BY THIS PLAYER */}
      {activeTab === 'SENT' && (
        sentApplications.length === 0 ? (
          <div 
            className="border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3 shadow-xs"
            style={{ backgroundColor: "var(--ccolor)" }}
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Send className="w-6 h-6" />
            </div>
            <p className="text-sm uppercase tracking-wider font-bold text-slate-600">
              You haven&apos;t submitted any match join requests yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {sentApplications.map((app) => {
              const isPending = app.status === 'PENDING';
              const isAccepted = app.status === 'ACCEPTED';
              const isRejected = app.status === 'REJECTED';
              const isProcessing = processingId === app.id;

              return (
                <div 
                  key={app.id} 
                  className={`p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md ${
                    isAccepted
                      ? 'bg-emerald-50/20 border-emerald-200'
                      : isRejected
                      ? 'bg-rose-50/20 border-rose-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div>
                    {/* Header Details */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        Hosted by: <span className="text-slate-800">{app.match.organizer?.fullName || 'Organizer'}</span>
                      </span>

                      {/* Status Badges */}
                      {isPending && (
                        <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                          Pending Decision
                        </span>
                      )}

                      {isAccepted && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-0.5 rounded-full uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Accepted
                        </span>
                      )}

                      {isRejected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-800 bg-rose-100 border border-rose-300 px-3 py-0.5 rounded-full uppercase tracking-wider">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" /> Application Declined
                        </span>
                      )}
                    </div>

                    {/* Match Title */}
                    <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight mb-3">
                      {app.match.title}
                    </h3>

                    {/* Match Venue / Time Details */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600 mb-4">
                      <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">
                          {new Date(app.match.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">{app.match.location || 'Futsal Arena'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Banner / Feedback from Match Host */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    {isPending && (
                      <div className="bg-amber-50/60 border border-amber-200/80 p-3.5 rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-amber-900 font-medium">
                          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Waiting for organizer response...</span>
                        </div>

                        <button
                          disabled={isProcessing}
                          onClick={() => handleCancelSentApplication(app.id)}
                          className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 hover:text-rose-800 hover:bg-rose-100/50 p-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="Withdraw Application"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Withdraw
                        </button>
                      </div>
                    )}

                    {isAccepted && (
                      <div className="bg-emerald-50 border border-emerald-200/80 p-3.5 rounded-xl flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-emerald-900">
                          <span className="font-extrabold uppercase tracking-wider block mb-0.5">
                            You are in!
                          </span>
                          <p className="font-medium opacity-90">
                            {app.statusNote || 'The organizer approved your request. You have been added to the match roster.'}
                          </p>
                        </div>
                      </div>
                    )}

                    {isRejected && (
                      <div className="bg-rose-50 border border-rose-200/80 p-3.5 rounded-xl flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-rose-900">
                          <span className="font-extrabold uppercase tracking-wider block mb-0.5">
                            Application Declined
                          </span>
                          <p className="font-medium opacity-90">
                            {app.statusNote || 'The organizer was unable to accept your request for this match.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}