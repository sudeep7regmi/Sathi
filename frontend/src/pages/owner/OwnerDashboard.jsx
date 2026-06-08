import { useEffect, useState } from 'react';
import api from '../../api/client.js';
import PageHeader from '../../components/PageHeader.jsx';
import { Card, Badge, Button, Avatar, Icon, Spinner, Stat, npr } from '../../components/ui.jsx';

export default function OwnerDashboard() {
  const [bookings, setBookings] = useState(null);
  const [futsals, setFutsals] = useState([]);

  const load = () => api.get('/bookings').then(({ data }) => setBookings(data));
  useEffect(() => { load(); api.get('/futsals', { params: { mine: true } }).then(({ data }) => setFutsals(data)); }, []);

  const decide = async (id, status) => { await api.patch(`/bookings/${id}`, { status }); load(); };

  const confirmed = (bookings || []).filter((b) => b.status === 'confirmed');
  const pending = (bookings || []).filter((b) => b.status === 'pending');
  const revenue = confirmed.reduce((s, b) => s + b.amount, 0);

  return (
    <>
      <PageHeader title="Dashboard" sub="Your venues at a glance" />
      <div className="p-7 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat label="Total bookings" value={(bookings || []).length} icon="calendar" />
          <Stat label="Confirmed revenue" value={npr(revenue)} tone="green" icon="money" />
          <Stat label="Pending approvals" value={pending.length} tone="amber" delta={pending.length ? 'Action needed' : '—'} icon="bell" />
          <Stat label="My courts" value={futsals.reduce((s, f) => s + (f.courts?.length || 0), 0)} icon="building" />
        </div>

        <Card className="mt-5 overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-100 font-bold text-zinc-900">Booking requests</div>
          {bookings === null ? <Spinner /> : bookings.length === 0 ? (
            <div className="p-8 text-center text-zinc-400 text-sm">No bookings yet.</div>
          ) : (
            <table className="w-full text-[13px]">
              <thead><tr className="text-left text-[11px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100">
                <th className="px-5 py-3">Booked by</th><th className="py-3">Venue</th><th className="py-3">Court</th><th className="py-3">Date</th><th className="py-3">Time</th><th className="py-3">Amount</th><th className="py-3">Status</th><th className="py-3 pr-5 text-right">Action</th>
              </tr></thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50">
                    <td className="px-5 py-3"><div className="flex items-center gap-2.5"><Avatar name={b.user?.name} hue={b.user?.avatarHue} size={30} /><span className="font-semibold text-zinc-800">{b.user?.name}</span></div></td>
                    <td className="py-3 text-zinc-500">{b.futsal?.name}</td>
                    <td className="py-3 text-zinc-600">{b.court}</td>
                    <td className="py-3 text-zinc-500">{b.date}</td>
                    <td className="py-3 text-zinc-500">{b.startTime}–{b.endTime}</td>
                    <td className="py-3 font-bold text-zinc-900">{npr(b.amount)}</td>
                    <td className="py-3"><Badge tone={b.status === 'confirmed' ? 'green' : b.status === 'pending' ? 'amber' : 'red'} dot>{b.status}</Badge></td>
                    <td className="py-3 pr-5 text-right">
                      {b.status === 'pending' ? (
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => decide(b.id, 'declined')} className="h-8 px-3 rounded-lg ring-1 ring-zinc-200 text-zinc-600 text-[12px] font-semibold">Decline</button>
                          <button onClick={() => decide(b.id, 'confirmed')} className="h-8 px-3 rounded-lg bg-acc text-white text-[12px] font-semibold">Approve</button>
                        </div>
                      ) : <Icon name="check" size={16} className="text-zinc-300 inline" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </>
  );
}
