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
        console.error("Error fetching hub data:", err);
      }
    };
    fetchHubData();
  }, []);

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

    // Optimistic UI update
    setMatches((prevMatches) =>
      prevMatches.map((match) =>
        match.id === matchId
          ? {
              ...match,
              liveScore: {
                homeScore: newHome,
                awayScore: newAway,
              },
            }
          : match
      )
    );

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
    } catch (err) {
      console.error("Failed to sync score update with backend", err);
      // Rollback on failure
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

  const handleDeleteMatch = async (matchId: string) => {
    if (!confirm("Are you sure you want to permanently cancel and delete this match?"))
      return;

    try {
      const res = await apiClient.post("/api/player/matches/delete", {
        matchId,
      });
      if (res.data.success) {
        setMatches((prev) => prev.filter((match) => match.id !== matchId));
        setMessage({
          text: "Match successfully removed from directory.",
          type: "success",
        });
      }
    } catch (err) {
      console.error("Failed to delete match:", err);
      setMessage({
        text: "Failed to delete the match. Try again.",
        type: "error",
      });
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
      const res = await apiClient.post("/api/player/matches/join", {
        matchId,
      });
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
    "w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all appearance-none shadow-sm";

  return (
    <div
      className="min-h-screen pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8"
      style={{ backgroundColor: "var(--bcolor)" }}
    >
      {/* Header Bar */}
      <div
        className="flex justify-between items-center p-6 rounded-2xl border shadow-sm mt-6"
        style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
      >
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
            MATCH SCHEDULER
          </h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
            Manage live games or sign up for open slots.
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500"
            }`}
          />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
            {isConnected ? "Telemetry Active" : "Offline Mode"}
          </span>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div
          className={`p-4 rounded-xl font-bold text-xs uppercase tracking-wider border flex items-center gap-3 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Host Match Form */}
      <div
        className="p-6 md:p-8 rounded-2xl border shadow-sm space-y-6"
        style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
      >
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <PlusCircle className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold uppercase tracking-wide text-slate-900">
            Host a New Match
          </h2>
        </div>

        <form onSubmit={handleCreateMatch} className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="md:col-span-2">
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">
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
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">
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
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">
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
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">
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
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">
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
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>
          <div className="md:col-span-4 flex items-end justify-end mt-2">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-emerald-600/10 w-full sm:w-auto justify-center cursor-pointer"
            >
              <Swords className="w-4 h-4" /> Publish Match to Hub
            </button>
          </div>
        </form>
      </div>

      {/* Global Directory Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide flex items-center gap-3 mb-6">
          <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
          Global Directory
        </h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {matches.length === 0 ? (
            <p className="text-slate-500 text-sm uppercase tracking-wider font-semibold">
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
                  className="rounded-2xl border shadow-sm flex flex-col justify-between overflow-hidden group hover:shadow-md transition-all duration-200"
                  style={{
                    backgroundColor: "var(--ccolor)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  {/* Card Info Area */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight line-clamp-1">
                        {m.title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                          <Users className="w-3 h-3" /> {m.matchType}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                          <Activity className="w-3 h-3" /> {m.skillReq}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-slate-600">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="line-clamp-1">{m.location}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
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

                  {/* Score Matrix Node */}
                  <div className="bg-emerald-50/50 border-t border-b border-emerald-100/60 p-5 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Trophy className="w-4 h-4 text-emerald-600" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Live Score Matrix
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-12 w-full">
                      <div className="flex flex-col items-center">
                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                          Squad Alpha
                        </span>
                        <span className="text-3xl font-black text-slate-900">
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
                            className="mt-2 bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
                          >
                            +1 Goal
                          </button>
                        )}
                      </div>

                      <span className="text-base font-black text-slate-300">
                        VS
                      </span>

                      <div className="flex flex-col items-center">
                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                          Squad Bravo
                        </span>
                        <span className="text-3xl font-black text-emerald-600">
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
                            className="mt-2 bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
                          >
                            +1 Goal
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 flex gap-3">
                    <button
                      onClick={() => handleJoinMatch(m.id)}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Flame className="w-4 h-4 text-emerald-400" /> Request Pitch Entry
                    </button>

                    {isOrganizer && (
                      <button
                        onClick={() => handleDeleteMatch(m.id)}
                        className="bg-red-50 border border-red-200 hover:bg-red-600 hover:text-white text-red-600 p-3 rounded-xl transition-all cursor-pointer group flex items-center justify-center shadow-xs"
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