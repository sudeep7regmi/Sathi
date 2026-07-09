'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';

interface Ground { 
  id: string; 
  name: string; 
  address: string; 
  pricePerHour: number; 
  owner: { 
    futsalName: string; 
    user: { email: string } 
  }; 
}

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
};

export default function AdminGroundsPage() {
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrounds = async () => {
      try {
        const res = await apiClient.get('/api/admin/grounds');
        if (res.data.success) setGrounds(res.data.grounds);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchGrounds();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove the arena "${name}" from the platform?`)) return;
    try {
      const res = await apiClient.delete(`/api/admin/grounds?id=${id}`);
      if (res.data.success) setGrounds(grounds.filter(g => g.id !== id));
    } catch (err) { alert('Failed to delete arena.'); }
  };

  if (loading) {
    return (
      <div className="bg-[#0B0C10] text-[#F0EDE6] min-h-screen flex items-center justify-center font-bold tracking-wider uppercase text-sm" style={DISPLAY}>
        <span className="text-[#C8F55A] animate-pulse">Loading Arena Registry...</span>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0C10] text-[#F0EDE6] min-h-screen p-6 relative overflow-hidden selection:bg-[#C8F55A] selection:text-black">
      {/* Background glow node matching ecosystem */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#C8F55A]/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div>
          <h1 className="text-4xl text-[#F0EDE6] uppercase tracking-wide mb-2" style={DISPLAY}>
            Arena Registry
          </h1>
          <p className="text-white/50 text-sm">Monitor and moderate all listed Futsal grounds on SATHI.</p>
        </div>

        {/* Dynamic Analytics Count Snippet */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#12161A] border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
            <span className="text-white/40 text-xs uppercase font-bold tracking-widest">Total Arenas</span>
            <span className="text-3xl text-[#C8F55A] mt-2 font-black" style={DISPLAY}>{grounds.length}</span>
          </div>
        </div>

        {/* Main Custom Table Container */}
        <div className="bg-[#12161A] border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0A1F1A] border-b border-white/5 text-xs uppercase tracking-wider text-white/60 font-bold">
                  <th className="p-5" style={DISPLAY}>Arena Name</th>
                  <th className="p-5" style={DISPLAY}>Owner Identity</th>
                  <th className="p-5" style={DISPLAY}>Location</th>
                  <th className="p-5" style={DISPLAY}>Price / Hr</th>
                  <th className="p-5 text-right" style={DISPLAY}>Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {grounds.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-16 text-center text-white/30 text-sm">
                      No matching grounds found registered on the core platform.
                    </td>
                  </tr>
                ) : (
                  grounds.map((ground) => (
                    <tr key={ground.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Arena Name */}
                      <td className="p-5 text-sm font-bold text-white group-hover:text-[#C8F55A] transition-colors">
                        {ground.name}
                      </td>
                      
                      {/* Owner Identity Info */}
                      <td className="p-5">
                        <p className="font-semibold text-white/80 text-sm">{ground.owner.futsalName}</p>
                        <p className="text-xs text-white/40 mt-0.5">{ground.owner.user.email}</p>
                      </td>
                      
                      {/* Physical Address */}
                      <td className="p-5 text-sm text-white/60">
                        {ground.address}
                      </td>
                      
                      {/* Price Element */}
                      <td className="p-5 text-base font-black text-[#C8F55A]" style={DISPLAY}>
                        Rs. {ground.pricePerHour}
                      </td>
                      
                      {/* Management Dynamic Action Trigger */}
                      <td className="p-5 text-right">
                        <button 
                          onClick={() => handleDelete(ground.id, ground.name)} 
                          className="text-xs font-bold bg-white/5 text-white/70 px-4 py-2 rounded-xl border border-white/5 uppercase tracking-wider hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 active:scale-[0.98] transition-all cursor-pointer"
                          style={DISPLAY}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}