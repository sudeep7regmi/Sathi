'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { apiClient } from '@/lib/axios';
import axios from 'axios';
import { 
  Layers, 
  MapPin, 
  Coins, 
  Sparkles, 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Loader2,
  ShieldCheck
} from 'lucide-react';

interface Ground { 
  id: string; 
  name: string; 
  address: string; 
  pricePerHour: number; 
  amenities: string; 
  description: string; 
  owner: { futsalName: string, isVerified: boolean }; 
}

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
};

export default function BookGroundsPage() {
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroundId, setSelectedGroundId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ date: '', startTime: '', endTime: '' });
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchGrounds = async () => {
      try {
        const res = await apiClient.get('/api/player/grounds');
        if (res.data.success) setGrounds(res.data.grounds);
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchGrounds();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleBookingSubmit = async (e: FormEvent, groundId: string) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await apiClient.post('/api/player/grounds', { groundId, ...formData });
      if (res.data.success) {
        setMessage({ text: 'Reservation sent to owner!', type: 'success' });
        setSelectedGroundId(null);
        setFormData({ date: '', startTime: '', endTime: '' });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) setMessage({ text: err.response?.data?.message || 'Booking failed', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0B0C10] text-[#F0EDE6] min-h-[60vh] flex items-center justify-center font-bold tracking-wider uppercase text-sm" style={DISPLAY}>
        <Loader2 className="animate-spin h-8 w-8 text-[#C8F55A] mr-3" />
        <span>Syncing Available Arenas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 bg-[#0B0C10] text-[#F0EDE6] min-h-screen relative overflow-hidden selection:bg-[#C8F55A] selection:text-black">
      {/* Background graphic bloom node asset */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-[#C8F55A]/5 blur-[120px] pointer-events-none" />

      {/* Premium Hero Banner Head */}
      <div className="bg-[#12161A] border border-white/5 rounded-2xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8F55A]/5 rounded-full blur-2xl pointer-events-none" />
        <h1 className="text-3xl font-black uppercase tracking-wider flex items-center gap-3" style={DISPLAY}>
          <span className="w-1.5 h-6 bg-[#C8F55A] rounded-full"></span>
          Book Futsal Arenas
        </h1>
        <p className="text-white/50 text-sm mt-1 max-w-lg">
          Browse verified grounds, inspect facilities, and deploy match reservations directly onto the network ledger.
        </p>
      </div>

      {/* Telemetry Status Alerts */}
      {message && (
        <div 
          className={`p-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg border flex items-center gap-2.5 relative z-10 ${
            message.type === 'success' 
              ? 'bg-[#C8F55A]/10 text-[#C8F55A] border-[#C8F55A]/20' 
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}
          style={DISPLAY}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Grounds Matrix Registry Display Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {grounds.length === 0 ? (
          <p className="text-white/40 text-sm uppercase tracking-wider font-bold" style={DISPLAY}>No grounds are currently listed by hub owners.</p>
        ) : (
          grounds.map(ground => (
            <div key={ground.id} className="bg-[#12161A] rounded-2xl border border-white/5 shadow-xl flex flex-col justify-between hover:border-white/10 transition-colors group">
              <div className="p-6 md:p-8">
                
                {/* Header Info Section */}
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-[#C8F55A] transition-colors uppercase tracking-wide" style={DISPLAY}>
                      {ground.name}
                    </h3>
                    <p className="text-xs text-white/50 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-white/30 shrink-0" />
                      <span>{ground.address}</span>
                      <span className="text-white/20">•</span>
                      <span className="text-white/40 font-semibold flex items-center gap-1">
                        {ground.owner.futsalName}
                        {ground.owner.isVerified && <ShieldCheck className="w-3 h-3 text-[#C8F55A]" />}
                      </span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-xl font-black text-[#C8F55A] flex items-center justify-end gap-1" style={DISPLAY}>
                      <Coins className="w-4 h-4 opacity-70" /> Rs. {ground.pricePerHour}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/30" style={DISPLAY}>per hour</span>
                  </div>
                </div>
                
                <p className="text-sm text-white/60 mb-5 leading-relaxed line-clamp-2">{ground.description}</p>
                
                {/* Amenities pills wrap */}
                <div className="mb-6 flex flex-wrap gap-1.5">
                  {ground.amenities.split(',').map((amenity, i) => (
                    <span key={i} className="text-[10px] font-bold bg-[#0B0C10] text-white/60 px-2.5 py-1 rounded-lg border border-white/5 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-[#C8F55A]/60" />
                      {amenity.trim()}
                    </span>
                  ))}
                </div>

                {/* Conditional Booking Context Submenu Dropdown Container */}
                {selectedGroundId === ground.id ? (
                  <form onSubmit={(e) => handleBookingSubmit(e, ground.id)} className="bg-[#0B0C10] p-4 rounded-xl border border-white/5 space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1" style={DISPLAY}>Date</label>
                        <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-[#12161A] border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C8F55A]/40 transition-all" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1" style={DISPLAY}>Start Time</label>
                        <input required type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full bg-[#12161A] border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C8F55A]/40 transition-all" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1" style={DISPLAY}>End Time</label>
                        <input required type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full bg-[#12161A] border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C8F55A]/40 transition-all" />
                      </div>
                    </div>
                    
                    <div className="flex space-x-2.5 pt-1">
                      <button type="submit" className="flex-1 bg-[#C8F55A] hover:bg-[#bada52] text-black font-black py-2.5 rounded-xl text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1 cursor-pointer" style={DISPLAY}>
                        <CalendarDays className="w-3.5 h-3.5" /> Confirm Booking
                      </button>
                      <button type="button" onClick={() => setSelectedGroundId(null)} className="px-4 bg-white/5 border border-white/5 text-white/70 hover:text-white hover:bg-white/10 font-bold py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer" style={DISPLAY}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button 
                    onClick={() => setSelectedGroundId(ground.id)} 
                    className="w-full bg-white/5 border border-white/10 hover:border-[#C8F55A]/30 text-white hover:text-[#C8F55A] font-bold py-3 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
                    style={DISPLAY}
                  >
                    <Clock className="w-3.5 h-3.5" /> Reserve Arena
                  </button>
                )}

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}