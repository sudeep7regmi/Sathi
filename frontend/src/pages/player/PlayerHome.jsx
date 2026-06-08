import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { Card, Badge, Button, Avatar, Icon, Spinner, Empty, Stat, npr } from '../../components/ui.jsx';

function MatchRow({ m, onOpen }) {
  const accepted = (m.memberships || []).filter((x) => x.status === 'accepted').length;
  const left = Math.max(0, m.capacity - accepted);
  return (
    <Card onClick={onOpen} className="p-4">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-xl bg-acc-50 text-acc-700 grid place-items-center shrink-0"><Icon name="ball" size={22} /></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[15px] text-zinc-900 truncate">{m.title}</h3>
            <Badge tone={left === 0 ? 'red' : 'green'}>{left === 0 ? 'Full' : `${left} left`}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-zinc-500 mt-1">
            <span className="flex items-center gap-1"><Icon name="pin" size={13} /> {m.futsal?.name}</span>
            <span className="flex items-center gap-1"><Icon name="clock" size={13} /> {m.date} · {m.time}</span>
            <Badge tone="slate">{m.format}</Badge>
            <Badge tone="slate">{m.skill}</Badge>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[14px] font-bold text-zinc-900">{npr(m.pricePerHead)}</div>
          <div className="text-[11px] text-zinc-400">per head</div>
        </div>
      </div>
    </Card>
  );
}

export default function PlayerHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState(null);

  useEffect(() => { api.get('/matches').then(({ data }) => setMatches(data)); }, []);

  const live = (matches || []).filter((m) => m.status === 'live');
  const upcoming = (matches || []).filter((m) => m.status !== 'live');

  return (
    <>
      <PageHeader title={`Namaste, ${user.name.split(' ')[0]} 👋`} sub="Here's what's happening on the pitch today"
        actions={<Button icon="plus" onClick={() => navigate('/app/create')}>Create match</Button>} />
      <div className="p-7 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat label="Matches near you" value={(matches || []).length} icon="ball" />
          <Stat label="Live now" value={live.length} tone="red" delta={live.length ? 'Watch' : '—'} icon="bolt" />
          <Stat label="Your rating" value={user.rating || '—'} icon="star" />
          <Stat label="Matches played" value={user.matchesPlayed} icon="activity" />
        </div>

        {live.length > 0 && (
          <>
            <h2 className="font-extrabold text-zinc-900 text-[16px] mt-7 mb-3">Live now</h2>
            <div className="space-y-3">
              {live.map((m) => (
                <Card key={m.id} onClick={() => navigate(`/app/matches/${m.id}`)} className="p-4 flex items-center gap-4">
                  <Badge tone="red" dot>LIVE</Badge>
                  <span className="font-bold text-zinc-900">{m.title}</span>
                  <span className="font-mono text-[18px] font-extrabold tabular-nums">{m.scoreHome}–{m.scoreAway}</span>
                  <span className="text-[12.5px] text-zinc-400">{m.futsal?.name}</span>
                  <div className="flex-1" />
                  <Icon name="chevR" size={18} className="text-zinc-300" />
                </Card>
              ))}
            </div>
          </>
        )}

        <div className="flex items-center justify-between mt-7 mb-3">
          <h2 className="font-extrabold text-zinc-900 text-[16px]">Upcoming matches</h2>
          <button onClick={() => navigate('/app/discover')} className="text-[13px] font-semibold text-acc-700">See all</button>
        </div>
        {matches === null ? <Spinner /> : upcoming.length === 0 ? (
          <Empty title="No matches yet" sub="Create the first match and invite your crew." />
        ) : (
          <div className="space-y-3">
            {upcoming.map((m) => <MatchRow key={m.id} m={m} onOpen={() => navigate(`/app/matches/${m.id}`)} />)}
          </div>
        )}
      </div>
    </>
  );
}
