"use client";

import { Coins, Clock, Layers } from "lucide-react";

interface MetricsProps {
  totalRevenue: number;
  totalCompletedBookings: number;
  activeGroundsCount: number;
}

export default function MetricsGrid({
  totalRevenue,
  totalCompletedBookings,
  activeGroundsCount,
}: MetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Revenue Card */}
      <div
        className="p-6 rounded-3xl border shadow-xs group hover:shadow-md transition-all duration-200 space-y-2"
        style={{
          backgroundColor: "var(--ccolor)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
            <Coins className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider">
            Earned
          </span>
        </div>
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pt-2">
          Total Revenue Generated
        </h3>
        <p className="text-3xl font-black text-emerald-600 tracking-tight">
          Rs. {totalRevenue.toLocaleString()}
        </p>
      </div>

      {/* Completed Bookings Card */}
      <div
        className="p-6 rounded-3xl border shadow-xs group hover:shadow-md transition-all duration-200 space-y-2"
        style={{
          backgroundColor: "var(--ccolor)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">
            Fulfilled
          </span>
        </div>
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pt-2">
          Completed Bookings
        </h3>
        <p className="text-3xl font-black text-slate-900 tracking-tight">
          {totalCompletedBookings}
        </p>
      </div>

      {/* Active Grounds Card */}
      <div
        className="p-6 rounded-3xl border shadow-xs group hover:shadow-md transition-all duration-200 space-y-2"
        style={{
          backgroundColor: "var(--ccolor)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider">
            Configured
          </span>
        </div>
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pt-2">
          Active Ground Arenas
        </h3>
        <p className="text-3xl font-black text-slate-900 tracking-tight">
          {activeGroundsCount}
        </p>
      </div>
    </div>
  );
}