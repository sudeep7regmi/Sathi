import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Icon, Avatar, Badge } from './ui.jsx';

const NAV = {
  player: [
    { to: '/app', icon: 'home', label: 'Home', end: true },
    { to: '/app/discover', icon: 'compass', label: 'Discover' },
    { to: '/app/create', icon: 'plus', label: 'Create match' },
    { to: '/app/bookings', icon: 'calendar', label: 'My bookings' },
    { to: '/app/notifications', icon: 'bell', label: 'Notifications' },
  ],
  owner: [
    { to: '/app', icon: 'grid', label: 'Dashboard', end: true },
    { to: '/app/bookings', icon: 'calendar', label: 'Bookings' },
    { to: '/app/courts', icon: 'building', label: 'My Courts' },
  ],
  admin: [
    { to: '/app', icon: 'grid', label: 'Overview', end: true },
    { to: '/app/users', icon: 'users', label: 'Users' },
    { to: '/app/verifications', icon: 'shield', label: 'Verifications' },
  ],
};

const ROLE_LABEL = { player: 'Player', owner: 'Futsal Owner', admin: 'Admin' };
const ROLE_TONE = { player: 'green', owner: 'amber', admin: 'blue' };

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = NAV[user.role] || NAV.player;

  const doLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-white border-r border-zinc-200 flex flex-col">
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-zinc-100">
          <div className="h-8 w-8 rounded-lg bg-acc text-white grid place-items-center"><Icon name="logo" size={19} stroke={2.2} /></div>
          <div>
            <div className="font-extrabold tracking-tight text-zinc-900 leading-none">Sathi</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mt-0.5">{ROLE_LABEL[user.role]}</div>
          </div>
        </div>
        <nav className="p-3 flex-1 overflow-y-auto no-scrollbar">
          {items.map((it) => (
            <NavLink key={it.to} to={it.to} end={it.end}
              className={({ isActive }) => `w-full flex items-center gap-3 px-3 h-10 rounded-lg text-sm font-medium mb-0.5 transition ${isActive ? 'bg-acc-50 text-acc-700' : 'text-zinc-500 hover:bg-zinc-50'}`}>
              <Icon name={it.icon} size={19} />{it.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-zinc-100">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <Avatar name={user.name} hue={user.avatarHue} size={34} />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold text-zinc-800 truncate">{user.name}</div>
              <div className="text-[11px] text-zinc-400 truncate">{user.email}</div>
            </div>
          </div>
          <button onClick={doLogout} className="mt-1 w-full flex items-center gap-3 px-3 h-9 rounded-lg text-[13px] font-semibold text-zinc-500 hover:bg-zinc-50 transition">
            <Icon name="logout" size={18} /> Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col bg-zinc-50">
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center px-7 gap-3 shrink-0">
          <span className="font-black tracking-tight text-[16px]">Sathi</span>
          <Badge tone={ROLE_TONE[user.role]} dot>{ROLE_LABEL[user.role]}</Badge>
          <div className="flex-1" />
          <div className="hidden sm:flex items-center gap-2 text-[13px] text-zinc-500">
            <Avatar name={user.name} hue={user.avatarHue} size={28} />
            <span className="font-medium">{user.email}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
