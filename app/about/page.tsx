"use client";

import React from "react";
import {
  Trophy,
  Users,
  MapPin,
  Mail,
  Target,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Built for Players & Arenas
          </span>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            Connecting Athletes, <br />
            <span className="text-emerald-500">Powering Play.</span>
          </h1>

          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base font-medium leading-relaxed">
            SATHI is Nepal’s premier sports coordination and futsal platform —
            designed to eliminate booking hassles, bring local players together,
            and modernize sports venue management.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-12">
        {/* Core Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Seamless</h3>
              <p className="text-xs font-semibold text-slate-500">
                Futsal & Court Bookings
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Community</h3>
              <p className="text-xs font-semibold text-slate-500">
                Player Matching & Teams
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Trusted</h3>
              <p className="text-xs font-semibold text-slate-500">
                Verified Venue Owners
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-emerald-600 text-xs font-black uppercase tracking-wider">
              <Target className="w-4 h-4" /> Our Purpose
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
              Why We Built SATHI
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              Finding an available futsal court or organizing a full squad
              shouldn&apos;t require dozens of phone calls. SATHI was founded to
              solve real operational friction for sports enthusiasts and ground
              owners across Nepal.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              Whether you are an individual player looking for match-ups, a team
              searching for an open slot, or a venue owner managing multiple
              pitches, SATHI provides simple, real-time tools to keep game days
              running smoothly.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Key Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            <div className="space-y-2">
              <h4 className="font-extrabold text-sm uppercase text-slate-900 tracking-tight">
                Instant Scheduling
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-normal">
                Check real-time slot availability, reserve courts instantly, and
                lock in your playtime.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-sm uppercase text-slate-900 tracking-tight">
                Owner Dashboard
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-normal">
                Powerful administration tools for futsal owners to track
                revenue, manage rates, and oversee active pitches.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-sm uppercase text-slate-900 tracking-tight">
                Local Ecosystem
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-normal">
                Tailored for local payment workflows, location-based court
                discovery, and community engagement.
              </p>
            </div>
          </div>
        </section>

        {/* Contact & Location Footer Banner */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">
              Get in Touch
            </span>
            <h3 className="text-2xl font-black uppercase tracking-tight">
              Have Questions or Want to Partner?
            </h3>
            <p className="text-slate-400 text-xs font-medium max-w-md">
              We are constantly expanding our partner network. Reach out
              directly to discuss listings, feedback, or integration.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4 text-xs font-bold text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pokhara, Nepal</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="mailto:sathiproject@devbhujel.com.np"
                  className="hover:text-emerald-400 transition-colors"
                >
                  sathiproject@devbhujel.com.np
                </a>
              </div>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-xs"
            >
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
