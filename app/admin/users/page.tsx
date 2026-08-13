'use client';

import { useState, useEffect, useMemo } from 'react';
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
  UserX,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  UserCheck
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

const ITEMS_PER_PAGE = 8;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

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

  // Filtered Users Logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesRole = selectedRole === 'ALL' || user.role.toUpperCase() === selectedRole;
      const matchesStatus = 
        selectedStatus === 'ALL' || 
        (selectedStatus === 'VERIFIED' && user.isVerified) || 
        (selectedStatus === 'PENDING' && !user.isVerified);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, selectedRole, selectedStatus]);

  // Reset pagination on filter change

  // Pagination Slice
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

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
      <div className="bg-[#0B0C10] text-[#F0EDE6] min-h-[60vh] flex flex-col items-center justify-center font-bold tracking-wider uppercase text-sm" style={DISPLAY}>
        <Loader2 className="animate-spin h-10 w-10 text-[#C8F55A] mb-3" />
        <span>Syncing Core User Hub...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-[#0B0C10] text-[#F0EDE6] min-h-screen relative overflow-hidden selection:bg-[#C8F55A] selection:text-black p-4 sm:p-6 lg:p-8">
      {/* Background ambient dynamic neon light */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-[#C8F55A]/5 blur-[140px] pointer-events-none" />

      {/* Header Telemetry Segment */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 relative z-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wider flex items-center gap-3" style={DISPLAY}>
            <span className="w-2 h-7 bg-[#C8F55A] rounded-full"></span>
            User Directory
          </h1>
          <p className="text-white/50 text-xs sm:text-sm mt-1">
            Monitor, search, verify, and moderate all platform credentials.
          </p>
        </div>
        
        {/* Total Registry Badge */}
        <div className="bg-[#12161A] px-4 py-2.5 rounded-xl border border-white/10 shadow-xl shrink-0 flex items-center gap-3">
          <Users className="w-4 h-4 text-[#C8F55A]" />
          <span className="text-xs font-bold uppercase text-white/80 tracking-widest" style={DISPLAY}>
            Total Users: <span className="text-[#C8F55A] text-sm">{users.length}</span>
          </span>
        </div>
      </div>

      {/* Control Panel: Search Bar & Filters */}
      <div className="bg-[#12161A] p-4 rounded-2xl border border-white/5 shadow-xl relative z-10 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Live Search Field */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search player by email..."
              className="w-full bg-[#0B0C10] text-white text-xs font-medium pl-10 pr-9 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#C8F55A] transition-all placeholder:text-white/30"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Role Filter Selector */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-[#0B0C10] text-xs font-bold text-white/80 uppercase tracking-wider px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#C8F55A] cursor-pointer"
              style={DISPLAY}
            >
              <option value="ALL">All Roles</option>
              <option value="PLAYER">Players</option>
              <option value="OWNER">Ground Owners</option>
              <option value="ADMIN">Admins</option>
            </select>

            {/* Verification Status Filter Selector */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#0B0C10] text-xs font-bold text-white/80 uppercase tracking-wider px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#C8F55A] cursor-pointer"
              style={DISPLAY}
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
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
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-white/30 text-xs uppercase font-bold tracking-wider" style={DISPLAY}>
                    <div className="flex flex-col items-center gap-2">
                      <ShieldAlert className="w-8 h-8 text-white/20" />
                      <span>No matching user accounts found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    
                    {/* Account Email Meta Cell */}
                    <td className="p-4 lg:p-5 font-bold text-white group-hover:text-[#C8F55A] transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <Mail className="w-3.5 h-3.5 text-white/40 group-hover:text-[#C8F55A] transition-colors" />
                        </div>
                        <span className="truncate max-w-[200px] sm:max-w-none">{user.email}</span>
                      </div>
                    </td>
                    
                    {/* Role Tag */}
                    <td className="p-4 lg:p-5">
                      <span 
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider border ${
                          user.role === 'OWNER' 
                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                            : user.role === 'ADMIN'
                            ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
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
                    
                    {/* Actions Panel */}
                    <td className="p-4 lg:p-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        
                        {/* Edit Stats Link */}
                        <Link
                          href={`/admin/users/${user.id}/edit`}
                          className="text-[10px] font-bold bg-[#C8F55A]/10 border border-[#C8F55A]/30 text-[#C8F55A] hover:bg-[#C8F55A] hover:text-black px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                          style={DISPLAY}
                        >
                          <Edit3 className="w-3 h-3" /> Edit Stats
                        </Link>

                        {/* Revoke/Verify Action Toggle */}
                        <button 
                          onClick={() => handleToggleVerification(user.id, user.isVerified)} 
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                            user.isVerified
                              ? 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                          style={DISPLAY}
                        >
                          <UserCheck className="w-3 h-3" />
                          {user.isVerified ? 'Revoke' : 'Verify'}
                        </button>
                        
                        {/* Ban Account Button */}
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

        {/* Pagination Footer */}
        {filteredUsers.length > ITEMS_PER_PAGE && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between bg-[#0B0C10]/40">
            <span className="text-xs text-white/40 uppercase tracking-widest font-bold" style={DISPLAY}>
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}