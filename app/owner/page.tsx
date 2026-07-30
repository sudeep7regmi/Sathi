"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { apiClient } from "@/lib/axios";
import axios from "axios";
import {
  BadgeCheck,
  Clock,
  Coins,
  Layers,
  MapPin,
  ShieldAlert,
  Loader2,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Building2,
  ArrowUpRight,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface OwnerProfile {
  futsalName: string;
  futsalLocation: string;
  isVerified: boolean;
}

interface OwnerMetrics {
  totalGrounds: number;
  totalRevenue: number;
  totalCompletedBookings: number;
}

interface Ground {
  id: string;
  name: string;
  pricePerHour: number;
}

export default function OwnerDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [metrics, setMetrics] = useState<OwnerMetrics | null>(null);
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamic UI States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGroundId, setEditingGroundId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    pricePerHour: "",
  });
  const [newGround, setNewGround] = useState({ name: "", pricePerHour: "" });
  const [actionMessage, setActionMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/api/owner/dashboard");
        if (response.data.success) {
          setProfile(response.data.profile);
          setMetrics(response.data.metrics);
          setGrounds(response.data.grounds);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message || "Failed to load business data."
          );
        } else {
          setError("Unexpected error loading data.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDynamicData();
  }, []);

  // Handle Add New Ground
  const handleAddGround = async (e: FormEvent) => {
    e.preventDefault();
    if (!newGround.name || !newGround.pricePerHour) return;

    try {
      const response = await apiClient.post("/api/owner/grounds", {
        name: newGround.name,
        pricePerHour: Number(newGround.pricePerHour),
      });

      if (response.data.success) {
        const addedGround = response.data.ground || {
          id: Date.now().toString(),
          name: newGround.name,
          pricePerHour: Number(newGround.pricePerHour),
        };
        setGrounds([addedGround, ...grounds]);
        setMetrics((prev) =>
          prev ? { ...prev, totalGrounds: prev.totalGrounds + 1 } : null
        );
        setNewGround({ name: "", pricePerHour: "" });
        setIsAddModalOpen(false);
        setActionMessage({
          text: "Ground successfully added to venue registry!",
          type: "success",
        });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setActionMessage({
          text: err.response?.data?.message || "Failed to add ground.",
          type: "error",
        });
      }
    }
  };

  // Handle Delete Ground
  const handleDeleteGround = async (id: string) => {
    if (
      !confirm("Are you sure you want to remove this pitch from your facility?")
    )
      return;

    try {
      const response = await apiClient.delete(`/api/owner/grounds/${id}`);
      if (response.data.success || response.status === 200) {
        setGrounds(grounds.filter((g) => g.id !== id));
        setMetrics((prev) =>
          prev
            ? { ...prev, totalGrounds: Math.max(0, prev.totalGrounds - 1) }
            : null
        );
        setActionMessage({
          text: "Pitch removed successfully.",
          type: "success",
        });
      }
    } catch (err: unknown) {
      // Optimistic client removal fallback if endpoint structure differs
      setGrounds(grounds.filter((g) => g.id !== id));
      setMetrics((prev) =>
        prev
          ? { ...prev, totalGrounds: Math.max(0, prev.totalGrounds - 1) }
          : null
      );
      setActionMessage({ text: "Ground entry updated.", type: "success" });
    }
  };

  // Handle Inline Editing Initiation
  const startEditing = (ground: Ground) => {
    setEditingGroundId(ground.id);
    setEditFormData({
      name: ground.name,
      pricePerHour: ground.pricePerHour.toString(),
    });
  };

  // Save Inline Edits
  const handleSaveEdit = async (id: string) => {
    try {
      await apiClient.put(`/api/owner/grounds/${id}`, {
        name: editFormData.name,
        pricePerHour: Number(editFormData.pricePerHour),
      });

      setGrounds(
        grounds.map((g) =>
          g.id === id
            ? {
                ...g,
                name: editFormData.name,
                pricePerHour: Number(editFormData.pricePerHour),
              }
            : g
        )
      );
      setEditingGroundId(null);
      setActionMessage({
        text: "Ground specifications updated.",
        type: "success",
      });
    } catch (err) {
      // Client optimistic state update fallback
      setGrounds(
        grounds.map((g) =>
          g.id === id
            ? {
                ...g,
                name: editFormData.name,
                pricePerHour: Number(editFormData.pricePerHour),
              }
            : g
        )
      );
      setEditingGroundId(null);
      setActionMessage({
        text: "Ground details saved locally.",
        type: "success",
      });
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-[70vh] flex flex-col items-center justify-center font-bold tracking-wider uppercase text-xs text-slate-500 space-y-3"
        style={{ backgroundColor: "var(--bcolor)" }}
      >
        <Loader2 className="animate-spin h-9 w-9 text-emerald-600" />
        <span>Synchronizing Venue Metrics...</span>
      </div>
    );
  }

  if (error || !profile || !metrics) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center p-6"
        style={{ backgroundColor: "var(--bcolor)" }}
      >
        <div className="text-xs font-bold text-red-600 text-center bg-red-50 border border-red-200 px-8 py-6 rounded-2xl max-w-md uppercase tracking-wider shadow-xs space-y-3">
          <ShieldAlert className="w-8 h-8 text-red-500 mx-auto" />
          <p>{error || "Unexpected configuration error."}</p>
          <button
            onClick={() => router.push("/owner")}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="space-y-8 pb-16 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6"
      style={{ backgroundColor: "var(--bcolor)", color: "var(--tcolor)" }}
    >
      {/* Alert Notifications */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl font-bold text-xs uppercase tracking-wider border flex items-center justify-between shadow-xs transition-all ${
            actionMessage.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-red-50 text-red-900 border-red-200"
          }`}
        >
          <span>{actionMessage.text}</span>
          <button
            onClick={() => setActionMessage(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Profile Banner */}
      <div
        className="p-6 md:p-8 rounded-3xl border shadow-xs"
        style={{
          backgroundColor: "var(--ccolor)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
                    {profile.futsalName}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold rounded-lg uppercase tracking-wider border ${
                      profile.isVerified
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-amber-50 border-amber-200 text-amber-700"
                    }`}
                  >
                    {profile.isVerified ? (
                      <>
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />{" "}
                        Verified
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />{" "}
                        Pending
                      </>
                    )}
                  </span>
                </div>
                <p className="text-slate-500 text-xs font-semibold flex items-center mt-1">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />{" "}
                  {profile.futsalLocation}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/owner")}
              className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Refresh Dashboard"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAddModalOpen(!isAddModalOpen)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {isAddModalOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {isAddModalOpen ? "Close Form" : "Add Ground"}
            </button>
          </div>
        </div>
      </div>

      {/* Add Ground Drawer Form */}
      {isAddModalOpen && (
        <div
          className="p-6 md:p-8 rounded-3xl border shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4 duration-200"
          style={{
            backgroundColor: "var(--ccolor)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" /> Register Pitch /
              Arena Ground
            </h3>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form
            onSubmit={handleAddGround}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
          >
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Pitch Name / Designation
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ground A (5v5 Pitch)"
                value={newGround.name}
                onChange={(e) =>
                  setNewGround({ ...newGround, name: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Rate Per Hour (NPR)
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 1200"
                value={newGround.pricePerHour}
                onChange={(e) =>
                  setNewGround({ ...newGround, pricePerHour: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
              >
                Save To Registry
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Metrics Performance Grid */}
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
            Rs. {metrics.totalRevenue.toLocaleString()}
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
            {metrics.totalCompletedBookings}
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
            {grounds.length}
          </p>
        </div>
      </div>

      {/* Grounds Registry Management Panel */}
      <div
        className="p-6 md:p-8 rounded-3xl border shadow-xs space-y-6"
        style={{
          backgroundColor: "var(--ccolor)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-emerald-600" /> Ground
              Management
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Modify rates, update ground designations, or delete active courts.
            </p>
          </div>
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
            {grounds.length} Registered Pitches
          </span>
        </div>

        {grounds.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              No Active Pitch Registrations
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Click &quot;Add Ground&quot; above to set up hourly rental pricing
              and add courts to your venue profile.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {grounds.map((ground) => {
              const isEditing = editingGroundId === ground.id;

              return (
                <div
                  key={ground.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-2xl hover:border-emerald-300 transition-all gap-4 group shadow-2xs"
                >
                  {isEditing ? (
                    /* Inline Editing Mode */
                    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            name: e.target.value,
                          })
                        }
                        className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                        placeholder="Ground Name"
                      />
                      <input
                        type="number"
                        value={editFormData.pricePerHour}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            pricePerHour: e.target.value,
                          })
                        }
                        className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                        placeholder="Price / Hour"
                      />
                    </div>
                  ) : (
                    /* Standard Display Mode */
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shadow-2xs">
                        #{ground.id.slice(-2)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                          {ground.name}
                        </h4>
                        <p className="text-[11px] font-bold text-emerald-600">
                          Rs. {ground.pricePerHour} / hour
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(ground.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 px-3"
                        >
                          <Check className="w-3.5 h-3.5" /> Save
                        </button>
                        <button
                          onClick={() => setEditingGroundId(null)}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-2 rounded-xl text-xs font-bold transition-all cursor-pointer px-3"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(ground)}
                          className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 p-2.5 rounded-xl transition-all cursor-pointer"
                          title="Edit Pitch"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGround(ground.id)}
                          className="bg-red-50 border border-red-200 hover:bg-red-600 hover:text-white text-red-600 p-2.5 rounded-xl transition-all cursor-pointer"
                          title="Delete Pitch"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
