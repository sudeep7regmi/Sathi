'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useSocket } from '@/components/providers/SocketProvider';
import { 
  Radio, 
  SendHorizontal, 
  Wifi, 
  WifiOff, 
  MessageSquare,
  Terminal
} from 'lucide-react';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export default function GlobalChatPage() {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  
  // Hardcoded placeholders matching configuration architecture
  const myUserId = 'user_123'; 
  const myName = 'Manish Bhujel';
  const currentMatchRoom = 'global_lobby';

  useEffect(() => {
    if (!socket) return;

    // Join the specific match room or global lobby
    socket.emit('join_match_room', currentMatchRoom);

    // Listen for incoming messages
    const handleReceiveMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on('receive_message', handleReceiveMessage);

    // Cleanup listener on unmount
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket]);

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: myUserId,
      senderName: myName,
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // 1. Instantly update local screen array
    setMessages((prev) => [...prev, newMessage]);
    
    // 2. Emit payload over live wire
    socket.emit('send_message', { ...newMessage, matchId: currentMatchRoom });
    
    setInputMessage('');
  };

  const inputClass =
    "w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-sm";

  return (
    <div 
      className="flex flex-col h-[calc(100vh-140px)] rounded-2xl border shadow-sm overflow-hidden relative"
      style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
    >
      
      {/* Upper Matrix Telemetry Header section */}
      <div className="bg-emerald-50/60 border-b border-emerald-100/60 px-6 py-4 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white border border-emerald-200 rounded-xl flex items-center justify-center shadow-xs">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 uppercase tracking-tight text-base">Global Player Lobby</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isConnected ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-600" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">
                    Real-Time Node Connected
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-red-500" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-red-600">
                    Comms Offline
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg uppercase tracking-wider font-bold shadow-xs">
          Public Chat Feed
        </span>
      </div>

      {/* Main Messages Communication Viewport */}
      <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs uppercase tracking-wider font-bold gap-2">
            <MessageSquare className="w-5 h-5 opacity-50 text-emerald-600" />
            <span>No incoming transmissions. Initialize chat...</span>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === myUserId;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}>
                {!isMe && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1 ml-1">
                    {msg.senderName}
                  </span>
                )}
                <div 
                  className={`px-4 py-2.5 max-w-[75%] rounded-2xl text-sm border font-medium leading-relaxed shadow-xs transition-all ${
                    isMe 
                      ? 'bg-emerald-600 border-emerald-600 text-white rounded-tr-none font-semibold' 
                      : 'bg-white border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 mt-1 mx-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Input Action Terminal Controller Footer */}
      <form onSubmit={sendMessage} className="p-4 bg-white border-t border-slate-200 flex items-center space-x-3 relative z-10 shadow-xs">
        <div className="flex-1 relative flex items-center">
          <Terminal className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Broadcast a command message..."
            className={inputClass}
          />
        </div>
        
        <button 
          type="submit"
          disabled={!inputMessage.trim()}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white px-5 py-3 h-full rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0 disabled:cursor-not-allowed"
        >
          <span>Send</span>
          <SendHorizontal className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}