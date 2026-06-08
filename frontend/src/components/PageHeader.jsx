// A simple page header used inside the main content area.
import { Icon } from './ui.jsx';

export default function PageHeader({ title, sub, actions, onBack }) {
  return (
    <div className="flex items-center gap-4 px-7 h-16 border-b border-zinc-200 bg-white sticky top-0 z-10">
      {onBack && (
        <button onClick={onBack} className="h-9 w-9 rounded-lg ring-1 ring-zinc-200 grid place-items-center text-zinc-500 hover:bg-zinc-50">
          <Icon name="chevL" size={18} />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-[17px] font-bold tracking-tight text-zinc-900 truncate">{title}</h1>
        {sub && <p className="text-[12.5px] text-zinc-400 truncate">{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
