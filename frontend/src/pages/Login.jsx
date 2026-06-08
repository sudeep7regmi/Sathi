import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Icon, Button, Field, Input } from '../components/ui.jsx';

const DEMO = [
  { role: 'Player', email: 'aarav.sharma@gmail.com' },
  { role: 'Owner', email: 'owner@lakeside.np' },
  { role: 'Admin', email: 'admin@sathi.com' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('aarav.sharma@gmail.com');
  const [password, setPassword] = useState('password123');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      await login(email, password);
      navigate('/app');
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed');
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden"
        style={{ background: 'linear-gradient(155deg,#0c6f32 0%,#13a04a 55%,#0f8a3e 100%)' }}>
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-10 bottom-10 opacity-10"><Icon name="ball" size={260} /></div>
        <div className="relative flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-white/15 grid place-items-center"><Icon name="logo" size={26} /></div>
          <span className="text-[22px] font-black tracking-tight">Sathi</span>
        </div>
        <div className="relative">
          <h1 className="text-[40px] font-black tracking-tight leading-[1.05]">Pokhara's futsal,<br />all in one place.</h1>
          <p className="text-white/80 text-[15px] mt-4 max-w-sm leading-relaxed">Coordinate matches, book courts and follow live scores in real time — for players, futsal owners and admins.</p>
        </div>
        <div className="relative text-[12px] text-white/60">© 2026 Sathi · Pokhara, Nepal</div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="h-10 w-10 rounded-xl bg-acc text-white grid place-items-center"><Icon name="logo" size={22} /></div>
            <span className="text-[20px] font-black tracking-tight">Sathi</span>
          </div>
          <h2 className="text-[26px] font-extrabold tracking-tight text-zinc-900">Welcome back</h2>
          <p className="text-[14px] text-zinc-500 mt-1">Sign in to your Sathi account.</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <Field label="Email" icon="user">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </Field>
            <Field label="Password" icon="shield">
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </Field>
            {err && <div className="text-[13px] font-medium text-red-600 bg-red-50 rounded-lg px-3 py-2">{err}</div>}
            <Button type="submit" full size="lg" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</Button>
          </form>

          <div className="mt-6 rounded-xl bg-zinc-50 ring-1 ring-zinc-200 p-3.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Demo accounts · password123</div>
            <div className="space-y-1.5">
              {DEMO.map((d) => (
                <button key={d.email} onClick={() => { setEmail(d.email); setPassword('password123'); }}
                  className="w-full flex items-center justify-between text-[13px] px-2 py-1.5 rounded-lg hover:bg-white transition">
                  <span className="font-semibold text-zinc-700">{d.role}</span>
                  <span className="text-zinc-400 font-mono text-[12px]">{d.email}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-[13px] text-zinc-500 mt-6">
            New to Sathi? <Link to="/register" className="font-bold text-acc-700">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
