"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { apiClient } from "@/lib/axios";
import axios from "axios";
import {
  Layers,
  MapPin,
  Coins,
  Sparkles,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";

interface Ground {
  id: string;
  name: string;
  address: string;
  pricePerHour: number;
  amenities: string;
  description: string;
  owner: { futsalName: string; isVerified: boolean };
}

export default function BookGroundsPage() {
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroundId, setSelectedGroundId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const fetchGrounds = async () => {
      try {
        const res = await apiClient.get("/api/player/grounds");
        if (res.data.success) setGrounds(res.data.grounds);
      } catch (err) {
        console.error("Error fetching grounds:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrounds();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleBookingSubmit = async (e: FormEvent, groundId: string) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await apiClient.post("/api/player/grounds", {
        groundId,
        ...formData,
      });
      if (res.data.success) {
        setMessage({ text: "Reservation sent to owner!", type: "success" });
        setSelectedGroundId(null);
        setFormData({ date: "", startTime: "", endTime: "" });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err))
        setMessage({
          text: err.response?.data?.message || "Booking failed",
          type: "error",
        });
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center font-bold tracking-wider uppercase text-sm text-slate-700"
        style={{ backgroundColor: "var(--bcolor)" }}
      >
        <Loader2 className="animate-spin h-8 w-8 text-emerald-600 mr-3" />
        <span>Syncing Available Arenas...</span>
      </div>
    );
  }

  const inputClass =
    "w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-sm";

  return (
    <div
      className="space-y-8 pb-12 min-h-screen"
      style={{ backgroundColor: "var(--bcolor)", color: "var(--tcolor)" }}
    >
      {/* Premium Hero Banner Head */}
      <div 
        className="border rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden"
        style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl pointer-events-none" />
        <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-slate-900 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
          Book Futsal Arenas
        </h1>
        <p className="text-slate-500 text-sm mt-1 max-w-lg font-medium">
          Browse verified grounds, inspect facilities, and deploy match
          reservations directly onto the network ledger.
        </p>
      </div>

      {/* Telemetry Status Alerts */}
      {message && (
        <div
          className={`p-4 rounded-xl font-bold text-xs uppercase tracking-wider border flex items-center gap-3 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Grounds Matrix Registry Display Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {grounds.length === 0 ? (
          <p className="text-slate-500 text-sm uppercase tracking-wider font-semibold">
            No grounds are currently listed by hub owners.
          </p>
        ) : (
          grounds.map((ground) => (
            <div
              key={ground.id}
              className="rounded-2xl border shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md group"
              style={{
                backgroundColor: "var(--ccolor)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="p-6 md:p-8">
                {/* Header Info Section */}
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                      {ground.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{ground.address}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-700 font-bold flex items-center gap-1">
                        {ground.owner.futsalName}
                        {ground.owner.isVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-lg md:text-xl font-black text-emerald-600 flex items-center justify-end gap-1">
                      <Coins className="w-4 h-4 opacity-70" /> Rs.{" "}
                      {ground.pricePerHour}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      per hour
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-5 leading-relaxed line-clamp-2">
                  {ground.description}
                </p>

                {/* Amenities pills wrap */}
                <div className="mb-6 flex flex-wrap gap-1.5">
                  {ground.amenities.split(",").map((amenity, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                      {amenity.trim()}
                    </span>
                  ))}
                </div>

                {/* Conditional Booking Context Submenu Dropdown Container */}
                {selectedGroundId === ground.id ? (
                  <form
                    onSubmit={(e) => handleBookingSubmit(e, ground.id)}
                    className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 shadow-inner"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">
                          Date
                        </label>
                        <input
                          required
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">
                          Start Time
                        </label>
                        <input
                          required
                          type="time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">
                          End Time
                        </label>
                        <input
                          required
                          type="time"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2.5 pt-1">
                      <button
                        type="submit"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <CalendarDays className="w-3.5 h-3.5" /> Confirm Booking
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedGroundId(null)}
                        className="px-4 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setSelectedGroundId(ground.id)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Clock className="w-3.5 h-3.5 text-emerald-400" /> Reserve Arena
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}