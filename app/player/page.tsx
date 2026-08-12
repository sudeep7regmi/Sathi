"use client";

import { useState, useEffect, useMemo } from "react";
import { apiClient } from "@/lib/axios";
import axios from "axios";
import {
  Trophy,
  Tv,
  User,
  Activity,
  Calendar,
  MapPin,
  Clock,
  Loader2,
  Target,
  Dumbbell,
  Compass,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Coins,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type BookingStatus = "ALL" | "APPROVED" | "PENDING" | "REJECTED" | "COMPLETED";

interface PlayerProfile {
  fullName: string;
  preferredPosition: string; // e.g. "Midfielder", "Forward", "Defender", "Goalkeeper", "Pivot", "Flank"
  skillLevel: string;
  rating: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  goals: number;
  assists: number;
  location: string;
}

interface PlayerBooking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration?: number;
  totalCost: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  ground: {
    name: string;
    address: string;
  };
}

// Helper to provide position-specific tactical drills and positioning metadata
const getPositionTactics = (position: string = "Midfielder") => {
  const pos = position.toLowerCase();

  if (pos.includes("mid") || pos.includes("flank") || pos.includes("winger")) {
    return {
      roleTitle: "Midfield / Flank Engine",
      pitchPosition: "top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2",
      primaryFocus: "Pace, Passing & Transition Speed",
      drills: [
        { name: "1v1 High-Intensity Pressing", sets: "4 Sets × 3 mins" },
        { name: "Futsal Parallel & Diagonal Runs", sets: "5 Sets × 10 reps" },
        { name: "Quick One-Touch Wall Passes", sets: "3 Sets × 15 reps" },
      ],
      tacticalAdvice:
        "Maintain width during buildup, then quickly tuck inward to overload central space or support the pivot.",
    };
  }

  if (
    pos.includes("forward") ||
    pos.includes("striker") ||
    pos.includes("pivot")
  ) {
    return {
      roleTitle: "Target Pivot / Finisher",
      pitchPosition: "top-[20%] left-[50%] -translate-x-1/2",
      primaryFocus: "Hold-up Play & First-Time Shooting",
      drills: [
        { name: "Back-to-Goal Hold-up & Turn", sets: "4 Sets × 8 reps" },
        { name: "Toe-Poke & Quick Release Shots", sets: "5 Sets × 10 shots" },
        { name: "Counter-Attack Acceleration", sets: "6 Sets × 20m" },
      ],
      tacticalAdvice:
        "Pin the deepest defender to create space behind for incoming midfielders.",
    };
  }

  if (
    pos.includes("def") ||
    pos.includes("back") ||
    pos.includes("fibo") ||
    pos.includes("fixo")
  ) {
    return {
      roleTitle: "Fixo / Defensive Anchor",
      pitchPosition: "top-[70%] left-[50%] -translate-x-1/2",
      primaryFocus: "Interceptions & Defensive Structure",
      drills: [
        { name: "Lateral Shuffling & Jockeying", sets: "4 Sets × 2 mins" },
        { name: "3v2 Counter Breakdown Drills", sets: "5 Rotations" },
        { name: "Long Ball Distribution & Reset", sets: "3 Sets × 12 passes" },
      ],
      tacticalAdvice:
        "Stay centered when out of possession and dictate the defensive tempo without overcommitting.",
    };
  }

  if (pos.includes("gk") || pos.includes("goal") || pos.includes("keeper")) {
    return {
      roleTitle: "Goalkeeper / Sweeper Keeper",
      pitchPosition: "top-[88%] left-[50%] -translate-x-1/2",
      primaryFocus: "Reflexes, Distribution & Block Coverage",
      drills: [
        { name: "Reaction Block & Spread Saves", sets: "5 Sets × 10 reps" },
        { name: "Underhand Throw Distribution", sets: "4 Sets × 12 throws" },
        { name: "1v1 Close-range Angles", sets: "4 Sets × 6 reps" },
      ],
      tacticalAdvice:
        "Act as the outfield fifth player during build-up and communicate pitch shifts aggressively.",
    };
  }

  return {
    roleTitle: "Utility Player",
    pitchPosition: "top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2",
    primaryFocus: "Tactical Awareness & Balanced Movement",
    drills: [
      { name: "High-Tempo Interval Shuttle Runs", sets: "4 Sets × 4 mins" },
      { name: "Spatial Awareness Passing Triangle", sets: "4 Sets × 12 reps" },
    ],
    tacticalAdvice:
      "Balance your positioning based on the team movement and fill open pitch channels.",
  };
};

export default function PlayerDashboardHome() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [bookings, setBookings] = useState<PlayerBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Status Filter and List Expansion States
  const [statusFilter, setStatusFilter] = useState<BookingStatus>("ALL");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        const response = await apiClient.get<{
          success: boolean;
          profile: PlayerProfile;
          bookings?: PlayerBooking[];
          matches?: PlayerBooking[];
        }>("/api/player/dashboard");

        if (response.data.success) {
          setProfile(response.data.profile);
          setBookings(response.data.bookings || response.data.matches || []);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error(
            "Dashboard fetch error:",
            err.response?.data?.message || err.message
          );
        } else {
          console.error("Dashboard fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardMetrics();
  }, []);

  // Compute status counts dynamically
  const counts = useMemo(() => {
    return {
      ALL: bookings.length,
      APPROVED: bookings.filter((b) => b.status === "APPROVED").length,
      PENDING: bookings.filter((b) => b.status === "PENDING").length,
      REJECTED: bookings.filter((b) => b.status === "REJECTED").length,
      COMPLETED: bookings.filter((b) => b.status === "COMPLETED").length,
    };
  }, [bookings]);

  // Compute filtered list based on active tab
  const filteredBookings = useMemo(() => {
    if (statusFilter === "ALL") return bookings;
    return bookings.filter((b) => b.status === statusFilter);
  }, [bookings, statusFilter]);

  // Slice list for clean presentation (Default: top 3)
  const displayedBookings = isExpanded
    ? filteredBookings
    : filteredBookings.slice(0, 3);

  const handleDeleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const formatTimeString = (timeStr: string): string => {
    if (!timeStr) return "TBD";
    if (timeStr.includes("T")) {
      const dateObj = new Date(timeStr);
      return isNaN(dateObj.getTime())
        ? timeStr
        : dateObj.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
    }
    const [hours, minutes] = timeStr.split(":");
    if (!hours || !minutes) return timeStr;
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHours = h % 12 || 12;
    return `${formattedHours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  };

  if (loading)
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        style={{ backgroundColor: "var(--bcolor)" }}
      >
        <Loader2 className="animate-spin h-10 w-10 text-emerald-600" />
      </div>
    );

  if (!profile) return null;

  const tactics = getPositionTactics(profile.preferredPosition);

  return (
    <div
      className="space-y-8 pb-12 min-h-screen"
      style={{ backgroundColor: "var(--bcolor)", color: "var(--tcolor)" }}
    >
      {/* Hero Banner */}
      <div
        className="relative overflow-hidden border rounded-3xl p-8 md:p-10 shadow-sm"
        style={{
          backgroundColor: "var(--ccolor)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-slate-900 mb-3">
            Welcome back, {profile.fullName.split(" ")[0]}!
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
            You are currently ranked as an{" "}
            <span className="text-emerald-600 font-bold uppercase">
              {profile.skillLevel}
            </span>{" "}
            player in{" "}
            <span className="text-slate-900 font-semibold">
              {profile.location}
            </span>
            . Ready to hit the pitch?
          </p>
        </div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-100 rounded-full blur-3xl pointer-events-none opacity-60"></div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: "Matches Played", value: profile.matchesPlayed, icon: Tv },
          { label: "Goals Scored", value: profile.goals, icon: Activity },
          {
            label: "Preferred Role",
            value: profile.preferredPosition,
            icon: User,
          },
          {
            label: "Win Record",
            value: `${profile.wins}W - ${profile.losses}L`,
            icon: Trophy,
          },
        ].map((stat, i) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={i}
              className="border p-6 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md group"
              style={{
                backgroundColor: "var(--ccolor)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <IconComponent className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-2xl font-black mt-1 text-slate-900 group-hover:text-emerald-600 transition-colors">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upcoming Matches & Reservation Status */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-xl font-bold uppercase tracking-wide text-slate-900 flex items-center">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3"></span>
                Upcoming Matches & Active Reservations
              </h2>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider self-start sm:self-auto">
                {filteredBookings.length}{" "}
                {filteredBookings.length === 1 ? "Match" : "Matches"}
              </span>
            </div>

            {/* Filter Tabs Bar */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
              <button
                onClick={() => setStatusFilter("ALL")}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === "ALL"
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All <span className="text-[10px] opacity-75">({counts.ALL})</span>
              </button>

              <button
                onClick={() => setStatusFilter("APPROVED")}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === "APPROVED"
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                Confirmed{" "}
                <span className="text-[10px] opacity-80">({counts.APPROVED})</span>
              </button>

              <button
                onClick={() => setStatusFilter("PENDING")}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === "PENDING"
                    ? "bg-amber-500 text-white shadow-2xs"
                    : "text-amber-700 hover:bg-amber-50"
                }`}
              >
                Pending{" "}
                <span className="text-[10px] opacity-80">({counts.PENDING})</span>
              </button>

              <button
                onClick={() => setStatusFilter("REJECTED")}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === "REJECTED"
                    ? "bg-red-600 text-white shadow-2xs"
                    : "text-red-600 hover:bg-red-50"
                }`}
              >
                Declined{" "}
                {counts.REJECTED > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                )}
                <span className="text-[10px] opacity-80">({counts.REJECTED})</span>
              </button>
            </div>

            {/* Empty State */}
            {filteredBookings.length === 0 ? (
              <div
                className="rounded-2xl p-10 border text-center flex flex-col items-center justify-center shadow-sm"
                style={{
                  backgroundColor: "var(--ccolor)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center mb-3 text-slate-400">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 uppercase tracking-wide text-sm">
                  No matches found under &quot;{statusFilter.toLowerCase()}&quot;
                </h3>
                <p className="text-slate-500 text-xs mt-1 max-w-sm">
                  Change your status filter tab or reserve a court from the
                  grounds directory.
                </p>
              </div>
            ) : (
              /* Bookings Cards List */
              <div className="space-y-3">
                {displayedBookings.map((booking) => {
                  const bookingDate = new Date(booking.date);
                  const formattedDate = isNaN(bookingDate.getTime())
                    ? booking.date
                    : bookingDate;
                  const startTimeStr = formatTimeString(booking.startTime);
                  const endTimeStr = booking.endTime
                    ? formatTimeString(booking.endTime)
                    : "";

                  return (
                    <div
                      key={booking.id}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 shadow-2xs hover:shadow-xs group ${
                        booking.status === "REJECTED"
                          ? "bg-red-50/20 border-red-200/60"
                          : ""
                      }`}
                      style={{
                        backgroundColor:
                          booking.status === "REJECTED"
                            ? undefined
                            : "var(--ccolor)",
                        borderColor:
                          booking.status === "REJECTED"
                            ? undefined
                            : "var(--border-color)",
                      }}
                    >
                      <div className="flex items-start space-x-3.5">
                        {/* Compact Date Card */}
                        <div
                          className={`w-12 h-12 border rounded-xl flex flex-col items-center justify-center shrink-0 ${
                            booking.status === "REJECTED"
                              ? "bg-red-50 border-red-200 text-red-700"
                              : "bg-emerald-50 border-emerald-100 text-emerald-700"
                          }`}
                        >
                          <span className="text-[9px] font-ex trabold uppercase tracking-widest">
                            {typeof formattedDate === "string"
                              ? "DATE"
                              : formattedDate.toLocaleString("default", {
                                  month: "short",
                                })}
                          </span>
                          <span className="text-lg font-black leading-none text-slate-900 mt-0.5">
                            {typeof formattedDate === "string"
                              ? "—"
                              : formattedDate.getDate()}
                          </span>
                        </div>

                        {/* Booking Details */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors text-sm uppercase tracking-tight">
                              {booking.ground?.name ||
                                "Futsal Match Reservation"}
                            </h3>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
                            {booking.ground?.address && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                {booking.ground.address}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-slate-700 font-semibold">
                              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              {startTimeStr}{" "}
                              {endTimeStr ? `- ${endTimeStr}` : ""}
                            </span>
                            <span className="flex items-center gap-1 text-emerald-600 font-extrabold">
                              <Coins className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              Rs. {booking.totalCost}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action & Status Badge */}
                      <div className="self-start sm:self-auto shrink-0 flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border ${
                            booking.status === "PENDING"
                              ? "bg-amber-50 border-amber-200 text-amber-700"
                              : booking.status === "APPROVED"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : booking.status === "COMPLETED"
                              ? "bg-blue-50 border-blue-200 text-blue-700"
                              : "bg-red-100 border-red-300 text-red-800"
                          }`}
                        >
                          {booking.status === "PENDING" && (
                            <>
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                              Pending Review
                            </>
                          )}
                          {booking.status === "APPROVED" && (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Confirmed Match
                            </>
                          )}
                          {booking.status === "COMPLETED" && (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                              Match Completed
                            </>
                          )}
                          {booking.status === "REJECTED" && (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-red-600" />
                              Declined / Canceled
                            </>
                          )}
                        </span>

                        {/* Clear/Delete Button for Rejected or Completed Entries */}
                        {(booking.status === "REJECTED" ||
                          booking.status === "COMPLETED") && (
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            title="Dismiss from list"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Expand / Collapse Toggle Button */}
                {filteredBookings.length > 3 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-extrabold uppercase tracking-wider text-slate-600 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4 text-slate-500" /> Show
                        Fewer Matches
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 text-slate-500" /> Show
                        All ({filteredBookings.length - 3} more)
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Dynamic Tactical Training Drills */}
          <div
            className="p-6 rounded-2xl border shadow-sm space-y-4"
            style={{
              backgroundColor: "var(--ccolor)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-emerald-600" /> Recommended
                Drills ({profile.preferredPosition})
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                {tactics.primaryFocus}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {tactics.drills.map((drill, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl space-y-1"
                >
                  <p className="text-xs font-bold text-slate-900 leading-snug">
                    {drill.name}
                  </p>
                  <p className="text-[11px] font-semibold text-emerald-600">
                    {drill.sets}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50/60 border border-emerald-100/80 p-3.5 rounded-xl flex items-start gap-3">
              <Compass className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                <strong className="text-slate-900 uppercase text-[10px] block tracking-wider mb-0.5">
                  Tactical Positioning Note
                </strong>
                {tactics.tacticalAdvice}
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column: Tactical Pitch Diagram */}
        <div className="space-y-6">
          <div
            className="p-6 rounded-2xl border shadow-sm space-y-4"
            style={{
              backgroundColor: "var(--ccolor)",
              borderColor: "var(--border-color)",
            }}
          >
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-600" /> Tactical Pitch
              Zone
            </h3>

            {/* Futsal Court Mini Diagram */}
            <div className="relative w-full h-48 bg-emerald-800 rounded-xl border-2 border-emerald-600 p-2 overflow-hidden flex flex-col justify-between shadow-inner">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="w-24 h-10 border-b-2 border-x-2 border-white/30 rounded-b-full mx-auto"></div>
              <div className="w-24 h-10 border-t-2 border-x-2 border-white/30 rounded-t-full mx-auto"></div>

              {/* Position Marker */}
              <div
                className={`absolute ${tactics.pitchPosition} transition-all duration-500`}
              >
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400 opacity-75"></span>
                  <div className="relative w-7 h-7 bg-white text-emerald-800 rounded-full border-2 border-emerald-600 flex items-center justify-center font-black text-[10px] shadow-md">
                    {profile.preferredPosition.substring(0, 2).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Assigned Role
              </span>
              <span className="text-sm font-extrabold text-slate-900">
                {tactics.roleTitle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}