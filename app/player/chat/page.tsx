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

const DISPLAY = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 900,
};

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

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-[#12161A] rounded-2xl border border-white/5 overflow-hidden shadow-2xl relative">
      
      {/* Upper Matrix Telemetry Header section */}
      <div className="bg-[#0A1F1A]/60 border-b border-white/5 px-6 py-4 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center">
            <Radio className="w-4 h-4 text-[#C8F55A] animate-pulse" />
          </div>
          <div>
            <h2 className="font-bold text-white uppercase tracking-wide text-md" style={DISPLAY}>Global Player Lobby</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isConnected ? (
                <>
                  <Wifi className="w-3 h-3 text-[#C8F55A]" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C8F55A]/80" style={DISPLAY}>
                    Real-Time Node Connected
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-red-400" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-red-400/80" style={DISPLAY}>
                    Comms Offline
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <span className="text-[10px] bg-white/5 border border-white/5 text-white/50 px-3 py-1.5 rounded-lg uppercase tracking-widest font-bold" style={DISPLAY}>
          Public Chat Feed
        </span>
      </div>

      {/* Main Messages Communication Viewport */}
      <div className="flex-1 p-6 overflow-y-auto bg-[#0B0C10]/40 space-y-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/30 text-xs uppercase tracking-wider font-bold gap-2" style={DISPLAY}>
            <MessageSquare className="w-5 h-5 opacity-40 text-[#C8F55A]" />
            <span>No incoming transmissions. Initialize chat...</span>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === myUserId;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}>
                {!isMe && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 mb-1 ml-1" style={DISPLAY}>
                    {msg.senderName}
                  </span>
                )}
                <div 
                  className={`px-4 py-2.5 max-w-[75%] rounded-xl text-sm border font-medium leading-relaxed shadow-lg transition-all ${
                    isMe 
                      ? 'bg-[#C8F55A] border-[#C8F55A] text-black rounded-tr-none font-semibold' 
                      : 'bg-[#12161A] border-white/5 text-white/90 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-white/30 mt-1 mx-1" style={DISPLAY}>
                  {msg.timestamp}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Input Action Terminal Controller Footer */}
      <form onSubmit={sendMessage} className="p-4 bg-[#12161A] border-t border-white/5 flex items-center space-x-3 relative z-10">
        <div className="flex-1 relative flex items-center">
          <Terminal className="w-4 h-4 text-white/20 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Broadcast a command message..."
            className="w-full bg-[#0B0C10] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C8F55A]/40 transition-all"
          />
        </div>
        
        <button 
          type="submit"
          disabled={!inputMessage.trim()}
          className="bg-[#C8F55A] hover:bg-[#bada52] disabled:bg-white/5 disabled:text-white/20 text-black px-5 py-3 h-full rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md shadow-[#C8F55A]/5 flex items-center gap-2 cursor-pointer shrink-0 disabled:cursor-not-allowed"
          style={DISPLAY}
        >
          <span>Send</span>
          <SendHorizontal className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}