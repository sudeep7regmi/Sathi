'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';

interface Ground { id: string; name: string; address: string; pricePerHour: number; owner: { futsalName: string; user: { email: string } }; }

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

  if (loading) return <div className="p-10 font-bold text-center">Loading Arenas...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Arena Registry</h1>
      <p className="text-slate-500 text-sm">Monitor all listed Futsal grounds on SATHI.</p>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <th className="p-5">Arena Name</th>
              <th className="p-5">Owner Identity</th>
              <th className="p-5">Location</th>
              <th className="p-5">Price/Hr</th>
              <th className="p-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {grounds.length === 0 ? (
              <tr><td colSpan={5} className="p-10 text-center text-slate-500">No grounds registered yet.</td></tr>
            ) : grounds.map((ground) => (
              <tr key={ground.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-5 font-bold text-slate-900">{ground.name}</td>
                <td className="p-5">
                  <p className="font-bold text-slate-800 text-sm">{ground.owner.futsalName}</p>
                  <p className="text-xs text-slate-500">{ground.owner.user.email}</p>
                </td>
                <td className="p-5 text-sm text-slate-500">{ground.address}</td>
                <td className="p-5 font-black text-emerald-600">Rs. {ground.pricePerHour}</td>
                <td className="p-5 text-right">
                  <button onClick={() => handleDelete(ground.id, ground.name)} className="text-xs font-bold bg-slate-100 text-slate-600 px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}