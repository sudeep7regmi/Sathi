"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, X, Loader2, ChevronLeft, ChevronRight, User, Target } from "lucide-react";
import Link from "next/link";

export interface PlayerSearchResult {
  id: string;
  fullName: string;
  preferredPosition?: string;
  skillLevel?: string;
  goals?: number;
  assists?: number;
  user?: {
    email: string;
    isVerified: boolean;
  };
}

interface PlayerSearchProps {
  className?: string;
  onSelectPlayer?: (player: PlayerSearchResult) => void;
  limit?: number;
}

export default function PlayerSearch({
  className = "max-w-md",
  onSelectPlayer,
  limit = 5,
}: PlayerSearchProps) {
  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState<PlayerSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit,
    total: 0,
    totalPage: 1,
  });

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    setPage(1);

    if (!val.trim()) {
      setPlayers([]);
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    setPlayers([]);
    setIsSearching(false);
    setPage(1);
  };

  useEffect(() => {
    const trimmedQuery = search.trim();
    if (!trimmedQuery) return;

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `/api/players?page=${page}&limit=${limit}&search=${encodeURIComponent(
            trimmedQuery
          )}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Failed to search players");

        const data = await res.json();
        setPlayers(data.players || data.data || []);
        setPagination(
          data.pagination || { page: 1, limit, total: 0, totalPage: 1 }
        );
      } catch (err) {
        console.error("Error fetching players:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, page, limit]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchContainerRef} className={`relative w-full ${className}`}>
      {/* Light Theme Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onFocus={() => setIsFocused(true)}
          onChange={handleSearchChange}
          placeholder="SEARCH PLAYERS BY NAME, POSITION..."
          className="w-full rounded-full border border-slate-200 bg-white/90 py-2 pl-10 pr-9 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs tracking-wider uppercase"
        />
        {search && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3 rounded-full p-0.5 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Light Theme Dropdown Window */}
      {isFocused && search.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-slate-200 bg-white/95 shadow-xl z-50 overflow-hidden backdrop-blur-md">
          {isSearching ? (
            <div className="flex items-center justify-center p-6 text-xs font-bold text-emerald-600 gap-2 tracking-widest uppercase">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
              Searching Players...
            </div>
          ) : players.length > 0 ? (
            <div className="py-1 divide-y divide-slate-100">
              <div className="max-h-64 overflow-y-auto">
                {players.map((player) => (
                  <Link
                    key={player.id}
                    href={`/player/profile/${player.id}`}
                    onClick={() => {
                      setIsFocused(false);
                      if (onSelectPlayer) onSelectPlayer(player);
                    }}
                    className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors truncate uppercase">
                          {player.fullName || "Unnamed Player"}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider truncate flex items-center gap-1.5 font-semibold">
                          <span>{player.preferredPosition || "Forward"}</span>
                          {player.skillLevel && (
                            <span className="text-emerald-600">
                              • {player.skillLevel}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Stats Highlights */}
                    <div className="flex items-center gap-2.5 shrink-0 text-right">
                      <div className="flex items-center gap-1 text-[11px] font-black text-slate-700">
                        <Target className="w-3 h-3 text-emerald-600" />
                        <span>{player.goals || 0}G</span>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200">
                        Profile
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Light Pagination Bar */}
              {pagination.totalPage > 1 && (
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/80 text-[10px] font-bold text-slate-500 tracking-widest uppercase border-t border-slate-100">
                  <span>
                    PAGE {pagination.page} OF {pagination.totalPage}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() => setPage((prev) => prev - 1)}
                      className="p-1 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={page >= pagination.totalPage}
                      onClick={() => setPage((prev) => prev + 1)}
                      className="p-1 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 disabled:opacity-40 transition-colors"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              No matching players found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}