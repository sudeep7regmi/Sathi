'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';
import axios from 'axios';

interface User { id: string; email: string; role: string; createdAt: string; }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiClient.get('/api/admin/users');
        if (res.data.success) setUsers(res.data.users);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to permanently ban ${email}? This cannot be undone.`)) return;
    try {
      const res = await apiClient.delete(`/api/admin/users?id=${id}`);
      if (res.data.success) {
        setUsers(users.filter(u => u.id !== id));
      }
    } catch (err) { alert('Failed to delete user.'); }
  };

  if (loading) return <div className="p-10 font-bold text-center">Loading Directory...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Directory</h1>
          <p className="text-slate-500 text-sm">Monitor and manage all platform accounts.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-sm font-bold text-slate-600">Total Users: {users.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <th className="p-5">Account Email</th>
              <th className="p-5">Role</th>
              <th className="p-5">Join Date</th>
              <th className="p-5 text-right">Administrative Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.length === 0 ? (
              <tr><td colSpan={4} className="p-10 text-center text-slate-500">No other users found.</td></tr>
            ) : users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-5 font-bold text-slate-900">{user.email}</td>
                <td className="p-5">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${user.role === 'OWNER' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-5 text-sm text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="p-5 text-right">
                  <button onClick={() => handleDelete(user.id, user.email)} className="text-xs font-bold bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors border border-red-100">
                    Ban / Delete
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