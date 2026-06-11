'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';
import axios from 'axios';

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
          console.error('Failed to load requests');
        } finally {
          setLoading(false);
        }
      }; fetchRequests(); }, []);

  const handleProcessRequest = async (requestId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await apiClient.put('/api/player/matches/requests', { requestId, action });
      if (res.data.success) {
        // Remove the processed request from the UI instantly
        setRequests(requests.filter(req => req.id !== requestId));
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) alert(err.response?.data?.message || 'Error processing request');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Checking inbox...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Incoming Match Requests</h1>
      <p className="text-gray-500 text-sm">Review players who want to join matches you are organizing.</p>

      {requests.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center text-gray-500">
          You have no pending join requests.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block mb-2">
                  Match: {req.match.title}
                </span>
                <h3 className="font-bold text-lg text-gray-900">{req.player.fullName}</h3>
                <div className="text-sm text-gray-500 mt-1 flex gap-3">
                  <span>⚽ {req.player.preferredPosition}</span>
                  <span>⭐ {req.player.skillLevel}</span>
                  <span>📈 Rating: {req.player.rating}</span>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-5 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleProcessRequest(req.id, 'APPROVE')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition-colors"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleProcessRequest(req.id, 'REJECT')}
                  className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-2 rounded transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}