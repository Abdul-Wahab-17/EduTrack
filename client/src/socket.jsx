// src/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080', {
  withCredentials: true,
  transports: ['websocket'],  // force websocket transport
});

export default socket;
