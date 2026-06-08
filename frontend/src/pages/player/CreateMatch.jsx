import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client.js';
import PageHeader from '../../components/PageHeader.jsx';
import { Card, Button, Field, Input, Select, Icon, npr } from '../../components/ui.jsx';

export default function CreateMatch() {
  const navigate = useNavigate();
  const [futsals, setFutsals] = useState([]);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: 'Evening 5-a-side', futsalId: '', format: '5v5', type: 'Casual', skill: 'Intermediate',
    date: new Date().toISOString().slice(0, 10), time: '18:00', capacity: 10, pricePerHead: 180, requiresApproval: true,
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    api.get('/futsals', { params: { verified: true } }).then(({ data }) => {
      setFutsals(data);
      if (data[0]) setForm((f) => ({ ...f, futsalId: String(data[0].id) }));
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      const { data } = await api.post('/matches', { ...form, capacity: Number(form.capacity), pricePerHead: Number(form.pricePerHead), futsalId: Number(form.futsalId) });
      navigate(`/app/matches/${data.id}`);
    } catch (e) { setErr(e.response?.data?.message || 'Could not create match'); }
    finally { setBusy(false); }
  };

  const seg = (k, opts) => (
    <div className="flex gap-1.5 p-1 rounded-xl bg-zinc-100">
      {opts.map((o) => (
        <button type="button" key={o} onClick={() => setForm((f) => ({ ...f, [k]: o }))}
          className={`flex-1 h-9 rounded-lg text-[13px] font-semibold transition ${form[k] === o ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}>{o}</button>
      ))}
    </div>
  );

  return (
    <>
      <PageHeader title="Create a match" sub="Set it up and invite players" onBack={() => navigate(-1)} />
      <div className="p-7 max-w-2xl mx-auto">
        <form onSubmit={submit} className="space-y-5">
          <Card className="p-5 space-y-4">
            <Field label="Match title" icon="ball"><Input value={form.title} onChange={set('title')} required /></Field>
            <div>
              <span className="text-[12px] font-semibold text-zinc-500 ml-1">Format</span>
              <div className="mt-1.5">{seg('format', ['5v5', '6v6', '7v7'])}</div>
            </div>
            <div>
              <span className="text-[12px] font-semibold text-zinc-500 ml-1">Match type</span>
              <div className="mt-1.5">{seg('type', ['Casual', 'Competitive', 'Event'])}</div>
            </div>
            <Field label="Venue" icon="building">
              <Select value={form.futsalId} onChange={set('futsalId')} required>
                {futsals.map((f) => <option key={f.id} value={f.id}>{f.name} — {f.area} ({npr(f.pricePerHour)}/hr)</option>)}
              </Select>
            </Field>
          </Card>

          <Card className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date" icon="calendar"><Input type="date" value={form.date} onChange={set('date')} required /></Field>
              <Field label="Kickoff" icon="clock"><Input type="time" value={form.time} onChange={set('time')} required /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Capacity" icon="users"><Input type="number" min="2" value={form.capacity} onChange={set('capacity')} /></Field>
              <Field label="Price / head (NPR)" icon="money"><Input type="number" min="0" value={form.pricePerHead} onChange={set('pricePerHead')} /></Field>
            </div>
            <div>
              <span className="text-[12px] font-semibold text-zinc-500 ml-1">Skill level</span>
              <div className="mt-1.5">{seg('skill', ['Beginner', 'Intermediate', 'Advanced'])}</div>
            </div>
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 ring-1 ring-zinc-200 cursor-pointer">
              <div><div className="text-[14px] font-bold text-zinc-900">Approve join requests</div><div className="text-[12px] text-zinc-500">Manually accept who plays</div></div>
              <input type="checkbox" checked={form.requiresApproval} onChange={(e) => setForm((f) => ({ ...f, requiresApproval: e.target.checked }))} className="h-5 w-5 accent-acc" />
            </label>
          </Card>

          {err && <div className="text-[13px] font-medium text-red-600 bg-red-50 rounded-lg px-3 py-2">{err}</div>}
          <div className="flex gap-3">
            <Button variant="secondary" full onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" full size="lg" icon="ball" disabled={busy}>{busy ? 'Publishing…' : 'Publish match'}</Button>
          </div>
        </form>
      </div>
    </>
  );
}
