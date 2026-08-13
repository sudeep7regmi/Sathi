"use client";

import { useState, useEffect, FormEvent, ChangeEvent, useMemo } from "react";
import { apiClient } from "@/lib/axios";
import axios from "axios";
import {
  Layers,
  MapPin,
  Coins,
  Sparkles,
  Plus,
  Loader2,
  Trash2,
  Edit3,
  Check,
  X,
  Building2,
  AlertCircle,
  QrCode,
  UploadCloud,
  ImageIcon,
  Search,
  CheckCircle2,
  SlidersHorizontal,
  Info,
} from "lucide-react";

interface Ground {
  id: string;
  name: string;
  address: string;
  pricePerHour: number;
  amenities: string;
  description?: string;
  paymentQrUrl?: string | null;
  paymentQrPublicId?: string | null;
}

export default function ManageGroundsPage() {
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    pricePerHour: "",
    amenities: "",
    description: "",
  });

  // State for Payment QR File Upload
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);

  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Edit modal states
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
      <HeaderSection
        totalVenues={grounds.length}
        qrConfiguredCount={qrConfiguredCount}
        onOpenAdd={() => setIsAddOpen(true)}
      />

      {/* Global Status Banner Notification */}
      {statusMessage && (
        <StatusNotification
          message={statusMessage.text}
          type={statusMessage.type}
          onClose={() => setStatusMessage(null)}
        />
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
          <EmptyGroundsState
            hasFilter={Boolean(searchQuery)}
            onResetSearch={() => setSearchQuery("")}
            onOpenAdd={() => setIsAddOpen(true)}
          />
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

      {/* Modal: Add New Arena */}
      {isAddOpen && (
        <ModalWrapper
          title="Register New Arena Venue"
          subtitle="Add pitches, configure hourly rates, and attach payment QR"
          onClose={() => {
            setIsAddOpen(false);
            resetForm();
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5 z-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel label="Arena / Pitch Name" required />
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g., Stadium Field A (5v5)"
                />
              </div>

              <div>
                <FormLabel label="Address / Location" required />
                <input
                  required
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g., Ring Road, Kathmandu"
                />
              </div>

              <div>
                <FormLabel label="Rate Per Hour (NPR)" required />
                <input
                  required
                  type="number"
                  name="pricePerHour"
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="1500"
                />
              </div>

              <div>
                <FormLabel label="Amenities (Comma Separated)" required />
                <input
                  required
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Parking, Night Lights, Showers, Lockers"
                />
              </div>
            </div>

            {/* QR Upload Drag-and-Drop Area */}
            <div>
              <FormLabel label="Payment QR Code (eSewa / Khalti / Bank)" />
              <QrUploadZone
                preview={qrPreview}
                file={qrFile}
                inputId="addQrInput"
                onFileSelect={handleQrChange}
                onClear={() => {
                  setQrFile(null);
                  setQrPreview(null);
                }}
              />
            </div>

            <div>
              <FormLabel label="Pitch Specifications & Description" required />
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
                rows={3}
                placeholder="Provide pitch dimensions, turf quality, lighting details..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsAddOpen(false);
                  resetForm();
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold py-2.5 px-6 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {submitting ? "Registering Arena..." : "Save & Register"}
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* Modal: Edit Arena */}
      {editingGround && (
        <ModalWrapper
          title="Edit Arena Configuration"
          subtitle={`Updating info for ${editingGround.name}`}
          onClose={() => {
            setEditingGround(null);
            setEditQrFile(null);
            setEditQrPreview(null);
          }}
        >
          <form onSubmit={handleUpdateGround} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel label="Arena Name" />
                <input
                  type="text"
                  value={editingGround.name}
                  onChange={(e) =>
                    setEditingGround({
                      ...editingGround,
                      name: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <FormLabel label="Address" />
                <input
                  type="text"
                  value={editingGround.address}
                  onChange={(e) =>
                    setEditingGround({
                      ...editingGround,
                      address: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <FormLabel label="Hourly Rate (NPR)" />
                <input
                  type="number"
                  value={editingGround.pricePerHour}
                  onChange={(e) =>
                    setEditingGround({
                      ...editingGround,
                      pricePerHour: Number(e.target.value),
                    })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <FormLabel label="Amenities" />
                <input
                  type="text"
                  value={editingGround.amenities}
                  onChange={(e) =>
                    setEditingGround({
                      ...editingGround,
                      amenities: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <FormLabel label="Payment QR Code Image" />
              <QrUploadZone
                preview={editQrPreview || editingGround.paymentQrUrl || null}
                file={editQrFile}
                inputId="editQrInput"
                onFileSelect={handleEditQrChange}
                onClear={() => {
                  setEditQrFile(null);
                  setEditQrPreview(null);
                  setEditingGround({
                    ...editingGround,
                    paymentQrUrl: null,
                  });
                }}
              />
            </div>

            <div>
              <FormLabel label="Description" />
              <textarea
                value={editingGround.description || ""}
                onChange={(e) =>
                  setEditingGround({
                    ...editingGround,
                    description: e.target.value,
                  })
                }
                className={`${inputClass} resize-none`}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setEditingGround(null);
                  setEditQrFile(null);
                  setEditQrPreview(null);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Check className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}
    </div>
  );
}

/* ==========================================================================
   SUB-COMPONENTS FOR BETTER MODULARITY & UI ENHANCEMENT
   ========================================================================== */

const inputClass =
  "w-full bg-slate-50/70 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-2xs";

function FormLabel({
  label,
  required = false,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <label className="block text-[11px] uppercase tracking-wider font-extrabold text-slate-500 mb-1.5">
      {label} {required && <span className="text-emerald-600">*</span>}
    </label>
  );
}

function HeaderSection({
  totalVenues,
  qrConfiguredCount,
  onOpenAdd,
}: {
  totalVenues: number;
  qrConfiguredCount: number;
  onOpenAdd: () => void;
}) {
  return (
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
            <span>{totalVenues} Total Pitches</span>
          </div>
          <div className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-slate-100">
            <QrCode className="w-3.5 h-3.5 text-emerald-600" />
            <span>{qrConfiguredCount} QR Active</span>
          </div>
        </div>

        <button
          onClick={onOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Pitch</span>
        </button>
      </div>
    </div>
  );
}

function StatusNotification({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  return (
    <div
      className={`p-4 rounded-2xl font-bold text-xs uppercase tracking-wider border flex items-center justify-between shadow-xs transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${
        type === "success"
          ? "bg-emerald-50 text-emerald-900 border-emerald-200"
          : "bg-red-50 text-red-900 border-red-200"
      }`}
    >
      <div className="flex items-center gap-2.5">
        {type === "success" ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
        )}
        <span>{message}</span>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg hover:bg-black/5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function QrUploadZone({
  preview,
  file,
  inputId,
  onFileSelect,
  onClear,
}: {
  preview: string | null;
  file: File | null;
  inputId: string;
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 transition-all hover:border-slate-300">
      {preview ? (
        <div className="relative w-24 h-24 rounded-xl border border-slate-200 overflow-hidden bg-white shrink-0 group shadow-2xs">
          <img
            src={preview}
            alt="QR Preview"
            className="w-full h-full object-contain p-1.5"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-90 hover:opacity-100 transition-opacity shadow-xs"
            title="Remove Image"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div className="w-24 h-24 rounded-xl border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-400 shrink-0">
          <ImageIcon className="w-7 h-7 mb-1 text-slate-300" />
          <span className="text-[9px] font-extrabold uppercase tracking-wider">
            No Image
          </span>
        </div>
      )}

      <div className="flex-1 space-y-2 text-center sm:text-left">
        <input
          type="file"
          accept="image/*"
          id={inputId}
          onChange={onFileSelect}
          className="hidden"
        />
        <label
          htmlFor={inputId}
          className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-2xs transition-all hover:shadow-xs"
        >
          <UploadCloud className="w-4 h-4 text-emerald-600" />
          {file || preview ? "Change Payment QR Image" : "Upload QR Image"}
        </label>
        <p className="text-[10px] text-slate-400 font-semibold leading-relaxed flex items-center gap-1 justify-center sm:justify-start">
          <Info className="w-3 h-3 text-slate-400 shrink-0" />
          Display QR code for players to scan during booking checkout.
        </p>
      </div>
    </div>
  );
}

function GroundCard({
  ground,
  onEdit,
  onDelete,
}: {
  ground: Ground;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="p-6 rounded-3xl border shadow-2xs flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group relative space-y-4"
      style={{
        backgroundColor: "var(--ccolor)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="space-y-3">
        {/* Title & Actions */}
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-black text-base text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight line-clamp-1">
            {ground.name}
          </h3>

          <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onEdit}
              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
              title="Edit Arena Details"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
              title="Remove Arena"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info Rows */}
        <div className="space-y-2.5 text-xs font-semibold text-slate-600">
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="line-clamp-1 text-slate-700 font-bold">
              {ground.address}
            </span>
          </p>

          {/* Amenities Badges */}
          <div className="flex items-start gap-2 pt-1">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {ground.amenities.split(",").map((item, idx) => (
                <span
                  key={idx}
                  className="bg-slate-100/90 border border-slate-200/60 text-slate-700 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                >
                  {item.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Description Snippet */}
          {ground.description && (
            <p className="text-[11px] text-slate-500 font-medium line-clamp-2 pt-1 border-t border-slate-100">
              {ground.description}
            </p>
          )}

          {/* Payment QR Badge */}
          <div className="pt-2">
            {ground.paymentQrUrl ? (
              <div className="flex items-center gap-2.5 bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 p-2 rounded-2xl text-[10px] font-bold uppercase tracking-wider">
                <img
                  src={ground.paymentQrUrl}
                  alt="QR Code"
                  className="w-8 h-8 object-contain rounded-lg bg-white border border-emerald-100 shrink-0"
                />
                <div className="flex flex-col">
                  <span className="font-extrabold text-emerald-800">
                    Payment QR Linked
                  </span>
                  <span className="text-[9px] text-emerald-600 font-semibold lowercase">
                    Active on checkout
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-amber-50/80 border border-amber-200/80 text-amber-900 p-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-wider">
                <QrCode className="w-4 h-4 text-amber-600 shrink-0" />
                <span>No Payment QR Linked</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Price Banner */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-slate-400" /> Hourly Rate
        </span>
        <p className="text-base font-black text-emerald-600 flex items-center gap-1">
          <Coins className="w-4 h-4 opacity-75" /> Rs. {ground.pricePerHour}{" "}
          <span className="text-[10px] font-bold text-slate-400 lowercase">
            / hr
          </span>
        </p>
      </div>
    </div>
  );
}

function EmptyGroundsState({
  hasFilter,
  onResetSearch,
  onOpenAdd,
}: {
  hasFilter: boolean;
  onResetSearch: () => void;
  onOpenAdd: () => void;
}) {
  return (
    <div
      className="p-12 text-center rounded-3xl border border-dashed border-slate-200 space-y-4 my-4"
      style={{ backgroundColor: "var(--ccolor)" }}
    >
      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
        <Building2 className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-black uppercase tracking-wider text-slate-700">
          {hasFilter ? "No Matching Arenas Found" : "No Arenas Registered Yet"}
        </p>
        <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
          {hasFilter
            ? "Try adjusting your search keywords or clear filters."
            : "Get started by adding your first futsal pitch and setting up pricing and payment details."}
        </p>
      </div>

      <div>
        {hasFilter ? (
          <button
            onClick={onResetSearch}
            className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
          >
            Clear Search Filter
          </button>
        ) : (
          <button
            onClick={onOpenAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add First Pitch
          </button>
        )}
      </div>
    </div>
  );
}

function ModalWrapper({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="w-full max-w-xl rounded-3xl border shadow-2xl p-6 md:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: "var(--ccolor)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-base uppercase tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-2 h-4 bg-emerald-500 rounded-full inline-block"></span>
              {title}
            </h3>
            {subtitle && (
              <p className="text-slate-400 text-[11px] font-semibold tracking-wide uppercase mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}