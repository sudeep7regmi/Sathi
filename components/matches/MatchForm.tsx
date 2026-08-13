"use client";

import { FormEvent, ChangeEvent } from "react";
import { Swords, X, ChevronRight } from "lucide-react";

export interface MatchFormData {
  title: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  playerLimit: string;
  matchType: string;
  skillReq: string;
}

interface MatchFormProps {
  formData: MatchFormData;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
}

const inputClass =
  "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all appearance-none font-medium";

export default function MatchForm({
  formData,
  onChange,
  onSubmit,
  onClose,
}: MatchFormProps) {
  return (
    <div
      className="p-6 md:p-8 rounded-3xl border shadow-md space-y-6 animate-in fade-in slide-in-from-top-4 duration-300"
      style={{
        backgroundColor: "var(--ccolor)",
        borderColor: "var(--border-color)",
      }}
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
            <p className="text-xs text-slate-500 font-medium">
              Fill out match constraints to list it in the public hub.
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="md:col-span-2">
          <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">
            Match Title / Heading
          </label>
          <input
            required
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
              onChange={onChange}
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
            onClick={onClose}
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
  );
}