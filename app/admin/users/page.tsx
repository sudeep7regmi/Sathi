'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';
import Link from 'next/link';
import { 
  Users, 
  Mail, 
  Calendar, 
  BadgeCheck, 
  AlertCircle, 
  Loader2,
  Edit3,
  UserX
} from 'lucide-react';

interface User { 
  id: string; 
  email: string; 
  role: string; 
  isVerified: boolean; 
  createdAt: string; 
}

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiClient.get('/api/admin/users');
        if (res.data.success) setUsers(res.data.users);
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchUsers();
  }, []);

  const handleToggleVerification = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      const res = await apiClient.patch('/api/admin/users', { userId: id, isVerified: newStatus });
      if (res.data.success) {
        setUsers(users.map(u => u.id === id ? { ...u, isVerified: newStatus } : u));
      }
    } catch (err) { 
      alert('Failed to change verification status.'); 
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to permanently ban ${email}? This cannot be undone.`)) return;
    try {
      const res = await apiClient.delete(`/api/admin/users?id=${id}`);
      if (res.data.success) setUsers(users.filter(u => u.id !== id));
    } catch (err) { 
      alert('Failed to delete user.'); 
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0B0C10] text-[#F0EDE6] min-h-[60vh] flex items-center justify-center font-bold tracking-wider uppercase text-sm" style={DISPLAY}>
        <Loader2 className="animate-spin h-8 w-8 text-[#C8F55A] mr-3" />
        <span>Syncing Core User Hub...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-[#0B0C10] text-[#F0EDE6] min-h-screen relative overflow-hidden selection:bg-[#C8F55A] selection:text-black">
      {/* Background neon dynamic lighting gradient element */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-[#C8F55A]/5 blur-[120px] pointer-events-none" />

      {/* Header telemetry status tracking segment */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wider flex items-center gap-3" style={DISPLAY}>
            <span className="w-1.5 h-6 bg-[#C8F55A] rounded-full"></span>
            User Directory
          </h1>
          <p className="text-white/50 text-sm mt-1">Monitor, verify, update stats, and moderate all system accounts.</p>
        </div>
        
        <div className="bg-[#12161A] px-4 py-2.5 rounded-xl border border-white/5 shadow-xl shrink-0">
          <span className="text-xs font-bold uppercase text-[#C8F55A] tracking-widest flex items-center gap-2" style={DISPLAY}>
            <Users className="w-4 h-4 opacity-70" /> Total Users: {users.length}
          </span>
        </div>
      </div>

      {/* Core Platform Registry Box Layout */}
      <div className="bg-[#12161A] rounded-2xl border border-white/5 shadow-2xl overflow-hidden relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0A1F1A]/50 border-b border-white/5 text-[10px] uppercase tracking-widest text-white/40 font-bold" style={DISPLAY}>
                <th className="p-4 lg:p-5">Account Email</th>
                <th className="p-4 lg:p-5">Classification Role</th>
                <th className="p-4 lg:p-5">Verification State</th>
                <th className="p-4 lg:p-5">Join Timestamp</th>
                <th className="p-4 lg:p-5 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-white/30 text-xs uppercase font-bold tracking-wider" style={DISPLAY}>
                    No other accounts found registered.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    
                    {/* Account Email Meta Cell */}
                    <td className="p-4 lg:p-5 font-bold text-white group-hover:text-[#C8F55A] transition-colors">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-white/20 group-hover:text-[#C8F55A]/40 transition-colors" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    
                    {/* Role Tag */}
                    <td className="p-4 lg:p-5">
                      <span 
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider border ${
                          user.role === 'OWNER' 
                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                            : 'bg-[#C8F55A]/10 border-[#C8F55A]/20 text-[#C8F55A]'
                        }`}
                        style={DISPLAY}
                      >
                        {user.role}
                      </span>
                    </td>
                    
                    {/* Verified Tag Status */}
                    <td className="p-4 lg:p-5">
                      {user.isVerified ? (
                        <span className="text-xs font-bold text-[#C8F55A] flex items-center gap-1.5" style={DISPLAY}>
                          <BadgeCheck className="w-4 h-4 text-[#C8F55A]" /> VERIFIED
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5" style={DISPLAY}>
                          <AlertCircle className="w-4 h-4 text-amber-400/70" /> PENDING
                        </span>
                      )}
                    </td>
                    
                    {/* Timestamp */}
                    <td className="p-4 lg:p-5 text-xs text-white/50">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-white/20" />
                        <span>{new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </td>
                    
                    {/* Actions Panel with Edit Stats */}
                    <td className="p-4 lg:p-5 text-right whitespace-nowrap">
                      <div className="inline-flex gap-2">
                        
                        {/* Edit Stats Link */}
                        <Link
                          href={`/admin/users/${user.id}/edit`}
                          className="text-[10px] font-bold bg-[#C8F55A]/10 border border-[#C8F55A]/30 text-[#C8F55A] hover:bg-[#C8F55A] hover:text-black px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all flex items-center gap-1"
                          style={DISPLAY}
                        >
                          <Edit3 className="w-3 h-3" /> Edit Stats
                        </Link>

                        <button 
                          onClick={() => handleToggleVerification(user.id, user.isVerified)} 
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border uppercase tracking-wider transition-all cursor-pointer ${
                            user.isVerified
                              ? 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                              : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                          }`}
                          style={DISPLAY}
                        >
                          {user.isVerified ? 'Revoke' : 'Verify'}
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(user.id, user.email)} 
                          className="text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/20 uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                          style={DISPLAY}
                        >
                          <UserX className="w-3 h-3" /> Ban
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}