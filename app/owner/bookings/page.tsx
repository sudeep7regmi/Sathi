'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/axios';
import axios from 'axios';

interface Booking {
  id: string; date: string; startTime: string; endTime: string; duration: number; totalCost: number; status: string;
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
      } catch (err) { console.error(err); } finally { setLoading(false); }
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

  if (loading) return <div className="p-10 font-bold text-center">Loading Reservations...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Manage Reservations</h1>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <th className="p-4">Player Details</th>
              <th className="p-4">Arena & Time</th>
              <th className="p-4">Cost</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.length === 0 ? (
              <tr><td colSpan={5} className="p-10 text-center text-slate-500">No bookings found.</td></tr>
            ) : bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-slate-900">{booking.user.playerProfile?.fullName || 'Unknown User'}</p>
                  <p className="text-xs text-slate-500">{booking.user.playerProfile?.phoneNumber || booking.user.email}</p>
                </td>
                <td className="p-4">
                  <p className="font-bold text-indigo-700">{booking.ground.name}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(booking.date).toLocaleDateString()} | {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </td>
                <td className="p-4 font-black text-emerald-600">Rs. {booking.totalCost}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                    booking.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {booking.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleStatusUpdate(booking.id, 'APPROVED')} className="text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">Approve</button>
                      <button onClick={() => handleStatusUpdate(booking.id, 'REJECTED')} className="text-xs font-bold bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">Reject</button>
                    </>
                  )}
                  {booking.status === 'APPROVED' && (
                    <button onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')} className="text-xs font-bold bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">Mark Completed</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}