import { useEffect, useState } from 'react';
import api from '../../api/client.js';
import PageHeader from '../../components/PageHeader.jsx';
import { Card, Badge, Button, Avatar, Icon, Spinner, Empty, npr } from '../../components/ui.jsx';

export default function AdminVerifications() {
  const [items, setItems] = useState(null);
  const load = () => api.get('/admin/verifications').then(({ data }) => setItems(data));
  useEffect(() => { load(); }, []);

  const decide = async (id, action) => { await api.patch(`/admin/verifications/${id}`, { action }); load(); };

  return (
    <>
      <PageHeader title="Verifications" sub="Futsal venue approval queue"
        actions={items && <Badge tone="amber" dot>{items.length} pending</Badge>} />
      <div className="p-7 max-w-4xl mx-auto">
        {items === null ? <Spinner /> : items.length === 0 ? (
          <Empty icon="shield" title="Nothing to review" sub="All submitted venues have been processed." />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((f) => (
              <Card key={f.id} className="p-5">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 grid place-items-center"><Icon name="building" size={24} /></div>
                  <div className="flex-1 min-w-0"><div className="font-bold text-zinc-900">{f.name}</div><div className="text-[12.5px] text-zinc-500 flex items-center gap-1"><Icon name="pin" size={12} /> {f.area}</div></div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="rounded-lg bg-zinc-50 ring-1 ring-zinc-100 p-3"><div className="text-[11px] font-semibold text-zinc-400">Owner</div><div className="text-[13px] font-bold text-zinc-800 mt-0.5 truncate">{f.owner?.name}</div></div>
                  <div className="rounded-lg bg-zinc-50 ring-1 ring-zinc-100 p-3"><div className="text-[11px] font-semibold text-zinc-400">Rate</div><div className="text-[13px] font-bold text-zinc-800 mt-0.5">{npr(f.pricePerHour)}/hr</div></div>
                </div>
                <div className="flex gap-2.5 mt-4">
                  <Button variant="danger" onClick={() => decide(f.id, 'reject')}>Reject</Button>
                  <Button full icon="check" onClick={() => decide(f.id, 'approve')}>Verify &amp; publish</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
