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

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
};

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await apiClient.get('/api/owner/bookings');
        if (res.data.success) setBookings(res.data.bookings);
      } catch (err) { 
        console.error(err); 
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
      <div className="bg-[#0B0C10] text-[#F0EDE6] min-h-[60vh] flex items-center justify-center font-bold tracking-wider uppercase text-sm" style={DISPLAY}>
        <Loader2 className="animate-spin h-8 w-8 text-[#C8F55A] mr-3" />
        <span>Syncing Hub Reservations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-[#0B0C10] text-[#F0EDE6] min-h-screen relative overflow-hidden selection:bg-[#C8F55A] selection:text-black">
      {/* Dynamic graphic lighting glow element */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-[#C8F55A]/5 blur-[120px] pointer-events-none" />

      <h1 className="text-3xl font-black text-white uppercase tracking-wider flex items-center gap-3" style={DISPLAY}>
        <span className="w-1.5 h-6 bg-[#C8F55A] rounded-full"></span>
        Manage Reservations
      </h1>

      {/* Cyberpunk Hub Registry Panel */}
      <div className="bg-[#12161A] rounded-2xl border border-white/5 shadow-2xl overflow-hidden relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0A1F1A]/50 border-b border-white/5 text-[10px] uppercase tracking-widest text-white/40 font-bold" style={DISPLAY}>
                <th className="p-4 lg:p-5">Player Details</th>
                <th className="p-4 lg:p-5">Arena & Schedule</th>
                <th className="p-4 lg:p-5">Cost Breakdown</th>
                <th className="p-4 lg:p-5">Status state</th>
                <th className="p-4 lg:p-5 text-right">Actions Dashboard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-white/30 text-xs uppercase font-bold tracking-wider" style={DISPLAY}>
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors group">
                    {/* User Identity Info Node */}
                    <td className="p-4 lg:p-5">
                      <div className="flex flex-col space-y-1">
                        <span className="font-bold text-white group-hover:text-[#C8F55A] transition-colors flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-white/30" />
                          {booking.user.playerProfile?.fullName || 'Unknown User'}
                        </span>
                        <span className="text-xs text-white/50 flex items-center gap-1.5">
                          {booking.user.playerProfile?.phoneNumber ? (
                            <>
                              <Phone className="w-3 h-3 text-white/20" /> 
                              {booking.user.playerProfile.phoneNumber}
                            </>
                          ) : (
                            <>
                              <Mail className="w-3 h-3 text-white/20" /> 
                              {booking.user.email}
                            </>
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Arena Registry Details Node */}
                    <td className="p-4 lg:p-5">
                      <div className="flex flex-col space-y-1">
                        <span className="font-bold text-white uppercase tracking-wide flex items-center gap-1.5" style={DISPLAY}>
                          <Layers className="w-3.5 h-3.5 text-[#C8F55A]/70" />
                          {booking.ground.name}
                        </span>
                        <span className="text-xs text-white/50 flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-white/20" />
                          {new Date(booking.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} | {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </td>

                    {/* Total Financial Cost Value Column */}
                    <td className="p-4 lg:p-5 font-black text-[#C8F55A] text-base" style={DISPLAY}>
                      <span className="flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 opacity-60" /> Rs. {booking.totalCost}
                      </span>
                    </td>

                    {/* Registry Status Badge Column */}
                    <td className="p-4 lg:p-5">
                      <span 
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${
                          booking.status === 'PENDING' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                          booking.status === 'APPROVED' ? 'bg-[#C8F55A]/10 border-[#C8F55A]/20 text-[#C8F55A]' :
                          booking.status === 'COMPLETED' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                          'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}
                        style={DISPLAY}
                      >
                        {booking.status === 'PENDING' && <AlertCircle className="w-3 h-3" />}
                        {booking.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                        {booking.status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3 text-blue-400" />}
                        {booking.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
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
                              className="text-[10px] font-bold bg-[#C8F55A] text-black px-3 py-1.5 rounded-lg hover:bg-[#bada52] uppercase tracking-wider transition-colors"
                              style={DISPLAY}
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(booking.id, 'REJECTED')} 
                              className="text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/20 uppercase tracking-wider transition-all"
                              style={DISPLAY}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {booking.status === 'APPROVED' && (
                          <button 
                            onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')} 
                            className="text-[10px] font-bold bg-white/5 border border-white/10 text-white hover:border-[#C8F55A]/30 hover:text-[#C8F55A] px-4 py-1.5 rounded-lg uppercase tracking-wider transition-all"
                            style={DISPLAY}
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