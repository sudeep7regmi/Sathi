import { useEffect, useState } from 'react';
import api from '../../api/client.js';
import PageHeader from '../../components/PageHeader.jsx';
import { Card, Stat, Icon, Spinner } from '../../components/ui.jsx';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/admin/stats').then(({ data }) => setStats(data)); }, []);
  if (!stats) return <><PageHeader title="Overview" sub="Platform health" /><Spinner /></>;

  const bars = [
    ['Players', stats.players, 152],
    ['Futsal Owners', stats.owners, 28],
    ['Admins', stats.admins, 220],
  ];
  const max = Math.max(...bars.map((b) => b[1]), 1);

  return (
    <>
      <PageHeader title="Overview" sub="Platform health · Pokhara region" />
      <div className="p-7 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat label="Total users" value={stats.users} icon="users" />
          <Stat label="Active matches" value={stats.matches} tone="blue" delta={`Live: ${stats.liveMatches}`} icon="ball" />
          <Stat label="Registered courts" value={stats.futsals} tone="amber" delta={`${stats.pendingFutsals} pending`} icon="building" />
          <Stat label="Total bookings" value={stats.bookings} icon="calendar" />
        </div>

        <Card className="mt-5 p-5">
          <h3 className="font-bold text-zinc-900 mb-4">User breakdown</h3>
          <div className="space-y-4">
            {bars.map(([label, val, hue]) => (
              <div key={label}>
                <div className="flex justify-between text-[12.5px] mb-1.5"><span className="font-semibold text-zinc-700 whitespace-nowrap">{label}</span><span className="font-bold text-zinc-900">{val}</span></div>
                <div className="h-2.5 rounded-full bg-zinc-100 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(val / max) * 100}%`, background: `hsl(${hue} 55% 48%)` }} /></div>
              </div>
            ))}
          </div>
        </Card>

        {stats.pendingFutsals > 0 && (
          <Card className="mt-5 p-4 flex items-center gap-3">
            <span className="h-10 w-10 rounded-full bg-amber-50 text-amber-600 grid place-items-center"><Icon name="shield" size={19} /></span>
            <div className="flex-1"><div className="font-bold text-zinc-900 text-[14px]">{stats.pendingFutsals} venue(s) awaiting verification</div><div className="text-[12.5px] text-zinc-500">Review them in the Verifications tab.</div></div>
          </Card>
        )}
      </div>
    </>
  );
}
