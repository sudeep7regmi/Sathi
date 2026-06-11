'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { apiClient } from '@/lib/axios';
import axios from 'axios';

interface Ground { id: string; name: string; address: string; pricePerHour: number; amenities: string; }

export default function ManageGroundsPage() {
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', address: '', pricePerHour: '', amenities: '', description: '' });



  useEffect(() => { const fetchGrounds = async () => {
    try {
      const res = await apiClient.get('/api/owner/grounds');
      if (res.data.success) setGrounds(res.data.grounds);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };
  fetchGrounds(); }, []);

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

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Manage Futsal Grounds</h1>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold mb-4">Add New Arena</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Arena Name</label><input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded p-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Address</label><input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border rounded p-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Price Per Hour (Rs)</label><input required type="number" name="pricePerHour" value={formData.pricePerHour} onChange={handleChange} className="w-full border rounded p-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Amenities (comma separated)</label><input required type="text" name="amenities" value={formData.amenities} onChange={handleChange} className="w-full border rounded p-2" placeholder="Parking, Showers, Bibs" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Description</label><textarea required name="description" value={formData.description} onChange={handleChange} className="w-full border rounded p-2" rows={3}></textarea></div>
          <button type="submit" className="md:col-span-2 bg-emerald-600 text-white font-bold py-2 rounded hover:bg-emerald-700">Add Ground</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {grounds.map(g => (
          <div key={g.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900">{g.name}</h3>
            <p className="text-sm text-gray-500">📍 {g.address}</p>
            <p className="mt-2 text-emerald-600 font-bold">Rs. {g.pricePerHour} / hour</p>
            <p className="mt-2 text-xs text-gray-400">Amenities: {g.amenities}</p>
          </div>
        ))}
      </div>
    </div>
  );
}