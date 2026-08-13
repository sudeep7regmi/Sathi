"use client";

import Link from "next/link";
import { Sparkles, Home, ArrowLeft, Construction } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors"
      style={{ backgroundColor: "var(--bcolor)", color: "var(--tcolor)" }}
    >
      <div className="max-w-md w-full text-center space-y-8">
        {/* Animated Badge & Icon */}
        <div className="relative inline-block">
          <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto text-emerald-600 shadow-sm relative z-10">
            <Construction className="w-10 h-10 animate-bounce" />
          </div>
          <div className="absolute -top-2 -right-2 bg-emerald-600 text-white p-1.5 rounded-full shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold uppercase tracking-wider">
            Coming Soon / 404
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">
            Under Construction
          </h1>

          <p className="text-slate-600 text-sm font-medium leading-relaxed max-w-sm mx-auto">
            The feature or page you are looking for is currently being built or does not exist yet. Check back soon for new updates on SATHI!
          </p>
        </div>

        {/* Action Buttons */}
        <div
          className="p-6 rounded-3xl border shadow-sm space-y-3"
          style={{
            backgroundColor: "var(--ccolor)",
            borderColor: "var(--border-color)",
          }}
        >
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20"
          >
            <Home className="w-4 h-4" />
            Back to Home Page
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            Go Back Previous Page
          </button>
        </div>

        {/* Subtle Footer Note */}
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
          SATHI Sports Platform • 2026
        </p>
      </div>
    </div>
  );
}