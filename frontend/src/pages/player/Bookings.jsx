import { useEffect, useState } from 'react';
import api from '../../api/client.js';
import PageHeader from '../../components/PageHeader.jsx';
import { Card, Badge, Button, Icon, Spinner, Empty, Field, Select, Input, npr } from '../../components/ui.jsx';

const TONE = { confirmed: 'green', pending: 'amber', declined: 'red', cancelled: 'slate' };

export default function Bookings() {
  const [bookings, setBookings] = useState(null);
  const [futsals, setFutsals] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ futsalId: '', court: 'Court 1', date: new Date().toISOString().slice(0, 10), startTime: '18:00', endTime: '19:00' });
  const [err, setErr] = useState('');

  const load = () => api.get('/bookings').then(({ data }) => setBookings(data));
  useEffect(() => { load(); api.get('/futsals', { params: { verified: true } }).then(({ data }) => { setFutsals(data); if (data[0]) setForm((f) => ({ ...f, futsalId: String(data[0].id) })); }); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const book = async (e) => {
    e.preventDefault(); setErr('');
    try { await api.post('/bookings', { ...form, futsalId: Number(form.futsalId) }); setOpen(false); load(); }
    catch (e) { setErr(e.response?.data?.message || 'Could not book'); }
  };

  const courts = futsals.find((f) => String(f.id) === form.futsalId)?.courts || [{ name: 'Court 1' }];

  return (
    <>
      <PageHeader title="My bookings" sub="Court reservations" actions={<Button icon="plus" onClick={() => setOpen((o) => !o)}>Book a court</Button>} />
      <div className="p-7 max-w-4xl mx-auto">
        {open && (
          <Card className="p-5 mb-5">
            <h3 className="font-bold text-zinc-900 mb-4">New booking</h3>
            <form onSubmit={book} className="grid sm:grid-cols-2 gap-4">
              <Field label="Venue" icon="building">
                <Select value={form.futsalId} onChange={set('futsalId')}>{futsals.map((f) => <option key={f.id} value={f.id}>{f.name} ({npr(f.pricePerHour)}/hr)</option>)}</Select>
              </Field>
              <Field label="Court" icon="grid"><Select value={form.court} onChange={set('court')}>{courts.map((c) => <option key={c.name}>{c.name}</option>)}</Select></Field>
              <Field label="Date" icon="calendar"><Input type="date" value={form.date} onChange={set('date')} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="From" icon="clock"><Input type="time" value={form.startTime} onChange={set('startTime')} /></Field>
                <Field label="To" icon="clock"><Input type="time" value={form.endTime} onChange={set('endTime')} /></Field>
              </div>
              {err && <div className="sm:col-span-2 text-[13px] text-red-600 bg-red-50 rounded-lg px-3 py-2">{err}</div>}
              <div className="sm:col-span-2 flex gap-3"><Button variant="secondary" full onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" full icon="check">Confirm booking</Button></div>
            </form>
          </Card>
        )}

        {bookings === null ? <Spinner /> : bookings.length === 0 ? (
          <Empty icon="calendar" title="No bookings yet" sub="Book a court to get started." />
        ) : (
          <Card className="overflow-hidden">
            <table className="w-full text-[13px]">
              <thead><tr className="text-left text-[11px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100">
                <th className="px-5 py-3">Venue</th><th className="py-3">Court</th><th className="py-3">Date</th><th className="py-3">Time</th><th className="py-3">Amount</th><th className="py-3">Status</th>
              </tr></thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-zinc-50 last:border-0">
                    <td className="px-5 py-3 font-semibold text-zinc-800">{b.futsal?.name}</td>
                    <td className="py-3 text-zinc-600">{b.court}</td>
                    <td className="py-3 text-zinc-500">{b.date}</td>
                    <td className="py-3 text-zinc-500">{b.startTime}–{b.endTime}</td>
                    <td className="py-3 font-bold text-zinc-900">{npr(b.amount)}</td>
                    <td className="py-3"><Badge tone={TONE[b.status]} dot>{b.status}</Badge></td>
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
