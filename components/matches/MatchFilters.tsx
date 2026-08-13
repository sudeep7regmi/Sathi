"use client";

import { Search, Filter } from "lucide-react";

export type FilterType = "ALL" | "MY_MATCHES" | "5v5" | "7v7";

interface MatchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function MatchFilters({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
}: MatchFiltersProps) {
  const filterOptions: FilterType[] = ["ALL", "MY_MATCHES", "5v5", "7v7"];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Box */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search matches by title or location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0 hidden md:block" />
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
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
  );
}