'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/axios';
import { 
  User as UserIcon, 
  Trophy, 
  Target, 
  Activity, 
  ArrowLeft, 
  Save, 
  Loader2, 
  Shield, 
  CheckCircle2, 
  Flame,
  X
} from 'lucide-react';

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
};

interface PlayerProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  preferredPosition: string;
  skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PRO';
  goals: number;
  assists: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
}

interface UserData {
  id: string;
  email: string;
  role: 'PLAYER' | 'OWNER' | 'ADMIN';
  isVerified: boolean;
  playerProfile?: PlayerProfile | null;
}

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'PLAYER' | 'OWNER' | 'ADMIN'>('PLAYER');
  const [isVerified, setIsVerified] = useState(false);
  
  // Profile stats
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [preferredPosition, setPreferredPosition] = useState('Forward');
  const [skillLevel, setSkillLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PRO'>('BEGINNER');
  const [goals, setGoals] = useState(0);
  const [assists, setAssists] = useState(0);
  const [matchesPlayed, setMatchesPlayed] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get(`/api/admin/users/${id}`);
        if (res.data.success) {
          const u: UserData = res.data.user;
          setEmail(u.email);
          setRole(u.role);
          setIsVerified(u.isVerified);

          if (u.playerProfile) {
            setFullName(u.playerProfile.fullName || '');
            setPhoneNumber(u.playerProfile.phoneNumber || '');
            setPreferredPosition(u.playerProfile.preferredPosition || 'Forward');
            setSkillLevel(u.playerProfile.skillLevel || 'BEGINNER');
            setGoals(u.playerProfile.goals || 0);
            setAssists(u.playerProfile.assists || 0);
            setMatchesPlayed(u.playerProfile.matchesPlayed || 0);
            setWins(u.playerProfile.wins || 0);
            setLosses(u.playerProfile.losses || 0);
          }
        }
      } catch (err) {
        console.error('Failed to load user', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await apiClient.patch(`/api/admin/users/${id}`, {
        role,
        isVerified,
        fullName,
        phoneNumber,
        preferredPosition,
        skillLevel,
        goals,
        assists,
        matchesPlayed,
        wins,
        losses,
      });

      if (res.data.success) {
        setSuccessMsg('Telemetry and user attributes updated successfully!');
        
        // Auto-dismiss notification after 4 seconds
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg('Failed to save telemetry changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0B0C10] text-[#F0EDE6] min-h-[60vh] flex items-center justify-center font-bold uppercase text-sm" style={DISPLAY}>
        <Loader2 className="animate-spin h-8 w-8 text-[#C8F55A] mr-3" />
        <span>Loading Player Telemetry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-[#0B0C10] text-[#F0EDE6] min-h-screen relative overflow-hidden pb-12">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-[#C8F55A]/5 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <div className="flex items-center justify-between relative z-10">
        <button
          onClick={() => router.push('/admin/users')}
          className="flex items-center gap-2 text-white/50 hover:text-[#C8F55A] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          style={DISPLAY}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </button>

        {successMsg && (
          <div className="flex items-center gap-2 bg-[#C8F55A]/10 border border-[#C8F55A]/30 text-[#C8F55A] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all" style={DISPLAY}>
            <CheckCircle2 className="w-4 h-4" /> {successMsg}
          </div>
        )}
      </div>

      {/* Page Title */}
      <div className="relative z-10">
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider flex items-center gap-3" style={DISPLAY}>
          <UserIcon className="w-8 h-8 text-[#C8F55A]" />
          Edit Telemetry: {email}
        </h1>
        <p className="text-white/50 text-sm mt-1">Override system match statistics, roles, and verified credentials.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        
        {/* SECTION 1: Core System Attributes */}
        <div className="bg-[#12161A] p-6 rounded-2xl border border-white/5 shadow-xl space-y-6">
          <h2 className="text-xl font-bold uppercase text-[#C8F55A] flex items-center gap-2 border-b border-white/5 pb-4" style={DISPLAY}>
            <Shield className="w-5 h-5" /> Account Classification
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Role Select */}
            <div>
              <label className="block text-xs font-bold uppercase text-white/50 tracking-wider mb-2" style={DISPLAY}>
                Role Assignment
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'PLAYER' | 'OWNER' | 'ADMIN')}
                className="w-full bg-[#0B0C10] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#C8F55A]"
              >
                <option value="PLAYER">PLAYER</option>
                <option value="OWNER">OWNER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            {/* Verification Check */}
            <div>
              <label className="block text-xs font-bold uppercase text-white/50 tracking-wider mb-2" style={DISPLAY}>
                Verification Badge
              </label>
              <button
                type="button"
                onClick={() => setIsVerified(!isVerified)}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                  isVerified
                    ? 'bg-[#C8F55A]/10 border-[#C8F55A] text-[#C8F55A]'
                    : 'bg-white/5 border-white/10 text-white/40'
                }`}
                style={DISPLAY}
              >
                {isVerified ? 'VERIFIED ACCOUNT' : 'UNVERIFIED / PENDING'}
              </button>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase text-white/50 tracking-wider mb-2" style={DISPLAY}>
                Display Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Bimal Magar"
                className="w-full bg-[#0B0C10] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#C8F55A]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Match Telemetry & Scoring Data */}
        <div className="bg-[#12161A] p-6 rounded-2xl border border-white/5 shadow-xl space-y-6">
          <h2 className="text-xl font-bold uppercase text-[#C8F55A] flex items-center gap-2 border-b border-white/5 pb-4" style={DISPLAY}>
            <Trophy className="w-5 h-5" /> Match Telemetry & Scoring
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            {/* Goals Input */}
            <div className="bg-[#0B0C10] p-4 rounded-xl border border-white/5 space-y-2">
              <label className="text-xs font-bold uppercase text-white/60 tracking-wider flex items-center justify-between" style={DISPLAY}>
                <span>Goals Scored</span>
                <Target className="w-4 h-4 text-[#C8F55A]" />
              </label>
              <input
                type="number"
                min="0"
                value={goals}
                onChange={(e) => setGoals(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-transparent text-3xl font-black text-white focus:outline-none"
                style={DISPLAY}
              />
            </div>

            {/* Assists Input */}
            <div className="bg-[#0B0C10] p-4 rounded-xl border border-white/5 space-y-2">
              <label className="text-xs font-bold uppercase text-white/60 tracking-wider flex items-center justify-between" style={DISPLAY}>
                <span>Assists</span>
                <Flame className="w-4 h-4 text-[#C8F55A]" />
              </label>
              <input
                type="number"
                min="0"
                value={assists}
                onChange={(e) => setAssists(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-transparent text-3xl font-black text-white focus:outline-none"
                style={DISPLAY}
              />
            </div>

            {/* Total Matches */}
            <div className="bg-[#0B0C10] p-4 rounded-xl border border-white/5 space-y-2">
              <label className="text-xs font-bold uppercase text-white/60 tracking-wider flex items-center justify-between" style={DISPLAY}>
                <span>Matches Played</span>
                <Activity className="w-4 h-4 text-white/40" />
              </label>
              <input
                type="number"
                min="0"
                value={matchesPlayed}
                onChange={(e) => setMatchesPlayed(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-transparent text-3xl font-black text-white focus:outline-none"
                style={DISPLAY}
              />
            </div>

            {/* Wins Input */}
            <div className="bg-[#0B0C10] p-4 rounded-xl border border-white/5 space-y-2">
              <label className="text-xs font-bold uppercase text-white/60 tracking-wider flex items-center justify-between" style={DISPLAY}>
                <span>Total Wins</span>
                <Trophy className="w-4 h-4 text-blue-400" />
              </label>
              <input
                type="number"
                min="0"
                value={wins}
                onChange={(e) => setWins(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-transparent text-3xl font-black text-white focus:outline-none"
                style={DISPLAY}
              />
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Preferred Position */}
            <div>
              <label className="block text-xs font-bold uppercase text-white/50 tracking-wider mb-2" style={DISPLAY}>
                Preferred Position
              </label>
              <select
                value={preferredPosition}
                onChange={(e) => setPreferredPosition(e.target.value)}
                className="w-full bg-[#0B0C10] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#C8F55A]"
              >
                <option value="Forward">Forward</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Defender">Defender</option>
                <option value="Goalkeeper">Goalkeeper</option>
              </select>
            </div>

            {/* Skill Level */}
            <div>
              <label className="block text-xs font-bold uppercase text-white/50 tracking-wider mb-2" style={DISPLAY}>
                Skill Classification
              </label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PRO')}
                className="w-full bg-[#0B0C10] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#C8F55A]"
              >
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
                <option value="PRO">PRO</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Status Banners (Form-level) */}
        {successMsg && (
          <div 
            className="flex items-center justify-between bg-[#C8F55A]/10 border border-[#C8F55A]/40 text-[#C8F55A] p-4 rounded-xl text-xs font-bold uppercase tracking-wider"
            style={DISPLAY}
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[#C8F55A]" />
              <span>{successMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMsg('')}
              className="text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {errorMsg && (
          <div 
            className="flex items-center justify-between bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs font-bold uppercase tracking-wider"
            style={DISPLAY}
          >
            <div className="flex items-center gap-3">
              <X className="w-5 h-5 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMsg('')}
              className="text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Submit Bar */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/admin/users')}
            className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            style={DISPLAY}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-[#C8F55A] hover:bg-[#bada52] text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#C8F55A]/20 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            style={DISPLAY}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Telemetry
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}