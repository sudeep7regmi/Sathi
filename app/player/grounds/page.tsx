'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { apiClient } from '@/lib/axios';
import axios from 'axios';

interface Ground { id: string; name: string; address: string; pricePerHour: number; amenities: string; description: string; owner: { futsalName: string, isVerified: boolean }; }

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
      } catch (err) { console.error(err); } finally { setLoading(false); }
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

  if (loading) return <div className="p-10 font-bold text-center">Loading Arenas...</div>;

  return (
    <div className="space-y-8 pb-10">
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 md:p-10 text-white shadow-lg">
        <h1 className="text-3xl font-black mb-2">Book Futsal Arenas</h1>
        <p className="text-emerald-100 max-w-lg">Browse verified grounds, check amenities, and reserve your pitch instantly.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl font-medium text-sm shadow-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {grounds.length === 0 ? (
          <p className="text-slate-500">No grounds are currently listed by owners.</p>
        ) : grounds.map(ground => (
          <div key={ground.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{ground.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">📍 {ground.address} • By {ground.owner.futsalName}</p>
                </div>
                <div className="text-right">
                  <span className="block text-xl font-black text-emerald-600">Rs. {ground.pricePerHour}</span>
                  <span className="text-xs text-slate-400 font-medium">per hour</span>
                </div>
              </div>
              
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{ground.description}</p>
              
              <div className="mb-6 flex flex-wrap gap-2">
                {ground.amenities.split(',').map((amenity, i) => (
                  <span key={i} className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200">
                    {amenity.trim()}
                  </span>
                ))}
              </div>

              {selectedGroundId === ground.id ? (
                <form onSubmit={(e) => handleBookingSubmit(e, ground.id)} className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">Date</label><input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-2 text-sm" /></div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">Start Time</label><input required type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-2 text-sm" /></div>
                    <div><label className="block text-xs font-bold text-slate-500 mb-1">End Time</label><input required type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-2 text-sm" /></div>
                  </div>
                  <div className="flex space-x-3">
                    <button type="submit" className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-xl text-sm hover:bg-emerald-700">Confirm Booking</button>
                    <button type="button" onClick={() => setSelectedGroundId(null)} className="px-4 bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-sm hover:bg-slate-300">Cancel</button>
                  </div>
                </form>
              ) : (
                <button onClick={() => setSelectedGroundId(ground.id)} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-sm hover:bg-slate-800 transition-colors">
                  Reserve Arena
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}