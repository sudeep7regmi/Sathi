import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

// Initialize the socket but don't connect automatically yet
export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false, // We will manually connect when the user logs in
  withCredentials: true,
});