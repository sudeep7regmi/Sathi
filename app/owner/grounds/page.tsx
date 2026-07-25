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
        console.error("Error fetching grounds:", err);
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
      <div 
        className="min-h-[60vh] flex items-center justify-center font-bold tracking-wider uppercase text-sm text-slate-700"
        style={{ backgroundColor: "var(--bcolor)" }}
      >
        <Loader2 className="animate-spin h-8 w-8 text-emerald-600 mr-3" />
        <span>Syncing Arenas...</span>
      </div>
    );
  }

  const inputClass =
    "w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-sm";

  return (
    <div 
      className="space-y-8 pb-12 min-h-screen"
      style={{ backgroundColor: "var(--bcolor)", color: "var(--tcolor)" }}
    >
      {/* Header section */}
      <div className="border-b border-slate-200 pb-5 relative z-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 uppercase tracking-tight flex items-center gap-3">
          <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
          Manage Futsal Grounds
        </h1>
        <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mt-1">
          Add new turf locations, manage hourly rates, and configure facility amenities.
        </p>
      </div>
      
      {/* Registry/Insert New Complex Interactive Container */}
      <div 
        className="p-6 md:p-8 rounded-2xl border shadow-sm relative overflow-hidden z-10"
        style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
      >
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
          <PlusCircle className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-extrabold uppercase tracking-tight text-slate-900">Add New Arena</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">Arena Name</label>
            <input 
              required 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className={inputClass} 
              placeholder="e.g., Stadium Field A"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">Address</label>
            <input 
              required 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              className={inputClass} 
              placeholder="e.g., Ring Road, Kathmandu"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">Price Per Hour (Rs)</label>
            <input 
              required 
              type="number" 
              name="pricePerHour" 
              value={formData.pricePerHour} 
              onChange={handleChange} 
              className={inputClass} 
              placeholder="1500"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">Amenities (comma separated)</label>
            <input 
              required 
              type="text" 
              name="amenities" 
              value={formData.amenities} 
              onChange={handleChange} 
              className={inputClass} 
              placeholder="Parking, Showers, Changing Rooms" 
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">Description</label>
            <textarea 
              required 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              className={`${inputClass} resize-none`} 
              rows={3}
              placeholder="Provide pitch dimensions, turf type, or lighting specifics..."
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Layers className="w-4 h-4" /> Add Arena Entry
            </button>
          </div>
        </form>
      </div>

      {/* Grid Display Registry Layout render nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {grounds.length === 0 ? (
          <p className="text-slate-500 text-sm uppercase tracking-wider font-semibold">
            No arenas listed yet. Add your first ground above.
          </p>
        ) : (
          grounds.map(g => (
            <div 
              key={g.id} 
              className="p-6 rounded-2xl border shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md group relative"
              style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                    {g.name}
                  </h3>
                </div>
                
                <div className="space-y-2 mt-3 text-xs font-medium text-slate-600">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" /> 
                    <span className="line-clamp-1">{g.address}</span>
                  </p>
                  
                  <p className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="line-clamp-1">
                      <span className="text-slate-400 font-bold mr-1">Amenities:</span> {g.amenities}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> Live Rate
                </span>
                <p className="text-base font-black text-emerald-600 flex items-center gap-1">
                  <Coins className="w-4 h-4 opacity-75" /> Rs. {g.pricePerHour} <span className="text-[10px] font-semibold text-slate-400 lowercase">/ hr</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}