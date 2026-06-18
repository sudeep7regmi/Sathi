'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { apiClient } from '@/lib/axios';
import axios from 'axios';
import { 
  Layers, 
  MapPin, 
  Coins, 
  Sparkles, 
  PlusCircle, 
  Loader2, 
  FileText 
} from 'lucide-react';

interface Ground { 
  id: string; 
  name: string; 
  address: string; 
  pricePerHour: number; 
  amenities: string; 
}

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
};

export default function ManageGroundsPage() {
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', address: '', pricePerHour: '', amenities: '', description: '' });

  useEffect(() => { 
    const fetchGrounds = async () => {
      try {
        const res = await apiClient.get('/api/owner/grounds');
        if (res.data.success) setGrounds(res.data.grounds);
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    };
    fetchGrounds(); 
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/api/owner/grounds', formData);
      if (res.data.success) {
        setGrounds([res.data.ground, ...grounds]);
        setFormData({ name: '', address: '', pricePerHour: '', amenities: '', description: '' });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) alert(err.response?.data?.message || 'Error');
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0B0C10] text-[#F0EDE6] min-h-[60vh] flex items-center justify-center font-bold tracking-wider uppercase text-sm" style={DISPLAY}>
        <Loader2 className="animate-spin h-8 w-8 text-[#C8F55A] mr-3" />
        <span>Syncing Arenas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-[#0B0C10] text-[#F0EDE6] min-h-screen relative overflow-hidden selection:bg-[#C8F55A] selection:text-black">
      {/* Glow node aesthetic asset */}
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] rounded-full bg-[#C8F55A]/5 blur-[120px] pointer-events-none" />

      <h1 className="text-3xl font-black text-white uppercase tracking-wider flex items-center gap-3" style={DISPLAY}>
        <span className="w-1.5 h-6 bg-[#C8F55A] rounded-full"></span>
        Manage Futsal Grounds
      </h1>
      
      {/* Registry/Insert New Complex Interactive Container */}
      <div className="bg-[#12161A] p-6 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
          <PlusCircle className="w-4 h-4 text-[#C8F55A]" />
          <h2 className="text-lg font-bold uppercase tracking-wider text-white" style={DISPLAY}>Add New Arena</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1.5" style={DISPLAY}>Arena Name</label>
            <div className="relative">
              <input 
                required 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="w-full bg-[#0A1F1A]/30 border border-white/5 rounded-xl p-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C8F55A]/40 focus:bg-[#0A1F1A]/60 transition-all" 
                placeholder="e.g., Stadium Field A"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1.5" style={DISPLAY}>Address</label>
            <div className="relative">
              <input 
                required 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                className="w-full bg-[#0A1F1A]/30 border border-white/5 rounded-xl p-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C8F55A]/40 focus:bg-[#0A1F1A]/60 transition-all" 
                placeholder="e.g., Ring Road, Kathmandu"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1.5" style={DISPLAY}>Price Per Hour (Rs)</label>
            <div className="relative">
              <input 
                required 
                type="number" 
                name="pricePerHour" 
                value={formData.pricePerHour} 
                onChange={handleChange} 
                className="w-full bg-[#0A1F1A]/30 border border-white/5 rounded-xl p-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C8F55A]/40 focus:bg-[#0A1F1A]/60 transition-all" 
                placeholder="1500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1.5" style={DISPLAY}>Amenities (comma separated)</label>
            <div className="relative">
              <input 
                required 
                type="text" 
                name="amenities" 
                value={formData.amenities} 
                onChange={handleChange} 
                className="w-full bg-[#0A1F1A]/30 border border-white/5 rounded-xl p-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C8F55A]/40 focus:bg-[#0A1F1A]/60 transition-all" 
                placeholder="Parking, Showers, Changing Rooms" 
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1.5" style={DISPLAY}>Description</label>
            <div className="relative">
              <textarea 
                required 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                className="w-full bg-[#0A1F1A]/30 border border-white/5 rounded-xl p-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C8F55A]/40 focus:bg-[#0A1F1A]/60 transition-all resize-none" 
                rows={3}
                placeholder="Provide pitch dimensions, turf type, or lighting specifics..."
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="md:col-span-2 bg-[#C8F55A] hover:bg-[#bada52] text-black font-bold p-3 rounded-xl transition-colors text-xs uppercase tracking-widest mt-2 flex items-center justify-center gap-2 shadow-lg shadow-[#C8F55A]/5"
            style={DISPLAY}
          >
            <Layers className="w-4 h-4" /> Add Arena Entry
          </button>
        </form>
      </div>

      {/* Grid Display Registry Layout render nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grounds.map(g => (
          <div key={g.id} className="bg-[#12161A] p-5 rounded-2xl border border-white/5 shadow-xl flex flex-col justify-between hover:border-white/10 transition-colors group relative">
            <div>
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="font-bold text-lg text-white group-hover:text-[#C8F55A] transition-colors uppercase tracking-wide" style={DISPLAY}>
                  {g.name}
                </h3>
              </div>
              
              <div className="space-y-2 mt-3">
                <p className="text-xs text-white/50 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-white/30 shrink-0" /> 
                  <span>{g.address}</span>
                </p>
                
                <p className="text-xs text-white/50 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-white/30 shrink-0" />
                  <span className="truncate">
                    <span className="text-white/30 font-semibold mr-1">Amenities:</span> {g.amenities}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-bold text-white/30 flex items-center gap-1" style={DISPLAY}>
                <FileText className="w-3 h-3" /> Live Rate
              </span>
              <p className="text-md font-black text-[#C8F55A] flex items-center gap-1" style={DISPLAY}>
                <Coins className="w-3.5 h-3.5 opacity-60" /> Rs. {g.pricePerHour} <span className="text-[10px] font-medium text-white/40 lowercase font-sans">/ hr</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}