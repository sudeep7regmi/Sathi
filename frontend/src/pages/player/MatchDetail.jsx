import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client.js';
import { getSocket, joinRoom, leaveRoom } from '../../api/socket.js';
import { useAuth } from '../../context/AuthContext.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { Card, Badge, Button, Avatar, Icon, Spinner, npr } from '../../components/ui.jsx';

export default function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [match, setMatch] = useState(null);
  const [requests, setRequests] = useState([]);
  const [live, setLive] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    api.get(`/matches/${id}`).then(({ data }) => {
      setMatch(data);
      setLive({ home: data.scoreHome, away: data.scoreAway, status: data.status });
      if (data.host?.id === user.id) {
        api.get(`/matches/${id}/requests`).then((r) => setRequests(r.data));
      }
    });
  }, [id, user.id]);

  useEffect(() => { load(); }, [load]);

  // Live score subscription
  useEffect(() => {
    const room = `match:${id}`;
    joinRoom(room);
    const sock = getSocket();
    const onScore = (p) => setLive({ home: p.scoreHome, away: p.scoreAway, status: p.status });
    sock.on('score:update', onScore);
    sock.on('score:event', (p) => setLive((l) => ({ ...l, home: p.scoreHome, away: p.scoreAway })));
    return () => { sock.off('score:update', onScore); leaveRoom(room); };
  }, [id]);

  if (!match) return <Spinner />;

  const accepted = (match.memberships || []).filter((m) => m.status === 'accepted');
  const isHost = match.host?.id === user.id;
  const myMembership = (match.memberships || []).find((m) => m.user?.id === user.id);
  const left = Math.max(0, match.capacity - accepted.length);

  const join = async () => {
    setBusy(true); setMsg('');
    try { const { data } = await api.post(`/matches/${id}/join`); setMsg(data.status === 'pending' ? 'Request sent — waiting for host approval.' : 'You joined the match!'); load(); }
    catch (e) { setMsg(e.response?.data?.message || 'Could not join'); }
    finally { setBusy(false); }
  };
  const decide = async (userId, action) => { await api.patch(`/matches/${id}/requests/${userId}`, { action }); load(); };

  return (
    <>
      <PageHeader title={match.title} sub={`${match.futsal?.name} · ${match.futsal?.area}`} onBack={() => navigate(-1)}
        actions={match.status === 'live'
          ? <Badge tone="red" dot>LIVE</Badge>
          : <Badge tone={left === 0 ? 'red' : 'green'}>{left === 0 ? 'Full' : `${left} spots left`}</Badge>} />

      <div className="p-7 max-w-4xl mx-auto grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* live scoreboard */}
          {match.status === 'live' && live && (
            <Card className="p-5 bg-zinc-900 text-white">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center"><div className="text-[13px] text-white/60">Home</div><div className="font-mono text-[44px] font-black tabular-nums">{live.home}</div></div>
                <div className="text-white/30 font-mono text-[28px]">:</div>
                <div className="text-center"><div className="text-[13px] text-white/60">Away</div><div className="font-mono text-[44px] font-black tabular-nums">{live.away}</div></div>
              </div>
              {isHost && (
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-center">
                  <Button size="sm" variant="dark" icon="whistle" onClick={() => navigate(`/app/matches/${id}/score`)}>Open scorer</Button>
                </div>
              )}
            </Card>
          )}

          {/* meta */}
          <Card className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[['pin', 'Venue', match.futsal?.name], ['clock', 'Kickoff', `${match.date} ${match.time}`], ['ball', 'Format', match.format], ['money', 'Per head', npr(match.pricePerHead)]].map(([i, l, v]) => (
                <div key={l}><div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400"><Icon name={i} size={13} /> {l}</div><div className="text-[14px] font-bold text-zinc-900 mt-1">{v}</div></div>
              ))}
            </div>
          </Card>

          {/* squad */}
          <Card className="p-5">
            <h3 className="font-bold text-zinc-900 mb-3">Squad <span className="text-zinc-400 font-semibold">({accepted.length}/{match.capacity})</span></h3>
            <div className="flex flex-wrap gap-4">
              {accepted.map((m) => (
                <div key={m.id} className="flex flex-col items-center gap-1.5 w-16">
                  <Avatar name={m.user?.name} hue={m.user?.avatarHue} size={44} />
                  <span className="text-[11px] text-zinc-600 font-medium truncate w-full text-center">{m.user?.name?.split(' ')[0]}</span>
                </div>
              ))}
              {left > 0 && <div className="flex flex-col items-center gap-1.5 w-16"><div className="h-11 w-11 rounded-full border-2 border-dashed border-zinc-300 grid place-items-center text-zinc-300"><Icon name="plus" size={18} /></div><span className="text-[11px] text-zinc-400">{left} open</span></div>}
            </div>
          </Card>

          {/* host: pending requests */}
          {isHost && requests.length > 0 && (
            <Card className="p-5">
              <h3 className="font-bold text-zinc-900 mb-3">Join requests <Badge tone="green">{requests.length}</Badge></h3>
              <div className="space-y-2.5">
                {requests.map((r) => (
                  <div key={r.id} className="flex items-center gap-3">
                    <Avatar name={r.user?.name} hue={r.user?.avatarHue} size={40} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-zinc-800 text-[14px]">{r.user?.name}</div>
                      <div className="text-[12px] text-zinc-400">{r.user?.position} · {r.user?.skill}</div>
                    </div>
                    <Button size="sm" variant="secondary" icon="x" onClick={() => decide(r.user.id, 'decline')}>Decline</Button>
                    <Button size="sm" icon="check" onClick={() => decide(r.user.id, 'accept')}>Accept</Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* sidebar: host + join */}
        <div className="space-y-5">
          <Card className="p-5">
            <div className="text-[11px] font-semibold text-zinc-400">Organised by</div>
            <div className="flex items-center gap-3 mt-2">
              <Avatar name={match.host?.name} hue={match.host?.avatarHue} size={44} />
              <div><div className="font-bold text-zinc-900">{match.host?.name}</div><div className="text-[12px] text-zinc-400 flex items-center gap-1"><Icon name="star" size={12} className="text-amber-400" /> {match.host?.rating}</div></div>
            </div>
          </Card>

          {!isHost && (
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3"><span className="text-[13px] text-zinc-500">Price per head</span><span className="text-[18px] font-extrabold text-zinc-900">{npr(match.pricePerHead)}</span></div>
              {myMembership ? (
                <div className={`h-11 rounded-xl grid place-items-center text-[13px] font-bold ${myMembership.status === 'accepted' ? 'bg-acc-50 text-acc-700' : 'bg-amber-50 text-amber-700'}`}>
                  {myMembership.status === 'accepted' ? '✓ You are in the squad' : 'Request pending…'}
                </div>
              ) : (
                <Button full size="lg" icon="check" disabled={busy || left === 0} onClick={join}>{left === 0 ? 'Match full' : 'Request to join'}</Button>
              )}
              {msg && <div className="text-[12.5px] text-zinc-500 mt-2 text-center">{msg}</div>}
            </Card>
          )}

          <Button full variant="secondary" icon="message" onClick={() => navigate(`/app/matches/${id}/chat`)}>Open match chat</Button>
        </div>
      </div>
    </>
  );
}
