"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { apiClient } from "@/lib/axios";
import {
  MapPin,
  Coins,
  Sparkles,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ShieldCheck,
  QrCode,
  UploadCloud,
  ImageIcon,
  X,
  AlertCircle,
} from "lucide-react";

interface Ground {
  id: string;
  name: string;
  address: string;
  pricePerHour: number;
  amenities: string;
  description: string;
  paymentQrUrl?: string | null;
  owner: { futsalName: string; isVerified: boolean };
}

export default function BookGroundsPage() {
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedGround, setSelectedGround] = useState<Ground | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

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

  const handleReceiptChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const handleBookingSubmit = async (e: FormEvent, groundId: string) => {
    e.preventDefault();
    setMessage(null);

    if (!receiptFile) {
      setMessage({
        text: "Please attach a payment receipt image.",
        type: "error",
      });
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("groundId", groundId);
      data.append("date", formData.date);
      data.append("startTime", formData.startTime);
      data.append("endTime", formData.endTime);
      data.append("paymentReceipt", receiptFile);

      // Native fetch guarantees proper boundary generation for FormData
      const res = await fetch("/api/player/grounds", {
        method: "POST",
        body: data,
      });

      const resData = await res.json();

      if (res.ok && resData.success) {
        setMessage({
          text: resData.message || "Reservation request and payment receipt submitted to owner!",
          type: "success",
        });

        // Close modal and clear state on success
        setSelectedGround(null);
        setFormData({ date: "", startTime: "", endTime: "" });
        setReceiptFile(null);
        setReceiptPreview(null);
      } else {
        setMessage({
          text: resData.message || "Booking submission failed.",
          type: "error",
        });
      }
    } catch (err: unknown) {
      setMessage({
        text: "An unexpected error occurred during booking.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
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
      {/* Hero Banner Head */}
      <div
        className="border rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden"
        style={{
          backgroundColor: "var(--ccolor)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl pointer-events-none" />
        <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-slate-900 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
          Book Futsal Arenas
        </h1>
        <p className="text-slate-500 text-sm mt-1 max-w-lg font-medium">
          Browse verified grounds, inspect facilities, scan QR payment codes, and submit match reservations.
        </p>
      </div>

      {/* Status Alerts */}
      {message && (
        <div
          className={`p-4 rounded-xl font-bold text-xs uppercase tracking-wider border flex items-center gap-3 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Booking Modal */}
      {selectedGround && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-xl rounded-3xl border shadow-xl p-6 md:p-8 space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
            style={{
              backgroundColor: "var(--ccolor)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base uppercase tracking-tight text-slate-900 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-emerald-600" /> Reserve {selectedGround.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Rate: <span className="font-bold text-emerald-600">Rs. {selectedGround.pricePerHour}/hr</span>
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedGround(null);
                  setReceiptFile(null);
                  setReceiptPreview(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => handleBookingSubmit(e, selectedGround.id)}
              className="space-y-4"
            >
              {/* Date & Time Selection */}
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

              {/* Step 1: Payment QR Code */}
              <div className="border-t border-slate-100 pt-4">
                <label className="block text-[11px] uppercase tracking-wider font-extrabold text-slate-700 mb-2 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-600" /> Step 1: Scan & Transfer Payment
                </label>

                {selectedGround.paymentQrUrl ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center sm:text-left">
                    <div className="w-32 h-32 bg-white border border-slate-200 rounded-xl p-2 shrink-0 flex items-center justify-center shadow-xs">
                      <img
                        src={selectedGround.paymentQrUrl}
                        alt="Payment QR Code"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="space-y-1 text-xs text-slate-600">
                      <p className="font-bold text-slate-900">Scan via eSewa / Khalti / Mobile Banking</p>
                      <p className="text-[11px] text-slate-500">
                        Scan this QR code using your digital wallet or banking app to make the required deposit/payment.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>No QR code provided by owner. Contact ground manager for direct payment.</span>
                  </div>
                )}
              </div>

              {/* Step 2: Receipt Upload */}
              <div className="border-t border-slate-100 pt-4">
                <label className="block text-[11px] uppercase tracking-wider font-extrabold text-slate-700 mb-2 flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4 text-emerald-600" /> Step 2: Attach Payment Receipt
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {receiptPreview ? (
                    <div className="relative w-24 h-24 rounded-xl border overflow-hidden bg-white shrink-0">
                      <img
                        src={receiptPreview}
                        alt="Receipt Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setReceiptFile(null);
                          setReceiptPreview(null);
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-90 hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-xl border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-400 shrink-0">
                      <ImageIcon className="w-6 h-6 mb-1 text-slate-300" />
                      <span className="text-[9px] font-bold uppercase">No Receipt</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <input
                      type="file"
                      accept="image/*"
                      id="receiptInput"
                      onChange={handleReceiptChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="receiptInput"
                      className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-emerald-500 text-slate-700 hover:text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-2xs transition-all"
                    >
                      <UploadCloud className="w-4 h-4 text-emerald-600" />
                      {receiptFile ? "Change Receipt" : "Upload Screenshot"}
                    </label>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Upload your payment confirmation screenshot so the owner can verify your reservation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGround(null);
                    setReceiptFile(null);
                    setReceiptPreview(null);
                  }}
                  className="px-4 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {submitting ? "Submitting..." : "Submit Reservation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grounds Grid Layout */}
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

                {/* Amenities pills */}
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

                {/* Action Button */}
                <button
                  onClick={() => setSelectedGround(ground)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <Clock className="w-3.5 h-3.5 text-emerald-400" /> Reserve Arena & Pay
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}