'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useSocket } from '@/components/providers/SocketProvider';

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
  
  // Hardcoded for demonstration. In reality, you pull this from the session/profile API
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

    // 1. Instantly update our own screen
    setMessages((prev) => [...prev, newMessage]);
    
    // 2. Emit to the server to broadcast to everyone else
    socket.emit('send_message', { ...newMessage, matchId: currentMatchRoom });
    
    setInputMessage('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg">Global Player Lobby</h2>
          <p className="text-xs text-slate-400">
            {isConnected ? '🟢 Connected to Real-Time Server' : '🔴 Disconnected'}
          </p>
        </div>
        <span className="text-sm bg-slate-800 px-3 py-1 rounded-full text-slate-300">
          Public Chat
        </span>
      </div>

      {/* Messages Window */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === myUserId;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && <span className="text-xs text-gray-500 mb-1 ml-1">{msg.senderName}</span>}
                <div 
                  className={`px-4 py-2 max-w-[70%] rounded-2xl text-sm ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-sm' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 mx-1">{msg.timestamp}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200 flex space-x-3">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-4 py-2 text-sm transition-all"
        />
        <button 
          type="submit"
          disabled={!inputMessage.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}