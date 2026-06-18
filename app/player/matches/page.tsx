'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { apiClient } from '@/lib/axios';
import axios from 'axios';
import { 
  PlusCircle, 
  Flame, 
  MapPin, 
  Calendar, 
  Clock, 
  Swords, 
  Activity, 
  Users, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

interface Match { 
  id: string; 
  title: string; 
  location: string; 
  date: string; 
  playerLimit: number; 
  matchType: string; 
  skillReq: string; 
}

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
};

export default function MatchHubPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [formData, setFormData] = useState({ 
    title: '', 
    location: '', 
    date: '', 
    startTime: '', 
    endTime: '', 
    playerLimit: '10', 
    matchType: '5v5', 
    skillReq: 'INTERMEDIATE' 
  });
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => { 
    const fetchMatches = async () => {
      try { 
        const res = await apiClient.get('/api/player/matches'); 
        if (res.data.success) setMatches(res.data.matches); 
      } catch (err) { 
        console.error(err); 
      }
    };
    fetchMatches(); 
  }, []);

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
        setFormData({ 
          title: '', 
          location: '', 
          date: '', 
          startTime: '', 
          endTime: '', 
          playerLimit: '10', 
          matchType: '5v5', 
          skillReq: 'INTERMEDIATE' 
        });
      }
    } catch (err: unknown) { 
      if (axios.isAxiosError(err)) {
        setMessage({ text: err.response?.data?.message || 'Error creating match', type: 'error' });
      } 
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

  const inputClass = "w-full bg-[#0A1F1A]/30 border border-white/5 rounded-xl p-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C8F55A]/40 focus:bg-[#0A1F1A]/60 transition-all appearance-none";

  return (
    <div className="space-y-8 pb-10 bg-[#0B0C10] text-[#F0EDE6] min-h-screen relative overflow-hidden selection:bg-[#C8F55A] selection:text-black">
      {/* Background neon dynamic lighting glow element */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-[#C8F55A]/5 blur-[120px] pointer-events-none" />

      {/* Message Feedback Banner */}
      {message && (
        <div 
          className={`p-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg border flex items-center gap-2.5 relative z-10 ${
            message.type === 'success' 
              ? 'bg-[#C8F55A]/10 text-[#C8F55A] border-[#C8F55A]/20' 
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}
          style={DISPLAY}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Host Match Form Card */}
      <div className="bg-[#12161A] p-6 md:p-8 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
          <PlusCircle className="w-4 h-4 text-[#C8F55A]" />
          <h2 className="text-lg font-bold uppercase tracking-wider text-white" style={DISPLAY}>Host a New Match</h2>
        </div>
        
        <form onSubmit={handleCreateMatch} className="grid grid-cols-1 md:grid-cols-4 gap-5 relative z-10">
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1.5" style={DISPLAY}>Match Title</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Saturday Night Showdown" className={inputClass} />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1.5" style={DISPLAY}>Location</label>
            <input required type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Arena name or address" className={inputClass} />
          </div>
          
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1.5" style={DISPLAY}>Date</label>
            <input required type="date" name="date" value={formData.date} onChange={handleChange} className={inputClass} />
          </div>
          
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1.5" style={DISPLAY}>Start Time</label>
            <input required type="time" name="startTime" value={formData.startTime} onChange={handleChange} className={inputClass} />
          </div>
          
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1.5" style={DISPLAY}>End Time</label>
            <input required type="time" name="endTime" value={formData.endTime} onChange={handleChange} className={inputClass} />
          </div>
          
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1.5" style={DISPLAY}>Format</label>
            <div className="relative">
              <select name="matchType" value={formData.matchType} onChange={handleChange} className={inputClass}>
                <option value="5v5">5v5 Format</option>
                <option value="7v7">7v7 Format</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/40 text-xs">▼</div>
            </div>
          </div>
          
          <div className="md:col-span-4 flex items-end justify-end mt-2">
             <button 
               type="submit" 
               className="bg-[#C8F55A] hover:bg-[#bada52] text-black font-bold py-3.5 px-8 rounded-xl transition-colors text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#C8F55A]/5 w-full sm:w-auto justify-center cursor-pointer"
               style={DISPLAY}
             >
               <Swords className="w-4 h-4" /> Publish Match to Hub
             </button>
          </div>
        </form>
      </div>

      {/* Global Matches Grid */}
      <div className="relative z-10">
        <h2 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3 mb-6" style={DISPLAY}>
          <span className="w-1.5 h-6 bg-[#C8F55A] rounded-full"></span>
          Global Upcoming Matches
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {matches.length === 0 ? (
            <p className="text-white/40 text-sm uppercase tracking-wider font-bold" style={DISPLAY}>No matches are currently active in the directory.</p>
          ) : (
            matches.map(m => (
              <div key={m.id} className="bg-[#12161A] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 hover:border-white/10 transition-colors group">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-wider bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase" style={DISPLAY}>
                      <Users className="w-2.5 h-2.5" /> {m.matchType}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase" style={DISPLAY}>
                      <Activity className="w-2.5 h-2.5" /> {m.skillReq}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-[#C8F55A] transition-colors uppercase tracking-wide" style={DISPLAY}>
                      {m.title}
                    </h3>
                    <div className="space-y-1.5 mt-2">
                      <p className="text-xs text-white/50 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-white/30 shrink-0" /> 
                        <span>{m.location}</span>
                      </p>
                      <p className="text-xs text-white/50 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-white/30 shrink-0" /> 
                        <span>{new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleJoinMatch(m.id)}
                  className="w-full sm:w-auto bg-white/5 border border-white/10 hover:border-[#C8F55A]/30 text-white hover:text-[#C8F55A] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2 shadow-md"
                  style={DISPLAY}
                >
                  <Flame className="w-3.5 h-3.5" /> Join Game
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}