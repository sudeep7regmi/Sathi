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
  X,
  Phone,
  Camera,
  Award,
  BarChart3,
  Mail,
  AlertTriangle,
  Percent,
  CloudUpload,
  Link
} from 'lucide-react';

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 800,
};

interface PlayerProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  profileImage?: string; // Cloudinary URL field from database
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

  // Core User account states
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'PLAYER' | 'OWNER' | 'ADMIN'>('PLAYER');
  const [isVerified, setIsVerified] = useState(false);
  
  // Profile & Contact Info (Using player profileImage Cloudinary URL)
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [imageError, setImageError] = useState(false);
  
  // Player Tactical Specs
  const [preferredPosition, setPreferredPosition] = useState('Forward');
  const [skillLevel, setSkillLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PRO'>('BEGINNER');
  
  // Performance Telemetry
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
            // Set Cloudinary profileImage URL directly from database record
            setProfileImage(u.playerProfile.profileImage || '');
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
        console.error('Failed to load user telemetry', err);
        setErrorMsg('Could not fetch user record from database.');
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
        profileImage, // Save updated Cloudinary URL field
        preferredPosition,
        skillLevel,
        goals,
        assists,
        matchesPlayed,
        wins,
        losses,
      });

      if (res.data.success) {
        setSuccessMsg('Account data & telemetry saved successfully.');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg('Failed to update telemetry. Please verify input data and retry.');
    } finally {
      setSaving(false);
    }
  };

  // Derived Telemetry Calculations
  const winRate = matchesPlayed > 0 ? Math.round((wins / matchesPlayed) * 100) : 0;
  const goalContributions = goals + assists;

  if (loading) {
    return (
      <div className="bg-[#0D0E12] text-[#E2E8F0] min-h-[60vh] flex flex-col items-center justify-center font-bold tracking-wider uppercase text-xs" style={DISPLAY}>
        <Loader2 className="animate-spin h-8 w-8 text-[#C8F55A] mb-3" />
        <span className="text-white/60">Fetching Player Record...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 bg-[#0D0E12] text-[#E2E8F0] min-h-screen p-4 sm:p-6 lg:p-8">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <button
            onClick={() => router.push('/admin/users')}
            className="inline-flex items-center gap-2 text-white/50 hover:text-[#C8F55A] text-xs font-bold uppercase tracking-wider transition-colors mb-2 cursor-pointer"
            style={DISPLAY}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to User Directory
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider flex items-center gap-2.5" style={DISPLAY}>
            Edit User & Telemetry
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/users')}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-white/10 transition-all cursor-pointer"
            style={DISPLAY}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="telemetry-form"
            disabled={saving}
            className="px-5 py-2 bg-[#C8F55A] hover:bg-[#bada52] text-black font-black text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            style={DISPLAY}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Record
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center justify-between bg-[#C8F55A]/10 border border-[#C8F55A]/30 text-[#C8F55A] px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider" style={DISPLAY}>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-white/40 hover:text-white transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center justify-between bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider" style={DISPLAY}>
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-white/40 hover:text-white transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form id="telemetry-form" onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: Identity & Profile Header with Cloudinary profileImage */}
        <div className="bg-[#13151B] p-5 sm:p-6 rounded-xl border border-white/10 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-6 border-b border-white/5">
            
            {/* Player Cloudinary Image Preview */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#1C1F26] border-2 border-white/10 overflow-hidden flex items-center justify-center relative shadow-lg">
                {profileImage && !imageError ? (
                  <img 
                    src={profileImage} 
                    alt={fullName || 'Player Profile Image'} 
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <UserIcon className="w-12 h-12 text-white/30" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#C8F55A] text-black p-1.5 rounded-lg border border-black text-xs shadow-md">
                <Camera className="w-4 h-4" />
              </div>
            </div>

            {/* Quick Summary Info */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-[#C8F55A] bg-[#C8F55A]/10 px-2 py-0.5 rounded border border-[#C8F55A]/20" style={DISPLAY}>
                  ID: {id}
                </span>
                <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded border ${
                  isVerified ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                }`} style={DISPLAY}>
                  {isVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">{fullName || 'Unnamed Player'}</h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/50 pt-1">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-white/30" /> {email}</span>
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-white/30" /> {phoneNumber || 'No phone set'}</span>
              </div>
            </div>

            {/* Telemetry Metric Badges */}
            <div className="flex items-center gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
              <div className="bg-[#1C1F26] p-3 rounded-xl border border-white/5 text-center min-w-[90px]">
                <p className="text-[10px] font-bold uppercase text-white/40" style={DISPLAY}>Win Rate</p>
                <p className="text-lg font-black text-white flex items-center justify-center gap-0.5 mt-0.5">
                  {winRate}<Percent className="w-3 h-3 text-[#C8F55A]" />
                </p>
              </div>
              <div className="bg-[#1C1F26] p-3 rounded-xl border border-white/5 text-center min-w-[90px]">
                <p className="text-[10px] font-bold uppercase text-white/40" style={DISPLAY}>Contributions</p>
                <p className="text-lg font-black text-[#C8F55A] mt-0.5">{goalContributions}</p>
              </div>
            </div>
          </div>

          {/* Identity Form Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
            <div>
              <label className="block text-xs font-bold uppercase text-white/60 mb-1.5" style={DISPLAY}>
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Bimal Magar"
                className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-[#C8F55A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-white/60 mb-1.5" style={DISPLAY}>
                Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+977 98XXXXXXXX"
                className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-[#C8F55A]"
              />
            </div>

            {/* Cloudinary profileImage URL Input */}
            <div className="sm:col-span-2 lg:col-span-1 space-y-2">
              <label className="block text-xs font-bold uppercase text-white/60 flex items-center justify-between" style={DISPLAY}>
                <span className="flex items-center gap-1.5 text-[#C8F55A]">
                  <CloudUpload className="w-3.5 h-3.5" /> Player Profile Image (Cloudinary)
                </span>
                {profileImage && profileImage.includes('cloudinary.com') && (
                  <span className="text-[10px] text-emerald-400 font-bold">Cloudinary Loaded</span>
                )}
              </label>
              <div className="relative">
                <Link className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="url"
                  value={profileImage}
                  onChange={(e) => {
                    setProfileImage(e.target.value);
                    setImageError(false);
                  }}
                  placeholder="https://res.cloudinary.com/.../image/upload/..."
                  className="w-full bg-[#0D0E12] border border-white/10 rounded-lg pl-9 pr-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#C8F55A]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Role Access & Status Controls */}
        <div className="bg-[#13151B] p-5 sm:p-6 rounded-xl border border-white/10 shadow-md space-y-4">
          <h3 className="text-xs font-bold uppercase text-white/50 tracking-wider flex items-center gap-2 border-b border-white/5 pb-3" style={DISPLAY}>
            <Shield className="w-4 h-4 text-[#C8F55A]" /> Access Control & System Role
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-white/60 mb-1.5" style={DISPLAY}>
                System Role Assignment
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'PLAYER' | 'OWNER' | 'ADMIN')}
                className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs font-bold uppercase text-white focus:outline-none focus:border-[#C8F55A] cursor-pointer"
                style={DISPLAY}
              >
                <option value="PLAYER">PLAYER</option>
                <option value="OWNER">OWNER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-white/60 mb-1.5" style={DISPLAY}>
                Verification Badge Status
              </label>
              <button
                type="button"
                onClick={() => setIsVerified(!isVerified)}
                className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider border transition-all cursor-pointer flex items-center justify-between ${
                  isVerified
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                }`}
                style={DISPLAY}
              >
                <span>{isVerified ? 'VERIFIED ACCOUNT' : 'UNVERIFIED / PENDING'}</span>
                <span className={`w-2.5 h-2.5 rounded-full ${isVerified ? 'bg-emerald-400' : 'bg-white/30'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: Player Positioning & Tactical Specs */}
        <div className="bg-[#13151B] p-5 sm:p-6 rounded-xl border border-white/10 shadow-md space-y-4">
          <h3 className="text-xs font-bold uppercase text-white/50 tracking-wider flex items-center gap-2 border-b border-white/5 pb-3" style={DISPLAY}>
            <Award className="w-4 h-4 text-[#C8F55A]" /> Tactical Attributes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-white/60 mb-1.5" style={DISPLAY}>
                Preferred Position
              </label>
              <select
                value={preferredPosition}
                onChange={(e) => setPreferredPosition(e.target.value)}
                className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-[#C8F55A] cursor-pointer"
              >
                <option value="Forward">Forward</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Defender">Defender</option>
                <option value="Goalkeeper">Goalkeeper</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-white/60 mb-1.5" style={DISPLAY}>
                Skill Classification
              </label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PRO')}
                className="w-full bg-[#0D0E12] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs font-bold uppercase text-white focus:outline-none focus:border-[#C8F55A] cursor-pointer"
                style={DISPLAY}
              >
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
                <option value="PRO">PRO</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 4: Match Telemetry & Performance Counters */}
        <div className="bg-[#13151B] p-5 sm:p-6 rounded-xl border border-white/10 shadow-md space-y-4">
          <h3 className="text-xs font-bold uppercase text-white/50 tracking-wider flex items-center justify-between border-b border-white/5 pb-3" style={DISPLAY}>
            <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-[#C8F55A]" /> Match Telemetry Data</span>
            <span className="text-[10px] text-white/30 font-normal">Direct numerical override</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            
            {/* Matches Played */}
            <div className="bg-[#0D0E12] p-3 rounded-lg border border-white/10 space-y-1">
              <label className="text-[10px] font-bold uppercase text-white/50 flex items-center justify-between" style={DISPLAY}>
                <span>Matches</span>
                <Activity className="w-3.5 h-3.5 text-white/40" />
              </label>
              <input
                type="number"
                min="0"
                value={matchesPlayed}
                onChange={(e) => setMatchesPlayed(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-transparent text-xl font-bold text-white focus:outline-none"
              />
            </div>

            {/* Goals */}
            <div className="bg-[#0D0E12] p-3 rounded-lg border border-white/10 space-y-1">
              <label className="text-[10px] font-bold uppercase text-white/50 flex items-center justify-between" style={DISPLAY}>
                <span>Goals</span>
                <Target className="w-3.5 h-3.5 text-[#C8F55A]" />
              </label>
              <input
                type="number"
                min="0"
                value={goals}
                onChange={(e) => setGoals(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-transparent text-xl font-bold text-white focus:outline-none"
              />
            </div>

            {/* Assists */}
            <div className="bg-[#0D0E12] p-3 rounded-lg border border-white/10 space-y-1">
              <label className="text-[10px] font-bold uppercase text-white/50 flex items-center justify-between" style={DISPLAY}>
                <span>Assists</span>
                <Flame className="w-3.5 h-3.5 text-[#C8F55A]" />
              </label>
              <input
                type="number"
                min="0"
                value={assists}
                onChange={(e) => setAssists(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-transparent text-xl font-bold text-white focus:outline-none"
              />
            </div>

            {/* Wins */}
            <div className="bg-[#0D0E12] p-3 rounded-lg border border-white/10 space-y-1">
              <label className="text-[10px] font-bold uppercase text-white/50 flex items-center justify-between" style={DISPLAY}>
                <span>Wins</span>
                <Trophy className="w-3.5 h-3.5 text-emerald-400" />
              </label>
              <input
                type="number"
                min="0"
                value={wins}
                onChange={(e) => setWins(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-transparent text-xl font-bold text-emerald-400 focus:outline-none"
              />
            </div>

            {/* Losses */}
            <div className="bg-[#0D0E12] p-3 rounded-lg border border-white/10 space-y-1 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-bold uppercase text-white/50 flex items-center justify-between" style={DISPLAY}>
                <span>Losses</span>
                <X className="w-3.5 h-3.5 text-rose-400" />
              </label>
              <input
                type="number"
                min="0"
                value={losses}
                onChange={(e) => setLosses(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-transparent text-xl font-bold text-rose-400 focus:outline-none"
              />
            </div>

          </div>
        </div>

      </form>
    </div>
  );
}