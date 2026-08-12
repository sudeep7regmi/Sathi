'use client';

import { useState, useEffect, Fragment } from 'react';
import { apiClient } from '@/lib/axios';
import axios from 'axios';
import { 
  User, 
  Phone, 
  Mail, 
  Clock, 
  Layers, 
  Coins, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Receipt,
  ExternalLink,
  X,
  Image as ImageIcon
} from 'lucide-react';

interface Booking {
  id: string; 
  date: string; 
  startTime: string; 
  endTime: string; 
  duration: number; 
  totalCost: number; 
  status: string;
  paymentReceiptUrl?: string | null;
  paymentSubmittedAt?: string | null;
  ground: { name: string };
  user: { email: string; playerProfile?: { fullName: string; phoneNumber: string } };
}

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for expanded table rows
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  
  // State for receipt image modal viewer
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await apiClient.get('/api/owner/bookings');
        if (res.data.success) setBookings(res.data.bookings);
      } catch (err) { 
        console.error("Error fetching bookings:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchBookings();
  }, []);

  const toggleRowExpand = (bookingId: string) => {
    setExpandedBookingId(prev => (prev === bookingId ? null : bookingId));
  };

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      const res = await apiClient.put('/api/owner/bookings', { bookingId, status });
      if (res.data.success) {
        setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: res.data.booking.status } : b));
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) alert('Failed to update booking status');
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-[60vh] flex items-center justify-center font-bold tracking-wider uppercase text-sm text-slate-700"
        style={{ backgroundColor: "var(--bcolor)" }}
      >
        <Loader2 className="animate-spin h-8 w-8 text-emerald-600 mr-3" />
        <span>Syncing Hub Reservations...</span>
      </div>
    );
  }

  return (
    <div 
      className="space-y-8 pb-12 min-h-screen"
      style={{ backgroundColor: "var(--bcolor)", color: "var(--tcolor)" }}
    >
      {/* Header section */}
      <div className="border-b border-slate-200 pb-5 relative z-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 uppercase tracking-tight flex items-center gap-3">
          <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
          Manage Reservations
        </h1>
        <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mt-1">
          Review turf requests, inspect payment proof receipts, and verify schedules.
        </p>
      </div>

      {/* Full-Screen Receipt Image Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-white rounded-3xl p-4 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3 px-2">
              <h3 className="font-extrabold text-sm uppercase tracking-tight text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" /> Payment Receipt Verification
              </h3>
              <button 
                onClick={() => setPreviewImage(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center p-2">
              <img 
                src={previewImage} 
                alt="Payment Receipt Screenshot" 
                className="max-h-[70vh] w-auto object-contain rounded-xl shadow-sm"
              />
            </div>
            <div className="flex justify-between items-center px-2 pt-1 text-xs">
              <a 
                href={previewImage} 
                target="_blank" 
                rel="noreferrer"
                className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1 uppercase tracking-wider"
              >
                Open Full Screen <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button 
                onClick={() => setPreviewImage(null)}
                className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bookings Table Panel */}
      <div 
        className="rounded-2xl border shadow-sm overflow-hidden relative z-10"
        style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4 lg:p-5 w-10"></th>
                <th className="p-4 lg:p-5">Player Details</th>
                <th className="p-4 lg:p-5">Arena & Schedule</th>
                <th className="p-4 lg:p-5">Cost Breakdown</th>
                <th className="p-4 lg:p-5">Status State</th>
                <th className="p-4 lg:p-5 text-right">Actions Dashboard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 text-xs uppercase font-bold tracking-wider">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const isExpanded = expandedBookingId === booking.id;

                  return (
                    <Fragment key={booking.id}>
                      <tr 
                        onClick={() => toggleRowExpand(booking.id)}
                        className={`hover:bg-slate-50/80 transition-colors cursor-pointer group ${
                          isExpanded ? "bg-slate-50/50" : ""
                        }`}
                      >
                        {/* Expand/Collapse Indicator Arrow */}
                        <td className="p-4 lg:p-5 text-slate-400">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                          )}
                        </td>

                        {/* User Identity Info Node */}
                        <td className="p-4 lg:p-5">
                          <div className="flex flex-col space-y-1">
                            <span className="font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center gap-1.5 uppercase tracking-tight">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              {booking.user.playerProfile?.fullName || 'Unknown User'}
                            </span>
                            <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                              {booking.user.playerProfile?.phoneNumber ? (
                                <>
                                  <Phone className="w-3 h-3 text-slate-400" /> 
                                  {booking.user.playerProfile.phoneNumber}
                                </>
                              ) : (
                                <>
                                  <Mail className="w-3 h-3 text-slate-400" /> 
                                  {booking.user.email}
                                </>
                              )}
                            </span>
                          </div>
                        </td>

                        {/* Arena Details Node */}
                        <td className="p-4 lg:p-5">
                          <div className="flex flex-col space-y-1">
                            <span className="font-extrabold text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-emerald-600" />
                              {booking.ground.name}
                            </span>
                            <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {new Date(booking.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} | {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                        </td>

                        {/* Cost Value Column */}
                        <td className="p-4 lg:p-5 font-black text-emerald-600 text-base">
                          <span className="flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5 opacity-75" /> Rs. {booking.totalCost}
                          </span>
                        </td>

                        {/* Status Badge Column */}
                        <td className="p-4 lg:p-5">
                          <span 
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider border shadow-xs ${
                              booking.status === 'PENDING' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                              booking.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                              booking.status === 'COMPLETED' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                              'bg-red-50 border-red-200 text-red-700'
                            }`}
                          >
                            {booking.status === 'PENDING' && <AlertCircle className="w-3 h-3 text-amber-600" />}
                            {booking.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            {booking.status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3 text-blue-600" />}
                            {booking.status === 'REJECTED' && <XCircle className="w-3 h-3 text-red-600" />}
                            {booking.status}
                          </span>
                        </td>

                        {/* Action Controls */}
                        <td className="p-4 lg:p-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex gap-2">
                            {booking.status === 'PENDING' && (
                              <>
                                <button 
                                  onClick={() => handleStatusUpdate(booking.id, 'APPROVED')} 
                                  className="text-[10px] font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleStatusUpdate(booking.id, 'REJECTED')} 
                                  className="text-[10px] font-bold bg-white text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {booking.status === 'APPROVED' && (
                              <button 
                                onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')} 
                                className="text-[10px] font-bold bg-slate-900 border border-slate-900 text-white hover:bg-slate-800 px-4 py-1.5 rounded-lg uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                              >
                                Mark Completed
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Section with Receipt Screenshot Viewer */}
                      {isExpanded && (
                        <tr className="bg-slate-50/70 border-b border-slate-200">
                          <td colSpan={6} className="p-5">
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row gap-6 items-start justify-between">
                              
                              {/* Left: Player & Time Meta info */}
                              <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-2">
                                  <Receipt className="w-4 h-4 text-emerald-600" />
                                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                                    Reservation Verification Details
                                  </h4>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                      Player Name
                                    </span>
                                    <p className="font-bold text-slate-800">
                                      {booking.user.playerProfile?.fullName || "N/A"}
                                    </p>
                                  </div>

                                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                      Contact Info
                                    </span>
                                    <p className="font-medium text-slate-700">
                                      {booking.user.playerProfile?.phoneNumber || booking.user.email}
                                    </p>
                                  </div>

                                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                      Match Duration
                                    </span>
                                    <p className="font-bold text-slate-800">
                                      {booking.duration} minutes ({booking.duration / 60} hrs)
                                    </p>
                                  </div>

                                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                      Payment Timestamp
                                    </span>
                                    <p className="font-medium text-slate-700">
                                      {booking.paymentSubmittedAt 
                                        ? new Date(booking.paymentSubmittedAt).toLocaleString() 
                                        : "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Right: Payment Receipt Preview Image */}
                              <div className="w-full md:w-64 shrink-0 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-3">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
                                  Uploaded Payment Receipt
                                </span>

                                {booking.paymentReceiptUrl ? (
                                  <div className="space-y-2">
                                    <div 
                                      onClick={() => setPreviewImage(booking.paymentReceiptUrl!)}
                                      className="relative w-full h-40 bg-white border border-slate-200 rounded-xl overflow-hidden group cursor-pointer shadow-2xs hover:border-emerald-500 transition-all flex items-center justify-center"
                                    >
                                      <img 
                                        src={booking.paymentReceiptUrl} 
                                        alt="Payment Receipt" 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                      />
                                      <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1 uppercase tracking-wider">
                                        <ExternalLink className="w-4 h-4" /> Expand Image
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => setPreviewImage(booking.paymentReceiptUrl!)}
                                      className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline uppercase tracking-wider cursor-pointer inline-flex items-center gap-1"
                                    >
                                      View Full Receipt
                                    </button>
                                  </div>
                                ) : (
                                  <div className="h-32 rounded-xl border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-400">
                                    <ImageIcon className="w-6 h-6 mb-1 text-slate-300" />
                                    <span className="text-[10px] font-bold uppercase">No Receipt File Attached</span>
                                  </div>
                                )}
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}