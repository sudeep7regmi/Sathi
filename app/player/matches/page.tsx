"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { apiClient } from "@/lib/axios";
import { useSocket } from "@/components/providers/SocketProvider";
import axios from "axios";
import {
  Plus,
  X,
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
  Search,
  Filter,
  Radio,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

interface LiveScore {
  homeScore: number;
  awayScore: number;
}

interface Match {
  id: string;
  organizerId: string;
  title: string;
  location: string;
  date: string;
  startTime?: string;
  endTime?: string;
  playerLimit: number;
  matchType: string;
  skillReq: string;
  status?: string;
  liveScore?: LiveScore;
}

export default function MatchHubPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // UI States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "MY_MATCHES" | "5v5" | "7v7">("ALL");

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

  // Real-time score telemetry
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

  // Safe time-only formatter (e.g., "14:30" or "14:30:00" -> "2:30 PM")
  const formatTime = (timeStr?: string) => {
    if (!timeStr) return null;
    
    // If it's already a full ISO date string, extract time or parse
    if (timeStr.includes("T")) {
      const parsedDate = new Date(timeStr);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: font12HourFormat(),
        });
      }
    }

    // Split "HH:MM" or "HH:MM:SS"
    const [hoursStr, minutesStr] = timeStr.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (isNaN(hours) || isNaN(minutes)) return timeStr;

    const dummyDate = new Date();
    dummyDate.setHours(hours, minutes, 0, 0);

    return dummyDate.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: font12HourFormat(),
    });
  };

  const font12HourFormat = () => true;

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
      // Rollback
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
        setMatches([res.data.match, ...matches]);
        setMessage({ text: "Match created and published!", type: "success" });
        setIsFormOpen(false);
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

  // Filter Logic
  const filteredMatches = matches.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === "MY_MATCHES") {
      return matchesSearch && m.organizerId === currentUserId;
    }
    if (selectedFilter === "5v5" || selectedFilter === "7v7") {
      return matchesSearch && m.matchType === selectedFilter;
    }

    return matchesSearch;
  });

  const inputClass =
    "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all appearance-none font-medium";

  return (
    <div
      className="min-h-screen pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8"
      style={{ backgroundColor: "var(--bcolor)" }}
    >
      {/* Dynamic Header */}
      <div
        className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 md:p-8 rounded-3xl border shadow-sm mt-6 gap-4"
        style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
              Matchmaking Hub
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900">
            Pitch Match Center
          </h1>
          <p className="text-xs md:text-sm font-medium text-slate-500 mt-1">
            Discover local fixtures, join open match slots, or host your own session.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Telemetry Status Indicator */}
          <div className="flex items-center gap-2 bg-slate-100/80 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isConnected ? "bg-emerald-500 animate-ping" : "bg-red-500"
              }`}
            />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {isConnected ? "Live Telemetry" : "Offline"}
            </span>
          </div>

          {/* Toggle Form Drawer Button */}
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex-1 md:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            {isFormOpen ? (
              <>
                <X className="w-4 h-4" /> Close Form
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Host a Match
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div
          className={`p-4 rounded-2xl font-bold text-xs uppercase tracking-wider border flex items-center justify-between gap-3 shadow-xs ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-red-50 text-red-900 border-red-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Host Match Collapsible Drawer Form */}
      {isFormOpen && (
        <div
          className="p-6 md:p-8 rounded-3xl border shadow-md space-y-6 animate-in fade-in slide-in-from-top-4 duration-300"
          style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <Swords className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold uppercase tracking-wide text-slate-900">
                  Configure Fixture Details
                </h2>
                <p className="text-xs text-slate-500 font-medium">Fill out match constraints to list it in the public hub.</p>
              </div>
            </div>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateMatch} className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="md:col-span-2">
              <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">
                Match Title / Heading
              </label>
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Weekend Champions Clash"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">
                Venue Location / Court Address
              </label>
              <input
                required
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Court or Futsal Arena name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">
                Match Date
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
                  <option value="5v5">5v5 Match Format</option>
                  <option value="7v7">7v7 Match Format</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            <div className="md:col-span-4 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-3 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-emerald-600/10 cursor-pointer"
              >
                Publish Fixture <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Controls & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search matches by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0 hidden md:block" />
            {(["ALL", "MY_MATCHES", "5v5", "7v7"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3.5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  selectedFilter === filter
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {filter === "ALL"
                  ? "All Matches"
                  : filter === "MY_MATCHES"
                  ? "My Hosted Games"
                  : filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div>
        {filteredMatches.length === 0 ? (
          <div
            className="rounded-3xl p-12 border text-center flex flex-col items-center justify-center space-y-3"
            style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
          >
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">
              No Matches Found
            </h3>
            <p className="text-slate-500 text-xs font-medium max-w-sm">
              We couldn&apos;t find any match records matching your criteria. Try adjusting your search query or host a new match.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredMatches.map((m) => {
              const isOrganizer = currentUserId === m.organizerId;
              const homeScore = m.liveScore?.homeScore || 0;
              const awayScore = m.liveScore?.awayScore || 0;

              const formattedStart = formatTime(m.startTime);
              const formattedEnd = formatTime(m.endTime);

              return (
                <div
                  key={m.id}
                  className="rounded-3xl border shadow-xs flex flex-col justify-between overflow-hidden group hover:shadow-md transition-all duration-200"
                  style={{
                    backgroundColor: "var(--ccolor)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  {/* Card Content Header */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                            <Users className="w-3 h-3" /> {m.matchType}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                            <Activity className="w-3 h-3" /> {m.skillReq}
                          </span>
                        </div>
                        <h3 className="font-black text-lg text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight line-clamp-1">
                          {m.title}
                        </h3>
                      </div>

                      {isOrganizer && (
                        <span className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shrink-0">
                          Organizer
                        </span>
                      )}
                    </div>

                    {/* Venue Location, Date, and Clean Start/End Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-semibold text-slate-600">
                      <p className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{m.location}</span>
                      </p>

                      <p className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          {new Date(m.date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </p>

                      <p className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          {formattedStart && formattedEnd
                            ? `${formattedStart} - ${formattedEnd}`
                            : formattedStart || formattedEnd || "TBD"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Stadium Scoreboard Node */}
                  <div className="bg-slate-900 text-white p-5 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="flex items-center gap-1.5 mb-3">
                      <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                        Match Score Tracker
                      </span>
                    </div>

                    <div className="flex items-center justify-around w-full max-w-xs">
                      {/* Squad Alpha */}
                      <div className="flex flex-col items-center space-y-1">
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                          Squad Alpha
                        </span>
                        <span className="text-3xl font-black text-white tracking-tight">
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
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            + Goal
                          </button>
                        )}
                      </div>

                      <span className="text-xs font-black text-slate-600 tracking-widest">
                        VS
                      </span>

                      {/* Squad Bravo */}
                      <div className="flex flex-col items-center space-y-1">
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                          Squad Bravo
                        </span>
                        <span className="text-3xl font-black text-emerald-400 tracking-tight">
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
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            + Goal
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Panel Footer */}
                  <div className="p-4 flex items-center gap-3 bg-slate-50/50">
                    <button
                      onClick={() => handleJoinMatch(m.id)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Flame className="w-4 h-4" /> Request Entry
                    </button>

                    {isOrganizer && (
                      <button
                        onClick={() => handleDeleteMatch(m.id)}
                        className="bg-red-50 border border-red-200 hover:bg-red-600 hover:text-white text-red-600 p-3 rounded-xl transition-all cursor-pointer group flex items-center justify-center"
                        title="Delete Match"
                      >
                        <Trash2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}