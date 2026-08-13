"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import axios from "axios";
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
  Maximize2,
  Lock,
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

interface ExistingBooking {
  id: string;
  groundId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
}

interface TimeSlot {
  label: string;
  startTime: string;
  endTime: string;
}

const STATIC_TIME_SLOTS: TimeSlot[] = [
  { label: "06:00 AM - 07:00 AM", startTime: "06:00", endTime: "07:00" },
  { label: "07:00 AM - 08:00 AM", startTime: "07:00", endTime: "08:00" },
  { label: "08:00 AM - 09:00 AM", startTime: "08:00", endTime: "09:00" },
  { label: "09:00 AM - 10:00 AM", startTime: "09:00", endTime: "10:00" },
  { label: "10:00 AM - 11:00 AM", startTime: "10:00", endTime: "11:00" },
  { label: "11:00 AM - 12:00 PM", startTime: "11:00", endTime: "12:00" },
  { label: "12:00 PM - 01:00 PM", startTime: "12:00", endTime: "13:00" },
  { label: "01:00 PM - 02:00 PM", startTime: "13:00", endTime: "14:00" },
  { label: "02:00 PM - 03:00 PM", startTime: "14:00", endTime: "15:00" },
  { label: "03:00 PM - 04:00 PM", startTime: "15:00", endTime: "16:00" },
  { label: "04:00 PM - 05:00 PM", startTime: "16:00", endTime: "17:00" },
  { label: "05:00 PM - 06:00 PM", startTime: "17:00", endTime: "18:00" },
  { label: "06:00 PM - 07:00 PM", startTime: "18:00", endTime: "19:00" },
  { label: "07:00 PM - 08:00 PM", startTime: "19:00", endTime: "20:00" },
  { label: "08:00 PM - 09:00 PM", startTime: "20:00", endTime: "21:00" },
];

export default function BookGroundsPage() {
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [existingBookings, setExistingBookings] = useState<ExistingBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchingBookings, setFetchingBookings] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedGround, setSelectedGround] = useState<Ground | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  // Expanded QR Lightbox modal state
  const [expandedQrUrl, setExpandedQrUrl] = useState<string | null>(null);

  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const fetchGrounds = async () => {
      try {
        const res = await apiClient.get<{ success: boolean; grounds: Ground[] }>("/api/player/grounds");
        if (res.data.success) setGrounds(res.data.grounds);
      } catch (err: unknown) {
        console.error("Error fetching grounds:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrounds();
  }, []);

  const closeModal = () => {
    setSelectedGround(null);
    setSelectedDate("");
    setSelectedSlot(null);
    setReceiptFile(null);
    setReceiptPreview(null);
  };

  const handleSelectGround = async (ground: Ground) => {
    setSelectedGround(ground);
    setFetchingBookings(true);
    setExistingBookings([]);
    setSelectedSlot(null);

    try {
      const res = await apiClient.get<{ success: boolean; bookings: ExistingBooking[] }>(
        `/api/player/grounds/${ground.id}/bookings`
      );
      if (res.data?.success) {
        setExistingBookings(res.data.bookings || []);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        console.warn("Bookings endpoint returned 404. Defaulting to empty bookings list.");
      } else {
        console.error("Failed to fetch existing bookings:", err);
      }
      setExistingBookings([]);
    } finally {
      setFetchingBookings(false);
    }
  };

  const handleReceiptChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const parseTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const parts = timeStr.includes("T") ? timeStr.split("T")[1].substring(0, 5) : timeStr;
    const [hours, minutes] = parts.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Helper to normalize dates to YYYY-MM-DD
  const formatDateString = (dateStr: string): string => {
    if (!dateStr) return "";
    if (dateStr.includes("T")) {
      return dateStr.split("T")[0];
    }
    return dateStr;
  };

  // Determines if a static slot is occupied by any active non-rejected booking
  const isSlotOccupied = (slot: TimeSlot): boolean => {
    if (!selectedDate) return false;

    const reqStart = parseTimeToMinutes(slot.startTime);
    const reqEnd = parseTimeToMinutes(slot.endTime);

    return existingBookings.some((b) => {
      if (b.status === "REJECTED") return false;

      const bookingDateFormatted = formatDateString(b.date);
      const isSameDate = bookingDateFormatted === selectedDate;
      if (!isSameDate) return false;

      const existingStart = parseTimeToMinutes(b.startTime);
      const existingEnd = parseTimeToMinutes(b.endTime);

      return reqStart < existingEnd && reqEnd > existingStart;
    });
  };

  const handleBookingSubmit = async (e: FormEvent, groundId: string) => {
    e.preventDefault();
    setMessage(null);

    if (!selectedDate || !selectedSlot) {
      setMessage({
        text: "Please select a date and an available time slot.",
        type: "error",
      });
      return;
    }

    if (isSlotOccupied(selectedSlot)) {
      setMessage({
        text: "The chosen time slot is already booked. Please select another slot.",
        type: "error",
      });
      return;
    }

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
      data.append("date", selectedDate);
      data.append("startTime", selectedSlot.startTime);
      data.append("endTime", selectedSlot.endTime);
      data.append("paymentReceipt", receiptFile);

      const res = await fetch("/api/player/grounds", {
        method: "POST",
        body: data,
      });

      const resData: { success: boolean; message?: string } = await res.json();

      if (res.ok && resData.success) {
        setMessage({
          text: resData.message || "Reservation request submitted successfully!",
          type: "success",
        });

        // Hide modal and clear input state upon completion
        closeModal();
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
          className={`p-4 rounded-xl font-bold text-xs uppercase tracking-wider border flex items-center justify-between gap-3 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Lightbox / Expanded QR Code Modal */}
      {expandedQrUrl && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setExpandedQrUrl(null)}
        >
          <div
            className="relative bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl flex flex-col items-center gap-4 text-center border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setExpandedQrUrl(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm uppercase tracking-wider">
              <QrCode className="w-5 h-5" />
              <span>Scan to Pay</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner w-full flex items-center justify-center">
              <img
                src={expandedQrUrl}
                alt="Expanded Payment QR Code"
                className="max-h-[60vh] object-contain rounded-xl"
              />
            </div>
            <p className="text-xs text-slate-500 font-semibold">
              Open your eSewa, Khalti, or Mobile Banking app and point your camera at this QR code.
            </p>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {selectedGround && (
        <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-2xl rounded-3xl border shadow-xl p-6 md:p-8 space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
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
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => handleBookingSubmit(e, selectedGround.id)} className="space-y-5">
              {/* Date Selection */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1.5">
                  Select Reservation Date
                </label>
                <input
                  required
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot(null);
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-sm cursor-pointer"
                />
              </div>

              {/* Time Slots Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500">
                    Available Time Slots
                  </label>
                  {fetchingBookings && (
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Syncing schedule...
                    </span>
                  )}
                </div>

                {!selectedDate ? (
                  <p className="text-xs text-slate-400 font-medium italic bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
                    Please select a date above to check slot availability.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {STATIC_TIME_SLOTS.map((slot) => {
                      const occupied = isSlotOccupied(slot);
                      const isSelected = selectedSlot?.startTime === slot.startTime;

                      return (
                        <button
                          key={slot.startTime}
                          type="button"
                          disabled={occupied || fetchingBookings}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                            occupied
                              ? "bg-slate-100/80 border-slate-200 text-slate-400 cursor-not-allowed opacity-75 shadow-none"
                              : isSelected
                              ? "bg-emerald-600 border-emerald-600 text-white shadow-md scale-[1.02]"
                              : "bg-white border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-600 cursor-pointer hover:shadow-xs"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            {occupied && <Lock className="w-3 h-3 text-slate-400 shrink-0" />}
                            <span className={occupied ? "line-through text-slate-400" : ""}>
                              {slot.label}
                            </span>
                          </div>
                          <span
                            className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              occupied
                                ? "bg-slate-200 text-slate-500"
                                : isSelected
                                ? "bg-emerald-700 text-emerald-100"
                                : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {occupied ? "Booked" : isSelected ? "Selected" : "Available"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Step 1: Payment QR Code */}
              <div className="border-t border-slate-100 pt-4">
                <label className="block text-[11px] uppercase tracking-wider font-extrabold text-slate-700 mb-2 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-600" /> Step 1: Scan & Transfer Payment
                </label>

                {selectedGround.paymentQrUrl ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center sm:text-left">
                    {/* Interactive Expandable QR Code Container */}
                    <div
                      onClick={() => setExpandedQrUrl(selectedGround.paymentQrUrl || null)}
                      className="group relative w-32 h-32 bg-white border border-slate-200 rounded-xl p-2 shrink-0 flex items-center justify-center shadow-xs cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all overflow-hidden"
                    >
                      <img
                        src={selectedGround.paymentQrUrl}
                        alt="Payment QR Code"
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1 rounded-xl">
                        <Maximize2 className="w-4 h-4" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">Enlarge</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600">
                      <p className="font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1">
                        Scan via eSewa / Khalti / Mobile Banking
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Scan this QR code using your digital wallet or banking app to complete the booking payment.
                      </p>
                      <button
                        type="button"
                        onClick={() => setExpandedQrUrl(selectedGround.paymentQrUrl || null)}
                        className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider cursor-pointer"
                      >
                        <Maximize2 className="w-3 h-3" /> Click QR image to view full screen
                      </button>
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
                      <img src={receiptPreview} alt="Receipt Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setReceiptFile(null);
                          setReceiptPreview(null);
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-90 hover:opacity-100 cursor-pointer"
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
                  onClick={closeModal}
                  className="px-4 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !selectedSlot || !selectedDate || fetchingBookings}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <Coins className="w-4 h-4 opacity-70" /> Rs. {ground.pricePerHour}
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
                  onClick={() => handleSelectGround(ground)}
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