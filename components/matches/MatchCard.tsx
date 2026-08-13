"use client";

import {
  Users,
  Activity,
  MapPin,
  Calendar,
  Clock,
  Trophy,
  Flame,
  Trash2,
} from "lucide-react";

export interface LiveScore {
  homeScore: number;
  awayScore: number;
}

export interface Match {
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

interface MatchCardProps {
  match: Match;
  currentUserId: string | null;
  onJoinMatch: (matchId: string) => void;
  onDeleteMatch: (matchId: string) => void;
  onScoreUpdate: (
    matchId: string,
    team: "HOME" | "AWAY",
    currentHome: number,
    currentAway: number
  ) => void;
}

export default function MatchCard({
  match,
  currentUserId,
  onJoinMatch,
  onDeleteMatch,
  onScoreUpdate,
}: MatchCardProps) {
  const isOrganizer = currentUserId === match.organizerId;
  const homeScore = match.liveScore?.homeScore || 0;
  const awayScore = match.liveScore?.awayScore || 0;

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return null;

    if (timeStr.includes("T")) {
      const parsedDate = new Date(timeStr);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      }
    }

    const [hoursStr, minutesStr] = timeStr.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (isNaN(hours) || isNaN(minutes)) return timeStr;

    const dummyDate = new Date();
    dummyDate.setHours(hours, minutes, 0, 0);

    return dummyDate.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formattedStart = formatTime(match.startTime);
  const formattedEnd = formatTime(match.endTime);

  return (
    <div
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
                <Users className="w-3 h-3" /> {match.matchType}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                <Activity className="w-3 h-3" /> {match.skillReq}
              </span>
            </div>
            <h3 className="font-black text-lg text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight line-clamp-1">
              {match.title}
            </h3>
          </div>

          {isOrganizer && (
            <span className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shrink-0">
              Organizer
            </span>
          )}
        </div>

        {/* Venue Location, Date, and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-semibold text-slate-600">
          <p className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="line-clamp-1">{match.location}</span>
          </p>

          <p className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {new Date(match.date).toLocaleDateString(undefined, {
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
                  onScoreUpdate(match.id, "HOME", homeScore, awayScore)
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
                  onScoreUpdate(match.id, "AWAY", homeScore, awayScore)
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
          onClick={() => onJoinMatch(match.id)}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
        >
          <Flame className="w-4 h-4" /> Request Entry
        </button>

        {isOrganizer && (
          <button
            onClick={() => onDeleteMatch(match.id)}
            className="bg-red-50 border border-red-200 hover:bg-red-600 hover:text-white text-red-600 p-3 rounded-xl transition-all cursor-pointer group flex items-center justify-center"
            title="Delete Match"
          >
            <Trash2 className="w-4 h-4 transition-transform group-hover:scale-110" />
          </button>
        )}
      </div>
    </div>
  );
}