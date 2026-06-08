import { useEffect, useState } from 'react';
import api from '../../api/client.js';
import PageHeader from '../../components/PageHeader.jsx';
import { Card, Badge, Avatar, Icon, Spinner } from '../../components/ui.jsx';

const ROLE_TONE = { player: 'green', owner: 'blue', admin: 'violet' };

export default function AdminUsers() {
  const [users, setUsers] = useState(null);
  const [role, setRole] = useState('');
  useEffect(() => {
    api.get('/admin/users', { params: role ? { role } : {} }).then(({ data }) => setUsers(data));
  }, [role]);

  const toggle = async (u) => {
    const status = u.status === 'Active' ? 'Suspended' : 'Active';
    const { data } = await api.patch(`/admin/users/${u.id}`, { status });
    setUsers((list) => list.map((x) => (x.id === u.id ? data : x)));
  };

  return (
    <>
      <PageHeader title="Users" sub="All registered accounts" />
      <div className="p-7 max-w-5xl mx-auto">
        <div className="flex gap-2 mb-4">
          {['', 'player', 'owner', 'admin'].map((r) => (
            <button key={r || 'all'} onClick={() => setRole(r)} className={`h-9 px-4 rounded-lg text-[13px] font-semibold capitalize ${role === r ? 'bg-zinc-900 text-white' : 'bg-white ring-1 ring-zinc-200 text-zinc-600'}`}>{r || 'All'}</button>
          ))}
        </div>
        {users === null ? <Spinner /> : (
          <Card className="overflow-hidden">
            <table className="w-full text-[13px]">
              <thead><tr className="text-left text-[11px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100">
                <th className="px-5 py-3">User</th><th className="py-3">Role</th><th className="py-3">City</th><th className="py-3">Status</th><th className="py-3 pr-5 text-right">Action</th>
              </tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50">
                    <td className="px-5 py-3.5"><div className="flex items-center gap-2.5"><Avatar name={u.name} hue={u.avatarHue} size={32} /><div><div className="font-semibold text-zinc-800">{u.name}</div><div className="text-[12px] text-zinc-400">{u.email}</div></div></div></td>
                    <td className="py-3.5"><Badge tone={ROLE_TONE[u.role]}>{u.role}</Badge></td>
                    <td className="py-3.5 text-zinc-500">{u.city}</td>
                    <td className="py-3.5"><Badge tone={u.status === 'Active' ? 'green' : u.status === 'Pending' ? 'amber' : 'red'} dot>{u.status}</Badge></td>
                    <td className="py-3.5 pr-5 text-right">
                      {u.role !== 'admin' && (
                        <button onClick={() => toggle(u)} className="h-8 px-3 rounded-lg ring-1 ring-zinc-200 text-zinc-600 text-[12px] font-semibold hover:bg-zinc-50">
                          {u.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </>
  );
}
