import { io } from 'socket.io-client';

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io('/', {
      autoConnect: true,
      auth: { token: localStorage.getItem('sathi.token') || '' },
    });
  }
  return socket;
}

export function joinRoom(room) { getSocket().emit('room:join', room); }
export function leaveRoom(room) { getSocket().emit('room:leave', room); }
