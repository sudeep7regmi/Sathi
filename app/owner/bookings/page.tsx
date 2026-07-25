'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';
import axios from 'axios';
import { 
  CalendarDays, 
  User, 
  Phone, 
  Mail, 
  Clock, 
  Layers, 
  Coins, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2 
} from 'lucide-react';

interface Booking {
  id: string; 
  date: string; 
  startTime: string; 
  endTime: string; 
  duration: number; 
  totalCost: number; 
  status: string;
  ground: { name: string };
  user: { email: string; playerProfile?: { fullName: string; phoneNumber: string } };
}

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

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
          Review turf requests, coordinate schedules, and track facility revenue.
        </p>
      </div>

      {/* Cyberpunk Hub Registry Panel transformed into a clean Light Table */}
      <div 
        className="rounded-2xl border shadow-sm overflow-hidden relative z-10"
        style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
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
                  <td colSpan={5} className="p-12 text-center text-slate-400 text-xs uppercase font-bold tracking-wider">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/60 transition-colors group">
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

                    {/* Arena Registry Details Node */}
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

                    {/* Total Financial Cost Value Column */}
                    <td className="p-4 lg:p-5 font-black text-emerald-600 text-base">
                      <span className="flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 opacity-75" /> Rs. {booking.totalCost}
                      </span>
                    </td>

                    {/* Registry Status Badge Column */}
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

                    {/* Interactive Action Points Controls */}
                    <td className="p-4 lg:p-5 text-right whitespace-nowrap">
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}