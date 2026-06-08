// Shared UI primitives — icons, buttons, cards, badges, avatars, inputs.
const ICONS = {
  home: 'M3 10.5 12 3l9 7.5M5 9.5V20h5v-6h4v6h5V9.5',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM15.5 8.5l-2 5-5 2 2-5 5-2Z',
  plus: 'M12 5v14M5 12h14',
  bell: 'M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6M9.5 20a2.5 2.5 0 0 0 5 0',
  calendar: 'M4 6h16v15H4zM4 10h16M8 3v4M16 3v4',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2',
  pin: 'M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21c0-4 3.5-6 8-6s8 2 8 6',
  users: 'M9 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2.5 20c0-3.3 3-5 6.5-5s6.5 1.7 6.5 5M17 5.5a3.2 3.2 0 0 1 0 6.4M18.5 14.6c2.2.6 3.5 2 3.5 4.4',
  trophy: 'M7 4h10v4a5 5 0 0 1-10 0V4ZM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 14.5 8.5 20h7L15 14.5M7 20h10',
  star: 'M12 4l2.3 4.8 5.2.6-3.8 3.6 1 5.1L12 15.7 7.3 18.2l1-5.1L4.5 9.4l5.2-.6L12 4Z',
  check: 'M5 12.5 10 17l9-10',
  x: 'M6 6l12 12M18 6 6 18',
  chevR: 'M9 5l7 7-7 7',
  chevL: 'M15 5l-7 7 7 7',
  arrowR: 'M5 12h14M13 5l7 7-7 7',
  logout: 'M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 8l-4 4 4 4M6 12h11',
  shield: 'M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM16 16l5 5',
  ball: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 8.5l3.5 2.5-1.3 4h-4.4l-1.3-4L12 8.5Z',
  money: 'M4 6h16v12H4zM4 9.5h16M8 13.5h2M14 13.5h2',
  building: 'M5 21V5l8-2v18M13 21V9l6 2v10M5 21h16M8 8h2M8 12h2M8 16h2M16 14h.01M16 17h.01',
  message: 'M4 5h16v11H8l-4 3.5V5Z',
  send: 'M21 4 3 11l6 2 2 6 10-15Z',
  bolt: 'M13 3 4 14h6l-1 7 9-11h-6l1-7Z',
  activity: 'M3 12h4l3 7 4-14 3 7h4',
  settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 13a7.5 7.5 0 0 0 0-2l2-1.5-2-3.5-2.3 1a7 7 0 0 0-1.7-1l-.3-2.5h-4l-.3 2.5a7 7 0 0 0-1.7 1l-2.3-1-2 3.5L4.6 11a7.5 7.5 0 0 0 0 2l-2 1.5 2 3.5 2.3-1a7 7 0 0 0 1.7 1l.3 2.5h4l.3-2.5a7 7 0 0 0 1.7-1l2.3 1 2-3.5L19.4 13Z',
  whistle: 'M3 11a4 4 0 0 0 4 4h6l6 3v-9a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4ZM8 11h.01',
  flag: 'M5 21V4M5 4c3-2 6 2 9 0v9c-3 2-6-2-9 0',
  logo: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 8.5l3.5 2.5-1.3 4h-4.4l-1.3-4L12 8.5Z',
  dots: 'M5 12h.01M12 12h.01M19 12h.01',
};

export function Icon({ name, size = 22, stroke = 2, className = '', style }) {
  const d = (ICONS[name] || ICONS.dots).split('M').filter(Boolean).map((s) => 'M' + s);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      {d.map((seg, i) => <path key={i} d={seg} />)}
    </svg>
  );
}

export function Avatar({ name, hue = 152, size = 40, ring }) {
  const ini = name ? name.split(' ').map((w) => w[0]).slice(0, 2).join('') : '?';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `hsl(${hue} 60% 93%)`, color: `hsl(${hue} 55% 32%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.38,
      boxShadow: ring ? '0 0 0 2px #fff, 0 0 0 3.5px hsl(' + hue + ' 50% 85%)' : 'none',
    }}>{ini}</div>
  );
}

const TONES = {
  green: 'bg-acc-50 text-acc-700', amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-600', blue: 'bg-blue-50 text-blue-600',
  slate: 'bg-zinc-100 text-zinc-600', violet: 'bg-violet-50 text-violet-600',
};
export function Badge({ children, tone = 'slate', dot, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${TONES[tone]} ${className}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />}{children}
    </span>
  );
}

export function Button({ children, variant = 'primary', size = 'md', icon, full, type = 'button', disabled, onClick, className = '' }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer whitespace-nowrap';
  const sizes = { sm: 'h-9 px-3.5 text-[13px]', md: 'h-11 px-5 text-sm', lg: 'h-12 px-6 text-[15px]' };
  const variants = {
    primary: 'bg-acc text-white shadow-sm hover:bg-acc-600',
    secondary: 'bg-white text-zinc-800 ring-1 ring-zinc-200 hover:bg-zinc-50',
    ghost: 'text-zinc-600 hover:bg-zinc-100',
    danger: 'bg-white text-red-600 ring-1 ring-red-200 hover:bg-red-50',
    dark: 'bg-zinc-900 text-white hover:bg-zinc-800',
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${sizes[size]} ${variants[variant]} ${full ? 'w-full' : ''} ${className}`}>
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} stroke={2.2} />}{children}
    </button>
  );
}

export function Card({ children, className = '', onClick }) {
  return (
    <div onClick={onClick} className={`rounded-2xl bg-white ring-1 ring-zinc-200/70 ${onClick ? 'cursor-pointer hover:ring-zinc-300 transition' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function Field({ label, icon, hint, children }) {
  return (
    <label className="block">
      {label && <span className="text-[12px] font-semibold text-zinc-500 ml-1">{label}</span>}
      <div className="mt-1.5 flex items-center gap-2.5 h-12 px-3.5 rounded-xl bg-zinc-50 ring-1 ring-zinc-200 focus-within:ring-2 focus-within:ring-acc">
        {icon && <Icon name={icon} size={18} className="text-zinc-400" />}
        {children}
      </div>
      {hint && <span className="text-[11px] text-zinc-400 ml-1 mt-1 block">{hint}</span>}
    </label>
  );
}

export function Input(props) {
  return <input {...props} className="flex-1 bg-transparent outline-none text-[14.5px] text-zinc-900 placeholder:text-zinc-400" />;
}

export function Select({ children, ...props }) {
  return <select {...props} className="flex-1 bg-transparent outline-none text-[14.5px] text-zinc-900">{children}</select>;
}

export function Stat({ label, value, delta, tone = 'green', icon }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-medium text-zinc-400">{label}</span>
        {icon && <span className="text-acc"><Icon name={icon} size={17} /></span>}
      </div>
      <div className="text-[24px] font-extrabold tracking-tight text-zinc-900">{value}</div>
      {delta && <div className="mt-1"><Badge tone={tone}>{delta}</Badge></div>}
    </Card>
  );
}

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-zinc-400">
      <span className="h-5 w-5 rounded-full border-2 border-zinc-200 border-t-acc animate-spin" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function Empty({ icon = 'ball', title, sub }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <div className="h-14 w-14 rounded-2xl bg-zinc-100 text-zinc-400 grid place-items-center"><Icon name={icon} size={26} /></div>
      <div className="mt-3 font-bold text-zinc-700">{title}</div>
      {sub && <div className="text-[13px] text-zinc-400 mt-1 max-w-xs">{sub}</div>}
    </div>
  );
}

export const npr = (n) => 'NPR ' + Number(n || 0).toLocaleString('en-IN');
