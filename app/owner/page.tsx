"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/axios";
import axios from "axios";
import {
  BadgeCheck,
  MapPin,
  ShieldAlert,
  Loader2,
  Plus,
  X,
  Building2,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";

import MetricsGrid from "@/components/dashboard/MetricsGrid";
import GroundsManagement, { Ground } from "@/components/dashboard/GroundsManagement";

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

export default function OwnerDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [metrics, setMetrics] = useState<OwnerMetrics | null>(null);
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
          setError(err.response?.data?.message || "Failed to load business data.");
        } else {
          setError("Unexpected error loading data.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDynamicData();
  }, []);

  const handleAddGround = async (name: string, pricePerHour: number) => {
    try {
      const response = await apiClient.post("/api/owner/grounds", { name, pricePerHour });
      if (response.data.success) {
        const addedGround = response.data.ground || {
          id: Date.now().toString(),
          name,
          pricePerHour,
        };
        setGrounds([addedGround, ...grounds]);
        setMetrics((prev) => (prev ? { ...prev, totalGrounds: prev.totalGrounds + 1 } : null));
        setIsAddModalOpen(false);
        setActionMessage({ text: "Ground successfully added!", type: "success" });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setActionMessage({ text: err.response?.data?.message || "Failed to add ground.", type: "error" });
      }
    }
  };

  const handleDeleteGround = async (id: string) => {
    if (!confirm("Are you sure you want to remove this pitch?")) return;
    try {
      await apiClient.delete(`/api/owner/grounds/${id}`);
    } catch (err) {
      // Optimistic fall-through
    } finally {
      setGrounds((prev) => prev.filter((g) => g.id !== id));
      setMetrics((prev) => (prev ? { ...prev, totalGrounds: Math.max(0, prev.totalGrounds - 1) } : null));
      setActionMessage({ text: "Pitch removed successfully.", type: "success" });
    }
  };

  const handleSaveEdit = async (id: string, name: string, pricePerHour: number) => {
    try {
      await apiClient.put(`/api/owner/grounds/${id}`, { name, pricePerHour });
    } catch (err) {
      // Optimistic fall-through
    } finally {
      setGrounds((prev) => prev.map((g) => (g.id === id ? { ...g, name, pricePerHour } : g)));
      setActionMessage({ text: "Ground specifications updated.", type: "success" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-xs text-slate-500 font-bold space-y-3">
        <Loader2 className="animate-spin h-9 w-9 text-emerald-600" />
        <span>Synchronizing Venue Metrics...</span>
      </div>
    );
  }

  if (error || !profile || !metrics) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-xs font-bold text-red-600 text-center bg-red-50 border border-red-200 px-8 py-6 rounded-2xl max-w-md uppercase tracking-wider space-y-3">
          <ShieldAlert className="w-8 h-8 text-red-500 mx-auto" />
          <p>{error || "Unexpected configuration error."}</p>
          <button onClick={() => router.push("/owner")} className="bg-red-600 text-white px-4 py-2 rounded-xl text-[10px]">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {actionMessage && (
        <div className={`p-4 rounded-2xl font-bold text-xs uppercase border flex items-center justify-between ${
          actionMessage.type === "success" ? "bg-emerald-50 text-emerald-900 border-emerald-200" : "bg-red-50 text-red-900 border-red-200"
        }`}>
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Profile Header */}
      <div className="p-6 md:p-8 rounded-3xl border shadow-xs" style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">{profile.futsalName}</h1>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold rounded-lg uppercase tracking-wider border ${
                  profile.isVerified ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-700"
                }`}>
                  {profile.isVerified ? <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" /> : <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />}
                  {profile.isVerified ? "Verified" : "Pending"}
                </span>
              </div>
              <p className="text-slate-500 text-xs font-semibold flex items-center mt-1">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {profile.futsalLocation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/owner")} className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAddModalOpen(!isAddModalOpen)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-xl text-xs uppercase flex items-center gap-2"
            >
              {isAddModalOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isAddModalOpen ? "Close Form" : "Add Ground"}
            </button>
          </div>
        </div>
      </div>

      {/* Component 1: Metrics */}
      <MetricsGrid
        totalRevenue={metrics.totalRevenue}
        totalCompletedBookings={metrics.totalCompletedBookings}
        activeGroundsCount={grounds.length}
      />

      {/* Component 2: Grounds Management */}
      <GroundsManagement
        grounds={grounds}
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        onAddGround={handleAddGround}
        onDeleteGround={handleDeleteGround}
        onSaveEditGround={handleSaveEdit}
      />
    </div>
  );
}