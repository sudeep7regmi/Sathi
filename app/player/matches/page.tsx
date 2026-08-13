"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { apiClient } from "@/lib/axios";
import { useSocket } from "@/components/providers/SocketProvider";
import axios from "axios";
import { CheckCircle2, AlertTriangle, X, ShieldAlert } from "lucide-react";

import MatchHubHeader from "@/components/matches/MatchHubHeader";
import MatchForm, { MatchFormData } from "@/components/matches/MatchForm";
import MatchFilters, { FilterType } from "@/components/matches/MatchFilters";
import MatchCard, { Match } from "@/components/matches/MatchCard";

export default function MatchHubPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // UI States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("ALL");

  const [formData, setFormData] = useState<MatchFormData>({
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
    if (
      !confirm(
        "Are you sure you want to permanently cancel and delete this match?"
      )
    )
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

  return (
    <div
      className="min-h-screen pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8"
      style={{ backgroundColor: "var(--bcolor)" }}
    >
      {/* Dynamic Header */}
      <MatchHubHeader
        isConnected={isConnected}
        isFormOpen={isFormOpen}
        onToggleForm={() => setIsFormOpen(!isFormOpen)}
      />

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
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Host Match Collapsible Drawer Form */}
      {isFormOpen && (
        <MatchForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleCreateMatch}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {/* Controls & Filter Bar */}
      <MatchFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      {/* Directory Grid */}
      <div>
        {filteredMatches.length === 0 ? (
          <div
            className="rounded-3xl p-12 border text-center flex flex-col items-center justify-center space-y-3"
            style={{
              backgroundColor: "var(--ccolor)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">
              No Matches Found
            </h3>
            <p className="text-slate-500 text-xs font-medium max-w-sm">
              We couldn&apos;t find any match records matching your criteria. Try
              adjusting your search query or host a new match.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredMatches.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                currentUserId={currentUserId}
                onJoinMatch={handleJoinMatch}
                onDeleteMatch={handleDeleteMatch}
                onScoreUpdate={handleScoreUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}