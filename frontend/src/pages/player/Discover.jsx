import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client.js';
import PageHeader from '../../components/PageHeader.jsx';
import { Card, Badge, Icon, Avatar, Spinner, Empty, npr } from '../../components/ui.jsx';

export default function Discover() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState(null);
  const [skill, setSkill] = useState('');
  const [format, setFormat] = useState('');

  useEffect(() => {
    const params = {};
    if (skill) params.skill = skill;
    if (format) params.format = format;
    api.get('/matches', { params }).then(({ data }) => setMatches(data));
  }, [skill, format]);

  const chip = (val, cur, set, label) => (
    <button onClick={() => set(cur === val ? '' : val)}
      className={`h-9 px-4 rounded-lg text-[13px] font-semibold transition ${cur === val ? 'bg-acc text-white' : 'bg-white ring-1 ring-zinc-200 text-zinc-600'}`}>{label}</button>
  );

  return (
    <>
      <PageHeader title="Discover matches" sub="Browse open games across Pokhara" />
      <div className="p-7 max-w-5xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-5">
          {['Beginner', 'Intermediate', 'Advanced'].map((s) => chip(s, skill, setSkill, s))}
          <span className="w-px bg-zinc-200 mx-1" />
          {['5v5', '6v6', '7v7'].map((f) => chip(f, format, setFormat, f))}
        </div>

        {matches === null ? <Spinner /> : matches.length === 0 ? (
          <Empty title="No matches match your filters" sub="Try clearing a filter or create your own match." />
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {matches.map((m) => {
              const accepted = (m.memberships || []).filter((x) => x.status === 'accepted').length;
              const left = Math.max(0, m.capacity - accepted);
              return (
                <Card key={m.id} onClick={() => navigate(`/app/matches/${m.id}`)} className="p-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[15px] text-zinc-900 truncate flex-1">{m.title}</h3>
                    {m.status === 'live' ? <Badge tone="red" dot>LIVE</Badge> : <Badge tone={left === 0 ? 'red' : 'green'}>{left === 0 ? 'Full' : `${left} left`}</Badge>}
                  </div>
                  <div className="flex items-center gap-1.5 text-[12.5px] text-zinc-500 mt-1.5"><Icon name="pin" size={13} /> {m.futsal?.name} · {m.futsal?.area}</div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100">
                    <div className="flex items-center gap-2 text-[12.5px] text-zinc-500">
                      <Icon name="clock" size={14} /> {m.date} · {m.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone="slate">{m.format}</Badge>
                      <span className="text-[14px] font-bold text-zinc-900">{npr(m.pricePerHead)}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
