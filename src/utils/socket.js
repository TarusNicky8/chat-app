// utils/socket.js

import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000');

export default socket;
