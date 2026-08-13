"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiClient } from "@/lib/axios";
import {
  User as UserIcon,
  Trophy,
  Target,
  Flame,
  Activity,
  Phone,
  Mail,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  MapPin,
  Calendar,
  Star,
  Award,
  Zap,
  Quote,
  XCircle,
} from "lucide-react";
import PlayerAvatar from "@/components/PlayerAvatar";

interface PublicPlayerProfile {
  id: string;
  fullName: string;
  phoneNumber?: string;
  profileImage?: string | null;
  location?: string;
  age?: number;
  preferredPosition: string;
  skillLevel: string;
  bio?: string;
  rating?: number;
  goals: number;
  assists: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  user?: {
    email: string;
    isVerified: boolean;
  };
}

export default function PlayerPublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [profile, setProfile] = useState<PublicPlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await apiClient.get(`/api/players/${id}`);
        if (res.data.success) {
          setProfile(res.data.player);
        }
      } catch (err) {
        console.error("Failed to load player profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-bold text-slate-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
        <span>Loading Player Profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto my-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-slate-500 font-bold">Player profile not found.</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const winRate =
    profile.matchesPlayed > 0
      ? Math.round((profile.wins / profile.matchesPlayed) * 100)
      : 0;

  const goalContributions = (profile.goals || 0) + (profile.assists || 0);
  const goalsPerMatch =
    profile.matchesPlayed > 0
      ? ((profile.goals || 0) / profile.matchesPlayed).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Back Navigation */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </button>

      {/* Hero Header Card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Player Avatar */}
            <PlayerAvatar
              src={profile.profileImage}
              name={profile.fullName}
              size="xl"
              className="ring-4 ring-emerald-500/20 shadow-md"
            />
            {/* <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-emerald-100 border-2 border-emerald-200 text-emerald-800 font-black text-3xl flex items-center justify-center shrink-0 overflow-hidden relative shadow-inner">
              {profile.profileImage && !imgError ? (
                <Image
                  src={profile.profileImage}
                  alt={profile.fullName || 'Player'}
                  fill
                  className="object-cover"
                  onError={() => setImgError(true)}
                  unoptimized={profile.profileImage.startsWith('http')}
                />
              ) : (
                profile.fullName?.[0]?.toUpperCase() || <UserIcon className="w-10 h-10 text-emerald-700" />
              )}
            </div> */}

            {/* Core Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
                  {profile.fullName || "Player"}
                </h1>
                {profile.user?.isVerified && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />{" "}
                    Verified
                  </span>
                )}
              </div>

              {/* Tags & Meta */}
              <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-slate-600">
                <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  {profile.preferredPosition || "Forward"}
                </span>
                <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg uppercase tracking-wider border border-slate-200">
                  {profile.skillLevel || "BEGINNER"}
                </span>
              </div>

              {/* Location & Age metadata */}
              <div className="flex items-center gap-4 text-slate-500 text-xs font-medium pt-1">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />{" "}
                    {profile.location}
                  </span>
                )}
                {profile.age && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />{" "}
                    {profile.age} yrs old
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Rating & Win Rate Badges */}
          <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            {profile.rating !== undefined && profile.rating > 0 && (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-xl font-black text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{profile.rating.toFixed(1)} Rating</span>
              </div>
            )}
            <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm">
              Win Rate:{" "}
              <span className="text-emerald-400 font-black">{winRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      {profile.bio && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <Quote className="w-4 h-4 text-emerald-600" />
            <span>Player Bio</span>
          </div>
          <p className="text-sm text-slate-700 font-medium leading-relaxed italic">
            &quot;{profile.bio}&quot;
          </p>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Goals
            </span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">
            {profile.goals || 0}
          </p>
          <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">
            {goalsPerMatch} per game
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Assists
            </span>
            <Flame className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">
            {profile.assists || 0}
          </p>
          <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">
            {goalContributions} total goal contributions
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Matches
            </span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-3xl font-black text-slate-900">
            {profile.matchesPlayed || 0}
          </p>
          <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">
            Career appearances
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Record (W - L)
            </span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-slate-900">
              {profile.wins || 0}
            </p>
            <span className="text-slate-400 font-bold text-sm">/</span>
            <p className="text-lg font-bold text-rose-500">
              {profile.losses || 0}
            </p>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">
            {profile.wins || 0} Wins • {profile.losses || 0} Losses
          </span>
        </div>
      </div>

      {/* Performance Highlights */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase text-slate-900 tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-600" /> Performance Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                G/A Ratio
              </p>
              <p className="text-sm font-black text-slate-800">
                {profile.matchesPlayed > 0
                  ? (goalContributions / profile.matchesPlayed).toFixed(2)
                  : "0.00"}{" "}
                / game
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-lg shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Total Victories
              </p>
              <p className="text-sm font-black text-slate-800">
                {profile.wins || 0} Matches Won
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="p-2.5 bg-rose-100 text-rose-700 rounded-lg shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Defeats
              </p>
              <p className="text-sm font-black text-slate-800">
                {profile.losses || 0} Matches Lost
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase text-slate-900 tracking-wider">
          Contact & Verification
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Email Address
              </p>
              <p className="text-xs font-bold text-slate-800 truncate">
                {profile.user?.email || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Phone Number
              </p>
              <p className="text-xs font-bold text-slate-800 truncate">
                {profile.phoneNumber || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
