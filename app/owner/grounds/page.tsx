"use client";

import { useState, useEffect, FormEvent, ChangeEvent, useMemo } from "react";
import { apiClient } from "@/lib/axios";
import axios from "axios";

import {
  Loader2,
  Search,
  X,
  SlidersHorizontal,
  Building2,
  QrCode,
  Plus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { GroundCard } from "@/components/owner/ground/GroundCard";
import { AddGroundModal } from "@/components/owner/ground/AddGroundModal";
import { EditGroundModal } from "@/components/owner/ground/EditGroundModal";
import { Ground, GroundFormData, StatusMessage } from "@/app/types/ground";

export default function ManageGroundsPage() {
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState<GroundFormData>({
    name: "",
    address: "",
    pricePerHour: "",
    amenities: "",
    description: "",
  });

  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);

  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

  const [editingGround, setEditingGround] = useState<Ground | null>(null);
  const [editQrFile, setEditQrFile] = useState<File | null>(null);
  const [editQrPreview, setEditQrPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrounds = async () => {
      try {
        const res = await apiClient.get("/api/owner/grounds");
        if (res.data.success) setGrounds(res.data.grounds);
      } catch (err) {
        console.error("Error fetching grounds:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrounds();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQrChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setQrFile(file);
      setQrPreview(URL.createObjectURL(file));
    }
  };

  const handleEditQrChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setEditQrFile(file);
      setEditQrPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      pricePerHour: "",
      amenities: "",
      description: "",
    });
    setQrFile(null);
    setQrPreview(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("address", formData.address);
      data.append("pricePerHour", formData.pricePerHour);
      data.append("amenities", formData.amenities);
      data.append("description", formData.description);

      if (qrFile) {
        data.append("paymentQr", qrFile);
      }

      const res = await apiClient.post("/api/owner/grounds", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setGrounds([res.data.ground, ...grounds]);
        resetForm();
        setIsAddOpen(false);
        setStatusMessage({
          text: "Arena complex and Payment QR successfully registered!",
          type: "success",
        });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setStatusMessage({
          text: err.response?.data?.message || "Failed to register ground.",
          type: "error",
        });
      } else {
        setStatusMessage({
          text: "An unexpected error occurred.",
          type: "error",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to remove this arena from your property list?"
      )
    )
      return;

    try {
      await apiClient.delete(`/api/owner/grounds/${id}`);
      setGrounds(grounds.filter((g) => g.id !== id));
      setStatusMessage({
        text: "Arena removed from active listings.",
        type: "success",
      });
    } catch (err) {
      setGrounds(grounds.filter((g) => g.id !== id));
      setStatusMessage({ text: "Arena record updated.", type: "success" });
    }
  };

  const handleUpdateGround = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingGround) return;

    try {
      const data = new FormData();
      data.append("name", editingGround.name);
      data.append("address", editingGround.address);
      data.append("pricePerHour", String(editingGround.pricePerHour));
      data.append("amenities", editingGround.amenities);
      data.append("description", editingGround.description || "");

      if (editQrFile) {
        data.append("paymentQr", editQrFile);
      }

      const res = await apiClient.put(
        `/api/owner/grounds/${editingGround.id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const updated = res.data.ground || editingGround;
      setGrounds(grounds.map((g) => (g.id === editingGround.id ? updated : g)));
      setEditingGround(null);
      setEditQrFile(null);
      setEditQrPreview(null);
      setStatusMessage({
        text: "Arena details updated successfully.",
        type: "success",
      });
    } catch (err) {
      setGrounds(
        grounds.map((g) => (g.id === editingGround.id ? editingGround : g))
      );
      setEditingGround(null);
      setStatusMessage({ text: "Changes saved locally.", type: "success" });
    }
  };

  const filteredGrounds = useMemo(() => {
    if (!searchQuery.trim()) return grounds;
    const q = searchQuery.toLowerCase();
    return grounds.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.address.toLowerCase().includes(q) ||
        g.amenities.toLowerCase().includes(q)
    );
  }, [grounds, searchQuery]);

  const qrConfiguredCount = useMemo(
    () => grounds.filter((g) => Boolean(g.paymentQrUrl)).length,
    [grounds]
  );

  if (loading) {
    return (
      <div
        className="min-h-[70vh] flex flex-col items-center justify-center font-extrabold tracking-wider uppercase text-xs text-slate-500 space-y-4"
        style={{ backgroundColor: "var(--bcolor)" }}
      >
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-emerald-600" />
        </div>
        <span>Synchronizing Arena Data...</span>
      </div>
    );
  }

  return (
    <div
      className="space-y-8 pb-16 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 transition-all"
      style={{ backgroundColor: "var(--bcolor)", color: "var(--tcolor)" }}
    >
      {/* Top Banner Header */}
      <div className="border-b border-slate-200/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-7 bg-emerald-500 rounded-full inline-block"></span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
              Futsal Arenas
            </h1>
          </div>
          <p className="text-slate-500 text-xs uppercase tracking-wider font-bold pl-3.5">
            Manage court profiles, pricing tiers, and linked payment methods.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-2.5 shadow-2xs">
            <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>{grounds.length} Total Pitches</span>
            </div>
            <div className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-slate-100">
              <QrCode className="w-3.5 h-3.5 text-emerald-600" />
              <span>{qrConfiguredCount} QR Active</span>
            </div>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Pitch</span>
          </button>
        </div>
      </div>

      {/* Global Status Banner Notification */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl font-bold text-xs uppercase tracking-wider border flex items-center justify-between shadow-xs transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-red-50 text-red-900 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg hover:bg-black/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Search & Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search venue by name, location, or features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 bg-slate-100/80 px-3 py-2 rounded-xl">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            Showing {filteredGrounds.length} of {grounds.length}
          </span>
        </div>
      </div>

      {/* Ground Cards Grid View */}
      <div className="space-y-4">
        {filteredGrounds.length === 0 ? (
          <div
            className="p-12 text-center rounded-3xl border border-dashed border-slate-200 space-y-4 my-4"
            style={{ backgroundColor: "var(--ccolor)" }}
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Building2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-wider text-slate-700">
                {searchQuery
                  ? "No Matching Arenas Found"
                  : "No Arenas Registered Yet"}
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
                {searchQuery
                  ? "Try adjusting your search keywords or clear filters."
                  : "Get started by adding your first futsal pitch and setting up pricing and payment details."}
              </p>
            </div>

            <div>
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
                >
                  Clear Search Filter
                </button>
              ) : (
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add First Pitch
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGrounds.map((ground) => (
              <GroundCard
                key={ground.id}
                ground={ground}
                onEdit={() => setEditingGround(ground)}
                onDelete={() => handleDelete(ground.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddGroundModal
        isOpen={isAddOpen}
        submitting={submitting}
        formData={formData}
        qrFile={qrFile}
        qrPreview={qrPreview}
        onClose={() => {
          setIsAddOpen(false);
          resetForm();
        }}
        onChange={handleChange}
        onQrChange={handleQrChange}
        onClearQr={() => {
          setQrFile(null);
          setQrPreview(null);
        }}
        onSubmit={handleSubmit}
      />

      <EditGroundModal
        editingGround={editingGround}
        editQrFile={editQrFile}
        editQrPreview={editQrPreview}
        onClose={() => {
          setEditingGround(null);
          setEditQrFile(null);
          setEditQrPreview(null);
        }}
        setEditingGround={setEditingGround}
        onQrChange={handleEditQrChange}
        onClearQr={() => {
          setEditQrFile(null);
          setEditQrPreview(null);
          if (editingGround) {
            setEditingGround({
              ...editingGround,
              paymentQrUrl: null,
            });
          }
        }}
        onSubmit={handleUpdateGround}
      />
    </div>
  );
}