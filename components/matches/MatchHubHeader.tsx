"use client";

import { Radio, Plus, X } from "lucide-react";

interface MatchHubHeaderProps {
  isConnected: boolean;
  isFormOpen: boolean;
  onToggleForm: () => void;
}

export default function MatchHubHeader({
  isConnected,
  isFormOpen,
  onToggleForm,
}: MatchHubHeaderProps) {
  return (
    <div
      className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 md:p-8 rounded-3xl border shadow-sm mt-6 gap-4"
      style={{
        backgroundColor: "var(--ccolor)",
        borderColor: "var(--border-color)",
      }}
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
          
          <span className="text-[11px] font-bold uppercase tracking-wider">
            {isConnected ? "Live Telemetry" : "Offline"}
          </span>
        </div>

        {/* Toggle Form Drawer Button */}
        <button
          onClick={onToggleForm}
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
  );
}