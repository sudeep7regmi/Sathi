import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client.js';
import PageHeader from '../../components/PageHeader.jsx';
import { Card, Button, Badge, Icon, Spinner } from '../../components/ui.jsx';

export default function Scorer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);

  const load = useCallback(() => api.get(`/matches/${id}`).then(({ data }) => setMatch(data)), [id]);
  useEffect(() => { load(); }, [load]);

  if (!match) return <Spinner />;

  const patch = async (body) => { const { data } = await api.patch(`/matches/${id}/score`, body); setMatch((m) => ({ ...m, ...data })); };
  const goal = async (team) => {
    await api.post(`/matches/${id}/events`, { team, type: 'goal', minute: Math.floor((match.clock || 0) / 60) });
    load();
  };
  const setStatus = (status) => patch({ status });

  const Side = ({ label, score, team }) => (
    <Card className="p-6 flex flex-col items-center flex-1">
      <div className="text-[13px] font-semibold text-zinc-500">{label}</div>
      <div className="font-mono text-[56px] font-black tabular-nums text-zinc-900 my-2">{score}</div>
      <div className="flex gap-2 w-full">
        <button onClick={() => patch({ [team === 'home' ? 'scoreHome' : 'scoreAway']: Math.max(0, score - 1) })} className="flex-1 h-11 rounded-xl bg-zinc-100 text-zinc-600 grid place-items-center"><Icon name="x" size={18} /></button>
        <button onClick={() => goal(team)} className="flex-[2] h-11 rounded-xl bg-acc text-white grid place-items-center font-semibold text-[13px] gap-1.5 flex items-center justify-center"><Icon name="plus" size={18} stroke={2.4} /> Goal</button>
      </div>
    </Card>
  );

  return (
    <>
      <PageHeader title="Scorer mode" sub={match.title} onBack={() => navigate(`/app/matches/${id}`)}
        actions={<Badge tone={match.status === 'live' ? 'red' : 'slate'} dot>{match.status}</Badge>} />
      <div className="p-7 max-w-2xl mx-auto">
        <Card className="p-4 mb-5 flex items-center justify-between bg-zinc-900 text-white">
          <div><div className="text-[11px] text-white/50 uppercase font-semibold">Status</div><div className="font-bold text-[16px] capitalize">{match.status}</div></div>
          <div className="flex gap-2">
            {match.status !== 'live' && <Button size="sm" variant="dark" onClick={() => setStatus('live')}>Start (go live)</Button>}
            {match.status === 'live' && <Button size="sm" variant="dark" onClick={() => setStatus('completed')}>End match</Button>}
          </div>
        </Card>
        <div className="flex gap-4">
          <Side label="Home" score={match.scoreHome} team="home" />
          <Side label="Away" score={match.scoreAway} team="away" />
        </div>
        <div className="mt-5 rounded-xl bg-acc-50 ring-1 ring-acc/15 p-3 flex items-center gap-2.5">
          <Icon name="bolt" size={18} className="text-acc-700" />
          <span className="text-[12.5px] text-acc-700 font-medium">Every change broadcasts live to everyone watching this match.</span>
        </div>

        {match.events?.length > 0 && (
          <Card className="mt-5 p-5">
            <h3 className="font-bold text-zinc-900 mb-3">Match events</h3>
            <div className="space-y-2">
              {match.events.map((e, i) => (
                <div key={i} className="flex items-center gap-3 text-[13px]">
                  <span className="font-mono text-zinc-400 w-8">{e.minute}'</span>
                  <span className={`h-7 w-7 rounded-full grid place-items-center ${e.type === 'goal' ? 'bg-acc-50 text-acc-700' : 'bg-amber-50 text-amber-600'}`}><Icon name={e.type === 'goal' ? 'ball' : 'flag'} size={14} /></span>
                  <span className="font-semibold text-zinc-700 capitalize">{e.type}</span>
                  <span className="text-zinc-400">· {e.team}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
