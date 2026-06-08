import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client.js';
import { getSocket, joinRoom, leaveRoom } from '../../api/socket.js';
import { useAuth } from '../../context/AuthContext.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { Avatar, Icon, Spinner } from '../../components/ui.jsx';

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const thread = `match:${id}`;
  const [messages, setMessages] = useState(null);
  const [draft, setDraft] = useState('');
  const scroller = useRef(null);

  const scroll = useCallback(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, []);

  useEffect(() => {
    api.get(`/chat/${thread}`).then(({ data }) => setMessages(data));
    joinRoom(thread);
    const sock = getSocket();
    const onMsg = (m) => setMessages((prev) => [...(prev || []), m]);
    sock.on('chat:message', onMsg);
    return () => { sock.off('chat:message', onMsg); leaveRoom(thread); };
  }, [thread]);

  useEffect(scroll, [messages, scroll]);

  const send = (e) => {
    e?.preventDefault();
    if (!draft.trim()) return;
    getSocket().emit('chat:send', { thread, text: draft, matchId: Number(id) });
    setDraft('');
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Match chat" sub="Real-time group chat" onBack={() => navigate(`/app/matches/${id}`)} />
      <div ref={scroller} className="flex-1 overflow-y-auto p-6 space-y-2.5 bg-zinc-50">
        {messages === null ? <Spinner /> : messages.map((m) => {
          const mine = m.sender?.id === user.id || m.senderId === user.id;
          return mine ? (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[70%]">
                <div className="bg-acc text-white rounded-2xl rounded-br-md px-3.5 py-2 text-[14px]">{m.text}</div>
              </div>
            </div>
          ) : (
            <div key={m.id} className="flex gap-2 items-end">
              <Avatar name={m.sender?.name} hue={m.sender?.avatarHue} size={30} />
              <div className="max-w-[70%]">
                <div className="text-[11px] font-semibold text-zinc-500 mb-0.5 ml-1">{m.sender?.name}</div>
                <div className="bg-white ring-1 ring-zinc-200 text-zinc-800 rounded-2xl rounded-bl-md px-3.5 py-2 text-[14px]">{m.text}</div>
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={send} className="shrink-0 p-4 bg-white border-t border-zinc-200 flex items-center gap-2">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Message the squad…"
          className="flex-1 h-11 rounded-xl bg-zinc-100 px-4 outline-none text-[14px]" />
        <button type="submit" className="h-11 w-11 rounded-xl bg-acc text-white grid place-items-center active:scale-95"><Icon name="send" size={19} /></button>
      </form>
    </div>
  );
}
