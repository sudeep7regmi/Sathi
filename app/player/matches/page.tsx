"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { apiClient } from "@/lib/axios";
import { useSocket } from "@/components/providers/SocketProvider";
import axios from "axios";
import {
  PlusCircle,
  Flame,
  MapPin,
  Calendar,
  Clock,
  Swords,
  Activity,
  Users,
  CheckCircle2,
  AlertTriangle,
  Trophy,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Match {
  id: string;
  organizerId: string;
  title: string;
  location: string;
  date: string;
  playerLimit: number;
  matchType: string;
  skillReq: string;
  liveScore?: { homeScore: number; awayScore: number };
}

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
};

export default function MatchHubPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    playerLimit: "10",
    matchType: "5v5",
    skillReq: "INTERMEDIATE",
  });

  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const { socket, isConnected } = useSocket();
  const router = useRouter();
  useEffect(() => {
    const fetchHubData = async () => {
      try {
        const [matchRes, profileRes] = await Promise.all([
          apiClient.get("/api/player/matches"),
          apiClient.get("/api/player/dashboard"),
        ]);
        if (matchRes.data.success) setMatches(matchRes.data.matches);
        if (profileRes.data.success)
          setCurrentUserId(profileRes.data.profile.userId);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHubData();
  }, []);


  // ====== 🚨 SECURE MATCH DELETION ======
  const handleDeleteMatch = async (matchId: string) => {
    if (!confirm("Are you sure you want to permanently cancel and delete this match?")) return;

    try {
      const res = await apiClient.post("/api/player/matches/delete", { matchId });
      if (res.data.success) {
        // Remove the match from local state instantly
        setMatches((prev) => prev.filter((match) => match.id !== matchId));
        setMessage({ text: "Match successfully removed from directory.", type: "success" });
      }
    } catch (err) {
      console.error("Failed to delete match:", err);
      setMessage({ text: "Failed to delete the match. Try again.", type: "error" });
    }
  };



  // ====== ⚡ REAL-TIME TELEMETRY SOCKET LISTENER ======
  useEffect(() => {
    if (!socket) return;

    const handleScoreBroadcast = (data: {
      matchId: string;
      homeScore: number;
      awayScore: number;
    }) => {
      setMatches((prevMatches) =>
        prevMatches.map((match) =>
          match.id === data.matchId
            ? {
                ...match,
                liveScore: {
                  homeScore: data.homeScore,
                  awayScore: data.awayScore,
                },
              }
            : match
        )
      );
    };

    socket.on("score_broadcast", handleScoreBroadcast);
    return () => {
      socket.off("score_broadcast", handleScoreBroadcast);
    };
  }, [socket]);

  // ====== 🏆 SECURE DATABASE UPDATES ======
  const handleScoreUpdate = async (
    matchId: string,
    team: "HOME" | "AWAY",
    currentHome: number,
    currentAway: number
  ) => {
    const newHome = team === "HOME" ? currentHome + 1 : currentHome;
    const newAway = team === "AWAY" ? currentAway + 1 : currentAway;

    if (socket) {
      socket.emit("update_score", {
        matchId,
        homeScore: newHome,
        awayScore: newAway,
      });
    }

    try {
      await apiClient.post("/api/player/matches/score", {
        matchId,
        team,
        action: "INCREMENT",
      });
      router.refresh(); // Refresh the page to reflect the latest score
    } catch (err) {
      console.error("Failed to commit tracking matrix to engine.");
      setMatches((prevMatches) =>
        prevMatches.map((match) =>
          match.id === matchId
            ? {
                ...match,
                liveScore: {
                  homeScore: currentHome,
                  awayScore: currentAway,
                },
              }
            : match
        )
      );
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateMatch = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await apiClient.post("/api/player/matches", formData);
      if (res.data.success) {
        setMatches([...matches, res.data.match]);
        setMessage({ text: "Match created successfully!", type: "success" });
        setFormData({
          title: "",
          location: "",
          date: "",
          startTime: "",
          endTime: "",
          playerLimit: "10",
          matchType: "5v5",
          skillReq: "INTERMEDIATE",
        });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMessage({
          text: err.response?.data?.message || "Error creating match",
          type: "error",
        });
      }
    }
  };

  const handleJoinMatch = async (matchId: string) => {
    setMessage(null);
    try {
      const res = await apiClient.post("/api/player/matches/join", { matchId });
      if (res.data.success) {
        setMessage({
          text: "Join request sent! Waiting for organizer approval.",
          type: "success",
        });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMessage({
          text: err.response?.data?.message || "Failed to join match.",
          type: "error",
        });
      }
    }
  };

  const inputClass =
    "w-full bg-[#0A1F1A]/30 border border-white/5 rounded-xl p-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C8F55A]/40 focus:bg-[#0A1F1A]/60 transition-all appearance-none";

  return (
    <div className="space-y-8 pb-10 bg-[#0B0C10] text-[#F0EDE6] min-h-screen relative overflow-hidden selection:bg-[#C8F55A] selection:text-black">
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-[#C8F55A]/5 blur-[120px] pointer-events-none" />

      {/* Dynamic Status Header */}
      <div className="flex justify-between items-center bg-[#12161A] p-6 rounded-2xl border border-white/5 shadow-xl">
        <div>
          <h1
            className="text-2xl font-black uppercase text-white tracking-wide"
            style={DISPLAY}
          >
            MATCH SCHEDULER
          </h1>
          <p className="text-xs font-bold text-white/40 tracking-wider uppercase mt-0.5">
            Manage live games or sign up for open slots.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#0B0C10] px-4 py-2 rounded-xl border border-white/5">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-[#C8F55A] animate-pulse" : "bg-red-500"
            }`}
          />
          <span
            className="text-[9px] font-bold uppercase tracking-widest text-white/50"
            style={DISPLAY}
          >
            {isConnected ? "Telemetry Active" : "Offline Mode"}
          </span>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg border flex items-center gap-2.5 relative z-10 ${
            message.type === "success"
              ? "bg-[#C8F55A]/10 text-[#C8F55A] border-[#C8F55A]/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
          style={DISPLAY}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Match Form */}
      <div className="bg-[#12161A] p-6 md:p-8 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
          <PlusCircle className="w-4 h-4 text-[#C8F55A]" />
          <h2
            className="text-lg font-bold uppercase tracking-wider text-white"
            style={DISPLAY}
          >
            Host a New Match
          </h2>
        </div>

        <form
          onSubmit={handleCreateMatch}
          className="grid grid-cols-1 md:grid-cols-4 gap-5 relative z-10"
        >
          <div className="md:col-span-2">
            <label
              className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1.5"
              style={DISPLAY}
            >
              Match Title
            </label>
            <input
              required
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Saturday Night Showdown"
              className={inputClass}
            />
          </div>
          <div className="md:col-span-2">
            <label
              className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1.5"
              style={DISPLAY}
            >
              Location
            </label>
            <input
              required
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Arena name or address"
              className={inputClass}
            />
          </div>
          <div>
            <label
              className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1.5"
              style={DISPLAY}
            >
              Date
            </label>
            <input
              required
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label
              className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1.5"
              style={DISPLAY}
            >
              Start Time
            </label>
            <input
              required
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label
              className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1.5"
              style={DISPLAY}
            >
              End Time
            </label>
            <input
              required
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label
              className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1.5"
              style={DISPLAY}
            >
              Format
            </label>
            <div className="relative">
              <select
                name="matchType"
                value={formData.matchType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="5v5">5v5 Format</option>
                <option value="7v7">7v7 Format</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/40 text-xs">
                ▼
              </div>
            </div>
          </div>
          <div className="md:col-span-4 flex items-end justify-end mt-2">
            <button
              type="submit"
              className="bg-[#C8F55A] hover:bg-[#bada52] text-black font-bold py-3.5 px-8 rounded-xl transition-colors text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#C8F55A]/5 w-full sm:w-auto justify-center cursor-pointer"
              style={DISPLAY}
            >
              <Swords className="w-4 h-4" /> Publish Match to Hub
            </button>
          </div>
        </form>
      </div>

      {/* Matches Grid */}
      <div className="relative z-10">
        <h2
          className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3 mb-6"
          style={DISPLAY}
        >
          <span className="w-1.5 h-6 bg-[#C8F55A] rounded-full"></span>
          Global Directory
        </h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {matches.length === 0 ? (
            <p
              className="text-white/40 text-sm uppercase tracking-wider font-bold"
              style={DISPLAY}
            >
              No matches are currently active in the directory.
            </p>
          ) : (
            matches.map((m) => {
              const isOrganizer = currentUserId === m.organizerId;
              const homeScore = m.liveScore?.homeScore || 0;
              const awayScore = m.liveScore?.awayScore || 0;

              return (
                <div
                  key={m.id}
                  className="bg-[#12161A] rounded-2xl border border-white/5 shadow-xl flex flex-col justify-between overflow-hidden group hover:border-white/10 transition-all duration-200"
                >
                  {/* Card Info Area */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <h3
                        className="font-bold text-xl text-white group-hover:text-[#C8F55A] transition-colors uppercase tracking-wide line-clamp-1"
                        style={DISPLAY}
                      >
                        {m.title}
                      </h3>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-wider bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase"
                          style={DISPLAY}
                        >
                          <Users className="w-2.5 h-2.5" /> {m.matchType}
                        </span>
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase"
                          style={DISPLAY}
                        >
                          <Activity className="w-2.5 h-2.5" /> {m.skillReq}
                        </span>
                      </div>
                      
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/50">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-white/20" />{" "}
                        <span className="line-clamp-1">{m.location}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-white/20" />{" "}
                        <span>
                          {new Date(m.date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* LIVE TELEMETRY MATRIX NODE */}
                  <div className="bg-[#0B0C10] border-t border-b border-white/5 p-5 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-1.5 mb-3">
                      <Trophy className="w-3.5 h-3.5 text-[#C8F55A]" />
                      <span
                        className="text-[9px] font-bold text-white/30 uppercase tracking-widest"
                        style={DISPLAY}
                      >
                        Live Feed Score
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-10 w-full">
                      <div className="flex flex-col items-center">
                        <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1">
                          Squad Alpha
                        </span>
                        <span
                          className="text-4xl font-black text-white"
                          style={DISPLAY}
                        >
                          {homeScore}
                        </span>
                        {isOrganizer && (
                          <button
                            onClick={() =>
                              handleScoreUpdate(
                                m.id,
                                "HOME",
                                homeScore,
                                awayScore
                              )
                            }
                            className="mt-2 bg-white/5 border border-white/10 hover:border-[#C8F55A]/30 text-white hover:text-[#C8F55A] px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors"
                          >
                            +1 Goal
                          </button>
                        )}
                      </div>

                      <span
                        className="text-lg font-black text-white/10"
                        style={DISPLAY}
                      >
                        VS
                      </span>

                      <div className="flex flex-col items-center">
                        <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1">
                          Squad Bravo
                        </span>
                        <span
                          className="text-4xl font-black text-[#C8F55A]"
                          style={DISPLAY}
                        >
                          {awayScore}
                        </span>
                        {isOrganizer && (
                          <button
                            onClick={() =>
                              handleScoreUpdate(
                                m.id,
                                "AWAY",
                                homeScore,
                                awayScore
                              )
                            }
                            className="mt-2 bg-white/5 border border-white/10 hover:border-[#C8F55A]/30 text-white hover:text-[#C8F55A] px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors"
                          >
                            +1 Goal
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Trigger Node */}
                 {/* Interactive Trigger Node */}
                 <div className="p-4 bg-[#12161A] flex gap-3">
                    <button
                      onClick={() => handleJoinMatch(m.id)}
                      className="flex-1 bg-white/5 border border-white/10 hover:border-[#C8F55A]/30 text-white hover:text-[#C8F55A] py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                      style={DISPLAY}
                    >
                      <Flame className="w-3.5 h-3.5" /> Request Pitch Entry
                    </button>

                    {/* ONLY VISIBLE TO THE ORGANIZER */}
                    {isOrganizer && (
                      <button
                        onClick={() => handleDeleteMatch(m.id)}
                        className="bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-400 p-3 rounded-xl transition-all cursor-pointer group flex items-center justify-center"
                        title="Delete Match"
                      >
                        <Trash2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
