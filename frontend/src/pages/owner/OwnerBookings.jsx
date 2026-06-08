import { useEffect, useState } from 'react';
import api from '../../api/client.js';
import PageHeader from '../../components/PageHeader.jsx';
import { Card, Badge, Button, Avatar, Icon, Spinner, Empty, npr } from '../../components/ui.jsx';

const TONE = { confirmed: 'green', pending: 'amber', declined: 'red', cancelled: 'slate' };

export default function OwnerBookings() {
  const [bookings, setBookings] = useState(null);
  const [filter, setFilter] = useState('all');
  const load = () => api.get('/bookings').then(({ data }) => setBookings(data));
  useEffect(() => { load(); }, []);
  const decide = async (id, status) => { await api.patch(`/bookings/${id}`, { status }); load(); };

  const rows = (bookings || []).filter((b) => filter === 'all' || b.status === filter);

  return (
    <>
      <PageHeader title="Bookings" sub="All reservations across your courts" />
      <div className="p-7 max-w-5xl mx-auto">
        <div className="flex gap-2 mb-4">
          {['all', 'pending', 'confirmed', 'declined'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`h-9 px-4 rounded-lg text-[13px] font-semibold capitalize ${filter === f ? 'bg-zinc-900 text-white' : 'bg-white ring-1 ring-zinc-200 text-zinc-600'}`}>{f}</button>
          ))}
        </div>
        {bookings === null ? <Spinner /> : rows.length === 0 ? <Empty icon="calendar" title="No bookings" /> : (
          <Card className="overflow-hidden">
            <table className="w-full text-[13px]">
              <thead><tr className="text-left text-[11px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100">
                <th className="px-5 py-3">Booked by</th><th className="py-3">Court</th><th className="py-3">Date</th><th className="py-3">Time</th><th className="py-3">Amount</th><th className="py-3">Status</th><th className="py-3 pr-5 text-right">Action</th>
              </tr></thead>
              <tbody>
                {rows.map((b) => (
                  <tr key={b.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50">
                    <td className="px-5 py-3.5"><div className="flex items-center gap-2.5"><Avatar name={b.user?.name} hue={b.user?.avatarHue} size={30} /><span className="font-semibold text-zinc-800">{b.user?.name}</span></div></td>
                    <td className="py-3.5 text-zinc-600">{b.court}</td>
                    <td className="py-3.5 text-zinc-500">{b.date}</td>
                    <td className="py-3.5 text-zinc-500">{b.startTime}–{b.endTime}</td>
                    <td className="py-3.5 font-bold text-zinc-900">{npr(b.amount)}</td>
                    <td className="py-3.5"><Badge tone={TONE[b.status]} dot>{b.status}</Badge></td>
                    <td className="py-3.5 pr-5 text-right">
                      {b.status === 'pending' ? (
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => decide(b.id, 'declined')} className="h-8 px-3 rounded-lg ring-1 ring-zinc-200 text-zinc-600 text-[12px] font-semibold">Decline</button>
                          <button onClick={() => decide(b.id, 'confirmed')} className="h-8 px-3 rounded-lg bg-acc text-white text-[12px] font-semibold">Approve</button>
                        </div>
                      ) : <span className="text-zinc-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </>
  );
}
