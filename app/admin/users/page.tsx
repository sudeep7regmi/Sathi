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
  UserCheck,
  Shield,
  CheckCircle2,
  Clock,
  Building2,
  Filter
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

  // Reset page when filters change

  // Statistics Breakdown
  const stats = useMemo(() => {
    const total = users.length;
    const verified = users.filter(u => u.isVerified).length;
    const pending = total - verified;
    const owners = users.filter(u => u.role.toUpperCase() === 'OWNER').length;
    return { total, verified, pending, owners };
  }, [users]);

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
    if (!confirm(`Are you sure you want to permanently ban ${email}? This action cannot be undone.`)) return;
    try {
      const res = await apiClient.delete(`/api/admin/users?id=${id}`);
      if (res.data.success) setUsers(users.filter(u => u.id !== id));
    } catch (err) { 
      alert('Failed to delete user.'); 
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0B0C10] text-[#F0EDE6] min-h-[70vh] flex flex-col items-center justify-center font-bold tracking-wider uppercase text-xs" style={DISPLAY}>
        <div className="relative flex items-center justify-center mb-4">
          <div className="absolute w-16 h-16 rounded-full border-2 border-[#C8F55A]/20 animate-ping" />
          <Loader2 className="animate-spin h-10 w-10 text-[#C8F55A]" />
        </div>
        <span className="text-white/70 tracking-widest">Initializing User Directory...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-[#0B0C10] text-[#F0EDE6] min-h-screen relative overflow-hidden selection:bg-[#C8F55A] selection:text-black p-4 sm:p-6 lg:p-8">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#C8F55A]/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[140px] pointer-events-none" />

      {/* Header Telemetry Segment */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#C8F55A] uppercase tracking-widest mb-1" style={DISPLAY}>
            <Shield className="w-3.5 h-3.5" /> Administrative Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wider flex items-center gap-3" style={DISPLAY}>
            User Directory
          </h1>
          <p className="text-white/50 text-xs sm:text-sm mt-1">
            Monitor accounts, adjust verification access, and enforce safety protocols across all users.
          </p>
        </div>
      </div>

      {/* Analytical Telemetry Dashboard Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
        <div className="bg-[#12161A] p-4 rounded-2xl border border-white/5 shadow-xl flex items-center justify-between group hover:border-white/10 transition-all">
          <div>
            <p className="text-[10px] font-bold uppercase text-white/40 tracking-wider" style={DISPLAY}>Total Accounts</p>
            <p className="text-2xl font-black text-white mt-0.5">{stats.total}</p>
          </div>
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/60 group-hover:text-[#C8F55A] group-hover:border-[#C8F55A]/30 transition-all">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#12161A] p-4 rounded-2xl border border-white/5 shadow-xl flex items-center justify-between group hover:border-white/10 transition-all">
          <div>
            <p className="text-[10px] font-bold uppercase text-white/40 tracking-wider" style={DISPLAY}>Verified Accounts</p>
            <p className="text-2xl font-black text-[#C8F55A] mt-0.5">{stats.verified}</p>
          </div>
          <div className="p-3 bg-[#C8F55A]/10 border border-[#C8F55A]/20 rounded-xl text-[#C8F55A]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#12161A] p-4 rounded-2xl border border-white/5 shadow-xl flex items-center justify-between group hover:border-white/10 transition-all">
          <div>
            <p className="text-[10px] font-bold uppercase text-white/40 tracking-wider" style={DISPLAY}>Pending Approvals</p>
            <p className="text-2xl font-black text-amber-400 mt-0.5">{stats.pending}</p>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#12161A] p-4 rounded-2xl border border-white/5 shadow-xl flex items-center justify-between group hover:border-white/10 transition-all">
          <div>
            <p className="text-[10px] font-bold uppercase text-white/40 tracking-wider" style={DISPLAY}>Venue Owners</p>
            <p className="text-2xl font-black text-blue-400 mt-0.5">{stats.owners}</p>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control Panel: Search Bar & Filters */}
      <div className="bg-[#12161A] p-4 rounded-2xl border border-white/5 shadow-xl relative z-10 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Live Search Field */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user by email address..."
              className="w-full bg-[#0B0C10] text-white text-xs font-medium pl-10 pr-9 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#C8F55A] transition-all placeholder:text-white/30 shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-white/40 font-bold uppercase tracking-wider mr-1 hidden lg:flex" style={DISPLAY}>
              <Filter className="w-3.5 h-3.5" /> Filters:
            </div>

            {/* Role Filter Selector */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-[#0B0C10] text-xs font-bold text-white/80 uppercase tracking-wider px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#C8F55A] cursor-pointer hover:border-white/20 transition-all"
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
              className="bg-[#0B0C10] text-xs font-bold text-white/80 uppercase tracking-wider px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#C8F55A] cursor-pointer hover:border-white/20 transition-all"
              style={DISPLAY}
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified Only</option>
              <option value="PENDING">Pending Only</option>
            </select>
          </div>
        </div>

        {/* Search Results Metadata Bar */}
        {(searchQuery || selectedRole !== 'ALL' || selectedStatus !== 'ALL') && (
          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/50">
            <span>
              Found <strong className="text-white">{filteredUsers.length}</strong> matching results
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRole('ALL');
                setSelectedStatus('ALL');
              }}
              className="text-[#C8F55A] hover:underline font-bold uppercase text-[10px] tracking-wider"
              style={DISPLAY}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Core Platform Registry Table */}
      <div className="bg-[#12161A] rounded-2xl border border-white/5 shadow-2xl overflow-hidden relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0A1F1A]/50 border-b border-white/5 text-[10px] uppercase tracking-widest text-white/40 font-bold" style={DISPLAY}>
                <th className="p-4 lg:p-5">Account & Identifier</th>
                <th className="p-4 lg:p-5">System Role</th>
                <th className="p-4 lg:p-5">Verification State</th>
                <th className="p-4 lg:p-5">Registered Date</th>
                <th className="p-4 lg:p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-white/30 text-xs uppercase font-bold tracking-wider" style={DISPLAY}>
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <ShieldAlert className="w-8 h-8 text-white/30" />
                      </div>
                      <span className="text-white/60">No matching accounts found in the directory.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    
                    {/* Account Email Meta Cell */}
                    <td className="p-4 lg:p-5 font-bold text-white group-hover:text-[#C8F55A] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner group-hover:border-[#C8F55A]/40 transition-colors">
                          <Mail className="w-4 h-4 text-white/50 group-hover:text-[#C8F55A] transition-colors" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="truncate max-w-[180px] sm:max-w-xs text-white font-semibold text-xs sm:text-sm">{user.email}</span>
                          <span className="text-[10px] font-mono text-white/30 truncate max-w-[120px] sm:max-w-none">ID: {user.id}</span>
                        </div>
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
                        <span className="text-xs font-bold text-[#C8F55A] inline-flex items-center gap-1.5 bg-[#C8F55A]/10 px-2.5 py-1 rounded-lg border border-[#C8F55A]/20" style={DISPLAY}>
                          <BadgeCheck className="w-3.5 h-3.5 text-[#C8F55A]" /> VERIFIED
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-amber-400 inline-flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20" style={DISPLAY}>
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> PENDING
                        </span>
                      )}
                    </td>
                    
                    {/* Timestamp */}
                    <td className="p-4 lg:p-5 text-xs text-white/50">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-white/30" />
                        <span>{new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </td>
                    
                    {/* Actions Panel */}
                    <td className="p-4 lg:p-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-2">
                        
                        {/* Edit Stats Link */}
                        <Link
                          href={`/admin/users/${user.id}/edit`}
                          className="text-[10px] font-bold bg-[#C8F55A]/10 border border-[#C8F55A]/30 text-[#C8F55A] hover:bg-[#C8F55A] hover:text-black px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                          style={DISPLAY}
                          title="Edit User Profile Stats"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </Link>

                        {/* Revoke/Verify Action Toggle */}
                        <button 
                          onClick={() => handleToggleVerification(user.id, user.isVerified)} 
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
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
                          className="text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-lg hover:bg-rose-500/20 hover:border-rose-500/40 uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                          style={DISPLAY}
                          title="Permanently Ban User"
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
          <div className="p-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0B0C10]/40">
            <span className="text-xs text-white/40 uppercase tracking-widest font-bold" style={DISPLAY}>
              Showing page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1 text-xs font-bold uppercase tracking-wider"
                style={DISPLAY}
              >
                <ChevronLeft className="w-4 h-4 text-white" /> Prev
              </button>
              
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1 text-xs font-bold uppercase tracking-wider"
                style={DISPLAY}
              >
                Next <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}