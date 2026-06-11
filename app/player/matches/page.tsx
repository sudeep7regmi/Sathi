'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { apiClient } from '@/lib/axios';
import axios from 'axios';

interface Match { id: string; title: string; location: string; date: string; playerLimit: number; matchType: string; skillReq: string; }

export default function MatchHubPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [formData, setFormData] = useState({ title: '', location: '', date: '', startTime: '', endTime: '', playerLimit: '10', matchType: '5v5', skillReq: 'INTERMEDIATE' });
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  

  useEffect(() => { const fetchMatches = async () => {
    try {
      const res = await apiClient.get('/api/player/matches');
      if (res.data.success) setMatches(res.data.matches);
    } catch (err) { console.error(err); }
  };
  fetchMatches(); }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateMatch = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await apiClient.post('/api/player/matches', formData);
      if (res.data.success) {
        setMatches([...matches, res.data.match]);
        setMessage({ text: 'Match created successfully!', type: 'success' });
        setFormData({ title: '', location: '', date: '', startTime: '', endTime: '', playerLimit: '10', matchType: '5v5', skillReq: 'INTERMEDIATE' });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) setMessage({ text: err.response?.data?.message || 'Error creating match', type: 'error' });
    }
  };

  const handleJoinMatch = async (matchId: string) => {
    setMessage(null);
    try {
      const res = await apiClient.post('/api/player/matches/join', { matchId });
      if (res.data.success) {
        setMessage({ text: 'Join request sent! Waiting for organizer approval.', type: 'success' });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMessage({ text: err.response?.data?.message || 'Failed to join match.', type: 'error' });
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Matchmaking Hub</h1>
        {/* Navigation link to the new Requests Page we are about to build */}
        <a href="/player/requests" className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
          Manage Incoming Requests
        </a>
      </div>

      {message && (
        <div className={`p-4 rounded-lg font-medium text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold mb-4">Host a New Match</h2>
        <form onSubmit={handleCreateMatch} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="col-span-2">
            <label className="block text-sm mb-1">Match Title</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm mb-1">Location</label>
            <input required type="text" name="location" value={formData.location} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Date</label>
            <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Start Time</label>
            <input required type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          
          {/* THE MISSING END TIME FIELD IS HERE */}
          <div>
            <label className="block text-sm mb-1">End Time</label>
            <input required type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="block text-sm mb-1">Match Type</label>
            <select name="matchType" value={formData.matchType} onChange={handleChange} className="w-full border rounded p-2">
              <option value="5v5">5v5</option>
              <option value="7v7">7v7</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Skill Req</label>
            <select name="skillReq" value={formData.skillReq} onChange={handleChange} className="w-full border rounded p-2">
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
          <div className="md:col-span-3 flex items-end">
             <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">
               Publish Match
             </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Global Upcoming Matches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map(m => (
            <div key={m.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold text-gray-900">{m.title}</h3>
                <p className="text-sm text-gray-500">📍 {m.location} | ⏱️ {new Date(m.date).toLocaleDateString()}</p>
                <div className="mt-2 flex space-x-2">
                  <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">{m.matchType}</span>
                  <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded">{m.skillReq}</span>
                </div>
              </div>
              <button 
                onClick={() => handleJoinMatch(m.id)}
                className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded text-sm font-bold transition-colors"
              >
                Join Game
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}