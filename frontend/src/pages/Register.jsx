import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Icon, Button, Field, Input, Select } from '../components/ui.jsx';

const ROLES = [
  { id: 'player', label: 'Player', desc: 'Find & join matches', icon: 'ball', hue: 152 },
  { id: 'owner', label: 'Futsal Owner', desc: 'Manage courts & bookings', icon: 'building', hue: 28 },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'player', position: 'Midfielder', skill: 'Intermediate' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try { await register(form); navigate('/app'); }
    catch (e) { setErr(e.response?.data?.message || 'Registration failed'); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl ring-1 ring-zinc-200 p-7 sm:p-9">
        <div className="flex items-center gap-2.5 mb-7">
          <div className="h-10 w-10 rounded-xl bg-acc text-white grid place-items-center"><Icon name="logo" size={22} /></div>
          <span className="text-[20px] font-black tracking-tight">Sathi</span>
        </div>
        <h2 className="text-[24px] font-extrabold tracking-tight text-zinc-900">Create your account</h2>
        <p className="text-[14px] text-zinc-500 mt-1">Join the Pokhara futsal community.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {/* role */}
          <div className="grid grid-cols-2 gap-2.5">
            {ROLES.map((r) => (
              <button type="button" key={r.id} onClick={() => setForm((f) => ({ ...f, role: r.id }))}
                className={`flex items-center gap-3 p-3 rounded-xl ring-1 transition text-left ${form.role === r.id ? 'ring-2 ring-acc bg-acc-50' : 'ring-zinc-200'}`}>
                <span className="h-9 w-9 rounded-lg grid place-items-center shrink-0" style={{ background: `hsl(${r.hue} 60% 93%)`, color: `hsl(${r.hue} 55% 35%)` }}><Icon name={r.icon} size={19} /></span>
                <div className="min-w-0">
                  <div className="text-[14px] font-bold text-zinc-900">{r.label}</div>
                  <div className="text-[11.5px] text-zinc-500 truncate">{r.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <Field label="Full name" icon="user"><Input value={form.name} onChange={set('name')} placeholder="Aarav Sharma" required /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email" icon="send"><Input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required /></Field>
            <Field label="Phone" icon="message"><Input value={form.phone} onChange={set('phone')} placeholder="+977 98…" /></Field>
          </div>
          <Field label="Password" icon="shield"><Input type="password" value={form.password} onChange={set('password')} placeholder="Min 6 characters" required /></Field>

          {form.role === 'player' && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Position" icon="user">
                <Select value={form.position} onChange={set('position')}>
                  {['Goalkeeper', 'Defender', 'Midfielder', 'Winger', 'Striker'].map((p) => <option key={p}>{p}</option>)}
                </Select>
              </Field>
              <Field label="Skill" icon="activity">
                <Select value={form.skill} onChange={set('skill')}>
                  {['Beginner', 'Intermediate', 'Advanced'].map((s) => <option key={s}>{s}</option>)}
                </Select>
              </Field>
            </div>
          )}

          {err && <div className="text-[13px] font-medium text-red-600 bg-red-50 rounded-lg px-3 py-2">{err}</div>}
          <Button type="submit" full size="lg" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</Button>
        </form>

        <p className="text-center text-[13px] text-zinc-500 mt-5">
          Already have an account? <Link to="/login" className="font-bold text-acc-700">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
