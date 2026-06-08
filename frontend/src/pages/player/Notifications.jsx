import { useEffect, useState } from 'react';
import api from '../../api/client.js';
import PageHeader from '../../components/PageHeader.jsx';
import { Card, Button, Icon, Spinner, Empty } from '../../components/ui.jsx';

const META = {
  request: { i: 'user', c: 'bg-acc-50 text-acc-700' },
  approved: { i: 'check', c: 'bg-acc-50 text-acc-700' },
  live: { i: 'bolt', c: 'bg-amber-50 text-amber-600' },
  booking: { i: 'calendar', c: 'bg-blue-50 text-blue-600' },
  event: { i: 'trophy', c: 'bg-violet-50 text-violet-600' },
  system: { i: 'bell', c: 'bg-zinc-100 text-zinc-500' },
};

export default function Notifications() {
  const [items, setItems] = useState(null);
  const load = () => api.get('/notifications').then(({ data }) => setItems(data));
  useEffect(() => { load(); }, []);
  const markAll = async () => { await api.patch('/notifications/read-all'); load(); };

  return (
    <>
      <PageHeader title="Notifications" sub="Requests, approvals, bookings & alerts"
        actions={<Button variant="secondary" size="sm" onClick={markAll}>Mark all read</Button>} />
      <div className="p-7 max-w-2xl mx-auto">
        {items === null ? <Spinner /> : items.length === 0 ? (
          <Empty icon="bell" title="You're all caught up" />
        ) : (
          <Card className="overflow-hidden divide-y divide-zinc-100">
            {items.map((n) => {
              const m = META[n.type] || META.system;
              return (
                <div key={n.id} className={`flex items-start gap-3 px-5 py-4 ${!n.read ? 'bg-acc-50/40' : ''}`}>
                  <span className={`h-10 w-10 rounded-full grid place-items-center shrink-0 ${m.c}`}><Icon name={m.i} size={19} /></span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-bold text-zinc-900">{n.title}</div>
                    {n.body && <div className="text-[12.5px] text-zinc-500 mt-0.5">{n.body}</div>}
                  </div>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-acc mt-1.5 shrink-0" />}
                </div>
              );
            })}
          </Card>
        )}
      </div>
    </>
  );
}
