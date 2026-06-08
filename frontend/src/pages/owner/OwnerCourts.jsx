import { useEffect, useState } from 'react';
import api from '../../api/client.js';
import PageHeader from '../../components/PageHeader.jsx';
import { Card, Badge, Button, Field, Input, Icon, Spinner, Empty, npr } from '../../components/ui.jsx';

export default function OwnerCourts() {
  const [futsals, setFutsals] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', area: '', pricePerHour: 1600, openHours: '6 AM – 10 PM' });
  const [err, setErr] = useState('');

  const load = () => api.get('/futsals', { params: { mine: true } }).then(({ data }) => setFutsals(data));
  useEffect(() => { load(); }, []);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const create = async (e) => {
    e.preventDefault(); setErr('');
    try { await api.post('/futsals', { ...form, pricePerHour: Number(form.pricePerHour) }); setOpen(false); setForm({ name: '', area: '', pricePerHour: 1600, openHours: '6 AM – 10 PM' }); load(); }
    catch (e) { setErr(e.response?.data?.message || 'Could not add venue'); }
  };

  return (
    <>
      <PageHeader title="My Courts" sub="Venues you manage" actions={<Button icon="plus" onClick={() => setOpen((o) => !o)}>Add venue</Button>} />
      <div className="p-7 max-w-5xl mx-auto">
        {open && (
          <Card className="p-5 mb-5">
            <h3 className="font-bold text-zinc-900 mb-4">Register a new venue</h3>
            <form onSubmit={create} className="grid sm:grid-cols-2 gap-4">
              <Field label="Venue name" icon="building"><Input value={form.name} onChange={set('name')} placeholder="Lakeside Futsal Arena" required /></Field>
              <Field label="Area" icon="pin"><Input value={form.area} onChange={set('area')} placeholder="Lakeside, Pokhara" required /></Field>
              <Field label="Price / hour (NPR)" icon="money"><Input type="number" value={form.pricePerHour} onChange={set('pricePerHour')} /></Field>
              <Field label="Open hours" icon="clock"><Input value={form.openHours} onChange={set('openHours')} /></Field>
              {err && <div className="sm:col-span-2 text-[13px] text-red-600 bg-red-50 rounded-lg px-3 py-2">{err}</div>}
              <div className="sm:col-span-2 text-[12px] text-zinc-400">New venues are submitted for admin verification before they appear publicly.</div>
              <div className="sm:col-span-2 flex gap-3"><Button variant="secondary" full onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" full icon="check">Submit for verification</Button></div>
            </form>
          </Card>
        )}

        {futsals === null ? <Spinner /> : futsals.length === 0 ? (
          <Empty icon="building" title="No venues yet" sub="Add your first futsal venue." />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {futsals.map((f) => (
              <Card key={f.id} className="p-5">
                <div className="flex items-center justify-between">
                  <div className="h-11 w-11 rounded-xl bg-acc-50 text-acc-700 grid place-items-center"><Icon name="building" size={22} /></div>
                  <Badge tone={f.verified ? 'green' : f.status === 'Rejected' ? 'red' : 'amber'} dot>{f.verified ? 'Verified' : f.status}</Badge>
                </div>
                <h3 className="font-bold text-zinc-900 mt-3">{f.name}</h3>
                <div className="text-[12.5px] text-zinc-500 flex items-center gap-1 mt-0.5"><Icon name="pin" size={13} /> {f.area}</div>
                <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between text-[13px]">
                  <span className="text-zinc-500 flex items-center gap-1"><Icon name="grid" size={14} /> {f.courts?.length || 0} courts</span>
                  <span className="font-bold text-zinc-900">{npr(f.pricePerHour)}/hr</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
