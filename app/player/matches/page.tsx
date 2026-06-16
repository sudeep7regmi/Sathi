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
        try { const res = await apiClient.get('/api/player/matches'); if (res.data.success) setMatches(res.data.matches); } 
        catch (err) { console.error(err); }
      };
      fetchMatches(); }, []);
  
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
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
      } catch (err: unknown) { if (axios.isAxiosError(err)) setMessage({ text: err.response?.data?.message || 'Error creating match', type: 'error' }); }
    };
  
    const handleJoinMatch = async (matchId: string) => {
      setMessage(null);
      try {
        const res = await apiClient.post('/api/player/matches/join', { matchId });
        if (res.data.success) setMessage({ text: 'Join request sent! Waiting for organizer approval.', type: 'success' });
      } catch (err: unknown) { if (axios.isAxiosError(err)) setMessage({ text: err.response?.data?.message || 'Failed to join match.', type: 'error' }); }
    };
  
    const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";
  
    return (
      <div className="space-y-8 pb-10">
        {message && (
          <div className={`p-4 rounded-2xl font-medium text-sm flex items-center shadow-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
            <span className="mr-2">{message.type === 'success' ? '✅' : '⚠️'}</span> {message.text}
          </div>
        )}
  
        {/* Host Match Form Card */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Host a New Match</h2>
          
          <form onSubmit={handleCreateMatch} className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Match Title</label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Saturday Night Showdown" className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location</label>
              <input required type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Arena name or address" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date</label>
              <input required type="date" name="date" value={formData.date} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start Time</label>
              <input required type="time" name="startTime" value={formData.startTime} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">End Time</label>
              <input required type="time" name="endTime" value={formData.endTime} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Format</label>
              <select name="matchType" value={formData.matchType} onChange={handleChange} className={inputClass}>
                <option value="5v5">5v5</option>
                <option value="7v7">7v7</option>
              </select>
            </div>
            <div className="md:col-span-4 flex items-end justify-end mt-2">
               <button type="submit" className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 transition-all">
                 Publish Match to Hub
               </button>
            </div>
          </form>
        </div>
  
        {/* Global Matches Grid */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <span className="w-2 h-6 bg-emerald-500 rounded-full mr-3"></span>
            Global Upcoming Matches
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {matches.map(m => (
              <div key={m.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md">{m.matchType}</span>
                    <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md">{m.skillReq}</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">{m.title}</h3>
                  <p className="text-sm text-slate-500 flex items-center">
                    <span className="mr-1">📍</span> {m.location}
                  </p>
                  <p className="text-sm text-slate-500 flex items-center mt-1">
                    <span className="mr-1">⏱️</span> {new Date(m.date).toLocaleDateString()}
                  </p>
                </div>
                <button 
                  onClick={() => handleJoinMatch(m.id)}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
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